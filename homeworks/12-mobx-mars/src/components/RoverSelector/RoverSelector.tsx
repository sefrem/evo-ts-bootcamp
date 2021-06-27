import React from "react";
import { observer } from "mobx-react-lite";

import { Rover } from "../../stores/main/MainTypes";
import { useStore } from "../../stores";
import { assertIsRover } from "../../utils/assertIsRover";

import styles from "./RoverSelector.module.css";

const RoverSelector: React.VFC = observer(() => {
  const mainStore = useStore("MainStore");

  const changeRover = (e: React.ChangeEvent<HTMLSelectElement>) => {
    assertIsRover(e.target.value);
    mainStore.setRover(e.target.value as Rover);
  };

  return (
    <div className={styles.selectRover}>
      <label htmlFor="rover"> Select rover: </label>
      <select id="rover" value={mainStore.selectedRover} onChange={changeRover}>
        <option value="perseverance">Perseverance</option>
        <option value="opportunity">Opportunity</option>
        <option value="curiosity">Curiosity</option>
        <option value="spirit">Spirit</option>
      </select>
    </div>
  );
});

export default RoverSelector;
