document.addEventListener("DOMContentLoaded", () => {

  const storyTitle = document.getElementById("storyTitle");
  const storyDescription = document.getElementById("storyDescription");
  const storyEmoji = document.getElementById("storyEmoji");
  const storyLevel = document.getElementById("storyLevel");

  const sentenceNumber = document.getElementById("sentenceNumber");
  const currentWordMeaning = document.getElementById("currentWordMeaning");
  const currentWordIPA = document.getElementById("currentWordIPA");

  const ghostSentence = document.getElementById("ghostSentence");
  const sentenceInput = document.getElementById("sentenceInput");

  const typingFeedback = document.getElementById("typingFeedback");
  const sentenceAudioButton = document.getElementById("sentenceAudioButton");
  const nextSentenceButton = document.getElementById("nextSentenceButton");

  const sentenceProgressText = document.getElementById("sentenceProgressText");
  const sentenceProgressFill = document.getElementById("sentenceProgressFill");

  const backToLevel = document.getElementById("backToLevel");


  /* =========================================
     STORY
     ========================================= */

  const params = new URLSearchParams(window.location.search);
  const storyId = params.get("story");

  const story = getStoryById(storyId);


  if (!story) {
    storyTitle.textContent = "Story not found";
    storyDescription.textContent =
      "Sorry, this story could not be found.";
    return;
  }


  let currentSentenceIndex = 0;
  const totalSentences = story.sentences.length;

  let spokenWordCount = 0;


  const level = story.level || "A1";


  /* =========================================
     STORY INFO
     ========================================= */

  storyTitle.textContent = story.title;
  storyDescription.textContent = story.description;
  storyEmoji.textContent = story.emoji;
  storyLevel.textContent = level;

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

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(text);

    utterance.lang = "en-US";
    utterance.rate = 0.82;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  }


  /* =========================================
     FORCE INPUT TO WORK
     ========================================= */

  function prepareInput() {

    sentenceInput.disabled = false;
    sentenceInput.readOnly = false;

    sentenceInput.style.setProperty(
      "pointer-events",
      "auto",
      "important"
    );

    sentenceInput.style.setProperty(
      "z-index",
      "100",
      "important"
    );

    sentenceInput.style.setProperty(
      "display",
      "block",
      "important"
    );

    sentenceInput.style.setProperty(
      "visibility",
      "visible",
      "important"
    );

    sentenceInput.style.setProperty(
      "opacity",
      "1",
      "important"
    );

    sentenceInput.style.setProperty(
      "background",
      "transparent",
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
      "box-shadow",
      "none",
      "important"
    );

    sentenceInput.style.setProperty(
      "color",
      "transparent",
      "important"
    );

    sentenceInput.style.setProperty(
      "-webkit-text-fill-color",
      "transparent",
      "important"
    );

    sentenceInput.style.setProperty(
      "caret-color",
      "#e58bb0",
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
  }


  /* =========================================
     POSITION INPUT
     ========================================= */

  function positionInput() {

    requestAnimationFrame(() => {

      const writingArea =
        document.querySelector(
          ".sentence-writing-area"
        );

      if (!writingArea) return;


      const areaRect =
        writingArea.getBoundingClientRect();

      const ghostRect =
        ghostSentence.getBoundingClientRect();


      /*
       * Input gets the same visual position
       * as the ghost sentence.
       */

      sentenceInput.style.setProperty(
        "position",
        "absolute",
        "important"
      );

      sentenceInput.style.setProperty(
        "left",
        `${ghostRect.left - areaRect.left}px`,
        "important"
      );

      sentenceInput.style.setProperty(
        "top",
        `${ghostRect.top - areaRect.top}px`,
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


      const ghostStyle =
        window.getComputedStyle(
          ghostSentence
        );


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
        "box-sizing",
        "border-box",
        "important"
      );


      prepareInput();
    });
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
     GHOST
     ========================================= */

  function updateGhost() {

    const sentence =
      story.sentences[
        currentSentenceIndex
      ].text;

    ghostSentence.textContent =
      sentence;

    positionInput();
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
      sentence.trim().split(/\s+/);

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
      normalize(sentenceInput.value);

    const correct =
      normalize(sentence);


    if (typed === correct) {

      typingFeedback.textContent =
        "✓ Perfect! Great job!";

      typingFeedback.className =
        "typing-feedback success";


      /*
       * Speak the complete sentence.
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
     INPUT
     ========================================= */

  sentenceInput.addEventListener(
    "input",
    () => {

      updateGhost();

      pronounceCompletedWords();

      checkSentence();
    }
  );


  /* =========================================
     CLICK INPUT
     ========================================= */

  sentenceInput.addEventListener(
    "click",
    () => {

      prepareInput();
    }
  );


  sentenceInput.addEventListener(
    "focus",
    () => {

      prepareInput();
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


    sentenceInput.value =
      "";

    sentenceInput.disabled =
      false;

    sentenceInput.readOnly =
      false;


    spokenWordCount =
      0;


    typingFeedback.textContent =
      "";

    typingFeedback.className =
      "typing-feedback";


    nextSentenceButton.disabled =
      true;


    ghostSentence.textContent =
      sentence.text;


    updateProgress();


    setTimeout(() => {

      prepareInput();

      positionInput();

      sentenceInput.focus();

    }, 150);
  }


  /* =========================================
     RESIZE
     ========================================= */

  window.addEventListener(
    "resize",
    () => {

      if (!sentenceInput.disabled) {
        positionInput();
      }

    }
  );


  /* =========================================
     START
     ========================================= */

  loadSentence();

});
