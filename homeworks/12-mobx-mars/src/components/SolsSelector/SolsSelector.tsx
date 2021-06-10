import React from "react";
import { observer } from "mobx-react-lite";

import { useStore } from "../../stores";

const SolsSelector: React.VFC = observer(() => {
  const mainStore = useStore("MainStore");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = +e.target.value;
    if (value < 0) return;
    mainStore.currentRover.setSol(value);
  };

  return (
    <>
      <header>Select Sol and press "load"!</header>
      <div>
        <input
          value={mainStore.currentRover.selectedSol}
          onChange={onChange}
          type="number"
        />
        <button onClick={mainStore.currentRover.getPhotos}>Load</button>
      </div>
      <div>
        <div>Get latest photos of the selected rover</div>
        <button onClick={mainStore.currentRover.getLatestPhotos}>
          Get latest
        </button>
      </div>
    </>
  );
});

export default SolsSelector;
