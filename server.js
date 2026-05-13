const crypto = require("node:crypto");
const childProcess = require("node:child_process");
const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");

const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT || 8080);
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, "data");
const UPLOAD_DIR = path.join(DATA_DIR, "uploads");
const STORE_PATH = path.join(DATA_DIR, "auth-store.json");
const COOKIE_NAME = "mathbridge_session";
const SESSION_MS = 7 * 24 * 60 * 60 * 1000;
const BODY_LIMIT = 1024 * 1024;
const UPLOAD_LIMIT = 250 * 1024 * 1024;
const LOCAL_AI_URL = process.env.MATHBRIDGE_AI_URL || "http://127.0.0.1:11434/api/chat";
const LOCAL_AI_MODEL = process.env.MATHBRIDGE_AI_MODEL || process.env.OLLAMA_MODEL || "llama3.2:3b";
const LOCAL_AI_VISION_MODEL = process.env.MATHBRIDGE_AI_VISION_MODEL || "";
const LOCAL_AI_TIMEOUT_MS = Number(process.env.MATHBRIDGE_AI_TIMEOUT_MS || 15000);
const AI_TEXT_LIMIT = 6000;
const AI_HISTORY_LIMIT = 6;

const SEED_USERS = [];

const LEGACY_DEMO_STUDENT_IDS = new Set(["student-alex"]);
const LEGACY_DEMO_STUDENT_EMAILS = new Set(["student@mathbridge.local"]);
const LEGACY_DEMO_PARENT_IDS = new Set(["parent-jordan"]);
const LEGACY_DEMO_PARENT_EMAILS = new Set(["parent@mathbridge.local"]);
const LEGACY_DEMO_TEACHER_IDS = new Set(["teacher-nguyen"]);
const LEGACY_DEMO_TEACHER_EMAILS = new Set(["teacher@mathbridge.local"]);
const VALID_ROLES = new Set(["student", "teacher", "parent"]);
const ATTENDANCE_STATUSES = new Set(["present", "late", "absent", "excused"]);
const MATERIAL_KINDS = new Set(["worksheet", "lesson-video", "document"]);

const STATIC_FILES = new Map([
  ["/", "index.html"],
  ["/index.html", "index.html"],
  ["/styles.css", "styles.css"],
  ["/app.js", "app.js"],
]);

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".gif": "image/gif",
  ".heic": "image/heic",
  ".heif": "image/heif",
  ".html": "text/html; charset=utf-8",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".m4v": "video/mp4",
  ".mov": "video/quicktime",
  ".mp4": "video/mp4",
  ".ogg": "video/ogg",
  ".ogv": "video/ogg",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".txt": "text/plain; charset=utf-8",
  ".webm": "video/webm",
  ".webp": "image/webp",
};

const WORK_DOCUMENT_TYPES = new Set([
  "application/msword",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/gif",
  "image/heic",
  "image/heif",
  "image/jpeg",
  "image/png",
  "image/webp",
  "text/plain",
]);

const WORK_DOCUMENT_EXTENSIONS = new Set([".doc", ".docx", ".gif", ".heic", ".heif", ".jpeg", ".jpg", ".pdf", ".png", ".txt", ".webp"]);

function createPasswordRecord(password) {
  const salt = crypto.randomBytes(16).toString("base64");
  const hash = crypto.pbkdf2Sync(password, salt, 310000, 32, "sha256").toString("base64");
  return { algorithm: "pbkdf2-sha256", iterations: 310000, salt, hash };
}

function verifyPassword(password, record) {
  if (!record || record.algorithm !== "pbkdf2-sha256") return false;
  const expected = Buffer.from(record.hash, "base64");
  const actual = crypto
    .pbkdf2Sync(password, record.salt, record.iterations, expected.length, "sha256");
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

function hashSessionToken(token) {
  return crypto.createHash("sha256").update(token).digest("base64");
}

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

  let store;
  if (fs.existsSync(STORE_PATH)) {
    store = JSON.parse(fs.readFileSync(STORE_PATH, "utf8"));
    store.users = Array.isArray(store.users) ? store.users : [];
    store.sessions = Array.isArray(store.sessions) ? store.sessions : [];
    store.messages = Array.isArray(store.messages) ? store.messages : [];
    store.materials = Array.isArray(store.materials) ? store.materials : [];
    store.lessons = Array.isArray(store.lessons) ? store.lessons : [];
    store.assignments = Array.isArray(store.assignments) ? store.assignments : [];
    store.assignmentDrafts = Array.isArray(store.assignmentDrafts) ? store.assignmentDrafts : [];
    store.announcements = Array.isArray(store.announcements) ? store.announcements : [];
    store.gradingMemory = Array.isArray(store.gradingMemory) ? store.gradingMemory : [];
    store.attendance = store.attendance && typeof store.attendance === "object" ? store.attendance : {};
    store.work = store.work && typeof store.work === "object" ? store.work : {};
  } else {
    store = { users: [], sessions: [], messages: [], materials: [], lessons: [], assignments: [], assignmentDrafts: [], announcements: [], gradingMemory: [], attendance: {}, work: {} };
  }

  let dirty = false;
  const beforeLegacyCleanup = store.users.length;
  store.users = store.users.filter(
    (user) =>
      !LEGACY_DEMO_STUDENT_IDS.has(user.id) &&
      !LEGACY_DEMO_STUDENT_EMAILS.has(user.email) &&
      !LEGACY_DEMO_PARENT_IDS.has(user.id) &&
      !LEGACY_DEMO_PARENT_EMAILS.has(user.email) &&
      !LEGACY_DEMO_TEACHER_IDS.has(user.id) &&
      !LEGACY_DEMO_TEACHER_EMAILS.has(user.email),
  );
  if (store.users.length !== beforeLegacyCleanup) {
    const validUserIds = new Set(store.users.map((user) => user.id));
    store.sessions = store.sessions.filter((session) => validUserIds.has(session.userId));
    store.messages = store.messages.filter((conversation) =>
      Array.isArray(conversation.participantIds) &&
      conversation.participantIds.every((userId) => validUserIds.has(userId)),
    );
    store.materials = store.materials.filter((material) => !material.teacherId || validUserIds.has(material.teacherId));
    store.lessons = store.lessons.filter((lesson) => !lesson.teacherId || validUserIds.has(lesson.teacherId));
    store.assignments = store.assignments.filter((assignment) => !assignment.teacherId || validUserIds.has(assignment.teacherId));
    store.assignmentDrafts = store.assignmentDrafts.filter((draft) => !draft.teacherId || validUserIds.has(draft.teacherId));
    store.announcements = store.announcements.filter((announcement) => !announcement.teacherId || validUserIds.has(announcement.teacherId));
    store.gradingMemory = store.gradingMemory.filter((memory) =>
      (!memory.teacherId || validUserIds.has(memory.teacherId)) &&
      (!memory.studentId || validUserIds.has(memory.studentId)),
    );
    for (const records of Object.values(store.attendance)) {
      for (const studentId of Object.keys(records || {})) {
        if (!validUserIds.has(studentId)) delete records[studentId];
      }
    }
    for (const userId of Object.keys(store.work)) {
      if (!validUserIds.has(userId)) delete store.work[userId];
    }
    dirty = true;
  }

  for (const seed of SEED_USERS) {
    const existing = store.users.find((user) => user.email === seed.email);
    if (existing) {
      existing.name = seed.name;
      existing.role = seed.role;
      existing.context = seed.context;
      dirty = true;
    } else {
      store.users.push({
        id: seed.id,
        email: seed.email,
        name: seed.name,
        role: seed.role,
        context: seed.context,
        password: createPasswordRecord(seed.password),
        createdAt: new Date().toISOString(),
      });
      dirty = true;
    }
  }

  const now = Date.now();
  const sessions = store.sessions.filter((session) => Date.parse(session.expiresAt) > now);
  if (sessions.length !== store.sessions.length) {
    store.sessions = sessions;
    dirty = true;
  }

  const validUserIds = new Set(store.users.map((user) => user.id));
  const validStudentIds = new Set(store.users.filter((user) => user.role === "student").map((user) => user.id));
  const materials = store.materials.filter(
    (material) =>
      material &&
      typeof material === "object" &&
      material.id &&
      material.title &&
      (!material.teacherId || validUserIds.has(material.teacherId)),
  );
  if (materials.length !== store.materials.length) {
    store.materials = materials;
    dirty = true;
  }
  const lessons = store.lessons.filter((lesson) => lesson && typeof lesson === "object" && lesson.id && lesson.title);
  if (lessons.length !== store.lessons.length) {
    store.lessons = lessons;
    dirty = true;
  }
  const assignments = store.assignments.filter(
    (assignment) =>
      assignment &&
      typeof assignment === "object" &&
      assignment.id &&
      assignment.title &&
      Array.isArray(assignment.questions),
  );
  if (assignments.length !== store.assignments.length) {
    store.assignments = assignments;
    dirty = true;
  }
  const assignmentDrafts = store.assignmentDrafts.filter(
    (draft) =>
      draft &&
      typeof draft === "object" &&
      draft.id &&
      draft.title &&
      (!draft.teacherId || validUserIds.has(draft.teacherId)) &&
      Array.isArray(draft.questions),
  );
  if (assignmentDrafts.length !== store.assignmentDrafts.length) {
    store.assignmentDrafts = assignmentDrafts;
    dirty = true;
  }
  const announcements = store.announcements.filter(
    (announcement) =>
      announcement &&
      typeof announcement === "object" &&
      announcement.id &&
      announcement.title &&
      announcement.message &&
      (!announcement.teacherId || validUserIds.has(announcement.teacherId)),
  );
  if (announcements.length !== store.announcements.length) {
    store.announcements = announcements;
    dirty = true;
  }
  for (const user of store.users) {
    if (user.role === "parent" && user.linkedStudentId && !validStudentIds.has(user.linkedStudentId)) {
      delete user.linkedStudentId;
      dirty = true;
    }
    if (user.role === "teacher") {
      const legacyRoster = Array.isArray(user.classStudentIds)
        ? [...new Set(user.classStudentIds.filter((studentId) => validStudentIds.has(studentId)))]
        : [];
      let classes = Array.isArray(user.classes) ? user.classes : [];
      if (!classes.length && legacyRoster.length) {
        classes = [{
          id: crypto.randomUUID(),
          name: "Grade 7 Math",
          studentIds: legacyRoster,
        }];
      }
      classes = classes
        .filter((classItem) => classItem && typeof classItem === "object")
        .map((classItem) => ({
          id: String(classItem.id || crypto.randomUUID()),
          name: String(classItem.name || "Math class").trim().replace(/\s+/g, " ") || "Math class",
          studentIds: Array.isArray(classItem.studentIds)
            ? [...new Set(classItem.studentIds.filter((studentId) => validStudentIds.has(studentId)))]
            : [],
        }));
      const roster = [...new Set(classes.flatMap((classItem) => classItem.studentIds))];
      if (JSON.stringify(user.classes || []) !== JSON.stringify(classes)) {
        user.classes = classes;
        dirty = true;
      }
      if (JSON.stringify(user.classStudentIds || []) !== JSON.stringify(roster)) {
        user.classStudentIds = roster;
        dirty = true;
      }
      const context = classes.length
        ? `${classes.length} class${classes.length === 1 ? "" : "es"}`
        : "No classes assigned";
      if (user.context !== context) {
        user.context = context;
        dirty = true;
      }
    }
  }
  for (const userId of Object.keys(store.work)) {
    if (!validStudentIds.has(userId)) {
      delete store.work[userId];
      dirty = true;
    }
  }
  for (const date of Object.keys(store.attendance)) {
    const records = store.attendance[date];
    if (!records || typeof records !== "object") {
      delete store.attendance[date];
      dirty = true;
      continue;
    }
    for (const studentId of Object.keys(records)) {
      if (!validStudentIds.has(studentId)) {
        delete records[studentId];
        dirty = true;
      }
    }
  }
  const messages = store.messages.filter((conversation) =>
    Array.isArray(conversation.participantIds) &&
    conversation.participantIds.length === 2 &&
    conversation.participantIds.every((userId) => validUserIds.has(userId)) &&
    Array.isArray(conversation.entries),
  );
  if (messages.length !== store.messages.length) {
    store.messages = messages;
    dirty = true;
  }

  if (dirty || !fs.existsSync(STORE_PATH)) saveStore(store);
  return store;
}

function saveStore(store) {
  fs.writeFileSync(STORE_PATH, `${JSON.stringify(store, null, 2)}\n`);
}

function publicClass(classItem) {
  return {
    id: classItem.id,
    name: classItem.name,
    studentIds: Array.isArray(classItem.studentIds) ? classItem.studentIds : [],
  };
}

function publicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    context: user.context,
    linkedStudentId: user.linkedStudentId || "",
    classStudentIds: Array.isArray(user.classStudentIds) ? user.classStudentIds : [],
    classes: Array.isArray(user.classes) ? user.classes.map(publicClass) : [],
  };
}

function directoryUsersForUser(store, viewer) {
  if (viewer.role === "teacher") return store.users;
  if (viewer.role === "parent") {
    return store.users.filter(
      (user) =>
        user.id === viewer.id ||
        user.role === "teacher" ||
        (viewer.linkedStudentId && user.id === viewer.linkedStudentId),
    );
  }
  if (viewer.role === "student") {
    return store.users.filter(
      (user) =>
        user.id === viewer.id ||
        user.role === "teacher" ||
        (user.role === "parent" && user.linkedStudentId === viewer.id),
    );
  }
  return [viewer];
}

function teacherClassStudentIds(teacher, store) {
  const validStudentIds = new Set(store.users.filter((user) => user.role === "student").map((user) => user.id));
  const classes = Array.isArray(teacher?.classes) ? teacher.classes : [];
  if (classes.length) {
    return [
      ...new Set(
        classes.flatMap((classItem) =>
          Array.isArray(classItem.studentIds)
            ? classItem.studentIds.filter((studentId) => validStudentIds.has(studentId))
            : [],
        ),
      ),
    ];
  }
  return Array.isArray(teacher?.classStudentIds)
    ? [...new Set(teacher.classStudentIds.filter((studentId) => validStudentIds.has(studentId)))]
    : [];
}

function teacherClasses(teacher, store) {
  const validStudentIds = new Set(store.users.filter((user) => user.role === "student").map((user) => user.id));
  const classes = Array.isArray(teacher?.classes) ? teacher.classes : [];
  if (classes.length) {
    return classes.map((classItem) => ({
      id: classItem.id,
      name: classItem.name,
      studentIds: Array.isArray(classItem.studentIds)
        ? [...new Set(classItem.studentIds.filter((studentId) => validStudentIds.has(studentId)))]
        : [],
    }));
  }
  const legacy = Array.isArray(teacher?.classStudentIds)
    ? [...new Set(teacher.classStudentIds.filter((studentId) => validStudentIds.has(studentId)))]
    : [];
  return legacy.length ? [{ id: "default-class", name: "Grade 7 Math", studentIds: legacy }] : [];
}

function teacherClassById(teacher, store, classId) {
  const classes = teacherClasses(teacher, store);
  return classes.find((classItem) => classItem.id === classId) || (!classId && classes.length === 1 ? classes[0] : null);
}

function classStudentsForTeacher(store, teacher) {
  const roster = teacherClassStudentIds(teacher, store);
  return store.users.filter((user) => user.role === "student" && roster.includes(user.id));
}

function userMap(store) {
  return new Map(store.users.map((user) => [user.id, user]));
}

function sameParticipants(left, right) {
  return left.length === right.length && left.every((id, index) => id === right[index]);
}

function conversationsForUser(store, user) {
  const users = userMap(store);
  return store.messages
    .filter(
      (conversation) =>
        conversation.participantIds.includes(user.id) &&
        !(conversation.hiddenFor || []).includes(user.id),
    )
    .sort((a, b) => Date.parse(b.updatedAt || b.createdAt || 0) - Date.parse(a.updatedAt || a.createdAt || 0))
    .map((conversation) => publicConversation(conversation, user, users));
}

function addConversationMessage(store, senderId, recipientId, text, now = new Date().toISOString()) {
  const participantIds = [senderId, recipientId].sort();
  let conversation = store.messages.find((item) => sameParticipants(item.participantIds, participantIds));

  if (!conversation) {
    conversation = {
      id: crypto.randomUUID(),
      participantIds,
      hiddenFor: [],
      readBy: [],
      entries: [],
      createdAt: now,
      updatedAt: now,
    };
    store.messages.push(conversation);
  }

  conversation.entries.push({
    id: crypto.randomUUID(),
    fromUserId: senderId,
    text,
    createdAt: now,
  });
  conversation.updatedAt = now;
  conversation.hiddenFor = (conversation.hiddenFor || []).filter(
    (userId) => userId !== senderId && userId !== recipientId,
  );
  const readBy = new Set(conversation.readBy || []);
  readBy.add(senderId);
  readBy.delete(recipientId);
  conversation.readBy = [...readBy];
  return conversation;
}

function publicConversation(conversation, viewer, users) {
  const otherId = conversation.participantIds.find((userId) => userId !== viewer.id);
  const other = users.get(otherId);
  const otherName = other?.name || "Unknown user";
  const readBy = Array.isArray(conversation.readBy) ? conversation.readBy : [];

  return {
    id: conversation.id,
    sender: otherName,
    replyTo: otherName,
    recipientId: other?.id || otherId || "",
    recipientName: otherName,
    recipientRole: other?.role || "",
    subject: `Conversation with ${otherName}`,
    read: readBy.includes(viewer.id),
    updatedAt: conversation.updatedAt || conversation.createdAt,
    thread: conversation.entries.map((entry) => {
      const author = users.get(entry.fromUserId);
      return {
        id: entry.id,
        from: author?.name || "Unknown user",
        role: author?.role || "system",
        text: entry.text,
        createdAt: entry.createdAt,
        own: entry.fromUserId === viewer.id,
      };
    }),
  };
}

function publicWork(store, studentId) {
  const work = store.work[studentId] || { assignments: {} };
  return {
    studentId,
    assignments: work.assignments && typeof work.assignments === "object" ? work.assignments : {},
  };
}

function assignmentWorkFor(store, studentId, assignmentId) {
  const studentWork = store.work[studentId] || { assignments: {} };
  studentWork.assignments = studentWork.assignments && typeof studentWork.assignments === "object"
    ? studentWork.assignments
    : {};
  const assignmentWork = studentWork.assignments[assignmentId] || { steps: [] };
  assignmentWork.steps = Array.isArray(assignmentWork.steps) ? assignmentWork.steps : [];
  assignmentWork.answers = Array.isArray(assignmentWork.answers) ? assignmentWork.answers : [];
  assignmentWork.documents = Array.isArray(assignmentWork.documents) ? assignmentWork.documents : [];
  studentWork.assignments[assignmentId] = assignmentWork;
  store.work[studentId] = studentWork;
  return assignmentWork;
}

function hasWorkProof(assignmentWork) {
  return Boolean(assignmentWork?.drawing?.url || (Array.isArray(assignmentWork?.documents) && assignmentWork.documents.length));
}

function hasTypedAnswers(assignmentWork) {
  return Array.isArray(assignmentWork?.answers) && assignmentWork.answers.some((answer) =>
    Array.isArray(answer)
      ? answer.some((item) => String(item || "").trim())
      : String(answer || "").trim(),
  );
}

function hasSubmittableWork(assignmentWork) {
  return hasWorkProof(assignmentWork) || hasTypedAnswers(assignmentWork);
}

function assignmentQuestionPrompt(question) {
  if (!question) return "";
  if (typeof question === "string") return question;
  const choices = Array.isArray(question.choices) && question.choices.length
    ? ` Choices: ${question.choices.join(", ")}.`
    : "";
  return `${question.prompt || "Assignment question"}${choices}`;
}

function cleanAnswerKeyValue(value) {
  return cleanText(value).replace(/^\*+\s*/, "").replace(/^\[(?:x|correct)\]\s*/i, "").replace(/\s*\(correct\)$/i, "");
}

function markedChoiceValue(value) {
  const raw = cleanText(value);
  const leadingMarked = /^(?:\*|\[(?:x|correct)\]|\((?:x|correct)\))\s*/i.test(raw);
  const trailingMarked = /\s*\(correct\)$/i.test(raw);
  return {
    choice: cleanAnswerKeyValue(raw),
    correct: leadingMarked || trailingMarked,
  };
}

function publicAssignmentQuestion(question, includeAnswerKey = false) {
  if (!question || typeof question !== "object") return question;
  const publicQuestion = {
    type: question.type,
    prompt: question.prompt,
    choices: Array.isArray(question.choices) ? question.choices : [],
  };
  if (includeAnswerKey && Array.isArray(question.answerKey) && question.answerKey.length) {
    publicQuestion.answerKey = question.answerKey;
  }
  return publicQuestion;
}

function mathTutorSystemPrompt() {
  return [
    "You are MathBridge's local AI math tutor.",
    "Always read and use the exact selected assignment question before giving a hint or checking an answer.",
    "Begin by naming the question in a short phrase, then give help for that question only.",
    "If no selected question is provided, ask the student to choose a question first instead of guessing.",
    "If the student's message mentions a different problem than the selected question, ask them to switch to that question or paste it before helping.",
    "Help the student make progress on their assignment without doing the work from scratch for them.",
    "If the student has not made an attempt and asks for the answer, do not give the final answer; give a short hint and ask for their next step.",
    "If the student shares their own answer or attempt and it appears correct, say clearly that it looks correct and explain the quick check. Do not add vague doubt.",
    "If the student shares an incorrect attempt, point to the first step to recheck without giving a full worked solution.",
    "Keep the conversation going naturally. The student can ask follow-up questions.",
    "Use clear grade 7-9 math language.",
  ].join(" ");
}

function mathTutorUserPrompt(context) {
  return [
    `Assignment: ${context.assignmentTitle || "General math help"}`,
    `Topic: ${context.topic || "Math"}`,
    context.question
      ? `Selected question ${Number.isInteger(context.questionIndex) ? context.questionIndex + 1 : ""}: ${context.question}`
      : "Selected question: none provided",
    context.attempt ? `Current student attempt/answer: ${context.attempt}` : "Current student attempt/answer: not provided",
    "Use the selected question as the source of truth for the next student message.",
    "Do not answer a generic or different question if it does not match the selected question.",
    "If they are checking their own answer, compare it to the selected question and be direct about whether it looks correct.",
  ].filter(Boolean).join("\n");
}

function aiHelpHistoryFromValue(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => ({
      role: entry?.role === "assistant" ? "assistant" : "user",
      content: String(entry?.content || entry?.text || "").trim().slice(0, 900),
    }))
    .filter((entry) => entry.content)
    .slice(-8);
}

async function localAiChat(messages, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), LOCAL_AI_TIMEOUT_MS);
  try {
    const useOpenAiShape =
      process.env.MATHBRIDGE_AI_FORMAT === "openai" ||
      LOCAL_AI_URL.includes("/v1/chat/completions");
    const model = options.model || LOCAL_AI_MODEL;
    const body = useOpenAiShape
      ? { model, messages, temperature: options.temperature ?? 0.2, stream: false }
      : {
          model,
          messages,
          stream: false,
          options: { temperature: options.temperature ?? 0.2, num_predict: options.numPredict ?? 220 },
        };
    const response = await fetch(LOCAL_AI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!response.ok) throw apiError(response.status, "Local AI is not available.");
    const result = await response.json();
    const reply = useOpenAiShape
      ? result.choices?.[0]?.message?.content
      : result.message?.content || result.response;
    if (!reply || typeof reply !== "string") throw apiError(502, "Local AI returned an empty response.");
    return reply.trim().slice(0, options.maxLength ?? 1600);
  } finally {
    clearTimeout(timeout);
  }
}

async function localAiTutorReply(context) {
  if (!context.question) {
    return "Choose the assignment question you want help with first, then I can give a hint for that exact question.";
  }
  const history = aiHelpHistoryFromValue(context.history);
  return localAiChat([
    { role: "system", content: mathTutorSystemPrompt() },
    { role: "user", content: mathTutorUserPrompt(context) },
    ...history,
    { role: "user", content: context.message || "I need help getting started." },
  ]);
}

function keyedTutorReply(context) {
  if (!studentIsCheckingOwnWork(context)) return "";
  const keyed = keyedAnswerMatches({
    type: context.questionType || "text",
    answerKey: context.answerKey || [],
    studentAnswer: context.attempt || "",
  });
  if (keyed === null) return "";
  const questionRef = `For question ${Number.isInteger(context.questionIndex) ? context.questionIndex + 1 : ""}`;
  if (keyed) {
    return `${questionRef}, your answer matches the teacher's answer key. Before you submit, make sure your written work shows the step or reason that led to it.`;
  }
  return `${questionRef}, your answer does not match the teacher's answer key yet. I will not give the answer, but re-read the question and check the first operation or choice you made. What step can you try again?`;
}

function cleanExtractedText(value, limit = AI_TEXT_LIMIT) {
  return String(value || "")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, limit);
}

function uploadPathFromUrl(url) {
  const raw = String(url || "");
  if (!raw.startsWith("/uploads/")) return "";
  const fileName = path.basename(decodeURIComponent(raw.replace("/uploads/", "")));
  if (!fileName || fileName.includes("/") || fileName.includes("\\")) return "";
  const filePath = path.join(UPLOAD_DIR, fileName);
  return fs.existsSync(filePath) ? filePath : "";
}

function removeUploadedFile(url) {
  const filePath = uploadPathFromUrl(url);
  if (!filePath) return;
  try {
    fs.unlinkSync(filePath);
  } catch (error) {
    // Taking a lesson down should not fail just because an old upload is already gone.
  }
}

function decodeXmlText(value) {
  return String(value || "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&apos;/g, "'");
}

function decodePdfLiteral(value) {
  return String(value || "")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\n")
    .replace(/\\t/g, " ")
    .replace(/\\\(/g, "(")
    .replace(/\\\)/g, ")")
    .replace(/\\\\/g, "\\");
}

function extractPdfText(filePath) {
  try {
    const raw = fs.readFileSync(filePath).toString("latin1");
    const chunks = [];
    for (const match of raw.matchAll(/\(([^()]*(?:\\.[^()]*)*)\)\s*Tj/g)) {
      chunks.push(decodePdfLiteral(match[1]));
      if (chunks.join(" ").length > AI_TEXT_LIMIT) break;
    }
    for (const match of raw.matchAll(/\[((?:.|\n|\r)*?)\]\s*TJ/g)) {
      const parts = [...match[1].matchAll(/\(([^()]*(?:\\.[^()]*)*)\)/g)].map((part) => decodePdfLiteral(part[1]));
      if (parts.length) chunks.push(parts.join(""));
      if (chunks.join(" ").length > AI_TEXT_LIMIT) break;
    }
    return cleanExtractedText(chunks.join("\n"));
  } catch (error) {
    return "";
  }
}

function extractDocxText(filePath) {
  try {
    const xml = childProcess.execFileSync("unzip", ["-p", filePath, "word/document.xml"], {
      encoding: "utf8",
      maxBuffer: 2 * 1024 * 1024,
      timeout: 1500,
    });
    const text = xml
      .replace(/<w:tab\/>/g, " ")
      .replace(/<\/w:p>/g, "\n")
      .replace(/<[^>]+>/g, "");
    return cleanExtractedText(decodeXmlText(text));
  } catch (error) {
    return "";
  }
}

function textEvidenceFromFile(filePath, type = "", name = "") {
  try {
    const contentType = String(type || "").split(";")[0].trim().toLowerCase();
    const extension = path.extname(name || filePath).toLowerCase();
    if (!filePath) return { text: "", status: "File not found." };
    if (contentType.startsWith("text/") || extension === ".txt") {
      return { text: cleanExtractedText(fs.readFileSync(filePath, "utf8")), status: "Read text file." };
    }
    if (contentType === "application/pdf" || extension === ".pdf") {
      const text = extractPdfText(filePath);
      return { text, status: text ? "Read PDF text." : "PDF uploaded, but no readable embedded text was found." };
    }
    if (
      contentType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      extension === ".docx"
    ) {
      const text = extractDocxText(filePath);
      return { text, status: text ? "Read Word document text." : "Word document uploaded, but text could not be extracted." };
    }
    if (contentType.startsWith("image/") || [".png", ".jpg", ".jpeg", ".gif", ".webp", ".heic", ".heif"].includes(extension)) {
      return { text: "", status: "Image uploaded. A local vision model is needed to read handwriting or photos." };
    }
    return { text: "", status: "Uploaded file type is not text-readable by the local server." };
  } catch (error) {
    return { text: "", status: "Uploaded file could not be read by the local server." };
  }
}

async function imageEvidenceFromFile(filePath, attachment) {
  const model = LOCAL_AI_VISION_MODEL;
  if (!model) return null;
  const contentType = String(attachment?.type || "").toLowerCase();
  const extension = path.extname(attachment?.name || filePath).toLowerCase();
  const isImage = contentType.startsWith("image/") || [".png", ".jpg", ".jpeg", ".webp"].includes(extension);
  if (!isImage || !filePath) return null;
  const size = fs.statSync(filePath).size;
  if (size > 4 * 1024 * 1024) {
    return { text: "", status: "Image was too large for local AI reading." };
  }
  try {
    const image = fs.readFileSync(filePath).toString("base64");
    const text = await localAiChat(
      [{
        role: "user",
        content: [
          "Read this student's uploaded math work or drawing.",
          "Summarize only visible math steps, answers, diagrams, and any errors you can see.",
          "If handwriting is unclear, say what is unclear. Do not invent work that is not visible.",
        ].join(" "),
        images: [image],
      }],
      { model, temperature: 0.1, numPredict: 260, maxLength: 1200 },
    );
    return { text: cleanExtractedText(text, 1200), status: `Read image with ${model}.` };
  } catch (error) {
    return { text: "", status: "Image uploaded, but the local vision model could not read it." };
  }
}

async function evidenceForAttachment(attachment, label) {
  const filePath = uploadPathFromUrl(attachment?.url);
  const basic = textEvidenceFromFile(filePath, attachment?.type, attachment?.name);
  const vision = basic.text ? null : await imageEvidenceFromFile(filePath, attachment);
  const text = vision?.text || attachment?.aiText || basic.text || "";
  const status = vision?.status || attachment?.aiReadStatus || basic.status;
  return {
    label,
    name: attachment?.name || label,
    type: attachment?.type || "",
    size: attachment?.size || 0,
    text,
    status,
  };
}

async function uploadedEvidenceForWork(assignmentWork) {
  const evidence = [];
  if (assignmentWork?.drawing?.url) {
    evidence.push(await evidenceForAttachment(assignmentWork.drawing, "Student drawing"));
  }
  for (const [index, document] of (assignmentWork?.documents || []).slice(0, 4).entries()) {
    evidence.push(await evidenceForAttachment(document, `Uploaded document ${index + 1}`));
  }
  let budget = 10000;
  for (const item of evidence) {
    if (!item.text) continue;
    item.text = item.text.slice(0, Math.max(0, budget));
    budget -= item.text.length;
    if (budget <= 0) item.status = `${item.status} Additional upload text was trimmed for the local AI prompt.`;
  }
  return evidence;
}

function looksLikeFinalAnswer(reply) {
  return /\b(the answer is|final answer|answer\s*:|therefore the answer|so the answer)\b/i.test(reply) ||
    /\b[a-z]\s*=\s*-?\d+(?:\.\d+)?\b/i.test(reply);
}

function studentIsCheckingOwnWork(context) {
  return Boolean(context.attempt) || /\b(i got|my answer|is this|did i|get it right|correct|check)\b/i.test(context.message || "");
}

function normalizedAnswerText(answer) {
  if (Array.isArray(answer)) return answer.filter(Boolean).join(", ");
  return String(answer || "").trim();
}

function memoryAnswerSummary(assignment, assignmentWork) {
  const questions = Array.isArray(assignment?.questions) ? assignment.questions : [];
  const answers = Array.isArray(assignmentWork?.answers) ? assignmentWork.answers : [];
  return questions.slice(0, 8).map((question, index) => ({
    question: assignmentQuestionPrompt(question),
    studentAnswer: normalizedAnswerText(answers[index]) || "No typed answer",
  }));
}

function rememberTeacherGrade(store, teacher, student, assignment, assignmentWork, verified, grade, feedback, now) {
  store.gradingMemory = Array.isArray(store.gradingMemory) ? store.gradingMemory : [];
  const memory = {
    id: crypto.randomUUID(),
    teacherId: teacher.id,
    studentId: student.id,
    assignmentId: assignment?.id || "",
    assignmentTitle: assignment?.title || "Assignment",
    topic: assignment?.topic || "Math",
    requiredWork: assignment?.requiredWork || "",
    verified,
    grade: verified && Number.isFinite(grade) ? Math.round(grade * 10) / 10 : null,
    teacherFeedback: feedback || "",
    studentComment: assignmentWork?.studentComment || "",
    answers: memoryAnswerSummary(assignment, assignmentWork),
    uploadedWorkCount:
      (assignmentWork?.drawing?.url ? 1 : 0) +
      (Array.isArray(assignmentWork?.documents) ? assignmentWork.documents.length : 0),
    optionalAiFeedback: "",
    createdAt: now,
  };
  store.gradingMemory.push(memory);
  const teacherMemories = store.gradingMemory.filter((item) => item.teacherId === teacher.id);
  if (teacherMemories.length > 200) {
    const keepIds = new Set(
      teacherMemories
        .sort((a, b) => Date.parse(b.createdAt || 0) - Date.parse(a.createdAt || 0))
        .slice(0, 200)
        .map((item) => item.id),
    );
    store.gradingMemory = store.gradingMemory.filter((item) => item.teacherId !== teacher.id || keepIds.has(item.id));
  }
  return memory;
}

function storedGradeExamplesFromWork(store, teacher, currentAssignmentId, currentStudentId) {
  const assignmentsById = new Map(store.assignments.map((assignment) => [assignment.id, assignment]));
  const examples = [];
  for (const [studentId, studentWork] of Object.entries(store.work || {})) {
    const student = store.users.find((user) => user.id === studentId && user.role === "student");
    for (const [assignmentId, assignmentWork] of Object.entries(studentWork.assignments || {})) {
      const assignment = assignmentsById.get(assignmentId);
      if (!assignment || assignment.teacherId !== teacher.id) continue;
      if (assignment.id === currentAssignmentId && studentId === currentStudentId) continue;
      if (!assignmentWork.teacherFeedback && !Number.isFinite(Number(assignmentWork.grade))) continue;
      examples.push({
        assignmentTitle: assignment.title || "Assignment",
        topic: assignment.topic || "Math",
        grade: Number.isFinite(Number(assignmentWork.grade)) ? Number(assignmentWork.grade) : null,
        teacherFeedback: assignmentWork.teacherFeedback || "",
        studentName: student?.name || "Student",
        answers: memoryAnswerSummary(assignment, assignmentWork),
        createdAt: assignmentWork.gradeUpdatedAt || assignmentWork.verifiedAt || assignmentWork.updatedAt || "",
      });
    }
  }
  return examples;
}

function teacherGradeExamples(store, teacher, assignment, student) {
  const memoryExamples = (store.gradingMemory || [])
    .filter((item) =>
      item.teacherId === teacher.id &&
      !(item.assignmentId === assignment.id && item.studentId === student.id),
    )
    .map((item) => ({
      assignmentTitle: item.assignmentTitle,
      topic: item.topic,
      grade: item.grade,
      teacherFeedback: item.teacherFeedback,
      optionalAiFeedback: item.optionalAiFeedback || "",
      answers: item.answers || [],
      createdAt: item.createdAt || "",
    }));
  const examples = [...memoryExamples, ...storedGradeExamplesFromWork(store, teacher, assignment.id, student.id)];
  return examples
    .sort((a, b) => {
      const sameTopicA = a.topic === assignment.topic ? 1 : 0;
      const sameTopicB = b.topic === assignment.topic ? 1 : 0;
      if (sameTopicA !== sameTopicB) return sameTopicB - sameTopicA;
      return Date.parse(b.createdAt || 0) - Date.parse(a.createdAt || 0);
    })
    .slice(0, AI_HISTORY_LIMIT);
}

async function gradingSubmissionContext(store, teacher, assignment, assignmentWork, student) {
  const questions = Array.isArray(assignment?.questions) ? assignment.questions : [];
  const answers = Array.isArray(assignmentWork?.answers) ? assignmentWork.answers : [];
  const rows = questions.map((question, index) => {
    const normalized = normalizeAssignmentQuestion(question) || { prompt: assignmentQuestionPrompt(question), choices: [] };
    return {
      number: index + 1,
      question: assignmentQuestionPrompt(normalized),
      type: normalized.type || "text",
      answerKey: Array.isArray(normalized.answerKey) ? normalized.answerKey : [],
      studentAnswer: normalizedAnswerText(answers[index]) || "No typed answer",
    };
  });
  const uploadEvidence = await uploadedEvidenceForWork(assignmentWork);
  return {
    studentName: student?.name || "Student",
    assignmentTitle: assignment?.title || "Assignment",
    topic: assignment?.topic || "Math",
    requiredWork: assignment?.requiredWork || "",
    studentComment: assignmentWork?.studentComment || "",
    hasDrawing: Boolean(assignmentWork?.drawing?.url),
    documentCount: Array.isArray(assignmentWork?.documents) ? assignmentWork.documents.length : 0,
    uploadEvidence,
    gradeExamples: teacherGradeExamples(store, teacher, assignment, student),
    rows,
  };
}

function gradeSuggestionPrompt(context) {
  const uploadEvidence = (context.uploadEvidence || []).map((item) => {
    const header = `${item.label}: ${item.name}${item.type ? ` (${item.type})` : ""}`;
    return item.text
      ? `${header}\nReadable content:\n${item.text}`
      : `${header}\nStatus: ${item.status || "Uploaded, but no readable text was available."}`;
  });
  const gradeExamples = (context.gradeExamples || []).map((example, index) => [
    `Example ${index + 1}: ${example.assignmentTitle} (${example.topic})`,
    example.grade !== null && example.grade !== undefined ? `Teacher grade: ${example.grade}%` : "Teacher returned without a numeric grade",
    example.teacherFeedback ? `Teacher feedback: ${example.teacherFeedback}` : "",
    example.optionalAiFeedback ? `Teacher note to AI: ${example.optionalAiFeedback}` : "",
    (example.answers || []).length
      ? `Visible answers: ${(example.answers || []).map((answer) => `${answer.question} -> ${answer.studentAnswer}`).join(" | ")}`
      : "",
  ].filter(Boolean).join("\n"));
  return [
    `Assignment: ${context.assignmentTitle}`,
    `Topic: ${context.topic}`,
    context.requiredWork ? `Teacher required work: ${context.requiredWork}` : "",
    context.studentComment ? `Student comment: ${context.studentComment}` : "",
    context.hasDrawing || context.documentCount
      ? `Uploaded work exists. Drawing: ${context.hasDrawing ? "yes" : "no"}. Uploaded documents: ${context.documentCount}.`
      : "No uploaded written-work file was submitted.",
    uploadEvidence.length ? `Uploaded work evidence:\n${uploadEvidence.join("\n\n")}` : "",
    "Typed answers:",
    context.rows.length
      ? context.rows.map((row) => [
          `${row.number}. ${row.question}`,
          row.answerKey?.length ? `Teacher answer key: ${row.answerKey.join(", ")}` : "Teacher answer key: not provided",
          `Student answer: ${row.studentAnswer}`,
        ].join("\n")).join("\n")
      : "No teacher-made typed questions were included.",
    gradeExamples.length
      ? `Teacher grading history. Use this only to match the teacher's grading style and expectations; current assignment evidence controls the grade.\n${gradeExamples.join("\n\n")}`
      : "No previous teacher grading examples are available yet.",
    "Grade only what is visible in this prompt.",
    "Do not invent rubric requirements, Ontario curriculum criteria, estimation strategies, units, communication marks, or show-your-work penalties unless the assignment text explicitly asks for them.",
    "If you mention a missing strategy, unit, written step, communication detail, or rubric item, it must be directly required by the assignment text above.",
    "If a typed math answer appears correct, grade it as correct. Do not reduce a correct answer to 80% because of a missing strategy.",
    "When a teacher answer key is provided, use it as the main correctness source for the typed answer.",
    "For multiple choice and select-all, exact selected choices matching the answer key are correct; do not guess a different answer.",
    "If the visible student work is correct and you see no explicit error or missing required item, grade must be exactly 100. Do not use 97, 98, or 99 for work you describe as correct.",
    "You may use readable uploaded work evidence when it is included above. If an upload status says it was not readable, do not pretend to inspect it.",
    "Use a simple evidence-based score from visible typed answers and readable uploaded work. If correctness cannot be judged from the visible evidence, use null.",
    "Return strict JSON only with keys: grade, feedback, rationale.",
    "grade must be a number from 0 to 100, or null if there is not enough typed evidence.",
    "feedback must be one short teacher-facing comment that the teacher can edit before returning work.",
  ].filter(Boolean).join("\n");
}

function parseGradeSuggestion(text) {
  const match = String(text || "").match(/\{[\s\S]*\}/);
  if (!match) throw apiError(502, "Local AI did not return a grade suggestion.");
  const parsed = JSON.parse(match[0]);
  const grade = parsed.grade === null || parsed.grade === undefined || parsed.grade === ""
    ? null
    : Number(parsed.grade);
  return {
    grade: Number.isFinite(grade) && grade >= 0 && grade <= 100 ? Math.round(grade * 10) / 10 : null,
    feedback: String(parsed.feedback || "").trim().slice(0, 500),
    rationale: String(parsed.rationale || "").trim().slice(0, 500),
  };
}

function visibleGradeRequirementText(context) {
  return [
    context.assignmentTitle,
    context.topic,
    context.requiredWork,
    context.rows.map((row) => row.question).join(" "),
  ].filter(Boolean).join(" ").toLowerCase();
}

function suggestionUsesUnsupportedRequirement(context, suggestion) {
  const requirementText = visibleGradeRequirementText(context);
  const suggestionText = `${suggestion.feedback || ""} ${suggestion.rationale || ""}`.toLowerCase();
  const unsupportedTerms = [
    "estimation",
    "estimate",
    "strategy",
    "strategies",
    "communication",
    "communicate",
    "units",
    "unit labels",
    "show your work",
    "showed work",
    "show work",
    "written steps",
    "explain",
    "explanation",
  ];
  return unsupportedTerms.some((term) => suggestionText.includes(term) && !requirementText.includes(term));
}

function suggestionMeansFullCredit(suggestion) {
  const text = `${suggestion.feedback || ""} ${suggestion.rationale || ""}`.toLowerCase();
  if (/\b(incorrect|not correct|wrong|error|mistake|missing|incomplete|but|however|except|partial|minor issue|lost|deduct)\b/.test(text)) {
    return false;
  }
  return (
    /^\s*(correct|right|accurate|full credit|perfect)\s*[.!]?\s*$/i.test(suggestion.feedback || "") ||
    /\b(all|everything|visible answers?|student'?s answers?|student'?s work|work|answer|solution|calculation)\b.{0,30}\b(correct|accurate|right)\b/.test(text) ||
    /\bcorrect (answer|answers|calculation|solution|work)\b/.test(text) ||
    /\b(no errors|full credit|perfect score|completely correct|fully correct)\b/.test(text)
  );
}

function normalizeFullCreditSuggestion(suggestion) {
  if (suggestion.grade !== null && suggestion.grade >= 95 && suggestion.grade < 100 && suggestionMeansFullCredit(suggestion)) {
    return {
      ...suggestion,
      grade: 100,
      rationale: suggestion.rationale
        ? `${suggestion.rationale} Full-credit normalization applied because the visible work was described as correct.`
        : "Full-credit normalization applied because the visible work was described as correct.",
    };
  }
  return suggestion;
}

function sanitizeGradeSuggestion(context, suggestion) {
  if (!suggestionUsesUnsupportedRequirement(context, suggestion)) return normalizeFullCreditSuggestion(suggestion);
  return {
    grade: null,
    feedback: "Local AI tried to use a grading requirement that was not in the assignment. Review the visible typed answers manually before returning the work.",
    rationale: "Unsupported grading criterion removed from the automatic suggestion.",
  };
}

function safeMathExpressionValue(expression, xValue = null) {
  let normalized = String(expression || "")
    .toLowerCase()
    .replace(/[−–—]/g, "-")
    .replace(/[×·]/g, "*")
    .replace(/÷/g, "/")
    .replace(/\^/g, "**")
    .replace(/\s+/g, "");
  normalized = normalized
    .replace(/(\d)(x)/g, "$1*$2")
    .replace(/(x)(\d)/g, "$1*$2")
    .replace(/(\))(x|\d)/g, "$1*$2")
    .replace(/(x|\d)(\()/g, "$1*$2");
  if (xValue === null && normalized.includes("x")) return null;
  if (!/^[0-9x+\-*/().]+$/.test(normalized)) return null;
  const expressionWithX = normalized.replace(/x/g, `(${Number(xValue)})`);
  if (!/^[0-9+\-*/().]+$/.test(expressionWithX)) return null;
  try {
    const value = Function(`"use strict"; return (${expressionWithX});`)();
    return Number.isFinite(value) ? value : null;
  } catch (error) {
    return null;
  }
}

function numericAnswerValue(answer) {
  if (Array.isArray(answer)) return null;
  const text = String(answer || "")
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\$/g, "")
    .replace(/%/g, "")
    .replace(/degrees?/g, "")
    .replace(/[.!]$/g, "")
    .trim();
  if (!text || text === "no typed answer") return null;
  const variableAnswer = text.match(/\b[a-z]\s*=\s*(-?\d+(?:\.\d+)?)(?:\s|$)/);
  if (variableAnswer) return Number(variableAnswer[1]);
  const mixed = text.match(/^(-?\d+)\s+(\d+)\s*\/\s*(\d+)$/);
  if (mixed && Number(mixed[3]) !== 0) {
    return Number(mixed[1]) + Math.sign(Number(mixed[1]) || 1) * Number(mixed[2]) / Number(mixed[3]);
  }
  const fraction = text.match(/^(-?\d+)\s*\/\s*(-?\d+)$/);
  if (fraction && Number(fraction[2]) !== 0) return Number(fraction[1]) / Number(fraction[2]);
  const number = text.match(/^-?\d+(?:\.\d+)?(?:\s*[a-z/]+)?$/);
  return number ? Number(text.match(/-?\d+(?:\.\d+)?/)?.[0]) : null;
}

function cleanQuestionForGrading(question) {
  return String(question || "")
    .split(/\s+Choices:/i)[0]
    .replace(/[?]/g, "")
    .trim();
}

function equationAnswerValue(question) {
  const text = cleanQuestionForGrading(question).toLowerCase();
  const equationMatch = text.match(/([0-9x+\-*/^().\s×÷−–—]+=[0-9x+\-*/^().\s×÷−–—]+)/i);
  if (!equationMatch || !equationMatch[1].includes("x")) return null;
  const [left, right] = equationMatch[1].split("=");
  const leftAt0 = safeMathExpressionValue(left, 0);
  const leftAt1 = safeMathExpressionValue(left, 1);
  const rightAt0 = safeMathExpressionValue(right, 0);
  const rightAt1 = safeMathExpressionValue(right, 1);
  if ([leftAt0, leftAt1, rightAt0, rightAt1].some((value) => value === null)) return null;
  const coefficient = (leftAt1 - leftAt0) - (rightAt1 - rightAt0);
  const constant = rightAt0 - leftAt0;
  if (Math.abs(coefficient) < 1e-9) return null;
  return constant / coefficient;
}

function arithmeticAnswerValue(question) {
  const text = cleanQuestionForGrading(question).toLowerCase();
  const percentMatch = text.match(/(?:find\s+)?(-?\d+(?:\.\d+)?)\s*%\s+of\s+(-?\d+(?:\.\d+)?)/);
  if (percentMatch) return Number(percentMatch[1]) * Number(percentMatch[2]) / 100;
  const directMatch = text.match(/(?:what is|evaluate|calculate|find)\s+([0-9+\-*/^().\s×÷−–—]+)/i);
  const expression = directMatch?.[1] || text.match(/([0-9][0-9+\-*/^().\s×÷−–—]+[0-9])/i)?.[1];
  return expression ? safeMathExpressionValue(expression) : null;
}

function expectedNumericAnswer(question) {
  return equationAnswerValue(question) ?? arithmeticAnswerValue(question);
}

function numericAnswersMatch(actual, expected) {
  return Math.abs(actual - expected) <= Math.max(0.01, Math.abs(expected) * 0.005);
}

function normalizeGradingAnswer(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[−–—]/g, "-")
    .replace(/\s+/g, "")
    .replace(/\*/g, "")
    .replace(/×/g, "x")
    .replace(/\$/g, "")
    .replace(/,/g, "")
    .replace(/%/g, "percent")
    .replace(/degrees?/g, "");
}

function keyedAnswerMatches(row) {
  const answerKey = Array.isArray(row.answerKey) ? row.answerKey.filter(Boolean) : [];
  if (!answerKey.length) return null;
  if (row.studentAnswer === "No typed answer") return false;
  const expected = new Set(answerKey.map(normalizeGradingAnswer));
  if (row.type === "select-all") {
    const selected = String(row.studentAnswer || "")
      .split(",")
      .map(normalizeGradingAnswer)
      .filter(Boolean);
    return selected.length === expected.size && selected.every((choice) => expected.has(choice));
  }
  const actual = normalizeGradingAnswer(row.studentAnswer);
  if (expected.has(actual)) return true;
  const actualNumber = numericAnswerValue(row.studentAnswer);
  return answerKey.some((expectedAnswer) => {
    const expectedNumber = numericAnswerValue(expectedAnswer);
    return actualNumber !== null && expectedNumber !== null && numericAnswersMatch(actualNumber, expectedNumber);
  });
}

function deterministicGradeSuggestion(context) {
  if (!context.rows.length) return null;
  const needsWrittenReview = /(show work|written|steps|upload)/i.test(context.requiredWork || "");
  const hasReadableUploads = (context.uploadEvidence || []).some((item) => item.text);
  const allRowsHaveAnswerKeys = context.rows.every((row) => Array.isArray(row.answerKey) && row.answerKey.length);
  if ((needsWrittenReview || hasReadableUploads) && !allRowsHaveAnswerKeys) return null;
  const checked = [];
  for (const row of context.rows) {
    if (row.studentAnswer === "No typed answer") {
      checked.push({ correct: false });
      continue;
    }
    const keyed = keyedAnswerMatches(row);
    if (keyed !== null) {
      checked.push({ correct: keyed });
      continue;
    }
    const expected = expectedNumericAnswer(row.question);
    if (expected === null) return null;
    const actual = numericAnswerValue(row.studentAnswer);
    if (actual === null) return null;
    checked.push({ correct: numericAnswersMatch(actual, expected) });
  }
  const correct = checked.filter((row) => row.correct).length;
  const total = checked.length;
  const grade = Math.round((correct / total) * 1000) / 10;
  return {
    grade,
    feedback: correct === total
      ? `Correct visible typed answers (${correct}/${total}). Review any uploaded written work manually before returning.`
      : `${correct}/${total} visible typed answers appear correct. Review the missed item and any uploaded written work before returning.`,
    rationale: "Checked straightforward numeric or one-variable equation answers directly, without adding extra rubric criteria.",
  };
}

async function localAiGradeSuggestion(context) {
  const reply = await localAiChat(
    [
      {
        role: "system",
        content: "You are MathBridge's local AI grading assistant. Suggest grades only from visible evidence. Do not invent missing criteria. The teacher is the final grader.",
      },
      { role: "user", content: gradeSuggestionPrompt(context) },
    ],
    { temperature: 0.1, numPredict: 320, maxLength: 2200 },
  );
  return sanitizeGradeSuggestion(context, parseGradeSuggestion(reply));
}

function guidedGradeSuggestion(context) {
  const answered = context.rows.filter((row) => row.studentAnswer && row.studentAnswer !== "No typed answer").length;
  const total = context.rows.length;
  const readableUploads = (context.uploadEvidence || []).filter((item) => item.text).length;
  if (!total && (context.hasDrawing || context.documentCount)) {
    return {
      grade: null,
      feedback: readableUploads
        ? "Uploaded work was read, but MathBridge could not judge a reliable percentage automatically. Review the evidence, then enter the grade."
        : "Uploaded work exists, but it was not readable by the local text AI. Review the drawing or document, then enter the grade.",
      rationale: readableUploads
        ? "Readable upload evidence was available, but automatic grading failed."
        : "No typed answers or readable upload text were available to grade automatically.",
    };
  }
  if (!total) {
    return {
      grade: null,
      feedback: "No typed answers were available. Review the submitted work manually before grading.",
      rationale: "There is not enough evidence for a numeric suggestion.",
    };
  }
  return {
    grade: null,
    feedback: `Local AI could not judge correctness. ${answered}/${total} typed answers are present; review accuracy manually before returning the work.`,
    rationale: "Fallback mode no longer assigns percentages from completion alone.",
  };
}

function guidedTutorFallback(context) {
  const text = `${context.question || ""} ${context.message || ""}`.toLowerCase();
  const questionRef = context.question ? `For question ${Number.isInteger(context.questionIndex) ? context.questionIndex + 1 : ""}: ${context.question}` : "For the selected question";
  const opening = `${questionRef}. I can help, but I will not give the final answer yet.`;
  if (/[a-z]\s*=|solve|equation|algebra|x/.test(text)) {
    return `${opening} First, find the operation that is farthest from the variable and undo that on both sides. What equation do you get after that first move?`;
  }
  if (/percent|hst|tax|discount|interest|budget|money|\$/.test(text)) {
    return `${opening} Write down the starting amount, then decide which percent change happens first. What multiplier would you use for that first percent step?`;
  }
  if (/area|volume|triangle|circle|cylinder|cone|pyramid|pythagorean|hypotenuse|metre|meter|cm/.test(text)) {
    return `${opening} Start by choosing the formula and substituting only the known values. Which formula matches this shape or triangle?`;
  }
  if (/ratio|rate|fraction|decimal/.test(text)) {
    return `${opening} Convert the information into one consistent form first. What ratio, fraction, or equation represents the situation before you calculate?`;
  }
  if (/graph|slope|linear|relation/.test(text)) {
    return `${opening} Identify the pattern or rate of change first. What changes by the same amount each step, and where would that show up in the rule or graph?`;
  }
  if (context.attempt) {
    return `I see your attempt. If your steps keep the equation balanced and your answer checks when substituted into the original question, that is a strong sign it is correct. What do you get when you plug your answer back in?`;
  }
  return `${opening} Tell me what you tried first. Then circle the unknown and write one equation or expression that matches the question. What is your first step?`;
}

function resetWorkVerification(assignmentWork) {
  delete assignmentWork.submittedAt;
  delete assignmentWork.verifiedAt;
  delete assignmentWork.verifiedBy;
  delete assignmentWork.teacherFeedback;
  delete assignmentWork.grade;
  delete assignmentWork.gradeUpdatedAt;
  assignmentWork.verificationStatus = "draft";
}

function localNetworkUrls() {
  const urls = [];
  for (const entries of Object.values(os.networkInterfaces())) {
    for (const entry of entries || []) {
      if (!["IPv4", 4].includes(entry.family) || entry.internal) continue;
      urls.push(`http://${entry.address}:${PORT}`);
    }
  }
  return urls;
}

function isAllowedWorkDocument(file) {
  const contentType = String(file.contentType || "").split(";")[0].trim().toLowerCase();
  const extension = path.extname(file.filename || "").toLowerCase();
  return contentType.startsWith("image/") || WORK_DOCUMENT_TYPES.has(contentType) || WORK_DOCUMENT_EXTENSIONS.has(extension);
}

function isVideoFile(file) {
  const contentType = String(file?.contentType || "").split(";")[0].trim().toLowerCase();
  const extension = path.extname(file?.filename || "").toLowerCase();
  return contentType.startsWith("video/") || [".m4v", ".mov", ".mp4", ".ogg", ".ogv", ".webm"].includes(extension);
}

function normalizeMaterialKind(value, file) {
  const kind = String(value || "").trim();
  if (MATERIAL_KINDS.has(kind)) return kind;
  if (isVideoFile(file)) return "lesson-video";
  return "worksheet";
}

function isAllowedMaterialFile(kind, file) {
  if (kind === "lesson-video") return isVideoFile(file);
  return isAllowedWorkDocument(file);
}

function materialIdsFromValue(value) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  const text = String(value || "").trim();
  if (!text) return [];
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
  } catch (error) {
    // Fall through to comma parsing.
  }
  return text.split(",").map((item) => item.trim()).filter(Boolean);
}

function assignmentQuestionsFromValue(value) {
  if (Array.isArray(value)) return value.map(normalizeAssignmentQuestion).filter(Boolean).slice(0, 60);
  const text = String(value || "").trim();
  if (!text) return [];
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed.map(normalizeAssignmentQuestion).filter(Boolean).slice(0, 60);
  } catch (error) {
    // Fall through to one-question-per-line parsing.
  }
  return text.split(/\r?\n/).map(normalizeAssignmentQuestion).filter(Boolean).slice(0, 60);
}

function normalizeAssignmentQuestion(question) {
  if (question && typeof question === "object") {
    const type = ["multiple-choice", "select-all", "text"].includes(question.type) ? question.type : "text";
    const prompt = cleanText(question.prompt || question.q || question.text);
    if (!prompt) return null;
    const markedChoices = Array.isArray(question.choices)
      ? question.choices.map(markedChoiceValue).filter((item) => item.choice).slice(0, 8)
      : [];
    const choices = markedChoices.map((item) => item.choice);
    const markedAnswers = markedChoices.filter((item) => item.correct).map((item) => item.choice);
    const explicitAnswers = Array.isArray(question.answerKey)
      ? question.answerKey.map(cleanAnswerKeyValue).filter(Boolean).slice(0, 12)
      : [];
    return {
      type: type === "text" || choices.length >= 2 ? type : "text",
      prompt,
      choices: type === "text" ? [] : choices,
      answerKey: [...new Set([...explicitAnswers, ...markedAnswers])],
    };
  }

  const line = cleanText(question);
  if (!line) return null;
  const answerMatch = line.match(/^ANS(?:WER)?\s*:\s*(.+)$/i);
  if (answerMatch) {
    const parts = answerMatch[1].split("|").map(cleanAnswerKeyValue).filter(Boolean);
    const prompt = parts.shift() || "";
    return prompt
      ? { type: "text", prompt, choices: [], answerKey: [...new Set(parts)].slice(0, 12) }
      : null;
  }
  const modeMatch = line.match(/^(MC|MULTIPLE CHOICE|ALL|SELECT ALL):\s*(.+)$/i);
  if (!modeMatch) return { type: "text", prompt: line, choices: [] };

  const type = /^(ALL|SELECT ALL)$/i.test(modeMatch[1]) ? "select-all" : "multiple-choice";
  const parts = modeMatch[2].split("|").map((part) => cleanText(part)).filter(Boolean);
  const prompt = parts.shift() || "";
  const markedChoices = parts.map(markedChoiceValue).filter((item) => item.choice).slice(0, 8);
  const choices = markedChoices.map((item) => item.choice);
  const answerKey = markedChoices.filter((item) => item.correct).map((item) => item.choice);
  return prompt && parts.length >= 2
    ? { type, prompt, choices, answerKey: [...new Set(answerKey)].slice(0, 12) }
    : { type: "text", prompt: line, choices: [] };
}

function booleanFromValue(value) {
  return value === true || value === "true" || value === "1" || value === "on";
}

function hasOwnValue(object, key) {
  return Object.prototype.hasOwnProperty.call(object || {}, key);
}

function assignmentStepsFromOptions(body, questions, uploadWork, hasLessonVideo) {
  const requireBridgeSpace = hasOwnValue(body, "bridgeSpace")
    ? booleanFromValue(body.bridgeSpace)
    : false;
  const requireWatchLesson = hasOwnValue(body, "requireWatchLesson")
    ? booleanFromValue(body.requireWatchLesson)
    : hasLessonVideo;
  const requireReadNotes = hasOwnValue(body, "requireReadNotes")
    ? booleanFromValue(body.requireReadNotes)
    : true;
  const requireCompleteQuestions = hasOwnValue(body, "requireCompleteQuestions")
    ? booleanFromValue(body.requireCompleteQuestions)
    : true;
  const requireSubmitFinal = hasOwnValue(body, "requireSubmitFinal")
    ? booleanFromValue(body.requireSubmitFinal)
    : true;

  const steps = [
    requireWatchLesson ? "Watch the lesson" : "",
    requireReadNotes ? "Read lesson notes" : "",
    requireBridgeSpace
      ? bridgeSpaceQuestionStep(questions.length)
      : requireCompleteQuestions
        ? `Complete ${questions.length} teacher-made question${questions.length === 1 ? "" : "s"}`
        : "",
    uploadWork ? "Upload written work" : "",
    requireSubmitFinal ? "Submit final answers" : "",
  ].filter(Boolean);

  return steps.length ? steps : [`Complete ${questions.length} teacher-made question${questions.length === 1 ? "" : "s"}`];
}

function bridgeSpaceQuestionStep(questionCount) {
  const count = Number(questionCount) || 0;
  return count
    ? `Complete ${count} question${count === 1 ? "" : "s"} in BridgeSpace`
    : "Complete questions in BridgeSpace";
}

function publicAssignmentSteps(assignment) {
  const steps = Array.isArray(assignment.steps) ? assignment.steps : [];
  if (!assignment.bridgeSpace) return steps;
  const bridgeStep = bridgeSpaceQuestionStep(Array.isArray(assignment.questions) ? assignment.questions.length : 0);
  let inserted = false;
  const normalized = [];
  for (const step of steps) {
    const label = String(step || "");
    const isOldQuestionStep = /^Complete \d+ teacher-made questions?$/.test(label);
    const isOldBridgeStep = label === "Use BridgeSpace workspace";
    const isBridgeQuestionStep = /in BridgeSpace$/.test(label);
    if (isOldQuestionStep || isOldBridgeStep || isBridgeQuestionStep) {
      if (!inserted) {
        normalized.push(bridgeStep);
        inserted = true;
      }
      continue;
    }
    normalized.push(step);
  }
  if (!inserted) {
    const uploadIndex = normalized.findIndex((step) => /upload|written work/i.test(String(step || "")));
    if (uploadIndex === -1) normalized.push(bridgeStep);
    else normalized.splice(uploadIndex, 0, bridgeStep);
  }
  return normalized;
}

function publicLesson(lesson, store, viewer = null) {
  const teacher = store.users.find((user) => user.id === lesson.teacherId);
  return {
    id: lesson.id,
    title: lesson.title,
    goal: lesson.goal,
    explanation: lesson.explanation,
    example: lesson.example,
    videoUrl: lesson.videoUrl || "",
    videoLink: lesson.videoLink || "",
    videoName: lesson.videoName || "",
    videoType: lesson.videoType || "",
    teacherName: teacher?.name || lesson.teacherName || "Teacher",
    createdAt: lesson.createdAt,
    canTakeDown: Boolean(viewer?.role === "teacher" && lesson.teacherId === viewer.id),
  };
}

function publicLessons(store, viewer = null) {
  return [...store.lessons]
    .sort((a, b) => Date.parse(b.createdAt || 0) - Date.parse(a.createdAt || 0))
    .map((lesson) => publicLesson(lesson, store, viewer));
}

function publicMaterial(material, store) {
  const teacher = store.users.find((user) => user.id === material.teacherId);
  return {
    id: material.id,
    title: material.title,
    kind: material.kind || "worksheet",
    url: material.url || "",
    link: material.link || "",
    name: material.name || "",
    type: material.type || "",
    size: Number(material.size) || 0,
    teacherName: teacher?.name || material.teacherName || "Teacher",
    createdAt: material.createdAt,
  };
}

function publicMaterialsForUser(store, user) {
  if (user.role !== "teacher") return [];
  return [...store.materials]
    .filter((material) => material.teacherId === user.id)
    .sort((a, b) => Date.parse(b.createdAt || 0) - Date.parse(a.createdAt || 0))
    .map((material) => publicMaterial(material, store));
}

function assignmentResourceFromMaterial(material) {
  return {
    id: material.id,
    title: material.title,
    kind: material.kind || "worksheet",
    url: material.url || "",
    link: material.link || "",
    name: material.name || "",
    type: material.type || "",
    size: Number(material.size) || 0,
  };
}

function removeMaterialFromAssignments(store, teacherId, material) {
  const materialUrls = [material.url, material.link].filter(Boolean);
  for (const assignment of [...store.assignments, ...store.assignmentDrafts]) {
    if (assignment.teacherId !== teacherId) continue;
    assignment.resources = (Array.isArray(assignment.resources) ? assignment.resources : [])
      .filter((resource) => resource.id !== material.id);
    assignment.materialIds = (Array.isArray(assignment.materialIds) ? assignment.materialIds : [])
      .filter((materialId) => materialId !== material.id);
    if (materialUrls.includes(assignment.videoUrl) || materialUrls.includes(assignment.videoLink)) {
      assignment.videoUrl = "";
      assignment.videoLink = "";
      assignment.videoName = "";
      assignment.videoType = "";
    }
    if (materialUrls.includes(assignment.pageUrl)) {
      assignment.pageUrl = "";
      assignment.pageName = "";
      assignment.pageType = "";
    }
  }
}

function isVideoResource(resource) {
  return resource.kind === "lesson-video" || String(resource.type || "").startsWith("video/");
}

function isImageResource(resource) {
  return String(resource.type || "").startsWith("image/");
}

function announcementStatus(announcement) {
  if (announcement.status === "scheduled" && Date.parse(announcement.scheduledAt || "") > Date.now()) return "scheduled";
  return "posted";
}

function publicAnnouncement(announcement, store) {
  const teacher = store.users.find((user) => user.id === announcement.teacherId);
  return {
    id: announcement.id,
    title: announcement.title,
    message: announcement.message,
    status: announcementStatus(announcement),
    scheduledAt: announcement.scheduledAt || "",
    postedAt: announcement.postedAt || "",
    teacherName: teacher?.name || announcement.teacherName || "Teacher",
    createdAt: announcement.createdAt,
  };
}

function publicAnnouncementsForUser(store, user) {
  return [...store.announcements]
    .filter((announcement) => {
      if (user.role === "teacher") return announcement.teacherId === user.id;
      return announcementStatus(announcement) === "posted";
    })
    .sort((a, b) => Date.parse(b.scheduledAt || b.postedAt || b.createdAt || 0) - Date.parse(a.scheduledAt || a.postedAt || a.createdAt || 0))
    .map((announcement) => publicAnnouncement(announcement, store));
}

function publicAssignment(assignment, store, viewer = null) {
  const teacher = store.users.find((user) => user.id === assignment.teacherId);
  const includeAnswerKey = Boolean(viewer?.role === "teacher" && viewer.id === assignment.teacherId);
  return {
    id: assignment.id,
    title: assignment.title,
    classId: assignment.classId || "",
    className: assignment.className,
    topic: assignment.topic,
    due: assignment.due,
    questions: (Array.isArray(assignment.questions) ? assignment.questions : [])
      .map((question) => publicAssignmentQuestion(question, includeAnswerKey)),
    requiredWork: assignment.requiredWork,
    steps: publicAssignmentSteps(assignment),
    uploadWork: Boolean(assignment.uploadWork),
    bridgeSpace: Boolean(assignment.bridgeSpace),
    videoUrl: assignment.videoUrl || "",
    videoLink: assignment.videoLink || "",
    videoName: assignment.videoName || "",
    videoType: assignment.videoType || "",
    pageUrl: assignment.pageUrl || "",
    pageName: assignment.pageName || "",
    pageType: assignment.pageType || "",
    resources: Array.isArray(assignment.resources) ? assignment.resources : [],
    assignedStudentIds: Array.isArray(assignment.assignedStudentIds) ? assignment.assignedStudentIds : [],
    teacherName: teacher?.name || assignment.teacherName || "Teacher",
    createdAt: assignment.createdAt,
  };
}

function publicAssignments(store) {
  return [...store.assignments]
    .sort((a, b) => Date.parse(b.createdAt || 0) - Date.parse(a.createdAt || 0))
    .map((assignment) => publicAssignment(assignment, store));
}

function assignmentVisibleToUser(assignment, user) {
  const assignedStudentIds = Array.isArray(assignment.assignedStudentIds) ? assignment.assignedStudentIds : [];
  if (user.role === "teacher") return assignment.teacherId === user.id;
  if (user.role === "student") return !assignedStudentIds.length || assignedStudentIds.includes(user.id);
  if (user.role === "parent" && user.linkedStudentId) {
    return !assignedStudentIds.length || assignedStudentIds.includes(user.linkedStudentId);
  }
  return false;
}

function publicAssignmentsForUser(store, user) {
  return [...store.assignments]
    .filter((assignment) => assignmentVisibleToUser(assignment, user))
    .sort((a, b) => Date.parse(b.createdAt || 0) - Date.parse(a.createdAt || 0))
    .map((assignment) => publicAssignment(assignment, store, user));
}

function publicAssignmentDraftsForUser(store, user) {
  if (user.role !== "teacher") return [];
  return [...store.assignmentDrafts]
    .filter((draft) => draft.teacherId === user.id)
    .sort((a, b) => Date.parse(b.updatedAt || b.createdAt || 0) - Date.parse(a.updatedAt || a.createdAt || 0))
    .map((draft) => ({
      ...publicAssignment(draft, store, user),
      assignedStudentIds: [],
      materialIds: Array.isArray(draft.materialIds) ? draft.materialIds : [],
      updatedAt: draft.updatedAt || draft.createdAt,
      status: "Draft",
    }));
}

function buildTeacherAssignmentPayload(store, teacher, body, pageFile, lessonVideoFile) {
  const requestedClassName = cleanText(body.className, "Math class");
  const rawClassId = String(body.classId || "").trim();
  const targetClass = teacherClassById(teacher, store, rawClassId);
  const topic = cleanText(body.topic, "Math assignment");
  const due = cleanText(body.due, new Date().toISOString().slice(0, 10));
  let questions = assignmentQuestionsFromValue(body.questions);
  const uploadWork = booleanFromValue(body.uploadWork);
  const bridgeSpace = booleanFromValue(body.bridgeSpace || body.mathspace || body.mathspaceEnabled);
  let videoLink = String(body.lessonVideoLink || body.videoLink || "").trim();
  const materialIds = materialIdsFromValue(body.materialIds);
  const selectedMaterials = materialIds
    .map((materialId) => store.materials.find((material) => material.id === materialId && material.teacherId === teacher.id))
    .filter(Boolean);
  const hasAttachment =
    selectedMaterials.length ||
    videoLink ||
    (pageFile && pageFile.data.length) ||
    (lessonVideoFile && lessonVideoFile.data.length);

  if (!questions.length && hasAttachment) {
    questions = [{ type: "text", prompt: "Complete the attached teacher material.", choices: [] }];
  }
  if (!questions.length) {
    throw apiError(400, "Write at least one question or attach a saved material before saving.");
  }

  let pageUrl = "";
  let pageName = "";
  let pageType = "";
  let videoUrl = "";
  let videoName = "";
  let videoType = "";
  const resources = selectedMaterials.map(assignmentResourceFromMaterial);
  const videoResource = resources.find(isVideoResource);
  if (videoResource) {
    videoUrl = videoResource.url || "";
    videoLink = videoResource.link || videoLink;
    videoName = videoResource.name || videoResource.title || "";
    videoType = videoResource.type || "";
  }
  const pageResource = resources.find((resource) => isImageResource(resource) && ["worksheet", "document"].includes(resource.kind));
  if (pageResource) {
    pageUrl = pageResource.url || "";
    pageName = pageResource.name || pageResource.title || "";
    pageType = pageResource.type || "";
  }
  if (lessonVideoFile && lessonVideoFile.data.length) {
    if (!String(lessonVideoFile.contentType || "").startsWith("video/")) {
      throw apiError(400, "Upload the lesson as a video file.");
    }
    const storedName = `${crypto.randomUUID()}-${safeUploadName(lessonVideoFile.filename, "assignment-lesson-video")}`;
    fs.writeFileSync(path.join(UPLOAD_DIR, storedName), lessonVideoFile.data);
    videoUrl = `/uploads/${storedName}`;
    videoName = lessonVideoFile.filename || "Lesson video";
    videoType = lessonVideoFile.contentType || "video/mp4";
  }
  if (pageFile && pageFile.data.length) {
    if (!String(pageFile.contentType || "").startsWith("image/")) {
      throw apiError(400, "Upload the assignment page as an image so students can draw on it.");
    }
    const storedName = `${crypto.randomUUID()}-${safeUploadName(pageFile.filename, "assignment-page")}`;
    fs.writeFileSync(path.join(UPLOAD_DIR, storedName), pageFile.data);
    pageUrl = `/uploads/${storedName}`;
    pageName = pageFile.filename || "Assignment page";
    pageType = pageFile.contentType || "image/png";
  }

  return {
    title: `${topic} assignment`,
    classId: targetClass?.id || rawClassId,
    className: targetClass?.name || requestedClassName,
    topic,
    due,
    questions,
    uploadWork,
    bridgeSpace,
    requiredWork: uploadWork ? "Show work for all questions" : "Final answers only",
    videoUrl,
    videoLink,
    videoName,
    videoType,
    pageUrl,
    pageName,
    pageType,
    resources,
    materialIds: selectedMaterials.map((material) => material.id),
    steps: assignmentStepsFromOptions(body, questions, uploadWork, Boolean(videoUrl || videoLink)),
  };
}

function normalizeDate(value) {
  const date = String(value || "").trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : new Date().toISOString().slice(0, 10);
}

function publicAttendanceRecord(store, date, student) {
  const record = store.attendance[date]?.[student.id] || {};
  const teacher = store.users.find((user) => user.id === record.teacherId);
  return {
    student: publicUser(student),
    status: record.status || "unmarked",
    note: record.note || "",
    updatedAt: record.updatedAt || "",
    teacherName: teacher?.name || "",
  };
}

function attendanceForUser(store, auth, date, requestedStudentId = "") {
  const studentUsers = store.users.filter((user) => user.role === "student");
  if (auth.user.role === "teacher") {
    const classStudents = classStudentsForTeacher(store, auth.user);
    const students = requestedStudentId
      ? classStudents.filter((student) => student.id === requestedStudentId)
      : classStudents;
    return students.map((student) => publicAttendanceRecord(store, date, student));
  }
  if (auth.user.role === "student") {
    return [publicAttendanceRecord(store, date, auth.user)];
  }
  if (auth.user.role === "parent" && auth.user.linkedStudentId) {
    const student = studentUsers.find((user) => user.id === auth.user.linkedStudentId);
    return student ? [publicAttendanceRecord(store, date, student)] : [];
  }
  return [];
}

function getReadableStudentId(auth, requestedStudentId = "") {
  if (auth.user.role === "student") return auth.user.id;
  if (auth.user.role === "parent") {
    const linkedStudentId = auth.user.linkedStudentId || "";
    if (!requestedStudentId || requestedStudentId === linkedStudentId) return linkedStudentId;
  }
  if (auth.user.role === "teacher") return requestedStudentId;
  return "";
}

function createSessionForUser(store, user) {
  const token = crypto.randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_MS).toISOString();
  store.sessions.push({
    id: crypto.randomUUID(),
    userId: user.id,
    tokenHash: hashSessionToken(token),
    createdAt: new Date().toISOString(),
    expiresAt,
  });
  saveStore(store);
  return token;
}

function contextForRole(role, body) {
  if (role === "teacher") return "No students assigned";
  if (role === "parent") return String(body.childName || "").trim() || "Child profile";
  return String(body.className || "").trim() || "Grade 7 Math";
}

function validateSignup(body, store) {
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const role = String(body.role || "").trim().toLowerCase();

  if (name.length < 2) return { error: "Enter your name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email." };
  if (password.length < 6) return { error: "Password must be at least 6 characters." };
  if (!VALID_ROLES.has(role)) return { error: "Choose student, teacher, or parent." };
  if (store.users.some((user) => user.email === email)) return { error: "An account with that email already exists." };

  return { name, email, password, role };
}

function parseCookies(header = "") {
  return Object.fromEntries(
    header
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf("=");
        if (index === -1) return [part, ""];
        return [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
      }),
  );
}

function sessionCookie(token, maxAgeSeconds) {
  const parts = [`${COOKIE_NAME}=${encodeURIComponent(token)}`, "HttpOnly", "SameSite=Lax", "Path=/"];
  if (maxAgeSeconds === 0) {
    parts.push("Max-Age=0", "Expires=Thu, 01 Jan 1970 00:00:00 GMT");
  } else {
    parts.push(`Max-Age=${maxAgeSeconds}`);
  }
  return parts.join("; ");
}

function getSession(req, store) {
  const token = parseCookies(req.headers.cookie)[COOKIE_NAME];
  if (!token) return null;
  const tokenHash = hashSessionToken(token);
  const session = store.sessions.find(
    (item) => item.tokenHash === tokenHash && Date.parse(item.expiresAt) > Date.now(),
  );
  if (!session) return null;
  const user = store.users.find((item) => item.id === session.userId);
  return user ? { session, user, tokenHash } : null;
}

function sendJson(res, status, payload, headers = {}) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...headers,
  });
  res.end(JSON.stringify(payload));
}

function routeId(url, prefix) {
  if (!url.pathname.startsWith(prefix)) return "";
  const value = url.pathname.slice(prefix.length);
  if (!value || value.includes("/")) return "";
  try {
    return decodeURIComponent(value);
  } catch (error) {
    return "";
  }
}

function apiError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function sendText(res, status, text) {
  res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(text);
}

function sendUpload(req, res, url) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    sendText(res, 405, "Method not allowed");
    return;
  }

  const fileName = path.basename(decodeURIComponent(url.pathname.replace("/uploads/", "")));
  if (!fileName || fileName.includes("/") || fileName.includes("\\")) {
    sendText(res, 404, "Not found");
    return;
  }

  const filePath = path.join(UPLOAD_DIR, fileName);
  fs.stat(filePath, (error, stats) => {
    if (error || !stats.isFile()) {
      sendText(res, 404, "Not found");
      return;
    }

    const mime = MIME_TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream";
    const range = req.headers.range;
    if (range) {
      const match = range.match(/bytes=(\d*)-(\d*)/);
      if (!match) {
        sendText(res, 416, "Range not satisfiable");
        return;
      }
      const start = match[1] ? Number(match[1]) : 0;
      const end = match[2] ? Number(match[2]) : stats.size - 1;
      if (start >= stats.size || end >= stats.size || start > end) {
        res.writeHead(416, { "Content-Range": `bytes */${stats.size}` });
        res.end();
        return;
      }
      res.writeHead(206, {
        "Content-Type": mime,
        "Accept-Ranges": "bytes",
        "Content-Length": end - start + 1,
        "Content-Range": `bytes ${start}-${end}/${stats.size}`,
        "Cache-Control": "no-store",
      });
      if (req.method === "HEAD") {
        res.end();
        return;
      }
      fs.createReadStream(filePath, { start, end }).pipe(res);
      return;
    }

    res.writeHead(200, {
      "Content-Type": mime,
      "Accept-Ranges": "bytes",
      "Content-Length": stats.size,
      "Cache-Control": "no-store",
    });
    if (req.method === "HEAD") {
      res.end();
      return;
    }
    fs.createReadStream(filePath).pipe(res);
  });
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (Buffer.byteLength(body) > BODY_LIMIT) {
        reject(Object.assign(new Error("Request body too large"), { status: 413 }));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!body.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(Object.assign(new Error("Invalid JSON"), { status: 400 }));
      }
    });
    req.on("error", reject);
  });
}

function readRawBody(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > limit) {
        reject(Object.assign(new Error("Upload is too large."), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function parseContentDisposition(value = "") {
  const result = {};
  for (const part of value.split(";")) {
    const [rawKey, ...rawValue] = part.trim().split("=");
    if (!rawValue.length) continue;
    result[rawKey.toLowerCase()] = rawValue.join("=").replace(/^"|"$/g, "");
  }
  return result;
}

function safeUploadName(name, fallback = "upload") {
  const safe = path.basename(name || fallback).replace(/[^a-z0-9._-]+/gi, "-").replace(/^-+|-+$/g, "");
  return safe || fallback;
}

function cleanText(value, fallback = "") {
  return String(value || "").trim().replace(/\s+/g, " ") || fallback;
}

async function readMultipartBody(req) {
  const type = req.headers["content-type"] || "";
  const boundaryMatch = type.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  if (!boundaryMatch) {
    throw Object.assign(new Error("Expected a multipart form upload."), { status: 400 });
  }

  const boundary = Buffer.from(`--${boundaryMatch[1] || boundaryMatch[2]}`);
  const body = await readRawBody(req, UPLOAD_LIMIT);
  const fields = {};
  const files = {};
  let cursor = 0;

  while (cursor < body.length) {
    const start = body.indexOf(boundary, cursor);
    if (start === -1) break;
    let partStart = start + boundary.length;
    if (body.slice(partStart, partStart + 2).toString() === "--") break;
    if (body.slice(partStart, partStart + 2).toString() === "\r\n") partStart += 2;

    const next = body.indexOf(boundary, partStart);
    if (next === -1) break;
    let part = body.slice(partStart, next);
    if (part.slice(-2).toString() === "\r\n") part = part.slice(0, -2);

    const headerEnd = part.indexOf(Buffer.from("\r\n\r\n"));
    if (headerEnd !== -1) {
      const rawHeaders = part.slice(0, headerEnd).toString("utf8");
      const content = part.slice(headerEnd + 4);
      const headers = Object.fromEntries(
        rawHeaders
          .split("\r\n")
          .map((line) => {
            const index = line.indexOf(":");
            return index === -1 ? null : [line.slice(0, index).toLowerCase(), line.slice(index + 1).trim()];
          })
          .filter(Boolean),
      );
      const disposition = parseContentDisposition(headers["content-disposition"]);
      if (disposition.name) {
        if (disposition.filename) {
          files[disposition.name] = {
            filename: disposition.filename,
            contentType: headers["content-type"] || "application/octet-stream",
            data: content,
          };
        } else {
          fields[disposition.name] = content.toString("utf8");
        }
      }
    }
    cursor = next;
  }

  return { fields, files };
}

async function handleApi(req, res, url) {
  const store = ensureStore();

  if (req.method === "GET" && url.pathname === "/api/health") {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/system/network") {
    const auth = getSession(req, store);
    if (!auth) {
      sendJson(res, 401, { error: "Not authenticated." });
      return;
    }
    sendJson(res, 200, {
      host: HOST,
      port: PORT,
      localUrl: `http://127.0.0.1:${PORT}`,
      lanEnabled: HOST === "0.0.0.0" || HOST === "::",
      lanUrls: HOST === "0.0.0.0" || HOST === "::" ? localNetworkUrls() : [],
    });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/ai/help") {
    const auth = getSession(req, store);
    if (!auth) {
      sendJson(res, 401, { error: "Not authenticated." });
      return;
    }
    if (auth.user.role !== "student") {
      sendJson(res, 403, { error: "Only student accounts can ask the assignment tutor." });
      return;
    }

    const body = await readJsonBody(req);
    const assignmentId = String(body.assignmentId || "").trim();
    const questionIndex = Number(body.questionIndex);
    const message = String(body.message || "").trim().slice(0, 900);
    const attempt = String(body.attempt || "").trim().slice(0, 900);
    const history = aiHelpHistoryFromValue(body.history);
    const assignment = store.assignments.find(
      (item) => item.id === assignmentId && assignmentVisibleToUser(item, auth.user),
    );
    if (!assignment) {
      sendJson(res, 404, { error: "Assignment not found." });
      return;
    }
    const questionData = assignment && Number.isInteger(questionIndex)
      ? normalizeAssignmentQuestion(assignment.questions?.[questionIndex])
      : null;
    const question = questionData
      ? assignmentQuestionPrompt(questionData)
      : "";
    if (!question) {
      sendJson(res, 400, { error: "Choose a real assignment question before asking the AI tutor." });
      return;
    }
    const context = {
      assignmentTitle: assignment?.title || "",
      topic: assignment?.topic || "",
      questionIndex: Number.isInteger(questionIndex) ? questionIndex : null,
      question,
      questionType: questionData?.type || "text",
      answerKey: Array.isArray(questionData?.answerKey) ? questionData.answerKey : [],
      message,
      attempt,
      history,
    };

    let source = "local-ai";
    let reply = keyedTutorReply(context);
    if (reply) {
      source = "mathbridge-key";
    }
    try {
      if (!reply) reply = await localAiTutorReply(context);
      if (source === "local-ai" && looksLikeFinalAnswer(reply) && !studentIsCheckingOwnWork(context)) {
        source = "guided-fallback";
        reply = guidedTutorFallback(context);
      }
    } catch (error) {
      source = "guided-fallback";
      reply = guidedTutorFallback(context);
    }

    sendJson(res, 200, {
      reply,
      source,
      model: source === "local-ai" ? LOCAL_AI_MODEL : source,
    });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/ai/grade-suggestion") {
    const auth = getSession(req, store);
    if (!auth) {
      sendJson(res, 401, { error: "Not authenticated." });
      return;
    }
    if (auth.user.role !== "teacher") {
      sendJson(res, 403, { error: "Only teacher accounts can ask for grade suggestions." });
      return;
    }

    const body = await readJsonBody(req);
    const studentId = String(body.studentId || "").trim();
    const assignmentId = String(body.assignmentId || "").trim();
    const student = store.users.find((user) => user.id === studentId && user.role === "student");
    const assignment = store.assignments.find((item) => item.id === assignmentId && item.teacherId === auth.user.id);
    if (!student || !assignment) {
      sendJson(res, 400, { error: "Choose a submitted student assignment." });
      return;
    }
    if (!teacherClassStudentIds(auth.user, store).includes(student.id)) {
      sendJson(res, 403, { error: "Add this student to your class before reviewing their work." });
      return;
    }

    const assignmentWork = assignmentWorkFor(store, student.id, assignmentId);
    if (!assignmentWork.submittedAt || !hasSubmittableWork(assignmentWork)) {
      sendJson(res, 400, { error: "The student needs to submit work before AI can suggest a grade." });
      return;
    }

    const context = await gradingSubmissionContext(store, auth.user, assignment, assignmentWork, student);
    let source = "mathbridge-grader";
    let suggestion = deterministicGradeSuggestion(context);
    if (!suggestion) {
      source = "local-ai";
      try {
        suggestion = await localAiGradeSuggestion(context);
        if (!suggestion.feedback && suggestion.grade === null) {
          throw apiError(502, "Local AI returned an empty grade suggestion.");
        }
      } catch (error) {
        source = "guided-fallback";
        suggestion = guidedGradeSuggestion(context);
      }
    }

    sendJson(res, 200, {
      ...suggestion,
      source,
      model: source === "local-ai" ? LOCAL_AI_MODEL : source,
      evidence: {
        uploads: context.uploadEvidence.length,
        readableUploads: context.uploadEvidence.filter((item) => item.text).length,
        gradeExamples: context.gradeExamples.length,
      },
    });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/auth/me") {
    const auth = getSession(req, store);
    sendJson(res, 200, { authenticated: Boolean(auth), user: publicUser(auth?.user) });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/auth/login") {
    const body = await readJsonBody(req);
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const user = store.users.find((item) => item.email === email);

    if (!user || !verifyPassword(password, user.password)) {
      sendJson(res, 401, { error: "Invalid email or password." });
      return;
    }

    const token = createSessionForUser(store, user);

    sendJson(
      res,
      200,
      { authenticated: true, user: publicUser(user) },
      { "Set-Cookie": sessionCookie(token, Math.floor(SESSION_MS / 1000)) },
    );
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/auth/signup") {
    const body = await readJsonBody(req);
    const signup = validateSignup(body, store);
    if (signup.error) {
      sendJson(res, 400, { error: signup.error });
      return;
    }

    const user = {
      id: crypto.randomUUID(),
      email: signup.email,
      name: signup.name,
      role: signup.role,
      context: contextForRole(signup.role, body),
      password: createPasswordRecord(signup.password),
      createdAt: new Date().toISOString(),
    };
    store.users.push(user);
    const token = createSessionForUser(store, user);

    sendJson(
      res,
      201,
      { authenticated: true, user: publicUser(user) },
      { "Set-Cookie": sessionCookie(token, Math.floor(SESSION_MS / 1000)) },
    );
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/users") {
    const auth = getSession(req, store);
    if (!auth) {
      sendJson(res, 401, { error: "Not authenticated." });
      return;
    }
    const role = url.searchParams.get("role");
    const users = directoryUsersForUser(store, auth.user)
      .filter((user) => !role || user.role === role)
      .map(publicUser);
    sendJson(res, 200, { users });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/class/students") {
    const auth = getSession(req, store);
    if (!auth) {
      sendJson(res, 401, { error: "Not authenticated." });
      return;
    }
    if (auth.user.role !== "teacher") {
      sendJson(res, 403, { error: "Only teacher accounts can manage class rosters." });
      return;
    }

    const body = await readJsonBody(req);
    const requestedIds = Array.isArray(body.studentIds) ? [...new Set(body.studentIds.map((id) => String(id || "").trim()).filter(Boolean))] : [];
    const validStudents = store.users.filter((user) => user.role === "student" && requestedIds.includes(user.id));
    auth.user.classStudentIds = validStudents.map((student) => student.id);
    auth.user.context = validStudents.length
      ? `${validStudents.length} student${validStudents.length === 1 ? "" : "s"} in class`
      : "No students assigned";
    saveStore(store);
    sendJson(res, 200, {
      user: publicUser(auth.user),
      students: validStudents.map(publicUser),
    });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/announcements") {
    const auth = getSession(req, store);
    if (!auth) {
      sendJson(res, 401, { error: "Not authenticated." });
      return;
    }
    sendJson(res, 200, { announcements: publicAnnouncementsForUser(store, auth.user) });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/announcements") {
    const auth = getSession(req, store);
    if (!auth) {
      sendJson(res, 401, { error: "Not authenticated." });
      return;
    }
    if (auth.user.role !== "teacher") {
      sendJson(res, 403, { error: "Only teacher accounts can post announcements." });
      return;
    }

    const body = await readJsonBody(req);
    const title = cleanText(body.title).slice(0, 120);
    const message = cleanText(body.message).slice(0, 900);
    const scheduled = Boolean(body.scheduled);
    const scheduledAt = String(body.scheduledAt || "").trim();
    const scheduledTime = Date.parse(scheduledAt);

    if (title.length < 2) {
      sendJson(res, 400, { error: "Enter an announcement title." });
      return;
    }
    if (message.length < 2) {
      sendJson(res, 400, { error: "Enter an announcement message." });
      return;
    }
    if (scheduled && (!scheduledAt || Number.isNaN(scheduledTime))) {
      sendJson(res, 400, { error: "Choose a valid schedule date and time." });
      return;
    }

    const now = new Date().toISOString();
    const announcement = {
      id: crypto.randomUUID(),
      teacherId: auth.user.id,
      teacherName: auth.user.name,
      title,
      message,
      status: scheduled ? "scheduled" : "posted",
      scheduledAt: scheduled ? new Date(scheduledTime).toISOString() : "",
      postedAt: scheduled ? "" : now,
      createdAt: now,
    };
    store.announcements.push(announcement);
    saveStore(store);

    sendJson(res, 201, {
      announcement: publicAnnouncement(announcement, store),
      announcements: publicAnnouncementsForUser(store, auth.user),
    });
    return;
  }

  const announcementId = routeId(url, "/api/announcements/");
  if (req.method === "DELETE" && announcementId) {
    const auth = getSession(req, store);
    if (!auth) {
      sendJson(res, 401, { error: "Not authenticated." });
      return;
    }
    if (auth.user.role !== "teacher") {
      sendJson(res, 403, { error: "Only teacher accounts can take down announcements." });
      return;
    }

    const index = store.announcements.findIndex(
      (announcement) => announcement.id === announcementId && announcement.teacherId === auth.user.id,
    );
    if (index === -1) {
      sendJson(res, 404, { error: "Announcement not found." });
      return;
    }

    store.announcements.splice(index, 1);
    saveStore(store);
    sendJson(res, 200, { announcements: publicAnnouncementsForUser(store, auth.user) });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/classes") {
    const auth = getSession(req, store);
    if (!auth) {
      sendJson(res, 401, { error: "Not authenticated." });
      return;
    }
    if (auth.user.role !== "teacher") {
      sendJson(res, 403, { error: "Only teacher accounts can manage classes." });
      return;
    }

    const body = await readJsonBody(req);
    const classId = String(body.classId || body.id || "").trim();
    const name = cleanText(body.name || body.className, "Math class");
    const requestedIds = Array.isArray(body.studentIds)
      ? [...new Set(body.studentIds.map((id) => String(id || "").trim()).filter(Boolean))]
      : [];
    const validStudents = store.users.filter((user) => user.role === "student" && requestedIds.includes(user.id));
    const classes = teacherClasses(auth.user, store);
    let savedClass = classes.find((classItem) => classItem.id === classId);
    if (savedClass) {
      savedClass.name = name;
      savedClass.studentIds = validStudents.map((student) => student.id);
    } else {
      savedClass = {
        id: crypto.randomUUID(),
        name,
        studentIds: validStudents.map((student) => student.id),
      };
      classes.push(savedClass);
    }
    auth.user.classes = classes;
    auth.user.classStudentIds = [...new Set(classes.flatMap((classItem) => classItem.studentIds))];
    auth.user.context = classes.length ? `${classes.length} class${classes.length === 1 ? "" : "es"}` : "No classes assigned";
    saveStore(store);
    sendJson(res, 200, {
      user: publicUser(auth.user),
      class: publicClass(savedClass),
      students: validStudents.map(publicUser),
    });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/lessons") {
    const auth = getSession(req, store);
    if (!auth) {
      sendJson(res, 401, { error: "Not authenticated." });
      return;
    }
    sendJson(res, 200, { lessons: publicLessons(store, auth.user) });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/materials") {
    const auth = getSession(req, store);
    if (!auth) {
      sendJson(res, 401, { error: "Not authenticated." });
      return;
    }
    if (auth.user.role !== "teacher") {
      sendJson(res, 403, { error: "Only teacher accounts can view saved materials." });
      return;
    }
    sendJson(res, 200, { materials: publicMaterialsForUser(store, auth.user) });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/materials") {
    const auth = getSession(req, store);
    if (!auth) {
      sendJson(res, 401, { error: "Not authenticated." });
      return;
    }
    if (auth.user.role !== "teacher") {
      sendJson(res, 403, { error: "Only teacher accounts can upload saved materials." });
      return;
    }

    const { fields, files } = await readMultipartBody(req);
    const uploaded = files.materialFile;
    const link = String(fields.link || "").trim();
    const kind = normalizeMaterialKind(fields.kind, uploaded);
    const title = cleanText(fields.title, uploaded?.filename || (kind === "lesson-video" ? "Lesson video" : "Worksheet"));

    if (!title) {
      sendJson(res, 400, { error: "Enter a material title." });
      return;
    }
    if (!link && (!uploaded || !uploaded.data.length)) {
      sendJson(res, 400, { error: "Choose a file or paste a link." });
      return;
    }

    let materialUrl = "";
    let materialName = "";
    let materialType = "";
    let materialSize = 0;
    if (uploaded && uploaded.data.length) {
      if (!isAllowedMaterialFile(kind, uploaded)) {
        sendJson(res, 400, {
          error: kind === "lesson-video"
            ? "Upload a video file for lesson videos."
            : "Upload a PDF, document, text file, or image for worksheets and documents.",
        });
        return;
      }
      const storedName = `${crypto.randomUUID()}-${safeUploadName(uploaded.filename, kind)}`;
      fs.writeFileSync(path.join(UPLOAD_DIR, storedName), uploaded.data);
      materialUrl = `/uploads/${storedName}`;
      materialName = uploaded.filename || title;
      materialType = uploaded.contentType || MIME_TYPES[path.extname(storedName).toLowerCase()] || "application/octet-stream";
      materialSize = uploaded.data.length;
    }

    const material = {
      id: crypto.randomUUID(),
      teacherId: auth.user.id,
      teacherName: auth.user.name,
      title,
      kind,
      url: materialUrl,
      link,
      name: materialName,
      type: materialType,
      size: materialSize,
      createdAt: new Date().toISOString(),
    };
    store.materials.push(material);
    saveStore(store);
    sendJson(res, 201, { material: publicMaterial(material, store), materials: publicMaterialsForUser(store, auth.user) });
    return;
  }

  const materialId = routeId(url, "/api/materials/");
  if (req.method === "DELETE" && materialId) {
    const auth = getSession(req, store);
    if (!auth) {
      sendJson(res, 401, { error: "Not authenticated." });
      return;
    }
    if (auth.user.role !== "teacher") {
      sendJson(res, 403, { error: "Only teacher accounts can take down saved materials." });
      return;
    }

    const index = store.materials.findIndex(
      (material) => material.id === materialId && material.teacherId === auth.user.id,
    );
    if (index === -1) {
      sendJson(res, 404, { error: "Material not found." });
      return;
    }

    const [material] = store.materials.splice(index, 1);
    removeMaterialFromAssignments(store, auth.user.id, material);
    saveStore(store);
    sendJson(res, 200, {
      materials: publicMaterialsForUser(store, auth.user),
      assignments: publicAssignmentsForUser(store, auth.user),
    });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/lessons") {
    const auth = getSession(req, store);
    if (!auth) {
      sendJson(res, 401, { error: "Not authenticated." });
      return;
    }
    if (auth.user.role !== "teacher") {
      sendJson(res, 403, { error: "Only teacher accounts can upload lessons." });
      return;
    }

    const { fields, files } = await readMultipartBody(req);
    const title = cleanText(fields.title, "Untitled lesson");
    const goal = cleanText(fields.goal, "Practice the lesson skill.");
    const explanation = String(fields.explanation || "").trim();
    const example = String(fields.example || "").trim();
    const videoLink = String(fields.videoLink || "").trim();
    const uploaded = files.videoFile;

    if (title.length < 2) {
      sendJson(res, 400, { error: "Enter a lesson title." });
      return;
    }
    if (!videoLink && (!uploaded || !uploaded.data.length)) {
      sendJson(res, 400, { error: "Choose a video file or paste a video link." });
      return;
    }

    let videoUrl = "";
    let videoName = "";
    let videoType = "";
    if (uploaded && uploaded.data.length) {
      if (!uploaded.contentType.startsWith("video/")) {
        sendJson(res, 400, { error: "Upload a video file." });
        return;
      }
      const storedName = `${crypto.randomUUID()}-${safeUploadName(uploaded.filename, "lesson-video")}`;
      fs.writeFileSync(path.join(UPLOAD_DIR, storedName), uploaded.data);
      videoUrl = `/uploads/${storedName}`;
      videoName = uploaded.filename;
      videoType = uploaded.contentType;
    }

    const lesson = {
      id: crypto.randomUUID(),
      teacherId: auth.user.id,
      teacherName: auth.user.name,
      title,
      goal,
      explanation,
      example,
      videoUrl,
      videoLink,
      videoName,
      videoType,
      createdAt: new Date().toISOString(),
    };
    store.lessons.push(lesson);
    saveStore(store);
    sendJson(res, 201, { lesson: publicLesson(lesson, store, auth.user), lessons: publicLessons(store, auth.user) });
    return;
  }

  const lessonId = routeId(url, "/api/lessons/");
  if (req.method === "DELETE" && lessonId) {
    const auth = getSession(req, store);
    if (!auth) {
      sendJson(res, 401, { error: "Not authenticated." });
      return;
    }
    if (auth.user.role !== "teacher") {
      sendJson(res, 403, { error: "Only teacher accounts can take down lessons." });
      return;
    }

    const index = store.lessons.findIndex(
      (lesson) => lesson.id === lessonId && lesson.teacherId === auth.user.id,
    );
    if (index === -1) {
      sendJson(res, 404, { error: "Lesson not found." });
      return;
    }

    const [lesson] = store.lessons.splice(index, 1);
    removeUploadedFile(lesson.videoUrl);
    saveStore(store);
    sendJson(res, 200, { lessons: publicLessons(store, auth.user) });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/assignments") {
    const auth = getSession(req, store);
    if (!auth) {
      sendJson(res, 401, { error: "Not authenticated." });
      return;
    }
    sendJson(res, 200, { assignments: publicAssignmentsForUser(store, auth.user) });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/assignment-drafts") {
    const auth = getSession(req, store);
    if (!auth) {
      sendJson(res, 401, { error: "Not authenticated." });
      return;
    }
    if (auth.user.role !== "teacher") {
      sendJson(res, 403, { error: "Only teacher accounts can view assignment drafts." });
      return;
    }
    sendJson(res, 200, { drafts: publicAssignmentDraftsForUser(store, auth.user) });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/assignment-drafts") {
    const auth = getSession(req, store);
    if (!auth) {
      sendJson(res, 401, { error: "Not authenticated." });
      return;
    }
    if (auth.user.role !== "teacher") {
      sendJson(res, 403, { error: "Only teacher accounts can save assignment drafts." });
      return;
    }

    const multipart = await readMultipartBody(req);
    const payload = buildTeacherAssignmentPayload(
      store,
      auth.user,
      multipart.fields,
      multipart.files.pageFile,
      multipart.files.lessonVideoFile,
    );
    const now = new Date().toISOString();
    const draft = {
      id: crypto.randomUUID(),
      teacherId: auth.user.id,
      teacherName: auth.user.name,
      ...payload,
      assignedStudentIds: [],
      createdAt: now,
      updatedAt: now,
    };
    store.assignmentDrafts.push(draft);
    saveStore(store);
    sendJson(res, 201, { draft: publicAssignment(draft, store, auth.user), drafts: publicAssignmentDraftsForUser(store, auth.user) });
    return;
  }

  const draftPublishMatch = req.method === "POST"
    ? url.pathname.match(/^\/api\/assignment-drafts\/([^/]+)\/publish$/)
    : null;
  if (draftPublishMatch) {
    const auth = getSession(req, store);
    if (!auth) {
      sendJson(res, 401, { error: "Not authenticated." });
      return;
    }
    if (auth.user.role !== "teacher") {
      sendJson(res, 403, { error: "Only teacher accounts can push assignment drafts." });
      return;
    }

    const draftId = decodeURIComponent(draftPublishMatch[1]);
    const index = store.assignmentDrafts.findIndex((draft) => draft.id === draftId && draft.teacherId === auth.user.id);
    if (index === -1) {
      sendJson(res, 404, { error: "Assignment draft not found." });
      return;
    }
    const draft = store.assignmentDrafts[index];
    if (!Array.isArray(draft.questions) || !draft.questions.length) {
      sendJson(res, 400, { error: "Add questions before pushing this draft." });
      return;
    }
    const targetClass = teacherClassById(auth.user, store, draft.classId);
    if (!targetClass) {
      sendJson(res, 400, { error: "Choose a class before pushing this draft." });
      return;
    }
    if (!targetClass.studentIds.length) {
      sendJson(res, 400, { error: "Add at least one signed-up student to this class before pushing work." });
      return;
    }

    const now = new Date().toISOString();
    const assignment = {
      ...draft,
      id: crypto.randomUUID(),
      teacherId: auth.user.id,
      teacherName: auth.user.name,
      classId: targetClass.id,
      className: targetClass.name || draft.className,
      assignedStudentIds: targetClass.studentIds,
      createdAt: now,
    };
    delete assignment.updatedAt;
    store.assignmentDrafts.splice(index, 1);
    store.assignments.push(assignment);
    saveStore(store);
    sendJson(res, 200, {
      assignment: publicAssignment(assignment, store, auth.user),
      assignments: publicAssignmentsForUser(store, auth.user),
      drafts: publicAssignmentDraftsForUser(store, auth.user),
    });
    return;
  }

  const assignmentDraftId = routeId(url, "/api/assignment-drafts/");
  if (req.method === "DELETE" && assignmentDraftId) {
    const auth = getSession(req, store);
    if (!auth) {
      sendJson(res, 401, { error: "Not authenticated." });
      return;
    }
    if (auth.user.role !== "teacher") {
      sendJson(res, 403, { error: "Only teacher accounts can delete assignment drafts." });
      return;
    }

    const index = store.assignmentDrafts.findIndex((draft) => draft.id === assignmentDraftId && draft.teacherId === auth.user.id);
    if (index === -1) {
      sendJson(res, 404, { error: "Assignment draft not found." });
      return;
    }
    store.assignmentDrafts.splice(index, 1);
    saveStore(store);
    sendJson(res, 200, { drafts: publicAssignmentDraftsForUser(store, auth.user) });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/assignments") {
    const auth = getSession(req, store);
    if (!auth) {
      sendJson(res, 401, { error: "Not authenticated." });
      return;
    }
    if (auth.user.role !== "teacher") {
      sendJson(res, 403, { error: "Only teacher accounts can publish assignments." });
      return;
    }

    let body;
    let pageFile;
    let lessonVideoFile;
    if (String(req.headers["content-type"] || "").startsWith("multipart/form-data")) {
      const multipart = await readMultipartBody(req);
      body = multipart.fields;
      pageFile = multipart.files.pageFile;
      lessonVideoFile = multipart.files.lessonVideoFile;
    } else {
      body = await readJsonBody(req);
    }
    const requestedClassName = cleanText(body.className, "Math class");
    const classId = String(body.classId || "").trim();
    const topic = cleanText(body.topic, "Math assignment");
    const due = cleanText(body.due, new Date().toISOString().slice(0, 10));
    let questions = assignmentQuestionsFromValue(body.questions);
    const uploadWork = booleanFromValue(body.uploadWork);
    const bridgeSpace = booleanFromValue(body.bridgeSpace || body.mathspace || body.mathspaceEnabled);
    let videoLink = String(body.lessonVideoLink || body.videoLink || "").trim();
    const materialIds = materialIdsFromValue(body.materialIds);
    const selectedMaterials = materialIds
      .map((materialId) => store.materials.find((material) => material.id === materialId && material.teacherId === auth.user.id))
      .filter(Boolean);
    const hasAttachment =
      selectedMaterials.length ||
      videoLink ||
      (pageFile && pageFile.data.length) ||
      (lessonVideoFile && lessonVideoFile.data.length);

    if (!questions.length && hasAttachment) {
      questions = [{ type: "text", prompt: "Complete the attached teacher material.", choices: [] }];
    }
    if (!questions.length) {
      sendJson(res, 400, { error: "Write at least one question or attach a worksheet before publishing." });
      return;
    }
    const targetClass = teacherClassById(auth.user, store, classId);
    if (!targetClass) {
      sendJson(res, 400, { error: "Choose a class before publishing work." });
      return;
    }
    const className = targetClass.name || requestedClassName;
    const assignedStudentIds = targetClass.studentIds;
    if (!assignedStudentIds.length) {
      sendJson(res, 400, { error: "Add at least one signed-up student to this class before publishing work." });
      return;
    }

    let pageUrl = "";
    let pageName = "";
    let pageType = "";
    let videoUrl = "";
    let videoName = "";
    let videoType = "";
    const resources = selectedMaterials.map(assignmentResourceFromMaterial);
    const videoResource = resources.find(isVideoResource);
    if (videoResource) {
      videoUrl = videoResource.url || "";
      videoLink = videoResource.link || videoLink;
      videoName = videoResource.name || videoResource.title || "";
      videoType = videoResource.type || "";
    }
    const pageResource = resources.find((resource) => isImageResource(resource) && ["worksheet", "document"].includes(resource.kind));
    if (pageResource) {
      pageUrl = pageResource.url || "";
      pageName = pageResource.name || pageResource.title || "";
      pageType = pageResource.type || "";
    }
    if (lessonVideoFile && lessonVideoFile.data.length) {
      if (!String(lessonVideoFile.contentType || "").startsWith("video/")) {
        sendJson(res, 400, { error: "Upload the lesson as a video file." });
        return;
      }
      const storedName = `${crypto.randomUUID()}-${safeUploadName(lessonVideoFile.filename, "assignment-lesson-video")}`;
      fs.writeFileSync(path.join(UPLOAD_DIR, storedName), lessonVideoFile.data);
      videoUrl = `/uploads/${storedName}`;
      videoName = lessonVideoFile.filename || "Lesson video";
      videoType = lessonVideoFile.contentType || "video/mp4";
    }

    if (pageFile && pageFile.data.length) {
      if (!String(pageFile.contentType || "").startsWith("image/")) {
        sendJson(res, 400, { error: "Upload the assignment page as an image so students can draw on it." });
        return;
      }
      const storedName = `${crypto.randomUUID()}-${safeUploadName(pageFile.filename, "assignment-page")}`;
      fs.writeFileSync(path.join(UPLOAD_DIR, storedName), pageFile.data);
      pageUrl = `/uploads/${storedName}`;
      pageName = pageFile.filename || "Assignment page";
      pageType = pageFile.contentType || "image/png";
    }

    const assignment = {
      id: crypto.randomUUID(),
      teacherId: auth.user.id,
      teacherName: auth.user.name,
      title: `${topic} assignment`,
      classId: targetClass.id,
      className,
      topic,
      due,
      questions,
      uploadWork,
      bridgeSpace,
      requiredWork: uploadWork ? "Show work for all questions" : "Final answers only",
      videoUrl,
      videoLink,
      videoName,
      videoType,
      pageUrl,
      pageName,
      pageType,
      resources,
      materialIds: selectedMaterials.map((material) => material.id),
      assignedStudentIds,
      steps: assignmentStepsFromOptions(body, questions, uploadWork, Boolean(videoUrl || videoLink)),
      createdAt: new Date().toISOString(),
    };
    store.assignments.push(assignment);
    saveStore(store);

    sendJson(res, 201, {
      assignment: publicAssignment(assignment, store, auth.user),
      assignments: publicAssignmentsForUser(store, auth.user),
    });
    return;
  }

  const assignmentId = routeId(url, "/api/assignments/");
  if (req.method === "DELETE" && assignmentId) {
    const auth = getSession(req, store);
    if (!auth) {
      sendJson(res, 401, { error: "Not authenticated." });
      return;
    }
    if (auth.user.role !== "teacher") {
      sendJson(res, 403, { error: "Only teacher accounts can take down assignments." });
      return;
    }

    const index = store.assignments.findIndex(
      (assignment) => assignment.id === assignmentId && assignment.teacherId === auth.user.id,
    );
    if (index === -1) {
      sendJson(res, 404, { error: "Assignment not found." });
      return;
    }

    store.assignments.splice(index, 1);
    for (const work of Object.values(store.work || {})) {
      if (work.assignments) delete work.assignments[assignmentId];
    }
    saveStore(store);
    sendJson(res, 200, { assignments: publicAssignmentsForUser(store, auth.user) });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/attendance") {
    const auth = getSession(req, store);
    if (!auth) {
      sendJson(res, 401, { error: "Not authenticated." });
      return;
    }
    const date = normalizeDate(url.searchParams.get("date"));
    const studentId = String(url.searchParams.get("studentId") || "").trim();
    sendJson(res, 200, {
      date,
      records: attendanceForUser(store, auth, date, studentId),
    });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/attendance") {
    const auth = getSession(req, store);
    if (!auth) {
      sendJson(res, 401, { error: "Not authenticated." });
      return;
    }
    if (auth.user.role !== "teacher") {
      sendJson(res, 403, { error: "Only teacher accounts can mark attendance." });
      return;
    }

    const body = await readJsonBody(req);
    const date = normalizeDate(body.date);
    const studentId = String(body.studentId || "").trim();
    const status = String(body.status || "").trim().toLowerCase();
    const note = String(body.note || "").trim().slice(0, 280);
    const student = store.users.find((user) => user.id === studentId && user.role === "student");

    if (!student) {
      sendJson(res, 400, { error: "Choose a signed-up student." });
      return;
    }
    if (!teacherClassStudentIds(auth.user, store).includes(student.id)) {
      sendJson(res, 400, { error: "Add this student to your class before marking attendance." });
      return;
    }
    if (!ATTENDANCE_STATUSES.has(status)) {
      sendJson(res, 400, { error: "Choose present, late, absent, or excused." });
      return;
    }

    store.attendance[date] = store.attendance[date] || {};
    store.attendance[date][student.id] = {
      status,
      note,
      teacherId: auth.user.id,
      updatedAt: new Date().toISOString(),
    };
    saveStore(store);

    sendJson(res, 200, {
      date,
      records: attendanceForUser(store, auth, date),
    });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/messages") {
    const auth = getSession(req, store);
    if (!auth) {
      sendJson(res, 401, { error: "Not authenticated." });
      return;
    }
    sendJson(res, 200, { conversations: conversationsForUser(store, auth.user) });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/parent/student") {
    const auth = getSession(req, store);
    if (!auth) {
      sendJson(res, 401, { error: "Not authenticated." });
      return;
    }
    if (auth.user.role !== "parent") {
      sendJson(res, 403, { error: "Only parent accounts can select a student." });
      return;
    }

    const body = await readJsonBody(req);
    const studentId = String(body.studentId || "").trim();
    const studentEmail = String(body.studentEmail || "").trim().toLowerCase();
    if (!studentId && !studentEmail) {
      delete auth.user.linkedStudentId;
      auth.user.context = "Child profile";
      saveStore(store);
      sendJson(res, 200, { user: publicUser(auth.user) });
      return;
    }

    const student = studentEmail
      ? store.users.find((user) => user.email === studentEmail && user.role === "student")
      : store.users.find(
          (user) => user.id === studentId && user.role === "student" && user.id === auth.user.linkedStudentId,
        );
    if (!student) {
      sendJson(res, 400, { error: "Enter the exact email for a signed-up student account." });
      return;
    }

    auth.user.linkedStudentId = student.id;
    auth.user.context = student.name;
    saveStore(store);
    sendJson(res, 200, { user: publicUser(auth.user), student: publicUser(student) });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/work") {
    const auth = getSession(req, store);
    if (!auth) {
      sendJson(res, 401, { error: "Not authenticated." });
      return;
    }

    const requestedStudentId = String(url.searchParams.get("studentId") || "").trim();
    const studentId = getReadableStudentId(auth, requestedStudentId);
    const student = store.users.find((user) => user.id === studentId && user.role === "student");
    if (!student) {
      sendJson(res, 200, { work: publicWork(store, ""), student: null });
      return;
    }

    sendJson(res, 200, { work: publicWork(store, student.id), student: publicUser(student) });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/submissions") {
    const auth = getSession(req, store);
    if (!auth) {
      sendJson(res, 401, { error: "Not authenticated." });
      return;
    }
    if (auth.user.role !== "teacher") {
      sendJson(res, 403, { error: "Only teacher accounts can review submissions." });
      return;
    }

    const submissions = store.users
      .filter((user) => user.role === "student" && teacherClassStudentIds(auth.user, store).includes(user.id))
      .map((student) => ({
        student: publicUser(student),
        work: publicWork(store, student.id),
      }));
    sendJson(res, 200, { submissions });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/work/assignment-step") {
    const auth = getSession(req, store);
    if (!auth) {
      sendJson(res, 401, { error: "Not authenticated." });
      return;
    }
    if (auth.user.role !== "student") {
      sendJson(res, 403, { error: "Only student accounts can complete homework steps." });
      return;
    }

    const body = await readJsonBody(req);
    const assignmentId = String(body.assignmentId || "").trim();
    const stepIndex = Number(body.stepIndex);
    const done = Boolean(body.done);
    if (!assignmentId || !Number.isInteger(stepIndex) || stepIndex < 0 || stepIndex > 20) {
      sendJson(res, 400, { error: "Invalid homework step." });
      return;
    }

    const assignmentWork = assignmentWorkFor(store, auth.user.id, assignmentId);
    assignmentWork.steps[stepIndex] = done;
    assignmentWork.updatedAt = new Date().toISOString();
    saveStore(store);

    sendJson(res, 200, { work: publicWork(store, auth.user.id), student: publicUser(auth.user) });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/work/answers") {
    const auth = getSession(req, store);
    if (!auth) {
      sendJson(res, 401, { error: "Not authenticated." });
      return;
    }
    if (auth.user.role !== "student") {
      sendJson(res, 403, { error: "Only student accounts can save homework answers." });
      return;
    }

    const body = await readJsonBody(req);
    const assignmentId = String(body.assignmentId || "").trim();
    const answers = Array.isArray(body.answers)
      ? body.answers.map((answer) => {
          if (Array.isArray(answer)) {
            return answer.map((item) => String(item || "").trim().slice(0, 300)).filter(Boolean).slice(0, 12);
          }
          return String(answer || "").trim().slice(0, 600);
        }).slice(0, 60)
      : [];
    if (!assignmentId) {
      sendJson(res, 400, { error: "Choose an assignment first." });
      return;
    }

    const assignmentWork = assignmentWorkFor(store, auth.user.id, assignmentId);
    assignmentWork.answers = answers;
    resetWorkVerification(assignmentWork);
    assignmentWork.updatedAt = new Date().toISOString();
    saveStore(store);

    sendJson(res, 200, { work: publicWork(store, auth.user.id), student: publicUser(auth.user) });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/work/document") {
    const auth = getSession(req, store);
    if (!auth) {
      sendJson(res, 401, { error: "Not authenticated." });
      return;
    }
    if (auth.user.role !== "student") {
      sendJson(res, 403, { error: "Only student accounts can upload written work." });
      return;
    }

    const { fields, files } = await readMultipartBody(req);
    const assignmentId = String(fields.assignmentId || "").trim();
    const uploaded = files.documentFile;
    if (!assignmentId) {
      sendJson(res, 400, { error: "Choose an assignment first." });
      return;
    }
    if (!uploaded || !uploaded.data.length) {
      sendJson(res, 400, { error: "Choose a document or photo to upload." });
      return;
    }
    if (!isAllowedWorkDocument(uploaded)) {
      sendJson(res, 400, { error: "Upload a PDF, document, text file, or image." });
      return;
    }

    const storedName = `${crypto.randomUUID()}-${safeUploadName(uploaded.filename, "student-work")}`;
    const storedPath = path.join(UPLOAD_DIR, storedName);
    fs.writeFileSync(storedPath, uploaded.data);
    const now = new Date().toISOString();
    const aiEvidence = textEvidenceFromFile(storedPath, uploaded.contentType, uploaded.filename);
    const assignmentWork = assignmentWorkFor(store, auth.user.id, assignmentId);
    assignmentWork.documents.unshift({
      id: crypto.randomUUID(),
      name: uploaded.filename || "Student work",
      url: `/uploads/${storedName}`,
      type: uploaded.contentType || MIME_TYPES[path.extname(storedName).toLowerCase()] || "application/octet-stream",
      size: uploaded.data.length,
      createdAt: now,
      aiText: aiEvidence.text,
      aiReadStatus: aiEvidence.status,
    });
    assignmentWork.documents = assignmentWork.documents.slice(0, 12);
    resetWorkVerification(assignmentWork);
    assignmentWork.updatedAt = now;
    saveStore(store);

    sendJson(res, 201, { work: publicWork(store, auth.user.id), student: publicUser(auth.user) });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/work/drawing") {
    const auth = getSession(req, store);
    if (!auth) {
      sendJson(res, 401, { error: "Not authenticated." });
      return;
    }
    if (auth.user.role !== "student") {
      sendJson(res, 403, { error: "Only student accounts can save drawings." });
      return;
    }

    const { fields, files } = await readMultipartBody(req);
    const assignmentId = String(fields.assignmentId || "").trim();
    const uploaded = files.drawingFile;
    if (!assignmentId) {
      sendJson(res, 400, { error: "Choose an assignment first." });
      return;
    }
    if (!uploaded || !uploaded.data.length) {
      sendJson(res, 400, { error: "Draw some work before saving." });
      return;
    }
    if (!String(uploaded.contentType || "").startsWith("image/")) {
      sendJson(res, 400, { error: "Save the drawing as an image." });
      return;
    }

    const storedName = `${crypto.randomUUID()}-${safeUploadName(uploaded.filename, "math-work.png")}`;
    fs.writeFileSync(path.join(UPLOAD_DIR, storedName), uploaded.data);
    const now = new Date().toISOString();
    const assignmentWork = assignmentWorkFor(store, auth.user.id, assignmentId);
    assignmentWork.drawing = {
      id: crypto.randomUUID(),
      name: uploaded.filename || "Math drawing",
      url: `/uploads/${storedName}`,
      type: uploaded.contentType || "image/png",
      size: uploaded.data.length,
      createdAt: now,
    };
    resetWorkVerification(assignmentWork);
    assignmentWork.updatedAt = now;
    saveStore(store);

    sendJson(res, 201, { work: publicWork(store, auth.user.id), student: publicUser(auth.user) });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/work/submit") {
    const auth = getSession(req, store);
    if (!auth) {
      sendJson(res, 401, { error: "Not authenticated." });
      return;
    }
    if (auth.user.role !== "student") {
      sendJson(res, 403, { error: "Only student accounts can submit homework." });
      return;
    }

    const body = await readJsonBody(req);
    const assignmentId = String(body.assignmentId || "").trim();
    const comment = String(body.comment || "").trim().slice(0, 800);
    if (!assignmentId) {
      sendJson(res, 400, { error: "Choose an assignment first." });
      return;
    }

    const assignmentWork = assignmentWorkFor(store, auth.user.id, assignmentId);
    if (!hasSubmittableWork(assignmentWork)) {
      sendJson(res, 400, { error: "Save typed answers, a drawing, or uploaded work before submitting." });
      return;
    }
    const assignment = store.assignments.find((item) => item.id === assignmentId && assignmentVisibleToUser(item, auth.user));
    const teacher = assignment?.teacherId
      ? store.users.find((user) => user.id === assignment.teacherId && user.role === "teacher")
      : null;

    const now = new Date().toISOString();
    assignmentWork.submittedAt = now;
    assignmentWork.studentComment = comment;
    assignmentWork.verificationStatus = "submitted";
    delete assignmentWork.verifiedAt;
    delete assignmentWork.verifiedBy;
    delete assignmentWork.teacherFeedback;
    delete assignmentWork.grade;
    delete assignmentWork.gradeUpdatedAt;
    assignmentWork.updatedAt = now;
    if (teacher) {
      const messageParts = [
        `${auth.user.name || "A student"} submitted ${assignment.title || "an assignment"}.`,
        assignment.topic ? `Topic: ${assignment.topic}.` : "",
        comment ? `Student comment: ${comment}` : "",
        hasTypedAnswers(assignmentWork) ? "Typed answers are included." : "",
        hasWorkProof(assignmentWork) ? "Written work is attached." : "",
      ].filter(Boolean);
      addConversationMessage(store, auth.user.id, teacher.id, messageParts.join("\n"), now);
    }
    saveStore(store);

    sendJson(res, 200, { work: publicWork(store, auth.user.id), student: publicUser(auth.user), teacherMessaged: Boolean(teacher) });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/submissions/verify") {
    const auth = getSession(req, store);
    if (!auth) {
      sendJson(res, 401, { error: "Not authenticated." });
      return;
    }
    if (auth.user.role !== "teacher") {
      sendJson(res, 403, { error: "Only teacher accounts can verify submissions." });
      return;
    }

    const body = await readJsonBody(req);
    const studentId = String(body.studentId || "").trim();
    const assignmentId = String(body.assignmentId || "").trim();
    const verified = body.verified !== false;
    const feedback = String(body.feedback || "").trim().slice(0, 500);
    const rawGrade = String(body.grade ?? "").trim();
    const hasGrade = rawGrade !== "";
    const grade = hasGrade ? Number(rawGrade) : null;
    const student = store.users.find((user) => user.id === studentId && user.role === "student");
    if (!student || !assignmentId) {
      sendJson(res, 400, { error: "Choose a submitted student assignment." });
      return;
    }
    if (!teacherClassStudentIds(auth.user, store).includes(student.id)) {
      sendJson(res, 403, { error: "Add this student to your class before reviewing their work." });
      return;
    }

    const assignmentWork = assignmentWorkFor(store, student.id, assignmentId);
    if (!assignmentWork.submittedAt || !hasSubmittableWork(assignmentWork)) {
      sendJson(res, 400, { error: "The student needs to submit typed answers or written work first." });
      return;
    }
    if (hasGrade && (!Number.isFinite(grade) || grade < 0 || grade > 100)) {
      sendJson(res, 400, { error: "Enter a worksheet grade from 0 to 100." });
      return;
    }

    const now = new Date().toISOString();
    assignmentWork.verificationStatus = verified ? "verified" : "needs-correction";
    assignmentWork.verifiedAt = now;
    assignmentWork.verifiedBy = auth.user.id;
    assignmentWork.teacherFeedback = feedback || (verified ? "Verified by teacher." : "Please correct and resubmit.");
    if (verified && hasGrade) {
      assignmentWork.grade = Math.round(grade * 10) / 10;
      assignmentWork.gradeUpdatedAt = now;
    }
    if (!verified) {
      delete assignmentWork.grade;
      delete assignmentWork.gradeUpdatedAt;
    }
    assignmentWork.updatedAt = now;
    const assignment = store.assignments.find((item) => item.id === assignmentId);
    const assignmentTitle = assignment?.title || "your homework";
    if (assignment) {
      rememberTeacherGrade(store, auth.user, student, assignment, assignmentWork, verified, grade, assignmentWork.teacherFeedback, now);
    }
    const messageParts = [
      verified
        ? `Your teacher returned ${assignmentTitle} and marked it as verified.`
        : `Your teacher returned ${assignmentTitle} for corrections.`,
      verified && hasGrade ? `Grade: ${Math.round(grade * 10) / 10}%.` : "",
      assignmentWork.teacherFeedback ? `Teacher comment: ${assignmentWork.teacherFeedback}` : "",
    ].filter(Boolean);
    addConversationMessage(store, auth.user.id, student.id, messageParts.join("\n"), now);
    saveStore(store);

    const submissions = store.users
      .filter((user) => user.role === "student" && teacherClassStudentIds(auth.user, store).includes(user.id))
      .map((item) => ({
        student: publicUser(item),
        work: publicWork(store, item.id),
      }));
    sendJson(res, 200, { submissions, messageSent: true });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/ai/grade-feedback") {
    const auth = getSession(req, store);
    if (!auth) {
      sendJson(res, 401, { error: "Not authenticated." });
      return;
    }
    if (auth.user.role !== "teacher") {
      sendJson(res, 403, { error: "Only teacher accounts can update grading feedback." });
      return;
    }

    const body = await readJsonBody(req);
    const studentId = String(body.studentId || "").trim();
    const assignmentId = String(body.assignmentId || "").trim();
    const feedback = String(body.feedback || "").trim().slice(0, 800);
    const student = store.users.find((user) => user.id === studentId && user.role === "student");
    const assignment = store.assignments.find((item) => item.id === assignmentId && item.teacherId === auth.user.id);
    if (!student || !assignment) {
      sendJson(res, 400, { error: "Choose a returned student assignment." });
      return;
    }
    if (!teacherClassStudentIds(auth.user, store).includes(student.id)) {
      sendJson(res, 403, { error: "Add this student to your class before updating grading feedback." });
      return;
    }
    if (!feedback) {
      sendJson(res, 400, { error: "Write optional feedback first, or skip it." });
      return;
    }

    store.gradingMemory = Array.isArray(store.gradingMemory) ? store.gradingMemory : [];
    const memory = [...store.gradingMemory]
      .reverse()
      .find((item) =>
        item.teacherId === auth.user.id &&
        item.studentId === student.id &&
        item.assignmentId === assignment.id,
      );
    if (memory) {
      memory.optionalAiFeedback = feedback;
      memory.aiFeedbackUpdatedAt = new Date().toISOString();
    } else {
      const assignmentWork = assignmentWorkFor(store, student.id, assignmentId);
      const now = new Date().toISOString();
      const created = rememberTeacherGrade(
        store,
        auth.user,
        student,
        assignment,
        assignmentWork,
        assignmentWork.verificationStatus === "verified",
        Number(assignmentWork.grade),
        assignmentWork.teacherFeedback || "",
        now,
      );
      created.optionalAiFeedback = feedback;
      created.aiFeedbackUpdatedAt = now;
    }
    saveStore(store);
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/messages") {
    const auth = getSession(req, store);
    if (!auth) {
      sendJson(res, 401, { error: "Not authenticated." });
      return;
    }

    const body = await readJsonBody(req);
    const recipientId = String(body.recipientId || "").trim();
    const text = String(body.text || "").trim();
    const recipient = store.users.find((user) => user.id === recipientId);

    if (!recipient || recipient.id === auth.user.id) {
      sendJson(res, 400, { error: "Choose a valid recipient." });
      return;
    }
    if (!directoryUsersForUser(store, auth.user).some((user) => user.id === recipient.id)) {
      sendJson(res, 403, { error: "You can only message users connected to your account." });
      return;
    }
    if (!text) {
      sendJson(res, 400, { error: "Write a message before sending." });
      return;
    }
    if (text.length > 2000) {
      sendJson(res, 400, { error: "Messages must be 2,000 characters or fewer." });
      return;
    }

    const now = new Date().toISOString();
    const conversation = addConversationMessage(store, auth.user.id, recipient.id, text, now);

    saveStore(store);
    sendJson(res, 201, {
      conversation: publicConversation(conversation, auth.user, userMap(store)),
      conversations: conversationsForUser(store, auth.user),
    });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/messages/read") {
    const auth = getSession(req, store);
    if (!auth) {
      sendJson(res, 401, { error: "Not authenticated." });
      return;
    }

    const body = await readJsonBody(req);
    const conversationId = String(body.conversationId || "").trim();
    const shouldRead = body.read !== false;
    const conversation = store.messages.find(
      (item) => item.id === conversationId && item.participantIds.includes(auth.user.id),
    );
    if (!conversation) {
      sendJson(res, 404, { error: "Conversation not found." });
      return;
    }

    const readBy = new Set(conversation.readBy || []);
    if (shouldRead) readBy.add(auth.user.id);
    else readBy.delete(auth.user.id);
    conversation.readBy = [...readBy];
    conversation.hiddenFor = (conversation.hiddenFor || []).filter((userId) => userId !== auth.user.id);
    saveStore(store);

    sendJson(res, 200, {
      conversation: publicConversation(conversation, auth.user, userMap(store)),
      conversations: conversationsForUser(store, auth.user),
    });
    return;
  }

  if (req.method === "DELETE" && url.pathname === "/api/messages") {
    const auth = getSession(req, store);
    if (!auth) {
      sendJson(res, 401, { error: "Not authenticated." });
      return;
    }

    let changed = false;
    for (const conversation of store.messages) {
      if (!conversation.participantIds.includes(auth.user.id)) continue;
      const hiddenFor = new Set(conversation.hiddenFor || []);
      if (!hiddenFor.has(auth.user.id)) {
        hiddenFor.add(auth.user.id);
        conversation.hiddenFor = [...hiddenFor];
        changed = true;
      }
    }
    if (changed) saveStore(store);
    sendJson(res, 200, { ok: true, conversations: [] });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/auth/logout") {
    const auth = getSession(req, store);
    if (auth) {
      store.sessions = store.sessions.filter((session) => session.tokenHash !== auth.tokenHash);
      saveStore(store);
    }
    sendJson(res, 200, { ok: true }, { "Set-Cookie": sessionCookie("", 0) });
    return;
  }

  sendJson(res, 404, { error: "Not found." });
}

function serveStatic(req, res, url) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    sendText(res, 405, "Method not allowed");
    return;
  }

  const fileName = STATIC_FILES.get(url.pathname);
  if (!fileName) {
    sendText(res, 404, "Not found");
    return;
  }

  const filePath = path.join(ROOT, fileName);
  fs.readFile(filePath, (error, contents) => {
    if (error) {
      sendText(res, 404, "Not found");
      return;
    }
    res.writeHead(200, {
      "Content-Type": MIME_TYPES[path.extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    if (req.method === "HEAD") {
      res.end();
      return;
    }
    res.end(contents);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || `${HOST}:${PORT}`}`);

  if (url.pathname.startsWith("/uploads/")) {
    sendUpload(req, res, url);
    return;
  }

  if (url.pathname.startsWith("/api/")) {
    handleApi(req, res, url).catch((error) => {
      sendJson(res, error.status || 500, { error: error.message || "Server error." });
    });
    return;
  }

  serveStatic(req, res, url);
});

server.listen(PORT, HOST, () => {
  ensureStore();
  console.log(`MathBridge running at http://${HOST}:${PORT}`);
});
