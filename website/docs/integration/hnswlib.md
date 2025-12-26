
# hnswlib

* registry: [kmpkgcore](https://github.com/kumose/kmpkgcore)
* type: kumo system both static and shared library.

## install

```bash
kmpkg install hnswlib
```

## add port

add to project dependency list:

``` bash
kmpkg add port hnswlib
```

## kmpkg

```json title="kmpkg.json"
{
  "dependencies": [
    "hnswlib"
  ]
}
```

## cmake find and link

***find hnswlib package***:

```cmake "title="find"
find_package(hnswlib CONFIG REQUIRED)
```

***link hnswlib static***:

```bash
hnswlib::hnswlib
```
