import { clampInteger } from "./settings.js";
import { getArabesqueSequence } from "./arabesqueData.js";
import { soundProfiles } from "./soundProfiles.js";
import { getBeatDuration, getCycleDuration } from "./timing.js";

export class RhythmEngine {
  constructor(getSettings, callbacks = {}) {
    this.getSettings = getSettings;
    this.callbacks = callbacks;
    this.audioContext = null;
    this.timer = null;
    this.isPlaying = false;
    this.startTime = 0;
    this.nextCycleStart = 0;
    this.cycleIndex = 0;
    this.cycleDuration = 0;
    this.scheduledTicks = [];
    this.lookaheadMs = 24;
    this.scheduleAheadSec = 0.16;
  }

  async ensureContext() {
    if (!this.audioContext) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContextClass();
    }

    if (this.audioContext.state === "suspended") {
      await this.audioContext.resume();
    }
  }

  async start() {
    await this.ensureContext();
    this.stop(false);

    const now = this.audioContext.currentTime;
    const settings = this.getSettings();
    this.isPlaying = true;
    this.startTime = now + 0.08;
    this.nextCycleStart = this.startTime;
    this.cycleIndex = 0;
    this.cycleDuration = getCycleDuration(settings);
    this.timer = window.setInterval(() => this.scheduler(), this.lookaheadMs);
    this.scheduler();
  }

  stop(resetUi = true) {
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = null;
    }

    this.isPlaying = false;
    this.cancelScheduledTicks(-Infinity);
    if (resetUi) {
      this.callbacks.onStop?.();
    }
  }

  resyncToCurrentSettings() {
    if (!this.audioContext || !this.isPlaying) {
      return;
    }

    const now = this.audioContext.currentTime;
    const progress = this.getCycleProgress();
    const settings = this.getSettings();
    const nextCycleDuration = getCycleDuration(settings);

    this.cancelScheduledTicks(now + 0.006);
    this.cycleDuration = nextCycleDuration;
    this.startTime = now - progress * nextCycleDuration;
    this.cycleIndex = Math.floor(Math.max(0, (now - this.startTime) / nextCycleDuration));
    this.nextCycleStart = this.startTime + this.cycleIndex * nextCycleDuration;
    this.scheduler();
  }

  scheduler() {
    if (!this.audioContext || !this.isPlaying) {
      return;
    }

    const settings = this.getSettings();
    this.cycleDuration = getCycleDuration(settings);
    const horizon = this.audioContext.currentTime + this.scheduleAheadSec;
    const minTime = this.audioContext.currentTime + 0.012;

    while (this.nextCycleStart < horizon) {
      this.scheduleCycle(this.nextCycleStart, this.cycleDuration, settings, this.cycleIndex, minTime);
      this.nextCycleStart += this.cycleDuration;
      this.cycleIndex += 1;
    }
  }

  scheduleCycle(cycleStart, cycleDuration, settings, cycleIndex, minTime = -Infinity) {
    if (settings.appMode === "arabesque") {
      this.scheduleArabesque(cycleStart, settings, minTime);
      return;
    }

    if (settings.appMode === "metronome") {
      this.scheduleMetronome(cycleStart, settings, minTime);
      return;
    }

    if (settings.playMode !== "left") {
      this.scheduleLane(settings.right, cycleStart, cycleDuration, true, minTime);
    }

    if (settings.playMode !== "right") {
      this.scheduleLane(settings.left, cycleStart, cycleDuration, false, minTime);
    }

    if (settings.meterEnabled && settings.playMode === "both") {
      this.scheduleMeter(cycleStart, settings, minTime);
    }
  }

  scheduleLane(lane, cycleStart, cycleDuration, isRight, minTime) {
    const count = clampInteger(lane.count, 1, 32);
    for (let step = 0; step < count; step += 1) {
      const time = cycleStart + (cycleDuration * step) / count;
      if (time < minTime) {
        continue;
      }

      const profile = soundProfiles[lane.sound] || soundProfiles[isRight ? "bright" : "low"];
      this.tick(time, profile, 1);
    }
  }

  scheduleMeter(cycleStart, settings, minTime) {
    if (settings.cycleMode === "beat") {
      if (cycleStart >= minTime) {
        this.tick(cycleStart, soundProfiles.meter, 1);
      }
      return;
    }

    const beatDuration = getBeatDuration(settings);
    for (let beat = 0; beat < settings.beatsPerBar; beat += 1) {
      const time = cycleStart + beat * beatDuration;
      if (time >= minTime) {
        this.tick(time, soundProfiles.meter, 1);
      }
    }
  }

  scheduleMetronome(cycleStart, settings, minTime) {
    const beatDuration = getBeatDuration(settings);
    const subdivision = clampInteger(settings.metronome.subdivision, 1, 8);
    const subdivisionDuration = beatDuration / subdivision;
    const baseProfile = soundProfiles[settings.metronome.sound] || soundProfiles.meter;

    for (let beat = 0; beat < settings.beatsPerBar; beat += 1) {
      for (let subdivisionIndex = 0; subdivisionIndex < subdivision; subdivisionIndex += 1) {
        const time = cycleStart + beat * beatDuration + subdivisionIndex * subdivisionDuration;
        if (time < minTime) {
          continue;
        }

        const isDownbeat = beat === 0 && subdivisionIndex === 0;
        const profile = settings.metronome.accentDownbeat && isDownbeat ? soundProfiles.meterAccent : baseProfile;
        const accent = subdivisionIndex === 0 ? 1 : 0.62;
        this.tick(time, profile, accent);
      }
    }
  }

  scheduleArabesque(cycleStart, settings, minTime) {
    const beatDuration = getBeatDuration(settings);
    const measures = getArabesqueSequence(settings.arabesque.startMeasure, settings.arabesque.loopMeasures);
    let measureStart = cycleStart;

    measures.forEach((measure) => {
      if (settings.playMode !== "left") {
        this.scheduleArabesqueLane(measure.right, measureStart, beatDuration, settings.right.sound, true, minTime);
      }

      if (settings.playMode !== "right") {
        this.scheduleArabesqueLane(measure.left, measureStart, beatDuration, settings.left.sound, false, minTime);
      }

      measureStart += measure.beats * beatDuration;
    });
  }

  scheduleArabesqueLane(events, measureStart, beatDuration, soundName, isRight, minTime) {
    const profile = soundProfiles[soundName] || soundProfiles[isRight ? "bright" : "wood"];

    events.forEach((beatOffset) => {
      const time = measureStart + beatOffset * beatDuration;
      if (time >= minTime) {
        this.tick(time, profile, 1);
      }
    });
  }

  tick(time, profile, accent = 1) {
    const ctx = this.audioContext;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    const duration = profile.duration;

    oscillator.type = profile.type;
    oscillator.frequency.setValueAtTime(profile.frequency, time);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, profile.gain * accent), time + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start(time);
    oscillator.stop(time + duration + 0.012);
    this.trackScheduledTick(oscillator, time);
  }

  getCycleProgress() {
    if (!this.audioContext || !this.isPlaying) {
      return 0;
    }

    const duration = this.cycleDuration || getCycleDuration(this.getSettings());
    const elapsed = Math.max(0, this.audioContext.currentTime - this.startTime);
    return (elapsed % duration) / duration;
  }

  trackScheduledTick(oscillator, startTime) {
    const scheduledTick = { oscillator, startTime };
    this.scheduledTicks.push(scheduledTick);
    oscillator.addEventListener("ended", () => {
      this.scheduledTicks = this.scheduledTicks.filter((tick) => tick !== scheduledTick);
    });
  }

  cancelScheduledTicks(fromTime) {
    const remaining = [];

    this.scheduledTicks.forEach((tick) => {
      if (tick.startTime >= fromTime) {
        try {
          tick.oscillator.stop();
        } catch (error) {
          // Already stopped.
        }
        return;
      }

      remaining.push(tick);
    });

    this.scheduledTicks = remaining;
  }
}
