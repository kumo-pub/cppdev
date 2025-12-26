
# lz4

* registry: [kmpkgcore](https://github.com/kumose/kmpkgcore)
* type: kumo system both static and shared library.

## install

```bash
kmpkg install lz4
```

## add port

add to project dependency list:

``` bash
kmpkg add port lz4
```

## kmpkg

```json title="kmpkg.json"
{
  "dependencies": [
    "lz4"
  ]
}
```

## cmake find and link

***find lz4 package***:

```cmake "title="find"
find_packge(lz4 REQUIRED)
```

***link lz4 static***:

```bash
lz4::lz4
```