/* Mesociclo 3. Additive program: legacy definitions and session snapshots remain unchanged. */
"use strict";
const M3 = {
    id: "mesociclo-3-2026-11-23", start: "2026-11-23", pause: "2026-12-17",
    title: "MESOCICLO 3 — SCIENCE-BASED HYPERTROPHY", weeks: 8,
    key: "ft_mesocycle3", backupKey: "ft_backup_before_mesocycle3",
    indices: [7, 8, 9]
};
const M3_MUSCLES = ["Pettorali","Gran dorsale","Grande rotondo","Romboidi","Deltoidi anteriori","Deltoidi laterali","Deltoidi posteriori","Trapezi superiori","Trapezi medi","Trapezi inferiori","Bicipiti","Brachiale","Tricipiti","Avambracci","Quadricipiti","Femorali","Glutei","Polpacci","Retto addominale"];
// Primary/secondary roles describe this execution, not fractional equivalent sets.
const M3_CATALOG = {
    hack: {n:"Hack Squat macchina",primary:["Quadricipiti","Glutei"],secondary:[],
        setup:"Regola i fermi di sicurezza prima di caricare. Schiena e bacino sullo schienale, spalle sotto i cuscini. Piedi circa larghezza spalle, punte leggermente aperte, tutta la pianta sulla pedana. Impugna le maniglie.",
        start:"Sblocca il carrello con ginocchia quasi estese, senza bloccarle violentemente.",
        concentric:"Dalla profondità tollerata spingi la pedana con tutta la pianta; ginocchia nella direzione delle punte.",
        end:"Torna in alto mantenendo bacino e schiena in appoggio e una lieve flessione delle ginocchia.",
        eccentric:"Scendi in circa 2 secondi flettendo anche e ginocchia finché mantieni talloni e bacino stabili.",
        errors:["Talloni sollevati → regola la posizione dei piedi e riduci la profondità.","Ginocchia che collassano all'interno → seguile nella direzione delle punte.","Bacino che si stacca → termina la discesa prima di perdere l'appoggio."]},
    chestConvergent: {n:"Chest Press convergente",primary:["Pettorali"],secondary:["Deltoidi anteriori","Tricipiti"],
        setup:"Regola il sedile perché le maniglie siano a metà petto. Piedi a terra, bacino e schiena appoggiati. Polsi in linea con gli avambracci e gomiti circa 30–60° dal busto.",
        start:"Maniglie ai lati del petto, gomiti piegati; scegli un'apertura che non provochi fastidio davanti alla spalla.",
        concentric:"Spingi avanti seguendo la convergenza dei bracci, senza staccare la schiena.",
        end:"Braccia quasi distese; non forzare il contatto delle maniglie né incastrare i gomiti.",
        eccentric:"Lascia riaprire i bracci in 2 secondi fino al punto iniziale controllato.",
        errors:["Sedile troppo basso → rialza fino alle maniglie a metà petto.","Polsi piegati → allinea nocche e avambracci.","Spalle sollevate o schiena staccata → riduci carico e mantieni appoggi stabili."]},
    row: {n:"Rematore Chest-Supported",primary:["Gran dorsale","Romboidi","Trapezi medi"],secondary:["Bicipiti","Brachiale","Deltoidi posteriori","Trapezi inferiori"],
        setup:"Regola sedile e supporto in modo che il cuscino sostenga lo sterno senza ostacolare la respirazione. Piedi stabili, bacino neutro, presa neutra; maniglie raggiungibili senza arrotondare la zona lombare.",
        start:"Braccia distese, scapole libere di avanzare leggermente, petto sempre sul supporto.",
        concentric:"Porta i gomiti indietro verso i fianchi e accompagna con le scapole, senza tirare con il collo.",
        end:"Maniglie vicino alle coste, gomiti vicino al busto; fermati prima di staccare il petto.",
        eccentric:"Distendi i gomiti e lascia avanzare le scapole in 2 secondi, mantenendo il torace appoggiato.",
        errors:["Petto staccato → riduci il peso.","Gomiti molto alti → indirizzali verso le coste per questa variante.","Slancio e collo proteso → mantieni testa in linea e ritorno controllato."]},
    legCurl: {n:"Leg Curl seduto",primary:["Femorali"],secondary:["Polpacci"],
        setup:"Allinea il ginocchio al perno della macchina. Regola lo schienale, il rullo sopra la parte bassa della gamba e il fermacosce appena sopra le ginocchia. Schiena e bacino appoggiati, mani alle maniglie.",
        start:"Ginocchia quasi distese nel range tollerato, cosce bloccate dal cuscino senza compressione dolorosa.",
        concentric:"Fletti le ginocchia portando il rullo sotto il sedile senza sollevare le cosce.",
        end:"Raggiungi la flessione controllata; mantieni la contrazione per circa 1 secondo.",
        eccentric:"Lascia distendere le ginocchia in 2 secondi senza far sbattere i pesi.",
        errors:["Ginocchio fuori asse → regola sedile e rullo.","Bacino che scivola → stabilizza con schienale e fermacosce.","Ritorno a scatto → diminuisci il carico e controlla i 2 secondi."]},
    lateral: {n:"Alzate Laterali ai Cavi",primary:["Deltoidi laterali"],secondary:["Trapezi superiori"],
        setup:"Usa una maniglia al cavo basso. Mettiti di fianco alla colonna, piedi stabili; mano libera al supporto. Braccio leggermente davanti al busto, gomito appena piegato, polso neutro. Esegui entrambi i lati.",
        start:"Maniglia vicino al fianco opposto, cavo in tensione senza ruotare il busto.",
        concentric:"Solleva lateralmente il braccio nel piano della scapola, guidando con il gomito.",
        end:"Arriva circa all'altezza della spalla o prima se il range non è confortevole.",
        eccentric:"Riporta lentamente il braccio al fianco in 2 secondi senza appoggiare il pacco pesi.",
        errors:["Slancio del busto → alleggerisci e resta fermo.","Spalla verso l'orecchio → riduci carico e altezza.","Polso ruotato come per versare → mantieni una posizione naturale del pollice."]},
    cableCurl: {n:"Curl Bicipiti al Cavo",primary:["Bicipiti","Brachiale"],secondary:["Avambracci"],
        setup:"Collega una barra al cavo basso. Piedi alla larghezza del bacino, ginocchia morbide. Presa supina circa larghezza spalle, polsi allineati, gomiti vicino al busto.",
        start:"Braccia quasi distese, addome attivo, cavo già in tensione.",
        concentric:"Fletti i gomiti portando la barra verso le spalle senza spostare gli omeri avanti.",
        end:"Ferma la salita quando hai chiuso i gomiti mantenendo polsi e spalle stabili.",
        eccentric:"Estendi i gomiti in 2 secondi senza iperestenderli.",
        errors:["Busto inclinato indietro → riduci carico.","Gomiti che avanzano → tienili accanto ai fianchi.","Polsi flessi → mantienili in linea con gli avambracci."]},
    calf: {n:"Calf Raise in piedi",primary:["Polpacci"],secondary:[],
        setup:"Regola i cuscini sulle spalle e impugna i sostegni. Avampiedi sulla pedana, talloni liberi, piedi paralleli. Ginocchia quasi distese, schiena e bacino neutrali.",
        start:"Talloni abbassati in un allungamento confortevole, senza collassare sulla caviglia.",
        concentric:"Sali sulle punte spingendo attraverso gli avampiedi senza piegare le ginocchia.",
        end:"Raggiungi la massima altezza controllata e fermati circa 1 secondo.",
        eccentric:"Abbassa i talloni in 2 secondi fino all'allungamento tollerato.",
        errors:["Rimbalzo in basso → rallenta il cambio di direzione.","Ginocchia che pompano → mantieni l'angolo stabile.","Peso sul bordo esterno → distribuisci la pressione sull'avampiede."]},
    crunch: {n:"Crunch Press",primary:["Retto addominale"],secondary:["Obliqui"],
        setup:"Usa la macchina addominale dedicata: regola sedile e cuscini secondo il modello, piedi fermi e bacino stabile. Impugna le maniglie senza tirare con le braccia. Se la tua Crunch Press è una variante al cavo, registra un'attrezzatura distinta.",
        start:"Tronco in posizione neutra o appena estesa entro un range confortevole, senza inarcare la zona lombare.",
        concentric:"Avvicina le coste al bacino flettendo il tronco, senza trasformare il gesto in una spinta delle braccia.",
        end:"Addome contratto, collo in linea; fermo di circa 1 secondo senza schiacciare il mento sul petto.",
        eccentric:"Ritorna in 2 secondi alla posizione iniziale controllando l'apertura del tronco.",
        errors:["Tirare con le mani → usa le braccia solo per il contatto.","Muovere soltanto le anche → pensa a coste verso bacino.","Collo piegato → mantieni spazio sotto il mento."]},
    hip: {n:"Hip Thrust macchina",primary:["Glutei"],secondary:["Femorali"],
        setup:"Regola lo schienale sotto le scapole e la cintura o il cuscino sul bacino, non sull'addome. Piedi alla larghezza del bacino; in alto le tibie devono essere circa verticali. Impugna le maniglie.",
        start:"Bacino abbassato nel range della macchina, addome attivo e mento leggermente raccolto.",
        concentric:"Spingi con tutta la pianta ed estendi le anche sollevando il bacino.",
        end:"Allinea spalle, bacino e ginocchia; contrai i glutei 1 secondo senza inarcare la schiena.",
        eccentric:"Abbassa il bacino in 2 secondi mantenendo piedi e parte alta della schiena fermi.",
        errors:["Iperestensione lombare → termina quando le anche sono estese.","Piedi troppo lontani → cerca tibie circa verticali in alto.","Cuscino sull'addome → riposizionalo sul bacino prima di iniziare."]},
    lat: {n:"Lat Machine presa neutra",primary:["Gran dorsale","Grande rotondo"],secondary:["Bicipiti","Brachiale","Trapezi inferiori"],
        setup:"Regola il fermacosce aderente. Piedi a terra, bacino sul sedile. Impugna maniglie parallele con palmi rivolti uno verso l'altro, busto appena inclinato indietro.",
        start:"Braccia elevate e quasi distese, spalle libere di salire senza perdere il controllo.",
        concentric:"Porta i gomiti verso i fianchi e tira davanti al corpo, mantenendo il busto stabile.",
        end:"Maniglie verso la parte alta del petto, senza forzare il contatto né portare i gomiti molto dietro.",
        eccentric:"Distendi le braccia in 2 secondi lasciando risalire le scapole sotto controllo.",
        errors:["Trazione dietro la nuca → tira davanti al petto.","Dondolio → riduci il carico e fissa l'inclinazione.","Polsi piegati → allineali agli avambracci."]},
    incline: {n:"Panca inclinata manubri 15–30°",primary:["Pettorali"],secondary:["Deltoidi anteriori","Tricipiti"],
        setup:"Regola la panca tra 15 e 30°. Piedi stabili, glutei e dorso appoggiati; scapole comode e stabili. Porta i manubri in posizione con controllo, polsi sopra i gomiti.",
        start:"Manubri ai lati del petto alto, gomiti circa 30–60° dal busto, avambracci verticali.",
        concentric:"Spingi i manubri verso l'alto e leggermente all'interno senza urtarli.",
        end:"Braccia quasi distese sopra il torace alto, mantenendo glutei e piedi appoggiati.",
        eccentric:"Scendi in 2 secondi fino all'allungamento tollerato del petto senza forzare le spalle.",
        errors:["Panca troppo verticale → imposta 15–30°.","Gomiti aperti a 90° → avvicinali moderatamente al busto.","Manubri che rimbalzano → ferma e controlla il fondo."]},
    extension: {n:"Leg Extension",primary:["Quadricipiti"],secondary:[],
        setup:"Regola lo schienale con ginocchia allineate al perno. Rullo sulla tibia distale, sopra la caviglia, non sul piede. Bacino e schiena appoggiati, mani sulle maniglie.",
        start:"Ginocchia flesse nel range confortevole, piedi liberi e cosce ferme.",
        concentric:"Estendi le ginocchia sollevando il rullo senza lanciare il carico.",
        end:"Ginocchia quasi distese, senza colpi a fine corsa; mantieni il bacino fermo.",
        eccentric:"Fletti le ginocchia in 2 secondi senza far battere il pacco pesi.",
        errors:["Perno non allineato → regola sedile e schienale.","Bacino sollevato → riduci il peso e tieni gli appoggi.","Calcio esplosivo → solleva in circa 1 secondo con controllo."]},
    reverseFly: {n:"Reverse Pec Deck",primary:["Deltoidi posteriori"],secondary:["Romboidi","Trapezi medi"],
        setup:"Siediti rivolto al cuscino. Regola il sedile con maniglie circa all'altezza delle spalle. Petto in appoggio, piedi fermi, gomiti leggermente piegati e polsi neutrali.",
        start:"Braccia davanti al torace, senza comprimere le spalle in un'apertura forzata.",
        concentric:"Apri le braccia lateralmente e indietro mantenendo costante l'angolo del gomito.",
        end:"Braccia circa in linea con il busto; non cercare di portarle molto dietro.",
        eccentric:"Richiudi in 2 secondi mantenendo il petto sul cuscino.",
        errors:["Trasformarlo in rematore → conserva l'angolo dei gomiti.","Spalle sollevate → alleggerisci e mantieni il collo rilassato.","Petto staccato → riduci l'escursione e il carico."]},
    overhead: {n:"Estensioni Tricipiti sopra testa al cavo",primary:["Tricipiti"],secondary:[],
        setup:"Collega la corda al cavo e posizionati con la schiena alla colonna. Piedi sfalsati e busto stabile. Porta le braccia sopra la testa nel range confortevole, gomiti rivolti avanti, addome attivo.",
        start:"Gomiti flessi, corda dietro la testa, polsi neutrali e braccia alte stabili.",
        concentric:"Estendi i gomiti spostando la corda avanti e in alto senza cambiare l'angolo delle spalle.",
        end:"Gomiti quasi estesi senza bloccarli; torace e bacino rimangono allineati.",
        eccentric:"Fletti i gomiti in 2 secondi tornando dietro la testa senza forzare l'allungamento.",
        errors:["Schiena inarcata → attiva l'addome e riduci il peso.","Gomiti che si allargano molto → mantieni una larghezza confortevole costante.","Braccia che oscillano → limita il movimento ai gomiti."]},
    shrug: {n:"Shrug con Manubri",primary:["Trapezi superiori"],secondary:["Avambracci"],
        setup:"In piedi con manubri ai lati, piedi larghezza bacino, ginocchia morbide. Presa neutra, braccia distese, testa e bacino neutrali.",
        start:"Spalle in posizione naturale, senza forzarle verso il basso.",
        concentric:"Solleva le spalle verso le orecchie senza piegare i gomiti.",
        end:"Fermati 1 secondo alla massima elevazione controllata, collo neutro.",
        eccentric:"Abbassa le spalle in 2 secondi senza lasciar cadere il peso.",
        errors:["Rotazioni circolari delle spalle → usa una salita e discesa verticale.","Gomiti flessi → lascia le braccia distese.","Mento proteso → guarda avanti e mantieni il collo in linea."]},
    reverseCrunch: {n:"Reverse Crunch a corpo libero",primary:["Retto addominale"],secondary:["Obliqui","Flessori dell'anca"],
        setup:"Sdraiati su un tappetino, braccia a terra ai lati. Anche e ginocchia flesse circa a 90°, zona lombare comoda e collo rilassato.",
        start:"Gambe raccolte senza slancio, addome attivo.",
        concentric:"Arrotola il bacino verso le coste sollevando il sacro di pochi centimetri.",
        end:"Bacino appena sollevato; tieni 1 secondo senza caricare collo e spalle.",
        eccentric:"Riappoggia lentamente il bacino in 2 secondi mantenendo le ginocchia piegate.",
        errors:["Lanciare le gambe → riduci l'ampiezza e parti fermo.","Solo flessione d'anca → solleva il sacro con retroversione del bacino.","Inarcare il ritorno → arresta le gambe prima di perdere controllo lombare."]},
    press: {n:"Pressa 45°",primary:["Quadricipiti","Glutei"],secondary:[],
        setup:"Regola schienale e fermi. Piedi sulla pedana circa larghezza spalle, punte appena aperte. Schiena e bacino appoggiati; mani sulle maniglie.",
        start:"Sblocca il carrello con gambe quasi distese e piedi completamente appoggiati.",
        concentric:"Spingi con tutta la pianta estendendo anche e ginocchia senza farle collassare all'interno.",
        end:"Gambe quasi distese senza blocco violento delle ginocchia.",
        eccentric:"Scendi in 2 secondi fino a prima che bacino o talloni si stacchino.",
        errors:["Bacino che si arrotola → riduci la profondità.","Ginocchia bloccate con slancio → ferma l'estensione prima del blocco.","Spingere con le mani sulle ginocchia → usa le maniglie e un carico gestibile."]},
    scott: {n:"Curl Panca Scott macchina",primary:["Bicipiti","Brachiale"],secondary:["Avambracci"],
        setup:"Regola il sedile con ascelle vicino al bordo superiore del cuscino, omeri appoggiati e gomiti allineati al perno. Piedi stabili, presa supina, polsi neutrali.",
        start:"Gomiti quasi distesi, mai forzati in iperestensione.",
        concentric:"Fletti i gomiti senza sollevare gli omeri dal cuscino.",
        end:"Avvicina le maniglie alle spalle mantenendo il petto e i polsi stabili.",
        eccentric:"Distendi in 2 secondi, rallentando soprattutto vicino al fondo.",
        errors:["Gomito fuori asse → regola l'altezza del sedile.","Spalle sollevate → mantieni gli omeri sul cuscino.","Caduta nel fondo → riduci il carico e non bloccare il gomito."]},
    pushdown: {n:"Push Down Tricipiti",primary:["Tricipiti"],secondary:[],
        setup:"Cavo alto con barra o corda, registra quale usi. Piedi stabili, busto appena inclinato, gomiti accanto ai fianchi e polsi neutrali.",
        start:"Gomiti flessi circa a 90° o nel range confortevole, braccia ferme.",
        concentric:"Estendi i gomiti spingendo la maniglia verso le cosce.",
        end:"Braccia quasi distese; non spostare le spalle avanti né forzare i polsi.",
        eccentric:"Lascia risalire la maniglia in 2 secondi mantenendo gli omeri fermi.",
        errors:["Usare il peso del busto → alleggerisci.","Gomiti avanti e indietro → tienili accanto ai fianchi.","Polsi piegati in basso → allinea mani e avambracci."]},
    wrist: {n:"Reverse Wrist Curl",primary:["Avambracci"],secondary:[],
        setup:"Siediti con avambracci appoggiati su panca o cosce e mani oltre il bordo. Presa prona su una barra leggera, palmi verso il basso, gomiti e avambracci immobili.",
        start:"Polsi leggermente flessi verso il basso in un range confortevole, presa sicura.",
        concentric:"Estendi soltanto i polsi sollevando il dorso delle mani.",
        end:"Polsi estesi entro il range controllabile, senza piegare i gomiti o sollevare gli avambracci.",
        eccentric:"Abbassa la barra in 2 secondi flettendo i polsi, senza aprire la presa.",
        errors:["Fare un reverse curl di gomito → lascia gli avambracci appoggiati.","Carico eccessivo → usa una barra molto leggera.","Forzare il fine corsa → riduci il range se senti fastidio."]}
};
M3_CATALOG.chestMachine = {...M3_CATALOG.chestConvergent,n:"Chest Press macchina",
    concentric:"Spingi avanti seguendo la traiettoria guidata della macchina, senza staccare schiena e bacino."};
M3_CATALOG.rowMachine = {...M3_CATALOG.row,n:"Rematore macchina con supporto"};
function m3Exercise(id,sets,reps,rir,recovery,tut="2-0-1",muscles){
    const info=M3_CATALOG[id];
    return {...info,id,sets,reps,rir,tut,recovery:recovery+" sec",muscles:muscles||info.primary.join(" · "),
        note:"RIR "+rir+" · TUT "+tut+" · progressione doppia · movimento controllato",programId:M3.id};
}
const M3_DAYS=[
    {label:"A",name:"FULL BODY A",color:"#43d9ff",exs:[
        m3Exercise("hack",3,"6-10","2",180),m3Exercise("chestConvergent",3,"8-12","2",180),
        m3Exercise("row",3,"8-12","1-2",150),m3Exercise("legCurl",3,"10-15","1-2",120,"2-1-1"),
        m3Exercise("lateral",2,"12-20","1-2",90),m3Exercise("cableCurl",2,"10-15","1-2",120),
        m3Exercise("calf",2,"10-15","1-2",90,"2-1-1","Gastrocnemio · Soleo"),
        m3Exercise("crunch",2,"10-15","1-2",90,"2-1-1")]},
    {label:"B",name:"FULL BODY B",color:"#43d9ff",exs:[
        m3Exercise("hip",3,"8-12","2",150,"2-1-1"),m3Exercise("lat",3,"8-12","1-2",150),
        m3Exercise("incline",3,"8-12","2",180,"2-0-1","Pettorali · enfasi clavicolare"),
        m3Exercise("extension",3,"10-15","1-2",120),m3Exercise("reverseFly",2,"12-20","1-2",90),
        m3Exercise("overhead",2,"10-15","1-2",120,"2-0-1","Tricipiti · capo lungo"),
        m3Exercise("shrug",3,"10-15","1-2",120,"2-1-1"),m3Exercise("reverseCrunch",2,"10-20","1-2",90,"2-1-1")]},
    {label:"C",name:"FULL BODY C",color:"#43d9ff",exs:[
        m3Exercise("press",3,"10-15","2",180),m3Exercise("lat",2,"8-12","1-2",150,"2-0-1","Gran dorsale"),
        m3Exercise("chestMachine",3,"8-12","1-2",180),m3Exercise("rowMachine",2,"10-15","1-2",120),
        m3Exercise("legCurl",3,"10-15","1-2",120,"2-1-1"),m3Exercise("lateral",2,"12-20","1-2",90),
        m3Exercise("scott",2,"10-15","1-2",120),m3Exercise("pushdown",2,"10-15","1-2",120),
        m3Exercise("wrist",2,"12-20","2",90),m3Exercise("crunch",2,"10-15","1-2",90,"2-1-1")]}
];
M3_DAYS.forEach((day,i)=>{DEF_DAYS[7+i]=day;});
let m3State=LS.get(M3.key)||{schema:1,resumedOn:null,medicalConfirmedAt:null,drafts:{},recoveries:{}};
let m3Ready=false;
function m3Snapshot(){
    const raw={};
    for(let i=0;i<localStorage.length;i++){
        const key=localStorage.key(i);
        if(key.startsWith("ft_")&&!key.startsWith("ft_backup_"))raw[key]=localStorage.getItem(key);
    }
    return {schema:1,createdAt:new Date().toISOString(),raw};
}
function m3Initialize(){
    try{
        if(window.m3RecoveryFailed)throw new Error("Importazione interrotta: recupero richiesto");
        if(!localStorage.getItem(M3.backupKey)){
            const snapshot=JSON.stringify(m3Snapshot());
            localStorage.setItem(M3.backupKey,snapshot);
            if(localStorage.getItem(M3.backupKey)!==snapshot)throw new Error("Backup non verificato");
        }
        m3Ready=true;
    }catch(error){console.error(error);}
}
function m3Persist(next){
    if(!m3Ready){flash("Backup non disponibile: libera spazio o esporta i dati prima di registrare.","#ff4567");return false;}
    if(!LS.set(M3.key,next)){flash("Salvataggio non riuscito. I dati precedenti sono conservati.","#ff4567");return false;}
    m3State=next;return true;
}
function m3Paused(date=todayStr()){
    return date>=M3.pause&&(!m3State.medicalConfirmedAt||!m3State.resumedOn||date<m3State.resumedOn);
}
function m3CompletedSessions(){
    return Object.entries(DB.entries).filter(([date,e])=>date>=M3.start&&date<=todayStr()&&e.programId===M3.id&&e.completed===true&&!e.skipped&&!m3Paused(date)).length;
}
const m3LegacySchedule=getDayWorkoutIdx;
getDayWorkoutIdx=function(day,date){
    if(!date||date<M3.start)return m3LegacySchedule(day,date);
    if(m3Paused(date))return REST_WORKOUT_IDX;
    if(DB.entries[date])return DB.entries[date].dayIdx;
    if(DB.dayOverrides[date]!==undefined)return DB.dayOverrides[date];
    return ({0:7,2:8,4:9})[day]??REST_WORKOUT_IDX;
};
const m3LegacyPhase=getPhaseProgress;
getPhaseProgress=function(){
    if(todayStr()<M3.start)return m3LegacyPhase();
    const completedSessions=m3CompletedSessions(),completedWeeks=Math.floor(completedSessions/3);
    return {completedSessions,totalSessions:24,completedWeeks,currentWeek:Math.min(8,completedWeeks+1),weeksLeft:Math.max(0,8-completedWeeks),pct:Math.min(100,completedSessions/24*100),done:completedSessions>=24};
};
const m3LegacyAdvance=advancePhase;
advancePhase=function(){
    if(todayStr()>=M3.start){flash("8 settimane concluse: valuta risultati e recupero prima del prossimo programma.","#43d9ff");return;}
    m3LegacyAdvance();
};
function m3Progression(ex,sets){
    const done=sets.filter(s=>s.completed===true);
    if(done.length!==ex.sets)return "Mantieni il carico: completa prima tutte le serie previste. Nessuno stallo dedotto da una sola seduta.";
    if(done.some(s=>s.pain?.trim()))return "Fastidio registrato: non aumentare il carico; valuta tecnica e tolleranza.";
    const max=Number(ex.reps.split("-").pop()),minRir=Number(ex.rir.split("-")[0]),maxRir=Number(ex.rir.split("-").pop());
    if(done.some(s=>s.rir===""||!Number.isFinite(Number(s.rir))||!s.technique))return "Servono RIR effettivo e conferma della tecnica per valutare un aumento.";
    if(done.every(s=>Number(s.reps)>=max&&Number(s.rir)>=minRir&&Number(s.rir)<=maxRir)&&new Set(done.map(s=>Number(s.kg))).size===1){
        return "Valuta il minimo incremento disponibile (indicativamente 2–5%) nella prossima seduta, confermando tu il peso. Non aumentare il volume automaticamente.";
    }
    return "Mantieni il carico e migliora gradualmente le ripetizioni nel range rispettando RIR e tecnica. Un calo isolato non è uno stallo.";
}
function m3Previous(ex,date,gym,equipment){
    for(const [d,e] of Object.entries(DB.entries).filter(([d,e])=>d<date&&!e.skipped).sort((a,b)=>b[0].localeCompare(a[0]))){
        const sets=(e.sets||[]).filter(s=>s.completed!==false&&matchesEquipment(e,s,ex.n,gym,equipment,-1,-1));
        if(sets.length)return {date:d,sets};
    }
    return null;
}
function m3Section(title,children,open=false){
    const details=el("details",{class:"m3-section"},[el("summary",{},[title]),el("div",{class:"m3-section-body"},children)]);
    details.open=open;return details;
}
function m3Text(text){return el("p",{},[text]);}
const M3_IMAGES={}; // Only reviewed, existing files may be registered here.
function m3ImagePanel(ex,phase){
    const src=M3_IMAGES[ex.id]?.[phase];
    const caption=phase==="start"?"Posizione iniziale":"Posizione finale";
    if(!src)return el("div",{class:"m3-image-pending"},[el("strong",{},[caption]),m3Text("Illustrazione in preparazione"),m3Text(phase==="start"?ex.start:ex.end)]);
    const img=el("img",{src,alt:ex.n+" — "+caption,loading:"lazy"});
    return el("button",{class:"m3-image-button",onclick:()=>openModal(ex.n+" — "+caption,body=>body.appendChild(el("img",{src,alt:caption,style:"width:100%;height:auto"})))},[img,caption]);
}
function m3Guide(ex,previous){
    const wrap=el("div",{class:"m3-guide"});
    wrap.appendChild(m3Section("A · Panoramica",[
        m3Text(ex.n+" · "+ex.sets+" × "+ex.reps+" · RIR previsto "+ex.rir+" · Recupero "+ex.recovery),
        m3Text("TUT "+ex.tut+": secondi di eccentrica – pausa in contrazione – concentrica. È una guida di controllo, non un tempo dimostrato universalmente superiore."),
        m3Text("Principali: "+ex.muscles+". Secondari: "+(ex.secondary.join(", ")||"nessun gruppo conteggiato separatamente")+".")
    ],true));
    wrap.appendChild(m3Section("B · Preparazione",[m3Text(ex.setup)]));
    wrap.appendChild(m3Section("C · Esecuzione",[
        el("ol",{},[ex.start,ex.concentric,ex.end,ex.eccentric,"Espira durante lo sforzo, inspira nel ritorno; mantieni il tronco stabile senza trattenere a lungo il respiro."].map(t=>el("li",{},[t])))
    ]));
    wrap.appendChild(m3Section("D · Errori comuni",ex.errors.map(m3Text)));
    wrap.appendChild(m3Section("E · Muscoli",[
        m3Text("Lavoro diretto: "+ex.primary.join(", ")+"."),
        m3Text("Partecipazione secondaria: "+(ex.secondary.join(", ")||"non conteggiata")+"."),
        m3Text(ex.id==="wrist"?"Focus: estensori del polso, non flessori del gomito.":ex.id==="calf"?"Gastrocnemio e soleo; il ginocchio rimane quasi esteso.":"I ruoli dipendono dall'esecuzione; le serie indirette non equivalgono automaticamente a serie dirette.")
    ]));
    wrap.appendChild(m3Section("F · Progressione",[
        m3Text(previous?"Ultima seduta comparabile: "+previous.date+" — "+previous.sets.map(s=>(s.kg||"—")+" kg × "+s.reps+" · RIR effettivo "+(s.rir===""||s.rir==null?"non registrato":s.rir)).join("; "):"Nessuna prestazione precedente per questa attrezzatura."),
        m3Text(m3Progression(ex,previous?.sets||[]))
    ]));
    wrap.appendChild(m3Section("G · Immagini",[
        el("div",{class:"m3-images"},[m3ImagePanel(ex,"start"),m3ImagePanel(ex,"end")]),
        m3Text("Le illustrazioni mancanti non sono sostituite con macchine o movimenti diversi. Nessuna animazione biomeccanica non verificata.")
    ]));
    return wrap;
}
function m3SaveEntries(next){
    if(!m3Ready)return false;
    if(!LS.set("ft_entries",next)){flash("Salvataggio fallito: riprova o esporta un backup.","#ff4567");return false;}
    DB.entries=next;return true;
}
function m3Draft(date,wIdx){
    const saved=DB.entries[date];
    if(m3State.drafts[date]?.dayIdx===wIdx)return structuredClone(m3State.drafts[date]);
    if(saved?.dayIdx===wIdx&&saved.programId===M3.id)return structuredClone(saved);
    const exercises=getExDefs(wIdx).map(ex=>({...ex}));
    return {programId:M3.id,dayIdx:wIdx,gymId:logGym,exercises,equipment:Object.fromEntries(exercises.map((ex,ei)=>[ei,{...equipmentFor(ex.n,logGym)}])),sets:[],notes:"",completed:false};
}
function m3SaveDraft(date,draft){
    const next={...m3State,drafts:{...m3State.drafts,[date]:structuredClone(draft)}};
    const old=m3State;
    if(!m3Persist(next))return false;
    // Edits to a previously completed set invalidate its old recorded performance.
    if(DB.entries[date]?.programId===M3.id){
        const session={...structuredClone(draft),sets:draft.sets.filter(s=>s.completed).map(s=>({...s})),completed:!!draft.completed,ts:new Date().toISOString()};
        if(!m3SaveEntries({...DB.entries,[date]:session})){m3Persist(old);return false;}
    }
    return true;
}
function m3Field(label,type,value,change,attrs={}){
    const input=el(type==="textarea"?"textarea":"input",{class:"inp",...(type==="textarea"?{}:{type}),"aria-label":label,...attrs});
    input.value=value??"";input.addEventListener("input",()=>change(input.value));
    return el("label",{class:"m3-field"},[el("span",{},[label]),input]);
}
function m3Resume(){
    openModal("Ripresa manuale",body=>{
        body.appendChild(m3Text("Riprendi soltanto dopo l'autorizzazione del medico. Non è prevista alcuna data automatica."));
        const check=el("input",{type:"checkbox"});
        body.appendChild(el("label",{class:"m3-check"},[check," Confermo di aver ricevuto l'autorizzazione medica alla ripresa dell'allenamento."]));
        const resume=el("button",{class:"btn btn-acc",onclick:()=>{
            if(!check.checked)return;
            if(m3Persist({...m3State,resumedOn:todayStr(),medicalConfirmedAt:new Date().toISOString()})){closeModal();initLogDay();render();}
        }},["Riprendi da oggi"]);
        resume.disabled=true;check.onchange=()=>{resume.disabled=!check.checked;};body.appendChild(resume);
    });
}
function m3ProgramPanel(c,date){
    const progress=getPhaseProgress();
    c.appendChild(campaignCard({name:M3.title,weeks:8},progress));
    const panel=hudPanel([],"selected","padding:14px");
    panel.appendChild(m3Text("Inizio 23/11/2026 · 3 sedute/settimana · 8 settimane effettive = 24 sedute concluse. Obiettivo: crescita muscolare e ricomposizione."));
    panel.appendChild(m3Text("17/12: partenza per Tirana. 18/12: intervento previsto. Sospensione dal 17/12 senza scadenza automatica, senza allenamenti saltati e senza avanzamento delle settimane."));
    if(m3Paused(date)){
        panel.appendChild(m3Text("PROGRAMMA SOSPESO — storico e prestazioni conservati."));
        if(todayStr()>=M3.pause)panel.appendChild(el("button",{class:"btn btn-acc",onclick:m3Resume},["Ripresa con autorizzazione medica"]));
    }else if(m3State.resumedOn&&date>=m3State.resumedOn){
        panel.appendChild(m3Text("RIADATTAMENTO: nelle prime sedute valuta meno serie (es. 1–2 per esercizio) e RIR 3–4, secondo tolleranza e indicazioni mediche. Nessuna modifica automatica a carichi o volume."));
    }
    panel.appendChild(el("button",{class:"btn",onclick:()=>openModal("Programma e fonti",body=>{
        body.appendChild(m3Text("RIR generalmente 1–3, cedimento non obbligatorio, recuperi adeguati, volume recuperabile e progressione graduale. La combinazione precisa di esercizi, serie, TUT e giorni è una scelta pratica, non una prescrizione universalmente superiore."));
        [["Prossimità al cedimento: revisione e meta-analisi","https://pubmed.ncbi.nlm.nih.gov/36334240/"],["Recuperi: revisione e meta-analisi","https://pubmed.ncbi.nlm.nih.gov/39205815/"],["Prescrizioni di allenamento: network meta-analisi","https://pubmed.ncbi.nlm.nih.gov/37414459/"]].forEach(([title,url])=>body.appendChild(el("p",{},[el("a",{href:url,target:"_blank",rel:"noopener"},[title])])));
    })},["Principi e fonti scientifiche"]));
    c.appendChild(panel);
}
let m3LogWeek=weekKey(todayStr());
const m3OriginalGetDayDate=getDayDate;
getDayDate=function(index){return addDaysStr(m3LogWeek,index);};
const m3LegacyRenderLog=renderLog;
renderLog=function(c){
    const date=getDayDate(logDayIdx);
    c.appendChild(m3Field("Data allenamento","date",date,value=>{
        if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return;
        m3LogWeek=weekKey(value);const d=localDateFromString(value);logDayIdx=(d.getDay()+6)%7;
        initLogDay();render();
    }));
    if(date<M3.start)return m3LegacyRenderLog(c);
    c.appendChild(playerStatusPanel(getPlayerStats()));
    const pills=el("div",{class:"day-pills"});
    DEF_DAYS.slice(0,7).forEach((d,i)=>pills.appendChild(el("button",{class:"day-pill btn"+(i===logDayIdx?" btn-acc":""),onclick:()=>{logDayIdx=i;initLogDay();logView="plan";render();}},[d.label])));
    c.appendChild(pills);c.appendChild(m3Text(date));
    m3ProgramPanel(c,date);
    if(!m3Ready){c.appendChild(systemEmpty("BACKUP NON RIUSCITO","Registrazione bloccata per proteggere i dati esistenti. Esporta il backup dallo storico e libera spazio."));return;}
    if(m3Paused(date))return;
    const wIdx=getDayWorkoutIdx(logDayIdx,date);
    if(!M3.indices.includes(wIdx)){
        if(DB.entries[date]){c.appendChild(m3Text("Seduta precedente conservata nello storico."));return;}
        c.appendChild(systemEmpty("RECUPERO","Lunedì A · Mercoledì B · Venerdì C"));
        c.appendChild(el("button",{class:"btn",onclick:()=>m3ChooseWorkout(date)},["Scegli una seduta"]));return;
    }
    const day=DEF_DAYS[wIdx],draft=m3Draft(date,wIdx);
    c.appendChild(missionCard(day,date,wIdx));
    c.appendChild(m3Text(draft.exercises.reduce((n,e)=>n+e.sets,0)+" serie previste · RIR previsto distinto dal RIR effettivo."));
    c.appendChild(gymPicker(draft.gymId,gym=>{draft.gymId=gym;draft.equipment=Object.fromEntries(draft.exercises.map((ex,ei)=>[ei,{...equipmentFor(ex.n,gym)}]));logGym=gym;m3SaveDraft(date,draft);render();},draft.sets.some(s=>s.completed)));
    const persist=()=>{
        draft.completed=false;
        const saved=m3SaveDraft(date,draft);
        if(saved)document.querySelectorAll(".m3-complete-button").forEach(button=>{
            const set=draft.sets.find(s=>s.ei===Number(button.dataset.ei)&&s.slot===Number(button.dataset.slot));
            button.textContent=set?.completed?"✓ Completata — annulla":"Completa serie e avvia recupero";
            button.classList.toggle("btn-acc",!!set?.completed);
        });
        return saved;
    };
    draft.exercises.forEach((ex,ei)=>{
        const card=hudPanel([],"quest crystal-card m3-exercise","padding:14px");
        card.appendChild(crystalFrame());
        card.appendChild(el("h2",{class:"plan-ex-name"},[ex.n]));
        card.appendChild(m3Text(ex.sets+" × "+ex.reps+" · RIR previsto "+ex.rir+" · TUT "+ex.tut+" · "+ex.recovery));
        const equipment=draft.equipment[ei]||equipmentFor(ex.n,draft.gymId);
        const previous=m3Previous(ex,date,draft.gymId,equipment);
        card.appendChild(m3Guide(ex,previous));
        card.appendChild(m3Field("Attrezzatura (marca / modello / regolazioni)","text",equipment.name,value=>{
            if(draft.sets.some(s=>s.ei===ei&&s.completed))return;
            draft.equipment[ei]={id:normalizeExerciseName(value)||"default",name:value,notes:"",shared:false};persist();
        },draft.sets.some(s=>s.ei===ei&&s.completed)?{disabled:"disabled"}:{}));
        const seconds=m3State.recoveries[ex.id]||parseRecoverySec(ex.recovery);
        card.appendChild(m3Field("Recupero personalizzato (secondi)","number",seconds,value=>{
            const n=Number(value);if(Number.isInteger(n)&&n>=10&&n<=1800)m3Persist({...m3State,recoveries:{...m3State.recoveries,[ex.id]:n}});
        },{min:"10",max:"1800",step:"5"}));
        for(let index=0;index<ex.sets;index++){
            let set=draft.sets.find(s=>s.ei===ei&&s.slot===index);
            if(!set){set={ei,slot:index,exName:ex.n,kg:"",reps:"",rir:"",note:"",pain:"",technique:false,completed:false};draft.sets.push(set);}
            const row=el("div",{class:"m3-set"});
            row.appendChild(el("strong",{},["Serie "+(index+1)]));
            const old=previous?.sets[index];
            if(old)row.appendChild(m3Text("Precedente: "+(old.kg||"—")+" kg × "+(old.reps||"—")+" · RIR "+(old.rir==null||old.rir===""?"non registrato":old.rir)));
            const fields=el("div",{class:"m3-fields"});
            [["Peso (kg)","kg",{min:"0",step:"0.5"}],["Ripetizioni","reps",{min:"1",step:"1"}],["RIR effettivo","rir",{min:"0",max:"10",step:"0.5"}]].forEach(([label,key,attrs])=>{
                fields.appendChild(m3Field(label,"number",set[key],value=>{set[key]=value;set.completed=false;persist();},{...attrs,inputmode:"decimal"}));
            });
            row.appendChild(fields);
            row.appendChild(m3Field("Note tecniche","text",set.note,value=>{set.note=value;set.completed=false;persist();}));
            row.appendChild(m3Field("Dolore o fastidio (vuoto = nessuno segnalato)","text",set.pain,value=>{set.pain=value;set.completed=false;persist();}));
            const technique=el("input",{type:"checkbox"});technique.checked=!!set.technique;
            technique.onchange=()=>{set.technique=technique.checked;set.completed=false;persist();};
            row.appendChild(el("label",{class:"m3-check"},[technique," Tecnica e movimento controllati"]));
            const done=el("button",{class:"btn m3-complete-button"+(set.completed?" btn-acc":""),"data-ei":ei,"data-slot":index,onclick:()=>{
                if(date>todayStr()||m3Paused(todayStr())||m3Paused(date)){flash("Registrazione non disponibile per questa data.","#ff4567");return;}
                if(set.kg===""||!Number.isFinite(Number(set.kg))||Number(set.kg)<0||!Number.isInteger(Number(set.reps))||Number(set.reps)<1||set.rir===""||!Number.isFinite(Number(set.rir))||Number(set.rir)<0||Number(set.rir)>10){flash("Inserisci peso ≥0, ripetizioni intere e RIR effettivo 0–10.","#ff4567");return;}
                if(set.completed){set.completed=false;persist();render();return;}
                set.completed=true;draft.completed=false;
                if(!m3SaveDraft(date,draft)){set.completed=false;return;}
                const session={...structuredClone(draft),sets:draft.sets.filter(s=>s.completed).map(s=>({...s})),completed:false,ts:new Date().toISOString()};
                if(!m3SaveEntries({...DB.entries,[date]:session})){set.completed=false;return;}
                startRecoveryTimer(m3State.recoveries[ex.id]||parseRecoverySec(ex.recovery),ex.n);render();
            }},[set.completed?"✓ Completata — annulla":"Completa serie e avvia recupero"]);
            row.appendChild(done);card.appendChild(row);
        }
        card.appendChild(m3Text(m3Progression(ex,draft.sets.filter(s=>s.ei===ei))));
        c.appendChild(card);
    });
    c.appendChild(m3Field("Note della seduta","textarea",draft.notes,value=>{draft.notes=value;persist();}));
    c.appendChild(el("button",{class:"btn btn-acc",onclick:()=>{
        if(date>todayStr()||m3Paused(todayStr())||m3Paused(date))return;
        const sets=draft.sets.filter(s=>s.completed);
        if(!sets.length){flash("Completa almeno una serie prima di concludere.","#ff4567");return;}
        if(sets.length<draft.exercises.reduce((n,e)=>n+e.sets,0)&&!confirm("Concludere una seduta con meno serie del previsto? Saranno conservate solo le serie completate."))return;
        const session={...structuredClone(draft),sets,completed:true,ts:new Date().toISOString()};
        if(!m3SaveEntries({...DB.entries,[date]:session}))return;
        const drafts={...m3State.drafts};delete drafts[date];m3Persist({...m3State,drafts});
        stopRecoveryTimer();flash("Seduta conclusa e salvata");render();
    }},["Concludi e salva seduta"]));
    c.appendChild(el("button",{class:"btn",onclick:()=>{if(DB.entries[date])generateDayReport(date);else flash("Nessuna serie completata da esportare");}},["Esporta giornata"]));
    c.appendChild(el("button",{class:"btn",onclick:()=>m3ChooseWorkout(date)},["Cambia allenamento"]));
};
function m3ChooseWorkout(date){
    if(m3Paused(date)||m3Paused(todayStr()))return;
    openModal("Scegli la seduta",body=>{
        body.appendChild(m3Text("Mantieni un recupero adeguato fra sedute. La scelta cambia soltanto questa data."));
        M3_DAYS.forEach((d,i)=>body.appendChild(el("button",{class:"btn",onclick:()=>{
            if(DB.entries[date]||m3State.drafts[date]?.sets?.some(s=>s.completed)){flash("Seduta già registrata: consulta lo storico.","#ff4567");return;}
            const overrides={...DB.dayOverrides,[date]:7+i};
            if(!LS.set("ft_dayOverrides",overrides))return;
            DB.dayOverrides=overrides;closeModal();initLogDay();render();
        }},[d.name])));
    });
}
const m3LegacyArt=getExerciseArtwork;
getExerciseArtwork=function(ex){
    if(ex.programId===M3.id)return null;
    return m3LegacyArt(ex);
};
const m3LegacyCampaign=campaignCard;
campaignCard=function(ph,progress){
    const card=m3LegacyCampaign(ph,progress);
    if(todayStr()>=M3.start){
        card.querySelectorAll(".campaign-art-core,.system-title").forEach(n=>n.textContent="MESOCICLO 3");
        const subtitle=card.querySelector(".system-subtitle");if(subtitle)subtitle.textContent=M3.title;
    }
    return card;
};
function m3WeeklyVolume(start){
    const result=Object.fromEntries(M3_MUSCLES.map(m=>[m,{direct:0,indirect:0}]));
    const end=addDaysStr(start,7);let sessions=0;
    Object.entries(DB.entries).forEach(([date,e])=>{
        if(date<start||date>=end||date>todayStr()||e.skipped||e.programId!==M3.id)return;
        if(e.completed)sessions++;
        (e.sets||[]).filter(s=>s.completed).forEach(s=>{
            const ex=e.exercises?.[s.ei];if(!ex)return;
            (ex.primary||[]).forEach(m=>{if(result[m])result[m].direct++;});
            (ex.secondary||[]).forEach(m=>{if(result[m])result[m].indirect++;});
        });
    });
    return {muscles:result,sessions};
}
let m3StatsWeek=weekKey(todayStr());
function m3Stats(c){
    const panel=hudPanel([],"selected","padding:14px");
    panel.appendChild(el("h2",{},["Volume muscolare · Mesociclo 3"]));
    panel.appendChild(m3Field("Settimana (scegli una data)","date",m3StatsWeek,value=>{
        if(/^\d{4}-\d{2}-\d{2}$/.test(value)){m3StatsWeek=weekKey(value);render();}
    }));
    const current=m3WeeklyVolume(m3StatsWeek),previous=m3WeeklyVolume(addDaysStr(m3StatsWeek,-7));
    panel.appendChild(m3Text("Sedute concluse: "+current.sessions+" · settimana precedente: "+previous.sessions+". Conteggio di serie completate; i dati storici senza classificazione muscolare non sono ricostruiti."));
    const table=el("table",{class:"m3-table"});
    table.appendChild(el("thead",{},[el("tr",{},["Muscolo","Dirette","Indirette","Δ dirette"].map(t=>el("th",{scope:"col"},[t])))]));
    const tbody=el("tbody");
    M3_MUSCLES.forEach(m=>{const v=current.muscles[m],delta=v.direct-previous.muscles[m].direct;
        tbody.appendChild(el("tr",{},[el("th",{scope:"row"},[m]),el("td",{},[String(v.direct)]),el("td",{},[String(v.indirect)]),el("td",{},[(delta>0?"+":"")+delta])]));
    });
    table.appendChild(tbody);panel.appendChild(el("div",{style:"overflow-x:auto"},[table]));
    panel.appendChild(m3Text("Serie indirette = partecipazione secondaria, senza coefficienti o equivalenza con le dirette. Trapezi superiori, medi e inferiori rimangono distinti dai deltoidi."));
    c.appendChild(panel);
}
const m3LegacyProgress=renderProgress;
renderProgress=function(c){if(todayStr()>=M3.start)m3ProgramPanel(c,todayStr());m3Stats(c);m3LegacyProgress(c);};
const m3LegacyRender=render;
render=function(){
    m3LegacyRender();
    if(todayStr()>=M3.start){
        const badge=$("phase-badge");if(badge)badge.textContent="MESOCICLO 3 · "+(m3Paused()?"SOSPESO":"Settimana "+getPhaseProgress().currentWeek+" / 8");
    }
};
const m3LegacyStartTimer=startRecoveryTimer,m3LegacyStopTimer=stopRecoveryTimer;
startRecoveryTimer=function(seconds,title){
    if(m3Paused())return;
    if(!Number.isFinite(seconds)||seconds<=0)return;
    m3LegacyStartTimer(seconds,title);
    LS.set("ft_recoveryDeadline",{end:recTimerEnd,title});
};
stopRecoveryTimer=function(){
    localStorage.removeItem("ft_recoveryDeadline");
    m3LegacyStopTimer();
};
function m3RestoreTimer(){
    const timer=LS.get("ft_recoveryDeadline");if(!timer)return;
    if(m3Paused()){stopRecoveryTimer();return;}
    const remaining=Math.ceil((timer.end-Date.now())/1000);
    if(remaining>0)startRecoveryTimer(remaining,timer.title);
    else{stopRecoveryTimer();flash("Recupero terminato durante l'assenza.","#43d9ff");}
}
document.addEventListener("visibilitychange",()=>{
    if(document.visibilityState==="visible"){m3RestoreTimer();if(m3Paused()){stopRecoveryTimer();render();}}
});
window.addEventListener("pageshow",m3RestoreTimer);
setTimeout(m3RestoreTimer,0);
m3Initialize();
