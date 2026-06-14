// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Navigation functionality
    const nav = document.getElementById('main-nav');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const heroSection = document.querySelector('.hero-section');
    const heroImage = document.querySelector('.hero-bg');
    const sections = document.querySelectorAll('.content-section');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navToggle && navMenu) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = nav ? nav.offsetHeight : 0;
                const targetPosition = target.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add animation to sections when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all content sections (except those opting out, e.g. the page-tall /live/ list)
    document.querySelectorAll('.content-section:not(.no-reveal)').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
    
    // Show list tabs (Kommende / Vergangene)
    const showList = document.querySelector('[data-show-list]');
    if (showList) {
        const tabButtons = showList.querySelectorAll('[data-show-tab]');
        const panels = showList.querySelectorAll('[data-show-panel]');

        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const target = this.dataset.showTab;

                tabButtons.forEach(btn => {
                    const active = btn.dataset.showTab === target;
                    btn.classList.toggle('active', active);
                    btn.setAttribute('aria-selected', active ? 'true' : 'false');
                });

                panels.forEach(panel => {
                    panel.hidden = panel.dataset.showPanel !== target;
                });
            });
        });
    }

    // All scroll-driven effects (nav reveal, parallax, active-nav highlight)
    // run in a single rAF-throttled handler: at most one pass per frame, with
    // all layout reads batched before all writes to avoid layout thrashing.
    let ticking = false;
    let navVisible = false;
    let activeId = null;

    function updateOnScroll() {
        ticking = false;
        const scrollY = window.scrollY;

        // --- reads ---
        const heroHeight = heroSection ? heroSection.offsetHeight : 0;
        let current = '';
        if (sections.length && navLinks.length) {
            sections.forEach(section => {
                const top = section.offsetTop - 100;
                if (scrollY >= top && scrollY < top + section.offsetHeight) {
                    current = section.getAttribute('id');
                }
            });
        }

        // --- writes ---
        if (nav && heroSection) {
            const shouldShow = scrollY > heroHeight / 2;
            if (shouldShow !== navVisible) {
                nav.classList.toggle('visible', shouldShow);
                navVisible = shouldShow;
            }
        }
        if (heroImage) {
            // Very subtle parallax — image drifts up at a fraction of scroll speed.
            heroImage.style.transform = `translateY(${scrollY * -0.08}px)`;
        }
        if (current !== activeId) {
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === '#' + current);
            });
            activeId = current;
        }
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(updateOnScroll);
        }
    });

    updateOnScroll(); // set initial state on load
});
