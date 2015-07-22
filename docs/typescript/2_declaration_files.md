---
title: Declaration Files
---

It would be a shame if we could not use the myriad of existing JavaScript libraries, frameworks and npm modules in conjunction with our TypeScript code. In order to seamlessly integrate external libraries with your TypeScript project you have to make use of *declaration files*.

Declaration files are marked with a `.d.ts` extension and describe the interface of an JavaScript libarby. This allows the compiler to provide you with the same features, like intellisense or compile time error messages, as if the third-party code was written in TypeScript.

Actually, every installation of TypeScript ships with a file called `lib.d.ts`. The files contains the EcmaScript APIs, like `window`, `Object` or `Math`. This is an prime example how declaration files can fill in the gaps for JavaScript code TypeScript does not know about.

## Definitely Typed

Definition files are nice and all, but on the other hand there are required whenever you want to work with a third-party library. Fortunately, soon after TypeScript was released Boris Yankov started the *DefinitelyTyped* project to host declaration files for popular JavaScript libraries. There are already more than 2,000 definitions for external libaries, so if in doubt head over to [definitelytyped.org](http://definitelytyped.org/)!

For concenience there is also a `tsd` package, which can be installed via `npm`. The package makes it possible to install declaration files from the *DefinitelyTyped* respository directly from the console.^[[`tsd` package on Github](https://github.com/Definitelytyped/tsd)] After the installation you can use `query` to search and `install` to install a declaration file to your project. Declaration files will be installed in a `typings` directory by default. You can point your IDE of choice to this directory and TypeScript's compiler will do its magic.

## Writing `.d.ts` Files

Even though there are tons of declaration files if you want to use a rather unkown library or if you are the author of library there is a chance that no `.d.ts.` file exists for that library. In this case you have to write you own declaration file. For more informations on how to write declaration files visit the [TypeScript Handbook](http://www.typescriptlang.org/Handbook#writing-dts-files).

Another reason to write your own `.d.ts` files is when you want to work with global variables. For instance the main HTML file of your SPA^[Single Page Application] may contain information about API endpoints, which are inserted by the server:

```html
<body>
    ...
    <script type="text/javascript">
        var MARVEL_API = {
            root: "https://gateway.marvel.com/",
            characters: "/v1/public/characters/:id",
            comics: "/v1/public/comics/:id"
        };
    </script>
</body>
```

The TypeScript compiler does not know about the `MARVEL_API` variable, because this piece of code is outside the TypeScript's scope. Thus, trying to access the variable with the following example will result in an error.^[Assuming the declaration file for [`fetch`](https://github.com/borisyankov/DefinitelyTyped/blob/master/whatwg-fetch/whatwg-fetch.d.ts) is provided.]

```typescript
class MarvelApi {
    static fetchComics () {
        return fetch( MARVEL_API, {
            method: 'get'
        });
    }
}
```

To solve the problem we need to create a custom declaration file and save it somewhere the TypeScript compiler can find it. The content of our custom declaration file should be this:

```typescript
declare var MARVEL_API: {
	root: string,
	characters: string,
	comics: string
}
```

Note that the TypeScript compiler will scan your source directories for `.d.ts` files and automatically include them.