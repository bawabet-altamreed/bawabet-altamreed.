/* =========================================================
   BAWABET ALTAMREED
   GLOBAL SEARCH ENGINE
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       CONFIGURATION
       ===================================================== */

    const SEARCH_INDEX = [

        /* =========================
           DRUGS
           ========================= */

        {
            title: "دليل الأدوية",
            keywords: [
                "دواء",
                "ادوية",
                "الأدوية",
                "medicine",
                "medicines",
                "drug",
                "drugs",
                "medication"
            ],
            description:
                "ابحث عن معلومات الأدوية والمادة الفعالة والاستخدامات والتنبيهات.",
            url: "drugs.html",
            category: "الأدوية",
            icon: "💊"
        },


        /* =========================
           NURSING SKILLS
           ========================= */

        {
            title: "مهارات التمريض",
            keywords: [
                "مهارة",
                "مهارات",
                "تمريض",
                "nursing",
                "skill",
                "skills",
                "nursing skills"
            ],
            description:
                "دليل مهارات التمريض والخطوات الأساسية بطريقة منظمة.",
            url: "skills.html",
            category: "مهارات التمريض",
            icon: "🩺"
        },


        /* =========================
           MEDICAL TERMINOLOGY
           ========================= */

        {
            title: "قاموس المصطلحات الطبية",
            keywords: [
                "مصطلحات",
                "مصطلح",
                "مصطلحات طبية",
                "medical terminology",
                "terminology",
                "medical terms",
                "terms"
            ],
            description:
                "قاموس للمصطلحات الطبية والتمريضية بالعربي والإنجليزي.",
            url: "#",
            category: "مصطلحات طبية",
            icon: "🧠"
        },


        /* =========================
           MEDICAL CALCULATORS
           ========================= */

        {
            title: "الحاسبات الطبية",
            keywords: [
                "حاسبة",
                "حاسبات",
                "حساب",
                "حسابات طبية",
                "medical calculator",
                "medical calculators",
                "calculator",
                "calculators"
            ],
            description:
                "أدوات وحاسبات طبية مفيدة للطلاب والممارسين.",
            url: "#",
            category: "أدوات طبية",
            icon: "🧮"
        },


        /* =========================
           LAB TESTS
           ========================= */

        {
            title: "التحاليل الطبية",
            keywords: [
                "تحاليل",
                "تحليل",
                "تحاليل طبية",
                "lab",
                "labs",
                "laboratory",
                "lab tests",
                "blood test"
            ],
            description:
                "مرجع مبسط لفهم أشهر التحاليل الطبية والقيم المرتبطة بها.",
            url: "#",
            category: "تحاليل طبية",
            icon: "🧪"
        },


        /* =========================
           MEDICAL CONDITIONS
           ========================= */

        {
            title: "الحالات المرضية",
            keywords: [
                "مرض",
                "امراض",
                "الأمراض",
                "حالة مرضية",
                "disease",
                "diseases",
                "medical condition",
                "conditions"
            ],
            description:
                "معلومات تعليمية عن الحالات المرضية والأعراض والمفاهيم الأساسية.",
            url: "#",
            category: "حالات مرضية",
            icon: "🫀"
        },


        /* =========================
           ANATOMY
           ========================= */

        {
            title: "Anatomy | علم التشريح",
            keywords: [
                "anatomy",
                "تشريح",
                "علم التشريح",
                "جسم الانسان",
                "body",
                "human body"
            ],
            description:
                "معلومات ومراجع مبسطة في علم التشريح لطلاب التمريض.",
            url: "#",
            category: "علوم التمريض",
            icon: "🦴"
        },


        /* =========================
           FIRST AID
           ========================= */

        {
            title: "الإسعافات الأولية",
            keywords: [
                "اسعافات",
                "إسعافات أولية",
                "first aid",
                "emergency",
                "طوارئ"
            ],
            description:
                "معلومات تعليمية عن الإسعافات الأولية والتعامل الأولي مع الحالات الطارئة.",
            url: "#",
            category: "طوارئ",
            icon: "🚑"
        },


        /* =========================
           INFECTION CONTROL
           ========================= */

        {
            title: "مكافحة العدوى",
            keywords: [
                "مكافحة العدوى",
                "عدوى",
                "infection",
                "infection control",
                "aseptic",
                "sterilization",
                "تعقيم"
            ],
            description:
                "معلومات ومفاهيم أساسية حول مكافحة العدوى والتعقيم.",
            url: "#",
            category: "مكافحة العدوى",
            icon: "🦠"
        }

    ];


    /* =====================================================
       NORMALIZE ARABIC
       ===================================================== */

    function normalizeText(text) {

        return String(text || "")
            .toLowerCase()
            .trim()

            .replace(/[أإآ]/g, "ا")
            .replace(/ة/g, "ه")
            .replace(/ى/g, "ي")
            .replace(/ؤ/g, "و")
            .replace(/ئ/g, "ي")

            .replace(/[ًٌٍَُِّْـ]/g, "")

            .replace(/[^\u0600-\u06FFa-z0-9\s]/gi, " ")

            .replace(/\s+/g, " ")
            .trim();

    }


    /* =====================================================
       SEARCH
       ===================================================== */

    function searchSite(query) {

        const normalizedQuery =
            normalizeText(query);


        if (!normalizedQuery) {

            return [];

        }


        const queryWords =
            normalizedQuery
                .split(" ")
                .filter(Boolean);


        return SEARCH_INDEX
            .map(function (item) {

                let score = 0;


                const title =
                    normalizeText(
                        item.title
                    );


                const description =
                    normalizeText(
                        item.description
                    );


                const keywords =
                    item.keywords
                        .map(normalizeText);


                /* Exact title */

                if (
                    title === normalizedQuery
                ) {

                    score += 100;

                }


                /* Title contains query */

                if (
                    title.includes(
                        normalizedQuery
                    )
                ) {

                    score += 60;

                }


                /* Keyword match */

                keywords.forEach(
                    function (keyword) {

                        if (
                            keyword ===
                            normalizedQuery
                        ) {

                            score += 50;

                        }


                        if (
                            keyword.includes(
                                normalizedQuery
                            )
                        ) {

                            score += 25;

                        }

                    }
                );


                /* Word matching */

                queryWords.forEach(
                    function (word) {

                        if (
                            title.includes(word)
                        ) {

                            score += 15;

                        }


                        if (
                            description.includes(
                                word
                            )
                        ) {

                            score += 5;

                        }


                        keywords.forEach(
                            function (keyword) {

                                if (
                                    keyword.includes(
                                        word
                                    )
                                ) {

                                    score += 10;

                                }

                            }
                        );

                    }
                );


                return {
                    item: item,
                    score: score
                };

            })

            .filter(function (result) {

                return result.score > 0;

            })

            .sort(function (a, b) {

                return b.score - a.score;

            })

            .map(function (result) {

                return result.item;

            });

    }


    /* =====================================================
       URL SEARCH
       ===================================================== */

    function getSearchQuery() {

        const params =
            new URLSearchParams(
                window.location.search
            );


        return (
            params.get("search") ||
            params.get("q") ||
            ""
        );

    }


    /* =====================================================
       REDIRECT SEARCH
       ===================================================== */

    function performSearch(query) {

        const cleanQuery =
            query.trim();


        if (!cleanQuery) {

            return;

        }


        const results =
            searchSite(cleanQuery);


        /*
         * لو لقينا نتيجة واحدة واضحة
         * نروح لها مباشرة.
         */

        if (
            results.length === 1 &&
            results[0].url !== "#"
        ) {

            window.location.href =
                results[0].url +
                "?search=" +
                encodeURIComponent(
                    cleanQuery
                );

            return;

        }


        /*
         * الأدوية
         */

        const normalized =
            normalizeText(
                cleanQuery
            );


        if (
            normalized.includes("دواء") ||
            normalized.includes("ادويه") ||
            normalized.includes("medicine") ||
            normalized.includes("drug")
        ) {

            window.location.href =
                "drugs.html?search=" +
                encodeURIComponent(
                    cleanQuery
                );

            return;

        }


        /*
         * المهارات
         */

        if (
            normalized.includes("مهار") ||
            normalized.includes("nursing") ||
            normalized.includes("skill")
        ) {

            window.location.href =
                "skills.html?search=" +
                encodeURIComponent(
                    cleanQuery
                );

            return;

        }


        /*
         * في حالة عدم وجود تطابق واضح
         * نفتح صفحة نتائج البحث.
         */

        window.location.href =
            "search.html?q=" +
            encodeURIComponent(
                cleanQuery
            );

    }


    /* =====================================================
       ATTACH GLOBAL SEARCH
       ===================================================== */

    function initializeSearch() {

        const forms =
            document.querySelectorAll(
                "#globalSearch"
            );


        forms.forEach(
            function (form) {

                form.addEventListener(
                    "submit",
                    function (event) {

                        event.preventDefault();


                        const input =
                            form.querySelector(
                                "input"
                            );


                        if (!input) {
                            return;
                        }


                        performSearch(
                            input.value
                        );

                    }
                );

            }
        );


        /*
         * لو الصفحة اتفتحت بباراميتر search
         * نحط القيمة داخل مربع البحث.
         */

        const query =
            getSearchQuery();


        if (query) {

            const input =
                document.querySelector(
                    "#globalSearchInput"
                );


            if (input) {

                input.value =
                    query;

            }

        }

    }


    /* =====================================================
       PUBLIC API
       ===================================================== */

    window.BawabetSearch = {

        search:
            searchSite,

        normalize:
            normalizeText,

        perform:
            performSearch,

        index:
            SEARCH_INDEX

    };


    /* =====================================================
       START
       ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeSearch
        );

    } else {

        initializeSearch();

    }


})();
