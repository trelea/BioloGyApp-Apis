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
// LEGEA BASIC 1 SI 2
const getPercentageOfElements = (arr, symbol) => {
    const countAA = arr.filter(str => str === symbol).length;
    return (countAA / arr.length) * 100;
}
const createTableLegea2 = (str1, str2) => {
    const arr = [];
    arr.push((str1[0].toUpperCase() === str1[0] ? str1[0] : "") + str2[0] + (str1[0].toUpperCase() !== str1[0] ? str1[0] : ""));
    arr.push((str2[0].toUpperCase() === str2[0] ? str2[0] : "") + str1[1] + (str2[0].toUpperCase() !== str2[0] ? str2[0] : ""));
    arr.push((str1[0].toUpperCase() === str1[0] ? str1[0] : "") + str2[1] + (str1[0].toUpperCase() !== str1[0] ? str1[0] : ""));
    arr.push((str1[1].toUpperCase() === str1[1] ? str1[1] + str2[1] : str2[1] + str1[1]));
    return arr;
}
const getGenotype = (arr) => {
    let dictionary = {}
    for (let combination in arr) { dictionary[String(arr[combination])] = getPercentageOfElements(arr, arr[combination]); }
    return dictionary
}
const getDominant = (str1, str2) => {
    let D = null;
    for (let i = 0; i < str1.length; i++) {
        if (str1[i] === str1[i].toUpperCase()) D = str1[i]
    }
    for (let i = 0; i < str2.length; i++) {
        if (str2[i] === str2[i].toUpperCase()) D = str2[i]
    }
    return D
}
const getFenotype = (arr, dominant, d1, d2) => {
    if (d1 === undefined || d1 === "") return null;
    if (d2 === undefined || d2 === "") return null;
    let obj = {}
    const countAA = arr.filter(str => str.includes(dominant) === true).length;
    const Dom = (countAA / arr.length) * 100;
    const Rec = 100 - Dom;
    obj[String(d1)] = Dom;
    obj[String(d2)] = Rec;
    return obj;
}



//LEGEA 3 ADVANCED
const getCombinationsForGenes = (str) => {
    let combinations = [];
    combinations.push(str[0] + str[2]);
    combinations.push(str[0] + str[3]);
    combinations.push(str[1] + str[2]);
    combinations.push(str[1] + str[3]);
    return combinations;
}

const createTableLegea3 = (arr1, arr2) => {
    const arr = []
    for (const g2 of arr2) {
        for (const g1 of arr1) {
            let res = "";
            for (let i = 0; i < g2.length; i++) res += g2[i] + g1[i];
            arr.push(res)
        }
    }
    return arr
}



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
    const { dominant } = req.body;
    const { recesiv } = req.body;
    return res.status(200).json({
        table: createTableLegea2(male, female),
        genotip: getGenotype(createTableLegea2(male, female)),
        fenotip: getFenotype(createTableLegea2(male, female), getDominant(male, female), dominant, recesiv)
    }).end()
})
app.post('/legea3', (req, res) => {
    const { male } = req.body;
    const { female } = req.body;

    const { dominantMale } = req.body;
    const { recesivMale } = req.body;

    const { dominantFemale } = req.body;
    const { recesivFemale } = req.body;

    return res.status(200).json({
        maleRow: getCombinationsForGenes(male),
        femaleRow: getCombinationsForGenes(female),
        table: createTableLegea3(getCombinationsForGenes(male), getCombinationsForGenes(female))
    }).end()
})
app.listen(PORT, () => {
    console.log('Serveru so pornit .')
})