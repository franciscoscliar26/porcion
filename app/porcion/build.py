import json
import os
B=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..')+'/'
s=open(B+'porcion/app.html',encoding='utf8').read()
raw=open(B+'porcion/foods.txt',encoding='utf8').read()
micro=open(B+'porcion/micros.txt',encoding='utf8').read() if __import__('os').path.exists(B+'porcion/micros.txt') else ''
audit=open(B+'porcion/audit.json',encoding='utf8').read().strip()
J=lambda x: json.dumps(x,ensure_ascii=False).replace('</','<\\/')
s=s.replace('/*FOODS_DATA*/','\n/*@FOODS_RAW*/window.FOODS_RAW='+J(raw)+';\n/*@MICROS_RAW*/window.MICROS_RAW='+J(micro)+';\n/*@FOOD_AUDIT*/window.FOOD_AUDIT='+J(json.loads(audit))+';\n')
s=s.replace('/*GYM_MARKUP*/',open(B+'fierro/g_markup.html',encoding='utf8').read())
s=s.replace('/*GYM_CSS*/',open(B+'fierro/g_css.css',encoding='utf8').read())
s=s.replace('/*GYM_JS*/',open(B+'fierro/g_js.js',encoding='utf8').read().replace('/*EXIMG*/{map:{},cols:1,rows:1}',open(B+'porcion/eximg.json',encoding='utf8').read()))
open(B+'porcion/porcion.html','w',encoding='utf8').write(s)
print('built',len(s))
