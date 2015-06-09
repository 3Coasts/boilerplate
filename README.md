![License](http://img.shields.io/:license-gpl3-blue.svg)

# Resources

Build a single page web application, native web app or whatever. Using [NodeJS](https://nodejs.org/), [ExpressJS](http://expressjs.com/), [AmpersandJS](http://ampersandjs.com/), [Waterline](https://github.com/balderdashy/waterline), [Webpack](http://webpack.github.io/). Declare your application resources in JSON format. 

```
git clone --depth=1 https://github.com/brianberlin/boilerplate.git myproject
cd myproject
git remote rm origin
npm i
npm start
```

# resources.json - [Example](https://github.com/brianberlin/boilerplate/blob/master/resources.json)

- `name`: endpoint name
- `model`: 
    - `slug`: used as lookup id for endpoint
    - `props`
        - `type`: can be string date, string, buffer, boolean, number, mixed, array, or ref. If ref is used the ref attribute must be defined with another resource name.
        - `ref`
        - other mongoose schema properties can be used
    - `populate`: to automatically populate references in default CRUD routes
- `routes`: defines routes. default route code can be overridden by including a file in the routes folder that corresponds to the name of the resource and by exporting a function with the name of the method and parth all together in camelcase. <br>Eg. `{ method: 'get', path: 'user/:id/reset' } => exports.getUserIdReset`
    - `method`: get, post, put, delete (the put post is duplicated with the patch method)
    - `path`
    - `protect`: users most be authenticated
    - `description`
- `view`: this information is used to build client view templates 
    - `titleField`: field to be used as the title of the resource
    - `teaserFields`: fields to be displayed as the teaser
    - `detailFields`: fields to be used on detail view
