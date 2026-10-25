"use strict";
// APP MODULE
const App = (() => {
    // Colores de marca (antes se leían de tailwind.config en el navegador)
    const COLORS = { primaryLight: '#3b82f6', primaryDark: '#8b5cf6' };
    const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    // STATE 
    let currentTabId = null;
    let isDarkMode = false;
    let posts = [];
    let notifications = [ 
        { id: Date.now() + 1, icon: 'fas fa-newspaper', title: 'El Futuro de la IA Cuántica', time: 'hace 5 min', read: false, description: 'Una mirada profunda...' },
        { id: Date.now() + 2, icon: 'fas fa-comments', title: 'Comentario en tu post', time: 'hace 2 horas', read: false, description: '@usuarioX comentó...' },
        { id: Date.now() + 3, icon: 'fas fa-code-branch', title: 'Actualización del sistema', time: 'ayer', read: true, description: 'FluentApp v9.0 lanzada.' },
    ];
    const availablePostIcons = ['fas fa-lightbulb', 'fas fa-code', 'fas fa-brain', 'fas fa-rocket', 'fas fa-cogs', 'fas fa-chart-line', 'fas fa-atom', 'fas fa-microchip'];
    let selectedPostIcon = availablePostIcons[0];
    const availableProfileIcons = ['fas fa-user', 'fas fa-user-astronaut', 'fas fa-user-ninja', 'fas fa-user-secret', 'fas fa-user-tie', 'fas fa-cat', 'fas fa-dog', 'fas fa-dragon', 'fas fa-ghost', 'fas fa-robot', 'fas fa-hippo', 'fas fa-otter', 'fas fa-brain', 'fas fa-meteor', 'fas fa-satellite-dish'];
    let userProfile = {
        name: 'Alex Innova',
        role: 'Explorador Digital',
        bio: 'Apasionado por la tecnología, IA y el futuro digital. Siempre aprendiendo y explorando nuevas ideas.',
        icon: 'fas fa-user-astronaut'
    };
    const exploreRecommendations = [ 
        { id: 'rec1', title: 'Desarrollo Web Moderno', type: 'Playlist de Artículos', icon: 'fas fa-code', color: 'bg-gradient-to-br from-blue-500 to-cyan-500' },
        { id: 'rec2', title: 'Avances en IA', type: 'Colección', icon: 'fas fa-brain', color: 'bg-gradient-to-br from-violet-500 to-fuchsia-500' },
        { id: 'rec3', title: 'Diseño UX Inspirador', type: 'Recursos', icon: 'fas fa-pen-ruler', color: 'bg-gradient-to-br from-pink-500 to-orange-400' },
    ];
    
    const tutorials = [
        {
            id: 'tutorial-modo-oscuro',
            title: 'Modo Oscuro',
            cardDescription: 'Perfil > Config. General > Interruptor "Modo Oscuro".',
            modalTitle: 'Explorando el Modo Oscuro',
            icon: 'fas fa-moon',
            keywords: ['Perfil', 'Modo Oscuro (toggle)', 'Cambio Instantáneo', 'Visualmente Cómodo', 'Guardado Automático'],
            modalDescription: 'Activa el modo oscuro para una experiencia visual diferente. Encuéntralo en tu Perfil, sección Configuración General.',
            colorTheme: {
                bgLight: 'bg-indigo-100', iconLight: 'text-indigo-500',
                bgDark: 'bg-indigo-700/40', iconDark: 'text-indigo-400',
                keywordBgLight: 'bg-indigo-500/10', keywordTextLight: 'text-indigo-600',
                keywordBgDark: 'bg-indigo-600/30', keywordTextDark: 'text-indigo-300',
            }
        },
        {
            id: 'tutorial-crear-posts',
            title: 'Crear Posts',
            cardDescription: 'Inicio > Acciones Rápidas > Botón "Nuevo Post".',
            modalTitle: 'Publicando tu Primer Post',
            icon: 'fas fa-plus-circle',
            keywords: ['Inicio', 'Botón +', 'Modal Interactivo', 'Título', 'Icono', 'Contenido', 'Categoría', 'Publicar', 'Feedback Toast', 'Visible en Feed'],
            modalDescription: 'Desde la pestaña Inicio, busca "Acciones Rápidas" (justo debajo de estas guías) y usa el botón "Nuevo Post" para abrir el modal, completa los campos y comparte.',
            colorTheme: {
                bgLight: 'bg-emerald-100', iconLight: 'text-emerald-500',
                bgDark: 'bg-emerald-700/40', iconDark: 'text-emerald-400',
                keywordBgLight: 'bg-emerald-500/10', keywordTextLight: 'text-emerald-600',
                keywordBgDark: 'bg-emerald-600/30', keywordTextDark: 'text-emerald-300',
            }
        },
        {
            id: 'tutorial-navegacion',
            title: 'Navegación',
            cardDescription: 'Escritorio: Barra lateral. Móvil: Barra inferior.',
            modalTitle: 'Descubriendo la Navegación Adaptable',
            icon: 'fas fa-mobile-alt',
            keywords: ['Escritorio: Barra Lateral', 'Móvil: Barra Inferior', 'Transición Automática', 'Iconos Claros', 'Acceso Rápido'],
            modalDescription: 'La interfaz se ajusta automáticamente: barra lateral en pantallas grandes y una barra inferior compacta en móviles para fácil acceso a las pestañas.',
            colorTheme: {
                bgLight: 'bg-sky-100', iconLight: 'text-sky-500',
                bgDark: 'bg-sky-700/40', iconDark: 'text-sky-400',
                keywordBgLight: 'bg-sky-500/10', keywordTextLight: 'text-sky-600',
                keywordBgDark: 'bg-sky-600/30', keywordTextDark: 'text-sky-300',
            }
        },
        {
            id: 'tutorial-alertas',
            title: 'Alertas',
            cardDescription: 'Navegación > Pestaña "Alertas" (icono campana).',
            modalTitle: 'Gestionando tus Alertas',
            icon: 'fas fa-bell',
            keywords: ['Pestaña Alertas', 'Lista Clara', 'Leídas/No Leídas', 'Badge Contador', 'Marcar Leídas', 'Notificaciones de Acciones'],
            modalDescription: 'Revisa tus notificaciones en la pestaña "Alertas" (el icono de campana en la navegación). Mantente al día con las interacciones.',
             colorTheme: {
                bgLight: 'bg-rose-100', iconLight: 'text-rose-500',
                bgDark: 'bg-rose-700/40', iconDark: 'text-rose-400',
                keywordBgLight: 'bg-rose-500/10', keywordTextLight: 'text-rose-600',
                keywordBgDark: 'bg-rose-600/30', keywordTextDark: 'text-rose-300',
            }
        },
        {
            id: 'tutorial-perfil',
            title: 'Tu Perfil',
            cardDescription: 'Perfil > "Editar Perfil" o clic en tu foto/icono.',
            modalTitle: 'Configurando tu Espacio Personal',
            icon: 'fas fa-user-edit',
            keywords: ['Pestaña Perfil', 'Ver Info', 'Cambiar Icono', 'Editar Perfil (modal)', 'Nombre', 'Rol', 'Biografía', 'Guardar Cambios'],
            modalDescription: 'Haz tuyo el espacio. Actualiza tu nombre, rol, biografía y elige un ícono que te represente desde la pestaña "Perfil", usando el botón "Editar Perfil" o haciendo clic en tu foto.',
            colorTheme: {
                bgLight: 'bg-amber-100', iconLight: 'text-amber-500',
                bgDark: 'bg-amber-700/40', iconDark: 'text-amber-400',
                keywordBgLight: 'bg-amber-500/10', keywordTextLight: 'text-amber-600',
                keywordBgDark: 'bg-amber-600/30', keywordTextDark: 'text-amber-300',
            }
        }
    ];


    const DOM = { 
        html: document.documentElement,
        mainContentArea: document.getElementById('main-content-area'),
        headerSubtitle: document.getElementById('headerSubtitle'),
        mobileNavContainer: document.getElementById('mobile-navbar').querySelector('div'),
        desktopNavContainer: document.getElementById('desktop-sidebar').querySelector('nav'),
        tabContents: document.querySelectorAll('.tab-content'),
        darkModeSwitch: document.getElementById('darkModeSwitch'),
        genericToggles: document.querySelectorAll('.toggle-switch:not(#darkModeSwitch)'),
        newPostModal: document.getElementById('modal-new-post'),
        createNewPostBtn: document.getElementById('create-new-post-btn'),
        newPostForm: document.getElementById('new-post-form'),
        publishPostBtn: document.getElementById('publish-post-btn'),
        postIconSelector: document.getElementById('post-icon-selector'),
        notificationsList: document.getElementById('notifications-list'),
        markAllReadBtn: document.getElementById('mark-all-read-btn'),
        postsFeedContainer: document.getElementById('posts-feed-container'),
        emptyFeedMessage: document.getElementById('empty-feed-message'),
        searchInput: document.getElementById('search-input'),
        searchSuggestionsContainer: document.getElementById('search-suggestions'),
        exploreDefaultContent: document.getElementById('explore-default-content'),
        exploreRecommendationsGrid: document.getElementById('explore-recommendations-grid'),
        searchResultsContainer: document.getElementById('search-results-container'),
        toastContainer: document.getElementById('toast-container'),
        exploreSearchContainer: document.getElementById('explore-search-container'), 
        profilePictureDisplay: document.getElementById('profile-picture-display'),
        profileNameText: document.getElementById('profile-name-text'),
        profileRoleText: document.getElementById('profile-role-text'),
        profileBioDisplay: document.getElementById('profile-bio-display'), 
        modalProfilePicture: document.getElementById('modal-profile-picture'),
        profileIconSelectorContainer: document.getElementById('profile-icon-selector'),
        editProfileMainBtn: document.getElementById('edit-profile-main-btn'),
        modalEditProfile: document.getElementById('modal-edit-profile'),
        editProfileForm: document.getElementById('edit-profile-form'),
        saveProfileBtn: document.getElementById('save-profile-btn'),
        accountSecurityStatus: document.getElementById('account-security-status'),
        tutorialCardsGrid: document.getElementById('tutorial-cards-grid'),
        modalTutorial: document.getElementById('modal-tutorial'),
        tutorialModalTitle: document.getElementById('tutorial-modal-title'),
        tutorialModalIconContainer: document.getElementById('tutorial-modal-icon-container'),
        tutorialModalKeywordsContainer: document.getElementById('tutorial-modal-keywords-container'),
        tutorialModalDescription: document.getElementById('tutorial-modal-description'),
    };

    const NAV_ITEMS = [ 
        { id: 'inicio', icon: 'fas fa-home', text: 'Inicio', subtitle: 'Panel Principal' },
        { id: 'explorar', icon: 'fas fa-compass', text: 'Explorar', subtitle: 'Descubre Novedades' },
        { id: 'alertas', icon: 'fas fa-bell', text: 'Alertas', subtitle: 'Tus Notificaciones', isNotificationTab: true },
        { id: 'perfil', icon: 'fas fa-user-circle', text: 'Perfil', subtitle: 'Tu Espacio Personal' }
    ];
    
    const UI = { 
        toggleClass: (el, className, force) => el && el.classList.toggle(className, force),
        addClass: (el, ...classNames) => el && el.classList.add(...classNames),
        removeClass: (el, ...classNames) => el && el.classList.remove(...classNames),
        setText: (el, text) => { if (el) el.textContent = text; },
        setHTML: (el, html) => { if (el) el.innerHTML = html; },
        getValue: (el) => el ? el.value : '',
        setValue: (el, value) => { if (el) el.value = value; },
        show: (el) => UI.removeClass(el, 'hidden'),
        hide: (el) => UI.addClass(el, 'hidden'),
        isVisible: (el) => el && !el.classList.contains('hidden'),
        createIconSelector: (container, icons, currentSelectedIcon, onSelectCallback, itemClass = 'icon-selector-btn') => { 
            if (!container) return;
            container.replaceChildren();
            icons.forEach(iconClass => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = `${itemClass} flex items-center justify-center rounded-md p-2 bg-slate-100 dark:bg-slate-700 hover:opacity-80`;
                UI.setHTML(btn, `<i class="${iconClass} text-lg ${isDarkMode ? 'text-text-dark-secondary' : 'text-text-light-secondary'}"></i>`);
                if (iconClass === currentSelectedIcon) {
                    UI.addClass(btn, 'selected');
                    const primaryColor = isDarkMode ? COLORS.primaryDark : COLORS.primaryLight;
                    btn.style.setProperty('--primary-color', primaryColor);
                    btn.style.setProperty('--primary-color-alpha', primaryColor + '33'); 
                    btn.querySelector('i').classList.remove(isDarkMode ? 'text-text-dark-secondary' : 'text-text-light-secondary');
                    btn.querySelector('i').classList.add(isDarkMode ? 'text-primary-dark' : 'text-primary-light');
                    btn.setAttribute('aria-pressed', 'true');
                }
                btn.setAttribute('aria-label', iconClass.replace('fas fa-', '').replace(/-/g, ' '));
                btn.addEventListener('click', () => onSelectCallback(iconClass));
                container.appendChild(btn);
            });
        },
        showToast: (message, type = 'success', visibleDuration = 2200) => {
            const isMobile = window.innerWidth < 768;
            const kinds = {
                success: ['fas fa-check-circle', 'bg-success-light dark:bg-success-dark'],
                error:   ['fas fa-times-circle', 'bg-danger-light dark:bg-danger-dark'],
                info:    ['fas fa-info-circle', 'bg-info-light dark:bg-info-dark'],
                warning: ['fas fa-exclamation-triangle', 'bg-warning-light dark:bg-warning-dark'],
            };
            const [icon, bg] = kinds[type] || [null, 'bg-gray-700 dark:bg-gray-600'];

            const toast = document.createElement('div');
            toast.className = `toast-notification ${bg} ${isMobile ? 'mobile' : 'desktop'}`;
            if (icon) {
                const i = document.createElement('i');
                i.className = `${icon} toast-icon`;
                i.setAttribute('aria-hidden', 'true');
                toast.appendChild(i);
            }
            const text = document.createElement('span');
            text.textContent = message;
            toast.appendChild(text);
            DOM.toastContainer.appendChild(toast);

            const remove = () => toast.remove();
            setTimeout(() => {
                toast.classList.add('is-leaving');
                toast.addEventListener('animationend', remove, { once: true });
                setTimeout(remove, 700);          // respaldo si no hay animación (movimiento reducido)
            }, visibleDuration);
        }
    };

    const ModalManager = {
        lastFocus: null,
        open: (modalElement) => {
            if (!modalElement) return;
            ModalManager.lastFocus = document.activeElement;
            UI.removeClass(modalElement, 'hidden', 'is-closing');
            DOM.html.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
            const focusable = modalElement.querySelector('input, textarea, select, button:not(.close-modal-btn), .close-modal-btn');
            if (focusable) focusable.focus({ preventScroll: true });
        },
        close: (modalElement) => {
            if (!modalElement || !UI.isVisible(modalElement) || modalElement.classList.contains('is-closing')) return;
            UI.addClass(modalElement, 'is-closing');
            setTimeout(() => {
                UI.addClass(modalElement, 'hidden');
                UI.removeClass(modalElement, 'is-closing');
                if (!document.querySelector('.modal-overlay:not(.hidden)')) {
                    DOM.html.style.overflow = '';
                    document.body.style.overflow = '';
                    if (ModalManager.lastFocus && document.contains(ModalManager.lastFocus)) ModalManager.lastFocus.focus({ preventScroll: true });
                }
            }, 250);
        },
        init: () => {
            document.querySelectorAll('.close-modal-btn').forEach(btn => btn.addEventListener('click', () => ModalManager.close(btn.closest('.modal-overlay'))));
            document.querySelectorAll('.modal-overlay').forEach(overlay => overlay.addEventListener('click', (e) => { if (e.target === overlay) ModalManager.close(overlay); }));
            document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { const openModalEl = document.querySelector('.modal-overlay:not(.hidden)'); if (openModalEl) ModalManager.close(openModalEl); } });
        }
    };

    const DarkMode = {
        toggle: (isDarkActive) => {
            isDarkMode = isDarkActive; 
            UI.toggleClass(DOM.html, 'dark', isDarkMode);
            const dmSwitch = DOM.darkModeSwitch;
            UI.toggleClass(dmSwitch, 'bg-primary-dark', isDarkMode);
            UI.toggleClass(dmSwitch, 'bg-gray-300', !isDarkMode); 
            UI.toggleClass(dmSwitch, 'dark:bg-gray-700', !isDarkMode); 
            dmSwitch.querySelector('.toggle-dot').style.transform = isDarkMode ? 'translateX(20px)' : 'translateX(0)';
            dmSwitch.dataset.active = isDarkMode.toString();
            dmSwitch.setAttribute('aria-checked', String(isDarkMode));
            
            localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
            GenericToggles.updateAllVisuals();
            Navigation.updateActiveStyles(currentTabId);
            NotificationHandler.updateBadges();
            if (UI.isVisible(DOM.newPostModal) && DOM.postIconSelector) {
                UI.createIconSelector(DOM.postIconSelector, availablePostIcons, selectedPostIcon, PostHandler.onPostIconSelect);
            }
            if (UI.isVisible(DOM.modalProfilePicture) && DOM.profileIconSelectorContainer) {
                 UI.createIconSelector(DOM.profileIconSelectorContainer, availableProfileIcons, userProfile.icon, ProfileHandler.onProfileIconSelectCallback, 'icon-selector-btn p-3 text-2xl');
            }
            
            ExploreHandler.renderRecommendations(); 
            ProfileHandler.render(); 
            TutorialHandler.renderCards();
        },
        init: () => {
            DOM.darkModeSwitch.addEventListener('click', () => DarkMode.toggle(!isDarkMode));
            const savedMode = localStorage.getItem('darkMode');
            DarkMode.toggle(savedMode === 'enabled');
        }
    };
    
    const GenericToggles = { 
        updateVisual: (button, isActive) => {
            const dot = button.querySelector('.toggle-dot');
            const activeBg = isDarkMode ? 'bg-toggle-active-dark' : 'bg-toggle-active-light';
            const inactiveBgLight = 'bg-gray-300';
            const inactiveBgDark = 'dark:bg-gray-700';

            button.classList.remove('bg-toggle-active-light', 'bg-toggle-active-dark', inactiveBgLight, inactiveBgDark);
            
            if (isActive) {
                dot.style.transform = 'translateX(20px)';
                UI.addClass(button, activeBg);
            } else {
                dot.style.transform = 'translateX(0)';
                UI.addClass(button, isDarkMode ? inactiveBgDark : inactiveBgLight);
            }
            button.dataset.active = isActive.toString();

            if (button.dataset.setting === 'accountSecurity' && DOM.accountSecurityStatus) {
                if (isActive) {
                    UI.setText(DOM.accountSecurityStatus, '2FA Activado. Tu cuenta está más protegida.');
                    UI.removeClass(DOM.accountSecurityStatus, 'text-danger-light', 'dark:text-danger-dark', 'hidden');
                    UI.addClass(DOM.accountSecurityStatus, 'text-success-light', 'dark:text-success-dark');
                } else {
                    UI.setText(DOM.accountSecurityStatus, '2FA Desactivado. Considera activarlo.');
                    UI.removeClass(DOM.accountSecurityStatus, 'text-success-light', 'dark:text-success-dark', 'hidden');
                    UI.addClass(DOM.accountSecurityStatus, 'text-danger-light', 'dark:text-danger-dark');
                }
            }
        },
        updateAllVisuals: () => DOM.genericToggles.forEach(btn => GenericToggles.updateVisual(btn, btn.dataset.active === "true")),
        init: () => { 
            DOM.genericToggles.forEach(button => {
                GenericToggles.updateVisual(button, button.dataset.active === "true"); 
                button.addEventListener('click', () => GenericToggles.updateVisual(button, !(button.dataset.active === "true")));
            });
        }
    };

    const Navigation = {
        renderItems: () => {
            UI.setHTML(DOM.mobileNavContainer, '');
            UI.setHTML(DOM.desktopNavContainer, '');
            const unreadNotifs = NotificationHandler.getUnreadCount();

            NAV_ITEMS.forEach(item => {
                const isNotifTab = item.isNotificationTab;
                const badgeCount = isNotifTab ? unreadNotifs : 0;
                
                const createButtonHTML = (icon, text, type) => {
                    const badgeVisibleClass = badgeCount > 0 ? 'visible' : '';
                    const badgeTopRightMobile = isNotifTab ? '!top-[-6px] !right-[-8px]' : '';
                    const badgeTopRightDesktop = isNotifTab ? '!top-1 !right-1 lg:!top-1.5 lg:!right-1.5' : '';
                    const badgeSurfaceVar = type === 'mobile' ? '--mobile-nav-bg' : '--desktop-nav-bg';

                    return `
                        <div class="relative">
                            <i class="${icon} ${type === 'mobile' ? 'h-5 w-5' : 'text-lg lg:text-xl w-6 text-center'} nav-icon"></i>
                            ${isNotifTab ? `<span class="notification-badge ${badgeVisibleClass} ${type === 'mobile' ? badgeTopRightMobile : badgeTopRightDesktop}" style="--surface-color: var(${badgeSurfaceVar}, white);">${badgeCount || ''}</span>` : ''}
                        </div>
                        <span class="text-xs mt-1 ${type === 'desktop' ? 'ml-3 hidden lg:block text-sm' : ''}">${text}</span>`;
                };
                
                const createButton = (html, type) => {
                    const btn = document.createElement('button');
                    btn.className = type === 'mobile' 
                        ? "relative flex flex-col items-center group p-2.5 rounded-xl w-1/3 transition-all"
                        : "relative w-full flex items-center p-2.5 lg:p-3 rounded-lg hover:bg-nav-item-hover-light dark:hover:bg-nav-item-hover-dark transition-colors";
                    btn.dataset.tab = item.id;
                    btn.type = 'button';
                    btn.setAttribute('aria-label', item.text);
                    UI.setHTML(btn, html);
                    return btn;
                };
                
                DOM.mobileNavContainer.appendChild(createButton(createButtonHTML(item.icon, item.text, 'mobile'), 'mobile'));
                DOM.desktopNavContainer.appendChild(createButton(createButtonHTML(item.icon, item.text, 'desktop'), 'desktop'));
            });
            Navigation.attachListeners();
            Navigation.updateActiveStyles(currentTabId || NAV_ITEMS[0].id); 
        },
        attachListeners: () => { 
            document.querySelectorAll('[data-tab]').forEach(button => {
                button.addEventListener('click', () => {
                    Navigation.setActiveTab(button.dataset.tab);
                    const icon = button.querySelector('.nav-icon');
                    if (icon && button.closest('#mobile-navbar')) {
                        UI.removeClass(icon, 'animated');
                        void icon.offsetWidth;
                        UI.addClass(icon, 'animated');
                        icon.addEventListener('animationend', () => UI.removeClass(icon, 'animated'), { once: true });
                    }
                });
            });
        },
        playStagger: (host) => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            host.classList.add('stagger');
            clearTimeout(host._staggerTimer);
            host._staggerTimer = setTimeout(() => host.classList.remove('stagger'), 1100);   // así un re-render posterior no vuelve a animar
        },
        setActiveTab: (tabId) => {
            if (currentTabId === tabId && UI.isVisible(document.getElementById(`tab-${tabId}`))) return;

            if (currentTabId) UI.hide(document.getElementById(`tab-${currentTabId}`));
            
            DOM.tabContents.forEach(content => UI.removeClass(content, 'active'));
            
            const activeContent = document.getElementById(`tab-${tabId}`);
            if (activeContent) {
                UI.show(activeContent);
                void activeContent.offsetWidth; 
                UI.addClass(activeContent, 'active');
                activeContent.querySelectorAll('[data-stagger-host]').forEach(Navigation.playStagger);
            }
            currentTabId = tabId; 

            Navigation.updateActiveStyles(tabId); 
            const activeItemData = NAV_ITEMS.find(item => item.id === tabId);
            if (DOM.headerSubtitle && activeItemData) UI.setText(DOM.headerSubtitle, activeItemData.subtitle);
            
            localStorage.setItem('activeTab', tabId);
            if (DOM.mainContentArea) DOM.mainContentArea.scrollTop = 0;

            if (tabId !== 'explorar' && UI.isVisible(DOM.searchResultsContainer)) SearchHandler.showDefault();
            if (tabId === 'alertas') NotificationHandler.render();
            if (tabId === 'explorar' && UI.isVisible(DOM.searchResultsContainer)) { /* No hacer nada */ } 
            else if (tabId === 'explorar') { ExploreHandler.renderRecommendations(); SearchHandler.showDefault(); }
        },
        updateActiveStyles: (activeTabId) => {
            if (!activeTabId) return; 
            document.querySelectorAll('[data-tab]').forEach(btn => {
                const icon = btn.querySelector('.nav-icon');
                const textSpan = btn.querySelector('span:not(.notification-badge)');
                const isActive = btn.dataset.tab === activeTabId;
            
                const baseIconColorLight = 'text-text-light-secondary';
                const baseIconColorDark = 'dark:text-text-dark-secondary';
                const baseTextColorLight = 'text-text-light-secondary';
                const baseTextColorDark = 'dark:text-text-dark-secondary';
                const activeColorLight = 'text-primary-light';
                const activeColorDark = 'dark:text-primary-dark';
                const activeBgLight = 'bg-nav-item-active-light';
                const activeBgDark = 'dark:bg-nav-item-active-dark';
            
                UI.removeClass(btn, activeBgLight, activeBgDark);
                UI.removeClass(icon, activeColorLight, activeColorDark, baseIconColorLight, baseIconColorDark);
                if (textSpan) {
                    UI.removeClass(textSpan, activeColorLight, activeColorDark, baseTextColorLight, baseTextColorDark, 'font-semibold');
                }
            
                if (isActive) {
                    UI.addClass(btn, isDarkMode ? activeBgDark : activeBgLight);
                    UI.addClass(icon, isDarkMode ? activeColorDark : activeColorLight);
                    if (textSpan) {
                        UI.addClass(textSpan, isDarkMode ? activeColorDark : activeColorLight, 'font-semibold');
                    }
                } else {
                    UI.addClass(icon, isDarkMode ? baseIconColorDark : baseIconColorLight);
                    if (textSpan) {
                        UI.addClass(textSpan, isDarkMode ? baseTextColorDark : baseTextColorLight);
                    }
                }
            });
            const mobileNavBg = getComputedStyle(DOM.mobileNavContainer.parentElement).backgroundColor;
            document.querySelectorAll('#mobile-navbar .notification-badge').forEach(b => b.style.setProperty('--surface-color', mobileNavBg));
            
            const desktopNavBg = getComputedStyle(DOM.desktopNavContainer.parentElement).backgroundColor;
            document.querySelectorAll('#desktop-sidebar .notification-badge').forEach(b => b.style.setProperty('--surface-color', desktopNavBg));
        },
        init: () => {
            Navigation.renderItems(); 
            const savedTab = localStorage.getItem('activeTab') || NAV_ITEMS[0].id;
            Navigation.setActiveTab(savedTab); 
        }
    };

    const PostHandler = {
        renderFeed: (newId = null) => {
            const feedHtml = posts.map(post => `
                <div class="post-card ${post.id === newId ? 'is-new' : ''} bg-surface-light dark:bg-surface-elevated-dark rounded-xl shadow-fluent dark:shadow-fluent-dark p-4">
                    <div class="flex items-center mb-2">
                        <span class="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 mr-3 text-lg ${isDarkMode ? 'text-primary-dark' : 'text-primary-light'}"><i class="${post.icon}"></i></span>
                        <h3 class="font-semibold text-md">${esc(post.title)}</h3>
                    </div>
                    <p class="text-sm text-text-light-secondary dark:text-text-dark-secondary mb-1 text-xs">${esc(post.category)}</p>
                    <p class="text-sm text-text-light-secondary dark:text-text-dark-secondary">${esc(post.content.substring(0,150))}${post.content.length > 150 ? '...' : ''}</p>
                </div>
            `).join('');
            UI.setHTML(DOM.postsFeedContainer, `<h2 class="text-xl font-semibold text-text-light-primary dark:text-text-dark-primary px-1">Feed Reciente</h2>` + (feedHtml || '') + `<p id="empty-feed-message" class="text-center text-text-light-secondary dark:text-text-dark-secondary py-8 ${posts.length ? 'hidden' : ''}">¡Aún no hay posts! Crea uno para empezar.</p>`);
            DOM.emptyFeedMessage = document.getElementById('empty-feed-message');
        },
        create: (e) => { 
            e.preventDefault();
            const title = UI.getValue(DOM.newPostForm.elements['post-title']);
            const content = UI.getValue(DOM.newPostForm.elements['post-content']);
            const category = UI.getValue(DOM.newPostForm.elements['post-category']);
            
            const btnText = DOM.publishPostBtn.querySelector('.btn-text');
            const spinner = DOM.publishPostBtn.querySelector('.spinner');

            UI.hide(btnText); UI.show(spinner); DOM.publishPostBtn.disabled = true;

            setTimeout(() => { 
                const newPost = { id: Date.now(), title, content, category, icon: selectedPostIcon, time: new Date() };
                posts.unshift(newPost);
                PostHandler.renderFeed(newPost.id);
                DOM.newPostForm.reset();
                selectedPostIcon = availablePostIcons[0]; 
                UI.createIconSelector(DOM.postIconSelector, availablePostIcons, selectedPostIcon, PostHandler.onPostIconSelect);
                ModalManager.close(DOM.newPostModal);
                UI.showToast('¡Post publicado con éxito!', 'success'); 
                
                NotificationHandler.addNotification({
                    id: Date.now() + 50, 
                    icon: 'fas fa-file-alt',
                    title: `Nuevo post: ${newPost.title.substring(0,30)}${newPost.title.length > 30 ? '...' : ''}`,
                    time: 'ahora mismo',
                    read: false,
                    description: `Categoría: ${newPost.category}`
                });
                
                UI.show(btnText); UI.hide(spinner); DOM.publishPostBtn.disabled = false;
            }, 1000);
        },
        onPostIconSelect: (newIcon) => { 
            selectedPostIcon = newIcon;
            UI.createIconSelector(DOM.postIconSelector, availablePostIcons, selectedPostIcon, PostHandler.onPostIconSelect);
        },
        init: () => { 
            if (DOM.createNewPostBtn) DOM.createNewPostBtn.addEventListener('click', () => {
                selectedPostIcon = availablePostIcons[0]; 
                UI.createIconSelector(DOM.postIconSelector, availablePostIcons, selectedPostIcon, PostHandler.onPostIconSelect);
                ModalManager.open(DOM.newPostModal);
            });
            if (DOM.newPostForm) DOM.newPostForm.addEventListener('submit', PostHandler.create);
            PostHandler.renderFeed();
        }
    };

    const NotificationHandler = {
        getUnreadCount: () => notifications.filter(n => !n.read).length,
        addNotification: (newNotif) => {
            notifications.unshift(newNotif); 
            if (currentTabId === 'alertas') { 
                NotificationHandler.render();
            } else { 
                NotificationHandler.updateBadges();
            }
        },
        render: () => {
            if (!DOM.notificationsList) return;
            UI.setHTML(DOM.notificationsList, notifications.map(n => `
                <div class="notification-item p-3.5 rounded-lg flex items-start space-x-3 transition-all duration-200 ${n.read ? 'opacity-60 hover:opacity-80' : 'bg-primary-light/10 dark:bg-primary-dark/10 hover:bg-primary-light/20 dark:hover:bg-primary-dark/20 cursor-pointer'}" data-id="${n.id}">
                    <div class="w-8 h-8 rounded-full ${n.read ? 'bg-slate-200 dark:bg-slate-700' : 'bg-primary-light dark:bg-primary-dark'} text-white dark:text-opacity-90 flex items-center justify-center flex-shrink-0 text-sm"><i class="${n.icon}"></i></div>
                    <div class="flex-1">
                        <p class="font-semibold text-sm ${n.read ? '' : 'text-text-light-primary dark:text-text-dark-primary'}">${esc(n.title)}</p>
                        <p class="text-xs text-text-light-secondary dark:text-text-dark-secondary mt-0.5">${esc(n.description || '')}</p>
                        <p class="text-xs ${n.read ? 'text-slate-400 dark:text-slate-500' : 'text-primary-light dark:text-primary-dark'} mt-1">${n.time}</p>
                    </div>
                    ${!n.read ? '<div class="w-2.5 h-2.5 rounded-full bg-primary-light dark:bg-primary-dark mt-1 flex-shrink-0" title="No leída"></div>' : ''}
                </div>
            `).join('') || '<p class="text-center text-text-light-secondary dark:text-text-dark-secondary py-4">No hay notificaciones nuevas.</p>');
            
            NotificationHandler.updateBadges();
            DOM.notificationsList.querySelectorAll('.notification-item').forEach(item => 
                item.addEventListener('click', (e) => {
                    const notifId = parseInt(e.currentTarget.dataset.id);
                    const notif = notifications.find(n => n.id === notifId);
                    if (notif && !notif.read) {
                        NotificationHandler.markOneAsRead(notifId);
                    }
                })
            );
        },
        updateBadges: () => Navigation.renderItems(),
        markOneAsRead: (id) => { 
            const notif = notifications.find(n => n.id === id);
            if (notif) notif.read = true;
            NotificationHandler.render(); 
        },
        markAllRead: () => { 
            notifications.forEach(n => n.read = true);
            NotificationHandler.render(); 
        },
        init: () => { 
            if (DOM.markAllReadBtn) DOM.markAllReadBtn.addEventListener('click', NotificationHandler.markAllRead);
        }
    };
    
    const ExploreHandler = {
        renderRecommendations: () => {
            if (!DOM.exploreRecommendationsGrid) return;
            DOM.exploreRecommendationsGrid.innerHTML = exploreRecommendations.map(rec => `
                <div class="explore-card bg-surface-light dark:bg-surface-elevated-dark rounded-lg shadow-fluent dark:shadow-fluent-dark overflow-hidden group" role="button" tabindex="0">
                    <div class="rec-cover ${rec.color}"><i class="${rec.icon}" aria-hidden="true"></i></div>
                    <div class="p-3">
                        <h3 class="font-semibold text-sm truncate group-hover:text-primary-light dark:group-hover:text-primary-dark">${rec.title}</h3>
                        <p class="text-xs text-text-light-secondary dark:text-text-dark-secondary">${rec.type}</p>
                    </div>
                </div>
            `).join('');
        },
        init: () => {
            ExploreHandler.renderRecommendations();
        }
    };

    const SearchHandler = {
        sampleSuggestions: ['Tailwind CSS', 'IA Proyectos', 'Diseño Fluent', 'JavaScript Novedades', 'Web Performance', 'Microfrontends'],
        sampleResults: [ 
            { title: 'Guía Tailwind CSS', description: 'Domina Tailwind CSS...', category: 'WebDev', icon: 'fas fa-wind', color: 'bg-gradient-to-br from-blue-500 to-cyan-500' },
            { title: 'Chatbot con IA', description: 'Crea tu chatbot...', category: 'IA', icon: 'fas fa-robot', color: 'bg-gradient-to-br from-violet-500 to-fuchsia-500' },
        ],
        handleInputOrFocus: (isFocusEvent = false) => {
            const query = UI.getValue(DOM.searchInput).toLowerCase().trim();
            if (isFocusEvent && query === '') {
                SearchHandler.renderSuggestions(SearchHandler.sampleSuggestions.slice(0, 4), true); 
                return;
            }
            if (query.length < 2 && !isFocusEvent) { 
                UI.hide(DOM.searchSuggestionsContainer);
                if (query.length === 0 && UI.isVisible(DOM.searchResultsContainer)) SearchHandler.showDefault();
                return;
            }
            if (query.length >=2 ) { 
                const filtered = SearchHandler.sampleSuggestions.filter(s => s.toLowerCase().includes(query));
                SearchHandler.renderSuggestions(filtered);
            } else if (!isFocusEvent) { 
                 UI.hide(DOM.searchSuggestionsContainer);
            }
        },
        renderSuggestions: (suggestions, isInitial = false) => { 
            const titleHtml = isInitial ? `<div class="p-3 text-xs text-text-light-secondary dark:text-text-dark-secondary">Sugerencias Populares:</div>` : '';
            UI.setHTML(DOM.searchSuggestionsContainer, titleHtml + suggestions.slice(0, 5).map(s => 
                `<div class="p-3 hover:bg-slate-100 dark:hover:bg-slate-700 active:bg-slate-200 dark:active:bg-slate-600 cursor-pointer text-sm transition-colors" data-suggestion="${esc(s)}">${esc(s)}</div>`
            ).join(''));
            UI.toggleClass(DOM.searchSuggestionsContainer, 'hidden', suggestions.length === 0 && !isInitial);
        },
        perform: (query) => {
            UI.hide(DOM.searchSuggestionsContainer);
            UI.hide(DOM.exploreDefaultContent);
            UI.show(DOM.searchResultsContainer);
            UI.setHTML(DOM.searchResultsContainer, `
                <div class="flex justify-between items-center mb-3">
                    <h2 class="text-lg font-semibold">Resultados para "${esc(query)}"</h2>
                    <button id="clear-search-btn" class="text-sm text-primary-light dark:text-primary-dark hover:underline">Limpiar</button>
                </div>
                ${SearchHandler.sampleResults.map(r => `
                    <div class="bg-surface-light dark:bg-surface-elevated-dark rounded-xl shadow-fluent p-4 flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                        <div class="result-cover ${r.color}"><i class="${r.icon}" aria-hidden="true"></i></div>
                        <div class="flex-1"><h3 class="font-semibold text-md mb-1">${r.title}</h3><p class="text-xs text-text-light-secondary dark:text-text-dark-secondary mb-1.5">${r.category}</p><p class="text-sm">${r.description}</p></div>
                    </div>
                `).join('')}
            `);
            document.getElementById('clear-search-btn').addEventListener('click', SearchHandler.showDefault);
        },
        showDefault: () => {
            UI.setValue(DOM.searchInput, '');
            UI.hide(DOM.searchResultsContainer); UI.setHTML(DOM.searchResultsContainer, '');
            UI.show(DOM.exploreDefaultContent);
            ExploreHandler.renderRecommendations(); 
        },
        init: () => { 
            if (!DOM.searchInput) return;
            DOM.searchInput.addEventListener('input', () => SearchHandler.handleInputOrFocus(false));
            DOM.searchInput.addEventListener('focus', () => SearchHandler.handleInputOrFocus(true));
            DOM.searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter' && UI.getValue(DOM.searchInput).trim()) SearchHandler.perform(UI.getValue(DOM.searchInput).trim()); });
            DOM.searchSuggestionsContainer.addEventListener('click', (e) => {
                if (e.target.dataset.suggestion) {
                    UI.setValue(DOM.searchInput, e.target.dataset.suggestion);
                    SearchHandler.perform(e.target.dataset.suggestion);
                }
            });
            document.addEventListener('click', (e) => { 
                if (DOM.searchInput && DOM.searchSuggestionsContainer && !DOM.searchInput.contains(e.target) && !DOM.searchSuggestionsContainer.contains(e.target)) UI.hide(DOM.searchSuggestionsContainer);
            });
        }
    };

    const ProfileHandler = {
        render: () => {
            if (!DOM.profileNameText || !DOM.profileRoleText || !DOM.profileBioDisplay || !DOM.profilePictureDisplay) return;
            UI.setText(DOM.profileNameText, userProfile.name);
            UI.setText(DOM.profileRoleText, userProfile.role);
            UI.setText(DOM.profileBioDisplay, userProfile.bio);
            UI.setHTML(DOM.profilePictureDisplay, `<i class="${userProfile.icon}"></i>`);
            
            const primaryColor = isDarkMode ? COLORS.primaryDark : COLORS.primaryLight;
            const primaryColorDark = COLORS.primaryDark;
            
            DOM.profilePictureDisplay.style.setProperty('--primary-color', primaryColor);
            DOM.profilePictureDisplay.style.setProperty('--primary-color-dark', primaryColorDark);
        },
        openEditModal: () => {
            if (!DOM.editProfileForm) return;
            UI.setValue(DOM.editProfileForm.elements['profile-edit-name'], userProfile.name);
            UI.setValue(DOM.editProfileForm.elements['profile-edit-role'], userProfile.role);
            UI.setValue(DOM.editProfileForm.elements['profile-edit-bio'], userProfile.bio);
            ModalManager.open(DOM.modalEditProfile);
        },
        saveChanges: (e) => {
            e.preventDefault();
            if (!DOM.editProfileForm) return;

            const newName = UI.getValue(DOM.editProfileForm.elements['profile-edit-name']);
            const newRole = UI.getValue(DOM.editProfileForm.elements['profile-edit-role']);
            const newBio = UI.getValue(DOM.editProfileForm.elements['profile-edit-bio']);

            const btnText = DOM.saveProfileBtn.querySelector('.btn-text');
            const spinner = DOM.saveProfileBtn.querySelector('.spinner');
            UI.hide(btnText); UI.show(spinner); DOM.saveProfileBtn.disabled = true;

            setTimeout(() => { 
                userProfile.name = newName;
                userProfile.role = newRole;
                userProfile.bio = newBio;
                
                ProfileHandler.render();
                ModalManager.close(DOM.modalEditProfile);
                UI.showToast('Perfil actualizado con éxito!', 'success');
                NotificationHandler.addNotification({
                    id: Date.now() + 100, icon: 'fas fa-user-check',
                    title: 'Perfil Actualizado', time: 'ahora mismo', read: false,
                    description: 'Tu información de perfil ha sido guardada.'
                });

                UI.show(btnText); UI.hide(spinner); DOM.saveProfileBtn.disabled = false;
            }, 1000);
        },
        onProfileIconSelectCallback: (iconClass) => { 
            userProfile.icon = iconClass;
            ProfileHandler.render();
            ModalManager.close(DOM.modalProfilePicture);
            UI.showToast('Icono de perfil actualizado!', 'info');
        },
        init: () => {
            ProfileHandler.render();
            if (DOM.profilePictureDisplay) { 
                DOM.profilePictureDisplay.addEventListener('click', () => {
                    UI.createIconSelector(DOM.profileIconSelectorContainer, availableProfileIcons, userProfile.icon, ProfileHandler.onProfileIconSelectCallback, 'icon-selector-btn p-3 text-2xl');
                    ModalManager.open(DOM.modalProfilePicture);
                });
            }
            if (DOM.editProfileMainBtn) {
                DOM.editProfileMainBtn.addEventListener('click', ProfileHandler.openEditModal);
            }
            if (DOM.editProfileForm) {
                DOM.editProfileForm.addEventListener('submit', ProfileHandler.saveChanges);
            }
        }
    };

    const TutorialHandler = {
        renderCards: () => {
            if (!DOM.tutorialCardsGrid) return;
            DOM.tutorialCardsGrid.innerHTML = tutorials.map(tutorial => {
                const theme = tutorial.colorTheme;
                const iconContainerBg = isDarkMode ? theme.bgDark : theme.bgLight;
                const iconColor = isDarkMode ? theme.iconDark : theme.iconLight;

                return `
                <div class="tutorial-card bg-card-tutorial-bg-light dark:bg-card-tutorial-bg-dark rounded-xl shadow-card-tutorial-light dark:shadow-card-tutorial-dark overflow-hidden group p-4 flex flex-col hover:bg-card-tutorial-hover-light dark:hover:bg-card-tutorial-hover-dark" data-tutorial-id="${tutorial.id}" role="button" tabindex="0">
                    <div class="tutorial-card-icon-container flex items-center justify-center mb-3 ${iconContainerBg}">
                        <i class="${tutorial.icon} ${iconColor}"></i>
                    </div>
                    <h3 class="font-semibold text-md mb-1 text-text-light-primary dark:text-text-dark-primary group-hover:text-primary-light dark:group-hover:text-primary-dark">${tutorial.title}</h3>
                    <p class="text-xs text-text-light-secondary dark:text-text-dark-secondary flex-grow">${tutorial.cardDescription}</p>
                </div>
            `}).join('');

            DOM.tutorialCardsGrid.querySelectorAll('.tutorial-card').forEach(card => {
                const open = () => TutorialHandler.showTutorialModal(card.dataset.tutorialId);
                card.addEventListener('click', open);
                card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
            });
        },
        showTutorialModal: (tutorialId) => {
            const tutorial = tutorials.find(t => t.id === tutorialId);
            if (!tutorial) return;
            const theme = tutorial.colorTheme;

            UI.setText(DOM.tutorialModalTitle, tutorial.modalTitle);
            
            const modalIconColor = isDarkMode ? theme.iconDark : theme.iconLight;
            UI.setHTML(DOM.tutorialModalIconContainer, `<i class="${tutorial.icon} text-5xl ${modalIconColor}"></i>`);
            
            const keywordsHtml = tutorial.keywords.map(keyword => {
                const keywordBg = isDarkMode ? theme.keywordBgDark : theme.keywordBgLight;
                const keywordText = isDarkMode ? theme.keywordTextDark : theme.keywordTextLight;
                return `<span class="keyword-tag ${keywordBg} ${keywordText}">${keyword.replace(/\(([^)]+)\)/g, '<span class="text-xs opacity-80">($1)</span>')}</span>`
            }).join(' ');
            UI.setHTML(DOM.tutorialModalKeywordsContainer, keywordsHtml);
            UI.setText(DOM.tutorialModalDescription, tutorial.modalDescription);

            ModalManager.open(DOM.modalTutorial);
        },
        init: () => {
            TutorialHandler.renderCards();
        }
    };
    
    const init = () => {
        ModalManager.init();
        DarkMode.init(); 
        GenericToggles.init(); 
        Navigation.init(); 
        PostHandler.init();
        NotificationHandler.init(); 
        ExploreHandler.init();
        SearchHandler.init();
        ProfileHandler.init(); 
        TutorialHandler.init();
    };

    return { init };
})();

App.init();
