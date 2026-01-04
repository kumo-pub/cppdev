
# vamos

* registry: [kmpkgcore](https://github.com/kumose/kmpkgcore)
* type: kumo system both static and shared library.

## install

```bash
kmpkg install vamos
```

## add port

add to project dependency list:

``` bash
kmpkg add port vamos
```

## kmpkg

```json title="kmpkg.json"
{
  "dependencies": [
    "vamos"
  ]
}
```

## cmake find and link

***find vamos package***:

```cmake "title="find"
find_packge(vamos REQUIRED)
```

***link vamos static***:

```bash
vamos::vamos_static
```

***link vamos dynamic***:

```bash
vamos::vamos_shared
```
