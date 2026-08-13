# PolyPulse Practice

[日本語](README.ja.md) / [English](README.en.md) / [Español](README.es.md)

Open the app:

https://luckyluuue.github.io/tempo_master/

PolyPulse Practice is a PWA for practicing polyrhythms and metronome subdivisions.

## Usage

Switch between `Polyrhythm` and `Metronome` at the top of the app. BPM and meter are shared between both modes.

In Polyrhythm mode, changing the count changes the number of pulses for the right and left hands. Playback can be switched between `Both`, `Right only`, and `Left only`.

In Metronome mode, you can change the subdivision, sound, and first-beat accent.

Settings are saved in the browser and restored the next time the app opens. Playback state is not saved.

## Local Preview

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/` in your browser.

## Android

Android installation steps are documented in [android-install.md](android-install.md).

## GitHub Pages

GitHub Pages publishing steps are documented in [github-pages.md](github-pages.md).

## Structure

```text
index.html
ja/
en/
es/
styles.css
app.js
src/
  main.js
  rhythmEngine.js
  settings.js
  soundProfiles.js
  timing.js
  ui.js
  i18n.js
```
