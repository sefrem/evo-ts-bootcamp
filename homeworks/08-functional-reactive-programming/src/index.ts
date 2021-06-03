import { defer, fromEvent, interval, of, Observable, Subject } from "rxjs";
import {
  filter,
  map,
  tap,
  pairwise,
  startWith,
  withLatestFrom,
  mapTo,
  scan,
  takeUntil,
  delay,
} from "rxjs/operators";
import {
  checkIfClicked,
  drawImg,
  generateBtn,
  generateEmptyField,
  getWindowsCoords,
  getHappyCats,
  resetScore,
  score,
  drawWindows,
} from "./renderer";

import window from "./assets/window.png";
import sadCat from "./assets/sad_cat.png";

import "./index.css";

const happyCats = getHappyCats();

const windowImg = new Image();
windowImg.src = window;

const sadCatImg = new Image();
sadCatImg.src = sadCat;

const values$: Observable<number[][]> = defer(() =>
  of(getWindowsCoords())
).pipe(tap(generateEmptyField), delay(0), tap(drawWindows));
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

const stopSignal$: Subject<number> = new Subject();

const score$: Observable<number> = click$.pipe(
  withLatestFrom(renderCat$),
  filter(checkIfClicked),
  tap(([_, coords]) =>
    drawImg(happyCats[Math.floor(Math.random() * happyCats.length)], coords)
  ),
  mapTo(1),
  scan((value, count) => count + value, 0),
  tap((value) => (score.innerHTML = value.toString())),
  takeUntil(stopSignal$)
);

fromEvent(generateBtn, "click").subscribe(() => {
  resetScore();
  stopSignal$.next(0);
  score$.subscribe();
});

generateEmptyField();
