
const adjectives = ['Big', 'Mad', 'Foxy', 'Drunk', 'Lucky'];
const nouns = ['Lumberjack', 'Lady', 'Unicorn', 'Cheese', 'Bear'];

export function generateNickname(): string {
    const adjId = Math.floor(Math.random() * 5);
    const nounId = Math.floor(Math.random() * 5);
    return adjectives[adjId] + nouns[nounId];
}
