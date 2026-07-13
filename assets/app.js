(() => {
    const root = document.documentElement;
    const themeButtons = [...document.querySelectorAll('.theme-toggle')];
    const menuButton = document.querySelector('.menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const year = document.getElementById('current-year');

    const getPreferredTheme = () => {
        const savedTheme = localStorage.getItem('portfolio-theme');
        if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const applyTheme = (theme) => {
        const isDark = theme === 'dark';
        root.classList.toggle('dark', isDark);
        root.style.colorScheme = theme;

        themeButtons.forEach((button) => {
            button.setAttribute('aria-pressed', String(isDark));
            button.setAttribute('aria-label', isDark ? 'Activar modo claro' : 'Activar modo oscuro');
            const icon = button.querySelector('i');
            if (icon) icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        });
    };

    const closeMobileMenu = () => {
        if (!menuButton || !mobileMenu) return;
        mobileMenu.hidden = true;
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Abrir menú');
        const icon = menuButton.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
    };

    applyTheme(getPreferredTheme());

    themeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const nextTheme = root.classList.contains('dark') ? 'light' : 'dark';
            localStorage.setItem('portfolio-theme', nextTheme);
            applyTheme(nextTheme);
        });
    });

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', () => {
            const willOpen = mobileMenu.hidden;
            mobileMenu.hidden = !willOpen;
            menuButton.setAttribute('aria-expanded', String(willOpen));
            menuButton.setAttribute('aria-label', willOpen ? 'Cerrar menú' : 'Abrir menú');
            const icon = menuButton.querySelector('i');
            if (icon) icon.className = willOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
        });

        mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMobileMenu));
        window.addEventListener('resize', () => {
            if (window.innerWidth > 700) closeMobileMenu();
        });
    }

    if (year) year.textContent = String(new Date().getFullYear());
})();
