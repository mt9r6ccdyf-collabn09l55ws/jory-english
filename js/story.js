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

  const oldInput =
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


  /* ==========================================
     GET STORY
     ========================================== */

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

    return;
  }


  let currentSentenceIndex = 0;

  const totalSentences =
    story.sentences.length;

  let lastSpokenWordCount = 0;


  const level =
    story.level || "A1";


  /* ==========================================
     STORY INFORMATION
     ========================================== */

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


  /* ==========================================
     CREATE REAL WRITING AREA
     ========================================== */

  /*
   * We replace the old input with a contenteditable
   * element.
   *
   * This means the typed text and ghost text
   * live inside ONE element.
   *
   * No alignment problem.
   */

  const sentenceEditor =
    document.createElement("div");

  sentenceEditor.id =
    "sentenceInput";

  sentenceEditor.className =
    "sentence-input sentence-editor";

  sentenceEditor.contentEditable =
    "true";

  sentenceEditor.setAttribute(
    "role",
    "textbox"
  );

  sentenceEditor.setAttribute(
    "spellcheck",
    "false"
  );

  sentenceEditor.setAttribute(
    "autocomplete",
    "off"
  );

  sentenceEditor.setAttribute(
    "autocapitalize",
    "off"
  );

  oldInput.replaceWith(
    sentenceEditor
  );


  /* ==========================================
     TEXT NORMALIZATION
     ========================================== */

  function normalize(text) {

    return text
      .toLowerCase()
      .replace(/[.,!?;:'"()]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }


  /* ==========================================
     SPEECH
     ========================================== */

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
     * Do not cancel here.
     *
     * This allows every completed word
     * to be spoken.
     */

    window.speechSynthesis.speak(
      utterance
    );
  }


  /* ==========================================
     PROGRESS
     ========================================== */

  function updateProgress() {

    sentenceProgressText.textContent =
      `${currentSentenceIndex + 1} / ${totalSentences}`;

    const percentage =
      (currentSentenceIndex / totalSentences) * 100;

    sentenceProgressFill.style.width =
      `${percentage}%`;
  }


  /* ==========================================
     GET PLAIN TEXT
     ========================================== */

  function getEditorText() {

    return sentenceEditor.innerText
      .replace(/\u00a0/g, " ");
  }


  /* ==========================================
     SAVE CARET POSITION
     ========================================== */

  function getCaretOffset() {

    const selection =
      window.getSelection();

    if (!selection.rangeCount) {
      return 0;
    }

    const range =
      selection.getRangeAt(0);

    const preRange =
      range.cloneRange();

    preRange.selectNodeContents(
      sentenceEditor
    );

    preRange.setEnd(
      range.endContainer,
      range.endOffset
    );

    return preRange.toString().length;
  }


  /* ==========================================
     RESTORE CARET
     ========================================== */

  function setCaretOffset(offset) {

    const selection =
      window.getSelection();

    const range =
      document.createRange();

    let currentOffset = 0;

    let found = false;


    function walk(node) {

      if (found) return;

      if (node.nodeType === Node.TEXT_NODE) {

        const length =
          node.textContent.length;

        if (
          currentOffset + length >=
          offset
        ) {

          range.setStart(
            node,
            Math.max(
              0,
              offset - currentOffset
            )
          );

          range.collapse(true);

          found = true;

          return;
        }

        currentOffset += length;

      } else {

        for (
          const child of node.childNodes
        ) {

          walk(child);

          if (found) return;
        }
      }
    }


    walk(sentenceEditor);


    if (!found) {

      range.selectNodeContents(
        sentenceEditor
      );

      range.collapse(false);
    }


    selection.removeAllRanges();

    selection.addRange(range);
  }


  /* ==========================================
     RENDER SENTENCE
     ========================================== */

  function renderSentence() {

    const sentence =
      story.sentences[
        currentSentenceIndex
      ].text;

    const typed =
      getEditorText();


    /*
     * How many characters are correct
     * from the beginning?
     */

    let correctLength = 0;


    while (
      correctLength < typed.length &&
      correctLength < sentence.length &&
      typed[correctLength] ===
      sentence[correctLength]
    ) {

      correctLength++;
    }


    const correctPart =
      sentence.substring(
        0,
        correctLength
      );

    const remainingPart =
      sentence.substring(
        correctLength
      );


    /*
     * Rebuild the ONE visible sentence.
     */

    sentenceEditor.innerHTML = "";


    const correctSpan =
      document.createElement("span");

    correctSpan.className =
      "typed-visible";

    correctSpan.textContent =
      correctPart;


    const remainingSpan =
      document.createElement("span");

    remainingSpan.className =
      "ghost-remaining";

    remainingSpan.textContent =
      remainingPart;


    sentenceEditor.appendChild(
      correctSpan
    );

    sentenceEditor.appendChild(
      remainingSpan
    );


    /*
     * Restore the caret.
     */

    setCaretOffset(
      Math.min(
        typed.length,
        sentence.length
      )
    );
  }


  /* ==========================================
     COMPLETED WORDS
     ========================================== */

  function pronounceCompletedWords() {

    const sentence =
      story.sentences[
        currentSentenceIndex
      ].text;


    const expectedWords =
      sentence
        .trim()
        .split(/\s+/);


    const typed =
      getEditorText();


    const completedWords =
      typed.endsWith(" ")
        ? typed.trim().split(/\s+/)
        : typed.trim().split(/\s+/).slice(0, -1);


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
         * 🔊 Every completed word speaks.
         */

        speak(expectedWord);
      }


      lastSpokenWordCount++;
    }
  }


  /* ==========================================
     CHECK SENTENCE
     ========================================== */

  function checkSentence() {

    const sentence =
      story.sentences[
        currentSentenceIndex
      ].text;


    const typed =
      normalize(
        getEditorText()
      );


    const correct =
      normalize(sentence);


    if (typed === correct) {

      typingFeedback.textContent =
        "✓ Perfect! Great job!";

      typingFeedback.className =
        "typing-feedback success";


      /*
       * 🔊 Speak the whole sentence.
       */

      speak(sentence);


      sentenceEditor.contentEditable =
        "false";


      nextSentenceButton.disabled =
        false;


      sentenceProgressFill.style.width =
        "100%";


      return;
    }


    if (
      getEditorText().length >=
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


  /* ==========================================
     TYPING EVENT
     ========================================== */

  sentenceEditor.addEventListener(
    "input",
    () => {

      /*
       * Speak completed words.
       */

      pronounceCompletedWords();


      /*
       * Redraw the sentence.
       */

      renderSentence();


      /*
       * Check full sentence.
       */

      checkSentence();
    }
  );


  /* ==========================================
     LISTEN BUTTON
     ========================================== */

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


  /* ==========================================
     NEXT
     ========================================== */

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


      /* ======================================
         STORY COMPLETE
         ====================================== */

      sentenceNumber.textContent =
        "🎉 Story Complete!";

      currentWordMeaning.textContent =
        "أحسنتِ!";

      currentWordIPA.textContent =
        "";


      sentenceEditor.innerHTML =
        `<span class="typed-visible complete">
          You completed the story!
        </span>`;


      sentenceEditor.contentEditable =
        "false";


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


  /* ==========================================
     LOAD SENTENCE
     ========================================== */

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


    sentenceEditor.contentEditable =
      "true";


    sentenceEditor.innerHTML = "";


    lastSpokenWordCount =
      0;


    typingFeedback.textContent =
      "";

    typingFeedback.className =
      "typing-feedback";


    nextSentenceButton.disabled =
      true;


    updateProgress();


    /*
     * Put the full sentence on screen.
     */

    const ghost =
      document.createElement("span");

    ghost.className =
      "ghost-remaining";

    ghost.textContent =
      sentence.text;

    sentenceEditor.appendChild(
      ghost
    );


    setTimeout(() => {

      sentenceEditor.focus();

    }, 100);
  }


  /* ==========================================
     START
     ========================================== */

  loadSentence();

});
