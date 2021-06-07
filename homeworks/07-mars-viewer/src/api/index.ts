const API_KEY = "1WVgDrbeAYFpTXduAHyuUGCsL4xwFB3ghicGpfNr";

class Api {
  getPhotos = async (rover: string, sol: number) => {
    const response = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?api_key=${API_KEY}&sol=${sol}`
    );
    return await response.json();
  };
}

const api = new Api();

export default api;
