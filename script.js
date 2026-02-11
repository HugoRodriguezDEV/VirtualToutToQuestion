// ===== INTERSECTION OBSERVER FOR SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Activate all animated elements within the station
            const animatedElements = entry.target.querySelectorAll(
                '.fade-in-blur, .text-content, .station-title, .photo-item, .zoom-slow, .fade-dark, .question-container'
            );

            animatedElements.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('active');
                }, index * 100);
            });
        }
    });
}, observerOptions);

// Observe all stations
document.querySelectorAll('.station').forEach(station => {
    observer.observe(station);
});

// ===== PARALLAX EFFECT FOR STATION 3 =====
const station3 = document.getElementById('station-3');
const parallaxBg = document.querySelector('.parallax-bg');

if (station3 && parallaxBg) {
    window.addEventListener('scroll', () => {
        const rect = station3.getBoundingClientRect();
        const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);

        if (scrollPercent >= 0 && scrollPercent <= 1) {
            const moveX = (scrollPercent - 0.5) * 100;
            const moveY = (scrollPercent - 0.5) * 100;
            parallaxBg.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
    });
}

// ===== HEARTS ANIMATION =====
class Confetti {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.colors = ['#ff6b9d', '#ff8fab', '#ffc1d4', '#c44569', '#ff9999'];

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: -20,
            size: Math.random() * 15 + 10,
            speedY: Math.random() * 2 + 1,
            speedX: Math.random() * 2 - 1,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 4 - 2,
            opacity: Math.random() * 0.5 + 0.5
        };
    }

    drawHeart(size) {
        this.ctx.beginPath();
        const topCurveHeight = size * 0.3;
        this.ctx.moveTo(0, topCurveHeight);
        // Left side
        this.ctx.bezierCurveTo(
            -size / 2, -topCurveHeight,
            -size / 2, topCurveHeight / 2,
            0, size
        );
        // Right side
        this.ctx.bezierCurveTo(
            size / 2, topCurveHeight / 2,
            size / 2, -topCurveHeight,
            0, topCurveHeight
        );
        this.ctx.closePath();
        this.ctx.fill();
    }

    start() {
        // Create initial burst
        for (let i = 0; i < 100; i++) {
            this.particles.push(this.createParticle());
        }
        this.animate();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((particle, index) => {
            particle.y += particle.speedY;
            particle.x += particle.speedX;
            particle.rotation += particle.rotationSpeed;

            this.ctx.save();
            this.ctx.translate(particle.x, particle.y);
            this.ctx.rotate(particle.rotation * Math.PI / 180);
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = particle.color;
            this.drawHeart(particle.size);
            this.ctx.restore();

            // Remove particles that fall off screen
            if (particle.y > this.canvas.height) {
                this.particles.splice(index, 1);
            }
        });

        // Add new particles occasionally
        if (this.particles.length < 80 && Math.random() > 0.8) {
            this.particles.push(this.createParticle());
        }

        if (this.particles.length > 0) {
            requestAnimationFrame(() => this.animate());
        }
    }
}

// ===== BUTTON HANDLERS =====
const celebrationOverlay = document.getElementById('celebration');
const confettiCanvas = document.getElementById('confetti-canvas');
const btnYes = document.getElementById('btn-yes');
const btnObviously = document.getElementById('btn-obviously');

function celebrate() {
    // Show celebration overlay
    celebrationOverlay.classList.add('active');

    // Start confetti
    const confetti = new Confetti(confettiCanvas);
    confetti.start();

    // Add haptic feedback on mobile
    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 200]);
    }

    // Play a celebratory sound (optional - you can add an audio file)
    // const audio = new Audio('celebration.mp3');
    // audio.play();
}

btnYes.addEventListener('click', celebrate);
btnObviously.addEventListener('click', celebrate);

// ===== SMOOTH SCROLL ENHANCEMENT =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== PREVENT PULL-TO-REFRESH ON MOBILE =====
let lastTouchY = 0;
let preventPullToRefresh = false;

document.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    lastTouchY = e.touches[0].clientY;
    preventPullToRefresh = window.pageYOffset === 0;
}, { passive: false });

document.addEventListener('touchmove', (e) => {
    const touchY = e.touches[0].clientY;
    const touchYDelta = touchY - lastTouchY;
    lastTouchY = touchY;

    if (preventPullToRefresh && touchYDelta > 0) {
        e.preventDefault();
    }
}, { passive: false });

// ===== INITIAL LOAD ANIMATION =====
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Log for debugging
console.log('🎉 Scrollytelling experience loaded! Desliza para comenzar la historia...');

