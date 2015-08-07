---
title: Modules
---

Back in 2009 when Angular was created there was no convention for importing files in JavaScript. Therefore Angular 1.x uses its own syntax to register modules (`angular.module`), which does not conform the ES2015 module syntax (`import`, `export`).^[[Dr. Axel Rauschmayer - ECMAScript 6 modules: the final syntax](http://www.2ality.com/2014/09/es6-modules-final.html)]

Fortunately both module loaders are compatible and we can use ES2015 modules to further improve our code base. In addition, using the ES2015 modules syntax will make it easier for us to migrate to Angular 2, once its ready.

It is best to put the application logic and module registration into seperate files. This way it will be easier to reason about the structure of your application and makes testing individual modules even better. At a later point you even might remove the files that register as a Angular module and only use ES2015 module syntax.

In order to illustrate this recall the `MarvelApiService` from the TypeScript chapter. If you have the service in a file named `marve-api.service.ts` and a HTTP interceptor in another files called `marvel-key.interceptor.ts` importing these files into an Angular module, located in `marvel.module.ts`, looks like this:


```typescript
import angular from 'angular';
import MarvelApiService from './marvel-api.service';
import MarvelKeyInterceptor from './marvel-key.interceptor';

export default angular
    .module('marvel', [])
    .service('MarvelApiService', MarvelApiService)
    .config(['$httpProvider', ( provider:ng.IHttpProvider ) =>  {
        provider.interceptors.push(() => new MarvelKeyInterceptor());
    }]);
```

Loading other Angular modules as dependencies is also much simpler, because you do not have to remember their names. If you need the `marvel` module as a dependency you can do the following in order to require it:

```typescript
import angular from 'angular';
import MarvelModule from './services/marvel/marvel.module';

export default angular
    .module('myAwesomeApp', [
        MarvelModule.name
    ]);
```

## On using `class`

The introduction of `class` allows us to write a lot of our Angular modules as such. Below are examples how you can implement services, controllers and directives as classes, followed by some remarks about what other objects can be implemented as classes or remain regular functions.

### Service

Since services in Angular are following the constructor pattern^[[Addy Osmani - Learning JavaScript Design Patterns](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#constructorpatternjavascript)] implementing them as a `class` is straight forward:

```typescript
// Path: services/marvel/marvel-api.service.ts
import angular from 'angular';
import MARVEL_CONFIG from './marvel.config';

class MarvelApi {
    public $http:ng.IHttpService;

    constructor( $http:ng.IHttpService ) {
        this.$http = $http;
    }

    getSuggestions ( query:string ) {
        return this.$http.get(
           `${MARVEL_CONFIG.base}${MARVEL_CONFIG.characters}?nameStartsWith=${query}`
        );
    }
}
```

```typescript
// Path: services/marvel/marvel.module.ts
import * as angular from 'angular';
import MarvelApi from './marvel-api.service';

export default angular
    .module('whiz.marvel', [])
    .service('MarvelApi', MarvelApi);

```

### Controller
Implementing controllers is as simple as services, because they are also constructors:

```typescript
// Path: app/app.controller.ts
import MarvelApi from '../services/marvel/marvel-api.service';

export default class AppController {
    public api:MarvelApi;
    public sugesstions:string[] = [];

    constructor( MarvelApi:MarvelApi ) {
        this.api = MarvelApi;
    }

    fetchSuggestions( query:string ) {
        this.api.getSuggestions( query )
            .then( (suggestions) => {
                this.sugesstions = sugesstions;
            });
    }
}
```

```typescript
// Path: app/app.module.ts
import * as angular from 'angular';
import AppController from './app.controller';

export default angular
    .module('app', [])
    .service('AppController', AppController);
```


### Direcitve

Implementing directives with the `class` syntax is a little bit different because Angular's `.directive` API expect a factory rather than a constructor. The difference between those two is very suttle. A constructor is an object that instaniates with the `new` keyword, while a factory will *return* a new instance of the object.

There is no clear winner (yet?) among the options. So choose the style that suits you best. It is more important that everyone in your team will use the same style in order to be consistent.

#### (1) As class with the factory in the `.directive` callback
Your directive definition object is implemented as a class with static properties only. When registering the directive with the Angular module system an annonymous function is called, which creates a new instance.

```typescript
// Path: components/say-hello/say-hello.component.ts
import controller from './say-hello.controller';

export default class SayHelloComponent implements ng.IDirective {
    restrict = 'E';
    scope = {};
    template = '<strong>Good Day, {{ vm.name }}!!!</strong>';
    controller = controller;
    controllerAs = 'vm';
    bindToController = {
        name: '='
    };
}
```

```typescript
// Path: components/say-hello/say-hello.module.ts
import angular from 'angular';
import SayHelloComponent from 'say-hello.component';

export default angular
    .module('hello', [])
    .directive('sayHello', () => new SayHelloComponent());
```

#### (2) As a factory with a static `create` method

You define your directive as described in (1) and create a factory class with a `create` method in the same file. Now you can register the factory's `create` method with Angular.

```typescript
// Path: components/say-hello/say-hello.component.ts
import controller from './say-hello.controller';

export class SayHelloComponent implements ng.IDirective {
    restrict = 'E';
    scope = {};
    template = '<strong>Good Day, {{ vm.name }}!!!</strong>';
    controller = controller;
    controllerAs = 'vm';
    bindToController = {
        name: '='
    };
}

export default class SayHelloFactory {
    public static create:ng.IDirectiveFactory = () => {
        return new SayHelloComponent();
    }
}
```

```typescript
// Path: components/say-hello/say-hello.module.ts
import angular from 'angular';
import SayHelloFactory from 'say-hello.component';

export default angular
    .module('hello', [])
    .directive('sayHello', SayHelloFactory.create);
```

#### (3) As a factory function

You define your directive as described in (1) and create a dedicated factory method in the same file. After that you register the exported  function as an Angular directive.

```typescript
// Path: components/say-hello/say-hello.component.ts
import controller from './say-hello.controller';

export class SayHelloComponent implements ng.IDirective {
    restrict = 'E';
    scope = {};
    template = '<strong>Good Day, {{ vm.name }}!!!</strong>';
    controller = controller;
    controllerAs = 'vm';
    bindToController = {
        name: '='
    };
}

let SayHelloFactory:ng.IDirectiveFactory = () => {
    return new SayHelloComponent();
}
export default SayHelloComponent;
```

```typescript
// Path: components/say-hello/say-hello.module.ts
import angular from 'angular';
import SayHelloFactory from 'say-hello.component';

export default angular
    .module('hello', [])
    .directive('sayHello', SayHelloFactory);
```

Note that in all the above cases you could create an object literal instead. However, creating a class and exporting it will give you better capability to thoroughly test your directive.

### Remaining Modules

Most of the time you will create controllers, services and directive in Angular. But the remainder modules have also their applications. For instance, the `.provider` module is extremly useful if you want to configure your services and factories.

If you register a service or a factory with Angular a provider is created. This provider will return your service/factory whenever its `$get` method is called. So basically, behind the scences Angular will always use the provider pattern to instanciate services and factories.^[[Pascal Precht - Service vs Factory - Once and for all](http://blog.thoughtram.io/angular/2015/07/07/service-vs-factory-once-and-for-all.html)]

The TypeScript declaration file of Angular^[[Definitely Typed - AngularJS](https://github.com/borisyankov/DefinitelyTyped/blob/master/angularjs/angular.d.ts)] knowns three types of providers even though they are not all directly implemented in Angular:

```typescript
    interface IServiceProvider {
        $get: any;
    }

    interface IServiceProviderClass {
        new (...args: any[]): IServiceProvider;
    }

    interface IServiceProviderFactory {
        (...args: any[]): IServiceProvider;
    }
```

`IServiceProvider` is the base interface and what you will use when creating a provider with the `class` syntax. The other two declarations are required for the `.provider` API, e.g. `IServiceProviderClass` enables you to register a class with `module.provider('SayHello', new SayHelloProvider())`.

Thus, writing a provider as a class is pretty straight forward. But be careful. Currently the declaration file allows `any` as return type of `$get`, which makes `void` a valid return value. So be careful and make sure `$get` returns a constructor or a factory.

Decorating modules via `.decorator` should be done with a function, since the decorator has to return the `$delegate` (original service) or or a new service object which replaces or wraps and delegates to the original service.^[[Angular Documentation - `$provide`](https://docs.angularjs.org/api/auto/service/$provide#decorator)]

The `.value` and `.constant` should used with their corresponding JavaScript keyword `let`/`var` and `const`.

### Using Classes elsewhere

There are even more oppurtunities to use classes in your Angular application. If you are using `ngAnimate` and register animations you can use the previously introduced [pattern (1)](#1-as-class-with-the-factory-in-the-directive-callback) in order to create declarative animation objects. Another common use case are HTTP interceptors. Their purpose is to perform some additional tasks on certain XHR events (`request`, `requestError`, `response`, `responseError`).

The Marvel developer API will only successfully resolve your request if you API key was send as a get parameter. The request interceptor, which always adds the key to the request parameters, could look like this:

```typescript
// Path: service/marvel/marvel-key.interceptor.ts
import MARVEL_API_KEY from 'marvel.key';
import MARVEL_CONFIG from './marvel.config';

export default class MarvelKeyInterceptor {
    request ( config:ng.IRequestConfig ) {
        // Request pings Marvel API?
        if( config.url.startsWith(MARVEL_CONFIG.base) ) {
            if( !config.params ) {
                config.params = {};
            }
            config.params.apikey = MARVEL_API_KEY;
        }
        return config;
    }
}
```

Registration of the `MarvelKeyInterceptor` with Angular's `$http` service can be done like shown below.

```typescript
// Path: service/marvel/marvel.module.ts
import * as angular from 'angular';
import MarvelKeyInterceptor from './marvel-key.interceptor';

export default angular
    .module('marvel', [])
    .config(['$httpProvider', ( provider:ng.IHttpProvider ) =>  {
        provider.interceptors.push(() => new MarvelKeyInterceptor());
    }]);
```