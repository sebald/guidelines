---
title: Declaration Files
---

It would be a shame if we could not use the myriad of existing JavaScript libraries, frameworks and npm modules in conjunction with our TypeScript code. In order to seamlessly integrate external libraries with your TypeScript project you have to make use of *declaration files*.

Declaration files are marked with a `.d.ts` extension and describe the interface of an JavaScript libarby. This allows the compiler to provide you with the same features, like intellisense or compile time error messages, as if the third-party code was written in TypeScript.

Actually, every installation of TypeScript ships with a file called `lib.d.ts`. The files contains the EcmaScript APIs, like `window`, `Object` or `Math`. This is an prime example how declaration files can fill in the gaps for JavaScript code TypeScript does not know about.

## Definitely Typed

Definition files are nice and all, but on the other hand there are required whenever you want to work with a third-party library. Fortunately, soon after TypeScript was released Boris Yankov started the *DefinitelyTyped* project to host declaration files for popular JavaScript libraries. There are already more than 2,000 definitions for external libaries, so if in doubt head over to [definitelytyped.org](http://definitelytyped.org/)!