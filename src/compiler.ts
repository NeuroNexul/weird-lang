import chalk from "chalk";
import reservedTokens from "./reserved";

type Token = {
  type: string;
  value: string | number;
};

type ASTNode = {
  type: string;
  name?: string;
  value?: string | number | null;
  body?: ASTNode[];
  elseBody?: ASTNode[];
};

type AST = {
  type: string;
  body: ASTNode[];
};

export default class Compiler {
  #input: string; // input string
  #cursor: number; // current position in input (points to current char)
  #tokens: Token[]; // array of tokens
  #ast: AST; // abstract syntax tree
  #code: string; // generated code
  #configs = {
    isAsync: true,
  };

  get tokens() {
    return this.#tokens;
  }

  get ast() {
    return this.#ast;
  }

  get code() {
    return this.#code;
  }

  constructor(input: string) {
    this.#input = input.trim();
    this.#cursor = 0;
    this.#tokens = [];
    this.#ast = {
      type: "program",
      body: [],
    };
    this.#code = "";
  }

  tokenize() {
    console.log(chalk.yellowBright("Tokenizing..."));

    while (this.#cursor < this.#input.length) {
      let char = this.#input[this.#cursor];

      // Skip whitespaces
      if (/^\s$/.test(char)) {
        this.#cursor++;
        continue;
      }

      // Keywords
      if (/[a-zA-Z\_]/.test(char)) {
        let keyword = "";
        while (/[a-zA-Z0-9\_]/.test(char)) {
          keyword += char;
          char = this.#input[++this.#cursor];
        }

        if (reservedTokens.keywords.includes(keyword)) {
          this.#tokens.push({ type: "keyword", value: keyword });
        } else if (reservedTokens.operators.includes(keyword)) {
          this.#tokens.push({ type: "operator", value: keyword });
        } else {
          this.#tokens.push({ type: "identifier", value: keyword });
        }

        continue;
      }

      // Numbers (Integers and Floats)
      if (/[0-9]/.test(char)) {
        let number = "";
        while (/[0-9\.]/.test(char)) {
          number += char;
          char = this.#input[++this.#cursor];
        }

        if (number.includes(".")) {
          this.#tokens.push({ type: "float", value: parseFloat(number) });
        } else {
          this.#tokens.push({ type: "integer", value: parseInt(number) });
        }

        continue;
      }

      // Strings (Single and Double Quotes and Template Strings)
      if (/["'`]/.test(char)) {
        let quote = char;
        let string = `${quote}`;
        char = this.#input[++this.#cursor];

        while (char !== quote) {
          string += char;
          char = this.#input[++this.#cursor];
        }

        string += `${quote}`;
        this.#tokens.push({ type: "string", value: string });
        this.#cursor++;
        continue;
      }

      // Operators
      if (reservedTokens.operators.includes(char)) {
        let operator = char;
        char = this.#input[++this.#cursor];

        while (reservedTokens.operators.includes(operator + char)) {
          operator += char;
          char = this.#input[++this.#cursor];
        }

        this.#tokens.push({ type: "operator", value: operator });
        continue;
      }

      // Brackets
      if (reservedTokens.brackets.includes(char)) {
        this.#tokens.push({ type: "bracket", value: char });
        this.#cursor++;
        continue;
      }

      // End of Statement
      if (char === reservedTokens.endOfStatement) {
        this.#tokens.push({ type: "endOfStatement", value: char });
        this.#cursor++;
        continue;
      }

      // Invalid Character
      console.log(chalk.redBright(`Invalid character: ${char}`));
      this.#cursor++;
    }

    console.log(chalk.greenBright("Tokenizing completed!"));
  }

  parseAST(t?: Token[]) {
    console.log(chalk.yellowBright("\nParsing AST..."));
    const tokens = t || [...this.#tokens]; // Copy of tokens
    const ast = t ? { type: "statement", body: [] } : this.#ast; // Copy of AST

    while (tokens.length > 0) {
      let token = tokens.shift();

      if (!token) break;

      if (token.type === "keyword") {
        if (token.value === "socho") {
          let declaration: ASTNode = {
            type: "declaration",
            name: tokens.shift()?.value as string,
            value: null,
          };

          // Check for assignment
          if (
            tokens[0]?.type === "operator" &&
            (tokens[0]?.value === "equals" || tokens[0]?.value === "=")
          ) {
            tokens.shift(); // Remove the equals sign
            // Build the expression
            let expression = "";
            while (tokens.length > 0 && tokens[0]?.type !== "endOfStatement") {
              const token = tokens.shift();

              if (token?.type === "operator") {
                if (token.value === "plus") {
                  expression += " + ";
                } else if (token.value === "minus") {
                  expression += " - ";
                } else if (token.value === "times") {
                  expression += " * ";
                } else if (token.value === "divided_by") {
                  expression += " / ";
                } else if (token.value === "modulus" || token.value === "mod") {
                  expression += " % ";
                } else if (token.value === "equals") {
                  expression += " == ";
                } else if (token.value === "not_equals") {
                  expression += " != ";
                } else if (token.value === "AND") {
                  expression += " && ";
                } else if (token.value === "OR") {
                  expression += " || ";
                } else if (token.value === "NOT") {
                  expression += " ! ";
                } else if (token.value === "increase") {
                  const nextToken = tokens[0];
                  // If the next token is a number, then it's a post-increment
                  if (nextToken.type === "integer") {
                    tokens.shift(); // Remove the number
                    expression += ` += ${nextToken.value}`;
                  } else {
                    expression += " ++ ";
                  }
                } else if (token.value === "decrease") {
                  const nextToken = tokens[0];
                  // If the next token is a number, then it's a post-decrement
                  if (nextToken.type === "integer") {
                    tokens.shift(); // Remove the number
                    expression += ` -= ${nextToken.value}`;
                  } else {
                    expression += " -- ";
                  }
                } else if (token.value === "sehi") {
                  expression += " true ";
                } else if (token.value === "galat") {
                  expression += " false ";
                } else {
                  expression += token?.value;
                }
              } else {
                expression += token?.value;
              }
            }
            declaration.value = expression.trim();
          }

          ast.body.push(declaration);
        }

        if (token.value === "likho") {
          ast.body.push({
            type: "print",
            value: tokens.shift()?.value as string,
          });
        }

        if (token.value === "pucho") {
          const nextToken = tokens.shift();

          if (tokens[0]?.type === "string") {
            ast.body.push({
              type: "input",
              name: nextToken?.value as string,
              value: tokens.shift()?.value as string,
            });
          } else {
            ast.body.push({
              type: "input",
              name: nextToken?.value as string,
              value: null,
            });
          }
        }

        if (token.value === "agar") {
          let condition: ASTNode = {
            type: "condition",
            value: "",
            body: [],
            elseBody: [],
          };

          let expression = "";
          while (tokens.length > 0 && tokens[0]?.type !== "bracket") {
            const token = tokens.shift();

            if (token?.type === "operator") {
              if (token.value === "equals") {
                expression += " == ";
              } else if (token.value === "not_equals") {
                expression += " != ";
              } else if (token.value === "AND") {
                expression += " && ";
              } else if (token.value === "OR") {
                expression += " || ";
              } else if (token.value === "NOT") {
                expression += " ! ";
              } else {
                expression += token?.value;
              }
            } else {
              expression += token?.value;
            }
          }

          const bodyTokens: Token[] = [];
          let bracketCount = 0;
          while (tokens.length > 0) {
            const token = tokens.shift();
            if (token?.type === "bracket") {
              if (token.value === "{") {
                bracketCount++;
              } else if (token.value === "}") {
                bracketCount--;
              }
            }

            if (bracketCount === 0) {
              break;
            }

            bodyTokens.push(token as Token);
          }

          // Check for "warna" (else)
          if (tokens[0]?.value === "warna") {
            tokens.shift(); // Remove the "warna" token
            const elseBodyTokens: Token[] = [];
            bracketCount = 0;
            while (tokens.length > 0) {
              const token = tokens.shift();
              if (token?.type === "bracket") {
                if (token.value === "{") {
                  bracketCount++;
                } else if (token.value === "}") {
                  bracketCount--;
                }
              }

              if (bracketCount === 0) {
                break;
              }

              elseBodyTokens.push(token as Token);
            }

            condition.elseBody = this.parseAST(elseBodyTokens)!.body;
          }

          condition.value = expression.trim();

          condition.body = this.parseAST(bodyTokens)!.body;

          ast.body.push(condition);
        }
      }

      this.#cursor++;
    }

    console.log(chalk.greenBright("Parsing AST completed!"));

    if (t) {
      return ast;
    } else {
      this.#ast = ast;
    }
  }

  generateCode(a?: ASTNode[], isAsyncValue?: boolean) {
    console.log(chalk.yellowBright("\nGenerating Code..."));
    const astBody = a || this.#ast.body; // Copy of AST
    const isAsync =
      isAsyncValue === undefined ? this.#configs.isAsync : isAsyncValue;

    let isInputFunctionDefined = false;

    let code = isAsync ? "(async () => {\n" : "";

    for (let node of astBody) {
      if (node.type === "declaration") {
        if (node.value === null) {
          code += `let ${node.name};\n`;
        } else {
          code += `let ${node.name} = ${node.value};\n`;
        }
      }

      if (node.type === "print") {
        code += `console.log(${node.value});\n`;
      }

      if (node.type === "input") {
        if (!isInputFunctionDefined) {
          code =
            `const readline = require('node:readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});
function readLineAsyncQuestion(message) {
  return new Promise((resolve, reject) => {
    readline.question(message, (answer) => {
      resolve(answer);
    });
  });
}\n\n` + code;

          isInputFunctionDefined = true;
        }
        code += `let ${node.name} = await readLineAsyncQuestion(${
          node.value || '""'
        });\n`;
      }

      if (node.type === "condition") {
        code += `if (${node.value}) {\n`;
        code += this.generateCode(node.body, false);
        code += `}\n`;

        if (node.elseBody && node.elseBody.length > 0) {
          code += `else {\n`;
          code += this.generateCode(node.elseBody, false);
          code += `}\n`;
        }
      }
    }

    if (isInputFunctionDefined) {
      code += "readline.close();\n";
    }
    code += isAsync ? "})();" : "";
    this.#code = code;
    console.log(chalk.greenBright("Code generation completed!"));

    if (a) {
      return code;
    }
  }
}
