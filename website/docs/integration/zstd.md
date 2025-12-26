
# zstd

* registry: [kmpkgcore](https://github.com/kumose/kmpkgcore)
* type: kumo system both static and shared library.

## install

```bash
kmpkg install zstd
```

## add port

add to project dependency list:

``` bash
kmpkg add port zstd
```

## kmpkg

```json title="kmpkg.json"
{
  "dependencies": [
    "zstd"
  ]
}
```

## cmake find and link

***find zstd package***:

```cmake "title="find"
find_package(zstd CONFIG REQUIRED)
```

***link zstd static***:

```bash
zstd::libzstd
```
