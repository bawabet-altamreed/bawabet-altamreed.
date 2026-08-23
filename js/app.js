/* =========================================================
   BAWABET ALTAMREED
   MAIN APPLICATION
   ========================================================= */

"use strict";


/* =========================================================
   APP OBJECT
========================================================= */

const BAWABET_APP = {

    initialized: false,

    state: {
        currentPage: "",
        mobileMenuOpen: false,
        searchOpen: false,
        theme: "light"
    },


    /* =====================================================
       INITIALIZE
    ===================================================== */

    init() {

        if (this.initialized) {
            return;
        }

        this.initialized = true;

        this.detectPage();

        this.loadTheme();

        this.updateDocumentDirection();

        this.updateDocumentLanguage();

        this.updatePageMeta();

        this.renderNavigation();

        this.initMobileMenu();

        this.initSearch();

        this.initTabs();

        this.initAccordions();

        this.initModals();

        this.initBackToTop();

        this.initSmoothLinks();

        this.initExternalLinks();

        this.initLazyLoading();

        this.restoreScrollPosition();

        this.markCurrentNavigation();

        this.emitReadyEvent();

        console.log(
            "🩺 بوابة التمريض — App initialized successfully."
        );
    },


    /* =====================================================
       DETECT CURRENT PAGE
    ===================================================== */

    detectPage() {

        const path =
            window.location.pathname
                .split("/")
                .pop();

        this.state.currentPage =
            path || "index.html";
    },


    /* =====================================================
       DOCUMENT SETTINGS
    ===================================================== */

    updateDocumentDirection() {

        document.documentElement.dir =
            BAWABET.config.site.direction;
    },


    updateDocumentLanguage() {

        document.documentElement.lang =
            BAWABET.config.site.language;
    },


    /* =====================================================
       SEO / PAGE META
    ===================================================== */

    updatePageMeta() {

        const title =
            document.body.dataset.title;

        const description =
            document.body.dataset.description;

        if (title) {

            document.title =
                BAWABET.helpers.pageTitle(title);
        }

        if (description) {

            this.setMeta(
                "description",
                description
            );
        }

        this.setMeta(
            "robots",
            BAWABET.config.seo.robots
        );
    },


    setMeta(name, content) {

        if (!content) {
            return;
        }

        let meta =
            document.querySelector(
                `meta[name="${name}"]`
            );

        if (!meta) {

            meta =
                document.createElement("meta");

            meta.name = name;

            document.head.appendChild(meta);
        }

        meta.content = content;
    },


    /* =====================================================
       NAVIGATION
    ===================================================== */

    renderNavigation() {

        const containers =
            document.querySelectorAll(
                "[data-navigation]"
            );

        if (!containers.length) {
            return;
        }

        const items =
            BAWABET.config.navigation;

        containers.forEach(container => {

            container.innerHTML = "";

            items.forEach(item => {

                const link =
                    document.createElement("a");

                link.href = item.url;

                link.dataset.navId =
                    item.id;

                link.innerHTML = `
                    <span class="nav-icon">
                        ${item.icon}
                    </span>

                    <span class="nav-title">
                        ${BAWABET.helpers.escapeHTML(
                            item.title
                        )}
                    </span>
                `;

                container.appendChild(link);
            });
        });
    },


    markCurrentNavigation() {

        const links =
            document.querySelectorAll(
                "[data-nav-id]"
            );

        if (!links.length) {
            return;
        }

        const current =
            this.state.currentPage;

        links.forEach(link => {

            const href =
                link.getAttribute("href") || "";

            const page =
                href.split("/").pop();

            if (page === current) {

                link.classList.add("active");

                link.setAttribute(
                    "aria-current",
                    "page"
                );
            }
        });
    },


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    initMobileMenu() {

        const button =
            document.querySelector(
                "[data-mobile-menu-button]"
            );

        const menu =
            document.querySelector(
                "[data-mobile-menu]"
            );

        if (!button || !menu) {
            return;
        }

        button.addEventListener(
            "click",
            () => {

                const open =
                    menu.classList.toggle("open");

                this.state.mobileMenuOpen =
                    open;

                button.setAttribute(
                    "aria-expanded",
                    String(open)
                );

                document.body.classList.toggle(
                    "menu-open",
                    open
                );
            }
        );


        menu.addEventListener(
            "click",
            event => {

                const link =
                    event.target.closest("a");

                if (!link) {
                    return;
                }

                menu.classList.remove("open");

                this.state.mobileMenuOpen =
                    false;

                button.setAttribute(
                    "aria-expanded",
                    "false"
                );

                document.body.classList.remove(
                    "menu-open"
                );
            }
        );
    },


    /* =====================================================
       GLOBAL SEARCH
    ===================================================== */

    initSearch() {

        const inputs =
            document.querySelectorAll(
                "[data-global-search]"
            );

        if (!inputs.length) {
            return;
        }

        inputs.forEach(input => {

            const handler =
                BAWABET.helpers.debounce(
                    () => {

                        const value =
                            input.value.trim();

                        this.handleSearch(
                            value,
                            input
                        );

                    },
                    BAWABET.config.search.debounceTime
                );

            input.addEventListener(
                "input",
                handler
            );


            input.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key === "Enter"
                    ) {

                        event.preventDefault();

                        this.submitSearch(
                            input.value.trim()
                        );
                    }

                    if (
                        event.key === "Escape"
                    ) {

                        input.value = "";

                        this.closeSearchResults(
                            input
                        );
                    }
                }
            );
        });
    },


    handleSearch(value, input) {

        if (
            value.length <
            BAWABET.config.search.minimumCharacters
        ) {

            this.closeSearchResults(
                input
            );

            return;
        }

        this.showSearchMessage(
            input,
            "جاري البحث..."
        );

        /*
         * سيتم ربط محرك البحث الحقيقي
         * بقاعدة بيانات الأدوية والمصطلحات
         * في ملفات البحث القادمة.
         */

        setTimeout(() => {

            this.showSearchMessage(
                input,
                `ابحث عن "${BAWABET.helpers.escapeHTML(
                    value
                )}" من خلال صفحة البحث المتخصصة.`
            );

        }, 250);
    },


    submitSearch(value) {

        if (
            value.length <
            BAWABET.config.search.minimumCharacters
        ) {
            return;
        }

        const encoded =
            encodeURIComponent(value);

        window.location.href =
            `pages/search.html?q=${encoded}`;
    },


    showSearchMessage(input, message) {

        const wrapper =
            input.closest(
                ".search-panel"
            );

        if (!wrapper) {
            return;
        }

        let dropdown =
            wrapper.querySelector(
                ".search-dropdown"
            );

        if (!dropdown) {

            dropdown =
                document.createElement("div");

            dropdown.className =
                "search-dropdown";

            wrapper.appendChild(dropdown);
        }

        dropdown.innerHTML = `
            <div class="search-dropdown-item">
                <div class="search-field-icon">
                    🔎
                </div>

                <div>
                    <strong>
                        ${message}
                    </strong>

                    <small>
                        بوابة التمريض
                    </small>
                </div>
            </div>
        `;
    },


    closeSearchResults(input) {

        const wrapper =
            input.closest(
                ".search-panel"
            );

        if (!wrapper) {
            return;
        }

        const dropdown =
            wrapper.querySelector(
                ".search-dropdown"
            );

        if (dropdown) {
            dropdown.innerHTML = "";
        }
    },


    /* =====================================================
       TABS
    ===================================================== */

    initTabs() {

        const groups =
            document.querySelectorAll(
                "[data-tabs]"
            );

        groups.forEach(group => {

            const buttons =
                group.querySelectorAll(
                    "[data-tab]"
                );

            const panels =
                group.querySelectorAll(
                    "[data-tab-panel]"
                );

            buttons.forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const target =
                            button.dataset.tab;

                        buttons.forEach(item => {

                            item.classList.toggle(
                                "active",
                                item === button
                            );
                        });

                        panels.forEach(panel => {

                            panel.classList.toggle(
                                "active",
                                panel.dataset.tabPanel === target
                            );
                        });
                    }
                );
            });
        });
    },


    /* =====================================================
       ACCORDIONS
    ===================================================== */

    initAccordions() {

        const buttons =
            document.querySelectorAll(
                "[data-accordion-button]"
            );

        buttons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const item =
                        button.closest(
                            ".accordion-item"
                        );

                    if (!item) {
                        return;
                    }

                    const open =
                        item.classList.toggle(
                            "open"
                        );

                    button.setAttribute(
                        "aria-expanded",
                        String(open)
                    );
                }
            );
        });
    },


    /* =====================================================
       MODALS
    ===================================================== */

    initModals() {

        document.addEventListener(
            "click",
            event => {

                const openButton =
                    event.target.closest(
                        "[data-modal-open]"
                    );

                if (openButton) {

                    const id =
                        openButton.dataset.modalOpen;

                    this.openModal(id);

                    return;
                }


                const closeButton =
                    event.target.closest(
                        "[data-modal-close]"
                    );

                if (closeButton) {

                    this.closeModal(
                        closeButton.closest(".modal")
                    );

                    return;
                }


                if (
                    event.target.classList.contains(
                        "modal"
                    )
                ) {

                    this.closeModal(
                        event.target
                    );
                }
            }
        );


        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key !== "Escape"
                ) {
                    return;
                }

                const modal =
                    document.querySelector(
                        ".modal.open"
                    );

                if (modal) {
                    this.closeModal(modal);
                }
            }
        );
    },


    openModal(id) {

        const modal =
            document.getElementById(id);

        if (!modal) {
            return;
        }

        modal.classList.add("open");

        document.body.classList.add(
            "modal-open"
        );

        modal.setAttribute(
            "aria-hidden",
            "false"
        );
    },


    closeModal(modal) {

        if (!modal) {
            return;
        }

        modal.classList.remove("open");

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "modal-open"
        );
    },


    /* =====================================================
       SMOOTH LINKS
    ===================================================== */

    initSmoothLinks() {

        document.addEventListener(
            "click",
            event => {

                const link =
                    event.target.closest(
                        'a[href^="#"]'
                    );

                if (!link) {
                    return;
                }

                const href =
                    link.getAttribute("href");

                if (
                    !href ||
                    href === "#"
                ) {
                    return;
                }

                const target =
                    document.querySelector(
                        href
                    );

                if (!target) {
                    return;
                }

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        );
    },


    /* =====================================================
       BACK TO TOP
    ===================================================== */

    initBackToTop() {

        const button =
            document.querySelector(
                "[data-back-to-top]"
            );

        if (!button) {
            return;
        }

        const toggle =
            () => {

                button.classList.toggle(
                    "visible",
                    window.scrollY > 500
                );
            };

        window.addEventListener(
            "scroll",
            toggle,
            {
                passive: true
            }
        );

        button.addEventListener(
            "click",
            () => {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
        );

        toggle();
    },


    /* =====================================================
       EXTERNAL LINKS
    ===================================================== */

    initExternalLinks() {

        if (
            !BAWABET.config.security
                .allowExternalLinks
        ) {
            return;
        }

        document.addEventListener(
            "click",
            event => {

                const link =
                    event.target.closest("a");

                if (!link) {
                    return;
                }

                const href =
                    link.getAttribute("href");

                if (!href) {
                    return;
                }

                if (
                    href.startsWith("http") &&
                    !href.includes(
                        window.location.hostname
                    )
                ) {

                    link.target =
                        "_blank";

                    link.rel =
                        "noopener noreferrer";
                }
            }
        );
    },


    /* =====================================================
       LAZY LOADING
    ===================================================== */

    initLazyLoading() {

        if (
            !BAWABET.config.performance
                .lazyLoading
        ) {
            return;
        }

        const images =
            document.querySelectorAll(
                "img[data-src]"
            );

        if (!images.length) {
            return;
        }

        if (
            !("IntersectionObserver" in window)
        ) {

            images.forEach(
                image => {

                    image.src =
                        image.dataset.src;
                }
            );

            return;
        }


        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }

                            const image =
                                entry.target;

                            image.src =
                                image.dataset.src;

                            image.removeAttribute(
                                "data-src"
                            );

                            observer.unobserve(
                                image
                            );
                        }
                    );
                },
                {
                    rootMargin:
                        "200px"
                }
            );


        images.forEach(
            image =>
                observer.observe(image)
        );
    },


    /* =====================================================
       SCROLL POSITION
    ===================================================== */

    restoreScrollPosition() {

        const key =
            `scroll_${location.pathname}`;

        const saved =
            sessionStorage.getItem(key);

        if (saved) {

            setTimeout(() => {

                window.scrollTo(
                    0,
                    Number(saved)
                );

            }, 50);
        }


        let saveTimer;

        window.addEventListener(
            "scroll",
            () => {

                clearTimeout(
                    saveTimer
                );

                saveTimer =
                    setTimeout(() => {

                        sessionStorage.setItem(
                            key,
                            String(window.scrollY)
                        );

                    }, 200);

            },
            {
                passive: true
            }
        );
    },


    /* =====================================================
       READY EVENT
    ===================================================== */

    emitReadyEvent() {

        window.dispatchEvent(
            new CustomEvent(
                "bawabet:ready",
                {
                    detail: {
                        app: this
                    }
                }
            )
        );
    }
};


/* =========================================================
   START APPLICATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        BAWABET_APP.init();

    }
);


/* =========================================================
   GLOBAL ACCESS
========================================================= */

window.BAWABET_APP =
    BAWABET_APP;
