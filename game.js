/*
    System.Two — Chapter 2

    if you're reading this...

    thank you
    for making
    my favorite developer
    smile.

    - CK
*/

"use strict";

const CONFIG = {
  playerName: "Two",
  authorName: "CK",
  memories: [
	"[SYSTEM LOG]\nBirthday gift executed successfully.\nUnexpected side effect detected:\nSubject fell in love even more.",
	"[SYSTEM LOG]\nSmile suppression failed.\nSubject smiled continuously\nfor an entire day. 😂",
    "Unexpected event detected.\nThree songs appeared before you found the words:\nไม่ขอบคุณ\nเพียงเธอ\nภวังค์.",
    "One birthday surprise.\nA smile that lasted all day.\n\nI still think about that smile.\nAnd I'm glad our story kept going."
  ],
  puzzleAnswer: "256",
  secretCommand: "Console.ReadLine();"
};

const state = {
  screen: "bootScreen",
  playerX: 5,
  collected: new Set(),
  movementTimer: null,
  dialogueIndex: 0,
  soundOn: true,
  instantText: false,
  secretUnlocked: false,
  achievementTimer: null,
  modalOpen: false,
  transitionLocked: false
};

const screens = [...document.querySelectorAll(".screen")];
const bootLog = document.getElementById("bootLog");
const startButton = document.getElementById("startButton");
const world = document.getElementById("world");
const player = document.getElementById("player");
const memoryNodes = [...document.querySelectorAll(".memory-node")];
const memoryModal = document.getElementById("memoryModal");
const memoryLabel = document.getElementById("memoryLabel");
const memoryText = document.getElementById("memoryText");
const closeMemory = document.getElementById("closeMemory");
const memoryCount = document.getElementById("memoryCount");
const buildButton = document.getElementById("buildButton");
const buildOutput = document.getElementById("buildOutput");
const dialogueText = document.getElementById("dialogueText");
const nextDialogue = document.getElementById("nextDialogue");
const puzzleAnswer = document.getElementById("puzzleAnswer");
const submitPuzzle = document.getElementById("submitPuzzle");
const puzzleResult = document.getElementById("puzzleResult");
const secretTerminal = document.getElementById("secretTerminal");
const secretCommand = document.getElementById("secretCommand");
const runSecret = document.getElementById("runSecret");
const secretResult = document.getElementById("secretResult");
const continueEnding = document.getElementById("continueEnding");
const endingText = document.getElementById("endingText");
const endingActions = document.getElementById("endingActions");
const continueButton = document.getElementById("continueButton");
const replayButton = document.getElementById("replayButton");
const achievement = document.getElementById("achievement");
const achievementName = document.getElementById("achievementName");
const soundToggle = document.getElementById("soundToggle");
const textToggle = document.getElementById("textToggle");
const moveLeft = document.getElementById("moveLeft");
const moveRight = document.getElementById("moveRight");

const dialogueLines = [
  "I thought this would be another battle.",
  "But there is no HP bar this time.",
  "No more fighting.\n\nJust stay.",
  "One year is not a perfect build.\nIt is a project we kept choosing to continue."
];

function showScreen(id) {
  screens.forEach(screen => screen.classList.toggle("active", screen.id === id));
  state.screen = id;
  window.setTimeout(() => {
    const active = document.getElementById(id);
    const focusable = active.querySelector("button, input, [tabindex]");
    if (focusable) focusable.focus({ preventScroll: true });
  }, 80);
}

function sleep(ms) {
  if (state.instantText) return Promise.resolve();
  return new Promise(resolve => window.setTimeout(resolve, ms));
}

async function typeText(element, text, speed = 28, append = false) {
  if (!append) element.textContent = "";
  const characters = [...text];
  for (let index = 0; index < characters.length; index += 1) {
    if (state.instantText) {
      element.textContent += characters.slice(index).join("");
      if (element === endingText) element.scrollTop = element.scrollHeight;
      break;
    }
    const char = characters[index];
    element.textContent += char;
    if (element === endingText) {
      element.scrollTop = element.scrollHeight;
    }
    if (char !== " " && char !== "\n") {
      playTone(620, 0.014, 0.015);
    }
    await sleep(speed);
  }
}

async function bootSequence() {
  const lines = [
    "> booting System.Two.Loader ...",
    "> searching previous installation ...",
    "> ✓ System.Two Chapter 1 detected",
    "> importing memories ...",
    "> ✓ Tara Villa Riverkwai Resort.",
    "> ✓ Birthday surprise.",
    "> ✓ Secret ending",
    "> ✓ One Smile that lasted all day",
    "",
    "> 365 days detected.",
    "> build target: Chapter 2",
    "",
    "> Built on the first \"Hello World.\""
  ];

  bootLog.textContent = "";

  for (const line of lines) {
    await typeText(bootLog, `${line}\n`, 18, true);
    await sleep(line === "" ? 100 : 170);
  }

  startButton.classList.remove("hidden");
  playSuccess();
}

function createParticles() {
  const host = document.getElementById("particles");
  for (let i = 0; i < 36; i += 1) {
    const particle = document.createElement("span");
    particle.className = "particle";
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDuration = `${7 + Math.random() * 12}s`;
    particle.style.animationDelay = `${-Math.random() * 14}s`;
    particle.style.opacity = `${0.12 + Math.random() * 0.38}`;
    host.appendChild(particle);
  }
}

function updatePlayer() {
  state.playerX = Math.max(1, Math.min(94, state.playerX));
  player.style.left = `${state.playerX}%`;
  checkMemoryCollision();
}

function movePlayer(delta) {
  if (state.screen !== "archiveScreen" || state.modalOpen) return;
  state.playerX += delta;
  updatePlayer();
}

function checkMemoryCollision() {
  if (state.screen !== "archiveScreen" || state.modalOpen) return;

  const playerRect = player.getBoundingClientRect();

  for (const node of memoryNodes) {
    const index = Number(node.dataset.memory);
    if (state.collected.has(index)) continue;

    const nodeRect = node.getBoundingClientRect();
    const overlaps =
      playerRect.right >= nodeRect.left &&
      playerRect.left <= nodeRect.right &&
      playerRect.bottom >= nodeRect.top &&
      playerRect.top <= nodeRect.bottom;

    if (overlaps) {
      openMemory(index);
      break;
    }
  }
}

function openMemory(index) {
  if (state.collected.has(index) || state.modalOpen) return;

  state.modalOpen = true;
  state.collected.add(index);
  memoryNodes[index].classList.add("collected");
  memoryLabel.textContent = `MEMORY #0${index + 1}`;
  memoryText.textContent = CONFIG.memories[index];
  memoryCount.textContent = String(state.collected.size);
  memoryModal.classList.remove("hidden");
  closeMemory.focus();
  playSuccess();

  if (state.collected.size === 1) {
    unlockAchievement("First Memory");
  }
}

function closeMemoryModal() {
  memoryModal.classList.add("hidden");
  state.modalOpen = false;

  if (state.collected.size === CONFIG.memories.length) {
    unlockAchievement("Memory Archive Complete");
    window.setTimeout(() => showScreen("debugScreen"), 750);
  } else {
    world.focus();
  }
}

function holdMovement(delta) {
  stopMovement();
  movePlayer(delta);
  state.movementTimer = window.setInterval(() => movePlayer(delta), 45);
}

function stopMovement() {
  if (state.movementTimer) {
    window.clearInterval(state.movementTimer);
    state.movementTimer = null;
  }
}

async function runBuild() {
  if (state.transitionLocked) return;
  state.transitionLocked = true;
  buildButton.disabled = true;

  const output = [
    "Build started: Project: System.Two, Configuration: Anniversary",
    "Restoring memories...",
    "Compiling honesty.dll...",
    "Linking 365Days.runtime...",
    "",
    "Build succeeded.",
    "0 Error(s)",
    "1 Warning(s)",
    "",
    "Warning ST365: Feelings were processed before logic."
  ];

  buildOutput.textContent = "";

  for (const line of output) {
    buildOutput.textContent += `${line}\n`;
    playTone(470, 0.02, 0.025);
    await sleep(220);
  }

  playSuccess();
  unlockAchievement("Build Succeeded");
  await sleep(1000);
  state.dialogueIndex = 0;
  showScreen("dialogueScreen");
  await showDialogueLine();
  state.transitionLocked = false;
}

async function showDialogueLine() {
  nextDialogue.disabled = true;
  await typeText(dialogueText, dialogueLines[state.dialogueIndex], 32);
  nextDialogue.disabled = false;
  nextDialogue.textContent =
    state.dialogueIndex === dialogueLines.length - 1 ? "OPEN CALLBACK" : "CONTINUE";
}

async function advanceDialogue() {
  if (nextDialogue.disabled) return;

  if (state.dialogueIndex < dialogueLines.length - 1) {
    state.dialogueIndex += 1;
    await showDialogueLine();
    return;
  }

  showScreen("puzzleScreen");
  puzzleAnswer.focus();
}

function normalizeCommand(value) {
  return value.replace(/\s+/g, "").toLowerCase();
}

function checkPuzzle() {
  const answer = puzzleAnswer.value.trim();

  if (answer === CONFIG.puzzleAnswer) {
    puzzleResult.textContent = "✓ Callback accepted. 256 = 2⁸.";
    puzzleResult.style.color = "var(--good)";
    secretTerminal.classList.remove("hidden");
    submitPuzzle.disabled = true;
    puzzleAnswer.disabled = true;
    unlockAchievement("Power of Two");
    playSuccess();
    secretCommand.focus();
  } else {
    puzzleResult.textContent =
      "✗ Build failed. The range is 1..32. Filter by even. Count. Then square.";
    puzzleResult.style.color = "var(--danger)";
    playError();
  }
}

async function checkSecret() {
  if (state.secretUnlocked) return;
  const input = normalizeCommand(secretCommand.value);
  const expected = normalizeCommand(CONFIG.secretCommand);

  if (input === expected) {
    state.secretUnlocked = true;
    runSecret.disabled = true;
    secretCommand.disabled = true;
    continueEnding.disabled = true;
    continueEnding.textContent = "RESTORING MEMORIES...";
    secretResult.style.color = "var(--good)";

    const restoreOutput = [
      "Listening...",
      "",
      "> Previous memory detected.",
      "Input Buffer:",
      "29051991",
      "",
      "Source:",
      "Chapter 1",
      "> Restoring...",
      "✓ Birthday memory restored.",
      "",
      "> New memory detected.",
      "Input Buffer:",
      "2211",
      "",
      "Source:",
      "Our Anniversary"
    ];

    secretResult.textContent = "";
    for (const line of restoreOutput) {
      secretResult.textContent += `${line}\n`;
      scrollSecretOutput();
      if (line) playTone(470, 0.02, 0.025);
      await sleep(line ? 900 : 350);
    }

    secretResult.textContent += "\n✓ Anniversary memory restored.\nStill listening. 💙";
    playSuccess();
    unlockAchievement("Still Listening");
    continueEnding.textContent = "CONTINUE TO OUR ENDING 💙";
    continueEnding.disabled = false;
    scrollSecretOutput();
    continueEnding.focus({ preventScroll: true });
  } else {
    secretResult.style.color = "var(--danger)";
    secretResult.textContent = "Last time, you wrote something.\nThis time, I'm listening.\n\nHint: Which Console method reads a line?";
    playError();
  }
}

function scrollSecretOutput() {
  const panel = secretResult.closest(".puzzle");
  panel.scrollTop = panel.scrollHeight;
}

async function startEnding(secret) {
  if (state.transitionLocked) return;
  state.transitionLocked = true;
  showScreen("endingScreen");
  endingActions.classList.add("hidden");

  const normalEnding = [
    "ACHIEVEMENT UNLOCKED",
    "",
    "365 DAYS",
    "",
    "From Chapter 1",
    "you defeated System.Two.",
    "",
    "From Chapter 2",
    "you never had to.",
    "",
    "Some stories do not become better",
    "because they become bigger.",
    "",
    "They become better",
    "because someone chooses",
    "to continue them.",
    "",
    "Happy One Year.",
    "",
    `— ${CONFIG.authorName} 💙`
  ].join("\n");

  const secretEnding = [
    "> Console.ReadLine();",
    "",
    "> Listening...",
    "",
    "> Connection stays open.",
    "",
    "I'm still listening.",
    "",
    "You are seen.",
    "You are understood.",
    "And you are loved",
    "in the language you know best.",
    "",
    "From Chapter 1",
    "you defeated System.Two.",
    "",
    "From Chapter 2",
    "there was nothing to defeat.",
    "",
    `Happy One Year, ${CONFIG.playerName}.`,
    "",
    `— ${CONFIG.authorName} 💙`
  ].join("\n");

  await typeText(endingText, secret ? secretEnding : normalEnding, 34);
  endingActions.classList.remove("hidden");
  saveCompletion(secret);
  unlockAchievement(secret ? "True Ending" : "365 Days");
  state.transitionLocked = false;
}

async function continueChapter() {
  endingActions.classList.add("hidden");
  const continuation = [
    "",
    "",
    "> checking future...",
    "> status: unknown",
    "",
    "> continue?",
    "> Y",
    "",
    "> saving...",
    "> save completed.",
    "",
    "No rush.",
    "",
    "Let's keep writing",
    "the next chapter",
    "together."
  ].join("\n");

  await typeText(endingText, continuation, 36, true);
  endingActions.classList.remove("hidden");
  continueButton.classList.add("hidden");
  unlockAchievement("Still Here");
}

function replay() {
  try {
    localStorage.removeItem("systemTwoChapter2Session");
  } catch (error) {
    console.warn("Could not clear completion state.", error);
  }
  window.location.reload();
}

function saveCompletion(secret) {
  try {
    localStorage.setItem(
      "systemTwoChapter2Session",
      JSON.stringify({
        completed: true,
        secret,
        completedAt: new Date().toISOString()
      })
    );
  } catch (error) {
    console.warn("Could not save completion state.", error);
  }
}

function unlockAchievement(name) {
  if (state.achievementTimer) {
    window.clearTimeout(state.achievementTimer);
  }

  achievementName.textContent = name;
  achievement.classList.remove("hidden");
  state.achievementTimer = window.setTimeout(() => {
    achievement.classList.add("hidden");
  }, 3300);
}

let audioContext = null;

function getAudioContext() {
  if (!state.soundOn) return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;

  if (!audioContext) {
    audioContext = new AudioContextClass();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume().catch(() => {});
  }

  return audioContext;
}

function playTone(frequency, duration = 0.05, volume = 0.03, type = "square") {
  const context = getAudioContext();
  if (!context) return;

  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.value = volume;

  oscillator.connect(gain);
  gain.connect(context.destination);

  const now = context.currentTime;
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  oscillator.start(now);
  oscillator.stop(now + duration);
}

function playSuccess() {
  playTone(523, 0.08, 0.035, "sine");
  window.setTimeout(() => playTone(659, 0.09, 0.03, "sine"), 90);
  window.setTimeout(() => playTone(784, 0.12, 0.025, "sine"), 185);
}

function playError() {
  playTone(180, 0.12, 0.04, "sawtooth");
  window.setTimeout(() => playTone(120, 0.14, 0.03, "sawtooth"), 90);
}

function toggleSound() {
  state.soundOn = !state.soundOn;
  soundToggle.textContent = `SOUND: ${state.soundOn ? "ON" : "OFF"}`;
  if (state.soundOn) playSuccess();
}

function handleKeyDown(event) {
  if (state.modalOpen && event.code === "Tab") {
    event.preventDefault();
    closeMemory.focus();
    return;
  }
  const targetIsInput =
    event.target instanceof HTMLInputElement ||
    event.target instanceof HTMLTextAreaElement;

  if (state.screen === "archiveScreen" && !targetIsInput && !state.modalOpen) {
    if (event.code === "ArrowLeft" || event.code === "KeyA") {
      event.preventDefault();
      movePlayer(-2.2);
    }

    if (event.code === "ArrowRight" || event.code === "KeyD") {
      event.preventDefault();
      movePlayer(2.2);
    }
  }

  if (event.code === "Enter") {
    if (state.screen === "puzzleScreen" && document.activeElement === puzzleAnswer) {
      checkPuzzle();
    } else if (
      state.screen === "puzzleScreen" &&
      document.activeElement === secretCommand
    ) {
      checkSecret();
    }
  }
}

function bindEvents() {
  startButton.addEventListener("click", () => {
    getAudioContext();
    showScreen("archiveScreen");
    world.focus();
    unlockAchievement("Chapter 2 Started");
  });

  closeMemory.addEventListener("click", closeMemoryModal);

  memoryNodes.forEach((node, index) => {
    node.addEventListener("click", () => openMemory(index));
  });

  buildButton.addEventListener("click", runBuild);
  nextDialogue.addEventListener("click", advanceDialogue);
  submitPuzzle.addEventListener("click", checkPuzzle);
  runSecret.addEventListener("click", checkSecret);
  continueEnding.addEventListener("click", () => {
    if (!continueEnding.disabled) startEnding(state.secretUnlocked);
  });
  continueButton.addEventListener("click", continueChapter);
  replayButton.addEventListener("click", replay);
  soundToggle.addEventListener("click", toggleSound);
  textToggle.addEventListener("click", () => {
    state.instantText = !state.instantText;
    textToggle.textContent = state.instantText ? "TEXT: INSTANT" : "TEXT: ANIMATED";
    textToggle.setAttribute("aria-pressed", String(state.instantText));
  });
  document.addEventListener("keydown", handleKeyDown);

  const pressEvents = ["pointerdown"];
  const releaseEvents = ["pointerup", "pointercancel", "pointerleave"];

  pressEvents.forEach(name => {
    moveLeft.addEventListener(name, event => {
      event.preventDefault();
      holdMovement(-1.6);
    });
    moveRight.addEventListener(name, event => {
      event.preventDefault();
      holdMovement(1.6);
    });
  });

  releaseEvents.forEach(name => {
    moveLeft.addEventListener(name, stopMovement);
    moveRight.addEventListener(name, stopMovement);
  });

  window.addEventListener("blur", stopMovement);
}

createParticles();
bindEvents();
bootSequence();
