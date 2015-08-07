---
title: Dependency Injection
---

Since we are coding in TypeScript and make heavy use of the `class` syntax, we can not use automated annotations tools, such as `ng-annotate`^[[ng-anotate on Github](https://github.com/olov/ng-annotate)]. Manually adding dependency injection can be done by adding a static property called `$inject` to our classes (see snippet below), which would conform the Angular 1.x depenceny injection annotation.^[[Angular Documentation - Dependency Injection](https://docs.angularjs.org/guide/di#-inject-property-annotation)]

``` typescript
class MarvelApiService {
	public static $inject = ['$http', '$q'];

    constructor(
    	private $http::ng.IHttpService
    	private $q: ng.IQService
    ) {
        // Code goes here
    }
}
```

Using decorators is another more declarative way of adding dependency injection to your classes (for an introduction of decorators see the TypeScript section). Because we want to decorate classes and their methods we have to conform both the `ClassDecorator` and `MethodDecorator` interface. The below code snippet is an example implementation.

```typescript
export function inject (...dependencies:string[]) {
    return function decorator (
        target:Function,
        key?:string|symbol,
        descriptor?:TypedPropertyDescriptor<any>
    ) {
        // If "descriptor" decorate
        // -> class method, otherwhise
        // -> class
        var receiver = descriptor ? descriptor.value : target;
        receiver.$inject = dependencies;
    }
}
```

Injecting dependencies can then be done by simply prepending a `class` or a class method with `@inject`. The decorator accepts any number of string arguments. Injecting the `MarvelApiService` would look like this:

```typescript
impport { inject } from 'utils/decorators';

@inject('$http', '$q')
class MarvelApiService {
    constructor(
    	private $http::ng.IHttpService
    	private $q: ng.IQService
    ) {
        // Code goes here
    }
}
```

It may not look like a big improvement ofer the `static` property syntax, but you'll notice it when you have mulitple functions with multiple dependencies.