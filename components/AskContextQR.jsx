'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AskContextQR({ currentContext }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi! I am ContextQR. Ask me a question about your current location, crowd density, or stadium amenities.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMessage = { role: 'user', text: query.trim() };
    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userQuery: userMessage.text,
          currentContext
        })
      });

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', text: data.text || data.error }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, I couldn't reach the network. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        aria-label="Ask ContextQR"
        aria-expanded={isOpen}
        aria-controls="ask-chat-box"
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '28px',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          border: 'none',
          color: 'white',
          boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 40,
        }}
      >
        <MessageCircle size={24} />
      </motion.button>

      {/* Chat Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="ask-chat-box"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              width: 'calc(100% - 48px)',
              maxWidth: '360px',
              height: '480px',
              maxHeight: 'calc(100vh - 100px)',
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 50,
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '16px',
              background: 'rgba(16, 185, 129, 0.1)',
              borderBottom: '1px solid rgba(16, 185, 129, 0.2)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bot size={20} color="#10b981" />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--foreground)' }}>Ask ContextQR</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                style={{ background: 'transparent', border: 'none', color: 'var(--foreground)', cursor: 'pointer', opacity: 0.7 }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div
              role="log"
              aria-live="polite"
              style={{
                flex: 1,
                padding: '16px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              {messages.map((msg, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  gap: '8px',
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%'
                }}>
                  {msg.role === 'assistant' && (
                    <div style={{ width: '28px', height: '28px', borderRadius: '14px', background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Bot size={14} color="#10b981" />
                    </div>
                  )}
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: '16px',
                    borderBottomLeftRadius: msg.role === 'assistant' ? '4px' : '16px',
                    borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
                    background: msg.role === 'user' ? '#10b981' : 'rgba(255,255,255,0.05)',
                    color: msg.role === 'user' ? '#fff' : 'var(--foreground)',
                    border: msg.role === 'user' ? 'none' : '1px solid var(--border)',
                    fontSize: '0.9rem',
                    lineHeight: 1.5
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div style={{ display: 'flex', gap: '8px', alignSelf: 'flex-start' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '14px', background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bot size={14} color="#10b981" />
                  </div>
                  <div style={{ padding: '10px 14px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', fontSize: '0.9rem' }}>
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    >
                      Thinking...
                    </motion.span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} style={{ padding: '12px', borderTop: '1px solid var(--border)', background: 'var(--card)', display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value.slice(0, 150))} // Max 150 chars
                placeholder="Ask a question..."
                maxLength={150}
                aria-label="Ask a question"
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '20px',
                  border: '1px solid var(--border)',
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                  fontSize: '0.9rem'
                }}
              />
              <button
                type="submit"
                disabled={!query.trim() || isLoading}
                aria-label="Send message"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '20px',
                  background: !query.trim() || isLoading ? 'rgba(148,163,184,0.2)' : '#10b981',
                  color: !query.trim() || isLoading ? 'var(--foreground)' : '#fff',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: !query.trim() || isLoading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
