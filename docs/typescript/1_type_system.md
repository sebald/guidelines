---
title: Type System
---

JavaScript is a dynamically typed language, which means it allows variables and objects und change their properties and behaviour on runtime. The following example is valid JavaScript:

```javascript
let value = 123;
value = 'Hello World!';
value = function ( options ) { ... };
```

This is a very simple example and could be justified. However, as soon as your application and team grows, code like this could easily be overlooked and cause errors that are hard to find and fix because they only occur on runtime. This is especially true if functions need a certain call signature (line 3) and there is no documentation on how to use it. If you are allowed to assign various types to the same variable, you can not be certain later on what type the variable is and alawys have to check its type.

## Infering Types

TypeScript tries to infer as much type information as it can in order to give to type safety and prevent careless mistakes. If you run the above snippet through the TypeScript compiler, it will infer that the variable `value` has to be a `Number`. In this case the type information will be *implicitly* applied by TypeScript and the compiler will throw two errors:

```bash
Type 'string' is not assignable to type 'number'.
let value: number
Type '(options: any) => void' is not assignable to type 'number'.
let value: number
```

Types can also be *explicit*. For this, TypeScript introduces a very simple syntax ([see annotations](#annotations)). There are mutiple reasons why you want to enforce a specific type on an object. One is to ensure the compiler sees, what you thought it should see. Another is to document your code for the next developer who has to read it (maybe even future you!).^[[TypeScript Deep Dive](http://basarat.gitbooks.io/typescript/)] This also includes using your code as an API or library.

## Duck Typing

Especially when working with complex objects developers can profit from strong typing. For complex variables TypeScript uses a method called duck-typing.

> When I see a bird that walks like a duck and swims like a duck and quacks like a duck, I call that bird a duck.^[Heim, Michael (2007). [Exploring Indiana Highways](http://books.google.com/books?id=j7zds6xx7S0C&pg=PA68&dq=%22james+Riley%22+OR+%22James+Whitcomb+Riley%22+bird++duck&num=100) p. 68.]

This means the TypeScript compiler will check if properties have the same set of properties. If so, they are considered to to of the same type. To illustrate this, red the following example:

```typescript
let character = {
    name: 'Peter Jason Quill',
    first_appearance: 'January, 1976'
};
character = {
    name: 'Groot',
    first_appearance: 'November, 1960'
};
```

If you would try to assign an object to `character` that is missing one of the two properties (`name`, `first_appearance`), the compiler would throw an error. However assiging an object with an additional property is allowed:

```typescript
character = {
    name: 'Rocket Raccoon',
    first_appearance: 'Summer, 1976',
    group_affililations: 'Guardians of the Galaxy'
};
```

## Annotations

TypeScript uses annotations to enforce a certain type on a variable, including arrays. Function arguments and return values can also be statically typed. The following example shows how the annotation syntax works:

```typescript
// Variable
let nbr: number = 2;

// Array
let stringArray: string[];
stringArray.push('red');
stringArray.push('blue');

// Function
function power (nbr: number): number {
    return nbr * nbr;
}
```

## Interfaces

In order to create more complex types than primites (`number`, `string`, `boolean`), TypeScript also allows us to create own abstrac types in form of interfaces. An interface defines a set of properties and method signatures an object must implement. If an object adheres to an interface, it *implements* that interface.^[["What is an Interface"](http://docs.oracle.com/javase/tutorial/java/concepts/interface.html). The Java Tutorials. Oracle]

Following the example from the [duck typing section](#duck-typing) an object describing a `character` could be defined by an interface as follows:

```typescript
interface ICharacter {
    name: string;
    first_appearance: string;
    group_affililations?: string;
    isVillain(): boolean;
}
```

To show all possible use cases a method `isVillain()` was added. If you would try to use an object from the [duck typing section](#duck-typing) with the `ICharacter` interface the compiler would throw an error because none of the `character` variable imeplements the interface.

```bash
Type '{ name: string; first_appearance: string; }' is not assignable to type 'ICharacter'.
Property 'isVillain' is missing in type '{ name: string; first_appearance: string; }'.
let character: ICharacter
```

## Special types `any` and `void`

TypeScript tries really hard to stay out of your way and sometimes (because of reasons) you need a variable to be flexible engough to mix and match its types. For this case, TypeScript has the `any` keyword. This type is compatible with *all other types*. Meaning that you can assign anything to a variable flagged as `any`.

```typescript
let value: any = 123;
value = 'Hello World!';
```

Furthermore, if a function does not have a return type it should be annotated with `:void`.

```typescript
function log (str: string): void { ... }
```