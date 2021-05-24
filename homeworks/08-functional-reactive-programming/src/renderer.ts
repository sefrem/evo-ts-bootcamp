import window from "./assets/window.png";
import wall from "./assets/wall.png";

const canvas = <HTMLCanvasElement>document.getElementById("canvas");
const ctx = canvas.getContext("2d")!;
export const generateBtn = document.getElementById("generate")!;
export const score = document.getElementById("score")!;
export const countdown = document.getElementById("countdown")!;

const startY = 50;
const NUMBER_OF_ROWS = 10;

const random = (): number => Math.floor(Math.random() * NUMBER_OF_ROWS);

const drawInitialImg = (image: string, coords: number[]): void => {
  const img = new Image();
  img.onload = () => {
    ctx.drawImage(img, coords[0], coords[1] + 10);
  };
  img.src = image;
};

export const genField = (): number[][] => {
  const coords: number[][] = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let j = 0; j < 10; j++) {
    for (let i = 0; i < NUMBER_OF_ROWS; i++) {
      if (i === random()) {
        drawInitialImg(window, [50 * i, startY * j]);
        coords.push([50 * i, startY * j]);
        continue;
      }
      drawInitialImg(wall, [50 * i, startY * j]);
    }
  }

  return coords;
};

export const generateEmptyField = (): void => {
  for (let j = 0; j < 10; j++) {
    for (let i = 0; i < NUMBER_OF_ROWS; i++) {
      drawInitialImg(wall, [50 * i, startY * j]);
    }
  }
};

export const drawImg = (image: HTMLImageElement, coords: number[]): void =>
  ctx.drawImage(image, coords[0], coords[1] + 10);

export const checkIfClicked = ([event, coords]: [
  event: MouseEvent,
  coords: number[]
]): boolean => {
  const { offsetX, offsetY } = event;
  const [targetX, targetY] = coords;
  const xDiff = offsetX - targetX;
  const YDiff = offsetY - targetY;
  return xDiff > 0 && xDiff < 50 && YDiff > 0 && YDiff < 50;
};
