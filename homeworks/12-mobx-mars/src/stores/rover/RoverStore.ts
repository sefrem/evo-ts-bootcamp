import { makeAutoObservable, runInAction } from "mobx";

import PhotosApi from "../../api";
import { IPhotos, Rover } from "../main/MainTypes";
import { isNumber } from "../../utils/isNumber";

export default class RoverStore {
  private photosApi: PhotosApi;
  name: Rover;
  photos: IPhotos[] = [];
  selectedSol: number | string = 1;
  sols: Record<number | string, number[] | null> = { [this.selectedSol]: null };
  loader: boolean = false;

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
    if (!isNumber(this.selectedSol)) return;

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
    if (this.sols["latest"]) {
      this.setSol("latest");
      return;
    }
    this.setLoader(true);
    this.photosApi
      .getLatestPhotos(this.name)
      .then((data) => {
        runInAction(() => {
          this.photos.push(...data);
          this.sols["latest"] = data.map(({ id }) => id);
        });
        this.setSol("latest");
      })
      .finally(() => this.setLoader(false));
  }

  setLoader(value: boolean): void {
    this.loader = value;
  }

  setSol(sol: number | string): void {
    this.selectedSol = sol;
  }
}
