![License](http://img.shields.io/:license-gpl3-blue.svg)

# Resources

Use Resources to quickly build your single page web application, native web app or whatever you like to call it.
Resources is built with [NodeJS](https://nodejs.org/), [ExpressJS](http://expressjs.com/), 
[AmpersandJS](http://ampersandjs.com/), [Waterline](https://github.com/balderdashy/waterline), 
[Webpack](http://webpack.github.io/).  

```
git clone --depth=1 https://github.com/brianberlin/boilerplate.git myproject
cd myproject
git remote rm origin
npm i
npm start
```

# Resources.json

`Resources.json` is where you can declare your application resources in JSON format. Below is what is currently 
configurable in `Resources.json`.

- `name`: _\<string\>_ resource name
- `model`: _\<object\>_
    - `slug`: _\<string\>_used as lookup id for the resource
    - `props`: _\<object\>_
        - `type`: _\<string\>_ can be string, text, integer, float, date, time, datetime, boolean, binary, array, or json
        - `model`: _\<string\>_ to reference another resource
        - `inputElement`: _\<string\>_ html element type to used in view: currently can only be `input` or `textarea`
        - `inputElementAttributes`: _\<string\>_ html [input attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) to attach to the inputElement
        - other attributes can be found in [waterline documentation](https://github.com/balderdashy/waterline-docs/blob/master/models.md#attribute-properties)
    - `populate`: _\<string\>_ to automatically populate references in the default route handler
- `routes`: _\<object\>_ Where you define the resource routes. The default route code can be overridden by creating a file with the 
            same name as the resource and by exporting a function with the name of the method and path all together in camelcase. 
            Eg. `{ method: 'get', path: 'user/:slug/reset' } => exports.getUserSlugReset`
    - `method`: _\<string\>_ get, post, put, delete (the put post is duplicated with a patch method)
    - `path`: _\<string\>_ the slug parameter is used in the default route handlers.
    - `protect`: _\<boolean\>_ protect route against non-authenticated users.
    - `description`: _\<string\>_ for convenience and is displayed in development in the console.
- `view`: _\<object\>_ This property is used to build the client views. The client view files are created when the application is started.
          If you don't want client views generated you can leave this property undefined. When views are generated, 
          a checksum is created which allows the server to detect manual changes to the files in the view folder so
          they don't get overwritten.
    - `titleField`: _\<string\>_ Used to specify the field to be used as the title of the resource
    - `teaserFields`: _\<string\>_ Used to specify the fields to be displayed as the teaser
    - `detailFields`: _\<string\>_ Used to specify the fields to be used on detail view

# Favicons Generator

[Favicons](https://github.com/haydenbleasel/favicons), which is a NodeJs favicons generator, is configured with an 
executable script in lib. Execute it with the path of your PNG and it will create favicon assets of all different 
sizes as well as the markup for the various platforms.
