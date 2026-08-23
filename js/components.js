/* =========================================================
   BAWABET ALTAMREED
   COMPONENTS LOADER
   ========================================================= */

"use strict";


const BAWABET_COMPONENTS = {

    /* =====================================================
       COMPONENT REGISTRY
    ===================================================== */

    components: {

        header: "components/header.html",

        footer: "components/footer.html",

        cookieBanner: "components/cookie-banner.html"

    },


    /* =====================================================
       INITIALIZE
    ===================================================== */

    async init() {

        await this.loadAll();

        this.initSearchToggle();

        this.initSearchForms();

        this.initCookieBanner();

        this.initHeaderScroll();

    },


    /* =====================================================
       LOAD ALL COMPONENTS
    ===================================================== */

    async loadAll() {

        const targets =
            document.querySelectorAll(
                "[data-component]"
            );

        if (!targets.length) {
            return;
        }


        const promises =
            Array.from(targets).map(
                target =>
                    this.loadComponent(target)
            );


        await Promise.all(promises);


        /*
         * بعد تحميل الـHeader والـFooter
         * نعيد تهيئة الأشياء التي تعتمد عليهم.
         */

        if (
            window.BAWABET_APP &&
            typeof BAWABET_APP.initMobileMenu === "function"
        ) {

            BAWABET_APP.initMobileMenu();

        }


        if (
            window.BAWABET_APP &&
            typeof BAWABET_APP.initSearch === "function"
        ) {

            BAWABET_APP.initSearch();

        }


        if (
            window.BAWABET_APP &&
            typeof BAWABET_APP.markCurrentNavigation === "function"
        ) {

            BAWABET_APP.markCurrentNavigation();

        }
    },


    /* =====================================================
       LOAD SINGLE COMPONENT
    ===================================================== */

    async loadComponent(target) {

        const name =
            target.dataset.component;

        if (!name) {
            return;
        }


        const path =
            this.components[name];


        if (!path) {

            console.warn(
                `Component "${name}" is not registered.`
            );

            return;
        }


        try {

            const response =
                await fetch(path);


            if (!response.ok) {

                throw new Error(
                    `HTTP ${response.status}`
                );

            }


            const html =
                await response.text();


            target.innerHTML =
                html;


            target.dataset.loaded =
                "true";


        } catch (error) {

            console.error(
                `Failed to load component: ${name}`,
                error
            );


            target.innerHTML = `
                <div class="component-error">
                    تعذر تحميل هذا الجزء من الموقع.
                </div>
            `;
        }
    },


    /* =====================================================
       SEARCH TOGGLE
    ===================================================== */

    initSearchToggle() {

        const openButtons =
            document.querySelectorAll(
                "[data-search-toggle]"
            );


        const closeButtons =
            document.querySelectorAll(
                "[data-search-close]"
            );


        const overlays =
            document.querySelectorAll(
                "[data-search-overlay]"
            );


        if (!overlays.length) {
            return;
        }


        openButtons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    overlays.forEach(
                        overlay => {

                            overlay.classList.add(
                                "open"
                            );

                            overlay.setAttribute(
                                "aria-hidden",
                                "false"
                            );

                        }
                    );


                    document.body.classList.add(
                        "search-open"
                    );


                    const input =
                        document.querySelector(
                            "[data-search-overlay] input[data-global-search]"
                        );


                    if (input) {

                        setTimeout(
                            () => input.focus(),
                            100
                        );

                    }

                }
            );

        });


        closeButtons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    this.closeSearchOverlay();

                }
            );

        });


        overlays.forEach(overlay => {

            overlay.addEventListener(
                "click",
                event => {

                    if (
                        event.target === overlay
                    ) {

                        this.closeSearchOverlay();

                    }

                }
            );

        });


        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Escape"
                ) {

                    this.closeSearchOverlay();

                }

            }
        );
    },


    /* =====================================================
       CLOSE SEARCH
    ===================================================== */

    closeSearchOverlay() {

        const overlays =
            document.querySelectorAll(
                "[data-search-overlay]"
            );


        overlays.forEach(
            overlay => {

                overlay.classList.remove(
                    "open"
                );

                overlay.setAttribute(
                    "aria-hidden",
                    "true"
                );

            }
        );


        document.body.classList.remove(
            "search-open"
        );
    },


    /* =====================================================
       SEARCH FORMS
    ===================================================== */

    initSearchForms() {

        const forms =
            document.querySelectorAll(
                "[data-search-form]"
            );


        forms.forEach(form => {

            form.addEventListener(
                "submit",
                event => {

                    event.preventDefault();


                    const input =
                        form.querySelector(
                            "input[name='q']"
                        );


                    if (!input) {
                        return;
                    }


                    const query =
                        input.value.trim();


                    if (
                        query.length <
                        BAWABET.config.search.minimumCharacters
                    ) {

                        input.focus();

                        return;
                    }


                    const encoded =
                        encodeURIComponent(query);


                    window.location.href =
                        `pages/search.html?q=${encoded}`;

                }
            );

        });

    },


    /* =====================================================
       COOKIE BANNER
    ===================================================== */

    initCookieBanner() {

        const banner =
            document.querySelector(
                "[data-cookie-banner]"
            );


        if (!banner) {
            return;
        }


        const accepted =
            localStorage.getItem(
                BAWABET.helpers.storageKey(
                    "cookies_accepted"
                )
            );


        if (accepted === "true") {

            banner.remove();

            return;
        }


        banner.classList.add(
            "visible"
        );


        const accept =
            banner.querySelector(
                "[data-cookie-accept]"
            );


        if (accept) {

            accept.addEventListener(
                "click",
                () => {

                    localStorage.setItem(
                        BAWABET.helpers.storageKey(
                            "cookies_accepted"
                        ),
                        "true"
                    );


                    banner.classList.remove(
                        "visible"
                    );


                    setTimeout(
                        () => banner.remove(),
                        300
                    );

                }
            );

        }

    },


    /* =====================================================
       HEADER SCROLL EFFECT
    ===================================================== */

    initHeaderScroll() {

        const header =
            document.querySelector(
                "#site-header"
            );


        if (!header) {
            return;
        }


        const update =
            () => {

                header.classList.toggle(
                    "scrolled",
                    window.scrollY > 30
                );

            };


        window.addEventListener(
            "scroll",
            update,
            {
                passive: true
            }
        );


        update();

    }

};


/* =========================================================
   START COMPONENT SYSTEM
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await BAWABET_COMPONENTS.init();

    }
);


/* =========================================================
   GLOBAL ACCESS
========================================================= */

window.BAWABET_COMPONENTS =
    BAWABET_COMPONENTS;
