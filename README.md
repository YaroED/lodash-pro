# `lodash-pro`

lodash docs[https://www.lodashjs.com/]
This repositorie is based on lodash v4.17.21
However, date processing and regular form verification are added.

## Usage
Common js

```
const lodashPro = require('lodash-pro');

```

or nice usage to ES module:

```
// use lodash-pro function
import { dateFormat, isPhone, isIdCard } from 'lodash-pro'

dateFormat(undefined, 'yyyy-mm-dd HH:MM:ss')
// expected output String: "2020-02-02 20:20:20"

isPhone(13312341234)
// expected output Boolean: true

// use lodash function
import { _ } from 'lodash-pro'

_.random(1,10)
_.max(1,10)

```

## Build


```
pnpm dev

```


## Contributing to lodash-pro


Contributions are always welcome. Before contributing please read the code of conduct & search the issue tracker; your issue may have already been discussed or fixed in master. To contribute, fork Lodash, commit your changes, & send a pull request.



## Star And Sponsor


If you think this project is good, you can click star on GitHub to support the me.

