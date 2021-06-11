import React from "react";
import { observer } from "mobx-react-lite";

import { useStore } from "../../stores";

import styles from "./SolsSelector.module.css";

const SolsSelector: React.VFC = observer(() => {
  const mainStore = useStore("MainStore");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = +e.target.value;
    if (value < 0) return;
    mainStore.currentRover.setSol(value);
  };

  return (
    <div className={styles.solsSelector}>
      <div>
        <p>Select Sol and press "load"!</p>
        <input
          value={mainStore.currentRover.selectedSol}
          onChange={onChange}
          type="number"
        />
        <button
          onClick={mainStore.currentRover.getPhotos}
          disabled={mainStore.currentRover.loading}
        >
          Load
        </button>
      </div>
      <div>
        <p>Get latest photos of the selected rover</p>
        <button
          onClick={mainStore.currentRover.getLatestPhotos}
          disabled={mainStore.currentRover.loading}
        >
          Get latest
        </button>
      </div>
    </div>
  );
});

export default SolsSelector;
