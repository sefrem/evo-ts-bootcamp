import React from 'react';
import { makeAutoObservable, runInAction } from 'mobx';

type Status = 'idle' | 'in progress' | 'paused' | 'game over';

const ALIVE_COLOR = 'rgb(50,150,150)';
const DEAD_COLOR = 'rgb(250,250,250)';

export default class LifeStore {
    canvasWidth: number = 500;
    canvasHeight: number = 500;
    private cellSize: number = 8;
    private cellsInRow: number = Math.floor(this.canvasWidth / this.cellSize);
    private cellsInCol: number = Math.floor(this.canvasHeight / this.cellSize);
    private aliveColor: string = ALIVE_COLOR;
    private deadColor: string = DEAD_COLOR;
    private interval: ReturnType<typeof setInterval> | null = null;
    private timeout: number = 100;
    grid: number[][] = [];
    ctx: CanvasRenderingContext2D | null = null;
    isChanged: boolean = false;
    status: Status = 'idle';

    constructor() {
        makeAutoObservable(
            this,
            {},
            {
                autoBind: true,
            },
        );
    }

    initField() {
        this.grid = new Array(this.cellsInCol)
            .fill(null)
            .map(() => new Array(this.cellsInRow).fill(null).map(() => Math.floor(Math.random() * 2)));
    }

    fillField() {
        if (!this.ctx) return;
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                this.ctx.beginPath();
                this.ctx.rect(j * this.cellSize, i * this.cellSize, this.cellSize, this.cellSize);
                this.ctx.fillStyle = this.grid[i][j] ? this.aliveColor : this.deadColor;
                this.ctx.fill();
            }
        }
    }

    nextGen() {
        this.isChanged = false;
        const nextGen = this.grid.map(arr => [...arr]);
        for (let col = 0; col < this.cellsInCol; col++) {
            for (let row = 0; row < this.cellsInRow; row++) {
                const cell = this.grid[col][row];
                let totalNeighbors = 0;
                for (let i = -1; i < 2; i++) {
                    for (let j = -1; j < 2; j++) {
                        if (i === 0 && j === 0) {
                            continue;
                        }
                        const newX = col + i;
                        const newY = row + j;
                        if (newX >= 0 && newY >= 0 && newX < this.cellsInCol && newY < this.cellsInRow) {
                            const currentNeighbor = this.grid[newX][newY];
                            totalNeighbors += currentNeighbor;
                        }
                    }
                }

                if (cell === 1 && totalNeighbors < 2) {
                    nextGen[col][row] = 0;
                    this.isChanged = true;
                } else if (cell === 1 && totalNeighbors > 3) {
                    nextGen[col][row] = 0;
                    this.isChanged = true;
                } else if (cell === 0 && totalNeighbors === 3) {
                    nextGen[col][row] = 1;
                    this.isChanged = true;
                }
            }
        }
        return nextGen;
    }

    checkStatus() {
        if (!this.isChanged) {
            clearInterval(this.interval!);
            this.setStatus('game over');
        }
    }

    setField() {
        this.setStatus('idle');
        this.initField();
        this.fillField();
        this.interval && clearInterval(this.interval);
    }

    startGame() {
        this.setStatus('in progress');
        this.interval = setInterval(() => {
            runInAction(() => {
                this.grid = this.nextGen();
            });

            this.fillField();
        }, this.timeout);
    }

    addCell(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>): void {
        const x = event.nativeEvent.offsetX / this.cellSize;
        const y = event.nativeEvent.offsetY / this.cellSize;
        this.grid[Math.floor(y)][Math.floor(x)] = 1;
        this.fillField();
    }

    pauseGame() {
        this.setStatus('paused');
        this.interval && clearInterval(this.interval);
    }

    setContext(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    setStatus(status: Status) {
        this.status = status;
    }
}
