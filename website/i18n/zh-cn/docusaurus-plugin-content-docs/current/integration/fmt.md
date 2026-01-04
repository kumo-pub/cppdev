
# fmt

* registry: [kmpkgcore](https://github.com/kumose/kmpkgcore)
* type: interface.

## install

```bash
kmpkg install fmt
```

## add port

add to project dependency list:

``` bash
kmpkg add port fmt
```

## kmpkg

```json title="kmpkg.json"
{
  "dependencies": [
    "fmt"
  ]
}
```

## cmake find and link

***find turbo package***:

```cmake "title="find"
find_packge(fmt REQUIRED)
```

***link fmt static***:

```bash
fmt::fmt
```

