export const STORAGE_KEY = "polypulse-settings-v1";

export function clampInteger(value, min, max) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    return min;
  }

  return Math.min(max, Math.max(min, parsed));
}

export function readSettings(ui) {
  const bpm = clampInteger(ui.bpmNumber.value, 30, 240);
  const beatsPerBar = clampInteger(ui.beatsPerBar.value, 1, 16);

  return {
    appMode: getActiveSegment("[data-app-mode]", "appMode") || "poly",
    bpm,
    beatsPerBar,
    beatUnit: ui.beatUnit.value,
    cycleMode: ui.cycleMode.value,
    meterEnabled: ui.meterEnabled.checked,
    playMode: getActiveSegment("[data-play-mode]", "playMode") || "both",
    right: {
      count: clampInteger(ui.rightCount.value, 1, 32),
      sound: ui.rightSound.value,
    },
    left: {
      count: clampInteger(ui.leftCount.value, 1, 32),
      sound: ui.leftSound.value,
    },
    metronome: {
      subdivision: clampInteger(ui.metronomeSubdivision.value, 1, 8),
      sound: ui.metronomeSound.value,
      accentDownbeat: ui.metronomeAccent.checked,
    },
    arabesque: {
      startMeasure: clampInteger(ui.arabesqueStartMeasure.value, 1, 200),
      loopMeasures: clampInteger(ui.arabesqueLoopMeasures.value, 1, 16),
    },
  };
}

export function saveSettings(ui) {
  const settings = readSettings(ui);

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      appMode: settings.appMode,
      bpm: settings.bpm,
      beatsPerBar: settings.beatsPerBar,
      beatUnit: settings.beatUnit,
      cycleMode: settings.cycleMode,
      meterEnabled: settings.meterEnabled,
      playMode: settings.playMode,
      rightCount: settings.right.count,
      rightSound: settings.right.sound,
      leftCount: settings.left.count,
      leftSound: settings.left.sound,
      metronomeSubdivision: settings.metronome.subdivision,
      metronomeSound: settings.metronome.sound,
      metronomeAccent: settings.metronome.accentDownbeat,
      arabesqueStartMeasure: settings.arabesque.startMeasure,
      arabesqueLoopMeasures: settings.arabesque.loopMeasures,
    }),
  );
}

export function loadSettings(ui) {
  const rawSettings = window.localStorage.getItem(STORAGE_KEY);
  if (!rawSettings) {
    return;
  }

  try {
    const settings = JSON.parse(rawSettings);
    setInputValue(ui.bpmRange, settings.bpm);
    setInputValue(ui.bpmNumber, settings.bpm);
    setInputValue(ui.beatsPerBar, settings.beatsPerBar);
    setInputValue(ui.beatUnit, settings.beatUnit);
    setInputValue(ui.cycleMode, settings.cycleMode);
    setInputValue(ui.rightCount, settings.rightCount);
    setInputValue(ui.rightSound, settings.rightSound);
    setInputValue(ui.leftCount, settings.leftCount);
    setInputValue(ui.leftSound, settings.leftSound);
    setInputValue(ui.metronomeSubdivision, settings.metronomeSubdivision);
    setInputValue(ui.metronomeSound, settings.metronomeSound);
    setInputValue(ui.arabesqueStartMeasure, settings.arabesqueStartMeasure);
    setInputValue(ui.arabesqueLoopMeasures, settings.arabesqueLoopMeasures);
    ui.meterEnabled.checked = Boolean(settings.meterEnabled);
    ui.metronomeAccent.checked = settings.metronomeAccent !== false;
    setSegmentedSelection("[data-app-mode]", "appMode", settings.appMode || "poly");
    setSegmentedSelection("[data-play-mode]", "playMode", settings.playMode || "both");
    syncTempo(ui, ui.bpmNumber);
  } catch (error) {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

export function syncTempo(ui, source) {
  const value = clampInteger(source.value, 30, 240);
  ui.bpmRange.value = String(Math.min(180, value));
  ui.bpmNumber.value = String(value);
}

export function setSegmentedSelection(selector, datasetKey, value) {
  const buttons = Array.from(document.querySelectorAll(selector));
  const nextValue = buttons.some((button) => button.dataset[datasetKey] === value)
    ? value
    : buttons[0]?.dataset[datasetKey];

  buttons.forEach((button) => {
    const isSelected = button.dataset[datasetKey] === nextValue;
    button.classList.toggle("is-active", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });
}

function getActiveSegment(selector, datasetKey) {
  return document.querySelector(`${selector}.is-active`)?.dataset[datasetKey];
}

function setInputValue(input, value) {
  if (value === undefined || value === null) {
    return;
  }

  const nextValue = String(value);
  if (
    input.tagName === "SELECT" &&
    input.options.length > 0 &&
    !Array.from(input.options).some((option) => option.value === nextValue)
  ) {
    return;
  }

  if (input.tagName === "SELECT" && input.options.length === 0) {
    input.dataset.pendingValue = nextValue;
  }

  input.value = nextValue;
}
