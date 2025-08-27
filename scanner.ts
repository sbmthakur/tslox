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

    #isAtEnd() {
        return this.#current >= this.#source.length;
    }

    scanTokens(): Array<Token> {
        while (!this.#isAtEnd()) {
            this.#start = this.#start;
            this.#scanToken();
        }

        this.#tokens.push(new Token(TokenType.EOF, '', null, this.#line));
        return this.#tokens;
    }

    #match(expected: string) {
        if (this.#isAtEnd()) {
            return false;
        }

        if (this.#source.charAt(this.#current) != expected) {
            return false;
        }

        this.#current++;
        return true;
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
            case '!':
                this.#addToken(
                    this.#match('=') ? TokenType.BANG_EQUAL : TokenType.BANG
                );
                break;
            case '=':
                this.#addToken(
                    this.#match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL
                );
            case '<':
                this.#addToken(
                    this.#match('=') ? TokenType.LESS_EQUAL : TokenType.LESS
                );
            case '>':
                this.#addToken(
                    this.#match('=')
                        ? TokenType.GREATER_EQUAL
                        : TokenType.GREATER
                );
                break;

            case '/':
                if (this.#match('/')) {
                    while (!this.#isAtEnd() && this.#peek() != '\n') {
                        this.#advance();
                    }
                } else {
                    this.#addToken(TokenType.SLASH);
                }
                break;

            case ' ':
            case '\r':
            case '\t':
                break;

            case '\n':
                this.#line++;
                break;

            case '"':
                break;

            default:
                Lox.error(this.#line, 'Unexpected character.');
                break;
        }
    }

    #string() {
        while (!this.#isAtEnd() && this.#peek() != '"') {
            if (this.#peek() === '\n') {
                this.#line++;
            }
            this.#advance();
        }

        if (this.#isAtEnd()) {
            Lox.error(this.#line, 'Unterminated string.');
            return;
        }

        this.#advance();

        const value = this.#source.substring(
            this.#start + 1,
            this.#current - 1
        );

        this.#addToken(TokenType.STRING, value);
    }

    #peek() {
        //  if (this.#isAtEnd()) {
        //      return '\0';
        //  }
        return this.#source.charAt(this.#current);
    }

    #advance(): string {
        const nextChar = this.#source.charAt(this.#current++);

        if (!nextChar) {
            throw new Error('Invalid char accessed!');
        }

        return nextChar;
    }

    #addToken(tokenType: TokenType, literal: string | null = null) {
        const text = this.#source.substring(this.#start, this.#current);
        this.#tokens.push(new Token(tokenType, text, literal, this.#line));
    }
}
