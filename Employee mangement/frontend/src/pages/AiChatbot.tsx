import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../store/AuthContext';
import { Bot, Send, User as UserIcon, HelpCircle, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

const AiChatbot: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: `Hello ${user?.firstName || 'User'}! I am Aura, your cognitive HR Specialist. I am fully integrated with your company policy book V1.0.\n\nAsk me about:\n• Sick leave and PTO validation thresholds\n• Performance evaluation ratings\n• Attendance concerns and concern-letter generation\n\nHow can I support you today?`,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Auto scroll to bottom
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: inputText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await api.post('/ai/chat', { message: userMessage.text });
      const botMessage: Message = {
        id: Math.random().toString(),
        sender: 'bot',
        text: res.data.response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage: Message = {
        id: Math.random().toString(),
        sender: 'bot',
        text: '⚠️ **System Error**: Could not connect to AI advisor. Please verify the Groq API key is set in docker environments.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQueries = [
    'What is the late attendance policy?',
    'Write a Concern Email for Bob who is late 4 times',
    'Summarize Charlie Black performance score data',
    'How many sick leaves requires medical certificate?'
  ];

  return (
    <div className="flex flex-col h-[calc(105vh-160px)] max-w-5xl mx-auto border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm">
      
      {/* Bot Header Info */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-650 flex items-center justify-center text-white shadow-sm">
            <Bot size={22} className="animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm font-heading flex items-center gap-2">
              <span>Aura - HR Specialist Bot</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 font-bold tracking-wider uppercase animate-pulse border border-emerald-200/30">Online</span>
            </h3>
            <p className="text-xs text-slate-450 dark:text-zinc-550">Cognitive Policy Advisor</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-450 dark:text-zinc-550 font-semibold">
          <Sparkles size={14} className="text-violet-500" />
          <span>Groq Powered</span>
        </div>
      </div>

      {/* Messages Timeline Container */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/40 dark:bg-zinc-950/20">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              {/* Avatar */}
              <div className={`h-8 w-8 rounded-full shrink-0 flex items-center justify-center border text-xs font-semibold ${
                isUser
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300'
                  : 'bg-violet-100 border-violet-200 text-violet-750 dark:bg-violet-950/40 dark:border-violet-900/30 dark:text-violet-400'
              }`}>
                {isUser ? <UserIcon size={14} /> : <Bot size={14} />}
              </div>

              {/* Bubble Body */}
              <div className={`p-4 rounded-2xl text-sm leading-relaxed border ${
                isUser
                  ? 'bg-violet-600 text-white border-violet-600/20 rounded-tr-none'
                  : 'bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800 text-slate-800 dark:text-zinc-150 rounded-tl-none shadow-sm whitespace-pre-line prose dark:prose-invert font-sans'
              }`}>
                {msg.text}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 max-w-[80%] mr-auto">
            <div className="h-8 w-8 rounded-full shrink-0 bg-violet-100 text-violet-750 flex items-center justify-center dark:bg-violet-950/40 dark:text-violet-400">
              <Bot size={14} />
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-tl-none shadow-sm flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="h-2 w-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="h-2 w-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Recommended Queries drawer (only if chat is fresh) */}
      {messages.length === 1 && (
        <div className="px-6 py-3 border-t border-slate-200 dark:border-zinc-800 bg-slate-50/20 flex flex-wrap gap-2 shrink-0">
          {sampleQueries.map((query) => (
            <button
              key={query}
              onClick={() => setInputText(query)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-850 hover:bg-slate-100/60 dark:hover:bg-zinc-800 text-xs text-slate-500 dark:text-zinc-400 font-semibold transition-all duration-200"
            >
              <HelpCircle size={12} />
              <span>{query}</span>
            </button>
          ))}
        </div>
      )}

      {/* Input Form Bar */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex gap-3 shrink-0"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask Aura about policies, employees, evaluations..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-sm bg-slate-50 dark:bg-zinc-950 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="px-5 py-2.5 rounded-xl bg-violet-600 dark:bg-violet-500 hover:bg-violet-750 text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:bg-slate-100 disabled:text-slate-400 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-600 shadow-sm"
        >
          <Send size={16} />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
};

export default AiChatbot;
