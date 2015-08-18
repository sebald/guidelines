---
title: Component Pattern
---

Writing modular and DRY^[[Wikipedia - Don't repeat yourself](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)] code is a good habit. It will keep your software maintanable, help with testing and produce parts that can be reused throughout your software. A popular paradigm to achieve all this is the *component pattern*. The underlying idea of this pattern is to encapsulate your code into isolated components and thereby having small building blocks which can be composed to build a full application.

Seperating code into components is nothing new. There is a whole branch of software engineering, called "component-based software engineering"^[[Wikipedia - Component-based software engineering](https://en.wikipedia.org/wiki/Component-based_software_engineering)], which emphasises the use of components to preserve seperation of concerns. The UML specification for components reads as follows:^[[OMG Unified Modeling Language (OMG UML), Superstructure, V2.1.2](http://www.omg.org/spec/UML/2.1.2/Superstructure/PDF)]

> A component represents a modular part of a system that encapsulates its contents and whose manifestation is replaceable within its environment.
>
> A component defines its behavior in terms of provided and required interfaces. As such, a component serves as a type whose conformance is defined by these provided and required interfaces.

With the rise of React^[[React - Thinking in React](http://facebook.github.io/react/docs/thinking-in-react.html)] and the introduction of Web Components^[[W3C - Introduction to Web Components](http://www.w3.org/TR/components-intro/)] the component pattern has gained a lot of momentum and is currently seen as a best practice for building large JavaScript applications. Angular 2 will also rely heavily on components,^[[Ionic - Angular 2 Series: Components](http://blog.ionic.io/angular-2-series-components/)] so the emphasis on components will not only help structuring our app, but will also make it easier to migrate to Angular 2 once it is ready.

If you translate the concept of components to Angular 1.x, they are really just directives with an isolated scope, a controller and most of the time they also have a template. Communication between components is handled with attribute bindings (`=`, `&` and `@`) and the `require` property of  the directive definition object.

A future Angular release will include a `angular.component` helper, which will by default create directives that `bindToController` so that we do not have to write the directive definition boilerplate every time.^[[Github PR - `angular.component`](https://github.com/angular/angular.js/pull/12166)]

## Container Components

Jason Bonta gave an excellent talk in which he showed how to further improve the application architecture by distinguishing between *components* and *containers*.^[[React.js Conf 2015 - Making your app fast with high-performance components](https://www.youtube.com/watch?v=KYzlpRvWZ6c&feature=youtu.be&t=22m23s)] Essentially, containers are responsible for fetching data from the server or any other remote service. The response data is then passed to (child-)components, which will process the data and render markup. Components are completly data-agnostic. All of their input will be obtained through a parent container.

While the talk is about React the concept can also be applied to Angular. Imagine an app, named *whiz*, that lets users assemble their own squad of Marvel characters. It has a search field to query Marvel's developer API for characters and every character whose name matches the search term will be displayed inside a result list. Listed characters can be selected by the user and added to her squad. Furthermore, users can give their squad a name and remove previously selected characters. Squads are stored into `localStorage` and automatically loaded when the user re-opens the app.

The below image shows a mockup of the app to better envision what the *whiz* app may look like:

![Whiz Mock](/assets/whiz-mock.png)

Sticking to the aforementioned pattern the app would consist of two containers, which is indicated by the green rectangles. The left container hosts the search and display of Marvel characters, as well as a control to add characters to the squad. The right container consists of a text field to enter a name for the squad and a list with all the squad members. Members can be removed via a dedicated control.

The markup follows the same structure. It consists of the `<whiz-app>`, which hosts two containers `<marvel-character-list>` and `<whiz-character-search-container>`:

```html
<!-- base template -->
<whiz-app>

    <whiz-character-search-container>
    </whiz-character-search-container>

    <whiz-squad-conatiner>
    </whiz-squad-container>

</whizz-app>
```

While the `<whiz-app>` element bootstraps the app,  most of the markup and logic is hosted by containers and their child-components. As you can see in the markup below, both container use the same component to display the character list (`<marvel-character-list>`), but with different configurations. The `<whiz-character-search-container>` uses the `[on-select]` callback to add characters to the squad. The `<whiz-squad-conatiner>` uses the `[on-remove]` binding to remove chracters from the squad.

The `<field-*>` components are only concerned with user input and have callback methods to forward certain events. In this case the `change` event. Their only purpose is to display `<input>` elements for the user. The model updates are handled by the parent containers via the callbacks.

```html
<!-- template: whiz-character-search-container -->
<field-search
    placeholder="Search by character name..."
    on-change="vm.handleQuery(text)"
>
</field-search>

<marvel-character-list
    list="vm.list"
    on-select="vm.handleSelect(character)"
>
</marvel-character-list>
```

```html
<!-- template: whiz-squad-container -->
<field-text
    label="Name"
    on-change="vm.handleChange(text)"
>
</field-text>

<marvel-character-list
    list="vm.members"
    on-remove="vm.handleDelete(character)"
>
</marvel-character-list>
```

Because of the way the app is laid out a clear seperation of concerns is acchieved. Every element has one role to fulfill and nothing more. Data-related actions are handled exclusively by a container. The components are communicating with each other via APIs. All thanks to sticking to the *component pattern*.

## Component Types

Differentiating between *containers* and *components* is an important step to improve the structre of an application. But the naming convention maybe a bit confusing, because containers are also components. So you actually have *container components* and *components components*.

Calling a component "component" is not really conclusive. Hence, we are calling this type of component *widgets*. Because this is what they really are. Small, dedicated and reusable elements which are independent of your apps domain. Recall the `<field-text>` element from the previous example. It is not a term affiliated with "Marvel", but containers like `<marvel-character-list>` certainly contain domain specific language.

Furthermore, page templates tend to get very large, which will make it hard to maintain and test them. Also, the attached controller becomes often very large and equality hard to maintain. To cope with that it is a good idea to split large pages into mutiple components.

The sole purpose of these components is to add another level of abstraction that groups and hides complex parts of a page. You should use domain specific language to make it obvious what the content of the section is. For example, naming a section `user-adress-section` makes it very obvious what part of your app is repesented through this section. Unlike *widgets* sections are usually not re-usable.

This leaves us with another type of component: the *section component*. Hence, we can classify components into one of the following three categories:

### 1. Container

- Responsible for fetching data
- Maintains and updates model
- Exposes methods to handle user interactions

### 2. Section

- Break large templates into smaller parts
- Several sections construct a page
- Domain specific used to describe purpose
- Not reusable

### 3. Widget

- Smallest component type
- Highly reusable
- Data-agnostic
- Renders markup

## Handling User Interactions

As long as your model and application logic stays small two-way data binding is your best friend. But as soon as your model and logic become more complex it will be hard to understand and control the data flow. Especially if there are `$watchers` that update the application state or manipulate the model you may end up in a lengthy search for Waldo.

Instead of relying on Angular's integrated two-way bindings you should implement an unidirectional data flow.^[[Victor Savkin - Two Phases of Angular 2 Applications](http://victorsavkin.com/post/114168430846/two-phases-of-angular-2-applications)] A unidirectional flow integrates nicely with the container pattern, because only a container should be able to mutate the data model or application state. It will also be possible to backtrace what part of the applications want to push an update to a model or change the state.

The previously shown containers of the *whiz* app implement this approach. All widgets expose callback methods for the container to use and handle changes. Below is the part of the `<marvel-character-list>` controller, which shows how the `handleSelect` method is implemented:

```typescript
export default class WhizSquadContainerController {
    public squad:SquadService;

    constructor ( squad:SquadService ) {
        this.squad = squad;
    }

    handleSelect ( character:MarvelCharacter ) {
        this.squad.addCharacter(chracter);
    }
}
```

```html
<!-- template: marvel-character-list -->
<ul>
    <li ng-repeat="character in vm.list">

        <marvel-character-avatar
            img="character.avatar"
        ></marvel-character-avatar>

        <strong>{{ character.name }}</strong>

        <p>{{ character.description }}</p>

        <button
            type="button"
            ng-click="vm.select(character)"
        >Add</button>

    </li>
</ul>
```

```typescript
import controller from './marve-character-list.controller';

export default class MarvelCharacterList implements ng.IDirective {
    restrict = 'E';
    scope = {};
    templateUrl = 'components/marvel/marvel-character-list.html';
    controller = controller;
    controllerAs = 'vm';
    bindToController = {
        list: '=',
        onSelect: '&'
    };
}
```

```typescript
export default MarvelCharacterListController {
    public list:MarvelCharacter[];

    select ( character:MarvelCharacter ) {
        this.onSelect( character );
    }
}
```

































---

--> **TODO:** Reactive Extensions!!!

