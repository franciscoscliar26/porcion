/* Porción web: instalar en el inicio, guardado persistente, cuenta (si hay nube) y modo sin conexión. */
(function(){
  const C = window.PORCION_CONFIG || {}, CL = window.PORCION_CLOUD;
  const $ = s => document.querySelector(s);
  const ls = { get(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }, set(k,v){ try{ localStorage.setItem(k,v); }catch(e){} } };
  const standalone = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform==="MacIntel" && navigator.maxTouchPoints>1);
  const toastW = m => { const t=document.createElement("div"); t.className="toast"; t.textContent=m; document.body.appendChild(t); setTimeout(()=>t.remove(), 2600); };

  // que el navegador no borre los datos por falta de espacio
  try{ navigator.storage && navigator.storage.persist && navigator.storage.persist(); }catch(e){}
  // sin conexión
  if ("serviceWorker" in navigator) window.addEventListener("load", ()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));

  // ---------- instalar en la pantalla de inicio ----------
  let deferred = null;
  window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); deferred = e; showInstall(); });
  function showInstall(){
    if (standalone || $("#webInstall")) return; const last=+ls.get("porcion.web.inst")||0; if (Date.now()-last < 3*864e5) return;
    if (!isIOS && !deferred) return;
    const d=document.createElement("div"); d.id="webInstall"; d.className="webbar";
    d.innerHTML = `<div><b>Instalá Porción en tu celular</b><span>${isIOS?'Tocá <b>Compartir</b> <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px"><path d="M12 3v12M7 8l5-5 5 5M5 13v7h14v-7"/></svg> y después <b>Agregar a inicio</b>. Se abre como una app y tus datos quedan guardados.':'Queda como una app en tu pantalla de inicio y funciona sin internet.'}</span></div>${isIOS?'':'<button class="btn primary" id="webInstBtn">Instalar</button>'}<button class="icon-btn" id="webInstX" aria-label="Cerrar">✕</button>`;
    document.body.appendChild(d);
    $("#webInstX").onclick = ()=>{ ls.set("porcion.web.inst", String(Date.now())); d.remove(); };
    const b=$("#webInstBtn"); if (b) b.onclick = async ()=>{ if(!deferred) return; deferred.prompt(); try{ await deferred.userChoice; }catch(e){} deferred=null; d.remove(); };
  }
  setTimeout(showInstall, 4000);

  // ---------- cuenta (solo si está configurada la nube) ----------
  if (!CL || !CL.enabled) return;
  function card(){
    const s = CL.session;
    return s ? `<div class="card stack" id="webAcct"><div class="row between"><h3 style="font-size:17px">Tu cuenta</h3><span class="small muted">Guardado en la nube</span></div><p class="small muted" style="margin:0">${(s.user.email||"").replace(/[<>&]/g,"")}: tus comidas, tu plan y tus entrenamientos se guardan solos y los ves desde cualquier celular o compu.</p><button class="btn ghost block" id="webOut">Cerrar sesión</button></div>`
             : `<div class="card stack" id="webAcct"><h3 style="font-size:17px">Guardá todo en la nube</h3><p class="small muted" style="margin:0">Creá tu cuenta gratis y lo que anotás queda guardado aunque cambies de celular.</p><button class="btn primary block" id="webIn">Crear cuenta o entrar</button></div>`;
  }
  function mountCard(){ const v=$("#v-perfil"); if(!v) return; const old=$("#webAcct"); if(old) old.remove(); const h=v.querySelector("header"); h.insertAdjacentHTML("afterend", card());
    const i=$("#webIn"); if(i) i.onclick=openLogin; const o=$("#webOut"); if(o) o.onclick=async()=>{ const sb=await CL.cloud(); await sb.auth.signOut(); location.reload(); }; }
  function openLogin(){
    const w=document.createElement("div"); w.className="scrim"; w.id="webLogin";
    w.innerHTML=`<div class="sheet" role="dialog" aria-modal="true" aria-label="Tu cuenta"><div class="grab"></div><div class="sheet-h"><h2 id="wlT">Creá tu cuenta</h2><button class="icon-btn" id="wlX" aria-label="Cerrar">✕</button></div>
      <div class="stack"><label class="field"><span>Mail</span><input class="input" id="wlE" type="email" autocomplete="email" inputmode="email"></label>
      <label class="field"><span>Contraseña (mínimo 6 caracteres)</span><input class="input" id="wlP" type="password" autocomplete="new-password"></label>
      <button class="btn primary block" id="wlGo">Crear cuenta</button><button class="linkbtn" id="wlSw">Ya tengo cuenta: entrar</button><p class="small" id="wlMsg" style="margin:0"></p></div></div>`;
    document.body.appendChild(w); let mode="up";
    const close=()=>w.remove(); $("#wlX").onclick=close; w.addEventListener("click",e=>{ if(e.target===w) close(); });
    $("#wlSw").onclick=()=>{ mode=mode==="up"?"in":"up"; $("#wlT").textContent=mode==="up"?"Creá tu cuenta":"Entrá a tu cuenta"; $("#wlGo").textContent=mode==="up"?"Crear cuenta":"Entrar"; $("#wlSw").textContent=mode==="up"?"Ya tengo cuenta: entrar":"No tengo cuenta: crearla"; $("#wlP").autocomplete=mode==="up"?"new-password":"current-password"; };
    $("#wlGo").onclick=async()=>{ const email=$("#wlE").value.trim(), pass=$("#wlP").value, msg=$("#wlMsg"); msg.style.color=""; msg.textContent="Un segundo…";
      try{ const sb=await CL.cloud(); if(!sb) throw new Error("Sin conexión");
        const r = mode==="up" ? await sb.auth.signUp({email, password:pass}) : await sb.auth.signInWithPassword({email, password:pass});
        if (r.error) throw r.error;
        if (!r.data.session){ msg.textContent="Te mandamos un mail para confirmar la cuenta. Confirmalo y después entrá acá."; mode="in"; $("#wlSw").click(); $("#wlSw").click(); return; }
        msg.textContent="Listo, subiendo tus datos…"; await migrateLocal(sb, r.data.session.user.id); location.reload();
      }catch(e){ msg.style.color="var(--bad)"; const t=String(e&&e.message||e); msg.textContent=/Invalid login/i.test(t)?"Mail o contraseña incorrectos.":/already registered/i.test(t)?"Ese mail ya tiene cuenta: tocá «Ya tengo cuenta: entrar».":/least 6/i.test(t)?"La contraseña tiene que tener al menos 6 caracteres.":"No se pudo: "+t; } };
  }
  // lo que ya tenías en este celular sube a tu cuenta la primera vez (la dieta la sube sola la app; acá el gimnasio)
  async function migrateLocal(sb, uid){
    const rows=[]; const base=`data/users/${uid}/fierro/`;
    ["workouts","routines","body"].forEach(col=>{ let m={}; try{ m=JSON.parse(ls.get("fierro:col:"+col)||"{}")||{}; }catch(e){} Object.entries(m).forEach(([id,v])=>rows.push({path:base+col+"/"+id, owner:uid, data:v})); });
    try{ for(let i=0;i<localStorage.length;i++){ const k=localStorage.key(i); if(k&&k.startsWith("fierro:doc:")){ const v=JSON.parse(localStorage.getItem(k)); if(v) rows.push({path:base+k.slice(11), owner:uid, data:v}); } } }catch(e){}
    if (rows.length){ const { error } = await sb.from("kv").upsert(rows, { ignoreDuplicates:true }); if (error) console.warn("migrate", error); }
  }
  CL.cloud().then(()=>{ mountCard(); const mo=new MutationObserver(()=>{ if(!$("#webAcct")) mountCard(); }); const v=$("#v-perfil"); if(v) mo.observe(v,{childList:true}); });
})();
