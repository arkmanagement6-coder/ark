/**
 * Revanta Growth Media - Custom Interactivity v2.0
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Sticky Header Logic ---
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else if (!window.location.pathname.includes('index.html') && window.location.pathname !== '/' && window.location.pathname !== '/RGM/') {
            // Keep scrolled on inner pages if not home
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealOnScroll.observe(el));

    // --- Hero Slider Logic (Only if on Home) ---
    const slides = document.querySelectorAll('.slide');
    if (slides.length > 0) {
        const dotsContainer = document.querySelector('.slider-dots');
        const prevBtn = document.querySelector('.prev-slide');
        const nextBtn = document.querySelector('.next-slide');
        let currentSlide = 0;
        const slideInterval = 5000;

        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.dot');

        function updateSlides() {
            slides.forEach((slide, index) => {
                slide.classList.remove('active');
                dots[index].classList.remove('active');
                if (index === currentSlide) {
                    slide.classList.add('active');
                    dots[index].classList.add('active');
                }
            });
        }

        function nextSlide() { currentSlide = (currentSlide + 1) % slides.length; updateSlides(); }
        function prevSlide() { currentSlide = (currentSlide - 1 + slides.length) % slides.length; updateSlides(); }
        function goToSlide(index) { currentSlide = index; updateSlides(); }

        let autoSlide = setInterval(nextSlide, slideInterval);

        if (nextBtn) {
            nextBtn.addEventListener('click', () => { clearInterval(autoSlide); nextSlide(); autoSlide = setInterval(nextSlide, slideInterval); });
        }
        if (prevBtn) {
            prevBtn.addEventListener('click', () => { clearInterval(autoSlide); prevSlide(); autoSlide = setInterval(nextSlide, slideInterval); });
        }
    }

    // --- Mobile Menu Toggle ---
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-btn');

    function toggleMenu() {
        navMenu.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-xmark');
        }
        document.body.classList.toggle('no-scroll');
    }

    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMenu);
    }

    // Close menu when clicking links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 992 && link.parentElement.classList.contains('dropdown')) {
                // On mobile, all menus are expanded, so just navigate
                return;
            } else if (window.innerWidth <= 992) {
                navMenu.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-xmark');
                }
                document.body.classList.remove('no-scroll');
            }
        });
    });

    // --- Dropdown Toggle for Mobile ---
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024) {
                const menu = dropdown.querySelector('.dropdown-menu');
                menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
                menu.style.opacity = '1';
                menu.style.transform = 'none';
            }
        });
    });
});
