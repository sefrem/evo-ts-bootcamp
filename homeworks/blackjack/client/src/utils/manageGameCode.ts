export function appendGameCodeToUrl(gameCode: string): void {
    const url = new URLSearchParams(window.location.search);
    url.set('code', gameCode);
    window.history.pushState({}, '', `?${url.toString()}`);
}

export function getGameCodeFromUrl(): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get('code');
}
