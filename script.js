
// DOM Elements
const body = document.body;
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;
const nav = document.querySelector('.nav');
const mobileToggle = document.getElementById('mobile-toggle');
const navLinks = document.getElementById('nav-links');

// Theme Management
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
});

function setTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    // Update icon
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.className = 'ri-sun-fill';
    } else {
        icon.className = 'ri-moon-fill';
    }
}

// Mobile Menu
mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = mobileToggle.querySelector('i');
    icon.className = navLinks.classList.contains('active') ? 'ri-close-line' : 'ri-menu-4-line';
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        // Use Lenis for anchor scrolling
        if (link.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            lenis.scrollTo(targetId);
        }

        navLinks.classList.remove('active');
        mobileToggle.querySelector('i').className = 'ri-menu-4-line';
    });
});

// Scroll Header Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});


document.addEventListener('DOMContentLoaded', () => {
    // Lenis Smooth Scroll
    if (typeof Lenis !== 'undefined') {
        try {
            const lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smooth: true,
                direction: 'vertical',
            });

            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
        } catch (e) {
            console.warn('Lenis init failed:', e);
        }
    } else {
        console.warn('Lenis library not found. Smooth scrolling disabled.');
    }

    // Reveal Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Fallback: If IntersectionObserver is not supported (rare now, but safely)
    if (!('IntersectionObserver' in window)) {
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
    } else {
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }

    // Active Link State
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-link');

    const activeLinkObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                navItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.5 });

    if (sections.length > 0) {
        sections.forEach(section => activeLinkObserver.observe(section));
    }

    // 3D Tilt Effect for Bento Items
    const cards = document.querySelectorAll('.bento-item, .hero-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5; // Max 5 deg rotation
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });

    // Magnetic Buttons
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const moveX = (x - centerX) * 0.2;
            const moveY = (y - centerY) * 0.2;

            btn.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
});
