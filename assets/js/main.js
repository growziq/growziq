document.addEventListener('DOMContentLoaded', () => {
    // ─── DOM References ───────────────────────────────────────────────────────
    const navLinks        = document.querySelectorAll('.nav-link');
    const views           = document.querySelectorAll('.view-section');
    const mobileMenuBtn   = document.getElementById('mobile-menu-btn');
    const mobileMenu      = document.getElementById('mobile-menu');
    const navbar          = document.getElementById('navbar');
    const navbarNavLinks  = navbar ? navbar.querySelectorAll('.nav-link[data-target]:not(.nav-logo)') : [];

    // ─── Routing Map ─────────────────────────────────────────────────────────
    const routes = {
        home:      '/index.html',
        services:  '/services.html',
        portfolio: '/portfolio.html',
        about:     '/about.html',
        contact:   '/contact.html'
    };

    const pageToView = {
        'index.html':     'home',
        '':               'home',
        'services.html':  'services',
        'services':       'services',
        'portfolio.html': 'portfolio',
        'portfolio':      'portfolio',
        'about.html':     'about',
        'about':          'about',
        'contact.html':   'contact',
        'contact':        'contact'
    };

    // ─── Active Nav Highlight ─────────────────────────────────────────────────
    function syncActiveNav(targetId) {
        navbarNavLinks.forEach((link) => {
            const linkTarget = link.getAttribute('data-target');
            link.classList.toggle('active', linkTarget === targetId);
        });
    }

    // ─── View Switcher ────────────────────────────────────────────────────────
    function switchView(targetId, skipScroll = false) {
        const targetView = document.getElementById(`view-${targetId}`);
        
        // Safety: If view doesn't exist on this page, don't hide current content
        if (!targetView) {
            console.debug(`[Growziq] View section "view-${targetId}" not found on this page.`);
            return;
        }

        // If already active, just sync UI and return
        if (targetView.classList.contains('active') && targetView.style.display === 'block') {
            if (mobileMenu) mobileMenu.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
            syncActiveNav(targetId);
            return;
        }

        views.forEach(view => {
            view.classList.remove('active');
            view.style.display = 'none';
        });

        targetView.style.display = 'block';
        // Use requestAnimationFrame for smoother class application
        requestAnimationFrame(() => {
            targetView.classList.add('active');
        });

        if (mobileMenu) {
            mobileMenu.classList.add('hidden');
        }
        document.body.classList.remove('overflow-hidden');
        syncActiveNav(targetId);
        
        if (!skipScroll) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // ─── Nav Link Click Handler ───────────────────────────────────────────────
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const target = link.getAttribute('data-target');
            if (!target) return;
            
            const localView = document.getElementById(`view-${target}`);
            
            // Case 1: We have the view section on the current page (SPA mode)
            if (localView) {
                e.preventDefault();
                switchView(target);
                return;
            }

            // Case 2: Link is to a different page - let browser handle it naturally
            if (mobileMenu) {
                mobileMenu.classList.add('hidden');
            }
            document.body.classList.remove('overflow-hidden');
            
            // We DON'T preventDefault here, allowing standard navigation
        });
    });

    // ─── Initial View Detection ───────────────────────────────────────────────
    const params      = new URLSearchParams(window.location.search);
    const requestedView = params.get('view');
    
    // Improved detection that works with clean URLs
    const pathParts = window.location.pathname.split('/');
    const lastPart = pathParts.pop() || '';
    const currentPage = lastPart.toLowerCase();
    
    const initialView = requestedView || pageToView[currentPage] || 'home';
    const staticPages = new Set(['contact.html', 'privacy.html', 'tos.html', 'contact', 'privacy', 'tos']);

    if (!staticPages.has(currentPage)) {
        switchView(initialView, true);
    } else {
        // For static pages, just sync the nav state
        const targetNavId = pageToView[currentPage] || currentPage.split('.')[0];
        syncActiveNav(targetNavId);
    }

    // ─── Enhanced Scroll Reveal + 3D Tilt ─────────────────────────────────────
    function initMotionEffects() {
        const revealTargets = document.querySelectorAll(
            'section, .rounded-2xl, .rounded-xl, .rounded-lg, .group, .pricing-card, .portfolio-card, .why-growziq-card'
        );

        revealTargets.forEach((el, index) => {
            el.classList.add('reveal-item');
            if (el.matches('.rounded-2xl, .rounded-xl, .rounded-lg, .group, .pricing-card, .portfolio-card')) {
                el.classList.add('tilt-hover', 'glow-soft');
            }
            el.style.transitionDelay = `${Math.min(index * 40, 380)}ms`;
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });

        revealTargets.forEach((el) => observer.observe(el));
    }

    initMotionEffects();

    // ─── 3D Mouse-Tracking Card Tilt ──────────────────────────────────────────
    function initCard3D() {
        const cards = document.querySelectorAll('.card-3d');
        if (!cards.length) return;
        const maxTilt = 5;

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateY = ((x - centerX) / centerX) * maxTilt;
                const rotateX = ((centerY - y) / centerY) * maxTilt;
                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0) scale(1)';
            });
        });
    }

    initCard3D();

    // ─── Parallax Orbs on Scroll ──────────────────────────────────────────────
    function initParallaxOrbs() {
        const orbs = document.querySelectorAll('.parallax-orb');
        if (!orbs.length) return;

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    orbs.forEach((orb, i) => {
                        const speed = 0.03 + (i * 0.015);
                        const yOffset = scrollY * speed;
                        orb.style.transform = `translateY(${yOffset}px)`;
                    });
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    initParallaxOrbs();

    // ─── Counter Animation ────────────────────────────────────────────────────
    function initCounterAnimation() {
        const counters = document.querySelectorAll('[data-count]');
        if (!counters.length) return;

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-count'), 10);
                    const suffix = el.getAttribute('data-suffix') || '';
                    const prefix = el.getAttribute('data-prefix') || '';
                    const duration = 1500;
                    const startTime = performance.now();

                    function updateCounter(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        const current = Math.round(eased * target);
                        el.textContent = prefix + current + suffix;
                        if (progress < 1) requestAnimationFrame(updateCounter);
                    }

                    requestAnimationFrame(updateCounter);
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.3 });

        counters.forEach(c => counterObserver.observe(c));
    }

    initCounterAnimation();

    // ─── Pricing Cards Auto-Scroll (mobile) ───────────────────────────────────
    function initPricingAutoScroll() {
        const pricingSection = document.getElementById('pricing-preview-section') || document.getElementById('pricing-section');
        const pricingTrack   = document.getElementById('pricing-cards-track');
        if (!pricingSection || !pricingTrack) return;

        let intervalId  = null;
        let resumeTimer = null;
        let direction   = 1;
        let running     = false;
        const stepSize  = 1;
        const intervalMs = 22;

        function hasOverflow() {
            return pricingTrack.scrollWidth - pricingTrack.clientWidth > 1;
        }

        function isMobileLikeViewport() {
            return window.matchMedia('(max-width: 1024px)').matches ||
                   window.matchMedia('(pointer: coarse)').matches ||
                   navigator.maxTouchPoints > 0;
        }

        function canRun() {
            return isMobileLikeViewport() && hasOverflow() && !document.hidden;
        }

        function tick() {
            if (!running) return;
            const maxScroll = pricingTrack.scrollWidth - pricingTrack.clientWidth;
            if (maxScroll <= 0) { stop(); return; }

            let nextLeft = pricingTrack.scrollLeft + stepSize * direction;
            if (nextLeft >= maxScroll) { nextLeft = maxScroll; direction = -1; }
            if (nextLeft <= 0)         { nextLeft = 0;          direction =  1; }
            pricingTrack.scrollLeft = nextLeft;
        }

        function start() {
            if (running || !canRun()) return;
            running    = true;
            intervalId = setInterval(tick, intervalMs);
        }

        function stop() {
            running = false;
            if (intervalId) { clearInterval(intervalId); intervalId = null; }
        }

        function pauseAndResume(delay = 1200) {
            stop();
            if (resumeTimer) clearTimeout(resumeTimer);
            resumeTimer = setTimeout(() => { if (canRun()) start(); }, delay);
        }

        const syncAutoScrollState = () => { if (canRun()) start(); else stop(); };

        if ('IntersectionObserver' in window) {
            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => { if (entry.isIntersecting) syncAutoScrollState(); });
            }, { threshold: 0.01, rootMargin: '80px 0px 80px 0px' });
            sectionObserver.observe(pricingSection);
        }

        window.addEventListener('scroll', () => { syncAutoScrollState(); }, { passive: true });
        window.addEventListener('resize', syncAutoScrollState);
        document.addEventListener('visibilitychange', () => { document.hidden ? stop() : syncAutoScrollState(); });

        pricingTrack.addEventListener('touchstart',  () => pauseAndResume(1400), { passive: true });
        pricingTrack.addEventListener('touchmove',   () => pauseAndResume(1400), { passive: true });
        pricingTrack.addEventListener('touchend',    () => pauseAndResume(800),  { passive: true });
        pricingTrack.addEventListener('touchcancel', () => pauseAndResume(800),  { passive: true });

        syncAutoScrollState();
        setTimeout(syncAutoScrollState, 250);
        setTimeout(syncAutoScrollState, 800);
    }

    initPricingAutoScroll();

    // ─── Mobile Menu ──────────────────────────────────────────────────────────
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.toggle('hidden');
            document.body.classList.toggle('overflow-hidden', !isHidden);
            mobileMenuBtn.setAttribute('aria-expanded', !isHidden);
            mobileMenuBtn.classList.toggle('active', !isHidden);
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768) {
                mobileMenu.classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
            }
        });

        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                mobileMenu.classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
            }
        });
    }

    // ─── Navbar & Sticky CTAs ─────────────────────────────────────────────────
    if (navbar) {
        const stickyCta = document.getElementById('sticky-cta');
        const stickyServices = document.getElementById('sticky-services-cta');

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            navbar.classList.toggle('shadow-sm', scrollY > 10);
            navbar.classList.toggle('scrolled', scrollY > 50);

            // Homepage sticky CTA
            if (stickyCta) {
                stickyCta.classList.toggle('show', scrollY > 600);
            }

            // Services page sticky CTA
            if (stickyServices) {
                stickyServices.classList.toggle('show', scrollY > 500);
            }
        }, { passive: true });
    }

    // ─── Smooth Scrolling Fix ─────────────────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ─── Portfolio Filter ─────────────────────────────────────────────────────
    function initPortfolioFilter() {
        const filterBtns = document.querySelectorAll('[data-filter]');
        const portfolioCards = document.querySelectorAll('[data-plan]');
        if (!filterBtns.length || !portfolioCards.length) return;

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');

                // Update active button styles
                filterBtns.forEach(b => {
                    b.classList.remove('bg-brand-dark', 'text-white');
                    b.classList.add('bg-gray-100', 'text-gray-700');
                });
                btn.classList.remove('bg-gray-100', 'text-gray-700');
                btn.classList.add('bg-brand-dark', 'text-white');

                // Filter cards with animation
                portfolioCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-plan') === filter) {
                        card.style.display = '';
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(10px)';
                        requestAnimationFrame(() => {
                            card.style.transition = 'opacity 0.4s, transform 0.4s';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        });
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.95)';
                        setTimeout(() => { card.style.display = 'none'; }, 300);
                    }
                });
            });
        });
    }

    // ─── Hero Browser Animation ────────────────────────────────────────────────
    function initHeroAnimation() {
        const urlElement = document.querySelector('.typing-url');
        const mockup     = document.querySelector('.browser-mockup');
        if (!urlElement || !mockup) return;

        const text = "yourbusiness.com";

        function runHeroCycle() {
            // Reset state
            urlElement.textContent = "";
            mockup.classList.remove('is-success');
            
            let i = 0;
            function type() {
                if (i < text.length) {
                    urlElement.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, 100);
                } else {
                    setTimeout(() => {
                        mockup.classList.add('is-success');
                        // Loop after a 6s pause on the finished site
                        setTimeout(runHeroCycle, 6000);
                    }, 1000);
                }
            }

            // Initial wait before typing starts
            setTimeout(type, 1000);
        }

        runHeroCycle();
    }

    // ─── WhatsApp Chat Animation ──────────────────────────────────────────────
    function initWhatsAppAnimation() {
        const bubbles      = document.querySelectorAll('.wa-bubble');
        const chatBody     = document.querySelector('.wa-chat-body'); // Add class to HTML
        const scopeOverlay = document.querySelector('.wa-scope-overlay');
        
        if (bubbles.length === 0) return;

        function runChatCycle() {
            // Reset state
            bubbles.forEach(b => b.classList.remove('is-visible'));
            if (chatBody) chatBody.classList.remove('is-blurred');
            if (scopeOverlay) scopeOverlay.classList.remove('is-visible');
            
            // Staggered human-like entry
            bubbles.forEach((bubble, index) => {
                setTimeout(() => {
                    bubble.classList.add('is-visible');
                }, (index + 1) * 1200); 
            });

            // Show Scope Confirmed at the end
            setTimeout(() => {
                if (chatBody) chatBody.classList.add('is-blurred');
                if (scopeOverlay) scopeOverlay.classList.add('is-visible');
            }, (bubbles.length + 1) * 1200);

            // Loop after a long pause (5s)
            setTimeout(runChatCycle, (bubbles.length + 1) * 1200 + 5000);
        }

        runChatCycle();
    }

    initPortfolioFilter();
    initHeroAnimation();
    initWhatsAppAnimation();
});
