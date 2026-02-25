// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Navigation functionality
    const nav = document.getElementById('main-nav');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Show navigation after scrolling past hero section
    let heroHeight = document.querySelector('.hero-section').offsetHeight;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > heroHeight / 2) {
            nav.classList.add('visible');
        } else {
            nav.classList.remove('visible');
        }
    });
    
    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = nav.offsetHeight;
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
    
    // Observe all content sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
    
    // Parallax effect for hero image (optional)
    const heroImage = document.querySelector('.hero-bg');
    if (heroImage) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroImage.style.transform = `translateY(${rate}px)`;
        });
    }
});

// Add active class to navigation links based on scroll position
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('.content-section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// ============================================================
// Consent-gated embed loader  – DSGVO two-click solution
// Called by the inline onclick on each consent overlay button.
// No cookies, no localStorage: consent is per page-load only,
// which is the conservative, legally safe approach.
// ============================================================
function consentAndLoad(wrapper) {
    var provider = wrapper.dataset.provider;

    if (provider === 'youtube') {
        var iframe = document.createElement('iframe');
        iframe.src      = wrapper.dataset.src;
        iframe.width    = '100%';
        iframe.height   = '450';
        iframe.title    = wrapper.dataset.title || 'YouTube Video';
        iframe.frameBorder   = '0';
        iframe.allow         = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.referrerPolicy = 'strict-origin-when-cross-origin';
        iframe.allowFullscreen = true;
        wrapper.innerHTML = '';
        wrapper.appendChild(iframe);

    } else if (provider === 'spotify') {
        var iframe = document.createElement('iframe');
        iframe.src    = wrapper.dataset.src;
        iframe.width  = '100%';
        iframe.height = '500';
        iframe.style.borderRadius = '12px';
        iframe.frameBorder = '0';
        iframe.allow  = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
        iframe.loading = 'lazy';
        wrapper.innerHTML = '';
        wrapper.appendChild(iframe);

    } else if (provider === 'bandsintown') {
        var overlay = wrapper.querySelector('.consent-overlay');
        var widget  = wrapper.querySelector('.bandsintown-widget');
        if (overlay) overlay.style.display = 'none';
        if (widget)  widget.style.removeProperty('display');
        // Inject the Bandsintown script only once
        if (!document.querySelector('script[src*="bandsintown"]')) {
            var script = document.createElement('script');
            script.charset = 'utf-8';
            script.src = 'https://widgetv3.bandsintown.com/main.min.js';
            document.head.appendChild(script);
        }
    }
}
