import { Rover } from "../stores/main/MainTypes";

export function assertIsRover(value: string): value is Rover {
  const roverValues = ["perseverance", "opportunity", "curiosity", "spirit"];
  if (!roverValues.includes(value)) {
    throw new Error("Not a Rover");
  }
  return true;
}
