/* =========================================
   JORY ENGLISH 🎀
   STORIES PAGE SYSTEM
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* -----------------------------------------
     Get elements
     ----------------------------------------- */

  const storiesGrid =
    document.getElementById("storiesGrid");

  const levelCode =
    document.getElementById("levelCode");

  const levelIcon =
    document.getElementById("levelIcon");

  const levelTitle =
    document.getElementById("levelTitle");

  const levelDescription =
    document.getElementById("levelDescription");


  /* -----------------------------------------
     Make sure this is the level page
     ----------------------------------------- */

  if (!storiesGrid) {
    return;
  }


  /* -----------------------------------------
     Read level from URL
     
     Example:
     level.html?level=A1
     ----------------------------------------- */

  const params =
    new URLSearchParams(window.location.search);

  const levelId =
    (params.get("level") || "A1").toUpperCase();


  /* -----------------------------------------
     Get level information
     ----------------------------------------- */

  const level =
    getLevel(levelId);


  if (!level) {

    storiesGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🌸</div>
        <h2>Level not found</h2>
        <p>Please choose a valid level.</p>
      </div>
    `;

    return;
  }


  /* -----------------------------------------
     Update page information
     ----------------------------------------- */

  if (levelCode) {
    levelCode.textContent = level.id;
  }

  if (levelIcon) {
    levelIcon.textContent = level.icon;
  }

  if (levelTitle) {
    levelTitle.textContent = level.title;
  }

  if (levelDescription) {
    levelDescription.textContent =
      level.description;
  }


  /* -----------------------------------------
     Get stories
     ----------------------------------------- */

  const stories =
    getStoriesByLevel(levelId);


  /* -----------------------------------------
     No stories
     ----------------------------------------- */

  if (stories.length === 0) {

    storiesGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📚</div>
        <h2>No stories yet</h2>
        <p>New stories are coming soon.</p>
      </div>
    `;

    return;
  }


  /* -----------------------------------------
     Render stories
     ----------------------------------------- */

  storiesGrid.innerHTML =
    stories
      .map((story, index) => {

        const sentenceCount =
          story.sentences.length;

        return `
          <a
            href="story.html?story=${encodeURIComponent(story.id)}"
            class="story-card"
          >

            <div class="story-number">
              ${String(index + 1).padStart(2, "0")}
            </div>

            <div class="story-emoji">
              ${story.emoji}
            </div>

            <div class="story-content">

              <span class="story-level">
                ${story.level}
              </span>

              <h3>
                ${story.title}
              </h3>

              <p>
                ${story.description}
              </p>

              <div class="story-meta">

                <span>
                  📖 ${sentenceCount} Sentences
                </span>

                <span class="story-arrow">
                  →
                </span>

              </div>

            </div>

          </a>
        `;

      })
      .join("");


  /* -----------------------------------------
     Update document title
     ----------------------------------------- */

  document.title =
    `${level.title} | Jory English 🎀`;

});
