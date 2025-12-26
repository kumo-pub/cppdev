
# merak

* registry: [kmpkgcore](https://github.com/kumose/kmpkgcore)
* type: kumo system both static and shared library.

## install

```bash
kmpkg install merak
```

## add port

add to project dependency list:

``` bash
kmpkg add port merak
```

## kmpkg

```json title="kmpkg.json"
{
  "dependencies": [
    "merak"
  ]
}
```

## cmake find and link

***find merak package***:

```cmake "title="find"
find_packge(merak REQUIRED)
```

***link merak static***:

```bash
merak::merak_static
```

***link merak dynamic***:

```bash
merak::merak_shared
```
