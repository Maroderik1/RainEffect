import React, { useRef, useEffect } from "react";

const RainEffect = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const drops = [];
        const splashes = [];

        // Функция для создания случайного цвета
        function getRandomColor() {
            const letters = "0123456789ABCDEF";
            let color = "#";
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        // Функция для создания капли
        function createDrop(x, y) {
            return {
                x,
                y,
                dy: Math.random() * 6 + 5, // Скорость падения
                size: Math.random() * 2 + 1, // Размер капли
                color: getRandomColor() // Случайный цвет
            };
        }

        // Функция для создания брызг
        function createSplash(x, y) {
            const count = Math.random() * 5 + 5; // Количество брызг
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 2 + 1;
                splashes.push({
                    x,
                    y,
                    dx: Math.cos(angle) * speed,
                    dy: Math.sin(angle) * speed,
                    size: Math.random() * 2 + 1,
                    color: getRandomColor(),
                    life: 14 // Продолжительность жизни брызги
                });
            }
        }

        // Инициализация капель
        for (let i = 0; i < 100; i++) {
            drops.push(
                createDrop(
                    Math.random() * canvas.width,
                    Math.random() * canvas.height
                )
            );
        }

        // Функция для отрисовки капель
        function drawDrops() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drops.forEach((drop) => {
                ctx.beginPath();
                ctx.ellipse(
                    drop.x,
                    drop.y,
                    drop.size / 2,
                    drop.size,
                    0,
                    0,
                    Math.PI * 2
                );
                ctx.fillStyle = drop.color;
                ctx.fill();
                ctx.closePath();
            });
        }

        // Функция для отрисовки брызг
        function drawSplashes() {
            splashes.forEach((splash, index) => {
                if (splash.life > 0) {
                    ctx.beginPath();
                    ctx.arc(splash.x, splash.y, splash.size, 0, Math.PI * 2);
                    ctx.fillStyle = splash.color;
                    ctx.fill();
                    ctx.closePath();

                    // Обновление позиции брызг
                    splash.x += splash.dx;
                    splash.y += splash.dy;
                    splash.life--;
                } else {
                    splashes.splice(index, 1); // Удаление брызги, если ее жизнь закончилась
                }
            });
        }

        // Функция для обновления позиции капель
        function updateDrops() {
            drops.forEach((drop, index) => {
                drop.y += drop.dy;

                // При достижении нижней границы canvas
                if (drop.y > canvas.height - drop.size) {
                    createSplash(drop.x, drop.y); // Создание брызг
                    drops[index] = createDrop(
                        Math.random() * canvas.width,
                        -drop.size
                    );
                }
            });
        }

        // Анимация дождя
        function animate() {
            drawDrops();
            drawSplashes();
            updateDrops();
            requestAnimationFrame(animate);
        }

        animate();
    }, []);

    return <canvas ref={canvasRef} width={1000} height={600} />;
};

export default RainEffect;
