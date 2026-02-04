import { useState, useRef, useEffect } from "react";
import { Send, Maximize2, Minimize2, MessageCircle, X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { ScrollArea } from "@/app/components/ui/scroll-area";

// Declare iframe-resizer type
declare global {
  interface Window {
    parentIFrame?: {
      size: () => void;
    };
  }
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "agent";
  timestamp: Date;
}

export function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const chatWindowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Trigger iframe resize when expand state changes
  useEffect(() => {
    if (window.parentIFrame) {
      // Trigger resize immediately
      window.parentIFrame.size();

      // Trigger again after a short delay to ensure DOM has updated
      const timer = setTimeout(() => {
        if (window.parentIFrame) {
          window.parentIFrame.size();
        }
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [isExpanded]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userText = inputValue;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: userText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsThinking(true);

    const typingId = (Date.now() + 1).toString();

    // ⏳ Show "Thinking..."
    setTimeout(() => {
      const typingMessage: Message = {
        id: typingId,
        text: "Thinking...",
        sender: "agent",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, typingMessage]);
    }, 500);

    try {
      // ✅ WAIT so "Thinking..." exists
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const reply =
        "AI Insight: Based on current msg, revenue is trending upward and user retention has improved.";

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === typingId
            ? { ...msg, text: reply, timestamp: new Date() }
            : msg,
        ),
      );
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === typingId
            ? {
                ...msg,
                text: "Sorry, something went wrong while fetching insights.",
                timestamp: new Date(),
              }
            : msg,
        ),
      );
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClose = () => {
    // Send message to parent window to close the chat
    if (window.parent) {
      window.parent.postMessage({ type: "CLOSE_CHAT" }, "*");
    }
  };

  return (
    <div
      data-iframe-height
      data-iframe-width
      className={`bg-white rounded-xl overflow-hidden shadow-2xl border border-gray-200 flex flex-col transition-all duration-300 ${
        isExpanded ? "w-[520px] h-[920px]" : "w-[420px] h-[600px]"
      }`}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-2 border-b border-gray-200"
        style={{ backgroundColor: "#367fa9" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>

          <div>
            <h3 className="text-sm font-semibold text-white">
              FanViz Analytics Assistant
            </h3>
            <p className="text-[11px] text-blue-100">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white hover:bg-[#2c6485] h-8 w-8 p-0"
          >
            {isExpanded ? (
              <Minimize2 className="h-5 w-5" />
            ) : (
              <Maximize2 className="h-5 w-5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-white hover:bg-[#2c6485] h-8 w-8 p-0"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea
        className="flex-1 p-4 overflow-y-auto"
        style={{ maxHeight: "calc(100% - 120px)" }}
      >
        {messages.length === 0 ? (
          /* Empty State - Welcome Screen */
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-lg"
              style={{ backgroundColor: "#3c8dbc" }}
            >
              <MessageCircle className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Welcome to FanViz Assistant
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              I'm here to help you gain insights from your dashboard data.
            </p>
            <div className="grid grid-cols-1 gap-3 w-full">
              <button
                onClick={() =>
                  setInputValue("Show me today's engagement metrics")
                }
                className="hover:bg-blue-100 text-sm py-3 px-4 rounded-lg transition-colors text-left"
                style={{ backgroundColor: "#d4e8f5", color: "#367fa9" }}
              >
                📊 Show me today's engagement metrics
              </button>
              <button
                onClick={() =>
                  setInputValue("What are the top performing campaigns?")
                }
                className="hover:bg-blue-100 text-sm py-3 px-4 rounded-lg transition-colors text-left"
                style={{ backgroundColor: "#d4e8f5", color: "#367fa9" }}
              >
                🎯 What are the top performing campaigns?
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-2 py-2  break-words ${
                    message.sender === "user"
                      ? "text-white"
                      : "bg-white border border-gray-200 text-gray-800 shadow-sm"
                  }`}
                  style={
                    message.sender === "user"
                      ? { backgroundColor: "#3c8dbc" }
                      : undefined
                  }
                >
                  <p className="text-[12px] leading-snug break-words">
                    {message.text}
                  </p>
                  {!(
                    isThinking &&
                    message.sender === "agent" &&
                    message.text === "Thinking..."
                  ) && (
                    <p
                      className={`text-[10px] mt-1 ${
                        message.sender === "user"
                          ? "text-blue-100"
                          : "text-gray-400"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your dashboard data..."
            className="flex-1 bg-white text-[13px] placeholder:text-[13px]"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="text-white hover:opacity-90"
            style={{ backgroundColor: "#3c8dbc" }}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
