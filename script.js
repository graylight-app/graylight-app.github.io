document.addEventListener('DOMContentLoaded', function () {

    const useSliderLayout = true;

    const appsData = [
        {
            icon: 'icons/qrcode.png',
            name: 'QR Code Scanner',
            description: 'QR Code Reader & Barcode Scanner. Fast! Scan, copy, open instantly.',
            link: 'https://play.google.com/store/apps/details?id=com.graylight.qrcodescanner'
        },
        {
            icon: 'icons/colorpicker.png',
            name: 'Color Picker',
            description: 'Pick, copy and use colors instantly in your projects!',
            link: 'https://play.google.com/store/apps/details?id=com.graylight.colorpicker'
        },
        {
            icon: 'icons/keyforge.png',
            name: 'Key Forge',
            description: 'Generate strong passwords & PINs. Secure, customizable, truly random keys.',
            link: 'https://play.google.com/store/apps/details?id=com.graylight.keyforge'
        },
        {
            icon: 'icons/mydevice.png',
            name: 'My Device IDs',
            description: 'Easily access all numerical data of your device, such as IP address and more.',
            link: 'https://play.google.com/store/apps/details?id=com.graylight.mydevice'
        },
        {
            icon: 'icons/unimate.png',
            name: 'Uni Mate',
            description: 'Smart and simple unit converter for everyday use.',
            link: 'https://play.google.com/store/apps/details?id=com.graylight.unimate'
        }
        ,
        {
            icon: 'icons/taxly.png',
            name: 'Taxly',
            description: 'Calculate tax, interest, and tips with a simple and clean interface.',
            link: 'https://play.google.com/store/apps/details?id=com.graylight.taxly'
        }
    ];

    const appGrid = document.getElementById('appGrid');
    const sliderWrapper = document.getElementById('sliderWrapper');

    if (useSliderLayout) {
        appGrid.style.display = 'none';
        sliderWrapper.style.display = 'block';
        initSlider();
    } else {
        appGrid.style.display = 'grid';
        sliderWrapper.style.display = 'none';
        populateGrid();
    }

    function populateGrid() {
        appGrid.innerHTML = '';
        appsData.forEach(app => {
            const card = document.createElement('div');
            card.className = 'app-card active';
            card.innerHTML = `
                        <img src="${app.icon}" alt="${app.name} Icon" class="app-icon">
                        <h3>${app.name}</h3>
                        <p>${app.description}</p>
                        <a href="${app.link}" target="_blank" rel="noopener noreferrer" class="play-store-link">Get on Google Play</a>
                    `;
            appGrid.appendChild(card);
        });
    }

    function initSlider() {
        const slider = document.getElementById('appSlider');
        const dotsContainer = document.getElementById('sliderDots');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        let currentIndex = 0;
        let autoSlideInterval;

        function populateSlider() {
            slider.innerHTML = '';
            dotsContainer.innerHTML = '';
            appsData.forEach((app, index) => {
                const card = document.createElement('div');
                card.className = 'app-card';
                card.innerHTML = `
                            <img src="${app.icon}" alt="${app.name} Icon" class="app-icon">
                            <h3>${app.name}</h3>
                            <p>${app.description}</p>
                            <a href="${app.link}" target="_blank" rel="noopener noreferrer" class="play-store-link">Get on Google Play</a>
                        `;
                slider.appendChild(card);

                const dot = document.createElement('span');
                dot.className = 'dot';
                dot.dataset.index = index.toString();
                dotsContainer.appendChild(dot);
            });
        }

        function updateSlider() {
            const cards = slider.querySelectorAll('.app-card');
            const cardWidth = cards[0].offsetWidth;
            const margin = parseInt(window.getComputedStyle(cards[0]).marginRight) * 2;
            const totalCardWidth = cardWidth + margin;

            const offset = (slider.parentElement.clientWidth / 2) - (totalCardWidth / 2);
            slider.style.left = `${offset - (currentIndex * totalCardWidth)}px`;

            cards.forEach((card, index) => {
                card.classList.remove('active');
                if (index === currentIndex) {
                    card.classList.add('active');
                }
            });

            const dots = document.querySelectorAll('.dot');
            dots.forEach(dot => dot.classList.remove('active'));
            dots[currentIndex].classList.add('active');
        }

        function showNextSlide() {
            currentIndex = (currentIndex + 1) % appsData.length;
            updateSlider();
        }

        function showPrevSlide() {
            currentIndex = (currentIndex - 1 + appsData.length) % appsData.length;
            updateSlider();
        }

        function startAutoSlide() {
            stopAutoSlide();
            autoSlideInterval = setInterval(showNextSlide, 5000); // 5 saniye
        }

        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }

        populateSlider();
        updateSlider();
        startAutoSlide();

        nextBtn.addEventListener('click', () => {
            showNextSlide();
            stopAutoSlide();
        });
        prevBtn.addEventListener('click', () => {
            showPrevSlide();
            stopAutoSlide();
        });
        dotsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('dot')) {
                currentIndex = parseInt(e.target.dataset.index);
                updateSlider();
                stopAutoSlide();
            }
        });

        window.addEventListener('resize', updateSlider);
    }

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
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
            link.addEventListener('click', () => {
                navMenu.classList.remove('show');
            });
        });
    });
});