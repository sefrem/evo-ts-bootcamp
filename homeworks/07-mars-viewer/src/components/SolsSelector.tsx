import React from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  getPhotos,
  selectCurrentSol,
  setSelectedSol,
} from "../features/mars/marsSlice";

const SolsSelector: React.VFC = () => {
  const dispatch = useAppDispatch();
  const currentSol = useAppSelector(selectCurrentSol);
  const [input, setInput] = React.useState(currentSol);

  const fetchSolPhotos = (): void => {
    dispatch(getPhotos());
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInput(+e.target.value);
    dispatch(setSelectedSol(+e.target.value));
  };

  return (
    <>
      <header>Select Sol and press "load"!</header>
      <input value={input} onChange={onChange} type="number" />
      <button onClick={fetchSolPhotos}>Load</button>
    </>
  );
};

export default SolsSelector;
