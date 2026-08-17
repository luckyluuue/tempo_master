import { getArabesqueSequence } from "./arabesqueData.js";

export function getBeatDuration(settings) {
  return 60 / settings.bpm;
}

export function getCycleDuration(settings) {
  const beatDuration = getBeatDuration(settings);
  if (settings.appMode === "arabesque") {
    return getArabesqueSequence(settings.arabesque.startMeasure).reduce(
      (duration, measure) => duration + measure.beats * beatDuration,
      0,
    );
  }

  if (settings.appMode === "metronome") {
    return beatDuration * settings.beatsPerBar;
  }

  return settings.cycleMode === "bar" ? beatDuration * settings.beatsPerBar : beatDuration;
}
