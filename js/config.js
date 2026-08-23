/* =========================================================
   BAWABET ALTAMREED
   GLOBAL CONFIGURATION
   ========================================================= */

"use strict";

const SITE_CONFIG = {

    /* -----------------------------------------------------
       BASIC INFORMATION
    ----------------------------------------------------- */

    site: {
        name: "بوابة التمريض",
        nameEnglish: "Bawabet Al Tamreed",

        domain: "https://bawabet-altamreed.com",

        description:
            "بوابة التمريض — مرجع عربي شامل للتمريض والعلوم الصحية.",

        language: "ar",
        direction: "rtl",

        country: "Egypt",
        countryCode: "EG",

        timezone: "Africa/Cairo"
    },


    /* -----------------------------------------------------
       BRAND
    ----------------------------------------------------- */

    brand: {
        logo: "🩺",

        primaryColor: "#0B5F75",
        secondaryColor: "#19A7A8",

        slogan:
            "كل ما يحتاجه طالب وممارس التمريض في مكان واحد."
    },


    /* -----------------------------------------------------
       SEO
    ----------------------------------------------------- */

    seo: {

        defaultTitle:
            "بوابة التمريض | المرجع الشامل للتمريض في مصر",

        titleSeparator:
            " | ",

        defaultDescription:
            "بوابة التمريض هي منصة معرفية عربية تهدف إلى توفير المعلومات والأدوات والموارد المفيدة لطلاب وممارسي التمريض.",

        defaultKeywords: [
            "تمريض",
            "التمريض",
            "تمريض مصر",
            "طلاب التمريض",
            "معلومات تمريض",
            "مصطلحات تمريض",
            "أدوية",
            "دليل الأدوية",
            "اختبارات تمريض",
            "مهارات تمريض",
            "معلومات طبية",
            "Nursing",
            "Nursing Egypt",
            "Nursing Students"
        ],

        author: "بوابة التمريض",

        robots:
            "index, follow"
    },


    /* -----------------------------------------------------
       NAVIGATION
    ----------------------------------------------------- */

    navigation: [

        {
            id: "home",
            title: "الرئيسية",
            url: "index.html",
            icon: "🏠"
        },

        {
            id: "drugs",
            title: "دليل الأدوية",
            url: "pages/drugs.html",
            icon: "💊"
        },

        {
            id: "dictionary",
            title: "قاموس التمريض",
            url: "pages/dictionary.html",
            icon: "📖"
        },

        {
            id: "skills",
            title: "مهارات التمريض",
            url: "pages/skills.html",
            icon: "🩺"
        },

        {
            id: "tools",
            title: "أدوات تمريضية",
            url: "pages/tools.html",
            icon: "🧮"
        },

        {
            id: "quizzes",
            title: "اختبارات",
            url: "pages/quizzes.html",
            icon: "📝"
        },

        {
            id: "articles",
            title: "المقالات",
            url: "pages/articles.html",
            icon: "📚"
        },

        {
            id: "jobs",
            title: "وظائف التمريض",
            url: "pages/jobs.html",
            icon: "💼"
        }
    ],


    /* -----------------------------------------------------
       MEDICAL SECTIONS
    ----------------------------------------------------- */

    medicalSections: [

        {
            id: "drugs",
            name: "دليل الأدوية",
            icon: "💊",
            description:
                "معلومات منظمة عن الأدوية واستخداماتها والتحذيرات الخاصة بها."
        },

        {
            id: "dictionary",
            name: "قاموس التمريض",
            icon: "📖",
            description:
                "شرح المصطلحات الطبية والتمريضية بطريقة بسيطة."
        },

        {
            id: "skills",
            name: "مهارات التمريض",
            icon: "🩺",
            description:
                "أدلة تعليمية للمهارات والإجراءات التمريضية."
        },

        {
            id: "anatomy",
            name: "Anatomy",
            icon: "🫀",
            description:
                "معلومات مبسطة عن تشريح جسم الإنسان."
        },

        {
            id: "physiology",
            name: "Physiology",
            icon: "🧠",
            description:
                "شرح مبسط لوظائف أعضاء الجسم."
        },

        {
            id: "first-aid",
            name: "الإسعافات الأولية",
            icon: "🚑",
            description:
                "معلومات أساسية عن التعامل الأولي مع الحالات الطارئة."
        }
    ],


    /* -----------------------------------------------------
       EDUCATION
    ----------------------------------------------------- */

    education: {

        levels: [

            {
                id: "secondary-nursing",
                name: "ثانوي تمريض",
                icon: "🎓"
            },

            {
                id: "nursing-institute",
                name: "معاهد التمريض",
                icon: "🏥"
            },

            {
                id: "nursing-faculty",
                name: "كليات التمريض",
                icon: "🎓"
            },

            {
                id: "nursing-graduate",
                name: "خريجو التمريض",
                icon: "👨‍⚕️"
            },

            {
                id: "nursing-staff",
                name: "هيئة التمريض",
                icon: "🩺"
            }
        ]
    },


    /* -----------------------------------------------------
       SEARCH
    ----------------------------------------------------- */

    search: {

        minimumCharacters: 2,

        maximumResults: 10,

        debounceTime: 300,

        placeholder:
            "ابحث عن دواء، مصطلح، مهارة، مقال أو أي معلومة تمريضية..."

    },


    /* -----------------------------------------------------
       DRUG DATABASE
    ----------------------------------------------------- */

    drugs: {

        dataPath:
            "data/drugs.json",

        categories: [

            "مسكنات",
            "مضادات حيوية",
            "أدوية القلب",
            "أدوية الضغط",
            "أدوية السكر",
            "أدوية الجهاز التنفسي",
            "أدوية الجهاز الهضمي",
            "أدوية الأعصاب",
            "أدوية الحساسية",
            "فيتامينات ومكملات",
            "أدوية الطوارئ",
            "أدوية أخرى"
        ],

        /* Medical disclaimer */

        disclaimer:
            "المعلومات الموجودة في دليل الأدوية لأغراض تعليمية وتثقيفية فقط، ولا تُعد بديلاً عن وصف الطبيب أو الصيدلي أو النشرة الدوائية الرسمية."
    },


    /* -----------------------------------------------------
       DICTIONARY
    ----------------------------------------------------- */

    dictionary: {

        dataPath:
            "data/dictionary.json",

        categories: [

            "مصطلحات تمريض",
            "مصطلحات طبية",
            "Anatomy",
            "Physiology",
            "Pharmacology",
            "Medical-Surgical",
            "Community Health",
            "Emergency"
        ]
    },


    /* -----------------------------------------------------
       ARTICLES
    ----------------------------------------------------- */

    articles: {

        dataPath:
            "data/articles.json",

        articlesPerPage: 12,

        categories: [

            "تمريض",
            "صحة",
            "أدوية",
            "إسعافات أولية",
            "تشريح",
            "مهارات",
            "حياة التمريض",
            "تطوير مهني"
        ]
    },


    /* -----------------------------------------------------
       QUIZZES
    ----------------------------------------------------- */

    quizzes: {

        dataPath:
            "data/quizzes.json",

        questionsPerQuiz: 20,

        defaultTimeMinutes: 15,

        passingPercentage: 60
    },


    /* -----------------------------------------------------
       TOOLS
    ----------------------------------------------------- */

    tools: [

        {
            id: "bmi",
            name: "BMI Calculator",
            title: "حاسبة مؤشر كتلة الجسم",
            icon: "⚖️"
        },

        {
            id: "dose",
            name: "Dose Calculator",
            title: "حاسبة الجرعات",
            icon: "💊"
        },

        {
            id: "iv-flow",
            name: "IV Flow Calculator",
            title: "حاسبة معدل المحاليل",
            icon: "💧"
        },

        {
            id: "gcs",
            name: "GCS Calculator",
            title: "حاسبة Glasgow Coma Scale",
            icon: "🧠"
        },

        {
            id: "ideal-weight",
            name: "Ideal Weight",
            title: "حاسبة الوزن المثالي",
            icon: "⚖️"
        },

        {
            id: "temperature",
            name: "Temperature Converter",
            title: "تحويل درجات الحرارة",
            icon: "🌡️"
        }
    ],


    /* -----------------------------------------------------
       JOBS
    ----------------------------------------------------- */

    jobs: {

        enabled: true,

        dataPath:
            "data/jobs.json",

        categories: [

            "تمريض عام",
            "تمريض طوارئ",
            "العناية المركزة",
            "الأطفال",
            "النساء والتوليد",
            "العمليات",
            "الصحة النفسية",
            "السفر والعمل بالخارج"
        ]
    },


    /* -----------------------------------------------------
       ADS
    ----------------------------------------------------- */

    ads: {

        enabled: true,

        provider:
            "google-adsense",

        /*

        سيتم وضع الـPublisher ID
        بعد إنشاء حساب Google AdSense.

        */

        publisherId: "",

        autoAds: true
    },


    /* -----------------------------------------------------
       ANALYTICS
    ----------------------------------------------------- */

    analytics: {

        enabled: true,

        googleAnalyticsId: "",

        googleSearchConsole:
            true
    },


    /* -----------------------------------------------------
       SOCIAL MEDIA
    ----------------------------------------------------- */

    social: {

        youtube:
            "",

        facebook:
            "",

        instagram:
            "",

        tiktok:
            "",

        whatsapp:
            ""
    },


    /* -----------------------------------------------------
       STORAGE
    ----------------------------------------------------- */

    storage: {

        prefix:
            "bat_",

        keys: {

            theme:
                "theme",

            language:
                "language",

            searchHistory:
                "search_history",

            favorites:
                "favorites",

            quizResults:
                "quiz_results",

            recentlyViewed:
                "recently_viewed"
        }
    },


    /* -----------------------------------------------------
       FEATURE FLAGS
    ----------------------------------------------------- */

    features: {

        drugSearch:
            true,

        dictionary:
            true,

        nursingSkills:
            true,

        quizzes:
            true,

        tools:
            true,

        articles:
            true,

        jobs:
            true,

        favorites:
            true,

        searchHistory:
            true,

        darkMode:
            false,

        notifications:
            false
    },


    /* -----------------------------------------------------
       PERFORMANCE
    ----------------------------------------------------- */

    performance: {

        lazyLoading:
            true,

        cacheData:
            true,

        cacheDuration:
            24 * 60 * 60 * 1000
    },


    /* -----------------------------------------------------
       SECURITY / SAFETY
    ----------------------------------------------------- */

    security: {

        allowExternalLinks:
            true,

        sanitizeUserInput:
            true
    }

};


/* =========================================================
   GLOBAL HELPERS
========================================================= */


/**
 * Create a full site URL.
 */
function siteUrl(path = "") {

    if (!path) {
        return SITE_CONFIG.site.domain;
    }

    return `${SITE_CONFIG.site.domain}/${path
        .replace(/^\/+/, "")}`;
}


/**
 * Create a page title.
 */
function pageTitle(title = "") {

    if (!title) {
        return SITE_CONFIG.seo.defaultTitle;
    }

    return `${title}${SITE_CONFIG.seo.titleSeparator}${SITE_CONFIG.site.name}`;
}


/**
 * Get local storage key.
 */
function storageKey(key) {

    return `${SITE_CONFIG.storage.prefix}${key}`;
}


/**
 * Save JSON data.
 */
function saveLocalData(key, data) {

    try {

        localStorage.setItem(
            storageKey(key),
            JSON.stringify(data)
        );

        return true;

    } catch (error) {

        console.error(
            "Unable to save local data:",
            error
        );

        return false;
    }
}


/**
 * Read JSON data.
 */
function getLocalData(key, fallback = null) {

    try {

        const value =
            localStorage.getItem(
                storageKey(key)
            );

        if (!value) {
            return fallback;
        }

        return JSON.parse(value);

    } catch (error) {

        console.error(
            "Unable to read local data:",
            error
        );

        return fallback;
    }
}


/**
 * Remove local data.
 */
function removeLocalData(key) {

    try {

        localStorage.removeItem(
            storageKey(key)
        );

        return true;

    } catch (error) {

        console.error(
            "Unable to remove local data:",
            error
        );

        return false;
    }
}


/**
 * Simple debounce helper.
 */
function debounce(callback, delay = 300) {

    let timeout;

    return function (...args) {

        clearTimeout(timeout);

        timeout = setTimeout(
            () => callback.apply(this, args),
            delay
        );
    };
}


/**
 * Escape HTML.
 */
function escapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/**
 * Check if device is mobile.
 */
function isMobile() {

    return window.matchMedia(
        "(max-width: 768px)"
    ).matches;
}


/**
 * Scroll to element.
 */
function scrollToElement(
    selector,
    behavior = "smooth"
) {

    const element =
        document.querySelector(selector);

    if (!element) {
        return;
    }

    element.scrollIntoView({
        behavior,
        block: "start"
    });
}


/**
 * Format Arabic numbers.
 */
function toArabicNumbers(value) {

    const numbers = [
        "٠",
        "١",
        "٢",
        "٣",
        "٤",
        "٥",
        "٦",
        "٧",
        "٨",
        "٩"
    ];

    return String(value).replace(
        /\d/g,
        digit => numbers[digit]
    );
}


/**
 * Format date.
 */
function formatDate(
    date,
    options = {}
) {

    const targetDate =
        new Date(date);

    if (
        Number.isNaN(
            targetDate.getTime()
        )
    ) {
        return "";
    }

    return new Intl.DateTimeFormat(
        "ar-EG",
        {
            year: "numeric",
            month: "long",
            day: "numeric",
            ...options
        }
    ).format(targetDate);
}


/**
 * Check if value exists.
 */
function isEmpty(value) {

    return (
        value === null ||
        value === undefined ||
        String(value).trim() === ""
    );
}


/* =========================================================
   EXPORT TO GLOBAL WINDOW
========================================================= */

window.BAWABET = {

    config:
        SITE_CONFIG,

    helpers: {

        siteUrl,

        pageTitle,

        storageKey,

        saveLocalData,

        getLocalData,

        removeLocalData,

        debounce,

        escapeHTML,

        isMobile,

        scrollToElement,

        toArabicNumbers,

        formatDate,

        isEmpty
    }

};
