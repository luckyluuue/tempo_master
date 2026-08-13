const dictionaries = {
  ja: {
    play: "再生",
    pause: "一時停止",
    rightShort: "右",
    leftShort: "左",
    ratio: (right, left) => `右${right} / 左${left}`,
    cycleBeat: (right, left) => `1拍の中の ${right} : ${left}`,
    cycleBar: (right, left) => `1小節の中の ${right} : ${left}`,
    beats: (count) => `${count}拍`,
  },
  en: {
    play: "Play",
    pause: "Pause",
    rightShort: "R",
    leftShort: "L",
    ratio: (right, left) => `R${right} / L${left}`,
    cycleBeat: (right, left) => `${right} : ${left} within 1 beat`,
    cycleBar: (right, left) => `${right} : ${left} within 1 bar`,
    beats: (count) => `${count} beats`,
  },
  es: {
    play: "Reproducir",
    pause: "Pausar",
    rightShort: "D",
    leftShort: "I",
    ratio: (right, left) => `D${right} / I${left}`,
    cycleBeat: (right, left) => `${right} : ${left} en 1 pulso`,
    cycleBar: (right, left) => `${right} : ${left} en 1 compás`,
    beats: (count) => `${count} pulsos`,
  },
};

export function getLanguage() {
  const language = document.documentElement.lang.toLowerCase();
  if (language.startsWith("ja")) {
    return "ja";
  }
  if (language.startsWith("es")) {
    return "es";
  }

  return "en";
}

export function getCopy() {
  return dictionaries[getLanguage()];
}
