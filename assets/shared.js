/* Comportamiento de movimiento compartido (portada y demos).
 *  - .reveal            : aparece al entrar en pantalla.
 *  - [data-stagger]     : sus hijos directos se revelan en cascada.
 *  - .lift / .shine     : en pantallas táctiles, la tarjeta que ocupa el
 *                         centro de la pantalla recibe .is-active (sustituye al hover).
 */
(() => {
    "use strict";
    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const noHover = window.matchMedia("(hover: none)");
    const hasIO = "IntersectionObserver" in window;

    /* ----- Cascada: asigna --i y la clase reveal a cada hijo ----- */
    document.querySelectorAll("[data-stagger]").forEach((group) => {
        [...group.children].forEach((child, i) => {
            child.classList.add("reveal");
            if (group.dataset.stagger === "pop") child.classList.add("reveal-pop");
            child.style.setProperty("--i", String(i));
        });
    });

    /* ----- Revelado por scroll ----- */
    const reveals = [...document.querySelectorAll(".reveal")];
    if (!hasIO || reduceMotion.matches) {
        reveals.forEach((el) => el.classList.add("is-visible"));
    } else {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                io.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
        reveals.forEach((el) => io.observe(el));
    }

    /* ----- Tarjeta "activa" en táctil (sin mouse no hay hover) ----- */
    if (hasIO && !reduceMotion.matches) {
        const cards = [...document.querySelectorAll(".lift, .shine")];
        let spy = null;
        const start = () => {
            if (spy || !noHover.matches) return;
            spy = new IntersectionObserver((entries) => {
                entries.forEach((e) => e.target.classList.toggle("is-active", e.isIntersecting));
            }, { rootMargin: "-38% 0px -38% 0px", threshold: 0 });
            cards.forEach((c) => spy.observe(c));
        };
        const stop = () => {
            if (!spy) return;
            spy.disconnect();
            spy = null;
            cards.forEach((c) => c.classList.remove("is-active"));
        };
        const sync = () => (noHover.matches ? start() : stop());
        sync();
        noHover.addEventListener?.("change", sync);
    }

    /* Expone una API mínima para contenido que se renderiza después (demo móvil). */
    window.Motion = {
        observe(el) {
            if (!hasIO || reduceMotion.matches) { el.classList.add("is-visible"); return; }
            const io = new IntersectionObserver(([entry], obs) => {
                if (entry.isIntersecting) { el.classList.add("is-visible"); obs.disconnect(); }
            }, { threshold: 0.12 });
            io.observe(el);
        },
        reduced: () => reduceMotion.matches,
    };

    root.classList.add("motion-ready");
})();
