export interface ICamera {
  fullName: string;
  id: number;
  name: string;
  roverId: number;
}

export interface IRover {
  id: number;
  landingDate: string;
  launchDate: string;
  name: string;
  status: string;
}

export interface IPhotos {
  camera: ICamera;
  earthDate: string;
  id: number;
  imgSrc: string;
  rover: IRover;
  sol: number;
}

export type Rover = "perseverance" | "opportunity" | "curiosity" | "spirit";
