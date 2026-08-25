import "./AIBuddy.css";
import { useEffect, useRef, useState } from "react";
import socket from "../../services/ai.service";

function AIBuddy() {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "👋 Hi! I'm your AI Shopping Buddy. How can I help you today?",
      time: new Date(),
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const messagesEndRef = useRef(null);

  const suggestions = [
    "Search iPhone",
    "Show Nike shoes",
    "Show my cart",
    "Track my orders",
  ];

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
      setIsConnected(false);
    });

    socket.on("message", (message) => {
      setIsTyping(false);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: message.content,
          time: new Date(),
        },
      ]);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("message");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  function handleSendMessage(message = input) {
    if (!message.trim() || isTyping) return;

    const userMessage = message.trim();

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: userMessage,
        time: new Date(),
      },
    ]);

    setInput("");
    setIsTyping(true);

    socket.emit("message", userMessage);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }

  return (
    <section className="ai-page">
      <div className="chat-container">

        {/* Header */}
        <header className="chat-header">
          <div className="chat-title">
            <div className="chat-bot-icon">
              🤖
            </div>

            <div>
              <h1>AI Shopping Buddy</h1>
              <p>Your personal shopping assistant</p>
            </div>
          </div>

          <div
            className={`connection-status ${
              isConnected ? "online" : "offline"
            }`}
          >
            <span className="connection-dot"></span>
            {isConnected ? "Online" : "Offline"}
          </div>
        </header>

        {/* Messages */}
        <div className="chat-body">

          <div className="welcome-message">
            <span>✨</span>
            <p>Ask me anything about your shopping.</p>
          </div>

          {messages.map((message, index) => (
            <div
              key={index}
              className={`message-row ${message.sender}`}
            >

              {message.sender === "ai" && (
                <div className="avatar ai-avatar">
                  🤖
                </div>
              )}

              <div className={`message ${message.sender}`}>

                <p>{message.text}</p>

                <span className="message-time">
                  {new Date(message.time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>

              </div>

              {message.sender === "user" && (
                <div className="avatar user-avatar">
                  👤
                </div>
              )}

            </div>
          ))}

          {isTyping && (
            <div className="message-row ai">

              <div className="avatar ai-avatar">
                🤖
              </div>

              <div className="message ai typing">
                <span></span>
                <span></span>
                <span></span>
              </div>

            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        <div className="suggestions">
          <span className="suggestions-label">
            Quick questions
          </span>

          <div className="suggestion-list">
            {suggestions.map((item) => (
              <button
                key={item}
                type="button"
                className="suggestion-btn"
                onClick={() => handleSendMessage(item)}
                disabled={isTyping}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="chat-footer">

          <div className="input-wrapper">

            <input
              type="text"
              placeholder="Ask about products, cart, orders..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            <button
              type="button"
              className="send-btn"
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isTyping}
            >
              {isTyping ? "..." : "Send"}
            </button>

          </div>

          <p className="input-hint">
            Press Enter to send
          </p>

        </div>

      </div>
    </section>
  );
}

export default AIBuddy;