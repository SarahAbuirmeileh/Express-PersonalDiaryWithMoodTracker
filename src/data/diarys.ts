const initialDiarys: Store.IDiaryItem[] = [

  {
    id: new Date("2025-06-27").getTime(),
    title: "Family Reunion",
    notes: "We had a big *family reunion* at grandma's house. It was:\n\n1. Warm and loving\n2. A bit chaotic\n3. Full of laughter\n\nI helped Grandma bake pies—**apple** and **cherry**—and it felt like *home* again.",
    state: 3,
    type: ["Family"],
  },
  {
    id: new Date("2025-06-28").getTime(),
    title: "Unexpected Challenge",
    notes: "Work threw me a curveball:\n\n> \"Can you lead the new project from scratch?\"\n\nI felt nervous 😬 but took the challenge. **First milestone**: outline drafted. Need to keep momentum now.",
    state: 1,
    type: ["Work"],
    image: "https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg",
  },
  {
    id: new Date("2025-05-29").getTime(),
    title: "Quiet Victory",
    notes: "Finally finished that stubborn article I've been working on. The words just *flowed* today.\n\nResult:\n\n- **2,500** words written\n- Dozens of edits\n\nFeeling proud and relieved!",
    state: 4,
    type: ["Work"],
  },
  {
    id: new Date("2025-05-30").getTime(),
    title: "Midterms Stress",
    notes: "Studying for my midterms is **exhausting**. Notes are everywhere:\n- Biology chapter 5\n- Math integration problems\n- Literature analysis 🤯\n\nI scheduled breaks and made a *color-coded* timetable. \n\n**Goal:** finish all review by Friday.",
    state: 2,
    type: ["School"],
  },
  {
    id: new Date("2025-06-01").getTime(),
    title: "Evening Walk",
    notes: "Took a long walk as the sun set. The park was calm, birds chirping. I felt a sense of peace:\n\n> _Walking clears the mind._\n\nReturned with a fresh perspective and motivation to journal.",
    state: 0,
    type: ["School"],
  },
  {
    id: new Date("2025-06-02").getTime(),
    title: "Friendsgiving Prep",
    notes: "Planning a **Friendsgiving** dinner:\n\n- 🥧 Pumpkin pie\n- 🍗 Roast chicken\n- 🥗 Green salad\n- 🎶 Playlist is ready\n\nCreated an invite in the group chat and assigned tasks. So excited!",
    state: 4,
    type: ["Friends"],
    image: "https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg",
  },
  {
    id: new Date("2025-06-03").getTime(),
    title: "On Top of the World",
    notes: "Everything clicked today — energy, creativity, and happiness!",
    state: 4,
    type: ["Family"],
    image: "https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg",
  }
];

export {
    initialDiarys
}