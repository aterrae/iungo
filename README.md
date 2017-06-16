# Iungo - Generate your pages like a champ with Iungo

Iungo is a simple and intuitive package that simplifies the process of making static web pages.
It compiles all your pages generating a rich HTML file using:
- **Data** <br/>
JSON files that include all the data that you need inside your static website.
- **Partials** <br/>
Small portions of HTML that you can include inside your pages. Useful to avoid redundancy.
- **Helpers** <br/>
Javascript functions that, as the name says, help you in your project by providing useful code snippets that are usable straight from your partials and pages.

Iungo is a project mainly focused on helping you creating your web pages with reusable and easily maintainable components, avoiding redundancy and headaches.

## Getting started
```
yarn add iungo --dev
or
npm install iungo --save-dev
```

## How to use
Iungo takes as input a stream of HTML pages, injects them with Data, Partials and Helpers and after the compilation it returns your enriched pages.

```
import gulp from 'gulp';
import iungo from 'iungo';

gulp.task('default', function() {
    gulp.src('src/pages/**/*.html')
        .pipe(iungo({
            data: 'src/data',
            partials: 'src/partials',
            helpers: 'src/helpers'
        }))
        .pipe(gulp.dest('dist'));
});
```
To make sure that your compiled files are up to date with your changes, insert your task inside a `gulp.watch` function.
```
gulp.watch('./src/{ pages, data, partials, helpers }', ['default']);
```

## Options
Iungo supports the following options:

Name|Type|Description
---|---|---
`data`|`String` or `Array.<String>`|**The path to your data files.**<br/>Data files contain the external data that you are using in your page, making consequent changes to such info much easier.<br/>Data files are stored inside `.json` files.<br/>Once you have them included they are accessible from every page of your project by using a variable with the same name as the data file name that you want to reference and by going down through it's structure using dot-notation.
`partials`|`String` or `Array.<String>`|**The path to your partials files.**<br/>Partials are slices of HTML that will be used when included. They either have a `.html`, `.hbs` or `.handlebars` extension. The partials will be registered as Handlebars partials and will be usable in any page by including them using their name.<br/>**e.g.** a `header.hbs` partial can be included using {{header}}
`helpers`|`String` or `Array.<String>`|**The path to your helpers files.**<br/>Helpers are `.js` files that contain a Handlebars partial. These files have to export a function that will be registered as a Handlebars helper which'll have the same name as the file that contained the helper.

---
Have fun with Iungo!

Made with plenty of ❤️ by two guys from the **Aterrae** team in Rubano (Padova), Italy

Copyright © 2017 Aterrae | Digital Growth.
