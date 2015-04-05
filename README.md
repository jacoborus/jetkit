JetKit
======

**Work in progress**

Dynamic website generator

Built on top of:

- Express - server middleware
- Mongoose + node-validator - DB, ORM and validation
- Hardwire - app container
- Wiretree - dependency injection container
- Passport - Multiservice auth
- Jade - Template engine
- deep.json - config loader
- curlymail - SMTP mailer and mail template engine with mustaches support
- miniruler - Roles, levels and permissions
- node-cron - cronjobs
- ¿?¿? - Handle errors and logs



Requirements
------------

Node.js and MongoDB



Quick start
-----------


### Install

Initialize a npm proyect and install **JetKit** as dependency (it requires a package.json):

```sh
mkdir myapp && cd myapp
npm init
npm install --save jetkit
```

### Boilerplate

**JetKit** postinstall script add 2 scripts to your `package.json`: `jk-boilerplate` and `jk-initdb`, run the first one in order to generate your app structure folder (/app) and a launcher (app.js)

```
npm run jk-boilerplate
```


### Database

You must configure your database connection before run your app. Open `/app/config/default.json` and add your credentials into `mondgodb` section.

Then create a user in DB:

```
npm run jk-initdb
```

- email: admin@admin.com
- password: admin


### Start app

Run your app:

```
npm start
```

- Index URL: http://localhost:3000
- Admin URL: http://localhost:3000/admin



App structure
-------------

**JetKit** is structured in blocks, and block are composed by public files, views and/or plugins.


### Blocks

Blocks folder structure:

- config
- controllers
- lib
- models
- public
- routes
- services
- utilities
- views


### Plugins

See [Wiretree](http://wiretree.jacoborus.codes)


### Configurations

Configuration is exposed in tree as `config`. Their files are stored in `/config`.

See [deep.json](http://deepjson.jacoborus.codes)


### Public files

Public files are stored in `/public` folder in blocks, and by default available through HTTP under `/_public` URLs. JetKit creates also 3 folders in public folder: `js`, `css` and `img`


### Views

Views are not exposed in tree. Their files are stored in `/views`. Views are jade templates


### Routers

Routes are not exposed in tree and their files are stored in `/routes`


### Controllers

Controller files are stored in `/controllers`.

Exposed in group `control` with its file name as keyname, and under tree root with suffix *Ctrl*


### Models

JetKit uses Mongoose models stored in `/models` folder.

Exposed in group `models` with its file name as keyname, and under tree root with suffix *Model*.

3 types of models:

#### Collections

Collections are pure Mongoose models with its entirely API, and their files are stored in `/models/collections`

#### Subcollections (not implemented yet)

Subcollections are collections stored into a single document into `_keyval` collection.

Subcollection document schemas are stored in `/models/subcollections` folder

#### Singles

Singles are models that contain a single document and their files are stored in `/models/singles`.

Simplified API: `read` and `update`


### Libraries

Libraries are not exposed in tree.

Their files are stored in `/lib`

### Services

Service plugins are stored in `/services`.

Exposed in group `services` with its file name as keyname, and under tree root with suffix *Srv*.

Core services:

#### mailer

See [Curlymail](http://curlymail.jacoborus.codes)

#### ruler
See [miniruler](https://github.com/jacoborus/miniruler)

### log
Logger (¿?¿?¿?¿?)

### fm
File manager.


Routing
-------


### Main
```
GET		/					Home page
```

### User
```
GET		/user/login			    Login page
GET		/user/logout		    Login page
POST    /user/login             Post login credentials
GET     /user/forgot-password   Forgot password view
POST    /user/forgot-password   Post forgot password credentials
GET     /user/forgot-error      Error recovering password view
GET     /user/restore/:hash     Restore password form view
POST    /user/restore/:hash     Post new credentials recovering password
GET     /user/password-restored Restored password ok view
```

### Admin API
```
GET		/admin							Admin dashboard
// collection docs
GET		/admin/collection/:model				List/Search documents of model :model
GET		/admin/collection/:model/new			New doc view
POST	/admin/collection/:model				Create new doc
GET		/admin/collection/:model/:id			Read doc
GET		/admin/collection/:model/:id/edit		Edit doc view
PUT		/admin/collection/:model/:id			Update doc
DEL		/admin/collection/:model/:id			Destroy doc
// single docs
GET		/admin/single/:model/:id/edit	Edit doc view
PUT		/admin/single/:model/:id		Update doc
```


<br><br>

---

© 2015 Jacobo Tabernero - [jacoborus](https://jacoborus.codes)

Released under [MIT License](https://raw.github.com/jacoborus/jetkit/master/LICENSE)