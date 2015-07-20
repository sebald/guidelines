---
title: Introduction
---

TypeScript was designed by Anders Hejlsberg at Microsoft to help write entersprise scale JavaScript.^[[Anders Hejlsberg - Introducing TypeScript](https://channel9.msdn.com/posts/Anders-Hejlsberg-Introducing-TypeScript)] It is a superset of JavaScript with optional static typing and has support for ES2015 features like *classes*, *arrow functions* and *template literals*.

Many teams from large companies have continually arrived at the conclusion that adding types enhances quality and understandability of code.^[[Statically typed JavaScript via Microsoft TypeScript, Facebook Flow and Google AtScript](http://www.2ality.com/2014/10/typed-javascript.html)] However static typing does add complexity and visual clutter. Especially if you need to manually specify a type (like in Java). Fortunately TypeScript does not force you to use types and will try to infer as much type information as it can in order to give you type safety. As a result TypeScript can provide compile time type safety for your JavaScript code.

Besides beeing a stronlgy-typed language, one of the biggest selling points of TypeScript is the tooling it provides. IDEs can take adavantage of feature like advanced autocompletion and code navigation to improve the development experience. Especially displaying errors that otherwhise would only show up once the code is deployed to the browser saves a lot of time and frustation. Also, the fact that intellisense and basic refactoring (e.g. renaming a symbol) are reliable makes a huge impact on the process of writing and refactoring code.

While TypeScript greatly improves the coding experience, it adds an additional step to the build process. Since browsers can not intepret TypeScript your code has to be transpilled to JavaScript. But since you usually have a complex build process that is handled by a task runner anyway the added complexity can easily be solved by using an existing plugin, like gulp-typescript^[[TypeScript plugin for Gulp](https://github.com/ivogabe/gulp-typescript)].
