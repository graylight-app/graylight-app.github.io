document.addEventListener('DOMContentLoaded', () => {
    let appsData = [];

    const appRail = document.getElementById('appGrid');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const railThumb = document.getElementById('railThumb');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    /* --- Fetch and Initialize --- */
    fetch('apps.json')
        .then(res => res.json())
        .catch(err => {
            // Opened from disk (file://): fetch is blocked, use the bundled copy of apps.json.
            if (Array.isArray(window.GL_APPS_FALLBACK)) return window.GL_APPS_FALLBACK;
            throw err;
        })
        .then(data => {
            appsData = data;
            populateHero();
            populateRail();
        })
        .catch(err => {
            console.error('Error loading apps:', err);
            appRail.innerHTML = '<p class="apps-error">Apps could not be loaded right now. Please try again later.</p>';
        });

    // 192px thumbnails keep the page light; fall back to the full icon if one is missing.
    function thumbSrc(icon) {
        return icon.replace(/^icons\//, 'icons/thumb/');
    }

    /* --- Hero icon wall --- */
    function populateHero() {
        const wall = document.getElementById('heroIcons');
        if (!wall) return;
        wall.innerHTML = '';
        appsData.forEach((app, idx) => {
            const link = document.createElement('a');
            link.className = 'wall-icon';
            link.href = app.link;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.setAttribute('role', 'listitem');
            link.setAttribute('aria-label', `${app.name} on Google Play`);
            link.dataset.name = app.name;
            link.style.setProperty('--i', idx);
            link.innerHTML = `<img src="${thumbSrc(app.icon)}" alt="" width="96" height="96" decoding="async" onerror="this.onerror=null;this.src='${app.icon}'">`;
            wall.appendChild(link);
        });
    }

    /* --- Apps rail (horizontal scroll, two rows on desktop) --- */
    function createAppCardHTML(app) {
        return `
            <div class="app-card-head">
                <img src="${thumbSrc(app.icon)}" alt="${app.name} icon" class="app-icon" width="64" height="64" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='${app.icon}'">
                <h3>${app.name}</h3>
            </div>
            <p>${app.description}</p>
            <a href="${app.link}" class="google-play-link" target="_blank" rel="noopener noreferrer">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                     alt="Get it on Google Play" class="google-play-badge" width="180" height="53" loading="lazy">
            </a>
        `;
    }

    function populateRail() {
        appRail.innerHTML = '';
        appsData.forEach(app => {
            const card = document.createElement('div');
            card.className = 'app-card';
            card.innerHTML = createAppCardHTML(app);
            appRail.appendChild(card);
        });
        updateRail();
    }

    let railTicking = false;
    function updateRail() {
        const max = appRail.scrollWidth - appRail.clientWidth;
        const x = appRail.scrollLeft;
        const hasOverflow = max > 2;

        if (prevBtn) prevBtn.disabled = !hasOverflow || x <= 2;
        if (nextBtn) nextBtn.disabled = !hasOverflow || x >= max - 2;

        if (railThumb) {
            const ratio = hasOverflow ? appRail.clientWidth / appRail.scrollWidth : 1;
            railThumb.style.width = `${ratio * 100}%`;
            railThumb.style.left = hasOverflow ? `${(x / max) * (100 - ratio * 100)}%` : '0';
        }

        // Soft fade only on the side that still has content.
        appRail.style.setProperty('--fade-l', hasOverflow && x > 2 ? '40px' : '0px');
        appRail.style.setProperty('--fade-r', hasOverflow && x < max - 2 ? '40px' : '0px');
        railTicking = false;
    }

    appRail.addEventListener('scroll', () => {
        if (!railTicking) {
            railTicking = true;
            requestAnimationFrame(updateRail);
        }
    }, { passive: true });

    window.addEventListener('resize', updateRail);

    function scrollRail(direction) {
        appRail.scrollBy({
            left: direction * appRail.clientWidth * 0.85,
            behavior: reduceMotion.matches ? 'auto' : 'smooth'
        });
    }

    if (prevBtn) prevBtn.addEventListener('click', () => scrollRail(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => scrollRail(1));

    /* --- Responsive Navbar Drawer --- */
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show');
            menuToggle.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', navMenu.classList.contains('show'));
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('show');
                menuToggle.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* --- Active Link Highlighting on Scroll --- */
    const sections = document.querySelectorAll('section');

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
    }, { passive: true });

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
});
