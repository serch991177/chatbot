import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env["OPENAI_API_KEY"],
});

const cochabambaExamples = {
    "Qué es Cochabamba": {
        spanish: [
            { word: "¿Qué" },
            { word: "es" },
            { word: "Cochabamba?" },
        ],
        content: "Cochabamba es una ciudad situada en el centro de Bolivia, conocida por su clima agradable, su cultura vibrante y sus lugares históricos.",
    },
    "Qué se puede hacer en Cochabamba": {
        spanish: [
            { word: "¿Qué" },
            { word: "se" },
            { word: "puede" },
            { word: "hacer" },
            { word: "en" },
            { word: "Cochabamba?" },
        ],
        content: "En Cochabamba, puedes visitar lugares como el Cristo de la Concordia, la laguna Alalay, el Parque Tunari, y disfrutar de la rica gastronomía local.",
    },
    "Dónde está ubicada Cochabamba": {
        spanish: [
            { word: "¿Dónde" },
            { word: "está" },
            { word: "ubicada" },
            { word: "Cochabamba?" },
        ],
        content: "Cochabamba está situada en el centro de Bolivia, en el valle del mismo nombre, rodeada de montañas y con un clima templado.",
    },
};

export async function GET(req) {
    const question = req.nextUrl.searchParams.get("question");
   const cochabambaExample = cochabambaExamples[question];

    /*if (!cochabambaExample) {
        return Response.json({ error: "La pregunta no es válida" });
    }*/
    try {
        const chatCompletion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `Eres un guía turístico local en Cochabamba. Tu cliente te está haciendo una pregunta sobre la ciudad. Debes responder con: 
                    - spanish: la versión en español de la pregunta, dividida en palabras ej: ${JSON.stringify(
                        cochabambaExample.spanish
                    )}
                    - content: Tu respuesta proporcionando información sobre la ciudad.`,
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
                // Agregar un mensaje dummy para cumplir con el requisito de JSON
                /*{
                    role: "system",
                    content: "Este es un mensaje dummy para cumplir con el requisito de JSON.",
                }*/
            ],        
            // model: "gpt-4-turbo-preview", // https://platform.openai.com/docs/models/gpt-4-and-gpt-4-turbo
            model: "gpt-3.5-turbo", // https://help.openai.com/en/articles/7102672-how-can-i-access-gpt-4
            response_format: {
                type: "json_object",
            },
        });
        console.log("Respuesta de la API de OpenAI:", chatCompletion);
        return Response.json(JSON.parse(chatCompletion.choices[0].message.content));
    }catch(error){
        return Response.json({ error: "Error al procesar la solicitud. Por favor, inténtalo de nuevo más tarde." });
    }
}

        
