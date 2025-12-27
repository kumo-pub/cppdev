
# lzo

* registry: [kmpkgcore](https://github.com/kumose/kmpkgcore)
* type: kumo system both static and shared library.

## install

```bash
kmpkg install lzo
```

## add port

add to project dependency list:

``` bash
kmpkg add port lzo
```

## kmpkg

```json title="kmpkg.json"
{
  "dependencies": [
    "lzo"
  ]
}
```

## cmake find and link

***find lzo package***:

```cmake "title="find"
find_packge(lzo REQUIRED)
```

***link lzo static***:

```bash
lzo::lzo
```