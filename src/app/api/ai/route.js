import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env["OPENAI_API_KEY"],
});

const cochabambaExamples = {
    /*"QUE ES COCHABAMBA": {
        content: "Cochabamba es una ciudad situada en el centro de Bolivia, conocida por su clima agradable, su cultura vibrante y sus lugares históricos.",
    },
    "QUE SE PUEDE HACER EN COCHABAMBA": {
        content: "En Cochabamba, puedes visitar lugares como el Cristo de la Concordia, la laguna Alalay, el Parque Tunari, y disfrutar de la rica gastronomía local.",
    },   
    "DONDE ESTA UBICADA COCHABAMBA": {
        content: "Cochabamba está situada en el centro de Bolivia, en el valle del mismo nombre, rodeada de montañas y con un clima templado.",
    },*/
    "QUE ES EL TRAMITE DE VISADO ANTEPROYECTO DE URBANIZACION":{
        content:"Es un tramite a realizar cuando se requiere urbanizar un terreno de u propiedad con superficie a 1300 m2, con caracter previo al diseño de los planos definitivos del proyecto de urbanizacion, debe solicitar al G.A.M.C. la visacion de los planos del anteproyecto.",
    },
    "DONDE SE REALIZA EL TRAMITE DE VISADO ANTEPROYECTO DE URBANIZACION":{
        content:"Se puede realizar en la Sub Alcaldia a la que corresponde el predio.",
    },
    "CUALES SON LOS COSTOS DEL TRAMITE DE VISADO ANTEPROYECTO DE URBANIZACION":{
        content:"El costo depende del terreno por ejemplo la tasa de visacion de anteproyecto: por terreno plano m2 es 0.05 Bs/m2",
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
                    content: `Eres un asistente virtual de tramites del Gobierno Municipal de Cochabamba (Alcaldia de Cochabamba). Tu cliente te está haciendo una pregunta sobre tramites realizados o que se realizan en la subalcaldia de Cochabamba. Debes responder con: 
                    - spanish: la versión en español de la pregunta, dividida en palabras ej: ${JSON.stringify(
                        cochabambaExample.spanish
                    )}
                    - content: Tu respuesta proporcionando información sobre procesos de tramites en sub alcaldias de Cochabamba.`,
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

        // Parsea la respuesta del modelo de ChatGPT
        const chatResponse = JSON.parse(chatCompletion.choices[0].message.content);
        // Combinar la respuesta de ChatGPT con el contenido predefinido
        const combinedResponse = {
            spanish: cochabambaExample.spanish,
            content: `${cochabambaExample.content} ${chatResponse.content}`,
        };
        console.log("Respuesta de la API de OpenAI:", chatCompletion);
        //return Response.json(JSON.parse(chatCompletion.choices[0].message.content));
        return Response.json(combinedResponse);
    }catch(error){
        return Response.json({ error: "Error al procesar la solicitud. Por favor, inténtalo de nuevo más tarde." });
    }
}

        
