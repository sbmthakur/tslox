import { Lox } from './lox';
import { Token } from './token';
import { TokenType } from './tokenType';

export class Scanner {
    readonly #source: string;
    readonly #tokens: Array<Token> = [];

    #start = 0;
    #current = 0;
    #line = 1;

    constructor(source: string) {
        this.#source = source;
    }

    scanTokens(): Array<Token> {
        while (this.#current < this.#source.length) {
            this.#start = this.#start;
            this.#scanToken();
        }

        this.#tokens.push(new Token(TokenType.EOF, '', null, this.#line));
        return this.#tokens;
    }

    #scanToken() {
        const c = this.#advance();

        switch (c) {
            case '(':
                this.#addToken(TokenType.LEFT_PAREN);
                break;
            case ')':
                this.#addToken(TokenType.RIGHT_PAREN);
                break;
            case '{':
                this.#addToken(TokenType.LEFT_BRACE);
                break;
            case '}':
                this.#addToken(TokenType.RIGHT_BRACE);
                break;
            case ',':
                this.#addToken(TokenType.COMMA);
                break;
            case '.':
                this.#addToken(TokenType.DOT);
                break;
            case '-':
                this.#addToken(TokenType.MINUS);
                break;
            case '+':
                this.#addToken(TokenType.PLUS);
                break;
            case ';':
                this.#addToken(TokenType.SEMICOLON);
                break;
            case '*':
                this.#addToken(TokenType.STAR);
                break;

            default:
                Lox.error(this.#line, 'Unexpected character.');
                break;
        }
    }

    #advance(): string {
        const nextChar = this.#source.at(this.#current++);

        if (!nextChar) {
            throw new Error('Invalid char accessed!');
        }

        return nextChar;
    }

    #addToken(tokenType: TokenType, literal: object | null = null) {
        const text = this.#source.substring(this.#start, this.#current);
        this.#tokens.push(new Token(tokenType, text, literal, this.#line));
    }
}
