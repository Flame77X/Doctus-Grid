import React, { useRef, useEffect } from 'react';
import MarkdownRenderer from '../MarkdownRenderer';
import { SkeletonLoader } from './SkeletonLoader';

export const MessageList = ({ messages, bot, isTyping, loading }) => {
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages, isTyping, loading]);

    if (loading) {
        return (
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-transparent">
                {[1, 2, 3].map((i) => (
                    <div key={i} className={`flex w-full ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                        {i % 2 !== 0 && (
                            <SkeletonLoader variant="circle" width="w-8" height="h-8" className="mr-3 mt-auto" />
                        )}
                        <SkeletonLoader
                            width={i % 2 === 0 ? "w-[60%]" : "w-[50%]"}
                            height="h-16"
                            className="rounded-[20px]"
                        />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div ref={scrollRef} className="messages-area">
            {messages.map((msg, idx) => (
                <div key={idx} className={`message-row ${msg.role === 'user' ? 'user' : ''}`}>
                    {msg.role === 'bot' && (
                        <div className="message-avatar">
                            {bot.name[0]}
                        </div>
                    )}

                    <div>
                        <div className={`message-bubble ${msg.role === 'user' ? 'user' : 'bot'}`}>
                            <MarkdownRenderer content={msg.content} />
                        </div>
                        <span className="message-time">{msg.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    {msg.role === 'user' && (
                        <div className="message-avatar">
                            U
                        </div>
                    )}
                </div>
            ))}

            {isTyping && (
                <div className="message-row">
                    <div className="message-avatar">
                        {bot.name[0]}
                    </div>
                    <div>
                        <div className="message-bubble bot">
                            <div className="loader">
                                <div className="loader-dot"></div><div className="loader-dot"></div><div className="loader-dot"></div>
                            </div>
                        </div>
                        <span className="message-time">Thinking...</span>
                    </div>
                </div>
            )}
        </div>
    );
};
