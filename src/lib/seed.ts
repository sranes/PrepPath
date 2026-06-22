import type { Subject, Chapter, Question, Paper } from "./types";
import { C6_MATH_CHAPTERS, C6_MATH_QUESTIONS } from "./seed-class6-maths";
import { C6_SCIENCE_CHAPTERS, C6_SCIENCE_QUESTIONS } from "./seed-class6-science";

// ---------------------------------------------------------------------------
// SEED CONTENT
// A small, hand-written starter set covering Foundation classes 6-10.
// This proves the full practice loop end-to-end. Real content grows via the
// Admin import tool (/admin) without any code changes — admin-added questions
// are merged on top of this seed (see lib/content.ts).
// ---------------------------------------------------------------------------

export const SUBJECTS: Subject[] = [
  { id: "physics", name: "Physics", icon: "⚛️", accent: "from-sky-500 to-blue-600" },
  { id: "chemistry", name: "Chemistry", icon: "🧪", accent: "from-emerald-500 to-teal-600" },
  { id: "biology", name: "Biology", icon: "🧬", accent: "from-rose-500 to-pink-600" },
  { id: "maths", name: "Maths", icon: "📐", accent: "from-amber-500 to-orange-600" },
];

export const CHAPTERS: Chapter[] = [
  {
    id: "6-maths-integers",
    classId: "6",
    subjectId: "maths",
    title: "Integers (The Other Side of Zero)",
    blurb: "Positive and negative whole numbers and the number line.",
    ncertRef: "NCERT Class 6 Maths — Integers / The Other Side of Zero",
    lesson: [
      {
        kind: "para",
        text: "Numbers like 1, 2, 3 … are not enough to describe everything. To show a temperature below zero, money owed, or a floor below the ground, we need numbers smaller than zero — negative numbers.",
      },
      { kind: "heading", text: "What are integers?" },
      {
        kind: "para",
        text: "Integers are the whole numbers together with their negatives: … −3, −2, −1, 0, 1, 2, 3 … Zero is an integer that is neither positive nor negative.",
      },
      {
        kind: "list",
        items: [
          "Positive integers: 1, 2, 3, … (sometimes written +1, +2, …)",
          "Negative integers: −1, −2, −3, …",
          "Zero (0) sits exactly in the middle.",
        ],
      },
      { kind: "heading", text: "The number line" },
      {
        kind: "para",
        text: "On a number line, numbers increase as we move RIGHT and decrease as we move LEFT. So −5 is smaller than −2, and any negative number is smaller than any positive number.",
      },
      { kind: "tip", text: "Bigger negative digits mean a SMALLER number: −9 < −3, even though 9 > 3." },
      { kind: "heading", text: "Adding and subtracting" },
      {
        kind: "list",
        items: [
          "Adding a positive → move right. Adding a negative → move left.",
          "Subtracting a number means adding its opposite: a − (−b) = a + b.",
        ],
      },
      {
        kind: "example",
        problem: "Evaluate (−6) − (−9).",
        solution: "Subtracting −9 is the same as adding 9: (−6) + 9 = 3.",
      },
    ],
  },
  {
    id: "6-physics-motion-measurement",
    classId: "6",
    subjectId: "physics",
    title: "Motion and Measurement",
    blurb: "Standard units, measuring length, and types of motion.",
    ncertRef: "NCERT Class 6 Science — Measurement of Length and Motion",
    lesson: [
      { kind: "heading", text: "Why we need standard units" },
      {
        kind: "para",
        text: "Long ago people measured length using body parts — a handspan, a foot, a cubit. But these differ from person to person, so the same object gave different measurements. To be fair and consistent everywhere, the world agreed on standard units (the SI system).",
      },
      {
        kind: "list",
        items: [
          "The SI unit of length is the metre (m).",
          "Smaller: 1 m = 100 centimetres (cm) = 1000 millimetres (mm).",
          "Larger: 1 kilometre (km) = 1000 m.",
        ],
      },
      { kind: "tip", text: "When measuring with a ruler, place the object along the marks and read with your eye straight above the point — not at an angle." },
      { kind: "heading", text: "Types of motion" },
      {
        kind: "list",
        items: [
          "Rectilinear: along a straight line (a car on a straight road).",
          "Circular: along a circular path (a stone tied to a string, hands of a clock).",
          "Periodic: repeating after equal intervals (a swing, a pendulum).",
        ],
      },
      {
        kind: "example",
        problem: "What kind of motion does a child on a swing have?",
        solution: "It moves to-and-fro, repeating after equal times, so it is periodic (oscillatory) motion.",
      },
    ],
  },
  {
    id: "7-physics-heat",
    classId: "7",
    subjectId: "physics",
    title: "Heat",
    blurb: "Temperature, thermometers, and how heat travels.",
    ncertRef: "NCERT Class 7 Science, Ch. Heat",
  },
  {
    id: "8-physics-force-pressure",
    classId: "8",
    subjectId: "physics",
    title: "Force and Pressure",
    blurb: "Pushes and pulls, and how pressure depends on area.",
    ncertRef: "NCERT Class 8 Science, Ch. Force and Pressure",
  },
  {
    id: "9-physics-motion",
    classId: "9",
    subjectId: "physics",
    title: "Motion",
    blurb: "Speed, velocity, acceleration and the equations of motion.",
    ncertRef: "NCERT Class 9 Science, Ch. Motion",
  },
  {
    id: "9-chemistry-atoms-molecules",
    classId: "9",
    subjectId: "chemistry",
    title: "Atoms and Molecules",
    blurb: "Mole concept, atomic mass and chemical formulae.",
    ncertRef: "NCERT Class 9 Science, Ch. Atoms and Molecules",
  },
  {
    id: "10-physics-light",
    classId: "10",
    subjectId: "physics",
    title: "Light – Reflection and Refraction",
    blurb: "Mirrors, lenses, and bending of light.",
    ncertRef: "NCERT Class 10 Science, Ch. Light",
  },
  {
    id: "10-biology-life-processes",
    classId: "10",
    subjectId: "biology",
    title: "Life Processes",
    blurb: "Nutrition, respiration, transport and excretion in living things.",
    ncertRef: "NCERT Class 10 Science, Ch. Life Processes",
  },
  // --- Class 11–12: JEE / NEET level ---
  {
    id: "11-physics-kinematics",
    classId: "11",
    subjectId: "physics",
    title: "Kinematics",
    blurb: "Motion in a straight line and a plane; projectile motion.",
    ncertRef: "NCERT Class 11 Physics, Ch. Motion in a Straight Line / Plane",
  },
  {
    id: "11-chemistry-mole-concept",
    classId: "11",
    subjectId: "chemistry",
    title: "Some Basic Concepts of Chemistry",
    blurb: "Mole concept, stoichiometry and concentration terms.",
    ncertRef: "NCERT Class 11 Chemistry, Ch. Some Basic Concepts",
  },
  {
    id: "11-maths-quadratic",
    classId: "11",
    subjectId: "maths",
    title: "Complex Numbers & Quadratics",
    blurb: "Roots, discriminant and nature of quadratic equations.",
    ncertRef: "NCERT Class 11 Maths, Ch. Complex Numbers and Quadratic Equations",
  },
  {
    id: "11-biology-cell",
    classId: "11",
    subjectId: "biology",
    title: "Cell: The Unit of Life",
    blurb: "Cell theory, organelles and prokaryote vs eukaryote.",
    ncertRef: "NCERT Class 11 Biology, Ch. Cell: The Unit of Life",
  },
  {
    id: "12-physics-current-electricity",
    classId: "12",
    subjectId: "physics",
    title: "Current Electricity",
    blurb: "Ohm's law, resistivity and circuits.",
    ncertRef: "NCERT Class 12 Physics, Ch. Current Electricity",
  },
  {
    id: "12-chemistry-electrochemistry",
    classId: "12",
    subjectId: "chemistry",
    title: "Electrochemistry",
    blurb: "Electrolysis, cells and the Nernst equation.",
    ncertRef: "NCERT Class 12 Chemistry, Ch. Electrochemistry",
  },
  {
    id: "12-biology-genetics",
    classId: "12",
    subjectId: "biology",
    title: "Principles of Inheritance",
    blurb: "Mendelian genetics, ratios and inheritance patterns.",
    ncertRef: "NCERT Class 12 Biology, Ch. Principles of Inheritance and Variation",
  },
  ...C6_MATH_CHAPTERS,
  ...C6_SCIENCE_CHAPTERS,
];

export const QUESTIONS: Question[] = [
  // --- Class 6 Maths: Integers ---
  // Integers — 50 questions, easy → hard. Answers use a plain "-" for negatives.
  // --- EASY (20) ---
  { id: "q-6-int-1", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "mcq", difficulty: "easy", prompt: "Which of these integers is the smallest?", options: ["-7", "-3", "0", "2"], answer: "-7", solution: "On the number line, −7 is furthest to the left, so it is the smallest." },
  { id: "q-6-int-2", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "numeric", difficulty: "easy", prompt: "Evaluate: (−8) + 5", answer: "-3", solution: "Start at −8 and move 5 right: −8 → −3." },
  { id: "q-6-int-3", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "numeric", difficulty: "medium", prompt: "Evaluate: (−6) − (−9)", answer: "3", solution: "Subtracting −9 means adding 9: −6 + 9 = 3." },
  { id: "q-6-int-4", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "mcq", difficulty: "easy", prompt: "Which is greater, −2 or −5?", options: ["-2", "-5", "they are equal", "cannot say"], answer: "-2", solution: "−2 is to the right of −5 on the number line, so −2 is greater." },
  { id: "q-6-int-5", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "numeric", difficulty: "easy", prompt: "What is the opposite of 6?", answer: "-6", solution: "The opposite of 6 is −6." },
  { id: "q-6-int-6", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "numeric", difficulty: "easy", prompt: "What is the opposite of −4?", answer: "4", solution: "The opposite of −4 is 4." },
  { id: "q-6-int-7", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "numeric", difficulty: "easy", prompt: "Evaluate: 3 + (−3)", answer: "0", solution: "A number plus its opposite is 0." },
  { id: "q-6-int-8", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "mcq", difficulty: "easy", prompt: "Which integer is just to the right of 0 on the number line?", options: ["-1", "0", "1", "2"], answer: "1", solution: "Moving right increases the value: 0 → 1." },
  { id: "q-6-int-9", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "numeric", difficulty: "easy", prompt: "Evaluate: (−5) + 2", answer: "-3", solution: "Start at −5, move 2 right: −3." },
  { id: "q-6-int-10", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "numeric", difficulty: "easy", prompt: "Evaluate: 7 + (−2)", answer: "5", solution: "Start at 7, move 2 left: 5." },
  { id: "q-6-int-11", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "mcq", difficulty: "easy", prompt: "Compared with 0, the number −3 is:", options: ["greater", "less", "equal", "cannot say"], answer: "less", solution: "All negative numbers are less than 0." },
  { id: "q-6-int-12", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "numeric", difficulty: "easy", prompt: "Evaluate: (−10) + 10", answer: "0", solution: "A number plus its opposite is 0." },
  { id: "q-6-int-13", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "numeric", difficulty: "easy", prompt: "What is the successor of −1?", answer: "0", solution: "Successor = number + 1 = −1 + 1 = 0." },
  { id: "q-6-int-14", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "numeric", difficulty: "easy", prompt: "What is the predecessor of 0?", answer: "-1", solution: "Predecessor = number − 1 = 0 − 1 = −1." },
  { id: "q-6-int-15", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "mcq", difficulty: "easy", prompt: "Which is the largest?", options: ["-1", "-9", "-4", "-2"], answer: "-1", solution: "Closest to zero among negatives is the largest: −1." },
  { id: "q-6-int-16", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "numeric", difficulty: "easy", prompt: "Evaluate: 4 + (−9)", answer: "-5", solution: "Start at 4, move 9 left: −5." },
  { id: "q-6-int-17", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "numeric", difficulty: "easy", prompt: "Evaluate: (−2) + (−3)", answer: "-5", solution: "Two negatives add to a larger negative: −5." },
  { id: "q-6-int-18", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "mcq", difficulty: "easy", prompt: "Which integer represents '5 degrees below zero'?", options: ["5", "-5", "50", "-50"], answer: "-5", solution: "Below zero is negative: −5." },
  { id: "q-6-int-19", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "numeric", difficulty: "easy", prompt: "Evaluate: 0 − 6", answer: "-6", solution: "0 − 6 = −6." },
  { id: "q-6-int-20", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "numeric", difficulty: "easy", prompt: "Evaluate: (−7) + 7", answer: "0", solution: "A number plus its opposite is 0." },

  // --- MEDIUM (15) ---
  { id: "q-6-int-21", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "numeric", difficulty: "medium", prompt: "Evaluate: (−3) − 4", answer: "-7", solution: "−3 − 4 = −7 (move 4 further left)." },
  { id: "q-6-int-22", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "numeric", difficulty: "medium", prompt: "Evaluate: (−5) − (−2)", answer: "-3", solution: "Subtracting −2 means adding 2: −5 + 2 = −3." },
  { id: "q-6-int-23", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "numeric", difficulty: "medium", prompt: "Evaluate: 6 − 9", answer: "-3", solution: "6 − 9 = −3." },
  { id: "q-6-int-24", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "mcq", difficulty: "medium", prompt: "Which is the smallest of −3, 5, −8, 0?", options: ["-3", "5", "-8", "0"], answer: "-8", solution: "−8 is furthest to the left, so it is smallest." },
  { id: "q-6-int-25", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "numeric", difficulty: "medium", prompt: "Evaluate: (−12) + 5", answer: "-7", solution: "−12 + 5 = −7." },
  { id: "q-6-int-26", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "numeric", difficulty: "medium", prompt: "Evaluate: 8 + (−15)", answer: "-7", solution: "8 − 15 = −7." },
  { id: "q-6-int-27", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "numeric", difficulty: "medium", prompt: "Evaluate: (−4) − (−4)", answer: "0", solution: "−4 + 4 = 0." },
  { id: "q-6-int-28", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "numeric", difficulty: "medium", prompt: "What is the sum of −6 and −4?", answer: "-10", solution: "−6 + (−4) = −10." },
  { id: "q-6-int-29", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "mcq", difficulty: "medium", prompt: "Which is the largest of −1, −7, 3, −2?", options: ["-1", "-7", "3", "-2"], answer: "3", solution: "3 is the only positive number, so it is largest." },
  { id: "q-6-int-30", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "numeric", difficulty: "medium", prompt: "Evaluate: (−9) + 4", answer: "-5", solution: "−9 + 4 = −5." },
  { id: "q-6-int-31", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "numeric", difficulty: "medium", prompt: "Evaluate: 10 − (−5)", answer: "15", solution: "Subtracting −5 means adding 5: 10 + 5 = 15." },
  { id: "q-6-int-32", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "numeric", difficulty: "medium", prompt: "Evaluate: (−3) + (−3) + (−3)", answer: "-9", solution: "Three lots of −3 make −9." },
  { id: "q-6-int-33", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "mcq", difficulty: "medium", prompt: "Which statement is TRUE?", options: ["-5 > -2", "-2 > -5", "0 < -1", "-7 > 7"], answer: "-2 > -5", solution: "−2 is to the right of −5, so −2 > −5." },
  { id: "q-6-int-34", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "numeric", difficulty: "medium", prompt: "What is the predecessor of −5?", answer: "-6", solution: "Predecessor = −5 − 1 = −6." },
  { id: "q-6-int-35", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "numeric", difficulty: "medium", prompt: "What is the successor of −10?", answer: "-9", solution: "Successor = −10 + 1 = −9." },

  // --- HARD (15) ---
  { id: "q-6-int-36", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "numeric", difficulty: "hard", prompt: "Evaluate: (−15) + 8 − 3", answer: "-10", solution: "−15 + 8 = −7, then −7 − 3 = −10." },
  { id: "q-6-int-37", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "numeric", difficulty: "hard", prompt: "Evaluate: (−7) − (−12)", answer: "5", solution: "−7 + 12 = 5." },
  { id: "q-6-int-38", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "numeric", difficulty: "hard", prompt: "Evaluate: (−20) + 25", answer: "5", solution: "−20 + 25 = 5." },
  { id: "q-6-int-39", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "numeric", difficulty: "hard", prompt: "Evaluate: (−6) + (−9) + 5", answer: "-10", solution: "−6 − 9 = −15, then −15 + 5 = −10." },
  { id: "q-6-int-40", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "numeric", difficulty: "hard", prompt: "Evaluate: 12 + (−7) + (−10)", answer: "-5", solution: "12 − 7 = 5, then 5 − 10 = −5." },
  { id: "q-6-int-41", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "numeric", difficulty: "hard", prompt: "Evaluate: (−100) + 99", answer: "-1", solution: "−100 + 99 = −1." },
  { id: "q-6-int-42", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "numeric", difficulty: "hard", prompt: "How many steps apart are −3 and 4 on the number line?", answer: "7", solution: "Distance = 3 + 4 = 7 steps." },
  { id: "q-6-int-43", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "numeric", difficulty: "hard", prompt: "Evaluate: (−8) − 5", answer: "-13", solution: "−8 − 5 = −13." },
  { id: "q-6-int-44", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "numeric", difficulty: "hard", prompt: "Evaluate: (−2) + 9 − 11", answer: "-4", solution: "−2 + 9 = 7, then 7 − 11 = −4." },
  { id: "q-6-int-45", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "mcq", difficulty: "hard", prompt: "The temperature is −5°C and rises by 8°C. The new temperature (°C) is:", options: ["3", "-3", "13", "-13"], answer: "3", solution: "−5 + 8 = 3°C." },
  { id: "q-6-int-46", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "numeric", difficulty: "hard", prompt: "Evaluate: (−50) + (−50)", answer: "-100", solution: "−50 − 50 = −100." },
  { id: "q-6-int-47", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "numeric", difficulty: "hard", prompt: "Evaluate: (−4) − (−9) − 2", answer: "3", solution: "−4 + 9 = 5, then 5 − 2 = 3." },
  { id: "q-6-int-48", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "numeric", difficulty: "hard", prompt: "A submarine at −200 m rises 75 m. Its new depth (in m) is:", answer: "-125", solution: "−200 + 75 = −125 m." },
  { id: "q-6-int-49", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "numeric", difficulty: "hard", prompt: "Evaluate: (−1) + 2 + (−3) + 4", answer: "2", solution: "−1 + 2 = 1, 1 − 3 = −2, −2 + 4 = 2." },
  { id: "q-6-int-50", chapterId: "6-maths-integers", classId: "6", subjectId: "maths", type: "mcq", difficulty: "hard", prompt: "Which is the greatest integer?", options: ["-1", "-100", "-50", "-2"], answer: "-1", solution: "−1 is closest to zero, so it is the greatest." },

  // --- Class 6 Physics: Motion and Measurement ---
  {
    id: "q-6-mm-1",
    chapterId: "6-physics-motion-measurement",
    classId: "6",
    subjectId: "physics",
    type: "mcq",
    difficulty: "easy",
    prompt: "The SI unit of length is the:",
    options: ["centimetre", "metre", "kilometre", "foot"],
    answer: "metre",
    solution:
      "The internationally agreed (SI) unit of length is the metre. Centimetre and kilometre are based on the metre; the foot is a non-SI unit.",
  },
  {
    id: "q-6-mm-2",
    chapterId: "6-physics-motion-measurement",
    classId: "6",
    subjectId: "physics",
    type: "mcq",
    difficulty: "medium",
    prompt: "The motion of a child on a swing is an example of:",
    options: ["rectilinear motion", "periodic motion", "rotational motion", "no motion"],
    answer: "periodic motion",
    solution:
      "A swing repeats its to-and-fro path after equal intervals of time, which is periodic (oscillatory) motion. Moving in a straight line would be rectilinear.",
  },

  // --- Class 7 Physics: Heat ---
  {
    id: "q-7-heat-1",
    chapterId: "7-physics-heat",
    classId: "7",
    subjectId: "physics",
    type: "mcq",
    difficulty: "easy",
    prompt: "A clinical thermometer is used to measure:",
    options: ["room temperature", "human body temperature", "boiling water", "the weather"],
    answer: "human body temperature",
    solution:
      "A clinical thermometer ranges roughly 35°C–42°C, ideal for body temperature. A laboratory thermometer has a wider range for other uses.",
  },
  {
    id: "q-7-heat-2",
    chapterId: "7-physics-heat",
    classId: "7",
    subjectId: "physics",
    type: "mcq",
    difficulty: "medium",
    prompt: "Heat transfer in solids mainly happens by:",
    options: ["convection", "conduction", "radiation", "evaporation"],
    answer: "conduction",
    solution:
      "In solids, particles are tightly packed and vibrate in place, passing energy to neighbours — this is conduction. Convection needs a moving fluid; radiation needs no medium.",
  },

  // --- Class 8 Physics: Force and Pressure ---
  {
    id: "q-8-fp-1",
    chapterId: "8-physics-force-pressure",
    classId: "8",
    subjectId: "physics",
    type: "mcq",
    difficulty: "medium",
    prompt: "Why is the tip of a nail made sharp (pointed)?",
    options: [
      "to increase the force",
      "to increase pressure by reducing area",
      "to decrease pressure",
      "to look nice",
    ],
    answer: "to increase pressure by reducing area",
    solution:
      "Pressure = Force / Area. A sharp tip has a very small area, so the same force produces much higher pressure, letting the nail pierce easily.",
  },
  {
    id: "q-8-fp-2",
    chapterId: "8-physics-force-pressure",
    classId: "8",
    subjectId: "physics",
    type: "numeric",
    difficulty: "hard",
    prompt:
      "A force of 60 N acts on an area of 0.2 m². Find the pressure in pascals (N/m²).",
    answer: "300",
    solution:
      "Pressure = Force / Area = 60 N ÷ 0.2 m² = 300 N/m² = 300 Pa.",
  },

  // --- Class 9 Physics: Motion ---
  {
    id: "q-9-mot-1",
    chapterId: "9-physics-motion",
    classId: "9",
    subjectId: "physics",
    type: "numeric",
    difficulty: "medium",
    prompt:
      "A car starts from rest and reaches 20 m/s in 5 s. What is its acceleration (m/s²)?",
    answer: "4",
    solution:
      "a = (v − u) / t = (20 − 0) / 5 = 4 m/s².",
  },
  {
    id: "q-9-mot-2",
    chapterId: "9-physics-motion",
    classId: "9",
    subjectId: "physics",
    type: "mcq",
    difficulty: "medium",
    prompt: "Which quantity is a vector?",
    options: ["distance", "speed", "displacement", "time"],
    answer: "displacement",
    solution:
      "Displacement has both magnitude and direction, so it is a vector. Distance, speed and time are scalars (magnitude only).",
  },

  // --- Class 9 Chemistry: Atoms and Molecules ---
  {
    id: "q-9-am-1",
    chapterId: "9-chemistry-atoms-molecules",
    classId: "9",
    subjectId: "chemistry",
    type: "numeric",
    difficulty: "medium",
    prompt: "What is the molecular mass of water (H₂O)? (H = 1, O = 16)",
    answer: "18",
    solution:
      "H₂O = 2×(mass of H) + 1×(mass of O) = 2×1 + 16 = 18 u.",
  },
  {
    id: "q-9-am-2",
    chapterId: "9-chemistry-atoms-molecules",
    classId: "9",
    subjectId: "chemistry",
    type: "mcq",
    difficulty: "hard",
    prompt: "The number of atoms in one mole of any substance is:",
    options: ["6.022 × 10²³", "3.0 × 10⁸", "1.6 × 10⁻¹⁹", "9.8"],
    answer: "6.022 × 10²³",
    solution:
      "One mole contains Avogadro's number of particles, 6.022 × 10²³. This links the atomic-scale to measurable grams.",
  },

  // --- Class 10 Physics: Light ---
  {
    id: "q-10-light-1",
    chapterId: "10-physics-light",
    classId: "10",
    subjectId: "physics",
    type: "mcq",
    difficulty: "medium",
    prompt: "The image formed by a plane mirror is always:",
    options: ["real and inverted", "virtual and erect", "real and erect", "virtual and inverted"],
    answer: "virtual and erect",
    solution:
      "A plane mirror forms an image that is virtual (cannot be caught on a screen), erect, and the same size, located as far behind the mirror as the object is in front.",
  },
  {
    id: "q-10-light-2",
    chapterId: "10-physics-light",
    classId: "10",
    subjectId: "physics",
    type: "numeric",
    difficulty: "hard",
    prompt:
      "A concave mirror has a radius of curvature of 30 cm. What is its focal length (cm)?",
    answer: "15",
    solution:
      "Focal length f = R / 2 = 30 / 2 = 15 cm. For a concave mirror this focus is real.",
  },

  // --- Class 10 Biology: Life Processes ---
  {
    id: "q-10-lp-1",
    chapterId: "10-biology-life-processes",
    classId: "10",
    subjectId: "biology",
    type: "mcq",
    difficulty: "easy",
    prompt: "Which gas do plants take in for photosynthesis?",
    options: ["oxygen", "nitrogen", "carbon dioxide", "hydrogen"],
    answer: "carbon dioxide",
    solution:
      "In photosynthesis plants absorb carbon dioxide (and water) and, using sunlight, produce glucose and release oxygen.",
  },
  {
    id: "q-10-lp-2",
    chapterId: "10-biology-life-processes",
    classId: "10",
    subjectId: "biology",
    type: "mcq",
    difficulty: "medium",
    prompt: "The functional unit of the kidney is the:",
    options: ["neuron", "nephron", "alveolus", "villus"],
    answer: "nephron",
    solution:
      "The nephron filters blood and forms urine — it is the kidney's functional unit. Neurons are in nerves, alveoli in lungs, villi in the intestine.",
  },

  // --- Class 11 Physics: Kinematics ---
  {
    id: "q-11-kin-1",
    chapterId: "11-physics-kinematics",
    classId: "11",
    subjectId: "physics",
    type: "numeric",
    difficulty: "medium",
    prompt:
      "A ball is thrown vertically up at 19.6 m/s. How high does it rise? (g = 9.8 m/s², answer in m)",
    answer: "19.6",
    solution:
      "At the top v = 0. Using v² = u² − 2gh → 0 = 19.6² − 2(9.8)h → h = 384.16 / 19.6 = 19.6 m.",
  },
  {
    id: "q-11-kin-2",
    chapterId: "11-physics-kinematics",
    classId: "11",
    subjectId: "physics",
    type: "mcq",
    difficulty: "hard",
    prompt:
      "For a projectile, the range is maximum when the angle of projection is:",
    options: ["30°", "45°", "60°", "90°"],
    answer: "45°",
    solution:
      "Range R = u²sin(2θ)/g is maximum when sin(2θ) = 1, i.e. 2θ = 90°, so θ = 45°.",
  },

  // --- Class 11 Chemistry: Mole concept ---
  {
    id: "q-11-mole-1",
    chapterId: "11-chemistry-mole-concept",
    classId: "11",
    subjectId: "chemistry",
    type: "numeric",
    difficulty: "medium",
    prompt: "How many moles are there in 36 g of water? (H₂O = 18 g/mol)",
    answer: "2",
    solution: "moles = mass / molar mass = 36 / 18 = 2 mol.",
  },
  {
    id: "q-11-mole-2",
    chapterId: "11-chemistry-mole-concept",
    classId: "11",
    subjectId: "chemistry",
    type: "mcq",
    difficulty: "hard",
    prompt: "The number of molecules in 0.5 mole of CO₂ is:",
    options: ["3.011 × 10²³", "6.022 × 10²³", "1.204 × 10²⁴", "3.011 × 10²²"],
    answer: "3.011 × 10²³",
    solution: "Molecules = moles × Nₐ = 0.5 × 6.022 × 10²³ = 3.011 × 10²³.",
  },

  // --- Class 11 Maths: Quadratics ---
  {
    id: "q-11-quad-1",
    chapterId: "11-maths-quadratic",
    classId: "11",
    subjectId: "maths",
    type: "numeric",
    difficulty: "medium",
    prompt: "For x² − 5x + 6 = 0, what is the sum of the roots?",
    answer: "5",
    solution:
      "For ax² + bx + c = 0, sum of roots = −b/a = −(−5)/1 = 5. (The roots are 2 and 3.)",
  },
  {
    id: "q-11-quad-2",
    chapterId: "11-maths-quadratic",
    classId: "11",
    subjectId: "maths",
    type: "mcq",
    difficulty: "hard",
    prompt: "The roots of x² + 1 = 0 are:",
    options: ["±1", "±i", "0", "no roots"],
    answer: "±i",
    solution: "x² = −1 → x = ±√(−1) = ±i, the imaginary unit.",
  },

  // --- Class 11 Biology: Cell ---
  {
    id: "q-11-cell-1",
    chapterId: "11-biology-cell",
    classId: "11",
    subjectId: "biology",
    type: "mcq",
    difficulty: "easy",
    prompt: "The 'powerhouse of the cell' is the:",
    options: ["nucleus", "ribosome", "mitochondrion", "lysosome"],
    answer: "mitochondrion",
    solution:
      "Mitochondria carry out aerobic respiration, producing most of the cell's ATP — hence the powerhouse.",
  },
  {
    id: "q-11-cell-2",
    chapterId: "11-biology-cell",
    classId: "11",
    subjectId: "biology",
    type: "mcq",
    difficulty: "medium",
    prompt: "Which feature is absent in a prokaryotic cell?",
    options: ["cell membrane", "ribosomes", "membrane-bound nucleus", "cytoplasm"],
    answer: "membrane-bound nucleus",
    solution:
      "Prokaryotes lack a membrane-bound nucleus and membrane-bound organelles; their DNA lies free in the cytoplasm.",
  },

  // --- Class 12 Physics: Current Electricity ---
  {
    id: "q-12-cur-1",
    chapterId: "12-physics-current-electricity",
    classId: "12",
    subjectId: "physics",
    type: "numeric",
    difficulty: "medium",
    prompt: "A 12 V battery drives current through a 4 Ω resistor. Find the current (A).",
    answer: "3",
    solution: "Ohm's law: I = V / R = 12 / 4 = 3 A.",
  },
  {
    id: "q-12-cur-2",
    chapterId: "12-physics-current-electricity",
    classId: "12",
    subjectId: "physics",
    type: "numeric",
    difficulty: "hard",
    prompt: "Two 6 Ω resistors are connected in parallel. What is the equivalent resistance (Ω)?",
    answer: "3",
    solution: "1/R = 1/6 + 1/6 = 2/6 → R = 3 Ω.",
  },

  // --- Class 12 Chemistry: Electrochemistry ---
  {
    id: "q-12-echem-1",
    chapterId: "12-chemistry-electrochemistry",
    classId: "12",
    subjectId: "chemistry",
    type: "mcq",
    difficulty: "medium",
    prompt: "In a galvanic cell, oxidation occurs at the:",
    options: ["cathode", "anode", "salt bridge", "voltmeter"],
    answer: "anode",
    solution:
      "By definition oxidation always occurs at the anode (negative terminal of a galvanic cell); reduction occurs at the cathode.",
  },
  {
    id: "q-12-echem-2",
    chapterId: "12-chemistry-electrochemistry",
    classId: "12",
    subjectId: "chemistry",
    type: "mcq",
    difficulty: "hard",
    prompt: "Standard hydrogen electrode is assigned a potential of:",
    options: ["+1.0 V", "0.00 V", "−1.0 V", "+0.76 V"],
    answer: "0.00 V",
    solution:
      "The SHE is the reference electrode, defined to have a standard electrode potential of exactly 0.00 V.",
  },

  // --- Class 12 Biology: Genetics ---
  {
    id: "q-12-gen-1",
    chapterId: "12-biology-genetics",
    classId: "12",
    subjectId: "biology",
    type: "mcq",
    difficulty: "medium",
    prompt:
      "In a monohybrid cross (Tt × Tt), the expected phenotypic ratio is:",
    options: ["1 : 1", "3 : 1", "9 : 3 : 3 : 1", "1 : 2 : 1"],
    answer: "3 : 1",
    solution:
      "Tt × Tt gives 1 TT : 2 Tt : 1 tt → genotypic 1:2:1, but phenotypically 3 dominant : 1 recessive.",
  },
  {
    id: "q-12-gen-2",
    chapterId: "12-biology-genetics",
    classId: "12",
    subjectId: "biology",
    type: "mcq",
    difficulty: "hard",
    prompt: "A dihybrid cross between two heterozygotes (RrYy × RrYy) gives a phenotypic ratio of:",
    options: ["3 : 1", "1 : 1 : 1 : 1", "9 : 3 : 3 : 1", "1 : 2 : 1"],
    answer: "9 : 3 : 3 : 1",
    solution:
      "Independent assortment of two gene pairs in a dihybrid cross yields the classic 9 : 3 : 3 : 1 phenotypic ratio.",
  },
  ...C6_MATH_QUESTIONS,
  ...C6_SCIENCE_QUESTIONS,
];

// Starter "paper sets" built from the seed questions, so the Papers feature
// works offline. Real previous-year / sample papers are added via Admin → Papers.
export const PAPERS: Paper[] = [
  {
    id: "paper-9-physics-motion-sample",
    name: "Class 9 Physics — Motion (Sample)",
    exam: "foundation",
    classId: "9",
    subjectId: "physics",
    durationSec: 10 * 60,
    questionIds: ["q-9-mot-1", "q-9-mot-2"],
  },
  {
    id: "paper-foundation-mixed-1",
    name: "Foundation Mixed — Quick Test",
    exam: "foundation",
    durationSec: 15 * 60,
    questionIds: ["q-8-fp-1", "q-8-fp-2", "q-9-am-1", "q-9-am-2", "q-10-light-1"],
  },
];
