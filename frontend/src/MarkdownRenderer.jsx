import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const MarkdownRenderer = ({ content }) => {
    return (
        <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                    code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            <div className="my-5 rounded-xl overflow-hidden bg-[#1e1e1e] shadow-2xl border border-white/10 group ring-1 ring-white/5">
                                {/* Window Header (Xcode Style) */}
                                <div className="flex items-center justify-between px-4 py-2.5 bg-[#282828] border-b border-white/5 select-none">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-sm transform hover:scale-110 transition-transform" />
                                        <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-sm transform hover:scale-110 transition-transform" />
                                        <div className="w-3 h-3 rounded-full bg-[#27C93F] shadow-sm transform hover:scale-110 transition-transform" />
                                    </div>
                                    <div className="text-[11px] font-medium text-gray-500 font-mono opacity-60 group-hover:opacity-100 transition-opacity uppercase tracking-wider">
                                        {match[1]}
                                    </div>
                                </div>
                                {/* Code Content */}
                                <div className="p-4 overflow-x-auto bg-[#1e1e1e]">
                                    <code className={`${className} !bg-transparent !p-0 font-mono text-[13.5px] leading-relaxed`} {...props}>
                                        {children}
                                    </code>
                                </div>
                            </div>
                        ) : (
                            <code className="bg-slate-800 px-1.5 py-0.5 rounded text-blue-300 text-sm font-mono" {...props}>
                                {children}
                            </code>
                        );
                    },
                    p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1 ml-2">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1 ml-2">{children}</ol>,
                    li: ({ children }) => <li className="text-slate-300">{children}</li>,
                    h1: ({ children }) => <h1 className="text-xl font-bold text-white mb-3 mt-4 border-b border-white/10 pb-2">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-lg font-bold text-white mb-2 mt-3">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-base font-bold text-white mb-2 mt-2">{children}</h3>,
                    blockquote: ({ children }) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-400 my-2 bg-blue-500/5 py-2 pr-2 rounded-r">{children}</blockquote>,
                    a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline hover:text-blue-300 transition-colors">{children}</a>,
                    table: ({ children }) => <div className="overflow-x-auto my-4 border border-white/10 rounded-lg"><table className="min-w-full divide-y divide-white/10 text-sm">{children}</table></div>,
                    th: ({ children }) => <th className="px-4 py-3 bg-slate-800 text-left font-semibold text-white">{children}</th>,
                    td: ({ children }) => <td className="px-4 py-3 border-t border-white/5 text-slate-300">{children}</td>,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownRenderer;
