
# doctest

* registry: [kmpkgcore](https://github.com/kumose/kmpkgcore)
* type: interface.

## install

```bash
kmpkg install doctest
```

## add port

add to project dependency list:

``` bash
kmpkg add port doctest
```

## kmpkg

```json title="kmpkg.json"
{
  "dependencies": [
    "doctest"
  ]
}
```

## cmake find and link

***find turbo package***:

```cmake "title="find"
find_packge(doctest REQUIRED)
```
