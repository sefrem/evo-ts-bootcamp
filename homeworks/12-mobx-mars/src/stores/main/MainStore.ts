import { makeAutoObservable } from "mobx";

import { Rover } from "./MainTypes";
import RoverStore from "../rover/RoverStore";
import {
  addToLocalStorage,
  getFromLocalStorage,
} from "../../utils/localStorage";

const FAVORITE_PHOTOS = "favoritePhotos";

export default class MainStore {
  selectedRover: Rover = "perseverance";
  rovers: Record<string, RoverStore> = {
    [this.selectedRover]: new RoverStore(this.selectedRover),
  };
  favorites: number[] = getFromLocalStorage(FAVORITE_PHOTOS) || [];

  constructor() {
    makeAutoObservable(this);
  }

  get currentRover(): RoverStore {
    return this.rovers[this.selectedRover];
  }

  get favoritePhotos() {
    return Object.values(this.rovers).flatMap(({ photos }) => {
      return photos.filter(({ id }) => this.favorites.includes(id));
    });
  }

  setRover(rover: Rover): void {
    this.selectedRover = rover;
    if (!this.rovers[rover]) {
      this.rovers[rover] = new RoverStore(rover);
    }
  }

  checkIfFavorite(id: number): boolean {
    return this.favorites.includes(id);
  }

  addToFavorites(id: number): void {
    if (!this.favorites.includes(id)) {
      this.favorites.push(id);
      addToLocalStorage(FAVORITE_PHOTOS, this.favorites);
    }
  }

  removeFromFavorites(id: number): void {
    this.favorites.splice(this.favorites.indexOf(id), 1);
  }
}
