import { RhythmEngine } from "./rhythmEngine.js";
import { getUi, initializeUi, renderAll, setPlayhead, setPlayState } from "./ui.js";
import { loadSettings, readSettings, saveSettings, setSegmentedSelection, syncTempo } from "./settings.js";

const ui = getUi();
initializeUi(ui);
const engine = new RhythmEngine(() => readSettings(ui), {
  onStop: () => {
    setPlayState(ui, false);
    setPlayhead(ui, 0, readSettings(ui));
  },
});

let animationFrame = 0;

function renderCurrentSettings() {
  renderAll(ui, readSettings(ui));
}

function handleSettingsChange() {
  renderCurrentSettings();
  saveSettings(ui);
  engine.resyncToCurrentSettings();
}

function animate() {
  setPlayhead(ui, engine.getCycleProgress(), readSettings(ui));
  animationFrame = window.requestAnimationFrame(animate);
}

ui.playButton.addEventListener("click", async () => {
  if (engine.isPlaying) {
    engine.stop();
    return;
  }

  await engine.start();
  setPlayState(ui, true);
});

ui.bpmRange.addEventListener("input", () => {
  syncTempo(ui, ui.bpmRange);
  handleSettingsChange();
});

ui.bpmNumber.addEventListener("input", () => {
  syncTempo(ui, ui.bpmNumber);
  handleSettingsChange();
});

document.querySelectorAll("input, select").forEach((control) => {
  if (control === ui.bpmRange || control === ui.bpmNumber) {
    return;
  }

  control.addEventListener("input", handleSettingsChange);
  control.addEventListener("change", handleSettingsChange);
});

document.querySelectorAll("[data-play-mode]").forEach((button) => {
  button.addEventListener("click", () => {
    setSegmentedSelection("[data-play-mode]", "playMode", button.dataset.playMode);
    saveSettings(ui);
    engine.resyncToCurrentSettings();
  });
});

document.querySelectorAll("[data-app-mode]").forEach((button) => {
  button.addEventListener("click", () => {
    setSegmentedSelection("[data-app-mode]", "appMode", button.dataset.appMode);
    handleSettingsChange();
  });
});

ui.arabesqueScoreLayer.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-measure]");
  if (!button) {
    return;
  }

  setSegmentedSelection("[data-app-mode]", "appMode", "arabesque");
  ui.arabesqueStartMeasure.value = button.dataset.measure;
  handleSettingsChange();
  await engine.start();
  setPlayState(ui, true);
});

window.addEventListener("resize", () => setPlayhead(ui, engine.getCycleProgress(), readSettings(ui)));
window.addEventListener("beforeunload", () => {
  engine.stop(false);
  window.cancelAnimationFrame(animationFrame);
});

const isLocalPreview = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);

if ("serviceWorker" in navigator && isLocalPreview) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => registration.unregister());
  });
} else if ("serviceWorker" in navigator && window.location.protocol.startsWith("http")) {
  navigator.serviceWorker.register(new URL("../service-worker.js", import.meta.url)).catch(() => {});
}

loadSettings(ui);
renderCurrentSettings();
animate();
