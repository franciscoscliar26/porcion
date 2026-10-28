/* Porción web: hace que la app funcione fuera de Claude.
   La app pide sus herramientas con window.claude.use(nombre). Dentro de Claude las da Claude;
   acá las damos nosotros: "downloads" siempre, "db"/"user" si hay cuenta (Supabase) y "sample" si hay IA configurada. */
(function(){
  if (window.claude && window.claude.use) return;           // dentro de Claude: no tocar nada
  const C = window.PORCION_CONFIG || {};
  const hasCloud = !!(C.supabaseUrl && C.supabaseKey);
  let sb = null, sbReady = null, session = null;

  function loadScript(src){ return new Promise((res, rej)=>{ const s=document.createElement("script"); s.src=src; s.onload=res; s.onerror=rej; document.head.appendChild(s); }); }
  function cloud(){
    if (!hasCloud) return Promise.resolve(null);
    if (!sbReady) sbReady = loadScript("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js")
      .then(async ()=>{ sb = window.supabase.createClient(C.supabaseUrl, C.supabaseKey, {auth:{persistSession:true, autoRefreshToken:true}});
        const { data } = await sb.auth.getSession(); session = data.session; return sb; })
      .catch(e=>{ console.warn("supabase", e); return null; });
    return sbReady;
  }
  window.PORCION_CLOUD = { cloud, get session(){ return session; }, get enabled(){ return hasCloud; } };

  // ---------- base de datos con la misma forma que la de Claude ----------
  const esc = s => s.replace(/[\\%_]/g, m=>"\\"+m);
  const listeners = new Map();   // colección → [fn]
  function notify(path){ const col=path.split("/").slice(0,-1).join("/"); (listeners.get(col)||[]).forEach(fn=>{ try{ fn(); }catch(e){} }); }
  function err(code, msg){ const e=new Error(msg||code); e.code=code; return e; }
  function snapDoc(path, row){ return { id: path.split("/").pop(), exists: !!row, data: ()=> row ? JSON.parse(JSON.stringify(row.data)) : null }; }
  async function getCollection(col){
    const { data, error } = await sb.from("kv").select("path,data").like("path", esc(col)+"/%");
    if (error) throw err(error.code==="42501"?"invalid_argument":"unavailable", error.message);
    const depth = col.split("/").length + 1;
    return { docs: (data||[]).filter(r=>r.path.split("/").length===depth).map(r=>snapDoc(r.path, r)) };
  }
  function docRef(path){ return {
    async get(){ const { data, error } = await sb.from("kv").select("path,data").eq("path", path).maybeSingle(); if(error) throw err("unavailable", error.message); return snapDoc(path, data); },
    async set(value){ const uid = session && session.user.id; if(!uid) throw err("invalid_argument","sin sesión");
      const { error } = await sb.from("kv").upsert({ path, owner: uid, data: JSON.parse(JSON.stringify(value)), updated_at: new Date().toISOString() });
      if (error) throw err(/row-level|42501|permission/i.test(error.message+error.code)?"invalid_argument":"unavailable", error.message); notify(path); },
    async delete(){ const { error } = await sb.from("kv").delete().eq("path", path); if(error) throw err("unavailable", error.message); notify(path); }
  }; }
  function colRef(col){ return {
    get: ()=>getCollection(col),
    doc: id => docRef(col+"/"+id),
    onSnapshot(cb, onErr){ let alive=true; const run=()=>getCollection(col).then(s=>{ if(alive) cb(s); }).catch(e=>{ if(alive&&onErr) onErr(e); });
      const arr=listeners.get(col)||[]; arr.push(run); listeners.set(col, arr); run();
      return ()=>{ alive=false; listeners.set(col, (listeners.get(col)||[]).filter(f=>f!==run)); }; }
  }; }
  const dbApi = { collection: colRef, doc: docRef };

  // ---------- descargas ----------
  const downloads = { async save({filename, data}){ const a=document.createElement("a"); a.href=URL.createObjectURL(data instanceof Blob?data:new Blob([data])); a.download=filename||"archivo"; document.body.appendChild(a); a.click(); setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); }, 4000); } };

  // ---------- IA (Claude por medio de nuestra función) ----------
  function blobToB64(b){ return new Promise((res,rej)=>{ const r=new FileReader(); r.onload=()=>res(String(r.result).split(",")[1]); r.onerror=rej; r.readAsDataURL(b); }); }
  function makeSample(){
    async function call(input, opts={}, json=false){
      const s = hasCloud ? (await cloud(), session) : null;
      const imgs = opts.images ? await Promise.all(opts.images.map(async b=>({ type: b.type||"image/jpeg", data: await blobToB64(b) }))) : [];
      const r = await fetch(C.aiUrl, { method:"POST", signal: opts.signal, headers: { "content-type":"application/json", ...(s?{authorization:"Bearer "+s.access_token}:{}), ...(C.supabaseKey?{apikey:C.supabaseKey}:{}) },
        body: JSON.stringify({ input, images: imgs, json, tier: opts.modelTier||"default" }) }).catch(e=>{ throw err(e&&e.name==="AbortError"?"cancelled":"unavailable"); });
      if (r.status===401) throw err("session_expired"); if (r.status===429) throw err("rate_limited"); if (!r.ok) throw err("unavailable");
      const out = await r.json(); const text = out.text||"";
      if (opts.onText) try{ opts.onText({ text, delta: text }); }catch(e){}
      if (!json) return { text, truncated: !!out.truncated };
      const m = text.match(/[\[{][\s\S]*[\]}]/); try{ return JSON.parse(m?m[0]:text); }catch(e){ throw err("invalid_json"); }
    }
    const sample = (input, opts) => call(input, opts, false);
    sample.json = (input, opts) => call(input, opts, true);
    sample.limits = async () => ({ images: { maxCount: 3 } });
    return sample;
  }

  window.claude = { use: async (name) => {
    if (name === "downloads") return downloads;
    if (name === "sample") { if (!C.aiUrl) return null; if (hasCloud){ await cloud(); if(!session) return null; } return makeSample(); }
    if (name === "db" || name === "user") { const c = await cloud(); if (!c || !session) return null;
      return name === "db" ? dbApi : { id: async ()=>session.user.id, me: async ()=>({ id: session.user.id, name: session.user.email }), isOwner: ()=>false, canEdit: ()=>false, can: ()=>true }; }
    return null;
  } };
})();
