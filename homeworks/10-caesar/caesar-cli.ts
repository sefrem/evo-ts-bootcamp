const { pipeline } = require('stream');
import { Command } from 'commander';
import { caesarCipher } from './caesarCipher';
import * as fs from 'fs';
import { Cipher, engAlphabet, isCipher, isLang, rusAlphabet } from './types';

const program = new Command();

const setInput = (input: string) => (input ? fs.createReadStream(input) : process.stdin);
const setOutput = (output: string) => (output && fs.existsSync(output) ? fs.createWriteStream(output) : process.stdout);

const runCaesar = (args: Record<string, string>): void => {
    const caesarEncrypt = caesarCipher(
        args.language === 'rus' ? rusAlphabet : engAlphabet,
        args.action as Cipher,
        +args.shift,
    );
    pipeline(
        setInput(args.input),
        async function* (source: NodeJS.ReadStream) {
            source.setEncoding('utf8');
            for await (const chunk of source) {
                yield caesarEncrypt(chunk);
            }
        },
        setOutput(args.output),
        (err: any) => console.log(err),
    );
};

program
    .version('1.0.0')
    .requiredOption('-s, --shift <number>', 'Set the shift for decode/encode data', value => {
        if (value.search(/^-?[0-9]+$/) === -1) {
            throw Error('Shift must be a number');
        }
        return value;
    })
    .requiredOption(
        '-a, --action <string>',
        'Specify what action you want to perform. It could be either encode or decode',
        value => {
            if (!isCipher(value)) {
                throw Error('Action is not of type Cipher');
            }
            return value;
        },
    )
    .option('-i, --input <string>', 'Specify the file where to get the data from ')
    .option('-o, --output <string>', 'Specify the file to save the data to ')
    .option(
        '-l, --language <string>',
        'Specify the language of the input data. It could be either eng or rus',
        value => {
            if (!isLang(value)) {
                throw Error('Language is not of type Language');
            }
            return value;
        },
    )
    .addHelpText(
        'after',
        'Examples:\n' +
            '  node caesar-cli --shift=7 --action=encode        Encode data from stdin with shift 7 and print result to stdout\n' +
            '  node caesar-cli -s 2 -a decode -i topsecret.txt  Decode topsecret.txt with shift 2 and print result to stdout\n' +
            "N.B.: 1. If the output file doesn't exist it wouldn't be created. You can write output stream only to the existing file.\n" +
            '      2. If --input option is omitted - STDIN is used as an input source. Use Ctrl+C for break input.\n' +
            '      3. If --output option is omitted - STDOUT is used as an output destination.\n' +
            '      4. --shift value can be negative and can exceed the size of the alphabet.\n' +
            '      5. If --language option is omitted, English is set by default.\n' +
            '      6. If --help is given the help is displayed and other options are ignored.\n' +
            '      7. If --version is given and --help has omitted the version of the app is displayed and other options are ignored.\n' +
            'Values for options can be set like "--action encode" (whitespace separated) or "--action=encode" (= separated). It doesn\'t matter.',
    )
    .action(runCaesar);

program.parse(process.argv);
