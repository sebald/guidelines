---
title: Decorators
---

Decorators were introduced in TypeScript 1.5^[[What's new in TypeScript](https://github.com/Microsoft/TypeScript/wiki/What's-new-in-TypeScript#decorators)] and are also porposed for ES2016 by Yehuda Katz.^[[Yehuda Katz - JavaScript Decorators](https://github.com/wycats/javascript-decorators)] The proposal specifies a decorator as a function that makes it possible to annotate and modify classes and their properties at design time.

Implementing the decorator pattern is already possible in current JavaScript versions by passing an object or function to a decorator method. But the proposed syntax uses `@` as a prefix for the decorator function which would make applying decorators very declarative.

A look at TypeScript's `core.d.ts`^[[https://github.com/Microsoft/TypeScript/blob/master/src/lib/core.d.ts](TypeScript `core.d.ts`)] show that there are currently for different types of decorators:

```typescript
declare type ClassDecorator = <TFunction extends Function>(target: TFunction) => TFunction | void;
declare type PropertyDecorator = (target: Object, propertyKey: string | symbol) => void;
declare type MethodDecorator = <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void;
declare type ParameterDecorator = (target: Object, propertyKey: string | symbol, parameterIndex: number) => void;
```

You can apply a decorator by prepending it to whatever you want to decorate. A simple example is to make a class method readonly.^[[Addy Osmani - Exploring ES7 Decorators](https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841)] The following `readonly` function implements this by setting the `writable` property of the method to `false`. The second code snippet shows how the decorator then is applied to the `sayHello` method.

```typescript
export readonly( target, key, descriptor ) {
    descriptor.writable = false;
    return descriptor;
}
```

```typescript
import { readonly } from 'util/decorators';

class Person {
    public name:string;

    construcotr( name:string ) {
        this.name = name;
    }

    @readonly
    sayHello() {
        return `{Hello, my name is ${this.name}}!`;
    }
}
```

The spec does not yet include a decorator for functions, because hoisting makes it not possible. TypeScript conforms the current decorator draft.^[[TypeScript Issue #2249 - Decorators](https://github.com/Microsoft/TypeScript/issues/2249)] Regular functions can be decorated by wrapping the decorator arround them, like `let decorateFn = decorator(myFunction);`.