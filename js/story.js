document.addEventListener("DOMContentLoaded", () => {

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


  /* =========================
     GET STORY
  ========================== */

  const params =
    new URLSearchParams(window.location.search);

  const storyId =
    params.get("story");

  const story =
    getStoryById(storyId);


  /* =========================
     STORY NOT FOUND
  ========================== */

  if (!story) {

    storyTitle.textContent =
      "Story not found";

    storyDescription.textContent =
      "Sorry, this story could not be found.";

    sentenceInput.disabled = true;

    return;
  }


  /* =========================
     VARIABLES
  ========================== */

  let currentSentenceIndex = 0;

  const totalSentences =
    story.sentences.length;


  /* =========================
     STORY INFORMATION
  ========================== */

  storyTitle.textContent =
    story.title;

  storyDescription.textContent =
    story.description;

  storyEmoji.textContent =
    story.emoji;

  storyLevel.textContent =
    story.level || "A1";

  document.title =
    `${story.title} | Jory English 🎀`;


  backToLevel.href =
    `level.html?level=${story.level || "A1"}`;

  backToLevel.textContent =
    `← Back to ${story.level || "A1"}`;


  /* =========================
     CLEAN TEXT
  ========================== */

  function cleanText(text) {

    return text
      .toLowerCase()
      .replace(/[.,!?;:'"()]/g, "")
      .replace(/\s+/g, " ")
      .trim();

  }


  /* =========================
     SPEAK
  ========================== */

  function speakSentence(text) {

    if (!("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(text);

    utterance.lang = "en-US";
    utterance.rate = 0.85;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);

  }


  /* =========================
     UPDATE PROGRESS
  ========================== */

  function updateProgress() {

    sentenceProgressText.textContent =
      `${currentSentenceIndex + 1} / ${totalSentences}`;

    const percent =
      (currentSentenceIndex / totalSentences) * 100;

    sentenceProgressFill.style.width =
      `${percent}%`;

  }


  /* =========================
     LOAD SENTENCE
  ========================== */

  function loadSentence() {

    const sentence =
      story.sentences[currentSentenceIndex];


    sentenceNumber.textContent =
      `Sentence ${currentSentenceIndex + 1}`;


    /* Arabic meaning */

    currentWordMeaning.textContent =
      sentence.translation || "";


    /* IPA is optional for now */

    currentWordIPA.textContent =
      "";


    /* Transparent original sentence */

    ghostSentence.textContent =
      sentence.text;


    /* Empty writing field */

    sentenceInput.value = "";


    sentenceInput.disabled =
      false;


    typingFeedback.textContent =
      "";

    typingFeedback.className =
      "typing-feedback";


    nextSentenceButton.disabled =
      true;


    updateProgress();


    sentenceInput.focus();

  }


  /* =========================
     GHOST SENTENCE
  ========================== */

  function updateGhostSentence() {

    const sentence =
      story.sentences[currentSentenceIndex];

    const typed =
      sentenceInput.value;


    if (!typed) {

      ghostSentence.textContent =
        sentence.text;

      return;
    }


    /*
      Keep the original sentence
      faintly visible.
    */

    ghostSentence.textContent =
      sentence.text;

  }


  /* =========================
     CHECK SENTENCE
  ========================== */

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
        Sentence is correct.
        Pronounce the whole sentence.
      */

      speakSentence(sentence.text);


      /*
        Stop editing until
        Next is pressed.
      */

      sentenceInput.disabled =
        true;


      nextSentenceButton.disabled =
        false;


      /*
        Full progress
      */

      sentenceProgressFill.style.width =
        `${((currentSentenceIndex + 1) / totalSentences) * 100}%`;


      return;

    }


    /*
      Don't show an error
      on every single keystroke.
    */

    if (
      sentenceInput.value.length >=
      sentence.text.length
    ) {

      typingFeedback.textContent =
        "Try Again ✨";

      typingFeedback.className =
        "typing-feedback error";

    }

    nextSentenceButton.disabled =
      true;

  }


  /* =========================
     TYPING
  ========================== */

  sentenceInput.addEventListener(
    "input",
    () => {

      updateGhostSentence();

      checkSentence();

    }
  );


  /* =========================
     SENTENCE AUDIO
  ========================== */

  sentenceAudioButton.addEventListener(
    "click",
    () => {

      const sentence =
        story.sentences[currentSentenceIndex];

      speakSentence(sentence.text);

    }
  );


  /* =========================
     NEXT SENTENCE
  ========================== */

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


      /* =========================
         STORY COMPLETE
      ========================== */

      sentenceNumber.textContent =
        "🎉 Story Complete!";


      currentWordMeaning.textContent =
        "أحسنتِ!";


      currentWordIPA.textContent =
        "";


      ghostSentence.textContent =
        "You completed the story!";


      sentenceInput.value = "";

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


  /* =========================
     START
  ========================== */

  loadSentence();

});
