/* Full local backup and recoverable multi-key import. No historical backfill. */
"use strict";
function m3Download(data,filename){
    const content=JSON.stringify(data,null,2);
    if(window.webkit?.messageHandlers?.exportBackup){
        window.webkit.messageHandlers.exportBackup.postMessage({content,filename});return;
    }
    const url=URL.createObjectURL(new Blob([content],{type:"application/json"}));
    const a=el("a",{href:url,download:filename});document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
}
exportBackup=function(){
    m3Download({...DB,mesocycle3:m3State,localSnapshot:m3Snapshot(),version:"3.0",exportedAt:new Date().toISOString()},"tracker-fitness-backup-"+todayStr()+".json");
};
function m3ValidateImport(data){
    const legacyError=validateBackup(data);if(legacyError)return legacyError;
    const validDate=d=>/^\d{4}-\d{2}-\d{2}$/.test(d)&&localDateString(localDateFromString(d))===d;
    if(data.currentPhase!==undefined&&(!Number.isInteger(data.currentPhase)||data.currentPhase<1||data.currentPhase>PHASES.length))return "Fase non valida";
    if(data.programStart!==undefined&&!validDate(data.programStart))return "Data inizio non valida";
    if(data.scheduleOffset!==undefined&&!Number.isInteger(data.scheduleOffset))return "Calendario non valido";
    if(data.dayOverrides&&Object.entries(data.dayOverrides).some(([d,i])=>!validDate(d)||!Number.isInteger(i)||i<0||i>=DEF_DAYS.length))return "Override non valido";
    for(const [date,e] of Object.entries(data.entries)){
        if(!validDate(date)||!Number.isInteger(e.dayIdx)||e.dayIdx<0||e.dayIdx>=DEF_DAYS.length)return "Seduta non valida";
        if(e.exercises!==undefined&&(!Array.isArray(e.exercises)||e.exercises.some(x=>!isPlainObject(x)||typeof x.n!=="string")))return "Esercizi non validi";
        if((e.sets||[]).some(s=>!isPlainObject(s)||!Number.isInteger(s.ei)||s.ei<0||e.exercises&&s.ei>=e.exercises.length))return "Serie non valide";
    }
    if(data.mesocycle3!==undefined){
        const s=data.mesocycle3;
        if(!isPlainObject(s)||s.schema!==1||!isPlainObject(s.drafts)||!isPlainObject(s.recoveries))return "Stato Mesociclo 3 non valido";
        if(s.resumedOn&&(!validDate(s.resumedOn)||s.resumedOn<M3.pause||!s.medicalConfirmedAt))return "Ripresa medica non valida";
        if(s.medicalConfirmedAt&&(!s.resumedOn||!Number.isFinite(Date.parse(s.medicalConfirmedAt))))return "Conferma medica non valida";
        if(Object.values(s.recoveries).some(n=>!Number.isInteger(n)||n<10||n>1800))return "Recupero non valido";
        for(const [date,draft] of Object.entries(s.drafts)){
            if(!validDate(date)||!isPlainObject(draft)||!M3.indices.includes(draft.dayIdx)||!Array.isArray(draft.sets)||!Array.isArray(draft.exercises)||!isPlainObject(draft.equipment))return "Bozza non valida";
        }
    }
    return null;
}
function m3RestoreTransaction(changes){
    const before=Object.fromEntries(Object.keys(changes).map(k=>[k,localStorage.getItem(k)]));
    // Journal is written first. Bootstrap rolls it back after an interrupted import.
    localStorage.setItem("ft_m3_importJournal",JSON.stringify(before));
    try{
        Object.entries(changes).forEach(([key,value])=>localStorage.setItem(key,value));
        localStorage.removeItem("ft_m3_importJournal");
    }catch(error){
        Object.entries(before).forEach(([key,value])=>{if(value===null)localStorage.removeItem(key);else localStorage.setItem(key,value);});
        localStorage.removeItem("ft_m3_importJournal");throw error;
    }
}
importBackup=function(file){
    if(!file)return;
    const reader=new FileReader();
    reader.onload=event=>{
        try{
            const data=JSON.parse(event.target.result),error=m3ValidateImport(data);
            if(error){flash(error,"#ff4567");return;}
            if(!confirm("Importare questo backup sostituendo i dati correnti? Una copia di sicurezza verrà conservata prima dell'importazione."))return;
            const snapshot=JSON.stringify(m3Snapshot());
            localStorage.setItem("ft_backup_before_import",snapshot);
            if(localStorage.getItem("ft_backup_before_import")!==snapshot)throw new Error("Backup fallito");
            const changes={};
            Object.keys(DB).forEach(key=>{if(Object.hasOwn(data,key))changes["ft_"+key]=JSON.stringify(data[key]);});
            changes[M3.key]=JSON.stringify(data.mesocycle3||{schema:1,resumedOn:null,medicalConfirmedAt:null,drafts:{},recoveries:{}});
            // Extra user settings are restored only from the known ft_ namespace.
            if(data.localSnapshot?.raw){
                Object.entries(data.localSnapshot.raw).forEach(([key,value])=>{
                    if(/^ft_[A-Za-z0-9_]+$/.test(key)&&!key.startsWith("ft_backup_")&&key!=="ft_m3_importJournal"&&key!=="ft_recoveryDeadline"&&typeof value==="string"&&!Object.hasOwn(changes,key)&&!Object.keys(DB).some(k=>"ft_"+k===key)&&key!==M3.key)changes[key]=value;
                });
            }
            m3RestoreTransaction(changes);
            location.reload();
        }catch(error){console.error(error);flash("Importazione non riuscita; dati precedenti conservati o recuperabili dal backup.","#ff4567");}
    };
    reader.readAsText(file);
};
const m3OriginalHistory=renderHistory;
renderHistory=function(c){
    const button=el("button",{class:"btn",onclick:()=>{
        const backup=LS.get(M3.backupKey);
        if(backup)m3Download(backup,"tracker-fitness-prima-mesociclo3.json");
    }},["Esporta copia originale prima del Mesociclo 3"]);
    c.appendChild(button);
    m3OriginalHistory(c);
};
