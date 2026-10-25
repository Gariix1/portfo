/* Portada: tema claro/oscuro, año del pie y sección activa en la navegación. */
(() => {
    "use strict";
    const root = document.documentElement;
    const themeButtons = [...document.querySelectorAll(".theme-toggle")];
    const year = document.getElementById("current-year");

    const store = {
        get(key) { try { return localStorage.getItem(key); } catch (_) { return null; } },
        set(key, value) { try { localStorage.setItem(key, value); } catch (_) { /* sin almacenamiento */ } },
    };

    const getPreferredTheme = () => {
        const saved = store.get("portfolio-theme");
        if (saved === "dark" || saved === "light") return saved;
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    };

    const applyTheme = (theme) => {
        const isDark = theme === "dark";
        root.classList.toggle("dark", isDark);
        root.style.colorScheme = theme;
        themeButtons.forEach((button) => {
            button.setAttribute("aria-pressed", String(isDark));
            button.setAttribute("aria-label", isDark ? "Activar modo claro" : "Activar modo oscuro");
            const icon = button.querySelector("i");
            if (icon) icon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
        });
    };

    applyTheme(getPreferredTheme());

    themeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const next = root.classList.contains("dark") ? "light" : "dark";
            store.set("portfolio-theme", next);
            applyTheme(next);
        });
    });

    if (year) year.textContent = String(new Date().getFullYear());

    /* Sección activa: marca con aria-current el enlace de la sección que ocupa la parte alta de la pantalla. */
    const links = [...document.querySelectorAll('.desktop-nav a[href^="#"], .floating-nav a[href^="#"]')];
    const sections = ["perfil", "experiencia", "demos", "contacto"]
        .map((id) => document.getElementById(id))
        .filter(Boolean);

    if ("IntersectionObserver" in window && sections.length) {
        const setCurrent = (id) => links.forEach((a) => {
            if (a.getAttribute("href") === `#${id}`) a.setAttribute("aria-current", "true");
            else a.removeAttribute("aria-current");
        });
        const visible = new Map();
        const spy = new IntersectionObserver((entries) => {
            entries.forEach((e) => visible.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0));
            const best = [...visible.entries()].filter(([, r]) => r > 0).sort((a, b) => b[1] - a[1])[0];
            if (best) setCurrent(best[0]);
        }, { rootMargin: "-18% 0px -55% 0px", threshold: [0, 0.1, 0.3, 0.6, 1] });
        sections.forEach((section) => spy.observe(section));
    }
})();
