/* Demo 1 · Formulario interactivo con validación, APIs públicas y tabla. */
(() => {
    "use strict";

    const $ = (id) => document.getElementById(id);
    const form = $("registrationForm");
    const inputs = [...form.querySelectorAll("input, select")];
    const toast = $("notification");
    const userIdInput = $("userId");
    const tableBody = $("usersTableBody");
    const modal = $("tutorialModal");
    const submitButton = $("submitButton");
    const submitText = submitButton.querySelector(".button-text");

    const MODAL_KEY = "interactiveFormTutorialShownV2";
    const COUNTRIES_KEY = "demo1-countries-v1";

    const patterns = {
        name: /^[a-zA-ZÀ-ÿ\s]{2,200}$/,
        Lastname: /^[a-zA-ZÀ-ÿ\s]{2,200}$/,
        Address: /^[a-zA-Z0-9À-ÿ\s#.,\-']{5,100}$/,
        phone: /^[0-9]{7,15}$/,
        userId: /^(?:[1-9]|10)$/,
    };
    const messages = {
        name: "El nombre debe contener solo letras y espacios (2-200 caracteres).",
        Lastname: "El apellido debe contener solo letras y espacios (2-200 caracteres).",
        Address: "La dirección debe tener entre 5 y 100 caracteres (letras, números, #, ., , -, ').",
        phone: "El teléfono debe contener solo números (7-15 dígitos).",
        userId: "Introduce un ID válido (número del 1 al 10).",
        country: "Debes seleccionar un país.",
        genero: "Debes seleccionar un género.",
    };
    const FALLBACK_COUNTRIES = [
        ["AR", "Argentina"], ["BO", "Bolivia"], ["BR", "Brasil"], ["CL", "Chile"], ["CO", "Colombia"],
        ["EC", "Ecuador"], ["ES", "España"], ["US", "Estados Unidos"], ["MX", "México"], ["PE", "Perú"],
        ["UY", "Uruguay"], ["VE", "Venezuela"],
    ];

    /* ---------- Aviso (toast) con un único temporizador ---------- */
    let toastTimer = 0;
    function notify(message, type = "info") {
        clearTimeout(toastTimer);
        toast.textContent = message;
        toast.dataset.type = type;
        toast.classList.add("show");
        toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
    }

    /* ---------- Validación ---------- */
    const groupOf = (input) => input.closest(".form-group");
    const errorOf = (input) => groupOf(input).querySelector(".error-message");

    function setState(input, message) {
        const error = errorOf(input);
        const invalid = Boolean(message);
        input.classList.toggle("input-error", invalid);
        input.classList.toggle("input-success", !invalid);
        input.setAttribute("aria-invalid", String(invalid));
        error.textContent = message || "";
        error.classList.toggle("visible", invalid);
    }

    function validate(input) {
        const value = input.value.trim();
        const label = input.labels?.[0]?.textContent || input.name;
        let message = "";
        if (input.required && !value) message = `El campo ${label} es obligatorio.`;
        else if (patterns[input.name] && !patterns[input.name].test(value)) message = messages[input.name];
        setState(input, message);
        return !message;
    }

    function clearStates() {
        inputs.forEach((input) => {
            input.classList.remove("input-success", "input-error");
            input.removeAttribute("aria-invalid");
            delete input.dataset.touched;
            const error = errorOf(input);
            error.textContent = "";
            error.classList.remove("visible");
        });
    }

    /* Se valida al salir del campo y, desde entonces, mientras se escribe.
       Así nadie ve errores antes de terminar de escribir. */
    inputs.forEach((input) => {
        input.addEventListener("blur", () => {
            if (input === userIdInput) return;           // el ID tiene su propio manejador
            if (input.value.trim() || input.dataset.touched) { input.dataset.touched = "1"; validate(input); }
        });
        input.addEventListener("input", () => { if (input.dataset.touched) validate(input); });
        input.addEventListener("change", () => { input.dataset.touched = "1"; validate(input); });
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        let ok = true;
        inputs.forEach((input) => { input.dataset.touched = "1"; if (!validate(input)) ok = false; });
        if (!ok) {
            notify("Por favor, corrige los campos marcados.", "error");
            inputs.find((i) => i.classList.contains("input-error"))?.focus();
            return;
        }
        submitButton.disabled = true;
        submitButton.classList.add("sending");
        submitText.innerHTML = '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Enviando...';
        setTimeout(() => {
            submitButton.classList.replace("sending", "success");
            submitText.innerHTML = '<i class="fa-solid fa-check btn-icon" aria-hidden="true"></i> ¡Registrado!';
            notify("¡Registro completado exitosamente!", "success");
            setTimeout(() => {
                submitText.textContent = "Registrar";
                submitButton.disabled = false;
                submitButton.classList.remove("success");
                form.reset();
                clearStates();
            }, 1800);
        }, 1300);
    });

    /* ---------- Países (RestCountries) con caché y lista de respaldo ---------- */
    async function loadCountries() {
        const select = $("country");
        let list = null;
        try { list = JSON.parse(sessionStorage.getItem(COUNTRIES_KEY) || "null"); } catch (_) { /* sin caché */ }
        if (!list) {
            try {
                const response = await fetch("https://restcountries.com/v3.1/all?fields=name,translations,cca2");
                if (!response.ok) throw new Error(response.statusText);
                const data = await response.json();
                list = data
                    .map((c) => [c.cca2, c.translations?.spa?.common || c.name.common])
                    .sort((a, b) => a[1].localeCompare(b[1], "es", { sensitivity: "base" }));
                try { sessionStorage.setItem(COUNTRIES_KEY, JSON.stringify(list)); } catch (_) { /* cuota */ }
            } catch (error) {
                console.warn("RestCountries no disponible, usando lista de respaldo.", error);
                list = FALLBACK_COUNTRIES;
            }
        }
        const fragment = document.createDocumentFragment();
        list.forEach(([code, name]) => {
            const option = document.createElement("option");
            option.value = code;
            option.textContent = name;
            fragment.appendChild(option);
        });
        select.appendChild(fragment);
    }

    /* ---------- Usuarios (JSONPlaceholder) ---------- */
    function fillForm(user, message) {
        // JSONPlaceholder trae tratamientos como "Mrs. Dennis Schulist"; el punto no pasa la validación del nombre.
        const fullName = String(user.name).replace(/^(?:mr|mrs|ms|miss|dr|prof)\.?\s+/i, "");
        const [first, ...rest] = fullName.split(" ");
        $("name").value = first || "";
        $("Lastname").value = rest.join(" ") || user.username || "";
        const a = user.address || {};
        $("Address").value = [a.street, a.suite, a.city].filter(Boolean).join(", ");
        $("phone").value = (user.phone ? user.phone.split(" ")[0].replace(/\D/g, "") : "").slice(0, 10);
        userIdInput.value = user.id;
        $("genero").value = "otro";
        inputs.forEach((input) => { input.dataset.touched = "1"; validate(input); });
        notify(message, "success");
    }

    async function fetchUser(id) {
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
            if (!response.ok) {
                notify(response.status === 404 ? "Usuario no encontrado." : "Error al cargar los datos del usuario.", "error");
                return;
            }
            const user = await response.json();
            fillForm(user, `Datos del usuario ID ${user.id} cargados.`);
        } catch (error) {
            console.warn("Error al consultar el usuario", error);
            notify("No se pudo conectar con la API de usuarios.", "error");
        }
    }

    userIdInput.addEventListener("blur", () => {
        const id = userIdInput.value.trim();
        userIdInput.dataset.touched = "1";
        if (!id) { if (userIdInput.required) validate(userIdInput); return; }
        if (validate(userIdInput)) fetchUser(id);
    });

    let activeRow = null;
    function selectRow(row, user) {
        activeRow?.classList.remove("active-row");
        row.classList.add("active-row");
        activeRow = row;
        fillForm(user, `Datos de ${user.name} cargados desde la tabla.`);
        if (window.matchMedia("(max-width: 1023px)").matches) form.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    async function loadUsers(count = 10) {
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/users?_limit=${count}`);
            if (!response.ok) throw new Error(response.statusText);
            const users = await response.json();
            tableBody.replaceChildren();
            users.forEach((user, index) => {
                const row = document.createElement("tr");
                row.tabIndex = 0;
                row.style.setProperty("--i", String(index));
                [user.id, user.name, user.email].forEach((value) => {
                    const cell = document.createElement("td");
                    cell.className = "p-3 border border-gray-300 text-sm";
                    cell.textContent = value;            // textContent: nunca interpreta HTML de terceros
                    row.appendChild(cell);
                });
                row.addEventListener("click", () => selectRow(row, user));
                row.addEventListener("keydown", (e) => {
                    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectRow(row, user); }
                });
                tableBody.appendChild(row);
            });
        } catch (error) {
            console.warn("Error al cargar la tabla de usuarios", error);
            const row = tableBody.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 3;
            cell.className = "p-3 text-center text-red-700";
            cell.textContent = "No se pudieron cargar los usuarios.";
        }
    }

    /* ---------- Ayudas (?) : toque, clic y teclado ---------- */
    const helpButtons = [...document.querySelectorAll(".help-icon")];
    function closeTips(except) {
        helpButtons.forEach((button) => {
            if (button === except) return;
            button.setAttribute("aria-expanded", "false");
            $(button.getAttribute("aria-controls")).classList.remove("show-tooltip");
        });
    }
    helpButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            event.stopPropagation();
            const tip = $(button.getAttribute("aria-controls"));
            const open = !tip.classList.contains("show-tooltip");
            closeTips(button);
            tip.classList.toggle("show-tooltip", open);
            button.setAttribute("aria-expanded", String(open));
        });
    });
    document.addEventListener("click", () => closeTips());
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeTips(); });

    /* ---------- Modal de bienvenida ---------- */
    function openModal() {
        let seen = false;
        try { seen = Boolean(localStorage.getItem(MODAL_KEY)); } catch (_) { /* sin almacenamiento */ }
        if (seen) return;
        modal.hidden = false;
        $("startTutorial").focus({ preventScroll: true });
    }
    function closeModal() {
        if (modal.hidden || modal.classList.contains("is-closing")) return;
        modal.classList.add("is-closing");
        setTimeout(() => { modal.hidden = true; modal.classList.remove("is-closing"); }, 220);
        try { localStorage.setItem(MODAL_KEY, "1"); } catch (_) { /* sin almacenamiento */ }
    }
    modal.querySelector(".close-button").addEventListener("click", closeModal);
    $("startTutorial").addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

    loadCountries();
    loadUsers();
    openModal();
})();
