import { Routes } from "./RoutesTypes";
import { makeAutoObservable } from "mobx";

export default class RoutesStore {
  route: Routes = "gallery";

  constructor() {
    makeAutoObservable(this);
  }

  selectRoute(route: Routes) {
    this.route = route;
  }
}
