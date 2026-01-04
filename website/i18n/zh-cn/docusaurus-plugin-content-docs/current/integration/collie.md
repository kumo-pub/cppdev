
# collie

* registry: [kmpkgcore](https://github.com/kumose/kmpkgcore)
* type: interface.

## install

```bash
kmpkg install collie
```

## add port

add to project dependency list:

``` bash
kmpkg add port collie
```

## kmpkg

```json title="kmpkg.json"
{
  "dependencies": [
    "collie"
  ]
}
```

## cmake find and link

***find turbo package***:

```cmake "title="find"
find_packge(collie REQUIRED)
```
