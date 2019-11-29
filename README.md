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
yarn add iungo --dev
```
or
```bash
npm install iungo --save-dev
```

## Using Iungo with Gulp
```js
import gulp from 'gulp';
import { IungoGulpPlugin } from 'iungo';

gulp.task('default', () => {
  // Iungo takes as input a stream of HTML pages.
  gulp.src('src/pages/**/*.html')
    .pipe(IungoGulpPlugin({
      // Data passed to your pages.
      data: [
        'src/data',
        {
          title: 'Iungo',
          subtitle: 'Generate your files',
        },
      ],
      // Custom helpers registered.
      helpers: {
        projectHelpers: 'src/helpers',
        helloWorld: () => { return 'Hello World'; },
      },
      // Custom partials registered.
      partials: [
        'src/partials',
      ],
    }))
    // Iungo returns your compiled pages.
    .pipe(gulp.dest('dist'));
});
```
To compile all your pages every time your code changes, you've to insert your task inside a `gulp.watch` function.
```js
gulp.watch('./src/{ pages, data, partials, helpers }', ['default']);
```

## Using Iungo with Webpack
```js
import { IungoWebpackPlugin } from 'iungo';

const webpackConfig = {
  plugins: [
    new IungoWebpackPlugin({
      // Here you have to specify the folder where Iungo
      // has to search for HTML pages.
      entry: 'src/pages',
      // If you don't want to use the Webpack output folder,
      // you can specify here your custom output folder.
      // Specifying the path, you can change it or just its extension.
      // The path must be a subpath of your Webpack output folder.
      output: 'dist/public/[name].html',
      // Data passed to your pages.
      data: [
        'src/data',
        {
          title: 'Iungo',
          subtitle: 'Generate your files',
        },
      ],
      // Custom helpers registered.
      helpers: {
        projectHelpers: 'src/helpers',
        helloWorld: () => { return 'Hello World'; },
      },
      // Custom partials registered.
      partials: [
        'src/partials',
      ],
      // Here you can optionally specify some functions that you want
      // to execute in a specific moment of the Iungo process.
      onBeforeInit: function (Handlebars) {},
      onBeforeRegisterHelpers: function (Handlebars, loadedHelpers) {},
      onBeforeRegisterPartials: function (Handlebars, loadedPartials) {},
      onBeforeCompile: function (Handlebars, templateContent) {},
      onBeforeRender: function (Handlebars, data) {},
      onBeforeSave: function (Handlebars, templateRendered) {},
      onDone: function (Handlebars, outputFilePath) {},
    }),
  ]
};
```

## Using Iungo with Webpack and HtmlWebpackPlugin
```js
import { IungoWebpackPlugin } from 'iungo';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const webpackConfig = {
  // Iungo takes as input the HTML page passed from HtmlWebpackPlugin.
  // Iungo waits for HtmlWebpackPlugin to finish the template execution
  // before taking it.
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: 'src/pages/index.html',
    }),
    new IungoWebpackPlugin({
      // Data passed to your pages.
      data: [
        'src/data',
        {
          title: 'Iungo',
          subtitle: 'That\'s Awesome',
        },
      ],
      // Custom helpers registered.
      helpers: {
        projectHelpers: 'src/helpers',
        helloWorld: () => { return 'Hello World'; },
      },
      // Custom partials registered.
      partials: [
        'src/partials',
      ],
    }),
  ]
};
```

## Common Options
Here are some options that are in common between the Gulp and Webpack plugin:

Name|Type|Description
---|---|---
**data**|`Array<{string\|Object}>`|With the **data option**, you can define your data by specifying the paths of your external `.json` files or just by declaring it inline as an object literal.<br/>You can access your data inside your pages or partials using the Handlebars syntax. If you have included your data using the path, inside the curly-braces you have to specify the file name of your data file as a parent representing the JSON root and then continue following the Handlebars syntax. Otherwise, using the inline declaration, you can just follow the standard Handlebars syntax.
**helpers**|`Object<string, {string\|Function}>`|With the **helpers option**, you can define your helpers by specifying the paths of your external `.js` files or just by declaring it as an inline named function. External .js file must export a single function.<br/>You can use your helpers inside your pages or partials following the Handlebars syntax.<br/>Helpers included by the path are registered using the name of the file; otherwise, for the ones included by the inline declaration is used the name of the function.
**partials**|`Array<string>`|With the **partials option**, you can define your partials by specifying the paths of your external `.html`, `.hbs`, `.handlebars` files.<br/>You can use your partials inside your pages following the Handlebars syntax.<br/>All these partials are registered using the name of the file.

---

Enjoy Iungo! ∞
```js
const NEVERFORGET = beAwesome("iungo");
```
Made in Sarmeola di Rubano (PD), Italy<br/>
Copyright © 2019 Aterrae | Digital Growth

