import { autorun, makeAutoObservable, reaction } from "mobx";
import history from "history/hash";

import { myObservableHistory } from "../../utils/observableHistory";

function assertIsRoute(value: string): value is Routes {
  const routeValues = ["gallery", "favorites"];
  return routeValues.includes(value);
}

const initialPath = history.location.pathname.slice(1);

type Routes = "gallery" | "favorites";

export default class RouterStore {
  route: Routes = (assertIsRoute(initialPath) && initialPath) || "gallery";

  constructor() {
    makeAutoObservable(this);

    autorun(() => {
      if (this.currentRoute !== history.location.pathname) {
        history.push(this.currentRoute);
      }
    });

    reaction(
      () => myObservableHistory.current(),
      (value: any) => {
        if (value.action === "POP") {
          this.setRoute(history.location.pathname.slice(1) as Routes);
        }
      }
    );
  }

  get currentRoute() {
    switch (this.route) {
      case "gallery":
        return "/gallery";
      case "favorites":
        return "/favorites";
      default:
        return "";
    }
  }

  setRoute(route: Routes) {
    this.route = route;
  }
}
