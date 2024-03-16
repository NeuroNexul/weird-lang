```
██╗    ██╗███████╗██╗██████╗ ██████╗     ██╗      █████╗ ███╗   ██╗ ██████╗
██║    ██║██╔════╝██║██╔══██╗██╔══██╗    ██║     ██╔══██╗████╗  ██║██╔════╝
██║ █╗ ██║█████╗  ██║██████╔╝██║  ██║    ██║     ███████║██╔██╗ ██║██║  ███╗
██║███╗██║██╔══╝  ██║██╔══██╗██║  ██║    ██║     ██╔══██║██║╚██╗██║██║   ██║
╚███╔███╔╝███████╗██║██║  ██║██████╔╝    ███████╗██║  ██║██║ ╚████║╚██████╔╝
 ╚══╝╚══╝ ╚══════╝╚═╝╚═╝  ╚═╝╚═════╝     ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝
```

Hey there! This is Weird Lang, a fun little experiment that lets you code in Hinglish. It's basically a goofy way to learn and play with programming concepts.

We're still building and improving Weird Lang, so there's a lot more to come! In the meantime, feel free to explore what's here and even add your own weird and wonderful ideas! We welcome anyone who wants to contribute and help make Weird Lang even more awesome.

This README will show you:

- How to get started with Weird Lang (it's easy!)
- The basics of Weird Lang's syntax (don't worry, it's pretty straightforward)
- How to contribute your own code and ideas (we love collaboration!)

Let's get weird with code!

---

## Getting Started

This project uses typescript for type-safety. Also nodemon helps in developement experience.

To get started -

- Pull this repo locally or download the zip.
- Run `yarn install` to install all required dependencies.
- Change the filename in the `src/index.ts` file.
- Run `yarn dev` or `yarn start` to compile the code.
- Check the new folder `/tests/<filename>` with all outputs.

Try chenging or writing your own code with the extension `.wl` or use the demos.

## Weird Lang Syntax

This experimental codebase lets you code in Hinglish language what makes it weired. Although the syntax are very simple, yet you need to know them.

1. The line ends with `;` which is must to use.
2. It is globally asynchronous. Means you can directly use `await` statement in it. (Statement not added yet)
3. Brackets are not necessory unless its a new block.

| syntax | work         | example                             |
| ------ | ------------ | ----------------------------------- |
| socho  | declearation | `socho a = 5.5;`                    |
| likho  | print        | `` likho `Hello ${name}`; ``        |
| pucho  | input        | `pucho name "What is your name: ";` |
| agar   | condition    | `agar <condition> { <statements> }` |

Rest keywords are yet to be done. You can see the whole list in `src/reserved.ts` file. All the operators are ready to be used.

See the `equals` operator works differently in different cases.

`socho a equals 20;` Here it is an assignment operator. The following code converts into `let a = 20;`

```
agar a equals 20 {
  likho "a is 20";
}
```
Here it is a conditional operator. The following converts into -
```
if (a == 20) {
  console.log("a is 20");
}
```

---

## Inspiration

The experimental project is inspired by [Piyush Garg's video on building Own Programming Language](https://youtu.be/rTuTLc_u6qw?si=G6nTqRRZsDTZpT4K).

![Video](https://i.ytimg.com/vi/rTuTLc_u6qw/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDtIly-PnO_WHWW9ztYzjCUES50MQ)
