/* =========================================================
   BOAWABET ALTAMREED
   DRUG DATABASE JAVASCRIPT
   Compatible with:
   data/drugs.json
   ========================================================= */

"use strict";


/* =========================================================
   CONFIGURATION
   ========================================================= */

const DRUGS_CONFIG = {

    DATA_URL: "data/drugs.json",

    ITEMS_PER_PAGE: 12,

    SEARCH_SUGGESTIONS_LIMIT: 6,

    POPULAR_DRUGS_LIMIT: 4

};


/* =========================================================
   GLOBAL STATE
   ========================================================= */

let allDrugs = [];

let filteredDrugs = [];

let currentPage = 1;

let currentSearch = "";

let currentCategory = "all";

let currentForm = "all";

let currentSort = "name";


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const drugSearchForm =
    document.getElementById("drugSearchForm");

const drugSearch =
    document.getElementById("drugSearch");

const drugSearchButton =
    document.getElementById("drugSearchButton");

const drugSuggestions =
    document.getElementById("drugSuggestions");

const drugCategoryFilter =
    document.getElementById("drugCategoryFilter");

const drugFormFilter =
    document.getElementById("drugFormFilter");

const drugSort =
    document.getElementById("drugSort");

const clearDrugFilters =
    document.getElementById("clearDrugFilters");

const drugResults =
    document.getElementById("drugResults");

const drugLoading =
    document.getElementById("drugLoading");

const drugEmpty =
    document.getElementById("drugEmpty");

const drugError =
    document.getElementById("drugError");

const drugPagination =
    document.getElementById("drugPagination");

const drugResultsCount =
    document.getElementById("drugResultsCount");

const drugCount =
    document.getElementById("drugCount");

const ingredientCount =
    document.getElementById("ingredientCount");

const categoryCount =
    document.getElementById("categoryCount");

const popularDrugs =
    document.getElementById("popularDrugs");


/* =========================================================
   START APPLICATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeDrugsPage();

    }
);


/* =========================================================
   INITIALIZE
   ========================================================= */

async function initializeDrugsPage() {

    setupEventListeners();

    setupCategoryCards();

    await loadDrugs();

}


/* =========================================================
   EVENT LISTENERS
   ========================================================= */

function setupEventListeners() {


    /* -----------------------------------------
       SEARCH FORM
       ----------------------------------------- */

    if (drugSearchForm) {

        drugSearchForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                currentSearch =
                    normalizeText(
                        drugSearch.value
                    );

                currentPage = 1;

                hideSuggestions();

                applyFilters();

                scrollToDatabase();

            }
        );

    }


    /* -----------------------------------------
       LIVE SEARCH
       ----------------------------------------- */

    if (drugSearch) {

        drugSearch.addEventListener(
            "input",
            function () {

                showSearchSuggestions(
                    drugSearch.value
                );

            }
        );


        drugSearch.addEventListener(
            "focus",
            function () {

                if (
                    normalizeText(
                        drugSearch.value
                    )
                ) {

                    showSearchSuggestions(
                        drugSearch.value
                    );

                }

            }
        );

    }


    /* -----------------------------------------
       CATEGORY FILTER
       ----------------------------------------- */

    if (drugCategoryFilter) {

        drugCategoryFilter.addEventListener(
            "change",
            function () {

                currentCategory =
                    drugCategoryFilter.value;

                currentPage = 1;

                applyFilters();

            }
        );

    }


    /* -----------------------------------------
       FORM FILTER
       ----------------------------------------- */

    if (drugFormFilter) {

        drugFormFilter.addEventListener(
            "change",
            function () {

                currentForm =
                    drugFormFilter.value;

                currentPage = 1;

                applyFilters();

            }
        );

    }


    /* -----------------------------------------
       SORT
       ----------------------------------------- */

    if (drugSort) {

        drugSort.addEventListener(
            "change",
            function () {

                currentSort =
                    drugSort.value;

                currentPage = 1;

                applyFilters();

            }
        );

    }


    /* -----------------------------------------
       CLEAR FILTERS
       ----------------------------------------- */

    if (clearDrugFilters) {

        clearDrugFilters.addEventListener(
            "click",
            function () {

                resetFilters();

            }
        );

    }


    /* -----------------------------------------
       CLOSE SUGGESTIONS
       ----------------------------------------- */

    document.addEventListener(
        "click",
        function (event) {

            if (
                drugSearchForm &&
                drugSuggestions &&
                !drugSearchForm.contains(event.target) &&
                !drugSuggestions.contains(event.target)
            ) {

                hideSuggestions();

            }

        }
    );


    /* -----------------------------------------
       ESC KEY
       ----------------------------------------- */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                hideSuggestions();

                closeDrugModal();

            }

        }
    );

}


/* =========================================================
   LOAD DATABASE
   ========================================================= */

async function loadDrugs() {

    showLoading();

    hideEmpty();

    hideError();


    try {

        const response =
            await fetch(
                DRUGS_CONFIG.DATA_URL,
                {
                    cache: "no-cache"
                }
            );


        if (!response.ok) {

            throw new Error(
                "HTTP Error: " +
                response.status
            );

        }


        const data =
            await response.json();


        allDrugs =
            normalizeDatabase(
                data
            );


        if (!Array.isArray(allDrugs)) {

            throw new Error(
                "Invalid drug database format"
            );

        }


        updateStatistics();

        populateCategoryFilter();

        populateFormFilter();

        renderPopularDrugs();

        applyFilters();

        hideLoading();


    } catch (error) {

        console.error(
            "Drug database error:",
            error
        );

        hideLoading();

        showError();

    }

}


/* =========================================================
   NORMALIZE DATABASE
   ========================================================= */

function normalizeDatabase(data) {


    let drugs = [];


    /* -----------------------------------------
       CASE 1:
       JSON is directly an array
       ----------------------------------------- */

    if (Array.isArray(data)) {

        drugs = data;

    }


    /* -----------------------------------------
       CASE 2:
       JSON contains drugs
       ----------------------------------------- */

    else if (
        data &&
        Array.isArray(data.drugs)
    ) {

        drugs = data.drugs;

    }


    /* -----------------------------------------
       CASE 3:
       JSON contains data
       ----------------------------------------- */

    else if (
        data &&
        Array.isArray(data.data)
    ) {

        drugs = data.data;

    }


    /* -----------------------------------------
       NORMALIZE EACH DRUG
       ----------------------------------------- */

    return drugs
        .map(
            function (drug, index) {

                return normalizeDrug(
                    drug,
                    index
                );

            }
        )
        .filter(
            function (drug) {

                return drug !== null;

            }
        );

}


/* =========================================================
   NORMALIZE ONE DRUG
   ========================================================= */

function normalizeDrug(drug, index) {

    if (
        !drug ||
        typeof drug !== "object"
    ) {

        return null;

    }


    const commercialNameEn =
        getFirstValue(
            drug,
            [
                "commercial_name_en",
                "brand_name_en",
                "brandNameEn",
                "name_en",
                "nameEn"
            ]
        );


    const commercialNameAr =
        getFirstValue(
            drug,
            [
                "commercial_name_ar",
                "brand_name_ar",
                "brandNameAr",
                "name_ar",
                "nameAr"
            ]
        );


    const scientificName =
        getFirstValue(
            drug,
            [
                "scientific_name",
                "generic_name",
                "active_ingredient",
                "activeIngredient",
                "genericName"
            ]
        );


    const manufacturer =
        getFirstValue(
            drug,
            [
                "manufacturer",
                "company",
                "company_name"
            ]
        );


    const drugClass =
        getFirstValue(
            drug,
            [
                "drug_class",
                "drugClass",
                "category",
                "classification"
            ]
        );


    const route =
        getFirstValue(
            drug,
            [
                "route",
                "dosage_form",
                "form",
                "administration_route"
            ]
        );


    const price =
        getFirstValue(
            drug,
            [
                "price_egp",
                "price",
                "priceEGP"
            ]
        );


    return {

        id:
            drug.id ||
            drug.code ||
            drug.registration_number ||
            index + 1,

        commercial_name_en:
            cleanValue(
                commercialNameEn
            ),

        commercial_name_ar:
            cleanValue(
                commercialNameAr
            ),

        scientific_name:
            cleanValue(
                scientificName
            ),

        manufacturer:
            cleanValue(
                manufacturer
            ),

        drug_class:
            cleanValue(
                drugClass
            ),

        route:
            cleanValue(
                route
            ),

        price_egp:
            price,

        original:
            drug

    };

}


/* =========================================================
   GET FIRST VALUE
   ========================================================= */

function getFirstValue(
    object,
    keys
) {

    for (
        let i = 0;
        i < keys.length;
        i++
    ) {

        const key =
            keys[i];


        if (
            object[key] !== undefined &&
            object[key] !== null &&
            String(object[key]).trim() !== ""
        ) {

            return object[key];

        }

    }


    return "";

}


/* =========================================================
   CLEAN VALUE
   ========================================================= */

function cleanValue(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    if (
        typeof value === "object"
    ) {

        return JSON.stringify(
            value
        );

    }


    return String(value).trim();

}


/* =========================================================
   NORMALIZE TEXT
   ========================================================= */

function normalizeText(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .toLowerCase()
        .trim()
        .replace(
            /\s+/g,
            " "
        );

}


/* =========================================================
   UPDATE STATISTICS
   ========================================================= */

function updateStatistics() {


    if (drugCount) {

        drugCount.textContent =
            formatNumber(
                allDrugs.length
            );

    }


    const ingredients =
        new Set();


    const categories =
        new Set();


    allDrugs.forEach(
        function (drug) {

            if (
                drug.scientific_name
            ) {

                ingredients.add(
                    normalizeText(
                        drug.scientific_name
                    )
                );

            }


            if (
                drug.drug_class
            ) {

                categories.add(
                    normalizeText(
                        drug.drug_class
                    )
                );

            }

        }
    );


    if (ingredientCount) {

        ingredientCount.textContent =
            formatNumber(
                ingredients.size
            );

    }


    if (categoryCount) {

        categoryCount.textContent =
            formatNumber(
                categories.size
            );

    }

}


/* =========================================================
   POPULATE CATEGORY FILTER
   ========================================================= */

function populateCategoryFilter() {

    if (!drugCategoryFilter) {

        return;

    }


    const categories =
        getUniqueValues(
            allDrugs,
            "drug_class"
        );


    drugCategoryFilter.innerHTML = "";


    const allOption =
        document.createElement(
            "option"
        );


    allOption.value = "all";

    allOption.textContent =
        "كل التصنيفات";


    drugCategoryFilter.appendChild(
        allOption
    );


    categories.forEach(
        function (category) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                category.value;


            option.textContent =
                category.label;


            drugCategoryFilter.appendChild(
                option
            );

        }
    );


    drugCategoryFilter.value =
        currentCategory;

}


/* =========================================================
   POPULATE FORM FILTER
   ========================================================= */

function populateFormFilter() {

    if (!drugFormFilter) {

        return;

    }


    const forms =
        getUniqueValues(
            allDrugs,
            "route"
        );


    drugFormFilter.innerHTML = "";


    const allOption =
        document.createElement(
            "option"
        );


    allOption.value = "all";

    allOption.textContent =
        "كل الأشكال الدوائية";


    drugFormFilter.appendChild(
        allOption
    );


    forms.forEach(
        function (form) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                form.value;


            option.textContent =
                formatRoute(
                    form.label
                );


            drugFormFilter.appendChild(
                option
            );

        }
    );


    drugFormFilter.value =
        currentForm;

}


/* =========================================================
   GET UNIQUE VALUES
   ========================================================= */

function getUniqueValues(
    drugs,
    field
) {

    const map =
        new Map();


    drugs.forEach(
        function (drug) {

            const value =
                cleanValue(
                    drug[field]
                );


            if (!value) {

                return;

            }


            const normalized =
                normalizeText(
                    value
                );


            if (!map.has(normalized)) {

                map.set(
                    normalized,
                    value
                );

            }

        }
    );


    return Array.from(
        map.entries()
    )
    .map(
        function (entry) {

            return {

                value:
                    entry[0],

                label:
                    entry[1]

            };

        }
    )
    .sort(
        function (a, b) {

            return a.label.localeCompare(
                b.label,
                "en",
                {
                    sensitivity:
                        "base"
                }
            );

        }
    );

}


/* =========================================================
   APPLY FILTERS
   ========================================================= */

function applyFilters() {


    const search =
        normalizeText(
            currentSearch
        );


    filteredDrugs =
        allDrugs.filter(
            function (drug) {


                /* -----------------------------
                   SEARCH
                   ----------------------------- */

                let matchesSearch =
                    true;


                if (search) {

                    const searchableText =
                        [

                            drug.commercial_name_en,

                            drug.commercial_name_ar,

                            drug.scientific_name,

                            drug.manufacturer,

                            drug.drug_class,

                            drug.route

                        ]
                        .join(" ");


                    matchesSearch =
                        normalizeText(
                            searchableText
                        )
                        .includes(
                            search
                        );

                }


                if (!matchesSearch) {

                    return false;

                }


                /* -----------------------------
                   CATEGORY
                   ----------------------------- */

                if (
                    currentCategory !== "all"
                ) {

                    if (
                        normalizeText(
                            drug.drug_class
                        ) !==
                        normalizeText(
                            currentCategory
                        )
                    ) {

                        return false;

                    }

                }


                /* -----------------------------
                   FORM / ROUTE
                   ----------------------------- */

                if (
                    currentForm !== "all"
                ) {

                    if (
                        normalizeText(
                            drug.route
                        ) !==
                        normalizeText(
                            currentForm
                        )
                    ) {

                        return false;

                    }

                }


                return true;

            }
        );


    sortDrugs();


    renderDatabase();

}


/* =========================================================
   SORT DRUGS
   ========================================================= */

function sortDrugs() {


    if (
        currentSort === "popular"
    ) {

        filteredDrugs.sort(
            function (a, b) {

                const aScore =
                    getPopularityScore(a);

                const bScore =
                    getPopularityScore(b);


                return bScore - aScore;

            }
        );


        return;

    }


    filteredDrugs.sort(
        function (a, b) {

            const nameA =
                normalizeText(
                    a.commercial_name_en ||
                    a.commercial_name_ar
                );


            const nameB =
                normalizeText(
                    b.commercial_name_en ||
                    b.commercial_name_ar
                );


            return nameA.localeCompare(
                nameB,
                "en",
                {
                    sensitivity:
                        "base"
                }
            );

        }
    );

}


/* =========================================================
   POPULARITY SCORE
   ========================================================= */

function getPopularityScore(
    drug
) {

    let score = 0;


    const name =
        normalizeText(
            drug.commercial_name_en
        );


    const popularNames = [

        "paracetamol",

        "panadol",

        "amoxicillin",

        "augmentin",

        "omeprazole",

        "ceftriaxone",

        "diclofenac",

        "ibuprofen",

        "azithromycin",

        "metformin"

    ];


    popularNames.forEach(
        function (popularName, index) {

            if (
                name.includes(
                    popularName
                )
            ) {

                score +=
                    1000 - index;

            }

        }
    );


    return score;

}


/* =========================================================
   RENDER DATABASE
   ========================================================= */

function renderDatabase() {


    hideLoading();

    hideError();


    if (!drugResults) {

        return;

    }


    removeRenderedDrugCards();


    if (
        filteredDrugs.length === 0
    ) {

        showEmpty();

        updateResultsCount();

        renderPagination();

        return;

    }


    hideEmpty();


    const totalPages =
        Math.ceil(
            filteredDrugs.length /
            DRUGS_CONFIG.ITEMS_PER_PAGE
        );


    if (
        currentPage > totalPages
    ) {

        currentPage =
            totalPages;

    }


    const startIndex =
        (
            currentPage - 1
        ) *
        DRUGS_CONFIG.ITEMS_PER_PAGE;


    const endIndex =
        startIndex +
        DRUGS_CONFIG.ITEMS_PER_PAGE;


    const pageDrugs =
        filteredDrugs.slice(
            startIndex,
            endIndex
        );


    pageDrugs.forEach(
        function (drug) {

            const card =
                createDrugCard(
                    drug
                );


            drugResults.appendChild(
                card
            );

        }
    );


    updateResultsCount();

    renderPagination();

}


/* =========================================================
   REMOVE RENDERED CARDS
   ========================================================= */

function removeRenderedDrugCards() {

    if (!drugResults) {

        return;

    }


    const cards =
        drugResults.querySelectorAll(
            ".drug-card"
        );


    cards.forEach(
        function (card) {

            card.remove();

        }
    );

}


/* =========================================================
   CREATE DRUG CARD
   ========================================================= */

function createDrugCard(
    drug
) {

    const article =
        document.createElement(
            "article"
        );


    article.className =
        "drug-card";


    article.dataset.drugId =
        drug.id;


    const icon =
        document.createElement(
            "div"
        );


    icon.className =
        "drug-card-icon";


    icon.textContent =
        "💊";


    article.appendChild(
        icon
    );


    const content =
        document.createElement(
            "div"
        );


    content.className =
        "drug-card-content";


    const title =
        document.createElement(
            "h3"
        );


    title.textContent =
        drug.commercial_name_ar ||
        drug.commercial_name_en ||
        "دواء غير معروف";


    content.appendChild(
        title
    );


    if (
        drug.commercial_name_en
    ) {

        const englishName =
            document.createElement(
                "div"
            );


        englishName.className =
            "drug-name-en";


        englishName.textContent =
            drug.commercial_name_en;


        content.appendChild(
            englishName
        );

    }


    /* -----------------------------------------
       SCIENTIFIC NAME
       ----------------------------------------- */

    if (
        drug.scientific_name
    ) {

        content.appendChild(
            createDrugField(
                "المادة الفعالة",
                drug.scientific_name
            )
        );

    }


    /* -----------------------------------------
       DRUG CLASS
       ----------------------------------------- */

    if (
        drug.drug_class
    ) {

        content.appendChild(
            createDrugField(
                "التصنيف الدوائي",
                drug.drug_class
            )
        );

    }


    /* -----------------------------------------
       ROUTE
       ----------------------------------------- */

    if (
        drug.route
    ) {

        content.appendChild(
            createDrugField(
                "الشكل / طريقة الاستخدام",
                formatRoute(
                    drug.route
                )
            )
        );

    }


    /* -----------------------------------------
       MANUFACTURER
       ----------------------------------------- */

    if (
        drug.manufacturer
    ) {

        content.appendChild(
            createDrugField(
                "الشركة المصنعة",
                drug.manufacturer
            )
        );

    }


    /* -----------------------------------------
       PRICE
       ----------------------------------------- */

    if (
        drug.price_egp !== "" &&
        drug.price_egp !== null &&
        drug.price_egp !== undefined
    ) {

        const price =
            document.createElement(
                "div"
            );


        price.className =
            "drug-price";


        price.textContent =
            "السعر: " +
            formatPrice(
                drug.price_egp
            );


        content.appendChild(
            price
        );

    }


    /* -----------------------------------------
       DETAILS BUTTON
       ----------------------------------------- */

    const detailsButton =
        document.createElement(
            "button"
        );


    detailsButton.type =
        "button";


    detailsButton.className =
        "drug-details-button";


    detailsButton.textContent =
        "عرض تفاصيل الدواء";


    detailsButton.addEventListener(
        "click",
        function () {

            openDrugModal(
                drug
            );

        }
    );


    content.appendChild(
        detailsButton
    );


    article.appendChild(
        content
    );


    return article;

}


/* =========================================================
   CREATE DRUG FIELD
   ========================================================= */

function createDrugField(
    label,
    value
) {

    const field =
        document.createElement(
            "div"
        );


    field.className =
        "drug-field";


    const strong =
        document.createElement(
            "strong"
        );


    strong.textContent =
        label;


    const span =
        document.createElement(
            "span"
        );


    span.textContent =
        value;


    field.appendChild(
        strong
    );


    field.appendChild(
        span
    );


    return field;

}


/* =========================================================
   FORMAT ROUTE
   ========================================================= */

function formatRoute(
    route
) {

    if (!route) {

        return "غير محدد";

    }


    const value =
        String(route)
            .trim();


    const translations = {

        "ORAL":
            "عن طريق الفم",

        "ORAL.SOLID":
            "فموي - صلب",

        "ORAL.LIQUID":
            "فموي - سائل",

        "INJECTION":
            "حقن",

        "INTRAVENOUS":
            "حقن وريدي",

        "INTRAMUSCULAR":
            "حقن عضلي",

        "SUBCUTANEOUS":
            "حقن تحت الجلد",

        "TOPICAL":
            "موضعي",

        "OPHTHALMIC":
            "للاستخدام العيني",

        "OTIC":
            "للاستخدام بالأذن",

        "NASAL":
            "أنفي",

        "RECTAL":
            "شرجي",

        "VAGINAL":
            "مهبلي",

        "INHALATION":
            "استنشاق",

        "TRANSDERMAL":
            "عبر الجلد"

    };


    if (
        translations[value]
    ) {

        return translations[value];

    }


    return value
        .replace(
            /\./g,
            " - "
        )
        .replace(
            /_/g,
            " "
        );

}


/* =========================================================
   FORMAT PRICE
   ========================================================= */

function formatPrice(
    price
) {

    if (
        price === null ||
        price === undefined ||
        price === ""
    ) {

        return "غير متوفر";

    }


    const numericPrice =
        Number(
            String(price)
                .replace(
                    /,/g,
                    ""
                )
        );


    if (
        Number.isNaN(
            numericPrice
        )
    ) {

        return (
            String(price) +
            " جنيه"
        );

    }


    return (
        numericPrice.toLocaleString(
            "ar-EG",
            {
                maximumFractionDigits:
                    2
            }
        ) +
        " جنيه"
    );

}


/* =========================================================
   UPDATE RESULTS COUNT
   ========================================================= */

function updateResultsCount() {

    if (!drugResultsCount) {

        return;

    }


    const total =
        filteredDrugs.length;


    if (
        currentSearch ||
        currentCategory !== "all" ||
        currentForm !== "all"
    ) {

        drugResultsCount.textContent =
            "تم العثور على " +
            formatNumber(total) +
            " دواء";

    } else {

        drugResultsCount.textContent =
            "عرض " +
            formatNumber(total) +
            " دواء";

    }

}


/* =========================================================
   PAGINATION
   ========================================================= */

function renderPagination() {

    if (!drugPagination) {

        return;

    }


    drugPagination.innerHTML =
        "";


    const totalPages =
        Math.ceil(
            filteredDrugs.length /
            DRUGS_CONFIG.ITEMS_PER_PAGE
        );


    if (
        totalPages <= 1
    ) {

        return;

    }


    /* -----------------------------------------
       PREVIOUS
       ----------------------------------------- */

    const previous =
        createPaginationButton(
            "‹",
            currentPage === 1,
            function () {

                currentPage--;

                renderDatabase();

                scrollToDatabase();

            }
        );


    drugPagination.appendChild(
        previous
    );


    /* -----------------------------------------
       PAGE NUMBERS
       ----------------------------------------- */

    const pages =
        generatePageNumbers(
            totalPages,
            currentPage
        );


    pages.forEach(
        function (page) {

            if (
                page === "..."
            ) {

                const dots =
                    document.createElement(
                        "span"
                    );


                dots.textContent =
                    "...";


                dots.style.padding =
                    "0 5px";


                dots.style.color =
                    "#7b8c95";


                drugPagination.appendChild(
                    dots
                );


                return;

            }


            const button =
                createPaginationButton(
                    String(page),
                    false,
                    function () {

                        currentPage =
                            page;

                        renderDatabase();

                        scrollToDatabase();

                    }
                );


            if (
                page === currentPage
            ) {

                button.classList.add(
                    "active"
                );

            }


            drugPagination.appendChild(
                button
            );

        }
    );


    /* -----------------------------------------
       NEXT
       ----------------------------------------- */

    const next =
        createPaginationButton(
            "›",
            currentPage === totalPages,
            function () {

                currentPage++;

                renderDatabase();

                scrollToDatabase();

            }
        );


    drugPagination.appendChild(
        next
    );

}


/* =========================================================
   GENERATE PAGE NUMBERS
   ========================================================= */

function generatePageNumbers(
    totalPages,
    current
) {

    if (
        totalPages <= 7
    ) {

        return Array.from(
            {
                length:
                    totalPages
            },
            function (_, index) {

                return index + 1;

            }
        );

    }


    const pages = [];


    pages.push(1);


    if (
        current > 4
    ) {

        pages.push("...");

    }


    const start =
        Math.max(
            2,
            current - 1
        );


    const end =
        Math.min(
            totalPages - 1,
            current + 1
        );


    for (
        let i = start;
        i <= end;
        i++
    ) {

        pages.push(i);

    }


    if (
        current < totalPages - 3
    ) {

        pages.push("...");

    }


    pages.push(
        totalPages
    );


    return pages;

}


/* =========================================================
   CREATE PAGINATION BUTTON
   ========================================================= */

function createPaginationButton(
    text,
    disabled,
    callback
) {

    const button =
        document.createElement(
            "button"
        );


    button.type =
        "button";


    button.className =
        "pagination-button";


    button.textContent =
        text;


    button.disabled =
        disabled;


    if (!disabled) {

        button.addEventListener(
            "click",
            callback
        );

    }


    return button;

}


/* =========================================================
   SEARCH SUGGESTIONS
   ========================================================= */

function showSearchSuggestions(
    value
) {

    if (!drugSuggestions) {

        return;

    }


    const search =
        normalizeText(
            value
        );


    if (!search) {

        hideSuggestions();

        return;

    }


    if (
        allDrugs.length === 0
    ) {

        hideSuggestions();

        return;

    }


    const matches =
        allDrugs
            .filter(
                function (drug) {

                    const text =
                        [

                            drug.commercial_name_en,

                            drug.commercial_name_ar,

                            drug.scientific_name

                        ]
                        .join(" ");


                    return normalizeText(
                        text
                    )
                    .includes(
                        search
                    );

                }
            )
            .slice(
                0,
                DRUGS_CONFIG.SEARCH_SUGGESTIONS_LIMIT
            );


    if (
        matches.length === 0
    ) {

        hideSuggestions();

        return;

    }


    drugSuggestions.innerHTML =
        "";


    matches.forEach(
        function (drug) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "suggestion-item";


            const icon =
                document.createElement(
                    "div"
                );


            icon.className =
                "suggestion-icon";


            icon.textContent =
                "💊";


            const info =
                document.createElement(
                    "div"
                );


            const name =
                document.createElement(
                    "div"
                );


            name.className =
                "suggestion-name";


            name.textContent =
                drug.commercial_name_ar ||
                drug.commercial_name_en ||
                "دواء";


            const generic =
                document.createElement(
                    "span"
                );


            generic.className =
                "suggestion-generic";


            generic.textContent =
                drug.scientific_name ||
                drug.commercial_name_en ||
                "";


            info.appendChild(
                name
            );


            info.appendChild(
                generic
            );


            item.appendChild(
                icon
            );


            item.appendChild(
                info
            );


            item.addEventListener(
                "click",
                function () {

                    selectSuggestion(
                        drug
                    );

                }
            );


            drugSuggestions.appendChild(
                item
            );

        }
    );


    drugSuggestions.classList.add(
        "show"
    );

}


/* =========================================================
   SELECT SEARCH SUGGESTION
   ========================================================= */

function selectSuggestion(
    drug
) {

    if (drugSearch) {

        drugSearch.value =
            drug.commercial_name_en ||
            drug.commercial_name_ar ||
            drug.scientific_name ||
            "";

    }


    currentSearch =
        normalizeText(
            drugSearch.value
        );


    currentPage = 1;


    hideSuggestions();


    applyFilters();


    scrollToDatabase();

}


/* =========================================================
   HIDE SUGGESTIONS
   ========================================================= */

function hideSuggestions() {

    if (!drugSuggestions) {

        return;

    }


    drugSuggestions.classList.remove(
        "show"
    );

}


/* =========================================================
   CATEGORY CARDS
   ========================================================= */

function setupCategoryCards() {

    const cards =
        document.querySelectorAll(
            ".category-card"
        );


    cards.forEach(
        function (card) {

            card.addEventListener(
                "click",
                function () {

                    const category =
                        card.dataset.category;


                    if (
                        !category
                    ) {

                        return;

                    }


                    if (
                        allDrugs.length === 0
                    ) {

                        return;

                    }


                    const matchingCategory =
                        findMatchingCategory(
                            category
                        );


                    if (
                        matchingCategory
                    ) {

                        currentCategory =
                            matchingCategory;


                        if (
                            drugCategoryFilter
                        ) {

                            drugCategoryFilter.value =
                                matchingCategory;

                        }


                        currentPage =
                            1;


                        applyFilters();

                    }

                }
            );

        }
    );

}


/* =========================================================
   FIND MATCHING CATEGORY
   ========================================================= */

function findMatchingCategory(
    category
) {

    const target =
        normalizeText(
            category
        );


    const found =
        getUniqueValues(
            allDrugs,
            "drug_class"
        )
        .find(
            function (item) {

                return (
                    normalizeText(
                        item.value
                    ) === target ||
                    normalizeText(
                        item.label
                    ) === target
                );

            }
        );


    return found
        ? found.value
        : null;

}


/* =========================================================
   POPULAR DRUGS
   ========================================================= */

function renderPopularDrugs() {

    if (!popularDrugs) {

        return;

    }


    if (
        allDrugs.length === 0
    ) {

        return;

    }


    const drugs =
        getPopularDrugs();


    popularDrugs.innerHTML =
        "";


    drugs.forEach(
        function (drug) {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "popular-drug-card";


            const icon =
                document.createElement(
                    "div"
                );


            icon.className =
                "popular-drug-icon";


            icon.textContent =
                "💊";


            const title =
                document.createElement(
                    "h3"
                );


            title.textContent =
                drug.commercial_name_ar ||
                drug.commercial_name_en ||
                "دواء";


            const paragraph =
                document.createElement(
                    "p"
                );


            paragraph.textContent =
                drug.scientific_name ||
                drug.drug_class ||
                "معلومات دوائية";


            const tag =
                document.createElement(
                    "span"
                );


            tag.className =
                "drug-tag";


            tag.textContent =
                drug.drug_class ||
                "Drug";


            card.appendChild(
                icon
            );


            card.appendChild(
                title
            );


            card.appendChild(
                paragraph
            );


            card.appendChild(
                tag
            );


            card.addEventListener(
                "click",
                function () {

                    openDrugModal(
                        drug
                    );

                }
            );


            card.style.cursor =
                "pointer";


            popularDrugs.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   GET POPULAR DRUGS
   ========================================================= */

function getPopularDrugs() {

    const preferred =
        [

            "paracetamol",

            "amoxicillin",

            "omeprazole",

            "ceftriaxone"

        ];


    const result = [];


    preferred.forEach(
        function (name) {

            const found =
                allDrugs.find(
                    function (drug) {

                        return normalizeText(
                            drug.commercial_name_en
                        )
                        .includes(
                            name
                        );

                    }
                );


            if (
                found &&
                !result.includes(found)
            ) {

                result.push(
                    found
                );

            }

        }
    );


    if (
        result.length <
        DRUGS_CONFIG.POPULAR_DRUGS_LIMIT
    ) {

        allDrugs.forEach(
            function (drug) {

                if (
                    result.length >=
                    DRUGS_CONFIG.POPULAR_DRUGS_LIMIT
                ) {

                    return;

                }


                if (
                    !result.includes(
                        drug
                    )
                ) {

                    result.push(
                        drug
                    );

                }

            }
        );

    }


    return result.slice(
        0,
        DRUGS_CONFIG.POPULAR_DRUGS_LIMIT
    );

}


/* =========================================================
   OPEN DRUG MODAL
   ========================================================= */

function openDrugModal(
    drug
) {

    closeDrugModal();


    const modal =
        document.createElement(
            "div"
        );


    modal.className =
        "drug-modal";


    modal.id =
        "activeDrugModal";


    modal.setAttribute(
        "role",
        "dialog"
    );


    modal.setAttribute(
        "aria-modal",
        "true"
    );


    /* -----------------------------------------
       OVERLAY
       ----------------------------------------- */

    const overlay =
        document.createElement(
            "div"
        );


    overlay.className =
        "drug-modal-overlay";


    overlay.addEventListener(
        "click",
        function () {

            closeDrugModal();

        }
    );


    modal.appendChild(
        overlay
    );


    /* -----------------------------------------
       CONTENT
       ----------------------------------------- */

    const content =
        document.createElement(
            "div"
        );


    content.className =
        "drug-modal-content";


    /* -----------------------------------------
       CLOSE
       ----------------------------------------- */

    const closeButton =
        document.createElement(
            "button"
        );


    closeButton.type =
        "button";


    closeButton.className =
        "drug-modal-close";


    closeButton.textContent =
        "×";


    closeButton.setAttribute(
        "aria-label",
        "إغلاق"
    );


    closeButton.addEventListener(
        "click",
        function () {

            closeDrugModal();

        }
    );


    content.appendChild(
        closeButton
    );


    /* -----------------------------------------
       HEADER
       ----------------------------------------- */

    const header =
        document.createElement(
            "div"
        );


    header.className =
        "drug-modal-header";


    const icon =
        document.createElement(
            "div"
        );


    icon.className =
        "drug-modal-icon";


    icon.textContent =
        "💊";


    const headerText =
        document.createElement(
            "div"
        );


    const title =
        document.createElement(
            "h2"
        );


    title.textContent =
        drug.commercial_name_ar ||
        drug.commercial_name_en ||
        "دواء";


    const subtitle =
        document.createElement(
            "p"
        );


    subtitle.textContent =
        drug.commercial_name_en ||
        drug.scientific_name ||
        "";


    headerText.appendChild(
        title
    );


    headerText.appendChild(
        subtitle
    );


    header.appendChild(
        icon
    );


    header.appendChild(
        headerText
    );


    content.appendChild(
        header
    );


    /* -----------------------------------------
       DETAILS GRID
       ----------------------------------------- */

    const detailsGrid =
        document.createElement(
            "div"
        );


    detailsGrid.className =
        "drug-details-grid";


    addModalDetail(
        detailsGrid,
        "المادة الفعالة",
        drug.scientific_name
    );


    addModalDetail(
        detailsGrid,
        "التصنيف الدوائي",
        drug.drug_class
    );


    addModalDetail(
        detailsGrid,
        "الشكل / طريقة الاستخدام",
        formatRoute(
            drug.route
        )
    );


    addModalDetail(
        detailsGrid,
        "الشركة المصنعة",
        drug.manufacturer
    );


    addModalDetail(
        detailsGrid,
        "السعر",
        formatPrice(
            drug.price_egp
        )
    );


    content.appendChild(
        detailsGrid
    );


    /* -----------------------------------------
       MEDICAL WARNING
       ----------------------------------------- */

    const warning =
        document.createElement(
            "div"
        );


    warning.className =
        "drug-medical-warning";


    const warningTitle =
        document.createElement(
            "strong"
        );


    warningTitle.textContent =
        "⚠️ تنبيه طبي";


    const warningText =
        document.createElement(
            "p"
        );


    warningText.textContent =
        "هذه المعلومات مخصصة للأغراض التعليمية فقط، ولا تُعد وصفة طبية أو بديلًا عن استشارة الطبيب أو الصيدلي. لا تستخدم الدواء أو تغير الجرعة دون الرجوع إلى مختص صحي.";


    warning.appendChild(
        warningTitle
    );


    warning.appendChild(
        warningText
    );


    content.appendChild(
        warning
    );


    modal.appendChild(
        content
    );


    document.body.appendChild(
        modal
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   ADD MODAL DETAIL
   ========================================================= */

function addModalDetail(
    container,
    label,
    value
) {

    if (
        value === null ||
        value === undefined ||
        String(value).trim() === ""
    ) {

        return;

    }


    const row =
        document.createElement(
            "div"
        );


    row.className =
        "drug-detail-row";


    const labelElement =
        document.createElement(
            "span"
        );


    labelElement.className =
        "drug-detail-label";


    labelElement.textContent =
        label;


    const valueElement =
        document.createElement(
            "span"
        );


    valueElement.className =
        "drug-detail-value";


    valueElement.textContent =
        value;


    row.appendChild(
        labelElement
    );


    row.appendChild(
        valueElement
    );


    container.appendChild(
        row
    );

}


/* =========================================================
   CLOSE DRUG MODAL
   ========================================================= */

function closeDrugModal() {

    const modal =
        document.getElementById(
            "activeDrugModal"
        );


    if (modal) {

        modal.remove();

    }


    document.body.style.overflow =
        "";

}


/* =========================================================
   RESET FILTERS
   ========================================================= */

function resetFilters() {

    currentSearch =
        "";


    currentCategory =
        "all";


    currentForm =
        "all";


    currentSort =
        "name";


    currentPage =
        1;


    if (drugSearch) {

        drugSearch.value =
            "";

    }


    if (drugCategoryFilter) {

        drugCategoryFilter.value =
            "all";

    }


    if (drugFormFilter) {

        drugFormFilter.value =
            "all";

    }


    if (drugSort) {

        drugSort.value =
            "name";

    }


    hideSuggestions();


    applyFilters();

}


/* =========================================================
   UI STATES
   ========================================================= */

function showLoading() {

    if (drugLoading) {

        drugLoading.style.display =
            "block";

    }

}


function hideLoading() {

    if (drugLoading) {

        drugLoading.style.display =
            "none";

    }

}


function showEmpty() {

    if (drugEmpty) {

        drugEmpty.style.display =
            "block";

    }

}


function hideEmpty() {

    if (drugEmpty) {

        drugEmpty.style.display =
            "none";

    }

}


function showError() {

    if (drugError) {

        drugError.style.display =
            "block";

    }

}


function hideError() {

    if (drugError) {

        drugError.style.display =
            "none";

    }

}


/* =========================================================
   SCROLL TO DATABASE
   ========================================================= */

function scrollToDatabase() {

    const database =
        document.getElementById(
            "database"
        );


    if (!database) {

        return;

    }


    setTimeout(
        function () {

            database.scrollIntoView(
                {
                    behavior:
                        "smooth",
                    block:
                        "start"
                }
            );

        },
        50
    );

}


/* =========================================================
   FORMAT NUMBER
   ========================================================= */

function formatNumber(
    number
) {

    const numeric =
        Number(number);


    if (
        Number.isNaN(
            numeric
        )
    ) {

        return "0";

    }


    return numeric.toLocaleString(
        "ar-EG"
    );

}


/* =========================================================
   DEBUG HELPERS
   ========================================================= */

window.drugDatabase =
    {

        getAllDrugs:
            function () {

                return allDrugs;

            },


        getFilteredDrugs:
            function () {

                return filteredDrugs;

            },


        resetFilters:
            resetFilters,


        applyFilters:
            applyFilters

    };


/* =========================================================
   END OF DRUGS.JS
   ========================================================= */
