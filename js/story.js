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

  const sentenceProgressText =
    document.getElementById("sentenceProgressText");

  const sentenceProgressFill =
    document.getElementById("sentenceProgressFill");

  const backToLevel = document.getElementById("backToLevel");

  /* -----------------------------------------
     Get Story
  ----------------------------------------- */

  const params = new URLSearchParams(window.location.search);
  const storyId = params.get("story");
  const story = getStoryById(storyId);

  if (!story) {
    storyTitle.textContent = "Story not found";
    storyDescription.textContent =
      "Sorry, this story could not be found.";

    sentenceInput.disabled = true;
    return;
  }

  let currentSentenceIndex = 0;

  const totalSentences = story.sentences.length;

  /* -----------------------------------------
     Story Information
  ----------------------------------------- */

  storyTitle.textContent = story.title;
  storyDescription.textContent = story.description;
  storyEmoji.textContent = story.emoji;

  const level = story.level || "A1";

  storyLevel.textContent = level;

  document.title = `${story.title} | Jory English 🎀`;

  backToLevel.href = `level.html?level=${level}`;
  backToLevel.textContent = `← Back to ${level}`;


  /* -----------------------------------------
     Speech
  ----------------------------------------- */

  function speak(text) {

    if (!text) return;

    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(text);

    utterance.lang = "en-US";

    utterance.rate = 0.82;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  }


  /* -----------------------------------------
     Clean Text
  ----------------------------------------- */

  function cleanText(text) {

    return text
      .toLowerCase()
      .replace(/[.,!?;:'"()]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }


  /* -----------------------------------------
     Progress
  ----------------------------------------- */

  function updateProgress() {

    sentenceProgressText.textContent =
      `${currentSentenceIndex + 1} / ${totalSentences}`;

    const percent =
      (currentSentenceIndex / totalSentences) * 100;

    sentenceProgressFill.style.width =
      `${percent}%`;
  }


  /* -----------------------------------------
     Make Input Match Ghost Text
  ----------------------------------------- */

  function alignWritingText() {

    /*
      We measure the transparent sentence and give
      the input exactly the same width.

      This makes:

      My name is Lamar.
      ↑
      My name is Lamar.

      start at exactly the same position.
    */

    requestAnimationFrame(() => {

      const ghostWidth =
        ghostSentence.getBoundingClientRect().width;

      sentenceInput.style.width =
        `${ghostWidth}px`;

    });
  }


  /* -----------------------------------------
     Load Sentence
  ----------------------------------------- */

  function loadSentence() {

    const sentence =
      story.sentences[currentSentenceIndex];

    sentenceNumber.textContent =
      `Sentence ${currentSentenceIndex + 1}`;

    currentWordMeaning.textContent =
      sentence.translation || "";

    currentWordIPA.textContent = "";

    ghostSentence.textContent =
      sentence.text;

    sentenceInput.value = "";

    sentenceInput.disabled = false;

    sentenceInput.style.textAlign = "left";

    typingFeedback.textContent = "";

    typingFeedback.className =
      "typing-feedback";

    nextSentenceButton.disabled = true;

    updateProgress();

    /*
      Reset word pronunciation.
    */
    spokenWordIndex = 0;

    /*
      Align the input exactly with
      the transparent sentence.
    */
    alignWritingText();

    setTimeout(() => {
      sentenceInput.focus();
      alignWritingText();
    }, 100);

  }


  /* -----------------------------------------
     Word Pronunciation
  ----------------------------------------- */

  let spokenWordIndex = 0;


  function pronounceCompletedWords() {

    const sentence =
      story.sentences[currentSentenceIndex].text;

    const expectedWords =
      sentence.trim().split(/\s+/);

    const typedWords =
      sentenceInput.value.split(/\s+/);

    /*
      Remove the last unfinished word.
    */
    const completedWords =
      sentenceInput.value.endsWith(" ")
        ? typedWords.filter(Boolean)
        : typedWords.slice(0, -1).filter(Boolean);


    /*
      Check every newly completed word.
    */
    while (
      spokenWordIndex < completedWords.length
    ) {

      const typedWord =
        completedWords[spokenWordIndex];

      const expectedWord =
        expectedWords[spokenWordIndex];

      if (
        cleanText(typedWord) ===
        cleanText(expectedWord)
      ) {

        /*
          🔊 Speak the word immediately
        */
        speak(expectedWord);

      }

      spokenWordIndex++;
    }

  }


  /* -----------------------------------------
     Check Whole Sentence
  ----------------------------------------- */

  function checkSentence() {

    const sentence =
      story.sentences[currentSentenceIndex];

    const typed =
      cleanText(sentenceInput.value);

    const correct =
      cleanText(sentence.text);


    if (typed === correct) {

      typingFeedback.textContent =
        "✓ Perfect! Great job!";

      typingFeedback.className =
        "typing-feedback success";

      /*
        🔊 Speak the complete sentence
      */
      speak(sentence.text);

      sentenceInput.disabled = true;

      nextSentenceButton.disabled = false;

      sentenceProgressFill.style.width =
        "100%";

      return;
    }


    /*
      If the user has typed enough characters
      but the sentence is still wrong.
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

      typingFeedback.textContent = "";

      typingFeedback.className =
        "typing-feedback";

    }

    nextSentenceButton.disabled = true;

  }


  /* -----------------------------------------
     Typing
  ----------------------------------------- */

  sentenceInput.addEventListener(
    "input",
    () => {

      /*
        🔊 Check completed words
      */
      pronounceCompletedWords();

      /*
        Check complete sentence
      */
      checkSentence();

    }
  );


  /* -----------------------------------------
     Listen Button
  ----------------------------------------- */

  sentenceAudioButton.addEventListener(
    "click",
    () => {

      const sentence =
        story.sentences[currentSentenceIndex];

      speak(sentence.text);

    }
  );


  /* -----------------------------------------
     Next Sentence
  ----------------------------------------- */

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


      /* -----------------------------------------
         Story Complete
      ----------------------------------------- */

      sentenceNumber.textContent =
        "🎉 Story Complete!";

      currentWordMeaning.textContent =
        "أحسنتِ!";

      currentWordIPA.textContent = "";

      ghostSentence.textContent =
        "You completed the story!";

      sentenceInput.value = "";

      sentenceInput.disabled = true;

      typingFeedback.textContent =
        "✓ Story completed successfully!";

      typingFeedback.className =
        "typing-feedback success";

      nextSentenceButton.disabled = true;

      sentenceProgressText.textContent =
        `${totalSentences} / ${totalSentences}`;

      sentenceProgressFill.style.width =
        "100%";

    }
  );


  /* -----------------------------------------
     Resize
  ----------------------------------------- */

  window.addEventListener(
    "resize",
    alignWritingText
  );


  /* -----------------------------------------
     Start
  ----------------------------------------- */

  loadSentence();

});
