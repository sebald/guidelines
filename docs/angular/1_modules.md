---
title: Modules
---

Back in 2009 when Angular was created there was no convention for importing files in JavaScript. Therefore Angular 1.x uses its own syntax to register modules (`angular.module`), which does not conform the ES2015 module syntax (`import`, `export`).^[[Dr. Axel Rauschmayer - ECMAScript 6 modules: the final syntax](http://www.2ality.com/2014/09/es6-modules-final.html)]

Fortunately both module loaders are compatible and we can use ES2015 modules to further improve our code base. In addition, using the ES2015 modules syntax will make it easier for us to migrate to Angular 2, once its ready.

It is best to put the application logic and the Angular module definition into seperate files. This way it will be easier to reason about the structure of your application and makes testing individual modules even better. At a later point you even might remove the files that load your code into Angular modules and only use the ES2015 modules.

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

Loading other Angular modules as dependencies is also much simpler, because you do not have to remember their names. If you need the `marvel` module as a dependency you can do the following to require it:

```typescript
import angular from 'angular';
import MarvelModule from './services/marvel/marvel.module';

export default angular
    .module('myAwesomeApp', [
        MarvelModule.name
    ]);
```