document.addEventListener('DOMContentLoaded', () => {
    let useSliderLayout = false; // Default to Grid layout for better overview
    let appsData = [];
    let currentIndex = 0;
    let autoSlideInterval;

    const appGrid = document.getElementById('appGrid');
    const sliderWrapper = document.getElementById('sliderWrapper');
    const gridBtn = document.getElementById('gridBtn');
    const sliderBtn = document.getElementById('sliderBtn');

    /* --- Fetch and Initialize --- */
    fetch('apps.json')
        .then(res => res.json())
        .then(data => {
            appsData = data;
            initializeLayout();
        })
        .catch(err => console.error('Error loading apps:', err));

    function initializeLayout() {
        if (useSliderLayout) {
            setupSlider();
        } else {
            populateGrid();
        }
        setupScrollReveal();
    }

    function createAppCardHTML(app, index) {
        return `
            <img src="${app.icon}" alt="${app.name} Icon" class="app-icon" loading="lazy">
            <h3>${app.name}</h3>
            <p>${app.description}</p>
            <a href="${app.link}" class="google-play-link" target="_blank" rel="noopener noreferrer">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                     alt="Get it on Google Play" class="google-play-badge" loading="lazy">
            </a>
        `;
    }

    function populateGrid() {
        stopAutoSlide();
        appGrid.innerHTML = '';
        sliderWrapper.style.display = 'none';
        appGrid.style.display = 'grid';

        appsData.forEach((app, idx) => {
            const card = document.createElement('div');
            card.className = 'app-card';
            card.innerHTML = createAppCardHTML(app, idx);
            // Apply delay to stagger load animation in grid
            card.style.animationDelay = `${idx * 50}ms`;
            appGrid.appendChild(card);
        });
    }

    /* --- Slider Logic --- */
    function setupSlider() {
        const slider = document.getElementById('appSlider');
        const dotsContainer = document.getElementById('sliderDots');
        currentIndex = 0;

        sliderWrapper.style.display = 'block';
        appGrid.style.display = 'none';

        // Populate Slider Cards and Dots
        slider.innerHTML = '';
        dotsContainer.innerHTML = '';

        appsData.forEach((app, index) => {
            const card = document.createElement('div');
            card.className = 'app-card';
            card.innerHTML = createAppCardHTML(app, index);
            slider.appendChild(card);

            const dot = document.createElement('span');
            dot.className = 'dot';
            dot.dataset.index = index.toString();
            dotsContainer.appendChild(dot);
        });

        updateSlider();
        startAutoSlide();
    }

    function updateSlider() {
        const slider = document.getElementById('appSlider');
        const dotsContainer = document.getElementById('sliderDots');
        const cards = slider.querySelectorAll('.app-card');
        if (cards.length === 0) return;

        const cardWidth = cards[0].offsetWidth;
        const margin = parseInt(getComputedStyle(cards[0]).marginRight) * 2;
        const totalWidth = cardWidth + margin;
        
        // Align selected card to center of slider parent
        const offset = (slider.parentElement.clientWidth / 2) - (totalWidth / 2);
        slider.style.left = `${offset - (currentIndex * totalWidth)}px`;

        cards.forEach((card, i) => {
            card.classList.toggle('active', i === currentIndex);
        });

        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    function nextSlide() {
        if (appsData.length === 0) return;
        currentIndex = (currentIndex + 1) % appsData.length;
        updateSlider();
    }

    function prevSlide() {
        if (appsData.length === 0) return;
        currentIndex = (currentIndex - 1 + appsData.length) % appsData.length;
        updateSlider();
    }

    function startAutoSlide() {
        stopAutoSlide();
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    }

    /* --- Slider Event Listeners --- */
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('sliderDots');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            startAutoSlide(); // reset timer
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            startAutoSlide(); // reset timer
        });
    }

    if (dotsContainer) {
        dotsContainer.addEventListener('click', e => {
            if (e.target.classList.contains('dot')) {
                currentIndex = parseInt(e.target.dataset.index);
                updateSlider();
                startAutoSlide(); // reset timer
            }
        });
    }

    window.addEventListener('resize', () => {
        if (useSliderLayout) {
            updateSlider();
        }
    });

    /* --- Layout Toggle Button Handlers --- */
    if (gridBtn && sliderBtn) {
        gridBtn.addEventListener('click', () => {
            if (useSliderLayout) {
                useSliderLayout = false;
                gridBtn.classList.add('active');
                sliderBtn.classList.remove('active');
                populateGrid();
            }
        });

        sliderBtn.addEventListener('click', () => {
            if (!useSliderLayout) {
                useSliderLayout = true;
                sliderBtn.classList.add('active');
                gridBtn.classList.remove('active');
                setupSlider();
            }
        });
    }

    /* --- Responsive Navbar Drawer --- */
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show');
            menuToggle.classList.toggle('open');
        });

        // Close menu when clicking link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('show');
                menuToggle.classList.remove('open');
            });
        });
    }

    /* --- Active Link Highlighting on Scroll --- */
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    /* --- Dark Mode Toggle --- */
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';

    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            let theme = 'light';
            if (document.body.classList.contains('dark-mode')) {
                theme = 'dark';
            }
            localStorage.setItem('theme', theme);
        });
    }

    /* --- Copy to Clipboard Tooltip --- */
    const emailBtn = document.getElementById('emailBtn');
    const emailTooltip = document.getElementById('emailTooltip');

    if (emailBtn && emailTooltip) {
        emailBtn.addEventListener('click', () => {
            const email = emailBtn.getAttribute('data-email');
            navigator.clipboard.writeText(email)
                .then(() => {
                    emailTooltip.textContent = 'Copied!';
                    setTimeout(() => {
                        emailTooltip.textContent = 'Copy to clipboard';
                    }, 2000);
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                });
        });
    }

    /* --- Scroll Reveal Animation --- */
    function setupScrollReveal() {
        const reveals = document.querySelectorAll('.scroll-reveal');
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Trigger once
                }
            });
        }, observerOptions);

        reveals.forEach(reveal => {
            observer.observe(reveal);
        });
    }
});
