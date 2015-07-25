---
title: Coding Styles
---

In this chapter you'll find some high-level conventions for coding in TypeScript. If you're looking for a thorough guide, check out idomatic.js^[[Principles of Writing Consistent, Idiomatic JavaScript](https://github.com/rwaldron/idiomatic.js)] or AirBnB's ES6 style guide^[[Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)].

## Types

- Arrays should be defined like this `type[]`, not `Array<type>`.
- Create an `interface` rather than using the `any` type.
The `any` keyword should only be used if absolutely necessary.

## Naming

- `const` should use UPPEER_SNAKE_CASE^[[Snake Case](https://en.wikipedia.org/wiki/Snake_case)]
- `class` names should always be written in PascalCase.^[[Capitalization Styles](https://msdn.microsoft.com/en-us/library/x2dbyw72(v=vs.71).aspx)]
- `interface` names should alawys start with a capital "I" and use PascalCase, e.g. `IMarvelCharacter`.

