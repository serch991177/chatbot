import { useAITeacher } from "@/hooks/useAITeacher";
import { useEffect, useRef, useState } from "react";

export const MessagesList = ({visibleTypingBox,changeAnimation}) => {
  const messages = useAITeacher((state) => state.messages);
  const playMessage = useAITeacher((state) => state.playMessage);
  const { currentMessage } = useAITeacher();
  const english = useAITeacher((state) => state.english);
  const classroom = useAITeacher((state) => state.classroom);

  const container = useRef();
  const [showQuestionButtons, setShowQuestionButtons] = useState(false);

  useEffect(() => {
    container.current.scrollTo({
      top: container.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length]);

  const renderEnglish = (englishText) => (
    <>
      {english && (
        <p className="text-4xl inline-block px-2 rounded-sm font-bold bg-clip-text text-transparent bg-gradient-to-br from-blue-300/90 to-white/90">
          {englishText}
        </p>
      )}
    </>
  );

  const handleYesClick = () => {
    // Lógica para el botón "Sí"
    setShowQuestionButtons(false);
    visibleTypingBox();
  };

  const handleNoClick = () => {
    // Lógica para el botón "No"
    setShowQuestionButtons(false);
    // Limpiar el contenido y establecer messages.length en 0
    useAITeacher.setState({ messages: [] });
    visibleTypingBox();
    changeAnimation(2);
  };

  return (
    <div
      className={`${
        classroom === "default"
          ? "w-[1288px] h-[676px]"
          : "w-[2528px] h-[856px]"
      } p-8 overflow-y-auto flex flex-col space-y-8 bg-transparent opacity-80`}
      ref={container}
    >
      {messages.length === 0 && (
        <div className="h-full w-full grid place-content-center text-center">
          <h2 className="text-8xl font-bold text-white/90 italic">
            Chat Bot
            <br/>
            Bienvenidos Al Staff de la Alcaldia
          </h2>
        </div>
      )}
      {messages.map((message, i) => (
        <div key={i}>
          <div className="flex">
            <div className="flex-grow">
              <div className="flex items-center gap-3">
                {renderEnglish(message.answer.english)}
              </div>
            </div>
            {currentMessage === message ? (
              <button
                className="text-white/65"
                onClick={() => stopMessage(message)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-16 h-16"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 0 1 9 14.437V9.564Z"
                  />
                </svg>
              </button>
            ) : (
              <button
                className="text-white/65"
                onClick={() => playMessage(message)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-16 h-16"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
                  />
                </svg>
              </button>
            )}
          </div>
          <div className="p-5 mt-5  bg-gradient-to-br from-pink-200/20 to-pink-500/20 rounded-xl">
            <span className="pr-4 italic bg-clip-text text-transparent bg-gradient-to-b from-white/90 to-white/70 text-3xl font-bold uppercase inline-block">
              Quieres Hacer Otra Pregunta?
            </span>
            
            
            <div className="flex justify-center mt-4">
            <button
                className="bg-green-500 px-10 py-10 text-white rounded-lg mr-4"
                onClick={handleYesClick}
            >
                Sí
            </button>
            <button
                className="bg-red-500 px-10 py-10 text-white rounded-lg"
                onClick={handleNoClick}
            >
                No
            </button>
            </div>
            
          </div>
        </div>
      ))}
    </div>
  );
};
