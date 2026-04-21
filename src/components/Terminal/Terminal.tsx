import { useState, useRef, useEffect } from 'react';
import { X, Mic } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { PROJECTS_DATA } from '../../data/projects';
import { generateGeminiResponse } from '../../services/gemini';
import { SnakeGame } from './SnakeGame';

interface TerminalProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenFile: (file: any) => void;
}

export const IntegratedTerminal = ({ isOpen, onClose, onOpenFile }: TerminalProps) => {
    const [history, setHistory] = useState([
        { type: 'system', content: 'Shell v2.5.0' },
        { type: 'system', content: 'Type "help" for commands or just ask a question.' },
    ]);
    const [input, setInput] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [height, setHeight] = useState(256);
    const [isDragging, setIsDragging] = useState(false);
    const startY = useRef(0);
    const startHeight = useRef(0);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            const deltaY = startY.current - e.clientY;
            const newHeight = Math.max(150, Math.min(window.innerHeight - 150, startHeight.current + deltaY));
            setHeight(newHeight);
        };
        const handleMouseUp = () => {
            if (isDragging) {
                setIsDragging(false);
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
            }
        };
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    const handleResizeStart = (e: React.MouseEvent) => {
        setIsDragging(true);
        startY.current = e.clientY;
        startHeight.current = height;
        document.body.style.cursor = 'row-resize';
        document.body.style.userSelect = 'none';
    };

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [history]);

    useEffect(() => {
        if (!isProcessing && isOpen && !isListening) {
            const t = setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
            return () => clearTimeout(t);
        }
    }, [isProcessing, isOpen, isListening]);

    const startListening = () => {
        // @ts-ignore
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setHistory(prev => [...prev, { type: 'error', content: 'Speech recognition is not supported in this browser.' }]);
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event: any) => {
            const speechResult = event.results[0][0].transcript;
            setInput(speechResult);
            // Optionally, we could auto-submit here by calling handleCommand with the speechResult
        };

        recognition.onerror = (event: any) => {
            console.error('Speech error', event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    const handleCommand = async () => {
        const cmd = input.trim();
        if (!cmd) return;

        setHistory(prev => [...prev, { type: 'user', content: cmd }]);
        setInput("");

        const args = cmd.split(' ');
        const command = args[0].toLowerCase();

        if (command === 'help') {
            setHistory(prev => [...prev, {
                type: 'output', content:
                    `Available Commands:
  ls              List all projects
  open <name>     Open project details
  cat <name>      Print project summary
  clear           Clear terminal history
  pwd             Print working directory
  whoami          Print current user
  date            Print current date
  echo <msg>      Print a message
  git status      Check git status
  npm run dev     Start dev server (simulated)
  play snake      Play classic Snake game
  <query>         Ask Gemini AI anything`
            }]);
            setIsProcessing(false);
            return;
        }

        if (command === 'play' && args[1] === 'snake') {
            setHistory(prev => [...prev, { type: 'snake', content: '' }]);
            setIsProcessing(false);
            return;
        }

        if (command === 'ls' || command === 'list') {
            const list = PROJECTS_DATA.map(p =>
                `${p.id.padEnd(20)} ${p.type.padEnd(15)} ${p.date}`
            ).join('\n');

            setTimeout(() => {
                setHistory(prev => [...prev, { type: 'output', content: list }]);
                setIsProcessing(false);
            }, 100);
            return;
        }

        if (command === 'clear') {
            setHistory([]);
            setIsProcessing(false);
            return;
        }

        if (command === 'open') {
            const target = args[1];
            if (target === 'playground') {
                setHistory(prev => [...prev, { type: 'success', content: `Opening Live Playground...` }]);
                onOpenFile({ id: 'playground', title: 'playground', type: 'playground' });
                setIsProcessing(false);
                return;
            }

            const project = PROJECTS_DATA.find(p => p.id === target || p.title === target);
            if (project) {
                setHistory(prev => [...prev, { type: 'success', content: `Opening ${project.title}...` }]);
                onOpenFile({ id: project.id, title: `${project.title}.tsx`, type: 'detail', data: project });
            } else {
                setHistory(prev => [...prev, { type: 'error', content: `Error: Project '${target}' not found.` }]);
            }
            setIsProcessing(false);
            return;
        }

        if (command === 'cat') {
            const target = args[1];
            const project = PROJECTS_DATA.find(p => p.id === target || p.title === target);
            if (project) {
                setHistory(prev => [...prev, { type: 'output', content: `\n--- ${project.title.toUpperCase()} ---\n${project.description}\nStack: ${project.tech.join(', ')}\n` }]);
            } else {
                setHistory(prev => [...prev, { type: 'error', content: `Error: Project '${target}' not found.` }]);
            }
            setIsProcessing(false);
            return;
        }

        // --- NEW COMMANDS ---
        if (command === 'pwd') {
            setHistory(prev => [...prev, { type: 'output', content: '/home/visitor/portfolio' }]);
            setIsProcessing(false);
            return;
        }

        if (command === 'whoami') {
            setHistory(prev => [...prev, { type: 'output', content: 'visitor' }]);
            setIsProcessing(false);
            return;
        }

        if (command === 'date') {
            setHistory(prev => [...prev, { type: 'output', content: new Date().toString() }]);
            setIsProcessing(false);
            return;
        }

        if (command === 'echo') {
            setHistory(prev => [...prev, { type: 'output', content: args.slice(1).join(' ') }]);
            setIsProcessing(false);
            return;
        }

        if (command === 'npm' && (args[1] === 'run' || args[1] === 'start')) {
            setHistory(prev => [...prev, { type: 'output', content: '> portfolio@1.0.0 dev\n> vite\n\n  VITE v4.4.9  ready in 320 ms\n\n  ➜  Local:   http://localhost:5173/\n  ➜  Network: use --host to expose' }]);
            setIsProcessing(false);
            return;
        }

        if (command === 'git' && args[1] === 'status') {
            setHistory(prev => [...prev, { type: 'output', content: 'On branch main\nYour branch is up to date with \'origin/main\'.\n\nnothing to commit, working tree clean' }]);
            setIsProcessing(false);
            return;
        }

        if (command === 'uname') {
            setHistory(prev => [...prev, { type: 'output', content: 'Linux portfolio-kernel 6.5.0-generic' }]);
            setIsProcessing(false);
            return;
        }

        try {
            setIsProcessing(true);
            const thinkingId = Date.now();
            // @ts-ignore
            setHistory(prev => [
                ...prev,
                { id: thinkingId, type: 'system', content: 'gemini: thinking' }
            ]);

            let frame = 0;
            const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

            const thinkingInterval = setInterval(() => {
                frame = (frame + 1) % frames.length;
                setHistory(prev =>
                    prev.map(line =>
                        // @ts-ignore
                        line.id === thinkingId
                            ? { ...line, content: `gemini: ${frames[frame]} thinking` }
                            : line
                    )
                );
            }, 120);

            const aiResponse = await generateGeminiResponse(cmd);
            const delay = 800 + Math.random() * 800;

            setTimeout(() => {
                clearInterval(thinkingInterval);
                setHistory(prev => [
                    // @ts-ignore
                    ...prev.filter(line => line.id !== thinkingId),
                    { type: 'output', content: aiResponse }
                ]);
                setIsProcessing(false);
            }, delay);
            return;
        } catch (e) {
            setHistory(prev => [...prev, { type: 'error', content: "Error connecting to AI." }]);
            setIsProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            style={{ height: `${height}px` }}
            className={`relative bg-[var(--bg-activity)] border-t border-[var(--border)] z-20 flex flex-col ${isDragging ? '' : 'transition-all duration-300'}`}
        >
            {/* Drag Handle for resizing */}
            <div 
                className="absolute top-0 left-0 w-full h-1 cursor-row-resize z-30 hover:bg-[var(--accent)] transition-colors"
                onMouseDown={handleResizeStart}
            />
            <div className="h-8 bg-[var(--bg-activity)] flex justify-between items-center px-2 md:px-4 select-none flex-shrink-0">
                {/* TABS - Responsive scrolling */}
                <div className="flex items-center gap-4 md:gap-6 h-full overflow-x-auto custom-scrollbar no-scrollbar whitespace-nowrap scrollbar-hide">
                    <span className="text-[10px] md:text-[11px] font-sans text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer py-1 border-b border-transparent hover:border-[var(--text-secondary)] transition-colors">PROBLEMS</span>
                    <span className="text-[10px] md:text-[11px] font-sans text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer py-1 border-b border-transparent hover:border-[var(--text-secondary)] transition-colors">OUTPUT</span>
                    <span className="text-[10px] md:text-[11px] font-sans text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer py-1 border-b border-transparent hover:border-[var(--text-secondary)] transition-colors shrink-0">DEBUG CONSOLE</span>
                    <span className="text-[10px] md:text-[11px] font-sans text-[var(--text-primary)] cursor-pointer py-1 border-b border-[var(--accent)] font-medium">TERMINAL</span>
                </div>

                {/* ACTIONS */}
                <div className="flex items-center gap-2 md:gap-3 ml-2">
                    <span className="text-[9px] text-[var(--text-secondary)] font-mono hidden lg:inline mr-2">node ➜ v20.1.0</span>
                    <button onClick={onClose} className="p-1 hover:bg-[var(--bg-panel)] rounded hover:text-[var(--text-primary)] text-[var(--text-secondary)] transition-colors">
                        <X size={14} />
                    </button>
                </div>
            </div>
            <div
                ref={scrollRef}
                style={{ fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace" }}
                className="flex-1 overflow-y-auto p-3 md:p-4 text-[11px] md:text-sm bg-[var(--bg-activity)] custom-scrollbar"
                onClick={() => {
                    if (!isProcessing) inputRef.current?.focus();
                }}
            >
                {history.map((line, i) => (
                    <div key={i} className="mb-1 whitespace-pre-wrap break-words">
                        {line.type === 'user' && (
                            <div className="flex gap-1.5 md:gap-2 text-[var(--text-primary)]">
                                <span className="text-[var(--success)] shrink-0">➜</span>
                                <span className="text-[var(--info)] shrink-0">~</span>
                                <span>{line.content}</span>
                            </div>
                        )}
                        {line.type === 'system' && <div className="text-[var(--text-secondary)] italic opacity-80">{line.content}</div>}
                        {line.type === 'output' && (
                            <div className="text-[var(--text-primary)] ml-3 md:ml-4 markdown-body bg-transparent text-inherit prose prose-invert prose-sm max-w-none">
                                <ReactMarkdown 
                                    remarkPlugins={[remarkGfm]} 
                                    rehypePlugins={[rehypeRaw]}
                                    components={{
                                        a: ({ node, ...props }) => {
                                            const href = props.href || '';
                                            if (href.startsWith('file://')) {
                                                const id = href.replace('file://', '');
                                                return (
                                                    <a 
                                                        href="#" 
                                                        className="text-[var(--accent)] underline cursor-pointer hover:opacity-80"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            const project = PROJECTS_DATA.find(p => p.id === id);
                                                            if (project) {
                                                                onOpenFile({ id: project.id, title: `${project.title}.tsx`, type: 'detail', data: project });
                                                            } else if (id === 'playground') {
                                                                onOpenFile({ id: 'playground', title: 'playground', type: 'playground' });
                                                            } else {
                                                                console.warn('Unknown local link:', id);
                                                            }
                                                        }}
                                                    >
                                                        {props.children}
                                                    </a>
                                                );
                                            }
                                            return <a {...props} className="text-[var(--accent)] underline hover:opacity-80" target="_blank" rel="noopener noreferrer" />;
                                        }
                                    }}
                                >
                                    {line.content}
                                </ReactMarkdown>
                            </div>
                        )}
                        {line.type === 'success' && <div className="text-[var(--success)] ml-3 md:ml-4">{line.content}</div>}
                        {line.type === 'error' && <div className="text-red-400 ml-3 md:ml-4">{line.content}</div>}
                        {line.type === 'snake' && <SnakeGame />}
                    </div>
                ))}
                <div className="flex gap-1.5 md:gap-2 items-center mt-2">
                    <span className="text-[var(--success)] shrink-0">➜</span>
                    <span className="text-[var(--info)] shrink-0">~</span>
                    <div className="relative flex-1">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            disabled={isProcessing}
                            autoCapitalize="none"
                            autoComplete="off"
                            autoCorrect="off"
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !isProcessing) {
                                    e.preventDefault();
                                    handleCommand();
                                }
                            }}
                            className={`w-full bg-transparent border-none outline-none text-[12px] md:text-sm ${isProcessing ? 'text-[var(--text-secondary)] cursor-wait' : 'text-[var(--text-primary)]'}`}
                        />
                        {isProcessing && (
                            <div className="absolute top-0 right-0">
                                <div className="h-4 w-2 bg-[var(--text-secondary)] animate-pulse" />
                            </div>
                        )}
                        <button 
                            onClick={startListening}
                            className={`absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[var(--bg-activity)] transition-colors ${isListening ? 'text-[var(--error)] animate-pulse' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                            title="Voice Command"
                        >
                            <Mic size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
