/* =========================================================
   بوابة التمريض - Drug Center
   Main Drug Database Engine
   Database: data/drugs.json
========================================================= */

"use strict";


/* =========================================================
   DATABASE
========================================================= */

const DRUG_DATABASE_URL = "data/drugs.json";

let allDrugs = [];

let filteredDrugs = [];

let currentPage = 1;

const RESULTS_PER_PAGE = 24;


/* =========================================================
   DOM ELEMENTS
========================================================= */

const searchForm =
    document.getElementById(
        "drugSearchForm"
    );


const searchInput =
    document.getElementById(
        "drugSearchInput"
    );


const searchSuggestions =
    document.getElementById(
        "drugSuggestions"
    );


const resultsContainer =
    document.getElementById(
        "drugDatabase"
    );


const resultsCount =
    document.getElementById(
        "drugResultsCount"
    );


const categoryFilter =
    document.getElementById(
        "drugCategoryFilter"
    );


const formFilter =
    document.getElementById(
        "drugFormFilter"
    );


const sortSelect =
    document.getElementById(
        "drugSort"
    );


const clearFiltersButton =
    document.getElementById(
        "clearDrugFilters"
    );


const popularContainer =
    document.getElementById(
        "popularDrugs"
    );


const drugCountElement =
    document.getElementById(
        "drugCount"
    );


const ingredientCountElement =
    document.getElementById(
        "ingredientCount"
    );


const categoryCountElement =
    document.getElementById(
        "categoryCount"
    );


/* =========================================================
   HELPERS
========================================================= */

function cleanText(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value).trim();

}


/* =========================================================
   ARABIC NORMALIZATION
========================================================= */

function normalizeArabic(text) {

    if (!text) {

        return "";

    }


    return String(text)

        .toLowerCase()

        .replace(/[أإآ]/g, "ا")

        .replace(/ى/g, "ي")

        .replace(/ة/g, "ه")

        .replace(/ؤ/g, "و")

        .replace(/ئ/g, "ي")

        .replace(/ـ/g, "")

        .replace(/[ًٌٍَُِّْ]/g, "")

        .replace(/\s+/g, " ")

        .trim();

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return cleanText(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


/* =========================================================
   DRUG FIELDS
========================================================= */

function getDrugName(drug) {

    return cleanText(

        drug.commercial_name_ar ||

        drug.name_ar ||

        drug.arabic_name ||

        ""

    );

}


function getDrugEnglishName(drug) {

    return cleanText(

        drug.commercial_name_en ||

        drug.name_en ||

        drug.english_name ||

        ""

    );

}


function getScientificName(drug) {

    return cleanText(

        drug.scientific_name ||

        drug.active_ingredient ||

        drug.active_ingredients ||

        drug.generic_name ||

        ""

    );

}


function getManufacturer(drug) {

    return cleanText(

        drug.manufacturer ||

        drug.company ||

        drug.company_name ||

        ""

    );

}


function getDrugClass(drug) {

    return cleanText(

        drug.drug_class ||

        drug.classification ||

        drug.category ||

        ""

    );

}


function getRoute(drug) {

    return cleanText(

        drug.route ||

        drug.administration_route ||

        ""

    );

}


function getPrice(drug) {

    return cleanText(

        drug.price_egp ||

        drug.price ||

        ""

    );

}


function getDrugForm(drug) {

    return cleanText(

        drug.dosage_form ||

        drug.form ||

        drug.pharmaceutical_form ||

        drug.form_name ||

        ""

    );

}


/* =========================================================
   SEARCH TEXT
========================================================= */

function buildSearchText(drug) {

    return normalizeArabic(

        [

            getDrugName(drug),

            getDrugEnglishName(drug),

            getScientificName(drug),

            getManufacturer(drug),

            getDrugClass(drug),

            getRoute(drug),

            getDrugForm(drug)

        ].join(" ")

    );

}


/* =========================================================
   UNIQUE VALUES
========================================================= */

function getUniqueValues(
    drugs,
    getter
) {

    const values = new Set();


    drugs.forEach(
        drug => {

            const value =
                cleanText(
                    getter(drug)
                );


            if (value) {

                values.add(value);

            }

        }
    );


    return Array.from(values);

}


/* =========================================================
   LOAD DATABASE
========================================================= */

async function loadDrugDatabase() {

    try {

        if (resultsContainer) {

            resultsContainer.innerHTML = `

                <div class="database-placeholder">

                    <div class="database-placeholder-icon">
                        ⏳
                    </div>

                    <h3>
                        جاري تحميل قاعدة البيانات...
                    </h3>

                    <p>
                        لحظات ويتم تحميل بيانات الأدوية.
                    </p>

                </div>

            `;

        }


        const response =
            await fetch(
                DRUG_DATABASE_URL,
                {
                    cache: "default"
                }
            );


        if (!response.ok) {

            throw new Error(
                "تعذر تحميل ملف قاعدة البيانات."
            );

        }


        const data =
            await response.json();


        if (!Array.isArray(data)) {

            throw new Error(
                "تنسيق قاعدة البيانات غير صحيح."
            );

        }


        allDrugs =
            data.map(
                (drug, index) => {

                    return {

                        ...drug,

                        _id:
                            drug.id ||
                            drug.ID ||
                            `drug-${index + 1}`,

                        _searchText:
                            buildSearchText(drug)

                    };

                }
            );


        filteredDrugs =
            [...allDrugs];


        updateStatistics();

        populateCategoryFilter();

        populateFormFilter();

        renderPopularDrugs();

        updateResults();


        loadSearchFromURL();


        console.log(
            `Drug Database Loaded: ${allDrugs.length} records`
        );


    } catch (error) {

        console.error(
            "Drug Database Error:",
            error
        );


        showDatabaseError(
            error
        );

    }

}


/* =========================================================
   STATISTICS
========================================================= */

function updateStatistics() {

    if (drugCountElement) {

        drugCountElement.textContent =
            allDrugs.length.toLocaleString(
                "ar-EG"
            );

    }


    const ingredients =
        new Set();


    allDrugs.forEach(
        drug => {

            const ingredient =
                normalizeArabic(
                    getScientificName(drug)
                );


            if (ingredient) {

                ingredients.add(
                    ingredient
                );

            }

        }
    );


    if (ingredientCountElement) {

        ingredientCountElement.textContent =
            ingredients.size.toLocaleString(
                "ar-EG"
            );

    }


    const categories =
        new Set();


    allDrugs.forEach(
        drug => {

            const category =
                cleanText(
                    getDrugClass(drug)
                );


            if (category) {

                categories.add(
                    category
                );

            }

        }
    );


    if (categoryCountElement) {

        categoryCountElement.textContent =
            categories.size.toLocaleString(
                "ar-EG"
            );

    }

}


/* =========================================================
   CATEGORY FILTER
========================================================= */

function populateCategoryFilter() {

    if (!categoryFilter) {

        return;

    }


    const categories =
        getUniqueValues(
            allDrugs,
            getDrugClass
        );


    categories.sort(
        (a, b) =>
            a.localeCompare(
                b,
                "ar"
            )
    );


    categoryFilter.innerHTML = `

        <option value="all">
            كل التصنيفات
        </option>

    `;


    categories.forEach(
        category => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                category;


            option.textContent =
                category;


            categoryFilter.appendChild(
                option
            );

        }
    );

}


/* =========================================================
   FORM FILTER
========================================================= */

function populateFormFilter() {

    if (!formFilter) {

        return;

    }


    const forms =
        getUniqueValues(
            allDrugs,
            getDrugForm
        );


    forms.sort(
        (a, b) =>
            a.localeCompare(
                b,
                "ar"
            )
    );


    formFilter.innerHTML = `

        <option value="all">
            كل الأشكال الدوائية
        </option>

    `;


    forms.forEach(
        form => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                form;


            option.textContent =
                form;


            formFilter.appendChild(
                option
            );

        }
    );

}


/* =========================================================
   SEARCH
========================================================= */

function searchDrugs(query) {

    const normalizedQuery =
        normalizeArabic(
            query
        );


    let results =
        [...allDrugs];


    if (normalizedQuery) {

        const words =
            normalizedQuery
                .split(" ")
                .filter(Boolean);


        results =
            allDrugs.filter(
                drug => {

                    return words.every(
                        word =>
                            drug._searchText.includes(
                                word
                            )
                    );

                }
            );

    }


    filteredDrugs =
        applyFilters(
            results
        );


    sortResults();


    currentPage = 1;


    updateResults();


    showSuggestions(
        query
    );

}


/* =========================================================
   FILTERS
========================================================= */

function applyFilters(
    drugs
) {

    let results =
        [...drugs];


    if (
        categoryFilter &&
        categoryFilter.value !== "all"
    ) {

        const selectedCategory =
            normalizeArabic(
                categoryFilter.value
            );


        results =
            results.filter(
                drug =>
                    normalizeArabic(
                        getDrugClass(drug)
                    ) ===
                    selectedCategory
            );

    }


    if (
        formFilter &&
        formFilter.value !== "all"
    ) {

        const selectedForm =
            normalizeArabic(
                formFilter.value
            );


        results =
            results.filter(
                drug =>
                    normalizeArabic(
                        getDrugForm(drug)
                    ) ===
                    selectedForm
            );

    }


    return results;

}


/* =========================================================
   APPLY ALL FILTERS
========================================================= */

function refreshResults() {

    const query =
        searchInput
            ?
            searchInput.value
            :
            "";


    const normalizedQuery =
        normalizeArabic(
            query
        );


    let results;


    if (normalizedQuery) {

        const words =
            normalizedQuery
                .split(" ")
                .filter(Boolean);


        results =
            allDrugs.filter(
                drug =>
                    words.every(
                        word =>
                            drug._searchText.includes(
                                word
                            )
                    )
            );

    } else {

        results =
            [...allDrugs];

    }


    filteredDrugs =
        applyFilters(
            results
        );


    sortResults();


    currentPage = 1;


    updateResults();

}


/* =========================================================
   SORT
========================================================= */

function sortResults() {

    const sortType =
        sortSelect
            ?
            sortSelect.value
            :
            "name";


    if (
        sortType ===
        "popular"
    ) {

        filteredDrugs.sort(
            (a, b) => {

                const aPopularity =
                    Number(
                        a.popularity ||
                        a.views ||
                        a.search_count ||
                        0
                    );


                const bPopularity =
                    Number(
                        b.popularity ||
                        b.views ||
                        b.search_count ||
                        0
                    );


                if (
                    bPopularity !==
                    aPopularity
                ) {

                    return (
                        bPopularity -
                        aPopularity
                    );

                }


                return compareDrugNames(
                    a,
                    b
                );

            }
        );


        return;

    }


    filteredDrugs.sort(
        compareDrugNames
    );

}


/* =========================================================
   NAME COMPARISON
========================================================= */

function compareDrugNames(
    a,
    b
) {

    const aName =
        normalizeArabic(
            getDrugName(a) ||
            getDrugEnglishName(a)
        );


    const bName =
        normalizeArabic(
            getDrugName(b) ||
            getDrugEnglishName(b)
        );


    return aName.localeCompare(
        bName,
        "ar"
    );

}


/* =========================================================
   UPDATE RESULTS
========================================================= */

function updateResults() {

    if (resultsCount) {

        resultsCount.textContent =
            `${filteredDrugs.length.toLocaleString(
                "ar-EG"
            )} دواء`;

    }


    renderResults();

}


/* =========================================================
   RENDER RESULTS
========================================================= */

function renderResults() {

    if (!resultsContainer) {

        return;

    }


    const start =
        (
            currentPage -
            1
        ) *
        RESULTS_PER_PAGE;


    const end =
        start +
        RESULTS_PER_PAGE;


    const pageResults =
        filteredDrugs.slice(
            start,
            end
        );


    if (
        filteredDrugs.length === 0
    ) {

        resultsContainer.innerHTML = `

            <div class="database-placeholder">

                <div class="database-placeholder-icon">
                    🔎
                </div>

                <h3>
                    لم يتم العثور على أدوية
                </h3>

                <p>
                    جرب البحث باسم مختلف أو قم بإزالة
                    بعض الفلاتر.
                </p>

            </div>

        `;


        return;

    }


    const fragment =
        document.createDocumentFragment();


    pageResults.forEach(
        drug => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "drug-card";


            card.innerHTML = `

                <div class="drug-card-top">

                    <div class="drug-card-icon">
                        💊
                    </div>

                    ${
                        getDrugClass(drug)
                        ?
                        `
                        <span class="drug-card-class">
                            ${escapeHTML(
                                getDrugClass(drug)
                            )}
                        </span>
                        `
                        :
                        ""
                    }

                </div>


                <h3>
                    ${escapeHTML(
                        getDrugName(drug) ||
                        getDrugEnglishName(drug) ||
                        "دواء"
                    )}
                </h3>


                ${
                    getDrugEnglishName(drug)
                    ?
                    `
                    <p class="drug-card-generic">
                        ${escapeHTML(
                            getDrugEnglishName(drug)
                        )}
                    </p>
                    `
                    :
                    ""
                }


                <div class="drug-card-info">

                    ${
                        getScientificName(drug)
                        ?
                        `
                        <div class="drug-info-item">

                            <span>
                                المادة الفعالة
                            </span>

                            <strong>
                                ${escapeHTML(
                                    getScientificName(drug)
                                )}
                            </strong>

                        </div>
                        `
                        :
                        ""
                    }


                    ${
                        getManufacturer(drug)
                        ?
                        `
                        <div class="drug-info-item">

                            <span>
                                الشركة
                            </span>

                            <strong>
                                ${escapeHTML(
                                    getManufacturer(drug)
                                )}
                            </strong>

                        </div>
                        `
                        :
                        ""
                    }


                    ${
                        getDrugForm(drug)
                        ?
                        `
                        <div class="drug-info-item">

                            <span>
                                الشكل الدوائي
                            </span>

                            <strong>
                                ${escapeHTML(
                                    getDrugForm(drug)
                                )}
                            </strong>

                        </div>
                        `
                        :
                        ""
                    }


                    ${
                        getRoute(drug)
                        ?
                        `
                        <div class="drug-info-item">

                            <span>
                                طريق الاستخدام
                            </span>

                            <strong>
                                ${escapeHTML(
                                    getRoute(drug)
                                )}
                            </strong>

                        </div>
                        `
                        :
                        ""
                    }

                </div>


                ${
                    getPrice(drug)
                    ?
                    `
                    <div class="drug-price">
                        ${escapeHTML(
                            getPrice(drug)
                        )}
                        جنيه
                    </div>
                    `
                    :
                    ""
                }


                <button
                    type="button"
                    class="drug-card-button"
                >
                    عرض التفاصيل
                </button>

            `;


            const detailsButton =
                card.querySelector(
                    ".drug-card-button"
                );


            if (detailsButton) {

                detailsButton.addEventListener(
                    "click",
                    () => {

                        openDrugDetails(
                            drug
                        );

                    }
                );

            }


            fragment.appendChild(
                card
            );

        }
    );


    resultsContainer.innerHTML = "";


    resultsContainer.appendChild(
        fragment
    );


    renderPagination();

}


/* =========================================================
   PAGINATION
========================================================= */

function renderPagination() {

    const oldPagination =
        document.getElementById(
            "drugPagination"
        );


    if (oldPagination) {

        oldPagination.remove();

    }


    const totalPages =
        Math.ceil(
            filteredDrugs.length /
            RESULTS_PER_PAGE
        );


    if (
        totalPages <= 1
    ) {

        return;

    }


    const pagination =
        document.createElement(
            "div"
        );


    pagination.id =
        "drugPagination";


    pagination.style.display =
        "flex";


    pagination.style.justifyContent =
        "center";


    pagination.style.alignItems =
        "center";


    pagination.style.gap =
        "7px";


    pagination.style.flexWrap =
        "wrap";


    pagination.style.marginTop =
        "25px";


    const previous =
        createPaginationButton(
            "السابق",
            currentPage > 1
        );


    previous.addEventListener(
        "click",
        () => {

            if (
                currentPage > 1
            ) {

                currentPage--;

                renderResults();

                scrollToResults();

            }

        }
    );


    pagination.appendChild(
        previous
    );


    let startPage =
        Math.max(
            1,
            currentPage - 2
        );


    let endPage =
        Math.min(
            totalPages,
            currentPage + 2
        );


    if (
        currentPage <= 3
    ) {

        endPage =
            Math.min(
                totalPages,
                5
            );

    }


    if (
        currentPage >=
        totalPages - 2
    ) {

        startPage =
            Math.max(
                1,
                totalPages - 4
            );

    }


    for (
        let page = startPage;
        page <= endPage;
        page++
    ) {

        const button =
            createPaginationButton(
                page,
                true
            );


        if (
            page === currentPage
        ) {

            button.classList.add(
                "active"
            );

            button.style.background =
                "#0c3555";

            button.style.color =
                "#ffffff";

        }


        button.addEventListener(
            "click",
            () => {

                currentPage =
                    page;

                renderResults();

                scrollToResults();

            }
        );


        pagination.appendChild(
            button
        );

    }


    const next =
        createPaginationButton(
            "التالي",
            currentPage < totalPages
        );


    next.addEventListener(
        "click",
        () => {

            if (
                currentPage <
                totalPages
            ) {

                currentPage++;

                renderResults();

                scrollToResults();

            }

        }
    );


    pagination.appendChild(
        next
    );


    resultsContainer.parentNode.insertBefore(
        pagination,
        resultsContainer.nextSibling
    );

}


/* =========================================================
   PAGINATION BUTTON
========================================================= */

function createPaginationButton(
    text,
    enabled
) {

    const button =
        document.createElement(
            "button"
        );


    button.type =
        "button";


    button.textContent =
        text;


    button.disabled =
        !enabled;


    button.style.padding =
        "8px 12px";


    button.style.border =
        "1px solid #dce6ea";


    button.style.borderRadius =
        "9px";


    button.style.background =
        "#ffffff";


    button.style.color =
        "#45606e";


    button.style.fontFamily =
        "inherit";


    button.style.cursor =
        enabled
            ?
            "pointer"
            :
            "not-allowed";


    return button;

}


/* =========================================================
   POPULAR DRUGS
========================================================= */

function renderPopularDrugs() {

    if (!popularContainer) {

        return;

    }


    if (
        allDrugs.length === 0
    ) {

        return;

    }


    const popularNames = [

        "paracetamol",

        "panadol",

        "amoxicillin",

        "omeprazole",

        "ceftriaxone",

        "diclofenac",

        "metformin",

        "azithromycin"

    ];


    const popularDrugs = [];


    popularNames.forEach(
        name => {

            const found =
                allDrugs.find(
                    drug => {

                        const text =
                            normalizeArabic(
                                [
                                    getDrugName(drug),

                                    getDrugEnglishName(drug),

                                    getScientificName(drug)

                                ].join(" ")
                            );


                        return text.includes(
                            normalizeArabic(
                                name
                            )
                        );

                    }
                );


            if (
                found &&
                !popularDrugs.includes(
                    found
                )
            ) {

                popularDrugs.push(
                    found
                );

            }

        }
    );


    if (
        popularDrugs.length === 0
    ) {

        return;

    }


    const displayDrugs =
        popularDrugs.slice(
            0,
            4
        );


    popularContainer.innerHTML = "";


    displayDrugs.forEach(
        drug => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "popular-drug-card";


            card.innerHTML = `

                <div class="popular-drug-icon">
                    💊
                </div>


                <h3>
                    ${escapeHTML(
                        getDrugName(drug) ||
                        getDrugEnglishName(drug) ||
                        "دواء"
                    )}
                </h3>


                <p>

                    ${
                        getDrugEnglishName(drug)
                        ?
                        escapeHTML(
                            getDrugEnglishName(drug)
                        )
                        :
                        getScientificName(drug)
                        ?
                        escapeHTML(
                            getScientificName(drug)
                        )
                        :
                        "معلومات دوائية"

                    }

                </p>


                ${
                    getDrugClass(drug)
                    ?
                    `
                    <span class="drug-tag">
                        ${escapeHTML(
                            getDrugClass(drug)
                        )}
                    </span>
                    `
                    :
                    `
                    <span class="drug-tag">
                        Drug Database
                    </span>
                    `
                }

            `;


            card.style.cursor =
                "pointer";


            card.addEventListener(
                "click",
                () => {

                    openDrugDetails(
                        drug
                    );

                }
            );


            popularContainer.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   SEARCH SUGGESTIONS
========================================================= */

function showSuggestions(
    query
) {

    if (!searchSuggestions) {

        return;

    }


    const normalizedQuery =
        normalizeArabic(
            query
        );


    if (
        normalizedQuery.length < 2
    ) {

        hideSuggestions();

        return;

    }


    const suggestions =
        allDrugs

            .filter(
                drug =>
                    drug._searchText.includes(
                        normalizedQuery
                    )
            )

            .sort(
                (a, b) => {

                    const aName =
                        normalizeArabic(
                            getDrugName(a) ||
                            getDrugEnglishName(a)
                        );


                    const bName =
                        normalizeArabic(
                            getDrugName(b) ||
                            getDrugEnglishName(b)
                        );


                    const aStart =
                        aName.startsWith(
                            normalizedQuery
                        );


                    const bStart =
                        bName.startsWith(
                            normalizedQuery
                        );


                    if (
                        aStart &&
                        !bStart
                    ) {

                        return -1;

                    }


                    if (
                        !aStart &&
                        bStart
                    ) {

                        return 1;

                    }


                    return aName.localeCompare(
                        bName,
                        "ar"
                    );

                }
            )

            .slice(
                0,
                6
            );


    if (
        suggestions.length === 0
    ) {

        hideSuggestions();

        return;

    }


    searchSuggestions.innerHTML =
        "";


    suggestions.forEach(
        drug => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "suggestion-item";


            item.innerHTML = `

                <div class="suggestion-icon">
                    💊
                </div>

                <div>

                    <div class="suggestion-name">
                        ${escapeHTML(
                            getDrugName(drug) ||
                            getDrugEnglishName(drug)
                        )}
                    </div>

                    ${
                        getScientificName(drug)
                        ?
                        `
                        <span class="suggestion-generic">
                            ${escapeHTML(
                                getScientificName(drug)
                            )}
                        </span>
                        `
                        :
                        ""
                    }

                </div>

            `;


            item.addEventListener(
                "click",
                () => {

                    searchInput.value =
                        getDrugName(drug) ||
                        getDrugEnglishName(drug);


                    hideSuggestions();


                    refreshResults();


                    document
                        .getElementById(
                            "database"
                        )
                        ?.scrollIntoView(
                            {
                                behavior:
                                    "smooth"
                            }
                        );

                }
            );


            searchSuggestions.appendChild(
                item
            );

        }
    );


    searchSuggestions.classList.add(
        "show"
    );

}


/* =========================================================
   HIDE SUGGESTIONS
========================================================= */

function hideSuggestions() {

    if (!searchSuggestions) {

        return;

    }


    searchSuggestions.classList.remove(
        "show"
    );

}


/* =========================================================
   DRUG DETAILS MODAL
========================================================= */

function openDrugDetails(
    drug
) {

    const modal =
        document.createElement(
            "div"
        );


    modal.className =
        "drug-modal";


    modal.innerHTML = `

        <div
            class="drug-modal-overlay"
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
                aria-label="إغلاق"
            >
                ×
            </button>


            <div class="drug-modal-header">

                <div class="drug-modal-icon">
                    💊
                </div>


                <div>

                    <h2>
                        ${escapeHTML(
                            getDrugName(drug) ||
                            getDrugEnglishName(drug) ||
                            "دواء"
                        )}
                    </h2>


                    ${
                        getDrugEnglishName(drug)
                        ?
                        `
                        <p>
                            ${escapeHTML(
                                getDrugEnglishName(drug)
                            )}
                        </p>
                        `
                        :
                        ""
                    }

                </div>

            </div>


            <div class="drug-details-grid">

                ${detailRow(
                    "المادة الفعالة",
                    getScientificName(drug)
                )}


                ${detailRow(
                    "الشركة المصنعة",
                    getManufacturer(drug)
                )}


                ${detailRow(
                    "التصنيف الدوائي",
                    getDrugClass(drug)
                )}


                ${detailRow(
                    "الشكل الدوائي",
                    getDrugForm(drug)
                )}


                ${detailRow(
                    "طريق الاستخدام",
                    getRoute(drug)
                )}


                ${detailRow(
                    "السعر",
                    getPrice(drug)
                        ?
                        `${getPrice(drug)} جنيه`
                        :
                        ""
                )}

            </div>


            <div class="drug-medical-warning">

                <strong>
                    ⚠️ تنبيه طبي
                </strong>


                <p>

                    المعلومات المعروضة تعليمية فقط
                    ولا تُعد وصفة طبية أو بديلًا عن
                    استشارة الطبيب أو الصيدلي.

                    لا تستخدم أي دواء أو تغيّر الجرعة
                    بناءً على هذه المعلومات فقط.

                </p>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    document.body.style.overflow =
        "hidden";


    addModalStyles();


    const closeButton =
        modal.querySelector(
            ".drug-modal-close"
        );


    const overlay =
        modal.querySelector(
            ".drug-modal-overlay"
        );


    function closeModal() {

        modal.remove();

        document.body.style.overflow =
            "";

    }


    closeButton.addEventListener(
        "click",
        closeModal
    );


    overlay.addEventListener(
        "click",
        closeModal
    );


    function escapeHandler(
        event
    ) {

        if (
            event.key ===
            "Escape"
        ) {

            closeModal();

            document.removeEventListener(
                "keydown",
                escapeHandler
            );

        }

    }


    document.addEventListener(
        "keydown",
        escapeHandler
    );

}


/* =========================================================
   DETAIL ROW
========================================================= */

function detailRow(
    label,
    value
) {

    if (!value) {

        return "";

    }


    return `

        <div class="drug-detail-row">

            <span class="drug-detail-label">
                ${escapeHTML(label)}
            </span>


            <span class="drug-detail-value">
                ${escapeHTML(value)}
            </span>

        </div>

    `;

}


/* =========================================================
   MODAL STYLES
========================================================= */

function addModalStyles() {

    if (
        document.getElementById(
            "drugModalStyles"
        )
    ) {

        return;

    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "drugModalStyles";


    style.textContent = `

        .drug-modal {

            position: fixed;

            inset: 0;

            z-index: 99999;

            display: flex;

            align-items: center;

            justify-content: center;

            padding: 20px;

        }


        .drug-modal-overlay {

            position: absolute;

            inset: 0;

            background:
                rgba(
                    5,
                    25,
                    40,
                    0.65
                );

            backdrop-filter:
                blur(5px);

        }


        .drug-modal-content {

            position: relative;

            z-index: 2;

            width:
                min(
                    680px,
                    100%
                );

            max-height:
                90vh;

            overflow-y:
                auto;

            padding:
                28px;

            background:
                #ffffff;

            border-radius:
                22px;

            box-shadow:
                0 30px 80px
                rgba(
                    0,
                    0,
                    0,
                    0.25
                );

            color:
                #18364b;

        }


        .drug-modal-close {

            position: absolute;

            top: 15px;

            left: 15px;

            width: 38px;

            height: 38px;

            border: none;

            border-radius: 50%;

            background:
                #edf5f7;

            color:
                #244f62;

            font-size: 25px;

            line-height: 1;

            cursor: pointer;

        }


        .drug-modal-header {

            display: flex;

            align-items: center;

            gap: 15px;

            padding-left: 40px;

            margin-bottom: 25px;

        }


        .drug-modal-icon {

            width: 58px;

            height: 58px;

            display: flex;

            align-items: center;

            justify-content: center;

            flex: 0 0 58px;

            border-radius: 15px;

            background:
                #edf6f8;

            font-size: 28px;

        }


        .drug-modal-header h2 {

            margin: 0;

            font-size: 24px;

        }


        .drug-modal-header p {

            margin: 5px 0 0;

            color:
                #71838d;

            font-size: 13px;

        }


        .drug-details-grid {

            display: grid;

            grid-template-columns:
                1fr 1fr;

            gap: 10px;

        }


        .drug-detail-row {

            padding: 13px;

            background:
                #f7f9fa;

            border-radius: 11px;

        }


        .drug-detail-label {

            display: block;

            margin-bottom: 5px;

            color:
                #7d8d95;

            font-size: 11px;

        }


        .drug-detail-value {

            display: block;

            color:
                #294b5e;

            font-size: 13px;

            font-weight: 700;

            line-height: 1.6;

        }


        .drug-medical-warning {

            margin-top: 20px;

            padding: 16px;

            border:
                1px solid #eadfb8;

            border-radius: 12px;

            background:
                #fffdf3;

        }


        .drug-medical-warning strong {

            display: block;

            margin-bottom: 7px;

            color:
                #624f19;

        }


        .drug-medical-warning p {

            margin: 0;

            color:
                #74683e;

            font-size: 12px;

            line-height: 1.8;

        }


        @media (max-width: 600px) {

            .drug-modal-content {

                padding: 22px;

            }


            .drug-details-grid {

                grid-template-columns:
                    1fr;

            }


            .drug-modal-header h2 {

                font-size: 19px;

            }

        }

    `;


    document.head.appendChild(
        style
    );

}


/* =========================================================
   CATEGORY CARDS
========================================================= */

function setupCategoryCards() {

    const categoryCards =
        document.querySelectorAll(
            ".category-card"
        );


    categoryCards.forEach(
        card => {

            card.addEventListener(
                "click",
                event => {

                    event.preventDefault();


                    const category =
                        card.dataset.category;


                    if (
                        categoryFilter &&
                        category
                    ) {

                        const options =
                            Array.from(
                                categoryFilter.options
                            );


                        const matchingOption =
                            options.find(
                                option =>
                                    normalizeArabic(
                                        option.value
                                    ) ===
                                    normalizeArabic(
                                        category
                                    )
                            );


                        if (
                            matchingOption
                        ) {

                            categoryFilter.value =
                                matchingOption.value;

                        } else {

                            categoryFilter.value =
                                "all";

                        }

                    }


                    refreshResults();


                    document
                        .getElementById(
                            "database"
                        )
                        ?.scrollIntoView(
                            {
                                behavior:
                                    "smooth"
                            }
                        );

                }
            );

        }
    );

}


/* =========================================================
   CLEAR FILTERS
========================================================= */

function clearDrugFilters() {

    if (searchInput) {

        searchInput.value =
            "";

    }


    if (categoryFilter) {

        categoryFilter.value =
            "all";

    }


    if (formFilter) {

        formFilter.value =
            "all";

    }


    if (sortSelect) {

        sortSelect.value =
            "name";

    }


    filteredDrugs =
        [...allDrugs];


    currentPage =
        1;


    hideSuggestions();


    updateResults();

}


/* =========================================================
   DATABASE ERROR
========================================================= */

function showDatabaseError(
    error
) {

    if (!resultsContainer) {

        return;

    }


    resultsContainer.innerHTML = `

        <div class="database-placeholder">

            <div class="database-placeholder-icon">
                ⚠️
            </div>

            <h3>
                تعذر تحميل قاعدة بيانات الأدوية
            </h3>

            <p>

                حدثت مشكلة أثناء تحميل:

                <strong>
                    data/drugs.json
                </strong>

                <br><br>

                تأكد أن الملف موجود داخل مجلد
                <strong>
                    data
                </strong>
                وأن الصفحة تعمل من خلال GitHub Pages
                أو Web Server.

            </p>

        </div>

    `;


    console.error(
        error
    );

}


/* =========================================================
   SCROLL
========================================================= */

function scrollToResults() {

    if (!resultsContainer) {

        return;

    }


    resultsContainer.scrollIntoView(
        {
            behavior:
                "smooth",

            block:
                "start"

        }
    );

}


/* =========================================================
   URL SEARCH
========================================================= */

function loadSearchFromURL() {

    if (!searchInput) {

        return;

    }


    const params =
        new URLSearchParams(
            window.location.search
        );


    const query =
        params.get(
            "search"
        );


    if (query) {

        searchInput.value =
            query;


        refreshResults();

    }

}


/* =========================================================
   EVENT LISTENERS
========================================================= */

if (searchForm) {

    searchForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            refreshResults();

            hideSuggestions();

            document
                .getElementById(
                    "database"
                )
                ?.scrollIntoView(
                    {
                        behavior:
                            "smooth"
                    }
                );

        }
    );

}


if (searchInput) {

    searchInput.addEventListener(
        "input",
        debounce(
            () => {

                refreshResults();

                showSuggestions(
                    searchInput.value
                );

            },
            200
        )
    );


    searchInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Enter"
            ) {

                event.preventDefault();

                refreshResults();

                hideSuggestions();

            }

        }
    );

}


if (categoryFilter) {

    categoryFilter.addEventListener(
        "change",
        () => {

            refreshResults();

        }
    );

}


if (formFilter) {

    formFilter.addEventListener(
        "change",
        () => {

            refreshResults();

        }
    );

}


if (sortSelect) {

    sortSelect.addEventListener(
        "change",
        () => {

            refreshResults();

        }
    );

}


if (clearFiltersButton) {

    clearFiltersButton.addEventListener(
        "click",
        clearDrugFilters
    );

}


/* =========================================================
   CLOSE SUGGESTIONS
========================================================= */

document.addEventListener(
    "click",
    event => {

        if (
            !event.target.closest(
                ".drug-search-wrapper"
            )
        ) {

            hideSuggestions();

        }

    }
);


/* =========================================================
   DEBOUNCE
========================================================= */

function debounce(
    callback,
    delay
) {

    let timer;


    return function (...args) {

        clearTimeout(
            timer
        );


        timer =
            setTimeout(
                () => {

                    callback.apply(
                        this,
                        args
                    );

                },
                delay
            );

    };

}


/* =========================================================
   START
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupCategoryCards();

        loadDrugDatabase();

    }
);
