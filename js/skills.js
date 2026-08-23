"use strict";

/* =========================================================
   BAWABET ALTAMREED
   NURSING SKILLS ENGINE
   ========================================================= */

const BAWABET_SKILLS = {

    data: null,

    state: {
        query: "",
        category: "all",
        level: "all",
        currentSkill: null
    },


    /* =====================================================
       INIT
       ===================================================== */

    async init() {

        const container =
            document.querySelector("[data-skills]");

        if (!container) return;

        await this.loadData();

        if (!this.data) return;

        this.initSearch();
        this.initCategoryFilter();
        this.initLevelFilter();
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
                await fetch("data/skills.json");

            if (!response.ok) {
                throw new Error(
                    `HTTP ${response.status}`
                );
            }

            this.data =
                await response.json();

        } catch (error) {

            console.error(
                "Skills database loading error:",
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
                "[data-skills-search]"
            );

        inputs.forEach(input => {

            input.addEventListener(
                "input",
                this.debounce(() => {

                    this.state.query =
                        input.value
                            .trim()
                            .toLowerCase();

                    this.render();

                }, 250)
            );

        });
    },


    /* =====================================================
       CATEGORY
       ===================================================== */

    initCategoryFilter() {

        const buttons =
            document.querySelectorAll(
                "[data-skill-category]"
            );

        buttons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    this.state.category =
                        button.dataset
                            .skillCategory ||
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
       LEVEL
       ===================================================== */

    initLevelFilter() {

        const buttons =
            document.querySelectorAll(
                "[data-skill-level]"
            );

        buttons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    this.state.level =
                        button.dataset
                            .skillLevel ||
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
       CLEAR
       ===================================================== */

    initClearButton() {

        document.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "[data-skills-clear]"
                    );

                if (!button) return;

                const input =
                    document.querySelector(
                        "[data-skills-search]"
                    );

                if (input) {
                    input.value = "";
                }

                this.state.query = "";
                this.state.category = "all";
                this.state.level = "all";

                document
                    .querySelectorAll(
                        "[data-skill-category], [data-skill-level]"
                    )
                    .forEach(item => {

                        item.classList.toggle(
                            "active",
                            item.dataset.skillCategory === "all" ||
                            item.dataset.skillLevel === "all"
                        );

                    });

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

                const skill =
                    event.target.closest(
                        "[data-skill-id]"
                    );

                if (
                    skill &&
                    !event.target.closest(
                        "[data-skill-action]"
                    )
                ) {

                    this.openSkill(
                        skill.dataset.skillId
                    );

                    return;
                }


                const close =
                    event.target.closest(
                        "[data-skill-close]"
                    );

                if (close) {
                    this.closeSkill();
                }

            }
        );


        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Escape" &&
                    this.state.currentSkill
                ) {

                    this.closeSkill();
                }

            }
        );
    },


    /* =====================================================
       FILTER
       ===================================================== */

    getFilteredSkills() {

        if (
            !this.data ||
            !Array.isArray(this.data.skills)
        ) {
            return [];
        }


        return this.data.skills.filter(
            skill => {

                const categoryMatch =
                    this.state.category === "all" ||
                    skill.category ===
                    this.state.category;


                const levelMatch =
                    this.state.level === "all" ||
                    skill.level ===
                    this.state.level;


                if (
                    !categoryMatch ||
                    !levelMatch
                ) {
                    return false;
                }


                if (!this.state.query) {
                    return true;
                }


                const searchable = [

                    skill.title,

                    skill.arabicTitle,

                    skill.shortDescription,

                    skill.level,

                    ...(skill.keywords || []),

                    ...(skill.purpose || []),

                    ...(skill.equipment || [])

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
                "[data-skills-results]"
            );

        if (!container) return;


        const skills =
            this.getFilteredSkills();


        this.updateCount(
            skills.length
        );


        if (!skills.length) {

            container.innerHTML = `

                <div class="skills-empty">

                    <div class="skills-empty-icon">
                        🩺
                    </div>

                    <h3>
                        مش لاقيين المهارة دي
                    </h3>

                    <p>
                        جرّب اسم مهارة مختلف أو
                        غيّر الفلاتر.
                    </p>

                    <button
                        type="button"
                        class="btn btn-primary"
                        data-skills-clear
                    >
                        مسح البحث
                    </button>

                </div>

            `;

            return;
        }


        container.innerHTML =
            skills
                .map(skill =>
                    this.createCard(skill)
                )
                .join("");
    },


    /* =====================================================
       CARD
       ===================================================== */

    createCard(skill) {

        return `

            <article
                class="skill-card"
                data-skill-id="${this.escape(
                    skill.id
                )}"
            >

                <div class="skill-card-top">

                    <span class="skill-category">

                        ${this.getCategoryName(
                            skill.category
                        )}

                    </span>

                    <span class="skill-level">

                        ${this.getLevelName(
                            skill.level
                        )}

                    </span>

                </div>


                <div class="skill-card-body">

                    <span class="skill-english">

                        ${this.escape(
                            skill.title
                        )}

                    </span>

                    <h3>

                        ${this.escape(
                            skill.arabicTitle
                        )}

                    </h3>

                    <p>

                        ${this.escape(
                            skill.shortDescription
                        )}

                    </p>

                </div>


                <div class="skill-card-footer">

                    <span>
                        عرض المهارة
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
       LEVEL NAME
       ===================================================== */

    getLevelName(level) {

        const levels = {

            beginner:
                "🟢 مبتدئ",

            intermediate:
                "🟡 متوسط",

            advanced:
                "🔴 متقدم"

        };


        return levels[level] ||
            this.escape(level);
    },


    /* =====================================================
       OPEN SKILL
       ===================================================== */

    openSkill(id) {

        if (!this.data) return;


        const skill =
            this.data.skills.find(
                item =>
                    item.id === id
            );


        if (!skill) return;


        this.state.currentSkill =
            skill;


        let modal =
            document.querySelector(
                "[data-skill-modal]"
            );


        if (!modal) {

            modal =
                document.createElement(
                    "div"
                );

            modal.className =
                "skill-modal";

            modal.dataset.skillModal =
                "true";

            document.body.appendChild(
                modal
            );
        }


        modal.innerHTML = `

            <div
                class="skill-modal-overlay"
                data-skill-close
            ></div>


            <div
                class="skill-modal-content"
                role="dialog"
                aria-modal="true"
            >

                <button
                    type="button"
                    class="skill-modal-close"
                    data-skill-close
                    aria-label="إغلاق"
                >
                    ✕
                </button>


                <header class="skill-modal-header">

                    <span class="skill-modal-category">

                        ${this.getCategoryName(
                            skill.category
                        )}

                    </span>


                    <span class="skill-modal-level">

                        ${this.getLevelName(
                            skill.level
                        )}

                    </span>


                    <span class="skill-modal-english">

                        ${this.escape(
                            skill.title
                        )}

                    </span>


                    <h2>

                        ${this.escape(
                            skill.arabicTitle
                        )}

                    </h2>


                    <p>

                        ${this.escape(
                            skill.shortDescription
                        )}

                    </p>

                </header>


                ${
                    this.createListSection(
                        "🎯 الهدف من المهارة",
                        skill.purpose
                    )
                }


                ${
                    this.createListSection(
                        "🧰 الأدوات المطلوبة",
                        skill.equipment
                    )
                }


                ${
                    this.createStepsSection(
                        skill.steps
                    )
                }


                ${
                    this.createListSection(
                        "⚠️ ملاحظات مهمة",
                        skill.importantNotes
                    )
                }


                ${
                    this.createListSection(
                        "❌ أخطاء شائعة",
                        skill.commonMistakes
                    )
                }


                <div class="skill-learning-note">

                    <strong>
                        📚 ملاحظة تعليمية
                    </strong>

                    <p>
                        هذا المحتوى تعليمي.
                        التطبيق العملي للمهارات يجب أن
                        يتم تحت إشراف مدرب أو ممارس صحي
                        مؤهل ووفق سياسات المنشأة الصحية.
                    </p>

                </div>

            </div>

        `;


        requestAnimationFrame(() => {

            modal.classList.add(
                "open"
            );

        });


        document.body.classList.add(
            "skill-modal-open"
        );
    },


    /* =====================================================
       STEPS
       ===================================================== */

    createStepsSection(steps) {

        if (
            !Array.isArray(steps) ||
            !steps.length
        ) {
            return "";
        }


        return `

            <section class="skill-section">

                <h4>
                    📝 الخطوات العامة
                </h4>

                <ol class="skill-steps">

                    ${steps
                        .map(
                            (step, index) => `

                                <li>

                                    <span
                                        class="step-number"
                                    >
                                        ${
                                            index + 1
                                        }
                                    </span>

                                    <span>
                                        ${this.escape(
                                            step
                                        )}
                                    </span>

                                </li>

                            `
                        )
                        .join("")
                    }

                </ol>

            </section>

        `;
    },


    /* =====================================================
       LIST SECTION
       ===================================================== */

    createListSection(
        title,
        items
    ) {

        if (
            !Array.isArray(items) ||
            !items.length
        ) {
            return "";
        }


        return `

            <section class="skill-section">

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

    closeSkill() {

        const modal =
            document.querySelector(
                "[data-skill-modal]"
            );


        if (!modal) return;


        modal.classList.remove(
            "open"
        );


        setTimeout(() => {

            if (modal.parentNode) {
                modal.remove();
            }

        }, 250);


        document.body.classList.remove(
            "skill-modal-open"
        );


        this.state.currentSkill =
            null;
    },


    /* =====================================================
       COUNT
       ===================================================== */

    updateCount(count) {

        document
            .querySelectorAll(
                "[data-skills-count]"
            )
            .forEach(element => {

                element.textContent =
                    count.toLocaleString(
                        "ar-EG"
                    );

            });
    },


    /* =====================================================
       ERROR
       ===================================================== */

    showError() {

        const container =
            document.querySelector(
                "[data-skills-results]"
            );


        if (!container) return;


        container.innerHTML = `

            <div class="skills-error">

                <div>
                    ⚠️
                </div>

                <h3>
                    تعذر تحميل مهارات التمريض
                </h3>

                <p>
                    حاول تحديث الصفحة مرة أخرى.
                </p>

            </div>

        `;
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

        BAWABET_SKILLS.init();

    }
);


/* =========================================================
   GLOBAL ACCESS
   ========================================================= */

window.BAWABET_SKILLS =
    BAWABET_SKILLS;
