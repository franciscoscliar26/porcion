
/* ---------- utilidades ---------- */
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const MES=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
const MESL=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const DIA=['dom','lun','mar','mié','jue','vie','sáb'];
const DAY=864e5;
const nf=(n,d=1)=>Number(n||0).toLocaleString('es-AR',{maximumFractionDigits:d});
const pad=n=>String(n).padStart(2,'0');
const dayKey=ms=>{const d=new Date(ms);return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())};
const monKey=ms=>{const d=new Date(ms);return d.getFullYear()*12+d.getMonth()};
const fDate=ms=>{const d=new Date(ms);return `${DIA[d.getDay()]} ${d.getDate()} ${MES[d.getMonth()]}`+(d.getFullYear()!==new Date().getFullYear()?` ${d.getFullYear()}`:'')};
const fShort=ms=>{const d=new Date(ms);return `${d.getDate()} ${MES[d.getMonth()]}`};
const fDur=s=>{s=Math.max(0,Math.round(s));const h=Math.floor(s/3600),m=Math.floor(s%3600/60);return h?`${h} h ${m} min`:`${m} min`};
const fClock=s=>{s=Math.max(0,Math.round(s));const h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return h?`${h}:${pad(m)}:${pad(x)}`:`${m}:${pad(x)}`};
const fKg=v=>v>=10000?nf(v/1000,1)+' t':nf(v,0)+' kg';
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,8);
const e1rm=(kg,r)=>(!kg||!r)?0:(r===1?kg:kg*(1+r/30));
const startOfWeek=ms=>{const d=new Date(ms);d.setHours(0,0,0,0);const wd=(d.getDay()+6)%7;return d.getTime()-wd*DAY};
const parseNum=v=>{if(v==null)return 0;const n=parseFloat(String(v).replace(',','.'));return isFinite(n)?n:0};
const lsGet=k=>{try{return JSON.parse(localStorage.getItem(k))}catch{return null}};
const lsSet=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};

/* ---------- catálogo de ejercicios ----------
   Formato: Nombre|grupo|equipo|movimiento|músculos secundarios|pasos (separados por ;)|consejo|nombres en Hevy (separados por /) */
const MUSCLES=['Pecho','Espalda','Lumbares','Trapecio','Hombros','Bíceps','Tríceps','Antebrazos','Cuádriceps','Isquiotibiales','Glúteos','Aductores y abductores','Gemelos','Abdominales','Cardio','Cuerpo completo','Otro'];
const GRP={pe:'Pecho',es:'Espalda',lu:'Lumbares',tr:'Trapecio',ho:'Hombros',bi:'Bíceps',tc:'Tríceps',an:'Antebrazos',cu:'Cuádriceps',is:'Isquiotibiales',gl:'Glúteos',ad:'Aductores y abductores',ge:'Gemelos',ab:'Abdominales',ca:'Cardio',cc:'Cuerpo completo'};
const EQN={B:'Barra',M:'Mancuernas',P:'Polea',Q:'Máquina',C:'Peso corporal',K:'Kettlebell',Z:'Barra Z',S:'Máquina Smith',D:'Disco'};
const CATRAW=`
Press de banca (barra)|pe|B|press|Tríceps, hombro frontal|Acostate con los ojos debajo de la barra y los pies firmes en el piso;Bajá la barra controlada hasta la parte baja del pecho;Empujá hacia arriba hasta estirar los brazos|Juntá las escápulas y mantenelas así todo el movimiento.|Bench Press (Barbell)
Press de banca (mancuernas)|pe|M|press|Tríceps, hombro frontal|Acostado, con una mancuerna en cada mano a la altura del pecho;Empujá hacia arriba acercándolas un poco arriba;Bajá lento hasta sentir que estira el pecho|Codos a unos 45° del cuerpo, no abiertos en cruz.|Bench Press (Dumbbell)
Press de banca (Smith)|pe|S|press|Tríceps, hombro frontal|Acomodá el banco para que la barra baje a la parte baja del pecho;Destrabá la barra y bajala controlada;Empujá hasta estirar los brazos|Bueno para ir cerca del fallo sin compañero.|Bench Press (Smith Machine)
Press inclinado (barra)|pe|B|incline|Hombro frontal, tríceps|Banco a 30-45°;Bajá la barra a la parte alta del pecho;Empujá hacia arriba sin despegar la espalda|Más de 45° lo convierte en ejercicio de hombro.|Incline Bench Press (Barbell)
Press inclinado (mancuernas)|pe|M|incline|Hombro frontal, tríceps|Banco a 30-45°, mancuernas a los costados del pecho;Empujá hacia arriba y un poco hacia adentro;Bajá lento hasta sentir el estiramiento|Ideal para la parte alta del pecho.|Incline Bench Press (Dumbbell)
Press inclinado (Smith)|pe|S|incline|Hombro frontal, tríceps|Banco a 30° debajo de la barra;Bajá a la parte alta del pecho;Empujá hasta casi estirar los brazos|Mirá que la barra caiga sobre la clavícula baja, no sobre el cuello.|Incline Bench Press (Smith Machine)
Press inclinado en máquina|pe|Q|incline|Hombro frontal, tríceps|Ajustá el asiento para que las manijas queden a la altura del pecho alto;Empujá hasta casi estirar;Volvé despacio|Pecho arriba y espalda apoyada.|Incline Chest Press (Machine)
Press declinado (barra)|pe|B|press|Tríceps|Trabá las piernas en el banco declinado;Bajá la barra a la parte baja del pecho;Empujá hacia arriba|Recorrido más corto: controlá bien la bajada.|Decline Bench Press (Barbell)
Press declinado (mancuernas)|pe|M|press|Tríceps|Trabá las piernas en el banco declinado;Bajá las mancuernas al costado del pecho;Empujá hacia arriba|Pedí ayuda para subir las mancuernas.|Decline Bench Press (Dumbbell)
Press de pecho en máquina|pe|Q|cpress|Tríceps, hombro frontal|Sentate con las manijas a la altura del medio del pecho;Empujá hacia adelante hasta casi estirar;Volvé controlado hasta sentir estiramiento|Espalda pegada al respaldo todo el tiempo.|Chest Press (Machine)
Aperturas con mancuernas|pe|M|fly|Hombro frontal|Acostado, mancuernas arriba con los codos apenas flexionados;Abrí los brazos en arco hasta sentir estiramiento;Cerrá como abrazando un árbol|No bajes más allá de lo que tu hombro aguante cómodo.|Chest Fly (Dumbbell)
Aperturas inclinadas con mancuernas|pe|M|fly|Hombro frontal|Banco a 30°, mancuernas arriba;Abrí en arco con codos semiflexionados;Volvé arriba apretando el pecho|Usá menos peso que en el press.|Incline Chest Fly (Dumbbell)
Pec deck (aperturas en máquina)|pe|Q|cpress|Hombro frontal|Ajustá el asiento con las manijas a la altura del pecho;Cerrá los brazos al frente;Abrí lento hasta sentir estiramiento|Pausa de un segundo con los brazos cerrados.|Butterfly (Pec Deck)
Cruce de poleas (alto a bajo)|pe|P|cfly|Hombro frontal|Poleas altas, un paso adelante, torso apenas inclinado;Bajá las manos en arco hasta cruzarlas frente a la cadera;Volvé controlado|Trabaja más la parte baja del pecho.|Cable Fly Crossovers
Cruce de poleas (bajo a alto)|pe|P|cfly|Hombro frontal|Poleas bajas, un paso adelante;Subí las manos en arco hasta la altura del mentón;Bajá controlado|Trabaja más la parte alta del pecho.|Low Cable Fly Crossovers
Aperturas en polea (banco)|pe|P|fly|Hombro frontal|Banco plano entre dos poleas bajas;Abrí los brazos en arco;Cerrá arriba sin chocar las manijas|La polea mantiene tensión arriba de todo.|Cable Fly
Fondos en paralelas (pecho)|pe|C|dip|Tríceps, hombro frontal|Agarrate de las paralelas con los brazos estirados;Inclinate un poco adelante y bajá hasta que los codos queden a 90°;Empujá hasta arriba|Inclinarte adelante carga más el pecho.|Chest Dip
Fondos asistidos en máquina|pe|Q|dip|Tríceps|Elegí el contrapeso: más peso es más ayuda;Bajá hasta 90° de codo;Empujá hasta arriba|Bajá la ayuda a medida que te hacés más fuerte.|Chest Dip (Assisted)
Flexiones de brazos|pe|C|pushup|Tríceps, hombro frontal, abdominales|Manos un poco más anchas que los hombros, cuerpo recto;Bajá el pecho casi hasta el piso;Empujá hasta arriba|No dejes caer la cadera.|Push Up
Flexiones inclinadas|pe|C|pushup|Tríceps|Manos sobre un banco o caja;Bajá el pecho hasta el borde;Empujá|Versión más fácil para sumar repeticiones.|Incline Push Ups
Flexiones declinadas|pe|C|pushup|Hombro frontal, tríceps|Pies sobre un banco y manos en el piso;Bajá controlado;Empujá hasta arriba|Más difícil y carga la parte alta del pecho.|Decline Push Up
Pullover con mancuerna|pe|M|pullover|Dorsales, tríceps|Acostado, sostené una mancuerna con las dos manos sobre el pecho;Llevala hacia atrás de la cabeza con los codos apenas flexionados;Volvé arriba|Respirá hondo al bajar.|Pullover (Dumbbell)
Press Svend (con disco)|pe|D|cpress|Hombro frontal|Apretá un disco entre las palmas frente al pecho;Estirá los brazos hacia adelante apretando;Volvé al pecho|Apretá fuerte el disco todo el tiempo.|Plate Press
Dominadas|es|C|pullup|Bíceps, espalda alta|Colgate con agarre prono un poco más ancho que los hombros;Subí llevando el pecho a la barra;Bajá hasta estirar los brazos|Pensá en tirar con los codos hacia abajo.|Pull Up
Dominadas supinas (chin up)|es|C|pullup|Bíceps|Agarre supino a la altura de los hombros;Subí hasta pasar el mentón;Bajá completo|Trabaja más bíceps que la dominada prona.|Chin Up
Dominadas agarre neutro|es|C|pullup|Bíceps, braquial|Palmas enfrentadas;Subí hasta el mentón;Bajá controlado|La más amable con los hombros.|Neutral Grip Pull Up
Dominadas con lastre|es|C|pullup|Bíceps|Colgate peso del cinturón o sostené una mancuerna con los pies;Subí hasta el mentón;Bajá controlado|Sumalo cuando pasés las 10 repeticiones limpias.|Weighted Pull Up
Dominadas asistidas (máquina)|es|Q|pullup|Bíceps|Elegí el contrapeso y apoyá las rodillas;Subí hasta el mentón;Bajá hasta estirar|Más contrapeso es más ayuda.|Assisted Pull Up
Jalón al pecho (polea alta)|es|P|pulldown|Bíceps, espalda alta|Sentate con las piernas trabadas, agarre ancho;Bajá la barra a la parte alta del pecho;Subí controlado hasta estirar|No tires con el cuerpo hacia atrás.|Lat Pulldown (Cable)
Jalón agarre cerrado (triángulo)|es|P|pulldown|Bíceps|Agarrá el triángulo con las palmas enfrentadas;Bajalo al pecho sacando pecho;Subí despacio|Codos pegados al cuerpo al bajar.|Lat Pulldown - Close Grip (Cable)
Jalón agarre supino|es|P|pulldown|Bíceps|Agarre supino al ancho de hombros;Bajá la barra al pecho;Subí controlado|Buen reemplazo de la dominada supina.|Reverse Grip Lat Pulldown (Cable)
Jalón con un brazo|es|P|pulldown|Bíceps|Manija a una mano en polea alta;Bajá el codo hacia la cadera;Subí estirando bien|Sirve para corregir diferencias entre lados.|Single Arm Lat Pulldown
Jalón con brazos rectos|es|P|sapd|Tríceps (cabeza larga)|De pie frente a la polea alta, brazos casi rectos;Bajá la barra en arco hasta los muslos;Volvé arriba controlado|Mantené los codos fijos, sin doblarlos.|Straight Arm Lat Pulldown (Cable)
Remo con barra|es|B|row|Bíceps, lumbares, espalda alta|Inclinate a unos 45° con la espalda recta;Llevá la barra hacia el ombligo;Bajá controlado|No uses impulso con la cadera.|Bent Over Row (Barbell)
Remo Pendlay|es|B|row|Espalda alta, bíceps|Torso paralelo al piso, barra apoyada en el piso;Tirá explosivo hasta el pecho bajo;Devolvé la barra al piso en cada repetición|Cada repetición arranca desde el piso.|Pendlay Row (Barbell)
Remo con mancuerna (un brazo)|es|M|row|Bíceps, espalda alta|Apoyá rodilla y mano del mismo lado en el banco;Llevá la mancuerna hacia la cadera;Bajá estirando bien|Pensá en llevar el codo al bolsillo.|Dumbbell Row
Remo con mancuernas en banco inclinado|es|M|row|Espalda alta, bíceps|Pecho apoyado en un banco a 30-45°;Tirá las mancuernas hacia la cadera;Bajá completo|Al apoyar el pecho no cargás la zona lumbar.|Chest Supported Incline Row (Dumbbell)
Remo en polea baja (sentado)|es|P|crow|Bíceps, espalda alta|Sentado, pies en la plataforma, torso derecho;Tirá la manija al ombligo sacando pecho;Estirá los brazos sin encorvarte|No balancees el torso atrás y adelante.|Seated Cable Row - V Grip (Cable)
Remo en máquina|es|Q|crow|Bíceps, espalda alta|Pecho contra el apoyo;Tirá las manijas hacia atrás juntando escápulas;Volvé estirando|Pausa de un segundo atrás.|Seated Row (Machine)
Remo T (barra en T)|es|B|row|Espalda alta, bíceps|Parado sobre la barra, inclinado con la espalda recta;Tirá la manija hacia el pecho;Bajá controlado|Rodillas apenas flexionadas.|T Bar Row
Remo invertido|es|C|row|Bíceps, espalda alta|Colgate debajo de una barra baja con el cuerpo recto;Llevá el pecho a la barra;Bajá controlado|Cuanto más horizontal, más difícil.|Inverted Row
Remo con kettlebell|es|K|row|Bíceps|Apoyá una mano en el banco;Tirá la kettlebell hacia la cadera;Bajá controlado|Igual que el remo con mancuerna.|Kettlebell Row
Pullover en polea|es|P|sapd|Tríceps|De pie frente a la polea alta con cuerda;Llevá la cuerda en arco hasta la cadera;Volvé arriba|Sentí cómo trabajan los dorsales, no los brazos.|Rope Straight Arm Pulldown
Peso muerto (barra)|lu|B|hinge|Glúteos, isquiotibiales, espalda|Barra sobre el medio del pie, agarrala con la espalda recta;Empujá el piso y extendé cadera y rodillas juntas;Bajá con la barra pegada a las piernas|La barra roza las piernas todo el recorrido.|Deadlift (Barbell)
Peso muerto sumo|lu|B|hinge|Glúteos, aductores, cuádriceps|Piernas bien abiertas, puntas afuera, agarre por dentro de las rodillas;Empujá el piso con el pecho arriba;Bajá controlado|Rodillas en la dirección de las puntas de los pies.|Sumo Deadlift
Peso muerto con mancuernas|lu|M|hinge|Glúteos, isquiotibiales|Mancuernas al costado de los pies;Subí con la espalda recta;Bajá controlado|Buena opción para aprender el movimiento.|Deadlift (Dumbbell)
Peso muerto con barra hexagonal|lu|B|hinge|Cuádriceps, glúteos, trapecio|Parado dentro de la barra hexagonal;Empujá el piso con la espalda recta;Bajá controlado|Más amable con la zona lumbar.|Deadlift (Trap Bar)
Peso muerto en rack (parcial)|lu|B|hinge|Trapecio, glúteos|Barra apoyada en el rack a la altura de las rodillas;Extendé la cadera hasta quedar parado;Bajá controlado|Sirve para sobrecargar el final del peso muerto.|Rack Pull
Buenos días (good morning)|lu|B|hinge|Isquiotibiales, glúteos|Barra en la espalda como en sentadilla;Llevá la cadera atrás inclinando el torso con la espalda recta;Volvé arriba apretando glúteos|Peso liviano: es un ejercicio técnico.|Good Morning (Barbell)
Hiperextensiones (lumbares)|lu|C|hyper|Glúteos, isquiotibiales|Apoyá la cadera en el banco de hiperextensiones;Bajá el torso con la espalda recta;Subí hasta quedar en línea con las piernas|No te arquees de más arriba.|Back Extension (Hyperextension)
Hiperextensiones con disco|lu|D|hyper|Glúteos|Igual que la hiperextensión, abrazando un disco al pecho;Bajá controlado;Subí hasta la línea del cuerpo|Sumá peso de a poco.|Back Extension (Weighted Hyperextension)
Superman|lu|C|hyper|Glúteos|Acostado boca abajo, brazos estirados adelante;Levantá brazos y piernas a la vez;Sostené 2 segundos y bajá|Ideal para entrar en calor.|Superman
Encogimientos con barra|tr|B|shrug|Antebrazos|Parado con la barra a la altura de los muslos;Subí los hombros hacia las orejas;Bajá lento|No gires los hombros, solo arriba y abajo.|Shrug (Barbell)
Encogimientos con mancuernas|tr|M|shrug|Antebrazos|Mancuernas a los costados;Subí los hombros lo más alto posible;Pausa y bajá lento|Usá muñequeras si se te escapa el agarre.|Shrug (Dumbbell)
Encogimientos en Smith|tr|S|shrug|Antebrazos|Barra de Smith a la altura de los muslos;Subí los hombros;Bajá controlado|Permite cargar mucho peso con seguridad.|Shrug (Smith Machine)
Remo al mentón (barra)|tr|B|uprow|Hombro lateral|Agarre al ancho de hombros;Subí la barra pegada al cuerpo hasta el pecho;Bajá controlado|Codos por encima de las manos; si te molesta el hombro, no subas tanto.|Upright Row (Barbell)
Press militar (barra, de pie)|ho|B|ohp|Tríceps, trapecio|Barra apoyada arriba del pecho, agarre al ancho de hombros;Empujá hacia arriba pasando la cara;Bajá al pecho|Apretá glúteos y abdomen para no arquearte.|Overhead Press (Barbell)
Press militar sentado (barra)|ho|B|ohp|Tríceps|Sentado con respaldo, barra al frente;Empujá hasta estirar;Bajá a la altura del mentón|Espalda apoyada todo el tiempo.|Seated Overhead Press (Barbell)
Press de hombros (mancuernas)|ho|M|ohp|Tríceps|Mancuernas a la altura de las orejas;Empujá hacia arriba acercándolas;Bajá controlado|Codos un poco adelante del cuerpo.|Shoulder Press (Dumbbell)
Press de hombros sentado (mancuernas)|ho|M|ohp|Tríceps|Banco a 80-90°;Empujá las mancuernas hacia arriba;Bajá a las orejas|No choques las mancuernas arriba.|Seated Shoulder Press (Dumbbell)
Press de hombros en máquina|ho|Q|ohp|Tríceps|Ajustá el asiento con las manijas a la altura de los hombros;Empujá hacia arriba;Bajá controlado|Buena para terminar cerca del fallo.|Shoulder Press (Machine)
Press de hombros en Smith|ho|S|ohp|Tríceps|Sentado debajo de la barra;Empujá hacia arriba;Bajá al mentón|Barra apenas adelante de la cara.|Overhead Press (Smith Machine)
Press Arnold|ho|M|ohp|Tríceps|Mancuernas frente a la cara con palmas hacia vos;Empujá girando las palmas hacia adelante;Bajá deshaciendo el giro|Movimiento continuo, sin pausas.|Arnold Press (Dumbbell)
Push press|ho|B|ohp|Tríceps, piernas|Barra arriba del pecho;Flexioná apenas las rodillas y empujá con las piernas y los brazos;Bajá la barra al pecho|Permite mover más peso que el press estricto.|Push Press
Press landmine|ho|B|ohp|Pecho alto, tríceps|Punta de la barra en el piso o en un soporte, el otro extremo al hombro;Empujá hacia arriba y adelante;Bajá controlado|Muy amable con los hombros.|Landmine Press
Elevaciones laterales (mancuernas)|ho|M|raise|Trapecio|Mancuernas a los costados, codos apenas flexionados;Subí los brazos hacia los costados hasta la altura del hombro;Bajá lento|Peso liviano, sin balanceo.|Lateral Raise (Dumbbell)
Elevaciones laterales en polea|ho|P|raise|Trapecio|Polea baja, manija en la mano del lado contrario;Subí el brazo hacia el costado hasta el hombro;Bajá controlado|Mantiene tensión abajo de todo.|Lateral Raise (Cable)
Elevaciones laterales en máquina|ho|Q|raise|Trapecio|Codos contra las almohadillas;Subí hasta la altura del hombro;Bajá controlado|Buena para hacer series largas.|Lateral Raise (Machine)
Elevaciones frontales (mancuernas)|ho|M|raise|Pecho alto|Mancuernas frente a los muslos;Subí al frente hasta la altura de los ojos;Bajá lento|El hombro frontal ya trabaja mucho en los press.|Front Raise (Dumbbell)
Elevaciones frontales con disco|ho|D|raise|Pecho alto|Sostené un disco con las dos manos;Subilo al frente hasta los ojos;Bajá controlado|Sin balancear el torso.|Front Raise (Plate)
Elevaciones frontales en polea|ho|P|raise|Pecho alto|De espaldas a la polea baja;Subí la manija al frente;Bajá controlado|Tensión constante en todo el recorrido.|Front Raise (Cable)
Pájaros con mancuernas (deltoides posterior)|ho|M|row|Espalda alta|Inclinado con el torso casi paralelo al piso;Abrí los brazos hacia los costados;Bajá lento|Pensá en llevar las manos lejos, no atrás.|Rear Delt Reverse Fly (Dumbbell)
Deltoides posterior en máquina|ho|Q|crow|Espalda alta|Pecho contra el respaldo del pec deck;Abrí los brazos hacia atrás;Volvé controlado|Brazos casi rectos.|Rear Delt Reverse Fly (Machine)
Face pull (polea)|ho|P|facepull|Trapecio, espalda alta|Polea a la altura de la cara con cuerda;Tirá hacia la cara separando las manos;Volvé controlado|Clave para la salud del hombro.|Face Pull
Remo al mentón con mancuernas|ho|M|uprow|Trapecio|Mancuernas frente a los muslos;Subilas pegadas al cuerpo hasta el pecho;Bajá controlado|Codos guían el movimiento.|Upright Row (Dumbbell)
Curl con barra|bi|B|curl|Antebrazos|Parado, agarre supino al ancho de hombros;Subí la barra sin mover los codos;Bajá hasta estirar|Nada de balanceo con la espalda.|Bicep Curl (Barbell)
Curl con barra Z|bi|Z|curl|Antebrazos|Agarrá la barra Z en la parte curva;Subí sin mover los codos;Bajá completo|Más cómoda para las muñecas que la barra recta.|EZ Bar Biceps Curl
Curl con mancuernas|bi|M|curl|Antebrazos|Mancuernas a los costados, palmas al frente;Subí las dos a la vez;Bajá lento|Apretá arriba un segundo.|Bicep Curl (Dumbbell)
Curl alterno con mancuernas|bi|M|curl|Antebrazos|Mancuernas a los costados;Subí una, bajala, y después la otra;Girá la palma hacia arriba al subir|Contá cada brazo como una repetición.|Alternating Bicep Curl (Dumbbell)
Curl martillo|bi|M|curl|Braquial, antebrazos|Palmas enfrentadas todo el recorrido;Subí sin mover los codos;Bajá controlado|Engrosa el brazo visto de frente.|Hammer Curl (Dumbbell)
Curl martillo en polea (cuerda)|bi|P|curl|Braquial, antebrazos|Polea baja con cuerda;Subí con palmas enfrentadas;Bajá controlado|Tensión constante.|Hammer Curl (Cable)
Curl en banco Scott (barra Z)|bi|Z|curl|Braquial|Brazos apoyados en el banco Scott;Subí la barra;Bajá casi hasta estirar|No estires de golpe abajo.|Preacher Curl (Barbell)
Curl en banco Scott (mancuerna)|bi|M|curl|Braquial|Un brazo apoyado en el banco;Subí la mancuerna;Bajá controlado|Ideal para concentrarte en un lado.|Preacher Curl (Dumbbell)
Curl Scott en máquina|bi|Q|curl|Braquial|Ajustá el asiento con los codos en el eje de la máquina;Subí;Bajá controlado|Buena para terminar al fallo.|Preacher Curl (Machine)
Curl en polea baja|bi|P|curl|Antebrazos|De frente a la polea baja con barra;Subí sin mover los codos;Bajá controlado|Tensión hasta abajo de todo.|Bicep Curl (Cable)
Curl concentrado|bi|M|curl|Braquial|Sentado, codo apoyado en la cara interna del muslo;Subí la mancuerna;Bajá lento|Apretá fuerte arriba.|Concentration Curl
Curl inclinado con mancuernas|bi|M|curl|Antebrazos|Recostado en un banco a 45°, brazos colgando;Subí sin adelantar los codos;Bajá completo|Estira mucho el bíceps: usá menos peso.|Seated Incline Curl (Dumbbell)
Curl araña|bi|M|curl|Braquial|Pecho apoyado en un banco inclinado, brazos colgando;Subí las mancuernas;Bajá controlado|Imposible hacer trampa con el cuerpo.|Spider Curl (Dumbbell)
Curl en polea alta (doble)|bi|P|curl|Braquial|Entre dos poleas altas, brazos abiertos en cruz;Llevá las manos hacia las orejas;Volvé controlado|Pose de "doble bíceps".|Overhead Cable Curl
Extensión en polea (cuerda)|tc|P|triext|Antebrazos|Polea alta con cuerda, codos pegados al cuerpo;Empujá hacia abajo separando la cuerda al final;Subí hasta 90°|Solo se mueven los antebrazos.|Triceps Rope Pushdown
Extensión en polea (barra recta)|tc|P|triext|Antebrazos|Polea alta con barra, agarre prono;Empujá hasta estirar;Subí controlado|Codos fijos al costado.|Triceps Pushdown
Extensión en polea (barra V)|tc|P|triext|Antebrazos|Polea alta con barra en V;Empujá hasta estirar;Subí hasta 90°|Muy cómoda para las muñecas.|Triceps Pushdown (V Bar)
Extensión en polea a un brazo|tc|P|triext||Polea alta con manija;Estirá el brazo hacia abajo;Volvé controlado|Corrige diferencias entre lados.|Single Arm Triceps Pushdown (Cable)
Extensión sobre la cabeza en polea (cuerda)|tc|P|ohext||De espaldas a la polea con la cuerda detrás de la cabeza;Estirá los brazos hacia arriba y adelante;Volvé controlado|Trabaja mucho la cabeza larga del tríceps.|Overhead Triceps Extension (Cable)
Extensión sobre la cabeza con mancuerna|tc|M|ohext||Sentado, sostené una mancuerna con las dos manos detrás de la cabeza;Estirá los brazos hacia arriba;Bajá controlado|Codos apuntando al techo.|Triceps Extension (Dumbbell)
Press francés (barra Z)|tc|Z|skull||Acostado, barra arriba con brazos estirados;Bajá la barra hacia la frente doblando solo los codos;Estirá de nuevo|Codos apuntando al techo, sin abrirlos.|Skullcrusher (Barbell)
Press francés con mancuernas|tc|M|skull||Acostado, mancuernas arriba con palmas enfrentadas;Bajalas al costado de la cabeza;Estirá los brazos|Más fácil para los codos.|Skullcrusher (Dumbbell)
Press cerrado (barra)|tc|B|press|Pecho, hombro frontal|Agarre al ancho de hombros;Bajá la barra al pecho bajo con codos pegados;Empujá hasta arriba|Permite cargar pesado el tríceps.|Bench Press - Close Grip (Barbell)
Patada de tríceps (mancuerna)|tc|M|tkick||Inclinado, brazo pegado al cuerpo y paralelo al piso;Estirá el codo llevando la mancuerna atrás;Volvé a 90°|El brazo no se mueve, solo el antebrazo.|Triceps Kickback (Dumbbell)
Patada de tríceps en polea|tc|P|tkick||Inclinado frente a la polea baja;Estirá el brazo hacia atrás;Volvé controlado|Tensión constante.|Triceps Kickback (Cable)
Fondos en banco|tc|C|dip|Pecho|Manos en el borde de un banco detrás tuyo;Bajá doblando los codos a 90°;Empujá hasta arriba|Piernas dobladas para hacerlo más fácil.|Bench Dip
Fondos en paralelas (tríceps)|tc|C|dip|Pecho|Cuerpo bien vertical en las paralelas;Bajá hasta 90° de codo;Empujá hasta arriba|Más vertical es más tríceps.|Triceps Dip
Flexiones diamante|tc|C|pushup|Pecho|Manos juntas formando un diamante bajo el pecho;Bajá;Empujá|Si cuesta, apoyá las rodillas.|Diamond Push Up
Extensión de tríceps en máquina|tc|Q|triext||Brazos apoyados en la almohadilla;Estirá los codos;Volvé controlado|Buena para terminar al fallo.|Triceps Extension (Machine)
Fondos en máquina|tc|Q|dip|Pecho|Sentado, manijas al costado;Empujá hacia abajo hasta estirar;Subí controlado|Ajustá el asiento para empezar a 90°.|Seated Dip Machine
Curl de muñeca (barra)|an|B|wrist||Sentado, antebrazos sobre los muslos, palmas arriba;Subí la barra solo con las muñecas;Bajá dejando rodar la barra a los dedos|Muchas repeticiones, 15 a 25.|Wrist Curl (Barbell)
Curl de muñeca inverso|an|B|wrist||Antebrazos sobre los muslos, palmas abajo;Subí la barra con las muñecas;Bajá controlado|Usá poco peso.|Reverse Wrist Curl (Barbell)
Curl invertido con barra|an|B|curl|Bíceps, braquial|Agarre prono al ancho de hombros;Subí la barra sin mover los codos;Bajá controlado|Trabaja el antebrazo de arriba.|Reverse Curl (Barbell)
Curl invertido en polea|an|P|curl|Braquial|Polea baja con barra, agarre prono;Subí sin mover los codos;Bajá controlado|Tensión constante.|Reverse Curl (Cable)
Colgarse de la barra|an|C|hang|Dorsales|Colgate de la barra con los brazos estirados;Aguantá el tiempo que puedas;Bajá|Anotá los segundos en las repeticiones.|Dead Hang
Rodillo de muñeca|an|C|wrist||Sostené el rodillo con brazos al frente;Enrollá la cuerda girando las muñecas;Desenrollá controlado|Quema garantizada.|Wrist Roller
Sentadilla (barra)|cu|B|squat|Glúteos, aductores, lumbares|Barra sobre la parte alta de la espalda, pies al ancho de hombros;Bajá llevando la cadera atrás y abajo hasta al menos paralelo;Subí empujando el piso|Rodillas en la dirección de las puntas de los pies.|Squat (Barbell)
Sentadilla frontal (barra)|cu|B|squat|Glúteos, abdominales|Barra apoyada adelante sobre los hombros, codos altos;Bajá con el torso bien derecho;Subí empujando el piso|Codos arriba todo el tiempo.|Front Squat
Sentadilla en Smith|cu|S|squat|Glúteos|Barra sobre la espalda, pies un poco adelante;Bajá controlado;Subí|Pies adelantados cargan más el cuádriceps.|Squat (Smith Machine)
Sentadilla goblet|cu|K|squat|Glúteos, abdominales|Sostené una mancuerna o kettlebell contra el pecho;Bajá entre las rodillas con el pecho arriba;Subí|Perfecta para aprender la sentadilla.|Goblet Squat
Sentadilla con mancuernas|cu|M|squat|Glúteos|Mancuernas a los costados;Bajá hasta paralelo;Subí|Buena opción si no hay rack libre.|Squat (Dumbbell)
Sentadilla hack (máquina)|cu|Q|squat|Glúteos|Espalda contra el respaldo, pies al medio de la plataforma;Bajá profundo;Subí sin trabar las rodillas|Excelente para cuádriceps.|Hack Squat (Machine)
Sentadilla péndulo|cu|Q|squat|Glúteos|Hombros bajo las almohadillas;Bajá profundo;Subí empujando la plataforma|Mucho rango de movimiento.|Pendulum Squat (Machine)
Sentadilla con peso corporal|cu|C|squat|Glúteos|Pies al ancho de hombros, brazos al frente;Bajá hasta paralelo;Subí|Ideal para entrar en calor.|Squat (Bodyweight)
Sentadilla con salto|cu|C|jump|Glúteos, gemelos|Bajá en sentadilla;Saltá explosivo;Caé suave y repetí|Aterrizá con las rodillas flexionadas.|Jump Squat
Sentadilla búlgara (mancuernas)|cu|M|lunge|Glúteos|Pie de atrás apoyado en un banco;Bajá hasta que la rodilla de atrás casi toque el piso;Subí empujando con la pierna de adelante|Torso inclinado carga más glúteo; derecho, más cuádriceps.|Bulgarian Split Squat
Estocadas con mancuernas|cu|M|lunge|Glúteos|Dá un paso largo adelante;Bajá hasta que las dos rodillas queden a 90°;Volvé al inicio|Rodilla de adelante sobre el pie.|Lunge (Dumbbell)
Estocadas con barra|cu|B|lunge|Glúteos|Barra sobre la espalda;Paso adelante y bajá;Volvé empujando con la pierna de adelante|Mirá al frente para no perder el equilibrio.|Lunge (Barbell)
Estocadas caminando|cu|M|lunge|Glúteos|Paso adelante y bajá;Subí y seguí con la otra pierna avanzando;Contá cada pierna|Pasos largos cargan más el glúteo.|Walking Lunge (Dumbbell)
Estocadas hacia atrás|cu|M|lunge|Glúteos|Dá un paso hacia atrás;Bajá a 90°;Volvé al inicio|Más amable con las rodillas que la estocada adelante.|Reverse Lunge (Dumbbell)
Subidas al cajón (step up)|cu|M|lunge|Glúteos|Pie entero sobre un cajón o banco;Subí empujando con esa pierna;Bajá controlado|No te impulses con la pierna de abajo.|Step Up
Prensa de piernas (45°)|cu|Q|legpress|Glúteos, isquiotibiales|Espalda apoyada, pies al ancho de hombros en el medio de la plataforma;Bajá hasta 90° o más;Empujá sin trabar las rodillas|No despegues la cadera del asiento abajo.|Leg Press
Prensa horizontal|cu|Q|legpress|Glúteos|Sentado, pies en la plataforma;Bajá doblando las rodillas;Empujá hasta casi estirar|Pies más altos trabajan más glúteo.|Leg Press Horizontal (Machine)
Extensión de cuádriceps|cu|Q|legext||Rodillas alineadas con el eje de la máquina;Estirá las piernas;Bajá controlado|Pausa de un segundo arriba.|Leg Extension (Machine)
Extensión de cuádriceps a una pierna|cu|Q|legext||Igual que la extensión, con una pierna;Estirá;Bajá controlado|Iguala la fuerza entre piernas.|Single Leg Extensions
Peso muerto rumano (barra)|is|B|hinge|Glúteos, lumbares|De pie con la barra, rodillas apenas flexionadas;Llevá la cadera atrás bajando la barra pegada a las piernas;Subí apretando glúteos|Bajá hasta sentir el estiramiento atrás del muslo, no más.|Romanian Deadlift (Barbell)
Peso muerto rumano (mancuernas)|is|M|hinge|Glúteos|Mancuernas frente a los muslos;Llevá la cadera atrás;Subí|Espalda recta todo el tiempo.|Romanian Deadlift (Dumbbell)
Peso muerto piernas rígidas|is|B|hinge|Lumbares, glúteos|Piernas casi rectas;Bajá la barra con la espalda recta;Subí|Más estiramiento que el rumano: menos peso.|Straight Leg Deadlift
Peso muerto rumano a una pierna|is|M|hinge|Glúteos|Parado en una pierna con mancuerna en la mano contraria;Inclinate llevando la otra pierna atrás;Volvé|Mirá un punto fijo para el equilibrio.|Single Leg Romanian Deadlift (Dumbbell)
Curl femoral acostado|is|Q|legcurl|Gemelos|Boca abajo, rodillas justo fuera del banco;Llevá los talones hacia los glúteos;Bajá controlado|No levantes la cadera.|Lying Leg Curl (Machine)
Curl femoral sentado|is|Q|slegcurl|Gemelos|Sentado con la almohadilla arriba de los muslos;Llevá los talones hacia abajo y atrás;Volvé controlado|Inclinarte adelante estira más el isquio.|Seated Leg Curl (Machine)
Curl femoral de pie|is|Q|kickback|Gemelos|Parado en la máquina con una pierna;Llevá el talón al glúteo;Bajá controlado|Trabajá una pierna por vez.|Standing Leg Curls
Curl nórdico|is|C|nordic|Glúteos|De rodillas con los talones trabados;Dejate caer adelante lo más lento posible;Ayudate con las manos para volver|Muy exigente: empezá con pocas repeticiones.|Nordic Hamstrings Curls
Peso muerto con kettlebell|is|K|hinge|Glúteos|Kettlebell entre los pies;Subí con la espalda recta;Bajá controlado|Buena para aprender la bisagra de cadera.|Kettlebell Deadlift
Hip thrust (barra)|gl|B|hipthrust|Isquiotibiales|Espalda alta contra un banco, barra sobre la cadera;Subí la cadera hasta alinear rodillas, cadera y hombros;Bajá controlado|Mentón al pecho y apretá glúteos arriba.|Hip Thrust (Barbell)
Hip thrust en máquina|gl|Q|hipthrust|Isquiotibiales|Espalda contra el respaldo, cinturón sobre la cadera;Subí la cadera;Bajá controlado|Pausa arriba.|Hip Thrust (Machine)
Hip thrust con mancuerna|gl|M|hipthrust|Isquiotibiales|Mancuerna sobre la cadera, espalda en el banco;Subí;Bajá|Ideal para hacer en casa.|Hip Thrust (Dumbbell)
Puente de glúteos|gl|C|bridge|Isquiotibiales|Acostado boca arriba, rodillas dobladas;Subí la cadera apretando glúteos;Bajá|Empujá con los talones.|Glute Bridge
Puente de glúteos a una pierna|gl|C|bridge|Isquiotibiales|Una pierna en el aire;Subí la cadera con la otra;Bajá|Cadera nivelada.|Single Leg Glute Bridge
Patada de glúteo en polea|gl|P|kickback|Isquiotibiales|Tobillera en la polea baja;Llevá la pierna hacia atrás con la rodilla casi recta;Volvé controlado|No arquees la espalda.|Glute Kickback (Cable)
Patada de glúteo en máquina|gl|Q|kickback|Isquiotibiales|Apoyá el pecho y la pierna en la máquina;Empujá hacia atrás;Volvé controlado|Movimiento corto y apretado.|Glute Kickback (Machine)
Sentadilla sumo|gl|M|squat|Aductores, cuádriceps|Piernas bien abiertas, mancuerna colgando al centro;Bajá con el pecho arriba;Subí|Rodillas hacia afuera.|Sumo Squat
Kettlebell swing|gl|K|swing|Isquiotibiales, lumbares|Kettlebell entre las piernas, cadera atrás;Llevá la cadera adelante con fuerza y dejá subir la kettlebell;Dejala caer y repetí|La fuerza sale de la cadera, no de los brazos.|Kettlebell Swing
Abducción de cadera (máquina)|ad|Q|abduct|Glúteos|Sentado con las almohadillas por fuera de las rodillas;Abrí las piernas;Cerrá controlado|Inclinarte adelante carga más el glúteo.|Hip Abduction (Machine)
Aducción de cadera (máquina)|ad|Q|abduct||Sentado con las almohadillas por dentro de las rodillas;Cerrá las piernas;Abrí controlado|Hacelo lento.|Hip Adduction (Machine)
Abducción en polea|ad|P|abduct|Glúteos|Tobillera en la polea baja, de costado;Llevá la pierna hacia afuera;Volvé controlado|Torso derecho.|Cable Hip Abduction
Aducción en polea|ad|P|abduct||Tobillera en la polea baja del lado de adentro;Cruzá la pierna por delante;Volvé controlado|Agarrate de la máquina.|Cable Hip Adduction
Caminata lateral con banda|ad|C|abduct|Glúteos|Banda arriba de las rodillas, semiflexionado;Caminá de costado sin juntar los pies;Volvé|Contá los pasos como repeticiones.|Lateral Band Walks
Elevación de talones de pie (máquina)|ge|Q|calf||Hombros bajo las almohadillas, puntas en el borde;Subí en puntas de pie lo más alto posible;Bajá estirando bien|Pausa abajo para no rebotar.|Standing Calf Raise (Machine)
Elevación de talones con barra|ge|B|calf||Barra en la espalda, puntas sobre un disco;Subí en puntas;Bajá estirando|Recorrido completo.|Standing Calf Raise (Barbell)
Elevación de talones con mancuernas|ge|M|calf||Mancuernas a los costados, puntas en un escalón;Subí;Bajá|Agarrate de algo para el equilibrio.|Standing Calf Raise (Dumbbell)
Elevación de talones sentado|ge|Q|calf||Sentado con la almohadilla sobre las rodillas;Subí los talones;Bajá estirando|Trabaja el sóleo.|Seated Calf Raise
Gemelos en prensa|ge|Q|legpress||Puntas en el borde bajo de la plataforma, piernas estiradas;Empujá con las puntas;Volvé estirando|No trabes las rodillas.|Calf Press (Machine)
Elevación de talones en Smith|ge|S|calf||Barra en la espalda, puntas sobre un escalón;Subí;Bajá|Muy estable para cargar peso.|Calf Raise (Smith Machine)
Elevación de talones a una pierna|ge|C|calf||Una pierna en un escalón;Subí en punta;Bajá estirando|Sumá una mancuerna cuando sea fácil.|Single Leg Standing Calf Raise
Crunch abdominal|ab|C|crunch||Acostado con las rodillas dobladas;Despegá los hombros del piso llevando las costillas a la cadera;Bajá controlado|No tires del cuello con las manos.|Crunch
Crunch en polea (de rodillas)|ab|P|kcrunch||De rodillas frente a la polea alta con cuerda junto a la cabeza;Enrollá el torso hacia abajo;Volvé controlado|Movés el torso, no la cadera.|Cable Crunch
Crunch en máquina|ab|Q|crunch||Sentado con las manijas;Enrollá el torso hacia adelante;Volvé controlado|Exhalá al bajar.|Crunch (Machine)
Crunch inverso|ab|C|lraise||Acostado, rodillas dobladas arriba;Llevá las rodillas al pecho despegando la cadera;Bajá lento|Sin impulso.|Reverse Crunch
Crunch en banco declinado|ab|C|crunch||Pies trabados en el banco declinado;Subí enrollando el torso;Bajá controlado|Sumá un disco al pecho cuando sea fácil.|Decline Crunch
Abdominales (sit up)|ab|C|crunch|Flexores de cadera|Acostado con pies apoyados;Subí hasta sentarte;Bajá controlado|Exhalá al subir.|Sit Up
Plancha|ab|C|plank|Hombros, glúteos|Antebrazos en el piso y cuerpo recto;Apretá abdomen y glúteos;Aguantá|Anotá los segundos en las repeticiones.|Plank
Plancha lateral|ab|C|plank|Glúteos|De costado sobre un antebrazo;Levantá la cadera en línea;Aguantá y cambiá de lado|Anotá los segundos.|Side Plank
Elevación de piernas colgado|ab|C|hlr|Flexores de cadera|Colgate de la barra;Subí las piernas rectas hasta 90° o más;Bajá sin balancearte|Si cuesta, subí las rodillas dobladas.|Hanging Leg Raise
Elevación de rodillas colgado|ab|C|hlr|Flexores de cadera|Colgate de la barra;Subí las rodillas al pecho;Bajá controlado|Enrollá la cadera arriba.|Hanging Knee Raise
Elevación de piernas en silla romana|ab|C|hlr|Flexores de cadera|Antebrazos en los apoyos, espalda contra el respaldo;Subí las rodillas o piernas;Bajá controlado|Más estable que colgado.|Knee Raise Parallel Bars
Elevación de piernas acostado|ab|C|lraise|Flexores de cadera|Acostado, manos bajo la cadera;Subí las piernas rectas;Bajá sin tocar el piso|Zona lumbar pegada al piso.|Lying Leg Raise
Rueda abdominal|ab|C|wheel|Dorsales, hombros|De rodillas con la rueda;Rodá hacia adelante con la espalda neutra;Volvé con el abdomen|Andá hasta donde no se te hunda la cadera.|Ab Wheel
Russian twist|ab|D|crunch|Oblicuos|Sentado con el torso inclinado atrás y un disco en las manos;Girá el torso de un lado al otro;Contá cada lado|Pies en el piso para hacerlo más fácil.|Russian Twist (Weighted)
Bicho muerto (dead bug)|ab|C|lraise||Boca arriba, brazos y rodillas arriba;Estirá un brazo y la pierna contraria;Volvé y cambiá|Lumbar pegada al piso.|Dead Bug
Abdominales bicicleta|ab|C|lraise|Oblicuos|Boca arriba, manos junto a la cabeza;Llevá un codo a la rodilla contraria pedaleando;Alterná|Lento y controlado.|Bicycle Crunch
Leñador en polea|ab|P|cfly|Oblicuos, hombros|Polea alta de costado;Bajá la manija en diagonal girando el torso;Volvé controlado|El giro sale del torso, no de los brazos.|Cable Core Palloff Press
Pallof press|ab|P|cpress|Oblicuos|De costado a la polea con la manija al pecho;Estirá los brazos al frente sin dejarte girar;Volvé al pecho|Aguantá 2 segundos estirado.|Pallof Press
Hollow hold|ab|C|lraise||Boca arriba, brazos y piernas estirados y levantados;Lumbar pegada al piso;Aguantá|Anotá los segundos.|Hollow Rock
Cinta (correr)|ca|Q|run||Elegí velocidad e inclinación;Corré a ritmo constante;Anotá minutos en repeticiones y km en kg si querés|Calentá caminando 3 minutos.|Treadmill
Caminata en cinta inclinada|ca|Q|run||Inclinación de 8 a 15%;Caminá sin agarrarte;Anotá los minutos|Ideal para cardio suave.|Walking
Bicicleta fija|ca|Q|bike||Ajustá el asiento a la altura de la cadera;Pedaleá a ritmo constante;Anotá los minutos|Rodilla casi estirada abajo.|Cycling
Elíptico|ca|Q|run||Subite y agarrá las manijas;Movete a ritmo constante;Anotá los minutos|Bajo impacto para las rodillas.|Elliptical Trainer
Remo ergómetro|ca|Q|crow|Espalda, piernas|Empujá con las piernas;Después tirá con los brazos;Volvé en orden inverso|Piernas, cuerpo, brazos.|Rowing Machine
Escaladora|ca|Q|run|Glúteos|Subite y agarrate apenas;Subí escalones a ritmo constante;Anotá los minutos|No te apoyes con todo el peso en las manos.|Stair Machine
Saltar la soga|ca|C|calf|Gemelos|Soga a la altura de las axilas;Saltá apenas, girando con las muñecas;Anotá los minutos|Aterrizá en puntas de pie.|Jump Rope
Jumping jacks|ca|C|jj||Parado con brazos abajo;Saltá abriendo piernas y subiendo brazos;Volvé y repetí|Buen calentamiento.|Jumping Jack
Burpees|cc|C|jump|Pecho, piernas|Bajá a cuclillas y apoyá las manos;Llevá los pies atrás y hacé una flexión;Volvé y saltá|Ritmo constante antes que rápido.|Burpee
Cargada de potencia (power clean)|cc|B|clean|Trapecio, glúteos, isquiotibiales|Posición de peso muerto;Subí explosivo extendiendo la cadera;Recibí la barra sobre los hombros|Técnica primero: aprendela con poco peso.|Power Clean
Arranque (snatch)|cc|B|jump|Hombros, piernas|Agarre ancho en posición de peso muerto;Subí explosivo y meté el cuerpo debajo de la barra;Recibí con los brazos estirados arriba|Muy técnico: mejor con un entrenador.|Snatch
Thruster|cc|B|thruster|Hombros, glúteos|Barra apoyada adelante en los hombros;Hacé una sentadilla frontal;Al subir empujá la barra arriba de la cabeza|Un movimiento continuo.|Thruster (Barbell)
Paseo del granjero|cc|M|walk|Antebrazos, trapecio|Agarrá dos mancuernas pesadas;Caminá derecho con pasos cortos;Anotá metros o segundos|Hombros atrás y abdomen firme.|Farmers Walk
Empuje de trineo|cc|Q|run|Piernas|Manos en el trineo, cuerpo inclinado;Empujá con pasos cortos y fuertes;Anotá los metros|Brazos firmes.|Sled Push
Cuerdas de batalla|cc|C|raise|Hombros, abdominales|Semiflexionado con una cuerda en cada mano;Hacé ondas alternando brazos;Anotá los segundos|Ritmo parejo.|Battle Ropes
Press de banca agarre ancho (barra)|pe|B|press|Hombro frontal, tríceps|Agarre bien más ancho que los hombros;Bajá la barra a la mitad del pecho;Empujá hasta estirar|Más pecho y menos tríceps, pero cuidá los hombros.|Wide Grip Bench Press
Press en el piso (barra)|pe|B|press|Tríceps|Acostado en el piso con la barra arriba;Bajá hasta que los codos toquen el piso;Empujá hasta estirar|El piso limita el recorrido y cuida los hombros.|Floor Press (Barbell)
Press inclinado agarre neutro (mancuernas)|pe|M|incline|Tríceps, hombro frontal|Banco a 30-45°, palmas enfrentadas;Bajá las mancuernas al costado del pecho;Empujá hacia arriba|Muy amable con los hombros.|Incline Dumbbell Press Neutral Grip
Press de banca agarre neutro (mancuernas)|pe|M|press|Tríceps|Acostado, palmas enfrentadas;Bajá al costado del pecho;Empujá hasta arriba|Codos pegados al cuerpo.|Bench Press Neutral Grip (Dumbbell)
Aperturas declinadas (mancuernas)|pe|M|fly|Hombro frontal|Banco declinado, mancuernas arriba;Abrí en arco con los codos semiflexionados;Cerrá apretando el pecho|Trabaja la parte baja del pecho.|Decline Chest Fly (Dumbbell)
Cruce de polea a un brazo|pe|P|cfly|Hombro frontal|De costado a la polea alta;Llevá la manija cruzando frente al cuerpo;Volvé controlado|Corrige diferencias entre lados.|Single Arm Cable Crossover
Press de pecho en polea (de pie)|pe|P|cpress|Tríceps|De espaldas a las poleas, un pie adelante;Empujá las manijas al frente;Volvé despacio|Abdomen firme para no arquearte.|Standing Cable Chest Press
Flexiones abiertas|pe|C|pushup|Hombro frontal|Manos bien más anchas que los hombros;Bajá el pecho casi al piso;Empujá hasta arriba|Más pecho, menos tríceps.|Wide Push Up
Remo con dos mancuernas|es|M|row|Bíceps, espalda alta|Inclinado a 45°, mancuernas colgando;Llevalas hacia la cadera;Bajá estirando|Espalda recta todo el tiempo.|Bent Over Row (Dumbbell)
Remo en Smith|es|S|row|Bíceps|Inclinado frente a la barra de Smith;Tirá la barra hacia el ombligo;Bajá controlado|La guía permite concentrarse en la espalda.|Bent Over Row (Smith Machine)
Remo supino con barra|es|B|row|Bíceps|Agarre supino al ancho de hombros;Tirá la barra hacia el ombligo;Bajá controlado|Carga más los dorsales bajos y el bíceps.|Underhand Bent Over Row
Remo en polea a un brazo|es|P|crow|Bíceps|Sentado con una manija en polea baja;Tirá hacia la cadera girando apenas el torso;Estirá completo|Buena para el rango de movimiento.|Single Arm Cable Row
Remo alto en máquina|es|Q|crow|Espalda alta, bíceps|Pecho contra el apoyo, manijas altas;Tirá hacia abajo y atrás;Volvé controlado|Pensá en llevar los codos a las costillas.|High Row (Machine)
Jalón tras nuca|es|P|pulldown|Bíceps, espalda alta|Agarre ancho, inclinado apenas adelante;Bajá la barra detrás de la cabeza hasta la nuca;Subí controlado|Solo si tenés buena movilidad de hombros.|Behind the Neck Lat Pulldown
Remo renegado|es|M|plank|Abdominales, bíceps|En plancha alta sobre dos mancuernas;Remá una hacia la cadera sin girar el cuerpo;Alterná|Pies más abiertos dan más estabilidad.|Renegade Row
Remo con barra larga a un brazo|es|B|row|Bíceps|Una punta de la barra en el piso, parado al costado;Tirá la barra hacia la cadera;Bajá controlado|Variante del remo T a un brazo.|Single Arm Landmine Row
Dominadas agarre ancho|es|C|pullup|Bíceps, espalda alta|Agarre bien ancho;Subí llevando el pecho a la barra;Bajá completo|Más ancho carga más los dorsales, pero cuesta más.|Wide Pull Up
Dominadas escapulares|es|C|hang|Trapecio, espalda alta|Colgate con los brazos estirados;Bajá los hombros sin doblar los codos;Volvé a colgar|Gran ejercicio de entrada en calor.|Scapular Pull Ups
Pull-through en polea|gl|P|hinge|Isquiotibiales, lumbares|De espaldas a la polea baja, cuerda entre las piernas;Llevá la cadera atrás;Extendé apretando glúteos|Enseña a mover la cadera como en el peso muerto.|Cable Pull Through
Peso muerto con déficit|lu|B|hinge|Glúteos, isquiotibiales, cuádriceps|Parado sobre un disco o tarima;Agarrá la barra con la espalda recta;Subí empujando el piso|Fortalece el arranque desde el piso.|Deficit Deadlift
Peso muerto rumano en Smith|is|S|hinge|Glúteos, lumbares|Barra de Smith frente a los muslos;Llevá la cadera atrás con rodillas apenas flexionadas;Subí apretando glúteos|Sentí cómo estira atrás del muslo.|Romanian Deadlift (Smith Machine)
Glute-ham raise|is|C|nordic|Glúteos, gemelos|Rodillas en el apoyo y pies trabados;Bajá el torso controlando con los isquios;Subí doblando las rodillas|Muy exigente: usá ayuda al principio.|Glute Ham Raise
Curl femoral con pelota|is|C|bridge|Glúteos|Boca arriba, talones sobre una pelota suiza;Levantá la cadera y traé la pelota hacia vos;Estirá controlado|Cadera arriba todo el tiempo.|Swiss Ball Leg Curl
Press militar tras nuca|ho|B|ohp|Tríceps, trapecio|Barra sobre la parte alta de la espalda;Empujá hacia arriba;Bajá a la nuca controlado|Solo con buena movilidad; si molesta, hacelo por delante.|Behind the Neck Press
Press de hombros con kettlebells|ho|K|ohp|Tríceps|Kettlebells en posición de rack;Empujá hacia arriba;Bajá controlado|Muñeca recta, sin doblarla.|Kettlebell Shoulder Press
Press de hombros en polea|ho|P|ohp|Tríceps|Sentado entre dos poleas bajas;Empujá las manijas hacia arriba;Bajá a las orejas|Tensión constante.|Cable Shoulder Press
Elevación lateral inclinada (a un brazo)|ho|M|raise|Trapecio|Acostado de costado en un banco inclinado;Subí la mancuerna hacia el costado;Bajá lento|Trabaja mucho el inicio del movimiento.|Incline Lateral Raise
Elevación lateral sentado|ho|M|raise|Trapecio|Sentado en el borde del banco;Subí los brazos a los costados hasta el hombro;Bajá lento|Sin impulso de piernas.|Seated Lateral Raise (Dumbbell)
Elevación en Y (scaption)|ho|M|raise|Trapecio|Brazos a 30° adelante del cuerpo, pulgares arriba;Subí hasta la altura del hombro;Bajá controlado|Muy buena para la salud del hombro.|Scaption
Pájaros en polea|ho|P|cfly|Espalda alta|Entre dos poleas altas, cruzando los cables;Abrí los brazos hacia atrás;Volvé controlado|Brazos casi rectos.|Rear Delt Fly (Cable)
Pájaros acostado en banco inclinado|ho|M|row|Espalda alta|Pecho apoyado en el banco inclinado;Abrí los brazos a los costados;Bajá lento|Sin envión.|Rear Delt Fly Incline (Dumbbell)
Rotación externa en polea|ho|P|raise||Codo pegado al cuerpo a 90°;Girá el antebrazo hacia afuera;Volvé controlado|Peso muy liviano; es para el manguito rotador.|External Rotation (Cable)
Remo al mentón en polea|tr|P|uprow|Hombro lateral|Polea baja con barra;Subí la barra pegada al cuerpo;Bajá controlado|Codos guían el movimiento.|Upright Row (Cable)
Press cubano|ho|M|ohp|Espalda alta|Remo al mentón, luego girá los antebrazos arriba;Empujá sobre la cabeza;Volvé en orden inverso|Muy liviano, es de movilidad y salud.|Cuban Press
Encogimientos en polea|tr|P|shrug|Antebrazos|Polea baja con barra;Subí los hombros a las orejas;Bajá lento|Pausa arriba de un segundo.|Cable Shrug
Curl Zottman|bi|M|curl|Antebrazos, braquial|Subí con palmas arriba;Arriba girá las palmas hacia abajo;Bajá lento así|Trabaja bíceps y antebrazo a la vez.|Zottman Curl
Curl arrastre (drag curl)|bi|B|curl|Antebrazos|Barra pegada al cuerpo;Subila arrastrándola por el torso llevando los codos atrás;Bajá igual|Carga mucho la cabeza larga del bíceps.|Drag Curl
Curl martillo cruzado|bi|M|curl|Braquial, antebrazos|Palma enfrentada al cuerpo;Subí la mancuerna cruzando hacia el hombro contrario;Bajá controlado|Alterná brazos.|Cross Body Hammer Curl
Curl en polea a un brazo|bi|P|curl|Antebrazos|Polea baja con manija;Subí sin mover el codo;Bajá controlado|Concentrate en un lado por vez.|Single Arm Cable Curl
Curl en banco Scott con polea|bi|P|curl|Braquial|Banco Scott frente a la polea baja;Subí la barra;Bajá casi hasta estirar|Tensión hasta abajo de todo.|Preacher Curl (Cable)
Curl con barra Z agarre cerrado|bi|Z|curl|Antebrazos|Agarre cerrado en la parte curva;Subí sin mover los codos;Bajá completo|Carga más la cabeza larga.|EZ Bar Curl Close Grip
Curl invertido con mancuernas|an|M|curl|Bíceps, braquial|Palmas hacia abajo;Subí sin mover los codos;Bajá controlado|Excelente para el antebrazo.|Reverse Curl (Dumbbell)
Press JM|tc|B|skull|Pecho|Acostado, agarre cerrado;Bajá la barra hacia el mentón doblando codos;Empujá de vuelta arriba|Mezcla de press cerrado y francés.|JM Press
Press Tate|tc|M|skull||Acostado, mancuernas arriba con palmas hacia los pies;Bajá las mancuernas hacia el pecho abriendo los codos;Estirá|Sentí el tríceps, no el pecho.|Tate Press
Extensión acostado en polea|tc|P|skull||Acostado frente a la polea baja con barra;Bajá la barra hacia la frente;Estirá|Tensión constante.|Lying Cable Triceps Extension
Extensión sobre la cabeza con barra|tc|B|ohext||De pie, barra arriba con agarre cerrado;Bajala detrás de la cabeza;Estirá hacia arriba|Codos apuntando al techo.|Overhead Triceps Extension (Barbell)
Extensión de tríceps inclinado (barra)|tc|B|skull||Banco inclinado, barra arriba;Bajá detrás de la cabeza;Estirá|Estira mucho la cabeza larga.|Incline Skull Crusher
Fondos en anillas|tc|C|dip|Pecho, hombros|Sostené las anillas con los brazos estirados;Bajá hasta 90°;Empujá|Muy exigente por la inestabilidad.|Ring Dips
Fondos en banco con peso|tc|D|dip|Pecho|Manos en el banco detrás, disco sobre los muslos;Bajá a 90°;Empujá|Sumá peso cuando pases las 15.|Weighted Bench Dip
Curl de muñeca en polea|an|P|wrist||Polea baja, antebrazos en los muslos;Subí la barra con las muñecas;Bajá controlado|Muchas repeticiones.|Cable Wrist Curl
Pinza con discos|an|D|hang||Agarrá dos discos lisos entre dedos y pulgar;Sostenelos con los brazos estirados;Aguantá|Anotá los segundos.|Plate Pinch
Sentadilla al cajón|cu|B|squat|Glúteos, isquiotibiales|Barra en la espalda, cajón detrás;Bajá hasta sentarte apenas en el cajón;Subí explosivo|Enseña a llevar la cadera atrás.|Box Squat
Sentadilla Zercher|cu|B|squat|Glúteos, abdominales|Barra en el pliegue de los codos;Bajá con el torso derecho;Subí|Muy buena para el core.|Zercher Squat
Sentadilla overhead|cu|B|squat|Hombros, abdominales|Barra arriba con agarre ancho;Bajá manteniendo la barra sobre la cabeza;Subí|Exige mucha movilidad.|Overhead Squat
Sentadilla sissy|cu|D|squat||Agarrado de un soporte, inclinate atrás;Bajá doblando las rodillas con la cadera estirada;Subí|Aísla mucho el cuádriceps.|Sissy Squat
Sentadilla pistol|cu|K|squat|Glúteos|Parado en una pierna, la otra adelante;Bajá lo más que puedas;Subí|Arrancá agarrado de algo.|Pistol Squat
Sentadilla hack con barra|cu|B|squat|Glúteos|Barra detrás de las piernas;Bajá en sentadilla;Subí empujando el piso|Carga mucho el cuádriceps.|Barbell Hack Squat
Sentadilla frontal con kettlebells|cu|K|squat|Glúteos, abdominales|Dos kettlebells en posición de rack;Bajá profundo;Subí|Codos adentro.|Front Squat (Kettlebell)
Estocada lateral|ad|B|lunge|Cuádriceps, glúteos|Paso grande al costado;Bajá sobre esa pierna con la otra estirada;Volvé|Trabaja aductores y glúteo medio.|Lateral Lunge
Estocada en Smith (split squat)|cu|S|lunge|Glúteos|Pies separados en la Smith;Bajá la rodilla de atrás;Subí|La guía da estabilidad.|Split Squat (Smith Machine)
Saltos al cajón|cu|C|jump|Glúteos, gemelos|Parado frente al cajón;Saltá con los dos pies;Bajá caminando|Bajar caminando cuida las rodillas.|Box Jump
Elevación de talones tipo burro|ge|Q|calf||Inclinado con el peso sobre la cadera;Subí en puntas de pie;Bajá estirando|Gran estiramiento del gemelo.|Donkey Calf Raise
Elevación de talones sentado con barra|ge|B|calf||Sentado con la barra sobre las rodillas;Subí los talones;Bajá completo|Trabaja el sóleo.|Seated Calf Raise (Barbell)
Crunch con peso|ab|D|crunch||Acostado con un disco al pecho;Subí enrollando el torso;Bajá controlado|Exhalá al subir.|Weighted Crunch
Crunch oblicuo|ab|C|crunch|Oblicuos|Acostado de costado con rodillas dobladas;Subí el torso de lado;Bajá|Contá cada lado.|Oblique Crunch
Crunch en polea de pie|ab|P|crunch||De espaldas a la polea alta con cuerda;Enrollá el torso hacia abajo;Volvé|El movimiento sale del abdomen.|Standing Cable Crunch
Toques de talón|ab|C|crunch|Oblicuos|Boca arriba, rodillas dobladas;Estirá un brazo hasta tocar el talón;Alterná|Hombros apenas despegados.|Heel Touches
Navaja (jackknife)|ab|C|crunch|Flexores de cadera|Acostado con brazos y piernas estirados;Subí piernas y torso a la vez;Bajá|Muy exigente.|Jackknife Sit Up
Flexión lateral con mancuerna|ab|M|shrug|Oblicuos|Parado con una mancuerna al costado;Inclinate hacia ese lado;Volvé|Una mano por vez.|Dumbbell Side Bend
Mountain climbers|ab|C|plank|Hombros, cuádriceps|En plancha alta;Llevá una rodilla al pecho y alterná rápido;Anotá segundos|Cadera baja.|Mountain Climber
Rueda abdominal con barra|ab|B|wheel|Dorsales, hombros|De rodillas con una barra con discos;Rodá adelante con el abdomen firme;Volvé|Andá hasta donde controles.|Barbell Rollout
Elevación de rodillas en banco|ab|C|lraise|Flexores de cadera|Sentado en el borde del banco;Traé las rodillas al pecho;Estirá sin tocar el piso|Inclinate atrás un poco.|Seated Knee Tuck
Cargada colgante (hang clean)|cc|B|clean|Trapecio, glúteos|Barra a la altura de los muslos;Extendé la cadera explosivo;Recibí la barra en los hombros|Técnica antes que peso.|Hang Clean
Cargada y press|cc|B|clean|Hombros, piernas|Cargá la barra a los hombros;Empujala arriba de la cabeza;Bajá controlado|Muy completo.|Clean and Press
Levantamiento turco (turkish get up)|cc|K|walk|Hombros, abdominales|Acostado con la kettlebell arriba;Levantate paso a paso sin bajar el brazo;Volvé|Lento y controlado.|Turkish Get Up
Slam con pelota medicinal|cc|C|jump|Hombros, abdominales|Pelota arriba de la cabeza;Tirala fuerte contra el piso;Agarrala y repetí|Explosivo.|Medicine Ball Slam
Volteo de neumático|cc|C|hinge|Piernas, espalda|Agarrá el neumático desde abajo;Empujá con piernas y cadera;Volteálo|Espalda recta.|Tire Flip
Arrastre de trineo|cc|Q|run|Piernas|Arnés o manijas del trineo;Caminá hacia adelante con pasos firmes;Anotá metros|Inclinate adelante.|Sled Drag
Saltos en tijera|cc|C|jump|Glúteos, cuádriceps|En posición de estocada;Saltá y cambiá de pierna en el aire;Caé suave|Ritmo constante.|Split Jump
Bicicleta reclinada|ca|Q|bike||Sentado con respaldo;Pedaleá a ritmo constante;Anotá los minutos|Cómoda para la espalda.|Recumbent Bike
Trote al aire libre|ca|C|run||Ritmo cómodo que te deje hablar;Mantené la postura;Anotá minutos y km|Calentá caminando.|Running
`;
const EXINFO=new Map(),ALIAS=new Map();
const normName=s=>s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'');
CATRAW.trim().split('\n').forEach(l=>{const [n,g,eq,pat,sec,steps,tip,al]=l.split('|');EXINFO.set(n,{g:GRP[g],eq,pat,sec,steps:(steps||'').split(';').filter(Boolean),tip});(al||'').split('/').forEach(a=>{if(a)ALIAS.set(normName(a),n)});ALIAS.set(normName(n),n)});
const CAT=[...EXINFO.entries()].map(([n,i])=>[n,i.g]);
const aliasName=n=>ALIAS.get(normName(n))||n;
function guessMuscle(name){name=String(name||'');
  const n=name.toLowerCase();
  const T=[
    [/treadmill|cinta|cycling|bicicleta|bike|elliptical|el[ií]ptico|rowing machine|stair|escalador|jump rope|soga|jumping jack|walking|running|correr/,'Cardio'],
    [/calf|gemel|tal[oó]n|pantorr/,'Gemelos'],
    [/wrist|mu[nñ]eca|reverse curl|curl invertido|dead hang|grip/,'Antebrazos'],
    [/crunch|plank|plancha|abdom|\bab\b|sit ?up|leg raise|knee raise|elevaci[oó]n de (piernas|rodillas)|russian|oblic|dead bug|hollow|pallof|core/,'Abdominales'],
    [/abduct|aduct|band walk/,'Aductores y abductores'],
    [/hip thrust|glute|gl[uú]te|puente|kickback|patada de gl/,'Glúteos'],
    [/romanian|rumano|leg curl|curl femoral|femoral|hamstring|isquio|nordic|n[oó]rdico|stiff leg|piernas r[ií]gidas/,'Isquiotibiales'],
    [/deadlift|peso muerto|good morning|buenos d[ií]as|hiperext|hyperext|back extension|superman|rack pull/,'Lumbares'],
    [/shrug|encogim|upright row|remo al ment/,'Trapecio'],
    [/squat|sentadilla|leg press|prensa|lunge|estocada|zancada|leg extension|extensi[oó]n de cu[aá]d|step ?up|hack|b[uú]lgara/,'Cuádriceps'],
    [/tricep|tr[ií]cep|skull|franc[eé]s|pushdown|push down|kickback|patada de tr|close grip|cerrado|overhead extension|diamond|diamante|dip machine/,'Tríceps'],
    [/curl|b[ií]cep|hammer|martillo|preacher|scott/,'Bíceps'],
    [/shoulder|hombro|lateral raise|elevaciones? lateral|front raise|frontal|overhead press|military|militar|arnold|face pull|rear delt|deltoid|p[aá]jaro|push press|landmine/,'Hombros'],
    [/bench|banca|chest|pecho|fly|apertura|crossover|cruce|pec deck|butterfly|push ?up|flexion|dip|fondos|incline|inclinado|declin/,'Pecho'],
    [/row|remo|pull ?up|chin ?up|dominada|pulldown|jal[oó]n|lat\b|pullover/,'Espalda'],
    [/clean|snatch|arranque|cargada|thruster|burpee|farmer|granjero|sled|trineo|battle|swing/,'Cuerpo completo']
  ];
  for(const [re,m] of T) if(re.test(n)) return m;
  return 'Otro';
}

/* ---------- figuras animadas (dibujo propio, vista de costado) ---------- */
const FBASE={h:[60,16],n:[60,26],e:[60,40],w:[60,53],p:[60,54],k:[60,71],a:[60,88]};
const LYING={h:[26,55],n:[36,57],p:[70,57],k:[86,58],a:[88,88]};
const ROWT={h:[30,30],n:[37,36],p:[62,50],k:[66,70],a:[60,88]};
const HINGE={h:[34,34],n:[40,40],e:[42,54],w:[44,67],p:[64,52],k:[68,70],a:[62,88]};
const SQB={h:[62,34],n:[58,42],p:[42,64],k:[58,70],a:[60,88]};
const PROPS={
  bench:'<rect x="26" y="61" width="66" height="5" rx="2" class="pf"/><path d="M32 66V90M86 66V90" class="pr"/>',
  benchlong:'<rect x="16" y="61" width="82" height="5" rx="2" class="pf"/><path d="M22 66V90M92 66V90" class="pr"/>',
  incline:'<path d="M38 38L70 63H94" class="pr pw"/><path d="M70 63V90M90 63V90" class="pr"/>',
  seat:'<path d="M46 16V62H78M60 62V90" class="pr pw"/>',
  bseat:'<path d="M44 63H76M60 63V90" class="pr pw"/>',
  floorseat:'<path d="M36 73H62M90 58V82" class="pr pw"/>',
  pullbar:'<path d="M36 4H92" class="pr pw"/>',
  bars:'<path d="M44 51H80M50 51V90M74 51V90" class="pr"/>',
  hyperbench:'<path d="M54 55L96 82M62 60L60 90M92 80V90" class="pr pw"/>',
  lowbench:'<rect x="12" y="52" width="28" height="6" rx="2" class="pf"/><path d="M18 58V90M34 58V90" class="pr"/>',
  lpseat:'<path d="M10 32L44 70H60M50 70V90" class="pr pw"/>',
  step:'<rect x="46" y="84" width="30" height="6" class="pf"/>',
  bike:'<path d="M44 57L62 76L82 46M62 76V90" class="pr pw"/><circle cx="62" cy="76" r="10" class="pr"/>'
};
const sh=(o,dy)=>Object.fromEntries(Object.entries(o).map(([k,v])=>[k,[v[0],v[1]+dy]]));
const FIG={
  press:{pr:'bench',A:{...LYING,e:[46,66],w:[40,50]},B:{e:[37,42],w:[37,28]}},
  incline:{pr:'incline',A:{h:[40,36],n:[47,43],e:[56,54],w:[52,40],p:[70,62],k:[86,60],a:[88,88]},B:{e:[49,30],w:[48,17]}},
  cpress:{pr:'seat',A:{h:[54,22],n:[56,30],e:[48,40],w:[62,36],p:[56,60],k:[76,60],a:[78,86]},B:{e:[70,32],w:[84,32]}},
  fly:{pr:'bench',A:{...LYING,e:[40,68],w:[42,80]},B:{e:[38,44],w:[38,30]}},
  cfly:{anc:[20,-6],A:{e:[50,34],w:[40,38]},B:{e:[68,38],w:[76,46]}},
  dip:{pr:'bars',A:{h:[60,34],n:[60,42],e:[48,40],w:[60,50],p:[60,66],k:[62,80],a:[52,86]},B:{h:[60,20],n:[60,28],e:[58,40],w:[60,50],p:[60,52],k:[62,66],a:[52,72]}},
  pushup:{A:{h:[22,76],n:[30,78],e:[40,72],w:[32,88],p:[66,80],k:[84,84],a:[102,88]},B:{h:[22,58],n:[30,62],e:[31,75],w:[32,88],p:[66,72],k:[84,80],a:[102,88]}},
  pullover:{pr:'bench',A:{...LYING,e:[24,58],w:[12,62]},B:{e:[37,44],w:[38,30]}},
  pullup:{pr:'pullbar',A:{h:[58,18],n:[60,27],e:[65,15],w:[64,4],p:[60,54],k:[62,70],a:[58,86]},B:{h:[58,4],n:[60,13],e:[72,18],w:[64,4],p:[60,40],k:[62,56],a:[58,72]}},
  hang:{pr:'pullbar',A:{h:[58,18],n:[60,27],e:[63,15],w:[64,4],p:[60,54],k:[61,71],a:[60,88]},B:{h:[58,19],n:[60,28],p:[60,55],k:[61,72],a:[60,89]}},
  hlr:{pr:'pullbar',A:{h:[57,18],n:[60,27],e:[63,15],w:[64,4],p:[60,54],k:[60,71],a:[60,88]},B:{k:[77,54],a:[94,54]}},
  pulldown:{pr:'bseat',anc:[64,-10],A:{h:[58,30],n:[60,38],e:[63,24],w:[64,10],p:[60,62],k:[78,60],a:[78,86]},B:{e:[70,50],w:[66,38]}},
  sapd:{anc:[82,-10],A:{e:[68,16],w:[76,6]},B:{e:[63,40],w:[66,52]}},
  row:{A:{...ROWT,e:[38,50],w:[38,64]},B:{e:[50,42],w:[45,56]}},
  crow:{pr:'floorseat',anc:[114,48],A:{h:[50,34],n:[52,42],e:[64,48],w:[78,48],p:[50,70],k:[70,62],a:[88,72]},B:{e:[40,50],w:[54,50]}},
  hinge:{A:HINGE,B:{...FBASE}},
  hyper:{pr:'hyperbench',A:{h:[46,82],n:[50,74],e:[54,74],w:[52,70],p:[60,52],k:[78,64],a:[94,74]},B:{h:[31,35],n:[38,40],e:[44,44],w:[42,40]}},
  shrug:{A:{},B:{h:[60,12],n:[60,22],e:[60,36],w:[60,49]}},
  uprow:{A:{e:[60,40],w:[62,52]},B:{e:[72,24],w:[64,30]}},
  ohp:{A:{e:[68,36],w:[66,24]},B:{e:[66,14],w:[66,2]}},
  raise:{A:{e:[61,39],w:[62,52]},B:{e:[73,28],w:[86,28]}},
  facepull:{anc:[114,24],A:{e:[74,28],w:[88,26]},B:{e:[72,22],w:[68,12]}},
  curl:{A:{e:[60,40],w:[62,54]},B:{e:[60,40],w:[70,30]}},
  triext:{anc:[72,-10],A:{h:[58,16],e:[61,40],w:[71,31]},B:{e:[61,40],w:[63,54]}},
  ohext:{anc:[40,70],A:{e:[64,10],w:[55,18]},B:{e:[64,10],w:[66,-4]}},
  skull:{pr:'bench',A:{...LYING,e:[38,42],w:[28,48]},B:{e:[38,42],w:[39,28]}},
  tkick:{A:{...ROWT,e:[52,40],w:[50,54]},B:{e:[52,40],w:[66,40]}},
  wrist:{pr:'bseat',A:{h:[70,31],n:[66,38],e:[64,56],w:[79,59],p:[56,61],k:[78,61],a:[80,87]},B:{w:[79,50]}},
  squat:{A:{e:[52,34],w:[56,26]},B:{...SQB,e:[50,50],w:[56,42]}},
  lunge:{A:{e:[60,40],w:[60,53],k:[66,71],a:[72,88],k2:[56,71],a2:[48,88]},B:{h:[60,24],n:[60,34],e:[60,48],w:[60,61],p:[60,62],k:[74,70],a:[74,88],k2:[52,80],a2:[38,86]}},
  legpress:{pr:'lpseat',dyn:'plat',A:{h:[22,40],n:[28,47],e:[34,58],w:[40,66],p:[44,66],k:[54,46],a:[70,56]},B:{k:[64,52],a:[84,48]}},
  legcurl:{pr:'benchlong',dyn:'pad',A:{h:[22,53],n:[30,57],e:[24,64],w:[16,64],p:[64,57],k:[86,57],a:[106,57]},B:{a:[92,38]}},
  legext:{pr:'seat',dyn:'pad',A:{h:[50,22],n:[52,30],e:[54,44],w:[60,56],p:[56,58],k:[76,58],a:[78,80]},B:{a:[96,52]}},
  slegcurl:{pr:'seat',dyn:'pad',A:{h:[50,22],n:[52,30],e:[54,44],w:[60,56],p:[56,58],k:[76,58],a:[96,52]},B:{a:[78,80]}},
  calf:{pr:'step',A:sh(FBASE,-6),B:sh(FBASE,-11)},
  hipthrust:{pr:'lowbench',A:{h:[28,46],n:[38,54],e:[46,60],w:[56,66],p:[60,78],k:[76,64],a:[80,88]},B:{e:[46,56],w:[58,56],p:[60,57],k:[80,58],a:[82,88]}},
  bridge:{A:{h:[22,84],n:[32,84],e:[40,86],w:[50,86],p:[58,86],k:[74,68],a:[82,88]},B:{n:[32,82],p:[58,70],k:[78,64]}},
  kickback:{anc:[104,88],cab:'a2',A:{h:[56,16],n:[58,26],e:[62,40],w:[66,50],k2:[60,71],a2:[60,88]},B:{k2:[50,68],a2:[40,82]}},
  abduct:{anc:[104,88],cab:'a2',A:{k:[56,71],a:[56,88],k2:[64,71],a2:[64,88]},B:{k2:[70,69],a2:[78,84]}},
  crunch:{A:{h:[30,84],n:[40,84],e:[36,76],w:[32,80],p:[64,84],k:[78,68],a:[92,86]},B:{h:[42,64],n:[48,72],e:[42,62],w:[40,68]}},
  kcrunch:{anc:[62,-10],A:{h:[58,30],n:[60,38],e:[54,30],w:[56,24],p:[60,64],k:[60,86],a:[80,88]},B:{h:[36,62],n:[42,56],e:[36,46],w:[40,42]}},
  plank:{A:{h:[22,62],n:[30,66],e:[32,84],w:[44,84],p:[66,72],k:[86,78],a:[104,84]},B:{p:[66,75]}},
  lraise:{A:{h:[24,84],n:[32,84],e:[42,86],w:[54,86],p:[60,84],k:[78,84],a:[96,84]},B:{k:[72,70],a:[80,54]}},
  wheel:{dyn:'wheel',A:{h:[44,46],n:[50,52],e:[50,66],w:[50,82],p:[66,64],k:[70,86],a:[90,88]},B:{h:[22,72],n:[30,74],e:[20,78],w:[14,82],p:[54,78]}},
  nordic:{A:{h:[60,28],n:[60,36],e:[64,48],w:[64,58],p:[60,62],k:[60,86],a:[82,88]},B:{h:[22,54],n:[28,60],e:[24,70],w:[22,80],p:[44,74]}},
  run:{A:{h:[63,16],n:[62,26],e:[56,38],w:[64,44],p:[60,54],k:[70,64],a:[66,82],k2:[54,70],a2:[44,76]},B:{e:[68,36],w:[74,28],k:[54,70],a:[44,76],k2:[70,64],a2:[66,82]}},
  bike:{pr:'bike',A:{h:[44,22],n:[50,30],e:[66,40],w:[80,45],p:[46,54],k:[64,48],a:[64,70],k2:[60,60],a2:[56,80]},B:{k:[60,60],a:[56,80],k2:[64,48],a2:[64,70]}},
  jj:{A:{e:[56,40],w:[54,52],e2:[64,40],w2:[66,52],k:[57,71],a:[56,88],k2:[63,71],a2:[64,88]},B:{e:[48,18],w:[42,6],e2:[72,18],w2:[78,6],k:[52,71],a:[46,88],k2:[68,71],a2:[74,88]}},
  jump:{A:{...SQB,e:[66,50],w:[74,52]},B:{h:[60,10],n:[60,20],e:[62,6],w:[62,-6],p:[60,48],k:[60,65],a:[60,82]}},
  clean:{A:HINGE,B:{...FBASE,e:[68,36],w:[66,26]}},
  thruster:{A:{...SQB,e:[66,48],w:[62,40]},B:{...FBASE,e:[66,14],w:[66,2]}},
  swing:{A:{...HINGE,e:[46,54],w:[54,66]},B:{...FBASE,e:[72,32],w:[84,34]}},
  walk:{A:{k:[64,71],a:[66,88],k2:[56,71],a2:[54,88]},B:{k:[56,71],a:[54,88],k2:[64,71],a2:[66,88]}}
};
const PAT_BY_GROUP={'Pecho':'press','Espalda':'row','Lumbares':'hinge','Trapecio':'shrug','Hombros':'ohp','Bíceps':'curl','Tríceps':'triext','Antebrazos':'wrist','Cuádriceps':'squat','Isquiotibiales':'hinge','Glúteos':'hipthrust','Aductores y abductores':'abduct','Gemelos':'calf','Abdominales':'crunch','Cardio':'run','Cuerpo completo':'jump','Otro':'walk'};
function guessEq(n){n=n.toLowerCase();return /smith/.test(n)?'S':/barbell|\bbarra\b|barra\)|ez bar|barra z/.test(n)?(/ez|barra z/.test(n)?'Z':'B'):/dumbbell|mancuerna/.test(n)?'M':/cable|polea/.test(n)?'P':/machine|m[aá]quina|pec deck|leg press|prensa/.test(n)?'Q':/kettlebell/.test(n)?'K':/plate|disco/.test(n)?'D':'C'}
function exMeta(name){
  const i=EXINFO.get(name);if(i)return i;
  const g=muscleOf(name);return{g,eq:guessEq(name),pat:PAT_BY_GROUP[g]||'walk',sec:'',steps:[],tip:''};
}
const poseCache={};
function poses(pat){
  if(poseCache[pat])return poseCache[pat];
  const f=FIG[pat]||FIG.walk;const A={...FBASE,...f.A};const B={...A,...f.B};
  return poseCache[pat]={A,B,f};
}
function figSVG(name,t,cls){
  const m=exMeta(name);const {A,B,f}=poses(m.pat);
  const P={};for(const k in B){const a=A[k]||B[k],b=B[k];P[k]=[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]}
  const L=(p,q,c='b')=>P[p]&&P[q]?`<line class="${c}" x1="${P[p][0].toFixed(1)}" y1="${P[p][1].toFixed(1)}" x2="${P[q][0].toFixed(1)}" y2="${P[q][1].toFixed(1)}"/>`:'';
  let s='<ellipse cx="60" cy="91" rx="46" ry="3" class="gs"/><line x1="4" y1="90" x2="116" y2="90" class="fl"/>'+(PROPS[f.pr]||'');
  const eq=m.eq;
  if(eq==='P'){const at=P[f.cab||'w'];const anc=f.anc||[Math.min(112,at[0]+26),90];s+=`<line class="cb" x1="${anc[0]}" y1="${anc[1]}" x2="${at[0].toFixed(1)}" y2="${at[1].toFixed(1)}"/>`}
  s+=L('k2','p','b b2')+L('k2','a2','b b2')+L('e2','n','b b2')+L('e2','w2','b b2');
  s+=L('n','p','b tor')+L('p','k','b leg')+L('k','a','b leg')+L('n','h')+L('n','e','b arm')+L('e','w','b arm');
  s+=`<circle class="hd" cx="${P.h[0].toFixed(1)}" cy="${P.h[1].toFixed(1)}" r="6.5"/>`;
  const w=P.w,a=P.a;
  if(f.dyn==='plat')s+=`<line class="pr pw" x1="${(a[0]+4).toFixed(1)}" y1="${(a[1]-12).toFixed(1)}" x2="${(a[0]+8).toFixed(1)}" y2="${(a[1]+10).toFixed(1)}"/>`;
  if(f.dyn==='pad')s+=`<circle class="eq" cx="${a[0].toFixed(1)}" cy="${a[1].toFixed(1)}" r="3.5"/>`;
  if(f.dyn==='wheel')s+=`<circle class="pr pw" cx="${w[0].toFixed(1)}" cy="${(w[1]+2).toFixed(1)}" r="5"/>`;
  if(eq==='B'||eq==='Z'||eq==='S')s+=`<circle class="eq" cx="${w[0].toFixed(1)}" cy="${w[1].toFixed(1)}" r="7"/><circle class="eqh" cx="${w[0].toFixed(1)}" cy="${w[1].toFixed(1)}" r="2"/>`;
  else if(eq==='D')s+=`<circle class="eq" cx="${w[0].toFixed(1)}" cy="${w[1].toFixed(1)}" r="5.5"/>`;
  else if(eq==='M')s+=`<rect class="eq" x="${(w[0]-6).toFixed(1)}" y="${(w[1]-2.5).toFixed(1)}" width="12" height="5" rx="2"/>`;
  else if(eq==='K')s+=`<circle class="eq" cx="${w[0].toFixed(1)}" cy="${(w[1]+5).toFixed(1)}" r="4.5"/>`;
  return `<svg class="fig ${cls||''}" viewBox="0 -12 120 106" aria-hidden="true">${s}</svg>`;
}

/* ---------- mapa muscular (frente y espalda) ---------- */
const MK_GROUP={'Pecho':['pec'],'Espalda':['lat','trapl'],'Lumbares':['low'],'Trapecio':['trap'],'Hombros':['delf','dels'],'Bíceps':['bic'],'Tríceps':['tri'],'Antebrazos':['fore'],'Cuádriceps':['quad'],'Isquiotibiales':['ham'],'Glúteos':['glu'],'Aductores y abductores':['add','abd'],'Gemelos':['calf'],'Abdominales':['abs','obl'],'Cardio':['quad','ham','glu','calf'],'Cuerpo completo':['quad','glu','ham','low','trap','delf','dels']};
const MK_SEC=[[/hombro frontal/,['delf']],[/hombro lateral/,['dels']],[/deltoides posterior|hombro posterior/,['delr']],[/hombro/,['delf','dels']],[/tr[ií]ceps/,['tri']],[/b[ií]ceps|braquial/,['bic']],[/pecho/,['pec']],[/espalda alta/,['trapl','delr']],[/dorsal/,['lat']],[/espalda/,['lat']],[/lumbar/,['low']],[/trapecio/,['trap']],[/antebrazo/,['fore']],[/gl[uú]teo/,['glu']],[/isquio/,['ham']],[/cu[aá]driceps/,['quad']],[/piernas/,['quad','ham','glu']],[/aductor/,['add']],[/abductor/,['abd']],[/gemelo/,['calf']],[/abdominal|core/,['abs']],[/oblicuo/,['obl']],[/flexores de cadera/,['hip']]];
function musclesOf(name){
  const m=exMeta(name),n=name.toLowerCase();let prim=[...(MK_GROUP[m.g]||[])];
  if(m.g==='Hombros'){if(/posterior|p[aá]jaro|face pull|rear/.test(n))prim=['delr'];else if(/lateral/.test(n))prim=['dels'];else if(/frontal/.test(n))prim=['delf'];else if(/remo al ment/.test(n))prim=['dels','trap']}
  if(m.g==='Espalda'&&/remo|row/.test(n))prim=['lat','trapl','delr'];
  if(m.g==='Abdominales'&&/russian|le[ñn]ador|oblic|pallof|lateral/.test(n))prim=['obl'];
  if(m.g==='Aductores y abductores')prim=/abduc/.test(n)?['abd']:/aduc/.test(n)?['add']:['add','abd'];
  const sec=new Set();const t=(m.sec||'').toLowerCase();
  MK_SEC.forEach(([re,ks])=>{if(re.test(t))ks.forEach(k=>{if(!prim.includes(k))sec.add(k)})});
  return{prim:new Set(prim),sec};
}
function muscleMap(name){
  const {prim,sec}=musclesOf(name);
  const cls=k=>prim.has(k)?'mm on':sec.has(k)?'mm half':'mm';
  const E=(k,cx,cy,rx,ry,rot=0)=>`<ellipse class="${cls(k)}" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"${rot?` transform="rotate(${rot} ${cx} ${cy})"`:''}/>`;
  const both=(c,f)=>f(1,c)+f(-1,c);
  const sil=c=>`<circle class="sk" cx="${c}" cy="16" r="10"/><path class="sk" d="M${c-21} 34Q${c} 29 ${c+21} 34L${c+17} 98Q${c} 106 ${c-17} 98Z"/>`+
    [1,-1].map(s=>`<path class="skl" d="M${c-s*22} 38L${c-s*30} 70L${c-s*34} 104" stroke-width="11"/><path class="skl" d="M${c-s*9} 100L${c-s*12} 150L${c-s*13} 202" stroke-width="15"/>`).join('');
  const F=57,B=173;
  let fr=sil(F);
  fr+=both(F,(s,c)=>E('delf',c-s*23,41,7,6.5));
  fr+=both(F,(s,c)=>`<path class="${cls('pec')}" d="M${c-s*1} 40L${c-s*17} 40Q${c-s*21} 48 ${c-s*16} 56Q${c-s*8} 60 ${c-s*1} 57Z"/>`);
  fr+=both(F,(s,c)=>E('bic',c-s*28,57,4.5,9,s*14));
  fr+=both(F,(s,c)=>E('fore',c-s*32,85,4,11,s*7));
  fr+=`<rect class="${cls('abs')}" x="${F-7}" y="60" width="14" height="33" rx="4"/>`;
  fr+=both(F,(s,c)=>E('obl',c-s*13.5,75,3.5,11));
  fr+=both(F,(s,c)=>E('hip',c-s*9,97,3,4));
  fr+=both(F,(s,c)=>E('quad',c-s*11.5,127,7,21,s*-4));
  fr+=both(F,(s,c)=>E('add',c-s*4,114,2.6,10));
  fr+=both(F,(s,c)=>E('calf',c-s*12.5,170,4,13));
  let bk=sil(B);
  bk+=`<path class="${cls('trap')}" d="M${B} 25L${B-14} 38L${B} 64L${B+14} 38Z"/>`;
  bk+=both(B,(s,c)=>E(prim.has('dels')||sec.has('dels')?'dels':'delr',c-s*23,41,7,6.5));
  bk+=both(B,(s,c)=>`<path class="${cls('lat')}" d="M${c-s*4} 52L${c-s*17} 45Q${c-s*21} 62 ${c-s*12} 83L${c-s*4} 79Z"/>`);
  bk+=both(B,(s,c)=>E('trapl',c-s*8,49,3.5,6));
  bk+=`<rect class="${cls('low')}" x="${B-6}" y="80" width="12" height="15" rx="3"/>`;
  bk+=both(B,(s,c)=>E('tri',c-s*28,58,4.5,9.5,s*14));
  bk+=both(B,(s,c)=>E('fore',c-s*32,85,4,11,s*7));
  bk+=both(B,(s,c)=>E('abd',c-s*16.5,99,3.2,6));
  bk+=both(B,(s,c)=>E('glu',c-s*8.5,106,8.5,9));
  bk+=both(B,(s,c)=>E('ham',c-s*11.5,134,7,18,s*-4));
  bk+=both(B,(s,c)=>E('calf',c-s*12.5,168,5.5,12.5));
  return `<svg class="mmap" viewBox="0 0 230 222" role="img" aria-label="Músculos que trabaja"><g>${fr}</g><g>${bk}</g><text x="${F}" y="217" text-anchor="middle">Frente</text><text x="${B}" y="217" text-anchor="middle">Espalda</text></svg>`;
}
function musclesLegend(name){const {prim,sec}=musclesOf(name);return prim.size?`<div class="mleg"><span><i class="sw on"></i>Principal</span>${sec.size?'<span><i class="sw half"></i>Secundario</span>':''}</div>`:''}
const EXIMG=/*EXIMG*/{map:{},cols:1,rows:1};
const photoOf=name=>EXIMG.map[name]||null;
const thumb=name=>{const p=photoOf(name);if(!p)return figSVG(name,.55,'th');const c=EXIMG.cols,r=EXIMG.rows,i=p[1];return `<span class="exph" style="background-size:${c*100}% ${r*100}%;background-position:${(i%c)/(c-1)*100}% ${Math.floor(i/c)/(r-1)*100}%"></span>`};
let figAnim=0;
function animateFig(el,name){
  cancelAnimationFrame(figAnim);
  const still=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(still){el.innerHTML=figSVG(name,1);return}
  const t0=performance.now();
  const step=now=>{if(!el.isConnected)return;const ph=((now-t0)/2600)%1;const t=(1-Math.cos(ph*2*Math.PI))/2;el.innerHTML=figSVG(name,t);figAnim=requestAnimationFrame(step)};
  figAnim=requestAnimationFrame(step);
}

/* ---------- estado ---------- */
const S={
  tab:'inicio', workouts:[], routines:[], body:[], custom:[], ajustes:{descanso:90},
  active:null, rest:null, mode:'cargando', loaded:{},
  progEx:null, progMetric:'e1', range:'90', feedN:10,
  sample:null, assets:null, downloads:null, isOwner:true, blobs:{}, busy:{}, importPrev:null
};
try{const t=lsGet('fierro:tab');if(t)S.tab=t}catch{}

/* ---------- almacenamiento (base de datos de Claude o, si no hay, este navegador) ---------- */
const store={
  db:null,
  async init(){
    let db=null,uidv=null;
    try{if(window.claude&&window.claude.use){const [d,u]=await Promise.all([window.claude.use('db'),window.claude.use('user')]);if(d&&u){uidv=await u.id();if(uidv)db=d}}}catch{db=null}
    // quien abre por link sin permiso de escritura puede leer pero no guardar: en ese caso todo va a este dispositivo
    if(db){try{await db.doc(`data/users/${uidv}/fierro/config/_w`).set({t:Date.now()})}catch(e){if(e&&/invalid_argument|permission|not_granted|forbidden/.test(e.code||''))db=null}}
    this.db=db; this.base=uidv?`data/users/${uidv}/fierro/`:''; S.mode=db?'nube':'local';
    const watchCol=(name,key,sortFn)=>{
      if(db){
        db.collection(this.base+name).onSnapshot(snap=>{
          S[key]=snap.docs.map(d=>({...JSON.parse(JSON.stringify(d.data()||{})),id:d.id})).sort(sortFn);S.loaded[key]=true;schedule();
        },err=>{setStatus('No se pudieron leer los datos ('+(err&&err.code||'error')+').',true)});
      }else{
        const m=lsGet('fierro:col:'+name)||{};S[key]=Object.entries(m).map(([id,v])=>({...v,id})).sort(sortFn);S.loaded[key]=true;
      }
    };
    watchCol('workouts','workouts',(a,b)=>b.start-a.start);
    watchCol('routines','routines',(a,b)=>(a.name||'').localeCompare(b.name||''));
    watchCol('body','body',(a,b)=>b.date-a.date);
    const ej=await this.getDoc('config/ejercicios'); S.custom=(ej&&ej.lista)||[];_exMap=null;
    const aj=await this.getDoc('config/ajustes'); if(aj) S.ajustes={...S.ajustes,...aj};
    if(!S.active){const a=await this.getDoc('estado/activo'); if(a&&a.w){S.active=a.w}else{const l=lsGet('fierro:activo');if(l)S.active=l}}
    if(!db)await loadLocalPhotos();
    setStatus(db?'':'Guardado en este dispositivo',false);
    render(true);
  },
  async getDoc(path){
    if(this.db){try{const s=await this.db.doc(this.base+path).get();return s.exists?JSON.parse(JSON.stringify(s.data()||null)):null}catch{return null}}
    return lsGet('fierro:doc:'+path);
  },
  async setDoc(path,data){
    if(this.db)return this.db.doc(this.base+path).set(data);
    lsSet('fierro:doc:'+path,data);
  },
  async put(col,id,data){
    const clean=JSON.parse(JSON.stringify(data));delete clean.id;
    if(this.db)return this.db.collection(this.base+col).doc(id).set(clean);
    const m=lsGet('fierro:col:'+col)||{};m[id]=clean;lsSet('fierro:col:'+col,m);
    const key={workouts:'workouts',routines:'routines',body:'body'}[col];
    const i=S[key].findIndex(x=>x.id===id);const row={...clean,id};
    if(i>=0)S[key][i]=row;else S[key].push(row);
    S[key].sort(col==='workouts'?(a,b)=>b.start-a.start:col==='body'?(a,b)=>b.date-a.date:(a,b)=>(a.name||'').localeCompare(b.name||''));
    schedule();
  },
  async del(col,id){
    if(this.db)return this.db.collection(this.base+col).doc(id).delete();
    const m=lsGet('fierro:col:'+col)||{};delete m[id];lsSet('fierro:col:'+col,m);
    const key={workouts:'workouts',routines:'routines',body:'body'}[col];S[key]=S[key].filter(x=>x.id!==id);schedule();
  }
};
/* fotos guardadas en este dispositivo (cuando no se pueden subir a la nube) */
const idb={_db:null,open(){if(this._db)return this._db;return this._db=new Promise((res,rej)=>{try{const r=indexedDB.open('fierro-fotos',1);r.onupgradeneeded=()=>r.result.createObjectStore('f');r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)}catch(e){rej(e)}})},
  async op(mode,fn){const d=await this.open();return new Promise((res,rej)=>{const tx=d.transaction('f',mode);const st=tx.objectStore('f');const r=fn(st);tx.oncomplete=()=>res(r&&r.result);tx.onerror=()=>rej(tx.error)})},
  put(k,v){return this.op('readwrite',st=>st.put(v,k))},get(k){return this.op('readonly',st=>st.get(k))},del(k){return this.op('readwrite',st=>st.delete(k))}};
async function loadLocalPhotos(){for(const b of S.body){if(!b.localPhoto||S.blobs[b.id])continue;try{const bl=await idb.get(b.id);if(bl)S.blobs[b.id]={blob:bl,url:URL.createObjectURL(bl)}}catch{}}}
function setStatus(t,warn){const el=$('#gym-status');el.textContent=t;el.classList.toggle('warn',!!warn)}

/* ---------- cálculos ---------- */
let _exMap=null;const allEx=()=>{if(_exMap)return _exMap;const m=new Map();CAT.forEach(([n,g])=>m.set(n,g));S.custom.forEach(c=>m.set(c.name,c.muscle));return _exMap=m};
function muscleOf(name){return allEx().get(name)||guessMuscle(name)}
const doneSets=ex=>(ex.sets||[]).filter(s=>s.done&&!s.w&&(+s.reps>0));
const isCardio=ex=>!!ex&&(MUSCLES.includes(ex.muscle)?ex.muscle:muscleOf(ex.name))==='Cardio';
const numv=v=>parseFloat(String(v==null?'':v).replace(',','.'))||0;
function cardioTxt(sets){const km=sets.reduce((a,s)=>a+numv(s.kg),0),mn=sets.reduce((a,s)=>a+numv(s.reps),0);return (km?nf(km,1)+' km · ':'')+nf(mn)+' min'}
// el cardio no suma volumen ni series de fuerza (en cardio se anota km en "kg" y minutos en "reps")
function wStats(w){let vol=0,sets=0;(w.exercises||[]).forEach(ex=>{if(isCardio(ex))return;doneSets(ex).forEach(s=>{vol+=(+s.kg||0)*(+s.reps||0)+dropVol(s);sets++})});return{vol,sets}}
// drop set: después de la serie se baja el peso y se sigue sin descanso. Se guarda dentro de la misma serie.
const dropsOf=s=>Array.isArray(s&&s.drop)?s.drop:[];
const dropVol=s=>dropsOf(s).reduce((a,d)=>a+(parseNum(d.kg)||0)*(parseNum(d.reps)||0),0);
const dropTxt=s=>dropsOf(s).filter(d=>parseNum(d.reps)>0).map(d=>(parseNum(d.kg)?nf(parseNum(d.kg))+'×':'')+Math.round(parseNum(d.reps))).join(' + ');
const dropGuess=(s,i)=>{const base=i>0?parseNum(dropsOf(s)[i-1].kg||0):parseNum(s.kg||0);return base>0?Math.max(0,Math.round(base*0.75/2.5)*2.5):''};
function bestSet(sets){let b=null;for(const s of sets){const v=e1rm(+s.kg,+s.reps);if(!b||v>b.e1||(v===b.e1&&+s.reps>b.reps))b={kg:+s.kg,reps:+s.reps,e1:v}}return b}
function history(name){
  const out=[];
  [...S.workouts].sort((a,b)=>a.start-b.start).forEach(w=>(w.exercises||[]).forEach(ex=>{
    if(ex.name!==name)return;const ds=doneSets(ex);if(!ds.length)return;
    const b=bestSet(ds);
    out.push({t:w.start,wid:w.id,e1:b.e1,best:b,maxKg:Math.max(...ds.map(s=>+s.kg||0)),reps:Math.max(...ds.map(s=>+s.reps||0)),vol:ds.reduce((a,s)=>a+(+s.kg||0)*(+s.reps||0),0),n:ds.length});
  }));
  return out;
}
function lastSetsOf(name,beforeMs=Infinity){
  for(const w of S.workouts){if(w.start>=beforeMs)continue;const ex=(w.exercises||[]).find(e=>e.name===name);if(ex){const s=(ex.sets||[]).filter(x=>x.done);if(s.length)return s}}
  return null;
}
function exerciseCounts(){const m=new Map();S.workouts.forEach(w=>(w.exercises||[]).forEach(ex=>{if(doneSets(ex).length)m.set(ex.name,(m.get(ex.name)||0)+1)}));return[...m.entries()].sort((a,b)=>b[1]-a[1])}
function muscleSets(days){const from=Date.now()-days*DAY;const m={};MUSCLES.forEach(x=>m[x]=0);S.workouts.forEach(w=>{if(w.start<from)return;(w.exercises||[]).forEach(ex=>{m[MUSCLES.includes(ex.muscle)?ex.muscle:muscleOf(ex.name)]+=doneSets(ex).length})});return m}
function weeksStreak(){
  if(!S.workouts.length)return 0;const weeks=new Set(S.workouts.map(w=>startOfWeek(w.start)));
  let wk=startOfWeek(Date.now());if(!weeks.has(wk))wk-=7*DAY;let n=0;
  while(weeks.has(wk)){n++;wk=startOfWeek(wk-3*DAY)}return n;
}
function computePRs(w){
  const prs=[];
  (w.exercises||[]).forEach(ex=>{
    const ds=doneSets(ex);if(!ds.length||isCardio(ex))return;
    const prev=history(ex.name).filter(h=>h.wid!==w.id&&h.t<w.start);if(!prev.length)return;
    const b=bestSet(ds),pe1=Math.max(...prev.map(h=>h.e1)),pkg=Math.max(...prev.map(h=>h.maxKg)),prp=Math.max(...prev.map(h=>h.reps));
    const mk=Math.max(...ds.map(s=>+s.kg||0));
    if(mk>0&&mk>pkg)prs.push({ex:ex.name,tipo:'Peso máximo',txt:`${nf(mk)} kg`});
    else if(b.e1>0&&b.e1>pe1+0.01)prs.push({ex:ex.name,tipo:'1RM estimado',txt:`${nf(b.e1)} kg`});
    else if(mk===0&&b.reps>prp)prs.push({ex:ex.name,tipo:'Más repeticiones',txt:`${b.reps} reps`});
  });
  return prs;
}

/* ---------- render general ---------- */
let rq=0;function schedule(){if(rq)return;rq=requestAnimationFrame(()=>{rq=0;render()})}
let pendingRender=false;
function render(force){
  const ae=document.activeElement;
  if(!force&&ae&&$('#gym-view').contains(ae)&&/INPUT|TEXTAREA|SELECT/.test(ae.tagName)){pendingRender=true;return}
  if(!force&&S.tab==='entrenar'&&S.active){pendingRender=true;return}
  pendingRender=false;
  $$('#gym-nav button').forEach(b=>b.setAttribute('aria-current',String(b.dataset.tab===S.tab)));
  CH={};chartSeq=0;
  const v=$('#gym-view');
  const fn={inicio:vInicio,entrenar:vEntrenar,progreso:vProgreso,fisico:vFisico,perfil:vPerfil}[S.tab]||vInicio;
  v.innerHTML=fn();
  drawCharts();
  renderRest();
  try{window.PORCION&&window.PORCION.onGym()}catch{}
}
document.addEventListener('change',e=>{if(e.target&&e.target.id==='bf-photo'){const f=e.target.files[0],im=$('#bf-prev'),t=$('#bf-photo-t');if(f&&im){im.src=URL.createObjectURL(f);im.hidden=false;if(t)t.textContent='Cambiar foto'}}});
document.addEventListener('focusout',()=>setTimeout(()=>{if(pendingRender&&!(S.tab==='entrenar'&&S.active))render()},0));
$$('#gym-nav button').forEach(b=>b.addEventListener('click',()=>{S.tab=b.dataset.tab;lsSet('fierro:tab',S.tab);render(true);window.scrollTo(0,0)}));
const loadingCard=()=>`<div class="card empty"><p class="muted" style="margin:0">Cargando…</p></div>`;

/* ---------- INICIO ---------- */
function vInicio(){
  if(!S.loaded.workouts)return loadingCard();
  const now=Date.now(),ws=startOfWeek(now),today=dayKey(now),d0=new Date(now);
  const trained=new Set(S.workouts.map(w=>dayKey(w.start)));
  const L=['L','M','X','J','V','S','D'];
  let week='';for(let i=0;i<7;i++){const t=ws+i*DAY+3600e3;const k=dayKey(t);const d=new Date(t);
    week+=`<div class="d">${L[i]}<div class="b ${trained.has(k)?'on':''} ${k===today&&!trained.has(k)?'today':''}">${d.getDate()}</div></div>`}
  const d=new Date(now),mThis=monKey(now),dom=d.getDate();
  const inM=S.workouts.filter(w=>monKey(w.start)===mThis);
  const prevSame=S.workouts.filter(w=>monKey(w.start)===mThis-1&&new Date(w.start).getDate()<=dom);
  const volM=inM.reduce((a,w)=>a+wStats(w).vol,0),volP=prevSame.reduce((a,w)=>a+wStats(w).vol,0);
  const prM=inM.reduce((a,w)=>a+(w.prs||[]).length,0);
  const dv=volP?Math.round((volM-volP)/volP*100):null;
  const streak=weeksStreak();
  const DN=['domingo','lunes','martes','miércoles','jueves','viernes','sábado'],nz=x=>foldTxt(x||'');const rHoy=S.routines.find(r=>nz(r.name).includes(nz(DN[d0.getDay()])));
  let h=`<section class="sec quick">${S.active?`<button class="qbig" data-act="goto-active"><span class="tiny">En curso</span><b>${esc(S.active.title)}</b><span>Tocá para seguir</span></button>`:rHoy?`<button class="qbig" data-act="start-routine" data-id="${rHoy.id}"><span class="tiny">Hoy toca</span><b>${esc(rHoy.name)}</b><span>${(rHoy.exercises||[]).length} ejercicios · tocá para empezar</span></button>`:''}
    <div class="qrow">${S.active?'':`<button class="btn pri" data-act="start-empty">Empezar entrenamiento</button>`}<button class="btn" data-act="goto-train">${S.routines.length?`Mis rutinas (${S.routines.length})`:'Armar una rutina'}</button></div></section>`;
  h+=`<section class="sec"><div class="card"><div class="row between" style="margin-bottom:12px"><b>Esta semana</b><span class="small muted">${streak?`Racha: <b class="num" style="color:var(--fg);font-size:16px">${streak}</b> ${streak===1?'semana':'semanas'} seguidas`:'Arrancá tu racha hoy'}</span></div><div class="week">${week}</div></div></section>`;
  if(S.workouts.length)h+=`<section class="sec">${muscleWeekCard(true)}</section>`;
  if(S.workouts.length)h+=`<section class="sec"><h2>${MESL[d.getMonth()]}</h2><div class="tiles">
    <div class="tile"><div class="v">${inM.length}</div><div class="l">entrenamientos</div><div class="delta ${inM.length>prevSame.length?'up':inM.length<prevSame.length?'down':'flat'}">${deltaTxt(inM.length-prevSame.length,'')} vs. ${MES[(d.getMonth()+11)%12]}</div></div>
    <div class="tile"><div class="v">${volM>=1000?nf(volM/1000,1)+'<small> t</small>':nf(volM,0)+'<small> kg</small>'}</div><div class="l">volumen levantado</div><div class="delta ${dv==null?'flat':dv>0?'up':dv<0?'down':'flat'}">${dv==null?'—':(dv>0?'+':'')+dv+'%'} vs. ${MES[(d.getMonth()+11)%12]}</div></div>
    <div class="tile"><div class="v">${prM}</div><div class="l">récords nuevos</div><div class="delta flat">este mes</div></div>
  </div><p class="tiny muted" style="margin:0">Comparado con los mismos días del mes pasado.</p></section>`;
  h+=`<section class="sec"><h2>Últimos entrenamientos</h2>`;
  if(!S.workouts.length){
    h+=`<div class="card empty"><h3>Todavía no anotaste ningún entrenamiento</h3><p>Cuando termines tu primer entrenamiento, acá vas a ver cada sesión con sus series, el volumen y tus récords.</p></div>`;
  }else{
    S.workouts.slice(0,S.feedN).forEach(w=>h+=workoutCard(w));
    if(S.workouts.length>S.feedN)h+=`<button class="btn block" data-act="more-feed">Ver más (${S.workouts.length-S.feedN})</button>`;
  }
  return h+`</section>`;
}
function deltaTxt(n,u){return n>0?`+${nf(n)}${u}`:n<0?`${nf(n)}${u}`:`=`}
function workoutCard(w){
  const st=wStats(w),dur=w.end&&w.start?(w.end-w.start)/1000:0;
  const exs=(w.exercises||[]).filter(e=>doneSets(e).length);
  let rows='';exs.slice(0,8).forEach(e=>{const ds=doneSets(e);if(isCardio(e)){rows+=`<div><span>${esc(e.name)}</span><span>${cardioTxt(ds)}</span></div>`;return}const b=bestSet(ds);const nd=ds.filter(x=>dropsOf(x).length).length;rows+=`<div><span>${ds.length} × ${esc(e.name)}</span><span>${b.kg?nf(b.kg)+' kg × '+b.reps:b.reps+' reps'}${nd?` · ${nd===1?'1 drop':nd+' drops'}`:''}</span></div>`});
  if(exs.length>8)rows+=`<div><span class="muted">y ${exs.length-8} ejercicios más</span><span></span></div>`;
  const prs=(w.prs||[]);
  return `<article class="card wk"><div class="row between" style="align-items:flex-start"><div style="min-width:0"><h3>${esc(w.title||'Entrenamiento')}</h3><div class="small muted">${fDate(w.start)}</div></div>${prs.length?`<span class="pr">🏆 ${prs.length} ${prs.length===1?'récord':'récords'}</span>`:''}</div>
  <div class="meta"><div><b>${dur?fDur(dur):'—'}</b><span>duración</span></div><div><b>${fKg(st.vol)}</b><span>volumen</span></div><div><b>${st.sets}</b><span>series</span></div></div>
  ${rows?`<div class="exl">${rows}</div>`:''}
  ${prs.length?`<div class="row wrap" style="margin-top:10px">${prs.map(p=>`<span class="pr">${esc(p.ex)} · ${esc(p.tipo)} ${esc(p.txt)}</span>`).join('')}</div>`:''}
  <div class="row" style="margin-top:8px;justify-content:flex-end"><button class="btn ghost" data-act="repeat" data-id="${w.id}">Repetir</button><button class="btn ghost danger" data-act="del-workout" data-id="${w.id}">Borrar</button></div></article>`;
}

/* ---------- ENTRENAR ---------- */
function vEntrenar(){
  if(S.active)return vActive();
  const DN=['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];const hoy=DN[new Date().getDay()];
  const nz=x=>x.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const rHoy=S.routines.filter(r=>nz(r.name||'').includes(nz(hoy)));
  let h='';
  rHoy.forEach(r=>{h+=`<article class="card today"><div class="tiny" style="color:var(--accent);font-weight:700;letter-spacing:.06em;text-transform:uppercase">Hoy es ${hoy}</div><b style="font-size:19px;display:block;margin:2px 0 4px">${esc(r.name)}</b><div class="small muted">${(r.exercises||[]).map(esc).join(' · ')||'Sin ejercicios'}</div><button class="btn pri block" data-act="start-routine" data-id="${r.id}" style="margin-top:10px">Empezar rutina</button></article>`});
  h+=`<section class="sec"><button class="btn ${rHoy.length?'':'pri'} block" data-act="start-empty" style="min-height:52px;font-size:17px">+ Empezar entrenamiento vacío</button><button class="btn block" data-act="browse">Ver todos los ejercicios (${CAT.length+S.custom.length})</button></section>`;
  h+=`<section class="sec"><div class="row between"><h2 style="margin:8px 0 0;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);font-weight:700">Mis rutinas</h2><button class="btn" data-act="new-routine" style="min-height:38px;padding:8px 14px">+ Nueva rutina</button></div>`;
  if(!S.routines.length)h+=`<div class="card empty"><h3>Armá tus rutinas</h3><p>Ponele el día al nombre, por ejemplo "Lunes - Pecho y tríceps", y ese día te aparece arriba para empezarla con un toque.</p><button class="btn" data-act="new-routine">Crear mi primera rutina</button></div>`;
  const DAYS=['lunes','martes','miércoles','jueves','viernes','sábado','domingo'];
  S.routines.forEach(r=>{const dd=DAYS.find(x=>nz(r.name||'').includes(nz(x)));h+=`<article class="card rcard"><div class="row between" style="align-items:flex-start"><div style="min-width:0">${dd?`<span class="daybadge">${dd}</span><br>`:''}<b style="font-size:17px">${esc(r.name)}</b><div class="small muted" style="margin-top:3px"><b style="color:var(--fg)">${(r.exercises||[]).length} ejercicios</b> · ${(r.exercises||[]).map(esc).join(' · ')||'Sin ejercicios'}</div></div></div><div class="row" style="margin-top:10px"><button class="btn pri" data-act="start-routine" data-id="${r.id}">Empezar</button><button class="btn ghost" data-act="edit-routine" data-id="${r.id}">Editar</button><button class="btn ghost danger" data-act="del-routine" data-id="${r.id}">Borrar</button></div></article>`});
  return h+`</section>`;
}
function vActive(){
  const a=S.active;
  let h=`<div class="actbar"><div class="ab-l"><b id="lv-dur2">${fClock((Date.now()-a.start)/1000)}</b><span id="lv-sets2">${wStats(a).sets} series · ${fKg(wStats(a).vol)}</span></div><button class="btn" data-act="add-ex">+ Ejercicio</button><button class="btn pri" data-act="finish">Terminar</button></div>
  <section class="active-head"><input class="title" id="act-title" data-k="title" value="${esc(a.title)}" aria-label="Nombre del entrenamiento">
  </section>`;
  if(!a.exercises.length)h+=`<div class="card empty"><h3>Agregá tu primer ejercicio</h3><p>Anotá peso y repeticiones de cada serie y tocá ✓ cuando la termines. El descanso arranca solo.</p></div>`;
  a.exercises.forEach((ex,ei)=>{
    const prev=lastSetsOf(ex.name,a.start)||[];const sg=suggestFor(ex.name,a.start);const CA=isCardio(ex);
    let rows='';ex.sets.forEach((s,si)=>{const p=prev[si];const ph=setGuess(ex,si,a.start);
      const DR=dropsOf(s),isD=DR.length>0&&!CA,pd=p?dropsOf(p):[];
      rows+=`<tr class="${s.done?'done':''} ${isD?'hasdrop':''}"><td><button class="sn ${s.w?'w':''} ${isD?'d':''}" data-act="set-type" data-e="${ei}" data-s="${si}" aria-label="Tipo de serie" title="Tocá para elegir: normal, calentamiento o drop set">${s.w?'C':setNum(ex,si)}${isD?'<small>D</small>':''}</button></td>
      <td><button class="prev" data-act="prev-fill" data-e="${ei}" data-s="${si}">${p?(CA?cardioTxt([p]):+p.kg?nf(p.kg)+' × '+p.reps:p.reps+' reps'):'—'}${p&&dropTxt(p)?'<span class="pd">+D</span>':''}</button></td>
      <td><input inputmode="decimal" data-k="kg" data-e="${ei}" data-s="${si}" id="kg-${ei}-${si}" value="${s.kg===''||s.kg==null?'':esc(s.kg)}" placeholder="${ph?esc(ph.kg):''}" aria-label="${CA?'Kilómetros':'Kilos'}"></td>
      <td><input inputmode="numeric" data-k="reps" data-e="${ei}" data-s="${si}" id="rp-${ei}-${si}" value="${s.reps===''||s.reps==null?'':esc(s.reps)}" placeholder="${ph?esc(ph.reps):''}" aria-label="${CA?'Minutos':'Repeticiones'}"></td>
      <td><button class="ck" data-act="set-done" data-e="${ei}" data-s="${si}" aria-label="Serie hecha"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></button></td></tr>`;
      if(S.typeOpen===ei+'-'+si)rows+=`<tr class="stype"><td colspan="5"><div class="chips"><button class="chip" aria-pressed="${!s.w&&!isD}" data-act="set-kind" data-k="n" data-e="${ei}" data-s="${si}">Normal</button><button class="chip" aria-pressed="${!!s.w}" data-act="set-kind" data-k="w" data-e="${ei}" data-s="${si}">Calentamiento</button>${CA?'':`<button class="chip" aria-pressed="${isD}" data-act="set-kind" data-k="d" data-e="${ei}" data-s="${si}">Drop set</button>`}</div></td></tr>`;
      if(isD)DR.forEach((d,di)=>{const pg=pd[di];rows+=`<tr class="droprow ${s.done?'done':''}"><td><span class="dlab">↳</span></td><td><span class="tiny muted">${di===0?'Drop':'Drop '+(di+1)}${pg&&parseNum(pg.reps)>0?`<br>${pg.kg?nf(pg.kg)+'×':''}${pg.reps}`:''}</span></td>
        <td><input inputmode="decimal" data-k="dkg" data-e="${ei}" data-s="${si}" data-d="${di}" value="${d.kg===''||d.kg==null?'':esc(d.kg)}" placeholder="${pg&&pg.kg?esc(pg.kg):dropGuess(s,di)}" aria-label="Kilos del drop ${di+1}"></td>
        <td><input inputmode="numeric" data-k="dreps" data-e="${ei}" data-s="${si}" data-d="${di}" value="${d.reps===''||d.reps==null?'':esc(d.reps)}" placeholder="${pg&&pg.reps?esc(pg.reps):'reps'}" aria-label="Repeticiones del drop ${di+1}"></td>
        <td>${di===DR.length-1?`<button class="dadd" data-act="drop-add" data-e="${ei}" data-s="${si}" aria-label="Agregar otro drop">+</button>`:''}</td></tr>`});
    });
    h+=`<article class="exc"><div class="hd"><div class="row" style="min-width:0;gap:10px;align-items:center"><button class="exth" data-act="ex-info" data-n="${esc(ex.name)}" aria-label="Ver cómo se hace">${thumb(ex.name)}</button><button class="exname" data-act="ex-info" data-n="${esc(ex.name)}"><h3>${esc(ex.name)}</h3><div class="tiny muted">${esc(ex.muscle)}${prev.length?' · la última vez: '+prev.length+' series':''}</div></button></div><button class="btn ghost" data-act="ex-menu" data-e="${ei}" aria-label="Opciones">•••</button></div>
    ${S.menuOpen===ei?`<div class="menu"><button class="chip" data-act="ex-up" data-e="${ei}">Subir</button><button class="chip" data-act="ex-down" data-e="${ei}">Bajar</button><button class="chip" data-act="rm-set" data-e="${ei}">Quitar última serie</button><button class="chip" data-act="rm-ex" data-e="${ei}" style="color:var(--bad)">Quitar ejercicio</button></div>`:''}
    ${sg&&ex.sets.some(s=>!s.done&&!s.w)?`<div class="sugg ${sg.up?'up':''}"><div><b>Hoy: ${sg.kg!==''&&sg.kg?nf(sg.kg)+' kg × ':''}${sg.reps} reps</b><span>${esc(sg.txt)}</span></div><button class="chip" data-act="use-sugg" data-e="${ei}">Usar</button></div>`:''}
    ${stepperRow(ex,ei,a.start,CA)}
    ${ei===0&&!CA?`<p class="tiny muted typehint">Tocá el número de una serie para marcarla como calentamiento o drop set.</p>`:''}
    <table class="sets"><thead><tr><th>SERIE</th><th>ANTERIOR</th><th>${CA?'KM':'KG'}</th><th>${CA?'MIN':'REPS'}</th><th>✓</th></tr></thead><tbody>${rows}</tbody></table>
    <button class="btn block" data-act="add-set" data-e="${ei}" style="margin-top:6px;min-height:38px;padding:8px">+ Agregar serie</button></article>`;
  });
  h+=`<button class="btn block" data-act="add-ex" style="background:var(--accent-soft);color:var(--accent)">+ Agregar ejercicio</button>
  <div class="row" style="gap:8px"><button class="btn danger" data-act="discard" style="flex:1">Descartar</button><button class="btn pri" data-act="finish" style="flex:2">Terminar entrenamiento</button></div>
  <div class="row small muted between"><span>Descanso entre series</span><span class="row" style="gap:4px"><button class="chip" data-act="rest-def" data-d="-15">−15</button><b class="num" style="font-size:17px;color:var(--fg)">${fClock(S.ajustes.descanso)}</b><button class="chip" data-act="rest-def" data-d="15">+15</button></span></div>`;
  return h;
}

/* progresión doble: mismo peso hasta llegar al tope del rango de reps en todas las series, después subir el peso */
const INC_EQ={B:2.5,S:2.5,Z:2.5,M:2,P:2.5,Q:5,K:4,D:2.5};
const LOWER_RE=/sentadilla|peso muerto|prensa|hip thrust|zancada|estocada|búlgara|buenos d|step|subidas/i;
function repRange(avg){return avg<=6?[4,6]:avg<=12.5?[8,12]:[12,20]}
// la próxima serie se ajusta con +/− sin teclado
function stepperRow(ex,ei,before,CA){const si=ex.sets.findIndex(s=>!s.done);if(si<0)return '';const s=ex.sets[si];const g=setGuess(ex,si,before)||{};
  const kv=(s.kg!==''&&s.kg!=null)?s.kg:(g.kg??''),rv=(s.reps!==''&&s.reps!=null)?s.reps:(g.reps??'');
  const ku=CA?'km':'kg',ru=CA?'min':'reps';
  return `<div class="stepr"><span class="tiny muted">Serie ${s.w?'de calentamiento':setNum(ex,si)}</span>
  <div class="stp"><button data-act="stp" data-e="${ei}" data-f="kg" data-d="-1" aria-label="Menos ${ku}">−</button><b class="num">${kv===''?'—':nf(+String(kv).replace(',','.'),1)}<small> ${ku}</small></b><button data-act="stp" data-e="${ei}" data-f="kg" data-d="1" aria-label="Más ${ku}">+</button></div>
  <div class="stp"><button data-act="stp" data-e="${ei}" data-f="reps" data-d="-1" aria-label="Menos ${ru}">−</button><b class="num">${rv===''?'—':rv}<small> ${ru}</small></b><button data-act="stp" data-e="${ei}" data-f="reps" data-d="1" aria-label="Más ${ru}">+</button></div>
  <button class="ck big" data-act="set-done" data-e="${ei}" data-s="${si}" aria-label="Marcar serie hecha"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></button></div>`}
function setGuess(ex,si,before){const s=ex.sets[si];const ld=ex.sets.slice(0,si).reverse().find(x=>x.done&&!x.w);if(!s.w&&ld)return{kg:ld.kg,reps:ld.reps};const sg=!s.w&&suggestFor(ex.name,before);if(sg)return{kg:sg.kg,reps:sg.reps};return (lastSetsOf(ex.name,before)||[])[si]||null}
function suggestFor(name,before){
  if(muscleOf(name)==='Cardio')return null;
  const prev=lastSetsOf(name,before);if(!prev)return null;
  const ws=prev.filter(s=>!s.w&&+s.reps>0);if(!ws.length)return null;
  const eq=exMeta(name).eq,top=Math.max(...ws.map(s=>+s.kg||0));
  const ts=ws.filter(s=>(+s.kg||0)===top),minR=Math.min(...ts.map(s=>+s.reps)),avg=ts.reduce((a,s)=>a+(+s.reps),0)/ts.length;
  if(!top||eq==='C'){const r=minR+1;return{kg:top||'',reps:r,txt:`Probá ${r} reps por serie (la última vez, ${minR}).`,up:false}}
  const[lo,hi]=repRange(avg);
  let inc=INC_EQ[eq]??2.5;if(LOWER_RE.test(name)&&(eq==='B'||eq==='S'||eq==='Q'))inc=5;
  if(minR>=hi){const kg=Math.round((top+inc)*4)/4;return{kg,reps:lo,txt:`Llegaste a ${hi} reps en todas las series con ${nf(top)} kg: subí a ${nf(kg)} kg y arrancá en ${lo} reps.`,up:true}}
  const r=Math.min(hi,minR+1);return{kg:top,reps:r,txt:`Mismo peso (${nf(top)} kg), buscá ${r} reps por serie. Cuando llegues a ${hi} en todas, subís.`,up:false};
}
function setNum(ex,si){let n=0;for(let i=0;i<=si;i++)if(!ex.sets[i].w)n++;return n}
function newWorkout(title,names){
  return{id:uid(),title:title||defaultTitle(),start:Date.now(),exercises:(names||[]).map(n=>newEx(n))};
}
function defaultTitle(){const h=new Date().getHours();return h<12?'Entrenamiento de la mañana':h<19?'Entrenamiento de la tarde':'Entrenamiento de la noche'}
function newEx(name){
  const prev=lastSetsOf(name)||[];const n=Math.max(prev.filter(s=>!s.w).length,3);
  const sets=[];prev.filter(s=>s.w).forEach(()=>sets.push({kg:'',reps:'',done:false,w:true}));
  const pw=prev.filter(s=>!s.w);for(let i=0;i<n;i++)sets.push({kg:'',reps:'',done:false,...(pw[i]&&dropsOf(pw[i]).length?{drop:dropsOf(pw[i]).map(()=>({kg:'',reps:''}))}:{})});
  return{name,muscle:muscleOf(name),sets};
}
let saveT=0;
function saveActive(){lsSet('fierro:activo',S.active);clearTimeout(saveT);saveT=setTimeout(()=>{store.setDoc('estado/activo',{w:S.active||null}).catch(()=>{})},1200)}
function updateLive(){if(!S.active)return;const st=wStats(S.active);const v=$('#lv-vol'),s=$('#lv-sets'),s2=$('#lv-sets2');if(v)v.textContent=fKg(st.vol);if(s)s.textContent=st.sets;if(s2)s2.textContent=st.sets+' series · '+fKg(st.vol)}
setInterval(()=>{if(S.active){const tx=fClock((Date.now()-S.active.start)/1000);const el=$('#lv-dur'),e2=$('#lv-dur2');if(el)el.textContent=tx;if(e2)e2.textContent=tx}tickRest()},1000);
function startActive(w){S.active=w;S.menuOpen=null;S.tab='entrenar';lsSet('fierro:tab','entrenar');saveActive();render(true);window.scrollTo(0,0)}
async function finishActive(skipCheck){
  const a=S.active;const st={sets:(a.exercises||[]).reduce((n,e)=>n+doneSets(e).length,0)};
  // series con datos cargados pero sin ✓: no se guardarían, así que se avisa
  const pend=[];(a.exercises||[]).forEach(e=>(e.sets||[]).forEach(s=>{if(!s.done&&(String(s.kg??'').trim()!==''||String(s.reps??'').trim()!=='')&&+parseNum(s.reps)>0)pend.push(s)}));
  if(!skipCheck&&pend.length){confirmSheet(`${pend.length===1?'Hay 1 serie':'Hay '+pend.length+' series'} sin marcar`,'Tienen peso o repeticiones cargados pero no tocaste ✓, así que no se guardarían.','Marcarlas y terminar',()=>{pend.forEach(s=>s.done=true);finishActive(true)});return}
  if(!st.sets){sheetMsg('Todavía no marcaste ninguna serie','Tocá ✓ en cada serie que termines. Si no querés guardar nada, usá "Descartar".');return}
  const w={id:a.id,title:a.title||defaultTitle(),start:a.start,end:Date.now(),...(a.rid?{rid:a.rid}:{}),
    exercises:a.exercises.map(e=>({name:e.name,muscle:e.muscle,sets:e.sets.filter(s=>s.done).map(s=>{dropsOf(s).forEach((d,i)=>{if((d.kg===''||d.kg==null)&&parseNum(d.reps)>0)d.kg=dropGuess(s,i)});const dr=dropsOf(s).map(d=>({kg:parseNum(d.kg)||0,reps:Math.round(parseNum(d.reps)||0)})).filter(d=>d.reps>0);return{kg:parseNum(s.kg),reps:Math.round(parseNum(s.reps)),done:true,...(s.w?{w:true}:{}),...(dr.length?{drop:dr}:{})}})})).filter(e=>e.sets.length)};
  w.prs=computePRs(w);
  try{await store.put('workouts',w.id,w)}catch(e){sheetMsg('No se pudo guardar','Revisá la conexión y probá de nuevo. Tu entrenamiento sigue abierto.');return}
  S.active=null;S.rest=null;lsSet('fierro:activo',null);store.setDoc('estado/activo',{w:null}).catch(()=>{});
  render(true);
  const dur=(w.end-w.start)/1000;const ws=wStats(w);st.vol=ws.vol;st.sets=ws.sets||st.sets;
  openSheet('¡Bien ahí! Entrenamiento guardado',`<div class="tiles"><div class="tile"><div class="v">${fDur(dur)}</div><div class="l">duración</div></div><div class="tile"><div class="v">${fKg(st.vol)}</div><div class="l">volumen</div></div><div class="tile"><div class="v">${st.sets}</div><div class="l">series</div></div></div>
  ${w.prs.length?`<div class="sec"><h2>Récords nuevos</h2>${w.prs.map(p=>`<div class="card row between"><span><b>${esc(p.ex)}</b><br><span class="small muted">${esc(p.tipo)}</span></span><span class="pr" style="font-size:15px">🏆 ${esc(p.txt)}</span></div>`).join('')}</div>`:`<p class="muted" style="margin:0">Sin récords esta vez. Lo importante es sumar sesiones: los récords llegan.</p>`}
  <button class="btn pri block" data-act="close-sheet">Listo</button>`);
}

/* descanso */
function startRest(){const d=S.ajustes.descanso||90;S.rest={end:Date.now()+d*1000,total:d};renderRest()}
function renderRest(){
  const el=$('#gym-rest');
  if(!S.rest||!S.active){el.hidden=true;$('#gym-app').classList.remove('resting');return}
  el.hidden=false;$('#gym-app').classList.add('resting');
  el.innerHTML=`<div class="in"><div><div class="t" id="rest-t">${fClock((S.rest.end-Date.now())/1000)}</div><div class="bar"><i id="rest-b" style="width:100%"></i></div></div><div class="lbl">Descanso</div><button data-act="rest-adj" data-d="-15">−15</button><button data-act="rest-adj" data-d="15">+15</button><button data-act="rest-skip">Saltar</button></div>`;
  tickRest();
}
function tickRest(){
  if(!S.rest)return;const left=(S.rest.end-Date.now())/1000;
  if(left<=0){S.rest=null;renderRest();try{navigator.vibrate&&navigator.vibrate([200,100,200])}catch{}beep();return}
  const t=$('#rest-t'),b=$('#rest-b');if(t)t.textContent=fClock(left);if(b)b.style.width=Math.max(0,left/S.rest.total*100)+'%';
}
let actx=null;function beep(){try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();const o=actx.createOscillator(),g=actx.createGain();o.frequency.value=880;g.gain.value=.15;o.connect(g);g.connect(actx.destination);o.start();o.stop(actx.currentTime+.35)}catch{}}

/* ---------- PROGRESO ---------- */
const RANGES=[['30','30 días'],['90','3 meses'],['365','1 año'],['all','Todo']];
function vProgreso(){
  if(!S.loaded.workouts)return loadingCard();
  if(!S.workouts.length)return `<div class="card empty"><h3>Acá vas a ver cómo mejorás</h3><p>Cuando anotes entrenamientos aparecen los gráficos de cada ejercicio, el día a día y el resumen de cada mes.</p><div class="row wrap" style="justify-content:center"><button class="btn pri" data-act="start-empty">Empezar a entrenar</button></div></div>`;
  const counts=exerciseCounts().filter(([n])=>muscleOf(n)!=='Cardio');
  let top='';try{top=routineCards()+gymDietCard()+strengthCard()}catch(e){console.warn('top',e)}
  if(!S.progEx||!counts.find(c=>c[0]===S.progEx))S.progEx=counts[0]&&counts[0][0];
  const from=S.range==='all'?0:Date.now()-(+S.range)*DAY;
  const hAll=history(S.progEx);const hist=hAll.filter(x=>x.t>=from);
  const bw=hAll.every(x=>!x.maxKg);
  const metrics=bw?[['reps','Reps máximas'],['vol','Series']]:[['e1','1RM estimado'],['maxKg','Peso máximo'],['vol','Volumen']];
  if(!metrics.find(m=>m[0]===S.progMetric))S.progMetric=metrics[0][0];
  const val=x=>S.progMetric==='vol'?(bw?x.n:x.vol):x[S.progMetric];
  const unit=S.progMetric==='reps'?' reps':(S.progMetric==='vol'&&bw)?' series':' kg';
  let h=top+`<section class="sec"><h2>Por ejercicio</h2><div class="field"><label for="pg-ex">Ejercicio</label><select class="inp" id="pg-ex" data-k="progEx">${counts.map(([n,c])=>`<option value="${esc(n)}" ${n===S.progEx?'selected':''}>${esc(n)} (${c})</option>`).join('')}</select></div>
  <div class="chips">${metrics.map(([k,l])=>`<button class="chip" aria-pressed="${S.progMetric===k}" data-act="metric" data-v="${k}">${l}</button>`).join('')}</div>
  <div class="chips">${RANGES.map(([k,l])=>`<button class="chip" aria-pressed="${S.range===k}" data-act="range" data-v="${k}">${l}</button>`).join('')}</div>`;
  if(!hist.length){h+=`<div class="card muted">No hiciste ${esc(S.progEx)} en este período. Probá con un rango más largo.</div></section>`}
  else{
    const first=val(hist[0]),last=val(hist[hist.length-1]),best=Math.max(...hist.map(val));
    const ch=last-first,pc=first?Math.round(ch/first*100):0;
    h+=`<div class="card"><div class="row between wrap" style="margin-bottom:8px"><div><div class="tiny muted">Último</div><div class="num" style="font-size:30px;font-weight:700">${nf(last)}<span class="muted" style="font-size:16px">${unit}</span></div></div><div style="text-align:right"><div class="tiny muted">Cambio en el período</div><div class="delta ${ch>0?'up':ch<0?'down':'flat'}" style="font-size:17px">${ch>0?'+':''}${nf(ch)}${unit} ${first?`(${pc>0?'+':''}${pc}%)`:''}</div><div class="tiny muted">Mejor: ${nf(best)}${unit}</div></div></div>
    ${chartBox({type:'line',h:210,pts:hist.map(x=>({x:x.t,y:val(x),lab:`${fShort(x.t)} · ${nf(val(x))}${unit}`})),fmt:v=>nf(v,0)})}
    ${S.progMetric==='e1'?`<p class="tiny muted" style="margin:8px 0 0">1RM estimado: lo máximo que podrías levantar a una repetición, calculado con tu mejor serie de cada día (fórmula de Epley). Sirve para comparar días con distintas repeticiones.</p>`:''}</div>`;
    const rows=[...hist].reverse().slice(0,14);
    h+=`<div class="card"><div class="row between"><b>Día a día</b><span class="tiny muted">mejor serie · vs. sesión anterior</span></div><div class="daylist">${rows.map((x)=>{const i=hAll.indexOf(x);const p=i>0?hAll[i-1]:null;const d=p?val(x)-val(p):null;
      return `<div class="it"><span>${fDate(x.t)}<br><span class="tiny muted">${x.best.kg?nf(x.best.kg)+' kg × '+x.best.reps:x.best.reps+' reps'} · ${x.n} series</span></span><span class="nb">${nf(val(x))}<span class="tiny muted">${unit}</span></span><span class="delta ${d==null?'flat':d>0?'up':d<0?'down':'flat'}">${d==null?'primera':d>0?'▲ +'+nf(d):d<0?'▼ '+nf(d):'='}</span></div>`}).join('')}</div></div></section>`;
  }
  // mes a mes
  const nowM=monKey(Date.now());const months=[];for(let i=5;i>=0;i--){const mk=nowM-i;const ws=S.workouts.filter(w=>monKey(w.start)===mk);months.push({mk,lab:MES[((mk%12)+12)%12],n:ws.length,vol:ws.reduce((a,w)=>a+wStats(w).vol,0),sets:ws.reduce((a,w)=>a+wStats(w).sets,0)})}
  const cm=months[5],pm=months[4];
  // el mes actual va en curso: se compara con los mismos días del mes anterior
  const dom=new Date().getDate();const pmSame=S.workouts.filter(w=>monKey(w.start)===pm.mk&&new Date(w.start).getDate()<=dom).reduce((a,w)=>a+wStats(w).vol,0);
  const dvol=pmSame?Math.round((cm.vol-pmSame)/pmSame*100):null;
  h+=`<section class="sec"><h2>Mes a mes</h2><div class="card"><div class="row between wrap"><b>Volumen por mes</b><span class="small muted">${MESL[((cm.mk%12)+12)%12]}: ${fKg(cm.vol)} ${dvol!=null?`<span class="delta ${dvol>0?'up':dvol<0?'down':'flat'}">(${dvol>0?'+':''}${dvol}% vs. mismos días de ${pm.lab})</span>`:''}</span></div>
  ${chartBox({type:'bar',h:170,cats:months.map(m=>({lab:m.lab,y:m.vol})),fmt:v=>v>=10000?nf(v/1000,0)+'t':nf(v/1000,1)+'t'})}
  <p class="tiny muted" style="margin:6px 0 0">El mes actual va en curso.</p></div>
  <div class="card"><div class="row between wrap"><b>Entrenamientos por mes</b><span class="small muted">${cm.n} en ${MESL[((cm.mk%12)+12)%12]} · ${pm.n} en ${MESL[((pm.mk%12)+12)%12]}</span></div>${chartBox({type:'bar',h:150,cats:months.map(m=>({lab:m.lab,y:m.n})),fmt:v=>nf(v,0)})}</div></section>`;
  // músculos
  h+=`<section class="sec"><h2>Volumen por músculo</h2>${muscleWeekCard()}</section>`;
  // constancia
  h+=`<section class="sec"><h2>Constancia · últimas 16 semanas</h2><div class="card">${heatmap()}</div></section>`;
  // récords
  const recs=counts.slice(0,12).map(([n])=>{const hh=history(n);const b=hh.reduce((a,x)=>x.e1>a.e1?x:a,hh[0]);const mk=hh.reduce((a,x)=>x.maxKg>a.maxKg?x:a,hh[0]);return{n,b,mk}});
  h+=`<section class="sec"><h2>Tus mejores marcas</h2><div class="card list">${recs.map(r=>`<div class="li"><span><b>${esc(r.n)}</b><br><span class="tiny muted">${r.mk.maxKg?`Peso máx. ${nf(r.mk.maxKg)} kg (${fShort(r.mk.t)})`:`Máx. ${r.b.reps} reps`}</span></span><span class="num" style="font-size:19px;text-align:right">${r.b.e1?nf(r.b.e1,0)+' kg':r.b.reps+' reps'}<br><span class="tiny muted" style="font-family:var(--f-body)">${r.b.e1?'1RM est.':''}</span></span></div>`).join('')}</div></section>`;
  h+=`<section class="sec"><h2>Consejo de Claude</h2><div class="card stack" id="coach-box">${S.coach?`<div class="ana">${md(S.coach)}</div>`:`<p class="muted" style="margin:0">Claude mira tus números (frecuencia, músculos, progreso de cada ejercicio y tu peso corporal) y te dice qué ajustar.</p>`}<button class="btn pri" data-act="coach" ${S.busy.coach?'disabled':''}>${S.busy.coach?'Analizando…':S.coach?'Volver a analizar':'Analizar mi progreso'}</button></div></section>`;
  return h;
}

/* series semanales por músculo: 1 por serie al músculo principal (Schoenfeld 2017) */
const SEC_GROUP=[[/pecho/,'Pecho'],[/tr[ií]ceps/,'Tríceps'],[/b[ií]ceps|braquial/,'Bíceps'],[/hombro|deltoides/,'Hombros'],[/dorsal|espalda/,'Espalda'],[/lumbar/,'Lumbares'],[/trapecio/,'Trapecio'],[/antebrazo/,'Antebrazos'],[/gl[uú]teo/,'Glúteos'],[/isquio/,'Isquiotibiales'],[/cu[aá]driceps/,'Cuádriceps'],[/aductor|abductor/,'Aductores y abductores'],[/gemelo/,'Gemelos'],[/abdominal|core|oblicuo/,'Abdominales']];
function weeklySets(fromMs,toMs){const m={};MUSCLES.forEach(x=>m[x]=0);
  S.workouts.forEach(w=>{if(w.start<fromMs||w.start>=toMs)return;(w.exercises||[]).forEach(ex=>{const n=doneSets(ex).length;if(!n)return;const g=MUSCLES.includes(ex.muscle)?ex.muscle:muscleOf(ex.name);if(g==='Cardio')return;m[g]+=n})});return m}
function muscleWeekCard(compact){
  const now=Date.now(),ws=startOfWeek(now);const cur=weeklySets(ws,now+DAY);
  const avg={};MUSCLES.forEach(x=>avg[x]=0);for(let i=1;i<=4;i++){const a=weeklySets(ws-i*7*DAY,ws-(i-1)*7*DAY);MUSCLES.forEach(x=>avg[x]+=a[x]/4)}
  let list=MUSCLES.filter(m=>!['Cardio','Otro','Cuerpo completo'].includes(m));const MAX=25;const all=list.length;
  if(compact)list=list.filter(m=>cur[m]>0||avg[m]>=4);if(!list.length)return '';
  const row=m=>{const v=cur[m],a=avg[m];const z=v<10?'lo':v<=20?'ok':'hi';return `<div class="mw"><span class="mn">${m}</span><div class="mt"><i class="band" style="left:${10/MAX*100}%;width:${10/MAX*100}%"></i><i class="v ${z}" style="width:${Math.min(100,v/MAX*100)}%"></i>${a?`<i class="avg" style="left:${Math.min(100,a/MAX*100)}%" title="Promedio de las 4 semanas anteriores"></i>`:''}</div><b class="num">${nf(v,0)}</b></div>`};
  const low=list.filter(m=>cur[m]<10).length,dow=(new Date(now).getDay()+6)%7;
  if(compact)return `<div class="card"><div class="row between wrap"><b>Series por músculo · esta semana</b><span class="small muted">óptimo 10 a 20</span></div><div class="mwl">${list.map(row).join('')}</div><button class="btn ghost block" data-act="goto-prog" style="margin-top:6px">Ver todos los músculos (${all})</button></div>`;
  return `<div class="card"><div class="row between wrap"><b>Series por músculo · esta semana</b><span class="small muted">rango óptimo 10 a 20</span></div><div class="mwl">${list.map(row).join('')}</div>
  <div class="row small muted wrap" style="gap:12px;margin-top:10px"><span><i class="lg band"></i>10–20 series</span><span><i class="lg avgl"></i>tu promedio de las 4 semanas anteriores</span></div>
  <p class="tiny muted" style="margin:8px 0 0">${dow<4&&low?'La semana recién empieza: es normal que todavía falten series. ':''}Cuenta 1 por cada serie efectiva del músculo principal del ejercicio. Para ganar músculo, la evidencia muestra mejores resultados con 10 a 20 series semanales por músculo; más de 20 suma poco y cuesta recuperarse.</p></div>`;
}
function heatmap(){
  const weeks=16,start=startOfWeek(Date.now())-(weeks-1)*7*DAY;const vol={};
  S.workouts.forEach(w=>{const k=dayKey(w.start);vol[k]=(vol[k]||0)+wStats(w).vol+1});
  const vals=Object.values(vol).sort((a,b)=>a-b);const q=p=>vals[Math.floor(p*(vals.length-1))]||0;const q1=q(.33),q2=q(.66);
  let cells='';const today=Date.now();let n=0;
  for(let w=0;w<weeks;w++)for(let d=0;d<7;d++){const t=start+(w*7+d)*DAY+3600e3;const k=dayKey(t);const v=vol[k];if(v)n++;
    cells+=`<i class="${t>today?'fut':v?(v<=q1?'l1':v<=q2?'l2':'l3'):''}" title="${fShort(t)}${v?' · entrenaste':''}"></i>`}
  const perWeek=(n/weeks);
  return `<div class="heatwrap"><div class="dl"><span>L</span><span></span><span>X</span><span></span><span>V</span><span></span><span>D</span></div><div class="heat">${cells}</div></div><p class="small muted" style="margin:10px 0 0">${n} días entrenados · promedio <b style="color:var(--fg)">${nf(perWeek)}</b> por semana. Más oscuro = más volumen ese día.</p>`;
}



/* ---------- progreso por rutina ---------- */
function routineWorkouts(r){const nm=foldTxt(r.name||'').trim();return S.workouts.filter(w=>w&&(w.rid===r.id||(!w.rid&&foldTxt(w.title||'').trim()===nm))).sort((a,b)=>a.start-b.start)}
function exBestIn(w,name){const ex=(w.exercises||[]).find(e=>e.name===name);if(!ex)return null;const ds=doneSets(ex);if(!ds.length)return null;return bestSet(ds)}
function routineSummary(r){const ws=routineWorkouts(r);if(!ws.length)return{ws,n:0};
  const names=[...new Set([...(r.exercises||[]),...ws.flatMap(w=>(w.exercises||[]).map(e=>e.name))])].filter(n=>muscleOf(n)!=='Cardio');
  const per=names.map(n=>{const pts=ws.map(w=>({w,b:exBestIn(w,n)})).filter(x=>x.b);if(!pts.length)return null;const f=pts[0],l=pts[pts.length-1];
    const useE=pts.some(x=>x.b.e1>0);const val=x=>useE?x.b.e1:x.b.reps;const ch=pts.length>=2&&val(f)?(val(l)/val(f)-1)*100:null;
    return{n,pts,f,l,ch,useE,best:Math.max(...pts.map(val))}}).filter(Boolean);
  const chs=per.filter(x=>x.ch!=null).map(x=>x.ch);const str=chs.length?chs.reduce((a,b)=>a+b,0)/chs.length:null;
  const vols=ws.map(w=>wStats(w).vol);const k=Math.min(3,Math.floor(vols.length/2));const avg=a=>a.reduce((x,y)=>x+y,0)/a.length;
  const dv=k>=1&&avg(vols.slice(0,k))?(avg(vols.slice(-k))/avg(vols.slice(0,k))-1)*100:null;
  return{ws,n:ws.length,per,str,dv,vols,last:ws[ws.length-1]}}
function routineCards(){if(!S.routines.length)return '';
  const rs=S.routines.map(r=>({r,sm:routineSummary(r)}));
  return `<section class="sec"><h2>Por rutina</h2><div class="rlist">${rs.map(({r,sm})=>`<button class="card rcardp" data-act="routine-prog" data-id="${r.id}"><div style="min-width:0"><b>${esc(r.name)}</b><span class="small muted">${sm.n?`${sm.n} ${sm.n===1?'sesión':'sesiones'} · última ${fShort(sm.last.start)}`:'Todavía sin sesiones'}</span></div>${sm.str!=null?`<span class="delta ${sm.str>0.5?'up':sm.str<-0.5?'down':'flat'}">${sm.str>0?'▲ +':sm.str<0?'▼ ':''}${nf(sm.str,1)}%</span>`:''}<span class="arr">›</span></button>`).join('')}</div>
  <p class="tiny muted" style="margin:0">El porcentaje es cuánto subió tu fuerza en los ejercicios de esa rutina desde la primera sesión.</p></section>`}
function openRoutineProg(id){const r=S.routines.find(x=>x.id===id);if(!r)return;const sm=routineSummary(r);
  if(!sm.n){openSheet(r.name,`<p style="margin:0">Todavía no hiciste esta rutina. Cuando la empieces desde Entrenar y la termines, acá vas a ver cómo progresás en cada ejercicio.</p><button class="btn pri block" data-act="start-routine" data-id="${r.id}">Empezar ${esc(r.name)}</button>`);return}
  const tile=(v,l,c='')=>`<div class="tile"><div class="v ${c}" style="font-size:22px">${v}</div><div class="l">${l}</div></div>`;
  let h=`<div class="tiles">${tile(sm.n,sm.n===1?'sesión':'sesiones')}${tile(sm.str!=null?(sm.str>=0?'+':'')+nf(sm.str,1)+'%':'—','fuerza',sm.str>0.5?'up':sm.str<-0.5?'down':'')}${tile(sm.dv!=null?(sm.dv>=0?'+':'')+nf(sm.dv,0)+'%':'—','volumen por sesión',sm.dv>2?'up':sm.dv<-2?'down':'')}</div>`;
  if(sm.n>=2)h+=`<div class="card"><b>Volumen de cada sesión</b>${chartBox({type:'line',h:150,pts:sm.ws.map(w=>({x:w.start,y:wStats(w).vol,lab:`${fShort(w.start)} · ${fKg(wStats(w).vol)}`})),fmt:v=>v>=1000?nf(v/1000,1)+'t':nf(v,0)})}</div>`;
  h+=`<div class="sec"><h2>Ejercicio por ejercicio</h2><div class="card list">${sm.per.map(x=>{const fb=x.f.b,lb=x.l.b;const sp=x.pts.slice(-8);const vals=sp.map(p=>x.useE?p.b.e1:p.b.reps);const mn=Math.min(...vals),mx=Math.max(...vals);
    const spark=sp.length>=2?`<svg class="spark" viewBox="0 0 60 22" aria-hidden="true"><polyline points="${vals.map((v,i)=>`${(i/(vals.length-1)*58+1).toFixed(1)},${(21-(mx>mn?(v-mn)/(mx-mn):0.5)*20).toFixed(1)}`).join(' ')}"/></svg>`:'';
    return `<div class="li"><span style="min-width:0"><b>${esc(x.n)}</b><br><span class="tiny muted">${x.pts.length>=2?`${fb.kg?nf(fb.kg)+' kg × '+fb.reps:fb.reps+' reps'} → ${lb.kg?nf(lb.kg)+' kg × '+lb.reps:lb.reps+' reps'}`:`${lb.kg?nf(lb.kg)+' kg × '+lb.reps:lb.reps+' reps'} · una sola vez`}</span></span><span class="row" style="gap:8px;flex:none">${spark}${x.ch!=null?`<span class="delta ${x.ch>0.5?'up':x.ch<-0.5?'down':'flat'}" style="min-width:52px;text-align:right">${x.ch>0?'+':''}${nf(x.ch,1)}%</span>`:''}</span></div>`}).join('')}</div>
  <p class="tiny muted" style="margin:4px 0 0">Mejor serie de la primera sesión → la última. El % compara el 1RM estimado (o las repeticiones si es sin peso).</p></div>`;
  h+=`<div class="sec"><h2>Sesiones</h2><div class="card list">${[...sm.ws].reverse().slice(0,12).map(w=>{const st=wStats(w);const nd=(w.exercises||[]).reduce((a,e)=>a+doneSets(e).filter(x=>dropsOf(x).length).length,0);return `<div class="li"><span>${fDate(w.start)}<br><span class="tiny muted">${fDur(((w.end||w.start)-w.start)/1000)} · ${st.sets} series${nd?` · ${nd} ${nd===1?'drop':'drops'}`:''}</span></span><b class="num">${fKg(st.vol)}</b></div>`}).join('')}</div></div>`;
  openSheet(r.name,h);requestAnimationFrame(drawCharts)}
/* ---------- fuerza general, fotos comparadas y relación con la dieta ---------- */
const photoSrc=b=>b.photoId?('/_blob/'+b.photoId):(S.blobs[b.id]?S.blobs[b.id].url:null);
// índice de fuerza: promedio de cuánto subió el 1RM estimado de tus ejercicios principales (100 = punto de partida).
// Cada semana toma el mejor 1RM de las últimas 3 semanas, para que una sesión floja no hunda la curva.
function strengthSeries(fromMs){
  const lifts=exerciseCounts().filter(([n,c])=>c>=3&&muscleOf(n)!=='Cardio').map(([n])=>n).filter(n=>history(n).some(h=>h.maxKg>0)).slice(0,6);
  if(!lifts.length)return null;
  const H=lifts.map(n=>({n,h:history(n).filter(x=>x.e1>0)})).filter(x=>x.h.length>=2);
  if(!H.length)return null;
  const first=Math.min(...H.map(x=>x.h[0].t));
  const w0=startOfWeek(Math.max(fromMs||0,first)),wN=startOfWeek(Date.now());
  // base de cada ejercicio: su mejor 1RM cerca del arranque (hasta 3 semanas antes o 3 después)
  const used=H.map(x=>{const near=x.h.filter(y=>y.t>=w0-21*DAY&&y.t<w0+21*DAY);return near.length?{...x,base:Math.max(...near.filter(y=>y.t<w0+7*DAY).map(y=>y.e1),0)||near[0].e1}:null}).filter(Boolean);
  if(!used.length)return null;
  const pts=[];
  for(let t=w0;t<=wN;t+=7*DAY){const end=t+7*DAY;let sum=0,cnt=0;
    used.forEach(x=>{const rec=x.h.filter(y=>y.t<end&&y.t>=end-21*DAY);const upto=x.h.filter(y=>y.t<end);if(!upto.length)return;const v=rec.length?Math.max(...rec.map(y=>y.e1)):upto[upto.length-1].e1;sum+=v/x.base;cnt++});
    if(cnt)pts.push({t,idx:sum/cnt*100})}
  return pts.length>=2?{pts,lifts:used.map(x=>x.n)}:null;
}
function weeklyBW(w0){const ws=allWeights().filter(w=>w.date>=w0-7*DAY);if(ws.length<2)return [];const m=new Map();ws.forEach(w=>{const k=startOfWeek(w.date);const a=m.get(k)||[];a.push(w.kg);m.set(k,a)});return [...m.entries()].sort((a,b)=>a[0]-b[0]).map(([t,a])=>({t,kg:a.reduce((x,y)=>x+y,0)/a.length}))}
function strengthAt(ms){const ss=strengthSeries(0);if(!ss)return null;const p=[...ss.pts].reverse().find(x=>x.t<=ms);return p?p.idx:null}
function strengthCard(){
  const ss=strengthSeries(Date.now()-12*7*DAY);
  if(!ss)return `<section class="sec"><h2>Tu fuerza</h2><div class="card small muted">Cuando repitas al menos 3 veces un ejercicio con peso, acá aparece la curva de tu fuerza total comparada con tu peso corporal.</div></section>`;
  const P=ss.pts,bw=weeklyBW(P[0].t),b0=bw.length?bw[0].kg:null;
  const bwp=bw.filter(x=>x.t>=P[0].t-7*DAY).map(x=>({t:Math.max(x.t,P[0].t),v:(x.kg/b0-1)*100}));
  const sp=P.map(p=>({t:p.t,v:p.idx-100}));const ds=sp[sp.length-1].v,dw=bwp.length>=2?bwp[bwp.length-1].v:null;
  const weeks=Math.round((P[P.length-1].t-P[0].t)/(7*DAY));
  const all=[...sp,...bwp].map(x=>x.v),mn=Math.min(0,...all)-1,mx=Math.max(0,...all)+1;
  const W=340,Hh=170,pl=34,pr=8,pt=12,pb=22,t0=P[0].t,t1=Math.max(P[P.length-1].t,t0+DAY);
  const X=t=>pl+(t-t0)/(t1-t0)*(W-pl-pr),Y=v=>pt+(mx-v)/(mx-mn)*(Hh-pt-pb);
  const line=a=>a.map(x=>`${X(x.t).toFixed(1)},${Y(x.v).toFixed(1)}`).join(' ');
  let g=`<svg viewBox="0 0 ${W} ${Hh}" width="100%" role="img" aria-label="Fuerza y peso corporal en porcentaje">`;
  [mn+1,0,mx-1].forEach(v=>{g+=`<line class="grid" x1="${pl}" x2="${W-pr}" y1="${Y(v)}" y2="${Y(v)}"/><text class="axis" x="${pl-4}" y="${Y(v)+4}" text-anchor="end">${v>0?'+':''}${nf(v,0)}%</text>`});
  if(bwp.length>=2)g+=`<polyline points="${line(bwp)}" fill="none" stroke="var(--muted)" stroke-width="2" stroke-dasharray="5 4"/>`;
  g+=`<polyline class="ln" points="${line(sp)}"/>`;const L=sp[sp.length-1];g+=`<circle class="dt last" cx="${X(L.t)}" cy="${Y(L.v)}" r="4.5"/>`;
  g+=`<text class="axis" x="${pl}" y="${Hh-4}">${fShort(t0)}</text><text class="axis" x="${W-pr}" y="${Hh-4}" text-anchor="end">hoy</text></svg>`;
  let read='';
  if(dw==null)read=`Anotá tu peso en Hoy para ver si la fuerza sube más rápido que el peso.`;
  else if(ds>=dw+2)read=`Tu fuerza sube más rápido que tu peso: lo que ganás es, sobre todo, músculo.`;
  else if(ds<=-3&&dw<0)read=`Bajás de peso pero también de fuerza: revisá que no sea un déficit muy grande y que llegues a la proteína.`;
  else if(dw>ds+2&&dw>0)read=`Tu peso sube más rápido que tu fuerza: puede que estés sumando más grasa que músculo.`;
  else read=`Fuerza y peso se mueven parejos.`;
  return `<section class="sec"><h2>Tu fuerza</h2><div class="card"><div class="row between wrap" style="gap:8px"><div><span class="num" style="font-size:26px;font-weight:800;color:${ds>=0?'var(--good)':'var(--bad)'}">${ds>=0?'+':''}${nf(ds,1)}%</span> <span class="small muted">fuerza en ${weeks} ${weeks===1?'semana':'semanas'}</span></div>${dw!=null?`<span class="small muted">peso ${dw>=0?'+':''}${nf(dw,1)}%</span>`:''}</div>
  <div class="chart" style="height:auto;margin-top:6px">${g}</div>
  <div class="mleg" style="margin-top:4px"><span><span class="sw"></span>Fuerza</span>${bwp.length>=2?`<span><span class="lg" style="width:16px;height:0;border-top:2px dashed var(--muted);display:inline-block;margin-right:5px;vertical-align:3px"></span>Peso corporal</span>`:''}</div>
  <p class="small" style="margin:8px 0 0">${read}</p>
  <p class="tiny muted" style="margin:6px 0 0">Fuerza = cuánto subió en promedio el 1RM estimado de ${ss.lifts.map(esc).join(', ')}.</p></div></section>`;
}
// relación gimnasio + dieta: últimas 4 semanas
function regressKgWeek(ws){if(ws.length<3)return null;const n=ws.length,mx=ws.reduce((a,w)=>a+w.date,0)/n,my=ws.reduce((a,w)=>a+w.kg,0)/n;let nu=0,de=0;ws.forEach(w=>{nu+=(w.date-mx)*(w.kg-my);de+=(w.date-mx)**2});return de?nu/de*7*DAY:null}
function gymDietCard(){
  const P=window.PORCION;if(!P||!P.dietDays)return '';
  const D=P.dietDays(28),info=P.planInfo();const logged=D.filter(d=>d.logged);
  const from=Date.now()-28*DAY;const ws=allWeights().filter(w=>w.date>=from);const rate=regressKgWeek(ws);
  const ss=strengthSeries(from-14*DAY);let ds=null;if(ss){const a=ss.pts.find(p=>p.t>=startOfWeek(from))||ss.pts[0],b=ss.pts[ss.pts.length-1];ds=b.idx/a.idx*100-100}
  const sess=S.workouts.filter(w=>w.start>=from).length/4;
  if(logged.length<5&&ds==null)return `<section class="sec"><h2>Gimnasio + dieta</h2><div class="card small muted">Con 2 semanas de comidas anotadas y entrenamientos acá vas a ver cómo se relacionan tu fuerza, tu peso y lo que comés, con consejos concretos.</div></section>`;
  const avg=f=>logged.length?logged.reduce((a,d)=>a+d[f],0)/logged.length:0;
  const kcal=avg('kcal'),tk=avg('tk'),pr=avg('p'),w=info.w||75,pkg=pr/w;const pMeet=logged.length?logged.filter(d=>d.p>=d.tp*0.9).length/logged.length:0;
  const gymD=logged.filter(d=>d.gym),restD=logged.filter(d=>!d.gym);const gap=a=>a.reduce((x,d)=>x+d.kcal-d.tk,0)/a.length;const gd=gymD.length>=3&&restD.length>=3?gap(gymD)-gap(restD):null;
  const tips=[];const t=info.t,rP=rate!=null?rate/w*100:null;
  if(t==='vol'){
    if(rP!=null&&rP>info.r*1.6+0.1&&(ds==null||ds<2))tips.push(['warn',`Subís ${nf(rate,2)} kg por semana y la fuerza ${ds==null?'no se puede medir todavía':'casi no sube'}: es probable que sea más grasa que músculo. Bajá unas 150 kcal por día.`]);
    else if(rP!=null&&rP<info.r*0.4&&(ds==null||ds<2))tips.push(['warn',`No estás subiendo de peso ni de fuerza: para crecer necesitás comer más. Sumá 150 a 200 kcal por día (un yogur con granola o un sándwich más).`]);
    else if(ds!=null&&ds>=2)tips.push(['good',`Fuerza +${nf(ds,1)}% en 4 semanas con el peso ${rP!=null?'a buen ritmo':'subiendo'}: el superávit está funcionando.`]);
  }else if(t==='def'){
    if(ds!=null&&ds<=-4)tips.push(['warn',`Estás perdiendo fuerza (${nf(ds,1)}%): el déficit puede ser muy grande. Subí unas 150 kcal o pasá a la velocidad "Suave", y priorizá la proteína.`]);
    else if(rate!=null&&rate<0)tips.push(['good',`Bajás ${nf(-rate,2)} kg por semana${ds!=null?` y tu fuerza ${ds>=0?'sube':'se mantiene'} (${ds>=0?'+':''}${nf(ds,1)}%)`:''}: estás perdiendo grasa, no músculo.`]);
    else if(rate!=null&&rate>=0)tips.push(['warn',`En definición pero tu peso no baja: revisá que estés anotando todo (aceite, salsas, bebidas) o bajá 150 kcal.`]);
  }else{
    if(ds!=null&&ds>=2&&(rate==null||Math.abs(rate)<0.2))tips.push(['good',`Más fuerte (+${nf(ds,1)}%) con el mismo peso: eso es recomposición.`]);
  }
  if(logged.length>=5&&pkg<info.pk*0.85)tips.push(['warn',`Te falta proteína: promedio ${nf(pkg,1)} g por kg (meta ${nf(info.pk,1)}). Llegaste a la meta ${Math.round(pMeet*7)} de cada 7 días. Sumá una porción de carne, pollo, huevo o yogur proteico por día.`]);
  else if(logged.length>=5&&pMeet>=0.7)tips.push(['good',`Proteína bien: llegás a la meta ${Math.round(pMeet*7)} de cada 7 días.`]);
  if(gd!=null&&gd<-350)tips.push(['warn',`Los días de gimnasio te quedás ${nf(-gd,0)} kcal más corto que los días de descanso, justo cuando más gastás. Sumá algo antes o después de entrenar.`]);
  if(info.gdays&&sess<info.gdays-0.6)tips.push(['warn',`Entrenaste ${nf(sess,1)} veces por semana de las ${info.gdays} de tu plan.`]);
  if(!tips.length)tips.push(['good','Todo en orden: seguí así.']);
  const stat=(v,l)=>`<div><b class="num" style="display:block;font-size:19px">${v}</b><span class="tiny muted">${l}</span></div>`;
  return `<section class="sec"><h2>Gimnasio + dieta · últimas 4 semanas</h2><div class="card stack" style="gap:12px">
  <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px">${stat(ds!=null?(ds>=0?'+':'')+nf(ds,1)+'%':'—','fuerza')}${stat(rate!=null?(rate>=0?'+':'')+nf(rate,2)+' kg':'—','peso por semana')}${stat(logged.length?nf(kcal,0):'—',logged.length?`kcal por día (meta ${nf(tk,0)})`:'kcal por día')}${stat(logged.length?nf(pkg,1)+' g/kg':'—','proteína')}</div>
  <div class="stack" style="gap:8px">${tips.map(([k,x])=>`<div class="row" style="align-items:flex-start;gap:8px"><span style="flex:none;width:8px;height:8px;border-radius:50%;margin-top:7px;background:var(--${k==='good'?'good':'warn'})"></span><span class="small">${esc(x)}</span></div>`).join('')}</div>
  <p class="tiny muted" style="margin:0">${info.n?`Etapa: ${esc(info.n)} · `:''}${logged.length} días con comidas anotadas · ${S.workouts.filter(w=>w.start>=from).length} entrenamientos</p></div></section>`;
}
window.__gymDietCard=()=>{try{return gymDietCard()}catch(e){return ''}};
function cmpSet(v){v=Math.max(0,Math.min(100,v));const c=$('#cmp-clip'),l=$('#cmp-line'),r=$('#cmp-r');if(c)c.style.clipPath=`inset(0 ${100-v}% 0 0)`;if(l)l.style.left=v+'%';if(r)r.value=Math.round(v)}
document.addEventListener('pointerdown',e=>{const box=e.target.closest&&e.target.closest('#cmp-box');if(!box)return;const R=box.getBoundingClientRect();const at=x=>cmpSet((x-R.left)/R.width*100);at(e.clientX);
  const mv=ev=>at(ev.clientX),up=()=>{document.removeEventListener('pointermove',mv);document.removeEventListener('pointerup',up);document.removeEventListener('pointercancel',up)};
  document.addEventListener('pointermove',mv);document.addEventListener('pointerup',up);document.addEventListener('pointercancel',up)});
// antes / después
function compareCard(){
  const ph=S.body.filter(b=>photoSrc(b)).sort((a,b)=>a.date-b.date);if(ph.length<2)return '';
  let A=ph.find(b=>b.id===(S.cmp&&S.cmp.a))||ph[0],B=ph.find(b=>b.id===(S.cmp&&S.cmp.b))||ph[ph.length-1];if(A.date>B.date)[A,B]=[B,A];
  const DM=dietWeightMap(),ka=bodyKg(A,DM),kb=bodyKg(B,DM),days=Math.round((B.date-A.date)/DAY);
  const sa=strengthAt(A.date),sb=strengthAt(B.date);
  const opt=sel=>ph.map(b=>`<option value="${b.id}" ${b.id===sel.id?'selected':''}>${fDate(b.date)}</option>`).join('');
  return `<section class="sec"><h2>Antes y después</h2><div class="card stack">
  <div class="row" style="gap:10px"><div class="field" style="flex:1"><label for="cmp-a">Antes</label><select class="inp" id="cmp-a">${opt(A)}</select></div><div class="field" style="flex:1"><label for="cmp-b">Después</label><select class="inp" id="cmp-b">${opt(B)}</select></div></div>
  <div class="cmpbox" id="cmp-box"><img src="${esc(photoSrc(B))}" alt="Después, ${fDate(B.date)}"><div class="cmp-a" id="cmp-clip"><img src="${esc(photoSrc(A))}" alt="Antes, ${fDate(A.date)}"></div><div class="cmp-line" id="cmp-line"></div><span class="cmp-l">Antes</span><span class="cmp-r">Después</span>
  <input type="range" id="cmp-r" min="0" max="100" value="50" aria-label="Deslizá para comparar"></div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;text-align:center">
   <div><b class="num" style="display:block;font-size:18px">${days}</b><span class="tiny muted">días</span></div>
   <div><b class="num" style="display:block;font-size:18px">${ka&&kb?((kb-ka>=0?'+':'')+nf(kb-ka,1)+' kg'):'—'}</b><span class="tiny muted">peso</span></div>
   <div><b class="num" style="display:block;font-size:18px">${sa&&sb?((sb/sa*100-100>=0?'+':'')+nf(sb/sa*100-100,1)+'%'):'—'}</b><span class="tiny muted">fuerza</span></div></div>
  <p class="tiny muted" style="margin:0">Deslizá sobre la foto para pasar de una a otra. Compará siempre fotos con la misma luz y la misma pose.</p></div></section>`;
}

/* ---------- FÍSICO ---------- */
function vFisico(){
  if(!S.loaded.body)return loadingCard();
  const today=dayKey(Date.now());
  let h=`<section class="sec"><div class="card stack"><b style="font-size:17px">Nuevo registro</b>
  <div class="row" style="gap:10px;align-items:flex-end"><div class="field" style="flex:1"><label for="bf-date">Fecha</label><input class="inp" type="date" id="bf-date" value="${today}"></div><div class="field" style="flex:1"><label for="bf-kg">Peso corporal (kg)</label><input class="inp" id="bf-kg" inputmode="decimal" placeholder="Ej: 78,5" value="${(()=>{const w=dietWeightMap().get(today);return w?String(w.kg).replace('.',','):''})()}"></div></div>
  <div class="field"><span class="flabel">Foto del físico (opcional)</span><label class="filebtn" for="bf-photo"><svg viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="14" rx="2"/><path d="M9 6l1.5-2h3L15 6"/><circle cx="12" cy="13" r="3.5"/></svg><span id="bf-photo-t">Sacar o elegir foto</span></label><input type="file" id="bf-photo" accept="image/*" class="vh"><img id="bf-prev" alt="Vista previa" hidden></div>
  <div class="field"><label for="bf-note">Nota (opcional)</label><input class="inp" id="bf-note" placeholder="Ej: frente, relajado, luz del baño"></div>
  <button class="btn pri" data-act="save-body" ${S.busy.body?'disabled':''}>${S.busy.body?'Guardando…':'Guardar'}</button>
  <p class="tiny muted" style="margin:0">El peso es el mismo que anotás en Dieta → Hoy: cargarlo acá o allá da lo mismo. Si cargás foto, después tocás "Analizar con Claude" y te dice qué ve y qué mejorar, comparando con tu foto anterior y con lo que venís entrenando.</p></div></section>`;
  const ws=allWeights();
  if(ws.length>=2){const f=ws[0].kg,l=ws[ws.length-1].kg,d=l-f;
    h+=`<section class="sec"><h2>Peso corporal</h2><div class="card"><div class="row between"><span class="num" style="font-size:28px;font-weight:700">${nf(l)} <span class="muted" style="font-size:16px">kg</span></span><span class="delta ${d>0?'up':d<0?'down':'flat'}" style="color:var(--muted)">${d>0?'+':''}${nf(d)} kg desde ${fShort(ws[0].date)}</span></div>${chartBox({type:'line',h:180,pts:ws.map(b=>({x:b.date,y:b.kg,lab:`${fShort(b.date)} · ${nf(b.kg)} kg`})),fmt:v=>nf(v,1)})}</div></section>`}
  h+=compareCard();
  h+=`<section class="sec"><h2>Historial</h2>`;
  if(!S.body.length)h+=`<div class="card empty"><h3>Sacate la primera foto</h3><p>Siempre igual para poder comparar: misma luz, misma distancia, de frente, de perfil y de espalda, relajado. Una vez por semana o cada 15 días alcanza.</p></div>`;
  const DM=dietWeightMap();
  S.body.forEach((b,i)=>{
    b={...b,kg:bodyKg(b,DM)};const prevB=S.body.slice(i+1).find(x=>bodyKg(x,DM)>0);const d=b.kg&&prevB?b.kg-bodyKg(prevB,DM):null;
    const src=photoSrc(b);
    h+=`<article class="card stack"><div class="${src?'ph2':''}">${src?`<img class="photo" src="${esc(src)}" alt="Foto del ${fDate(b.date)}" data-act="zoom" data-src="${esc(src)}" loading="lazy">`:''}<div class="stack" style="gap:6px;min-width:0"><b>${fDate(b.date)}</b>${b.kg?`<span><span class="num" style="font-size:22px">${nf(b.kg)} kg</span> ${d!=null?`<span class="tiny muted">(${d>0?'+':''}${nf(d)})</span>`:''}</span>`:''}${b.note?`<span class="small muted">${esc(b.note)}</span>`:''}
    <div class="row wrap" style="gap:4px">${src?`<button class="btn ${b.analisis?'':'pri'}" data-act="analyze" data-id="${b.id}" ${S.busy[b.id]?'disabled':''} style="min-height:38px;padding:8px 12px">${S.busy[b.id]?'Analizando…':b.analisis?'Volver a analizar':'Analizar con Claude'}</button>`:''}<button class="btn ghost danger" data-act="del-body" data-id="${b.id}">Borrar</button></div></div></div>
    <div class="ana" id="ana-${b.id}">${b.analisis?md(b.analisis):''}</div></article>`;
  });
  return h+`</section>`;
}

/* ---------- PERFIL ---------- */
function vPerfil(){
  const tot=S.workouts.length,first=S.workouts.length?S.workouts[S.workouts.length-1].start:null;
  const vol=S.workouts.reduce((a,w)=>a+wStats(w).vol,0);
  let h=`<section class="sec"><div class="tiles"><div class="tile"><div class="v">${tot}</div><div class="l">entrenamientos</div></div><div class="tile"><div class="v">${fKg(vol)}</div><div class="l">levantados en total</div></div><div class="tile"><div class="v">${first?fShort(first):'—'}</div><div class="l">${first&&new Date(first).getFullYear()!==new Date().getFullYear()?new Date(first).getFullYear():'primer registro'}</div></div></div></section>`;
  h+=`<section class="sec"><h2>Mis ejercicios propios</h2><div class="card">${S.custom.length?`<div class="list">${S.custom.map((c,i)=>`<div class="li"><span>${esc(c.name)}<br><span class="tiny muted">${esc(c.muscle)}</span></span><button class="btn ghost danger" data-act="del-custom" data-i="${i}">Quitar</button></div>`).join('')}</div>`:`<p class="small muted" style="margin:0">Los creás desde "Agregar ejercicio" cuando no encontrás uno en la lista.</p>`}</div></section>`;
  h+=`<section class="sec"><h2>Tus datos</h2><div class="card stack"><p class="small" style="margin:0">${S.mode==='nube'?'Se guardan en tu cuenta de Claude: los ves igual desde el celular o la compu. La copia completa (dieta y gimnasio) está en Dieta → Perfil.':'Se guardan en este dispositivo. Para no perderlos si cambiás de celular, hacé una copia de seguridad desde Dieta → Perfil.'}</p>${S.downloads?`<button class="btn" data-act="backup">Descargar copia (Excel / CSV)</button>`:''}</div></section>`;
  return h;
}

/* ---------- importación de Hevy ---------- */
function parseCSV(text){
  const rows=[];let row=[],f='',q=false;
  for(let i=0;i<text.length;i++){const c=text[i];
    if(q){if(c==='"'){if(text[i+1]==='"'){f+='"';i++}else q=false}else f+=c}
    else if(c==='"')q=true;else if(c===','){row.push(f);f=''}else if(c==='\n'||c==='\r'){if(c==='\r'&&text[i+1]==='\n')i++;row.push(f);rows.push(row);row=[];f=''}else f+=c}
  if(f!==''||row.length){row.push(f);rows.push(row)}
  return rows.filter(r=>r.some(x=>x!==''));
}
const MON={jan:0,ene:0,feb:1,mar:2,apr:3,abr:3,may:4,jun:5,jul:6,aug:7,ago:7,sep:8,set:8,oct:9,nov:10,dec:11,dic:11};
function parseHevyDate(s){
  s=(s||'').trim();let m=s.match(/^(\d{1,2})\s+([A-Za-zé\.]{3,})\.?\s+(\d{4}),?\s+(\d{1,2}):(\d{2})/);
  if(m){const mo=MON[m[2].toLowerCase().slice(0,3)];if(mo!=null)return new Date(+m[3],mo,+m[1],+m[4],+m[5]).getTime()}
  m=s.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);if(m)return new Date(+m[1],+m[2]-1,+m[3],+m[4],+m[5]).getTime();
  const t=Date.parse(s);return isNaN(t)?null:t;
}
function hash(s){let h=5381;for(let i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))|0;return(h>>>0).toString(36)}
function parseHevy(text){
  const rows=parseCSV(text.replace(/^﻿/,''));if(rows.length<2)throw new Error('vacío');
  const H=rows[0].map(x=>x.trim().toLowerCase());const ix=n=>H.indexOf(n);
  const iT=ix('title'),iS=ix('start_time'),iE=ix('end_time'),iX=ix('exercise_title'),iTy=ix('set_type'),iKg=ix('weight_kg'),iLb=ix('weight_lbs'),iR=ix('reps'),iD=ix('duration_seconds');
  if(iS<0||iX<0)throw new Error('formato');
  const map=new Map();
  for(const r of rows.slice(1)){
    const st=parseHevyDate(r[iS]);if(st==null)continue;const title=(r[iT]||'Entrenamiento').trim();
    const key=st+'|'+title;let w=map.get(key);
    if(!w){const en=iE>=0?parseHevyDate(r[iE]):null;w={id:'h'+hash(key),title,start:st,end:en||st,exercises:[],src:'hevy'};map.set(key,w)}
    const xn=aliasName((r[iX]||'').trim());if(!xn)continue;
    let ex=w.exercises[w.exercises.length-1];if(!ex||ex.name!==xn){ex={name:xn,muscle:muscleOf(xn),sets:[]};w.exercises.push(ex)}
    let kg=iKg>=0?parseNum(r[iKg]):0;if(!kg&&iLb>=0)kg=Math.round(parseNum(r[iLb])*0.45359237*10)/10;
    let reps=Math.round(parseNum(r[iR]));if(!reps&&iD>=0&&parseNum(r[iD]))reps=Math.round(parseNum(r[iD]));
    const type=(iTy>=0?r[iTy]:'').toLowerCase();
    ex.sets.push({kg,reps,done:true,...(type==='warmup'?{w:true}:{})});
  }
  return[...map.values()].sort((a,b)=>a.start-b.start);
}
function importPreview(){
  const p=S.importPrev;if(p.error)return `<div class="note">${esc(p.error)}</div>`;
  const have=new Set(S.workouts.map(w=>w.id));const nuevos=p.list.filter(w=>!have.has(w.id));
  if(p.running)return `<div class="stack" style="gap:6px"><span class="small">Importando ${p.done} de ${p.total}…</span><div class="prog"><i style="width:${p.done/p.total*100}%"></i></div></div>`;
  if(p.finished)return `<div class="note"><b>Listo.</b> Se importaron ${p.total} entrenamientos. Mirá tu progreso en la pestaña Progreso.</div>`;
  return `<div class="note">Encontré <b>${p.list.length}</b> entrenamientos, del ${fDate(p.list[0].start)} al ${fDate(p.list[p.list.length-1].start)}. ${nuevos.length===p.list.length?'Todos son nuevos.':`<b>${nuevos.length}</b> son nuevos (los demás ya estaban).`}</div>${nuevos.length?`<button class="btn pri" data-act="do-import">Importar ${nuevos.length} entrenamientos</button>`:''}`;
}
async function doImport(){
  const p=S.importPrev;const have=new Set(S.workouts.map(w=>w.id));const list=p.list.filter(w=>!have.has(w.id));
  p.running=true;p.done=0;p.total=list.length;refreshImport();
  // récords calculados en orden cronológico
  const temp=[...S.workouts];
  for(const w of list){
    try{S.workouts=[...temp].sort((a,b)=>b.start-a.start);w.prs=computePRs(w);temp.push(w);await store.put('workouts',w.id,w)}catch(e){p.running=false;p.error='Se cortó la importación en el entrenamiento '+(p.done+1)+'. Volvé a elegir el archivo para seguir: lo ya importado no se duplica.';refreshImport();return}
    p.done++;if(p.done%5===0||p.done===p.total)refreshImport();
  }
  p.running=false;p.finished=true;refreshImport();
}
function refreshImport(){const b=$('#imp-box');if(b)b.innerHTML=importPreview()}

/* ---------- gráficos SVG ---------- */
let CH={},chartSeq=0;
function chartBox(spec){const id='c'+(++chartSeq);CH[id]=spec;return `<div class="chart" data-chart="${id}" style="height:${spec.h}px"></div>`}
function drawCharts(){$$('[data-chart]').forEach(el=>{const sp=CH[el.dataset.chart];if(!sp)return;const w=Math.max(200,el.clientWidth);el.innerHTML=sp.type==='line'?lineSVG(sp,w):barSVG(sp,w);if(sp.type==='line')readout(el,sp)})}
let rzT=0;window.addEventListener('resize',()=>{clearTimeout(rzT);rzT=setTimeout(drawCharts,150)});
function niceTicks(min,max,n){if(min===max){min-=1;max+=1}const span=max-min,step0=span/n,mag=Math.pow(10,Math.floor(Math.log10(step0))),e=step0/mag;const step=(e<1.5?1:e<3?2:e<7?5:10)*mag;const lo=Math.floor(min/step)*step,hi=Math.ceil(max/step)*step;const t=[];for(let v=lo;v<=hi+step/2;v+=step)t.push(+v.toFixed(6));return{lo,hi,t}}
function lineSVG(sp,W){
  const H=sp.h,P={l:40,r:16,t:22,b:24},pts=sp.pts;
  let x0=pts[0].x,x1=pts[pts.length-1].x;if(x0===x1){x0-=DAY*3;x1+=DAY*3}
  const ys=pts.map(p=>p.y);const tk=niceTicks(Math.min(...ys),Math.max(...ys),3);
  const X=x=>P.l+(x-x0)/(x1-x0)*(W-P.l-P.r),Y=y=>P.t+(1-(y-tk.lo)/(tk.hi-tk.lo))*(H-P.t-P.b);
  sp._X=X;sp._Y=Y;sp._W=W;
  let g='';tk.t.forEach(v=>{g+=`<line class="grid" x1="${P.l}" x2="${W-P.r}" y1="${Y(v)}" y2="${Y(v)}"/><text class="axis" x="${P.l-6}" y="${Y(v)+4}" text-anchor="end">${sp.fmt(v)}</text>`});
  const xl=[x0,(x0+x1)/2,x1];xl.forEach((x,i)=>{g+=`<text class="axis" x="${X(x)}" y="${H-6}" text-anchor="${i===0?'start':i===2?'end':'middle'}">${fShort(x)}</text>`});
  const d=pts.map((p,i)=>(i?'L':'M')+X(p.x).toFixed(1)+' '+Y(p.y).toFixed(1)).join(' ');
  const area=d+` L${X(pts[pts.length-1].x).toFixed(1)} ${H-P.b} L${X(pts[0].x).toFixed(1)} ${H-P.b} Z`;
  let dots='';if(pts.length<=60)pts.slice(0,-1).forEach(p=>dots+=`<circle class="dt" cx="${X(p.x)}" cy="${Y(p.y)}" r="3"/>`);
  const L=pts[pts.length-1],lx=X(L.x),ly=Y(L.y);
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Gráfico de línea">${g}<path class="ar" d="${area}"/><path class="ln" d="${d}"/>${dots}<circle class="dt last" cx="${lx}" cy="${ly}" r="5"/><text class="vl" x="${Math.min(lx,W-P.r)}" y="${ly-10}" text-anchor="end">${sp.fmt(L.y)}</text><line class="cur" id="cur" x1="0" x2="0" y1="${P.t}" y2="${H-P.b}" visibility="hidden"/></svg>`;
}
function readout(el,sp){
  const tip=document.createElement('div');tip.className='tip';tip.hidden=true;el.appendChild(tip);const cur=el.querySelector('#cur');
  const show=e=>{const r=el.getBoundingClientRect();const x=e.clientX-r.left;let best=null,bd=1e9;sp.pts.forEach(p=>{const dd=Math.abs(sp._X(p.x)-x);if(dd<bd){bd=dd;best=p}});if(!best)return;
    const px=sp._X(best.x);tip.hidden=false;tip.textContent=best.lab;tip.style.left=Math.min(Math.max(px,70),sp._W-70)+'px';tip.style.top='-6px';cur.setAttribute('x1',px);cur.setAttribute('x2',px);cur.setAttribute('visibility','visible')};
  el.addEventListener('pointermove',show);el.addEventListener('pointerdown',show);
  el.addEventListener('pointerleave',()=>{tip.hidden=true;cur.setAttribute('visibility','hidden')});
}
function barSVG(sp,W){
  const H=sp.h,P={l:8,r:8,t:20,b:22},n=sp.cats.length,mx=Math.max(1,...sp.cats.map(c=>c.y));
  const bw=(W-P.l-P.r)/n,Y=y=>P.t+(1-y/mx)*(H-P.t-P.b);let g=`<line class="grid" x1="${P.l}" x2="${W-P.r}" y1="${H-P.b}" y2="${H-P.b}"/>`;
  sp.cats.forEach((c,i)=>{const x=P.l+i*bw+bw*.18,w=bw*.64,y=Y(c.y);g+=`<rect class="vbar ${i===n-1?'last':''}" x="${x}" y="${y}" width="${w}" height="${Math.max(0,H-P.b-y)}" rx="4"/><text class="axis" x="${x+w/2}" y="${H-6}" text-anchor="middle">${c.lab}</text>${c.y?`<text class="vl" x="${x+w/2}" y="${y-6}" text-anchor="middle" style="font-weight:600;font-size:11px">${sp.fmt(c.y)}</text>`:''}`});
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Gráfico de barras">${g}</svg>`;
}

/* ---------- texto de Claude (markdown mínimo) ---------- */
function md(t){
  const lines=esc(t).split('\n');let h='',ul=false;
  for(let l of lines){l=l.trim();const bold=s=>s.replace(/\*\*(.+?)\*\*/g,'<b>$1</b>');
    if(/^#{1,4}\s+/.test(l)||/^\*\*[^*]+\*\*:?$/.test(l)){if(ul){h+='</ul>';ul=false}h+=`<h4>${l.replace(/^#+\s+/,'').replace(/\*\*/g,'').replace(/:$/,'')}</h4>`}
    else if(/^[-•*]\s+/.test(l)){if(!ul){h+='<ul>';ul=true}h+=`<li>${bold(l.replace(/^[-•*]\s+/,''))}</li>`}
    else if(l){if(ul){h+='</ul>';ul=false}h+=`<p>${bold(l)}</p>`}}
  if(ul)h+='</ul>';return h;
}
function trainingSummary(){
  const now=Date.now();const w30=S.workouts.filter(w=>w.start>=now-30*DAY);const w90=S.workouts.filter(w=>w.start>=now-90*DAY);
  let s=`Entrenamientos: ${S.workouts.length} en total; ${w30.length} en los últimos 30 días; ${w90.length} en los últimos 90 días (${nf(w90.length/13)} por semana).\n`;
  const ms=muscleSets(30);s+='Series efectivas por músculo en los últimos 30 días: '+MUSCLES.map(m=>`${m} ${ms[m]}`).join(', ')+'.\n';
  s+='Progreso de los ejercicios más hechos (1RM estimado, hace ~90 días → último):\n';
  exerciseCounts().slice(0,10).forEach(([n])=>{const h=history(n).filter(x=>x.t>=now-120*DAY);if(!h.length)return;const a=h[0],b=h[h.length-1];
    s+=`- ${n}: ${a.e1?nf(a.e1)+' kg':a.reps+' reps'} (${fShort(a.t)}) → ${b.e1?nf(b.e1)+' kg':b.reps+' reps'} (${fShort(b.t)}), ${h.length} sesiones, mejor serie reciente ${b.best.kg?nf(b.best.kg)+' kg × '+b.best.reps:b.best.reps+' reps'}\n`});
  const ws=allWeights();
  if(ws.length)s+=`Peso corporal: ${ws.map(b=>`${fShort(b.date)} ${nf(b.kg)} kg`).slice(-8).join(', ')}.\n`;
  return s;
}
// un solo registro de peso: el de la dieta (Hoy) manda; los registros de Físico completan los días que falten
function dietWeightMap(){const m=new Map();try{(window.PORCION?window.PORCION.weights():[]).forEach(w=>m.set(w.k,{date:w.date,kg:w.kg}))}catch{}return m}
function allWeights(){
  const m=dietWeightMap();S.body.filter(b=>b.kg>0).forEach(b=>{const k=dayKey(b.date);if(!m.has(k))m.set(k,{date:b.date,kg:b.kg})});
  return [...m.values()].sort((a,b)=>a.date-b.date);
}
const bodyKg=(b,dm)=>{const w=(dm||dietWeightMap()).get(dayKey(b.date));return w?w.kg:b.kg};
async function getSample(){if(S.sample)return S.sample;try{S.sample=(window.claude&&window.claude.use)?await window.claude.use('sample'):null}catch{S.sample=null}return S.sample}
async function coach(){
  const sample=await getSample();if(!sample){sheetMsg('No disponible acá',(window.PORCION_WEB?'El análisis con IA todavía no está activado en esta versión.':'El análisis con Claude funciona cuando abrís la app desde Claude con tu cuenta.'));return}
  S.busy.coach=true;S.coach='';render(true);
  const prompt=`Sos un entrenador de musculación argentino, directo y concreto. Analizá los datos de entrenamiento de esta persona y decile cómo viene y qué ajustar. Hablá en español rioplatense, de vos.
DATOS (fecha de hoy ${fDate(Date.now())}):
${trainingSummary()}${window.PORCION?window.PORCION.nutritionSummary():''}
Respondé con estos títulos exactos en negrita, cada uno en su línea: **Cómo venís**, **Lo que está funcionando**, **Lo que frena tu progreso**, **Qué cambiar las próximas 4 semanas** (concreto: ejercicios, series por semana, rango de reps, frecuencia). Usá viñetas cortas. Basate solo en estos números; si faltan datos para algo, decilo. Máximo 280 palabras.`;
  try{const r=await sample(prompt,{cache:false,onText:u=>{S.coach=u.text;const b=$('#coach-box .ana');if(b)b.innerHTML=md(u.text);else{const box=$('#coach-box');if(box){const d=document.createElement('div');d.className='ana';d.innerHTML=md(u.text);box.prepend(d);const p=box.querySelector('p.muted');if(p)p.remove()}}}});S.coach=r.text}
  catch(e){S.coach='';sheetMsg('No se pudo analizar',e&&e.code==='rate_limited'?'Hiciste muchos pedidos seguidos. Esperá un rato y probá de nuevo.':e&&e.code==='not_granted'?'Hay que darle permiso a la app para consultar a Claude.':'Probá de nuevo en un momento.')}
  S.busy.coach=false;render(true);
}
async function resizeImage(file,max=1400){
  const url=URL.createObjectURL(file);
  try{const img=await new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=url});
    const sc=Math.min(1,max/Math.max(img.naturalWidth,img.naturalHeight));const c=document.createElement('canvas');c.width=Math.round(img.naturalWidth*sc);c.height=Math.round(img.naturalHeight*sc);
    c.getContext('2d').drawImage(img,0,0,c.width,c.height);return await new Promise(r=>c.toBlob(b=>r(b||file),'image/jpeg',.86))}
  catch{return file}finally{URL.revokeObjectURL(url)}
}
async function blobFor(b){
  if(S.blobs[b.id])return S.blobs[b.id].blob;if(!b.photoId)return null;
  const src='/_blob/'+b.photoId;
  try{const r=await fetch(src);if(r.ok)return await r.blob()}catch{}
  try{const img=await new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=src});const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;c.getContext('2d').drawImage(img,0,0);return await new Promise(r=>c.toBlob(r,'image/jpeg',.86))}catch{return null}
}
async function saveBody(){
  const dv=$('#bf-date').value,kg=parseNum($('#bf-kg').value),file=$('#bf-photo').files[0],note=$('#bf-note').value.trim();
  if(!kg&&!file){sheetMsg('Falta el dato','Cargá tu peso, una foto o las dos cosas.');return}
  const [y,m,d]=(dv||dayKey(Date.now())).split('-').map(Number);const date=new Date(y,m-1,d,12).getTime();
  const id=uid();const row={date,kg:kg||null,note:note||'',photoId:null,analisis:''};
  S.busy.body=true;render(true);
  try{
    if(file){
      const blob=await resizeImage(file);
      if(!S.assets){try{S.assets=(window.claude&&window.claude.use)?await window.claude.use('assets'):null}catch{S.assets=null}}
      if(S.assets){const up=await S.assets.upload(blob,{type:'image/jpeg'});row.photoId=up.id}
      else{S.blobs[id]={blob,url:URL.createObjectURL(blob)};try{await idb.put(id,blob);row.localPhoto=1}catch{row.note=(row.note?row.note+' · ':'')+'foto sin guardar'}}
    }
    await store.put('body',id,row);
    if(row.kg&&window.PORCION)try{window.PORCION.logWeight(dayKey(date),row.kg)}catch{}
  }catch(e){S.busy.body=false;render(true);sheetMsg('No se pudo guardar',e&&e.code==='quota_exceeded'?'Se llenó el espacio para fotos. Borrá algunas viejas.':'Revisá la conexión y probá de nuevo.');return}
  S.busy.body=false;render(true);
}
async function analyze(id){
  const b=S.body.find(x=>x.id===id);if(!b)return;
  const sample=await getSample();if(!sample){sheetMsg('No disponible acá',(window.PORCION_WEB?'El análisis con IA todavía no está activado en esta versión.':'El análisis con Claude funciona cuando abrís la app desde Claude con tu cuenta.'));return}
  let lim=null;try{lim=await sample.limits()}catch{}
  if(!lim||!lim.images){sheetMsg('No disponible acá','En esta vista Claude no puede mirar fotos. Probá abriendo la app desde Claude en el navegador o en la app.');return}
  S.busy[id]=true;render(true);
  const imgs=[];const cur=await blobFor(b);if(!cur){S.busy[id]=false;render(true);sheetMsg('No se pudo leer la foto','Probá cargándola de nuevo.');return}
  imgs.push(cur);
  const prev=S.body.filter(x=>x.date<b.date&&(x.photoId||S.blobs[x.id])).sort((a,c)=>c.date-a.date)[0];
  let prevB=null;if(prev&&lim.images.maxCount>1)prevB=await blobFor(prev);if(prevB)imgs.push(prevB);
  const prompt=`Sos un entrenador de musculación argentino con buen ojo, honesto y motivador. Te mandan ${prevB?'dos fotos de su físico: la PRIMERA es la de hoy ('+fDate(b.date)+') y la SEGUNDA es la anterior ('+fDate(prev.date)+'), para comparar':'una foto de su físico ('+fDate(b.date)+')'}.${b.kg?` Peso ese día: ${nf(b.kg)} kg.`:''}${b.note?` Nota: ${b.note}.`:''}
Sus datos de entrenamiento:
${trainingSummary()}
Respondé en español rioplatense, de vos, con estos títulos exactos en negrita, cada uno en su línea: **Lo que veo**, ${prevB?'**Cambios desde la foto anterior**, ':''}**Puntos fuertes**, **A mejorar**, **Plan para las próximas 4 semanas** (ejercicios concretos, series y reps, cruzado con lo que muestran sus datos: si un músculo que se ve atrasado tiene pocas series, decilo), **Para la próxima foto** (cómo sacarla para comparar mejor). Viñetas cortas. No inventes medidas ni un porcentaje de grasa exacto: si das un rango, aclará que es una estimación a ojo. Si la foto no deja ver bien (luz, ángulo, ropa), decilo. Nada de diagnósticos médicos. Máximo 350 palabras.`;
  try{
    const r=await sample(prompt,{images:imgs,cache:false,onText:u=>{const el=$('#ana-'+id);if(el)el.innerHTML=md(u.text)}});
    await store.put('body',id,{...b,analisis:r.text,analizadoEn:Date.now()});
  }catch(e){sheetMsg('No se pudo analizar',e&&e.code==='rate_limited'?'Hiciste muchos pedidos seguidos. Esperá un rato y probá de nuevo.':e&&e.code==='image_rejected'?'La foto no se pudo leer. Probá con otra (JPG o PNG).':e&&e.code==='not_granted'?'Hay que darle permiso a la app para consultar a Claude.':'Probá de nuevo en un momento.')}
  S.busy[id]=false;render(true);
}
async function backup(){
  const L=[['fecha','entrenamiento','ejercicio','musculo','serie','tipo','kg','reps']];
  [...S.workouts].sort((a,b)=>a.start-b.start).forEach(w=>(w.exercises||[]).forEach(ex=>ex.sets.forEach((s,i)=>L.push([new Date(w.start).toLocaleString('es-AR'),w.title,ex.name,ex.muscle||'',i+1,s.w?'calentamiento':'normal',s.kg,s.reps]))));
  const csv='﻿'+L.map(r=>r.map(v=>{v=String(v??'');return /[",;\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v}).join(',')).join('\n');
  try{await S.downloads.save({filename:`fierro-entrenamientos-${dayKey(Date.now())}.csv`,data:new Blob([csv],{type:'text/csv'})})}catch(e){if(e&&e.code==='unavailable')sheetMsg('No disponible','En esta vista no se pueden descargar archivos.')}
}

/* ---------- hojas ---------- */
function openSheet(title,body,foot,top){const s=$('#gsheet');s.innerHTML=`<div class="pane" role="dialog" aria-label="${esc(title)}"><div class="ph"><h2>${esc(title)}</h2><button class="btn ghost" data-act="close-sheet">Cerrar</button></div>${top?`<div class="ptop">${top}</div>`:''}<div class="pb">${body}</div>${foot?`<div class="pf">${foot}</div>`:''}</div>`;s.hidden=false}
function closeSheet(){const s=$('#gsheet');s.hidden=true;s.innerHTML='';S.sheet=null}
function sheetMsg(t,m){openSheet(t,`<p style="margin:0">${esc(m)}</p><button class="btn pri block" data-act="close-sheet">Entendido</button>`)}
function confirmSheet(t,m,ok,fn){S.sheet={confirm:fn};openSheet(t,`<p style="margin:0">${esc(m)}</p><div class="row"><button class="btn" data-act="close-sheet" style="flex:1">Cancelar</button><button class="btn pri" data-act="confirm-ok" style="flex:1;${/Borrar|Descartar|Quitar/.test(ok)?'background:var(--bad)':''}">${esc(ok)}</button></div>`)}
/* selector de ejercicios: mode 'active' agrega al entrenamiento; 'routine' edita rutina; 'browse' solo mira */
function openPicker(mode,routine){
  S.sheet={mode,routine,q:'',mg:'Todos',sel:routine?[...(routine.exercises||[])]:[],order:false,only:false};
  const isR=mode==='routine',isB=mode==='browse';
  const top=`${isR?`<input class="inp" id="rt-name" value="${esc(routine.name||'')}" placeholder="Nombre (ej: Lunes - Pecho y tríceps)" aria-label="Nombre de la rutina">`:''}
  <div class="pkq"><input class="inp" id="pk-q" type="search" placeholder="Buscar entre ${CAT.length+S.custom.length} ejercicios" autocomplete="off"></div>
  <div class="chips" id="pk-mg">${['Todos',...MUSCLES.filter(m=>m!=='Otro')].map(m=>`<button class="chip" data-act="pk-mg" data-v="${m}" aria-pressed="${m==='Todos'}">${m}</button>`).join('')}</div>
  ${isB?'':`<div id="pk-tray"></div>`}`;
  const body=`${isB?`<p class="small muted" style="margin:0">Tocá un ejercicio para ver cómo se hace.</p>`:''}
  <div class="exlist" id="pk-list"></div>
  <div class="card stack" id="pk-new" hidden><b>Crear ejercicio nuevo</b><div class="field"><label for="nx-name">Nombre</label><input class="inp" id="nx-name"></div><div class="field"><label for="nx-mg">Músculo</label><select class="inp" id="nx-mg">${MUSCLES.map(m=>`<option>${m}</option>`).join('')}</select></div><button class="btn pri" data-act="create-ex">${isB?'Crear':'Crear y agregar'}</button></div>`;
  const foot=isB?'':isR?`<button class="btn pri block" data-act="save-routine" id="pk-save">Guardar rutina</button>`:`<button class="btn pri block" data-act="pk-add" id="pk-add" disabled>Agregar</button>`;
  openSheet(isB?'Ejercicios':isR?(routine.id?'Editar rutina':'Nueva rutina'):'Agregar ejercicios',body,foot,top);
  $('#pk-q').addEventListener('input',e=>{S.sheet.q=e.target.value;S.sheet.order=false;pickerList();$('#gsheet .pb').scrollTop=0});
  pickerList();
}
const foldTxt=x=>x.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
function autoRoutineName(sel){const c={};sel.forEach(n=>{const m=muscleOf(n);c[m]=(c[m]||0)+1});const ms=Object.entries(c).sort((a,b)=>b[1]-a[1]).map(x=>x[0].toLowerCase()).slice(0,2);return ms.length?ms[0][0].toUpperCase()+ms.join(' y ').slice(1):'Mi rutina'}
function pickerTray(){
  const P=S.sheet,el=$('#pk-tray');if(!el)return;const isR=P.mode==='routine';
  if(!P.sel.length){el.innerHTML=`<p class="tiny muted" style="margin:0">${isR?'Tocá los ejercicios en el orden en que los hacés. Después los podés reordenar.':'Tocá uno o varios ejercicios y agregalos juntos.'}</p>`;return}
  el.innerHTML=`<div class="tray"><span class="tl">${P.sel.length} ${P.sel.length===1?'elegido':'elegidos'}</span><div class="chips">${P.sel.map((n,i)=>`<button class="chip on" data-act="pk-toggle" data-n="${esc(n)}" aria-label="Quitar ${esc(n)}">${i+1}. ${esc(n)} <span aria-hidden="true">✕</span></button>`).join('')}</div>${isR&&P.sel.length>1?`<button class="chip" data-act="pk-order" aria-pressed="${P.order}">${P.order?'Listo':'Ordenar'}</button>`:''}</div>`;
}
function pickerList(){
  const P=S.sheet;const isB=P.mode==='browse',isR=P.mode==='routine';
  pickerTray();
  const add=$('#pk-add');if(add){add.disabled=!P.sel.length;add.textContent=P.sel.length?`Agregar ${P.sel.length} ${P.sel.length===1?'ejercicio':'ejercicios'}`:'Elegí ejercicios para agregar'}
  const sv=$('#pk-save');if(sv)sv.textContent=P.sel.length?`Guardar rutina · ${P.sel.length} ${P.sel.length===1?'ejercicio':'ejercicios'}`:'Guardar rutina';
  if(P.order&&isR){
    $('#pk-list').innerHTML=`<p class="small muted" style="margin:4px 0 8px">Usá las flechas para ordenar.</p>`+P.sel.map((n,i)=>`<div class="exitem sel ordrow"><span class="ordn">${i+1}</span><div class="exmain"><b>${esc(n)}</b><span>${esc(muscleOf(n))}</span></div><div class="ordbtn"><button class="plus" data-act="pk-up" data-i="${i}" aria-label="Subir" ${i?'':'disabled'}>↑</button><button class="plus" data-act="pk-down" data-i="${i}" aria-label="Bajar" ${i<P.sel.length-1?'':'disabled'}>↓</button><button class="plus rm" data-act="pk-toggle" data-n="${esc(n)}" aria-label="Quitar">✕</button></div></div>`).join('');
    $('#pk-new').hidden=true;return;
  }
  const words=foldTxt(P.q.trim()).split(/\s+/).filter(Boolean);const used=new Map(exerciseCounts());
  const all=new Map(allEx());exerciseCounts().forEach(([n])=>{if(!all.has(n))all.set(n,muscleOf(n))});
  const list=[...all.entries()].filter(([n,m])=>(P.mg==='Todos'||m===P.mg)&&words.every(w=>foldTxt(n).includes(w)));
  const item=([n,m])=>{const sel=P.sel.includes(n),u=used.get(n),eq=EQN[exMeta(n).eq]||'';
    return `<div class="exitem ${sel?'sel':''}"><button class="exinfo" data-act="ex-info" data-n="${esc(n)}" aria-label="Ver cómo se hace ${esc(n)}">${thumb(n)}</button><button class="exmain" data-act="${isB?'ex-info':'pk-toggle'}" data-n="${esc(n)}"><b>${esc(n)}</b><span>${esc(P.mg==='Todos'&&!words.length?eq:m+' · '+eq)}${u?` · hecho ${u} ${u===1?'vez':'veces'}`:''}</span></button>${isB?'':`<button class="plus" data-act="pk-toggle" data-n="${esc(n)}" aria-label="${sel?'Quitar':'Agregar'}">${sel?'✓':'+'}</button>`}</div>`};
  let h='';
  if(!list.length)h=`<p class="muted small" style="margin:8px 0">No hay ningún ejercicio con ese nombre.</p>`;
  else if(P.mg==='Todos'&&!words.length){
    const top=[...used.keys()].slice(0,8);
    if(top.length)h+=`<h3 class="grp">Los que más hacés <span>${top.length}</span></h3>`+top.map(n=>item([n,all.get(n)])).join('');
    MUSCLES.forEach(g=>{const gl=list.filter(([,m])=>m===g);if(gl.length)h+=`<h3 class="grp">${g} <span>${gl.length}</span></h3>`+gl.map(item).join('')});
  }else{list.sort((a,b)=>(used.get(b[0])||0)-(used.get(a[0])||0));h=list.map(item).join('')}
  $('#pk-list').innerHTML=h;
  const nw=$('#pk-new');nw.hidden=!words.length||list.some(([n])=>foldTxt(n)===foldTxt(P.q.trim()));if(!nw.hidden){$('#nx-name').value=P.q.trim();if(P.mg!=='Todos')$('#nx-mg').value=P.mg}
}
/* ficha del ejercicio */
function openExercise(name){
  const m=exMeta(name);const hh=history(name);const P=S.sheet;const canAdd=P&&P.sel&&P.mode!=='browse';
  let hist='';
  if(hh.length){const best=hh.reduce((a,x)=>x.e1>a.e1?x:a,hh[0]),last=hh[hh.length-1];
    hist=`<div class="card list"><div class="li"><span class="muted small">Lo hiciste</span><b>${hh.length} ${hh.length===1?'vez':'veces'}</b></div><div class="li"><span class="muted small">Última vez (${fShort(last.t)})</span><b>${last.best.kg?nf(last.best.kg)+' kg × '+last.best.reps:last.best.reps+' reps'}</b></div>${best.e1?`<div class="li"><span class="muted small">Tu mejor 1RM estimado</span><b>${nf(best.e1,0)} kg</b></div>`:''}</div>`}
  const q=encodeURIComponent('cómo hacer '+name.replace(/[()]/g,'')+' técnica');
  const s2=$('#gsheet2');
  s2.innerHTML=`<div class="pane" role="dialog" aria-label="${esc(name)}"><div class="ph"><h2>${esc(name)}</h2><button class="btn ghost" data-act="close-sheet2">Cerrar</button></div><div class="pb">
  ${photoOf(name)?`<div class="exphoto" role="img" aria-label="Fotos del movimiento: posición inicial y final"><div class="f f0" style="background-image:url('ex/${photoOf(name)[0]}.jpg')"></div><div class="f f1" style="background-image:url('ex/${photoOf(name)[0]}.jpg')"></div><span class="lbl0">Inicio</span><span class="lbl1">Final</span></div>`:''}
  <div class="exvis ${photoOf(name)?'solo':''}">${photoOf(name)?'':`<div class="figbig" id="figbig" role="img" aria-label="Figura animada del movimiento"></div>`}<div class="mmapbox">${muscleMap(name)}${musclesLegend(name)}</div></div>
  <div class="row wrap" style="gap:6px"><span class="pill" style="background:var(--accent-soft);color:var(--accent)">${esc(m.g)}</span><span class="pill">${esc(EQN[m.eq]||'')}</span>${m.sec?`<span class="small muted">También trabaja: ${esc(m.sec)}</span>`:''}</div>
  ${m.steps.length?`<div class="sec"><h2>Cómo hacerlo</h2><ol class="steps">${m.steps.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></div>`:`<p class="muted small" style="margin:0">Es un ejercicio que agregaste vos: no tiene explicación cargada.</p>`}
  ${m.tip?`<div class="note"><b>Consejo:</b> ${esc(m.tip)}</div>`:''}
  ${hist}
  <a class="btn block" href="https://www.youtube.com/results?search_query=${q}" target="_blank" rel="noopener">Ver videos de cómo se hace ↗</a>
  ${photoOf(name)?`<p class="tiny muted" style="margin:0;text-align:center">Fotos: Free Exercise DB, de dominio público.</p>`:''}
  ${canAdd?`<button class="btn pri block" data-act="pk-toggle-close" data-n="${esc(name)}">${P.sel.includes(name)?'Quitar de la lista':P.mode==='routine'?'Agregar a la rutina':'Agregar al entrenamiento'}</button>`:''}
  </div></div>`;
  s2.hidden=false;if($('#figbig'))animateFig($('#figbig'),name);
}
function closeSheet2(){const s=$('#gsheet2');s.hidden=true;s.innerHTML='';cancelAnimationFrame(figAnim)}
$('#gsheet2').addEventListener('click',e=>{if(e.target.id==='gsheet2')closeSheet2()});

/* ---------- eventos ---------- */
document.addEventListener('click',async e=>{
  const t=e.target.closest('[data-act]');if(!t)return;const a=t.dataset.act;
  const E=+t.dataset.e,Si=+t.dataset.s;const A=S.active;
  switch(a){
    case 'start-empty':if(S.active){S.tab='entrenar';render(true)}else startActive(newWorkout());break;
    case 'goto-active':S.tab='entrenar';render(true);break;
    case 'goto-prog':S.tab='progreso';lsSet('fierro:tab','progreso');render(true);setTimeout(()=>{const el=$('#gym .mwl');el&&el.scrollIntoView({block:'center'})},60);break;
    case 'goto-train':S.tab='entrenar';lsSet('fierro:tab','entrenar');render(true);window.scrollTo(0,0);if(!S.routines.length&&!S.active)openPicker('routine',{name:'',exercises:[]});break;
    case 'goto-import':S.tab='perfil';render(true);setTimeout(()=>{const el=$('#import');el&&el.scrollIntoView()},50);break;
    case 'more-feed':S.feedN+=15;render(true);break;
    case 'repeat':{if(S.active){sheetMsg('Ya tenés un entrenamiento abierto','Terminalo o descartalo antes de empezar otro.');break}const w=S.workouts.find(x=>x.id===t.dataset.id);if(w){const nw=newWorkout(w.title,(w.exercises||[]).map(x=>x.name));if(w.rid)nw.rid=w.rid;startActive(nw)}break}
    case 'del-workout':confirmSheet('¿Borrar este entrenamiento?','Se borra para siempre, con todas sus series.','Borrar',()=>store.del('workouts',t.dataset.id));break;
    case 'new-routine':openPicker('routine',{name:'',exercises:[]});break;
    case 'edit-routine':{const r=S.routines.find(x=>x.id===t.dataset.id);if(r)openPicker('routine',r);break}
    case 'del-routine':confirmSheet('¿Borrar esta rutina?','Tus entrenamientos hechos con ella no se borran.','Borrar',()=>store.del('routines',t.dataset.id));break;
    case 'start-routine':{closeSheet();if(S.active){sheetMsg('Ya tenés un entrenamiento abierto','Terminalo o descartalo antes de empezar otro.');break}const r=S.routines.find(x=>x.id===t.dataset.id);if(r){const w=newWorkout(r.name,r.exercises);w.rid=r.id;startActive(w)}break}
    case 'set-done':{const s=A.exercises[E].sets[Si];
      if(!s.done){const prev=setGuess(A.exercises[E],Si,A.start);if((s.kg===''||s.kg==null)&&prev)s.kg=prev.kg;if((s.reps===''||s.reps==null)&&prev)s.reps=prev.reps;
        if(s.reps===''||s.reps==null||!parseNum(s.reps)){const el=$(`#rp-${E}-${Si}`);el&&el.focus();break}
        if(s.kg===''||s.kg==null)s.kg=0;s.done=true;if(!s.w)startRest()}
      else s.done=false;
      saveActive();render(true);break}
    case 'stp':{const ex=A.exercises[E];const si=ex.sets.findIndex(x=>!x.done);if(si<0)break;const st=ex.sets[si];const g=setGuess(ex,si,A.start)||{};const f=t.dataset.f,d=+t.dataset.d;const CA=isCardio(ex);
      let v=parseNum((st[f]!==''&&st[f]!=null)?st[f]:(g[f]??0))||0;
      if(f==='kg'){const k=CA?0.5:(v>=20?2.5:1);const n=v/k;v=Math.max(0,Math.round((d>0?(Number.isInteger(+n.toFixed(6))?n+1:Math.ceil(n)):(Number.isInteger(+n.toFixed(6))?n-1:Math.floor(n)))*k*10)/10)}else{v=Math.max(CA?1:1,v+d*(CA?5:1))}
      if(f==='kg'&&(st.reps===''||st.reps==null)&&g.reps!=null)st.reps=g.reps;if(f==='reps'&&(st.kg===''||st.kg==null)&&g.kg!=null)st.kg=g.kg;
      st[f]=String(v);saveActive();render(true);break}
    case 'use-sugg':{const ex=A.exercises[E];const sg=suggestFor(ex.name,A.start);if(sg)ex.sets.forEach(s=>{if(!s.done&&!s.w){s.kg=sg.kg;s.reps=sg.reps}});saveActive();render(true);break}
    case 'prev-fill':{const prev=(lastSetsOf(A.exercises[E].name,A.start)||[])[Si];if(prev){const s=A.exercises[E].sets[Si];s.kg=prev.kg;s.reps=prev.reps;saveActive();render(true)}break}
    case 'routine-prog':openRoutineProg(t.dataset.id);break;
    case 'set-type':{const key=E+'-'+Si;S.typeOpen=S.typeOpen===key?null:key;render(true);break}
    case 'set-kind':{const s=A.exercises[E].sets[Si];const k=t.dataset.k;if(k==='w'){s.w=true;delete s.drop}else if(k==='d'){s.w=false;if(!dropsOf(s).length)s.drop=[{kg:'',reps:''}]}else{s.w=false;delete s.drop}S.typeOpen=null;saveActive();render(true);
      if(k==='d')setTimeout(()=>{const el=$(`#gym input[data-k="dreps"][data-e="${E}"][data-s="${Si}"][data-d="0"]`);el&&el.focus()},60);break}
    case 'drop-add':{const s=A.exercises[E].sets[Si];s.drop=[...dropsOf(s),{kg:'',reps:''}];saveActive();render(true);break}
    case 'add-set':{const ex=A.exercises[E];const last=ex.sets[ex.sets.length-1];ex.sets.push({kg:last?last.kg:'',reps:last?last.reps:'',done:false});saveActive();render(true);break}
    case 'ex-menu':S.menuOpen=S.menuOpen===E?null:E;render(true);break;
    case 'rm-set':A.exercises[E].sets.pop();if(!A.exercises[E].sets.length)A.exercises.splice(E,1);S.menuOpen=null;saveActive();render(true);break;
    case 'rm-ex':A.exercises.splice(E,1);S.menuOpen=null;saveActive();render(true);break;
    case 'ex-up':if(E>0){[A.exercises[E-1],A.exercises[E]]=[A.exercises[E],A.exercises[E-1]];S.menuOpen=E-1;saveActive();render(true)}break;
    case 'ex-down':if(E<A.exercises.length-1){[A.exercises[E+1],A.exercises[E]]=[A.exercises[E],A.exercises[E+1]];S.menuOpen=E+1;saveActive();render(true)}break;
    case 'add-ex':openPicker('active');break;
    case 'finish':finishActive();break;
    case 'discard':confirmSheet('¿Descartar el entrenamiento?','No se guarda nada de lo que anotaste hoy.','Descartar',()=>{S.active=null;S.rest=null;lsSet('fierro:activo',null);store.setDoc('estado/activo',{w:null}).catch(()=>{});render(true)});break;
    case 'rest-def':S.ajustes.descanso=Math.max(15,Math.min(600,(S.ajustes.descanso||90)+(+t.dataset.d)));store.setDoc('config/ajustes',S.ajustes).catch(()=>{});render(true);break;
    case 'rest-adj':if(S.rest){S.rest.end+=(+t.dataset.d)*1000;S.rest.total=Math.max(S.rest.total,(S.rest.end-Date.now())/1000);tickRest()}break;
    case 'rest-skip':S.rest=null;renderRest();break;
    case 'metric':S.progMetric=t.dataset.v;render(true);break;
    case 'range':S.range=t.dataset.v;render(true);break;
    case 'coach':coach();break;
    case 'save-body':saveBody();break;
    case 'analyze':analyze(t.dataset.id);break;
    case 'del-body':{const b=S.body.find(x=>x.id===t.dataset.id);confirmSheet('¿Borrar este registro?',b&&b.photoId?'Se borran el peso, la foto y el análisis.':'Se borra para siempre.','Borrar',async()=>{await store.del('body',b.id);if(b.localPhoto){try{await idb.del(b.id)}catch{}}if(b.photoId){try{S.assets=S.assets||await window.claude.use('assets');S.assets&&await S.assets.delete(b.photoId)}catch{}}});break}
    case 'zoom':openSheet('Foto',`<img class="bigphoto" src="${esc(t.dataset.src)}" alt="Foto del físico">`);break;
    case 'do-import':doImport();break;
    case 'del-custom':S.custom.splice(+t.dataset.i,1);_exMap=null;store.setDoc('config/ejercicios',{lista:S.custom}).catch(()=>{});render(true);break;
    case 'backup':backup();break;
    case 'close-sheet':closeSheet();break;
    case 'close-sheet2':closeSheet2();break;
    case 'ex-info':openExercise(t.dataset.n);break;
    case 'browse':openPicker('browse');break;
    case 'pk-toggle-close':{const n=t.dataset.n,P=S.sheet;const i=P.sel.indexOf(n);if(i>=0)P.sel.splice(i,1);else P.sel.push(n);closeSheet2();pickerList();break}
    case 'confirm-ok':{const fn=S.sheet&&S.sheet.confirm;closeSheet();if(fn){try{await fn()}catch{sheetMsg('No se pudo','Revisá la conexión y probá de nuevo.')}}break}
    case 'pk-mg':S.sheet.mg=t.dataset.v;$$('#pk-mg .chip').forEach(c=>c.setAttribute('aria-pressed',String(c.dataset.v===S.sheet.mg)));pickerList();break;
    case 'pk-toggle':{const n=t.dataset.n,P=S.sheet;const i=P.sel.indexOf(n);if(i>=0)P.sel.splice(i,1);else P.sel.push(n);pickerList();break}
    case 'create-ex':{const n=$('#nx-name').value.trim(),m=$('#nx-mg').value;if(!n)break;if(!allEx().has(n)){S.custom.push({name:n,muscle:m});_exMap=null;store.setDoc('config/ejercicios',{lista:S.custom}).catch(()=>{})}if(S.sheet.mode!=='browse')S.sheet.sel.push(n);S.sheet.q='';$('#pk-q').value='';pickerList();break}
    case 'pk-add':{const P=S.sheet;P.sel.forEach(n=>S.active.exercises.push(newEx(n)));closeSheet();saveActive();render(true);break}
    case 'pk-order':S.sheet.order=!S.sheet.order;pickerList();$('#gsheet .pb').scrollTop=0;break;
    case 'pk-up':case 'pk-down':{const P=S.sheet,i=+t.dataset.i,j=a==='pk-up'?i-1:i+1;if(j>=0&&j<P.sel.length){[P.sel[i],P.sel[j]]=[P.sel[j],P.sel[i]];pickerList()}break}
    case 'save-routine':{const P=S.sheet;if(!P.sel.length){$('#pk-q').focus();break}const name=$('#rt-name').value.trim()||autoRoutineName(P.sel);const r={name,exercises:P.sel};const id=P.routine.id||uid();closeSheet();try{await store.put('routines',id,r)}catch{sheetMsg('No se pudo guardar','Revisá la conexión y probá de nuevo.')}break}
  }
});
document.addEventListener('input',e=>{
  if(e.target&&e.target.id==='cmp-r'){cmpSet(+e.target.value);return}
  const t=e.target;const k=t.dataset&&t.dataset.k;if(!k)return;
  if(k==='title'&&S.active){S.active.title=t.value;saveActive();return}
  if((k==='dkg'||k==='dreps')&&S.active){const s=S.active.exercises[+t.dataset.e].sets[+t.dataset.s];const d=dropsOf(s)[+t.dataset.d];if(d){d[k==='dkg'?'kg':'reps']=t.value.replace(',','.');saveActive();updateLive()}return}
  if((k==='kg'||k==='reps')&&S.active){const s=S.active.exercises[+t.dataset.e].sets[+t.dataset.s];s[k]=t.value.replace(',','.');saveActive();updateLive();return}
});
document.addEventListener('change',async e=>{
  if(e.target&&(e.target.id==='cmp-a'||e.target.id==='cmp-b')){S.cmp={a:$('#cmp-a').value,b:$('#cmp-b').value};render(true);return}
  const t=e.target;
  if(t.id==='pg-ex'){S.progEx=t.value;t.blur();render(true);return}
  if(t.id==='hevy-file'&&t.files[0]){
    try{const txt=await t.files[0].text();const list=parseHevy(txt);S.importPrev=list.length?{list}:{error:'El archivo no tiene entrenamientos.'}}
    catch(err){S.importPrev={error:'Ese archivo no parece una exportación de Hevy. Fijate de elegir el .csv de "Exportar entrenamientos".'}}
    refreshImport();
  }
});
$('#gsheet').addEventListener('click',e=>{if(e.target.id==='gsheet')closeSheet()});

/* ---------- puente con la dieta ---------- */
function gymLoad(k){return window.GYM._load0(k)}
window.GYM={
  show(){render(true)},
  day(k){try{return this._day0(k)}catch(e){return null}},
  _day0(k){const ws=S.workouts.filter(w=>w&&dayKey(w.start)===k);if(!ws.length)return null;const st=ws.map(wStats);return{n:ws.length,title:ws.map(w=>w.title).join(' + '),sets:st.reduce((a,x)=>a+x.sets,0),vol:st.reduce((a,x)=>a+x.vol,0),min:Math.round(ws.reduce((a,w)=>a+((w.end||w.start)-w.start),0)/60000),muscles:[...new Set(ws.flatMap(w=>(w.exercises||[]).map(e=>e.muscle)))].slice(0,4)}},
  active(){return S.active?{title:S.active.title}:null},
  load(k){try{return gymLoad(k)}catch(e){console.warn('load',e);return null}},
  _load0(k){const ws=S.workouts.filter(w=>w&&dayKey(w.start)===k);if(S.active&&dayKey(S.active.start)===k)ws.push(S.active);if(!ws.length)return null;let str=0,sets=0,hv=0;const cardio=[];const HEAVYG=/sentadilla|peso muerto|prensa|hip thrust|estocada|búlgara|buenos d|cargada|arranque|thruster|swing|subidas al caj|granjero|trineo|push press|remo con barra|remo pendlay|remo t /i;
    ws.forEach(w=>{const dur=((w.end||Date.now())-w.start)/60000;let cmin=0,ss=0;(w.exercises||[]).forEach(ex=>{if(!ex||!ex.name)return;const ds=doneSets(ex);const m=MUSCLES.includes(ex.muscle)?ex.muscle:muscleOf(ex.name);
      if(m==='Cardio'){const mn=Math.min(240,ds.reduce((a,s)=>a+(parseFloat(String(s.reps).replace(',','.'))||0),0)),km=ds.reduce((a,s)=>a+(parseFloat(String(s.kg).replace(',','.'))||0),0);if(mn>0){cardio.push({name:ex.name,min:Math.round(mn),km:km>0&&km<100?km:0});cmin+=mn}}else{ss+=ds.length;if(HEAVYG.test(ex.name))hv+=ds.length}});
      sets+=ss;if(ss){let m=dur-cmin;if(!(m>5))m=ss*2.5;m=Math.min(m,ss*5,150);str+=Math.max(m,ss*1.5)}});
    return{str:Math.round(str),sets,heavy:hv,cardio}},
  open(tab){S.tab=tab||'inicio';render(true)},
  local(){return S.mode==='local'},
  // para rachas, logros y el resumen semanal de la dieta
  stats(fromMs,toMs){const ws=S.workouts.filter(w=>w&&w.start>=(fromMs||0)&&w.start<(toMs||9e15));const st=ws.map(wStats);
    return{all:S.workouts.length,weeks:weeksStreak(),prsAll:S.workouts.reduce((a,w)=>a+((w.prs||[]).length),0),n:ws.length,vol:st.reduce((a,x)=>a+x.vol,0),sets:st.reduce((a,x)=>a+x.sets,0),prs:ws.flatMap(w=>(w.prs||[]).map(p=>({ex:p.ex,txt:p.txt}))),loaded:!!S.loaded.workouts}},
  async exportAll(){const toUrl=bl=>new Promise(r=>{const fr=new FileReader();fr.onload=()=>r(fr.result);fr.onerror=()=>r(null);fr.readAsDataURL(bl)});
    const photos={};for(const b of S.body){if(S.blobs[b.id]&&!b.photoId){const u=await toUrl(S.blobs[b.id].blob);if(u)photos[b.id]=u}}
    return JSON.parse(JSON.stringify({workouts:S.workouts,routines:S.routines,body:S.body,custom:S.custom,ajustes:S.ajustes,activo:S.active||null,photos}))},
  async importAll(g){if(!g||typeof g!=='object')return 0;let n=0;
    const have={workouts:new Set(S.workouts.map(x=>x.id)),routines:new Set(S.routines.map(x=>x.id)),body:new Set(S.body.map(x=>x.id))};
    for(const col of ['workouts','routines','body']){for(const r of (Array.isArray(g[col])?g[col]:[])){if(!r||typeof r.id!=='string'||have[col].has(r.id))continue;const row={...r};
      if(col==='body'&&g.photos&&typeof g.photos[r.id]==='string'&&g.photos[r.id].startsWith('data:image/')){try{const bl=await (await fetch(g.photos[r.id])).blob();S.blobs[r.id]={blob:bl,url:URL.createObjectURL(bl)};if(S.mode==='local'){await idb.put(r.id,bl);row.localPhoto=1}}catch{}}
      try{await store.put(col,r.id,row);n++}catch{}}}
    if(Array.isArray(g.custom)){const names=new Set(S.custom.map(c=>c.name));const add=g.custom.filter(c=>c&&typeof c.name==='string'&&!names.has(c.name));if(add.length){S.custom=[...S.custom,...add];_exMap=null;try{await store.setDoc('config/ejercicios',{lista:S.custom})}catch{}}}
    if(g.ajustes&&typeof g.ajustes==='object'){S.ajustes={...g.ajustes,...S.ajustes};try{await store.setDoc('config/ajustes',S.ajustes)}catch{}}
    render(true);return n}
};
/* ---------- arranque ---------- */
render(true);
store.init();
(async()=>{
  if(!(window.claude&&window.claude.use))return;
  try{S.downloads=await window.claude.use('downloads');if(S.tab==='perfil')render()}catch{}
})();
