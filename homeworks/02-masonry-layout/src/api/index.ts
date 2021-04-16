import {Images} from "../shared/types";

const MAIN_URL = 'https://collectionapi.metmuseum.org/public/collection/v1'

export const getImages = async (search: string): Promise<Images[]> => {
    const objectIDsJson: Response = await fetch(`${MAIN_URL}/search?q=${search}&hasImages=true&medium=Paintings`);
    const objectIDs: { objectIDs: number[], total: number } = await objectIDsJson.json();
    const promisesArray: Promise<Response>[] = objectIDs.objectIDs.slice(0, 50).map((objectId: number) => fetch(`${MAIN_URL}/objects/${objectId}`))
    const results = await Promise.allSettled(promisesArray);
    const successfulResults: PromiseSettledResult<Response>[] = results.filter(p => p.status === 'fulfilled');
    const parsedResults = await Promise.all(successfulResults.map((response: any) => response.value.json()))
    return parsedResults.map(object => ({
        primaryImageSmall: object.primaryImageSmall,
        objectID: object.objectID,
        title: object.title,
        artistDisplayName: object.artistDisplayName,
        objectDate: object.objectDate,
        objectURL: object.objectURL,
    }))
}
