/* =========================================
   JORY ENGLISH 🎀
   STORY LEARNING SYSTEM
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* -----------------------------------------
     GET STORY
     ----------------------------------------- */

  const params = new URLSearchParams(window.location.search);
  const storyId = params.get("story");

  let story = null;

  if (typeof STORIES !== "undefined") {

    if (storyId) {
      story = getStoryById(storyId);
    }

    /* Fallback: first A1 story */
    if (!story) {
      const a1Stories = getStoriesByLevel("A1");

      if (a1Stories && a1Stories.length > 0) {
        story = a1Stories[0];
      }
    }
  }


  /* -----------------------------------------
     ELEMENTS
     ----------------------------------------- */

  const storyEmoji = document.getElementById("storyEmoji");
  const storyLevel = document.getElementById("storyLevel");
  const storyTitle = document.getElementById("storyTitle");
  const storyDescription = document.getElementById("storyDescription");

  const backToLevel = document.getElementById("backToLevel");

  const sentenceNumber = document.getElementById("sentenceNumber");
  const currentWordMeaning = document.getElementById("currentWordMeaning");
  const currentWordIPA = document.getElementById("currentWordIPA");

  const ghostSentence = document.getElementById("ghostSentence");
  const sentenceInput = document.getElementById("sentenceInput");

  const typingFeedback = document.getElementById("typingFeedback");

  const sentenceAudioButton =
    document.getElementById("sentenceAudioButton");

  const nextSentenceButton =
    document.getElementById("nextSentenceButton");

  const sentenceProgressText =
    document.getElementById("sentenceProgressText");

  const sentenceProgressFill =
    document.getElementById("sentenceProgressFill");


  /* -----------------------------------------
     SAFETY CHECK
     ----------------------------------------- */

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


  /* -----------------------------------------
     STORY DATA
     ----------------------------------------- */

  const sentences = Array.isArray(story.sentences)
    ? story.sentences
    : [];

  let currentSentenceIndex = 0;

  let completedWords = new Set();

  let sentenceCompleted = false;


  /* -----------------------------------------
     LANGUAGE
     ----------------------------------------- */

  function getLanguage() {

    return localStorage.getItem("joryLanguage") || "en";

  }


  /* -----------------------------------------
     NORMALIZE TEXT
     ----------------------------------------- */

  function normalizeText(text) {

    return text
      .replace(/\s+/g, " ")
      .trim();

  }


  /* -----------------------------------------
     SPEAK
     ----------------------------------------- */

  function speak(text) {

    if (!text) return;

    if (!("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(text);

    utterance.lang = "en-US";
    utterance.rate = 0.88;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  }


  /* -----------------------------------------
     SPEAK COMPLETED WORD
     ----------------------------------------- */

  function speakCompletedWord() {

    const value = sentenceInput.value;

    const words = value.trim().split(/\s+/);

    if (words.length === 0) {
      return;
    }

    const wordIndex = words.length - 1;

    const word = words[wordIndex];

    if (!word) {
      return;
    }

    if (completedWords.has(wordIndex)) {
      return;
    }

    completedWords.add(wordIndex);

    speak(word);

  }


  /* -----------------------------------------
     UPDATE STORY HEADER
     ----------------------------------------- */

  function updateStoryHeader() {

    if (storyEmoji) {
      storyEmoji.textContent = story.emoji || "📖";
    }

    if (storyLevel) {
      storyLevel.textContent = story.level || "A1";
    }

    if (storyTitle) {

      storyTitle.textContent =
        getLanguage() === "ar"
          ? (story.titleAr || story.title)
          : story.title;

    }

    if (storyDescription) {

      storyDescription.textContent =
        getLanguage() === "ar"
          ? (story.descriptionAr || story.description)
          : story.description;

    }

    if (backToLevel) {

      const level =
        story.level || "A1";

      backToLevel.href =
        `level.html?level=${encodeURIComponent(level)}`;

      backToLevel.textContent =
        getLanguage() === "ar"
          ? `→ العودة إلى ${level}`
          : `← Back to ${level}`;

    }

  }


  /* -----------------------------------------
     SHOW CURRENT SENTENCE
     ----------------------------------------- */

  function renderSentence() {

    if (!sentences.length) {
      return;
    }

    const sentence =
      sentences[currentSentenceIndex];

    if (!sentence) {
      return;
    }

    sentenceCompleted = false;

    completedWords = new Set();


    /* ---------- TEXT ---------- */

    const englishText =
      sentence.text || "";

    const arabicText =
      sentence.translation || "";


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


    /* ---------- ARABIC ---------- */

    if (currentWordMeaning) {

      currentWordMeaning.textContent =
        arabicText;

    }


    /* ---------- IPA ---------- */

    if (currentWordIPA) {

      currentWordIPA.textContent =
        sentence.ipa || "";

    }


    /* ---------- GHOST ---------- */

    if (ghostSentence) {

      ghostSentence.textContent =
        englishText;

    }


    /* ---------- INPUT ---------- */

    if (sentenceInput) {

      sentenceInput.value = "";

      sentenceInput.disabled = false;

      sentenceInput.focus();

    }


    /* ---------- FEEDBACK ---------- */

    if (typingFeedback) {

      typingFeedback.textContent = "";

      typingFeedback.className =
        "typing-feedback";

    }


    /* ---------- NEXT ---------- */

    if (nextSentenceButton) {

      nextSentenceButton.disabled = true;

    }


    /* ---------- PROGRESS ---------- */

    updateProgress();

  }


  /* -----------------------------------------
     PROGRESS
     ----------------------------------------- */

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


  /* -----------------------------------------
     CHECK SENTENCE
     ----------------------------------------- */

  function checkSentence() {

    if (!sentenceInput) {
      return;
    }

    const sentence =
      sentences[currentSentenceIndex];

    if (!sentence) {
      return;
    }

    const expected =
      normalizeText(sentence.text || "");

    const typed =
      normalizeText(sentenceInput.value || "");


    /* ---------- EMPTY ---------- */

    if (!typed) {

      sentenceCompleted = false;

      if (typingFeedback) {

        typingFeedback.textContent = "";

        typingFeedback.className =
          "typing-feedback";

      }

      if (nextSentenceButton) {
        nextSentenceButton.disabled = true;
      }

      return;
    }


    /* ---------- EXACT CORRECT ---------- */

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


      /* Speak complete sentence */

      speak(expected);


      /* Enable Next */

      if (nextSentenceButton) {
        nextSentenceButton.disabled = false;
      }


      /* Save progress */

      saveProgress();

      return;
    }


    /* ---------- PARTIAL / INCORRECT ---------- */

    sentenceCompleted = false;

    if (nextSentenceButton) {
      nextSentenceButton.disabled = true;
    }


    /*
       Only show a helpful message when
       the user has typed enough to compare.
    */

    if (typingFeedback) {

      if (typed.length >= expected.length) {

        typingFeedback.textContent =
          getLanguage() === "ar"
            ? "تحققي من الجملة وحاولي مرة أخرى."
            : "Check the sentence and try again.";

        typingFeedback.className =
          "typing-feedback incorrect";

      } else {

        typingFeedback.textContent = "";

        typingFeedback.className =
          "typing-feedback";

      }

    }

  }


  /* -----------------------------------------
     INPUT EVENT
     ----------------------------------------- */

  if (sentenceInput) {

    sentenceInput.addEventListener(
      "input",
      () => {

        /*
           IMPORTANT:
           We never rewrite sentenceInput.value here.
           This keeps typing and deletion working.
        */

        const value =
          sentenceInput.value;

        const lastCharacter =
          value.slice(-1);

        /*
           When the user presses space,
           the previous word is considered complete.
        */

        if (lastCharacter === " ") {

          speakCompletedWord();

        }

        /*
           If the final word is completed
           without a trailing space, speak it
           when the whole sentence is correct.
        */

        checkSentence();

      }
    );


    /* -----------------------------------------
       KEYBOARD
       ----------------------------------------- */

    sentenceInput.addEventListener(
      "keydown",
      (event) => {

        /*
           Space = completed word
        */

        if (event.key === " ") {

          setTimeout(() => {

            speakCompletedWord();

          }, 0);

        }


        /*
           Enter = check sentence
        */

        if (event.key === "Enter") {

          event.preventDefault();

          checkSentence();

        }

      }
    );

  }


  /* -----------------------------------------
     AUDIO BUTTON
     ----------------------------------------- */

  if (sentenceAudioButton) {

    sentenceAudioButton.addEventListener(
      "click",
      () => {

        const sentence =
          sentences[currentSentenceIndex];

        if (!sentence) return;

        speak(sentence.text);

      }
    );

  }


  /* -----------------------------------------
     NEXT BUTTON
     ----------------------------------------- */

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


        /* ---------- STORY FINISHED ---------- */

        if (typingFeedback) {

          typingFeedback.textContent =
            getLanguage() === "ar"
              ? "🎉 أحسنتِ! أكملتِ القصة!"
              : "🎉 Amazing! You completed the story!";

          typingFeedback.className =
            "typing-feedback correct";

        }

        if (nextSentenceButton) {

          nextSentenceButton.disabled = true;

          nextSentenceButton.textContent =
            getLanguage() === "ar"
              ? "✓ اكتملت القصة"
              : "✓ Story Complete";

        }

        if (sentenceInput) {
          sentenceInput.disabled = true;
        }

        saveProgress();

      }
    );

  }


  /* -----------------------------------------
     SAVE PROGRESS
     ----------------------------------------- */

  function saveProgress() {

    try {

      const key =
        "joryStoryProgress";

      const oldData =
        JSON.parse(
          localStorage.getItem(key) || "{}"
        );

      const storyKey =
        String(story.id || story.title);

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
          .push(currentSentenceIndex);

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


  /* -----------------------------------------
     LANGUAGE CHANGE
     ----------------------------------------- */

  document.addEventListener(
    "joryLanguageChanged",
    () => {

      updateStoryHeader();

      renderSentence();

    }
  );


  /* -----------------------------------------
     INITIALIZE
     ----------------------------------------- */

  updateStoryHeader();

  renderSentence();

});
