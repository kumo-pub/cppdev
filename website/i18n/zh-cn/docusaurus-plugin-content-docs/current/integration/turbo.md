
# turbo

* registry: [kmpkgcore](https://github.com/kumose/kmpkgcore)
* type: kumo system both static and shared library.

## install

```bash
kmpkg install turbo
```

## add port

add to project dependency list:

``` bash
kmpkg add port turbo
```

## kmpkg

```json title="kmpkg.json"
{
  "dependencies": [
    "turbo"
  ]
}
```

## cmake find and link

***find turbo package***:

```cmake "title="find"
find_packge(turbo REQUIRED)
```

***link turbo static***:

```bash
turbo::turbo_static
```

***link turbo dynamic***:

```bash
turbo::turbo_shared
```
