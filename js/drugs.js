/* =========================================================
   بوابة التمريض - Drug Center
   Main Drug Database Engine
   Database: data/drugs.json
========================================================= */

"use strict";

const DRUG_DATABASE_URL = "data/drugs.json";

let allDrugs = [];
let filteredDrugs = [];

let currentPage = 1;

const RESULTS_PER_PAGE = 24;


/* =========================================================
   DOM
========================================================= */

const searchInput =
    document.getElementById("drugSearch");

const searchButton =
    document.getElementById("drugSearchButton");

const resultsContainer =
    document.getElementById("drugResults");

const resultsCount =
    document.getElementById("drugResultsCount");

const paginationContainer =
    document.getElementById("drugPagination");

const loadingState =
    document.getElementById("drugLoading");

const emptyState =
    document.getElementById("drugEmpty");

const errorState =
    document.getElementById("drugError");


/* =========================================================
   Arabic Text Normalization
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
   Generic Text
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
   Escape HTML
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
   Get Drug Fields
========================================================= */

function getDrugName(drug) {

    return cleanText(
        drug.commercial_name_ar ||
        drug.name_ar ||
        drug.arabic_name ||
        drug.commercial_name ||
        drug.name ||
        drug.brand_name ||
        ""
    );
}


function getDrugEnglishName(drug) {

    return cleanText(
        drug.commercial_name_en ||
        drug.name_en ||
        drug.english_name ||
        drug.brand_name_en ||
        ""
    );
}


function getScientificName(drug) {

    return cleanText(
        drug.scientific_name ||
        drug.active_ingredient ||
        drug.active_ingredients ||
        drug.composition ||
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


/* =========================================================
   Build Search Text
========================================================= */

function buildSearchText(drug) {

    return normalizeArabic(

        [
            getDrugName(drug),

            getDrugEnglishName(drug),

            getScientificName(drug),

            getManufacturer(drug),

            getDrugClass(drug),

            getRoute(drug)

        ].join(" ")

    );
}


/* =========================================================
   Load Database
========================================================= */

async function loadDrugDatabase() {

    showLoading();

    try {

        const response =
            await fetch(
                DRUG_DATABASE_URL,
                {
                    cache: "default"
                }
            );


        if (!response.ok) {

            throw new Error(
                "تعذر تحميل قاعدة بيانات الأدوية."
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


        hideLoading();

        updateResults();


        console.log(
            `Drug Database Loaded: ${allDrugs.length} records`
        );


    } catch (error) {

        console.error(
            "Drug Database Error:",
            error
        );

        showError();

    }

}


/* =========================================================
   Search Database
========================================================= */

function searchDrugs(query) {

    const normalizedQuery =
        normalizeArabic(query);


    if (!normalizedQuery) {

        filteredDrugs =
            [...allDrugs];

        currentPage = 1;

        updateResults();

        return;
    }


    const words =
        normalizedQuery
            .split(" ")
            .filter(Boolean);


    filteredDrugs =
        allDrugs.filter(
            drug => {

                return words.every(
                    word =>
                        drug._searchText.includes(word)
                );

            }
        );


    /*
       ترتيب النتائج:

       1. الاسم العربي يبدأ بالكلمة
       2. الاسم الإنجليزي يبدأ بالكلمة
       3. المادة الفعالة
       4. باقي النتائج
    */

    filteredDrugs.sort(
        (a, b) => {

            const aName =
                normalizeArabic(
                    getDrugName(a)
                );

            const bName =
                normalizeArabic(
                    getDrugName(b)
                );


            const aEnglish =
                normalizeArabic(
                    getDrugEnglishName(a)
                );

            const bEnglish =
                normalizeArabic(
                    getDrugEnglishName(b)
                );


            const aScientific =
                normalizeArabic(
                    getScientificName(a)
                );

            const bScientific =
                normalizeArabic(
                    getScientificName(b)
                );


            const aStarts =
                aName.startsWith(
                    normalizedQuery
                ) ||
                aEnglish.startsWith(
                    normalizedQuery
                );


            const bStarts =
                bName.startsWith(
                    normalizedQuery
                ) ||
                bEnglish.startsWith(
                    normalizedQuery
                );


            if (
                aStarts &&
                !bStarts
            ) {
                return -1;
            }


            if (
                !aStarts &&
                bStarts
            ) {
                return 1;
            }


            const aScientificStarts =
                aScientific.startsWith(
                    normalizedQuery
                );


            const bScientificStarts =
                bScientific.startsWith(
                    normalizedQuery
                );


            if (
                aScientificStarts &&
                !bScientificStarts
            ) {
                return -1;
            }


            if (
                !aScientificStarts &&
                bScientificStarts
            ) {
                return 1;
            }


            return aName.localeCompare(
                bName,
                "ar"
            );

        }
    );


    currentPage = 1;

    updateResults();

}


/* =========================================================
   Render Results
========================================================= */

function renderResults() {

    if (!resultsContainer) {
        return;
    }


    resultsContainer.innerHTML = "";


    const start =
        (currentPage - 1) *
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
        pageResults.length === 0
    ) {

        showEmpty();

        return;
    }


    hideEmpty();


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

                <div class="drug-card-icon">
                    💊
                </div>

                <div class="drug-card-content">

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
                        <div class="drug-name-en">
                            ${escapeHTML(
                                getDrugEnglishName(drug)
                            )}
                        </div>
                        `
                        :
                        ""
                    }

                    ${
                        getScientificName(drug)
                        ?
                        `
                        <div class="drug-field">
                            <strong>
                                المادة الفعالة:
                            </strong>

                            <span>
                                ${escapeHTML(
                                    getScientificName(drug)
                                )}
                            </span>
                        </div>
                        `
                        :
                        ""
                    }

                    ${
                        getManufacturer(drug)
                        ?
                        `
                        <div class="drug-field">
                            <strong>
                                الشركة:
                            </strong>

                            <span>
                                ${escapeHTML(
                                    getManufacturer(drug)
                                )}
                            </span>
                        </div>
                        `
                        :
                        ""
                    }

                    ${
                        getDrugClass(drug)
                        ?
                        `
                        <div class="drug-field">
                            <strong>
                                التصنيف:
                            </strong>

                            <span>
                                ${escapeHTML(
                                    getDrugClass(drug)
                                )}
                            </span>
                        </div>
                        `
                        :
                        ""
                    }

                    ${
                        getRoute(drug)
                        ?
                        `
                        <div class="drug-field">
                            <strong>
                                طريق الاستخدام:
                            </strong>

                            <span>
                                ${escapeHTML(
                                    getRoute(drug)
                                )}
                            </span>
                        </div>
                        `
                        :
                        ""
                    }

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
                        class="drug-details-button"
                        data-drug-id="${escapeHTML(
                            drug._id
                        )}"
                    >
                        عرض التفاصيل
                    </button>

                </div>
            `;


            const detailsButton =
                card.querySelector(
                    ".drug-details-button"
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


    resultsContainer.appendChild(
        fragment
    );


    renderPagination();

}


/* =========================================================
   Update Results
========================================================= */

function updateResults() {

    if (resultsCount) {

        resultsCount.textContent =
            `${filteredDrugs.length.toLocaleString("ar-EG")} دواء`;

    }


    renderResults();

}


/* =========================================================
   Pagination
========================================================= */

function renderPagination() {

    if (!paginationContainer) {
        return;
    }


    paginationContainer.innerHTML = "";


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


    const fragment =
        document.createDocumentFragment();


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

                updateResults();

                scrollToResults();

            }

        }
    );


    fragment.appendChild(
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

        }


        button.addEventListener(
            "click",
            () => {

                currentPage =
                    page;

                updateResults();

                scrollToResults();

            }
        );


        fragment.appendChild(
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

                updateResults();

                scrollToResults();

            }

        }
    );


    fragment.appendChild(
        next
    );


    paginationContainer.appendChild(
        fragment
    );

}


/* =========================================================
   Pagination Button
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


    button.className =
        "pagination-button";


    button.textContent =
        text;


    button.disabled =
        !enabled;


    return button;

}


/* =========================================================
   Drug Details
========================================================= */

function openDrugDetails(drug) {

    const modal =
        document.createElement(
            "div"
        );


    modal.className =
        "drug-modal";


    modal.innerHTML = `

        <div class="drug-modal-overlay"></div>

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


    document.addEventListener(
        "keydown",
        function escapeHandler(event) {

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
    );

}


/* =========================================================
   Detail Row
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
   Loading / Empty / Error
========================================================= */

function showLoading() {

    if (loadingState) {

        loadingState.style.display =
            "";

    }

    if (emptyState) {

        emptyState.style.display =
            "none";

    }

    if (errorState) {

        errorState.style.display =
            "none";

    }

}


function hideLoading() {

    if (loadingState) {

        loadingState.style.display =
            "none";

    }

}


function showEmpty() {

    if (emptyState) {

        emptyState.style.display =
            "";

    }

}


function hideEmpty() {

    if (emptyState) {

        emptyState.style.display =
            "none";

    }

}


function showError() {

    hideLoading();

    if (errorState) {

        errorState.style.display =
            "";

    }

}


/* =========================================================
   Scroll
========================================================= */

function scrollToResults() {

    if (!resultsContainer) {
        return;
    }


    resultsContainer.scrollIntoView(
        {
            behavior: "smooth",
            block: "start"
        }
    );

}


/* =========================================================
   Search Events
========================================================= */

function performSearch() {

    if (!searchInput) {
        return;
    }


    searchDrugs(
        searchInput.value
    );

}


if (searchButton) {

    searchButton.addEventListener(
        "click",
        performSearch
    );

}


if (searchInput) {

    searchInput.addEventListener(
        "input",
        debounce(
            performSearch,
            250
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

                performSearch();

            }

        }
    );

}


/* =========================================================
   Debounce
========================================================= */

function debounce(
    callback,
    delay
) {

    let timer;

    return function (...args) {

        clearTimeout(timer);

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
   URL Search Support
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
        params.get("search");


    if (query) {

        searchInput.value =
            query;

    }

}


/* =========================================================
   Start
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadSearchFromURL();

        loadDrugDatabase();

    }
);
