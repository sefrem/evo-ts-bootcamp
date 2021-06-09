import PhotosApi from "../../api";
import { IPhotos, Rover } from "../main/MainTypes";
import { makeAutoObservable, runInAction } from "mobx";

export default class RoverStore {
  private photosApi: PhotosApi;
  name: Rover;
  photos: IPhotos[] = [];
  selectedSol: number = 1;
  sols: Record<number, number[] | null> = { [this.selectedSol]: null };
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
    this.loader = true;
    this.photosApi
      .getPhotos(this.name, this.selectedSol)
      .then((data) => {
        runInAction(() => {
          this.photos.push(...data);
          this.sols[this.selectedSol] = data.map(({ id }) => id);
        });
      })
      .finally(() => (this.loader = false));
  }

  setSol(sol: number): void {
    this.selectedSol = sol;
  }
}
