export const engAlphabet = 'abcdefghijklmnopqrstuvwxyz' as const;
export const rusAlphabet = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя' as const;
export type Cipher = 'encode' | 'decode';
export type Alphabet = typeof engAlphabet | typeof rusAlphabet;
export type Language = 'eng' | 'rus';

export function isCipher(value: string): value is Cipher {
    const keys = ['encode', 'decode'];
    return keys.indexOf(value) !== -1;
}

export function isLang(value: string): value is Language {
    const keys = ['eng', 'rus'];
    return keys.indexOf(value) !== -1;
}
