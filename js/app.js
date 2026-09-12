/* =========================================
   JORY ENGLISH 🎀
   Global App System
   Theme + Language + LocalStorage
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================
     ELEMENTS
     ========================================= */

  const languageToggle = document.getElementById("languageToggle");
  const themeToggle = document.getElementById("themeToggle");


  /* =========================================
     DEFAULT SETTINGS
     ========================================= */

  const savedLanguage =
    localStorage.getItem("joryLanguage") || "en";

  const savedTheme =
    localStorage.getItem("joryTheme") || "light";


  /* =========================================
     TRANSLATIONS
     ========================================= */

  const translations = {

    en: {
      languageButton: "🇸🇦 العربية",
      themeButton: "🌙 Dark",

      heroBadge: "🎀 Learn English Your Way",

      heroTitle: "Learn English with Jory",

      heroDescription:
        "Simple, interactive English learning for every level.",

      levelsTitle: "Choose Your Level",

      levelsDescription:
        "Start learning at the level that is right for you.",

      a1Title: "Beginner",
      a1Description: "Start with simple English.",

      a2Title: "Elementary",
      a2Description: "Build your everyday English.",

      b1Title: "Intermediate",
      b1Description:
        "Improve your communication skills.",

      b2Title: "Upper-Intermediate",
      b2Description:
        "Develop stronger English skills.",

      stories: "📖 20 Stories",

      phonicsLabel: "PHONICS",

      phonicsTitle: "Learn English Sounds",

      phonicsDescription:
        "Learn letters, sounds, pronunciation and practice.",

      footer: "Jory English 🎀"
    },


    ar: {
      languageButton: "🇬🇧 English",
      themeButton: "🌙 الوضع الليلي",

      heroBadge: "🎀 تعلمي الإنجليزية بطريقتك",

      heroTitle: "تعلمي الإنجليزية مع Jory",

      heroDescription:
        "تعلم بسيط وتفاعلي للغة الإنجليزية لجميع المستويات.",

      levelsTitle: "اختاري مستواك",

      levelsDescription:
        "ابدئي التعلم من المستوى المناسب لكِ.",

      a1Title: "مبتدئ",

      a1Description:
        "ابدئي بأساسيات اللغة الإنجليزية البسيطة.",

      a2Title: "ابتدائي",

      a2Description:
        "طوري لغتك الإنجليزية المستخدمة في الحياة اليومية.",

      b1Title: "متوسط",

      b1Description:
        "طوري مهارات التواصل باللغة الإنجليزية.",

      b2Title: "فوق المتوسط",

      b2Description:
        "طوري مهاراتك في اللغة الإنجليزية بشكل أقوى.",

      stories: "📖 20 قصة",

      phonicsLabel: "الفونكس",

      phonicsTitle: "تعلمي أصوات اللغة الإنجليزية",

      phonicsDescription:
        "تعلمي الحروف والأصوات والنطق مع تمارين تفاعلية.",

      footer: "Jory English 🎀"
    }

  };


  /* =========================================
     APPLY LANGUAGE
     ========================================= */

  function applyLanguage(language) {

    const content = translations[language];

    if (!content) {
      return;
    }


    document.documentElement.lang = language;

    document.documentElement.dir =
      language === "ar" ? "rtl" : "ltr";


    /* Buttons */

    if (languageToggle) {
      languageToggle.textContent =
        content.languageButton;
    }


    /* Hero */

    const heroBadge =
      document.querySelector(".hero-badge");

    if (heroBadge) {
      heroBadge.textContent =
        content.heroBadge;
    }


    const heroTitle =
      document.getElementById("heroTitle");

    if (heroTitle) {
      heroTitle.textContent =
        content.heroTitle;
    }


    const heroDescription =
      document.getElementById("heroDescription");

    if (heroDescription) {
      heroDescription.textContent =
        content.heroDescription;
    }


    /* Levels */

    const levelsTitle =
      document.getElementById("levelsTitle");

    if (levelsTitle) {
      levelsTitle.textContent =
        content.levelsTitle;
    }


    const levelsDescription =
      document.getElementById("levelsDescription");

    if (levelsDescription) {
      levelsDescription.textContent =
        content.levelsDescription;
    }


    /* A1 */

    const a1Card =
      document.querySelector(".level-a1");

    if (a1Card) {

      const title =
        a1Card.querySelector("h3");

      const description =
        a1Card.querySelector("p");

      const storyCount =
        a1Card.querySelector(".story-count");

      if (title) {
        title.textContent =
          content.a1Title;
      }

      if (description) {
        description.textContent =
          content.a1Description;
      }

      if (storyCount) {
        storyCount.textContent =
          content.stories;
      }
    }


    /* A2 */

    const a2Card =
      document.querySelector(".level-a2");

    if (a2Card) {

      const title =
        a2Card.querySelector("h3");

      const description =
        a2Card.querySelector("p");

      const storyCount =
        a2Card.querySelector(".story-count");

      if (title) {
        title.textContent =
          content.a2Title;
      }

      if (description) {
        description.textContent =
          content.a2Description;
      }

      if (storyCount) {
        storyCount.textContent =
          content.stories;
      }
    }


    /* B1 */

    const b1Card =
      document.querySelector(".level-b1");

    if (b1Card) {

      const title =
        b1Card.querySelector("h3");

      const description =
        b1Card.querySelector("p");

      const storyCount =
        b1Card.querySelector(".story-count");

      if (title) {
        title.textContent =
          content.b1Title;
      }

      if (description) {
        description.textContent =
          content.b1Description;
      }

      if (storyCount) {
        storyCount.textContent =
          content.stories;
      }
    }


    /* B2 */

    const b2Card =
      document.querySelector(".level-b2");

    if (b2Card) {

      const title =
        b2Card.querySelector("h3");

      const description =
        b2Card.querySelector("p");

      const storyCount =
        b2Card.querySelector(".story-count");

      if (title) {
        title.textContent =
          content.b2Title;
      }

      if (description) {
        description.textContent =
          content.b2Description;
      }

      if (storyCount) {
        storyCount.textContent =
          content.stories;
      }
    }


    /* Phonics */

    const phonicsLabel =
      document.querySelector(".phonics-label");

    if (phonicsLabel) {
      phonicsLabel.textContent =
        content.phonicsLabel;
    }


    const phonicsTitle =
      document.querySelector(".phonics-content h2");

    if (phonicsTitle) {
      phonicsTitle.textContent =
        content.phonicsTitle;
    }


    const phonicsDescription =
      document.querySelector(".phonics-content p");

    if (phonicsDescription) {
      phonicsDescription.textContent =
        content.phonicsDescription;
    }


    /* Footer */

    const footer =
      document.querySelector(".site-footer p");

    if (footer) {
      footer.textContent =
        content.footer;
    }


    /* Save */

    localStorage.setItem(
      "joryLanguage",
      language
    );
  }


  /* =========================================
     APPLY THEME
     ========================================= */

  function applyTheme(theme) {

    document.body.classList.toggle(
      "dark",
      theme === "dark"
    );


    if (themeToggle) {

      themeToggle.textContent =
        theme === "dark"
          ? "☀️ Light"
          : translations[savedLanguage].themeButton;
    }


    localStorage.setItem(
      "joryTheme",
      theme
    );
  }


  /* =========================================
     LANGUAGE BUTTON
     ========================================= */

  if (languageToggle) {

    languageToggle.addEventListener(
      "click",
      () => {

        const currentLanguage =
          localStorage.getItem("joryLanguage") || "en";

        const newLanguage =
          currentLanguage === "en"
            ? "ar"
            : "en";

        applyLanguage(newLanguage);

        /*
          Re-apply theme so the button text
          matches the new language.
        */

        const currentTheme =
          localStorage.getItem("joryTheme") || "light";

        applyTheme(currentTheme);
      }
    );
  }


  /* =========================================
     THEME BUTTON
     ========================================= */

  if (themeToggle) {

    themeToggle.addEventListener(
      "click",
      () => {

        const currentTheme =
          localStorage.getItem("joryTheme") || "light";

        const newTheme =
          currentTheme === "light"
            ? "dark"
            : "light";

        applyTheme(newTheme);
      }
    );
  }


  /* =========================================
     INITIALIZE APP
     ========================================= */

  applyLanguage(savedLanguage);

  applyTheme(savedTheme);

});
