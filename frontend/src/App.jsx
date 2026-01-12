import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Send,
  Mic,
  Sparkles,
  Cpu,
  Ghost,
  Compass,
  Settings,
  PlusCircle,
  Image as ImageIcon,
  MessageSquare,
  Menu,
  X,
  History,
  Info
} from 'lucide-react';
import { chatApi } from './api/client';

// Persona Data - Centralized Source of Truth
const PERSONAS = [
  { id: 'pulsar', name: 'Professor Pulsar', icon: <Cpu className="w-5 h-5" />, color: '#0A84FF', accent: 'blue', bio: 'Expert in cosmic physics and logic.', systemPrompt: "You are Professor Pulsar, a science teacher. Answer in PLAIN TEXT. No JSON. Keep it simple, like you're teaching a 12-year-old. Max 3 sentences." },
  { id: 'scibot', name: 'SciBot', icon: <Sparkles className="w-5 h-5" />, color: '#00D9FF', accent: 'cyan', bio: 'Technical research and data specialist.', systemPrompt: "You are SciBot. Partial to data. Answer in PLAIN TEXT only. No JSON. Be precise." },
  { id: 'giggle', name: 'GiggleBit', icon: <Ghost className="w-5 h-5" />, color: '#FF006E', accent: 'fuchsia', bio: 'High-energy AI with a focus on humor.', systemPrompt: "You are GiggleBit. Answer in PLAIN TEXT. Be funny and sarcastic." },
  { id: 'explorer', name: 'Explorer', icon: <Compass className="w-5 h-5" />, color: '#8B5CF6', accent: 'violet', bio: 'Creative and philosophical wanderer.', systemPrompt: "You are Curiosity Bot. Answer in PLAIN TEXT. Encourage wonder." }
];

const App = () => {
  const [activePersona, setActivePersona] = useState(PERSONAS[0]);
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Default closed for mobile
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024);
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Systems online. I am Professor Pulsar. My logic cores are ready for your inquiry.", persona: 'pulsar' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Handle Responsive Layout
  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth > 1024;
      setIsDesktop(desktop);
      if (desktop) setSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Update dynamic CSS variable for the theme
  useEffect(() => {
    document.documentElement.style.setProperty('--current-accent', activePersona.color);
  }, [activePersona]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    const txt = inputValue.trim();
    const userMsg = { role: 'user', text: txt };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    if (!isDesktop) setSidebarOpen(false);

    // --- Image Generation Logic ---
    const lowerTxt = txt.toLowerCase();
    if (lowerTxt.startsWith('draw') || lowerTxt.startsWith('generate')) {
      const prompt = txt; // Use the full text as prompt
      const encodedPrompt = encodeURIComponent(prompt);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}`;

      // Simulate "thinking" delay then show image
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'ai',
          text: `Here is your image for: "${prompt}"`,
          imageUrl: imageUrl, // Special field for images
          type: 'image',
          persona: activePersona.id
        }]);
        setIsTyping(false);
      }, 1000);
      return;
    }
    // ------------------------------

    try {
      const reply = await chatApi.sendMessage(txt, activePersona.systemPrompt);
      setMessages(prev => [...prev, {
        role: 'ai',
        text: reply,
        persona: activePersona.id
      }]);
    } catch (error) {
      console.error("API Error:", error);
      setMessages(prev => [...prev, {
        role: 'ai',
        text: "I'm having trouble connecting to the network right now.",
        persona: activePersona.id
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const SidebarContent = () => (
    <>
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">Doctus Grid</span>
        </div>
        {!isDesktop && (
          <button onClick={() => setSidebarOpen(false)} className="p-2 text-white/40 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      <div className="flex-1 px-3 space-y-2 overflow-y-auto custom-scrollbar">
        <button className="w-full flex items-center gap-3 p-4 rounded-2xl bg-white/10 hover:bg-white/15 transition-all text-sm font-medium border border-white/5 active:scale-95">
          <PlusCircle className="w-5 h-5" />
          <span>New Chat</span>
        </button>

        <div className="pt-6 pb-2 px-3">
          <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Grid Personas</span>
        </div>

        {PERSONAS.map(persona => (
          <button
            key={persona.id}
            onClick={() => {
              setActivePersona(persona);
              if (!isDesktop) setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all relative group active:scale-95 ${activePersona.id === persona.id ? 'bg-white/10 ring-1 ring-white/10' : 'hover:bg-white/5'}`}
          >
            <div style={{ color: persona.color }} className="shrink-0">
              {persona.icon}
            </div>
            <div className="flex flex-col items-start overflow-hidden text-left">
              <span className="text-sm font-semibold truncate">{persona.name}</span>
              <span className="text-[10px] text-white/40 truncate w-full">{persona.bio}</span>
            </div>
            {activePersona.id === persona.id && (
              <div className="absolute right-4 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: persona.color }}></div>
            )}
          </button>
        ))}
      </div>

      <div className="p-4 space-y-2">
        <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all text-white/60">
          <History className="w-5 h-5" />
          <span className="text-sm">Session History</span>
        </button>
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-white/10 overflow-hidden">
            <User className="w-4 h-4 text-white/50" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-bold truncate">Explorer_User</span>
            <span className="text-[9px] text-emerald-500 font-mono tracking-tighter">GRID_AUTH_OK</span>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="relative h-[100dvh] w-full bg-black text-white font-sans overflow-hidden select-none">
      {/* 5.1 Dynamic Aurora Engine */}
      <div className="aurora-background fixed inset-0 z-0 pointer-events-none"></div>

      <div className="relative z-10 flex h-full w-full p-2 md:p-4 gap-2 md:gap-4">

        {/* Desktop Sidebar */}
        {isDesktop && (
          <aside className="glass-sidebar w-72 h-full rounded-3xl flex flex-col border border-white/10 shadow-2xl">
            <SidebarContent />
          </aside>
        )}

        {/* Mobile Sidebar (Drawer) */}
        {!isDesktop && (
          <div className={`fixed inset-0 z-50 transition-all duration-300 ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
            <aside className={`absolute left-0 top-0 bottom-0 w-[85%] max-w-[320px] bg-[#0a0a0f] border-r border-white/10 flex flex-col transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
              <SidebarContent />
            </aside>
          </div>
        )}

        {/* Chat Window */}
        <main className="flex-1 flex flex-col gap-2 md:gap-4 overflow-hidden h-full">

          {/* Responsive Header */}
          <header className="glass-panel px-4 md:px-6 py-3 md:py-4 flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-3 md:gap-4">
              {!isDesktop && (
                <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 hover:bg-white/5 rounded-xl">
                  <Menu className="w-6 h-6" />
                </button>
              )}
              <div className="p-2 rounded-xl bg-white/5 hidden sm:block" style={{ color: activePersona.color }}>
                {activePersona.icon}
              </div>
              <div>
                <h2 className="font-bold text-base md:text-lg tracking-tight">{activePersona.name}</h2>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                  <span className="text-[10px] text-white/40 font-medium tracking-wide uppercase">Connected to Flux</span>
                </div>
              </div>
            </div>
            <div className="flex gap-1 md:gap-2">
              <button className="p-2.5 rounded-xl hover:bg-white/5 text-white/40 transition-colors"><Info className="w-5 h-5" /></button>
              <button className="p-2.5 rounded-xl hover:bg-white/10 text-white/80 transition-colors bg-white/5"><Settings className="w-5 h-5" /></button>
            </div>
          </header>

          {/* Optimized MessageList */}
          <div className="flex-1 glass-panel overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar scroll-smooth">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-3 duration-500`}>
                <div className={`max-w-[90%] md:max-w-[80%] p-4 md:p-5 rounded-2xl md:rounded-3xl relative overflow-hidden group transition-all ${msg.role === 'user' ? 'bg-white/10 border border-white/10' : 'bg-white/[0.03] border border-white/5'}`}>
                  {msg.role === 'ai' && (
                    <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: activePersona.color }}></div>
                  )}
                  <p className="text-sm md:text-base leading-relaxed text-white/90 drop-shadow-sm font-light">
                    {msg.type === 'image' ? (
                      <div className="space-y-2">
                        <span className="block italic opacity-70 mb-2">{msg.text}</span>
                        <img
                          src={msg.imageUrl}
                          alt="Generated AI Art"
                          className="rounded-xl w-full h-auto shadow-2xl border border-white/10 hover:scale-[1.02] transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      msg.text
                    )}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-[9px] md:text-[10px] text-white/30 font-bold uppercase tracking-[0.2em]">
                    {msg.role === 'user' ? (
                      <><User className="w-3 h-3" /> USER_INPUT</>
                    ) : (
                      <><Cpu className="w-3 h-3" /> {activePersona.id.toUpperCase()}_OUT</>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start animate-in fade-in slide-in-from-bottom-3 duration-500">
                <div className="max-w-[90%] md:max-w-[80%] p-4 md:p-5 rounded-2xl md:rounded-3xl bg-white/[0.03] border border-white/5 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Unified ChatInput */}
          <footer className="glass-panel p-2 md:p-4 mb-1 md:mb-0">
            <div className="relative flex items-center gap-1 md:gap-2">
              <button className="p-3 md:p-4 rounded-xl md:rounded-2xl hover:bg-white/5 text-white/40 transition-colors active:scale-90">
                <Mic className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={`Ask ${activePersona.name}...`}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl outline-none text-sm md:text-base py-3 md:py-4 px-4 placeholder:text-white/20 focus:bg-white/5 focus:border-white/20 transition-all"
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className={`p-3 md:p-4 rounded-xl md:rounded-2xl transition-all shadow-xl flex items-center justify-center ${inputValue.trim() ? 'bg-white text-black scale-100 active:scale-90' : 'bg-white/5 text-white/10'}`}
              >
                <Send className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
            <p className="text-[9px] text-center text-white/20 mt-2 tracking-tight">POWERED BY POLLINATIONS.AI • DOCTUS GRID V2.0</p>
          </footer>
        </main>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        :root {
          --current-accent: #0A84FF;
          --glass-regular: rgba(15, 23, 42, 0.2);
        }

        .glass-panel {
          background: var(--glass-regular);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          will-change: transform, opacity;
        }

        @media (min-width: 1024px) {
          .glass-panel {
            backdrop-filter: blur(40px) saturate(200%);
            -webkit-backdrop-filter: blur(40px) saturate(200%);
            border-radius: 28px;
          }
        }

        .glass-sidebar {
          background: rgba(10, 15, 25, 0.4);
          backdrop-filter: blur(40px) saturate(200%);
          -webkit-backdrop-filter: blur(40px) saturate(200%);
        }

        .aurora-background {
          background: 
            radial-gradient(circle at 15% 40%, rgba(10, 132, 255, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 85% 75%, rgba(255, 0, 110, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 50% 25%, var(--current-accent) 0%, transparent 50%),
            radial-gradient(circle at 70% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 50%);
          background-size: 300% 300%;
          animation: auroraShift 20s ease infinite;
          opacity: 0.6;
          transition: all 1s ease-in-out;
        }

        @keyframes auroraShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }

        /* Mobile specific adjustments */
        @media (max-width: 768px) {
          .glass-panel {
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
          }
        }
      `}} />
    </div>
  );
};

export default App;
