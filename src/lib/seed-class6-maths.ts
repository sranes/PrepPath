import type { Chapter, Question } from "./types";

// ---------------------------------------------------------------------------
// CLASS 6 MATHS — full chapter set with lessons.
// A merged, comprehensive coverage of the current NCERT "Ganita Prakash"
// (2025–26) and the classic NCERT Class 6 Maths concepts. Each chapter teaches
// the concepts (lesson) before its practice questions. The Integers chapter
// lives in seed.ts; everything else is here. Spread into CHAPTERS / QUESTIONS
// by seed.ts.
// ---------------------------------------------------------------------------

const C6 = { classId: "6", subjectId: "maths" } as const;

export const C6_MATH_CHAPTERS: Chapter[] = [
  {
    ...C6,
    id: "6-maths-knowing-our-numbers",
    title: "Knowing Our Numbers",
    blurb: "Place value, large numbers, comparing, estimation and Roman numerals.",
    ncertRef: "NCERT Class 6 Maths — Knowing Our Numbers",
    lesson: [
      { kind: "heading", text: "Comparing numbers" },
      {
        kind: "para",
        text: "To compare two numbers, first count their digits — the number with more digits is greater. If they have the same number of digits, compare from the leftmost (highest place value) digit.",
      },
      { kind: "heading", text: "Place value" },
      {
        kind: "para",
        text: "In the Indian system, places go ones, tens, hundreds, thousands, ten-thousands, lakhs, ten-lakhs, crores. In the International system they go ones, tens, hundreds, thousands, then millions.",
      },
      {
        kind: "example",
        problem: "What is the place value of 7 in 4,73,521?",
        solution: "7 is in the ten-thousands place, so its place value is 7 × 10,000 = 70,000.",
      },
      { kind: "heading", text: "Estimation (rounding)" },
      {
        kind: "para",
        text: "Estimating means rounding to the nearest 10, 100 or 1000 to get a quick, approximate answer. Look at the digit to the right of the rounding place: 5 or more rounds up, less than 5 rounds down.",
      },
      { kind: "tip", text: "Use commas to group digits — it makes large numbers far easier to read." },
      { kind: "heading", text: "Roman numerals" },
      {
        kind: "list",
        items: [
          "I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000.",
          "A smaller symbol AFTER a larger one adds (VI = 6); BEFORE a larger one subtracts (IV = 4).",
          "A symbol is never repeated more than three times.",
        ],
      },
    ],
  },
  {
    ...C6,
    id: "6-maths-whole-numbers",
    title: "Whole Numbers",
    blurb: "The number line, successor/predecessor, and properties of operations.",
    ncertRef: "NCERT Class 6 Maths — Whole Numbers",
    lesson: [
      { kind: "heading", text: "Natural and whole numbers" },
      {
        kind: "para",
        text: "Counting numbers 1, 2, 3, … are natural numbers. Adding 0 to them gives the whole numbers: 0, 1, 2, 3, … Every whole number has a successor (the next one); every whole number except 0 has a predecessor (the one before).",
      },
      { kind: "heading", text: "The number line" },
      {
        kind: "para",
        text: "On a number line, addition means jumping to the right and subtraction means jumping to the left. Multiplication is repeated jumps of equal size.",
      },
      { kind: "heading", text: "Properties of operations" },
      {
        kind: "list",
        items: [
          "Commutative: order doesn't matter for + and × (a + b = b + a; a × b = b × a).",
          "Associative: grouping doesn't matter for + and × .",
          "Distributive: a × (b + c) = a × b + a × c.",
          "Identity: 0 is the additive identity (a + 0 = a); 1 is the multiplicative identity (a × 1 = a).",
        ],
      },
      { kind: "tip", text: "Division by 0 is not defined — you cannot share something among zero groups." },
    ],
  },
  {
    ...C6,
    id: "6-maths-patterns",
    title: "Patterns in Mathematics",
    blurb: "Number sequences, triangular and square numbers, and shape patterns.",
    ncertRef: "NCERT Class 6 Maths (Ganita Prakash) — Patterns in Mathematics",
    lesson: [
      { kind: "heading", text: "Spotting a pattern" },
      {
        kind: "para",
        text: "A pattern is a rule that tells you how a sequence continues. Find the rule by checking what is added, subtracted or multiplied each step.",
      },
      {
        kind: "example",
        problem: "Find the next number: 2, 5, 8, 11, …",
        solution: "Each term increases by 3, so the next is 11 + 3 = 14.",
      },
      { kind: "heading", text: "Special number patterns" },
      {
        kind: "list",
        items: [
          "Triangular numbers: 1, 3, 6, 10, 15 … (dots that form triangles; each adds the next counting number).",
          "Square numbers: 1, 4, 9, 16, 25 … (n × n).",
          "Odd numbers add up to square numbers: 1 + 3 = 4, 1 + 3 + 5 = 9.",
        ],
      },
      { kind: "tip", text: "When stuck, write the differences between terms — the differences often reveal the rule." },
    ],
  },
  {
    ...C6,
    id: "6-maths-number-play",
    title: "Number Play",
    blurb: "Playing with digits — palindromes, digit sums and number puzzles.",
    ncertRef: "NCERT Class 6 Maths (Ganita Prakash) — Number Play",
    lesson: [
      { kind: "heading", text: "Reading numbers in fun ways" },
      {
        kind: "para",
        text: "Numbers hide many patterns. A palindrome reads the same forwards and backwards, like 121 or 4554. The digit sum is found by adding all the digits (the digit sum of 142 is 1 + 4 + 2 = 7).",
      },
      { kind: "heading", text: "Why digit sums are useful" },
      {
        kind: "para",
        text: "Digit sums help check divisibility: if the digit sum is divisible by 3, the number is divisible by 3; if by 9, the number is divisible by 9.",
      },
      {
        kind: "example",
        problem: "Is 234 divisible by 3?",
        solution: "Digit sum = 2 + 3 + 4 = 9, which is divisible by 3, so yes — 234 is divisible by 3.",
      },
      { kind: "tip", text: "Make the largest number from given digits by placing the biggest digit on the left." },
    ],
  },
  {
    ...C6,
    id: "6-maths-playing-with-numbers",
    title: "Playing with Numbers (Prime Time)",
    blurb: "Factors, multiples, primes, divisibility rules, HCF and LCM.",
    ncertRef: "NCERT Class 6 Maths — Playing with Numbers / Prime Time",
    lesson: [
      { kind: "heading", text: "Factors and multiples" },
      {
        kind: "para",
        text: "A factor of a number divides it exactly (no remainder). A multiple is the result of multiplying a number by 1, 2, 3, … For example, factors of 12 are 1, 2, 3, 4, 6, 12; multiples of 5 are 5, 10, 15, 20 …",
      },
      { kind: "heading", text: "Prime and composite numbers" },
      {
        kind: "list",
        items: [
          "A prime number has exactly two factors: 1 and itself (2, 3, 5, 7, 11 …).",
          "A composite number has more than two factors (4, 6, 8, 9 …).",
          "1 is neither prime nor composite. 2 is the only even prime.",
        ],
      },
      { kind: "heading", text: "Divisibility rules" },
      {
        kind: "list",
        items: [
          "By 2: last digit is even (0,2,4,6,8).",
          "By 3: digit sum divisible by 3.",
          "By 5: last digit is 0 or 5.",
          "By 9: digit sum divisible by 9.",
          "By 10: last digit is 0.",
        ],
      },
      { kind: "heading", text: "HCF and LCM" },
      {
        kind: "para",
        text: "The HCF (Highest Common Factor) is the largest number that divides two numbers. The LCM (Lowest Common Multiple) is the smallest number that both divide into.",
      },
      {
        kind: "example",
        problem: "Find the HCF and LCM of 12 and 18.",
        solution:
          "12 = 2×2×3, 18 = 2×3×3. HCF = common factors = 2×3 = 6. LCM = 2×2×3×3 = 36.",
      },
    ],
  },
  {
    ...C6,
    id: "6-maths-basic-geometrical-ideas",
    title: "Basic Geometrical Ideas",
    blurb: "Points, lines, rays, curves, polygons and parts of a circle.",
    ncertRef: "NCERT Class 6 Maths — Basic Geometrical Ideas",
    lesson: [
      { kind: "heading", text: "The building blocks" },
      {
        kind: "list",
        items: [
          "Point: an exact location, with no size.",
          "Line segment: the shortest path between two points (has two endpoints).",
          "Ray: starts at a point and goes on forever in one direction.",
          "Line: extends forever in both directions.",
        ],
      },
      { kind: "heading", text: "Lines that meet — or don't" },
      {
        kind: "para",
        text: "Two lines that cross are intersecting lines; the point where they meet is the point of intersection. Lines that never meet, staying the same distance apart, are parallel lines.",
      },
      { kind: "heading", text: "Curves and polygons" },
      {
        kind: "para",
        text: "A closed figure made only of line segments is a polygon. Its segments are sides, the corners are vertices, and the turn at each corner is an angle. A triangle has 3 sides, a quadrilateral 4.",
      },
      { kind: "heading", text: "Parts of a circle" },
      {
        kind: "list",
        items: [
          "Centre: the middle point.",
          "Radius: centre to any point on the circle.",
          "Diameter: across the circle through the centre (= 2 × radius).",
          "Chord: a segment joining two points on the circle.",
        ],
      },
    ],
  },
  {
    ...C6,
    id: "6-maths-lines-and-angles",
    title: "Lines and Angles",
    blurb: "Types of angles, measuring with a protractor, and angle pairs.",
    ncertRef: "NCERT Class 6 Maths (Ganita Prakash) — Lines and Angles",
    lesson: [
      { kind: "heading", text: "What is an angle?" },
      {
        kind: "para",
        text: "An angle is formed when two rays meet at a common endpoint (the vertex). Angles are measured in degrees (°) using a protractor.",
      },
      { kind: "heading", text: "Types of angles" },
      {
        kind: "list",
        items: [
          "Acute: less than 90°.",
          "Right: exactly 90°.",
          "Obtuse: between 90° and 180°.",
          "Straight: exactly 180°.",
          "Reflex: between 180° and 360°.",
        ],
      },
      { kind: "heading", text: "Pairs of angles" },
      {
        kind: "list",
        items: [
          "Complementary angles add up to 90°.",
          "Supplementary angles add up to 180°.",
        ],
      },
      {
        kind: "example",
        problem: "An angle is 35°. What is its complement?",
        solution: "Complement = 90° − 35° = 55°.",
      },
    ],
  },
  {
    ...C6,
    id: "6-maths-elementary-shapes",
    title: "Understanding Elementary Shapes",
    blurb: "Triangles, quadrilaterals and 3-D solids (faces, edges, vertices).",
    ncertRef: "NCERT Class 6 Maths — Understanding Elementary Shapes",
    lesson: [
      { kind: "heading", text: "Triangles" },
      {
        kind: "list",
        items: [
          "By sides: equilateral (all equal), isosceles (two equal), scalene (all different).",
          "By angles: acute, right, or obtuse triangle.",
          "The three angles of any triangle always add up to 180°.",
        ],
      },
      { kind: "heading", text: "Quadrilaterals" },
      {
        kind: "para",
        text: "A four-sided figure. Special ones include the square, rectangle, parallelogram, rhombus and trapezium. The angles of a quadrilateral add up to 360°.",
      },
      { kind: "heading", text: "3-D shapes" },
      {
        kind: "para",
        text: "Solids have faces (flat surfaces), edges (where faces meet) and vertices (corners). A cube has 6 faces, 12 edges and 8 vertices.",
      },
      { kind: "tip", text: "A cuboid is like a stretched cube — also 6 faces, 12 edges, 8 vertices." },
    ],
  },
  {
    ...C6,
    id: "6-maths-fractions",
    title: "Fractions",
    blurb: "Types of fractions, equivalent fractions, comparing and operations.",
    ncertRef: "NCERT Class 6 Maths — Fractions",
    lesson: [
      { kind: "heading", text: "What a fraction means" },
      {
        kind: "para",
        text: "A fraction shows part of a whole. In 3/4, the bottom number (denominator) is the number of equal parts the whole is split into, and the top (numerator) is how many we take.",
      },
      { kind: "heading", text: "Types of fractions" },
      {
        kind: "list",
        items: [
          "Proper: numerator < denominator (e.g. 3/5).",
          "Improper: numerator ≥ denominator (e.g. 7/4).",
          "Mixed: a whole number with a proper fraction (e.g. 1¾).",
        ],
      },
      { kind: "heading", text: "Equivalent fractions" },
      {
        kind: "para",
        text: "Multiplying or dividing the numerator and denominator by the same number gives an equivalent fraction: 1/2 = 2/4 = 3/6. Dividing to the smallest form gives the simplest (lowest) terms.",
      },
      { kind: "heading", text: "Adding and subtracting" },
      {
        kind: "para",
        text: "With the same denominator, just add/subtract the numerators. With different denominators, first rewrite them with a common denominator (the LCM of the denominators).",
      },
      {
        kind: "example",
        problem: "Add 1/4 + 2/4.",
        solution: "Same denominator: add numerators → (1 + 2)/4 = 3/4.",
      },
    ],
  },
  {
    ...C6,
    id: "6-maths-decimals",
    title: "Decimals",
    blurb: "Tenths and hundredths, place value, and converting with fractions.",
    ncertRef: "NCERT Class 6 Maths — Decimals",
    lesson: [
      { kind: "heading", text: "Decimal place value" },
      {
        kind: "para",
        text: "A decimal point separates the whole part from the fractional part. The first digit after the point is tenths (1/10), the second is hundredths (1/100), and so on.",
      },
      { kind: "heading", text: "Fractions ↔ decimals" },
      {
        kind: "list",
        items: [
          "1/10 = 0.1, 1/100 = 0.01.",
          "To write a fraction with denominator 10/100 as a decimal, just place the digits after the point: 7/10 = 0.7, 23/100 = 0.23.",
        ],
      },
      { kind: "heading", text: "Adding and subtracting decimals" },
      {
        kind: "para",
        text: "Line up the decimal points, then add or subtract as usual. Money and lengths use decimals every day (₹12.50, 1.75 m).",
      },
      {
        kind: "example",
        problem: "Write 3/4 as a decimal.",
        solution: "3/4 = 75/100 = 0.75.",
      },
    ],
  },
  {
    ...C6,
    id: "6-maths-data-handling",
    title: "Data Handling and Presentation",
    blurb: "Collecting data, tally marks, pictographs and bar graphs.",
    ncertRef: "NCERT Class 6 Maths — Data Handling and Presentation",
    lesson: [
      { kind: "heading", text: "What is data?" },
      {
        kind: "para",
        text: "Data is a collection of information, usually numbers. To make it useful we organise and picture it so patterns are easy to see.",
      },
      { kind: "heading", text: "Ways to show data" },
      {
        kind: "list",
        items: [
          "Tally marks: group counts in fives (four lines crossed by a fifth).",
          "Pictograph: uses a symbol to stand for a number of items.",
          "Bar graph: bars whose heights show the values.",
        ],
      },
      { kind: "tip", text: "Always read the key of a pictograph — one picture might stand for 5 or 10 items, not 1." },
      {
        kind: "example",
        problem: "In a pictograph, ⭐ = 10 books. How many books do 4 stars show?",
        solution: "4 × 10 = 40 books.",
      },
    ],
  },
  {
    ...C6,
    id: "6-maths-mensuration",
    title: "Perimeter and Area (Mensuration)",
    blurb: "Perimeter and area of rectangles, squares and simple shapes.",
    ncertRef: "NCERT Class 6 Maths — Perimeter and Area / Mensuration",
    lesson: [
      { kind: "heading", text: "Perimeter" },
      {
        kind: "para",
        text: "Perimeter is the total distance around the boundary of a flat shape — add up all the side lengths.",
      },
      { kind: "formula", text: "Perimeter of rectangle = 2 × (length + breadth)    Perimeter of square = 4 × side" },
      { kind: "heading", text: "Area" },
      {
        kind: "para",
        text: "Area is the amount of surface a shape covers, measured in square units. For rectangles and squares we multiply side lengths.",
      },
      { kind: "formula", text: "Area of rectangle = length × breadth    Area of square = side × side" },
      {
        kind: "example",
        problem: "A rectangle is 8 cm long and 3 cm wide. Find its area.",
        solution: "Area = length × breadth = 8 × 3 = 24 cm².",
      },
      { kind: "tip", text: "Perimeter is a length (cm, m); area is a square measure (cm², m²). Don't mix the units!" },
    ],
  },
  {
    ...C6,
    id: "6-maths-algebra",
    title: "Algebra",
    blurb: "Variables, expressions and solving simple equations.",
    ncertRef: "NCERT Class 6 Maths — Algebra",
    lesson: [
      { kind: "heading", text: "Letters for numbers" },
      {
        kind: "para",
        text: "In algebra a letter (a variable) such as x or n stands for an unknown or changing number. A fixed number is a constant.",
      },
      { kind: "heading", text: "Expressions" },
      {
        kind: "para",
        text: "Combining variables and numbers with +, −, × gives an expression, like 2n + 3. The value of an expression depends on the value of the variable.",
      },
      {
        kind: "example",
        problem: "Find the value of 2n + 3 when n = 4.",
        solution: "2 × 4 + 3 = 8 + 3 = 11.",
      },
      { kind: "heading", text: "Equations" },
      {
        kind: "para",
        text: "An equation says two expressions are equal, like x + 5 = 9. Solving it means finding the value of the variable that makes it true (here x = 4).",
      },
    ],
  },
  {
    ...C6,
    id: "6-maths-ratio-proportion",
    title: "Ratio and Proportion",
    blurb: "Comparing quantities by ratio, proportion and the unitary method.",
    ncertRef: "NCERT Class 6 Maths — Ratio and Proportion",
    lesson: [
      { kind: "heading", text: "Ratio" },
      {
        kind: "para",
        text: "A ratio compares two quantities of the same kind by division, written a : b. Like a fraction, it can be reduced to simplest form by dividing both parts by their HCF.",
      },
      {
        kind: "example",
        problem: "Write the ratio 8 : 12 in simplest form.",
        solution: "HCF of 8 and 12 is 4, so 8 : 12 = 2 : 3.",
      },
      { kind: "heading", text: "Proportion" },
      {
        kind: "para",
        text: "If two ratios are equal, the four numbers are in proportion: 2 : 3 = 8 : 12. ",
      },
      { kind: "heading", text: "Unitary method" },
      {
        kind: "para",
        text: "First find the value of one unit, then multiply for the number you need.",
      },
      {
        kind: "example",
        problem: "If 5 pens cost ₹40, what do 8 pens cost?",
        solution: "1 pen = 40 ÷ 5 = ₹8, so 8 pens = 8 × 8 = ₹64.",
      },
    ],
  },
  {
    ...C6,
    id: "6-maths-symmetry",
    title: "Symmetry",
    blurb: "Lines of symmetry and reflection in shapes and letters.",
    ncertRef: "NCERT Class 6 Maths — Symmetry",
    lesson: [
      { kind: "heading", text: "Line of symmetry" },
      {
        kind: "para",
        text: "A figure has a line of symmetry if a line can fold it into two halves that match exactly. That fold line is also called the mirror line, because each half is the reflection of the other.",
      },
      { kind: "heading", text: "How many lines?" },
      {
        kind: "list",
        items: [
          "A rectangle has 2 lines of symmetry.",
          "A square has 4.",
          "An equilateral triangle has 3.",
          "A circle has infinitely many.",
          "The letter S has none.",
        ],
      },
      { kind: "tip", text: "Test symmetry by imagining a mirror on the line — if the reflection looks identical, it's a line of symmetry." },
    ],
  },
  {
    ...C6,
    id: "6-maths-practical-geometry",
    title: "Practical Geometry (Constructions)",
    blurb: "Using ruler, compass and protractor to draw accurate figures.",
    ncertRef: "NCERT Class 6 Maths — Practical Geometry / Playing with Constructions",
    lesson: [
      { kind: "heading", text: "The tools" },
      {
        kind: "list",
        items: [
          "Ruler (straightedge): to draw and measure straight segments.",
          "Compass: to draw circles and arcs, and to copy lengths.",
          "Protractor: to measure and draw angles.",
          "Set squares: to draw perpendicular and parallel lines.",
        ],
      },
      { kind: "heading", text: "Drawing a circle" },
      {
        kind: "para",
        text: "Open the compass to the required radius, place the sharp point at the centre, and turn it once all the way around.",
      },
      { kind: "heading", text: "Copying a length" },
      {
        kind: "para",
        text: "Set the compass to the length of a segment, then mark the same opening on a new line — this copies the length without re-measuring.",
      },
      { kind: "tip", text: "Keep your pencil sharp and don't change the compass opening mid-construction — accuracy depends on it." },
    ],
  },
];

export const C6_MATH_QUESTIONS: Question[] = [
  // Knowing Our Numbers
  {
    id: "q-6m-kon-1",
    chapterId: "6-maths-knowing-our-numbers",
    ...C6,
    type: "numeric",
    difficulty: "easy",
    prompt: "What is the place value of 7 in 4,73,521?",
    answer: "70000",
    solution: "7 is in the ten-thousands place, so its place value is 7 × 10,000 = 70,000.",
  },
  {
    id: "q-6m-kon-2",
    chapterId: "6-maths-knowing-our-numbers",
    ...C6,
    type: "mcq",
    difficulty: "easy",
    prompt: "Which number is the greatest?",
    options: ["9,999", "10,001", "9,990", "8,888"],
    answer: "10,001",
    solution: "10,001 has 5 digits while the others have 4, so it is the greatest.",
  },
  {
    id: "q-6m-kon-3",
    chapterId: "6-maths-knowing-our-numbers",
    ...C6,
    type: "mcq",
    difficulty: "medium",
    prompt: "The Roman numeral IX stands for:",
    options: ["11", "9", "6", "4"],
    answer: "9",
    solution: "I before X means 10 − 1 = 9.",
  },

  // Whole Numbers
  {
    id: "q-6m-wn-1",
    chapterId: "6-maths-whole-numbers",
    ...C6,
    type: "numeric",
    difficulty: "easy",
    prompt: "What is the successor of 4,099?",
    answer: "4100",
    solution: "The successor is the next whole number: 4,099 + 1 = 4,100.",
  },
  {
    id: "q-6m-wn-2",
    chapterId: "6-maths-whole-numbers",
    ...C6,
    type: "mcq",
    difficulty: "medium",
    prompt: "Which property is shown by 3 × (4 + 5) = 3 × 4 + 3 × 5?",
    options: ["commutative", "associative", "distributive", "identity"],
    answer: "distributive",
    solution: "Multiplication distributing over addition is the distributive property.",
  },
  {
    id: "q-6m-wn-3",
    chapterId: "6-maths-whole-numbers",
    ...C6,
    type: "mcq",
    difficulty: "easy",
    prompt: "The smallest whole number is:",
    options: ["1", "0", "−1", "there is none"],
    answer: "0",
    solution: "Whole numbers start at 0, so 0 is the smallest.",
  },

  // Patterns
  {
    id: "q-6m-pat-1",
    chapterId: "6-maths-patterns",
    ...C6,
    type: "numeric",
    difficulty: "easy",
    prompt: "Find the next number: 2, 5, 8, 11, ?",
    answer: "14",
    solution: "Each term increases by 3, so 11 + 3 = 14.",
  },
  {
    id: "q-6m-pat-2",
    chapterId: "6-maths-patterns",
    ...C6,
    type: "mcq",
    difficulty: "medium",
    prompt: "Which list shows the square numbers?",
    options: ["1, 3, 6, 10", "1, 4, 9, 16", "2, 4, 6, 8", "1, 2, 4, 8"],
    answer: "1, 4, 9, 16",
    solution: "Square numbers are n × n: 1, 4, 9, 16, 25 …",
  },

  // Number Play
  {
    id: "q-6m-np-1",
    chapterId: "6-maths-number-play",
    ...C6,
    type: "mcq",
    difficulty: "easy",
    prompt: "Which of these is a palindrome?",
    options: ["123", "454", "210", "678"],
    answer: "454",
    solution: "454 reads the same forwards and backwards.",
  },
  {
    id: "q-6m-np-2",
    chapterId: "6-maths-number-play",
    ...C6,
    type: "numeric",
    difficulty: "easy",
    prompt: "What is the digit sum of 142?",
    answer: "7",
    solution: "1 + 4 + 2 = 7.",
  },

  // Playing with Numbers / Prime Time
  {
    id: "q-6m-pwn-1",
    chapterId: "6-maths-playing-with-numbers",
    ...C6,
    type: "mcq",
    difficulty: "easy",
    prompt: "Which number is prime?",
    options: ["9", "15", "17", "21"],
    answer: "17",
    solution: "17 has only two factors, 1 and 17, so it is prime.",
  },
  {
    id: "q-6m-pwn-2",
    chapterId: "6-maths-playing-with-numbers",
    ...C6,
    type: "numeric",
    difficulty: "medium",
    prompt: "What is the HCF of 12 and 18?",
    answer: "6",
    solution: "12 = 2×2×3, 18 = 2×3×3; common factors 2×3 = 6.",
  },
  {
    id: "q-6m-pwn-3",
    chapterId: "6-maths-playing-with-numbers",
    ...C6,
    type: "numeric",
    difficulty: "hard",
    prompt: "What is the LCM of 4 and 6?",
    answer: "12",
    solution: "Multiples of 4: 4,8,12; of 6: 6,12. The smallest common multiple is 12.",
  },
  {
    id: "q-6m-pwn-4",
    chapterId: "6-maths-playing-with-numbers",
    ...C6,
    type: "mcq",
    difficulty: "medium",
    prompt: "Which number is divisible by 3?",
    options: ["124", "238", "234", "100"],
    answer: "234",
    solution: "Digit sum of 234 = 9, which is divisible by 3.",
  },

  // Basic Geometrical Ideas
  {
    id: "q-6m-bgi-1",
    chapterId: "6-maths-basic-geometrical-ideas",
    ...C6,
    type: "mcq",
    difficulty: "easy",
    prompt: "A part of a line with two endpoints is called a:",
    options: ["ray", "line segment", "point", "plane"],
    answer: "line segment",
    solution: "A line segment has two endpoints; a ray has one and a line has none.",
  },
  {
    id: "q-6m-bgi-2",
    chapterId: "6-maths-basic-geometrical-ideas",
    ...C6,
    type: "mcq",
    difficulty: "medium",
    prompt: "The longest chord of a circle is the:",
    options: ["radius", "arc", "diameter", "tangent"],
    answer: "diameter",
    solution: "The diameter passes through the centre and is the longest chord (= 2 × radius).",
  },

  // Lines and Angles
  {
    id: "q-6m-la-1",
    chapterId: "6-maths-lines-and-angles",
    ...C6,
    type: "mcq",
    difficulty: "easy",
    prompt: "An angle of 120° is:",
    options: ["acute", "right", "obtuse", "straight"],
    answer: "obtuse",
    solution: "Between 90° and 180° is obtuse.",
  },
  {
    id: "q-6m-la-2",
    chapterId: "6-maths-lines-and-angles",
    ...C6,
    type: "numeric",
    difficulty: "medium",
    prompt: "What is the supplement of 110° (in degrees)?",
    answer: "70",
    solution: "Supplementary angles add to 180°, so 180 − 110 = 70.",
  },

  // Understanding Elementary Shapes
  {
    id: "q-6m-es-1",
    chapterId: "6-maths-elementary-shapes",
    ...C6,
    type: "numeric",
    difficulty: "easy",
    prompt: "How many edges does a cube have?",
    answer: "12",
    solution: "A cube has 6 faces, 12 edges and 8 vertices.",
  },
  {
    id: "q-6m-es-2",
    chapterId: "6-maths-elementary-shapes",
    ...C6,
    type: "mcq",
    difficulty: "medium",
    prompt: "A triangle with all three sides equal is called:",
    options: ["scalene", "isosceles", "equilateral", "right"],
    answer: "equilateral",
    solution: "Equilateral means all sides (and angles) are equal.",
  },

  // Fractions
  {
    id: "q-6m-fr-1",
    chapterId: "6-maths-fractions",
    ...C6,
    type: "mcq",
    difficulty: "easy",
    prompt: "Which fraction is equivalent to 1/2?",
    options: ["2/3", "3/6", "2/5", "4/6"],
    answer: "3/6",
    solution: "3/6 = 1/2 because both numerator and denominator of 1/2 are multiplied by 3.",
  },
  {
    id: "q-6m-fr-2",
    chapterId: "6-maths-fractions",
    ...C6,
    type: "mcq",
    difficulty: "easy",
    prompt: "7/4 is an example of a/an:",
    options: ["proper fraction", "improper fraction", "mixed number", "whole number"],
    answer: "improper fraction",
    solution: "The numerator (7) is greater than the denominator (4), so it is improper.",
  },
  {
    id: "q-6m-fr-3",
    chapterId: "6-maths-fractions",
    ...C6,
    type: "numeric",
    difficulty: "medium",
    prompt: "Add 1/5 + 3/5 and give the numerator of the answer (the answer is _/5).",
    answer: "4",
    solution: "Same denominator: (1 + 3)/5 = 4/5, so the numerator is 4.",
  },

  // Decimals
  {
    id: "q-6m-dec-1",
    chapterId: "6-maths-decimals",
    ...C6,
    type: "mcq",
    difficulty: "easy",
    prompt: "Write 3/4 as a decimal.",
    options: ["0.34", "0.75", "0.43", "0.50"],
    answer: "0.75",
    solution: "3/4 = 75/100 = 0.75.",
  },
  {
    id: "q-6m-dec-2",
    chapterId: "6-maths-decimals",
    ...C6,
    type: "numeric",
    difficulty: "medium",
    prompt: "Add 2.5 + 1.75",
    answer: "4.25",
    solution: "Line up the points: 2.50 + 1.75 = 4.25.",
  },

  // Data Handling
  {
    id: "q-6m-dh-1",
    chapterId: "6-maths-data-handling",
    ...C6,
    type: "numeric",
    difficulty: "easy",
    prompt: "In a pictograph, ⭐ = 10 books. How many books do 4 stars represent?",
    answer: "40",
    solution: "4 × 10 = 40 books.",
  },
  {
    id: "q-6m-dh-2",
    chapterId: "6-maths-data-handling",
    ...C6,
    type: "numeric",
    difficulty: "easy",
    prompt: "How many items does one group of tally marks (||||̸ ) represent?",
    answer: "5",
    solution: "A crossed group of tally marks stands for 5.",
  },

  // Mensuration
  {
    id: "q-6m-men-1",
    chapterId: "6-maths-mensuration",
    ...C6,
    type: "numeric",
    difficulty: "easy",
    prompt: "Find the area of a rectangle 8 cm long and 3 cm wide (in cm²).",
    answer: "24",
    solution: "Area = length × breadth = 8 × 3 = 24 cm².",
  },
  {
    id: "q-6m-men-2",
    chapterId: "6-maths-mensuration",
    ...C6,
    type: "numeric",
    difficulty: "medium",
    prompt: "Find the perimeter of a square of side 6 cm (in cm).",
    answer: "24",
    solution: "Perimeter of a square = 4 × side = 4 × 6 = 24 cm.",
  },

  // Algebra
  {
    id: "q-6m-alg-1",
    chapterId: "6-maths-algebra",
    ...C6,
    type: "numeric",
    difficulty: "easy",
    prompt: "Find the value of 2n + 3 when n = 4.",
    answer: "11",
    solution: "2 × 4 + 3 = 8 + 3 = 11.",
  },
  {
    id: "q-6m-alg-2",
    chapterId: "6-maths-algebra",
    ...C6,
    type: "numeric",
    difficulty: "medium",
    prompt: "Solve for x: x + 5 = 9.",
    answer: "4",
    solution: "Subtract 5 from both sides: x = 9 − 5 = 4.",
  },

  // Ratio and Proportion
  {
    id: "q-6m-rp-1",
    chapterId: "6-maths-ratio-proportion",
    ...C6,
    type: "mcq",
    difficulty: "easy",
    prompt: "Write 8 : 12 in simplest form.",
    options: ["2 : 3", "4 : 5", "1 : 2", "3 : 4"],
    answer: "2 : 3",
    solution: "Divide both by their HCF 4: 8 : 12 = 2 : 3.",
  },
  {
    id: "q-6m-rp-2",
    chapterId: "6-maths-ratio-proportion",
    ...C6,
    type: "numeric",
    difficulty: "medium",
    prompt: "If 5 pens cost ₹40, what do 8 pens cost (in ₹)?",
    answer: "64",
    solution: "1 pen = 40 ÷ 5 = ₹8; 8 pens = 8 × 8 = ₹64.",
  },

  // Symmetry
  {
    id: "q-6m-sym-1",
    chapterId: "6-maths-symmetry",
    ...C6,
    type: "numeric",
    difficulty: "easy",
    prompt: "How many lines of symmetry does a square have?",
    answer: "4",
    solution: "A square has 4 lines of symmetry (2 diagonals + 2 through opposite side-midpoints).",
  },
  {
    id: "q-6m-sym-2",
    chapterId: "6-maths-symmetry",
    ...C6,
    type: "mcq",
    difficulty: "medium",
    prompt: "Which letter has NO line of symmetry?",
    options: ["A", "H", "S", "M"],
    answer: "S",
    solution: "S cannot be folded into two matching halves, so it has no line of symmetry.",
  },

  // Practical Geometry
  {
    id: "q-6m-pg-1",
    chapterId: "6-maths-practical-geometry",
    ...C6,
    type: "mcq",
    difficulty: "easy",
    prompt: "Which instrument is used to draw a circle?",
    options: ["ruler", "compass", "protractor", "set square"],
    answer: "compass",
    solution: "A compass draws circles and arcs of a chosen radius.",
  },
  {
    id: "q-6m-pg-2",
    chapterId: "6-maths-practical-geometry",
    ...C6,
    type: "mcq",
    difficulty: "easy",
    prompt: "Which instrument is used to measure an angle?",
    options: ["ruler", "compass", "protractor", "divider"],
    answer: "protractor",
    solution: "A protractor measures angles in degrees.",
  },
];
