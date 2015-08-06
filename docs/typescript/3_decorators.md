---
title: Decorators
---

Decorators were introduced in TypeScript 1.5^[[What's new in TypeScript](https://github.com/Microsoft/TypeScript/wiki/What's-new-in-TypeScript#decorators)] and are also porposed for ES2016.^[[Yehuda Katz - JavaScript Decorators](https://github.com/wycats/javascript-decorators)]

## TODO

- what are decorators
- spec -> can not be added to functions (only classes and class methods)

```typescript
declare type ClassDecorator = <TFunction extends Function>(target: TFunction) => TFunction | void;
declare type PropertyDecorator = (target: Object, propertyKey: string | symbol) => void;
declare type MethodDecorator = <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void;
declare type ParameterDecorator = (target: Object, propertyKey: string | symbol, parameterIndex: number) => void;
```

-> https://github.com/Microsoft/TypeScript/blob/master/src/lib/core.d.ts
-> https://github.com/Microsoft/TypeScript/issues/2249