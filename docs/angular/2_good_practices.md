---
title: Good Practices
---

## Banning `ng-controller`

When you start building apps with Angular using the `ng-controller`^[[Angular Docs: `ng-controller`](https://docs.angularjs.org/api/ng/directive/ngController)] directive seems pretty straight forward. Just like in every other MVC-style application, controllers are the mediators between the model and view.

By adding `ng-controller` to a DOM element, Angular will create a new child scope with the element as its root. Child scopes prototypally inherit methods and properties from their parent. Hence, there is no Shadow DOM^[[MDN - Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Shadow_DOM)] or other isolation. Deep scope hierachies will lead to semi-global data, which make it hard to maintain and reason about your code. Knowing from where data originates will be difficult.

Instead of polluting your templates with `ng-controller` directives, rather make use of the *component pattern*. This pattern focuses on directives to achive seperation of concerns and high reusablity of code. The next chapter will give a thorough explaination of the *component pattern*.

## No `$scope` Soup

With the introduction of the `controllerAs` syntax in Angular 1.2 we finally can get rid of injecting `$scope` in each and every controller. In fact, today it is a best practice to use the `controllerAS` syntax throughout your app.^[[Pascal Precht - Exploring Angular 1.3: Binding to Directive Controllers](http://blog.thoughtram.io/angularjs/2015/01/02/exploring-angular-1.3-bindToController.html)]

### Controllers

As a result controllers can be written as a `class`. Or, if you are still writing ES5, can be written with the constructor pattern.^[[Addy Osmani - Learning JavaScript Design Patterns](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#constructorpatternjavascript)] In either case, writing controllers as "classes" allows us to only inject the `$scope` service if it is really necessary. This lets us write regular JavaScript (e.g. use `this`) and controllers are much more lightweight. The following code examples show how controllers should be initialised:

```javascript
// ES5
function SomeController () {
    this.title = 'Some Controller Tittle';
}

angular
    .module('app', [])
    .controller('SomeController', SomeController);
```

```javascript
// ES2015
class AnotherController () {
    constructor() {
        this.title = 'Some Controller Tittle';
    }
}

angular
    .module('app', [])
    .controller('AnotherController', AnotherController);
```

### Directives

Before Angular 1.3 the `controllerAs` syntax only worked well with controllers that are used with a `ng-controller` directive. Using the syntax in your own directive was a real pain because the bindings didn't work like you would have expected. To illustrate the problem consider the following directive:

```javascript
function HelloDirectiveConstructor () {
    // Directive definition object
    return {
        restrict: 'E',
        template: 'Hello {{ vm.to }}!',
        scope: {
            to: '='
        },
        controllerAs: 'vm',
        controller: HelloDirectiveController
    };
}

function HelloDirectiveController ( $scope ) {
    this.to = $scope.to;
}

angular
    .module('app', [])
    .directive('sayHello', HelloDirectiveConstructor);

```

As you might already see, even though we used `controllerAs` syntax and wrote the directive as a class-like object, using `$scope` was still necessary. In addition, we messed up the two-way binding. If we want to update `this.to` whenever the `to` attribute binding changes a `$watch` is required.

Fortunately the directive definition object was extended in Angular 1.3 with a new property called `bindToController`. When set to `true` in a directive that has an isolated scope and uses `controllerAs`, all properties are bound to the controller rather than the `$scope`.^[[Todd Motto - No $scope soup, bindToController in AngularJS](http://toddmotto.com/no-scope-soup-bind-to-controller-angularjs/)]

In Angular 1.4 the API was improved further. Instead of specifying bound properties in the `scope` definition, you can now put all binding directly into `bindToController`. Furthermore, starting with Angular 1.4 using `bindToController` is also allowed on directives that introduce a new scope.^[[Angular Commit: `bindToController`](https://github.com/angular/angular.js/commit/35498d7045ba9138016464a344e2c145ce5264c1)]

The `HelloDirectiveConstructor` should be refactored like this:

```javascript
function HelloDirectiveConstructor () {
    return {
        restrict: 'E',
        template: 'Hello {{ vm.to }}!',
        scope: {},
        controllerAs: 'vm',
        controller: HelloDirectiveController,
        bindToController: {
            to: '='
        }
    };
}
```

## The "ViewModel" Convention

Because of John Papa's infamous styleguide^[[John Papa - Angular Style Guide](https://github.com/johnpapa/angular-styleguide)] (and rightfully so) the Angular community started to use a consitent naming convention for aliasing controllers: `vm` also known as the "ViewModel". The reason to use a dedicated variable instead of the `this` keyword is alawys the same (in JavaScript). This is contextual^[[MDN - `this`](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Operators/this)] and functions inside your controllers will create a new context, hence `this` inside a function will not be the same as the `this` of your controller. The only expection for this is of courese if you `.bind` your function.^[[MDN - `Function.prototype.bind()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)]

Using `vm` will also make it very clear what members are exported and can be accessed from outside the controller. You should always list exported variables and methods at the top of a controller and place the logic below:

```javascript
function SomeController () {
    let vm = this;

    // Exports
    vm.title = 'Some Controller';
    vm.list = [];

    vm.someFunction = someFunction;

    // Here come the controller logic
    function someFunction () { ... }
}
```

So make yourself a favor and always use `vm` to reference your controller's context. Because it commonly used by Angular developers it will be easier for other people to reason about your code.

## Use controllers for directive logic

Looking at `$compile`^[[Angular Documentation - `$compile`](https://docs.angularjs.org/api/ng/service/$compile)] you have a lot of options to define the logic for your directive. Namely the `compile`, `link` or `controller` methods. If you want to generate a dynamic template even using the `template` property together with a function may have its merits.

But most of the time creating a controller will suffice and since Angular 1.3 binding properties to a directive's controller is very convenient (see [above](#directives)). Only in a few cases you have to use other options. An example for this is the `ngModelController`, which registers itself in the `preLink` phase with a parent `ngFormController`.^[[Preparing for Angular 2](http://juristr.com/blog/2015/07/learning-ng-prepare-ng2/)]

An important benefit of putting all logic in a controller is testability. It is very easy to isolate and thus thoroughly test a controller because you have full control over the injected arguments. In order to test `compile` or `link` methods you either have to setup the whole directive or need a hold of the full directive definition object. The later can be done by injecting the directive as a dependency in your test suite.

Testing the `compile` or `link` of the `<say-hello>` with Jasmine^[[Jasmine - Behaviour-Driven JavaScript](http://jasmine.github.io/)] controller can be done like this:

```typescript
define('<say-hello>', () => {
    var ddo;

    beforeEach(module('app'));
    beforeEach(inject( ( 'sayHelloDirective' ) => {
        ddo = sayHelloDirective[0]; // Array of "sayHello` directives
    });

    it('should have a linkt function', () => {
        expect(ddo.link).toEqual(jasmine.any(Function));
    });
});
```

## Slim and focused Controllers

In order to keep your code DRY^[[Wikipedia - Don't repeat yourself](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)] you should defer application logic into services. This way you have reusable pieces and your controllers are slim, focused and maintanable.^[[John Papa - Angular Styleguide: Defer Controller Logic to Services](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#style-y035)]

A common case for this is fetching data from the server. Instead of using the `$http` services inside a controller the implementation details should be hidden away in a seperate service. This is especially true if the JSON response needs some additional transformations before you can use it as model.

Recall the `MarvelApiService` from the TypeScript section. When you request data from the Marvel API you will get a lot of additional information besides the "real" data you requested. Using the whole JSON request as model may not be what you want and if you do not have a dedicated service, which does the transformations for you, parsing the JSON has to be done in every single controller you request data from the API.

The following code snippets shows how a controller should *not* be build and what a *good alternative* could look like:

```typescript
// Bad
class MarvelController ( $http, MARVEL_API_URL ) {
    var vm = this;

    // Exports
    vm.character_list = [];
    vm.fetchCharacterList = fetchCharacterList;

    function fetchCharacterList () {
        let url = MARVEL_API_URL.base + MARVEL_API_URL.characters
            .replace(/:id$/, '');

        return $http.get(url)
            .then( (reponse) => {
                // Not kidding, that's the property
                // with the list of characters.
                vm.character_list = reponse.data.data.results;
            })
            .catch( (err) => {
                // Handle error
            });
    }
}
```

```typescript
// Good
class MarvelController ( MarvelApiService ) {
    var vm = this;

    // Exports
    vm.character_list = [];
    vm.fetchCharacterList = fetchCharacterList;

    function fetchCharacterList () {
        return MarvelApiService.getCharacters()
            .then( (list) => {
                vm.character_list = list;
            });
       // Error is handled by the service
    }
}
```

As you can see, the controller not only has to deal with the server response, but also using the correct URL and handling any error that may occurs during the API call. Whereas in the second example only the `MarvelApiService` has to be injected. The controller does not care about the exact URL of the endpoint. Also, any errors that occur will be handled by the service.

In addition, if you move complex logic into a service it is much easier to adjust your code to any (third-party) API changes. The alternative would be to change every controller that uses the API. A very error-prone task if you have a large application with many calls to that API.
