/* =========================================================
   BAWABET ALTAMREED
   NURSING DICTIONARY ENGINE
   ========================================================= */

"use strict";

const BAWABET_DICTIONARY = {

    data: null,

    state: {
        query: "",
        category: "all",
        currentTerm: null,
        favorites: []
    },


    /* =====================================================
       INITIALIZE
    ===================================================== */

    async init() {

        const dictionary =
            document.querySelector("[data-dictionary]");

        if (!dictionary) {
            return;
        }

        await this.loadData();

        this.loadFavorites();

        this.initSearch();

        this.initCategoryFilter();

        this.initClearButton();

        this.initEvents();

        this.render();

    },


    /* =====================================================
       LOAD DATA
    ===================================================== */

    async loadData() {

        try {

            const response =
                await fetch("data/dictionary.json");

            if (!response.ok) {
                throw new Error(
                    `HTTP ${response.status}`
                );
            }

            this.data =
                await response.json();

        } catch (error) {

            console.error(
                "Dictionary loading error:",
                error
            );

            this.showError();
        }
    },


    /* =====================================================
       SEARCH
    ===================================================== */

    initSearch() {

        const inputs =
            document.querySelectorAll(
                "[data-dictionary-search]"
            );

        inputs.forEach(input => {

            input.addEventListener(
                "input",
                BAWABET.helpers.debounce(
                    () => {

                        this.state.query =
                            input.value
                                .trim()
                                .toLowerCase();

                        this.render();

                    },
                    250
                )
            );

        });
    },


    /* =====================================================
       CATEGORY FILTER
    ===================================================== */

    initCategoryFilter() {

        const filters =
            document.querySelectorAll(
                "[data-dictionary-category]"
            );

        filters.forEach(filter => {

            filter.addEventListener(
                "click",
                () => {

                    this.state.category =
                        filter.dataset
                            .dictionaryCategory ||
                        "all";

                    filters.forEach(item => {

                        item.classList.toggle(
                            "active",
                            item === filter
                        );

                    });

                    this.render();

                }
            );

        });
    },


    /* =====================================================
       CLEAR SEARCH
    ===================================================== */

    initClearButton() {

        const button =
            document.querySelector(
                "[data-dictionary-clear]"
            );

        if (!button) {
            return;
        }

        button.addEventListener(
            "click",
            () => {

                const input =
                    document.querySelector(
                        "[data-dictionary-search]"
                    );

                if (input) {
                    input.value = "";
                }

                this.state.query = "";

                this.render();

            }
        );
    },


    /* =====================================================
       GLOBAL EVENTS
    ===================================================== */

    initEvents() {

        document.addEventListener(
            "click",
            event => {

                const termButton =
                    event.target.closest(
                        "[data-dictionary-term]"
                    );

                if (termButton) {

                    const id =
                        termButton.dataset
                            .dictionaryTerm;

                    this.openTerm(id);

                    return;
                }


                const favoriteButton =
                    event.target.closest(
                        "[data-dictionary-favorite]"
                    );

                if (favoriteButton) {

                    const id =
                        favoriteButton.dataset
                            .dictionaryFavorite;

                    this.toggleFavorite(id);

                    return;
                }


                const closeButton =
                    event.target.closest(
                        "[data-dictionary-close]"
                    );

                if (closeButton) {

                    this.closeTerm();

                }

            }
        );


        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Escape" &&
                    this.state.currentTerm
                ) {

                    this.closeTerm();

                }

            }
        );
    },


    /* =====================================================
       FILTER TERMS
    ===================================================== */

    getFilteredTerms() {

        if (!this.data ||
            !Array.isArray(this.data.terms)
        ) {
            return [];
        }


        return this.data.terms.filter(
            term => {

                const categoryMatch =
                    this.state.category === "all" ||
                    term.category ===
                    this.state.category;


                if (!categoryMatch) {
                    return false;
                }


                if (!this.state.query) {
                    return true;
                }


                const searchable = [

                    term.term,

                    term.arabic,

                    term.shortDefinition,

                    term.definition,

                    ...(term.keywords || [])

                ]
                    .join(" ")
                    .toLowerCase();


                return searchable.includes(
                    this.state.query
                );

            }
        );
    },


    /* =====================================================
       RENDER
    ===================================================== */

    render() {

        const container =
            document.querySelector(
                "[data-dictionary-results]"
            );

        if (!container) {
            return;
        }


        const terms =
            this.getFilteredTerms();


        this.updateCount(terms.length);


        if (!terms.length) {

            container.innerHTML = `
                <div class="dictionary-empty">

                    <div class="dictionary-empty-icon">
                        🔎
                    </div>

                    <h3>
                        مفيش نتائج مطابقة
                    </h3>

                    <p>
                        جرّب كلمة مختلفة أو اختار قسم آخر.
                    </p>

                    <button
                        type="button"
                        class="btn btn-primary"
                        data-dictionary-clear
                    >
                        مسح البحث
                    </button>

                </div>
            `;

            return;
        }


        container.innerHTML =
            terms
                .map(term =>
                    this.createCard(term)
                )
                .join("");
    },


    /* =====================================================
       CREATE TERM CARD
    ===================================================== */

    createCard(term) {

        const favorite =
            this.state.favorites.includes(
                term.id
            );


        return `
            <article
                class="dictionary-card"
                data-term-id="${this.escape(
                    term.id
                )}"
            >

                <div class="dictionary-card-top">

                    <span class="dictionary-category">
                        ${this.getCategoryName(
                            term.category
                        )}
                    </span>

                    <button
                        type="button"
                        class="dictionary-favorite
                        ${favorite ? "active" : ""}"
                        data-dictionary-favorite="${this.escape(
                            term.id
                        )}"
                        aria-label="إضافة للمفضلة"
                    >
                        ${favorite ? "★" : "☆"}
                    </button>

                </div>


                <button
                    type="button"
                    class="dictionary-term-button"
                    data-dictionary-term="${this.escape(
                        term.id
                    )}"
                >

                    <span class="dictionary-term-en">
                        ${this.escape(
                            term.term
                        )}
                    </span>

                    <span class="dictionary-term-ar">
                        ${this.escape(
                            term.arabic
                        )}
                    </span>

                </button>


                <p class="dictionary-short-definition">

                    ${this.escape(
                        term.shortDefinition
                    )}

                </p>


                <span class="dictionary-read-more">

                    اقرأ التفاصيل

                    <span>
                        ←
                    </span>

                </span>

            </article>
        `;
    },


    /* =====================================================
       CATEGORY NAME
    ===================================================== */

    getCategoryName(id) {

        if (!this.data ||
            !Array.isArray(this.data.categories)
        ) {
            return "";
        }


        const category =
            this.data.categories.find(
                item => item.id === id
            );


        return category
            ? `${category.icon} ${category.name}`
            : "";
    },


    /* =====================================================
       OPEN TERM
    ===================================================== */

    openTerm(id) {

        if (!this.data) {
            return;
        }


        const term =
            this.data.terms.find(
                item => item.id === id
            );


        if (!term) {
            return;
        }


        this.state.currentTerm =
            term;


        let modal =
            document.querySelector(
                "[data-dictionary-modal]"
            );


        if (!modal) {

            modal =
                document.createElement("div");

            modal.className =
                "dictionary-modal";

            modal.dataset.dictionaryModal =
                "true";

            document.body.appendChild(modal);

        }


        modal.innerHTML = `

            <div
                class="dictionary-modal-overlay"
                data-dictionary-close
            ></div>

            <div
                class="dictionary-modal-content"
                role="dialog"
                aria-modal="true"
                aria-label="تفاصيل المصطلح"
            >

                <button
                    type="button"
                    class="dictionary-modal-close"
                    data-dictionary-close
                    aria-label="إغلاق"
                >
                    ✕
                </button>


                <div class="dictionary-modal-category">

                    ${this.getCategoryName(
                        term.category
                    )}

                </div>


                <h2>

                    ${this.escape(
                        term.term
                    )}

                </h2>


                <h3>

                    ${this.escape(
                        term.arabic
                    )}

                </h3>


                <div class="dictionary-definition">

                    <strong>
                        التعريف
                    </strong>

                    <p>

                        ${this.escape(
                            term.definition
                        )}

                    </p>

                </div>


                ${
                    term.keywords &&
                    term.keywords.length
                    ? `
                        <div class="dictionary-keywords">

                            <strong>
                                كلمات مرتبطة
                            </strong>

                            <div>

                                ${term.keywords
                                    .map(
                                        keyword => `
                                            <span>
                                                ${this.escape(
                                                    keyword
                                                )}
                                            </span>
                                        `
                                    )
                                    .join("")
                                }

                            </div>

                        </div>
                    `
                    : ""
                }


                <div class="dictionary-modal-actions">

                    <button
                        type="button"
                        class="btn btn-primary"
                        data-dictionary-favorite="${this.escape(
                            term.id
                        )}"
                    >
                        ${
                            this.state.favorites.includes(
                                term.id
                            )
                            ? "★ إزالة من المفضلة"
                            : "☆ إضافة للمفضلة"
                        }
                    </button>

                </div>

            </div>
        `;


        requestAnimationFrame(
            () => {
                modal.classList.add("open");
            }
        );


        document.body.classList.add(
            "dictionary-modal-open"
        );
    },


    /* =====================================================
       CLOSE TERM
    ===================================================== */

    closeTerm() {

        const modal =
            document.querySelector(
                "[data-dictionary-modal]"
            );


        if (!modal) {
            return;
        }


        modal.classList.remove("open");


        setTimeout(
            () => {

                if (modal.parentNode) {
                    modal.remove();
                }

            },
            250
        );


        document.body.classList.remove(
            "dictionary-modal-open"
        );


        this.state.currentTerm =
            null;
    },


    /* =====================================================
       FAVORITES
    ===================================================== */

    loadFavorites() {

        try {

            const key =
                BAWABET.helpers.storageKey(
                    "dictionary_favorites"
                );


            const saved =
                localStorage.getItem(key);


            this.state.favorites =
                saved
                    ? JSON.parse(saved)
                    : [];


            if (
                !Array.isArray(
                    this.state.favorites
                )
            ) {

                this.state.favorites = [];

            }

        } catch (error) {

            console.warn(
                "Unable to load dictionary favorites.",
                error
            );

            this.state.favorites = [];
        }
    },


    saveFavorites() {

        const key =
            BAWABET.helpers.storageKey(
                "dictionary_favorites"
            );


        localStorage.setItem(
            key,
            JSON.stringify(
                this.state.favorites
            )
        );
    },


    toggleFavorite(id) {

        const index =
            this.state.favorites.indexOf(id);


        if (index === -1) {

            this.state.favorites.push(id);

        } else {

            this.state.favorites.splice(
                index,
                1
            );

        }


        this.saveFavorites();


        this.render();


        if (
            this.state.currentTerm &&
            this.state.currentTerm.id === id
        ) {

            this.openTerm(id);

        }
    },


    /* =====================================================
       UPDATE RESULTS COUNT
    ===================================================== */

    updateCount(count) {

        const elements =
            document.querySelectorAll(
                "[data-dictionary-count]"
            );


        elements.forEach(
            element => {

                element.textContent =
                    count.toLocaleString("ar-EG");

            }
        );
    },


    /* =====================================================
       ERROR
    ===================================================== */

    showError() {

        const container =
            document.querySelector(
                "[data-dictionary-results]"
            );


        if (!container) {
            return;
        }


        container.innerHTML = `

            <div class="dictionary-error">

                <div>
                    ⚠️
                </div>

                <h3>
                    تعذر تحميل القاموس
                </h3>

                <p>
                    حاول تحديث الصفحة مرة أخرى.
                </p>

            </div>

        `;
    },


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    escape(value) {

        if (
            value === null ||
            value === undefined
        ) {
            return "";
        }


        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

};


/* =========================================================
   START
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        BAWABET_DICTIONARY.init();

    }
);


/* =========================================================
   GLOBAL ACCESS
========================================================= */

window.BAWABET_DICTIONARY =
    BAWABET_DICTIONARY;
