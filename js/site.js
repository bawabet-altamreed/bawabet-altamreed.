/* =========================================================
   بوابة التمريض
   GLOBAL SITE JAVASCRIPT
   ========================================================= */

"use strict";


/* =========================================================
   GLOBAL OBJECT
   ========================================================= */

window.BawabetSite = {

    version: "1.0.0",

    siteName: "بوابة التمريض",

    siteUrl: "https://bawabet-altamreed.com",

    initialized: false

};


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeSite();

    }
);


/* =========================================================
   INITIALIZE
   ========================================================= */

function initializeSite() {

    setupCurrentYear();

    setupMobileMenu();

    setupBackToTop();

    setupExternalLinks();

    BawabetSite.initialized = true;

}


/* =========================================================
   CURRENT YEAR
   ========================================================= */

function setupCurrentYear() {

    const yearElements =
        document.querySelectorAll(
            "[data-current-year]"
        );


    const currentYear =
        new Date().getFullYear();


    yearElements.forEach(
        function (element) {

            element.textContent =
                currentYear;

        }
    );

}


/* =========================================================
   MOBILE MENU
   ========================================================= */

function setupMobileMenu() {

    const menuButton =
        document.querySelector(
            "[data-menu-toggle]"
        );


    const menu =
        document.querySelector(
            "[data-mobile-menu]"
        );


    if (
        !menuButton ||
        !menu
    ) {

        return;

    }


    menuButton.addEventListener(
        "click",
        function () {

            const isOpen =
                menu.classList.toggle(
                    "is-open"
                );


            menuButton.setAttribute(
                "aria-expanded",
                isOpen
                    ? "true"
                    : "false"
            );

        }
    );


    menu
        .querySelectorAll("a")
        .forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        menu.classList.remove(
                            "is-open"
                        );


                        menuButton.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }
                );

            }
        );

}


/* =========================================================
   BACK TO TOP
   ========================================================= */

function setupBackToTop() {

    const button =
        document.querySelector(
            "[data-back-to-top]"
        );


    if (!button) {

        return;

    }


    window.addEventListener(
        "scroll",
        function () {

            if (
                window.scrollY >
                500
            ) {

                button.classList.add(
                    "show"
                );

            } else {

                button.classList.remove(
                    "show"
                );

            }

        },
        {
            passive: true
        }
    );


    button.addEventListener(
        "click",
        function () {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );

}


/* =========================================================
   EXTERNAL LINKS
   ========================================================= */

function setupExternalLinks() {

    const links =
        document.querySelectorAll(
            'a[href^="http"]'
        );


    links.forEach(
        function (link) {

            const href =
                link.getAttribute(
                    "href"
                );


            if (
                !href ||
                href.includes(
                    "bawabet-altamreed.com"
                )
            ) {

                return;

            }


            link.setAttribute(
                "target",
                "_blank"
            );


            link.setAttribute(
                "rel",
                "noopener noreferrer"
            );

        }
    );

}


/* =========================================================
   GLOBAL SEARCH
   ========================================================= */

window.BawabetSearch = {

    normalize: function (
        text
    ) {

        return String(
            text || ""
        )
        .toLowerCase()
        .trim()

        .replace(
            /[أإآ]/g,
            "ا"
        )

        .replace(
            /ة/g,
            "ه"
        )

        .replace(
            /ى/g,
            "ي"
        )

        .replace(
            /[ًٌٍَُِّْـ]/g,
            ""
        )

        .replace(
            /\s+/g,
            " "
        );

    },


    contains: function (
        source,
        query
    ) {

        const normalizedSource =
            this.normalize(
                source
            );


        const normalizedQuery =
            this.normalize(
                query
            );


        if (!normalizedQuery) {

            return true;

        }


        return normalizedSource.includes(
            normalizedQuery
        );

    }

};


/* =========================================================
   SAFE HTML
   ========================================================= */

window.escapeHTML =
    function (
        value
    ) {

        return String(
            value || ""
        )

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

    };


/* =========================================================
   URL HELPERS
   ========================================================= */

window.BawabetURL = {

    getParameter: function (
        name
    ) {

        const params =
            new URLSearchParams(
                window.location.search
            );


        return params.get(name);

    },


    setParameter: function (
        name,
        value
    ) {

        const url =
            new URL(
                window.location.href
            );


        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {

            url.searchParams.delete(
                name
            );

        } else {

            url.searchParams.set(
                name,
                value
            );

        }


        window.history.replaceState(
            {},
            "",
            url
        );

    }

};


/* =========================================================
   DEBOUNCE
   ========================================================= */

window.bawabetDebounce =
    function (
        callback,
        delay = 250
    ) {

        let timer;


        return function () {

            const context =
                this;


            const args =
                arguments;


            clearTimeout(
                timer
            );


            timer =
                setTimeout(
                    function () {

                        callback.apply(
                            context,
                            args
                        );

                    },
                    delay
                );

        };

    };


/* =========================================================
   DEVICE CHECK
   ========================================================= */

window.BawabetDevice = {

    isMobile: function () {

        return window.innerWidth <= 768;

    },


    isTablet: function () {

        return (
            window.innerWidth > 768 &&
            window.innerWidth <= 1024
        );

    },


    isDesktop: function () {

        return window.innerWidth > 1024;

    }

};


/* =========================================================
   ANALYTICS READY
   ========================================================= */

window.BawabetAnalytics = {

    track: function (
        eventName,
        data = {}
    ) {

        /*
         * سيتم ربط Google Analytics
         * و Search Console
         * لاحقًا.
         */

        if (
            window.console &&
            typeof console.debug === "function"
        ) {

            console.debug(
                "[Bawabet Analytics]",
                eventName,
                data
            );

        }

    }

};


/* =========================================================
   ERROR HANDLER
   ========================================================= */

window.addEventListener(
    "error",
    function (event) {

        if (
            window.console &&
            typeof console.error === "function"
        ) {

            console.error(
                "[Bawabet Error]",
                event.error || event.message
            );

        }

    }
);
