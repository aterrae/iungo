# Iungo
## Generate static HTML pages using Handlebars server-side.

[![npm version](https://badge.fury.io/js/iungo.svg)](https://badge.fury.io/js/iungo)
[![Dependency Status](https://david-dm.org/aterrae/iungo.svg)](https://david-dm.org/aterrae/iungo)

Iungo is an easy and multi-platform package that lets you use Handlebars to generate static HTML pages.<br/>
To compile and generate all your pages, Iungo uses:
- **Data**<br/>
*JSON* files which store information you want to use inside your HTML pages.<br/>
e.g.: You can use a data file to store all your strings and create multiple versions of it to localize your website.
- **Helpers**<br/>
*JS* files which export a Javascript function that you can use inside your partials and pages to help you do whatever you want using JS code snippets.<br/>
e.g.: You can create a `time.js` file to export a function that returns the current time using JS. You can include this file inside your partials or pages.
- **Partials**<br/>
*HTML* or *HBS* files which contain HTML code that you want to reuse or just code-split to make your pages more maintainable. You can include these files inside your pages.<br/>
e.g.: You can create a `navbar.hbs` file to contain your navbar's code and include it inside various pages.

## Install
```bash
pnpm add iungo --save-dev
```
or
```bash
npm install iungo --save-dev
```

## Usage

```js
import { dataLoader, helpersLoader, partialsLoader } from 'iungo';
import Handlebars from 'handlebars';

// Load data from JSON files or objects
const data = {};
dataLoader(['src/data', { title: 'My Site' }], data);

// Load helpers from directory or inline functions
helpersLoader({
  projectHelpers: 'src/helpers',
  customHelper: () => 'Hello World'
});

// Load partials from directory
partialsLoader(['src/partials']);

// Compile and render your template
const template = Handlebars.compile(htmlContent);
const output = template(data);
```

## Core Utilities

### dataLoader(sources, dataObject, [fileDependencies])
Loads data from JSON files and merges inline objects.
- `sources`: Array of directory paths and/or inline objects
- `dataObject`: Target object to populate with loaded data
- `fileDependencies`: Optional array to track file dependencies

### helpersLoader(helpers, [onBeforeRegister])
Registers Handlebars helpers from files or inline functions.
- `helpers`: Object mapping helper names to file paths or functions
- `onBeforeRegister`: Optional callback before registration

### partialsLoader(paths, [onBeforeRegister])
Registers Handlebars partials from .html, .hbs, or .handlebars files.
- `paths`: Array of directory paths containing partials
- `onBeforeRegister`: Optional callback before registration

---

Enjoy Iungo! ∞
```js
const NEVERFORGET = beAwesome("iungo");
```
Made in Sarmeola di Rubano (PD), Italy<br/>
Copyright © 2019 Aterrae | Digital Growth
