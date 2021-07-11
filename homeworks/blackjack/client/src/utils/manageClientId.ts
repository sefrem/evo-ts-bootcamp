import { generateId } from './';

export function manageClientId(): string {
    const clientId = window.localStorage.getItem('clientId');

    if (!clientId) {
        const clientId = generateId(3);
        window.localStorage.setItem('clientId', clientId);
        return clientId;
    }

    return clientId;
}
