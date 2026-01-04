


# inih


import Tabs from '@theme/Tabs';

import TabItem from '@theme/TabItem';


* registry: [kmpkgcore](https://github.com/kumose/kmpkgcore)
* type: kumo system both static and shared library.

## install

```bash
kmpkg install inih
```

## add port

add to project dependency list:

``` bash
kmpkg add port inih
```

## kmpkg

```json title="kmpkg.json"
{
  "dependencies": [
    "inih"
  ]
}
```

## cmake find and link

***find inih package***:

```cmake "title="find"
find_package(unofficial-inih CONFIG REQUIRED)
```

***link inih static***:
<Tabs>
<TabItem value="c" label="pure c" default>

```bash
unofficial::inih::libinih
```
</TabItem>
<TabItem value="c++" label="c++" default>

```bash
unofficial::inih::inireader
```

</TabItem>
</Tabs>
