import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { Sidebar } from './Sidebar';

interface Message {
  id: string;
  text: string;
  isAI: boolean;
  timestamp: string;
}

export function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isAI: false,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);

    // Simulate AI response
    setIsTyping(true);
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "This is a simulated AI response. Replace this with your actual AI integration.",
        isAI: true,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <div className="flex h-screen bg-transparent backdrop-blur-sm">
      <Sidebar latestMessage={messages.filter(m => !m.isAI).pop()} />
      <div className="flex-1 flex flex-col border-l border-white/10">
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <AnimatePresence mode="wait">
            {messages.length === 0 ? (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center h-full space-y-6"
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/30 shadow-lg shadow-indigo-500/5"
                >
                  <Bot className="w-10 h-10 text-indigo-400" />
                </motion.div>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-center space-y-4 max-w-md"
                >
                  <h1 className="text-2xl font-semibold text-white/90">Welcome to AI Chat</h1>
                  <p className="text-white/60 text-lg">
                    I'm here to help you with any questions or tasks you might have. Feel free to ask me anything!
                  </p>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message.text}
                    isAI={message.isAI}
                    timestamp={message.timestamp}
                  />
                ))}
              </motion.div>
            )}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <TypingIndicator />
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </div>
        
        <div className="p-4 border-t border-white/5 bg-black/20 backdrop-blur-md">
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}