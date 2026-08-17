import { clampInteger } from "./settings.js";
import { arabesqueMeasures, getArabesqueSequence } from "./arabesqueData.js";
import { getCopy } from "./i18n.js";

export const ids = [
  "playButton",
  "bpmRange",
  "bpmNumber",
  "beatsPerBar",
  "beatUnit",
  "polyrhythmView",
  "metronomeView",
  "arabesqueView",
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
  "arabesqueStartMeasure",
  "arabesqueLoopMeasures",
  "arabesqueTimeline",
  "arabesquePlayhead",
  "arabesqueLabel",
  "arabesqueRatioLabel",
];

export function getUi() {
  const ui = Object.fromEntries(ids.map((id) => [id, document.getElementById(id)]));
  const missingIds = ids.filter((id) => !ui[id]);
  if (missingIds.length) {
    throw new Error(`Missing UI elements: ${missingIds.join(", ")}`);
  }

  return ui;
}

export function initializeUi(ui) {
  populateArabesqueMeasures(ui);
}

export function setPlayState(ui, isPlaying) {
  const copy = getCopy();
  ui.playButton.classList.toggle("is-playing", isPlaying);
  ui.playButton.textContent = isPlaying ? copy.pause : copy.play;
  ui.playButton.setAttribute("aria-pressed", String(isPlaying));
}

export function setPlayhead(ui, progress) {
  ui.playhead.style.transform = `translateX(${progress * ui.combinedTimeline.clientWidth}px)`;
  ui.metronomePlayhead.style.transform = `translateX(${progress * ui.metronomeTimeline.clientWidth}px)`;
  ui.arabesquePlayhead.style.transform = `translateX(${progress * ui.arabesqueTimeline.clientWidth}px)`;
}

export function renderAll(ui, settings) {
  const copy = getCopy();
  const isMetronome = settings.appMode === "metronome";
  const isArabesque = settings.appMode === "arabesque";
  ui.polyrhythmView.classList.toggle("is-active", !isMetronome && !isArabesque);
  ui.metronomeView.classList.toggle("is-active", isMetronome);
  ui.arabesqueView.classList.toggle("is-active", isArabesque);

  populateArabesqueMeasures(ui);
  renderLane(ui.rightTimeline, settings.right, true);
  renderLane(ui.leftTimeline, settings.left, false);
  renderCombined(ui, settings);
  renderMetronome(ui, settings);
  renderArabesque(ui, settings);

  ui.ratioLabel.value = copy.ratio(settings.right.count, settings.left.count);
  ui.cycleLabel.textContent =
    settings.cycleMode === "beat"
      ? copy.cycleBeat(settings.right.count, settings.left.count)
      : copy.cycleBar(settings.right.count, settings.left.count);
}

function populateArabesqueMeasures(ui) {
  if (ui.arabesqueStartMeasure.options.length === arabesqueMeasures.length) {
    return;
  }

  const selected = ui.arabesqueStartMeasure.dataset.pendingValue || ui.arabesqueStartMeasure.value;
  ui.arabesqueStartMeasure.replaceChildren();
  arabesqueMeasures.forEach((measure) => {
    const option = document.createElement("option");
    option.value = String(measure.number);
    option.textContent = getCopy().measure(measure.number);
    ui.arabesqueStartMeasure.append(option);
  });

  if (Array.from(ui.arabesqueStartMeasure.options).some((option) => option.value === selected)) {
    ui.arabesqueStartMeasure.value = selected;
  }
  delete ui.arabesqueStartMeasure.dataset.pendingValue;
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
  const copy = getCopy();
  const oldDots = ui.combinedTimeline.querySelectorAll(".combined-dot");
  oldDots.forEach((dot) => dot.remove());

  const rightCount = clampInteger(settings.right.count, 1, 32);
  const leftCount = clampInteger(settings.left.count, 1, 32);
  const rightPositions = activePositions(settings.right);
  const leftPositions = activePositions(settings.left);

  rightPositions.forEach((position, index) => {
    addCombinedDot(ui, position, "right", "34%", `${copy.rightShort}${index + 1}`, coincides(position, leftPositions));
  });

  leftPositions.forEach((position, index) => {
    addCombinedDot(ui, position, "left", "66%", `${copy.leftShort}${index + 1}`, coincides(position, rightPositions));
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
  const copy = getCopy();
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
  ui.metronomeRatioLabel.value = copy.beats(settings.beatsPerBar);
  ui.metronomeTimeline.style.backgroundSize = `${100 / totalSteps}% 100%, auto`;
}

function renderArabesque(ui, settings) {
  const copy = getCopy();
  const oldDots = ui.arabesqueTimeline.querySelectorAll(".arabesque-dot, .measure-line");
  oldDots.forEach((dot) => dot.remove());

  const measures = getArabesqueSequence(settings.arabesque.startMeasure, settings.arabesque.loopMeasures);
  const totalBeats = measures.reduce((sum, measure) => sum + measure.beats, 0);
  let beatCursor = 0;

  measures.forEach((measure) => {
    addMeasureLine(ui, beatCursor / totalBeats, copy.measure(measure.number));

    measure.right.forEach((beatOffset, index) => {
      addArabesqueDot(ui, (beatCursor + beatOffset) / totalBeats, "right", "34%", `${copy.rightShort}${index + 1}`);
    });

    measure.left.forEach((beatOffset, index) => {
      addArabesqueDot(ui, (beatCursor + beatOffset) / totalBeats, "left", "66%", `${copy.leftShort}${index + 1}`);
    });

    beatCursor += measure.beats;
  });

  ui.arabesqueLabel.textContent = copy.arabesqueRange(measures[0].number, measures[measures.length - 1].number);
  ui.arabesqueRatioLabel.value = copy.measures(measures.length);
  ui.arabesqueTimeline.style.backgroundSize = `${100 / Math.max(1, totalBeats)}% 100%, auto, auto`;
}

function addArabesqueDot(ui, position, side, y, label) {
  const dot = document.createElement("span");
  dot.className = `arabesque-dot ${side}`;
  dot.style.setProperty("--x", String(position * 100));
  dot.style.setProperty("--y", y);
  dot.dataset.label = label;
  ui.arabesqueTimeline.append(dot);
}

function addMeasureLine(ui, position, label) {
  const line = document.createElement("span");
  line.className = "measure-line";
  line.style.setProperty("--x", String(position * 100));
  line.dataset.label = label;
  ui.arabesqueTimeline.append(line);
}
