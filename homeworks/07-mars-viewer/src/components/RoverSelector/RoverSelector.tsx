import React from "react";
import { selectRover, setRover } from "../../features/mars/marsSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Rover } from "../../features/mars/types";

import styles from "./RoverSelector.module.css";

function assertIsRover(value: string): value is Rover {
  const roverValues = ["perseverance", "opportunity", "curiosity", "spirit"];
  if (!roverValues.includes(value)) {
    throw new Error("Not a Rover");
  }
  return true;
}

const RoverSelector: React.VFC = () => {
  const rover = useAppSelector(selectRover);
  const dispatch = useAppDispatch();
  const changeRover = (e: React.ChangeEvent<HTMLSelectElement>) => {
    assertIsRover(e.target.value);
    dispatch(setRover(e.target.value as Rover));
  };

  return (
    <div className={styles.selectRover}>
      <label htmlFor="rover"> Select rover: </label>
      <select id="rover" value={rover} onChange={changeRover}>
        <option value="perseverance">Perseverance</option>
        <option value="opportunity">Opportunity</option>
        <option value="curiosity">Curiosity</option>
        <option value="spirit">Spirit</option>
      </select>
    </div>
  );
};

export default RoverSelector;
