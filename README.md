# Porción

App de calorías, macros y gimnasio (en español rioplatense).

- **App web:** https://franciscoscliar26.github.io/porcion/
- `docs/` — la app publicada (GitHub Pages sirve esta carpeta).
- `app/porcion/` — la app (dieta) y la base de alimentos (`foods.txt`, `audit.json`).
- `app/fierro/` — el módulo de gimnasio.
- `app/web/` — lo propio de la versión web: `src/` (instalable, sin conexión, cuentas), `supabase/` (base de datos y función de IA) y `build_web.py`.

## Cómo se arma
```
python3 app/porcion/build.py      # junta dieta + gimnasio + datos en app/porcion/porcion.html
python3 app/web/build_web.py      # arma la versión web en docs/
```
`docs/config.js` no se pisa al reconstruir: ahí van la URL y la clave pública de Supabase y la dirección de la IA.
