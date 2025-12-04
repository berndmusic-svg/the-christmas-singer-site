// Enhanced Christmas Singer Website JavaScript
class ChristmasSingerWebsite {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section');
        this.contactForm = document.getElementById('contactForm');
        
        this.init();
    }
    
    init() {
        this.createParticles();
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupContactForm();
        this.setupLazyLoading();
        this.setupAnimations();
        
        // Show navbar after page load
        setTimeout(() => {
            // Navbar is now always visible
        }, 500);
    }
    
    // Particle System
    /**
     * Creëer een bescheidener aantal sfeerdeeltjes voor betere prestaties.
     * Er worden slechts 10 deeltjes bij het laden gegenereerd en daarna elke 5 seconden één.
     */
    createParticles() {
        // Respect reduced motion and very small screens
        try {
            const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            const smallScreen = Math.min(window.innerWidth, window.innerHeight) < 480;
            if (prefersReduced || smallScreen) {
                return; // Skip particles entirely
            }
        } catch(e) {}

        const particlesContainer = document.getElementById('particles');
        const particles = ['❄️', '✨', '⭐', '🎄', '🔔'];

        // Maak een kleiner aantal initiële deeltjes aan om het geheugenverbruik te beperken
        for (let i = 0; i < 10; i++) {
            this.createParticle(particlesContainer, particles);
        }

        // Creëer nieuwe deeltjes op een lagere frequentie
        setInterval(() => {
            this.createParticle(particlesContainer, particles);
        }, 5000);
    }
    
    createParticle(container, particles) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.innerHTML = particles[Math.floor(Math.random() * particles.length)];
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 6) + 's';
        
        container.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 9000);
    }
    
    // Navigation Setup
    setupNavigation() {
        // Mobile menu toggle
        this.navToggle.addEventListener('click', () => {
            this.navToggle.classList.toggle('active');
            this.navMenu.classList.toggle('active');
        });
        
        // NOODOPLOSSING: Eenvoudige scroll functie
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('data-scroll');
                
                // Directe scroll zonder complexe berekeningen
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    // Eenvoudige scroll met vaste offset
                    const yOffset = -100;
                    const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    
                    window.scrollTo({
                        top: y,
                        behavior: 'smooth'
                    });
                }
                
                // Sluit mobiel menu
                this.navToggle.classList.remove('active');
                this.navMenu.classList.remove('active');
            });
        });
        
        // Update active navigation link
        window.addEventListener('scroll', () => {
            this.updateActiveNavLink();
        });
    }
    
    updateActiveNavLink() {
        const scrollPosition = window.scrollY + 100;
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-scroll') === sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Scroll Effects
    setupScrollEffects() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    handleScroll() {
        const scrollY = window.scrollY;
        
        // Navbar scroll effect
        if (scrollY > 100) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
        
        // Parallax effect for hero (disabled to prevent overlap)
        // const hero = document.querySelector('.hero');
        // if (hero && scrollY < window.innerHeight) {
        //     hero.style.transform = `translateY(${scrollY * 0.5}px)`;
        // }
        
        // Fade in sections on scroll
        this.animateOnScroll();
    }
    
    // Intersection Observer for animations
    setupAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);
        
        // Observe all animatable elements
        const animateElements = document.querySelectorAll(
            '.package-card, .testimonial-card, .about-content, .repertoire-category, .contact-item'
        );
        
        animateElements.forEach(el => {
            observer.observe(el);
        });
    }
    
    animateOnScroll() {
        const elements = document.querySelectorAll('.package-card, .testimonial-card');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Contact Form Setup
    setupContactForm() {
        if (!this.contactForm) return;
        
        this.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission();
        });
        
        // Real-time validation
        const inputs = this.contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        const isRequired = field.hasAttribute('required');
        const fieldType = field.type;
        
        // Clear previous errors
        this.clearFieldError(field);
        
        // Required field validation
        if (isRequired && !value) {
            this.showFieldError(field, 'Dit veld is verplicht');
            return false;
        }
        
        // Email validation
        if (fieldType === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showFieldError(field, 'Voer een geldig emailadres in');
                return false;
            }
        }
        
        // Phone validation (Dutch format)
        if (fieldType === 'tel' && value) {
            const phoneRegex = /^(\+31|0)[0-9]{9}$/;
            if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                this.showFieldError(field, 'Voer een geldig Nederlands telefoonnummer in');
                return false;
            }
        }
        
        return true;
    }
    
    showFieldError(field, message) {
        const formGroup = field.closest('.form-group');
        const existingError = formGroup.querySelector('.field-error');
        
        if (existingError) {
            existingError.remove();
        }
        
        const errorElement = document.createElement('span');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.color = '#ef4444';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.display = 'block';
        errorElement.style.marginTop = '0.25rem';
        
        formGroup.appendChild(errorElement);
        field.style.borderColor = '#ef4444';
    }
    
    clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        const existingError = formGroup.querySelector('.field-error');
        
        if (existingError) {
            existingError.remove();
        }
        
        field.style.borderColor = '';
    }
    
    async handleFormSubmission() {
        const formData = new FormData(this.contactForm);
        const data = Object.fromEntries(formData.entries());
        
        // Track form submission attempt
        Analytics.trackFormSubmission('contact_form');
        
        // Validate all fields
        const inputs = this.contactForm.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            this.showFormMessage('Corrigeer de fouten hierboven en probeer opnieuw.', 'error');
            return;
        }
        
        // Show loading state
        const submitButton = this.contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Verzenden...';
        submitButton.disabled = true;
        
        try {
            // Simulate form submission (replace with actual endpoint)
            await this.simulateFormSubmission(data);
            
            this.showFormMessage(
                'Bedankt voor uw bericht! We nemen binnen 2 uur contact met u op.',
                'success'
            );
            
            this.contactForm.reset();
            
        } catch (error) {
            this.showFormMessage(
                'Er ging iets mis bij het verzenden. Probeer het opnieuw of neem direct contact op.',
                'error'
            );
        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }
    
    simulateFormSubmission(data) {
        return new Promise((resolve) => {
            // Simulate network delay
            setTimeout(() => {
                console.log('Form submitted:', data);
                resolve();
            }, 1000);
        });
    }
    
    showFormMessage(message, type) {
        // Remove existing messages
        const existingMessage = this.contactForm.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const messageElement = document.createElement('div');
        messageElement.className = `form-message form-message-${type}`;
        messageElement.textContent = message;
        
        const styles = {
            padding: '1rem',
            borderRadius: '10px',
            marginBottom: '1rem',
            fontWeight: '500'
        };
        
        if (type === 'success') {
            styles.background = 'rgba(34, 197, 94, 0.2)';
            styles.color = '#16a34a';
            styles.border = '1px solid rgba(34, 197, 94, 0.3)';
        } else {
            styles.background = 'rgba(239, 68, 68, 0.2)';
            styles.color = '#dc2626';
            styles.border = '1px solid rgba(239, 68, 68, 0.3)';
        }
        
        Object.assign(messageElement.style, styles);
        
        this.contactForm.insertBefore(messageElement, this.contactForm.firstChild);
        
        // Auto-remove success messages
        if (type === 'success') {
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.remove();
                }
            }, 5000);
        }
    }
    
    // Lazy Loading Setup
    
    setupLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            // add a 'loaded' class when the image has finished loading for a fade-in effect
            if (img.complete) {
                img.classList.add('loaded');
            } else {
                img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
            }
        });
        // We rely on native browser lazy-loading. IntersectionObserver logic removed for simplicity & performance.
    }
    
                });
            });
            
            images.forEach(img => {
                img.classList.add('lazy');
                imageObserver.observe(img);
            });
        }
    }
    
    // Utility Methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Package Card Interactions
class PackageCardEffects {
    constructor() {
        this.setupPackageCards();
    }
    
    setupPackageCards() {
        const packageCards = document.querySelectorAll('.package-card');
        
        packageCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.highlightCard(card);
            });
            
            card.addEventListener('mouseleave', () => {
                this.resetCard(card);
            });
            
            // Add click effect
            const button = card.querySelector('.btn');
            if (button) {
                button.addEventListener('click', (e) => {
                    this.animateButtonClick(e.target);
                });
            }
        });
    }
    
    highlightCard(card) {
        // Add glow effect
        card.style.boxShadow = '0 20px 60px rgba(212, 175, 55, 0.3)';
        
        // Slight rotation effect
        card.style.transform = 'translateY(-10px) rotateY(2deg)';
    }
    
    resetCard(card) {
        card.style.boxShadow = '';
        card.style.transform = '';
    }
    
    animateButtonClick(button) {
        // Create ripple effect
        const ripple = document.createElement('span');
        ripple.setAttribute('aria-hidden', 'true');
        ripple.className = 'ripple';
        
        const buttonRect = button.getBoundingClientRect();
        const size = Math.max(buttonRect.width, buttonRect.height);
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.6)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.pointerEvents = 'none';
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
}

// Scroll-triggered animations
class ScrollAnimations {
    constructor() {
        this.setupScrollTriggers();
    }
    
    setupScrollTriggers() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);
        
        // Elements to animate
        const animateElements = document.querySelectorAll(`
            .section-title,
            .section-subtitle,
            .package-card,
            .testimonial-card,
            .highlight-item,
            .repertoire-category,
            .contact-item
        `);
        
        animateElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            el.style.transitionDelay = `${index * 0.1}s`;
            
            observer.observe(el);
        });
    }
    
    animateElement(element) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }
}

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.measurePerformance();
    }
    
    measurePerformance() {
        // Measure page load time
        window.addEventListener('load', () => {
            const perfData = performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            
            console.log(`Page loaded in ${pageLoadTime}ms`);
            
            // Track Core Web Vitals
            this.trackCoreWebVitals();
        });
    }
    
    trackCoreWebVitals() {
        // First Contentful Paint
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.name === 'first-contentful-paint') {
                        console.log(`FCP: ${entry.startTime}ms`);
                    }
                });
            });
            
            observer.observe({ entryTypes: ['paint'] });
        }
        
        // Largest Contentful Paint
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log(`LCP: ${lastEntry.startTime}ms`);
            });
            
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Set minimum date for date input to today
    const dateInput = document.getElementById('datum');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
    
    // Initialize main website functionality
    new ChristmasSingerWebsite();
    
    // Initialize package card effects
    new PackageCardEffects();
    
    // Initialize scroll animations
    new ScrollAnimations();
    
    // Initialize performance monitoring
    new PerformanceMonitor();
    
    
    // Track a pageview on load
    try { Analytics.trackPageView(window.location.pathname); } catch(e) {}
// Add CSS animation for ripple effect
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .lazy {
            opacity: 0;
            transition: opacity 0.3s;
        }
        
        .lazy.loaded {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
});

// Error handling for production
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    // In production, you might want to send this to an error tracking service
});

// Service Worker registration for better performance (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Analytics tracking (placeholder for actual analytics)
class Analytics {
    static trackEvent(category, action, label = '') {
        // Google Analytics 4 Event Tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label,
                custom_parameter_1: 'kerstzanger_website'
            });
        }
        
        // Console log for debugging
        console.log(`Analytics: ${category} - ${action} - ${label}`);
    }
    
    static trackPageView(page) {
        if (typeof gtag !== 'undefined') {
            gtag('config', 'G-6CWRVSVY5R', {
                page_title: document.title,
                page_location: window.location.href,
                custom_parameter_1: 'kerstzanger_website'
            });
        }
        
        console.log(`Page view: ${page}`);
    }
    
    static trackFormSubmission(formType) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                event_category: 'engagement',
                event_label: formType,
                value: 1
            });
        }
    }
    
    static trackPhoneCall() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'phone_call', {
                event_category: 'contact',
                event_label: 'header_phone',
                value: 1
            });
        }
    }
    
    static trackWhatsAppClick() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'whatsapp_click', {
                event_category: 'contact',
                event_label: 'contact_section',
                value: 1
            });
        }
    }
    
    static trackPackageInterest(packageName) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'package_interest', {
                event_category: 'packages',
                event_label: packageName,
                value: 1
            });
        }
    }
}

// Track important interactions
document.addEventListener('click', (e) => {
    const target = e.target;
    
    // Track CTA clicks
    if (target.classList.contains('btn')) {
        const buttonText = target.textContent.trim();
        Analytics.trackEvent('CTA', 'click', buttonText);
    }
    
    // Track package selections
    if (target.closest('.package-card')) {
        const packageTitle = target.closest('.package-card').querySelector('.package-title').textContent;
        Analytics.trackPackageInterest(packageTitle);
    }
    
    // Track contact methods
    if (target.href && (target.href.includes('tel:') || target.href.includes('mailto:') || target.href.includes('wa.me'))) {
        const contactMethod = target.href.includes('tel:') ? 'phone' : 
                             target.href.includes('mailto:') ? 'email' : 'whatsapp';
        
        if (contactMethod === 'phone') {
            Analytics.trackPhoneCall();
        } else if (contactMethod === 'whatsapp') {
            Analytics.trackWhatsAppClick();
        } else {
            Analytics.trackEvent('Contact', contactMethod);
        }
    }
    
    // Track Showbird booking clicks
    if (target.href && target.href.includes('showbird.com')) {
        Analytics.trackEvent('Booking', 'showbird_click', 'external_booking');
    }
});

// Modern Slideshow Class
class ModernSlideshow {
    constructor() {
        this.currentIndex = 0;
        this.slides = document.querySelectorAll('.modern-slideshow .slide');
        this.indicators = document.querySelectorAll('.modern-slideshow .indicator');
        this.counter = document.querySelector('.modern-slideshow .slideshow-counter');
        this.container = document.querySelector('.modern-slideshow');
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000;
        
        this.init();
    }
    
    init() {
        if (!this.slides.length) return;
        
        this.setupBackgrounds();
        this.setupEventListeners();
        this.updateCounter();
        this.startAutoPlay();
    }
    
    setupBackgrounds() {
        this.slides.forEach((slide, index) => {
            const img = slide.querySelector('.slide-image');
            const background = slide.querySelector('.slide-background');
            
            if (img && background) {
                // Set background image for blur effect
                background.style.backgroundImage = `url(${img.src})`;
            }
        });
    }
    
    setupEventListeners() {
        // Navigation buttons
        const prevBtn = document.querySelector('.slideshow-prev');
        const nextBtn = document.querySelector('.slideshow-next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // Indicator dots
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });
        
        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        
        if (this.container) {
            this.container.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            });
            
            this.container.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe(touchStartX, touchEndX);
            });
            
            // Pause auto-play on hover
            this.container.addEventListener('mouseenter', () => {
                this.stopAutoPlay();
            });
            
            this.container.addEventListener('mouseleave', () => {
                this.startAutoPlay();
            });
        }
    }
    
    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide(); // Swipe left - next slide
            } else {
                this.prevSlide(); // Swipe right - previous slide
            }
        }
    }
    
    goToSlide(index) {
        if (index < 0 || index >= this.slides.length) return;
        
        // Remove active class from current slide and indicator
        this.slides[this.currentIndex].classList.remove('active');
        this.indicators[this.currentIndex].classList.remove('active');
        
        // Set new current index
        this.currentIndex = index;
        
        // Add active class to new slide and indicator
        this.slides[this.currentIndex].classList.add('active');
        this.indicators[this.currentIndex].classList.add('active');
        
        this.updateCounter();
        this.restartAutoPlay();
    }
    
    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }
    
    prevSlide() {
        const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex);
    }
    
    updateCounter() {
        if (this.counter) {
            const current = this.counter.querySelector('.current');
            const total = this.counter.querySelector('.total');
            
            if (current) current.textContent = this.currentIndex + 1;
            if (total) total.textContent = this.slides.length;
        }
    }
    
    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    restartAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }
}

// Initialize modern slideshow
let modernSlideshow;

document.addEventListener('DOMContentLoaded', () => {
    modernSlideshow = new ModernSlideshow();
});

// Track scroll depth
let maxScroll = 0;
window.addEventListener('scroll', () => {
    const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    
    if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        
        // Track milestones
        if (maxScroll >= 25 && maxScroll < 50) {
            Analytics.trackEvent('Scroll', '25%');
        } else if (maxScroll >= 50 && maxScroll < 75) {
            Analytics.trackEvent('Scroll', '50%');
        } else if (maxScroll >= 75 && maxScroll < 100) {
            Analytics.trackEvent('Scroll', '75%');
        } else if (maxScroll >= 100) {
            Analytics.trackEvent('Scroll', '100%');
        }
    }
});