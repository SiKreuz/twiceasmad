// Keep the show list current between deploys.
//
// Hugo splits data/shows.yaml into "Kommende" / "Vergangene" against the *build*
// time, so left alone the split freezes at the last deploy and shows that have
// already happened keep sitting in the upcoming list. Redo it here against the
// visitor's clock: every card carries `data-show-at`, an absolute timestamp with a
// Europe/Berlin offset, so the comparison is timezone-proof.
//
// Runs immediately — this script sits at the end of <body>, so the list is already
// parsed and there is no flash of an outdated list. Without JS the build-time split
// still renders, just as stale as it was before.
(function syncShowDates() {
    const now = Date.now();
    const isOver = iso => {
        const at = Date.parse(iso || '');
        return !isNaN(at) && at <= now;
    };

    // Structured data: stop advertising MusicEvents that are already over.
    document.querySelectorAll('script[type="application/ld+json"][data-event-at]').forEach(script => {
        if (isOver(script.dataset.eventAt)) script.remove();
    });

    const list = document.querySelector('[data-show-list]');
    const upcomingPanel = list && list.querySelector('[data-show-panel="upcoming"]');
    if (!upcomingPanel) return;

    const pastPanel = list.querySelector('[data-show-panel="past"]');
    const cards = Array.from(upcomingPanel.querySelectorAll('.show-card'));
    const expired = cards.filter(card => isOver(card.dataset.showAt));
    const upcoming = cards.filter(card => !isOver(card.dataset.showAt));

    expired.forEach(card => {
        // The teaser has no archive to move into — those cards just go away.
        if (!pastPanel) {
            card.remove();
            return;
        }
        card.classList.add('is-past');
        const fallback = card.querySelector('.show-location[data-past-text]');
        if (fallback) fallback.textContent = fallback.dataset.pastText;
        card.querySelectorAll('.show-ticket > *').forEach(el => {
            el.hidden = !el.hasAttribute('data-past-badge');
        });
        // `expired` runs oldest-first and the archive is sorted newest-first, so
        // prepending one by one lands them all in the right place.
        pastPanel.insertBefore(card, pastPanel.firstChild);
    });

    // Homepage teaser: re-pick the visible subset now that cards have dropped out.
    // Every upcoming show is in the DOM, so the next one can move up. The full list
    // sets no cap, which leaves all of them visible.
    const cap = parseInt(list.dataset.teaserCount, 10) || Infinity;
    let visible = 0;
    upcoming.forEach((card, i) => {
        card.hidden = i >= cap && !card.hasAttribute('data-show-highlight');
        if (!card.hidden) visible++;
    });

    const empty = upcomingPanel.querySelector('.show-empty');
    if (empty) empty.hidden = visible > 0;

    const pastTab = list.querySelector('[data-show-tab="past"]');
    if (pastTab && pastPanel) pastTab.hidden = !pastPanel.querySelector('.show-card');

    const teaserMore = list.querySelector('[data-teaser-more]');
    if (teaserMore) {
        teaserMore.querySelector('[data-count="upcoming"]').textContent = upcoming.length;
        teaserMore.querySelector('[data-count="past"]').textContent =
            (parseInt(teaserMore.dataset.pastCount, 10) || 0) + expired.length;
        teaserMore.querySelector('[data-note-more]').hidden = upcoming.length <= visible;
    }
})();

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
