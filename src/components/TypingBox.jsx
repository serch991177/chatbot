import { useState, useEffect } from "react";
import { useAITeacher } from "@/hooks/useAITeacher";


export const TypingBox = ({hideTypingBox }) => {
  const askAI = useAITeacher((state) => state.askAI);
  const loading = useAITeacher((state) => state.loading);
  const [question, setQuestion] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Definir isLoading aquí


  const handleSpeechRecognition = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "es";
    setIsSpeaking(true);

    recognition.onstart = () => {
      setIsSpeaking(true);
    };

    recognition.onend = () => {
      setIsSpeaking(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toUpperCase();
      const normalizedTranscript = normalizeText(transcript);
      setQuestion(normalizedTranscript);
    };

    recognition.start();
  };

  const ask = () => {
    setIsLoading(true);
    askAI(question);
    setQuestion("");
    //hideTypingBox(); // Llamar a la función para ocultar el TypingBox
  };

  /*useEffect(() => {
    return () => {
      setIsSpeaking(false);
    };
  }, []);*/
  useEffect(() => {
    // Cuando loading cambia a false (cuando finaliza el efecto de carga),
    // oculta el TypingBox
    if (!loading && isLoading) {
        setIsLoading(false);
        hideTypingBox(); // Oculta el TypingBox
    }
}, [loading]);

  const normalizeText = (text) => {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  return (
    <div
      className="z-10 max-w-[600px] flex space-y-6 flex-col bg-gradient-to-tr from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4 backdrop-blur-md rounded-xl border-slate-100/30 border"
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(to top right, rgba(79, 70, 229, 0.3), rgba(74, 85, 104, 0.3))",
        padding: "1rem",
        borderRadius: "1rem",
        border: "1px solid rgba(163, 175, 193, 0.3)"
      }}
    >
      <style>
        {`
          @keyframes pulse-ring {
            0% {
              transform: scale(0.33);
            }
            80%, 100% {
              opacity: 0;
            }
          }

          .microphone-speaking {
            animation: pulse-ring 1.25s cubic-bezier(0.2, 0.64, 0.82, 0.71) infinite;
          }
        `}
      </style>

      <div>
        <h2
          className="text-white font-bold text-xl"
          style={{ color: "#fff", fontSize: "1.25rem", fontWeight: "bold" }}
        >
          Algo nuevo que decir?
        </h2>
        <p
          className="text-white/65"
          style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "0.875rem" }}
        >
          Escribe algo que quieras saber sobre Cochabamba
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <span className="relative flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
          </span>
        </div>
      ) : (
        <div className="gap-3 flex">
          <input
            type="text"
            className="focus:outline focus:outline-white/80 flex-grow bg-slate-800/60 p-2 px-4 rounded-full text-white placeholder:text-white/50 shadow-inner shadow-slate-900/60"
            placeholder="Escribe algo que quieras saber sobre Cochabamba?"
            value={question}
            onChange={(e) => {
              const inputValue = e.target.value.toUpperCase();
              //const onlyLetters = inputValue.replace(/[^A-ZÁÉÍÓÚÜ\s]/g, '');
              const onlyLetters = inputValue.replace(/[^A-ZÁÉÍÓÚÜ0-9\s]/gi, '');
              setQuestion(onlyLetters);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                ask();
              }
            }}
            style={{
              flexGrow: 1,
              backgroundColor: "rgba(28, 36, 43, 0.6)",
              padding: "0.5rem 1rem",
              borderRadius: "9999px",
              border: "none",
              color: "#fff",
              boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
              fontSize: "0.875rem",
            }}
          />
          <button
            className={`bg-slate-100/20 p-2 px-6 rounded-full text-white ${isSpeaking ? 'microphone-speaking' : ''}`}
            onClick={handleSpeechRecognition}
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              padding: "0.5rem",
              borderRadius: "9999px",
              border: "none",
              fontSize: "1.5rem",
              animation: isSpeaking ? 'pulse-ring 1.25s cubic-bezier(0.2, 0.64, 0.82, 0.71) infinite' : 'none',
            }}
          >
            🎤
          </button>
          <button
            className="bg-slate-100/20 p-2 px-6 rounded-full text-white"
            onClick={ask}
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              padding: "0.5rem 1rem",
              borderRadius: "9999px",
              border: "none",
              fontSize: "0.875rem",
            }}
          >
            Preguntar
          </button>
        </div>
      )}
    </div>
  );
};