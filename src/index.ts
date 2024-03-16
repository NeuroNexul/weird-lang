import chalk from "chalk";
import fs from "fs";
import path from "path";
import Compiler from "./compiler";

console.clear();
console.log(
  chalk.cyanBright(`
██╗    ██╗███████╗██╗██████╗ ██████╗     ██╗      █████╗ ███╗   ██╗ ██████╗ 
██║    ██║██╔════╝██║██╔══██╗██╔══██╗    ██║     ██╔══██╗████╗  ██║██╔════╝ 
██║ █╗ ██║█████╗  ██║██████╔╝██║  ██║    ██║     ███████║██╔██╗ ██║██║  ███╗
██║███╗██║██╔══╝  ██║██╔══██╗██║  ██║    ██║     ██╔══██║██║╚██╗██║██║   ██║
╚███╔███╔╝███████╗██║██║  ██║██████╔╝    ███████╗██║  ██║██║ ╚████║╚██████╔╝
 ╚══╝╚══╝ ╚══════╝╚═╝╚═╝  ╚═╝╚═════╝     ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ 
`)
);

const filename = "compare_num.wl";

const code = fs.readFileSync(
  path.resolve(__dirname, "../codes", filename),
  "utf-8"
);

const compiler = new Compiler(code);
compiler.tokenize();
compiler.parseAST();
compiler.generateCode();

// Create the directory and file if it doesn't exist
const testFileDir = path.resolve(__dirname, `../tests/${filename}`);

if (!fs.existsSync(testFileDir)) {
  fs.mkdirSync(testFileDir);
}

// Print tokens in ../tests/<filename>/tokens.json file
fs.writeFileSync(
  path.resolve(testFileDir, "tokens.json"),
  JSON.stringify(compiler.tokens, null, 2)
);

// Print AST in ../tests/<filename>/ast.json file
fs.writeFileSync(
  path.resolve(testFileDir, "ast.json"),
  JSON.stringify(compiler.ast, null, 2)
);

// Print generated code in ../tests/<filename>/code.js file
fs.writeFileSync(path.resolve(testFileDir, "code.js"), compiler.code);
