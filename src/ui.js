import { clampInteger } from "./settings.js";

export const ids = [
  "playButton",
  "bpmRange",
  "bpmNumber",
  "beatsPerBar",
  "beatUnit",
  "polyrhythmView",
  "metronomeView",
  "cycleMode",
  "meterEnabled",
  "rightCount",
  "rightSound",
  "leftCount",
  "leftSound",
  "rightTimeline",
  "leftTimeline",
  "combinedTimeline",
  "playhead",
  "cycleLabel",
  "ratioLabel",
  "metronomeSubdivision",
  "metronomeSound",
  "metronomeAccent",
  "metronomeTimeline",
  "metronomePlayhead",
  "metronomeLabel",
  "metronomeRatioLabel",
];

export function getUi() {
  const ui = Object.fromEntries(ids.map((id) => [id, document.getElementById(id)]));
  const missingIds = ids.filter((id) => !ui[id]);
  if (missingIds.length) {
    throw new Error(`Missing UI elements: ${missingIds.join(", ")}`);
  }

  return ui;
}

export function setPlayState(ui, isPlaying) {
  ui.playButton.classList.toggle("is-playing", isPlaying);
  ui.playButton.textContent = isPlaying ? "一時停止" : "再生";
  ui.playButton.setAttribute("aria-pressed", String(isPlaying));
}

export function setPlayhead(ui, progress) {
  ui.playhead.style.transform = `translateX(${progress * ui.combinedTimeline.clientWidth}px)`;
  ui.metronomePlayhead.style.transform = `translateX(${progress * ui.metronomeTimeline.clientWidth}px)`;
}

export function renderAll(ui, settings) {
  const isMetronome = settings.appMode === "metronome";
  ui.polyrhythmView.classList.toggle("is-active", !isMetronome);
  ui.metronomeView.classList.toggle("is-active", isMetronome);

  renderLane(ui.rightTimeline, settings.right, true);
  renderLane(ui.leftTimeline, settings.left, false);
  renderCombined(ui, settings);
  renderMetronome(ui, settings);

  ui.ratioLabel.value = `右${settings.right.count} / 左${settings.left.count}`;
  ui.cycleLabel.textContent =
    settings.cycleMode === "beat"
      ? `1拍の中の ${settings.right.count} : ${settings.left.count}`
      : `1小節の中の ${settings.right.count} : ${settings.left.count}`;
}

function renderLane(container, lane, isRight) {
  container.replaceChildren();
  const count = clampInteger(lane.count, 1, 32);

  for (let step = 0; step < count; step += 1) {
    const dot = document.createElement("span");
    dot.className = "timeline-dot";
    dot.style.setProperty("--x", String((step / count) * 100));
    dot.dataset.label = String(step + 1);
    dot.classList.toggle("right", isRight);
    container.append(dot);
  }
}

function renderCombined(ui, settings) {
  const oldDots = ui.combinedTimeline.querySelectorAll(".combined-dot");
  oldDots.forEach((dot) => dot.remove());

  const rightCount = clampInteger(settings.right.count, 1, 32);
  const leftCount = clampInteger(settings.left.count, 1, 32);
  const rightPositions = activePositions(settings.right);
  const leftPositions = activePositions(settings.left);

  rightPositions.forEach((position, index) => {
    addCombinedDot(ui, position, "right", "34%", `R${index + 1}`, coincides(position, leftPositions));
  });

  leftPositions.forEach((position, index) => {
    addCombinedDot(ui, position, "left", "66%", `L${index + 1}`, coincides(position, rightPositions));
  });

  ui.combinedTimeline.style.backgroundSize = `${100 / Math.max(rightCount, leftCount)}% 100%, auto, auto`;
}

function activePositions(lane) {
  const count = clampInteger(lane.count, 1, 32);
  const positions = [];

  for (let step = 0; step < count; step += 1) {
    positions.push(step / count);
  }

  return positions;
}

function coincides(position, positions) {
  return positions.some((candidate) => Math.abs(candidate - position) < 0.0001);
}

function addCombinedDot(ui, position, side, y, label, isCoincident) {
  const dot = document.createElement("span");
  dot.className = `combined-dot ${side}`;
  dot.style.setProperty("--x", String(position * 100));
  dot.style.setProperty("--y", y);
  dot.dataset.label = label;
  dot.classList.toggle("coincides", isCoincident);
  ui.combinedTimeline.append(dot);
}

function renderMetronome(ui, settings) {
  const oldDots = ui.metronomeTimeline.querySelectorAll(".metronome-dot");
  oldDots.forEach((dot) => dot.remove());

  const subdivision = clampInteger(settings.metronome.subdivision, 1, 8);
  const totalSteps = settings.beatsPerBar * subdivision;
  const subdivisionLabel = ui.metronomeSubdivision.options[ui.metronomeSubdivision.selectedIndex]?.text || `${subdivision}分割`;

  for (let step = 0; step < totalSteps; step += 1) {
    const dot = document.createElement("span");
    const isBeat = step % subdivision === 0;
    const isDownbeat = step === 0;
    dot.className = "metronome-dot";
    dot.style.setProperty("--x", String((step / totalSteps) * 100));
    dot.dataset.label = isBeat ? String(step / subdivision + 1) : "";
    dot.classList.toggle("beat", isBeat);
    dot.classList.toggle("downbeat", isDownbeat);
    ui.metronomeTimeline.append(dot);
  }

  ui.metronomeLabel.textContent = `${settings.beatsPerBar}/${settings.beatUnit}・${subdivisionLabel}`;
  ui.metronomeRatioLabel.value = `${settings.beatsPerBar}拍`;
  ui.metronomeTimeline.style.backgroundSize = `${100 / totalSteps}% 100%, auto`;
}
