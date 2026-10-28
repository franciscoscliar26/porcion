// Porción: función "ai". Recibe el pedido de la app, llama a Claude con TU clave (guardada como secreto)
// y devuelve el texto. Solo atiende a usuarios con cuenta, con un tope diario por persona.
// Secretos a cargar en Supabase → Edge Functions → Secrets: ANTHROPIC_API_KEY (y opcional LIMITE_DIARIO, por defecto 40).
import { createClient } from "jsr:@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const MODELS: Record<string, string> = { quick: "claude-haiku-5-5", default: "claude-sonnet-5-5", complex: "claude-sonnet-5-5" };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...CORS, "content-type": "application/json" } });
  try {
    const url = Deno.env.get("SUPABASE_URL")!, service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(url, service);
    const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
    const { data: u } = await admin.auth.getUser(token);
    if (!u?.user) return json({ error: "login" }, 401);

    // tope diario
    const limite = Number(Deno.env.get("LIMITE_DIARIO") || 40);
    const hoy = new Date().toISOString().slice(0, 10);
    const { data: uso } = await admin.from("ai_uso").select("n").eq("owner", u.user.id).eq("dia", hoy).maybeSingle();
    if ((uso?.n || 0) >= limite) return json({ error: "limite" }, 429);
    await admin.from("ai_uso").upsert({ owner: u.user.id, dia: hoy, n: (uso?.n || 0) + 1 });

    const body = await req.json();
    const input = body.input;
    const msgs = Array.isArray(input) ? input : [{ role: "user", content: String(input || "") }];
    const imgs = (Array.isArray(body.images) ? body.images : []).slice(0, 3);
    if (imgs.length) {
      const last = msgs[msgs.length - 1];
      last.content = [
        ...imgs.map((i: { type: string; data: string }) => ({ type: "image", source: { type: "base64", media_type: i.type || "image/jpeg", data: i.data } })),
        { type: "text", text: String(last.content) },
      ];
    }
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": Deno.env.get("ANTHROPIC_API_KEY")!, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: MODELS[body.tier] || MODELS.default, max_tokens: 4000, messages: msgs }),
    });
    if (r.status === 429) return json({ error: "ocupado" }, 429);
    const out = await r.json();
    if (!r.ok) return json({ error: out?.error?.message || "error" }, 502);
    const text = (out.content || []).filter((c: { type: string }) => c.type === "text").map((c: { text: string }) => c.text).join("");
    return json({ text, truncated: out.stop_reason === "max_tokens" });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
