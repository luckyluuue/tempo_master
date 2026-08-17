const beatsPerMeasure = 4;

function measure(number, right, left, note) {
  return {
    number,
    beats: beatsPerMeasure,
    right,
    left,
    note,
  };
}

export const arabesqueMeasures = [
  measure(1, [1, 1.333333, 1.666667, 2, 2.333333, 2.666667], [0, 0.333333, 0.666667, 3, 3.333333, 3.666667], "MusicXML rhythm"),
  measure(2, [1, 1.333333, 1.666667, 2, 2.333333, 2.666667], [0, 0.333333, 0.666667, 3, 3.333333, 3.666667], "MusicXML rhythm"),
  measure(3, [1, 1.333333, 1.666667, 2, 3, 3.333333, 3.666667], [0, 0.333333, 0.666667, 2, 2.333333, 2.666667], "MusicXML rhythm"),
  measure(4, [1, 1.333333, 1.666667, 2, 3, 3.333333, 3.666667], [0, 0.333333, 0.666667, 2, 2.333333, 2.666667], "MusicXML rhythm"),
  measure(5, [1, 3.333333, 3.666667], [0, 0.333333, 0.666667, 1, 1.333333, 1.666667, 2, 2.333333, 2.666667, 3, 3.333333, 3.666667], "MusicXML rhythm"),
  measure(6, [1, 1.333333, 1.666667, 2, 2.333333, 2.666667, 3, 3.333333, 3.666667], [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5], "MusicXML rhythm"),
  measure(7, [0, 0.333333, 0.666667, 1, 3], [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5], "MusicXML rhythm"),
  measure(8, [0, 1, 1.333333, 1.666667, 2, 2.333333, 2.666667, 3, 3.333333, 3.666667], [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5], "MusicXML rhythm"),
  measure(9, [0, 0.333333, 0.666667, 1, 3], [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5], "MusicXML rhythm"),
  measure(10, [0, 0.333333, 0.666667, 1, 2.5, 3, 3.5], [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5], "MusicXML rhythm"),
  measure(11, [0, 1, 3], [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5], "MusicXML rhythm"),
  measure(12, [0, 0.333333, 0.666667, 1, 2.5, 3, 3.5], [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5], "MusicXML rhythm"),
  measure(13, [0, 1, 3, 3.333333, 3.666667], [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5], "MusicXML rhythm"),
  measure(14, [0, 1, 3, 3.333333, 3.666667], [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5], "MusicXML rhythm"),
  measure(15, [0, 1.5, 2, 3.5], [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5], "MusicXML rhythm"),
  measure(16, [0, 1.5, 2, 2.5, 3.5], [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5], "MusicXML rhythm"),
];

export const arabesqueScorePages = [
  {
    number: 1,
    width: 2678,
    height: 3789,
    image: "../assets/scores/images/arabesque-page-1.png",
    measures: [
      { number: 1, x: 22, y: 16.2, width: 17.5, height: 16.6 },
      { number: 2, x: 39.5, y: 16.2, width: 19.1, height: 16.6 },
      { number: 3, x: 58.6, y: 16.2, width: 17.6, height: 16.6 },
      { number: 4, x: 76.2, y: 16.2, width: 17.2, height: 16.6 },
      { number: 5, x: 8.4, y: 37.4, width: 27.1, height: 16.3 },
      { number: 6, x: 35.5, y: 37.4, width: 19.4, height: 16.3 },
      { number: 7, x: 54.9, y: 37.4, width: 18.7, height: 16.3 },
      { number: 8, x: 73.6, y: 37.4, width: 19.8, height: 16.3 },
      { number: 9, x: 8.4, y: 58.6, width: 25.6, height: 16 },
      { number: 10, x: 34, y: 58.6, width: 20.1, height: 16 },
      { number: 11, x: 54.1, y: 58.6, width: 19.7, height: 16 },
      { number: 12, x: 73.8, y: 58.6, width: 19.6, height: 16 },
      { number: 13, x: 8.4, y: 80.2, width: 26.3, height: 15.1 },
      { number: 14, x: 34.7, y: 80.2, width: 19.8, height: 15.1 },
      { number: 15, x: 54.5, y: 80.2, width: 19.6, height: 15.1 },
      { number: 16, x: 74.1, y: 80.2, width: 19.3, height: 15.1 },
    ],
  },
];

export function getArabesqueMeasure(number) {
  return arabesqueMeasures.find((measureData) => measureData.number === number) || arabesqueMeasures[0];
}

export function getArabesqueSequence(startMeasure, measureCount = Infinity) {
  const startIndex = Math.max(
    0,
    arabesqueMeasures.findIndex((measureData) => measureData.number === startMeasure),
  );
  const count = Math.max(1, measureCount);
  return arabesqueMeasures.slice(startIndex, startIndex + count);
}

export function getArabesqueScorePosition(startMeasure, progress) {
  const sequence = getArabesqueSequence(startMeasure);
  const totalBeats = sequence.reduce((sum, measureData) => sum + measureData.beats, 0);
  const elapsedBeats = Math.min(totalBeats, Math.max(0, progress) * totalBeats);
  let beatCursor = 0;

  for (const measureData of sequence) {
    const measureEnd = beatCursor + measureData.beats;
    const isLast = measureData === sequence[sequence.length - 1];
    if (elapsedBeats <= measureEnd || isLast) {
      const measureProgress = Math.min(1, Math.max(0, (elapsedBeats - beatCursor) / measureData.beats));
      const area = findScoreMeasureArea(measureData.number);
      if (!area) {
        return null;
      }

      return {
        x: area.x + area.width * measureProgress,
        y: area.y,
        height: area.height,
        measure: measureData.number,
      };
    }

    beatCursor = measureEnd;
  }

  return null;
}

function findScoreMeasureArea(measureNumber) {
  for (const page of arabesqueScorePages) {
    const area = page.measures.find((measureArea) => measureArea.number === measureNumber);
    if (area) {
      return area;
    }
  }

  return null;
}

export function getArabesqueBounds() {
  return {
    first: arabesqueMeasures[0].number,
    last: arabesqueMeasures[arabesqueMeasures.length - 1].number,
  };
}
