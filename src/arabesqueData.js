const beatsPerMeasure = 4;

function evenlySpaced(count) {
  return Array.from({ length: count }, (_, index) => (beatsPerMeasure * index) / count);
}

function repeatPerBeat(countPerBeat) {
  return Array.from({ length: beatsPerMeasure * countPerBeat }, (_, index) => index / countPerBeat);
}

function measure(number, right, left, note) {
  return {
    number,
    beats: beatsPerMeasure,
    right,
    left,
    note,
  };
}

const threeAgainstTwo = {
  right: repeatPerBeat(3),
  left: repeatPerBeat(2),
};

const flowingSixteenths = {
  right: repeatPerBeat(3),
  left: repeatPerBeat(4),
};

const openingPulse = {
  right: repeatPerBeat(3),
  left: evenlySpaced(6),
};

export const arabesqueMeasures = [
  measure(1, openingPulse.right, openingPulse.left, "Opening 3-over-2 feel"),
  measure(2, openingPulse.right, openingPulse.left, "Opening 3-over-2 feel"),
  measure(3, threeAgainstTwo.right, threeAgainstTwo.left, "Triplets against eighth notes"),
  measure(4, threeAgainstTwo.right, threeAgainstTwo.left, "Triplets against eighth notes"),
  measure(5, flowingSixteenths.right, flowingSixteenths.left, "Triplets against flowing left hand"),
  measure(6, flowingSixteenths.right, flowingSixteenths.left, "Triplets against flowing left hand"),
  measure(7, threeAgainstTwo.right, threeAgainstTwo.left, "Arabesque 3:2 practice passage"),
  measure(8, threeAgainstTwo.right, threeAgainstTwo.left, "Arabesque 3:2 practice passage"),
  measure(9, threeAgainstTwo.right, threeAgainstTwo.left, "Arabesque 3:2 practice passage"),
  measure(10, threeAgainstTwo.right, threeAgainstTwo.left, "Arabesque 3:2 practice passage"),
  measure(11, flowingSixteenths.right, flowingSixteenths.left, "Triplets against flowing left hand"),
  measure(12, flowingSixteenths.right, flowingSixteenths.left, "Triplets against flowing left hand"),
  measure(13, repeatPerBeat(3), repeatPerBeat(3), "Matched triplet texture"),
  measure(14, repeatPerBeat(2), repeatPerBeat(3), "Eighth notes against triplets"),
  measure(15, repeatPerBeat(2), repeatPerBeat(3), "Eighth notes against triplets"),
  measure(16, repeatPerBeat(3), repeatPerBeat(2), "3:2 cadence practice"),
];

export const arabesqueScorePages = [
  {
    number: 1,
    width: 496,
    height: 690,
    measures: [
      { number: 1, x: 11.5, y: 12.5, width: 19, height: 19 },
      { number: 2, x: 30.5, y: 12.5, width: 18, height: 19 },
      { number: 3, x: 48.5, y: 12.5, width: 22, height: 19 },
      { number: 4, x: 70.5, y: 12.5, width: 19, height: 19 },
      { number: 5, x: 8.5, y: 35.5, width: 23, height: 18 },
      { number: 6, x: 31.5, y: 35.5, width: 19, height: 18 },
      { number: 7, x: 50.5, y: 35.5, width: 20, height: 18 },
      { number: 8, x: 70.5, y: 35.5, width: 21, height: 18 },
      { number: 9, x: 8.5, y: 57, width: 22, height: 18 },
      { number: 10, x: 30.5, y: 57, width: 20, height: 18 },
      { number: 11, x: 50.5, y: 57, width: 20, height: 18 },
      { number: 12, x: 70.5, y: 57, width: 21, height: 18 },
      { number: 13, x: 8.5, y: 78, width: 20, height: 18 },
      { number: 14, x: 28.5, y: 78, width: 21, height: 18 },
      { number: 15, x: 49.5, y: 78, width: 21, height: 18 },
      { number: 16, x: 70.5, y: 78, width: 21, height: 18 },
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
