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
        home:      'index.html',
        services:  'services.html',
        portfolio: 'portfolio.html',
        about:     'about.html',
        contact:   'contact.html'
    };

    const pageToView = {
        'index.html':     'home',
        'services.html':  'services',
        'portfolio.html': 'portfolio',
        'about.html':     'about',
        'contact.html':   'contact',
        'privacy.html':   null,
        'tos.html':       null
    };

    // ─── Active Nav Highlight ─────────────────────────────────────────────────
    function syncActiveNav(targetId) {
        navbarNavLinks.forEach((link) => {
            const linkTarget = link.getAttribute('data-target');
            link.classList.toggle('is-active', linkTarget === targetId);
        });
    }

    // ─── View Switcher ────────────────────────────────────────────────────────
    function switchView(targetId, skipScroll = false) {
        views.forEach(view => {
            view.classList.remove('active');
            view.style.display = 'none';
        });

        const targetView = document.getElementById(`view-${targetId}`);
        if (targetView) {
            targetView.style.display = 'block';
            setTimeout(() => targetView.classList.add('active'), 10);
        }

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
            e.preventDefault();
            const target = link.getAttribute('data-target');
            if (!target) return;

            const localView = document.getElementById(`view-${target}`);
            if (localView) {
                switchView(target);
                return;
            }

            if (routes[target]) {
                syncActiveNav(target);
                if (mobileMenu) {
                    mobileMenu.classList.add('hidden');
                }
                document.body.classList.remove('overflow-hidden');
                window.location.href = routes[target];
                return;
            }

            switchView(target);
        });
    });

    // ─── Initial View Detection ───────────────────────────────────────────────
    const params        = new URLSearchParams(window.location.search);
    const requestedView = params.get('view');
    const currentPage   = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const initialView   = requestedView || pageToView[currentPage] || 'home';

    const staticPages = new Set(['contact.html', 'privacy.html', 'tos.html']);

    if (!staticPages.has(currentPage) && initialView) {
        switchView(initialView, true);
    } else if (currentPage === 'contact.html') {
        syncActiveNav('contact');
    }

    // ─── Mobile Menu FIX (ONLY CHANGE HERE) ───────────────────────────────────
    let isMenuAnimating = false;

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (isMenuAnimating) return;
            isMenuAnimating = true;

            const isHidden = mobileMenu.classList.toggle('hidden');
            document.body.classList.toggle('overflow-hidden', !isHidden);
            mobileMenuBtn.setAttribute('aria-expanded', !isHidden);
            mobileMenuBtn.classList.toggle('active', !isHidden);

            setTimeout(() => {
                isMenuAnimating = false;
            }, 200);
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

    // ─── Everything else remains exactly same ────────────────────────────────
    function initMotionEffects() { /* unchanged */ }
    initMotionEffects();

    function initCard3D() { /* unchanged */ }
    initCard3D();

    function initParallaxOrbs() { /* unchanged */ }
    initParallaxOrbs();

    function initCounterAnimation() { /* unchanged */ }
    initCounterAnimation();

    function initPricingAutoScroll() { /* unchanged */ }
    initPricingAutoScroll();

    if (navbar) {
        const stickyCta = document.getElementById('sticky-cta');
        const stickyServices = document.getElementById('sticky-services-cta');

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            navbar.classList.toggle('shadow-sm', scrollY > 10);
            navbar.classList.toggle('scrolled', scrollY > 50);

            if (stickyCta) stickyCta.classList.toggle('show', scrollY > 600);
            if (stickyServices) stickyServices.classList.toggle('show', scrollY > 500);
        }, { passive: true });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    function initPortfolioFilter() { /* unchanged */ }
    function initHeroAnimation() { /* unchanged */ }
    function initWhatsAppAnimation() { /* unchanged */ }

    initPortfolioFilter();
    initHeroAnimation();
    initWhatsAppAnimation();
});
