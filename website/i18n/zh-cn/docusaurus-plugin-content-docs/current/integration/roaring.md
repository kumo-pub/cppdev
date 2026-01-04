
# roaring

* registry: [kmpkgcore](https://github.com/kumose/kmpkgcore)
* type: kumo system both static and shared library.

## install

```bash
kmpkg install roaring
```

## add port

add to project dependency list:

``` bash
kmpkg add port roaring
```

## kmpkg

```json title="kmpkg.json"
{
  "dependencies": [
    "roaring"
  ]
}
```

## cmake find and link

***find roaring package***:

```cmake "title="find"
find_package(roaring CONFIG REQUIRED)
```

***link roaring static***:

```bash
roaring::roaring_static
```

***link roaring dynamic***:

```bash
roaring::roaring roaring::roaring-headers roaring::roaring-headers-cpp
```
