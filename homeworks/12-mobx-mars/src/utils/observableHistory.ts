import { IDisposer } from "mobx-utils/lib/utils";
import { fromResource } from "mobx-utils";
import history from "history/hash";

function createObservableHistory() {
  let currentSubscription: IDisposer;
  return fromResource(
    (sink) => {
      currentSubscription = history.listen(({ action }) => {
        sink({ action });
      });
    },
    () => {
      currentSubscription();
    }
  );
}

export const myObservableHistory = createObservableHistory();
