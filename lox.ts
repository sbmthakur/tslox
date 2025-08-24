import { readFile } from 'node:fs/promises';
import { createInterface } from 'node:readline/promises';
import process from 'node:process';

export class Lox {
    static hadError = false;
    constructor() {
        const args = process.argv;

        if (args.length > 1) {
            console.error('Usage: tslox [script]');
            process.exit(64); // EX_USAGE
        } else if (args.length === 1) {
            Lox.#runFile(args[0]);
        } else {
            Lox.#runPrompt();
        }
    }

    static async #runFile(path) {
        if (this.hadError) {
            process.exit(65); // EX_DATAERR
        }
        const fileContents = await readFile(path, 'utf8');
        this.#run(fileContents);
    }

    static async #runPrompt() {
        this.hadError = true;
        const rl = createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: true,
        });

        rl.on('line', async (line) => {
            try {
                await this.#run(line);
            } catch (error) {
                console.error(error);
            }
        });

        rl.on('close', () => {
            console.log('Exiting tslox interpreter...');
        });
    }

    static async #run(code: string) {
        const tokens = this.#scanTokens(code);
        console.log('Tokens:', tokens);
    }

    static #scanTokens(code) {
        return [];
    }

    static error(line: number, message: string) {
        this.#report(line, '', message);
        process.exit(70); // EX_SOFTWARE
    }

    static #report(line: number, where: string, message: string) {
        console.error(
            `[line ${line}] Error${where ? ` at '${where}'` : ''}: ${message}`
        );
        this.hadError = true;
    }
}
