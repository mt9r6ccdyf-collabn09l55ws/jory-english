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
     STORY
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


  let currentSentenceIndex = 0;

  const totalSentences =
    story.sentences.length;

  let lastSpokenWordCount = 0;


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

    utterance.lang = "en-US";
    utterance.rate = 0.82;
    utterance.pitch = 1;

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
     DISPLAY GHOST
     ========================================= */

  function updateGhost() {

    const sentence =
      story.sentences[
        currentSentenceIndex
      ].text;

    const typed =
      sentenceInput.value;


    /*
     * Only change the GHOST.
     *
     * We do NOT change the input.
     *
     * Therefore Backspace works normally.
     */

    ghostSentence.innerHTML = "";


    const typedPart =
      document.createElement("span");

    typedPart.className =
      "typed-visible";

    typedPart.textContent =
      typed;


    const remainingPart =
      document.createElement("span");

    remainingPart.className =
      "ghost-remaining";

    remainingPart.textContent =
      sentence.substring(
        typed.length
      );


    ghostSentence.appendChild(
      typedPart
    );

    ghostSentence.appendChild(
      remainingPart
    );
  }


  /* =========================================
     COMPLETED WORDS
     ========================================= */

  function getCompletedWords() {

    const typed =
      sentenceInput.value;


    if (!typed.endsWith(" ")) {

      return typed
        .split(/\s+/)
        .slice(0, -1)
        .filter(Boolean);
    }


    return typed
      .split(/\s+/)
      .filter(Boolean);
  }


  /* =========================================
     WORD SPEECH
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
      lastSpokenWordCount <
      completedWords.length
    ) {

      const index =
        lastSpokenWordCount;

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
         * 🔊 Speak the completed word.
         */

        speak(expectedWord);
      }


      lastSpokenWordCount++;
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


    if (typed === correct) {

      typingFeedback.textContent =
        "✓ Perfect! Great job!";

      typingFeedback.className =
        "typing-feedback success";


      /*
       * 🔊 Full sentence.
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
       * IMPORTANT:
       * The input itself is NEVER replaced
       * or rewritten.
       *
       * This makes Backspace/Delete work.
       */

      updateGhost();

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
         COMPLETE
         ===================================== */

      sentenceNumber.textContent =
        "🎉 Story Complete!";

      currentWordMeaning.textContent =
        "أحسنتِ!";

      currentWordIPA.textContent =
        "";


      ghostSentence.innerHTML = "";

      const completeSpan =
        document.createElement("span");

      completeSpan.className =
        "typed-visible complete";

      completeSpan.textContent =
        "You completed the story!";

      ghostSentence.appendChild(
        completeSpan
      );


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
     * Clear ONLY the input.
     */

    sentenceInput.value =
      "";

    sentenceInput.disabled =
      false;


    lastSpokenWordCount =
      0;


    typingFeedback.textContent =
      "";

    typingFeedback.className =
      "typing-feedback";


    nextSentenceButton.disabled =
      true;


    updateProgress();

    updateGhost();


    setTimeout(() => {

      sentenceInput.focus();

    }, 100);
  }


  /* =========================================
     START
     ========================================= */

  loadSentence();

});
