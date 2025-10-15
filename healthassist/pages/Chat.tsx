import React, { useState, useRef, useEffect } from "react";
import { useData } from "../context/DataContext";
import { getAiChatResponse } from "../services/geminiService";
import { getCustomChatbotResponse } from "../services/customChatbotService";
import Spinner from "../components/Spinner";
import { Send, User, Bot, Settings } from "lucide-react";

type ChatbotMode = "gemini" | "custom";

const Chat: React.FC = () => {
  const { chatHistory, addChatMessage } = useData();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatbotMode, setChatbotMode] = useState<ChatbotMode>("custom");
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSend = async () => {
    if (input.trim() === "" || isLoading) return;

    const userMessage = {
      id: `chat-${Date.now()}`,
      role: "user" as const,
      text: input,
      timestamp: new Date(),
    };
    addChatMessage(userMessage);
    setInput("");
    setIsLoading(true);

    try {
      let modelResponseText: string;

      if (chatbotMode === "custom") {
        modelResponseText = await getCustomChatbotResponse(chatHistory, input);
      } else {
        // Gemini mode (preserved for fallback)
        modelResponseText = await getAiChatResponse(chatHistory, input);
      }

      const modelMessage = {
        id: `chat-${Date.now() + 1}`,
        role: "model" as const,
        text: modelResponseText,
        timestamp: new Date(),
      };
      addChatMessage(modelMessage);
    } catch (error) {
      console.error("Failed to get AI response", error);
      const errorMessage = {
        id: `chat-${Date.now() + 1}`,
        role: "model" as const,
        text: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      addChatMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] card overflow-hidden wide-card mx-auto">
      <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-primary-50 to-emerald-50">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            AI Health Assistant
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Get personalized health insights and symptom analysis
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-white rounded-full border border-gray-200 shadow-sm">
            <span className="text-xs font-medium text-gray-600">
              {chatbotMode === "custom" ? "Custom NLP" : "Gemini AI"}
            </span>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-white/50 rounded-xl transition-all duration-200"
            title="Chat Settings"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="p-6 bg-gradient-to-r from-gray-50 to-primary-50/30 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">
            AI Assistant Mode
          </h3>
          <div className="flex gap-3">
            <button
              onClick={() => setChatbotMode("custom")}
              className={`px-4 py-3 text-sm rounded-xl font-medium transition-all duration-200 ${
                chatbotMode === "custom"
                  ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              Custom NLP (Recommended)
            </button>
            <button
              onClick={() => setChatbotMode("gemini")}
              className={`px-4 py-3 text-sm rounded-xl font-medium transition-all duration-200 ${
                chatbotMode === "gemini"
                  ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              Gemini AI (Fallback)
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-3 bg-white/50 p-3 rounded-lg">
            {chatbotMode === "custom"
              ? "🎯 Using your custom trained NLP model for accurate symptom analysis and disease prediction"
              : "🤖 Using Google Gemini AI for general health assistance and medical information"}
          </p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 bg-gradient-to-b from-gray-50/30 to-white">
        {chatHistory.length === 0 && (
          <div className="text-center py-12">
            <div className="p-6 bg-gradient-to-br from-primary-100 to-emerald-100 rounded-3xl inline-block mb-6 animate-float">
              <Bot className="h-12 w-12 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Welcome to your AI Health Assistant
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Describe your symptoms or ask health-related questions. I'm here
              to help with personalized insights.
            </p>
          </div>
        )}

        {chatHistory.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-4 animate-slide-up ${
              message.role === "user" ? "justify-end" : ""
            }`}
          >
            {message.role === "model" && (
              <div className="flex-shrink-0 h-10 w-10 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center shadow-lg">
                <Bot size={20} />
              </div>
            )}
            <div
              className={`max-w-2xl p-4 rounded-2xl shadow-sm ${
                message.role === "user"
                  ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-br-lg"
                  : "bg-white text-gray-800 rounded-bl-lg border border-gray-100"
              }`}
            >
              <p
                className="text-sm leading-relaxed"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {message.text}
              </p>
            </div>
            {message.role === "user" && (
              <div className="flex-shrink-0 h-10 w-10 rounded-2xl bg-gradient-to-br from-gray-400 to-gray-500 text-white flex items-center justify-center shadow-lg">
                <User size={20} />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-4 animate-slide-up">
            <div className="flex-shrink-0 h-10 w-10 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center shadow-lg">
              <Bot size={20} />
            </div>
            <div className="max-w-2xl p-4 rounded-2xl bg-white text-gray-800 rounded-bl-lg border border-gray-100 shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="animate-bounce w-2 h-2 bg-primary-500 rounded-full"></div>
                <div
                  className="animate-bounce w-2 h-2 bg-primary-500 rounded-full"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="animate-bounce w-2 h-2 bg-primary-500 rounded-full"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <span className="text-sm text-gray-500 ml-2">
                  AI is thinking...
                </span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 border-t border-gray-100 bg-white">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={
              chatbotMode === "custom"
                ? "Describe your symptoms in detail (e.g., 'I have a headache and fever')..."
                : "Ask me about your health concerns..."
            }
            className="input-field pl-6 pr-16 py-4 text-sm rounded-2xl shadow-sm"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute inset-y-0 right-2 flex items-center justify-center w-12 h-full text-primary-600 hover:text-primary-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <div className="p-2 rounded-xl hover:bg-primary-50 transition-colors duration-200">
              <Send className="h-5 w-5" />
            </div>
          </button>
        </div>
        <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
          <p className="text-xs text-amber-800 text-center font-medium">
            ⚠️ Medical Disclaimer: This AI assistant{" "}
            {chatbotMode === "custom"
              ? "uses custom NLP for symptom analysis"
              : "is powered by Gemini AI"}{" "}
            and provides general health information only. Always consult
            qualified healthcare professionals for medical advice, diagnosis, or
            treatment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
