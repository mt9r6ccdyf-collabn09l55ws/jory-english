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

    sentenceInput.disabled = true;

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
     NORMALIZE TEXT
     ========================================= */

  function normalize(text) {

    return text
      .toLowerCase()
      .replace(/[.,!?;:'"()]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }


  /* =========================================
     SPEAK
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

    /*
     * Do NOT cancel previous speech.
     *
     * This allows completed words
     * to be spoken in sequence.
     */

    window.speechSynthesis.speak(
      utterance
    );
  }


  /* =========================================
     UPDATE PROGRESS
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
     ALIGN INPUT EXACTLY WITH GHOST
     ========================================= */

  function alignInputWithGhost() {

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
       * Position input at EXACTLY
       * the same position as ghost text.
       */

      const left =
        ghostRect.left -
        areaRect.left;

      const top =
        ghostRect.top -
        areaRect.top;


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


      /*
       * IMPORTANT:
       * The input starts from the SAME
       * left edge as the transparent text.
       */

      sentenceInput.style.setProperty(
        "transform",
        "none",
        "important"
      );

      sentenceInput.style.setProperty(
        "text-align",
        "left",
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
        "color",
        "#493c46",
        "important"
      );

      sentenceInput.style.setProperty(
        "font-size",
        getComputedStyle(
          ghostSentence
        ).fontSize,
        "important"
      );

      sentenceInput.style.setProperty(
        "font-family",
        getComputedStyle(
          ghostSentence
        ).fontFamily,
        "important"
      );

      sentenceInput.style.setProperty(
        "font-weight",
        getComputedStyle(
          ghostSentence
        ).fontWeight,
        "important"
      );

      sentenceInput.style.setProperty(
        "line-height",
        getComputedStyle(
          ghostSentence
        ).lineHeight,
        "important"
      );

      sentenceInput.style.setProperty(
        "caret-color",
        "#e58bb0",
        "important"
      );

    });
  }


  /* =========================================
     UPDATE GHOST SENTENCE
     ========================================= */

  function updateGhostSentence() {

    const sentence =
      story.sentences[
        currentSentenceIndex
      ].text;

    const typed =
      sentenceInput.value;


    /*
     * The transparent sentence NEVER changes.
     *
     * It always stays:
     *
     * My name is Lamar.
     */

    ghostSentence.textContent =
      sentence;


    /*
     * Keep the typed text above it.
     */

    sentenceInput.style.color =
      "#493c46";


    /*
     * Re-align after every change.
     */

    alignInputWithGhost();
  }


  /* =========================================
     GET COMPLETED WORDS
     ========================================= */

  function getCompletedWords() {

    const typed =
      sentenceInput.value;


    if (!typed) {
      return [];
    }


    /*
     * A word becomes complete
     * after the user presses SPACE.
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
     PRONOUNCE COMPLETED WORDS
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
         * 🔊 WORD PRONUNCIATION
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


    /*
     * COMPLETE AND CORRECT
     */

    if (typed === correct) {

      typingFeedback.textContent =
        "✓ Perfect! Great job!";

      typingFeedback.className =
        "typing-feedback success";


      /*
       * 🔊 SPEAK COMPLETE SENTENCE
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


    /*
     * WRONG / INCOMPLETE
     */

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
     INPUT EVENT
     ========================================= */

  sentenceInput.addEventListener(
    "input",
    () => {

      /*
       * Update ghost.
       */

      updateGhostSentence();


      /*
       * Pronounce completed words.
       */

      pronounceCompletedWords();


      /*
       * Check whole sentence.
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
     NEXT BUTTON
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
     * CLEAR INPUT
     */

    sentenceInput.value =
      "";

    sentenceInput.disabled =
      false;


    /*
     * RESET WORD SPEECH
     */

    spokenWordCount =
      0;


    /*
     * RESET FEEDBACK
     */

    typingFeedback.textContent =
      "";

    typingFeedback.className =
      "typing-feedback";


    nextSentenceButton.disabled =
      true;


    /*
     * SHOW FULL TRANSPARENT SENTENCE
     */

    ghostSentence.textContent =
      sentence.text;


    /*
     * UPDATE PROGRESS
     */

    updateProgress();


    /*
     * ALIGN INPUT ON TOP OF GHOST
     */

    setTimeout(() => {

      alignInputWithGhost();

      sentenceInput.focus();

    }, 100);

  }


  /* =========================================
     WINDOW RESIZE
     ========================================= */

  window.addEventListener(
    "resize",
    () => {

      if (!sentenceInput.disabled) {

        alignInputWithGhost();

      }

    }
  );


  /* =========================================
     START
     ========================================= */

  loadSentence();

});
