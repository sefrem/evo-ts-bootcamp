import { defer, fromEvent, interval, of, Subscription, Observable } from "rxjs";
import {
  filter,
  map,
  tap,
  pairwise,
  startWith,
  withLatestFrom,
  mapTo,
  scan,
} from "rxjs/operators";
import {
  checkIfClicked,
  drawImg,
  generateBtn,
  generateEmptyField,
  genField,
  getHappyCats,
  resetGame,
  score,
} from "./renderer";

import window from "./assets/window.png";
import sadCat from "./assets/sad_cat.png";

import "./index.css";

const happyCats = getHappyCats();

const windowImg = new Image();
windowImg.src = window;
const sadCatImg = new Image();
sadCatImg.src = sadCat;

const values$: Observable<number[][]> = defer(() => of(genField()));
const interval$: Observable<number> = interval(1000);

const renderCat$: Observable<number[]> = interval$.pipe(
  startWith(0),
  withLatestFrom(values$),
  map(([_, values]) => values[Math.floor(Math.random() * values.length)]),
  pairwise(),
  tap(([prevCoords, coords]) => {
    drawImg(windowImg, prevCoords);
    drawImg(sadCatImg, coords);
  }),
  map((value) => value[1])
);

const click$: Observable<MouseEvent> = fromEvent<MouseEvent>(document, "click");

const score$: Observable<number> = click$.pipe(
  withLatestFrom(renderCat$),
  filter(checkIfClicked),
  tap(([_, coords]) =>
    drawImg(happyCats[Math.floor(Math.random() * happyCats.length)], coords)
  ),
  mapTo(1),
  scan((value, count) => count + value, 0),
  tap((value) => (score.innerHTML = value.toString()))
);

let subscription: Subscription | null = null;

fromEvent(generateBtn, "click").subscribe(() => {
  if (subscription) {
    subscription.unsubscribe();
    resetGame();
  }
  subscription = score$.subscribe();
});

generateEmptyField();
