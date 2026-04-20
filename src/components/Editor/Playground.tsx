import React, { useState, useEffect } from 'react';
import { Play, Maximize2, Minimize2, Code2 } from 'lucide-react';

export const Playground = () => {
    const [html, setHtml] = useState(`<div class="container">\n  <h1>Hello World</h1>\n  <p>Welcome to Amit's Code Playground.</p>\n</div>`);
    const [css, setCss] = useState(`.container {\n  font-family: system-ui, sans-serif;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  height: 100vh;\n  background: #1e1e1e;\n  color: white;\n}\n\nh1 {\n  color: #00b8a3;\n}`);
    const [js, setJs] = useState(`console.log("Playground loaded!");`);
    const [srcDoc, setSrcDoc] = useState('');
    const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setSrcDoc(`
                <html>
                    <body>${html}</body>
                    <style>${css}</style>
                    <script>${js}</script>
                </html>
            `);
        }, 250);
        return () => clearTimeout(timeout);
    }, [html, css, js]);

    return (
        <div className={`flex flex-col h-full bg-[var(--bg-main)] ${isFullscreen ? 'fixed inset-0 z-[100] bg-[var(--bg-main)]' : ''}`}>
            {/* Header Toolbar */}
            <div className="flex justify-between items-center px-4 py-2 bg-[var(--bg-panel)] border-b border-[var(--border)]">
                <div className="flex items-center gap-2 text-[var(--text-primary)] font-bold text-sm">
                    <Code2 size={16} className="text-[var(--accent)]" />
                    <span>Live Playground</span>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="p-1.5 hover:bg-[var(--bg-activity)] rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    >
                        {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Editor Pane */}
                <div className="w-full md:w-1/2 flex flex-col border-b md:border-b-0 md:border-r border-[var(--border)]">
                    <div className="flex bg-[var(--bg-panel)] border-b border-[var(--border)]">
                        <button 
                            className={`px-4 py-2 text-xs font-mono border-t-2 ${activeTab === 'html' ? 'border-[var(--accent)] text-[var(--text-primary)] bg-[var(--bg-main)]' : 'border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-activity)]'}`}
                            onClick={() => setActiveTab('html')}
                        >
                            index.html
                        </button>
                        <button 
                            className={`px-4 py-2 text-xs font-mono border-t-2 ${activeTab === 'css' ? 'border-[var(--accent)] text-[var(--text-primary)] bg-[var(--bg-main)]' : 'border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-activity)]'}`}
                            onClick={() => setActiveTab('css')}
                        >
                            styles.css
                        </button>
                        <button 
                            className={`px-4 py-2 text-xs font-mono border-t-2 ${activeTab === 'js' ? 'border-[var(--accent)] text-[var(--text-primary)] bg-[var(--bg-main)]' : 'border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-activity)]'}`}
                            onClick={() => setActiveTab('js')}
                        >
                            script.js
                        </button>
                    </div>
                    <div className="flex-1 p-2 bg-[#1e1e1e]">
                        <textarea
                            className="w-full h-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none"
                            value={activeTab === 'html' ? html : activeTab === 'css' ? css : js}
                            onChange={(e) => {
                                if (activeTab === 'html') setHtml(e.target.value);
                                if (activeTab === 'css') setCss(e.target.value);
                                if (activeTab === 'js') setJs(e.target.value);
                            }}
                            spellCheck={false}
                        />
                    </div>
                </div>

                {/* Preview Pane */}
                <div className="w-full md:w-1/2 h-full bg-white">
                    <iframe
                        srcDoc={srcDoc}
                        title="output"
                        sandbox="allow-scripts"
                        className="w-full h-full border-none"
                    />
                </div>
            </div>
        </div>
    );
};
