import {
  defer,
  fromEvent,
  interval,
  of,
  iif,
  Subscription,
  from,
  combineLatest,
} from "rxjs";
import {
  filter,
  map,
  tap,
  pairwise,
  startWith,
  withLatestFrom,
  mapTo,
  scan,
  mergeMap,
  finalize,
} from "rxjs/operators";
import {
  checkIfClicked,
  countdown,
  drawImg,
  generateBtn,
  generateEmptyField,
  genField,
  score,
} from "./renderer";

import window from "./assets/window.png";
import sadCat from "./assets/sad_cat.png";
import happyCat from "./assets/happy_cat.png";

import "./index.css";

const windowImg = new Image();
windowImg.src = window;

const sadCatImg = new Image();
sadCatImg.src = sadCat;

const happyCatImg = new Image();
happyCatImg.src = happyCat;

const values$ = defer(() => of(genField()));
const interval$ = interval(1000);

const renderCat$ = interval$.pipe(
  startWith(0),
  withLatestFrom(values$),
  map(([_, values]) => {
    const index = Math.floor(Math.random() * values.length);
    return values[index];
  }),
  pairwise(),
  tap(([prevCoords, coords]) => {
    drawImg(windowImg, prevCoords);
    drawImg(sadCatImg, coords);
  }),
  map((value) => value[1])
);

const click$ = fromEvent<MouseEvent>(document, "click");

const score$ = combineLatest([click$, renderCat$]).pipe(
  filter(checkIfClicked),
  tap(([_, coords]) => drawImg(happyCatImg, coords)),
  mapTo(1),
  scan((value, count) => count + value, 0),
  tap((value) => (score.innerHTML = value.toString()))
);

let subscription: Subscription | null = null;

fromEvent(generateBtn, "click").subscribe(() => {
  if (subscription) {
    subscription.unsubscribe();
    score.innerHTML = "0";
  }
  subscription = score$.subscribe();
});

generateEmptyField();
