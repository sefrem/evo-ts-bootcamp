import { IPhotos } from "../stores/main/MainTypes";

export default class PhotosApi {
  getPhotos = async (rover: string, sol: number) => {
    const response = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?api_key=${process.env.REACT_APP_API_KEY}&sol=${sol}`
    );
    const { photos } = await response.json();
    return normalize(photos);
  };

  getLatestPhotos = async (rover: string) => {
    const response = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/latest_photos?api_key=${process.env.REACT_APP_API_KEY}`
    );
    const { latest_photos } = await response.json();
    return normalize(latest_photos);
  };
}

const normalize = (data: any[]): IPhotos[] => {
  return data.map((item) => ({
    camera: {
      fullName: item.camera.full_name,
      id: item.camera.id,
      name: item.camera.name,
      roverId: item.camera.rover_id,
    },
    earthDate: item.earth_date,
    id: item.id,
    imgSrc: item.img_src,
    rover: {
      id: item.rover.id,
      landingDate: item.rover.landing_date,
      launchDate: item.rover.launch_date,
      name: item.rover.name,
      status: item.rover.status,
    },
    sol: item.sol,
  }));
};
