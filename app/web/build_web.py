#!/usr/bin/env python3
"""Arma la versión web de Porción en web/site a partir de porcion/porcion.html (la misma app que el artifact)."""
import os, shutil, hashlib, json, time
from PIL import Image, ImageDraw, ImageFont
HERE=os.path.dirname(os.path.abspath(__file__)); APP=os.path.join(HERE,'..','porcion'); OUT=os.environ.get('PORCION_WEB_OUT') or os.path.join(HERE,'..','..','docs'); SRC=os.path.join(HERE,'src')
body=open(os.path.join(APP,'porcion.html'),encoding='utf-8').read()
os.makedirs(OUT,exist_ok=True); os.makedirs(os.path.join(OUT,'icons'),exist_ok=True)
head='''<!doctype html><html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="description" content="Calorías, macros y gimnasio. Anotá lo que comés y entrenás, y mirá cómo progresás.">
<meta name="theme-color" content="#EEF1EA" media="(prefers-color-scheme: light)"><meta name="theme-color" content="#0E1310" media="(prefers-color-scheme: dark)">
<link rel="manifest" href="manifest.webmanifest"><link rel="icon" href="icons/icon-192.png"><link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="default"><meta name="apple-mobile-web-app-title" content="Porción">
<style>:root{color-scheme:light dark}html,body{margin:0;padding:0}*,*::before,*::after{box-sizing:border-box}img{max-width:100%}[hidden]{display:none!important}
body{padding-top:env(safe-area-inset-top,0px)}
.webbar{position:fixed;left:12px;right:12px;bottom:calc(96px + env(safe-area-inset-bottom,0px));z-index:70;display:flex;align-items:center;gap:10px;background:var(--surface);border:1px solid var(--line);border-radius:18px;padding:12px 12px 12px 14px;box-shadow:0 10px 30px rgba(0,0,0,.18);max-width:576px;margin:0 auto;color:var(--ink);font-family:var(--f-body)}
.webbar>div{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}.webbar span{font-size:12.5px;color:var(--muted);line-height:1.35}.webbar .btn{flex:none;padding:9px 14px}.webbar .icon-btn{flex:none;width:34px;height:34px}
</style>
<script>window.PORCION_WEB=true</script>
<script src="config.js"></script><script src="shim.js"></script>
</head><body>
'''
tail='''
<script src="webui.js"></script>
</body></html>
'''
html=head+body+tail
open(os.path.join(OUT,'index.html'),'w',encoding='utf-8').write(html)
ver=hashlib.sha1(html.encode()).hexdigest()[:10]
for f in ['shim.js','webui.js','manifest.webmanifest']: shutil.copy(os.path.join(SRC,f),os.path.join(OUT,f))
if not os.path.exists(os.path.join(OUT,'config.js')): shutil.copy(os.path.join(SRC,'config.js'),os.path.join(OUT,'config.js'))   # no pisar la configuración
open(os.path.join(OUT,'sw.js'),'w').write(open(os.path.join(SRC,'sw.js')).read().replace('__VER__',ver))
# fotos de ejercicios
if os.path.isdir(os.path.join(APP,'ex')):
    shutil.copytree(os.path.join(APP,'ex'),os.path.join(OUT,'ex'),dirs_exist_ok=True)
# íconos
def icon(size, pad=0.0, radius=0.22):
    im=Image.new('RGBA',(size,size),(0,0,0,0)); d=ImageDraw.Draw(im)
    if radius: d.rounded_rectangle([0,0,size-1,size-1],radius=int(size*radius),fill='#D4471C')
    else: d.rectangle([0,0,size,size],fill='#D4471C')
    fnt=None
    for f in ['/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf','/usr/share/fonts/dejavu/DejaVuSans-Bold.ttf']:
        if os.path.exists(f): fnt=ImageFont.truetype(f,int(size*(0.62-pad))); break
    txt='P'; bb=d.textbbox((0,0),txt,font=fnt); w=bb[2]-bb[0]; h=bb[3]-bb[1]
    x=(size-w)/2-bb[0]-size*0.05; y=(size-h)/2-bb[1]
    d.text((x,y),txt,font=fnt,fill='white')
    r=size*0.06; cx=x+bb[2]+size*0.06; cy=y+bb[3]-r
    d.ellipse([cx-r,cy-r,cx+r,cy+r],fill='#16201A')
    return im
icon(192).save(os.path.join(OUT,'icons','icon-192.png'))
icon(512).save(os.path.join(OUT,'icons','icon-512.png'))
icon(512,pad=0.14,radius=0).save(os.path.join(OUT,'icons','icon-maskable-512.png'))
icon(180,radius=0).convert('RGB').save(os.path.join(OUT,'icons','apple-touch-icon.png'))
open(os.path.join(OUT,'.nojekyll'),'w').write('')
print('web lista', len(html), 'versión', ver)
