
# yaml-cpp

* registry: [kmpkgcore](https://github.com/kumose/kmpkgcore)
* type: kumo system both static and shared library.

## install

```bash
kmpkg install yaml-cpp
```

## add port

add to project dependency list:

``` bash
kmpkg add port yaml-cpp
```

## kmpkg

```json title="kmpkg.json"
{
  "dependencies": [
    "yaml-cpp"
  ]
}
```

## cmake find and link

***find yaml-cpp package***:

```cmake "title="find"
find_packge(yaml-cpp CONFIG REQUIRED)
```

***link yaml-cpp static***:

```bash
yaml-cpp::yaml-cpp
```