# PolyPulse Practice

[日本語](README.ja.md) / [English](README.en.md) / [Español](README.es.md)

Abrir la aplicación:

https://luckyluuue.github.io/tempo_master/

PolyPulse Practice es una PWA para practicar polirritmos y subdivisiones de metrónomo.

## Uso

Cambia entre `Polirritmo` y `Metrónomo` en la parte superior de la aplicación. El BPM y el compás se comparten entre ambos modos.

En el modo Polirritmo, cambiar la cantidad modifica el número de pulsos de la mano derecha y la mano izquierda. La reproducción puede cambiarse entre `Ambas`, `Solo derecha` y `Solo izquierda`.

En el modo Metrónomo, puedes cambiar la subdivisión, el sonido y el acento del primer pulso.

Los ajustes se guardan en el navegador y se restauran la próxima vez que abras la aplicación. El estado de reproducción no se guarda.

## Vista local

```bash
python -m http.server 8000
```

Después abre `http://localhost:8000/` en el navegador.

## Android

Los pasos de instalación en Android están documentados en [android-install.md](android-install.md).

## GitHub Pages

Los pasos para publicar con GitHub Pages están documentados en [github-pages.md](github-pages.md).

## Estructura

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
