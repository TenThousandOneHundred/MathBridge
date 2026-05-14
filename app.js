const rolePages = {
  student: [
    "Dashboard",
    "Homework",
    "Lessons",
    "Practice",
    "Ask for Help",
    "Messages",
    "Progress",
    "Attendance",
    "Formula Sheet",
    "Math Tools",
  ],
  teacher: [
    "Teacher Dashboard",
    "Create Assignment",
    "Question Bank",
    "Upload Lesson",
    "Student Submissions",
    "Class Progress",
    "Attendance",
    "Messages",
    "Announcements",
  ],
  parent: [
    "Parent Dashboard",
    "Homework Status",
    "Progress Report",
    "Attendance",
    "Teacher Messages",
    "Upcoming Tests",
  ],
};

const pageIcons = {
  Dashboard: "DB",
  Homework: "HW",
  Lessons: "LS",
  Practice: "PX",
  "Ask for Help": "?",
  Messages: "MS",
  Progress: "%",
  Attendance: "AT",
  "Formula Sheet": "FS",
  "Math Tools": "TL",
  "Teacher Dashboard": "TD",
  "Create Assignment": "+",
  "Question Bank": "QB",
  "Upload Lesson": "UL",
  "Student Submissions": "SS",
  "Class Progress": "CP",
  Announcements: "AN",
  "Parent Dashboard": "PD",
  "Homework Status": "HS",
  "Progress Report": "PR",
  "Teacher Messages": "TM",
  "Upcoming Tests": "UT",
};

const UNIT_NUMBER_SENSE = "Number Sense";
const UNIT_ALGEBRA = "Algebra";
const UNIT_FINANCIAL = "Financial Literacy";
const UNIT_RATIOS_RATES = "Fractions, Decimals, Percents, Ratios, and Rates";
const UNIT_MEASUREMENT = "Pythagorean Theorem and Measurement";

const grade7QuestionTopics = [
  UNIT_NUMBER_SENSE,
  UNIT_ALGEBRA,
  UNIT_FINANCIAL,
  UNIT_RATIOS_RATES,
  UNIT_MEASUREMENT,
];

const state = {
  role: "student",
  page: "Dashboard",
  auth: {
    checking: true,
    authenticated: false,
    user: null,
    mode: "login",
    email: "",
    password: "",
    signupName: "",
    signupEmail: "",
    signupPassword: "",
    signupRole: "student",
    signupClassName: "Grade 7 Math",
    signupChildName: "",
    error: "",
    submitting: false,
  },
  directory: {
    students: [],
    users: [],
  },
  parent: {
    selectedStudentId: "",
    studentEmail: "",
    notice: "",
  },
  classRoster: {
    classes: [],
    selectedClassId: "",
    draftName: "Grade 7 Math",
    studentIds: [],
    notice: "",
    saving: false,
  },
  work: {
    studentId: "",
    assignments: {},
  },
  parentWork: {
    studentId: "",
    assignments: {},
  },
  workUpload: {
    notice: "",
    assignmentId: "",
  },
  answerDrafts: {},
  answerStatus: {
    assignmentId: "",
    notice: "",
  },
  submitComments: {},
  submissionReview: {
    notice: "",
    grades: {},
    feedback: {},
    aiLoading: "",
    aiRequested: {},
    aiFeedback: { studentId: "", assignmentId: "", draft: "", notice: "", saving: false },
  },
  drawing: {
    assignmentId: "",
    color: "#146b53",
    size: 4,
    status: "",
    pointer: "",
  },
  system: {
    publicUrl: "",
    hosted: false,
    localUrl: "",
    lanEnabled: false,
    lanUrls: [],
  },
  attendance: {
    date: new Date().toISOString().slice(0, 10),
    records: [],
    notes: {},
    notice: "",
  },
  messaging: {
    selected: {
      student: "",
      teacher: "",
      parent: "",
    },
    composeTo: {
      student: "",
      teacher: "",
      parent: "",
    },
    draft: {
      student: "",
      teacher: "",
      parent: "",
    },
    notice: "",
  },
  hintStep: 0,
  selectedTopic: UNIT_NUMBER_SENSE,
  generatedQuestions: [],
  questionBankTopic: UNIT_NUMBER_SENSE,
  questionBankSetIndex: 0,
  practiceAnswers: {},
  practiceResults: {},
  reviewItems: [],
  dailyChallengeDateKey: "",
  dailyChallengeAnswer: "",
  dailyChallengeResult: null,
  calc: "",
  graph: { m: 2, b: -1 },
  converter: { value: 250, from: "cm", to: "m" },
  materialLibrary: [],
  materialDraft: {
    title: "",
    kind: "worksheet",
    link: "",
    status: "",
    submitting: false,
  },
  assignmentLibrary: [],
  assignmentDraftLibrary: [],
  announcementLibrary: [],
  announcementDraft: {
    title: "Test moved to Monday",
    message: "Review lesson posted. Bring your calculator for the practice block.",
    scheduledAt: "",
    notice: "",
    submitting: false,
    savingDraft: false,
  },
  submissions: [],
  draft: {
    className: "Grade 8B",
    classId: "",
    topic: UNIT_ALGEBRA,
    due: "2026-05-15",
    questionText: "",
    bridgeQuestionMode: "text",
    bridgeQuestionPrompt: "",
    bridgeQuestionChoices: "",
    bridgeQuestionAnswers: "",
    lessonVideoLink: "",
    watchLesson: true,
    readNotes: true,
    completeQuestions: true,
    uploadWork: true,
    bridgeSpace: false,
    submitFinal: true,
    materialIds: [],
    notice: "",
    submitting: false,
  },
  teacherSample: "4x + 3 = 19",
  lessonLibrary: [],
  teacherLesson: {
    title: "Introduction to Slope",
    goal: "Understand how to calculate slope from two points.",
    videoLink: "",
    explanation: "Use m = (y2 - y1) / (x2 - x1). Substitute the coordinates, subtract, then divide.",
    example: "Find the slope between (2, 3) and (6, 11).",
    status: "",
    submitting: false,
  },
  helpDraft: "",
  helpNotice: "",
  aiHelp: {
    assignmentId: "",
    questionIndex: 0,
    message: "",
    attempt: "",
    reply: "",
    status: "",
    source: "",
    loading: false,
    threads: {},
  },
  bridgeSpace: {
    assignmentId: "",
    questionIndex: 0,
    tab: "practice",
    working: "",
    notice: "",
  },
  attemptDraft: "I subtracted 6, then got 2x = 12.",
  quizAnswer: "",
};

let lessonPreviewUrl = "";
let workCanvasSession = { drawing: false, lastX: 0, lastY: 0 };

const assignments = [];

const lessons = [
  {
    title: "Solving Two-Step Equations",
    goal: "Use inverse operations to isolate x.",
    video: "6 minute teacher lesson",
    example: "2x + 6 = 18; subtract 6; divide by 2; x = 6",
    practice: "15 questions",
    quiz: "3 question mini quiz",
  },
  {
    title: "Introduction to Slope",
    goal: "Calculate slope from two points.",
    video: "5 minute teacher lesson",
    example: "m = (y2 - y1) / (x2 - x1)",
    practice: "10 slope questions",
    quiz: "1 graphing check",
  },
  {
    title: "Fractions Review",
    goal: "Add and subtract fractions with unlike denominators.",
    video: "8 minute review",
    example: "Find a common denominator before adding.",
    practice: "12 mixed questions",
    quiz: "Error check",
  },
];

const topicScores = [
  { topic: UNIT_NUMBER_SENSE, value: 76, color: "var(--green)" },
  { topic: UNIT_ALGEBRA, value: 68, color: "var(--coral)" },
  { topic: UNIT_FINANCIAL, value: 82, color: "var(--teal)" },
  { topic: UNIT_RATIOS_RATES, value: 74, color: "var(--blue)" },
  { topic: UNIT_MEASUREMENT, value: 70, color: "var(--amber)" },
];

const students = [];

const formulas = [
  ["Triangle area", "A = (b x h) / 2"],
  ["Circle area", "A = pi x r^2"],
  ["Rectangular prism volume", "V = l x w x h"],
  ["Slope", "m = (y2 - y1) / (x2 - x1)"],
  ["Pythagorean theorem", "a^2 + b^2 = c^2"],
  ["Percent", "part / whole = percent / 100"],
  ["Exponent product rule", "a^m x a^n = a^(m+n)"],
  ["Simple interest", "I = P x r x t"],
];

const helpThread = [
  ["student", "I need help with question 4. I got x = 8, but the checker says it is wrong."],
  ["teacher", "Start by subtracting 6 from both sides. What equation is left?"],
  ["student", "2x = 12."],
  ["teacher", "Good. Now divide both sides by 2."],
];

const announcements = [
  ["Quiz on Friday", "Algebra and linear relationships."],
  ["Review lesson posted", "The slope lesson now has two extra examples."],
  ["Bring calculator tomorrow", "We will use scientific calculators during practice."],
];

const MESSAGE_STORAGE_KEY = "mathbridge-mailboxes-v1";

const mailboxes = {
  student: [],
  teacher: [],
  parent: [],
};

const answerKey = {
  "2/3 + 1/4": ["11/12"],
  "5/6 - 1/3": ["1/2", "0.5"],
  "3/5 x 10": ["6"],
  "7/8 - 1/2": ["3/8"],
  "1 1/4 + 2 1/2": ["3 3/4", "15/4", "3.75"],
  "4.8 + 2.35": ["7.15"],
  "7.2 - 3.95": ["3.25"],
  "0.6 x 0.4": ["0.24"],
  "9.45 / 3": ["3.15"],
  "12.5 + 0.75": ["13.25"],
  "Find 20% of 45": ["9"],
  "18 is what percent of 60?": ["30%", "30"],
  "Increase 80 by 15%": ["92"],
  "Find 35% of 120": ["42"],
  "A $40 item is 25% off": ["$30", "30", "$30.00"],
  "Simplify 3x + 2x - 7": ["5x - 7", "5x-7"],
  "Evaluate 4a - 3 when a = 5": ["17"],
  "Expand 2(x + 6)": ["2x + 12", "2x+12"],
  "Factor 6x + 12": ["6(x + 2)", "6(x+2)"],
  "Simplify 5y - 2 + y": ["6y - 2", "6y-2"],
  "3x + 5 = 20": ["x = 5", "5"],
  "2x - 7 = 11": ["x = 9", "9"],
  "5x + 4 = 29": ["x = 5", "5"],
  "6x - 4 = 20": ["x = 4", "4"],
  "4x + 3 = 19": ["x = 4", "4"],
  "Graph y = 2x - 1": ["done", "graphed", "line through (0,-1) and (1,1)"],
  "Plot (2, 3), (4, 7), (6, 11)": ["done", "plotted"],
  "Find the y-intercept of y = -3x + 5": ["5", "b = 5", "(0,5)"],
  "Graph x = 4": ["done", "vertical line at x=4", "x = 4"],
  "Find slope from (1, 2) and (5, 10)": ["2", "m = 2"],
  "Find area of a triangle with b = 8, h = 5": ["20"],
  "Find circumference when r = 4": ["8pi", "8 pi", "25.12"],
  "Find volume of a prism 3 x 4 x 9": ["108"],
  "Find missing angle in a triangle: 40, 65, ?": ["75", "75 degrees"],
  "Find area of a circle with r = 6": ["36pi", "36 pi", "113.04"],
  "-7 + 12": ["5"],
  "-4 - 9": ["-13"],
  "-3 x 8": ["-24"],
  "24 / -6": ["-4"],
  "-11 + -5": ["-16"],
  "2^5": ["32"],
  "3^2 x 3^4": ["729", "3^6"],
  "10^3 / 10": ["100", "10^2"],
  "(4^2)^3": ["4096", "4^6"],
  "5^0": ["1"],
  "3 pencils cost $1.50. How much do 10 cost?": ["$5", "5", "$5.00"],
  "A car travels 180 km in 3 hours. Find speed.": ["60 km/h", "60", "60 km per hour"],
  "A recipe uses 2 cups for 5 servings. How many for 15?": ["6 cups", "6"],
  "A shirt costs $36 after 10% off. Find original price.": ["$40", "40", "$40.00"],
  "There are 4 boxes with 12 tiles each. How many tiles?": ["48"],
  "Find sin A for opposite 3 and hypotenuse 5": ["3/5", "0.6"],
  "Find cos A for adjacent 8 and hypotenuse 10": ["4/5", "0.8", "8/10"],
  "Find tan A for opposite 6 and adjacent 4": ["3/2", "1.5", "6/4"],
  "Which ratio uses opposite / hypotenuse?": ["sin", "sine"],
  "Find missing side: sin 30 = x / 12": ["6", "x = 6"],
};

const grade7QuestionSets = buildGrade7QuestionSets();
registerQuestionSetAnswers(grade7QuestionSets);

const ONTARIO_GRADE9_QOTD_LABEL = "Ontario Grade 9 MTH1W";
const dailyChallenges = buildOntarioGrade9DailyChallenges();

function buildOntarioGrade9DailyChallenges() {
  const items = [];
  const countPerStrand = 64;
  const push = (topic, prompt, hint, answers, solution) => {
    items.push({ topic, prompt, hint, answers: [...new Set(answers.map(String))], solution });
  };

  for (let i = 0; i < countPerStrand; i += 1) {
    const base = 2 + (i % 7);
    const m = 3 + (i % 4);
    const n = 2 + ((i * 2) % 5);
    const k = 1 + (i % 3);
    const exponent = 2 * m + n - k;
    const exponentValue = base ** exponent;
    const ratioA = 2 + (i % 5);
    const ratioB = 3 + ((i * 3) % 7);
    const total = (ratioA + ratioB) * (8 + (i % 6));
    const firstShare = total * ratioA / (ratioA + ratioB);
    const scale = 75 + (i % 9) * 25;
    const modelLength = 6 + (i % 13);
    const actualMetres = modelLength * scale / 100;
    const startValue = 80 + i * 7;
    const percentUp = 8 + (i % 8) * 2;
    const percentDown = 5 + (i % 6);
    const changedValue = startValue * (1 + percentUp / 100) * (1 - percentDown / 100);
    const numberCase = i % 4;

    if (numberCase === 0) {
      push(
        "Number",
        `Evaluate ((${base}^${m})^2 x ${base}^${n}) / ${base}^${k}.`,
        "Use the power-of-a-power rule first, then multiply and divide powers with the same base.",
        numberAnswerVariants(exponentValue, 0),
        `${base}^${2 * m} x ${base}^${n} / ${base}^${k} = ${base}^${exponent} = ${exponentValue}.`,
      );
    } else if (numberCase === 1) {
      push(
        "Number",
        `A total of ${total} kg is split in the ratio ${ratioA}:${ratioB}. How many kilograms are in the first part?`,
        "Add the ratio parts, then multiply the total by the first part over the total parts.",
        numberAnswerVariants(firstShare, 2),
        `${ratioA} + ${ratioB} = ${ratioA + ratioB}, so the first part is ${total} x ${ratioA}/${ratioA + ratioB} = ${formatNumber(firstShare, 2)} kg.`,
      );
    } else if (numberCase === 2) {
      push(
        "Number",
        `A scale drawing uses 1:${scale}. If a hallway is ${modelLength} cm on the drawing, what is the actual length in metres?`,
        "Multiply the drawing length by the scale factor, then convert centimetres to metres.",
        numberAnswerVariants(actualMetres, 2),
        `${modelLength} x ${scale} = ${formatNumber(modelLength * scale, 2)} cm, which is ${formatNumber(actualMetres, 2)} m.`,
      );
    } else {
      push(
        "Number",
        `A quantity starts at ${startValue}, increases by ${percentUp}%, then decreases by ${percentDown}%. What is the final value? Round to the nearest hundredth.`,
        "Successive percent changes are multiplied, not added.",
        numberAnswerVariants(changedValue, 2),
        `${startValue} x ${formatNumber(1 + percentUp / 100, 2)} x ${formatNumber(1 - percentDown / 100, 2)} = ${formatNumber(changedValue, 2)}.`,
      );
    }
  }

  for (let i = 0; i < countPerStrand; i += 1) {
    const a = 3 + (i % 6);
    const b = 5 + ((i * 2) % 8);
    const c = 11 + (i % 9);
    const x = 7 + (i % 13);
    const d = a * (x + b) - c;
    const slope = -4 + (i % 9);
    const intercept = -10 + ((i * 3) % 21);
    const input = 4 + (i % 10);
    const output = slope * input + intercept;
    const patternA = 2 + (i % 5);
    const patternB = 1 + (i % 7);
    const term = 8 + (i % 9);
    const patternValue = patternA * term * term + patternB * term;
    const fracA = 2 + (i % 6);
    const fracB = 3 + (i % 5);
    const fracX = 2 + (i % 12);
    const fracRight = fracA * fracX + fracB * fracB;
    const algebraCase = i % 4;

    if (algebraCase === 0) {
      push(
        "Algebra",
        `Solve for x: ${a}(x + ${b}) - ${c} = ${d}.`,
        "Undo the subtraction, divide by the coefficient outside the bracket, then undo the addition inside the bracket.",
        [`${x}`, `x=${x}`, `x = ${x}`],
        `${a}(x + ${b}) = ${d + c}, so x + ${b} = ${(d + c) / a}, and x = ${x}.`,
      );
    } else if (algebraCase === 1) {
      push(
        "Algebra",
        `A linear relation has rule y = ${slope}x ${intercept < 0 ? "- " + Math.abs(intercept) : "+ " + intercept}. What is y when x = ${input}?`,
        "Substitute the x-value into the rule, then use integer operations carefully.",
        numberAnswerVariants(output, 0),
        `y = ${slope}(${input}) ${intercept < 0 ? "- " + Math.abs(intercept) : "+ " + intercept} = ${output}.`,
      );
    } else if (algebraCase === 2) {
      push(
        "Algebra",
        `A non-linear pattern has nth term ${patternA}n^2 + ${patternB}n. What is term ${term}?`,
        "Substitute the term number for n, square first, then multiply and add.",
        numberAnswerVariants(patternValue, 0),
        `${patternA}(${term}^2) + ${patternB}(${term}) = ${patternA * term * term} + ${patternB * term} = ${patternValue}.`,
      );
    } else {
      push(
        "Algebra",
        `Solve for x: (${fracA}/${fracB})x + ${fracB} = ${formatNumber(fracRight / fracB, 2)}.`,
        "Subtract the constant first, then multiply by the reciprocal.",
        [`${fracX}`, `x=${fracX}`, `x = ${fracX}`],
        `Subtract ${fracB}: (${fracA}/${fracB})x = ${formatNumber((fracRight - fracB * fracB) / fracB, 2)}. Multiplying by ${fracB}/${fracA} gives x = ${fracX}.`,
      );
    }
  }

  for (let i = 0; i < countPerStrand; i += 1) {
    const valueA = 55 + (i % 9) * 7;
    const valueB = valueA + 13 + (i % 4) * 5;
    const valueC = valueB + 19 + (i % 5) * 4;
    const freqA = 3 + (i % 5);
    const freqB = 4 + ((i * 2) % 5);
    const freqC = 2 + ((i * 3) % 4);
    const mean = (valueA * freqA + valueB * freqB + valueC * freqC) / (freqA + freqB + freqC);
    const slope = 1.5 + (i % 6) * 0.5;
    const intercept = 12 + (i % 11);
    const xValue = 6 + (i % 10);
    const predicted = slope * xValue + intercept;
    const actual = predicted + (-6 + (i % 7) * 2);
    const residual = actual - predicted;
    const sampleSize = 160 + i * 5;
    const samplePercent = 18 + (i % 9) * 3;
    const population = 900 + i * 20;
    const estimate = population * samplePercent / 100;
    const medianValues = [8 + i, 12 + i, 12 + i, 17 + i, 19 + i, 20 + i, 27 + i];
    const dataCase = i % 4;

    if (dataCase === 0) {
      push(
        "Data",
        `A frequency table has values ${valueA}, ${valueB}, and ${valueC} with frequencies ${freqA}, ${freqB}, and ${freqC}. What is the weighted mean? Round to the nearest tenth.`,
        "Multiply each value by its frequency before dividing by the total frequency.",
        numberAnswerVariants(mean, 1),
        `Weighted sum = ${valueA * freqA + valueB * freqB + valueC * freqC}; total frequency = ${freqA + freqB + freqC}; mean = ${formatNumber(mean, 1)}.`,
      );
    } else if (dataCase === 1) {
      push(
        "Data",
        `A line of best fit is y = ${formatNumber(slope, 1)}x + ${intercept}. For x = ${xValue}, the actual value is ${formatNumber(actual, 1)}. What is the residual actual - predicted?`,
        "Predict with the line first, then subtract predicted from actual.",
        numberAnswerVariants(residual, 1),
        `Predicted = ${formatNumber(slope, 1)}(${xValue}) + ${intercept} = ${formatNumber(predicted, 1)}; residual = ${formatNumber(actual, 1)} - ${formatNumber(predicted, 1)} = ${formatNumber(residual, 1)}.`,
      );
    } else if (dataCase === 2) {
      push(
        "Data",
        `In a sample of ${sampleSize} students, ${samplePercent}% chose transit as their main commute. Estimate how many students out of ${population} would choose transit.`,
        "Use the sample percent as a decimal and multiply by the population.",
        numberAnswerVariants(estimate, 0),
        `${samplePercent}% of ${population} is ${population} x ${samplePercent / 100} = ${formatNumber(estimate, 0)}.`,
      );
    } else {
      push(
        "Data",
        `The ordered data set is ${medianValues.join(", ")}. If the largest value increases by ${8 + (i % 5)}, what is the new median?`,
        "Changing only the largest value does not move the middle position in an ordered set with seven values.",
        numberAnswerVariants(medianValues[3], 0),
        `There are 7 values, so the median is the 4th value: ${medianValues[3]}.`,
      );
    }
  }

  for (let i = 0; i < countPerStrand; i += 1) {
    const radius = 5 + (i % 8);
    const height = 12 + (i % 10);
    const cylinderVolume = 3.14 * radius * radius * height;
    const coneVolume = cylinderVolume / 3;
    const prismLength = 7 + (i % 8);
    const prismWidth = 4 + (i % 6);
    const prismHeight = 5 + (i % 9);
    const prismVolume = prismLength * prismWidth * prismHeight;
    const pyramidVolume = prismVolume / 3;
    const legA = 5 + (i % 8);
    const legB = 12 + (i % 7);
    const hypotenuse = Math.sqrt(legA * legA + legB * legB);
    const scale = 2 + (i % 5);
    const originalArea = 18 + i;
    const scaledArea = originalArea * scale * scale;
    const geometryCase = i % 4;

    if (geometryCase === 0) {
      push(
        "Geometry and Measurement",
        `Use pi = 3.14. What is the volume of a cylinder with radius ${radius} cm and height ${height} cm? Round to the nearest tenth.`,
        "Cylinder volume is pi r^2 h.",
        numberAnswerVariants(cylinderVolume, 1),
        `V = 3.14 x ${radius}^2 x ${height} = ${formatNumber(cylinderVolume, 1)}.`,
      );
    } else if (geometryCase === 1) {
      push(
        "Geometry and Measurement",
        `A cone has the same radius ${radius} cm and height ${height} cm as a cylinder. Using pi = 3.14, what is the cone volume? Round to the nearest tenth.`,
        "A cone has one-third the volume of the matching cylinder.",
        numberAnswerVariants(coneVolume, 1),
        `V = (3.14 x ${radius}^2 x ${height}) / 3 = ${formatNumber(coneVolume, 1)}.`,
      );
    } else if (geometryCase === 2) {
      push(
        "Geometry and Measurement",
        `A pyramid has a rectangular base ${prismLength} m by ${prismWidth} m and height ${prismHeight} m. What is its volume? Round to the nearest tenth.`,
        "Pyramid volume is one-third of base area times height.",
        numberAnswerVariants(pyramidVolume, 1),
        `V = (${prismLength} x ${prismWidth} x ${prismHeight}) / 3 = ${formatNumber(pyramidVolume, 1)}.`,
      );
    } else {
      push(
        "Geometry and Measurement",
        `A right triangle has legs ${legA} and ${legB}. What is the hypotenuse? Round to the nearest tenth.`,
        "Use a^2 + b^2 = c^2, then take the square root.",
        numberAnswerVariants(hypotenuse, 1),
        `c = sqrt(${legA}^2 + ${legB}^2) = ${formatNumber(hypotenuse, 1)}.`,
      );
      if (i % 12 === 11) {
        push(
          "Geometry and Measurement",
          `A shape with area ${originalArea} cm^2 is enlarged by scale factor ${scale}. What is the new area?`,
          "Area changes by the square of the scale factor.",
          numberAnswerVariants(scaledArea, 0),
          `New area = ${originalArea} x ${scale}^2 = ${scaledArea}.`,
        );
      }
    }
  }

  for (let i = 0; i < countPerStrand; i += 1) {
    const price = 275 + i * 13;
    const discount = 15 + (i % 7) * 5;
    const finalPrice = price * (1 - discount / 100) * 1.13;
    const principal = 1200 + i * 45;
    const rate = 3 + (i % 8) * 0.5;
    const years = 2 + (i % 5);
    const interest = principal * rate / 100 * years;
    const carStart = 9000 + i * 225;
    const depreciation = 8 + (i % 8);
    const carValue = carStart * (1 - depreciation / 100) ** 2;
    const income = 1800 + i * 20;
    const rent = 720 + (i % 8) * 15;
    const food = 260 + (i % 6) * 12;
    const transit = 110 + (i % 5) * 8;
    const savingsRate = 12 + (i % 7);
    const savings = income * savingsRate / 100;
    const left = income - rent - food - transit - savings;
    const financialCase = i % 4;

    if (financialCase === 0) {
      push(
        "Financial Literacy",
        `An item costs $${price}. It is ${discount}% off, then 13% HST is added. What is the final cost? Round to the nearest cent.`,
        "Apply the discount first, then multiply the sale price by 1.13.",
        moneyAnswerVariants(finalPrice),
        `$${price} x ${formatNumber(1 - discount / 100, 2)} x 1.13 = $${formatMoney(finalPrice)}.`,
      );
    } else if (financialCase === 1) {
      push(
        "Financial Literacy",
        `A savings account has $${principal} at ${formatNumber(rate, 1)}% simple interest for ${years} years. How much interest is earned?`,
        "Use I = P x r x t, with the rate written as a decimal.",
        moneyAnswerVariants(interest),
        `I = ${principal} x ${formatNumber(rate / 100, 3)} x ${years} = $${formatMoney(interest)}.`,
      );
    } else if (financialCase === 2) {
      push(
        "Financial Literacy",
        `A used car is worth $${carStart} and depreciates by ${depreciation}% per year for 2 years. What is its value after 2 years? Round to the nearest cent.`,
        "Depreciation compounds, so multiply by the same percent factor twice.",
        moneyAnswerVariants(carValue),
        `$${carStart} x ${formatNumber(1 - depreciation / 100, 2)}^2 = $${formatMoney(carValue)}.`,
      );
    } else {
      push(
        "Financial Literacy",
        `A monthly budget has income $${income}, rent $${rent}, food $${food}, transit $${transit}, and savings of ${savingsRate}% of income. How much money is left?`,
        "Find savings first, then subtract every cost from income.",
        moneyAnswerVariants(left),
        `Savings = $${formatMoney(savings)}. Left = ${income} - ${rent} - ${food} - ${transit} - ${formatMoney(savings)} = $${formatMoney(left)}.`,
      );
    }
  }

  return deterministicQuestionOrder(items).slice(0, 320);
}

function deterministicQuestionOrder(items) {
  return items
    .map((item, index) => ({ item, order: (index * 73 + 41) % items.length }))
    .sort((a, b) => a.order - b.order)
    .map(({ item }) => item);
}

function formatNumber(value, decimals = 2) {
  const rounded = Number(value.toFixed(decimals));
  return decimals === 0 ? String(Math.round(value)) : String(rounded);
}

function formatMoney(value) {
  return Number(value.toFixed(2)).toFixed(2);
}

function numberAnswerVariants(value, decimals = 2) {
  const fixed = decimals === 0 ? String(Math.round(value)) : value.toFixed(decimals);
  return [String(Number(fixed)), fixed];
}

function moneyAnswerVariants(value) {
  const fixed = formatMoney(value);
  const trimmed = String(Number(fixed));
  return [fixed, `$${fixed}`, trimmed, `$${trimmed}`];
}

function percent(item) {
  return Math.round((item.progress / item.total) * 100);
}

function statusPill(status) {
  if (status === "Missing") return "coral";
  if (status === "Needs correction") return "coral";
  if (status === "Upcoming") return "amber";
  if (status === "Submitted") return "blue";
  return "green";
}

function upcomingDueDays(item) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(item?.due || ""))) return null;
  const today = new Date(`${localDateKey(new Date())}T00:00:00`);
  const due = new Date(`${item.due}T00:00:00`);
  if (Number.isNaN(due.getTime())) return null;
  return Math.round((due - today) / 86400000);
}

function assignmentAttentionLevel(item) {
  if (item?.status === "Missing" || item?.status === "Needs correction") return "critical";
  if (item?.status === "Today") return "today";
  const dueDays = upcomingDueDays(item);
  if (item?.status === "Upcoming" && dueDays !== null && dueDays >= 0 && dueDays <= 2) return "soon";
  return "";
}

function assignmentNeedsAttention(item) {
  return Boolean(assignmentAttentionLevel(item));
}

function assignmentCardClass(item) {
  const level = assignmentAttentionLevel(item);
  return ["assignment-card", level ? `assignment-due-${level}` : ""].filter(Boolean).join(" ");
}

function assignmentNavPage(page) {
  if (state.role === "student") return page === "Homework";
  if (state.role === "parent") return page === "Homework Status";
  return false;
}

function dueAssignmentsForRole() {
  if (state.role === "student") return getStudentAssignments().filter(assignmentNeedsAttention);
  if (state.role === "parent") return getParentAssignments().filter(assignmentNeedsAttention);
  return [];
}

function assignmentDueSummary() {
  const due = dueAssignmentsForRole();
  const critical = due.filter((item) => assignmentAttentionLevel(item) === "critical").length;
  const today = due.filter((item) => assignmentAttentionLevel(item) === "today").length;
  const soon = due.filter((item) => assignmentAttentionLevel(item) === "soon").length;
  if (critical) return { count: due.length, label: `${critical} needs attention` };
  if (today) return { count: due.length, label: `${today} due today` };
  if (soon) return { count: due.length, label: `${soon} due soon` };
  return { count: 0, label: "" };
}

function attendanceLabel(status) {
  const labels = {
    present: "Present",
    late: "Late",
    absent: "Absent",
    excused: "Excused",
    unmarked: "Unmarked",
  };
  return labels[status] || "Unmarked";
}

function attendancePillClass(status) {
  if (status === "present") return "green";
  if (status === "late" || status === "excused") return "amber";
  if (status === "absent") return "coral";
  return "";
}

function attendanceSummary(records) {
  return records.reduce(
    (summary, record) => {
      const key = record.status || "unmarked";
      summary[key] = (summary[key] || 0) + 1;
      return summary;
    },
    { present: 0, late: 0, absent: 0, excused: 0, unmarked: 0 },
  );
}

function attendanceNeedsAttention() {
  if (state.role !== "teacher") return false;
  const records = teacherAttendanceRecords();
  const summary = attendanceSummary(records);
  return records.length > 0 && summary.unmarked > 0;
}

function attendanceReminderText() {
  const records = state.role === "teacher" ? teacherAttendanceRecords() : state.attendance.records;
  const summary = attendanceSummary(records);
  if (!records.length) return "No signed-up students yet.";
  if (!summary.unmarked) return "Attendance is marked.";
  return `${summary.unmarked} student${summary.unmarked === 1 ? "" : "s"} still unmarked`;
}

function teacherAttendanceRecords() {
  if (state.role !== "teacher") return state.attendance.records;
  const selectedIds = new Set(getClassStudents().map((student) => student.id));
  return state.attendance.records.filter((record) => selectedIds.has(record.student?.id));
}

function freshAssignmentStatus(item) {
  if (item.status === "Today" || item.status === "Upcoming") return item.status;
  return "Today";
}

function freshAssignmentDue(item) {
  if (item.status === "Missing") return "Friday, 8:00 PM";
  if (item.status === "Completed") return "Practice set";
  return item.due;
}

function workProofStatus(saved = {}, fallbackStatus = "Today") {
  if (saved.verificationStatus === "verified") return "Completed";
  if (saved.verificationStatus === "needs-correction") return "Needs correction";
  if (saved.submittedAt) return "Submitted";
  return fallbackStatus;
}

function hasWorkProof(item) {
  return Boolean(item?.drawing?.url || (Array.isArray(item?.documents) && item.documents.length));
}

function isDrawablePage(item) {
  return Boolean(item?.pageUrl && String(item.pageType || "").startsWith("image/"));
}

function submissionLabel(item) {
  if (item.verificationStatus === "verified") return "Teacher verified";
  if (item.verificationStatus === "needs-correction") return "Needs correction";
  if (item.submittedAt) return "Waiting for teacher";
  if (hasWorkProof(item) || hasTypedAnswerProof(item)) return "Ready to submit";
  return "Not submitted";
}

function publishedAssignmentStatus(assignment) {
  if (!assignment.due || !/^\d{4}-\d{2}-\d{2}$/.test(assignment.due)) return "Upcoming";
  const today = new Date().toISOString().slice(0, 10);
  if (assignment.due === today) return "Today";
  if (assignment.due < today) return "Missing";
  return "Upcoming";
}

function unitForTopic(topic = "") {
  if (grade7QuestionTopics.includes(topic)) return topic;
  const text = String(topic || "").toLowerCase();
  if (text.includes("financial") || text.includes("money") || text.includes("budget") || text.includes("interest")) {
    return UNIT_FINANCIAL;
  }
  if (/(fraction|decimal|percent|ratio|rate|proportion|word problem)/.test(text)) {
    return UNIT_RATIOS_RATES;
  }
  if (/(pythagorean|measurement|geometry|area|perimeter|volume|circle|triangle|angle)/.test(text)) {
    return UNIT_MEASUREMENT;
  }
  if (/(algebra|equation|graph|slope|linear|pattern|relation)/.test(text)) {
    return UNIT_ALGEBRA;
  }
  return UNIT_NUMBER_SENSE;
}

function assignmentCatalog() {
  const published = state.assignmentLibrary.map((assignment) => ({
    id: assignment.id,
    title: assignment.title,
    topic: unitForTopic(assignment.topic),
    due: assignment.due,
    status: publishedAssignmentStatus(assignment),
    progress: 0,
    total: assignment.steps?.length || 4,
    score: null,
    requiredWork: assignment.requiredWork,
    uploadWork: Boolean(assignment.uploadWork),
    videoUrl: assignment.videoUrl || "",
    videoLink: assignment.videoLink || "",
    videoName: assignment.videoName || "",
    videoType: assignment.videoType || "",
    pageUrl: assignment.pageUrl || "",
    pageName: assignment.pageName || "",
    pageType: assignment.pageType || "",
    resources: Array.isArray(assignment.resources) ? assignment.resources : [],
    assignedStudentIds: Array.isArray(assignment.assignedStudentIds) ? assignment.assignedStudentIds : [],
    questions: assignment.questions || [],
    classId: assignment.classId || "",
    className: assignment.className,
    teacherName: assignment.teacherName,
    steps: (assignment.steps || []).map((label) => ({ label, done: false })),
  }));
  return [...published, ...assignments];
}

function assignmentsFromWork(workAssignments = {}) {
  return assignmentCatalog().map((item) => {
    const saved = workAssignments[item.id] || {};
    const steps = item.steps.map((step, index) => ({
      label: step.label,
      done: Boolean(saved.steps?.[index]),
    }));
    const progress = steps.filter((step) => step.done).length;
    const status = workProofStatus(saved, freshAssignmentStatus(item));
    return {
      ...item,
      due: saved.verificationStatus === "verified" ? "Completed" : freshAssignmentDue(item),
      status,
      progress,
      total: steps.length,
      score: null,
      steps,
      documents: Array.isArray(saved.documents) ? saved.documents : [],
      answers: Array.isArray(saved.answers) ? saved.answers : [],
      drawing: saved.drawing || null,
      submittedAt: saved.submittedAt || "",
      verificationStatus: saved.verificationStatus || "draft",
      verifiedAt: saved.verifiedAt || "",
      teacherFeedback: saved.teacherFeedback || "",
      grade: validGrade(saved.grade),
      gradeUpdatedAt: saved.gradeUpdatedAt || "",
      studentComment: saved.studentComment || "",
    };
  });
}

function getStudentAssignments() {
  return assignmentsFromWork(state.work.assignments);
}

function getParentAssignments() {
  if (!state.parent.selectedStudentId) return [];
  return assignmentsFromWork(state.parentWork.assignments);
}

function answerDraftsForAssignment(item) {
  const saved = Array.isArray(item.answers) ? item.answers : [];
  const draft = state.answerDrafts[item.id];
  const source = Array.isArray(draft) ? draft : saved;
  return (item.questions || []).map((question, index) => {
    const normalized = normalizeHomeworkQuestion(question);
    const value = source[index];
    if (normalized.type === "select-all") return Array.isArray(value) ? value : [];
    return Array.isArray(value) ? value.join(", ") : value || "";
  });
}

function typedAnswerCount(item) {
  return answerDraftsForAssignment(item).filter((answer) =>
    Array.isArray(answer)
      ? answer.some((choice) => String(choice || "").trim())
      : String(answer || "").trim(),
  ).length;
}

function hasTypedAnswerProof(item) {
  return typedAnswerCount(item) > 0;
}

function submitCommentForAssignment(item) {
  return state.submitComments[item.id] ?? item.studentComment ?? "";
}

function normalizeHomeworkQuestion(question) {
  if (question && typeof question === "object") {
    const type = ["multiple-choice", "select-all", "text"].includes(question.type) ? question.type : "text";
    const prompt = String(question.prompt || question.q || question.text || "").trim();
    const markedChoices = Array.isArray(question.choices)
      ? question.choices.map(markedChoiceValue).filter((item) => item.choice)
      : [];
    const choices = markedChoices.map((item) => item.choice);
    return {
      type: type === "text" || choices.length >= 2 ? type : "text",
      prompt,
      choices: type === "text" ? [] : choices,
      answerKey: Array.isArray(question.answerKey) ? question.answerKey.map(cleanQuestionAnswerValue).filter(Boolean) : [],
    };
  }
  return parseQuestionLine(question);
}

function cleanQuestionAnswerValue(value) {
  return String(value || "")
    .trim()
    .replace(/^\*+\s*/, "")
    .replace(/^\[(?:x|correct)\]\s*/i, "")
    .replace(/\s*\(correct\)$/i, "");
}

function markedChoiceValue(value) {
  const raw = String(value || "").trim();
  const leadingMarked = /^(?:\*|\[(?:x|correct)\]|\((?:x|correct)\))\s*/i.test(raw);
  const trailingMarked = /\s*\(correct\)$/i.test(raw);
  return {
    choice: cleanQuestionAnswerValue(raw),
    correct: leadingMarked || trailingMarked,
  };
}

function parseQuestionLine(line) {
  const text = String(line || "").trim();
  const answerMatch = text.match(/^ANS(?:WER)?\s*:\s*(.+)$/i);
  if (answerMatch) {
    const parts = answerMatch[1].split("|").map(cleanQuestionAnswerValue).filter(Boolean);
    const prompt = parts.shift() || text;
    return { type: "text", prompt, choices: [], answerKey: parts };
  }
  const modeMatch = text.match(/^(MC|MULTIPLE CHOICE|ALL|SELECT ALL):\s*(.+)$/i);
  if (!modeMatch) return { type: "text", prompt: text, choices: [] };
  const type = /^(ALL|SELECT ALL)$/i.test(modeMatch[1]) ? "select-all" : "multiple-choice";
  const parts = modeMatch[2].split("|").map((part) => part.trim()).filter(Boolean);
  const prompt = parts.shift() || text;
  const markedChoices = parts.map(markedChoiceValue).filter((item) => item.choice);
  const choices = markedChoices.map((item) => item.choice);
  const answerKey = markedChoices.filter((item) => item.correct).map((item) => item.choice);
  return prompt && choices.length >= 2 ? { type, prompt, choices, answerKey } : { type: "text", prompt: text, choices: [] };
}

function questionModeLabel(question) {
  const type = normalizeHomeworkQuestion(question).type;
  if (type === "multiple-choice") return "Multiple choice";
  if (type === "select-all") return "Select all";
  return "Typed answer";
}

function assignmentStats(list) {
  const total = list.length;
  const completed = list.filter((item) => item.status === "Completed").length;
  const missing = list.filter((item) => item.status === "Missing").length;
  const today = list.filter((item) => item.status === "Today").length;
  const openSteps = list.reduce((sum, item) => sum + item.total - item.progress, 0);
  const completedSteps = list.reduce((sum, item) => sum + item.progress, 0);
  const totalSteps = list.reduce((sum, item) => sum + item.total, 0);
  return {
    total,
    completed,
    missing,
    today,
    openSteps,
    completedSteps,
    totalSteps,
    average: completed ? "Submitted" : "New",
  };
}

function questionItem(text, answers) {
  return { q: text, answers: Array.isArray(answers) ? answers.map(String) : [String(answers)] };
}

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) [x, y] = [y, x % y];
  return x || 1;
}

function fractionAnswer(numerator, denominator) {
  const divisor = gcd(numerator, denominator);
  const n = numerator / divisor;
  const d = denominator / divisor;
  if (d === 1) return String(n);
  if (Math.abs(n) > d) {
    const whole = Math.trunc(n / d);
    const remainder = Math.abs(n % d);
    return remainder ? [`${n}/${d}`, `${whole} ${remainder}/${d}`] : String(whole);
  }
  return `${n}/${d}`;
}

function cleanDecimal(value) {
  return Number(value.toFixed(3)).toString();
}

function oneDecimal(value) {
  return Number(value.toFixed(1)).toString();
}

function money(value) {
  return `$${value.toFixed(2)}`;
}

function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}

function primeFactorEntries(value) {
  let n = Math.abs(value);
  const entries = [];
  for (let factor = 2; factor <= n; factor += factor === 2 ? 1 : 2) {
    let count = 0;
    while (n % factor === 0) {
      count += 1;
      n /= factor;
    }
    if (count) entries.push([factor, count]);
  }
  return entries;
}

function primeFactorText(value) {
  return primeFactorEntries(value)
    .map(([factor, count]) => (count === 1 ? `${factor}` : `${factor}^${count}`))
    .join(" x ");
}

function primeFactorExpandedText(value) {
  return primeFactorEntries(value)
    .flatMap(([factor, count]) => Array.from({ length: count }, () => String(factor)))
    .join(" x ");
}

function primeFactorAnswers(value) {
  const compact = primeFactorText(value);
  const expanded = primeFactorExpandedText(value);
  return compact === expanded ? [compact] : [compact, expanded];
}

function scientificNotationAnswers(coefficient, exponent) {
  return [`${coefficient} x 10^${exponent}`, `${coefficient}*10^${exponent}`];
}

function addNumberSenseLessonSets(sets, setNo, values) {
  const { a, b, c, d } = values;
  const n1 = (a + 4) * (b + 3);
  const n2 = (a + 5) * (c + 2);
  const gcfA = (a + 2) * (b + 1);
  const gcfB = (a + 2) * (c + 1);
  const lcmA = a + 4;
  const lcmB = b + 5;
  const tempStart = -1 * (a + 6);
  const tempRise = b + 8;
  const tempDrop = c + 2;
  const sciCoefficient = Number((1.2 + setNo * 0.3).toFixed(1));
  const sciExponent = (setNo % 4) + 3;
  const sciValue = sciCoefficient * (10 ** sciExponent);

  sets.push({
    title: `Lesson 1: Prime Factorization, GCF, and LCM ${setNo}`,
    items: [
      questionItem(`Write the prime factorization of ${n1}.`, primeFactorAnswers(n1)),
      questionItem(`Write the prime factorization of ${n2}.`, primeFactorAnswers(n2)),
      questionItem(`Find the GCF of ${gcfA} and ${gcfB}.`, String(gcd(gcfA, gcfB))),
      questionItem(`Find the LCM of ${lcmA} and ${lcmB}.`, String(lcm(lcmA, lcmB))),
      questionItem(`Use prime factors to decide: is ${a * b + a} divisible by ${a}?`, "yes"),
    ],
  });

  sets.push({
    title: `Lesson 2: GCF and LCM Word Problems ${setNo}`,
    items: [
      questionItem(`Two bells ring every ${lcmA} minutes and ${lcmB} minutes. If they ring together now, in how many minutes will they ring together again?`, String(lcm(lcmA, lcmB))),
      questionItem(`A teacher has ${gcfA} pencils and ${gcfB} erasers. What is the greatest number of identical supply kits she can make?`, String(gcd(gcfA, gcfB))),
      questionItem(`Bus A arrives every ${a + 6} minutes and Bus B every ${b + 7} minutes. What is the first time they arrive together?`, String(lcm(a + 6, b + 7))),
      questionItem(`A display has ${n1} blue tiles and ${n2} white tiles. What is the greatest number of equal groups using all tiles?`, String(gcd(n1, n2))),
      questionItem(`One light flashes every ${c + 4} seconds and another every ${d + 5} seconds. Find the LCM.`, String(lcm(c + 4, d + 5))),
    ],
  });

  sets.push({
    title: `Lesson 3: Integers ${setNo}`,
    items: [
      questionItem(`${tempStart} + ${tempRise}`, String(tempStart + tempRise)),
      questionItem(`${c} - ${b + 9}`, String(c - (b + 9))),
      questionItem(`${-a} x ${b}`, String(-a * b)),
      questionItem(`${-(a * b)} ÷ ${a}`, String(-b)),
      questionItem(`Order from least to greatest: ${-d}, ${b}, ${-a}`, `${-d}, ${-a}, ${b}`),
    ],
  });

  sets.push({
    title: `Lesson 4: Integer Word Problems ${setNo}`,
    items: [
      questionItem(`The temperature was ${tempStart} C, rose ${tempRise} C, then dropped ${tempDrop} C. What is the final temperature?`, String(tempStart + tempRise - tempDrop)),
      questionItem(`A bank account is at -${a * 8} dollars. A deposit of ${b * 10} dollars is made. What is the new balance?`, String(-a * 8 + b * 10)),
      questionItem(`A diver is ${-c} m below sea level and descends ${d} m. What is the diver's depth?`, String(-c - d)),
      questionItem(`A football team loses ${a} yards, gains ${b + 4} yards, then loses ${c} yards. What is the net change?`, String(-a + b + 4 - c)),
      questionItem(`An elevator starts on floor ${-a}, goes up ${b + 3} floors, then down ${c} floors. What floor is it on?`, String(-a + b + 3 - c)),
    ],
  });

  sets.push({
    title: `Lesson 5: Exponents ${setNo}`,
    items: [
      questionItem(`${a}^2`, String(a ** 2)),
      questionItem(`${b}^3`, String(b ** 3)),
      questionItem(`Write ${c} x ${c} x ${c} x ${c} using exponents.`, `${c}^4`),
      questionItem(`${a}^2 x ${a}^3`, [`${a}^5`, String(a ** 5)]),
      questionItem(`Square root of ${d * d}`, String(d)),
    ],
  });

  sets.push({
    title: `Lesson 6: Powers of 10 and Scientific Notation ${setNo}`,
    items: [
      questionItem(`10^${sciExponent}`, String(10 ** sciExponent)),
      questionItem(`${sciCoefficient} x 10^${sciExponent}`, cleanDecimal(sciValue)),
      questionItem(`Write ${cleanDecimal(sciValue)} in scientific notation.`, scientificNotationAnswers(sciCoefficient, sciExponent)),
      questionItem(`Write ${a}${"0".repeat(sciExponent)} as a power of 10 expression.`, `${a} x 10^${sciExponent}`),
      questionItem(`Which is larger: ${b} x 10^${sciExponent} or ${c} x 10^${sciExponent - 1}?`, `${b} x 10^${sciExponent}`),
    ],
  });

  sets.push({
    title: `Lesson 7: Order of Operations ${setNo}`,
    items: [
      questionItem(`${a} + ${b} x ${c}`, String(a + b * c)),
      questionItem(`(${a} + ${b}) x ${c}`, String((a + b) * c)),
      questionItem(`${d}^2 - ${a} x ${b}`, String(d ** 2 - a * b)),
      questionItem(`${a} + (${b + c} - ${c})^2`, String(a + b ** 2)),
      questionItem(`${d * c} ÷ ${c} + ${a}^2`, String((d * c) / c + a ** 2)),
    ],
  });
}

function variableAnswers(variable, value) {
  return [`${variable}=${value}`, `${variable} = ${value}`, String(value)];
}

function decimalAnswerVariants(value, decimals = 3) {
  const rounded = Number(value.toFixed(decimals));
  const trimmed = String(rounded);
  const fixed = value.toFixed(decimals).replace(/0+$/g, "").replace(/\.$/, "");
  return [...new Set([trimmed, fixed])];
}

function percentAnswerVariants(value, decimals = 2) {
  const rounded = Number(value.toFixed(decimals));
  return [...new Set([`${rounded}%`, String(rounded), `${value.toFixed(decimals).replace(/0+$/g, "").replace(/\.$/, "")}%`])];
}

function addFractionsDecimalsPercentsLessonSets(sets, setNo, values) {
  const { a, b, c, d } = values;
  const ratioAnswer = (left, right) => {
    const divisor = gcd(left, right);
    const simpleLeft = left / divisor;
    const simpleRight = right / divisor;
    return [`${simpleLeft}:${simpleRight}`, `${simpleLeft} to ${simpleRight}`, `${simpleLeft}/${simpleRight}`];
  };
  const rateAnswer = (value, unit, decimals = 2) => {
    const numbers = decimalAnswerVariants(value, decimals);
    return [...numbers, ...numbers.map((number) => `${number} ${unit}`)];
  };

  const commonDenominator = d + 4;
  const shaded = a + 1;
  const totalParts = a + b + 6;
  const equivalentBaseDenominator = b + 4;
  const unlikeLeftDenominator = a + 2;
  const unlikeRightDenominator = b + 3;
  const productDenominator = (d + 2) * (c + 3);
  const recipeBatches = setNo + 2;
  const wordDenominator = a + b + c + 4;
  const trailLength = d * 2;
  const tenths = (setNo % 8) + 1;
  const hundredths = 12 + setNo * 7;
  const fractionDecimalDenominator = [4, 5, 8, 10, 20][setNo % 5];
  const fractionDecimalNumerator = Math.min((setNo % fractionDecimalDenominator) + 1, fractionDecimalDenominator - 1);
  const percentA = [10, 20, 25, 40, 50, 60, 75, 80, 90, 125][setNo - 1];
  const percentB = [12.5, 37.5, 62.5, 87.5, 15, 35, 45, 55, 65, 85][setNo - 1];
  const applicationPercent = [10, 15, 20, 25, 30, 40, 50, 60, 75, 80][setNo - 1];
  const purchaseAmount = 80 + setNo * 20;
  const salePrice = purchaseAmount * (1 - applicationPercent / 100);
  const ratioA = a + 1;
  const ratioB = b + 2;
  const ratioScale = setNo + 2;
  const speed = 18 + setNo * 3;
  const hours = 2 + (setNo % 4);
  const distance = speed * hours;
  const unitItems = a + 3;
  const unitPrice = 1.5 + setNo * 0.25;
  const unitTotal = unitItems * unitPrice;
  const pagesPerMinute = 8 + setNo * 2;
  const printerMinutes = b + 1;

  sets.push({
    title: `Lesson 1: Introduction To Fractions ${setNo}`,
    items: [
      questionItem(`Write the fraction for ${shaded} shaded parts out of ${totalParts} equal parts.`, fractionAnswer(shaded, totalParts)),
      questionItem(`Simplify ${(a + b) * 2}/${(a + b) * 6}.`, fractionAnswer((a + b) * 2, (a + b) * 6)),
      questionItem(`Which is larger: ${a}/${commonDenominator} or ${b}/${commonDenominator}?`, `${Math.max(a, b)}/${commonDenominator}`),
      questionItem(`Write an equivalent fraction to ${a}/${equivalentBaseDenominator} with denominator ${equivalentBaseDenominator * 3}.`, fractionAnswer(a * 3, equivalentBaseDenominator * 3)),
      questionItem(`What fraction of a dozen is ${setNo + 2}?`, fractionAnswer(setNo + 2, 12)),
    ],
  });

  sets.push({
    title: `Lesson 2: Adding And Subtracting Fractions ${setNo}`,
    items: [
      questionItem(`${a}/${commonDenominator} + ${b}/${commonDenominator}`, fractionAnswer(a + b, commonDenominator)),
      questionItem(`${c}/${commonDenominator} - ${a}/${commonDenominator}`, fractionAnswer(c - a, commonDenominator)),
      questionItem(`${a}/${unlikeLeftDenominator} + ${b}/${unlikeRightDenominator}`, fractionAnswer(a * unlikeRightDenominator + b * unlikeLeftDenominator, unlikeLeftDenominator * unlikeRightDenominator)),
      questionItem(`${c}/${c + d} - ${a}/${2 * (c + d)}`, fractionAnswer(2 * c - a, 2 * (c + d))),
      questionItem(`A hike is split into ${a}/${wordDenominator} km before lunch and ${b}/${wordDenominator} km after lunch. How many km were hiked?`, fractionAnswer(a + b, wordDenominator)),
    ],
  });

  sets.push({
    title: `Lesson 3: Multiplying Fractions ${setNo}`,
    items: [
      questionItem(`${a}/${d} x ${b}/${c + 3}`, fractionAnswer(a * b, productDenominator)),
      questionItem(`${c} x ${a}/${d + 2}`, fractionAnswer(c * a, d + 2)),
      questionItem(`Find ${a}/${d + 1} of ${b * 6}.`, fractionAnswer(a * b * 6, d + 1)),
      questionItem(`A rectangle is ${a}/${d} m by ${b}/${d + 1} m. What is its area?`, fractionAnswer(a * b, d * (d + 1))),
      questionItem(`A recipe uses ${a}/${d} cup of flour per batch. How many cups are needed for ${recipeBatches} batches?`, fractionAnswer(a * recipeBatches, d)),
    ],
  });

  sets.push({
    title: `Lesson 4: Dividing Fractions ${setNo}`,
    items: [
      questionItem(`${b}/${d + 1} ÷ ${a}/${c + 2}`, fractionAnswer(b * (c + 2), (d + 1) * a)),
      questionItem(`${setNo + 3} ÷ ${a}/${a + b}`, fractionAnswer((setNo + 3) * (a + b), a)),
      questionItem(`${b}/${d} ÷ ${a}`, fractionAnswer(b, d * a)),
      questionItem(`${b}/${d} ÷ ${a}/${d}`, fractionAnswer(b, a)),
      questionItem(`Three friends share ${c}/${d + 2} of a pizza equally. What fraction of a pizza does each friend get?`, fractionAnswer(c, (d + 2) * 3)),
    ],
  });

  sets.push({
    title: `Lesson 5: Fraction Word Problems ${setNo}`,
    items: [
      questionItem(`A recipe uses ${a}/${d} cup of milk for one batch. How much milk is needed for ${c} batches?`, fractionAnswer(a * c, d)),
      questionItem(`A student reads ${a}/${wordDenominator} of a book on Monday and ${b}/${wordDenominator} on Tuesday. What fraction is left?`, fractionAnswer(wordDenominator - a - b, wordDenominator)),
      questionItem(`${b} students out of ${2 * (a + b)} joined math club. What fraction joined?`, fractionAnswer(b, 2 * (a + b))),
      questionItem(`A trail is ${trailLength} km long. A student walks ${a}/${d} of it. How many km did the student walk?`, decimalAnswerVariants(trailLength * a / d, 2)),
      questionItem(`An art project uses ${a}/${b + c} of a sheet first and ${b}/${b + c} next. What fraction of the sheet remains?`, fractionAnswer(c - a, b + c)),
    ],
  });

  sets.push({
    title: `Lesson 6: Converting Between Decimals & Fractions ${setNo}`,
    items: [
      questionItem(`Convert ${cleanDecimal(tenths / 10)} to a fraction in simplest form.`, fractionAnswer(tenths, 10)),
      questionItem(`Convert ${cleanDecimal(hundredths / 100)} to a fraction in simplest form.`, fractionAnswer(hundredths, 100)),
      questionItem(`Convert ${fractionDecimalNumerator}/${fractionDecimalDenominator} to a decimal.`, decimalAnswerVariants(fractionDecimalNumerator / fractionDecimalDenominator, 4)),
      questionItem(`Which is larger: ${cleanDecimal(tenths / 10)} or ${fractionDecimalNumerator}/${fractionDecimalDenominator}?`, (tenths / 10) >= (fractionDecimalNumerator / fractionDecimalDenominator) ? cleanDecimal(tenths / 10) : `${fractionDecimalNumerator}/${fractionDecimalDenominator}`),
      questionItem(`Add ${cleanDecimal(tenths / 10)} + ${a}/10.`, decimalAnswerVariants((tenths + a) / 10, 3)),
    ],
  });

  sets.push({
    title: `Lesson 7: Converting Between Percentages And Fractions ${setNo}`,
    items: [
      questionItem(`Write ${percentA}% as a fraction in simplest form.`, fractionAnswer(percentA, 100)),
      questionItem(`Write ${fractionDecimalNumerator}/${fractionDecimalDenominator} as a percentage.`, percentAnswerVariants((fractionDecimalNumerator / fractionDecimalDenominator) * 100, 2)),
      questionItem(`What percentage is ${a} out of ${a + b}?`, percentAnswerVariants((a / (a + b)) * 100, 2)),
      questionItem(`Write ${percentB}% as a fraction in simplest form.`, fractionAnswer(percentB * 10, 1000)),
      questionItem(`${a * 2} students out of ${2 * (a + b)} finished early. What percentage finished early?`, percentAnswerVariants((a / (a + b)) * 100, 2)),
    ],
  });

  sets.push({
    title: `Lesson 8: Converting Between Percentages And Decimals ${setNo}`,
    items: [
      questionItem(`Write ${percentA}% as a decimal.`, decimalAnswerVariants(percentA / 100, 4)),
      questionItem(`Write ${cleanDecimal(tenths / 10)} as a percentage.`, percentAnswerVariants(tenths * 10, 2)),
      questionItem(`Write ${percentB}% as a decimal.`, decimalAnswerVariants(percentB / 100, 4)),
      questionItem(`Write ${cleanDecimal(hundredths / 100)} as a percentage.`, percentAnswerVariants(hundredths, 2)),
      questionItem(`A calculator needs the multiplier for an increase of ${percentB}%. What decimal multiplier should be used?`, decimalAnswerVariants(1 + percentB / 100, 4)),
    ],
  });

  sets.push({
    title: `Lesson 9: Percent Application Problems ${setNo}`,
    items: [
      questionItem(`Find ${applicationPercent}% of ${purchaseAmount}.`, decimalAnswerVariants((applicationPercent / 100) * purchaseAmount, 2)),
      questionItem(`${applicationPercent}% of what number is ${cleanDecimal((applicationPercent / 100) * purchaseAmount)}?`, String(purchaseAmount)),
      questionItem(`A ${money(purchaseAmount)} item is ${applicationPercent}% off. What is the sale price?`, moneyAnswerVariants(salePrice)),
      questionItem(`Add 13% HST to ${money(salePrice)}. What is the total?`, moneyAnswerVariants(salePrice * 1.13)),
      questionItem(`A score of ${purchaseAmount} increases by ${applicationPercent}%. What is the new score?`, decimalAnswerVariants(purchaseAmount * (1 + applicationPercent / 100), 2)),
    ],
  });

  sets.push({
    title: `Lesson 10: Ratios & Proportions ${setNo}`,
    items: [
      questionItem(`Simplify the ratio ${ratioA * 2}:${ratioB * 2}.`, ratioAnswer(ratioA * 2, ratioB * 2)),
      questionItem(`Complete the equivalent ratio ${ratioA}:${ratioB} = ${ratioA * ratioScale}:x.`, String(ratioB * ratioScale)),
      questionItem(`Solve the proportion ${ratioA}/${ratioB} = x/${ratioB * ratioScale}.`, String(ratioA * ratioScale)),
      questionItem(`A mix has red and blue counters in the ratio ${ratioA}:${ratioB}. If there are ${(ratioA + ratioB) * ratioScale} counters, how many are red?`, String(ratioA * ratioScale)),
      questionItem(`A recipe uses ${ratioA} cups concentrate for every ${ratioB} cups water. How many cups of water are needed for ${ratioA * ratioScale} cups concentrate?`, String(ratioB * ratioScale)),
    ],
  });

  sets.push({
    title: `Lesson 11: Rates ${setNo}`,
    items: [
      questionItem(`A cyclist travels ${distance} km in ${hours} hours. What is the speed in km/h?`, rateAnswer(speed, "km/h", 2)),
      questionItem(`${unitItems} notebooks cost ${money(unitTotal)}. What is the cost per notebook?`, moneyAnswerVariants(unitPrice)),
      questionItem(`A printer makes ${pagesPerMinute * printerMinutes} pages in ${printerMinutes} minutes. What is the rate in pages per minute?`, rateAnswer(pagesPerMinute, "pages/min", 2)),
      questionItem(`A tap fills ${d * 4} L in ${d} minutes. What is the rate in L/min?`, rateAnswer(4, "L/min", 2)),
      questionItem(`At ${speed} km/h, how far will a student travel in ${hours + 1} hours?`, rateAnswer(speed * (hours + 1), "km", 2)),
    ],
  });
}

function addMeasurementLessonSets(sets, setNo, values) {
  const { a, b, c, d } = values;
  const triples = [
    [3, 4, 5],
    [5, 12, 13],
    [6, 8, 10],
    [7, 24, 25],
    [8, 15, 17],
    [9, 12, 15],
    [9, 40, 41],
    [10, 24, 26],
    [12, 16, 20],
    [20, 21, 29],
  ];
  const [legA, legB, hypotenuse] = triples[setNo - 1];
  const numberWithUnit = (value, unit, decimals = 2) => {
    const numbers = decimalAnswerVariants(value, decimals);
    return [...numbers, ...numbers.map((number) => `${number} ${unit}`)];
  };
  const squareBase = setNo + 3;
  const cubeBase = setNo + 2;
  const regularSides = 5 + (setNo % 4);
  const regularSideLength = a + 3;
  const rectangleLength = a + 8;
  const rectangleWidth = b + 4;
  const irregularSides = [a + 3, b + 4, c + 2, d + 1, a + b + 1];
  const parallelogramBase = a + 7;
  const parallelogramHeight = b + 3;
  const triangleBase = b + 8;
  const triangleHeight = a + 5;
  const trapezoidTop = a + 6;
  const trapezoidBottom = c + 8;
  const trapezoidHeight = b + 2;
  const radius = setNo + 3;
  const diameter = radius * 2;
  const pi = 3.14;
  const bigRectLength = a + 10;
  const bigRectWidth = b + 7;
  const smallRectLength = a + 4;
  const smallRectWidth = b + 2;
  const cutSquare = a + 2;
  const gardenLength = a + 12;
  const gardenWidth = b + 6;
  const walkwayWidth = 2;
  const posterBase = a + 8;
  const posterHeight = b + 9;

  sets.push({
    title: `Unit 5 Lesson 0: Squares, Square Roots, Cubes, and Cube Roots ${setNo}`,
    items: [
      questionItem(`${squareBase}^2`, String(squareBase ** 2)),
      questionItem(`Square root of ${squareBase ** 2}`, String(squareBase)),
      questionItem(`${cubeBase}^3`, String(cubeBase ** 3)),
      questionItem(`Cube root of ${cubeBase ** 3}`, String(cubeBase)),
      questionItem(`A square has area ${a ** 2} cm^2. What is the side length?`, numberWithUnit(a, "cm", 0)),
    ],
  });

  sets.push({
    title: `Unit 5 Lesson 1: The Pythagorean Theorem Part 1 (Solving For The Hypotenuse) ${setNo}`,
    items: [
      questionItem(`A right triangle has legs ${legA} cm and ${legB} cm. Find the hypotenuse.`, numberWithUnit(hypotenuse, "cm", 0)),
      questionItem(`Find c: ${a + 5}^2 + ${b + 6}^2 = c^2. Round c to one decimal place.`, numberWithUnit(Math.sqrt((a + 5) ** 2 + (b + 6) ** 2), "cm", 1)),
      questionItem(`A rectangle is ${legA} m by ${legB} m. What is the diagonal length?`, numberWithUnit(hypotenuse, "m", 0)),
      questionItem(`A right triangle has legs ${a + 4} units and ${c + 6} units. Find the hypotenuse to one decimal place.`, numberWithUnit(Math.sqrt((a + 4) ** 2 + (c + 6) ** 2), "units", 1)),
      questionItem(`A ramp rises ${legA} m and runs ${legB} m along the ground. How long is the ramp?`, numberWithUnit(hypotenuse, "m", 0)),
    ],
  });

  sets.push({
    title: `Unit 5 Lesson 2: The Pythagorean Theorem Part 2 (Solving For The Non-Hypotenuse Sides) ${setNo}`,
    items: [
      questionItem(`A right triangle has hypotenuse ${hypotenuse} cm and one leg ${legA} cm. Find the other leg.`, numberWithUnit(legB, "cm", 0)),
      questionItem(`A ladder is ${hypotenuse} m long. Its base is ${legA} m from the wall. How high does it reach?`, numberWithUnit(legB, "m", 0)),
      questionItem(`Solve for a: a^2 + ${legB}^2 = ${hypotenuse}^2.`, numberWithUnit(legA, "units", 0)),
      questionItem(`A right triangle has hypotenuse ${a + 12} and one leg ${a + 5}. Find the other leg to one decimal place.`, numberWithUnit(Math.sqrt((a + 12) ** 2 - (a + 5) ** 2), "units", 1)),
      questionItem(`A TV screen diagonal is ${hypotenuse} inches and the height is ${legB} inches. What is the width?`, numberWithUnit(legA, "inches", 0)),
    ],
  });

  sets.push({
    title: `Unit 5 Lesson 3: The Pythagorean Theorem Part 3 (Checking To See If A Triangle Is A Right-Triangle) ${setNo}`,
    items: [
      questionItem(`Do side lengths ${legA}, ${legB}, and ${hypotenuse} make a right triangle?`, ["yes", "right", "right triangle"]),
      questionItem(`Do side lengths ${legA}, ${legB}, and ${hypotenuse + 1} make a right triangle?`, ["no", "not right", "not a right triangle"]),
      questionItem(`Which side should be tested as the hypotenuse for side lengths ${a + 6}, ${b + 8}, and ${c + 10}?`, String(Math.max(a + 6, b + 8, c + 10))),
      questionItem(`Check ${legA}^2 + ${legB}^2. What value should it equal for a right triangle?`, String(hypotenuse ** 2)),
      questionItem(`A triangle has sides ${a + 3}, ${b + 4}, and ${c + 8}. Is it a right triangle?`, ((a + 3) ** 2 + (b + 4) ** 2 === (c + 8) ** 2) ? ["yes", "right"] : ["no", "not right"]),
    ],
  });

  sets.push({
    title: `Unit 5 Lesson 4: Solving Word Problems Using The Pythagorean Theorem ${setNo}`,
    items: [
      questionItem(`A park is ${legA} km east and ${legB} km north of a school. What is the straight-line distance?`, numberWithUnit(hypotenuse, "km", 0)),
      questionItem(`A support wire is ${hypotenuse} m long and attached ${legA} m from a pole. How high up the pole is it attached?`, numberWithUnit(legB, "m", 0)),
      questionItem(`A rectangular field is ${a + 11} m by ${b + 9} m. Find the diagonal to one decimal place.`, numberWithUnit(Math.sqrt((a + 11) ** 2 + (b + 9) ** 2), "m", 1)),
      questionItem(`A drone flies ${legA} m east and ${legB} m north. How far is it from where it started?`, numberWithUnit(hypotenuse, "m", 0)),
      questionItem(`A ramp is ${hypotenuse} m long and reaches a platform ${legB} m high. How far is the base from the platform?`, numberWithUnit(legA, "m", 0)),
    ],
  });

  sets.push({
    title: `Unit 5 Lesson 5: Perimeter Of Regular And Irregular Shapes ${setNo}`,
    items: [
      questionItem(`Find the perimeter of a regular ${regularSides}-sided shape with side length ${regularSideLength} cm.`, numberWithUnit(regularSides * regularSideLength, "cm", 0)),
      questionItem(`Find the perimeter of a rectangle ${rectangleLength} m by ${rectangleWidth} m.`, numberWithUnit(2 * (rectangleLength + rectangleWidth), "m", 0)),
      questionItem(`Find the perimeter of an irregular shape with side lengths ${irregularSides.join(", ")} cm.`, numberWithUnit(irregularSides.reduce((sum, side) => sum + side, 0), "cm", 0)),
      questionItem(`A square has perimeter ${4 * squareBase} cm. What is each side length?`, numberWithUnit(squareBase, "cm", 0)),
      questionItem(`A regular octagon has perimeter ${8 * (a + 4)} cm. What is one side length?`, numberWithUnit(a + 4, "cm", 0)),
    ],
  });

  sets.push({
    title: `Unit 5 Lesson 6: Area Of Rectangles, Parallelograms, Triangles and Trapezoids ${setNo}`,
    items: [
      questionItem(`Find the area of a rectangle ${rectangleLength} cm by ${rectangleWidth} cm.`, numberWithUnit(rectangleLength * rectangleWidth, "cm^2", 0)),
      questionItem(`Find the area of a parallelogram with base ${parallelogramBase} m and height ${parallelogramHeight} m.`, numberWithUnit(parallelogramBase * parallelogramHeight, "m^2", 0)),
      questionItem(`Find the area of a triangle with base ${triangleBase} cm and height ${triangleHeight} cm.`, numberWithUnit((triangleBase * triangleHeight) / 2, "cm^2", 1)),
      questionItem(`Find the area of a trapezoid with bases ${trapezoidTop} cm and ${trapezoidBottom} cm and height ${trapezoidHeight} cm.`, numberWithUnit(((trapezoidTop + trapezoidBottom) / 2) * trapezoidHeight, "cm^2", 1)),
      questionItem(`A parallelogram has area ${parallelogramBase * parallelogramHeight} m^2 and base ${parallelogramBase} m. What is the height?`, numberWithUnit(parallelogramHeight, "m", 0)),
    ],
  });

  sets.push({
    title: `Unit 5 Lesson 7: Circumference (Perimeter) Of A Circle ${setNo}`,
    items: [
      questionItem(`Use 3.14. Find the circumference of a circle with radius ${radius} cm.`, numberWithUnit(2 * pi * radius, "cm", 2)),
      questionItem(`Use 3.14. Find the circumference of a circle with diameter ${diameter} m.`, numberWithUnit(pi * diameter, "m", 2)),
      questionItem(`A circular track has radius ${radius + 2} m. What is one lap around the track? Use 3.14.`, numberWithUnit(2 * pi * (radius + 2), "m", 2)),
      questionItem(`A circle has circumference ${formatNumber(pi * diameter, 2)} cm and diameter ${diameter} cm. What value of pi is being used?`, "3.14"),
      questionItem(`Use 3.14. A wheel has diameter ${diameter + 4} cm. How far does it travel in one full turn?`, numberWithUnit(pi * (diameter + 4), "cm", 2)),
    ],
  });

  sets.push({
    title: `Unit 5 Lesson 8: Area Of A Circle ${setNo}`,
    items: [
      questionItem(`Use 3.14. Find the area of a circle with radius ${radius} cm.`, numberWithUnit(pi * radius ** 2, "cm^2", 2)),
      questionItem(`Use 3.14. Find the area of a circle with diameter ${diameter} m.`, numberWithUnit(pi * (diameter / 2) ** 2, "m^2", 2)),
      questionItem(`A circular garden has radius ${radius + 1} m. What is its area? Use 3.14.`, numberWithUnit(pi * (radius + 1) ** 2, "m^2", 2)),
      questionItem(`A circle has area ${formatNumber(pi * radius ** 2, 2)} cm^2. If pi is 3.14, what is r^2?`, String(radius ** 2)),
      questionItem(`A circular sticker has radius ${a + 2} cm. What is its area using 3.14?`, numberWithUnit(pi * (a + 2) ** 2, "cm^2", 2)),
    ],
  });

  sets.push({
    title: `Unit 5 Lesson 9: Area Of Compound Shapes ${setNo}`,
    items: [
      questionItem(`A compound shape is made from a ${bigRectLength} cm by ${bigRectWidth} cm rectangle and a ${smallRectLength} cm by ${smallRectWidth} cm rectangle. Find the total area.`, numberWithUnit(bigRectLength * bigRectWidth + smallRectLength * smallRectWidth, "cm^2", 0)),
      questionItem(`A ${bigRectLength} m by ${bigRectWidth} m rectangle has a ${cutSquare} m by ${cutSquare} m square cut out. Find the remaining area.`, numberWithUnit(bigRectLength * bigRectWidth - cutSquare ** 2, "m^2", 0)),
      questionItem(`A shape is a ${posterBase} cm by ${posterHeight} cm rectangle with a triangle on top. The triangle has base ${posterBase} cm and height ${a + 5} cm. Find the total area.`, numberWithUnit(posterBase * posterHeight + (posterBase * (a + 5)) / 2, "cm^2", 1)),
      questionItem(`A compound shape has areas ${rectangleLength * rectangleWidth} cm^2, ${smallRectLength * smallRectWidth} cm^2, and ${triangleBase * triangleHeight / 2} cm^2. Find the total area.`, numberWithUnit(rectangleLength * rectangleWidth + smallRectLength * smallRectWidth + (triangleBase * triangleHeight) / 2, "cm^2", 1)),
      questionItem(`A rectangle ${bigRectLength} cm by ${bigRectWidth} cm has two ${cutSquare} cm by ${cutSquare} cm squares removed. Find the remaining area.`, numberWithUnit(bigRectLength * bigRectWidth - 2 * cutSquare ** 2, "cm^2", 0)),
    ],
  });

  sets.push({
    title: `Unit 5 Lesson 10: Area And Perimeter Word Problems ${setNo}`,
    items: [
      questionItem(`A garden is ${gardenLength} m by ${gardenWidth} m. How much fencing is needed around it?`, numberWithUnit(2 * (gardenLength + gardenWidth), "m", 0)),
      questionItem(`The same garden is ${gardenLength} m by ${gardenWidth} m. What is its area?`, numberWithUnit(gardenLength * gardenWidth, "m^2", 0)),
      questionItem(`A poster is ${posterBase} cm wide and ${posterHeight} cm tall. Find its perimeter.`, numberWithUnit(2 * (posterBase + posterHeight), "cm", 0)),
      questionItem(`A walkway ${walkwayWidth} m wide surrounds a ${gardenLength} m by ${gardenWidth} m rectangular garden. What is the area of the walkway?`, numberWithUnit((gardenLength + 2 * walkwayWidth) * (gardenWidth + 2 * walkwayWidth) - gardenLength * gardenWidth, "m^2", 0)),
      questionItem(`A triangular sign has base ${triangleBase} cm and height ${triangleHeight} cm. It also has side lengths ${legA} cm, ${legB} cm, and ${hypotenuse} cm. Find its area.`, numberWithUnit((triangleBase * triangleHeight) / 2, "cm^2", 1)),
    ],
  });
}

function addAlgebraLessonSets(sets, setNo, values) {
  const { a, b, c, d } = values;
  const x = setNo + 3;
  const oneStepTotal = a + c;
  const twoStepA = a * x + b;
  const twoStepB = b * x - a;
  const multistepSub = c * x - (a * x + b);
  const multistepSubTwo = c * x - (b * x - a);
  const taxiTotal = b + a * x;
  const packTotal = c * x + d;
  const perimeter = 2 * ((x + a) + x);

  sets.push({
    title: `Lesson 1: Introduction To Algebra And Evaluating Algebraic Expressions ${setNo}`,
    items: [
      questionItem(`Evaluate ${a}x + ${b} when x = ${c}.`, String(a * c + b)),
      questionItem(`Evaluate ${a}p - ${b} when p = ${d}.`, String(a * d - b)),
      questionItem(`Evaluate ${c}(n + ${b}) when n = ${a}.`, String(c * (a + b))),
      questionItem(`Write an algebraic expression for ${a} more than a number n.`, [`n+${a}`, `n + ${a}`, `${a}+n`, `${a} + n`]),
      questionItem(`If s = ${d}, evaluate s^2 + ${b}.`, String(d ** 2 + b)),
    ],
  });

  sets.push({
    title: `Lesson 2: Collecting Like Terms (Simplifying) ${setNo}`,
    items: [
      questionItem(`Simplify ${a}x + ${b}x.`, `${a + b}x`),
      questionItem(`Simplify ${a}m + ${b} + ${c}m + ${d}.`, [`${a + c}m+${b + d}`, `${a + c}m + ${b + d}`]),
      questionItem(`Simplify ${d}y - ${a}y + ${b}.`, [`${d - a}y+${b}`, `${d - a}y + ${b}`]),
      questionItem(`Simplify ${a}p + ${b}q + ${c}p.`, [`${a + c}p+${b}q`, `${a + c}p + ${b}q`, `${b}q+${a + c}p`, `${b}q + ${a + c}p`]),
      questionItem(`Simplify ${c}x + ${b} - ${a}x + ${d}.`, [`${c - a}x+${b + d}`, `${c - a}x + ${b + d}`]),
    ],
  });

  sets.push({
    title: `Lesson 3: Distributing Or Expanding In Algebra ${setNo}`,
    items: [
      questionItem(`Expand ${a}(x + ${b}).`, [`${a}x+${a * b}`, `${a}x + ${a * b}`]),
      questionItem(`Expand ${b}(n - ${a}).`, [`${b}n-${a * b}`, `${b}n - ${a * b}`]),
      questionItem(`Expand ${a}(${b}x + ${c}).`, [`${a * b}x+${a * c}`, `${a * b}x + ${a * c}`]),
      questionItem(`Expand ${c}(y - ${b}).`, [`${c}y-${b * c}`, `${c}y - ${b * c}`]),
      questionItem(`Expand ${d}(${a}k + ${b}).`, [`${a * d}k+${b * d}`, `${a * d}k + ${b * d}`]),
    ],
  });

  sets.push({
    title: `Lesson 4: Expanding And Collecting Like Terms ${setNo}`,
    items: [
      questionItem(`Simplify ${a}(x + ${b}) + ${c}x.`, [`${a + c}x+${a * b}`, `${a + c}x + ${a * b}`]),
      questionItem(`Simplify ${b}(x - ${a}) + ${a * b + c}.`, [`${b}x+${c}`, `${b}x + ${c}`]),
      questionItem(`Simplify ${a}(${b}x + ${c}) - ${d}x.`, [`${a * b - d}x+${a * c}`, `${a * b - d}x + ${a * c}`]),
      questionItem(`Simplify ${c}(x + ${a}) - ${b}(x - ${d}).`, [`${c - b}x+${c * a + b * d}`, `${c - b}x + ${c * a + b * d}`]),
      questionItem(`Simplify ${a}x + ${b}(x + ${c}) + ${d}.`, [`${a + b}x+${b * c + d}`, `${a + b}x + ${b * c + d}`]),
    ],
  });

  sets.push({
    title: `Lesson 5: Solving One-Step Equations ${setNo}`,
    items: [
      questionItem(`x + ${a} = ${oneStepTotal}`, variableAnswers("x", c)),
      questionItem(`x - ${b} = ${d}`, variableAnswers("x", b + d)),
      questionItem(`${a}x = ${a * c}`, variableAnswers("x", c)),
      questionItem(`x / ${b} = ${c}`, variableAnswers("x", b * c)),
      questionItem(`${d} = x - ${a}`, variableAnswers("x", d + a)),
    ],
  });

  sets.push({
    title: `Lesson 6: Solving Two-Step Equations ${setNo}`,
    items: [
      questionItem(`${a}x + ${b} = ${twoStepA}`, variableAnswers("x", x)),
      questionItem(`${b}x - ${a} = ${twoStepB}`, variableAnswers("x", x)),
      questionItem(`${a} + ${b}x = ${a + b * x}`, variableAnswers("x", x)),
      questionItem(`${a}(x + ${b}) = ${a * (x + b)}`, variableAnswers("x", x)),
      questionItem(`${c}x + ${d} = ${c * x + d}`, variableAnswers("x", x)),
    ],
  });

  sets.push({
    title: `Lesson 7: Solving Multistep Equations ${setNo}`,
    items: [
      questionItem(`${a}x + ${b} = ${c}x - ${multistepSub}`, variableAnswers("x", x)),
      questionItem(`${a}(x + ${b}) = ${a * (x + b)}`, variableAnswers("x", x)),
      questionItem(`${a}(x + ${b}) + ${c} = ${a * (x + b) + c}`, variableAnswers("x", x)),
      questionItem(`${b}x - ${a} = ${c}x - ${multistepSubTwo}`, variableAnswers("x", x)),
      questionItem(`${a}(x + ${b}) - ${c} = ${a * (x + b) - c}`, variableAnswers("x", x)),
    ],
  });

  sets.push({
    title: `Lesson 8: Words Into Algebra - Writing Equations ${setNo}`,
    items: [
      questionItem(`Write an expression for ${a} more than a number n.`, [`n+${a}`, `n + ${a}`, `${a}+n`, `${a} + n`]),
      questionItem(`Write an expression for ${b} times a number x decreased by ${c}.`, [`${b}x-${c}`, `${b}x - ${c}`]),
      questionItem(`Write an equation: a number x plus ${a} is ${oneStepTotal}.`, [`x+${a}=${oneStepTotal}`, `x + ${a} = ${oneStepTotal}`]),
      questionItem(`Write an equation: ${c} times n is ${c * d}.`, [`${c}n=${c * d}`, `${c}n = ${c * d}`, `${c}*n=${c * d}`]),
      questionItem(`Write an expression for half of a number y plus ${d}.`, [`y/2+${d}`, `y / 2 + ${d}`, `0.5y+${d}`, `0.5y + ${d}`]),
    ],
  });

  sets.push({
    title: `Lesson 9: Algebra Word Problems Part 1 ${setNo}`,
    items: [
      questionItem(`A number plus ${a} is ${oneStepTotal}. What is the number?`, String(c)),
      questionItem(`A student has ${d} stickers after giving away ${b}. How many stickers did the student start with?`, String(b + d)),
      questionItem(`${c} identical packs contain ${c * d} markers total. How many markers are in each pack?`, String(d)),
      questionItem(`A number multiplied by ${a} equals ${a * b}. What is the number?`, String(b)),
      questionItem(`A bank balance changes by ${a * 5} dollars and ends at ${a * 5 + c}. What was the starting balance?`, String(c)),
    ],
  });

  sets.push({
    title: `Lesson 10: Solving Algebra Word Problems Part 2 ${setNo}`,
    items: [
      questionItem(`A taxi charges ${money(b)} plus ${money(a)} per km. The total is ${money(taxiTotal)}. How many km was the trip?`, variableAnswers("x", x)),
      questionItem(`${c} bags and ${d} loose counters make ${packTotal} counters. How many counters are in each bag?`, variableAnswers("x", x)),
      questionItem(`A movie ticket fee is ${money(b)} plus ${money(a)} per student. The total is ${money(taxiTotal)}. How many students went?`, variableAnswers("x", x)),
      questionItem(`A number is multiplied by ${b}, then ${a} is subtracted. The result is ${twoStepB}. What is the number?`, variableAnswers("x", x)),
      questionItem(`A pattern starts at ${d} and increases by ${c} each step. Which step has value ${c * x + d}?`, variableAnswers("x", x)),
    ],
  });

  sets.push({
    title: `Lesson 11: Solving Algebra Word Problems Part 3 ${setNo}`,
    items: [
      questionItem(`Plan A costs ${money(b)} plus ${money(a)} per month. Plan B costs ${money(c)} per month with a ${money(multistepSub)} discount. Solve ${a}x + ${b} = ${c}x - ${multistepSub}.`, variableAnswers("x", x)),
      questionItem(`A rectangle has width x and length x + ${a}. Its perimeter is ${perimeter}. Find x.`, variableAnswers("x", x)),
      questionItem(`A student has ${a}(x + ${b}) - ${c} points and ends with ${a * (x + b) - c} points. Find x.`, variableAnswers("x", x)),
      questionItem(`${b} groups of x tickets minus ${a} tickets equals ${c} groups of x tickets minus ${multistepSubTwo} tickets. Find x.`, variableAnswers("x", x)),
      questionItem(`Two equal teams and ${a} extra students make ${2 * x + a} students. Solve 2x + ${a} = ${2 * x + a}.`, variableAnswers("x", x)),
    ],
  });
}

function addFinancialLiteracyLessonSets(sets, setNo, values) {
  const { a, b, c, d } = values;
  const taxRate = 0.13;
  const discountPercent = 10 + (setNo % 5) * 5;
  const tipPercent = 12 + (setNo % 4) * 3;
  const increasePercent = 4 + (setNo % 5) * 2;
  const itemPrice = 28 + setNo * 6;
  const mealPrice = 36 + setNo * 4;
  const phonePrice = 120 + setNo * 15;
  const grocerySubtotal = 45 + setNo * 7;
  const salePrice = itemPrice * (1 - discountPercent / 100);
  const hstTotal = itemPrice * (1 + taxRate);
  const mealTip = mealPrice * tipPercent / 100;
  const increasedPhone = phonePrice * (1 + increasePercent / 100);

  const principal = 200 + setNo * 75;
  const simpleRate = 3 + (setNo % 5);
  const years = 1 + (setNo % 4);
  const simpleInterest = principal * simpleRate / 100 * years;
  const loanPrincipal = 500 + setNo * 80;
  const loanRate = 4 + (setNo % 4);
  const loanYears = 2 + (setNo % 3);
  const loanInterest = loanPrincipal * loanRate / 100 * loanYears;

  const compoundPrincipal = 300 + setNo * 60;
  const compoundRate = 2 + (setNo % 5);
  const compoundYears = 2 + (setNo % 4);
  const compoundAmount = compoundPrincipal * ((1 + compoundRate / 100) ** compoundYears);
  const compoundInterest = compoundAmount - compoundPrincipal;
  const matchingSimpleInterest = compoundPrincipal * compoundRate / 100 * compoundYears;
  const compoundExtra = compoundInterest - matchingSimpleInterest;

  const monthlyIncome = 900 + setNo * 125;
  const rent = 360 + setNo * 45;
  const food = 140 + setNo * 12;
  const transit = 75 + setNo * 6;
  const phone = 35 + setNo * 3;
  const savingsPercent = 10 + (setNo % 4) * 5;
  const savings = monthlyIncome * savingsPercent / 100;
  const moneyLeft = monthlyIncome - rent - food - transit - phone - savings;
  const goal = 240 + setNo * 60;
  const weeks = 6 + setNo;
  const weeklyNeeded = goal / weeks;

  sets.push({
    title: `Unit 3 Lesson 1: Consumer Math - Percents Working Forward ${setNo}`,
    items: [
      questionItem(`A backpack costs ${money(itemPrice)}. Add 13% HST. What is the total cost?`, moneyAnswerVariants(hstTotal)),
      questionItem(`A ${money(itemPrice)} sweater is ${discountPercent}% off. What is the sale price before tax?`, moneyAnswerVariants(salePrice)),
      questionItem(`A restaurant bill is ${money(mealPrice)}. What is a ${tipPercent}% tip?`, moneyAnswerVariants(mealTip)),
      questionItem(`A phone plan costs ${money(phonePrice)} and increases by ${increasePercent}%. What is the new price?`, moneyAnswerVariants(increasedPhone)),
      questionItem(`A grocery subtotal is ${money(grocerySubtotal)}. Add 13% HST. What is the total?`, moneyAnswerVariants(grocerySubtotal * 1.13)),
    ],
  });

  sets.push({
    title: `Unit 3 Lesson 2: Simple Interest ${setNo}`,
    items: [
      questionItem(`Use I = P x r x t. Find the simple interest on ${money(principal)} at ${simpleRate}% for ${years} years.`, moneyAnswerVariants(simpleInterest)),
      questionItem(`A savings account has ${money(principal)} at ${simpleRate}% simple interest for ${years} years. What is the final balance?`, moneyAnswerVariants(principal + simpleInterest)),
      questionItem(`A loan of ${money(loanPrincipal)} has ${loanRate}% simple interest for ${loanYears} years. How much interest is paid?`, moneyAnswerVariants(loanInterest)),
      questionItem(`A student invests ${money(principal + 100)} at ${simpleRate + 1}% simple interest for 1 year. How much interest is earned?`, moneyAnswerVariants((principal + 100) * (simpleRate + 1) / 100)),
      questionItem(`A simple interest calculator uses principal ${money(loanPrincipal)}, rate ${loanRate}%, and time ${loanYears}. What total amount should it output?`, moneyAnswerVariants(loanPrincipal + loanInterest)),
    ],
  });

  sets.push({
    title: `Unit 3 Lesson 3: Compound Interest ${setNo}`,
    items: [
      questionItem(`Use A = P(1 + r)^t. Find the amount after ${compoundYears} years for ${money(compoundPrincipal)} at ${compoundRate}% compounded yearly. Round to cents.`, moneyAnswerVariants(compoundAmount)),
      questionItem(`For ${money(compoundPrincipal)} at ${compoundRate}% compounded yearly for ${compoundYears} years, how much compound interest is earned?`, moneyAnswerVariants(compoundInterest)),
      questionItem(`A savings app starts with ${money(compoundPrincipal + 50)} and grows by ${compoundRate}% for 2 years. What is the balance?`, moneyAnswerVariants((compoundPrincipal + 50) * ((1 + compoundRate / 100) ** 2))),
      questionItem(`Compare ${money(compoundPrincipal)} at ${compoundRate}% for ${compoundYears} years. How much more interest does compound interest earn than simple interest?`, moneyAnswerVariants(compoundExtra)),
      questionItem(`A coding calculator sets balance = ${money(compoundPrincipal)} * (1 + ${compoundRate}/100)^${compoundYears}. What balance should it display?`, moneyAnswerVariants(compoundAmount)),
    ],
  });

  sets.push({
    title: `Unit 3 Lesson 4: Budget Assignment + Coding Calculator ${setNo}`,
    items: [
      questionItem(`Monthly income is ${money(monthlyIncome)}. Expenses are rent ${money(rent)}, food ${money(food)}, transit ${money(transit)}, and phone ${money(phone)}. How much is left before savings?`, moneyAnswerVariants(monthlyIncome - rent - food - transit - phone)),
      questionItem(`A budget saves ${savingsPercent}% of ${money(monthlyIncome)} income. How much is saved?`, moneyAnswerVariants(savings)),
      questionItem(`After rent, food, transit, phone, and ${savingsPercent}% savings, how much money is left from ${money(monthlyIncome)}?`, moneyAnswerVariants(moneyLeft)),
      questionItem(`A coding calculator uses income = ${monthlyIncome}, expenses = ${rent + food + transit + phone}, savings = ${cleanDecimal(savings)}. What is income - expenses - savings?`, moneyAnswerVariants(moneyLeft)),
      questionItem(`A student wants to save ${money(goal)} in ${weeks} weeks. How much should the budget calculator save each week?`, moneyAnswerVariants(weeklyNeeded)),
    ],
  });
}

function buildGrade7QuestionSets() {
  const bank = Object.fromEntries(grade7QuestionTopics.map((topic) => [topic, []]));

  for (let i = 0; i < 10; i += 1) {
    const setNo = i + 1;
    const a = i + 2;
    const b = i + 3;
    const c = i + 4;
    const d = i + 5;

    addNumberSenseLessonSets(bank[UNIT_NUMBER_SENSE], setNo, { a, b, c, d });
    addFractionsDecimalsPercentsLessonSets(bank[UNIT_RATIOS_RATES], setNo, { a, b, c, d });

    addAlgebraLessonSets(bank[UNIT_ALGEBRA], setNo, { a, b, c, d });
    addMeasurementLessonSets(bank[UNIT_MEASUREMENT], setNo, { a, b, c, d });

    addFinancialLiteracyLessonSets(bank[UNIT_FINANCIAL], setNo, { a, b, c, d });
  }

  return bank;
}

function weeklySave(setNo) {
  return 5 + setNo * 1.5;
}

function registerQuestionSetAnswers(bank) {
  for (const sets of Object.values(bank)) {
    for (const set of sets) {
      for (const item of set.items) {
        answerKey[item.q] = item.answers;
      }
    }
  }
}

function setRole(role) {
  if (state.auth.user && role !== state.auth.user.role) return;
  state.role = role;
  state.page = rolePages[role][0];
  render();
}

function setPage(page) {
  if (!rolePages[state.role]?.includes(page)) return;
  state.page = page;
  render();
  if (page === "Messages" || page === "Teacher Messages") {
    loadMessages().then(render);
  }
  if (page === "Lessons" || page === "Upload Lesson") {
    loadLessons().then(render);
  }
  if (page === "Upload Lesson" || page === "Create Assignment") {
    loadMaterials().then(render);
  }
  if (page === "Homework" || page === "Create Assignment" || page === "Teacher Dashboard" || page === "Parent Dashboard" || page === "Homework Status") {
    loadAssignments().then(() => loadWork()).then(render);
  }
  if (page === "Homework") {
    loadSystemInfo().then(render);
  }
  if (page === "Student Submissions") {
    loadAssignments().then(() => loadSubmissions()).then(render);
  }
  if (page === "Teacher Dashboard") {
    loadSubmissions().then(render);
  }
  if (page === "Attendance") {
    loadAttendance().then(render);
  }
}

function render() {
  const app = document.querySelector("#app");
  if (state.auth.checking) {
    app.innerHTML = renderAuthShell(renderCheckingAuth());
    return;
  }
  if (!state.auth.authenticated) {
    app.innerHTML = renderAuthShell(renderLogin());
    return;
  }
  ensureRolePage();
  const activeBridgeAssignment = state.role === "student" ? currentBridgeSpaceAssignment() : null;
  if (activeBridgeAssignment) {
    app.innerHTML = renderBridgeSpaceExperience(activeBridgeAssignment);
    requestAnimationFrame(() => {
      initWorkCanvas();
    });
    return;
  }
  app.innerHTML = `
    <div class="app-shell">
      ${renderSidebar()}
      <main class="main">
        ${renderTopbar()}
        <div class="workspace">${renderPage()}</div>
      </main>
    </div>
  `;
  requestAnimationFrame(() => {
    drawGraph();
    initWorkCanvas();
  });
}

function renderAuthShell(content) {
  return `
    <main class="auth-shell">
      <section class="auth-card">
        <div class="auth-panel">
          <div class="brand auth-brand">
            <div class="brand-mark">MB</div>
            <div>
              <h1 class="brand-name">MathBridge</h1>
              <p class="brand-sub">Math classroom hub</p>
            </div>
          </div>
          <h2>${state.auth.mode === "signup" ? "Create your MathBridge account" : "Sign in to continue"}</h2>
          <p>New students, parents, and teachers can sign up. The app no longer starts with fake student accounts.</p>
          <div class="demo-account-list auth-mode-actions">
            <button class="demo-account ${state.auth.mode === "login" ? "active" : ""}" data-action="show-login">
              <strong>Login</strong>
              <span>Use an existing local account</span>
            </button>
            <button class="demo-account ${state.auth.mode === "signup" ? "active" : ""}" data-action="show-signup">
              <strong>Sign up</strong>
              <span>Create a new account</span>
            </button>
          </div>
        </div>
        ${content}
      </section>
    </main>
  `;
}

function renderCheckingAuth() {
  return `
    <div class="auth-form">
      <span class="pill amber">Checking session</span>
      <h2>Loading your workspace</h2>
      <p class="auth-muted">MathBridge is checking for an active local session.</p>
    </div>
  `;
}

function renderLogin() {
  if (state.auth.mode === "signup") return renderSignup();
  return `
    <form class="auth-form" data-auth-form>
      <div>
        <h2>Login</h2>
        <p class="auth-muted">Sessions are stored in an HTTP-only local cookie.</p>
      </div>
      ${state.auth.error ? `<div class="auth-error">${state.auth.error}</div>` : ""}
      <div class="field">
        <label for="auth-email">Email</label>
        <input id="auth-email" type="email" data-auth-field="email" value="${escapeHtml(state.auth.email)}" autocomplete="username" />
      </div>
      <div class="field">
        <label for="auth-password">Password</label>
        <input id="auth-password" type="password" data-auth-field="password" value="${escapeHtml(state.auth.password)}" autocomplete="current-password" />
      </div>
      <button class="btn primary" type="submit" data-action="login" ${state.auth.submitting ? "disabled" : ""}>
        ${state.auth.submitting ? "Signing in..." : "Sign in"}
      </button>
      <button class="btn" type="button" data-action="show-signup">Create account</button>
    </form>
  `;
}

function renderSignup() {
  return `
    <form class="auth-form" data-signup-form>
      <div>
        <h2>Sign up</h2>
        <p class="auth-muted">Create a student, parent, or teacher account.</p>
      </div>
      ${state.auth.error ? `<div class="auth-error">${state.auth.error}</div>` : ""}
      <div class="field">
        <label for="signup-name">Name</label>
        <input id="signup-name" data-auth-field="signupName" value="${escapeHtml(state.auth.signupName)}" autocomplete="name" />
      </div>
      <div class="field">
        <label for="signup-email">Email</label>
        <input id="signup-email" type="email" data-auth-field="signupEmail" value="${escapeHtml(state.auth.signupEmail)}" autocomplete="username" />
      </div>
      <div class="field">
        <label for="signup-password">Password</label>
        <input id="signup-password" type="password" data-auth-field="signupPassword" value="${escapeHtml(state.auth.signupPassword)}" autocomplete="new-password" />
      </div>
      <div class="field">
        <label for="signup-role">Account type</label>
        <select id="signup-role" data-auth-field="signupRole">
          ${["student", "teacher", "parent"].map((role) => `<option value="${role}" ${state.auth.signupRole === role ? "selected" : ""}>${capitalize(role)}</option>`).join("")}
        </select>
      </div>
      ${state.auth.signupRole === "parent"
        ? `<div class="field"><label for="signup-child">Child name</label><input id="signup-child" data-auth-field="signupChildName" value="${escapeHtml(state.auth.signupChildName)}" placeholder="Optional" /></div>`
        : ""}
      ${state.auth.signupRole === "student"
        ? `<div class="field"><label for="signup-class">Class</label><input id="signup-class" data-auth-field="signupClassName" value="${escapeHtml(state.auth.signupClassName)}" /></div>`
        : ""}
      <button class="btn primary" type="submit" data-action="signup" ${state.auth.submitting ? "disabled" : ""}>
        ${state.auth.submitting ? "Creating account..." : "Create account"}
      </button>
      <button class="btn" type="button" data-action="show-login">Back to login</button>
    </form>
  `;
}

function renderSidebar() {
  const pages = rolePages[state.role];
  const unreadMessages = unreadMessageCount();
  const dueSummary = assignmentDueSummary();
  const pendingSubmissions = pendingSubmissionCount();
  return `
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-mark">MB</div>
        <div>
          <h1 class="brand-name">MathBridge</h1>
          <p class="brand-sub">Math classroom hub</p>
        </div>
      </div>
      <div class="role-lock" aria-label="Signed in role">
        <span class="nav-icon">${pageIcons[pages[0]] || ">"}</span>
        <div>
          <strong>${capitalize(state.role)}</strong>
          <span>${state.auth.user?.email || ""}</span>
        </div>
      </div>
      <nav class="nav" aria-label="Main navigation">
        ${pages
          .map((page) => {
            const isMessagePage = messageNavPage(page);
            const messageUnread = isMessagePage && unreadMessages > 0;
            const attendanceAlert = page === "Attendance" && attendanceNeedsAttention();
            const assignmentAlert = assignmentNavPage(page) && dueSummary.count > 0;
            const submissionAlert = page === "Student Submissions" && pendingSubmissions > 0;
            const classes = [
              state.page === page ? "active" : "",
              attendanceAlert ? "attendance-alert" : "",
              messageUnread ? "message-alert" : "",
              assignmentAlert ? "assignment-alert" : "",
              submissionAlert ? "submission-alert" : "",
            ].filter(Boolean).join(" ");
            const ariaLabel = attendanceAlert
              ? `aria-label="Attendance, ${escapeHtml(attendanceReminderText())}"`
              : messageUnread
                ? `aria-label="${escapeHtml(page)}, ${unreadMessages} unread message${unreadMessages === 1 ? "" : "s"}"`
                : assignmentAlert
                  ? `aria-label="${escapeHtml(page)}, ${escapeHtml(dueSummary.label)}"`
                  : submissionAlert
                    ? `aria-label="Student Submissions, ${pendingSubmissions} waiting for review"`
                    : "";
            return `
              <button class="${classes}" data-page="${page}" ${ariaLabel}>
                <span class="nav-icon">${pageIcons[page] || ">"}</span>
                <span>${page}</span>
                ${attendanceAlert ? `<span class="nav-badge">${escapeHtml(attendanceReminderText())}</span>` : ""}
                ${messageUnread ? `<span class="nav-count-badge message-nav-badge">${unreadMessages}</span>` : ""}
                ${assignmentAlert ? `<span class="nav-badge assignment-nav-badge">${escapeHtml(dueSummary.label)}</span>` : ""}
                ${submissionAlert ? `<span class="nav-count-badge submission-nav-badge">${pendingSubmissions}</span>` : ""}
              </button>
            `;
          })
          .join("")}
      </nav>
      <div class="sidebar-footer">
        <strong>${sidebarTitle()}</strong>
        <span>${sidebarDetail()}</span>
      </div>
    </aside>
  `;
}

function renderTopbar() {
  return `
    <header class="topbar">
      <div>
        <h1>${state.page}</h1>
        <div class="context-row">
          <span class="pill green">${currentContext()}</span>
          <span class="pill">Unit: ${UNIT_ALGEBRA}</span>
          <span class="pill amber">Quiz Friday</span>
          ${attendanceNeedsAttention() ? `<span class="pill coral">Attendance: ${escapeHtml(attendanceReminderText())}</span>` : ""}
        </div>
      </div>
      <div class="topbar-actions">
        <div class="profile-chip">
          <div class="avatar">${profileInitials()}</div>
          <div>
            <strong>${profileName()}</strong>
            <span>${profileMeta()}</span>
          </div>
        </div>
        <button class="btn" data-action="logout">Logout</button>
      </div>
    </header>
  `;
}

function renderPage() {
  if (state.role === "student") return renderStudentPage();
  if (state.role === "teacher") return renderTeacherPage();
  return renderParentPage();
}

function renderStudentPage() {
  switch (state.page) {
    case "Homework":
      return renderHomeworkPage();
    case "Lessons":
      return renderLessonsPage();
    case "Practice":
      return renderPracticePage();
    case "Ask for Help":
      return renderAskHelpPage();
    case "Messages":
      return renderMessagesPage("student");
    case "Progress":
      return renderStudentProgressPage();
    case "Attendance":
      return renderAttendancePage();
    case "Formula Sheet":
      return renderFormulaSheetPage();
    case "Math Tools":
      return renderMathToolsPage();
    default:
      return renderStudentDashboard();
  }
}

function renderTeacherPage() {
  switch (state.page) {
    case "Create Assignment":
      return renderCreateAssignmentPage();
    case "Question Bank":
      return renderQuestionBankPage();
    case "Upload Lesson":
      return renderUploadLessonPage();
    case "Student Submissions":
      return renderSubmissionsPage();
    case "Class Progress":
      return renderClassProgressPage();
    case "Attendance":
      return renderAttendancePage();
    case "Messages":
      return renderMessagesPage("teacher");
    case "Announcements":
      return renderAnnouncementsPage();
    default:
      return renderTeacherDashboard();
  }
}

function renderParentPage() {
  let content;
  switch (state.page) {
    case "Homework Status":
      content = renderParentHomeworkPage();
      break;
    case "Progress Report":
      content = renderParentReportPage();
      break;
    case "Attendance":
      content = renderAttendancePage();
      break;
    case "Teacher Messages":
      content = renderMessagesPage("parent");
      break;
    case "Upcoming Tests":
      content = renderUpcomingTestsPage();
      break;
    default:
      content = renderParentDashboard();
  }
  return `${renderParentStudentSelector()}${content}`;
}

function renderParentStudentSelector() {
  const selected = selectedParentStudent();
  return `
    <section class="surface compact">
      <div class="section-head">
        <div>
          <h2>Student</h2>
          <p>${selected ? `Viewing ${escapeHtml(selected.name)}.` : "Enter your child's exact student account email. Student lists are hidden from parent accounts for privacy."}</p>
        </div>
        <div class="parent-link-controls">
          <div class="field parent-student-field">
            <label for="parent-student-email">Student account email</label>
            <input
              id="parent-student-email"
              type="text"
              inputmode="email"
              data-bind="parent.studentEmail"
              value="${escapeHtml(state.parent.studentEmail)}"
              placeholder="student@example.com"
              autocomplete="email"
            />
          </div>
          <div class="actions">
            <button class="btn primary" data-action="link-parent-student">Link child</button>
            ${selected ? `<button class="btn" data-action="clear-parent-student">Clear child</button>` : ""}
          </div>
        </div>
      </div>
      ${state.parent.notice ? `<div class="message-notice">${escapeHtml(state.parent.notice)}</div>` : ""}
    </section>
  `;
}

function renderAttendancePage() {
  if (state.role === "teacher") return renderTeacherAttendancePage();
  return renderReadOnlyAttendancePage();
}

function renderTeacherAttendancePage() {
  const records = teacherAttendanceRecords();
  const summary = attendanceSummary(records);
  return `
    ${renderTeacherClassSwitcher()}
    <section class="metric-row">
      ${metric("Present", String(summary.present), "students")}
      ${metric("Late", String(summary.late), "students")}
      ${metric("Absent", String(summary.absent), "students")}
      ${metric("Unmarked", String(summary.unmarked), "students")}
    </section>
    <section class="surface">
      <div class="section-head">
        <div>
          <h2>Daily Attendance</h2>
          <p>Mark attendance for students assigned to your class.</p>
        </div>
        <div class="field attendance-date-field">
          <label for="attendance-date">Date</label>
          <input id="attendance-date" type="date" data-bind="attendance.date" value="${escapeHtml(state.attendance.date)}" />
        </div>
      </div>
      ${state.attendance.notice ? `<div class="message-notice">${escapeHtml(state.attendance.notice)}</div>` : ""}
      ${records.length ? `
        <table class="table attendance-table" style="margin-top: 14px;">
          <thead><tr><th>Student</th><th>Status</th><th>Note</th><th>Mark</th></tr></thead>
          <tbody>
            ${records.map(renderTeacherAttendanceRow).join("")}
          </tbody>
        </table>
      ` : `<div class="empty" style="margin-top: 14px;">No students assigned to this class yet.</div>`}
    </section>
  `;
}

function renderTeacherAttendanceRow(record) {
  const student = record.student;
  const note = state.attendance.notes[student.id] ?? record.note ?? "";
  return `
    <tr>
      <td>
        <strong>${escapeHtml(student.name)}</strong><br>
        <span class="meta-line">${escapeHtml(student.email)}</span>
      </td>
      <td><span class="pill ${attendancePillClass(record.status)}">${attendanceLabel(record.status)}</span></td>
      <td>
        <input class="table-input" data-bind="attendance.notes.${student.id}" value="${escapeHtml(note)}" placeholder="Optional note" />
      </td>
      <td>
        <div class="attendance-actions">
          ${["present", "late", "absent", "excused"].map((status) => `
            <button class="btn ${record.status === status ? "primary" : ""}" data-action="mark-attendance" data-student-id="${escapeHtml(student.id)}" data-status="${status}">
              ${attendanceLabel(status)}
            </button>
          `).join("")}
        </div>
      </td>
    </tr>
  `;
}

function renderReadOnlyAttendancePage() {
  const record = state.attendance.records[0];
  if (state.role === "parent" && !state.parent.selectedStudentId) {
    return `
      <section class="surface">
        <h2>Attendance</h2>
        <p class="meta-line">Select a student above to view attendance.</p>
      </section>
    `;
  }
  return `
    <section class="surface">
      <div class="section-head">
        <div>
          <h2>Attendance</h2>
          <p>${record?.student ? `Viewing ${escapeHtml(record.student.name)}.` : "No attendance record available."}</p>
        </div>
        <div class="field attendance-date-field">
          <label for="attendance-date">Date</label>
          <input id="attendance-date" type="date" data-bind="attendance.date" value="${escapeHtml(state.attendance.date)}" />
        </div>
      </div>
      ${state.attendance.notice ? `<div class="message-notice">${escapeHtml(state.attendance.notice)}</div>` : ""}
      <div class="attendance-status-card">
        <span class="pill ${attendancePillClass(record?.status || "unmarked")}">${attendanceLabel(record?.status || "unmarked")}</span>
        <h3>${record?.student ? escapeHtml(record.student.name) : "Attendance not marked"}</h3>
        <p>${record?.note ? escapeHtml(record.note) : "No note from the teacher."}</p>
        <div class="assignment-meta">
          <span>${escapeHtml(state.attendance.date)}</span>
          ${record?.teacherName ? `<span>Marked by ${escapeHtml(record.teacherName)}</span>` : `<span>Waiting for teacher</span>`}
        </div>
      </div>
    </section>
  `;
}

function renderStudentDashboard() {
  const studentAssignments = getStudentAssignments();
  const stats = assignmentStats(studentAssignments);
  const today = studentAssignments.filter((item) => item.status === "Today");
  return `
    <section class="metric-row">
      ${metric("Today", String(stats.today), "assignments open")}
      ${metric("Homework", `${stats.completed}/${stats.total}`, "completed")}
      ${metric("Practice streak", "0", "days")}
      ${metric("Average", stats.average, "current unit")}
    </section>
    <section class="grid two">
      <div class="surface">
        <div class="section-head">
          <div>
            <h2>Today</h2>
            <p>No teacher-assigned homework yet.</p>
          </div>
          <button class="btn primary" data-page="Practice">Practice</button>
        </div>
        <div class="assignment-list" style="margin-top: 14px;">
          ${today.length ? today.map(renderStudentAssignmentCard).join("") : `<div class="empty">No assignments for today.</div>`}
        </div>
      </div>
      <div class="surface soft">
        <h2>Homework Checklist</h2>
        <div class="checklist" style="margin-top: 14px;">
          ${today[0] ? renderChecklist(today[0]) : `<div class="empty">No homework steps are open today.</div>`}
        </div>
      </div>
    </section>
    <section class="grid equal">
      ${renderTopicPerformance("Units to Watch", topicScoresForAssignments(studentAssignments))}
      <div class="surface">
        <div class="section-head">
          <div>
            <h2>Questions I Need to Review</h2>
            <p>Saved from recent practice and homework.</p>
          </div>
        </div>
        <ul class="question-list" style="margin-top: 14px;">
          ${renderReviewItems()}
        </ul>
      </div>
    </section>
    <section class="surface">
      <div class="section-head">
        <div>
          <h2>Upcoming</h2>
          <p>Teacher-assigned work will appear here after it is published.</p>
        </div>
      </div>
      <div class="calendar-strip" style="margin-top: 14px;">
        <div class="empty">No upcoming assignments.</div>
      </div>
    </section>
  `;
}

function renderHomeworkPage() {
  const studentAssignments = getStudentAssignments();
  const groups = ["Today", "Upcoming", "Missing", "Submitted", "Needs correction", "Completed"];
  return `
    ${renderWorkDevicePanel()}
    <section class="grid">
      ${groups
        .map((group) => {
          const list = studentAssignments.filter((item) => item.status === group);
          return `
            <div class="surface">
              <div class="section-head">
                <div>
                  <h2>${group}</h2>
                  <p>${list.length} assignment${list.length === 1 ? "" : "s"}</p>
                </div>
              </div>
              <div class="assignment-list" style="margin-top: 14px;">
                ${list.map(renderStudentAssignmentCard).join("") || `<div class="empty">No ${group.toLowerCase()} homework</div>`}
              </div>
            </div>
          `;
        })
        .join("")}
    </section>
  `;
}

function renderWorkDevicePanel() {
  const ipadUrl = state.system.lanUrls[0] || "http://your-mac-ip:8086";
  const localUrl = state.system.localUrl || "http://127.0.0.1:8086";
  const sharedUrl = state.system.publicUrl || (state.system.lanEnabled ? ipadUrl : localUrl);
  const ipadStatus = state.system.publicUrl || (state.system.lanEnabled ? ipadUrl : "Needs local network approval");
  const connectionReady = state.system.hosted || state.system.lanEnabled;
  return `
    <section class="surface ipad-work-panel">
      <div class="section-head">
        <div>
          <h2>iPad Work Pad</h2>
          <p>Open the same MathBridge link on iPad, then use Apple Pencil in Draw Work.</p>
        </div>
        <span class="pill ${connectionReady ? "green" : "amber"}">${state.system.hosted ? "Hosted" : state.system.lanEnabled ? "Pencil ready" : "Mac only"}</span>
      </div>
      <div class="assignment-meta ipad-links" style="margin-top: 12px;">
        <span>Shared link: ${escapeHtml(sharedUrl)}</span>
        <span>Mac: ${escapeHtml(localUrl)}</span>
        <span>iPad: ${escapeHtml(ipadStatus)}</span>
      </div>
    </section>
  `;
}

function renderLessonsPage() {
  const library = getLessonLibrary();
  const current = library[0] || lessons[0];
  return `
    <section class="grid two">
      <div class="surface">
        <div class="section-head">
          <div>
            <h2>Current Lesson</h2>
            <p>${escapeHtml(current.title)}.</p>
          </div>
          <div class="actions">
            <span class="pill green">Assigned</span>
            ${renderLessonTakeDownButton(current)}
          </div>
        </div>
        ${state.role === "teacher" && state.teacherLesson.status ? `<div class="message-notice">${escapeHtml(state.teacherLesson.status)}</div>` : ""}
        ${renderLessonMedia(current, "large")}
        <div class="example-board" style="margin-top: 14px;">
          <strong>Learning goal: ${escapeHtml(current.goal)}</strong>
          ${current.explanation ? `<span>${escapeHtml(current.explanation)}</span>` : `<span class="math-text">2x + 6 = 18</span><span>Step 1: subtract 6 from both sides.</span><span>Step 2: divide both sides by 2.</span><span class="math-text">x = 6</span>`}
          ${current.example ? `<span class="math-text">${escapeHtml(current.example)}</span>` : ""}
        </div>
      </div>
      <div class="surface">
        <div class="section-head">
          <div>
            <h2>Lesson Library</h2>
            <p>${state.role === "teacher" ? "Teacher-owned lessons can be taken down here." : "Lessons posted by your teacher."}</p>
          </div>
        </div>
        <div class="lesson-list" style="margin-top: 14px;">
          ${library.map(renderLessonCard).join("")}
        </div>
      </div>
    </section>
    <section class="surface">
      <div class="section-head">
        <div>
          <h2>Mini Quiz</h2>
          <p>One check before homework submission.</p>
        </div>
      </div>
      <div class="field-grid" style="margin-top: 14px;">
        <div class="field">
          <label for="quiz-answer">Solve 3x + 7 = 22</label>
          <input id="quiz-answer" data-bind="quizAnswer" value="${state.quizAnswer}" placeholder="x = ?" />
        </div>
        <div class="surface compact">
          ${state.quizAnswer.trim().toLowerCase().replace(/\s/g, "") === "x=5" || state.quizAnswer.trim() === "5"
            ? `<span class="pill green">Correct</span><p>3x = 15, so x = 5.</p>`
            : `<span class="pill amber">Waiting</span><p>Submit the value of x.</p>`}
        </div>
      </div>
    </section>
  `;
}

function renderPracticePage() {
  const generated = state.generatedQuestions.length ? state.generatedQuestions : generateQuestions(state.selectedTopic);
  return `
    <section class="grid two">
      <div class="surface">
        <div class="section-head">
          <div>
            <h2>Practice Question Generator</h2>
            <p>Unit-based questions with saved review mistakes.</p>
          </div>
          <button class="btn primary" data-action="generate">Generate</button>
        </div>
        <div class="field-grid" style="margin-top: 14px;">
          <div class="field full">
            <label for="topic-select">Unit</label>
            <select id="topic-select" data-bind="selectedTopic">
              ${grade7QuestionTopics
                .map((topic) => `<option ${state.selectedTopic === topic ? "selected" : ""}>${topic}</option>`)
                .join("")}
            </select>
          </div>
        </div>
        <ul class="question-list" style="margin-top: 14px;">
          ${generated.map((question, index) => renderPracticeQuestion(question, index)).join("")}
        </ul>
      </div>
      <div class="surface">
        <h2>Step-by-Step Hints</h2>
        <div class="hint-box" style="margin-top: 14px;">
          <strong class="math-text">2x + 6 = 18</strong>
          ${renderHint()}
          <div class="actions">
            <button class="btn" data-action="prev-hint" ${state.hintStep === 0 ? "disabled" : ""}>Back</button>
            <button class="btn primary" data-action="next-hint" ${state.hintStep === 4 ? "disabled" : ""}>Next hint</button>
          </div>
        </div>
        ${renderDailyChallenge()}
      </div>
    </section>
  `;
}

function renderAskHelpPage() {
  return `
    <section class="grid two">
      <div class="surface">
        <div class="section-head">
          <div>
            <h2>No assignment selected</h2>
            <p>Ask a general math question or wait for your teacher to assign work.</p>
          </div>
          <span class="pill amber">General help</span>
        </div>
        <div class="example-board" style="margin-top: 14px;">
          <span class="math-text">2x + 6 = 18</span>
          <span>Attempt: ${state.attemptDraft || "No attempt added yet."}</span>
        </div>
        ${state.helpNotice ? `<div class="message-notice">${escapeHtml(state.helpNotice)}</div>` : ""}
        <div class="field-grid" style="margin-top: 14px;">
          <div class="field full">
            <label for="attempt">Attempted answer</label>
            <input id="attempt" data-bind="attemptDraft" value="${state.attemptDraft}" />
          </div>
          <div class="field full">
            <label for="help-message">Message</label>
            <textarea id="help-message" data-bind="helpDraft" placeholder="I need help with question 4.">${state.helpDraft}</textarea>
          </div>
          <div class="field full">
            <label>Written work</label>
            <div class="upload-box">
              <strong>No assignment attachment selected.</strong>
              <span>Upload written work from a homework card after work is assigned.</span>
            </div>
          </div>
        </div>
        <div class="actions" style="margin-top: 14px;">
          <button class="btn primary" data-action="send-help">Send to teacher</button>
          <button class="btn" data-page="Practice">Open hints</button>
        </div>
      </div>
      <div class="surface">
        <h2>Student-Teacher Chat</h2>
        <div class="thread" style="margin-top: 14px;">
          ${helpThread.map(([who, text]) => `<div class="${messageBubbleClass(who, "student")}"><strong>${capitalize(who)}</strong>${text}</div>`).join("")}
          ${state.helpDraft ? `<div class="${messageBubbleClass("student", "student")}"><strong>Student</strong>${state.helpDraft}</div>` : ""}
        </div>
      </div>
    </section>
  `;
}

function renderMessagesPage(viewer) {
  const rows = mailboxes[viewer] || [];
  ensureMessageRecipient(viewer);
  const selected = getSelectedMessage(viewer);
  const recipients = getRecipientOptions(viewer);
  const unreadCount = rows.filter((message) => !message.read).length;
  return `
    <section class="grid two">
      <div class="surface">
        <div class="section-head">
          <div>
            <h2>Inbox</h2>
            <p>${unreadCount} unread message${unreadCount === 1 ? "" : "s"}</p>
          </div>
          <div class="actions">
            <button class="btn" data-action="new-message" data-viewer="${viewer}">New message</button>
            <button class="btn coral" data-action="clear-messages" data-viewer="${viewer}">Clear messages</button>
          </div>
        </div>
        <div class="message-list" style="margin-top: 14px;">
          ${rows.length
            ? rows
            .map(
              (message) => `
                <div class="message-card ${message.read ? "" : "unread"} ${selected?.id === message.id ? "active" : ""}">
                  <div class="assignment-top">
                    <div>
                      <h3>${escapeHtml(message.sender)}</h3>
                      <div class="assignment-meta"><span>${escapeHtml(message.subject)}</span></div>
                    </div>
                    <span class="pill ${message.read ? "" : "green"}">${message.read ? "Read" : "Unread"}</span>
                  </div>
                  <p>${escapeHtml(message.thread.at(-1)?.text || "")}</p>
                  <div class="actions">
                    <button class="btn" data-action="open-message" data-viewer="${viewer}" data-message-id="${message.id}">Open</button>
                    <button class="btn" data-action="reply-message" data-viewer="${viewer}" data-message-id="${message.id}">Reply</button>
                    <button class="btn ghost" data-action="toggle-read" data-viewer="${viewer}" data-message-id="${message.id}">
                      ${message.read ? "Mark unread" : "Mark read"}
                    </button>
                  </div>
                </div>
              `,
            )
            .join("")
            : `<div class="empty">No messages yet.</div>`}
        </div>
      </div>
      <div class="surface">
        <div class="section-head">
          <div>
            <h2>${selected ? `Conversation with ${escapeHtml(selected.sender)}` : "New message"}</h2>
            <p>${selected ? escapeHtml(selected.subject) : "Start a new conversation."}</p>
          </div>
        </div>
        ${state.messaging.notice ? `<div class="message-notice">${escapeHtml(state.messaging.notice)}</div>` : ""}
        <div class="thread message-thread" style="margin-top: 14px;">
          ${selected
            ? selected.thread
                .map(
                  (entry) => `
                    <div class="${messageBubbleClass(entry.role, viewer, entry.own)}">
                      <strong>${escapeHtml(entry.from)}</strong>
                      ${escapeHtml(entry.text)}
                    </div>
                  `,
                )
                .join("")
            : `<div class="empty">Choose a recipient and send a message.</div>`}
        </div>
        <div class="message-composer">
          <div class="field">
            <label for="message-to-${viewer}">To</label>
            <select id="message-to-${viewer}" data-bind="messaging.composeTo.${viewer}" ${recipients.length ? "" : "disabled"}>
              ${recipients.map((recipient) => `
                <option value="${escapeHtml(recipient.id)}" ${state.messaging.composeTo[viewer] === recipient.id ? "selected" : ""}>
                  ${escapeHtml(recipient.name)} (${capitalize(recipient.role)})
                </option>
              `).join("")}
            </select>
          </div>
          <div class="field">
            <label for="message-body-${viewer}">Message</label>
            <textarea id="message-body-${viewer}" data-bind="messaging.draft.${viewer}" placeholder="${recipients.length ? "Write a message..." : "Create another account before messaging."}">${escapeHtml(state.messaging.draft[viewer])}</textarea>
          </div>
          <div class="actions">
            <button class="btn primary" data-action="send-message" data-viewer="${viewer}" ${recipients.length ? "" : "disabled"}>Send message</button>
            <button class="btn" data-action="clear-message" data-viewer="${viewer}">Clear</button>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderStudentProgressPage() {
  const studentAssignments = getStudentAssignments();
  const stats = assignmentStats(studentAssignments);
  const completedRows = studentAssignments.filter((item) => item.status === "Completed");
  return `
    <section class="metric-row">
      ${metric("Completed", `${stats.completed}/${stats.total}`, "homework")}
      ${metric("Late", String(stats.missing), "assignment")}
      ${metric("Steps done", `${stats.completedSteps}/${stats.totalSteps}`, "homework steps")}
      ${metric("Average", stats.average, "current unit")}
    </section>
    <section class="grid equal">
      ${renderTopicPerformance("Unit Performance", topicScoresForAssignments(studentAssignments))}
      <div class="surface">
        <h2>Recent Scores</h2>
        <table class="table" style="margin-top: 14px;">
          <thead><tr><th>Work</th><th>Unit</th><th>Result</th></tr></thead>
          <tbody>
            ${completedRows.length
              ? completedRows.map((item) => `<tr><td>${escapeHtml(item.title)}</td><td>${escapeHtml(item.topic)}</td><td>Submitted</td></tr>`).join("")
              : `<tr><td colspan="3">No completed work yet.</td></tr>`}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderFormulaSheetPage() {
  return `
    <section class="surface">
      <div class="section-head">
        <div>
          <h2>Formula Sheet</h2>
          <p>Common formulas for current and upcoming units.</p>
        </div>
      </div>
      <div class="formula-grid grid three" style="margin-top: 14px;">
        ${formulas.map(([name, formula]) => `<div class="formula-card"><h3>${name}</h3><p class="math-text">${formula}</p></div>`).join("")}
      </div>
    </section>
  `;
}

function renderMathToolsPage() {
  return `
    <section class="tool-grid">
      <div class="tool">
        <h3>Calculator</h3>
        <div class="calculator" style="margin-top: 12px;">
          <div class="calc-display">${state.calc || "0"}</div>
          <div class="calc-keys">
            ${["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "=", "+"]
              .map((key) => `<button class="${["/", "*", "-", "+", "="].includes(key) ? "operator" : ""}" data-calc="${key}">${key}</button>`)
              .join("")}
            <button data-action="clear-calc" style="grid-column: span 4;">Clear</button>
          </div>
        </div>
      </div>
      <div class="tool graph-wrap">
        <h3>Graphing Tool</h3>
        <div class="field-grid">
          <div class="field">
            <label for="slope">m</label>
            <input id="slope" type="number" data-bind="graph.m" value="${state.graph.m}" step="0.5" />
          </div>
          <div class="field">
            <label for="intercept">b</label>
            <input id="intercept" type="number" data-bind="graph.b" value="${state.graph.b}" step="0.5" />
          </div>
        </div>
        <canvas id="graph-canvas" width="720" height="360" aria-label="Graph of a line"></canvas>
        <span class="math-text">y = ${state.graph.m}x ${state.graph.b < 0 ? "-" : "+"} ${Math.abs(state.graph.b)}</span>
      </div>
    </section>
    <section class="tool-grid">
      <div class="tool">
        <h3>Equation Solver</h3>
        <div class="example-board" style="margin-top: 12px;">
          <span class="math-text">2x + 6 = 18</span>
          <span>Subtract 6 from both sides: <span class="math-text">2x = 12</span></span>
          <span>Divide both sides by 2: <span class="math-text">x = 6</span></span>
        </div>
      </div>
      <div class="tool">
        <h3>Unit Converter</h3>
        <div class="field-grid" style="margin-top: 12px;">
          <div class="field">
            <label for="convert-value">Value</label>
            <input id="convert-value" type="number" data-bind="converter.value" value="${state.converter.value}" />
          </div>
          <div class="field">
            <label for="convert-from">From</label>
            <select id="convert-from" data-bind="converter.from">
              ${["cm", "m", "mL", "L", "minutes", "hours"].map((unit) => `<option ${state.converter.from === unit ? "selected" : ""}>${unit}</option>`).join("")}
            </select>
          </div>
          <div class="field">
            <label for="convert-to">To</label>
            <select id="convert-to" data-bind="converter.to">
              ${["cm", "m", "mL", "L", "minutes", "hours"].map((unit) => `<option ${state.converter.to === unit ? "selected" : ""}>${unit}</option>`).join("")}
            </select>
          </div>
          <div class="converter-result">${convertUnits()}</div>
        </div>
      </div>
    </section>
    <section class="surface">
      <div class="section-head">
        <div>
          <h2>Geometry Tool</h2>
          <p>Coordinate grid with common shapes.</p>
        </div>
      </div>
      <div class="geometry-board" style="margin-top: 14px;">
        <div class="geo-triangle"></div>
        <div class="geo-shape geo-circle"></div>
        <div class="geo-shape geo-angle"></div>
      </div>
    </section>
  `;
}

function renderTeacherDashboard() {
  const classStudents = getClassStudents();
  const currentClass = selectedTeacherClass();
  const analytics = classGradeAnalytics();
  const followUpStudents = analytics.rows.filter((student) => student.average !== null && student.average < 70);
  const teacherAssignments = assignmentCatalog().filter((item) =>
    state.assignmentLibrary.some((assignment) => assignment.id === item.id) &&
    (!currentClass || !item.classId || item.classId === currentClass.id),
  );
  return `
    ${renderAttendanceReminder()}
    ${renderTeacherClassSwitcher()}
    <section class="metric-row">
      ${metric("Classes", String(teacherClasses().length), "saved")}
      ${metric("Students", String(classStudents.length), currentClass ? currentClass.name : "choose a class")}
      ${metric("Graded", String(analytics.gradedCount), "worksheets")}
      ${metric("Class average", analytics.averageLabel, "graded work")}
    </section>
    <section class="grid equal">
      ${renderTopicPerformance("Class Performance", gradeTopicScores())}
      ${renderClassRosterPanel()}
    </section>
    ${renderClassGradeAnalytics()}
    <section class="grid equal">
      <div class="surface">
        <div class="section-head">
          <div>
            <h2>Assignments</h2>
            <p>Active work assigned to this class.</p>
          </div>
          <button class="btn primary" data-page="Create Assignment">New</button>
        </div>
        ${state.draft.notice ? `<div class="message-notice" style="margin-top: 14px;">${escapeHtml(state.draft.notice)}</div>` : ""}
        <div class="assignment-list" style="margin-top: 14px;">
          ${teacherAssignments.length ? teacherAssignments.slice(0, 5).map(renderTeacherAssignmentCard).join("") : `<div class="empty">No assignments published yet.</div>`}
        </div>
      </div>
    </section>
    <section class="surface">
      <h2>Students Needing Grade Follow-Up</h2>
      ${followUpStudents.length ? renderGradeTable(followUpStudents) : `<div class="empty" style="margin-top: 14px;">No low worksheet grades in this class yet.</div>`}
    </section>
  `;
}

function renderTeacherClassSwitcher() {
  const classes = teacherClasses();
  const selected = selectedTeacherClass();
  return `
    <section class="surface teacher-class-switcher">
      <div class="section-head">
        <div>
          <h2>Active Class</h2>
          <p>${selected ? `${escapeHtml(selected.name)} has ${selected.studentIds?.length || 0} student${selected.studentIds?.length === 1 ? "" : "s"}.` : "Create a class before reviewing work."}</p>
        </div>
        <div class="actions">
          <button class="btn" data-action="previous-class" ${classes.length > 1 ? "" : "disabled"}>Previous</button>
          <button class="btn" data-action="next-class" ${classes.length > 1 ? "" : "disabled"}>Next</button>
        </div>
      </div>
      <div class="field teacher-class-select-field" style="margin-top: 12px;">
        <label for="active-teacher-class">Switch class</label>
        <select id="active-teacher-class" data-bind="classRoster.selectedClassId" ${classes.length ? "" : "disabled"}>
          ${classes.length
            ? classes.map((classItem) => `<option value="${escapeHtml(classItem.id)}" ${state.classRoster.selectedClassId === classItem.id ? "selected" : ""}>${escapeHtml(classItem.name)}</option>`).join("")
            : `<option>No classes yet</option>`}
        </select>
      </div>
    </section>
  `;
}

function renderAttendanceReminder() {
  if (!attendanceNeedsAttention()) return "";
  return `
    <section class="attendance-reminder">
      <div>
        <strong>Attendance needs marking</strong>
        <span>${escapeHtml(attendanceReminderText())} for ${escapeHtml(state.attendance.date)}.</span>
      </div>
      <button class="btn primary" data-page="Attendance">Mark attendance</button>
    </section>
  `;
}

function renderClassRosterPanel() {
  const allStudents = state.directory.users.filter((user) => user.role === "student");
  const selectedIds = new Set(state.classRoster.studentIds);
  const classes = teacherClasses();
  return `
    <div class="surface">
      <div class="section-head">
        <div>
          <h2>Classes</h2>
          <p>Name each class and choose which signed-up students belong to it.</p>
        </div>
        <div class="actions">
          <button class="btn" data-action="new-class-roster">New class</button>
          <button class="btn primary" data-action="save-class-roster" ${state.classRoster.saving ? "disabled" : ""}>
            ${state.classRoster.saving ? "Saving..." : "Save class"}
          </button>
        </div>
      </div>
      ${state.classRoster.notice ? `<div class="message-notice">${escapeHtml(state.classRoster.notice)}</div>` : ""}
      <div class="field-grid" style="margin-top: 14px;">
        <div class="field">
          <label for="teacher-class-select">Class</label>
          <select id="teacher-class-select" data-bind="classRoster.selectedClassId">
            <option value="" ${state.classRoster.selectedClassId ? "" : "selected"}>New class</option>
            ${classes.map((classItem) => `<option value="${escapeHtml(classItem.id)}" ${state.classRoster.selectedClassId === classItem.id ? "selected" : ""}>${escapeHtml(classItem.name)}</option>`).join("")}
          </select>
        </div>
        <div class="field">
          <label for="teacher-class-name">Class name</label>
          <input id="teacher-class-name" data-bind="classRoster.draftName" value="${escapeHtml(state.classRoster.draftName)}" placeholder="Grade 7 Period 1" />
        </div>
      </div>
      <div class="roster-list" style="margin-top: 14px;">
        ${allStudents.length
          ? allStudents.map((student) => `
            <label class="roster-row">
              <input type="checkbox" data-roster-student="${escapeHtml(student.id)}" ${selectedIds.has(student.id) ? "checked" : ""} />
              <span>
                <strong>${escapeHtml(student.name)}</strong>
                <small>${escapeHtml(student.email)}</small>
              </span>
            </label>
          `).join("")
          : `<div class="empty">No student accounts have signed up yet.</div>`}
      </div>
    </div>
  `;
}

function renderCreateAssignmentPage() {
  const teacherQuestions = draftQuestions();
  const previewSteps = draftChecklistSteps(teacherQuestions.length);
  const classes = teacherClasses();
  const draftClass = classes.find((classItem) => classItem.id === state.draft.classId) || classes[0] || null;
  if (draftClass && state.draft.classId !== draftClass.id) {
    state.draft.classId = draftClass.id;
    state.draft.className = draftClass.name;
  }
  if (!draftClass && state.draft.classId) {
    state.draft.classId = "";
    state.draft.className = "";
  }
  return `
    <section class="grid two">
      <div class="surface">
        <h2>Create Assignment</h2>
        ${state.draft.notice ? `<div class="message-notice">${escapeHtml(state.draft.notice)}</div>` : ""}
        <div class="field-grid" style="margin-top: 14px;">
          <div class="field">
            <label for="draft-class">Class</label>
            <select id="draft-class" data-bind="draft.classId" ${classes.length ? "" : "disabled"}>
              ${classes.length
                ? classes.map((classItem) => `<option value="${escapeHtml(classItem.id)}" ${state.draft.classId === classItem.id ? "selected" : ""}>${escapeHtml(classItem.name)}</option>`).join("")
                : `<option value="">Create a class first</option>`}
            </select>
          </div>
          <div class="field">
            <label for="draft-topic">Unit</label>
            <select id="draft-topic" data-bind="draft.topic">
              ${grade7QuestionTopics.map((topic) => `<option ${state.draft.topic === topic ? "selected" : ""}>${topic}</option>`).join("")}
            </select>
          </div>
          <div class="field">
            <label for="due">Due date</label>
            <input id="due" type="date" data-bind="draft.due" value="${state.draft.due}" />
          </div>
          <div class="field full">
            <label for="assignment-questions">Questions</label>
            <textarea id="assignment-questions" data-bind="draft.questionText" placeholder="Typed: 3x + 5 = 20&#10;MC: What is 20% of 50? | 5 | 10 | 25&#10;ALL: Which are equivalent to 1/2? | 2/4 | 3/6 | 4/6">${escapeHtml(state.draft.questionText)}</textarea>
            <span class="meta-line">Use plain lines for typed answers, MC: for one correct choice, and ALL: for select-all questions. Separate choices with |.</span>
          </div>
          ${state.draft.bridgeSpace ? renderBridgeSpaceQuestionBuilder(teacherQuestions) : ""}
          <div class="field full">
            <label for="assignment-page-file">Assignment page image</label>
            <input id="assignment-page-file" type="file" accept="image/*" />
          </div>
          <div class="field full">
            <label for="assignment-video-file">Lesson video file</label>
            <input id="assignment-video-file" type="file" accept="video/*" />
          </div>
          <div class="field full">
            <label for="assignment-video-link">Lesson video link</label>
            <input id="assignment-video-link" type="url" data-bind="draft.lessonVideoLink" value="${escapeHtml(state.draft.lessonVideoLink)}" placeholder="Paste a YouTube link to play it inside MathBridge" />
          </div>
          ${renderDraftMaterialsPanel()}
          <div class="field full">
            <label>Assigned student steps</label>
            <div class="step-option-grid">
              <label class="toggle-line">
                <input type="checkbox" data-bind="draft.watchLesson" ${state.draft.watchLesson ? "checked" : ""} />
                Watch the lesson
              </label>
              <label class="toggle-line">
                <input type="checkbox" data-bind="draft.readNotes" ${state.draft.readNotes ? "checked" : ""} />
                Read lesson notes
              </label>
              <label class="toggle-line">
                <input type="checkbox" data-bind="draft.completeQuestions" ${state.draft.completeQuestions || state.draft.bridgeSpace ? "checked" : ""} ${state.draft.bridgeSpace ? "disabled" : ""} />
                ${state.draft.bridgeSpace ? "Complete questions in BridgeSpace" : "Complete questions"}
              </label>
              <label class="toggle-line">
                <input type="checkbox" data-bind="draft.uploadWork" ${state.draft.uploadWork ? "checked" : ""} />
                Upload written work
              </label>
              <label class="toggle-line">
                <input type="checkbox" data-bind="draft.bridgeSpace" ${state.draft.bridgeSpace ? "checked" : ""} />
                Use BridgeSpace for questions
              </label>
              <label class="toggle-line">
                <input type="checkbox" data-bind="draft.submitFinal" ${state.draft.submitFinal ? "checked" : ""} />
                Submit final answers
              </label>
            </div>
          </div>
        </div>
        <div class="actions" style="margin-top: 14px;">
          <button class="btn primary" data-action="publish-assignment" ${state.draft.submitting ? "disabled" : ""}>
            ${state.draft.submitting ? "Publishing..." : "Publish"}
          </button>
          <button class="btn" data-action="save-assignment-draft" ${state.draft.savingDraft ? "disabled" : ""}>
            ${state.draft.savingDraft ? "Saving draft..." : "Save draft"}
          </button>
          <button class="btn" data-action="clear-draft-questions">Clear questions</button>
        </div>
      </div>
      <div class="surface soft">
        <h2>Assignment Preview</h2>
        <div class="assignment-card" style="margin-top: 14px;">
          <div class="assignment-top">
            <div>
              <h3>${state.draft.topic}</h3>
              <div class="assignment-meta">
                <span>${escapeHtml(state.draft.className || "No class selected")}</span>
                <span>Due ${state.draft.due}</span>
                <span>Teacher-made questions</span>
                <span>${state.draft.lessonVideoLink ? "Lesson video linked" : "Optional lesson video"}</span>
                <span>${selectedDraftMaterials().length} saved material${selectedDraftMaterials().length === 1 ? "" : "s"} attached</span>
                <span>Optional drawable page image</span>
                ${state.draft.bridgeSpace ? `<span>BridgeSpace workspace on</span>` : ""}
              </div>
            </div>
            <span class="pill green">${teacherQuestions.length} question${teacherQuestions.length === 1 ? "" : "s"}</span>
          </div>
          <ol class="question-preview-list">
            ${teacherQuestions.length
              ? teacherQuestions.map(renderDraftQuestionPreview).join("")
              : `<li><span class="meta-line">Write questions to build the assignment.</span></li>`}
          </ol>
          <div class="checklist">
            ${previewSteps
              .map((label) => `<div class="check-item"><span class="check-toggle">✓</span><span>${label}</span><span class="pill">Step</span></div>`)
              .join("")}
          </div>
        </div>
      </div>
    </section>
    ${renderAssignmentDraftsPanel()}
    ${renderMaterialsLibrary("Assign Saved Materials", "attach")}
  `;
}

function renderAssignmentDraftsPanel() {
  const drafts = state.assignmentDraftLibrary;
  return `
    <section class="surface">
      <div class="section-head">
        <div>
          <h2>Saved Assignment Drafts</h2>
          <p>${drafts.length} assignment draft${drafts.length === 1 ? "" : "s"} hidden from students until pushed.</p>
        </div>
      </div>
      <div class="assignment-list" style="margin-top: 14px;">
        ${drafts.length ? drafts.map(renderAssignmentDraftCard).join("") : `<div class="empty">No saved assignment drafts yet.</div>`}
      </div>
    </section>
  `;
}

function renderAssignmentDraftCard(draft) {
  return `
    <article class="assignment-card">
      <div class="assignment-top">
        <div>
          <h3>${escapeHtml(draft.title || `${draft.topic} assignment`)}</h3>
          <div class="assignment-meta">
            <span>${escapeHtml(draft.className || "No class selected")}</span>
            <span>${escapeHtml(draft.topic)}</span>
            <span>Due ${escapeHtml(draft.due)}</span>
    <span>${draft.questions?.length || 0} question${draft.questions?.length === 1 ? "" : "s"}</span>
    ${draft.bridgeSpace ? `<span>BridgeSpace on</span>` : ""}
    <span>${draft.resources?.length || 0} saved material${draft.resources?.length === 1 ? "" : "s"}</span>
            ${draft.updatedAt ? `<span>Saved ${formatShortDate(draft.updatedAt)}</span>` : ""}
          </div>
        </div>
        <span class="pill amber">Draft</span>
      </div>
      <div class="actions">
        <button class="btn primary" data-action="push-assignment-draft" data-draft="${escapeHtml(draft.id)}">Push</button>
        <button class="btn coral" data-action="delete-assignment-draft" data-draft="${escapeHtml(draft.id)}">Take down</button>
      </div>
    </article>
  `;
}

function renderBridgeSpaceQuestionBuilder(questions) {
  const mode = state.draft.bridgeQuestionMode || "text";
  return `
    <div class="field full bridge-question-builder">
      <div class="work-panel-head">
        <div>
          <strong>BridgeSpace question maker</strong>
          <span>Create the exact questions students will answer inside BridgeSpace.</span>
        </div>
        <span class="pill green">${questions.length} ready</span>
      </div>
      <div class="field-grid">
        <div class="field">
          <label for="bridge-question-mode">Answer type</label>
          <select id="bridge-question-mode" data-bind="draft.bridgeQuestionMode">
            <option value="text" ${mode === "text" ? "selected" : ""}>Typed answer</option>
            <option value="multiple-choice" ${mode === "multiple-choice" ? "selected" : ""}>Multiple choice</option>
            <option value="select-all" ${mode === "select-all" ? "selected" : ""}>Select all correct</option>
          </select>
        </div>
        <div class="field">
          <label for="bridge-question-prompt">Question</label>
          <input id="bridge-question-prompt" data-bind="draft.bridgeQuestionPrompt" value="${escapeHtml(state.draft.bridgeQuestionPrompt)}" placeholder="Example: Solve 3x + 5 = 20" />
        </div>
        ${mode === "text" ? "" : `
          <div class="field full">
            <label for="bridge-question-choices">Choices</label>
            <textarea id="bridge-question-choices" data-bind="draft.bridgeQuestionChoices" placeholder="One choice per line, or separate with |">${escapeHtml(state.draft.bridgeQuestionChoices)}</textarea>
          </div>
        `}
        <div class="field full">
          <label for="bridge-question-answers">${mode === "text" ? "Accepted answer(s)" : "Correct choice(s)"}</label>
          <textarea id="bridge-question-answers" data-bind="draft.bridgeQuestionAnswers" placeholder="${mode === "text" ? "Example: x = 5 | 5" : "Paste exact correct choice(s), one per line or separated with |"}">${escapeHtml(state.draft.bridgeQuestionAnswers)}</textarea>
        </div>
      </div>
      <div class="actions">
        <button class="btn primary" data-action="add-bridgespace-question">Add BridgeSpace question</button>
        <button class="btn" data-action="clear-bridgespace-question-builder">Clear builder</button>
      </div>
    </div>
  `;
}

function draftChecklistSteps(questionCount) {
  const steps = [];
  if (state.draft.watchLesson) steps.push("Watch the lesson");
  if (state.draft.readNotes) steps.push("Read lesson notes");
  if (state.draft.bridgeSpace) {
    steps.push(bridgeSpaceQuestionStep(questionCount));
  } else if (state.draft.completeQuestions) {
    steps.push(`Complete ${questionCount} teacher-made question${questionCount === 1 ? "" : "s"}`);
  }
  if (state.draft.uploadWork) steps.push("Upload written work");
  if (state.draft.submitFinal) steps.push("Submit final answers");
  return steps.length ? steps : [`Complete ${questionCount} teacher-made question${questionCount === 1 ? "" : "s"}`];
}

function bridgeSpaceQuestionStep(questionCount) {
  const count = Number(questionCount) || 0;
  return count
    ? `Complete ${count} question${count === 1 ? "" : "s"} in BridgeSpace`
    : "Complete questions in BridgeSpace";
}

function resetBridgeSpaceQuestionBuilder() {
  state.draft.bridgeQuestionPrompt = "";
  state.draft.bridgeQuestionChoices = "";
  state.draft.bridgeQuestionAnswers = "";
}

function bridgeQuestionChoices() {
  return state.draft.bridgeQuestionChoices
    .split(/\r?\n|\|/)
    .map((choice) => choice.trim())
    .filter(Boolean);
}

function bridgeQuestionAnswers() {
  return state.draft.bridgeQuestionAnswers
    .split(/\r?\n|\|/)
    .map(cleanQuestionAnswerValue)
    .filter(Boolean);
}

function addBridgeSpaceQuestion() {
  const prompt = state.draft.bridgeQuestionPrompt.trim();
  const mode = state.draft.bridgeQuestionMode || "text";
  if (!prompt) {
    state.draft.notice = "Write a BridgeSpace question first.";
    render();
    return;
  }

  let line = prompt;
  const answers = bridgeQuestionAnswers();
  if (mode !== "text") {
    const choices = bridgeQuestionChoices();
    if (choices.length < 2) {
      state.draft.notice = "Add at least two answer choices for this BridgeSpace question.";
      render();
      return;
    }
    if (mode === "multiple-choice" && answers.length > 1) {
      state.draft.notice = "Multiple choice questions can have one correct answer. Use select all for more than one.";
      render();
      return;
    }
    const normalizedChoices = new Map(choices.map((choice) => [cleanQuestionAnswerValue(choice).toLowerCase(), choice]));
    const missingAnswers = answers.filter((answer) => !normalizedChoices.has(answer.toLowerCase()));
    if (missingAnswers.length) {
      state.draft.notice = "Correct choices must match one of the choices exactly.";
      render();
      return;
    }
    const answerSet = new Set(answers.map((answer) => answer.toLowerCase()));
    const markedChoices = choices.map((choice) => answerSet.has(cleanQuestionAnswerValue(choice).toLowerCase()) ? `*${choice}` : choice);
    line = `${mode === "select-all" ? "ALL" : "MC"}: ${prompt} | ${markedChoices.join(" | ")}`;
  } else if (answers.length) {
    line = `ANS: ${prompt} | ${answers.join(" | ")}`;
  }

  const existing = state.draft.questionText.trim();
  state.draft.questionText = existing ? `${existing}\n${line}` : line;
  resetBridgeSpaceQuestionBuilder();
  state.draft.notice = "BridgeSpace question added.";
  render();
}

function draftQuestions() {
  return state.draft.questionText
    .split(/\n+/)
    .map(parseQuestionLine)
    .filter((question) => question.prompt);
}

function renderDraftQuestionPreview(question) {
  const normalized = normalizeHomeworkQuestion(question);
  return `
    <li>
      <span class="math-text">${escapeHtml(normalized.prompt)}</span>
      <span class="pill">${questionModeLabel(normalized)}</span>
      ${normalized.answerKey?.length ? `<span class="pill green">Answer key saved</span>` : ""}
      ${normalized.choices.length ? `<small>${normalized.choices.map(escapeHtml).join(" / ")}</small>` : ""}
    </li>
  `;
}

function renderQuestionBankPage() {
  const sets = getQuestionSets(state.questionBankTopic);
  const selectedSet = selectedQuestionSet();
  return `
    <section class="grid two">
      <div class="surface">
        <h2>Question Bank</h2>
        <div class="field-grid" style="margin-top: 14px;">
          <div class="field">
            <label for="bank-topic">Unit</label>
            <select id="bank-topic" data-bind="questionBankTopic">
              ${grade7QuestionTopics.map((topic) => `<option ${state.questionBankTopic === topic ? "selected" : ""}>${topic}</option>`).join("")}
            </select>
          </div>
          <div class="field">
            <label for="bank-set">Question set</label>
            <select id="bank-set" data-bind="questionBankSetIndex">
              ${sets.map((set, index) => `<option value="${index}" ${Number(state.questionBankSetIndex) === index ? "selected" : ""}>${set.title}</option>`).join("")}
            </select>
          </div>
        </div>
        <div class="actions" style="margin-top: 14px;">
          <button class="btn primary" data-action="insert-question-set">Use this set</button>
          <button class="btn" data-action="next-question-set">Next set</button>
        </div>
        <table class="table" style="margin-top: 14px;">
          <thead><tr><th>Unit</th><th>Sets</th><th>Questions</th></tr></thead>
          <tbody>
            ${grade7QuestionTopics.map((topic) => `
              <tr>
                <td>${topic}</td>
                <td>${getQuestionSets(topic).length}</td>
                <td>${getQuestionSets(topic).reduce((sum, set) => sum + set.items.length, 0)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
      <div class="surface">
        <h2>${escapeHtml(selectedSet.title)}</h2>
        <p class="meta-line">Ontario Grade 7 aligned set. Use it as-is or edit after inserting.</p>
        <ul class="question-list" style="margin-top: 14px;">
          ${selectedSet.items.map((item) => `<li><span class="math-text">${escapeHtml(item.q)}</span></li>`).join("")}
        </ul>
      </div>
    </section>
  `;
}

function getQuestionSets(topic) {
  return grade7QuestionSets[unitForTopic(topic)] || grade7QuestionSets[UNIT_NUMBER_SENSE];
}

function selectedQuestionSet() {
  const sets = getQuestionSets(state.questionBankTopic);
  const index = Math.min(Math.max(Number(state.questionBankSetIndex) || 0, 0), sets.length - 1);
  return sets[index] || sets[0];
}

function questionSetQuestions(set) {
  return set.items.map((item) => item.q);
}

function selectedDraftMaterials() {
  const ids = new Set(state.draft.materialIds || []);
  return state.materialLibrary.filter((material) => ids.has(material.id));
}

function materialKindLabel(kind) {
  if (kind === "lesson-video") return "Lesson video";
  if (kind === "document") return "Document";
  return "Worksheet";
}

function materialIcon(material) {
  if (material.kind === "lesson-video" || String(material.type || "").startsWith("video/")) return "VID";
  if (String(material.type || "").includes("pdf")) return "PDF";
  if (String(material.type || "").startsWith("image/")) return "IMG";
  return "DOC";
}

function materialHref(material) {
  return material.url || material.link || "";
}

function renderDraftMaterialsPanel() {
  const selected = selectedDraftMaterials();
  return `
    <div class="field full">
      <label>Attached saved materials</label>
      <div class="material-chip-list">
        ${selected.length
          ? selected.map((material) => `
            <span class="material-chip">
              <span>${materialIcon(material)}</span>
              <strong>${escapeHtml(material.title)}</strong>
              <button type="button" data-action="remove-draft-material" data-material="${escapeHtml(material.id)}" aria-label="Remove ${escapeHtml(material.title)}">x</button>
            </span>
          `).join("")
          : `<span class="meta-line">No saved materials attached yet. Use Assign from the materials library below.</span>`}
      </div>
    </div>
  `;
}

function renderMaterialCard(material, mode = "library") {
  const href = materialHref(material);
  const assigned = (state.draft.materialIds || []).includes(material.id);
  const canTakeDown = state.role === "teacher" && mode === "library";
  return `
    <article class="material-card">
      <div class="material-icon">${materialIcon(material)}</div>
      <div>
        <h3>${escapeHtml(material.title)}</h3>
        <div class="assignment-meta">
          <span>${materialKindLabel(material.kind)}</span>
          ${material.name ? `<span>${escapeHtml(material.name)}</span>` : ""}
          ${material.size ? `<span>${formatBytes(material.size)}</span>` : ""}
          ${material.createdAt ? `<span>${formatShortDate(material.createdAt)}</span>` : ""}
        </div>
      </div>
      <div class="actions">
        ${href ? `<a class="btn" href="${escapeHtml(href)}" target="_blank" rel="noopener">Open</a>` : ""}
        <button class="btn primary" data-action="assign-material" data-material="${escapeHtml(material.id)}">
          ${mode === "attach" && assigned ? "Attached" : "Assign"}
        </button>
        ${canTakeDown ? `<button class="btn coral" data-action="delete-material" data-material="${escapeHtml(material.id)}">Take down</button>` : ""}
      </div>
    </article>
  `;
}

function renderMaterialsLibrary(title = "Saved Materials", mode = "library") {
  const materials = state.materialLibrary;
  return `
    <section class="surface">
      <div class="section-head">
        <div>
          <h2>${title}</h2>
          <p>${materials.length} saved worksheet, document, or lesson video${materials.length === 1 ? "" : "s"}.</p>
        </div>
      </div>
      <div class="material-list" style="margin-top: 14px;">
        ${materials.length ? materials.map((material) => renderMaterialCard(material, mode)).join("") : `<div class="empty">No saved materials yet.</div>`}
      </div>
    </section>
  `;
}

function renderMaterialUploadSections() {
  return `
    <section class="grid two">
      <div class="surface">
        <h2>Save Material for Later</h2>
        ${state.materialDraft.status ? `<div class="message-notice">${escapeHtml(state.materialDraft.status)}</div>` : ""}
        <form class="field-grid" data-material-form style="margin-top: 14px;">
          <div class="field full">
            <label for="material-title">Title</label>
            <input id="material-title" name="title" data-bind="materialDraft.title" value="${escapeHtml(state.materialDraft.title)}" placeholder="Unit 1 worksheet, lesson video, or notes" />
          </div>
          <div class="field">
            <label for="material-kind">Type</label>
            <select id="material-kind" name="kind" data-bind="materialDraft.kind">
              ${["worksheet", "lesson-video", "document"].map((kind) => `<option value="${kind}" ${state.materialDraft.kind === kind ? "selected" : ""}>${materialKindLabel(kind)}</option>`).join("")}
            </select>
          </div>
          <div class="field full">
            <label for="material-file">File</label>
            <input id="material-file" name="materialFile" type="file" accept="image/*,video/*,.pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain" />
          </div>
          <div class="field full">
            <label for="material-link">Link</label>
            <input id="material-link" name="link" type="url" data-bind="materialDraft.link" value="${escapeHtml(state.materialDraft.link)}" placeholder="Paste a YouTube link or document link" />
          </div>
          <div class="actions field full">
            <button class="btn primary" type="submit" ${state.materialDraft.submitting ? "disabled" : ""}>
              ${state.materialDraft.submitting ? "Saving..." : "Save material"}
            </button>
            <button class="btn" type="button" data-action="clear-material-form">Clear</button>
          </div>
        </form>
      </div>
      <div class="surface soft">
        <h2>Assign Later</h2>
        <div class="upload-box" style="margin-top: 14px;">
          <strong>Saved materials stay in your teacher library.</strong>
          <span>Use Assign on any saved worksheet, lesson video, or document to attach it to the next assignment draft.</span>
        </div>
      </div>
    </section>
    ${renderMaterialsLibrary("Materials Library")}
  `;
}

function renderUploadLessonPage() {
  const posted = state.lessonLibrary;
  return `
    <section class="grid two">
      <div class="surface">
        <h2>Upload Lesson</h2>
        ${state.teacherLesson.status ? `<div class="message-notice">${escapeHtml(state.teacherLesson.status)}</div>` : ""}
        <form class="field-grid" data-lesson-form style="margin-top: 14px;">
          <div class="field full">
            <label for="lesson-title">Title</label>
            <input id="lesson-title" name="title" data-bind="teacherLesson.title" value="${escapeHtml(state.teacherLesson.title)}" />
          </div>
          <div class="field full">
            <label for="lesson-goal">Learning goal</label>
            <input id="lesson-goal" name="goal" data-bind="teacherLesson.goal" value="${escapeHtml(state.teacherLesson.goal)}" />
          </div>
          <div class="field full">
            <label for="lesson-video-file">Video file</label>
            <input id="lesson-video-file" name="videoFile" type="file" accept="video/*" />
          </div>
          <div class="field full">
            <label for="lesson-video-link">Video link</label>
            <input id="lesson-video-link" name="videoLink" type="url" data-bind="teacherLesson.videoLink" value="${escapeHtml(state.teacherLesson.videoLink)}" placeholder="Paste a YouTube link to play it inside MathBridge" />
          </div>
          <div class="field full">
            <label for="lesson-explanation">Written explanation</label>
            <textarea id="lesson-explanation" name="explanation" data-bind="teacherLesson.explanation">${escapeHtml(state.teacherLesson.explanation)}</textarea>
          </div>
          <div class="field full">
            <label for="lesson-example">Example question</label>
            <input id="lesson-example" name="example" data-bind="teacherLesson.example" value="${escapeHtml(state.teacherLesson.example)}" />
          </div>
          <div class="actions field full">
            <button class="btn primary" type="submit" ${state.teacherLesson.submitting ? "disabled" : ""}>
              ${state.teacherLesson.submitting ? "Posting..." : "Post lesson"}
            </button>
            <button class="btn" type="button" data-action="clear-lesson-form">Clear</button>
          </div>
        </form>
      </div>
      <div class="surface soft">
        <h2>Lesson Page Preview</h2>
        <video id="lesson-file-preview" class="lesson-video large lesson-file-preview" controls preload="metadata" hidden></video>
        <div id="lesson-placeholder-preview">
          ${renderLessonMedia({
            title: state.teacherLesson.title || "Choose a video file",
            videoLink: state.teacherLesson.videoLink,
          }, "large")}
        </div>
        <p id="lesson-file-preview-name" class="meta-line" hidden></p>
        <div class="example-board" style="margin-top: 14px;">
          <strong>${escapeHtml(state.teacherLesson.example || "Example question")}</strong>
          <span>${escapeHtml(state.teacherLesson.goal || "Learning goal")}</span>
          <span>${escapeHtml(state.teacherLesson.explanation || "Written explanation")}</span>
        </div>
      </div>
    </section>
    ${renderMaterialUploadSections()}
    <section class="surface">
      <div class="section-head">
        <div>
          <h2>Posted Lessons</h2>
          <p>${posted.length} uploaded lesson${posted.length === 1 ? "" : "s"} available to students.</p>
        </div>
      </div>
      <div class="lesson-list posted-lesson-list" style="margin-top: 14px;">
        ${posted.length ? posted.map(renderLessonCard).join("") : `<div class="empty">No uploaded lessons yet.</div>`}
      </div>
    </section>
  `;
}

function renderSubmissionsPage() {
  const classStudents = getClassStudents();
  const submissionRows = getSubmissionRows();
  scheduleAutoGradeSuggestions(submissionRows);
  return `
    ${renderTeacherClassSwitcher()}
    <section class="grid two">
      <div class="surface">
        <h2>Student Submissions</h2>
        ${state.submissionReview.notice ? `<div class="message-notice">${escapeHtml(state.submissionReview.notice)}</div>` : ""}
        <div class="submission-list" style="margin-top: 14px;">
          ${classStudents.length
            ? submissionRows.length
              ? submissionRows.map(renderSubmissionCard).join("")
              : `<div class="empty">No submitted student work yet.</div>`
            : `<div class="empty">No students have signed up yet.</div>`}
        </div>
      </div>
      <div class="surface">
        <h2>Verification</h2>
        <div class="upload-box submission-preview-box" style="margin-top: 14px;">
          <strong>Student work preview</strong>
          <span>${submissionRows.length ? "Review typed answers, drawings, or uploaded files from the list, then verify or request correction." : "Submitted typed answers, documents, and drawings will appear here."}</span>
        </div>
      </div>
    </section>
  `;
}

function getSubmissionRows() {
  const catalog = new Map(assignmentCatalog().map((assignment) => [assignment.id, assignment]));
  const visibleStudentIds = new Set(getClassStudents().map((student) => student.id));
  const visibleSubmissions = state.auth.user?.role === "teacher"
    ? state.submissions.filter((submission) => visibleStudentIds.has(submission.student?.id))
    : state.submissions;
  return visibleSubmissions.flatMap((submission) => {
    const student = submission.student || {};
    const assignments = submission.work?.assignments || {};
    return Object.entries(assignments)
      .map(([assignmentId, work]) => {
        const documents = Array.isArray(work.documents) ? work.documents : [];
        const drawing = work.drawing || null;
        const answers = Array.isArray(work.answers) ? work.answers : [];
        const hasAnswers = answers.some((answer) => String(answer || "").trim());
        if (!work.submittedAt || (!documents.length && !drawing && !hasAnswers)) return null;
        const assignment = catalog.get(assignmentId) || { title: "Assignment", topic: "Math" };
        return {
          student,
          assignmentId,
          assignment,
          documents,
          drawing,
          answers,
          studentComment: work.studentComment || "",
          submittedAt: work.submittedAt || "",
          verifiedAt: work.verifiedAt || "",
          verificationStatus: work.verificationStatus || "submitted",
          teacherFeedback: work.teacherFeedback || "",
          grade: validGrade(work.grade),
          gradeUpdatedAt: work.gradeUpdatedAt || "",
          updatedAt: work.updatedAt || work.submittedAt || documents[0]?.createdAt || drawing?.createdAt || "",
        };
      })
      .filter(Boolean);
  }).sort((a, b) => Date.parse(b.updatedAt || 0) - Date.parse(a.updatedAt || 0));
}

function renderSubmissionCard(row) {
  const status = row.verificationStatus === "verified"
    ? "Completed"
    : row.verificationStatus === "needs-correction"
      ? "Needs correction"
      : "Submitted";
  const draftKey = submissionDraftKey(row.student.id, row.assignmentId);
  const gradeDraft = state.submissionReview.grades[draftKey] ?? (row.grade !== null ? String(row.grade) : "");
  const feedbackDraft = state.submissionReview.feedback[draftKey] ?? row.teacherFeedback ?? "";
  const aiLoading = state.submissionReview.aiLoading === draftKey;
  return `
    <div class="submission-card">
      <div class="assignment-top">
        <div>
          <h3>${escapeHtml(row.student.name || "Student")}</h3>
          <div class="assignment-meta">
            <span>${escapeHtml(row.assignment.title)}</span>
            <span>${escapeHtml(row.assignment.topic)}</span>
            <span>Submitted ${formatShortDate(row.submittedAt)}</span>
          </div>
        </div>
        <span class="pill ${statusPill(status)}">${escapeHtml(status === "Completed" ? "Verified" : status)}</span>
      </div>
      ${row.grade !== null ? `
        <div class="assignment-meta">
          <span class="pill green">Grade ${formatGrade(row.grade)}</span>
          ${row.gradeUpdatedAt ? `<span>Updated ${formatShortDate(row.gradeUpdatedAt)}</span>` : ""}
        </div>
      ` : ""}
      ${row.studentComment ? `
        <div class="student-submit-comment">
          <strong>Student comment</strong>
          <p>${escapeHtml(row.studentComment)}</p>
        </div>
      ` : ""}
      ${renderSubmissionAnswers(row)}
      ${row.drawing || row.documents.length ? `
        <div class="work-attachments compact-submission-files">
          ${row.drawing ? `
            <a class="work-attachment drawing-preview" href="${escapeHtml(row.drawing.url)}" target="_blank" rel="noopener">
              <img src="${escapeHtml(row.drawing.url)}" alt="Drawing from ${escapeHtml(row.student.name || "student")}" />
              <span><strong>${escapeHtml(row.drawing.name || "Math drawing")}</strong><small>Drawing</small></span>
            </a>
          ` : ""}
          ${row.documents.map((document) => `
            <a class="work-attachment" href="${escapeHtml(document.url)}" target="_blank" rel="noopener">
              <span class="attachment-icon">${documentIcon(document)}</span>
              <span><strong>${escapeHtml(document.name || "Uploaded work")}</strong><small>${formatBytes(document.size)}</small></span>
            </a>
          `).join("")}
        </div>
      ` : ""}
      ${row.teacherFeedback ? `<div class="assignment-meta"><span>Feedback: ${escapeHtml(row.teacherFeedback)}</span></div>` : ""}
      <div class="field-grid submission-grade-grid" style="margin-top: 12px;">
        <div class="field">
          <label for="grade-${safeDomId(draftKey)}">Worksheet grade (%)</label>
          <input
            id="grade-${safeDomId(draftKey)}"
            type="number"
            min="0"
            max="100"
            step="0.1"
            data-grade-draft="${escapeHtml(draftKey)}"
            value="${escapeHtml(gradeDraft)}"
            placeholder="0-100"
          />
        </div>
        <div class="field">
          <label for="feedback-${safeDomId(draftKey)}">Teacher comment</label>
          <input
            id="feedback-${safeDomId(draftKey)}"
            data-feedback-draft="${escapeHtml(draftKey)}"
            value="${escapeHtml(feedbackDraft)}"
            placeholder="Optional feedback"
          />
        </div>
      </div>
      <div class="actions" style="margin-top: 12px;">
        <button class="btn" data-action="suggest-submission-grade" data-student-id="${escapeHtml(row.student.id || "")}" data-assignment="${escapeHtml(row.assignmentId)}" ${aiLoading ? "disabled" : ""}>
          ${aiLoading ? "Asking local AI..." : "Refresh AI suggestion"}
        </button>
        <button class="btn primary" data-action="save-submission-grade" data-student-id="${escapeHtml(row.student.id || "")}" data-assignment="${escapeHtml(row.assignmentId)}">Save grade and verify</button>
        <button class="btn" data-action="request-correction" data-student-id="${escapeHtml(row.student.id || "")}" data-assignment="${escapeHtml(row.assignmentId)}" ${row.verificationStatus === "needs-correction" ? "disabled" : ""}>Request correction</button>
      </div>
      ${renderAiGradeFeedbackPrompt(row)}
    </div>
  `;
}

function renderAiGradeFeedbackPrompt(row) {
  const prompt = state.submissionReview.aiFeedback || {};
  if (prompt.studentId !== row.student.id || prompt.assignmentId !== row.assignmentId) return "";
  return `
    <div class="submission-ai-feedback">
      <strong>Optional AI feedback</strong>
      <span>${escapeHtml(prompt.notice || "Tell MathBridge what the AI should learn from this grade.")}</span>
      <textarea
        data-bind="submissionReview.aiFeedback.draft"
        placeholder="Example: Do not mention estimation unless I include it in the question."
      >${escapeHtml(prompt.draft || "")}</textarea>
      <div class="actions">
        <button class="btn primary" data-action="save-ai-grade-feedback" data-student-id="${escapeHtml(row.student.id || "")}" data-assignment="${escapeHtml(row.assignmentId)}" ${prompt.saving ? "disabled" : ""}>
          ${prompt.saving ? "Saving..." : "Send feedback to AI"}
        </button>
        <button class="btn" data-action="dismiss-ai-grade-feedback">Skip</button>
      </div>
    </div>
  `;
}

function submissionAutoGradeKey(row) {
  return `${submissionDraftKey(row.student.id, row.assignmentId)}:${row.submittedAt || ""}:${row.updatedAt || ""}`;
}

function shouldAutoSuggestGrade(row) {
  if (state.auth.user?.role !== "teacher" || state.page !== "Student Submissions") return false;
  if (state.submissionReview.aiLoading) return false;
  if (row.verificationStatus === "verified") return false;
  const draftKey = submissionDraftKey(row.student.id, row.assignmentId);
  if (state.submissionReview.grades[draftKey] || state.submissionReview.feedback[draftKey]) return false;
  if (row.grade !== null || row.teacherFeedback) return false;
  return !state.submissionReview.aiRequested?.[submissionAutoGradeKey(row)];
}

function scheduleAutoGradeSuggestions(rows) {
  const row = rows.find(shouldAutoSuggestGrade);
  if (!row) return;
  const autoKey = submissionAutoGradeKey(row);
  state.submissionReview.aiRequested = {
    ...(state.submissionReview.aiRequested || {}),
    [autoKey]: true,
  };
  window.setTimeout(() => {
    if (state.page !== "Student Submissions" || state.auth.user?.role !== "teacher") return;
    suggestSubmissionGrade(row.student.id, row.assignmentId, { automatic: true });
  }, 0);
}

function renderSubmissionAnswers(row) {
  const answers = Array.isArray(row.answers) ? row.answers : [];
  if (!answers.some((answer) => String(answer || "").trim())) return "";
  const questions = Array.isArray(row.assignment.questions) ? row.assignment.questions : [];
  return `
    <div class="typed-answer-review">
      <strong>Typed answers</strong>
      <ol>
        ${answers.map((answer, index) => {
          const question = questions[index] ? normalizeHomeworkQuestion(questions[index]) : null;
          const displayAnswer = Array.isArray(answer) ? answer.join(", ") : answer;
          return `
            <li>
              ${question ? `<span class="math-text">${escapeHtml(question.prompt)}</span><span class="pill">${questionModeLabel(question)}</span>` : ""}
              <b>${escapeHtml(displayAnswer || "No answer selected")}</b>
            </li>
          `;
        }).join("")}
      </ol>
    </div>
  `;
}

function renderClassProgressPage() {
  const classStudents = getClassStudents();
  const analytics = classGradeAnalytics();
  return `
    ${renderTeacherClassSwitcher()}
    <section class="metric-row">
      ${metric("Students", String(classStudents.length), "in active class")}
      ${metric("Class average", analytics.averageLabel, "graded worksheets")}
      ${metric("Graded", String(analytics.gradedCount), "worksheets")}
      ${metric("Submitted", String(getSubmissionRows().length), "waiting/reviewed")}
    </section>
    ${renderClassGradeAnalytics()}
    <section class="grid equal">
      ${renderTopicPerformance("Class Units", gradeTopicScores())}
      <div class="surface">
        <h2>Progress by Student</h2>
        ${analytics.rows.length ? renderGradeTable(analytics.rows) : `<div class="empty" style="margin-top: 14px;">No students assigned to this class yet.</div>`}
      </div>
    </section>
  `;
}

function renderAnnouncementsPage() {
  const items = state.announcementLibrary;
  return `
    <section class="grid two">
      <div class="surface">
        <h2>Announcements</h2>
        ${state.announcementDraft.notice ? `<div class="message-notice">${escapeHtml(state.announcementDraft.notice)}</div>` : ""}
        <div class="announcement-list" style="margin-top: 14px;">
          ${items.length ? items.map(renderAnnouncementCard).join("") : `<div class="empty">No announcements posted or scheduled yet.</div>`}
        </div>
      </div>
      <div class="surface">
        <h2>New Announcement</h2>
        <div class="field-grid" style="margin-top: 14px;">
          <div class="field full">
            <label for="announcement-title">Title</label>
            <input id="announcement-title" data-bind="announcementDraft.title" value="${escapeHtml(state.announcementDraft.title)}" />
          </div>
          <div class="field full">
            <label for="announcement-message">Message</label>
            <textarea id="announcement-message" data-bind="announcementDraft.message">${escapeHtml(state.announcementDraft.message)}</textarea>
          </div>
          <div class="field full">
            <label for="announcement-scheduled-at">Schedule date and time</label>
            <input id="announcement-scheduled-at" type="datetime-local" data-bind="announcementDraft.scheduledAt" value="${escapeHtml(state.announcementDraft.scheduledAt)}" />
          </div>
        </div>
        <div class="actions" style="margin-top: 14px;">
          <button class="btn primary" data-action="post-announcement" ${state.announcementDraft.submitting ? "disabled" : ""}>
            ${state.announcementDraft.submitting ? "Posting..." : "Post"}
          </button>
          <button class="btn" data-action="schedule-announcement" ${state.announcementDraft.submitting ? "disabled" : ""}>
            ${state.announcementDraft.submitting ? "Scheduling..." : "Schedule"}
          </button>
        </div>
      </div>
    </section>
  `;
}

function renderAnnouncementCard(item) {
  const isScheduled = item.status === "scheduled";
  const canTakeDown = state.role === "teacher" && item.id;
  return `
    <div class="announcement ${isScheduled ? "scheduled" : ""}">
      <strong>${escapeHtml(item.title)}</strong>
      <span>${escapeHtml(item.message)}</span>
      <small>${isScheduled ? `Scheduled for ${formatDateTime(item.scheduledAt)}` : `Posted ${formatDateTime(item.postedAt || item.createdAt)}`}</small>
      ${canTakeDown ? `
        <div class="actions" style="margin-top: 10px;">
          <button class="btn coral" data-action="delete-announcement" data-announcement="${escapeHtml(item.id)}">Take down</button>
        </div>
      ` : ""}
    </div>
  `;
}

function renderParentDashboard() {
  const child = parentChildName();
  const parentAssignments = getParentAssignments();
  const stats = assignmentStats(parentAssignments);
  if (!state.parent.selectedStudentId) {
    return `
      <section class="surface">
        <h2>Select a Student</h2>
        <p class="meta-line">Choose a signed-up student above to see homework status, progress, and teacher messages for that student.</p>
      </section>
    `;
  }
  return `
    <section class="metric-row">
      ${metric(`${child}'s homework`, `${stats.completed}/${stats.total}`, "completed")}
      ${metric(`Missing for ${child}`, String(stats.missing), "assignment")}
      ${metric("Steps done", `${stats.completedSteps}/${stats.totalSteps}`, "homework steps")}
      ${metric("Average", stats.average, "current unit")}
    </section>
    <section class="grid two">
      <div class="surface">
        <h2>Weekly Progress Report</h2>
        <div class="report-card" style="margin-top: 14px;">
          <h3>This Week</h3>
          <p>Homework completed: ${stats.completed}/${stats.total}</p>
          <p>Open steps: ${stats.openSteps}</p>
          <p>Upcoming quiz: Friday</p>
          <p>Teacher suggestion: keep practicing before the quiz.</p>
        </div>
      </div>
      <div class="surface">
        <h2>Teacher Messages</h2>
        <div class="message-card" style="margin-top: 14px;">
          <h3>${escapeHtml(primaryTeacherName())}</h3>
          <p>No teacher progress note has been posted for ${escapeHtml(child)} yet.</p>
          <div class="actions">
            <button class="btn primary" data-action="reply-parent-teacher">Reply</button>
            <button class="btn" data-page="Progress Report">View report</button>
          </div>
        </div>
      </div>
    </section>
    <section class="grid equal">
      ${renderTopicPerformance(`${child}'s Units`, topicScoresForAssignments(parentAssignments))}
      <div class="surface">
        <h2>Upcoming Tests</h2>
        <div class="assignment-list" style="margin-top: 14px;">
          <div class="assignment-card">
            <div class="assignment-top">
              <div>
                <h3>Equations quiz</h3>
                <div class="assignment-meta"><span>Friday</span><span>${UNIT_ALGEBRA}</span></div>
              </div>
              <span class="pill amber">Upcoming</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderParentHomeworkPage() {
  const child = parentChildName();
  const parentAssignments = getParentAssignments();
  return `
    <section class="surface">
      <div class="section-head">
        <div>
          <h2>${child}'s Homework Status</h2>
          <p>Read-only parent view. Student work stays on ${child}'s account.</p>
        </div>
      </div>
      <div class="assignment-list" style="margin-top: 14px;">
        ${parentAssignments.length ? parentAssignments.map(renderParentAssignmentStatus).join("") : `<div class="empty">Select a student to view homework.</div>`}
      </div>
    </section>
  `;
}

function renderParentReportPage() {
  const child = parentChildName();
  const parentAssignments = getParentAssignments();
  const stats = assignmentStats(parentAssignments);
  return `
    <section class="grid equal">
      <div class="surface">
        <h2>Weekly Report</h2>
        <div class="report-card" style="margin-top: 14px;">
          <h3>Summary</h3>
          <p>Student: ${escapeHtml(child)}</p>
          <p>Homework completed: ${stats.completed}/${stats.total}</p>
          <p>Missing: ${stats.missing} assignment</p>
          <p>Steps done: ${stats.completedSteps}/${stats.totalSteps}</p>
          <p>Upcoming quiz: Friday</p>
        </div>
      </div>
      ${renderTopicPerformance("Unit Breakdown", topicScoresForAssignments(parentAssignments))}
    </section>
  `;
}

function renderUpcomingTestsPage() {
  return `
    <section class="surface">
      <h2>Upcoming Tests</h2>
      <div class="calendar-strip" style="margin-top: 14px;">
        <div class="day-tile"><strong>Fri</strong><span>Equations quiz</span><span>15 questions</span></div>
        <div class="day-tile"><strong>Next Tue</strong><span>Algebra check</span><span>Coordinate plane</span></div>
        <div class="day-tile"><strong>Next Fri</strong><span>Unit review</span><span>Ratios and algebra</span></div>
      </div>
    </section>
  `;
}

function renderAssignmentCard(item) {
  return `
    <article class="${assignmentCardClass(item)}">
      <div class="assignment-top">
        <div>
          <h3>${item.title}</h3>
          <div class="assignment-meta">
            <span>${item.topic}</span>
            <span>${item.due}</span>
            <span>Written work: ${item.requiredWork}</span>
          </div>
        </div>
        <span class="pill ${statusPill(item.status)}">${item.status}</span>
      </div>
      <div class="progress-track" aria-label="${percent(item)} percent complete">
        <div class="progress-fill" style="--value: ${percent(item)}%; --bar: ${item.status === "Missing" ? "var(--coral)" : "var(--green)"};"></div>
      </div>
      <div class="assignment-meta">
        <span>${item.progress}/${item.total} steps complete</span>
        ${item.score ? `<span>Score ${item.score}</span>` : ""}
      </div>
    </article>
  `;
}

function renderTeacherAssignmentCard(item) {
  const assignedCount = Array.isArray(item.assignedStudentIds) && item.assignedStudentIds.length
    ? item.assignedStudentIds.length
    : getClassStudents().length;
  const submissions = assignmentSubmissionCounts(item.id);
  return `
    <article class="${assignmentCardClass(item)}">
      <div class="assignment-top">
        <div>
          <h3>${escapeHtml(item.title)}</h3>
          <div class="assignment-meta">
            <span>${escapeHtml(item.topic)}</span>
            <span>${escapeHtml(item.due)}</span>
            <span>Written work: ${escapeHtml(item.requiredWork)}</span>
          </div>
        </div>
        <span class="pill ${statusPill(item.status)}">${escapeHtml(item.status)}</span>
      </div>
      <div class="assignment-meta">
        <span>Assigned to ${assignedCount} student${assignedCount === 1 ? "" : "s"}</span>
        ${item.questions?.length ? `<span>${item.questions.length} teacher-made question${item.questions.length === 1 ? "" : "s"}</span>` : ""}
        <span>${item.total} checklist steps</span>
        <span>${item.videoUrl || item.videoLink ? "Lesson video attached" : "No lesson video"}</span>
        <span>${item.pageUrl ? "Page attached" : "No page attached"}</span>
        <span>${item.bridgeSpace ? "BridgeSpace on" : "BridgeSpace off"}</span>
        <span>${item.resources?.length || 0} saved material${item.resources?.length === 1 ? "" : "s"}</span>
        <span>${submissions.submitted}/${assignedCount} submitted</span>
        <span>${submissions.verified} verified</span>
      </div>
      <div class="actions" style="margin-top: 12px;">
        <button class="btn coral" data-action="delete-assignment" data-assignment="${escapeHtml(item.id)}">Take down</button>
      </div>
    </article>
  `;
}

function assignmentSubmissionCounts(assignmentId) {
  return state.submissions.reduce(
    (summary, submission) => {
      const work = submission.work?.assignments?.[assignmentId];
      if (work?.submittedAt) summary.submitted += 1;
      if (work?.verificationStatus === "verified") summary.verified += 1;
      return summary;
    },
    { submitted: 0, verified: 0 },
  );
}

function renderStudentAssignmentCard(item) {
  return `
    <article class="${assignmentCardClass(item)}" data-assignment-card="${safeDomId(item.id)}">
      <div class="assignment-top">
        <div>
          <h3>${escapeHtml(item.title)}</h3>
          <div class="assignment-meta">
            <span>${escapeHtml(item.topic)}</span>
            <span>${escapeHtml(item.due)}</span>
            <span>Written work: ${escapeHtml(item.requiredWork)}</span>
          </div>
        </div>
        <span class="pill ${statusPill(item.status)}">${escapeHtml(item.status)}</span>
      </div>
      <div class="progress-track" aria-label="${percent(item)} percent complete">
        <div class="progress-fill" style="--value: ${percent(item)}%; --bar: ${item.status === "Missing" ? "var(--coral)" : "var(--green)"};"></div>
      </div>
      <div class="assignment-meta">
        <span>${item.progress}/${item.total} steps complete</span>
        <span>${item.total - item.progress} steps left</span>
        <span class="pill ${statusPill(item.status)}">${escapeHtml(submissionLabel(item))}</span>
      </div>
      ${renderAssignmentLessonVideo(item)}
      ${renderAssignmentMaterials(item)}
      ${item.bridgeSpace ? renderBridgeSpacePanel(item) : ""}
      ${!item.bridgeSpace && item.questions?.length ? renderAssignmentAnswerPanel(item) : ""}
      ${!item.bridgeSpace ? renderAssignmentAiHelpPanel(item) : ""}
      <div class="checklist compact-checklist">
        ${renderChecklist(item)}
      </div>
      ${renderWorkUploadPanel(item)}
    </article>
  `;
}

function renderAssignmentLessonVideo(item) {
  if (!item.videoUrl && !item.videoLink) return "";
  return `
    <div class="assignment-video">
      <strong>Lesson video</strong>
      ${renderLessonMedia({
        title: item.videoName || `${item.topic} lesson`,
        videoUrl: item.videoUrl,
        videoLink: item.videoLink,
      }, "card")}
    </div>
  `;
}

function renderAssignmentMaterials(item) {
  const resources = Array.isArray(item.resources) ? item.resources : [];
  const visible = resources.filter((resource) => {
    const href = materialHref(resource);
    if (!href) return false;
    return href !== item.videoUrl && href !== item.videoLink && href !== item.pageUrl;
  });
  if (!visible.length) return "";
  return `
    <div class="assignment-materials">
      <strong>Teacher materials</strong>
      <div class="material-list compact">
        ${visible.map((resource) => `
          <a class="material-card compact" href="${escapeHtml(materialHref(resource))}" target="_blank" rel="noopener">
            <span class="material-icon">${materialIcon(resource)}</span>
            <span>
              <strong>${escapeHtml(resource.title || resource.name || "Teacher material")}</strong>
              <small>${materialKindLabel(resource.kind)}${resource.size ? ` - ${formatBytes(resource.size)}` : ""}</small>
            </span>
          </a>
        `).join("")}
      </div>
    </div>
  `;
}

function renderBridgeSpacePanel(item) {
  return `
    <div class="bridge-launch">
      <div>
        <strong>BridgeSpace activity</strong>
        <span>Opens as a separate full-screen question space with tools, steps, hints, and lesson support.</span>
      </div>
      <button class="btn primary" data-action="open-bridgespace" data-assignment="${escapeHtml(item.id)}">Start BridgeSpace</button>
    </div>
  `;
}

function renderBridgeSpaceExperience(item) {
  const questions = Array.isArray(item.questions) ? item.questions.map(normalizeHomeworkQuestion).filter((question) => question.prompt) : [];
  const questionCount = Math.max(questions.length, 1);
  const questionIndex = Math.min(Math.max(Number(state.bridgeSpace.questionIndex) || 0, 0), questionCount - 1);
  const question = questions[questionIndex] || { type: "text", prompt: "Complete the attached teacher material.", choices: [] };
  const answers = answerDraftsForAssignment(item);
  const answer = answers[questionIndex];
  const inputId = `bridge-answer-${safeDomId(item.id)}-${questionIndex}`;
  const tab = state.bridgeSpace.tab || "practice";
  const answered = typedAnswerCount(item);
  const progressValue = Math.round(((questionIndex + 1) / questionCount) * 100);
  const hasAnswer = bridgeAnswerHasValue(answer);
  const isLastQuestion = questionIndex >= questionCount - 1;
  const title = item.title || "BridgeSpace";
  const points = answered * 10;

  return `
    <main class="bridge-experience" aria-label="BridgeSpace activity">
      <header class="bridge-full-header">
        <button class="bridge-back-button" data-action="close-bridgespace" aria-label="Back to homework">←</button>
        <div class="bridge-activity-mark" aria-hidden="true">
          <span>2</span>
          <span>3</span>
        </div>
        <div class="bridge-full-title">
          <strong>${escapeHtml(title)}</strong>
          <span>${escapeHtml(item.topic)} · ${questionModeLabel(question)}</span>
        </div>
        <div class="bridge-reward-strip" aria-label="${answered} answered questions">
          ${[0, 1, 2].map((index) => `<span class="${answered > index ? "earned" : ""}">★</span>`).join("")}
          <button class="bridge-dropdown-button" data-action="bridge-tab" data-tab="${tab === "practice" ? "lesson" : "practice"}" aria-label="Switch BridgeSpace tool">⌄</button>
          <div class="bridge-points">
            <strong>⚡ ${points}</strong>
            <span>${answered}/${questionCount}</span>
          </div>
        </div>
      </header>

      <section class="bridge-full-progress">
        <span>Question ${questionIndex + 1} of ${questionCount}</span>
        <div class="bridge-progress" aria-label="${progressValue} percent through BridgeSpace">
          <span style="width: ${progressValue}%;"></span>
        </div>
      </section>

      <div class="bridge-full-stage">
        ${renderBridgeSpaceTabContent(item, question, questionIndex, answer, inputId)}
      </div>

      <aside class="bridge-full-tools" aria-label="BridgeSpace tools">
        <button data-action="bridge-help" data-assignment="${escapeHtml(item.id)}"><span>?</span>Help</button>
        <button data-action="bridge-tab" data-tab="lesson"><span>L</span>Lesson</button>
        <button data-action="bridge-tab" data-tab="toolbox"><span>▦</span>Toolbox</button>
        <button data-action="bridge-tab" data-tab="worksheet"><span>⋮</span>More</button>
      </aside>

      <footer class="bridge-full-footer">
        <button class="bridge-submit-step ${hasAnswer ? "ready" : ""}" data-action="bridge-check" data-assignment="${escapeHtml(item.id)}">Submit step</button>
        <button class="bridge-next-step" data-action="bridge-next" data-assignment="${escapeHtml(item.id)}" ${isLastQuestion ? "disabled" : ""}>
          View next step <span>⌄</span>
        </button>
      </footer>
      ${renderBridgeFeedback(item, isLastQuestion)}
      ${state.aiHelp.assignmentId === item.id ? `<section class="bridge-full-ai">${renderAssignmentAiHelpPanel(item)}</section>` : ""}
    </main>
  `;
}

function renderBridgeSpaceTabContent(item, question, questionIndex, answer, inputId) {
  const tab = state.bridgeSpace.tab || "practice";
  if (tab === "lesson") {
    return `
      <div class="bridge-card">
        <span class="bridge-pill">Lesson</span>
        <h3>${escapeHtml(item.topic)}</h3>
        <p>${item.videoUrl || item.videoLink ? "Watch the teacher lesson, then return to Practice." : "No lesson video is attached yet. Use the question and your teacher materials to get started."}</p>
        ${item.videoUrl || item.videoLink ? renderLessonMedia({
          title: item.videoName || `${item.topic} lesson`,
          videoUrl: item.videoUrl,
          videoLink: item.videoLink,
        }, "bridge") : ""}
        <div class="actions">
          <button class="btn primary" data-action="bridge-tab" data-tab="practice">Back to practice</button>
        </div>
      </div>
    `;
  }

  if (tab === "worksheet") {
    return `
      <div class="bridge-card">
        <span class="bridge-pill">Worksheet</span>
        <h3>${escapeHtml(item.pageName || "Teacher worksheet")}</h3>
        ${item.pageUrl ? `
          <a class="bridge-worksheet-link" href="${escapeHtml(item.pageUrl)}" target="_blank" rel="noopener">
            <img src="${escapeHtml(item.pageUrl)}" alt="${escapeHtml(item.pageName || "Assignment page")}" />
            <span>Open worksheet page</span>
          </a>
        ` : `<p>Teacher has not assigned a page for this assignment.</p>`}
        <div class="actions">
          <button class="btn" data-action="open-drawing" data-assignment="${escapeHtml(item.id)}">Draw work</button>
          <button class="btn primary" data-action="bridge-tab" data-tab="practice">Back to practice</button>
        </div>
      </div>
    `;
  }

  if (tab === "toolbox") {
    return `
      <div class="bridge-card bridge-toolbox-card">
        <span class="bridge-pill">Toolbox</span>
        <h3>Math tools</h3>
        <div class="bridge-tool-grid">
          <button class="btn" data-action="bridge-key" data-key="+">Add</button>
          <button class="btn" data-action="bridge-key" data-key="-">Subtract</button>
          <button class="btn" data-action="bridge-key" data-key="×">Multiply</button>
          <button class="btn" data-action="bridge-key" data-key="÷">Divide</button>
          <button class="btn" data-action="bridge-key" data-key="sqrt">Square root</button>
          <button class="btn" data-action="bridge-key" data-key="x^2">Exponent</button>
        </div>
        <div class="actions">
          <button class="btn primary" data-action="bridge-tab" data-tab="practice">Back to question</button>
        </div>
      </div>
    `;
  }

  return `
    <div class="bridge-question-screen">
      <div class="bridge-question-main">
        <span class="bridge-question-number">${questionIndex + 1}.</span>
        <div class="bridge-question-body">
          <h2 class="math-text">${escapeHtml(question.prompt)}</h2>
          <p>${escapeHtml(bridgeInstruction(question))}</p>
          ${renderBridgeAnswerEntry(item, question, questionIndex, answer, inputId)}
          <div class="bridge-actions">
            <button class="btn" data-action="bridge-help" data-assignment="${escapeHtml(item.id)}">Hint</button>
            <button class="btn" data-action="bridge-show-steps">Show steps</button>
            <button class="btn" data-action="bridge-tab" data-tab="lesson" ${item.videoUrl || item.videoLink ? "" : "disabled"}>Watch video</button>
            <button class="btn primary" data-action="bridge-check" data-assignment="${escapeHtml(item.id)}">Check answer</button>
          </div>
          <div class="bridge-working">
            <label for="bridge-working-${safeDomId(item.id)}">Your working</label>
            <textarea id="bridge-working-${safeDomId(item.id)}" data-bind="bridgeSpace.working" placeholder="Write your steps here. You can also use the math keyboard below.">${escapeHtml(state.bridgeSpace.working)}</textarea>
          </div>
        </div>
      </div>
      ${renderBridgeKeyboard(item)}
    </div>
  `;
}

function renderBridgeAnswerEntry(item, question, questionIndex, answer, inputId) {
  const control = renderAssignmentAnswerControl(item, question, questionIndex, answer, inputId);
  if (question.type === "text") {
    return `
      <div class="bridge-answer-line">
        <span>=</span>
        ${control.replace("placeholder=\"Type your answer\"", "placeholder=\"Enter your next step here\"")}
      </div>
    `;
  }
  return `<div class="bridge-choice-wrap">${control}</div>`;
}

function renderBridgeFeedback(item, isLastQuestion) {
  const notice = state.bridgeSpace.notice || (state.workUpload.assignmentId === item.id ? state.workUpload.notice : "");
  if (!notice) return "";
  const kind = bridgeFeedbackKind(notice);
  return `
    <section class="bridge-feedback-panel ${kind}" aria-live="polite">
      <div>
        <strong>${kind === "success" ? "Nice. You're on the right track." : kind === "warning" ? "Try that one again." : "BridgeSpace update"}</strong>
        <p>${escapeHtml(notice)}</p>
      </div>
      <button class="btn primary" data-action="${isLastQuestion ? "submit-work" : "bridge-next"}" data-assignment="${escapeHtml(item.id)}">
        ${isLastQuestion ? "Submit to teacher" : "Continue"}
      </button>
    </section>
  `;
}

function bridgeFeedbackKind(notice) {
  if (/\b(correct|saved|submitted|messaged|verified|right track)\b/i.test(notice)) return "success";
  if (/\b(not quite|try|recheck|first|add an answer)\b/i.test(notice)) return "warning";
  return "info";
}

function bridgeAnswerHasValue(answer) {
  return Array.isArray(answer)
    ? answer.some((value) => String(value || "").trim())
    : String(answer || "").trim().length > 0;
}

function renderBridgeKeyboard(item) {
  const keys = ["7", "8", "9", "÷", "x", "y", "(", ")", "x^2", "sqrt", "4", "5", "6", "×", "+", "=", "<", ">", "≤", "≥", "1", "2", "3", "-", ".", ",", "|x|", "π", "%", "0", "/"];
  return `
    <div class="bridge-keyboard" aria-label="Math keyboard">
      <div class="bridge-key-tabs">
        <button class="active" data-action="bridge-key" data-key="">123</button>
        <button data-action="bridge-key" data-key="">abc</button>
        <button data-action="bridge-key" data-key="">aβγ</button>
      </div>
      <div class="bridge-keys">
        ${keys.map((key) => `<button data-action="bridge-key" data-key="${escapeHtml(key)}">${escapeHtml(key)}</button>`).join("")}
      </div>
      <div class="bridge-key-actions">
        <button data-action="bridge-key" data-key="backspace">⌫</button>
        <button data-action="bridge-key" data-key="clear">C</button>
        <button class="primary" data-action="bridge-check" data-assignment="${escapeHtml(item.id)}">↵</button>
      </div>
    </div>
  `;
}

function bridgeInstruction(question) {
  if (question.type === "multiple-choice") return "Choose one answer, then check in with your teacher if you are unsure.";
  if (question.type === "select-all") return "Select every answer that is correct. There may be more than one.";
  return "Enter your answer in the box.";
}

function renderAssignmentAnswerPanel(item) {
  const answers = answerDraftsForAssignment(item);
  const answered = typedAnswerCount(item);
  const notice = state.answerStatus.assignmentId === item.id && state.answerStatus.notice
    ? `<div class="work-notice">${escapeHtml(state.answerStatus.notice)}</div>`
    : "";
  return `
    <div class="answer-entry-panel">
      <div class="work-panel-head">
        <div>
          <strong>Type your answers</strong>
          <span>${answered}/${item.questions.length} answer${item.questions.length === 1 ? "" : "s"} typed. Press Enter or Save answers.</span>
        </div>
        <button class="btn primary" data-action="save-assignment-answers" data-assignment="${escapeHtml(item.id)}">Save answers</button>
      </div>
      <ol class="answer-entry-list">
        ${item.questions.map((question, index) => {
          const normalized = normalizeHomeworkQuestion(question);
          const inputId = `assignment-answer-${safeDomId(item.id)}-${index}`;
          return `
            <li>
              <div class="answer-question-head">
                <label for="${inputId}">
                  <span class="math-text">${escapeHtml(normalized.prompt)}</span>
                </label>
                <div class="actions answer-question-actions">
                  <span class="pill">${questionModeLabel(normalized)}</span>
                  <button class="btn" data-action="start-ai-help" data-assignment="${escapeHtml(item.id)}" data-question-index="${index}">I need help on this</button>
                </div>
              </div>
              ${renderAssignmentAnswerControl(item, normalized, index, answers[index], inputId)}
            </li>
          `;
        }).join("")}
      </ol>
      ${notice}
    </div>
  `;
}

function renderAiHelpThread(item, questionIndex) {
  const thread = aiHelpThread(item.id, questionIndex);
  if (!thread.length) {
    return `<div class="ai-help-empty">Ask a question, check your attempt, or ask what step to try next.</div>`;
  }
  return `
    <div class="thread ai-help-thread" aria-live="polite">
      ${thread.map((entry) => {
        const own = entry.role === "user";
        return `
          <div class="bubble ${own ? "message-own" : "message-other"}">
            <strong>${own ? "You" : "Local AI"}</strong>
            ${escapeHtml(entry.content).replace(/\n/g, "<br>")}
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderAssignmentAiHelpPanel(item) {
  const active = state.aiHelp.assignmentId === item.id;
  if (!active) {
    return `
      <div class="actions ai-help-launch">
        <button class="btn" data-action="start-ai-help" data-assignment="${escapeHtml(item.id)}" data-question-index="0">I need help on this</button>
      </div>
    `;
  }
  const questions = Array.isArray(item.questions) ? item.questions.map(normalizeHomeworkQuestion) : [];
  const questionIndex = Math.min(Number(state.aiHelp.questionIndex) || 0, Math.max(questions.length - 1, 0));
  const currentQuestion = questions[questionIndex] || null;
  const sourceLabel = state.aiHelp.source === "local-ai"
    ? "Local AI"
    : state.aiHelp.source
      ? "Guided hints"
      : "Ready";
  const sourceClass = state.aiHelp.source === "local-ai" ? "green" : state.aiHelp.source ? "amber" : "";
  return `
    <div class="ai-help-panel">
      <div class="work-panel-head">
        <div>
          <strong>Local AI tutor</strong>
          <span>Ask follow-up questions. It can confirm your own answer when your check looks right.</span>
        </div>
        <span class="pill ${sourceClass}">${sourceLabel}</span>
      </div>
      ${renderAiHelpThread(item, questionIndex)}
      <div class="field-grid" style="margin-top: 12px;">
        ${questions.length ? `
          <div class="field">
            <label for="ai-help-question-${safeDomId(item.id)}">Question</label>
            <select id="ai-help-question-${safeDomId(item.id)}" data-bind="aiHelp.questionIndex">
              ${questions.map((question, index) => `<option value="${index}" ${questionIndex === index ? "selected" : ""}>Question ${index + 1}: ${escapeHtml(question.prompt).slice(0, 80)}</option>`).join("")}
            </select>
          </div>
        ` : ""}
        <div class="field ${questions.length ? "" : "full"}">
          <label for="ai-help-attempt-${safeDomId(item.id)}">What have you tried?</label>
          <input id="ai-help-attempt-${safeDomId(item.id)}" data-bind="aiHelp.attempt" value="${escapeHtml(state.aiHelp.attempt)}" placeholder="Example: I subtracted 6 first." />
        </div>
        <div class="field full">
          <label for="ai-help-message-${safeDomId(item.id)}">Message the tutor</label>
          <textarea id="ai-help-message-${safeDomId(item.id)}" data-bind="aiHelp.message" placeholder="Example: I got x = 5. Is that correct?">${escapeHtml(state.aiHelp.message)}</textarea>
        </div>
      </div>
      ${currentQuestion ? `<div class="meta-line" style="margin-top: 10px;">Current question: ${escapeHtml(currentQuestion.prompt)}</div>` : ""}
      <div class="actions" style="margin-top: 12px;">
        <button class="btn primary" data-action="ask-ai-help" data-assignment="${escapeHtml(item.id)}" ${state.aiHelp.loading ? "disabled" : ""}>
          ${state.aiHelp.loading ? "Thinking..." : "Send to local AI"}
        </button>
        <button class="btn" data-action="clear-ai-help-chat" data-assignment="${escapeHtml(item.id)}">Clear AI chat</button>
        <button class="btn" data-action="ask-teacher-for-ai-question" data-assignment="${escapeHtml(item.id)}">Ask teacher instead</button>
      </div>
      ${state.aiHelp.status ? `<div class="message-notice">${escapeHtml(state.aiHelp.status)}</div>` : ""}
    </div>
  `;
}

function renderAssignmentAnswerControl(item, question, index, answer, inputId) {
  const assignmentId = escapeHtml(item.id);
  if (question.type === "multiple-choice") {
    const name = `answer-${safeDomId(item.id)}-${index}`;
    return `
      <div class="choice-list">
        ${question.choices.map((choice, choiceIndex) => `
          <label class="choice-option">
            <input
              type="radio"
              name="${name}"
              data-assignment-answer="${assignmentId}"
              data-answer-index="${index}"
              data-answer-kind="single"
              value="${escapeHtml(choice)}"
              ${answer === choice ? "checked" : ""}
            />
            <span>${escapeHtml(choice)}</span>
          </label>
        `).join("")}
      </div>
    `;
  }
  if (question.type === "select-all") {
    const selected = new Set(Array.isArray(answer) ? answer : []);
    return `
      <div class="choice-list">
        ${question.choices.map((choice) => `
          <label class="choice-option">
            <input
              type="checkbox"
              data-assignment-answer="${assignmentId}"
              data-answer-index="${index}"
              data-answer-kind="multi"
              data-answer-choice="${escapeHtml(choice)}"
              ${selected.has(choice) ? "checked" : ""}
            />
            <span>${escapeHtml(choice)}</span>
          </label>
        `).join("")}
      </div>
    `;
  }
  return `
    <input
      id="${inputId}"
      data-assignment-answer="${assignmentId}"
      data-answer-index="${index}"
      data-answer-kind="text"
      value="${escapeHtml(answer || "")}"
      placeholder="Type your answer"
    />
  `;
}

function renderWorkUploadPanel(item) {
  const active = state.drawing.assignmentId === item.id;
  const inputId = `work-upload-${safeDomId(item.id)}`;
  const commentId = `submit-comment-${safeDomId(item.id)}`;
  const canSubmit = (hasWorkProof(item) || hasTypedAnswerProof(item)) && item.verificationStatus !== "verified" && item.status !== "Submitted";
  const typedAnswers = item.questions?.length ? typedAnswerCount(item) : 0;
  const comment = submitCommentForAssignment(item);
  const notice = state.workUpload.assignmentId === item.id && state.workUpload.notice
    ? `<div class="work-notice">${escapeHtml(state.workUpload.notice)}</div>`
    : "";
  return `
    <div class="work-panel">
      <div class="work-panel-head">
        <div>
          <strong>Written work</strong>
          <span>Upload a file or write steps in Draw Work.</span>
        </div>
        <div class="actions">
          <label class="btn upload-doc-button" for="${inputId}">Upload document</label>
          <input class="file-input-hidden" id="${inputId}" type="file" data-assignment-upload="${escapeHtml(item.id)}" accept="image/*,.pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain" />
          <button class="btn ${active ? "primary" : ""}" data-action="open-drawing" data-assignment="${escapeHtml(item.id)}">
            ${active ? "Close drawing" : "Draw work"}
          </button>
          <button class="btn primary" data-action="submit-work" data-assignment="${escapeHtml(item.id)}" ${canSubmit ? "" : "disabled"}>
            ${item.verificationStatus === "verified" ? "Verified" : item.status === "Submitted" ? "Submitted" : "Submit to teacher"}
          </button>
        </div>
      </div>
      <div class="assignment-meta">
        <span class="pill ${statusPill(item.status)}">${escapeHtml(submissionLabel(item))}</span>
        ${item.questions?.length ? `<span>Typed answers: ${typedAnswers}/${item.questions.length}</span>` : ""}
        ${item.pageUrl ? `<span>Teacher page assigned</span>` : `<span>Teacher has not assigned a page.</span>`}
        ${item.submittedAt ? `<span>Submitted ${formatShortDate(item.submittedAt)}</span>` : ""}
        ${item.grade !== null ? `<span>Grade: ${formatGrade(item.grade)}</span>` : ""}
        ${item.teacherFeedback ? `<span>Teacher: ${escapeHtml(item.teacherFeedback)}</span>` : ""}
      </div>
      ${notice}
      ${renderAssignedPage(item)}
      ${renderWorkAttachments(item)}
      <div class="field submit-comment-field">
        <label for="${commentId}">Comment for teacher</label>
        <textarea
          id="${commentId}"
          data-submit-comment="${escapeHtml(item.id)}"
          placeholder="Optional: tell your teacher what was hard, what you tried, or what to check."
        >${escapeHtml(comment)}</textarea>
      </div>
      ${active ? renderDrawingBoard(item) : ""}
    </div>
  `;
}

function renderAssignedPage(item) {
  if (!item.pageUrl) return "";
  return `
    <a class="assigned-page" href="${escapeHtml(item.pageUrl)}" target="_blank" rel="noopener">
      <span class="attachment-icon">PAGE</span>
      <span>
        <strong>${escapeHtml(item.pageName || "Teacher-assigned page")}</strong>
        <small>${isDrawablePage(item) ? "Draw Work opens this page as the canvas background." : "Open this teacher page as a reference."}</small>
      </span>
    </a>
  `;
}

function renderWorkAttachments(item) {
  const documents = Array.isArray(item.documents) ? item.documents : [];
  const drawing = item.drawing;
  const answered = item.questions?.length ? typedAnswerCount(item) : 0;
  if (!documents.length && !drawing) {
    return `
      <div class="work-empty">
        <strong>No written work uploaded yet.</strong>
        <span>${answered ? "Typed answers are saved. Add a drawing or document if your teacher asked to see steps." : item.pageUrl ? "Use Draw Work or Upload document when you are ready." : "Teacher has not assigned a page."}</span>
      </div>
    `;
  }
  return `
    <div class="work-attachments">
      ${drawing ? `
        <a class="work-attachment drawing-preview" href="${escapeHtml(drawing.url)}" target="_blank" rel="noopener">
          <img src="${escapeHtml(drawing.url)}" alt="Saved drawing for ${escapeHtml(item.title)}" />
          <span>
            <strong>${escapeHtml(drawing.name || "Math drawing")}</strong>
            <small>${formatShortDate(drawing.createdAt)}</small>
          </span>
        </a>
      ` : ""}
      ${documents
        .map(
          (document) => `
            <a class="work-attachment" href="${escapeHtml(document.url)}" target="_blank" rel="noopener">
              <span class="attachment-icon">${documentIcon(document)}</span>
              <span>
                <strong>${escapeHtml(document.name || "Uploaded work")}</strong>
                <small>${formatBytes(document.size)}${document.createdAt ? ` - ${formatShortDate(document.createdAt)}` : ""}</small>
              </span>
            </a>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderDrawingBoard(item) {
  return `
    <div class="drawing-board">
      <div class="drawing-toolbar">
        <div class="field color-field">
          <label for="drawing-color-${safeDomId(item.id)}">Ink</label>
          <input id="drawing-color-${safeDomId(item.id)}" type="color" data-bind="drawing.color" value="${escapeHtml(state.drawing.color)}" />
        </div>
        <div class="field stroke-field">
          <label for="drawing-size-${safeDomId(item.id)}">Size</label>
          <input id="drawing-size-${safeDomId(item.id)}" type="range" min="2" max="14" data-bind="drawing.size" value="${escapeHtml(state.drawing.size)}" />
        </div>
        <button class="btn" data-action="clear-drawing" data-assignment="${escapeHtml(item.id)}">Clear</button>
        <button class="btn primary" data-action="save-drawing" data-assignment="${escapeHtml(item.id)}">Save drawing</button>
      </div>
      <canvas id="work-canvas" class="work-canvas" width="1000" height="620" data-assignment-canvas="${escapeHtml(item.id)}" aria-label="Draw written math work for ${escapeHtml(item.title)}"></canvas>
      <div class="assignment-meta drawing-status">
        <span>Mouse, touch, Apple Pencil, or trackpad</span>
        ${state.drawing.pointer ? `<span>Input: ${escapeHtml(state.drawing.pointer)}</span>` : ""}
        <span class="drawing-message">${escapeHtml(state.drawing.status || "")}</span>
      </div>
    </div>
  `;
}

function renderPracticeQuestion(question, index) {
  const id = practiceQuestionId(question, index);
  const answer = state.practiceAnswers[id] || "";
  const result = state.practiceResults[id];
  const expected = answerKey[question]?.[0];
  return `
    <li class="practice-question ${result?.correct ? "correct" : result ? "incorrect" : ""}">
      <div class="question-row">
        <span class="math-text">${index + 1}. ${escapeHtml(question)}</span>
        <span class="pill">${state.selectedTopic}</span>
      </div>
      <div class="answer-row">
        <div class="field">
          <label for="answer-${id}">Your answer</label>
          <input id="answer-${id}" data-practice-answer="${id}" data-question="${escapeHtml(question)}" value="${escapeHtml(answer)}" placeholder="Type your answer" />
        </div>
        <button class="btn primary" data-action="check-answer" data-question-id="${id}" data-question="${escapeHtml(question)}">Check</button>
        <button class="btn" data-action="save-review" data-question-id="${id}" data-question="${escapeHtml(question)}">Review</button>
      </div>
      ${result ? renderPracticeResult(result, expected) : ""}
    </li>
  `;
}

function renderDailyChallenge() {
  const challenge = currentDailyChallenge();
  const result = state.dailyChallengeResult;
  return `
    <div class="surface compact daily-challenge" style="margin-top: 14px;">
      <div class="assignment-top">
        <div>
          <h3>Question of the Day</h3>
          <div class="assignment-meta">
            <span>${ONTARIO_GRADE9_QOTD_LABEL}</span>
            <span>${escapeHtml(challenge.topic)}</span>
            <span>${escapeHtml(challenge.dateLabel)}</span>
          </div>
        </div>
        <span class="pill blue">One per day</span>
      </div>
      <p>${escapeHtml(challenge.prompt)}</p>
      <div class="answer-row">
        <div class="field">
          <label for="daily-challenge-answer">Your answer</label>
          <input id="daily-challenge-answer" data-dmc-answer value="${escapeHtml(state.dailyChallengeAnswer)}" placeholder="Type your answer" />
        </div>
        <button class="btn primary" data-action="check-dmc">Check</button>
        <button class="btn" data-action="hint-dmc">Hint</button>
      </div>
      ${result ? renderDailyChallengeResult(result, challenge) : ""}
    </div>
  `;
}

function renderDailyChallengeResult(result, challenge) {
  if (result === "hint") {
    return `<div class="answer-feedback hint">Hint: ${escapeHtml(challenge.hint)}</div>`;
  }
  if (result === "correct") {
    return `<div class="answer-feedback correct">Correct. ${escapeHtml(challenge.solution)}</div>`;
  }
  return `<div class="answer-feedback incorrect">Not quite. Try using the hint, then check again.</div>`;
}

function renderPracticeResult(result, expected) {
  if (result.correct) {
    return `<div class="answer-feedback correct">Correct. Nice work.</div>`;
  }
  return `
    <div class="answer-feedback incorrect">
      Not quite. ${expected ? `Answer: <span class="math-text">${escapeHtml(expected)}</span>` : "Try again or save it for review."}
    </div>
  `;
}

function renderReviewItems() {
  const items = [...state.reviewItems];
  if (!items.length) return `<li><span class="meta-line">No review questions yet.</span></li>`;
  return items
    .map(
      (item) => `
        <li>
          <span class="math-text">${escapeHtml(item.question)}</span><br>
          <span class="meta-line">${escapeHtml(item.note)}</span>
        </li>
      `,
    )
    .join("");
}

function renderParentAssignmentStatus(item) {
  const child = parentChildName();
  return `
    <article class="${assignmentCardClass(item)} parent-status-card">
      <div class="assignment-top">
        <div>
          <h3>${item.title}</h3>
          <div class="assignment-meta">
            <span>${item.topic}</span>
            <span>${item.due}</span>
            <span>Written work: ${item.requiredWork}</span>
          </div>
        </div>
        <span class="pill ${statusPill(item.status)}">${item.status}</span>
      </div>
      <div class="progress-track" aria-label="${percent(item)} percent complete by ${child}">
        <div class="progress-fill" style="--value: ${percent(item)}%; --bar: ${item.status === "Missing" ? "var(--coral)" : "var(--green)"};"></div>
      </div>
      <div class="assignment-meta">
        <span>${child} has completed ${item.progress}/${item.total} student steps</span>
        ${item.score ? `<span>Score ${item.score}</span>` : ""}
        <span class="pill">Parent view only</span>
      </div>
    </article>
  `;
}

function renderChecklist(item) {
  return item.steps
    .map(
      (step, index) => `
        <div class="check-item ${step.done ? "done" : ""}">
          <button class="check-toggle" data-action="toggle-step" data-assignment="${escapeHtml(item.id)}" data-step="${index}" aria-label="Mark ${escapeHtml(step.label)} done">✓</button>
          <span>${escapeHtml(step.label)}</span>
          ${step.done
            ? `<span class="pill checklist-status green">Done</span>`
            : `<button class="pill checklist-status checklist-open-button" data-action="open-assignment-step" data-assignment="${escapeHtml(item.id)}" data-step="${index}">Open</button>`}
        </div>
      `,
    )
    .join("");
}

function renderLessonCard(lesson) {
  const takeDownButton = renderLessonTakeDownButton(lesson);
  return `
    <article class="lesson-card">
      <h3>${escapeHtml(lesson.title)}</h3>
      <p>${escapeHtml(lesson.goal)}</p>
      ${lesson.videoUrl || lesson.videoLink ? renderLessonMedia(lesson, "card") : ""}
      <div class="assignment-meta">
        <span>${lesson.teacherName ? `By ${escapeHtml(lesson.teacherName)}` : escapeHtml(lesson.video || "Lesson")}</span>
        <span>${escapeHtml(lesson.practice || "Practice questions")}</span>
        <span>${escapeHtml(lesson.quiz || "Mini quiz")}</span>
      </div>
      ${takeDownButton ? `
        <div class="actions" style="margin-top: 12px;">
          ${takeDownButton}
        </div>
      ` : ""}
    </article>
  `;
}

function renderLessonTakeDownButton(lesson) {
  const hasOwnershipFlag = Object.prototype.hasOwnProperty.call(lesson || {}, "canTakeDown");
  const canTakeDown =
    state.role === "teacher" &&
    lesson?.id &&
    (lesson.canTakeDown || (!hasOwnershipFlag && state.page === "Upload Lesson"));
  if (!canTakeDown) return "";
  return `<button class="btn coral" data-action="delete-lesson" data-lesson="${escapeHtml(lesson.id)}">Take down</button>`;
}

function renderLessonMedia(lesson, size = "card") {
  const title = escapeHtml(lesson.title || "Lesson video");
  if (lesson.videoUrl) {
    return `
      <video class="lesson-video ${size === "large" ? "large" : ""}" controls preload="metadata" src="${escapeHtml(lesson.videoUrl)}">
        ${title}
      </video>
    `;
  }
  if (lesson.videoLink) {
    const youtubeEmbed = youtubeEmbedUrl(lesson.videoLink);
    if (youtubeEmbed) {
      return `
        <div class="video-panel youtube-panel ${size === "large" ? "large" : ""}">
          <iframe
            class="lesson-video-frame"
            src="${escapeHtml(youtubeEmbed)}"
            title="${title}"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen>
          </iframe>
        </div>
      `;
    }
    return `
      <div class="video-panel lesson-link-panel ${size === "large" ? "large" : ""}">
        <div class="video-inner">
          <div class="play-button">LINK</div>
          <strong>${title}</strong>
          <a href="${escapeHtml(lesson.videoLink)}" target="_blank" rel="noopener">Open video</a>
        </div>
      </div>
    `;
  }
  return `
    <div class="video-panel ${size === "large" ? "large" : ""}" style="margin-top: 14px;">
      <div class="video-inner">
        <div class="play-button">PLAY</div>
        <strong>${title}</strong>
        <span>${escapeHtml(lesson.video || "Teacher lesson")}</span>
      </div>
    </div>
  `;
}

function youtubeEmbedUrl(rawUrl) {
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch (error) {
    return "";
  }

  const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
  let videoId = "";
  if (host === "youtu.be") {
    videoId = parsed.pathname.split("/").filter(Boolean)[0] || "";
  }
  if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com" || host === "youtube-nocookie.com") {
    const parts = parsed.pathname.split("/").filter(Boolean);
    if (parsed.pathname === "/watch") videoId = parsed.searchParams.get("v") || "";
    else if (parts[0] === "embed" || parts[0] === "shorts" || parts[0] === "live") videoId = parts[1] || "";
  }
  if (!/^[a-zA-Z0-9_-]{6,}$/.test(videoId)) return "";

  const startSeconds = youtubeStartSeconds(parsed.searchParams.get("start") || parsed.searchParams.get("t") || "");
  const embed = new URL(`https://www.youtube-nocookie.com/embed/${videoId}`);
  embed.searchParams.set("rel", "0");
  if (startSeconds) embed.searchParams.set("start", String(startSeconds));
  return embed.toString();
}

function youtubeStartSeconds(value) {
  if (!value) return 0;
  if (/^\d+$/.test(value)) return Number(value);
  const match = value.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/i);
  if (!match) return 0;
  return (Number(match[1]) || 0) * 3600 + (Number(match[2]) || 0) * 60 + (Number(match[3]) || 0);
}

function getLessonLibrary() {
  return [...state.lessonLibrary, ...lessons];
}

function topicScoresForAssignments(list) {
  const byTopic = new Map();
  for (const item of list) {
    const unit = unitForTopic(item.topic);
    const current = byTopic.get(unit) || { topic: unit, progress: 0, total: 0 };
    current.progress += item.progress;
    current.total += item.total;
    byTopic.set(unit, current);
  }
  const colors = ["var(--green)", "var(--coral)", "var(--teal)", "var(--blue)", "var(--amber)"];
  return [...byTopic.values()].map((item, index) => ({
    topic: item.topic,
    value: item.total ? Math.round((item.progress / item.total) * 100) : 0,
    color: colors[index % colors.length],
  }));
}

function renderTopicPerformance(title, scores = topicScores) {
  return `
    <div class="surface">
      <h2>${title}</h2>
      <div class="bar-list" style="margin-top: 14px;">
        ${scores.length
          ? scores
          .map(
            (item) => `
              <div class="bar-row">
                <div class="bar-label"><span>${item.topic}</span><span>${item.value}%</span></div>
                <div class="progress-track">
                  <div class="progress-fill" style="--value: ${item.value}%; --bar: ${item.color};"></div>
                </div>
              </div>
            `,
          )
          .join("")
          : `<div class="empty">No progress yet.</div>`}
      </div>
    </div>
  `;
}

function classGradeAnalytics() {
  const classStudents = getClassStudents();
  const gradedRows = getSubmissionRows().filter((row) => row.grade !== null);
  const gradesByStudent = new Map(classStudents.map((student) => [student.id, []]));
  for (const row of gradedRows) {
    if (!gradesByStudent.has(row.student.id)) continue;
    gradesByStudent.get(row.student.id).push(row);
  }
  const rows = classStudents.map((student) => {
    const grades = [...(gradesByStudent.get(student.id) || [])]
      .sort((a, b) => Date.parse(b.gradeUpdatedAt || b.verifiedAt || 0) - Date.parse(a.gradeUpdatedAt || a.verifiedAt || 0));
    const latest = grades[0] || null;
    const average = averageGrade(grades.map((row) => row.grade));
    return {
      ...student,
      gradedCount: grades.length,
      average,
      gradeItems: grades.map((row) => ({ title: row.assignment?.title || "Assignment", grade: row.grade })),
      latestAssignment: latest?.assignment?.title || "",
      latestGrade: latest?.grade ?? null,
      latestAt: latest?.gradeUpdatedAt || latest?.verifiedAt || "",
    };
  });
  const classAverage = averageGrade(gradedRows.map((row) => row.grade));
  return {
    rows,
    gradedCount: gradedRows.length,
    studentsGraded: rows.filter((row) => row.average !== null).length,
    average: classAverage,
    averageLabel: classAverage === null ? "No grades" : formatGrade(classAverage),
  };
}

function renderClassGradeAnalytics() {
  const analytics = classGradeAnalytics();
  const currentClass = selectedTeacherClass();
  return `
    <section class="surface">
      <div class="section-head">
        <div>
          <h2>Grade Analytics</h2>
          <p>${currentClass ? `Worksheet grades for ${escapeHtml(currentClass.name)}.` : "Choose a class to view worksheet grades."}</p>
        </div>
        <span class="pill ${analytics.average === null ? "" : "green"}">Class average: ${escapeHtml(analytics.averageLabel)}</span>
      </div>
      ${analytics.rows.length
        ? renderGradeTable(analytics.rows)
        : `<div class="empty" style="margin-top: 14px;">No students assigned to this class yet.</div>`}
    </section>
  `;
}

function renderGradeTable(rows) {
  return `
    <table class="table grade-table" style="margin-top: 14px;">
      <thead><tr><th>Student</th><th>Graded worksheets</th><th>Average</th><th>Worksheet grades</th></tr></thead>
      <tbody>
        ${rows.map((row) => `
          <tr>
            <td>${escapeHtml(row.name)}</td>
            <td>${row.gradedCount || 0}</td>
            <td>${row.average === null ? "No grade" : formatGrade(row.average)}</td>
            <td>
              ${row.gradeItems?.length
                ? `<div class="grade-chip-list">${row.gradeItems.map((item) => `<span class="grade-chip">${escapeHtml(item.title)}: ${formatGrade(item.grade)}</span>`).join("")}</div>`
                : "No graded work"}
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function gradeTopicScores() {
  const colors = ["var(--green)", "var(--coral)", "var(--teal)", "var(--blue)", "var(--amber)"];
  const byTopic = new Map();
  for (const row of getSubmissionRows()) {
    if (row.grade === null) continue;
    const topic = unitForTopic(row.assignment.topic);
    const current = byTopic.get(topic) || { topic, total: 0, count: 0 };
    current.total += row.grade;
    current.count += 1;
    byTopic.set(topic, current);
  }
  return [...byTopic.values()].map((item, index) => ({
    topic: item.topic,
    value: Math.round(item.total / item.count),
    color: colors[index % colors.length],
  }));
}

function averageGrade(values) {
  const grades = values.map(validGrade).filter((value) => value !== null);
  if (!grades.length) return null;
  return Math.round((grades.reduce((sum, value) => sum + value, 0) / grades.length) * 10) / 10;
}

function validGrade(value) {
  if (value === null || value === undefined || String(value).trim() === "") return null;
  const grade = Number(value);
  return Number.isFinite(grade) && grade >= 0 && grade <= 100 ? Math.round(grade * 10) / 10 : null;
}

function formatGrade(value) {
  const grade = validGrade(value);
  if (grade === null) return "No grade";
  return `${Number.isInteger(grade) ? grade : grade.toFixed(1)}%`;
}

function submissionDraftKey(studentId, assignmentId) {
  return `${studentId || "student"}:${assignmentId || "assignment"}`;
}

function teacherClasses() {
  return Array.isArray(state.classRoster.classes) ? state.classRoster.classes : [];
}

function selectedTeacherClass() {
  const classes = teacherClasses();
  return classes.find((classItem) => classItem.id === state.classRoster.selectedClassId) || null;
}

function setActiveTeacherClass(classId, notice = "") {
  const selected = teacherClasses().find((classItem) => classItem.id === classId) || null;
  state.classRoster.selectedClassId = selected?.id || "";
  state.classRoster.draftName = selected?.name || "Grade 7 Math";
  state.classRoster.studentIds = selected?.studentIds || [];
  state.classRoster.notice = notice;
  if (selected) {
    state.draft.classId = selected.id;
    state.draft.className = selected.name;
  }
}

function switchTeacherClass(direction) {
  const classes = teacherClasses();
  if (!classes.length) return;
  const currentIndex = Math.max(0, classes.findIndex((classItem) => classItem.id === state.classRoster.selectedClassId));
  const nextIndex = positiveModulo(currentIndex + direction, classes.length);
  const nextClass = classes[nextIndex];
  setActiveTeacherClass(nextClass.id, `Switched to ${nextClass.name}.`);
  render();
}

function getClassStudents() {
  if (state.auth.user?.role !== "teacher") return state.directory.students;
  const selectedIds = new Set(state.classRoster.studentIds);
  return state.directory.students.filter((student) => selectedIds.has(student.id));
}

function formatAverage(value) {
  return typeof value === "number" ? `${value}%` : value;
}

function renderStudentTable(rows, type) {
  if (type === "followup") {
    return `
      <table class="table" style="margin-top: 14px;">
        <thead><tr><th>Student</th><th>Missing</th><th>Average</th><th>Weak unit</th></tr></thead>
        <tbody>
          ${rows.map((student) => `<tr><td>${escapeHtml(student.name)}</td><td>${student.missing}</td><td>${formatAverage(student.average)}</td><td>${escapeHtml(student.weak)}</td></tr>`).join("")}
        </tbody>
      </table>
    `;
  }
  return `
    <table class="table" style="margin-top: 14px;">
      <thead><tr><th>Student</th><th>Completed</th><th>Missing</th><th>Average</th></tr></thead>
      <tbody>
        ${rows.map((student) => `<tr><td>${escapeHtml(student.name)}</td><td>${student.completed}</td><td>${student.missing}</td><td>${formatAverage(student.average)}</td></tr>`).join("")}
      </tbody>
    </table>
  `;
}

function renderHint() {
  const hints = [
    "Start by identifying the operation attached to x.",
    "Hint 1: Subtract 6 from both sides.",
    "Hint 2: Now solve 2x = 12.",
    "Hint 3: Divide both sides by 2.",
    "Answer: x = 6.",
  ];
  return `<p>${hints[state.hintStep]}</p>`;
}

function metric(label, value, detail) {
  return `
    <div class="metric">
      <span>${label}</span>
      <strong>${value}</strong>
      <em>${detail}</em>
    </div>
  `;
}

function generateQuestions(topic) {
  return questionSetQuestions(getQuestionSets(topic)[0]);
}

function nextPracticeQuestions(topic) {
  const sets = getQuestionSets(topic);
  const currentFirst = state.generatedQuestions[0];
  const currentIndex = sets.findIndex((set) => set.items[0]?.q === currentFirst);
  return questionSetQuestions(sets[(currentIndex + 1 + sets.length) % sets.length]);
}

function insertSelectedQuestionSet() {
  const questions = questionSetQuestions(selectedQuestionSet());
  const existing = state.draft.questionText.trim();
  state.draft.topic = state.questionBankTopic;
  state.draft.questionText = existing ? `${existing}\n${questions.join("\n")}` : questions.join("\n");
  state.page = "Create Assignment";
  render();
}

function assignMaterialToDraft(materialId) {
  const material = state.materialLibrary.find((item) => item.id === materialId);
  if (!material) return;
  const ids = new Set(state.draft.materialIds || []);
  ids.add(material.id);
  state.draft.materialIds = [...ids];
  if (material.kind === "lesson-video" || String(material.type || "").startsWith("video/")) {
    state.draft.watchLesson = true;
  } else {
    state.draft.uploadWork = true;
  }
  if (!state.draft.questionText.trim() && material.kind !== "lesson-video") {
    state.draft.questionText = "Complete the attached teacher material.";
  }
  state.draft.notice = `Attached ${material.title}. Press Publish when the assignment is ready.`;
  state.page = "Create Assignment";
  render();
}

function removeDraftMaterial(materialId) {
  state.draft.materialIds = (state.draft.materialIds || []).filter((id) => id !== materialId);
  render();
}

function generateSimilarQuestions(sample) {
  if (!sample.includes("x")) return ["2x + 5 = 17", "6x - 4 = 20", "3x + 7 = 22"];
  return ["2x + 5 = 17", "6x - 4 = 20", "3x + 7 = 22", "5x - 6 = 24", "8x + 1 = 33"];
}

function convertUnits() {
  const value = Number(state.converter.value);
  const from = state.converter.from;
  const to = state.converter.to;
  const factors = {
    cm: { m: 0.01, cm: 1 },
    m: { cm: 100, m: 1 },
    mL: { L: 0.001, mL: 1 },
    L: { mL: 1000, L: 1 },
    minutes: { hours: 1 / 60, minutes: 1 },
    hours: { minutes: 60, hours: 1 },
  };
  const result = factors[from] && factors[from][to] !== undefined ? value * factors[from][to] : null;
  if (result === null || Number.isNaN(result)) return "Choose matching units";
  return `${value} ${from} = ${Number(result.toFixed(3))} ${to}`;
}

function drawGraph() {
  const canvas = document.querySelector("#graph-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const unit = 30;
  const originX = width / 2;
  const originY = height / 2;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "#e4ebe8";
  ctx.lineWidth = 1;
  for (let x = originX % unit; x < width; x += unit) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = originY % unit; y < height; y += unit) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.strokeStyle = "#73827e";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, originY);
  ctx.lineTo(width, originY);
  ctx.moveTo(originX, 0);
  ctx.lineTo(originX, height);
  ctx.stroke();

  const m = Number(state.graph.m);
  const b = Number(state.graph.b);
  const x1 = -originX / unit;
  const x2 = (width - originX) / unit;
  const y1 = m * x1 + b;
  const y2 = m * x2 + b;
  ctx.strokeStyle = "#dd563f";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, originY - y1 * unit);
  ctx.lineTo(width, originY - y2 * unit);
  ctx.stroke();

  ctx.fillStyle = "#146b53";
  ctx.font = "16px system-ui";
  ctx.fillText("x", width - 24, originY - 10);
  ctx.fillText("y", originX + 10, 22);
}

function initWorkCanvas() {
  const canvas = document.querySelector("#work-canvas");
  if (!canvas) return;
  clearWorkCanvas(canvas);

  const assignment = getStudentAssignments().find((item) => item.id === canvas.dataset.assignmentCanvas);
  const imageUrl = assignment?.drawing?.url || (isDrawablePage(assignment) ? assignment.pageUrl : "");
  if (imageUrl) {
    const image = new Image();
    image.onload = () => {
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawImageContain(ctx, image, canvas.width, canvas.height);
    };
    image.src = imageUrl;
  }

  canvas.addEventListener("pointerdown", startWorkStroke);
  canvas.addEventListener("pointermove", drawWorkStroke);
  canvas.addEventListener("pointerup", stopWorkStroke);
  canvas.addEventListener("pointercancel", stopWorkStroke);
  canvas.addEventListener("pointerleave", stopWorkStroke);
}

function drawImageContain(ctx, image, width, height) {
  const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  const x = (width - drawWidth) / 2;
  const y = (height - drawHeight) / 2;
  ctx.drawImage(image, x, y, drawWidth, drawHeight);
}

function clearWorkCanvas(canvas = document.querySelector("#work-canvas")) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#e7eeeb";
  ctx.lineWidth = 1;
  for (let x = 40; x < canvas.width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 40; y < canvas.height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

function workCanvasPoint(event, canvas) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * canvas.width,
    y: ((event.clientY - rect.top) / rect.height) * canvas.height,
  };
}

function startWorkStroke(event) {
  const canvas = event.currentTarget;
  event.preventDefault();
  canvas.setPointerCapture?.(event.pointerId);
  const point = workCanvasPoint(event, canvas);
  workCanvasSession = { drawing: true, lastX: point.x, lastY: point.y };
  state.drawing.pointer = event.pointerType === "pen" ? "Apple Pencil / pen" : event.pointerType || "pointer";
  drawWorkStroke(event);
}

function drawWorkStroke(event) {
  if (!workCanvasSession.drawing) return;
  const canvas = event.currentTarget;
  event.preventDefault();
  const point = workCanvasPoint(event, canvas);
  const ctx = canvas.getContext("2d");
  const pressure = event.pressure && event.pressure > 0 ? event.pressure : 0.65;
  const baseSize = Math.max(2, Number(state.drawing.size) || 4);
  ctx.strokeStyle = state.drawing.color || "#146b53";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = event.pointerType === "pen" ? Math.max(1, baseSize * (0.7 + pressure)) : baseSize;
  ctx.beginPath();
  ctx.moveTo(workCanvasSession.lastX, workCanvasSession.lastY);
  ctx.lineTo(point.x, point.y);
  ctx.stroke();
  workCanvasSession.lastX = point.x;
  workCanvasSession.lastY = point.y;
}

function stopWorkStroke(event) {
  if (event.currentTarget?.releasePointerCapture && event.pointerId !== undefined) {
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch (error) {
      // Pointer capture can already be released by the browser.
    }
  }
  workCanvasSession.drawing = false;
}

function handleClick(event) {
  const actionButton = event.target.closest("[data-action]");
  const action = actionButton?.dataset.action;

  if (action === "login") {
    event.preventDefault();
    login();
    return;
  }
  if (action === "signup") {
    event.preventDefault();
    signup();
    return;
  }
  if (action === "show-login") {
    state.auth.mode = "login";
    state.auth.error = "";
    render();
    return;
  }
  if (action === "show-signup") {
    state.auth.mode = "signup";
    state.auth.error = "";
    render();
    return;
  }
  if (action === "logout") {
    logout();
    return;
  }
  if (action === "fill-login") {
    state.auth.email = actionButton.dataset.email;
    state.auth.password = actionButton.dataset.password;
    state.auth.error = "";
    render();
    return;
  }
  if (!state.auth.authenticated) return;
  if (action === "reply-parent-teacher") {
    state.page = "Teacher Messages";
    const teacher = state.directory.users.find((user) => user.role === "teacher" && user.id !== state.auth.user?.id);
    state.messaging.selected.parent = "";
    state.messaging.composeTo.parent = teacher?.id || "";
    state.messaging.notice = "";
    render();
    loadMessages().then(render);
    return;
  }
  if (action === "link-parent-student") {
    linkParentStudent();
    return;
  }
  if (action === "clear-parent-student") {
    clearParentStudent();
    return;
  }

  const roleButton = event.target.closest("[data-role]");
  if (roleButton) {
    setRole(roleButton.dataset.role);
    return;
  }
  const pageButton = event.target.closest("[data-page]");
  if (pageButton) {
    setPage(pageButton.dataset.page);
    return;
  }
  const calcButton = event.target.closest("[data-calc]");
  if (calcButton) {
    updateCalc(calcButton.dataset.calc);
    return;
  }
  if (!action) return;
  if (["open-message", "reply-message", "toggle-read", "new-message", "send-message", "clear-message", "clear-messages"].includes(action)) {
    handleMessageAction(action, actionButton);
    return;
  }
  if (action === "mark-attendance") {
    markAttendance(actionButton.dataset.studentId, actionButton.dataset.status);
    return;
  }
  if (action === "save-class-roster") {
    saveClassRoster();
    return;
  }
  if (action === "new-class-roster") {
    state.classRoster.selectedClassId = "";
    state.classRoster.draftName = "Grade 7 Math";
    state.classRoster.studentIds = [];
    state.classRoster.notice = "New class ready. Name it, choose students, then save.";
    render();
    return;
  }
  if (action === "previous-class" || action === "next-class") {
    switchTeacherClass(action === "next-class" ? 1 : -1);
    return;
  }
  if (action === "publish-assignment") {
    publishAssignment();
    return;
  }
  if (action === "save-assignment-draft") {
    saveAssignmentDraft();
    return;
  }
  if (action === "add-bridgespace-question") {
    addBridgeSpaceQuestion();
    return;
  }
  if (action === "clear-bridgespace-question-builder") {
    resetBridgeSpaceQuestionBuilder();
    render();
    return;
  }
  if (action === "push-assignment-draft") {
    pushAssignmentDraft(actionButton.dataset.draft);
    return;
  }
  if (action === "delete-assignment-draft") {
    deleteAssignmentDraft(actionButton.dataset.draft);
    return;
  }
  if (action === "delete-assignment") {
    deleteAssignment(actionButton.dataset.assignment);
    return;
  }
  if (action === "post-announcement" || action === "schedule-announcement") {
    saveAnnouncement(action === "schedule-announcement");
    return;
  }
  if (action === "delete-announcement") {
    deleteAnnouncement(actionButton.dataset.announcement);
    return;
  }
  if (action === "check-answer") {
    checkPracticeAnswer(actionButton.dataset.questionId, actionButton.dataset.question);
    return;
  }
  if (action === "save-review") {
    savePracticeReview(actionButton.dataset.questionId, actionButton.dataset.question);
    return;
  }
  if (action === "check-dmc") {
    checkDailyChallenge();
    return;
  }
  if (action === "hint-dmc") {
    state.dailyChallengeResult = "hint";
    render();
    return;
  }
  if (action === "next-hint") state.hintStep = Math.min(4, state.hintStep + 1);
  if (action === "prev-hint") state.hintStep = Math.max(0, state.hintStep - 1);
  if (action === "generate") {
    state.generatedQuestions = nextPracticeQuestions(state.selectedTopic);
    state.practiceResults = {};
  }
  if (action === "insert-question-set") {
    insertSelectedQuestionSet();
    return;
  }
  if (action === "next-question-set") {
    const sets = getQuestionSets(state.questionBankTopic);
    state.questionBankSetIndex = (Number(state.questionBankSetIndex) + 1) % sets.length;
    render();
    return;
  }
  if (action === "clear-lesson-form") {
    resetTeacherLessonForm("");
    render();
    return;
  }
  if (action === "delete-lesson") {
    deleteLesson(actionButton.dataset.lesson);
    return;
  }
  if (action === "clear-material-form") {
    resetMaterialForm("");
    render();
    return;
  }
  if (action === "delete-material") {
    deleteMaterial(actionButton.dataset.material);
    return;
  }
  if (action === "assign-material") {
    assignMaterialToDraft(actionButton.dataset.material);
    return;
  }
  if (action === "remove-draft-material") {
    removeDraftMaterial(actionButton.dataset.material);
    return;
  }
  if (action === "toggle-step") {
    const button = event.target.closest("[data-action]");
    toggleAssignmentStep(button.dataset.assignment, Number(button.dataset.step));
    return;
  }
  if (action === "open-assignment-step") {
    openAssignmentStep(actionButton.dataset.assignment, Number(actionButton.dataset.step));
    return;
  }
  if (action === "start-ai-help") {
    startAssignmentAiHelp(actionButton.dataset.assignment, Number(actionButton.dataset.questionIndex || 0));
    return;
  }
  if (action === "ask-ai-help") {
    askAssignmentAiHelp(actionButton.dataset.assignment);
    return;
  }
  if (action === "clear-ai-help-chat") {
    clearAiHelpThread(actionButton.dataset.assignment);
    return;
  }
  if (action === "ask-teacher-for-ai-question") {
    openTeacherHelpForAiQuestion(actionButton.dataset.assignment);
    return;
  }
  if (action === "open-bridgespace") {
    openBridgeSpace(actionButton.dataset.assignment);
    return;
  }
  if (action === "close-bridgespace") {
    state.bridgeSpace.assignmentId = "";
    render();
    return;
  }
  if (action === "bridge-tab") {
    state.bridgeSpace.tab = actionButton.dataset.tab || "practice";
    render();
    return;
  }
  if (action === "bridge-prev" || action === "bridge-next") {
    moveBridgeSpaceQuestion(action === "bridge-next" ? 1 : -1);
    return;
  }
  if (action === "bridge-help") {
    startAssignmentAiHelp(actionButton.dataset.assignment, Number(state.bridgeSpace.questionIndex) || 0);
    state.bridgeSpace.notice = "Opened the AI hint box for this question below the practice card.";
    render();
    return;
  }
  if (action === "bridge-show-steps") {
    showBridgeSpaceStepHint();
    return;
  }
  if (action === "bridge-check") {
    checkBridgeSpaceAnswer(actionButton.dataset.assignment);
    return;
  }
  if (action === "bridge-key") {
    pressBridgeKey(actionButton.dataset.key || "");
    return;
  }
  if (action === "open-drawing") {
    const assignmentId = actionButton.dataset.assignment;
    state.drawing.assignmentId = state.drawing.assignmentId === assignmentId ? "" : assignmentId;
    state.drawing.status = "";
    render();
    return;
  }
  if (action === "clear-drawing") {
    clearWorkCanvas();
    state.drawing.status = "Drawing cleared locally. Save to update the assignment.";
    const status = document.querySelector(".drawing-message");
    if (status) status.textContent = state.drawing.status;
    return;
  }
  if (action === "save-drawing") {
    saveWorkDrawing(actionButton.dataset.assignment);
    return;
  }
  if (action === "save-assignment-answers") {
    saveAssignmentAnswers(actionButton.dataset.assignment);
    return;
  }
  if (action === "submit-work") {
    submitWork(actionButton.dataset.assignment);
    return;
  }
  if (action === "suggest-submission-grade") {
    suggestSubmissionGrade(actionButton.dataset.studentId, actionButton.dataset.assignment);
    return;
  }
  if (action === "save-submission-grade" || action === "verify-submission" || action === "request-correction") {
    verifySubmission(actionButton.dataset.studentId, actionButton.dataset.assignment, action !== "request-correction");
    return;
  }
  if (action === "save-ai-grade-feedback") {
    saveAiGradeFeedback(actionButton.dataset.studentId, actionButton.dataset.assignment);
    return;
  }
  if (action === "dismiss-ai-grade-feedback") {
    state.submissionReview.aiFeedback = { studentId: "", assignmentId: "", draft: "", notice: "", saving: false };
    render();
    return;
  }
  if (action === "clear-calc") state.calc = "";
  if (action === "send-help") {
    sendHelpRequest();
    return;
  }
  if (action === "clear-draft-questions") {
    state.draft.questionText = "";
    state.draft.notice = "Questions cleared.";
    render();
    return;
  }
  render();
}

function handleInput(event) {
  if (event.type === "input" && event.target.matches("select[data-bind]")) return;

  const authField = event.target.dataset.authField;
  if (authField) {
    state.auth[authField] = event.target.value;
    state.auth.error = "";
    if (authField === "signupRole") render();
    return;
  }

  const practiceAnswer = event.target.dataset.practiceAnswer;
  if (practiceAnswer) {
    state.practiceAnswers[practiceAnswer] = event.target.value;
    delete state.practiceResults[practiceAnswer];
    return;
  }

  if (event.target.hasAttribute("data-dmc-answer")) {
    state.dailyChallengeAnswer = event.target.value;
    state.dailyChallengeResult = null;
    return;
  }

  const submitComment = event.target.dataset.submitComment;
  if (submitComment) {
    state.submitComments[submitComment] = event.target.value;
    return;
  }

  const gradeDraft = event.target.dataset.gradeDraft;
  if (gradeDraft) {
    state.submissionReview.grades[gradeDraft] = event.target.value;
    state.submissionReview.notice = "";
    return;
  }

  const feedbackDraft = event.target.dataset.feedbackDraft;
  if (feedbackDraft) {
    state.submissionReview.feedback[feedbackDraft] = event.target.value;
    state.submissionReview.notice = "";
    return;
  }

  const assignmentAnswer = event.target.dataset.assignmentAnswer;
  if (assignmentAnswer) {
    const index = Number(event.target.dataset.answerIndex);
    if (event.target.dataset.answerKind === "multi") {
      updateAssignmentSelectAllDraft(assignmentAnswer, index, event.target.dataset.answerChoice, event.target.checked);
    } else {
      updateAssignmentAnswerDraft(assignmentAnswer, index, event.target.value);
    }
    return;
  }

  const bind = event.target.dataset.bind;
  if (!bind) return;
  const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
  setByPath(bind, value);
  if (bind === "attendance.date") {
    state.attendance.notice = "";
    loadAttendance().then(render);
    return;
  }
  if (bind.startsWith("attendance.notes.")) {
    return;
  }
  if (bind === "questionBankTopic") {
    state.questionBankSetIndex = 0;
    render();
    return;
  }
  if (bind === "questionBankSetIndex") {
    state.questionBankSetIndex = Number(value);
    render();
    return;
  }
  if (bind === "parent.studentEmail") {
    state.parent.notice = "";
    return;
  }
  if (bind === "parent.selectedStudentId") {
    selectParentStudent(value);
    render();
    return;
  }
  if (bind.startsWith("messaging.composeTo.")) {
    const viewer = bind.split(".").at(-1);
    selectConversationForRecipient(viewer, value);
    render();
    return;
  }
  if (bind === "classRoster.selectedClassId") {
    setActiveTeacherClass(value, "");
    render();
    return;
  }
  if (bind === "classRoster.draftName") {
    state.classRoster.notice = "";
    return;
  }
  if (bind.startsWith("teacherLesson.")) {
    return;
  }
  if (bind.startsWith("materialDraft.")) {
    state.materialDraft.status = "";
    if (bind === "materialDraft.kind") render();
    return;
  }
  if (bind.startsWith("announcementDraft.")) {
    state.announcementDraft.notice = "";
    return;
  }
  if (bind.startsWith("aiHelp.")) {
    state.aiHelp.status = "";
    if (bind === "aiHelp.questionIndex") {
      state.aiHelp.questionIndex = Number(value) || 0;
      const assignment = getStudentAssignments().find((item) => item.id === state.aiHelp.assignmentId);
      state.aiHelp.attempt = aiHelpAttemptForQuestion(assignment, state.aiHelp.questionIndex);
      render();
    }
    return;
  }
  if (bind === "draft.classId") {
    const selected = teacherClasses().find((classItem) => classItem.id === value);
    state.draft.className = selected?.name || "";
    render();
    return;
  }
  if (
    bind === "draft.questionText" ||
    bind === "draft.className" ||
    bind === "draft.due" ||
    bind === "draft.lessonVideoLink" ||
    bind === "draft.bridgeQuestionPrompt" ||
    bind === "draft.bridgeQuestionChoices" ||
    bind === "draft.bridgeQuestionAnswers"
  ) {
    state.draft.notice = "";
    return;
  }
  if (
    bind.startsWith("graph.") ||
    bind.startsWith("converter.") ||
    bind === "selectedTopic" ||
    bind === "draft.topic" ||
    bind === "draft.uploadWork" ||
    bind === "draft.watchLesson" ||
    bind === "draft.readNotes" ||
    bind === "draft.completeQuestions" ||
    bind === "draft.bridgeSpace" ||
    bind === "draft.bridgeQuestionMode" ||
    bind === "draft.submitFinal" ||
    bind === "quizAnswer"
  ) {
    if (bind === "selectedTopic") state.generatedQuestions = [];
    if (bind === "draft.bridgeSpace" && state.draft.bridgeSpace) state.draft.completeQuestions = true;
    state.draft.notice = "";
    render();
  }
}

function handleSubmit(event) {
  if (event.target.matches("[data-signup-form]")) {
    event.preventDefault();
    signup();
    return;
  }
  if (event.target.matches("[data-lesson-form]")) {
    event.preventDefault();
    uploadLesson(event.target);
    return;
  }
  if (event.target.matches("[data-material-form]")) {
    event.preventDefault();
    uploadMaterial(event.target);
    return;
  }
  if (!event.target.matches("[data-auth-form]")) return;
  event.preventDefault();
  login();
}

function handleKeydown(event) {
  if (event.key !== "Enter" || event.shiftKey || event.metaKey || event.ctrlKey || event.altKey) return;

  const practiceAnswer = event.target.dataset.practiceAnswer;
  if (practiceAnswer) {
    event.preventDefault();
    checkPracticeAnswer(practiceAnswer, event.target.dataset.question || "");
    return;
  }

  if (event.target.hasAttribute("data-dmc-answer")) {
    event.preventDefault();
    checkDailyChallenge();
    return;
  }

  const assignmentAnswer = event.target.dataset.assignmentAnswer;
  if (assignmentAnswer) {
    event.preventDefault();
    saveAssignmentAnswers(assignmentAnswer);
    return;
  }

  const bind = event.target.dataset.bind || "";
  if (bind === "aiHelp.message") {
    event.preventDefault();
    askAssignmentAiHelp(state.aiHelp.assignmentId);
    return;
  }

  if (bind.startsWith("messaging.draft.")) {
    event.preventDefault();
    const viewer = bind.split(".").at(-1);
    sendMessage(viewer)
      .catch((error) => {
        state.messaging.notice = error.message || "Unable to send message.";
      })
      .finally(render);
    return;
  }

  if (bind === "helpDraft") {
    event.preventDefault();
    sendHelpRequest();
  }
}

function handleChange(event) {
  if (event.target.matches("[data-roster-student]")) {
    toggleRosterStudent(event.target.dataset.rosterStudent, event.target.checked);
    return;
  }
  if (event.target.id === "lesson-video-file") {
    updateLessonVideoPreview(event.target.files?.[0]);
    return;
  }
  if (event.target.matches("[data-assignment-upload]")) {
    uploadWorkDocument(event.target.dataset.assignmentUpload, event.target.files?.[0]);
    event.target.value = "";
    return;
  }
  if (event.target.matches("[data-assignment-answer]")) {
    handleInput(event);
    return;
  }
  if (event.target.matches("select[data-bind]")) {
    handleInput(event);
  }
}

async function initAuth() {
  render();
  try {
    const response = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    });
    const result = await response.json();
    state.auth.checking = false;
    if (result.authenticated && result.user) {
      applyAuthenticatedUser(result.user);
      await loadDirectory();
      await loadSystemInfo();
      await loadAssignments();
      await loadAssignmentDrafts();
      await loadWork();
      await loadLessons();
      await loadMaterials();
      await loadAnnouncements();
      await loadAttendance();
      await loadSubmissions();
      await loadMessages();
    } else {
      state.auth.authenticated = false;
      state.auth.user = null;
    }
  } catch (error) {
    state.auth.checking = false;
    state.auth.authenticated = false;
    state.auth.user = null;
    state.auth.error = "Start the local server with npm start, then open http://127.0.0.1:8080.";
  }
  render();
}

async function login() {
  if (state.auth.submitting) return;
  state.auth.submitting = true;
  state.auth.error = "";
  render();

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: state.auth.email,
        password: state.auth.password,
      }),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Unable to sign in.");
    }
    applyAuthenticatedUser(result.user);
    await loadDirectory();
    await loadSystemInfo();
    await loadAssignments();
    await loadAssignmentDrafts();
    await loadWork();
    await loadLessons();
    await loadMaterials();
    await loadAnnouncements();
    await loadAttendance();
    await loadSubmissions();
    await loadMessages();
  } catch (error) {
    state.auth.authenticated = false;
    state.auth.user = null;
    state.auth.error = error.message || "Unable to sign in.";
  } finally {
    state.auth.checking = false;
    state.auth.submitting = false;
    render();
  }
}

async function signup() {
  if (state.auth.submitting) return;
  state.auth.submitting = true;
  state.auth.error = "";
  render();

  try {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: state.auth.signupName,
        email: state.auth.signupEmail,
        password: state.auth.signupPassword,
        role: state.auth.signupRole,
        className: state.auth.signupClassName,
        childName: state.auth.signupChildName,
      }),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Unable to create account.");
    }
    applyAuthenticatedUser(result.user);
    await loadDirectory();
    await loadSystemInfo();
    await loadAssignments();
    await loadAssignmentDrafts();
    await loadWork();
    await loadLessons();
    await loadMaterials();
    await loadAnnouncements();
    await loadAttendance();
    await loadSubmissions();
    await loadMessages();
  } catch (error) {
    state.auth.authenticated = false;
    state.auth.user = null;
    state.auth.error = error.message || "Unable to create account.";
  } finally {
    state.auth.checking = false;
    state.auth.submitting = false;
    render();
  }
}

async function logout() {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    });
  } catch (error) {
    // The local session should still be cleared in the UI even if the request fails.
  }
  state.auth.authenticated = false;
  state.auth.user = null;
  state.auth.password = "";
  state.directory.students = [];
  state.directory.users = [];
  state.parent.selectedStudentId = "";
  state.parent.studentEmail = "";
  state.parent.notice = "";
  state.classRoster = { classes: [], selectedClassId: "", draftName: "Grade 7 Math", studentIds: [], notice: "", saving: false };
  state.work = { studentId: "", assignments: {} };
  state.parentWork = { studentId: "", assignments: {} };
  state.workUpload = { notice: "", assignmentId: "" };
  state.answerDrafts = {};
  state.answerStatus = { assignmentId: "", notice: "" };
  state.submitComments = {};
  state.drawing = { assignmentId: "", color: "#146b53", size: 4, status: "", pointer: "" };
  state.bridgeSpace = { assignmentId: "", questionIndex: 0, tab: "practice", working: "", notice: "" };
  state.system = { publicUrl: "", hosted: false, localUrl: "", lanEnabled: false, lanUrls: [] };
  state.materialLibrary = [];
  state.materialDraft = { title: "", kind: "worksheet", link: "", status: "", submitting: false };
  state.assignmentLibrary = [];
  state.assignmentDraftLibrary = [];
  state.announcementLibrary = [];
  state.announcementDraft.notice = "";
  state.announcementDraft.submitting = false;
  state.submissions = [];
  state.submissionReview = { notice: "", grades: {}, feedback: {}, aiLoading: "", aiRequested: {}, aiFeedback: { studentId: "", assignmentId: "", draft: "", notice: "", saving: false } };
  state.attendance.records = [];
  state.attendance.notes = {};
  state.attendance.notice = "";
  state.lessonLibrary = [];
  state.helpNotice = "";
  state.aiHelp = { assignmentId: "", questionIndex: 0, message: "", attempt: "", reply: "", status: "", source: "", loading: false, threads: {} };
  resetMailboxes();
  state.page = rolePages.student[0];
  state.role = "student";
  render();
}

function applyAuthenticatedUser(user) {
  state.auth.authenticated = true;
  state.auth.user = user;
  state.role = user.role;
  state.parent.selectedStudentId = user.role === "parent" ? user.linkedStudentId || "" : "";
  state.parent.studentEmail = "";
  state.answerDrafts = {};
  state.answerStatus = { assignmentId: "", notice: "" };
  state.submitComments = {};
  state.bridgeSpace = { assignmentId: "", questionIndex: 0, tab: "practice", working: "", notice: "" };
  if (user.role === "teacher") {
    const classes = Array.isArray(user.classes) && user.classes.length
      ? user.classes
      : Array.isArray(user.classStudentIds) && user.classStudentIds.length
        ? [{ id: "default-class", name: "Grade 7 Math", studentIds: user.classStudentIds }]
        : [];
    state.classRoster.classes = classes;
    const selected = classes.find((classItem) => classItem.id === state.classRoster.selectedClassId) || classes[0] || null;
    state.classRoster.selectedClassId = selected?.id || "";
    state.classRoster.draftName = selected?.name || "Grade 7 Math";
    state.classRoster.studentIds = selected?.studentIds || [];
    state.draft.classId = selected?.id || "";
    state.draft.className = selected?.name || "";
  } else {
    state.classRoster = { classes: [], selectedClassId: "", draftName: "Grade 7 Math", studentIds: [], notice: "", saving: false };
  }
  ensureRolePage();
}

async function loadDirectory() {
  try {
    const response = await fetch("/api/users", {
      method: "GET",
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return;
    const result = await response.json();
    state.directory.users = Array.isArray(result.users) ? result.users : [];
    state.directory.students = state.directory.users
      .filter((user) => user.role === "student")
      .map((user) => ({
          id: user.id,
          name: user.name,
          completed: 0,
          missing: 0,
          average: "New",
          weak: "Not enough data",
        }));
    if (
      state.auth.user?.role === "parent" &&
      state.parent.selectedStudentId &&
      !state.directory.users.some((user) => user.id === state.parent.selectedStudentId && user.role === "student")
    ) {
      state.parent.selectedStudentId = "";
    }
    if (state.auth.user?.role === "teacher") {
      const validStudentIds = new Set(state.directory.users.filter((user) => user.role === "student").map((user) => user.id));
      state.classRoster.classes = teacherClasses().map((classItem) => ({
        ...classItem,
        studentIds: (classItem.studentIds || []).filter((studentId) => validStudentIds.has(studentId)),
      }));
      state.classRoster.studentIds = state.classRoster.studentIds.filter((studentId) => validStudentIds.has(studentId));
    }
  } catch (error) {
    state.directory.students = [];
    state.directory.users = [];
  }
}

async function loadMessages() {
  if (!state.auth.authenticated) return;
  try {
    const response = await fetch("/api/messages", {
      method: "GET",
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return;
    const result = await response.json();
    mailboxes[state.role] = Array.isArray(result.conversations) ? result.conversations : [];
    ensureMessageSelection(state.role);
  } catch (error) {
    state.messaging.notice = "Messages could not be loaded from the local server.";
  }
}

async function loadAssignments() {
  if (!state.auth.authenticated) return;
  try {
    const response = await fetch("/api/assignments", {
      method: "GET",
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return;
    const result = await response.json();
    state.assignmentLibrary = Array.isArray(result.assignments) ? result.assignments : [];
  } catch (error) {
    state.assignmentLibrary = [];
  }
}

async function loadAssignmentDrafts() {
  if (!state.auth.authenticated || state.auth.user?.role !== "teacher") {
    state.assignmentDraftLibrary = [];
    return;
  }
  try {
    const response = await fetch("/api/assignment-drafts", {
      method: "GET",
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return;
    const result = await response.json();
    state.assignmentDraftLibrary = Array.isArray(result.drafts) ? result.drafts : [];
  } catch (error) {
    state.assignmentDraftLibrary = [];
  }
}

async function loadWork(studentId = "") {
  if (!state.auth.authenticated) return;
  const targetStudentId = studentId || (state.auth.user?.role === "parent" ? state.parent.selectedStudentId : "");
  const query = targetStudentId ? `?studentId=${encodeURIComponent(targetStudentId)}` : "";
  try {
    const response = await fetch(`/api/work${query}`, {
      method: "GET",
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return;
    const result = await response.json();
    const work = result.work || { studentId: "", assignments: {} };
    if (state.auth.user?.role === "parent") {
      state.parentWork = {
        studentId: work.studentId || "",
        assignments: work.assignments || {},
      };
    } else {
      state.work = {
        studentId: work.studentId || "",
        assignments: work.assignments || {},
      };
    }
  } catch (error) {
    if (state.auth.user?.role === "parent") state.parentWork = { studentId: "", assignments: {} };
    else state.work = { studentId: "", assignments: {} };
  }
}

async function loadSystemInfo() {
  if (!state.auth.authenticated) return;
  try {
    const response = await fetch("/api/system/network", {
      method: "GET",
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return;
    const result = await response.json();
    state.system.publicUrl = result.publicUrl || "";
    state.system.hosted = Boolean(result.hosted);
    state.system.localUrl = result.localUrl || "";
    state.system.lanEnabled = Boolean(result.lanEnabled);
    state.system.lanUrls = Array.isArray(result.lanUrls) ? result.lanUrls : [];
  } catch (error) {
    state.system.publicUrl = "";
    state.system.hosted = false;
    state.system.localUrl = "";
    state.system.lanEnabled = false;
    state.system.lanUrls = [];
  }
}

async function loadSubmissions() {
  if (!state.auth.authenticated || state.auth.user?.role !== "teacher") return;
  try {
    const response = await fetch("/api/submissions", {
      method: "GET",
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return;
    const result = await response.json();
    state.submissions = Array.isArray(result.submissions) ? result.submissions : [];
  } catch (error) {
    state.submissions = [];
  }
}

async function loadLessons() {
  if (!state.auth.authenticated) return;
  try {
    const response = await fetch("/api/lessons", {
      method: "GET",
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return;
    const result = await response.json();
    state.lessonLibrary = Array.isArray(result.lessons) ? result.lessons : [];
  } catch (error) {
    state.lessonLibrary = [];
  }
}

async function loadMaterials() {
  if (!state.auth.authenticated || state.auth.user?.role !== "teacher") {
    state.materialLibrary = [];
    return;
  }
  try {
    const response = await fetch("/api/materials", {
      method: "GET",
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return;
    const result = await response.json();
    state.materialLibrary = Array.isArray(result.materials) ? result.materials : [];
  } catch (error) {
    state.materialLibrary = [];
  }
}

async function loadAnnouncements() {
  if (!state.auth.authenticated) return;
  try {
    const response = await fetch("/api/announcements", {
      method: "GET",
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return;
    const result = await response.json();
    state.announcementLibrary = Array.isArray(result.announcements) ? result.announcements : [];
  } catch (error) {
    state.announcementLibrary = [];
  }
}

async function loadAttendance() {
  if (!state.auth.authenticated) return;
  const params = new URLSearchParams({ date: state.attendance.date });
  if (state.auth.user?.role === "parent" && state.parent.selectedStudentId) {
    params.set("studentId", state.parent.selectedStudentId);
  }

  try {
    const response = await fetch(`/api/attendance?${params.toString()}`, {
      method: "GET",
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return;
    const result = await response.json();
    state.attendance.date = result.date || state.attendance.date;
    state.attendance.records = Array.isArray(result.records) ? result.records : [];
    state.attendance.notes = Object.fromEntries(
      state.attendance.records.map((record) => [record.student.id, record.note || ""]),
    );
  } catch (error) {
    state.attendance.records = [];
    state.attendance.notice = "Attendance could not be loaded.";
  }
}

async function uploadLesson(form) {
  if (state.auth.user?.role !== "teacher" || state.teacherLesson.submitting) return;
  const formData = new FormData(form);
  state.teacherLesson.submitting = true;
  state.teacherLesson.status = "Posting lesson...";
  render();

  try {
    const response = await fetch("/api/lessons", {
      method: "POST",
      credentials: "same-origin",
      headers: { Accept: "application/json" },
      body: formData,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Unable to post lesson.");
    state.lessonLibrary = Array.isArray(result.lessons) ? result.lessons : [];
    resetTeacherLessonForm("Lesson posted. Students can now watch it in Lessons.");
  } catch (error) {
    state.teacherLesson.status = error.message || "Unable to post lesson.";
  } finally {
    state.teacherLesson.submitting = false;
    render();
  }
}

async function uploadMaterial(form) {
  if (state.auth.user?.role !== "teacher" || state.materialDraft.submitting) return;
  const formData = new FormData(form);
  state.materialDraft.submitting = true;
  state.materialDraft.status = "Saving material...";
  render();

  try {
    const response = await fetch("/api/materials", {
      method: "POST",
      credentials: "same-origin",
      headers: { Accept: "application/json" },
      body: formData,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Unable to save material.");
    state.materialLibrary = Array.isArray(result.materials) ? result.materials : [];
    resetMaterialForm("Material saved. Press Assign when you want to use it.");
  } catch (error) {
    state.materialDraft.status = error.message || "Unable to save material.";
  } finally {
    state.materialDraft.submitting = false;
    render();
  }
}

async function deleteApi(path) {
  const response = await fetch(path, {
    method: "DELETE",
    credentials: "same-origin",
    headers: { Accept: "application/json" },
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Unable to take this down.");
  return result;
}

async function deleteLesson(lessonId) {
  if (state.auth.user?.role !== "teacher" || !lessonId) return;
  state.teacherLesson.status = "Taking down lesson...";
  render();

  try {
    const result = await deleteApi(`/api/lessons/${encodeURIComponent(lessonId)}`);
    state.lessonLibrary = Array.isArray(result.lessons)
      ? result.lessons
      : state.lessonLibrary.filter((lesson) => lesson.id !== lessonId);
    state.teacherLesson.status = "Lesson taken down.";
  } catch (error) {
    state.teacherLesson.status = error.message || "Unable to take down lesson.";
  } finally {
    render();
  }
}

async function deleteMaterial(materialId) {
  if (state.auth.user?.role !== "teacher" || !materialId) return;
  state.materialDraft.status = "Taking down material...";
  render();

  try {
    const result = await deleteApi(`/api/materials/${encodeURIComponent(materialId)}`);
    state.materialLibrary = Array.isArray(result.materials)
      ? result.materials
      : state.materialLibrary.filter((material) => material.id !== materialId);
    state.assignmentLibrary = Array.isArray(result.assignments) ? result.assignments : state.assignmentLibrary;
    state.draft.materialIds = (state.draft.materialIds || []).filter((id) => id !== materialId);
    state.materialDraft.status = "Material taken down.";
  } catch (error) {
    state.materialDraft.status = error.message || "Unable to take down material.";
  } finally {
    render();
  }
}

function resetMaterialForm(status) {
  state.materialDraft = {
    title: "",
    kind: "worksheet",
    link: "",
    status,
    submitting: false,
  };
  const input = document.querySelector("#material-file");
  if (input) input.value = "";
}

function resetTeacherLessonForm(status) {
  clearLessonPreviewUrl();
  state.teacherLesson = {
    title: "",
    goal: "",
    videoLink: "",
    explanation: "",
    example: "",
    status,
    submitting: false,
  };
}

function updateLessonVideoPreview(file) {
  const video = document.querySelector("#lesson-file-preview");
  const placeholder = document.querySelector("#lesson-placeholder-preview");
  const name = document.querySelector("#lesson-file-preview-name");
  if (!video || !placeholder || !name) return;

  clearLessonPreviewUrl();
  if (!file) {
    video.hidden = true;
    video.removeAttribute("src");
    placeholder.hidden = false;
    name.hidden = true;
    name.textContent = "";
    return;
  }

  lessonPreviewUrl = URL.createObjectURL(file);
  video.src = lessonPreviewUrl;
  video.hidden = false;
  placeholder.hidden = true;
  name.hidden = false;
  name.textContent = `Previewing ${file.name}`;
  video.load();
}

function clearLessonPreviewUrl() {
  if (lessonPreviewUrl) {
    URL.revokeObjectURL(lessonPreviewUrl);
    lessonPreviewUrl = "";
  }
}

function assignmentFormData(questions) {
  const pageFile = document.querySelector("#assignment-page-file")?.files?.[0];
  const lessonVideoFile = document.querySelector("#assignment-video-file")?.files?.[0];
  const formData = new FormData();
  formData.append("className", state.draft.className);
  formData.append("classId", state.draft.classId);
  formData.append("topic", state.draft.topic);
  formData.append("due", state.draft.due);
  formData.append("questions", JSON.stringify(questions));
  formData.append("uploadWork", String(state.draft.uploadWork));
  formData.append("requireWatchLesson", String(state.draft.watchLesson));
  formData.append("requireReadNotes", String(state.draft.readNotes));
  formData.append("requireCompleteQuestions", String(state.draft.completeQuestions));
  formData.append("requireSubmitFinal", String(state.draft.submitFinal));
  formData.append("bridgeSpace", String(state.draft.bridgeSpace));
  formData.append("lessonVideoLink", state.draft.lessonVideoLink);
  formData.append("materialIds", JSON.stringify(state.draft.materialIds || []));
  if (lessonVideoFile) formData.append("lessonVideoFile", lessonVideoFile, lessonVideoFile.name || "lesson-video.mp4");
  if (pageFile) formData.append("pageFile", pageFile, pageFile.name || "assignment-page.png");
  return formData;
}

function assignmentDraftHasContent(questions) {
  return Boolean(
    questions.length ||
    (state.draft.materialIds || []).length ||
    state.draft.lessonVideoLink.trim() ||
    document.querySelector("#assignment-page-file")?.files?.length ||
    document.querySelector("#assignment-video-file")?.files?.length,
  );
}

function resetAssignmentDraftForm() {
  state.draft.questionText = "";
  state.draft.lessonVideoLink = "";
  state.draft.materialIds = [];
  state.draft.bridgeSpace = false;
  resetBridgeSpaceQuestionBuilder();
  const videoInput = document.querySelector("#assignment-video-file");
  const pageInput = document.querySelector("#assignment-page-file");
  if (videoInput) videoInput.value = "";
  if (pageInput) pageInput.value = "";
}

async function publishAssignment() {
  if (state.auth.user?.role !== "teacher" || state.draft.submitting) return;
  const questions = draftQuestions();
  if (!assignmentDraftHasContent(questions)) {
    state.draft.notice = "Write at least one question, attach saved material, or upload a worksheet before publishing.";
    render();
    return;
  }
  if (!state.draft.classId) {
    state.draft.notice = "Create and choose a class before publishing.";
    render();
    return;
  }
  const formData = assignmentFormData(questions);

  state.draft.submitting = true;
  state.draft.notice = "Publishing assignment...";
  render();

  try {
    const response = await fetch("/api/assignments", {
      method: "POST",
      credentials: "same-origin",
      headers: { Accept: "application/json" },
      body: formData,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Unable to publish assignment.");
    state.assignmentLibrary = Array.isArray(result.assignments) ? result.assignments : [];
    const publishedQuestions = result.assignment?.questions?.length || questions.length;
    const publishedMaterials = result.assignment?.resources?.length || state.draft.materialIds.length;
    state.draft.notice = `Published ${result.assignment?.title || "assignment"} with ${publishedQuestions} question${publishedQuestions === 1 ? "" : "s"}${publishedMaterials ? ` and ${publishedMaterials} saved material${publishedMaterials === 1 ? "" : "s"}` : ""}.`;
    resetAssignmentDraftForm();
    await loadWork();
  } catch (error) {
    state.draft.notice = error.message || "Unable to publish assignment.";
  } finally {
    state.draft.submitting = false;
    render();
  }
}

async function saveAssignmentDraft() {
  if (state.auth.user?.role !== "teacher" || state.draft.savingDraft) return;
  const questions = draftQuestions();
  if (!assignmentDraftHasContent(questions)) {
    state.draft.notice = "Write at least one question, attach saved material, or upload a worksheet before saving a draft.";
    render();
    return;
  }
  const formData = assignmentFormData(questions);

  state.draft.savingDraft = true;
  state.draft.notice = "Saving assignment draft...";
  render();

  try {
    const response = await fetch("/api/assignment-drafts", {
      method: "POST",
      credentials: "same-origin",
      headers: { Accept: "application/json" },
      body: formData,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Unable to save assignment draft.");
    state.assignmentDraftLibrary = Array.isArray(result.drafts) ? result.drafts : [];
    state.draft.notice = "Draft saved. Students cannot see it until you press Push.";
    resetAssignmentDraftForm();
  } catch (error) {
    state.draft.notice = error.message || "Unable to save assignment draft.";
  } finally {
    state.draft.savingDraft = false;
    render();
  }
}

async function pushAssignmentDraft(draftId) {
  if (state.auth.user?.role !== "teacher" || !draftId) return;
  state.draft.notice = "Pushing draft to students...";
  render();

  try {
    const response = await fetch(`/api/assignment-drafts/${encodeURIComponent(draftId)}/publish`, {
      method: "POST",
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Unable to push assignment draft.");
    state.assignmentLibrary = Array.isArray(result.assignments) ? result.assignments : state.assignmentLibrary;
    state.assignmentDraftLibrary = Array.isArray(result.drafts)
      ? result.drafts
      : state.assignmentDraftLibrary.filter((draft) => draft.id !== draftId);
    state.draft.notice = `${result.assignment?.title || "Assignment"} pushed to students.`;
    await loadWork();
    await loadSubmissions();
  } catch (error) {
    state.draft.notice = error.message || "Unable to push assignment draft.";
  } finally {
    render();
  }
}

async function deleteAssignmentDraft(draftId) {
  if (state.auth.user?.role !== "teacher" || !draftId) return;
  state.draft.notice = "Taking down draft...";
  render();

  try {
    const result = await deleteApi(`/api/assignment-drafts/${encodeURIComponent(draftId)}`);
    state.assignmentDraftLibrary = Array.isArray(result.drafts)
      ? result.drafts
      : state.assignmentDraftLibrary.filter((draft) => draft.id !== draftId);
    state.draft.notice = "Assignment draft taken down.";
  } catch (error) {
    state.draft.notice = error.message || "Unable to take down assignment draft.";
  } finally {
    render();
  }
}

async function deleteAssignment(assignmentId) {
  if (state.auth.user?.role !== "teacher" || !assignmentId) return;
  state.draft.notice = "Taking down assignment...";
  render();

  try {
    const result = await deleteApi(`/api/assignments/${encodeURIComponent(assignmentId)}`);
    state.assignmentLibrary = Array.isArray(result.assignments)
      ? result.assignments
      : state.assignmentLibrary.filter((assignment) => assignment.id !== assignmentId);
    await loadSubmissions();
    state.draft.notice = "Assignment taken down. Students will no longer see it.";
  } catch (error) {
    state.draft.notice = error.message || "Unable to take down assignment.";
  } finally {
    render();
  }
}

async function saveAnnouncement(scheduled) {
  if (state.auth.user?.role !== "teacher" || state.announcementDraft.submitting) return;
  const title = state.announcementDraft.title.trim();
  const message = state.announcementDraft.message.trim();
  const scheduledAt = state.announcementDraft.scheduledAt;

  if (!title || !message) {
    state.announcementDraft.notice = "Enter a title and message before posting.";
    render();
    return;
  }
  if (scheduled && !scheduledAt) {
    state.announcementDraft.notice = "Choose a date and time before scheduling.";
    render();
    return;
  }

  state.announcementDraft.submitting = true;
  state.announcementDraft.notice = scheduled ? "Scheduling announcement..." : "Posting announcement...";
  render();

  try {
    const response = await fetch("/api/announcements", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, message, scheduled, scheduledAt }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Unable to save announcement.");
    state.announcementLibrary = Array.isArray(result.announcements) ? result.announcements : [];
    state.announcementDraft.title = "";
    state.announcementDraft.message = "";
    if (!scheduled) state.announcementDraft.scheduledAt = "";
    state.announcementDraft.notice = scheduled ? "Announcement scheduled." : "Announcement posted.";
  } catch (error) {
    state.announcementDraft.notice = error.message || "Unable to save announcement.";
  } finally {
    state.announcementDraft.submitting = false;
    render();
  }
}

async function deleteAnnouncement(announcementId) {
  if (state.auth.user?.role !== "teacher" || !announcementId) return;
  state.announcementDraft.notice = "Taking down announcement...";
  render();

  try {
    const result = await deleteApi(`/api/announcements/${encodeURIComponent(announcementId)}`);
    state.announcementLibrary = Array.isArray(result.announcements)
      ? result.announcements
      : state.announcementLibrary.filter((announcement) => announcement.id !== announcementId);
    state.announcementDraft.notice = "Announcement taken down.";
  } catch (error) {
    state.announcementDraft.notice = error.message || "Unable to take down announcement.";
  } finally {
    render();
  }
}

async function markAttendance(studentId, status) {
  if (state.auth.user?.role !== "teacher") return;
  const note = state.attendance.notes[studentId] || "";
  state.attendance.notice = `Saving ${attendanceLabel(status).toLowerCase()}...`;
  render();

  try {
    const response = await fetch("/api/attendance", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: state.attendance.date,
        studentId,
        status,
        note,
      }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Unable to save attendance.");
    state.attendance.date = result.date || state.attendance.date;
    state.attendance.records = Array.isArray(result.records) ? result.records : [];
    state.attendance.notes = Object.fromEntries(
      state.attendance.records.map((record) => [record.student.id, record.note || ""]),
    );
    state.attendance.notice = "Attendance saved.";
  } catch (error) {
    state.attendance.notice = error.message || "Unable to save attendance.";
  }
  render();
}

function ensureRolePage() {
  const pages = rolePages[state.role] || rolePages.student;
  if (!pages.includes(state.page)) state.page = pages[0];
}

async function handleMessageAction(action, button) {
  const viewer = button.dataset.viewer || state.role;
  const messageId = button.dataset.messageId;
  const message = mailboxes[viewer]?.find((item) => item.id === messageId);

  try {
    if (action === "open-message" && message) {
      state.messaging.selected[viewer] = message.id;
      state.messaging.composeTo[viewer] = message.recipientId || state.messaging.composeTo[viewer];
      await updateMessageRead(viewer, message.id, true);
      state.messaging.notice = "";
    }

    if (action === "reply-message" && message) {
      state.messaging.selected[viewer] = message.id;
      state.messaging.composeTo[viewer] = message.recipientId;
      await updateMessageRead(viewer, message.id, true);
      state.messaging.notice = `Replying to ${message.sender}.`;
    }

    if (action === "toggle-read" && message) {
      const nextRead = !message.read;
      state.messaging.selected[viewer] = message.id;
      await updateMessageRead(viewer, message.id, nextRead);
      state.messaging.notice = nextRead ? "Message marked read." : "Message marked unread.";
    }

    if (action === "new-message") {
      const recipients = getRecipientOptions(viewer);
      state.messaging.selected[viewer] = "";
      state.messaging.composeTo[viewer] = recipients[0]?.id || "";
      state.messaging.draft[viewer] = "";
      state.messaging.notice = "";
    }

    if (action === "send-message") {
      await sendMessage(viewer);
    }

    if (action === "clear-message") {
      state.messaging.draft[viewer] = "";
      state.messaging.notice = "";
    }

    if (action === "clear-messages") {
      await clearMessages(viewer);
    }
  } catch (error) {
    state.messaging.notice = error.message || "The message action failed.";
  }

  render();
}

async function sendMessage(viewer) {
  const text = state.messaging.draft[viewer].trim();
  const recipients = getRecipientOptions(viewer);
  const recipientId = state.messaging.composeTo[viewer] || recipients[0]?.id || "";
  if (!text) {
    state.messaging.notice = "Write a message before sending.";
    return;
  }
  if (!recipientId) {
    state.messaging.notice = "Create another account before messaging.";
    return;
  }
  if (!recipients.some((recipient) => recipient.id === recipientId)) {
    state.messaging.notice = messageAccessNotice();
    return;
  }

  const response = await fetch("/api/messages", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ recipientId, text }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Unable to send message.");

  mailboxes[viewer] = Array.isArray(result.conversations) ? result.conversations : [];
  state.messaging.selected[viewer] = result.conversation?.id || mailboxes[viewer][0]?.id || "";
  state.messaging.composeTo[viewer] = result.conversation?.recipientId || recipientId;
  state.messaging.draft[viewer] = "";
  state.messaging.notice = `Message sent to ${recipientLabel(recipientId)}.`;
}

async function sendHelpRequest() {
  if (state.auth.user?.role !== "student") return;
  const teacher = state.directory.users.find((user) => user.role === "teacher" && user.id !== state.auth.user?.id);
  const helpText = state.helpDraft.trim() || "I need help with question 4.";
  const attempt = state.attemptDraft.trim();
  state.helpDraft = helpText;
  state.helpNotice = "Sending help request...";
  render();

  if (!teacher) {
    state.helpNotice = "No teacher account is available yet.";
    render();
    return;
  }

  try {
    const response = await fetch("/api/messages", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipientId: teacher.id,
        text: `${helpText}${attempt ? `\nAttempt: ${attempt}` : ""}`,
      }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Unable to send help request.");
    mailboxes.student = Array.isArray(result.conversations) ? result.conversations : mailboxes.student;
    state.helpNotice = `Help request sent to ${teacher.name}.`;
  } catch (error) {
    state.helpNotice = error.message || "Unable to send help request.";
  }
  render();
}

function getSelectedMessage(viewer) {
  const rows = mailboxes[viewer] || [];
  if (state.messaging.selected[viewer] === "") return null;
  const selected = rows.find((message) => message.id === state.messaging.selected[viewer]);
  return selected || rows[0] || null;
}

function canMessageRecipient(user) {
  const currentUser = state.auth.user;
  if (!currentUser || !user || user.id === currentUser.id) return false;
  if (currentUser.role === "student") {
    return user.role === "teacher" || (user.role === "parent" && user.linkedStudentId === currentUser.id);
  }
  if (currentUser.role === "parent") {
    return user.role === "teacher" || (user.role === "student" && currentUser.linkedStudentId === user.id);
  }
  return true;
}

function messageAccessNotice() {
  if (state.auth.user?.role === "student") return "Students can only message teachers and their linked parent.";
  if (state.auth.user?.role === "parent") return "Parents can only message teachers and their linked child.";
  return "You can only message users connected to your account.";
}

function getRecipientOptions(viewer) {
  const selected = getSelectedMessage(viewer);
  const options = state.directory.users.filter((user) => canMessageRecipient(user));
  const selectedUser = state.directory.users.find((user) => user.id === selected?.recipientId);
  if (selectedUser && canMessageRecipient(selectedUser) && !options.some((user) => user.id === selectedUser.id)) {
    options.push(selectedUser);
  }
  return options;
}

function selectConversationForRecipient(viewer, recipientId) {
  const recipient = state.directory.users.find((user) => user.id === recipientId);
  if (!canMessageRecipient(recipient)) {
    state.messaging.composeTo[viewer] = getRecipientOptions(viewer)[0]?.id || "";
    state.messaging.selected[viewer] = "";
    state.messaging.notice = messageAccessNotice();
    return;
  }
  const match = mailboxes[viewer]?.find((message) => message.recipientId === recipientId);
  state.messaging.selected[viewer] = match ? match.id : "";
  const label = recipientLabel(recipientId);
  state.messaging.notice = match ? `Showing conversation with ${label}.` : `Starting a new message to ${label}.`;
}

function ensureMessageSelection(viewer) {
  const rows = mailboxes[viewer] || [];
  if (state.messaging.selected[viewer] && rows.some((message) => message.id === state.messaging.selected[viewer])) return;
  state.messaging.selected[viewer] = rows[0]?.id || "";
}

function ensureMessageRecipient(viewer) {
  const selected = getSelectedMessage(viewer);
  const recipients = getRecipientOptions(viewer);
  if (selected?.recipientId && recipients.some((recipient) => recipient.id === selected.recipientId)) {
    state.messaging.composeTo[viewer] = selected.recipientId;
    return;
  }
  if (!recipients.some((recipient) => recipient.id === state.messaging.composeTo[viewer])) {
    state.messaging.composeTo[viewer] = recipients[0]?.id || "";
  }
}

function recipientLabel(recipientId) {
  const user = state.directory.users.find((item) => item.id === recipientId);
  if (user) return user.name;
  for (const rows of Object.values(mailboxes)) {
    const message = rows.find((item) => item.recipientId === recipientId);
    if (message) return message.recipientName || message.sender;
  }
  return "recipient";
}

async function updateMessageRead(viewer, conversationId, read) {
  const response = await fetch("/api/messages/read", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ conversationId, read }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Unable to update message.");
  mailboxes[viewer] = Array.isArray(result.conversations) ? result.conversations : [];
  ensureMessageSelection(viewer);
}

async function clearMessages(viewer) {
  const response = await fetch("/api/messages", {
    method: "DELETE",
    credentials: "same-origin",
    headers: { Accept: "application/json" },
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Unable to clear messages.");
  mailboxes[viewer] = [];
  state.messaging.selected[viewer] = "";
  state.messaging.draft[viewer] = "";
  state.messaging.notice = "Messages cleared.";
}

async function toggleAssignmentStep(assignmentId, stepIndex) {
  if (state.auth.user?.role !== "student") return;
  const current = Boolean(state.work.assignments[assignmentId]?.steps?.[stepIndex]);
  const next = !current;

  state.work.assignments = {
    ...state.work.assignments,
    [assignmentId]: {
      ...(state.work.assignments[assignmentId] || {}),
      steps: [...(state.work.assignments[assignmentId]?.steps || [])],
    },
  };
  state.work.assignments[assignmentId].steps[stepIndex] = next;
  render();

  try {
    const response = await fetch("/api/work/assignment-step", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ assignmentId, stepIndex, done: next }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Unable to save homework progress.");
    state.work = {
      studentId: result.work?.studentId || state.auth.user.id,
      assignments: result.work?.assignments || {},
    };
  } catch (error) {
    state.work.assignments[assignmentId].steps[stepIndex] = current;
    state.messaging.notice = error.message || "Homework progress could not be saved.";
  }
  render();
}

function openAssignmentStep(assignmentId, stepIndex) {
  if (state.auth.user?.role !== "student" || !assignmentId) return;
  const assignment = getStudentAssignments().find((item) => item.id === assignmentId);
  const label = assignment?.steps?.[stepIndex]?.label?.toLowerCase() || "";
  state.page = "Homework";

  if (/(upload|written|draw|work)/.test(label)) {
    state.drawing.assignmentId = assignmentId;
    state.drawing.status = "";
  }

  render();
  window.requestAnimationFrame(() => {
    const card = document.querySelector(`[data-assignment-card="${safeDomId(assignmentId)}"]`);
    if (!card) return;
    card.scrollIntoView({ behavior: "smooth", block: "start" });
    card.classList.add("assignment-card-focus");
    window.setTimeout(() => card.classList.remove("assignment-card-focus"), 1400);
  });
}

function openBridgeSpace(assignmentId) {
  if (state.auth.user?.role !== "student" || !assignmentId) return;
  const assignment = getStudentAssignments().find((item) => item.id === assignmentId);
  if (!assignment) return;
  state.bridgeSpace = {
    assignmentId,
    questionIndex: Math.min(Number(state.bridgeSpace.questionIndex) || 0, Math.max((assignment.questions?.length || 1) - 1, 0)),
    tab: "practice",
    working: state.bridgeSpace.assignmentId === assignmentId ? state.bridgeSpace.working : "",
    notice: "",
  };
  render();
}

function currentBridgeSpaceAssignment() {
  return getStudentAssignments().find((item) => item.id === state.bridgeSpace.assignmentId);
}

function currentBridgeSpaceQuestion() {
  const assignment = currentBridgeSpaceAssignment();
  const questions = Array.isArray(assignment?.questions) ? assignment.questions.map(normalizeHomeworkQuestion) : [];
  return questions[Number(state.bridgeSpace.questionIndex) || 0] || { type: "text", prompt: "", choices: [] };
}

function moveBridgeSpaceQuestion(delta) {
  const assignment = currentBridgeSpaceAssignment();
  if (!assignment) return;
  const count = Math.max(assignment.questions?.length || 1, 1);
  state.bridgeSpace.questionIndex = Math.min(Math.max((Number(state.bridgeSpace.questionIndex) || 0) + delta, 0), count - 1);
  state.bridgeSpace.notice = "";
  if (state.aiHelp.assignmentId === assignment.id) {
    state.aiHelp.questionIndex = state.bridgeSpace.questionIndex;
    state.aiHelp.attempt = aiHelpAttemptForQuestion(assignment, state.bridgeSpace.questionIndex);
    state.aiHelp.reply = "";
    state.aiHelp.status = "";
  }
  render();
}

function bridgeSpaceStepHint(question) {
  const text = String(question?.prompt || "").toLowerCase();
  if (/solve|equation|x|variable/.test(text)) return "Start by undoing the operation farthest from the variable. Keep both sides balanced after every move.";
  if (/percent|discount|tax|interest|sale|money|\$/.test(text)) return "Write the amount you start with, then convert the percent to a decimal before calculating.";
  if (/fraction|decimal|ratio|rate/.test(text)) return "Put the numbers into the same form first. Then compare using a fraction, ratio, or unit rate.";
  if (/area|volume|pythagorean|triangle|circle|metre|meter|cm/.test(text)) return "Choose the matching formula first, then substitute only the values the question gives you.";
  return "Underline what the question is asking for, write the known values, and make one first step before calculating.";
}

function showBridgeSpaceStepHint() {
  const question = currentBridgeSpaceQuestion();
  state.bridgeSpace.notice = bridgeSpaceStepHint(question);
  render();
}

function bridgeKeyboardValue(key) {
  return {
    "÷": " ÷ ",
    "×": " × ",
    "+": " + ",
    "-": " - ",
    "=": " = ",
    "<": " < ",
    ">": " > ",
    "≤": " ≤ ",
    "≥": " ≥ ",
    sqrt: "√",
  }[key] || key;
}

function pressBridgeKey(key) {
  if (!state.bridgeSpace.assignmentId || !key) return;
  const assignment = currentBridgeSpaceAssignment();
  if (!assignment) return;
  if (key === "clear") {
    const question = currentBridgeSpaceQuestion();
    if (question.type === "text") updateAssignmentAnswerDraft(assignment.id, Number(state.bridgeSpace.questionIndex) || 0, "");
    else state.bridgeSpace.working = "";
    render();
    return;
  }
  if (key === "backspace") {
    const question = currentBridgeSpaceQuestion();
    if (question.type === "text") {
      const answers = answerDraftsForAssignment(assignment);
      const current = String(answers[Number(state.bridgeSpace.questionIndex) || 0] || "");
      updateAssignmentAnswerDraft(assignment.id, Number(state.bridgeSpace.questionIndex) || 0, current.slice(0, -1));
    } else {
      state.bridgeSpace.working = state.bridgeSpace.working.slice(0, -1);
    }
    render();
    return;
  }

  const question = currentBridgeSpaceQuestion();
  if (question.type === "text") {
    const index = Number(state.bridgeSpace.questionIndex) || 0;
    const answers = answerDraftsForAssignment(assignment);
    updateAssignmentAnswerDraft(assignment.id, index, `${answers[index] || ""}${bridgeKeyboardValue(key)}`);
  } else {
    state.bridgeSpace.working = `${state.bridgeSpace.working || ""}${bridgeKeyboardValue(key)}`;
  }
  render();
}

function checkBridgeSpaceAnswer(assignmentId) {
  const assignment = getStudentAssignments().find((item) => item.id === assignmentId);
  if (!assignment) return;
  const questionIndex = Number(state.bridgeSpace.questionIndex) || 0;
  const question = normalizeHomeworkQuestion(assignment.questions?.[questionIndex]);
  const answer = answerDraftsForAssignment(assignment)[questionIndex];
  const hasAnswer = bridgeAnswerHasValue(answer);
  if (question.prompt && !hasAnswer) {
    state.bridgeSpace.notice = "Add an answer first, then check it.";
    render();
    return;
  }
  const match = bridgeAnswerMatchesKey(question, answer);
  if (match === true) {
    state.bridgeSpace.notice = "Correct. Your answer is saved.";
  } else if (match === false) {
    state.bridgeSpace.notice = "Not quite yet. Use a hint or recheck the question, then try again.";
  } else {
    state.bridgeSpace.notice = "Answer saved. Your teacher can verify it after you submit.";
  }
  saveAssignmentAnswers(assignmentId);
}

function bridgeAnswerMatchesKey(question, answer) {
  const answerKey = Array.isArray(question.answerKey)
    ? question.answerKey.map(cleanQuestionAnswerValue).filter(Boolean)
    : [];
  if (!answerKey.length) return null;

  if (question.type === "select-all") {
    const expected = new Set(answerKey.map(normalizeAnswer));
    const actual = new Set((Array.isArray(answer) ? answer : []).map(normalizeAnswer).filter(Boolean));
    return expected.size === actual.size && [...expected].every((value) => actual.has(value));
  }

  if (question.type === "multiple-choice") {
    const normalized = normalizeAnswer(answer);
    return answerKey.some((expected) => normalizeAnswer(expected) === normalized);
  }

  const normalized = normalizeAnswer(answer);
  return answerKey.some((expected) => normalizeAnswer(expected) === normalized);
}

function aiHelpAttemptForQuestion(assignment, questionIndex) {
  if (!assignment) return "";
  const answers = answerDraftsForAssignment(assignment);
  const answer = answers[questionIndex];
  if (Array.isArray(answer)) return answer.join(", ");
  return String(answer || "");
}

function aiHelpThreadKey(assignmentId = state.aiHelp.assignmentId, questionIndex = state.aiHelp.questionIndex) {
  return `${assignmentId || "assignment"}:${Number(questionIndex) || 0}`;
}

function aiHelpThread(assignmentId = state.aiHelp.assignmentId, questionIndex = state.aiHelp.questionIndex) {
  const key = aiHelpThreadKey(assignmentId, questionIndex);
  return Array.isArray(state.aiHelp.threads?.[key]) ? state.aiHelp.threads[key] : [];
}

function setAiHelpThread(assignmentId, questionIndex, thread) {
  const key = aiHelpThreadKey(assignmentId, questionIndex);
  state.aiHelp.threads = {
    ...(state.aiHelp.threads || {}),
    [key]: thread.slice(-12),
  };
}

function startAssignmentAiHelp(assignmentId, questionIndex = 0) {
  const assignment = getStudentAssignments().find((item) => item.id === assignmentId);
  if (!assignment) return;
  const boundedIndex = Math.min(Math.max(Number(questionIndex) || 0, 0), Math.max((assignment.questions?.length || 1) - 1, 0));
  const previousThreads = state.aiHelp.threads || {};
  state.aiHelp = {
    assignmentId,
    questionIndex: boundedIndex,
    message: state.aiHelp.assignmentId === assignmentId ? state.aiHelp.message : "",
    attempt: aiHelpAttemptForQuestion(assignment, boundedIndex),
    reply: "",
    status: "",
    source: "",
    loading: false,
    threads: previousThreads,
  };
  render();
}

async function askAssignmentAiHelp(assignmentId) {
  if (state.auth.user?.role !== "student" || state.aiHelp.loading) return;
  const assignment = getStudentAssignments().find((item) => item.id === assignmentId);
  if (!assignment) return;
  const maxIndex = Math.max((assignment.questions?.length || 1) - 1, 0);
  const questionIndex = Math.min(Math.max(Number(state.aiHelp.questionIndex) || 0, 0), maxIndex);
  const question = normalizeHomeworkQuestion(assignment.questions?.[questionIndex]);
  if (!question?.prompt) {
    state.aiHelp.status = "Choose a real assignment question before asking the AI tutor.";
    render();
    return;
  }
  const message = state.aiHelp.message.trim() || "I need a hint for this question.";
  const attempt = state.aiHelp.attempt.trim() || aiHelpAttemptForQuestion(assignment, questionIndex);
  const previousThread = aiHelpThread(assignmentId, questionIndex);
  const messageWithQuestion = `Question ${questionIndex + 1}: ${question.prompt}\nStudent message: ${message}`;
  const nextThread = [...previousThread, { role: "user", content: messageWithQuestion }];
  setAiHelpThread(assignmentId, questionIndex, nextThread);

  state.aiHelp = {
    ...state.aiHelp,
    assignmentId,
    questionIndex,
    message: "",
    attempt,
    loading: true,
    status: "Asking the local AI tutor...",
    reply: "",
    source: "",
  };
  render();

  try {
    const response = await fetch("/api/ai/help", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ assignmentId, questionIndex, message: messageWithQuestion, attempt, history: previousThread }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Unable to ask the local AI tutor.");
    const reply = result.reply || "Try explaining your first step, then I can give a more specific hint.";
    state.aiHelp.reply = reply;
    setAiHelpThread(assignmentId, questionIndex, [...nextThread, { role: "assistant", content: reply }]);
    state.aiHelp.source = result.source || "";
    state.aiHelp.status = result.source === "local-ai"
      ? `Local AI responded using ${result.model || "your local model"}.`
      : "Local AI was unavailable, so MathBridge used guided hints.";
  } catch (error) {
    state.aiHelp.status = error.message || "Unable to ask the local AI tutor.";
    setAiHelpThread(assignmentId, questionIndex, previousThread);
  } finally {
    state.aiHelp.loading = false;
    render();
  }
}

function clearAiHelpThread(assignmentId = state.aiHelp.assignmentId) {
  const questionIndex = Number(state.aiHelp.questionIndex) || 0;
  const key = aiHelpThreadKey(assignmentId, questionIndex);
  const threads = { ...(state.aiHelp.threads || {}) };
  delete threads[key];
  state.aiHelp.threads = threads;
  state.aiHelp.reply = "";
  state.aiHelp.status = "";
  render();
}

function openTeacherHelpForAiQuestion(assignmentId) {
  const assignment = getStudentAssignments().find((item) => item.id === assignmentId);
  if (!assignment) return;
  const questionIndex = Number(state.aiHelp.questionIndex) || 0;
  const question = normalizeHomeworkQuestion(assignment.questions?.[questionIndex]);
  const questionLabel = question?.prompt ? `Question ${questionIndex + 1}: ${question.prompt}` : `Question ${questionIndex + 1}`;
  state.helpDraft = `I need help with ${assignment.title}. ${questionLabel}`;
  state.attemptDraft = state.aiHelp.attempt || aiHelpAttemptForQuestion(assignment, questionIndex);
  state.helpNotice = "";
  setPage("Ask for Help");
}

function updateAssignmentAnswerDraft(assignmentId, index, value) {
  if (!assignmentId || !Number.isInteger(index) || index < 0) return;
  const saved = state.work.assignments[assignmentId]?.answers || [];
  const next = [...(state.answerDrafts[assignmentId] || saved)];
  next[index] = value;
  state.answerDrafts[assignmentId] = next;
  if (state.answerStatus.assignmentId === assignmentId) {
    state.answerStatus.notice = "";
  }
}

function updateAssignmentSelectAllDraft(assignmentId, index, choice, checked) {
  if (!assignmentId || !Number.isInteger(index) || index < 0 || !choice) return;
  const saved = state.work.assignments[assignmentId]?.answers || [];
  const next = [...(state.answerDrafts[assignmentId] || saved)];
  const selected = new Set(Array.isArray(next[index]) ? next[index] : []);
  if (checked) selected.add(choice);
  else selected.delete(choice);
  next[index] = [...selected];
  state.answerDrafts[assignmentId] = next;
  if (state.answerStatus.assignmentId === assignmentId) {
    state.answerStatus.notice = "";
  }
}

async function saveAssignmentAnswers(assignmentId) {
  if (state.auth.user?.role !== "student" || !assignmentId) return;
  const assignment = getStudentAssignments().find((item) => item.id === assignmentId);
  if (!assignment) return;
  const answers = answerDraftsForAssignment(assignment);

  state.answerStatus = { assignmentId, notice: "Saving answers..." };
  render();

  try {
    const response = await fetch("/api/work/answers", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ assignmentId, answers }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Unable to save answers.");
    state.work = {
      studentId: result.work?.studentId || state.auth.user.id,
      assignments: result.work?.assignments || {},
    };
    state.answerDrafts[assignmentId] = state.work.assignments[assignmentId]?.answers || answers;
    state.answerStatus = { assignmentId, notice: "Answers saved. Submit when you are ready for teacher verification." };
  } catch (error) {
    state.answerStatus = { assignmentId, notice: error.message || "Unable to save answers." };
  }
  render();
}

function toggleRosterStudent(studentId, checked) {
  if (state.auth.user?.role !== "teacher" || !studentId) return;
  const ids = new Set(state.classRoster.studentIds);
  if (checked) ids.add(studentId);
  else ids.delete(studentId);
  state.classRoster.studentIds = [...ids];
  state.classRoster.notice = "";
  render();
}

async function saveClassRoster() {
  if (state.auth.user?.role !== "teacher" || state.classRoster.saving) return;
  const className = state.classRoster.draftName.trim();
  if (!className) {
    state.classRoster.notice = "Name the class before saving.";
    render();
    return;
  }
  state.classRoster.saving = true;
  state.classRoster.notice = "Saving class roster...";
  render();

  try {
    const response = await fetch("/api/classes", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        classId: state.classRoster.selectedClassId,
        name: className,
        studentIds: state.classRoster.studentIds,
      }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Unable to save class.");
    state.auth.user = result.user;
    state.classRoster.classes = Array.isArray(result.user?.classes) ? result.user.classes : [];
    state.classRoster.selectedClassId = result.class?.id || state.classRoster.selectedClassId;
    state.classRoster.draftName = result.class?.name || className;
    state.classRoster.studentIds = Array.isArray(result.class?.studentIds) ? result.class.studentIds : state.classRoster.studentIds;
    if (!state.draft.classId || state.draft.classId === state.classRoster.selectedClassId) {
      state.draft.classId = state.classRoster.selectedClassId;
      state.draft.className = state.classRoster.draftName;
    }
    state.classRoster.notice = `Saved ${state.classRoster.draftName} with ${state.classRoster.studentIds.length} student${state.classRoster.studentIds.length === 1 ? "" : "s"}.`;
    await loadAssignments();
    await loadAttendance();
    await loadSubmissions();
  } catch (error) {
    state.classRoster.notice = error.message || "Unable to save class.";
  } finally {
    state.classRoster.saving = false;
    render();
  }
}

async function uploadWorkDocument(assignmentId, file) {
  if (state.auth.user?.role !== "student" || !assignmentId || !file) return;
  state.workUpload = { assignmentId, notice: "Uploading document..." };
  render();

  const formData = new FormData();
  formData.append("assignmentId", assignmentId);
  formData.append("documentFile", file, file.name || "student-work");

  try {
    const response = await fetch("/api/work/document", {
      method: "POST",
      credentials: "same-origin",
      headers: { Accept: "application/json" },
      body: formData,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Unable to upload document.");
    state.work = {
      studentId: result.work?.studentId || state.auth.user.id,
      assignments: result.work?.assignments || {},
    };
    state.workUpload = { assignmentId, notice: "Document saved. Submit it when you are ready for teacher verification." };
  } catch (error) {
    state.workUpload = { assignmentId, notice: error.message || "Document upload failed." };
  }
  render();
}

async function saveWorkDrawing(assignmentId) {
  if (state.auth.user?.role !== "student" || !assignmentId) return;
  const canvas = document.querySelector("#work-canvas");
  if (!canvas || canvas.dataset.assignmentCanvas !== assignmentId) return;

  state.drawing.status = "Saving drawing...";
  const status = document.querySelector(".drawing-message");
  if (status) status.textContent = state.drawing.status;

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) {
    state.drawing.status = "Drawing could not be saved.";
    if (status) status.textContent = state.drawing.status;
    return;
  }

  const formData = new FormData();
  formData.append("assignmentId", assignmentId);
  formData.append("drawingFile", blob, "math-work.png");

  try {
    const response = await fetch("/api/work/drawing", {
      method: "POST",
      credentials: "same-origin",
      headers: { Accept: "application/json" },
      body: formData,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Unable to save drawing.");
    state.work = {
      studentId: result.work?.studentId || state.auth.user.id,
      assignments: result.work?.assignments || {},
    };
    state.workUpload = { assignmentId, notice: "Drawing saved. Submit it when you are ready for teacher verification." };
    state.drawing.status = "Drawing saved.";
  } catch (error) {
    state.drawing.status = error.message || "Drawing could not be saved.";
  }
  render();
}

async function submitWork(assignmentId) {
  if (state.auth.user?.role !== "student" || !assignmentId) return;
  const assignment = getStudentAssignments().find((item) => item.id === assignmentId);
  const comment = (state.submitComments[assignmentId] ?? assignment?.studentComment ?? "").trim();
  state.workUpload = { assignmentId, notice: "Submitting work to your teacher..." };
  render();

  try {
    const response = await fetch("/api/work/submit", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ assignmentId, comment }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Unable to submit work.");
    state.work = {
      studentId: result.work?.studentId || state.auth.user.id,
      assignments: result.work?.assignments || {},
    };
    state.submitComments[assignmentId] = state.work.assignments[assignmentId]?.studentComment || comment;
    state.workUpload = {
      assignmentId,
      notice: result.teacherMessaged
        ? "Submitted. Your teacher was messaged and can now verify it."
        : "Submitted. Your teacher can now verify it.",
    };
  } catch (error) {
    state.workUpload = { assignmentId, notice: error.message || "Unable to submit work." };
  }
  render();
}

async function suggestSubmissionGrade(studentId, assignmentId, options = {}) {
  if (state.auth.user?.role !== "teacher" || !studentId || !assignmentId) return;
  const automatic = Boolean(options.automatic);
  const draftKey = submissionDraftKey(studentId, assignmentId);
  state.submissionReview.aiLoading = draftKey;
  state.submissionReview.notice = automatic
    ? "MathBridge is drafting a grade suggestion. Nothing will be sent to the student until you save and return the work."
    : "Asking local AI for a grade suggestion...";
  render();

  try {
    const response = await fetch("/api/ai/grade-suggestion", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ studentId, assignmentId }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Unable to get a grade suggestion.");
    const grade = validGrade(result.grade);
    if (grade !== null) {
      state.submissionReview.grades[draftKey] = String(grade);
    }
    if (result.feedback) {
      state.submissionReview.feedback[draftKey] = result.feedback;
    }
    const uploadNote = result.evidence?.readableUploads
      ? ` Included ${result.evidence.readableUploads} readable upload${result.evidence.readableUploads === 1 ? "" : "s"}.`
      : "";
    const historyNote = result.evidence?.gradeExamples
      ? ` Used ${result.evidence.gradeExamples} prior teacher grading example${result.evidence.gradeExamples === 1 ? "" : "s"}.`
      : "";
    state.submissionReview.notice = result.source === "mathbridge-grader"
      ? `MathBridge drafted ${grade !== null ? formatGrade(grade) : "manual review"} from the visible typed answers. Review and approve before returning; nothing was sent to the student.`
      : result.source === "local-ai"
        ? `Local AI drafted ${grade !== null ? formatGrade(grade) : "manual review"} using ${result.model || "your local model"}.${uploadNote}${historyNote} Review and approve before returning; nothing was sent to the student.`
        : `Local AI could not judge a percentage automatically.${uploadNote}${historyNote} Review manually before returning; nothing was sent to the student.`;
  } catch (error) {
    state.submissionReview.notice = automatic
      ? "Automatic AI grading could not run. You can still grade manually or refresh the AI suggestion."
      : error.message || "Unable to get a grade suggestion.";
  } finally {
    state.submissionReview.aiLoading = "";
    render();
  }
}

async function verifySubmission(studentId, assignmentId, verified) {
  if (state.auth.user?.role !== "teacher" || !studentId || !assignmentId) return;
  const draftKey = submissionDraftKey(studentId, assignmentId);
  const gradeText = String(state.submissionReview.grades[draftKey] ?? "").trim();
  const feedback = String(state.submissionReview.feedback[draftKey] ?? "").trim();
  const grade = validGrade(gradeText);
  if (verified && gradeText && grade === null) {
    state.submissionReview.notice = "Enter a worksheet grade from 0 to 100.";
    render();
    return;
  }
  state.submissionReview.notice = verified ? "Saving grade..." : "Requesting correction...";
  render();

  try {
    const response = await fetch("/api/submissions/verify", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentId,
        assignmentId,
        verified,
        grade: verified && grade !== null ? grade : "",
        feedback: feedback || (verified ? "Verified by teacher." : "Please correct and resubmit."),
      }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Unable to review submission.");
    state.submissions = Array.isArray(result.submissions) ? result.submissions : [];
    delete state.submissionReview.grades[draftKey];
    delete state.submissionReview.feedback[draftKey];
    state.submissionReview.aiFeedback = {
      studentId,
      assignmentId,
      draft: "",
      notice: "Optional: tell MathBridge what the AI should learn from this grading decision.",
      saving: false,
    };
    state.submissionReview.notice = verified
      ? grade !== null
        ? `Grade saved: ${formatGrade(grade)}. Student was messaged automatically.`
        : "Submission verified. Student was messaged automatically."
      : "Correction requested. Student was messaged automatically.";
    loadMessages().then(render);
  } catch (error) {
    state.submissionReview.notice = error.message || "Unable to review submission.";
  }
  render();
}

async function saveAiGradeFeedback(studentId, assignmentId) {
  if (state.auth.user?.role !== "teacher" || !studentId || !assignmentId) return;
  const draft = String(state.submissionReview.aiFeedback?.draft || "").trim();
  if (!draft) {
    state.submissionReview.aiFeedback = {
      ...(state.submissionReview.aiFeedback || {}),
      notice: "Write optional feedback first, or press Skip.",
      saving: false,
    };
    render();
    return;
  }
  state.submissionReview.aiFeedback = {
    ...(state.submissionReview.aiFeedback || {}),
    studentId,
    assignmentId,
    saving: true,
    notice: "Saving AI feedback...",
  };
  render();

  try {
    const response = await fetch("/api/ai/grade-feedback", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ studentId, assignmentId, feedback: draft }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Unable to save AI feedback.");
    state.submissionReview.aiFeedback = {
      studentId: "",
      assignmentId: "",
      draft: "",
      notice: "",
      saving: false,
    };
    state.submissionReview.notice = "AI feedback saved for future grade suggestions.";
  } catch (error) {
    state.submissionReview.aiFeedback = {
      ...(state.submissionReview.aiFeedback || {}),
      saving: false,
      notice: error.message || "Unable to save AI feedback.",
    };
  }
  render();
}

async function selectParentStudent(studentId) {
  if (state.auth.user?.role !== "parent") return;
  if (!studentId) {
    clearParentStudent();
    return;
  }
  state.parent.notice = "Parents link students by exact email for privacy.";
  render();
}

async function linkParentStudent() {
  if (state.auth.user?.role !== "parent") return;
  const studentEmail = state.parent.studentEmail.trim().toLowerCase();
  if (!studentEmail) {
    state.parent.notice = "Enter your child's student account email.";
    render();
    return;
  }

  try {
    state.parent.notice = "Linking child account...";
    render();
    const response = await fetch("/api/parent/student", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ studentEmail }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Unable to link student.");
    state.auth.user = result.user;
    state.parent.selectedStudentId = result.user?.linkedStudentId || result.student?.id || "";
    state.parent.studentEmail = "";
    await loadDirectory();
    await loadAssignments();
    await loadWork(state.parent.selectedStudentId);
    await loadAttendance();
    state.parent.notice = state.parent.selectedStudentId
      ? `Now tracking ${parentChildName()}.`
      : "No student selected.";
  } catch (error) {
    state.parent.notice = error.message || "Unable to link student.";
  }
  render();
}

async function clearParentStudent() {
  if (state.auth.user?.role !== "parent") return;
  try {
    state.parent.notice = "Clearing child account...";
    render();
    const response = await fetch("/api/parent/student", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Unable to clear student.");
    state.auth.user = result.user;
    state.parent.selectedStudentId = "";
    state.parent.studentEmail = "";
    await loadDirectory();
    await loadAssignments();
    await loadWork("");
    await loadAttendance();
    state.parent.notice = "No student selected.";
  } catch (error) {
    state.parent.notice = error.message || "Unable to clear student.";
  }
  render();
}

function resetMailboxes() {
  for (const role of Object.keys(mailboxes)) {
    mailboxes[role] = [];
    state.messaging.selected[role] = "";
    state.messaging.composeTo[role] = "";
    state.messaging.draft[role] = "";
  }
}

function checkPracticeAnswer(id, question) {
  const submitted = state.practiceAnswers[id] || "";
  const accepted = answerKey[question] || [];
  const correct = accepted.some((answer) => normalizeAnswer(answer) === normalizeAnswer(submitted));
  state.practiceResults[id] = {
    correct,
    submitted,
    question,
  };
  if (!correct) savePracticeReview(id, question, false);
  render();
}

function savePracticeReview(id, question, shouldRender = true) {
  if (!question) return;
  const submitted = state.practiceAnswers[id] || "";
  const existing = state.reviewItems.some((item) => item.question === question);
  if (!existing) {
    state.reviewItems.unshift({
      question,
      note: submitted ? `Your answer: ${submitted}` : "Saved for extra review",
    });
  }
  if (shouldRender) render();
}

function currentDailyChallenge() {
  const today = new Date();
  const dateKey = localDateKey(today);
  if (state.dailyChallengeDateKey !== dateKey) {
    state.dailyChallengeDateKey = dateKey;
    state.dailyChallengeAnswer = "";
    state.dailyChallengeResult = null;
  }
  const index = positiveModulo(schoolYearDayIndex(today), dailyChallenges.length);
  return {
    ...dailyChallenges[index],
    dateKey,
    dateLabel: today.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    bankPosition: index + 1,
    bankSize: dailyChallenges.length,
  };
}

function checkDailyChallenge() {
  const challenge = currentDailyChallenge();
  const correct = challenge.answers.some((answer) => normalizeAnswer(answer) === normalizeAnswer(state.dailyChallengeAnswer));
  state.dailyChallengeResult = correct ? "correct" : "incorrect";
  render();
}

function localDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function schoolYearDayIndex(date) {
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const schoolYearStartYear = date.getMonth() >= 8 ? date.getFullYear() : date.getFullYear() - 1;
  const schoolYearStart = new Date(schoolYearStartYear, 8, 1);
  return Math.floor((today - schoolYearStart) / 86400000);
}

function positiveModulo(value, divisor) {
  return ((value % divisor) + divisor) % divisor;
}

function practiceQuestionId(question, index) {
  return `${index}-${question.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

function normalizeAnswer(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/approximately|approx\.?|about|≈/g, "")
    .replace(/\s+/g, "")
    .replace(/\*/g, "")
    .replace(/×/g, "")
    .replace(/\$/g, "")
    .replace(/,/g, "")
    .replace(/%/g, "")
    .replace(/degrees?/g, "")
    .replace(/(metres?|meters?|dollars?|students?|people|years?|months?|hours?|hrs?|km|cm|ml|kg|g|l|m)(\^?[23])?/g, "")
    .replace(/per/g, "/")
    .replace(/km\/hour/g, "km/h")
    .replace(/\.0+$/g, "");
}

function hydrateMailboxes() {
  try {
    localStorage.removeItem(MESSAGE_STORAGE_KEY);
  } catch (error) {
    // Browser storage can be unavailable in private contexts; server storage still works.
  }
}

function saveMailboxes() {
  hydrateMailboxes();
}

function updateCalc(key) {
  if (key === "=") {
    try {
      const expression = state.calc.replace(/[^0-9+\-*/.()]/g, "");
      state.calc = String(Function(`"use strict"; return (${expression || 0})`)());
    } catch {
      state.calc = "Error";
    }
  } else {
    state.calc = state.calc === "Error" ? key : state.calc + key;
  }
  render();
}

function setByPath(path, value) {
  const parts = path.split(".");
  let target = state;
  while (parts.length > 1) {
    target = target[parts.shift()];
  }
  const key = parts[0];
  target[key] = ["questions", "value", "m", "b"].includes(key) ? Number(value) : value;
}

function rotate(items) {
  if (!items.length) return items;
  return [...items.slice(1), items[0]];
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function safeDomId(value) {
  return String(value || "item").replace(/[^a-z0-9_-]+/gi, "-");
}

function formatBytes(value = 0) {
  const size = Number(value) || 0;
  if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  if (size >= 1024) return `${Math.round(size / 1024)} KB`;
  return `${size} B`;
}

function formatShortDate(value) {
  if (!value) return "Saved";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Saved";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function formatDateTime(value) {
  if (!value) return "now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "selected time";
  return date.toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function documentIcon(document) {
  const type = String(document?.type || "").toLowerCase();
  const name = String(document?.name || "").toLowerCase();
  if (type.includes("pdf") || name.endsWith(".pdf")) return "PDF";
  if (type.startsWith("image/") || /\.(png|jpe?g|gif|webp|heic|heif)$/.test(name)) return "IMG";
  if (type.includes("word") || /\.(docx?|rtf)$/.test(name)) return "DOC";
  if (type.includes("text") || name.endsWith(".txt")) return "TXT";
  return "FILE";
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function messageBubbleClass(senderRole, viewerRole, own = senderRole === viewerRole) {
  if (senderRole === "system") return "bubble message-system";
  return own ? "bubble message-own" : "bubble message-other";
}

function messageNavPage(page) {
  return page === "Messages" || page === "Teacher Messages";
}

function unreadMessageCount(role = state.role) {
  return (mailboxes[role] || []).filter((message) => !message.read).length;
}

function pendingSubmissionCount() {
  if (state.role !== "teacher") return 0;
  return getSubmissionRows().filter((row) =>
    row.verificationStatus !== "verified" &&
    row.verificationStatus !== "needs-correction",
  ).length;
}

function selectedParentStudent() {
  return state.directory.users.find((user) => user.id === state.parent.selectedStudentId && user.role === "student") || null;
}

function parentChildName() {
  const selected = selectedParentStudent();
  if (selected) return selected.name;
  return state.auth.user?.context && state.auth.user.context !== "Child profile"
    ? state.auth.user.context
    : "Your student";
}

function primaryTeacherName() {
  const teacher = state.directory.users.find((user) => user.role === "teacher");
  return teacher?.name || "Teacher";
}

function currentContext() {
  if (state.role === "parent") return parentChildName();
  if (state.auth.user?.context) return state.auth.user.context;
  if (state.role === "student") return "Grade 8B";
  if (state.role === "teacher") return "No students yet";
  return "Child profile";
}

function sidebarTitle() {
  if (state.role === "student") return "Next due";
  if (state.role === "teacher") return "Class pulse";
  return "Weekly report";
}

function sidebarDetail() {
  if (state.role === "student") return getStudentAssignments().length ? "Teacher-assigned work is open." : "No assignments due.";
  if (state.role === "teacher") return getClassStudents().length ? "Student activity is ready for review." : "Assign students to your class.";
  if (!state.parent.selectedStudentId) return "Select a student to view progress.";
  const stats = assignmentStats(getParentAssignments());
  return `Homework completed: ${stats.completed}/${stats.total}. Quiz on Friday.`;
}

function profileInitials() {
  if (state.auth.user?.name) {
    return state.auth.user.name
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }
  if (state.role === "student") return "AR";
  if (state.role === "teacher") return "TC";
  return "JR";
}

function profileName() {
  if (state.auth.user?.name) return state.auth.user.name;
  if (state.role === "student") return "Alex Rivera";
  if (state.role === "teacher") return "Teacher";
  return "Jordan Rivera";
}

function profileMeta() {
  if (state.auth.user?.role) return `${capitalize(state.auth.user.role)} account`;
  if (state.role === "student") return "Student account";
  if (state.role === "teacher") return "Math teacher";
  return "Parent account";
}

document.addEventListener("click", handleClick);
document.addEventListener("input", handleInput);
document.addEventListener("keydown", handleKeydown);
document.addEventListener("change", handleChange);
document.addEventListener("submit", handleSubmit);
hydrateMailboxes();
initAuth();
