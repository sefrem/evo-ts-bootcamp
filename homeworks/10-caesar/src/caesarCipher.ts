import { Alphabet, Cipher } from '../types';

export const caesarCipher = (alphabet: Alphabet, encode: Cipher, shift: number) => (chunk: string): string => {
    let isUppercase = false;
    let newChunk = '';

    for (let i = 0; i < chunk.length; i++) {
        if (chunk[i] === chunk[i].toUpperCase()) {
            isUppercase = true;
        }
        const alphabetIndex = isUppercase ? alphabet.indexOf(chunk[i].toLowerCase()) : alphabet.indexOf(chunk[i]);
        if (alphabetIndex >= 0) {
            let newIndex = encode === 'encode' ? alphabetIndex + shift : alphabetIndex - shift;
            if (newIndex >= alphabet.length) {
                newIndex %= alphabet.length;
            }
            if (newIndex < 0) {
                newIndex = (newIndex % alphabet.length) + alphabet.length;
            }
            newChunk += isUppercase ? alphabet[newIndex].toUpperCase() : alphabet[newIndex];
        }
        if (alphabetIndex < 0) {
            newChunk += chunk[i];
        }

        isUppercase = false;
    }

    return newChunk;
};
