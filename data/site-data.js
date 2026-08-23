/* =========================================================
   BAWABET ALTAMREED
   SITE DATA
   ========================================================= */

const BAWABET_DATA = {

    /* =====================================================
       SITE INFORMATION
       ===================================================== */

    site: {

        name: "بوابة التمريض",

        nameEn: "Bawabet Al Tamreed",

        description:
            "مرجع رقمي شامل للتمريض في مصر.",

        url:
            "https://bawabet-altamreed.com/",

        country:
            "Egypt"

    },


    /* =====================================================
       MAIN CATEGORIES
       ===================================================== */

    categories: [

        {
            id: "drugs",
            name: "دليل الأدوية",
            nameEn: "Drug Guide",
            icon: "💊",
            description:
                "معلومات تعليمية عن الأدوية والمادة الفعالة والاستخدامات والتنبيهات.",
            url: "drugs.html"
        },


        {
            id: "skills",
            name: "مهارات التمريض",
            nameEn: "Nursing Skills",
            icon: "🩺",
            description:
                "شرح منظم للمهارات والإجراءات التمريضية.",
            url: "skills.html"
        },


        {
            id: "terminology",
            name: "المصطلحات الطبية",
            nameEn: "Medical Terminology",
            icon: "🧠",
            description:
                "قاموس للمصطلحات الطبية والتمريضية.",
            url: "#"
        },


        {
            id: "calculators",
            name: "الحاسبات الطبية",
            nameEn: "Medical Calculators",
            icon: "🧮",
            description:
                "أدوات وحاسبات مفيدة في التمريض.",
            url: "#"
        },


        {
            id: "lab-tests",
            name: "التحاليل الطبية",
            nameEn: "Lab Tests",
            icon: "🧪",
            description:
                "معلومات تعليمية عن أشهر التحاليل الطبية.",
            url: "#"
        },


        {
            id: "conditions",
            name: "الحالات المرضية",
            nameEn: "Medical Conditions",
            icon: "🫀",
            description:
                "معلومات تعليمية عن الحالات والأمراض.",
            url: "#"
        },


        {
            id: "first-aid",
            name: "الإسعافات الأولية",
            nameEn: "First Aid",
            icon: "🚑",
            description:
                "معلومات أساسية عن الإسعافات الأولية والطوارئ.",
            url: "#"
        },


        {
            id: "infection-control",
            name: "مكافحة العدوى",
            nameEn: "Infection Control",
            icon: "🦠",
            description:
                "مفاهيم وإجراءات مكافحة العدوى.",
            url: "#"
        }

    ],


    /* =====================================================
       WEBSITE FEATURES
       ===================================================== */

    features: [

        {
            id: "smart-search",

            title:
                "البحث الذكي",

            description:
                "ابحث في محتوى بوابة التمريض بسهولة.",

            icon:
                "🔎"

        },


        {
            id: "drug-guide",

            title:
                "دليل الأدوية",

            description:
                "الوصول السريع إلى معلومات الأدوية.",

            icon:
                "💊"

        },


        {
            id: "nursing-skills",

            title:
                "مهارات التمريض",

            description:
                "تعلم الإجراءات والمهارات التمريضية.",

            icon:
                "🩺"

        },


        {
            id: "medical-tools",

            title:
                "الأدوات الطبية",

            description:
                "حاسبات وأدوات تساعدك أثناء الدراسة والعمل.",

            icon:
                "🧮"

        }

    ],


    /* =====================================================
       CONTENT TYPES
       ===================================================== */

    contentTypes: [

        {
            id: "drug",
            name:
                "دواء"
        },


        {
            id: "skill",
            name:
                "مهارة تمريض"
        },


        {
            id: "term",
            name:
                "مصطلح طبي"
        },


        {
            id: "lab",
            name:
                "تحليل طبي"
        },


        {
            id: "condition",
            name:
                "حالة مرضية"
        }

    ],


    /* =====================================================
       SITE STATS
       ===================================================== */

    stats: {

        drugs:
            0,

        skills:
            0,

        terms:
            0,

        labTests:
            0,

        conditions:
            0

    },


    /* =====================================================
       NAVIGATION
       ===================================================== */

    navigation: [

        {
            title:
                "الرئيسية",

            url:
                "index.html"
        },


        {
            title:
                "مهارات التمريض",

            url:
                "skills.html"
        },


        {
            title:
                "دليل الأدوية",

            url:
                "drugs.html"
        },


        {
            title:
                "البحث",

            url:
                "search.html"
        }

    ]

};


/* =========================================================
   GLOBAL ACCESS
   ========================================================= */

window.BAWABET_DATA =
    BAWABET_DATA;
