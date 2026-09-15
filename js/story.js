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

    if (storyId && typeof getStoryById === "function") {
      story = getStoryById(storyId);
    }

    if (!story && typeof getStoriesByLevel === "function") {

      const a1Stories =
        getStoriesByLevel("A1");

      if (a1Stories && a1Stories.length > 0) {
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
      storyTitle.textContent = "Story not found";
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

  let previousText = "";


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
     NORMALIZE
     ========================================= */

  function normalizeText(text) {

    return String(text || "")
      .replace(/\u00A0/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  }


  /* =========================================
     REMOVE PUNCTUATION
     ========================================= */

  function cleanWord(text) {

    return String(text || "")
      .replace(/^[.,!?;:'"“”‘’()[\]{}]+/g, "")
      .replace(/[.,!?;:'"“”‘’()[\]{}]+$/g, "")
      .trim();

  }


  /* =========================================
     SPEAK
     ========================================= */

  function speak(text) {

    if (!text) {
      return;
    }

    if (!("speechSynthesis" in window)) {
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
     FIND WORD / PHRASE TRANSLATION
     ========================================= */

  function getWordTranslation(typedText) {

    const cleanTyped =
      normalizeText(typedText).toLowerCase();

    if (!cleanTyped) {
      return "";
    }


    const sentence =
      sentences[currentSentenceIndex];

    if (!sentence) {
      return "";
    }


    /* -----------------------------------------
       FIRST: USE WORD DATA FROM STORY
       ----------------------------------------- */

    if (Array.isArray(sentence.words)) {

      for (const item of sentence.words) {

        let word = "";
        let translation = "";


        if (typeof item === "string") {

          word = item;

        } else if (item && typeof item === "object") {

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
          normalizeText(word).toLowerCase();


        if (
          cleanWordData === cleanTyped &&
          translation
        ) {

          return translation;

        }

      }

    }


    /* -----------------------------------------
       COMMON PHRASES
       -----------------------------------------

       These are only fallback translations
       for phrases such as "wake up".
       ----------------------------------------- */

    const fallbackTranslations = {

      "wake up": "يستيقظ",
      "get up": "ينهض",
      "go to": "يذهب إلى",
      "go home": "يذهب إلى المنزل",
      "go back": "يعود",
      "come back": "يعود",
      "sit down": "يجلس",
      "stand up": "يقف",
      "get ready": "يستعد",
      "brush my teeth": "أنظف أسناني",
      "wash my face": "أغسل وجهي",
      "have breakfast": "أتناول الإفطار",
      "eat breakfast": "أتناول الإفطار",
      "go to school": "يذهب إلى المدرسة",
      "go to bed": "يذهب إلى النوم",
      "look at": "ينظر إلى",
      "listen to": "يستمع إلى",
      "talk to": "يتحدث إلى"
    };


    if (fallbackTranslations[cleanTyped]) {

      return fallbackTranslations[cleanTyped];

    }


    return "";

  }


  /* =========================================
     SHOW CURRENT WORD TRANSLATION
     ========================================= */

  function showCurrentWordTranslation(text) {

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
     GET CURRENT TYPED PART
     ========================================= */

  function getCurrentPart() {

    if (!sentenceEditor) {
      return "";
    }

    const rawText =
      sentenceEditor.innerText || "";

    /*
       Everything after the last space
       is normally the current word.

       BUT if the story contains a phrase
       such as "wake up", we keep the
       phrase together.
    */

    const withoutTrailingSpace =
      rawText.replace(/\s+$/, "");

    if (!withoutTrailingSpace) {
      return "";
    }


    const parts =
      withoutTrailingSpace.split(/\s+/);


    /*
       Try the longest possible phrase
       from the current end.

       Example:

       wake
       wake up

       When "wake up" exists in the
       vocabulary, we use the whole phrase.
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


      if (getWordTranslation(candidate)) {

        return candidate;

      }

    }


    return parts[parts.length - 1];

  }


  /* =========================================
     SPEAK COMPLETED WORD / PHRASE
     ========================================= */

  function handleCompletedPart() {

    if (!sentenceEditor) {
      return;
    }


    const rawText =
      sentenceEditor.innerText || "";


    /*
       Only do this when the learner
       actually pressed space.
    */

    if (!/\s$/.test(rawText)) {
      return;
    }


    const beforeSpace =
      rawText
        .replace(/\s+$/, "")
        .trim();


    if (!beforeSpace) {
      return;
    }


    const currentPart =
      getCurrentPart();


    if (!currentPart) {
      return;
    }


    /*
       Prevent repeating the same phrase.
    */

    if (
      currentPart.toLowerCase() ===
      lastCompletedSegment.toLowerCase()
    ) {

      return;

    }


    const translation =
      getWordTranslation(currentPart);


    /*
       If we know this word/phrase,
       pronounce it.
    */

    if (translation) {

      speak(
        cleanWord(currentPart)
      );

    }


    /*
       Clear temporary translation
       after the word is completed.

       The full sentence translation
       ABOVE IS NOT TOUCHED.
    */

    if (currentWordIPA) {

      currentWordIPA.textContent = "";

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
          ? (story.titleAr || story.title)
          : story.title;

    }


    if (storyDescription) {

      storyDescription.textContent =
        language === "ar"
          ? (story.descriptionAr || story.description)
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
          ? (current / total) * 100
          : 0;

      sentenceProgressFill.style.width =
        `${percentage}%`;

    }

  }


  /* =========================================
     RESET SENTENCE
     ========================================= */

  function resetSentence() {

    if (!sentenceEditor) {
      return;
    }


    sentenceEditor.textContent = "";

    sentenceEditor.contentEditable = "true";

    sentenceEditor.setAttribute(
      "contenteditable",
      "true"
    );


    sentenceCompleted = false;

    lastCompletedSegment = "";

    previousText = "";


    /*
       IMPORTANT:

       This element is used for the
       temporary word translation.

       The full Arabic sentence is
       stored in currentWordMeaning
       and remains untouched.
    */

    if (currentWordIPA) {

      currentWordIPA.textContent = "";

    }


    if (typingFeedback) {

      typingFeedback.textContent = "";

      typingFeedback.className =
        "typing-feedback";

    }


    if (nextSentenceButton) {

      nextSentenceButton.disabled = true;

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


    sentenceCompleted = false;

    lastCompletedSegment = "";

    previousText = "";


    /* ---------- NUMBER ---------- */

    if (sentenceNumber) {

      if (getLanguage() === "ar") {

        sentenceNumber.textContent =
          `الجملة ${currentSentenceIndex + 1}`;

      } else {

        sentenceNumber.textContent =
          `Sentence ${currentSentenceIndex + 1}`;

      }

    }


    /* ---------- FULL ARABIC TRANSLATION ---------- */

    if (currentWordMeaning) {

      /*
         THIS IS THE IMPORTANT PART.

         Full sentence translation stays
         here permanently.
      */

      currentWordMeaning.textContent =
        sentence.translation || "";

    }


    /* ---------- IPA / TEMPORARY WORD MEANING ---------- */

    if (currentWordIPA) {

      currentWordIPA.textContent = "";

    }


    /* ---------- GHOST ---------- */

    if (ghostSentence) {

      ghostSentence.textContent =
        sentence.text || "";

    }


    /* ---------- RESET EDITOR ---------- */

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

    if (!sentence || !sentenceEditor) {
      return;
    }


    const expected =
      normalizeText(sentence.text);

    const typed =
      normalizeText(
        sentenceEditor.innerText || ""
      );


    if (!typed) {

      sentenceCompleted = false;

      if (nextSentenceButton) {
        nextSentenceButton.disabled = true;
      }

      if (typingFeedback) {

        typingFeedback.textContent = "";

        typingFeedback.className =
          "typing-feedback";

      }

      return;
    }


    /* ---------- COMPLETE ---------- */

    if (typed === expected) {

      sentenceCompleted = true;


      if (typingFeedback) {

        typingFeedback.textContent =
          getLanguage() === "ar"
            ? "ممتاز! ✓"
            : "Excellent! ✓";

        typingFeedback.className =
          "typing-feedback correct";

      }


      if (nextSentenceButton) {

        nextSentenceButton.disabled = false;

      }


      /*
         Read the entire sentence.
      */

      speak(expected);


      saveProgress();

      return;
    }


    /* ---------- NOT COMPLETE ---------- */

    sentenceCompleted = false;


    if (nextSentenceButton) {

      nextSentenceButton.disabled = true;

    }


    if (typingFeedback) {

      typingFeedback.textContent = "";

      typingFeedback.className =
        "typing-feedback";

    }

  }


  /* =========================================
     INPUT EVENT
     ========================================= */

  if (sentenceEditor) {

    sentenceEditor.addEventListener(
      "input",
      () => {

        const currentText =
          sentenceEditor.innerText || "";


        /*
           Detect a SPACE.

           We check the REAL editor text
           BEFORE normalizeText().

           This is what fixes the word
           pronunciation.
        */

        const addedSpace =
          /\s$/.test(currentText);


        /*
           While typing the current word/
           phrase, show its translation.
        */

        if (!addedSpace) {

          const currentPart =
            getCurrentPart();

          showCurrentWordTranslation(
            currentPart
          );

        }


        /*
           When SPACE is pressed:

           1. pronounce current word/phrase
           2. clear its temporary translation
        */

        if (addedSpace) {

          handleCompletedPart();

        }


        /*
           Check complete sentence.
        */

        checkSentence();


        previousText =
          currentText;

      }
    );


    /* =====================================
       KEYBOARD
       ===================================== */

    sentenceEditor.addEventListener(
      "keydown",
      (event) => {

        if (event.key === "Enter") {

          event.preventDefault();

          checkSentence();

        }

      }
    );

  }


  /* =========================================
     CLICK AREA
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
          localStorage.getItem(key) || "{}"
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
          .includes(currentSentenceIndex)
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
