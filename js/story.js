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

  const typedSentence =
    document.getElementById("typedSentence");

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
     STORY
     ========================================= */

  const params =
    new URLSearchParams(
      window.location.search
    );

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
     SPEAK
     ========================================= */

  function speak(text) {

    if (!text) return;

    if (!("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();


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
      (currentSentenceIndex /
        totalSentences) * 100;


    sentenceProgressFill.style.width =
      `${percentage}%`;
  }


  /* =========================================
     UPDATE VISUAL TYPING
     ========================================= */

  function updateVisualText() {

    const sentence =
      story.sentences[
        currentSentenceIndex
      ].text;


    const typed =
      sentenceInput.value;


    /*
     * IMPORTANT:
     *
     * The ghost NEVER moves.
     *
     * typedSentence uses the EXACT
     * same font and position.
     */


    typedSentence.textContent =
      typed;


    /*
     * If nothing has been typed,
     * hide the typed layer.
     */

    if (!typed) {

      typedSentence.style.opacity =
        "0";

    } else {

      typedSentence.style.opacity =
        "1";
    }


    /*
     * Keep the input active.
     */

    sentenceInput.style.color =
      "transparent";


    sentenceInput.style.webkitTextFillColor =
      "transparent";


    /*
     * Check whether the user has typed
     * more than the original sentence.
     */

    if (
      typed.length >
      sentence.length
    ) {

      typedSentence.style.color =
        "#d8788d";

    } else {

      typedSentence.style.color =
        "";

    }

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
     * A word becomes complete after SPACE.
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
     PRONOUNCE WORDS
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
     * CORRECT
     */

    if (typed === correct) {

      typedSentence.textContent =
        sentence;


      typedSentence.style.opacity =
        "1";


      typedSentence.style.color =
        "";


      typingFeedback.textContent =
        "✓ Perfect! Great job!";


      typingFeedback.className =
        "typing-feedback success";


      /*
       * Speak full sentence.
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
     * NOT COMPLETE
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
     INPUT
     ========================================= */

  sentenceInput.addEventListener(
    "input",
    () => {

      updateVisualText();

      pronounceCompletedWords();

      checkSentence();

    }
  );


  /* =========================================
     LISTEN
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


      typedSentence.textContent =
        "";


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
     * Clear typing.
     */

    sentenceInput.value =
      "";


    sentenceInput.disabled =
      false;


    /*
     * Reset word speech.
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
     * Disable next.

     */

    nextSentenceButton.disabled =
      true;


    /*
     * Full ghost sentence.
     */

    ghostSentence.textContent =
      sentence.text;


    /*
     * Empty typed layer.

     */

    typedSentence.textContent =
      "";


    typedSentence.style.opacity =
      "0";


    /*
     * Progress.

     */

    updateProgress();


    /*
     * Focus keyboard.

     */

    setTimeout(() => {

      sentenceInput.focus();

    }, 100);

  }


  /* =========================================
     START
     ========================================= */

  loadSentence();

});
