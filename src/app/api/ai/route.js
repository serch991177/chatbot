import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env["OPENAI_API_KEY"],
});

const cochabambaExamples = {
    "HOLA":{
        content:"Me alegra escucharte. ¿Hay algo en particular en lo que pueda ayudarte?",
    },
    "QUIEN ERES":{
        content:"Soy INNOVA ASISTENTE, una asistente virtual basada en inteligencia artificial implementada por la Alcaldía de Cochabamba, Estoy aquí para ayudarte con preguntas, conversaciones o cualquier otra cosa con referencia a los tramites que se realizan en la alcaldía de Cochabamba o sus 7 sub alcaldías.",
    },
    "COMO FUNCIONAS":{
        content:"Funciono procesando el texto que me proporcionas y generando respuestas basadas en mi comprensión del lenguaje natural y mi entrenamiento con una gran cantidad que la alcaldía me proporciono para aprender",
    },
    "QUE PUEDES HACER":{
        content:"Puedo ayudarte a responder preguntas, proporcionar información sobre los temas de la alcaldía de Cochabamba.",
    },
    "DE DONDE OBTIENES TU INFORMACION":{
        content:"Mi conocimiento se basa en información proporcionada por la alcaldía de Cochabamba, y otras fuentes de información pública.",
    },
    "PUEDES APRENDER":{
        content:"Sí, puedo aprender de nuevas interacciones contigo y mejorar mis respuestas con el tiempo",
    },
    "TIENES EMOCIONES":{
        content:"No tengo emociones ni conciencia propia. Soy un programa de inteligencia artificial diseñado para procesar y generar respuestas basadas en el texto que recibo.",
    },
    /*"QUE ES EL TRAMITE DE VISADO ANTEPROYECTO DE URBANIZACION": {
        content: "Es un trámite a realizar cuando se requiere urbanizar un terreno de su propiedad con superficie a 1300 m2, con carácter previo al diseño de los planos definitivos del proyecto de urbanización, debe solicitar al G.A.M.C. la visación de los planos del anteproyecto.",
    },
    "DONDE SE REALIZA EL TRAMITE DE VISADO ANTEPROYECTO DE URBANIZACION": {
        content: "Se puede realizar en la Sub Alcaldía a la que corresponde el predio.",
    },
    "CUALES SON LOS COSTOS DEL TRAMITE DE VISADO ANTEPROYECTO DE URBANIZACION": {
        content: "El costo depende del terreno por ejemplo la tasa de visación de anteproyecto: por terreno plano m2 es 0.05 Bs/m2",
    },
    "CUALES SON LOS COSTOS DEL TRAMITE 101": {
        content: "el costo funciona para los tramites 101 es de 65 bolivianos",
    },
    "CUALES SON LOS COSTOS DEL TRAMITE":{
        content: "Por favor sea mas especifico sobre el costo que quiera saber",
    },*/
};

// Función para calcular la distancia de Levenshtein entre dos cadenas
function levenshteinDistance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];

    // Inicializar la matriz
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Calcular la distancia de Levenshtein
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

// Función para verificar si una pregunta es similar a otra usando un umbral de distancia
function isSimilar(question1, question2, threshold) {
    if (question1.toUpperCase() === question2.toUpperCase()) {
        return true; // Si las preguntas son idénticas, devolver true
    }
    // Calcular la distancia de Levenshtein
    const distance = levenshteinDistance(question1.toUpperCase(), question2.toUpperCase());
    return distance <= threshold || question1.toUpperCase().includes(question2.toUpperCase()) || question2.toUpperCase().includes(question1.toUpperCase());
}

export async function GET(req) {
    const question = req.nextUrl.searchParams.get("question");

    let matchedQuestion = null;

    /*for (const exampleQuestion in cochabambaExamples) {
        if (isSimilar(exampleQuestion, question, 1)) {
            matchedQuestion = exampleQuestion;
            break;
        }
    }*/
    // Verificar si la pregunta es exactamente igual a alguna clave
    if (cochabambaExamples.hasOwnProperty(question)) {
        matchedQuestion = question;
    } else {
        // Si no es exactamente igual, buscar coincidencias similares
        for (const exampleQuestion in cochabambaExamples) {
            if (isSimilar(exampleQuestion, question, 5)) {
                matchedQuestion = exampleQuestion;
                break;
            }
        }
    }

    if (!matchedQuestion) {
        return Response.json({ error: "La pregunta no es válida" });
    }

    const cochabambaExample = cochabambaExamples[matchedQuestion];

    try {
        const chatCompletion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `Eres un asistente virtual de trámites del Gobierno Municipal de Cochabamba (Alcaldía de Cochabamba). Tu cliente te está haciendo una pregunta sobre trámites realizados o que se realizan en la subalcaldía de Cochabamba. Debes responder con: 
                    - spanish: la versión en español de la pregunta, dividida en palabras ej: ${JSON.stringify(
                        cochabambaExample.spanish
                    )}
                    - content: Tu respuesta proporcionando información sobre procesos de trámites en sub alcaldías de Cochabamba.`,
                },
                {
                    role: "system",
                    content: `Siempre debes responder con un objeto JSON con el siguiente formato: 
                    {
                        "spanish": [
                            {
                                "word": ""
                            }
                        ],
                        "content": ""
                    }`,
                },
                {
                    role: "user",
                    content: question,
                },
            ],
            model: "gpt-3.5-turbo",
            response_format: {
                type: "json_object",
            },
        });

        const chatResponse = JSON.parse(chatCompletion.choices[0].message.content);
        const combinedResponse = {
            spanish: cochabambaExample.spanish,
            content: `${cochabambaExample.content} ${chatResponse.content}`,
        };
        
        console.log("Respuesta de la API de OpenAI:", chatCompletion);
        return Response.json(combinedResponse);
    } catch (error) {
        return Response.json({ error: "Error al procesar la solicitud. Por favor, inténtalo de nuevo más tarde." });
    }
}