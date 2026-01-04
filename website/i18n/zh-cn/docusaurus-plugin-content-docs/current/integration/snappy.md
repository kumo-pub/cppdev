
# sanppy

* registry: [kmpkgcore](https://github.com/kumose/kmpkgcore)
* type: kumo system both static and shared library.

## install

```bash
kmpkg install sanppy
```

## add port

add to project dependency list:

``` bash
kmpkg add port sanppy[rtti]
```

## kmpkg

```json title="kmpkg.json"
{
  "dependencies": [
    {
      "name": "snappy",
      "features": [
        "rtti"
      ]
    }
  ]
}
```

## cmake find and link

***find sanppy package***:

```cmake "title="find"
find_package(Snappy REQUIRED)
```

***link sanppy static***:

```bash
Snappy::snappy
```