
# catch2

* registry: [kmpkgcore](https://github.com/kumose/kmpkgcore)
* type: interface.

## install

```bash
kmpkg install catch2
```

## add port

add to project dependency list:

``` bash
kmpkg add port catch2
```

## kmpkg

```json title="kmpkg.json"
{
  "dependencies": [
    "catch2"
  ]
}
```

## cmake find and link

***find turbo package***:

```cmake "title="find"
find_packge(catch2 REQUIRED)
```
