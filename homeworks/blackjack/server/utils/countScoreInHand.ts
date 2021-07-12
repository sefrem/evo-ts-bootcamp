import { Card } from "../src/types";

export function countScoreInHand(hand: Card[]): number {
  let score = 0;
  let acesCounter = 0;
  hand.forEach(({ rank }) => {
    if (typeof rank === "number") {
      score += rank;
    }
    if (typeof rank === "string") {
      if (rank === "A") {
        acesCounter++;
      } else {
        score += 10;
      }
    }
  });
  while (acesCounter > 0) {
    if (score + 11 > 21) {
      score += 1;
    } else {
      score += 11;
    }
    acesCounter--;
  }
  return score;
}
