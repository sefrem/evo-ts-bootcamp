import { defer, fromEvent, interval, of, Subscription } from "rxjs";

export {};

import window from "./assets/window.png";
import cat from "./assets/cat.png";
import {
  filter,
  map,
  tap,
  pairwise,
  startWith,
  withLatestFrom,
} from "rxjs/operators";
import {
  checkIfHit,
  drawImg,
  generateBtn,
  generateEmptyField,
  genField,
} from "./renderer";

const windowImg = new Image();
windowImg.src = window;

const catImg = new Image();
catImg.src = cat;

const getRandomExcept = (limit: number, exception: number): number => {
  let picked: number;

  do {
    picked = Math.floor(Math.random() * limit);
  } while (picked === exception);

  return picked;
};

const values$ = defer(() => of(genField()));

const renderCat$ = interval(1000).pipe(
  startWith(0),
  withLatestFrom(values$),
  map(([_, values]) => {
    const index = Math.floor(Math.random() * values.length);
    return values[index];
  }),
  // pairwise(),
  // map((value): number[] => {
  //   const [prev, current] = value;
  //   const [prevIndex, allValues] = prev;
  //   const [currentIndex, allVal] = current;
  //   if (prevIndex === currentIndex) {
  //     const index = getRandomExcept(allVal.length, prevIndex);
  //     return allVal[index];
  //   }
  //   return allVal[currentIndex];
  // }),
  pairwise(),
  tap(([prevCoords, coords]) => {
    drawImg(windowImg, [prevCoords[0], prevCoords[1] - 7]);
    drawImg(catImg, [coords[0], coords[1] - 7]);
  }),
  map((value) => value[1])
);

const click$ = fromEvent<MouseEvent>(document, "click").pipe(
  withLatestFrom(renderCat$),
  filter(checkIfHit),
  tap(console.log)
);

let subscription: Subscription | null = null;

fromEvent(generateBtn, "click").subscribe(() => {
  if (subscription) {
    subscription.unsubscribe();
  }

  subscription = click$.subscribe();
});

generateEmptyField();
