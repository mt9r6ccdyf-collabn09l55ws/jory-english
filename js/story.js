document.addEventListener("DOMContentLoaded", () => {

  const storyTitle = document.getElementById("storyTitle");
  const storyDescription = document.getElementById("storyDescription");
  const storyEmoji = document.getElementById("storyEmoji");
  const storyLevel = document.getElementById("storyLevel");

  const sentenceNumber = document.getElementById("sentenceNumber");
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

    storyTitle.textContent = "Story not found";

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

  let lastCompletedWordCount = 0;


  const level =
    story.level || "A1";


  /* =========================================
     STORY INFO
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
     TEXT NORMALIZATION
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

    window.speechSynthesis.cancel();

    const voice =
      new SpeechSynthesisUtterance(text);

    voice.lang = "en-US";

    voice.rate = 0.82;

    voice.pitch = 1;

    window.speechSynthesis.speak(voice);
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
     ALIGN INPUT WITH GHOST
     ========================================= */

  function alignInput() {

    requestAnimationFrame(() => {

      /*
       * The ghost and input use the same
       * font properties.
       */

      const ghostRect =
        ghostSentence.getBoundingClientRect();

      const areaRect =
        document
          .querySelector(".sentence-writing-area")
          .getBoundingClientRect();


      /*
       * Same width as the ghost text.
       */

      sentenceInput.style.width =
        `${ghostRect.width}px`;


      /*
       * Same left position.
       */

      sentenceInput.style.left =
        `${ghostRect.left - areaRect.left}px`;


      /*
       * Same vertical position.
       */

      sentenceInput.style.top =
        `${ghostRect.top - areaRect.top}px`;


      /*
       * Important:
       * Do NOT use translate here.
       */

      sentenceInput.style.transform =
        "none";

    });
  }


  /* =========================================
     GET COMPLETED WORDS
     ========================================= */

  function getCompletedWords() {

    const typed =
      sentenceInput.value;

    /*
     * A word becomes complete when
     * the user types a space after it.
     */

    const parts =
      typed.split(/\s+/);

    if (
      typed.length === 0 ||
      !typed.endsWith(" ")
    ) {

      parts.pop();

    }

    return parts.filter(Boolean);
  }


  /* =========================================
     PRONOUNCE NEW WORD
     ========================================= */

  function pronounceNewWords() {

    const sentence =
      story.sentences[currentSentenceIndex];

    const expectedWords =
      sentence.text.trim().split(/\s+/);

    const completedWords =
      getCompletedWords();


    /*
     * Only pronounce NEW completed words.
     */

    while (
      lastCompletedWordCount <
      completedWords.length
    ) {

      const index =
        lastCompletedWordCount;

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
         * 🔊 Pronounce the completed word.
         */

        speak(expectedWord);

      }


      lastCompletedWordCount++;
    }
  }


  /* =========================================
     CHECK SENTENCE
     ========================================= */

  function checkSentence() {

    const sentence =
      story.sentences[currentSentenceIndex];

    const typed =
      normalize(sentenceInput.value);

    const correct =
      normalize(sentence.text);


    /*
     * COMPLETE + CORRECT
     */

    if (typed === correct) {

      typingFeedback.textContent =
        "✓ Perfect! Great job!";

      typingFeedback.className =
        "typing-feedback success";


      /*
       * 🔊 Pronounce the whole sentence.
       */

      speak(sentence.text);


      sentenceInput.disabled =
        true;

      nextSentenceButton.disabled =
        false;

      sentenceProgressFill.style.width =
        "100%";

      return;
    }


    /*
     * WRONG ANSWER
     */

    if (
      sentenceInput.value.length >=
      sentence.text.length
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
     LOAD SENTENCE
     ========================================= */

  function loadSentence() {

    const sentence =
      story.sentences[currentSentenceIndex];


    sentenceNumber.textContent =
      `Sentence ${currentSentenceIndex + 1}`;


    currentWordMeaning.textContent =
      sentence.translation || "";


    currentWordIPA.textContent =
      "";


    /*
     * Put the SAME sentence
     * into the transparent guide.
     */

    ghostSentence.textContent =
      sentence.text;


    sentenceInput.value =
      "";


    sentenceInput.disabled =
      false;


    typingFeedback.textContent =
      "";

    typingFeedback.className =
      "typing-feedback";


    nextSentenceButton.disabled =
      true;


    lastCompletedWordCount =
      0;


    updateProgress();


    /*
     * Wait for browser to render
     * then align the typing layer.
     */

    requestAnimationFrame(() => {

      alignInput();

      sentenceInput.focus();

    });

  }


  /* =========================================
     TYPING
     ========================================= */

  sentenceInput.addEventListener(
    "input",
    () => {

      /*
       * 🔊 Pronounce completed words.
       */

      pronounceNewWords();


      /*
       * Check the complete sentence.
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
        story.sentences[currentSentenceIndex];

      speak(sentence.text);

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
