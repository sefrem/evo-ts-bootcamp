export interface Sol {
  camera: {
    id: number;
    full_name: string;
    name: string;
    rover_id: number;
  };
  earth_date: string;
  id: number;
  img_src: string;
  rover: {
    id: number;
    landing_date: string;
    launch_date: string;
    name: string;
    status: string;
  };
  sol: number;
}

interface Sols {
  [key: number]: number[];
}

export type Rover = "perseverance" | "opportunity" | "curiosity" | "spirit";

export interface MarsState {
  rover: {
    [key: string]: {
      sols: Sols;
      photos: Sol[];
      status: "idle" | "loading" | "failed";
      selectedSol: number;
    };
  };
  selectedRover: Rover;
}
