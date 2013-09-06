forerunner-postgres-store
===

Simple postgres store plugin for [forerunner](https://github.com/dropdownmenu/forerunner).

```
npm install forerunner-postgres-store
```

usage
---

```
var pgStore = require('forerunner-postgres-store');

// set up the db
var dbOpts = {
  db: {
    user: 'user',
    password: 'pass',
    database: 'database'
  },
  tableName: 'job_store' // the db table to store your jobs in
};

var store = new pgStore(dbOpts, function(err) {

  var forerunnerOpts = {
    store: store
  };

  forerunner.start(forerunnerOpts, function() {

  });
});

```

setup
---

The base sql file for creating the table can be found in utils/


LICENSE
---

<MIT>

Copyright (c) 2013 Kiernan Tim McGowan (dropdownmenu)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

