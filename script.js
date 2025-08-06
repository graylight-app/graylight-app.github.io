document.addEventListener('DOMContentLoaded', () => {
    const useSliderLayout = true;

    const appGrid = document.getElementById('appGrid');
    const sliderWrapper = document.getElementById('sliderWrapper');

    let appsData = [];

    fetch('apps.json')
        .then(res => res.json())
        .then(data => {
            appsData = data;
            useSliderLayout ? setupSlider() : populateGrid();
        })
        .catch(err => console.error('JSON c:', err));

    function createAppCardHTML(app) {
        return `
        <img src="${app.icon}" alt="${app.name} Icon" class="app-icon">
        <h3>${app.name}</h3>
        <p>${app.description}</p>
        <a href="${app.link}" class="google-play-link" target="_blank" rel="noopener noreferrer">
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                 alt="Get it on Google Play" class="google-play-badge">
        </a>
    `;
    }

    function populateGrid() {
        appGrid.innerHTML = '';
        sliderWrapper.style.display = 'none';
        appGrid.style.display = 'grid';

        appsData.forEach(app => {
            const card = document.createElement('div');
            card.className = 'app-card active';
            card.innerHTML = createAppCardHTML(app);
            appGrid.appendChild(card);
        });
    }

    function setupSlider() {
        const slider = document.getElementById('appSlider');
        const dotsContainer = document.getElementById('sliderDots');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        let currentIndex = 0;
        let autoSlideInterval;

        sliderWrapper.style.display = 'block';
        appGrid.style.display = 'none';

        function populateSlider() {
            slider.innerHTML = '';
            dotsContainer.innerHTML = '';

            appsData.forEach((app, index) => {
                const card = document.createElement('div');
                card.className = 'app-card';
                card.innerHTML = createAppCardHTML(app);
                slider.appendChild(card);

                const dot = document.createElement('span');
                dot.className = 'dot';
                dot.dataset.index = index.toString();
                dotsContainer.appendChild(dot);
            });
        }

        function updateSlider() {
            const cards = slider.querySelectorAll('.app-card');
            if (cards.length === 0) return;

            const cardWidth = cards[0].offsetWidth;
            const margin = parseInt(getComputedStyle(cards[0]).marginRight) * 2;
            const totalWidth = cardWidth + margin;
            const offset = (slider.parentElement.clientWidth / 2) - (totalWidth / 2);

            slider.style.left = `${offset - (currentIndex * totalWidth)}px`;

            cards.forEach((card, i) =>
                card.classList.toggle('active', i === currentIndex)
            );

            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, i) =>
                dot.classList.toggle('active', i === currentIndex)
            );
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % appsData.length;
            updateSlider();
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + appsData.length) % appsData.length;
            updateSlider();
        }

        function startAutoSlide() {
            stopAutoSlide();
            autoSlideInterval = setInterval(nextSlide, 5000);
        }

        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }

        populateSlider();
        updateSlider();
        startAutoSlide();

        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoSlide();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoSlide();
        });

        dotsContainer.addEventListener('click', e => {
            if (e.target.classList.contains('dot')) {
                currentIndex = parseInt(e.target.dataset.index);
                updateSlider();
                stopAutoSlide();
            }
        });

        window.addEventListener('resize', updateSlider);
    }

    // Responsive navbar scroll active link
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('show');
    });

    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 150) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href').includes(current));
        });
    });
});
