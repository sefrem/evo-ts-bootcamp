import { caesarCipher } from '../caesarCipher';
import { engAlphabet, rusAlphabet } from '../types';

const engSource = 'I am a man';
const engEncoded = 'L dp d pdq';
const engNegativeEncoded = 'F xj x jxk';
const engBigShiftEncoded = 'K co c ocp';

const engWithOtherSymbolsSource = 'Whats in той коробке$#??!';
const engWithOtherSymbolsEncoded = 'Zkdwv lq той коробке$#??!';

const rusSource = 'Малиновое варенье';
const rusEncoded = 'Пголрсесз егузряз';

describe('CaesarCipher', () => {
    const engCaesarEncode = caesarCipher(engAlphabet, 'encode', 3);
    const engCaesarDecode = caesarCipher(engAlphabet, 'decode', 3);
    const rusCaesarEncode = caesarCipher(rusAlphabet, 'encode', 3);
    const rusCaesarDecode = caesarCipher(rusAlphabet, 'decode', 3);
    const negativeShiftCaesar = caesarCipher(engAlphabet, 'encode', -3);
    const bigShiftCaesar = caesarCipher(engAlphabet, 'encode', 80);

    it('should correctly encode English language', () => {
        expect(engCaesarEncode(engSource)).toBe(engEncoded);
    });

    it('should correctly decode English language', () => {
        expect(engCaesarDecode(engEncoded)).toBe(engSource);
    });

    it('should correctly encode Russian language', () => {
        expect(rusCaesarEncode(rusSource)).toBe(rusEncoded);
    });

    it('should correctly decode Russian language', () => {
        expect(rusCaesarDecode(rusEncoded)).toBe(rusSource);
    });

    it('should leave other languages and symbols unmodified', () => {
        expect(engCaesarEncode(engWithOtherSymbolsSource)).toBe(engWithOtherSymbolsEncoded);
    });

    it('should work with negative shift value', () => {
        expect(negativeShiftCaesar(engSource)).toBe(engNegativeEncoded);
    });

    it('should work with shift value being more than alphabet length', () => {
        expect(bigShiftCaesar(engSource)).toBe(engBigShiftEncoded);
    });
});
