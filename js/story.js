document.addEventListener("DOMContentLoaded", () => {

  /* =========================================
     ELEMENTS
     ========================================= */

  const storyTitle =
    document.getElementById("storyTitle");

  const storyDescription =
    document.getElementById("storyDescription");

  const storyEmoji =
    document.getElementById("storyEmoji");

  const storyLevel =
    document.getElementById("storyLevel");

  const sentenceNumber =
    document.getElementById("sentenceNumber");

  const currentWordMeaning =
    document.getElementById("currentWordMeaning");

  const currentWordIPA =
    document.getElementById("currentWordIPA");

  const ghostSentence =
    document.getElementById("ghostSentence");

  const sentenceInput =
    document.getElementById("sentenceInput");

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

  const backToLevel =
    document.getElementById("backToLevel");


  /* =========================================
     GET STORY
     ========================================= */

  const params =
    new URLSearchParams(window.location.search);

  const storyId =
    params.get("story");

  const story =
    getStoryById(storyId);


  if (!story) {

    storyTitle.textContent =
      "Story not found";

    storyDescription.textContent =
      "Sorry, this story could not be found.";

    sentenceInput.disabled =
      true;

    return;
  }


  /* =========================================
     VARIABLES
     ========================================= */

  let currentSentenceIndex = 0;

  const totalSentences =
    story.sentences.length;

  let spokenWordCount = 0;


  const level =
    story.level || "A1";


  /* =========================================
     STORY INFORMATION
     ========================================= */

  storyTitle.textContent =
    story.title;

  storyDescription.textContent =
    story.description;

  storyEmoji.textContent =
    story.emoji;

  storyLevel.textContent =
    level;

  document.title =
    `${story.title} | Jory English 🎀`;

  backToLevel.href =
    `level.html?level=${level}`;

  backToLevel.textContent =
    `← Back to ${level}`;


  /* =========================================
     NORMALIZE
     ========================================= */

  function normalize(text) {

    return text
      .toLowerCase()
      .replace(/[.,!?;:'"()]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }


  /* =========================================
     SPEECH
     ========================================= */

  function speak(text) {

    if (!text) return;

    if (!("speechSynthesis" in window)) {
      return;
    }

    const utterance =
      new SpeechSynthesisUtterance(text);

    utterance.lang =
      "en-US";

    utterance.rate =
      0.82;

    utterance.pitch =
      1;

    window.speechSynthesis.speak(
      utterance
    );
  }


  /* =========================================
     PROGRESS
     ========================================= */

  function updateProgress() {

    sentenceProgressText.textContent =
      `${currentSentenceIndex + 1} / ${totalSentences}`;

    const percentage =
      (currentSentenceIndex / totalSentences) * 100;

    sentenceProgressFill.style.width =
      `${percentage}%`;
  }


  /* =========================================
     PERFECT INPUT ALIGNMENT
     ========================================= */

  function alignInput() {

    requestAnimationFrame(() => {

      const writingArea =
        document.querySelector(
          ".sentence-writing-area"
        );

      if (!writingArea) return;


      const ghostRect =
        ghostSentence.getBoundingClientRect();

      const areaRect =
        writingArea.getBoundingClientRect();


      /*
       * Get the exact visual position
       * of the transparent sentence.
       */

      const left =
        ghostRect.left -
        areaRect.left;

      const top =
        ghostRect.top -
        areaRect.top;


      /*
       * Get the EXACT font used
       * by the transparent sentence.
       */

      const ghostStyle =
        window.getComputedStyle(
          ghostSentence
        );


      /* =====================================
         POSITION
         ===================================== */

      sentenceInput.style.setProperty(
        "position",
        "absolute",
        "important"
      );

      sentenceInput.style.setProperty(
        "left",
        `${left}px`,
        "important"
      );

      sentenceInput.style.setProperty(
        "top",
        `${top}px`,
        "important"
      );

      sentenceInput.style.setProperty(
        "width",
        `${ghostRect.width}px`,
        "important"
      );

      sentenceInput.style.setProperty(
        "height",
        `${ghostRect.height}px`,
        "important"
      );

      sentenceInput.style.setProperty(
        "transform",
        "none",
        "important"
      );


      /* =====================================
         EXACT TEXT ALIGNMENT
         ===================================== */

      sentenceInput.style.setProperty(
        "text-align",
        "left",
        "important"
      );

      sentenceInput.style.setProperty(
        "text-indent",
        "0",
        "important"
      );

      sentenceInput.style.setProperty(
        "padding",
        "0",
        "important"
      );

      sentenceInput.style.setProperty(
        "margin",
        "0",
        "important"
      );


      /* =====================================
         EXACT FONT
         ===================================== */

      sentenceInput.style.setProperty(
        "font-family",
        ghostStyle.fontFamily,
        "important"
      );

      sentenceInput.style.setProperty(
        "font-size",
        ghostStyle.fontSize,
        "important"
      );

      sentenceInput.style.setProperty(
        "font-weight",
        ghostStyle.fontWeight,
        "important"
      );

      sentenceInput.style.setProperty(
        "font-style",
        ghostStyle.fontStyle,
        "important"
      );

      sentenceInput.style.setProperty(
        "line-height",
        ghostStyle.lineHeight,
        "important"
      );

      sentenceInput.style.setProperty(
        "letter-spacing",
        ghostStyle.letterSpacing,
        "important"
      );

      sentenceInput.style.setProperty(
        "word-spacing",
        ghostStyle.wordSpacing,
        "important"
      );

      sentenceInput.style.setProperty(
        "font-variant",
        ghostStyle.fontVariant,
        "important"
      );

      sentenceInput.style.setProperty(
        "font-feature-settings",
        ghostStyle.fontFeatureSettings,
        "important"
      );

      sentenceInput.style.setProperty(
        "font-kerning",
        "none",
        "important"
      );


      /* =====================================
         REMOVE BROWSER INPUT STYLING
         ===================================== */

      sentenceInput.style.setProperty(
        "border",
        "none",
        "important"
      );

      sentenceInput.style.setProperty(
        "outline",
        "none",
        "important"
      );

      sentenceInput.style.setProperty(
        "background",
        "transparent",
        "important"
      );

      sentenceInput.style.setProperty(
        "box-shadow",
        "none",
        "important"
      );

      sentenceInput.style.setProperty(
        "appearance",
        "none",
        "important"
      );

      sentenceInput.style.setProperty(
        "-webkit-appearance",
        "none",
        "important"
      );

      sentenceInput.style.setProperty(
        "border-radius",
        "0",
        "important"
      );


      /* =====================================
         TEXT COLOR
         ===================================== */

      sentenceInput.style.setProperty(
        "color",
        "#493c46",
        "important"
      );

      sentenceInput.style.setProperty(
        "caret-color",
        "#e58bb0",
        "important"
      );


      /* =====================================
         BOX MODEL
         ===================================== */

      sentenceInput.style.setProperty(
        "box-sizing",
        "border-box",
        "important"
      );

      sentenceInput.style.setProperty(
        "overflow",
        "hidden",
        "important"
      );

    });
  }


  /* =========================================
     UPDATE GHOST
     ========================================= */

  function updateGhost() {

    const sentence =
      story.sentences[
        currentSentenceIndex
      ].text;


    /*
     * IMPORTANT:
     *
     * The transparent sentence NEVER changes.
     *
     * It always stays the complete sentence.
     */

    ghostSentence.textContent =
      sentence;


    /*
     * Recalculate alignment.
     */

    alignInput();
  }


  /* =========================================
     COMPLETED WORDS
     ========================================= */

  function getCompletedWords() {

    const typed =
      sentenceInput.value;


    if (!typed) {
      return [];
    }


    /*
     * A word becomes complete
     * after pressing SPACE.
     */

    if (!typed.endsWith(" ")) {

      return typed
        .split(/\s+/)
        .slice(0, -1)
        .filter(Boolean);
    }


    return typed
      .trim()
      .split(/\s+/)
      .filter(Boolean);
  }


  /* =========================================
     WORD PRONUNCIATION
     ========================================= */

  function pronounceCompletedWords() {

    const sentence =
      story.sentences[
        currentSentenceIndex
      ].text;


    const expectedWords =
      sentence
        .trim()
        .split(/\s+/);


    const completedWords =
      getCompletedWords();


    while (
      spokenWordCount <
      completedWords.length
    ) {

      const index =
        spokenWordCount;

      const typedWord =
        completedWords[index];

      const expectedWord =
        expectedWords[index];


      if (
        expectedWord &&
        normalize(typedWord) ===
        normalize(expectedWord)
      ) {

        /*
         * 🔊 Speak word
         */

        speak(expectedWord);
      }


      spokenWordCount++;
    }
  }


  /* =========================================
     CHECK SENTENCE
     ========================================= */

  function checkSentence() {

    const sentence =
      story.sentences[
        currentSentenceIndex
      ].text;


    const typed =
      normalize(
        sentenceInput.value
      );


    const correct =
      normalize(sentence);


    /* =======================================
       CORRECT
       ======================================= */

    if (typed === correct) {

      typingFeedback.textContent =
        "✓ Perfect! Great job!";

      typingFeedback.className =
        "typing-feedback success";


      /*
       * 🔊 Speak complete sentence
       */

      speak(sentence);


      sentenceInput.disabled =
        true;


      nextSentenceButton.disabled =
        false;


      sentenceProgressFill.style.width =
        "100%";


      return;
    }


    /* =======================================
       WRONG
       ======================================= */

    if (
      sentenceInput.value.length >=
      sentence.length
    ) {

      typingFeedback.textContent =
        "Try Again ✨";

      typingFeedback.className =
        "typing-feedback error";

    } else {

      typingFeedback.textContent =
        "";

      typingFeedback.className =
        "typing-feedback";
    }


    nextSentenceButton.disabled =
      true;
  }


  /* =========================================
     TYPING
     ========================================= */

  sentenceInput.addEventListener(
    "input",
    () => {

      /*
       * First update the visual alignment.
       */

      updateGhost();


      /*
       * Pronounce completed words.
       */

      pronounceCompletedWords();


      /*
       * Check complete sentence.
       */

      checkSentence();

    }
  );


  /* =========================================
     LISTEN BUTTON
     ========================================= */

  sentenceAudioButton.addEventListener(
    "click",
    () => {

      const sentence =
        story.sentences[
          currentSentenceIndex
        ].text;

      speak(sentence);

    }
  );


  /* =========================================
     NEXT
     ========================================= */

  nextSentenceButton.addEventListener(
    "click",
    () => {

      if (
        currentSentenceIndex <
        totalSentences - 1
      ) {

        currentSentenceIndex++;

        loadSentence();

        return;
      }


      /* =====================================
         STORY COMPLETE
         ===================================== */

      sentenceNumber.textContent =
        "🎉 Story Complete!";


      currentWordMeaning.textContent =
        "أحسنتِ!";


      currentWordIPA.textContent =
        "";


      ghostSentence.textContent =
        "You completed the story!";


      sentenceInput.value =
        "";

      sentenceInput.disabled =
        true;


      typingFeedback.textContent =
        "✓ Story completed successfully!";

      typingFeedback.className =
        "typing-feedback success";


      nextSentenceButton.disabled =
        true;


      sentenceProgressText.textContent =
        `${totalSentences} / ${totalSentences}`;


      sentenceProgressFill.style.width =
        "100%";

    }
  );


  /* =========================================
     LOAD SENTENCE
     ========================================= */

  function loadSentence() {

    const sentence =
      story.sentences[
        currentSentenceIndex
      ];


    sentenceNumber.textContent =
      `Sentence ${currentSentenceIndex + 1}`;


    currentWordMeaning.textContent =
      sentence.translation || "";


    currentWordIPA.textContent =
      "";


    /*
     * Clear input.
     */

    sentenceInput.value =
      "";


    sentenceInput.disabled =
      false;


    /*
     * Reset word pronunciation.
     */

    spokenWordCount =
      0;


    /*
     * Reset feedback.
     */

    typingFeedback.textContent =
      "";

    typingFeedback.className =
      "typing-feedback";


    /*
     * Disable Next.
     */

    nextSentenceButton.disabled =
      true;


    /*
     * Show complete ghost sentence.
     */

    ghostSentence.textContent =
      sentence.text;


    /*
     * Update progress.
     */

    updateProgress();


    /*
     * Align after rendering.
     */

    setTimeout(() => {

      alignInput();

      sentenceInput.focus();

    }, 100);

  }


  /* =========================================
     RESIZE
     ========================================= */

  window.addEventListener(
    "resize",
    () => {

      if (!sentenceInput.disabled) {
        alignInput();
      }

    }
  );


  /* =========================================
     START
     ========================================= */

  loadSentence();

});
