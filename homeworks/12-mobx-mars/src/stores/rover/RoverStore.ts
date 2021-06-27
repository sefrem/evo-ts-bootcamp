import { makeAutoObservable, runInAction } from "mobx";

import PhotosApi from "../../api";
import { IPhotos, Rover } from "../main/MainTypes";
import { assertIsNumber } from "../../utils/assertIsNumber";

export default class RoverStore {
  private photosApi: PhotosApi;
  name: Rover;
  photos: IPhotos[] = [];
  selectedSol: number = 1;
  latestSol: number = -1;
  sols: Record<number, number[] | null> = { [this.selectedSol]: null };
  loading: boolean = false;

  constructor(name: Rover) {
    makeAutoObservable(
      this,
      {},
      {
        autoBind: true,
      }
    );
    this.photosApi = new PhotosApi();
    this.name = name;
  }

  get selectedSolPhotos() {
    return this.photos.filter(({ id }) =>
      this.sols[this.selectedSol]?.includes(id)
    );
  }

  get selectedSolContent() {
    return this.sols[this.selectedSol];
  }

  getPhotos(): void {
    if (this.selectedSolContent) return;
    if (!assertIsNumber(this.selectedSol)) return;

    this.setLoader(true);
    this.photosApi
      .getPhotos(this.name, this.selectedSol as number)
      .then((data) => {
        runInAction(() => {
          this.photos.push(...data);
          this.sols[this.selectedSol] = data.map(({ id }) => id);
        });
      })
      .finally(() => this.setLoader(false));
  }

  getLatestPhotos(): void {
    if (this.sols[this.latestSol]) {
      this.setSol(this.latestSol);
      return;
    }
    this.setLoader(true);
    this.photosApi
      .getLatestPhotos(this.name)
      .then((data) => {
        runInAction(() => {
          this.photos.push(...data);
          const latestSol = data[0].sol;
          this.sols[latestSol] = data.map(({ id }) => id);
          this.selectedSol = latestSol;
          this.latestSol = latestSol;
        });
      })
      .finally(() => this.setLoader(false));
  }

  setLoader(value: boolean): void {
    this.loading = value;
  }

  setSol(sol: number): void {
    this.selectedSol = sol;
  }
}
