'use strict';

var Ruler = require('miniruler');

var ruler = new Ruler();

ruler.setActions({
    manageSettings: {
        roles: ['superadmin', 'admin']
    },
    accessAdmin: {
        roles: ['superadmin', 'admin', 'author']
    }
});

module.exports = ruler;
