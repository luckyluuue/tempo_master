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

export function getArabesqueMeasure(number) {
  return arabesqueMeasures.find((measureData) => measureData.number === number) || arabesqueMeasures[0];
}

export function getArabesqueSequence(startMeasure, measureCount) {
  const startIndex = Math.max(
    0,
    arabesqueMeasures.findIndex((measureData) => measureData.number === startMeasure),
  );
  const count = Math.max(1, measureCount);
  return arabesqueMeasures.slice(startIndex, startIndex + count);
}

export function getArabesqueBounds() {
  return {
    first: arabesqueMeasures[0].number,
    last: arabesqueMeasures[arabesqueMeasures.length - 1].number,
  };
}
