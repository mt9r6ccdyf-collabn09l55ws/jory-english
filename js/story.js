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

    /*
       If no story ID exists, use
       the first A1 story.
    */

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

  let lastWordCount = 0;


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
     SPEAK WORD
     ========================================= */

  function speakWord(word) {

    if (!word) {
      return;
    }

    speak(
      word
        .replace(/[.,!?;:]+$/g, "")
        .trim()
    );

  }


  /* =========================================
     GET EDITOR TEXT
     ========================================= */

  function getEditorText() {

    if (!sentenceEditor) {
      return "";
    }

    return normalizeText(
      sentenceEditor.innerText ||
      sentenceEditor.textContent ||
      ""
    );

  }


  /* =========================================
     UPDATE HEADER
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
     UPDATE PROGRESS
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
     RESET EDITOR
     ========================================= */

  function resetEditor() {

    if (!sentenceEditor) {
      return;
    }

    /*
       IMPORTANT:

       We only clear the editor
       when changing sentences.

       We NEVER rewrite it while
       the user is typing.

       This means Backspace/Delete works.
    */

    sentenceEditor.textContent = "";

    sentenceEditor.contentEditable = "true";

    sentenceEditor.setAttribute(
      "contenteditable",
      "true"
    );

    sentenceCompleted = false;

    lastWordCount = 0;


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


    const english =
      sentence.text || "";

    const arabic =
      sentence.translation || "";


    sentenceCompleted = false;

    lastWordCount = 0;


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
        arabic;

    }


    /* ---------- IPA ---------- */

    if (currentWordIPA) {

      currentWordIPA.textContent =
        sentence.ipa || "";

    }


    /* ---------- GHOST ---------- */

    if (ghostSentence) {

      ghostSentence.textContent =
        english;

    }


    /* ---------- EDITOR ---------- */

    resetEditor();


    /* ---------- PROGRESS ---------- */

    updateProgress();


    /*
       Focus the real editable area.
    */

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
      getEditorText();


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


    /* ---------- CORRECT ---------- */

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
         Read the complete sentence.
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
     WORD PRONUNCIATION
     ========================================= */

  function handleWordPronunciation() {

    if (!sentenceEditor) {
      return;
    }

    const text =
      getEditorText();

    if (!text) {

      lastWordCount = 0;

      return;
    }


    const words =
      text.split(/\s+/)
        .filter(Boolean);


    const currentWordCount =
      words.length;


    /*
       If the number of words increased,
       the previous word has been completed.
    */

    if (currentWordCount > lastWordCount) {

      /*
         Do not pronounce the final word
         immediately unless the user typed
         a space after it.

         That way:

         My
         My name
         My name is

         only pronounce a word after
         the learner finishes it.
      */

      const endsWithSpace =
        /\s$/.test(
          sentenceEditor.innerText || ""
        );


      if (
        endsWithSpace &&
        currentWordCount >= 1
      ) {

        const completedWord =
          words[currentWordCount - 1];

        speakWord(completedWord);

      }

    }


    lastWordCount =
      currentWordCount;

  }


  /* =========================================
     EDITOR INPUT
     ========================================= */

  if (sentenceEditor) {

    sentenceEditor.addEventListener(
      "input",
      () => {

        /*
           THIS IS THE IMPORTANT PART.

           We do NOT replace innerHTML.
           We do NOT replace textContent.

           Therefore the user can:

           type
           delete
           backspace
           correct mistakes
           select text
           paste
        */


        handleWordPronunciation();

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
           Enter should not create a
           new paragraph.
        */

        if (event.key === "Enter") {

          event.preventDefault();

          checkSentence();

        }

      }
    );


    /* =====================================
       CLICK AREA
       ===================================== */

    if (sentenceWritingArea) {

      sentenceWritingArea.addEventListener(
        "click",
        () => {

          sentenceEditor.focus();

        }
      );

    }

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
     NEXT SENTENCE
     ========================================= */

  if (nextSentenceButton) {

    nextSentenceButton.addEventListener(
      "click",
      () => {

        if (!sentenceCompleted) {
          return;
        }


        /*
           There are more sentences.
        */

        if (
          currentSentenceIndex <
          sentences.length - 1
        ) {

          currentSentenceIndex++;

          renderSentence();

          return;
        }


        /*
           STORY COMPLETE
        */

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
