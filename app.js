const express = require('express');
const app = express();
const cors = require('cors');
const { Hercai } = require('hercai');
const herc = new Hercai();



/** ------------------------ GENERAL MIDDLEWARES ------------------------ */
app.use(cors())
app.use(express.json())
const PORT = 3001



/** ------------------------ LAWS DEVELOPMENT ------------------------ */
// LEGEA 1 SI 2
const legea2 = (patan, padruga) => {
    let tabel = [];
    let result="";
    for(let i =1; i<=2; i++){
        for(let j=1; j<=2; j++){
            result = ""
            result = patan["gena"+i]+padruga["gena"+j]
            tabel.push(result)
        }
    }
    for(let i=0; i<tabel.length; i++){
        let modifiedString = tabel[i].split(''); // Convert the string to an array
        if(modifiedString[0] !== modifiedString[0].toUpperCase() && modifiedString[1] === modifiedString[1].toUpperCase()){
            modifiedString[0] = modifiedString[0].toUpperCase();
            modifiedString[1] = modifiedString[1].toLowerCase();
        } else if(modifiedString[0] === "_" && modifiedString[1] === modifiedString[1].toUpperCase()){
            modifiedString[0] = modifiedString[1]
            modifiedString[1] = "_"
        }
        tabel[i] = modifiedString.join(''); // Join the array back to a string
    }
    return tabel;
}
// LEGEA 3
const legea3 = (patan, padruga) => {
    let maleGametes = [patan["caracter1"]["gena1"] + patan["caracter2"]["gena1"], patan["caracter1"]["gena2"] + patan["caracter2"]["gena2"]];
    let femaleGametes = [padruga["caracter1"]["gena1"] + padruga["caracter2"]["gena1"], padruga["caracter1"]["gena2"] + padruga["caracter2"]["gena2"]];
    let tabel = [];
    for (let i = 0; i < maleGametes.length; i++) {
        for (let j = 0; j < femaleGametes.length; j++) {
            tabel.push(maleGametes[i][0] + femaleGametes[j][0] + maleGametes[i][1] + femaleGametes[j][1]);
        }
    }
    for (let i = 0; i < tabel.length; i++) {
        let modifiedString = tabel[i].split(''); // Convert the string to an array
        for (let j = 0; j < modifiedString.length - 1; j += 2) {
            if (modifiedString[j] !== modifiedString[j].toUpperCase() && modifiedString[j + 1] === modifiedString[j + 1].toUpperCase()) {
                modifiedString[j] = modifiedString[j].toUpperCase();
                modifiedString[j + 1] = modifiedString[j + 1].toLowerCase();
            } else if(modifiedString[j] === "_" && modifiedString[j+1] === modifiedString[j+1].toUpperCase()){
                modifiedString[j] = modifiedString[j+1]
                modifiedString[j+1] = "_"
            }
        }
        tabel[i] = modifiedString.join(''); // Join the array back to a string
    }
    return tabel;
};



/** ------------------------ AMINO DECODER OBJECT (DICTIONARY) ------------------------ */
const aminoDecoder = {
    'UUU': 'Fenilalanină',
    'UUC': 'Fenilalanină',
    'UUA': 'Leucină',
    'UUG': 'Leucină',
    'UCU': 'Serină',
    'UCC': 'Serină',
    'UCA': 'Serină',
    'UCG': 'Serină',
    'UAU': 'Tirozină',
    'UAC': 'Tirozină',
    'UAA': 'Oprire',
    'UAG': 'Oprire',
    'UGU': 'Cisteină',
    'UGC': 'Cisteină',
    'UGA': 'Oprire',
    'UGG': 'Triptofan',
    'CUU': 'Leucină',
    'CUC': 'Leucină',
    'CUA': 'Leucină',
    'CUG': 'Leucină',
    'CCU': 'Prolină',
    'CCC': 'Prolină',
    'CCA': 'Prolină',
    'CCG': 'Prolină',
    'CAU': 'Histidină',
    'CAC': 'Histidină',
    'CAA': 'Glutamină',
    'CAG': 'Glutamină',
    'CGU': 'Arginină',
    'CGC': 'Arginină',
    'CGA': 'Arginină',
    'CGG': 'Arginină',
    'AUU': 'Izoleucină',
    'AUC': 'Izoleucină',
    'AUA': 'Izoleucină',
    'AUG': 'Metionină',
    'ACU': 'Treonină',
    'ACC': 'Treonină',
    'ACA': 'Treonină',
    'ACG': 'Treonină',
    'AAU': 'Asparagină',
    'AAC': 'Asparagină',
    'AAA': 'Lizină',
    'AAG': 'Lizină',
    'AGU': 'Serină',
    'AGC': 'Serină',
    'AGA': 'Arginină',
    'AGG': 'Arginină',
    'GUU': 'Valină',
    'GUC': 'Valină',
    'GUA': 'Valină',
    'GUG': 'Valină',
    'GCU': 'Alanină',
    'GCC': 'Alanină',
    'GCA': 'Alanină',
    'GCG': 'Alanină',
    'GAU': 'Acid aspartic',
    'GAC': 'Acid aspartic',
    'GAA': 'Acid glutamic',
    'GAG': 'Acid glutamic',
    'GGU': 'Glicină',
    'GGC': 'Glicină',
    'GGA': 'Glicină',
    'GGG': 'Glicină'
};



/** ------------------------ CONVERSION FUNCTIONS ------------------------ */
const transcriptia = (catena_anticodogena) => {
    let catena_trans = "";
    for (let i = 0; i < catena_anticodogena.length; i++) {
        if (catena_anticodogena[i] === "T") catena_trans += "U";
        else catena_trans += catena_anticodogena[i];
    }
    return catena_trans;
}
const replicarea = (catena_codogena) => {
    let catena_anti_codogena = "";
    for (let i = 0; i < catena_codogena.length; i++) {
        if (catena_codogena[i] === "A") catena_anti_codogena += "T";
        if (catena_codogena[i] === "T") catena_anti_codogena += "A";
        if (catena_codogena[i] === "C") catena_anti_codogena += "G";
        if (catena_codogena[i] === "G") catena_anti_codogena += "C"; 
    }
    return catena_anti_codogena;
}
const decodificarea = (code) => {
    if(code.length > 0 && code.length % 3 == 0 && /^[ACGU]*$/.test(code)) {
        let decodedAminoAcids = '';
        for(let i = 0; i < code.length; i+=3) {
            let codon = code.substring(i, i+3);
            decodedAminoAcids += aminoDecoder[codon] + ' ';
        }
        return decodedAminoAcids.trim()
    } else {
        return "Someting went wrong into your input string.";
    }
}



/** ------------------------ WEB APIS ENDPOINTS AND CONTROLLERS ------------------------ */
app.post('/api/solve/', (req, res) => {
    const catena = req.body.catena;
    return res.status(200).json({
        original: catena,
        replicarea_antiCodogena: replicarea(catena),
        transcriptia_ARNm: transcriptia(replicarea(catena)),
        decodificarea: decodificarea(transcriptia(replicarea(catena)))
    }).end();
})
app.post('/api/solve/repl', (req, res) => {
    const catena = req.body.catena;
    return res.status(200).json({
        original: catena,
        replicarea_antiCodogena: replicarea(catena)
    }).end();
});
app.post('/api/solve/trans', (req, res) => {
    const catena = req.body.catena;
    return res.status(200).json({
        original: catena,
        transcriptia_ARNm: transcriptia(replicarea(catena)),
    }).end();
});
app.post('/api/solve/decode', (req, res) => {
    const catena = req.body.catena;
    return res.status(200).json({
        original: catena,
        decodificarea: decodificarea(transcriptia(replicarea(catena)))
    }).end();
});
app.post('/api/chat', async (req, res) => {
    const { prompt } = req.body;
    const modelAI = 'v3-beta';
    const botRes = await herc.question({ model: modelAI, content: prompt });
    const textBotRes = botRes.reply;
    return res.status(200).json({
        Model: modelAI,
        UserQuestion: prompt,
        ModelAnswer: textBotRes
    }).end()
})
app.post('/legea2', (req, res) => {
    const { male } = req.body;
    const { female } = req.body;
    return res.status(200).json({
        children: legea2(male, female) 
    }).end()
})
app.post('/legea3', (req, res) => {
    const { male } = req.body;
    const { female } = req.body;
    return res.status(200).json({
        children: legea3(male, female) 
    }).end()
})
app.listen(PORT, () => {
    console.log('Serveru so pornit .')
})