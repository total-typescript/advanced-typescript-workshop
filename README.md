# Advanced TypeScript Workshop

Hello! My name's [Matt Pocock](https://twitter.com/mattpocockuk). This is a workshop repo to teach you about Advanced TypeScript.

## Topics Covered

- Using `typeof` and `as const` to derive types from runtime
- Generics
- Assertion functions & type predicates
- Template literal types
- Conditional types & `infer`
- Diagnosing type errors

The plan of the workshop is to get you more confident with complex type signatures, less likely to want to use `any`, and faster at diagnosing errors.

## Workshop Plan

We'll be running from 9AM PT - 2PM PT. Here's the plan:

- 09:00-9:15: **Setup & Housekeeping**
- 09:15-10:30: **First session**
- 10:30-10:45: **Coffee Break**
- 10:45-12:00: **Second session**
- 12:00-12:30: **Lunch**
- 12:30-14:00: **Third session**

We'll be working through the material in this repository, mostly in small groups.

## System Requirements

- git v2.14.1 or greater
- NodeJS v16.15.0 or greater
- npm v8.5.0 or greater

All of these must be available in your `PATH`. To verify things are set up properly, you can run this:

```bash
git --version
node --version
npm --version
```

## Setup

After you've made sure to have the correct things (and versions) installed, you should be able to just run a few commands to get set up:

```bash
git clone https://github.com/mattpocock/advanced-typescript-workshop.git
cd advanced-typescript-workshop
npm install
```

That's it! You'll now have all the dependencies you need to work through the workshop exercises.

## Exercises

Exercises are in the [`./exercises`](./exercises) folder. They're designed to be worked through one after the other.

Each exercise follows a similar pattern:

- Look at the file with the `*.code.ts` extension. This gives you the code we're going to be working through and trying to understand.
- Read through the `*.exercise.ts` file. Read through the file, comment-by-comment, and follow the instructions by either editing the file inline, or editing the `*.code.ts` file.
- Wherever you see reference to `Solution #1`, check the `*.solutions.ts` file when you want to see the solution. **Make sure you check the solution before proceeding!** There's often crucial information there.

Be careful to read through each part of the exercise carefully - if you skip over parts of them, it might get difficult to find your way back.

Also, consider **splitting your IDE into two panels**, both looking at the same file. You can read from one, and write in the other - meaning you don't have to scroll up and down too much.

### Emoji

Exercises use emoji to express various different things:

- 💡 - A new idea appears!
- 🛠 - Write some code!
- 🧑‍💻 - Your team lead has some thoughts...
- 🕵️‍♂️ - Time for an investigation...
- ⛔️ - Eek! A type error.
- ✅ - Hooray! The type error was fixed.
- 🚁 - Hover over something.
- 🔮 - Do a go-to-definition.

## License

This material is available for private, non-commercial use under the [GPL version 3](http://www.gnu.org/licenses/gpl-3.0-standalone.html).
