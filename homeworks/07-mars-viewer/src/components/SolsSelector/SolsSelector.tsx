import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  getPhotos,
  selectCurrentSol,
  setSol,
} from "../../features/mars/marsSlice";

const SolsSelector: React.VFC = () => {
  const dispatch = useAppDispatch();
  const currentSol = useAppSelector(selectCurrentSol);
  const fetchSolPhotos = (): void => {
    dispatch(getPhotos());
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = +e.target.value;
    if (value < 0) return;
    dispatch(setSol(value));
  };

  return (
    <>
      <header>Select Sol and press "load"!</header>
      <input value={currentSol} onChange={onChange} type="number" />
      <button onClick={fetchSolPhotos}>Load</button>
    </>
  );
};

export default SolsSelector;
