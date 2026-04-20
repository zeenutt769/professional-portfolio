import React, { useEffect, useRef, useState } from 'react';

export const SnakeGame = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const box = 20;
        let snake: {x: number, y: number}[] = [{ x: 9 * box, y: 10 * box }];
        let food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
        let d: string;

        const documentKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowLeft' && d !== 'RIGHT') d = 'LEFT';
            else if (event.key === 'ArrowUp' && d !== 'DOWN') d = 'UP';
            else if (event.key === 'ArrowRight' && d !== 'LEFT') d = 'RIGHT';
            else if (event.key === 'ArrowDown' && d !== 'UP') d = 'DOWN';
            
            // Prevent default scrolling when playing
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
                event.preventDefault();
            }
        };

        window.addEventListener('keydown', documentKeyDown);

        const collision = (head: {x: number, y: number}, array: {x: number, y: number}[]) => {
            for (let i = 0; i < array.length; i++) {
                if (head.x === array[i].x && head.y === array[i].y) {
                    return true;
                }
            }
            return false;
        };

        const draw = () => {
            ctx.fillStyle = '#1e1e1e';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < snake.length; i++) {
                ctx.fillStyle = (i === 0) ? 'var(--accent)' : 'rgba(100, 255, 100, 0.7)';
                ctx.fillRect(snake[i].x, snake[i].y, box, box);
                ctx.strokeStyle = '#000';
                ctx.strokeRect(snake[i].x, snake[i].y, box, box);
            }

            ctx.fillStyle = '#ff375f';
            ctx.fillRect(food.x, food.y, box, box);

            let snakeX = snake[0].x;
            let snakeY = snake[0].y;

            if (d === 'LEFT') snakeX -= box;
            if (d === 'UP') snakeY -= box;
            if (d === 'RIGHT') snakeX += box;
            if (d === 'DOWN') snakeY += box;

            if (snakeX === food.x && snakeY === food.y) {
                setScore(prev => prev + 1);
                food = {
                    x: Math.floor(Math.random() * 19 + 1) * box,
                    y: Math.floor(Math.random() * 19 + 1) * box
                };
            } else {
                snake.pop();
            }

            let newHead = { x: snakeX, y: snakeY };

            if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
                clearInterval(game);
                setGameOver(true);
            }

            snake.unshift(newHead);
        };

        let game = setInterval(draw, 100);

        return () => {
            clearInterval(game);
            window.removeEventListener('keydown', documentKeyDown);
        };
    }, []);

    return (
        <div className="flex flex-col items-center mt-4 mb-4">
            <div className="flex justify-between w-[400px] mb-2 font-mono text-[var(--accent)] text-sm">
                <span>Score: {score}</span>
                {gameOver && <span className="text-[var(--warning)]">GAME OVER</span>}
            </div>
            <canvas 
                ref={canvasRef} 
                width={400} 
                height={400} 
                className="border-2 border-[var(--border)] rounded focus:outline-none bg-[#1e1e1e]"
                tabIndex={0}
            />
            <p className="text-xs text-[var(--text-secondary)] mt-2 font-mono">Use Arrow Keys to move. Click canvas to focus.</p>
        </div>
    );
};
