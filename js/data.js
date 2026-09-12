/* =========================================
   JORY ENGLISH 🎀
   CENTRAL DATA
   ========================================= */

/*
  This file contains the educational content
  used throughout Jory English.

  Structure:
  Levels
  Stories
  Sentences
  Words
  Arabic meanings
  IPA
  Audio paths
*/


/* =========================================
   LEVELS
   ========================================= */

const LEVELS = {

  A1: {
    id: "A1",
    title: "Beginner",
    titleAr: "مبتدئ",
    description: "Start with simple English.",
    descriptionAr: "ابدئي بأساسيات اللغة الإنجليزية البسيطة.",
    icon: "🌱",
    totalStories: 20
  },

  A2: {
    id: "A2",
    title: "Elementary",
    titleAr: "ابتدائي",
    description: "Build your everyday English.",
    descriptionAr: "طوري لغتك الإنجليزية المستخدمة في الحياة اليومية.",
    icon: "🌷",
    totalStories: 20
  },

  B1: {
    id: "B1",
    title: "Intermediate",
    titleAr: "متوسط",
    description: "Improve your communication skills.",
    descriptionAr: "طوري مهارات التواصل باللغة الإنجليزية.",
    icon: "🌿",
    totalStories: 20
  },

  B2: {
    id: "B2",
    title: "Upper-Intermediate",
    titleAr: "فوق المتوسط",
    description: "Develop stronger English skills.",
    descriptionAr: "طوري مهاراتك في اللغة الإنجليزية بشكل أقوى.",
    icon: "🌳",
    totalStories: 20
  }

};


/* =========================================
   A1 STORIES
   First 5 stories
   ========================================= */

const STORIES = [

  /* -----------------------------------------
     STORY 1
     ----------------------------------------- */

  {
    id: "a1-story-01",
    level: "A1",

    title: "My Morning Routine",
    titleAr: "روتيني الصباحي 🌅",

    emoji: "🌅",

    description:
      "A simple story about a morning routine.",

    descriptionAr:
      "قصة بسيطة عن الروتين الصباحي.",

    characters: [
      "Lamar"
    ],

    sentences: [

      {
        id: "a1-s01-s01",

        text: "My name is Lamar.",

        translation: "اسمي لمار.",

        audio: "audio/sentences/a1-story-01-s01.mp3",

        words: [
          {
            word: "My",
            meaning: "لي / خاصتي",
            ipa: "/maɪ/",
            audio: "audio/words/my.mp3"
          },
          {
            word: "name",
            meaning: "اسم",
            ipa: "/neɪm/",
            audio: "audio/words/name.mp3"
          },
          {
            word: "is",
            meaning: "يكون / هو",
            ipa: "/ɪz/",
            audio: "audio/words/is.mp3"
          },
          {
            word: "Lamar",
            meaning: "لمار",
            ipa: "/ləˈmɑːr/",
            audio: "audio/words/lamar.mp3"
          }
        ]
      },


      {
        id: "a1-s01-s02",

        text: "I wake up early.",

        translation: "أستيقظ مبكرًا.",

        audio: "audio/sentences/a1-story-01-s02.mp3",

        words: [
          {
            word: "I",
            meaning: "أنا",
            ipa: "/aɪ/",
            audio: "audio/words/i.mp3"
          },
          {
            word: "wake",
            meaning: "أستيقظ",
            ipa: "/weɪk/",
            audio: "audio/words/wake.mp3"
          },
          {
            word: "up",
            meaning: "إلى أعلى / الاستيقاظ",
            ipa: "/ʌp/",
            audio: "audio/words/up.mp3"
          },
          {
            word: "early",
            meaning: "مبكرًا",
            ipa: "/ˈɜːrli/",
            audio: "audio/words/early.mp3"
          }
        ]
      },


      {
        id: "a1-s01-s03",

        text: "I wash my face and brush my teeth.",

        translation: "أغسل وجهي وأنظف أسناني.",

        audio: "audio/sentences/a1-story-01-s03.mp3",

        words: [
          {
            word: "wash",
            meaning: "أغسل",
            ipa: "/wɑːʃ/",
            audio: "audio/words/wash.mp3"
          },
          {
            word: "face",
            meaning: "وجه",
            ipa: "/feɪs/",
            audio: "audio/words/face.mp3"
          },
          {
            word: "brush",
            meaning: "أنظف / أفرش",
            ipa: "/brʌʃ/",
            audio: "audio/words/brush.mp3"
          },
          {
            word: "teeth",
            meaning: "أسنان",
            ipa: "/tiːθ/",
            audio: "audio/words/teeth.mp3"
          }
        ]
      },


      {
        id: "a1-s01-s04",

        text: "Then, I eat breakfast with my family.",

        translation: "ثم أتناول الإفطار مع عائلتي.",

        audio: "audio/sentences/a1-story-01-s04.mp3",

        words: [
          {
            word: "Then",
            meaning: "ثم",
            ipa: "/ðen/",
            audio: "audio/words/then.mp3"
          },
          {
            word: "eat",
            meaning: "آكل",
            ipa: "/iːt/",
            audio: "audio/words/eat.mp3"
          },
          {
            word: "breakfast",
            meaning: "الإفطار",
            ipa: "/ˈbrekfəst/",
            audio: "audio/words/breakfast.mp3"
          },
          {
            word: "family",
            meaning: "عائلة",
            ipa: "/ˈfæməli/",
            audio: "audio/words/family.mp3"
          }
        ]
      },


      {
        id: "a1-s01-s05",

        text: "I am ready for a new day.",

        translation: "أنا مستعدة ليوم جديد.",

        audio: "audio/sentences/a1-story-01-s05.mp3",

        words: [
          {
            word: "ready",
            meaning: "مستعد",
            ipa: "/ˈredi/",
            audio: "audio/words/ready.mp3"
          },
          {
            word: "new",
            meaning: "جديد",
            ipa: "/nuː/",
            audio: "audio/words/new.mp3"
          },
          {
            word: "day",
            meaning: "يوم",
            ipa: "/deɪ/",
            audio: "audio/words/day.mp3"
          }
        ]
      }

    ]
  },


  /* -----------------------------------------
     STORY 2
     ----------------------------------------- */

  {
    id: "a1-story-02",
    level: "A1",

    title: "At the Grocery Store",
    titleAr: "في البقالة 🛒",

    emoji: "🛒",

    description:
      "Noura goes shopping with her mother.",

    descriptionAr:
      "تذهب نورة للتسوق مع والدتها.",

    characters: [
      "Noura"
    ],

    sentences: [

      {
        id: "a1-s02-s01",

        text: "Noura goes to the grocery store with her mother.",

        translation: "تذهب نورة إلى البقالة مع والدتها.",

        audio: "audio/sentences/a1-story-02-s01.mp3",

        words: [
          {
            word: "goes",
            meaning: "تذهب",
            ipa: "/ɡoʊz/",
            audio: "audio/words/goes.mp3"
          },
          {
            word: "grocery",
            meaning: "بقالة / مواد غذائية",
            ipa: "/ˈɡroʊsəri/",
            audio: "audio/words/grocery.mp3"
          },
          {
            word: "store",
            meaning: "متجر",
            ipa: "/stɔːr/",
            audio: "audio/words/store.mp3"
          },
          {
            word: "mother",
            meaning: "أم",
            ipa: "/ˈmʌðər/",
            audio: "audio/words/mother.mp3"
          }
        ]
      },


      {
        id: "a1-s02-s02",

        text: "They need some bread and milk.",

        translation: "هما تحتاجان إلى بعض الخبز والحليب.",

        audio: "audio/sentences/a1-story-02-s02.mp3",

        words: [
          {
            word: "They",
            meaning: "هم / هما",
            ipa: "/ðeɪ/",
            audio: "audio/words/they.mp3"
          },
          {
            word: "need",
            meaning: "يحتاج",
            ipa: "/niːd/",
            audio: "audio/words/need.mp3"
          },
          {
            word: "bread",
            meaning: "خبز",
            ipa: "/bred/",
            audio: "audio/words/bread.mp3"
          },
          {
            word: "milk",
            meaning: "حليب",
            ipa: "/mɪlk/",
            audio: "audio/words/milk.mp3"
          }
        ]
      },


      {
        id: "a1-s02-s03",

        text: "Noura puts the food in the basket.",

        translation: "تضع نورة الطعام في السلة.",

        audio: "audio/sentences/a1-story-02-s03.mp3",

        words: [
          {
            word: "puts",
            meaning: "تضع",
            ipa: "/pʊts/",
            audio: "audio/words/puts.mp3"
          },
          {
            word: "food",
            meaning: "طعام",
            ipa: "/fuːd/",
            audio: "audio/words/food.mp3"
          },
          {
            word: "basket",
            meaning: "سلة",
            ipa: "/ˈbæskɪt/",
            audio: "audio/words/basket.mp3"
          }
        ]
      },


      {
        id: "a1-s02-s04",

        text: "Her mother buys some apples.",

        translation: "تشتري والدتها بعض التفاح.",

        audio: "audio/sentences/a1-story-02-s04.mp3",

        words: [
          {
            word: "Her",
            meaning: "لها / خاصتها",
            ipa: "/hɜːr/",
            audio: "audio/words/her.mp3"
          },
          {
            word: "buys",
            meaning: "تشتري",
            ipa: "/baɪz/",
            audio: "audio/words/buys.mp3"
          },
          {
            word: "apples",
            meaning: "تفاح",
            ipa: "/ˈæpəlz/",
            audio: "audio/words/apples.mp3"
          }
        ]
      }

    ]
  },


  /* -----------------------------------------
     STORY 3
     ----------------------------------------- */

  {
    id: "a1-story-03",
    level: "A1",

    title: "Meet My Family",
    titleAr: "تعرف على عائلتي 👨‍👩‍👧‍👦",

    emoji: "👨‍👩‍👧‍👦",

    description:
      "Sami introduces his family.",

    descriptionAr:
      "يعرّف سامي عائلته.",

    characters: [
      "Sami"
    ],

    sentences: [

      {
        id: "a1-s03-s01",

        text: "My name is Sami, and I live with my family.",

        translation: "اسمي سامي، وأعيش مع عائلتي.",

        audio: "audio/sentences/a1-story-03-s01.mp3",

        words: [
          {
            word: "live",
            meaning: "أعيش",
            ipa: "/lɪv/",
            audio: "audio/words/live.mp3"
          },
          {
            word: "with",
            meaning: "مع",
            ipa: "/wɪð/",
            audio: "audio/words/with.mp3"
          },
          {
            word: "family",
            meaning: "عائلة",
            ipa: "/ˈfæməli/",
            audio: "audio/words/family.mp3"
          }
        ]
      },


      {
        id: "a1-s03-s02",

        text: "I have one brother and one sister.",

        translation: "لدي أخ واحد وأخت واحدة.",

        audio: "audio/sentences/a1-story-03-s02.mp3",

        words: [
          {
            word: "have",
            meaning: "لدي",
            ipa: "/hæv/",
            audio: "audio/words/have.mp3"
          },
          {
            word: "brother",
            meaning: "أخ",
            ipa: "/ˈbrʌðər/",
            audio: "audio/words/brother.mp3"
          },
          {
            word: "sister",
            meaning: "أخت",
            ipa: "/ˈsɪstər/",
            audio: "audio/words/sister.mp3"
          }
        ]
      },


      {
        id: "a1-s03-s03",

        text: "My brother likes football.",

        translation: "أخي يحب كرة القدم.",

        audio: "audio/sentences/a1-story-03-s03.mp3",

        words: [
          {
            word: "brother",
            meaning: "أخ",
            ipa: "/ˈbrʌðər/",
            audio: "audio/words/brother.mp3"
          },
          {
            word: "likes",
            meaning: "يحب",
            ipa: "/laɪks/",
            audio: "audio/words/likes.mp3"
          },
          {
            word: "football",
            meaning: "كرة القدم",
            ipa: "/ˈfʊtbɔːl/",
            audio: "audio/words/football.mp3"
          }
        ]
      },


      {
        id: "a1-s03-s04",

        text: "My sister likes reading books.",

        translation: "أختي تحب قراءة الكتب.",

        audio: "audio/sentences/a1-story-03-s04.mp3",

        words: [
          {
            word: "sister",
            meaning: "أخت",
            ipa: "/ˈsɪstər/",
            audio: "audio/words/sister.mp3"
          },
          {
            word: "reading",
            meaning: "القراءة",
            ipa: "/ˈriːdɪŋ/",
            audio: "audio/words/reading.mp3"
          },
          {
            word: "books",
            meaning: "كتب",
            ipa: "/bʊks/",
            audio: "audio/words/books.mp3"
          }
        ]
      }

    ]
  },


  /* -----------------------------------------
     STORY 4
     ----------------------------------------- */

  {
    id: "a1-story-04",
    level: "A1",

    title: "My Little Cat",
    titleAr: "قطتي الصغيرة 🐱",

    emoji: "🐱",

    description:
      "Reemas talks about her little cat.",

    descriptionAr:
      "تتحدث ريماس عن قطتها الصغيرة.",

    characters: [
      "Reemas"
    ],

    sentences: [

      {
        id: "a1-s04-s01",

        text: "Reemas has a little cat.",

        translation: "لدى ريماس قطة صغيرة.",

        audio: "audio/sentences/a1-story-04-s01.mp3",

        words: [
          {
            word: "has",
            meaning: "لديه / لديها",
            ipa: "/hæz/",
            audio: "audio/words/has.mp3"
          },
          {
            word: "little",
            meaning: "صغير",
            ipa: "/ˈlɪtəl/",
            audio: "audio/words/little.mp3"
          },
          {
            word: "cat",
            meaning: "قطة",
            ipa: "/kæt/",
            audio: "audio/words/cat.mp3"
          }
        ]
      },


      {
        id: "a1-s04-s02",

        text: "The cat is white and very cute.",

        translation: "القطة بيضاء ولطيفة جدًا.",

        audio: "audio/sentences/a1-story-04-s02.mp3",

        words: [
          {
            word: "cat",
            meaning: "قطة",
            ipa: "/kæt/",
            audio: "audio/words/cat.mp3"
          },
          {
            word: "white",
            meaning: "أبيض",
            ipa: "/waɪt/",
            audio: "audio/words/white.mp3"
          },
          {
            word: "cute",
            meaning: "لطيف / كيوت",
            ipa: "/kjuːt/",
            audio: "audio/words/cute.mp3"
          }
        ]
      },


      {
        id: "a1-s04-s03",

        text: "The cat likes to sleep on the sofa.",

        translation: "تحب القطة النوم على الأريكة.",

        audio: "audio/sentences/a1-story-04-s03.mp3",

        words: [
          {
            word: "likes",
            meaning: "تحب",
            ipa: "/laɪks/",
            audio: "audio/words/likes.mp3"
          },
          {
            word: "sleep",
            meaning: "ينام / النوم",
            ipa: "/sliːp/",
            audio: "audio/words/sleep.mp3"
          },
          {
            word: "sofa",
            meaning: "أريكة",
            ipa: "/ˈsoʊfə/",
            audio: "audio/words/sofa.mp3"
          }
        ]
      },


      {
        id: "a1-s04-s04",

        text: "Reemas plays with her cat every day.",

        translation: "تلعب ريماس مع قطتها كل يوم.",

        audio: "audio/sentences/a1-story-04-s04.mp3",

        words: [
          {
            word: "plays",
            meaning: "تلعب",
            ipa: "/pleɪz/",
            audio: "audio/words/plays.mp3"
          },
          {
            word: "every",
            meaning: "كل",
            ipa: "/ˈevri/",
            audio: "audio/words/every.mp3"
          },
          {
            word: "day",
            meaning: "يوم",
            ipa: "/deɪ/",
            audio: "audio/words/day.mp3"
          }
        ]
      }

    ]
  },


  /* -----------------------------------------
     STORY 5
     ----------------------------------------- */

  {
    id: "a1-story-05",
    level: "A1",

    title: "In the Classroom",
    titleAr: "في الفصل الدراسي 🏫",

    emoji: "🏫",

    description:
      "Sami has a lesson at school.",

    descriptionAr:
      "لدى سامي درس في المدرسة.",

    characters: [
      "Sami"
    ],

    sentences: [

      {
        id: "a1-s05-s01",

        text: "Sami is in the classroom.",

        translation: "سامي في الفصل الدراسي.",

        audio: "audio/sentences/a1-story-05-s01.mp3",

        words: [
          {
            word: "classroom",
            meaning: "فصل دراسي",
            ipa: "/ˈklæsruːm/",
            audio: "audio/words/classroom.mp3"
          },
          {
            word: "school",
            meaning: "مدرسة",
            ipa: "/skuːl/",
            audio: "audio/words/school.mp3"
          }
        ]
      },


      {
        id: "a1-s05-s02",

        text: "He sits at his desk.",

        translation: "يجلس على مكتبه.",

        audio: "audio/sentences/a1-story-05-s02.mp3",

        words: [
          {
            word: "He",
            meaning: "هو",
            ipa: "/hiː/",
            audio: "audio/words/he.mp3"
          },
          {
            word: "sits",
            meaning: "يجلس",
            ipa: "/sɪts/",
            audio: "audio/words/sits.mp3"
          },
          {
            word: "desk",
            meaning: "مكتب / طاولة دراسية",
            ipa: "/desk/",
            audio: "audio/words/desk.mp3"
          }
        ]
      },


      {
        id: "a1-s05-s03",

        text: "The teacher writes on the board.",

        translation: "تكتب المعلمة على السبورة.",

        audio: "audio/sentences/a1-story-05-s03.mp3",

        words: [
          {
            word: "teacher",
            meaning: "معلم / معلمة",
            ipa: "/ˈtiːtʃər/",
            audio: "audio/words/teacher.mp3"
          },
          {
            word: "writes",
            meaning: "يكتب / تكتب",
            ipa: "/raɪts/",
            audio: "audio/words/writes.mp3"
          },
          {
            word: "board",
            meaning: "سبورة",
            ipa: "/bɔːrd/",
            audio: "audio/words/board.mp3"
          }
        ]
      },


      {
        id: "a1-s05-s04",

        text: "Sami listens and learns new words.",

        translation: "يستمع سامي ويتعلم كلمات جديدة.",

        audio: "audio/sentences/a1-story-05-s04.mp3",

        words: [
          {
            word: "listens",
            meaning: "يستمع",
            ipa: "/ˈlɪsənz/",
            audio: "audio/words/listens.mp3"
          },
          {
            word: "learns",
            meaning: "يتعلم",
            ipa: "/lɜːrnz/",
            audio: "audio/words/learns.mp3"
          },
          {
            word: "new",
            meaning: "جديد",
            ipa: "/nuː/",
            audio: "audio/words/new.mp3"
          },
          {
            word: "words",
            meaning: "كلمات",
            ipa: "/wɜːrdz/",
            audio: "audio/words/words.mp3"
          }
        ]
      }

    ]
  }

];


/* =========================================
   HELPER FUNCTIONS
   ========================================= */

/*
  Get one level by its ID.
*/

function getLevel(levelId) {

  return LEVELS[levelId] || null;

}


/*
  Get all stories for a level.
*/

function getStoriesByLevel(levelId) {

  return STORIES.filter(
    story => story.level === levelId
  );

}


/*
  Get one story by its ID.
*/

function getStoryById(storyId) {

  return STORIES.find(
    story => story.id === storyId
  ) || null;

}


/*
  Get the total number of sentences
  inside a story.
*/

function getStorySentenceCount(storyId) {

  const story = getStoryById(storyId);

  if (!story) {
    return 0;
  }

  return story.sentences.length;

}
