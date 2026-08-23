/* =========================================================
   BAWABET ALTAMREED
   DRUGS DATABASE ENGINE
   ========================================================= */

"use strict";


const BAWABET_DRUGS = {

    data: null,

    state: {
        query: "",
        category: "all",
        currentDrug: null,
        favorites: []
    },


    /* =====================================================
       INITIALIZE
       ===================================================== */

    async init() {

        const container =
            document.querySelector("[data-drugs]");

        if (!container) {
            return;
        }


        await this.loadData();

        if (!this.data) {
            return;
        }


        this.loadFavorites();

        this.initSearch();

        this.initCategoryFilter();

        this.initClearButton();

        this.initEvents();

        this.render();

    },


    /* =====================================================
       LOAD DATABASE
       ===================================================== */

    async loadData() {

        try {

            const response =
                await fetch("data/drugs.json");


            if (!response.ok) {

                throw new Error(
                    `HTTP ${response.status}`
                );

            }


            this.data =
                await response.json();


        } catch (error) {

            console.error(
                "Drugs database loading error:",
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
                "[data-drugs-search]"
            );


        inputs.forEach(input => {

            input.addEventListener(
                "input",
                this.debounce(
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

        const buttons =
            document.querySelectorAll(
                "[data-drug-category]"
            );


        buttons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    this.state.category =
                        button.dataset
                            .drugCategory ||
                        "all";


                    buttons.forEach(item => {

                        item.classList.toggle(
                            "active",
                            item === button
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
                "[data-drugs-clear]"
            );


        if (!button) {
            return;
        }


        button.addEventListener(
            "click",
            () => {

                const input =
                    document.querySelector(
                        "[data-drugs-search]"
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
       EVENTS
       ===================================================== */

    initEvents() {

        document.addEventListener(
            "click",
            event => {


                /* OPEN DRUG */

                const drugButton =
                    event.target.closest(
                        "[data-drug-id]"
                    );


                if (
                    drugButton &&
                    !event.target.closest(
                        "[data-drug-favorite]"
                    )
                ) {

                    const id =
                        drugButton.dataset.drugId;


                    this.openDrug(id);


                    return;

                }


                /* FAVORITE */

                const favoriteButton =
                    event.target.closest(
                        "[data-drug-favorite]"
                    );


                if (favoriteButton) {

                    const id =
                        favoriteButton.dataset
                            .drugFavorite;


                    this.toggleFavorite(id);


                    return;

                }


                /* CLOSE */

                const closeButton =
                    event.target.closest(
                        "[data-drug-close]"
                    );


                if (closeButton) {

                    this.closeDrug();

                }

            }
        );


        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Escape" &&
                    this.state.currentDrug
                ) {

                    this.closeDrug();

                }

            }
        );

    },


    /* =====================================================
       FILTER DATABASE
       ===================================================== */

    getFilteredDrugs() {

        if (
            !this.data ||
            !Array.isArray(this.data.drugs)
        ) {

            return [];

        }


        return this.data.drugs.filter(
            drug => {


                /* CATEGORY */

                const categoryMatch =
                    this.state.category === "all" ||
                    drug.category ===
                    this.state.category;


                if (!categoryMatch) {
                    return false;
                }


                /* SEARCH */

                if (!this.state.query) {
                    return true;
                }


                const searchable = [

                    drug.genericName,

                    drug.arabicName,

                    drug.drugClass,

                    drug.description,

                    ...(drug.brandNames || []),

                    ...(drug.keywords || [])

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
                "[data-drugs-results]"
            );


        if (!container) {
            return;
        }


        const drugs =
            this.getFilteredDrugs();


        this.updateCount(
            drugs.length
        );


        if (!drugs.length) {

            container.innerHTML = `

                <div class="drugs-empty">

                    <div class="drugs-empty-icon">
                        💊
                    </div>

                    <h3>
                        لم نجد دواء مطابقًا
                    </h3>

                    <p>
                        جرّب كتابة الاسم العلمي
                        أو التجاري أو كلمة مرتبطة بالدواء.
                    </p>

                    <button
                        type="button"
                        class="btn btn-primary"
                        data-drugs-clear
                    >
                        مسح البحث
                    </button>

                </div>

            `;

            return;
        }


        container.innerHTML =
            drugs
                .map(
                    drug =>
                        this.createCard(drug)
                )
                .join("");

    },


    /* =====================================================
       CREATE DRUG CARD
       ===================================================== */

    createCard(drug) {

        const favorite =
            this.state.favorites.includes(
                drug.id
            );


        return `

            <article
                class="drug-card"
                data-drug-id="${this.escape(
                    drug.id
                )}"
            >

                <div class="drug-card-top">

                    <span class="drug-category">

                        ${this.getCategoryName(
                            drug.category
                        )}

                    </span>


                    <button
                        type="button"
                        class="drug-favorite ${
                            favorite
                                ? "active"
                                : ""
                        }"
                        data-drug-favorite="${this.escape(
                            drug.id
                        )}"
                        aria-label="إضافة للمفضلة"
                    >

                        ${
                            favorite
                                ? "★"
                                : "☆"
                        }

                    </button>

                </div>


                <div class="drug-card-body">

                    <span class="drug-generic-name">

                        ${this.escape(
                            drug.genericName
                        )}

                    </span>


                    <h3>

                        ${this.escape(
                            drug.arabicName
                        )}

                    </h3>


                    <span class="drug-class">

                        ${this.escape(
                            drug.drugClass
                        )}

                    </span>


                    <p>

                        ${this.escape(
                            drug.description
                        )}

                    </p>

                </div>


                <div class="drug-card-footer">

                    <span>
                        عرض التفاصيل
                    </span>

                    <span>
                        ←
                    </span>

                </div>

            </article>

        `;

    },


    /* =====================================================
       CATEGORY NAME
       ===================================================== */

    getCategoryName(id) {

        if (
            !this.data ||
            !Array.isArray(
                this.data.categories
            )
        ) {

            return "";

        }


        const category =
            this.data.categories.find(
                item =>
                    item.id === id
            );


        if (!category) {
            return "";
        }


        return `
            ${category.icon}
            ${this.escape(
                category.name
            )}
        `;

    },


    /* =====================================================
       OPEN DRUG
       ===================================================== */

    openDrug(id) {

        if (!this.data) {
            return;
        }


        const drug =
            this.data.drugs.find(
                item =>
                    item.id === id
            );


        if (!drug) {
            return;
        }


        this.state.currentDrug =
            drug;


        let modal =
            document.querySelector(
                "[data-drug-modal]"
            );


        if (!modal) {

            modal =
                document.createElement(
                    "div"
                );


            modal.className =
                "drug-modal";


            modal.dataset.drugModal =
                "true";


            document.body.appendChild(
                modal
            );

        }


        const favorite =
            this.state.favorites.includes(
                drug.id
            );


        modal.innerHTML = `

            <div
                class="drug-modal-overlay"
                data-drug-close
            ></div>


            <div
                class="drug-modal-content"
                role="dialog"
                aria-modal="true"
                aria-label="معلومات الدواء"
            >

                <button
                    type="button"
                    class="drug-modal-close"
                    data-drug-close
                    aria-label="إغلاق"
                >
                    ✕
                </button>


                <div class="drug-modal-header">

                    <span class="drug-modal-category">

                        ${this.getCategoryName(
                            drug.category
                        )}

                    </span>


                    <h2>

                        ${this.escape(
                            drug.genericName
                        )}

                    </h2>


                    <h3>

                        ${this.escape(
                            drug.arabicName
                        )}

                    </h3>


                    <span class="drug-modal-class">

                        ${this.escape(
                            drug.drugClass
                        )}

                    </span>

                </div>


                <div class="drug-section">

                    <h4>
                        📌 نبذة عن الدواء
                    </h4>

                    <p>

                        ${this.escape(
                            drug.description
                        )}

                    </p>

                </div>


                ${
                    this.createListSection(
                        "🩺 الاستخدامات",
                        drug.uses
                    )
                }


                ${
                    this.createListSection(
                        "💊 الأشكال الدوائية",
                        drug.forms
                    )
                }


                ${
                    this.createListSection(
                        "🛣️ طرق الإعطاء المذكورة",
                        drug.routeExamples
                    )
                }


                ${
                    this.createListSection(
                        "⚠️ تحذيرات مهمة",
                        drug.importantWarnings
                    )
                }


                ${
                    this.createListSection(
                        "📋 آثار جانبية شائعة",
                        drug.commonSideEffects
                    )
                }


                ${
                    this.createListSection(
                        "🩺 ملاحظات تمريضية",
                        drug.nursingNotes
                    )
                }


                <div class="drug-disclaimer">

                    <strong>
                        ⚠️ تنبيه
                    </strong>

                    <p>

                        هذه المعلومات تعليمية فقط
                        ولا تُستخدم بدلًا من وصفة الطبيب
                        أو استشارة الطبيب أو الصيدلي.

                    </p>

                </div>


                <div class="drug-modal-actions">

                    <button
                        type="button"
                        class="btn btn-primary"
                        data-drug-favorite="${this.escape(
                            drug.id
                        )}"
                    >

                        ${
                            favorite
                                ? "★ إزالة من المفضلة"
                                : "☆ إضافة للمفضلة"
                        }

                    </button>

                </div>

            </div>

        `;


        requestAnimationFrame(
            () => {

                modal.classList.add(
                    "open"
                );

            }
        );


        document.body.classList.add(
            "drug-modal-open"
        );

    },


    /* =====================================================
       CREATE LIST SECTION
       ===================================================== */

    createListSection(title, items) {

        if (
            !Array.isArray(items) ||
            !items.length
        ) {

            return "";

        }


        return `

            <section class="drug-section">

                <h4>
                    ${title}
                </h4>

                <ul>

                    ${items
                        .map(
                            item => `
                                <li>
                                    ${this.escape(
                                        item
                                    )}
                                </li>
                            `
                        )
                        .join("")
                    }

                </ul>

            </section>

        `;

    },


    /* =====================================================
       CLOSE
       ===================================================== */

    closeDrug() {

        const modal =
            document.querySelector(
                "[data-drug-modal]"
            );


        if (!modal) {
            return;
        }


        modal.classList.remove(
            "open"
        );


        setTimeout(
            () => {

                if (modal.parentNode) {
                    modal.remove();
                }

            },
            250
        );


        document.body.classList.remove(
            "drug-modal-open"
        );


        this.state.currentDrug =
            null;

    },


    /* =====================================================
       FAVORITES
       ===================================================== */

    loadFavorites() {

        try {

            const key =
                this.storageKey(
                    "drug_favorites"
                );


            const saved =
                localStorage.getItem(
                    key
                );


            this.state.favorites =
                saved
                    ? JSON.parse(saved)
                    : [];


            if (
                !Array.isArray(
                    this.state.favorites
                )
            ) {

                this.state.favorites =
                    [];

            }

        } catch (error) {

            console.warn(
                "Could not load drug favorites.",
                error
            );


            this.state.favorites =
                [];

        }

    },


    saveFavorites() {

        localStorage.setItem(

            this.storageKey(
                "drug_favorites"
            ),

            JSON.stringify(
                this.state.favorites
            )

        );

    },


    toggleFavorite(id) {

        const index =
            this.state.favorites.indexOf(
                id
            );


        if (index === -1) {

            this.state.favorites.push(
                id
            );

        } else {

            this.state.favorites.splice(
                index,
                1
            );

        }


        this.saveFavorites();


        this.render();


        if (
            this.state.currentDrug &&
            this.state.currentDrug.id === id
        ) {

            this.openDrug(id);

        }

    },


    /* =====================================================
       COUNT
       ===================================================== */

    updateCount(count) {

        document
            .querySelectorAll(
                "[data-drugs-count]"
            )
            .forEach(
                element => {

                    element.textContent =
                        count.toLocaleString(
                            "ar-EG"
                        );

                }
            );

    },


    /* =====================================================
       ERROR
       ===================================================== */

    showError() {

        const container =
            document.querySelector(
                "[data-drugs-results]"
            );


        if (!container) {
            return;
        }


        container.innerHTML = `

            <div class="drugs-error">

                <div>
                    ⚠️
                </div>

                <h3>
                    تعذر تحميل قاعدة الأدوية
                </h3>

                <p>
                    حاول تحديث الصفحة مرة أخرى.
                </p>

            </div>

        `;

    },


    /* =====================================================
       STORAGE KEY
       ===================================================== */

    storageKey(value) {

        return `bawabet_altamreed_${value}`;

    },


    /* =====================================================
       DEBOUNCE
       ===================================================== */

    debounce(callback, delay = 250) {

        let timer;


        return (...args) => {

            clearTimeout(timer);


            timer =
                setTimeout(
                    () => {

                        callback(
                            ...args
                        );

                    },
                    delay
                );

        };

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

            .replaceAll(
                "&",
                "&amp;"
            )

            .replaceAll(
                "<",
                "&lt;"
            )

            .replaceAll(
                ">",
                "&gt;"
            )

            .replaceAll(
                '"',
                "&quot;"
            )

            .replaceAll(
                "'",
                "&#039;"
            );

    }

};


/* =========================================================
   START
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        BAWABET_DRUGS.init();

    }
);


/* =========================================================
   GLOBAL ACCESS
   ========================================================= */

window.BAWABET_DRUGS =
    BAWABET_DRUGS;
