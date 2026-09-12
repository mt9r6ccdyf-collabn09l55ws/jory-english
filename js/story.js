document.addEventListener("DOMContentLoaded", () => {
  const storyTitle = document.getElementById("storyTitle");
  const storyDescription = document.getElementById("storyDescription");
  const storyEmoji = document.getElementById("storyEmoji");
  const storyLevel = document.getElementById("storyLevel");

  const sentenceNumber = document.getElementById("sentenceNumber");
  const sentenceText = document.getElementById("sentenceText");
  const sentenceTranslation = document.getElementById("sentenceTranslation");

  const currentWordMeaning =
    document.getElementById("currentWordMeaning");

  const currentWordIPA =
    document.getElementById("currentWordIPA");

  const typingInput =
    document.getElementById("typingInput");

  const ghostText =
    document.getElementById("ghostText");

  const typingFeedback =
    document.getElementById("typingFeedback");

  const nextSentenceButton =
    document.getElementById("nextSentenceButton");

  const sentenceAudioButton =
    document.getElementById("sentenceAudioButton");

  const sentenceProgressText =
    document.getElementById("sentenceProgressText");

  const sentenceProgressFill =
    document.getElementById("sentenceProgressFill");

  const backToLevel =
    document.getElementById("backToLevel");


  /* --------------------------------
     Get Story From URL
  -------------------------------- */

  const params = new URLSearchParams(window.location.search);
  const storyId = params.get("story");

  const story = getStoryById(storyId);


  /* --------------------------------
     If Story Does Not Exist
  -------------------------------- */

  if (!story) {
    storyTitle.textContent = "Story not found";
    storyDescription.textContent =
      "Sorry, this story could not be found.";

    sentenceText.textContent = "";
    sentenceTranslation.textContent = "";

    typingInput.disabled = true;
    nextSentenceButton.disabled = true;

    return;
  }


  /* --------------------------------
     Story Information
  -------------------------------- */

  let currentSentenceIndex = 0;

  const totalSentences = story.sentences.length;

  storyTitle.textContent = story.title;
  storyDescription.textContent = story.description;
  storyEmoji.textContent = story.emoji;
  storyLevel.textContent = story.level || "A1";

  document.title = `${story.title} | Jory English 🎀`;

  backToLevel.href =
    `level.html?level=${story.level || "A1"}`;

  backToLevel.textContent =
    `← Back to ${story.level || "A1"}`;


  /* --------------------------------
     Speech
  -------------------------------- */

  function speakWord(word) {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(word);

    utterance.lang = "en-US";
    utterance.rate = 0.85;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  }


  function speakSentence(sentence) {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(sentence);

    utterance.lang = "en-US";
    utterance.rate = 0.85;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  }


  /* --------------------------------
     Clean Text
  -------------------------------- */

  function cleanText(text) {
    return text
      .toLowerCase()
      .replace(/[.,!?;:'"()]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }


  /* --------------------------------
     Get Current Word
  -------------------------------- */

  function getCurrentWord() {

    const sentence =
      story.sentences[currentSentenceIndex];

    const words = sentence.words || [];

    const typedWords =
      typingInput.value.trim().split(/\s+/);

    const wordIndex =
      typedWords.length - 1;

    return words[wordIndex] || null;
  }


  /* --------------------------------
     Show Current Word Information
  -------------------------------- */

  function updateCurrentWord() {

    const word = getCurrentWord();

    if (!word) {
      currentWordMeaning.textContent =
        "Start typing...";

      currentWordIPA.textContent = "";

      return;
    }

    currentWordMeaning.textContent =
      word.meaning || "";

    currentWordIPA.textContent =
      word.ipa || "";

  }


  /* --------------------------------
     Ghost Text
  -------------------------------- */

  function updateGhostText() {

    const sentence =
      story.sentences[currentSentenceIndex];

    const typed =
      typingInput.value;

    if (!typed) {
      ghostText.textContent =
        sentence.text;

      return;
    }

    const typedLength = typed.length;

    ghostText.textContent =
      sentence.text.substring(typedLength);

  }


  /* --------------------------------
     Update Progress
  -------------------------------- */

  function updateProgress() {

    sentenceProgressText.textContent =
      `${currentSentenceIndex + 1} / ${totalSentences}`;

    const percent =
      ((currentSentenceIndex) / totalSentences) * 100;

    sentenceProgressFill.style.width =
      `${percent}%`;

  }


  /* --------------------------------
     Load Sentence
  -------------------------------- */

  function loadSentence() {

    const sentence =
      story.sentences[currentSentenceIndex];

    sentenceNumber.textContent =
      `Sentence ${currentSentenceIndex + 1}`;

    sentenceText.textContent =
      sentence.text;

    sentenceTranslation.textContent =
      sentence.translation || "";

    typingInput.value = "";

    typingInput.disabled = false;

    typingFeedback.textContent = "";

    typingFeedback.className =
      "typing-feedback";

    nextSentenceButton.disabled = true;

    currentWordMeaning.textContent =
      "Start typing...";

    currentWordIPA.textContent =
      "";

    updateGhostText();
    updateProgress();

    typingInput.focus();

  }


  /* --------------------------------
     Check Sentence
  -------------------------------- */

  function checkSentence() {

    const sentence =
      story.sentences[currentSentenceIndex];

    const typed =
      cleanText(typingInput.value);

    const correct =
      cleanText(sentence.text);

    if (typed === correct) {

      typingFeedback.textContent =
        "✓ Perfect! Great job!";

      typingFeedback.className =
        "typing-feedback success";

      nextSentenceButton.disabled = false;

      typingInput.disabled = true;

      sentenceProgressFill.style.width =
        `${((currentSentenceIndex + 1) / totalSentences) * 100}%`;

      return true;
    }

    typingFeedback.textContent =
      "Try Again ✨";

    typingFeedback.className =
      "typing-feedback error";

    nextSentenceButton.disabled = true;

    return false;
  }


  /* --------------------------------
     Typing
  -------------------------------- */

  typingInput.addEventListener("input", () => {

    updateCurrentWord();
    updateGhostText();

    const sentence =
      story.sentences[currentSentenceIndex];

    const typed =
      typingInput.value;

    if (!typed) {
      typingFeedback.textContent = "";
      typingFeedback.className =
        "typing-feedback";

      return;
    }


    /*
      Pronounce a word only when
      the typed word is exactly correct.
    */

    const typedWords =
      typed.trim().split(/\s+/);

    const wordIndex =
      typedWords.length - 1;

    const words =
      sentence.words || [];

    const currentWord =
      words[wordIndex];

    if (currentWord) {

      const typedWord =
        typedWords[wordIndex]
          .toLowerCase()
          .replace(/[.,!?;:'"()]/g, "");

      const correctWord =
        currentWord.word
          .toLowerCase()
          .replace(/[.,!?;:'"()]/g, "");

      if (typedWord === correctWord) {

        speakWord(currentWord.word);

      }

    }


    checkSentence();

  });


  /* --------------------------------
     Sentence Audio
  -------------------------------- */

  sentenceAudioButton.addEventListener(
    "click",
    () => {

      const sentence =
        story.sentences[currentSentenceIndex];

      speakSentence(sentence.text);

    }
  );


  /* --------------------------------
     Next Sentence
  -------------------------------- */

  nextSentenceButton.addEventListener(
    "click",
    () => {

      if (
        currentSentenceIndex <
        totalSentences - 1
      ) {

        currentSentenceIndex++;

        loadSentence();

      } else {

        sentenceNumber.textContent =
          "🎉 Story Complete!";

        sentenceText.textContent =
          "Amazing job! You completed the story.";

        sentenceTranslation.textContent =
          "أحسنتِ! أكملتِ القصة.";

        typingInput.value = "";

        typingInput.disabled = true;

        ghostText.textContent = "";

        currentWordMeaning.textContent =
          "Well done!";

        currentWordIPA.textContent =
          "";

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

    }
  );


  /* --------------------------------
     Start
  -------------------------------- */

  loadSentence();

});
