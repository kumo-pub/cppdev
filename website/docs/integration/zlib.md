
# zlib

* registry: [kmpkgcore](https://github.com/kumose/kmpkgcore)
* type: kumo system both static and shared library.

## install

```bash
kmpkg install zlib
```

## add port

add to project dependency list:

``` bash
kmpkg add port zlib
```

## kmpkg

```json title="kmpkg.json"
{
  "dependencies": [
    "zlib"
  ]
}
```

## cmake find and link

***find zlib package***:

```cmake "title="find"
find_package(ZLIB REQUIRED)
```

***link zlib static***:

```bash
ZLIB::ZLIB
```
