
# granite

* registry: [kmpkgcore](https://github.com/kumose/kmpkgcore)
* type: kumo system both static and shared library.

## install

```bash
kmpkg install granite
```

## add port

add to project dependency list:

``` bash
kmpkg add port granite
```

## kmpkg

```json title="kmpkg.json"
{
  "dependencies": [
    "granite"
  ]
}
```

## cmake find and link

***find granite package***:

```cmake "title="find"
find_packge(granite REQUIRED)
```

***link granite static***:

```bash
granite::granite_static
```

***link granite dynamic***:

```bash
granite::granite_shared
```
