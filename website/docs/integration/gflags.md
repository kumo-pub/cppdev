
# gflags

* registry: [kmpkgcore](https://github.com/kumose/kmpkgcore)
* type: kumo system both static and shared library.

## install

```bash
kmpkg install gflags
```

## add port

add to project dependency list:

``` bash
kmpkg add port gflags
```

## kmpkg

```json title="kmpkg.json"
{
  "dependencies": [
    "gflags"
  ]
}
```

## cmake find and link

***find gflags package***:

```cmake "title="find"
find_packge(gflags CONFIG REQUIRED)
```

***link gflags static***:

```bash
gflags::gflags
```