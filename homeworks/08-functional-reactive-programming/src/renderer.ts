import window from "./assets/window.png";
import wall from "./assets/wall.png";
import happyCat from "./assets/happy_cat.png";
import darkCat from "./assets/cat_dark.png";
import beigeCat from "./assets/cat_beige.png";
import dottedCat from "./assets/cat_dots.png";

const canvas = <HTMLCanvasElement>document.getElementById("canvas");
const ctx = canvas.getContext("2d")!;
export const generateBtn = document.getElementById("generate")!;
export const score = document.getElementById("score")!;

const startY = 50;
const NUMBER_OF_ROWS = 10;
const images: string[] = [happyCat, darkCat, beigeCat, dottedCat];
const random = (): number => Math.floor(Math.random() * NUMBER_OF_ROWS);

const drawInitialImg = (image: string, coords: number[]): void => {
  const img = new Image();
  img.onload = () => {
    ctx.drawImage(img, coords[0], coords[1] + 10);
  };
  img.src = image;
};

export const getWindowsCoords = () => {
  const coords: number[][] = [];
  for (let j = 0; j < 10; j++) {
    for (let i = 0; i < NUMBER_OF_ROWS; i++) {
      if (i === random()) {
        coords.push([50 * i, startY * j]);
      }
    }
  }
  return coords;
};

export const drawWindows = (coords: number[][]): void => {
  for (const [x, y] of coords) {
    drawInitialImg(window, [x, y]);
  }
};

export const generateEmptyField = (): void => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let j = 0; j < 10; j++) {
    for (let i = 0; i < NUMBER_OF_ROWS; i++) {
      drawInitialImg(wall, [50 * i, startY * j]);
    }
  }
};

export const drawImg = (image: HTMLImageElement, coords: number[]): void => {
  ctx.drawImage(image, coords[0], coords[1] + 10);
};

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

export const resetScore = () => (score.innerHTML = "0");

export const getHappyCats = (): HTMLImageElement[] => {
  return images.map((image) => {
    const img = new Image();
    img.src = image;
    return img;
  });
};
