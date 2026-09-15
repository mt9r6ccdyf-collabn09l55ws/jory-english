/* =========================================
   JORY ENGLISH 🎀
   STORY PAGE
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================
     GET STORY
     ========================================= */

  const params =
    new URLSearchParams(window.location.search);

  const storyId =
    params.get("story");

  let story = null;


  if (typeof STORIES !== "undefined") {

    if (
      storyId &&
      typeof getStoryById === "function"
    ) {
      story = getStoryById(storyId);
    }

    if (
      !story &&
      typeof getStoriesByLevel === "function"
    ) {

      const a1Stories =
        getStoriesByLevel("A1");

      if (
        a1Stories &&
        a1Stories.length > 0
      ) {
        story = a1Stories[0];
      }

    }

  }


  /* =========================================
     ELEMENTS
     ========================================= */

  const storyEmoji =
    document.getElementById("storyEmoji");

  const storyLevel =
    document.getElementById("storyLevel");

  const storyTitle =
    document.getElementById("storyTitle");

  const storyDescription =
    document.getElementById("storyDescription");

  const backToLevel =
    document.getElementById("backToLevel");

  const sentenceNumber =
    document.getElementById("sentenceNumber");

  const currentWordMeaning =
    document.getElementById("currentWordMeaning");

  const currentWordIPA =
    document.getElementById("currentWordIPA");

  const sentenceWritingArea =
    document.getElementById("sentenceWritingArea");

  const sentenceEditor =
    document.getElementById("sentenceEditor");

  const ghostSentence =
    document.getElementById("ghostSentence");

  const typingFeedback =
    document.getElementById("typingFeedback");

  const sentenceAudioButton =
    document.getElementById("sentenceAudioButton");

  const nextSentenceButton =
    document.getElementById("nextSentenceButton");

  const sentenceProgressText =
    document.getElementById("sentenceProgressText");

  const sentenceProgressFill =
    document.getElementById("sentenceProgressFill");


  /* =========================================
     STORY CHECK
     ========================================= */

  if (!story) {

    if (storyTitle) {
      storyTitle.textContent =
        "Story not found";
    }

    if (storyDescription) {
      storyDescription.textContent =
        "We could not find this story.";
    }

    return;
  }


  /* =========================================
     SENTENCES
     ========================================= */

  const sentences =
    Array.isArray(story.sentences)
      ? story.sentences
      : [];

  if (!sentences.length) {
    return;
  }


  let currentSentenceIndex = 0;

  let sentenceCompleted = false;

  let lastCompletedSegment = "";


  /* =========================================
     LANGUAGE
     ========================================= */

  function getLanguage() {

    return (
      localStorage.getItem("joryLanguage") ||
      "en"
    );

  }


  /* =========================================
     NORMAL TEXT
     ========================================= */

  function normalizeText(text) {

    return String(text || "")
      .replace(/\u00A0/g, " ")
      .replace(/[\r\n\t]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  }


  /* =========================================
     TEXT FOR ANSWER CHECKING
     
     This is more forgiving than the
     old version.

     It ignores:
     - upper/lower case
     - extra spaces
     - punctuation differences
     ========================================= */

  function normalizeForAnswer(text) {

    return normalizeText(text)
      .toLowerCase()
      .replace(/[.,!?;:'"“”‘’()[\]{}]/g, "")
      .replace(/\s+/g, " ")
      .trim();

  }


  /* =========================================
     SPEAK
     ========================================= */

  function speak(text) {

    if (!text) {
      return;
    }

    if (
      !("speechSynthesis" in window)
    ) {
      return;
    }


    window.speechSynthesis.cancel();


    const voice =
      new SpeechSynthesisUtterance(text);

    voice.lang = "en-US";

    voice.rate = 0.88;

    voice.pitch = 1;


    window.speechSynthesis.speak(voice);

  }


  /* =========================================
     CLEAN WORD
     ========================================= */

  function cleanWord(text) {

    return String(text || "")
      .replace(
        /^[.,!?;:'"“”‘’()[\]{}]+/g,
        ""
      )
      .replace(
        /[.,!?;:'"“”‘’()[\]{}]+$/g,
        ""
      )
      .trim();

  }


  /* =========================================
     GET WORD TRANSLATION
     ========================================= */

  function getWordTranslation(
    typedText
  ) {

    const cleanTyped =
      normalizeText(typedText)
        .toLowerCase();


    if (!cleanTyped) {
      return "";
    }


    const sentence =
      sentences[currentSentenceIndex];


    if (!sentence) {
      return "";
    }


    /* -----------------------------------------
       STORY WORD DATA
       ----------------------------------------- */

    if (
      Array.isArray(sentence.words)
    ) {

      for (
        const item of sentence.words
      ) {

        let word = "";

        let translation = "";


        if (
          typeof item === "string"
        ) {

          word = item;

        } else if (
          item &&
          typeof item === "object"
        ) {

          word =
            item.word ||
            item.text ||
            item.term ||
            item.english ||
            "";

          translation =
            item.translation ||
            item.meaning ||
            item.meaningAr ||
            item.arabic ||
            item.ar ||
            item.translationAr ||
            "";

        }


        if (!word) {
          continue;
        }


        const cleanWordData =
          normalizeText(word)
            .toLowerCase();


        if (
          cleanWordData ===
            cleanTyped &&
          translation
        ) {

          return translation;

        }

      }

    }


    /* =========================================
       FALLBACK PHRASES
       ========================================= */

    const fallbackTranslations = {

      "wake up":
        "يستيقظ",

      "get up":
        "ينهض",

      "go to":
        "يذهب إلى",

      "go home":
        "يذهب إلى المنزل",

      "go back":
        "يعود",

      "come back":
        "يعود",

      "sit down":
        "يجلس",

      "stand up":
        "يقف",

      "get ready":
        "يستعد",

      "brush my teeth":
        "أنظف أسناني",

      "wash my face":
        "أغسل وجهي",

      "have breakfast":
        "أتناول الإفطار",

      "eat breakfast":
        "أتناول الإفطار",

      "go to school":
        "يذهب إلى المدرسة",

      "go to bed":
        "يذهب إلى النوم",

      "look at":
        "ينظر إلى",

      "listen to":
        "يستمع إلى",

      "talk to":
        "يتحدث إلى"

    };


    if (
      fallbackTranslations[
        cleanTyped
      ]
    ) {

      return fallbackTranslations[
        cleanTyped
      ];

    }


    return "";

  }


  /* =========================================
     SHOW TEMPORARY WORD TRANSLATION
     ========================================= */

  function showCurrentWordTranslation(
    text
  ) {

    if (!currentWordIPA) {
      return;
    }


    const translation =
      getWordTranslation(text);


    if (translation) {

      currentWordIPA.textContent =
        translation;

    } else {

      currentWordIPA.textContent =
        "";

    }

  }


  /* =========================================
     GET CURRENT WORD / PHRASE
     ========================================= */

  function getCurrentPart() {

    if (!sentenceEditor) {
      return "";
    }


    const rawText =
      sentenceEditor.innerText || "";


    const textWithoutTrailingSpace =
      rawText
        .replace(/\s+$/, "");


    if (!textWithoutTrailingSpace) {
      return "";
    }


    const parts =
      textWithoutTrailingSpace
        .split(/\s+/);


    /*
       Check up to four words so phrases
       such as:

       wake up
       brush my teeth
       have breakfast

       can be translated.
    */

    const maxWords =
      Math.min(parts.length, 4);


    for (
      let count = maxWords;
      count >= 1;
      count--
    ) {

      const candidate =
        parts
          .slice(-count)
          .join(" ");


      if (
        getWordTranslation(candidate)
      ) {

        return candidate;

      }

    }


    return parts[
      parts.length - 1
    ];

  }


  /* =========================================
     COMPLETE WORD / PHRASE
     ========================================= */

  function handleCompletedPart() {

    if (!sentenceEditor) {
      return;
    }


    const rawText =
      sentenceEditor.innerText || "";


    /*
       Only run when a real space exists
       at the end.
    */

    if (!/\s$/.test(rawText)) {
      return;
    }


    const currentPart =
      getCurrentPart();


    if (!currentPart) {
      return;
    }


    /*
       Do not repeat the same phrase.
    */

    if (
      currentPart.toLowerCase() ===
      lastCompletedSegment.toLowerCase()
    ) {
      return;
    }


    const translation =
      getWordTranslation(
        currentPart
      );


    /*
       If we know the word/phrase,
       pronounce it.
    */

    if (translation) {

      speak(
        cleanWord(currentPart)
      );

    }


    /*
       Temporary word translation
       disappears after Space.

       IMPORTANT:
       currentWordMeaning is NOT touched.

       So the full sentence translation
       stays exactly where it is.
    */

    if (currentWordIPA) {

      currentWordIPA.textContent =
        "";

    }


    lastCompletedSegment =
      currentPart;

  }


  /* =========================================
     STORY HEADER
     ========================================= */

  function updateStoryHeader() {

    const language =
      getLanguage();


    if (storyEmoji) {

      storyEmoji.textContent =
        story.emoji || "📖";

    }


    if (storyLevel) {

      storyLevel.textContent =
        story.level || "A1";

    }


    if (storyTitle) {

      storyTitle.textContent =
        language === "ar"
          ? (
              story.titleAr ||
              story.title
            )
          : story.title;

    }


    if (storyDescription) {

      storyDescription.textContent =
        language === "ar"
          ? (
              story.descriptionAr ||
              story.description
            )
          : story.description;

    }


    if (backToLevel) {

      const level =
        story.level || "A1";


      backToLevel.href =
        `level.html?level=${encodeURIComponent(level)}`;


      backToLevel.textContent =
        language === "ar"
          ? `→ العودة إلى ${level}`
          : `← Back to ${level}`;

    }

  }


  /* =========================================
     PROGRESS
     ========================================= */

  function updateProgress() {

    const total =
      sentences.length;


    const current =
      currentSentenceIndex + 1;


    if (sentenceProgressText) {

      sentenceProgressText.textContent =
        `${current} / ${total}`;

    }


    if (sentenceProgressFill) {

      const percentage =
        total > 0
          ? (
              current / total
            ) * 100
          : 0;


      sentenceProgressFill.style.width =
        `${percentage}%`;

    }

  }


  /* =========================================
     RESET
     ========================================= */

  function resetSentence() {

    if (!sentenceEditor) {
      return;
    }


    /*
       Only clear when moving to a
       NEW sentence.

       Never rewrite while typing.
    */

    sentenceEditor.textContent =
      "";


    sentenceEditor.contentEditable =
      "true";


    sentenceEditor.setAttribute(
      "contenteditable",
      "true"
    );


    sentenceCompleted =
      false;


    lastCompletedSegment =
      "";


    /*
       Clear only the temporary
       word translation.

       Full Arabic translation
       remains untouched.
    */

    if (currentWordIPA) {

      currentWordIPA.textContent =
        "";

    }


    if (typingFeedback) {

      typingFeedback.textContent =
        "";

      typingFeedback.className =
        "typing-feedback";

    }


    if (nextSentenceButton) {

      nextSentenceButton.disabled =
        true;

    }

  }


  /* =========================================
     RENDER SENTENCE
     ========================================= */

  function renderSentence() {

    const sentence =
      sentences[currentSentenceIndex];


    if (!sentence) {
      return;
    }


    sentenceCompleted =
      false;


    lastCompletedSegment =
      "";


    /* ---------- NUMBER ---------- */

    if (sentenceNumber) {

      if (
        getLanguage() === "ar"
      ) {

        sentenceNumber.textContent =
          `الجملة ${
            currentSentenceIndex + 1
          }`;

      } else {

        sentenceNumber.textContent =
          `Sentence ${
            currentSentenceIndex + 1
          }`;

      }

    }


    /* ---------- FULL TRANSLATION ---------- */

    if (currentWordMeaning) {

      /*
         FULL SENTENCE TRANSLATION
         STAYS HERE.

         It does NOT change when
         the learner types.
      */

      currentWordMeaning.textContent =
        sentence.translation || "";

    }


    /* ---------- TEMP WORD AREA ---------- */

    if (currentWordIPA) {

      currentWordIPA.textContent =
        "";

    }


    /* ---------- GHOST ---------- */

    if (ghostSentence) {

      ghostSentence.textContent =
        sentence.text || "";

    }


    /* ---------- EDITOR ---------- */

    resetSentence();


    /* ---------- PROGRESS ---------- */

    updateProgress();


    setTimeout(() => {

      if (sentenceEditor) {
        sentenceEditor.focus();
      }

    }, 100);

  }


  /* =========================================
     CHECK SENTENCE
     ========================================= */

  function checkSentence() {

    const sentence =
      sentences[currentSentenceIndex];


    if (
      !sentence ||
      !sentenceEditor
    ) {
      return;
    }


    const expected =
      normalizeForAnswer(
        sentence.text
      );


    const typed =
      normalizeForAnswer(
        sentenceEditor.innerText
      );


    /* =======================================
       EMPTY
       ======================================= */

    if (!typed) {

      sentenceCompleted =
        false;


      if (nextSentenceButton) {

        nextSentenceButton.disabled =
          true;

      }


      if (typingFeedback) {

        typingFeedback.textContent =
          "";

        typingFeedback.className =
          "typing-feedback";

      }


      return;
    }


    /* =======================================
       CORRECT
       ======================================= */

    if (typed === expected) {

      sentenceCompleted =
        true;


      if (typingFeedback) {

        typingFeedback.textContent =
          getLanguage() === "ar"
            ? "ممتاز! ✓"
            : "Excellent! ✓";


        typingFeedback.className =
          "typing-feedback correct";

      }


      if (nextSentenceButton) {

        nextSentenceButton.disabled =
          false;

      }


      /*
         Read the whole sentence.
      */

      speak(sentence.text);


      saveProgress();


      return;
    }


    /* =======================================
       NOT COMPLETE
       ======================================= */

    sentenceCompleted =
      false;


    if (nextSentenceButton) {

      nextSentenceButton.disabled =
        true;

    }


    if (typingFeedback) {

      typingFeedback.textContent =
        "";

      typingFeedback.className =
        "typing-feedback";

    }

  }


  /* =========================================
     EDITOR INPUT
     ========================================= */

  if (sentenceEditor) {

    sentenceEditor.addEventListener(
      "input",
      () => {

        const rawText =
          sentenceEditor.innerText || "";


        /*
           If the learner is currently
           typing a word, show its
           temporary translation.
        */

        if (!/\s$/.test(rawText)) {

          const currentPart =
            getCurrentPart();


          showCurrentWordTranslation(
            currentPart
          );

        }


        /*
           If the learner has just
           completed a word/phrase
           with Space:

           🔊 pronounce it
           📝 remove temporary translation
        */

        if (/\s$/.test(rawText)) {

          handleCompletedPart();

        }


        /*
           Check complete sentence.
        */

        checkSentence();

      }
    );


    /* =====================================
       KEYBOARD
       ===================================== */

    sentenceEditor.addEventListener(
      "keydown",
      (event) => {

        /*
           Prevent Enter from making
           a new paragraph.
        */

        if (event.key === "Enter") {

          event.preventDefault();

          checkSentence();

        }

      }
    );

  }


  /* =========================================
     WRITING AREA CLICK
     ========================================= */

  if (sentenceWritingArea) {

    sentenceWritingArea.addEventListener(
      "click",
      () => {

        if (sentenceEditor) {

          sentenceEditor.focus();

        }

      }
    );

  }


  /* =========================================
     AUDIO BUTTON
     ========================================= */

  if (sentenceAudioButton) {

    sentenceAudioButton.addEventListener(
      "click",
      () => {

        const sentence =
          sentences[currentSentenceIndex];


        if (!sentence) {
          return;
        }


        speak(sentence.text);

      }
    );

  }


  /* =========================================
     NEXT BUTTON
     ========================================= */

  if (nextSentenceButton) {

    nextSentenceButton.addEventListener(
      "click",
      () => {

        if (!sentenceCompleted) {
          return;
        }


        /* ---------- NEXT SENTENCE ---------- */

        if (
          currentSentenceIndex <
          sentences.length - 1
        ) {

          currentSentenceIndex++;

          renderSentence();

          return;

        }


        /* ---------- STORY COMPLETE ---------- */

        if (typingFeedback) {

          typingFeedback.textContent =
            getLanguage() === "ar"
              ? "🎉 أحسنتِ! أكملتِ القصة!"
              : "🎉 Amazing! You completed the story!";


          typingFeedback.className =
            "typing-feedback correct";

        }


        nextSentenceButton.disabled =
          true;


        nextSentenceButton.textContent =
          getLanguage() === "ar"
            ? "✓ اكتملت القصة"
            : "✓ Story Complete";


        if (sentenceEditor) {

          sentenceEditor.contentEditable =
            "false";

        }


        saveProgress();

      }
    );

  }


  /* =========================================
     SAVE PROGRESS
     ========================================= */

  function saveProgress() {

    try {

      const key =
        "joryStoryProgress";


      const oldData =
        JSON.parse(
          localStorage.getItem(key) ||
          "{}"
        );


      const storyKey =
        String(
          story.id ||
          story.title ||
          "story"
        );


      if (!oldData[storyKey]) {

        oldData[storyKey] = {

          completedSentences: []

        };

      }


      if (
        sentenceCompleted &&
        !oldData[storyKey]
          .completedSentences
          .includes(
            currentSentenceIndex
          )
      ) {

        oldData[storyKey]
          .completedSentences
          .push(
            currentSentenceIndex
          );

      }


      localStorage.setItem(
        key,
        JSON.stringify(oldData)
      );

    } catch (error) {

      console.warn(
        "Could not save story progress.",
        error
      );

    }

  }


  /* =========================================
     LANGUAGE CHANGE
     ========================================= */

  document.addEventListener(
    "joryLanguageChanged",
    () => {

      updateStoryHeader();

      renderSentence();

    }
  );


  /* =========================================
     START
     ========================================= */

  updateStoryHeader();

  renderSentence();

});
