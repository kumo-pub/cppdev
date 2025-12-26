
# utf8proc

* registry: [kmpkgcore](https://github.com/kumose/kmpkgcore)
* type: kumo system both static and shared library.

## install

```bash
kmpkg install utf8proc
```

## add port

add to project dependency list:

``` bash
kmpkg add port utf8proc
```

## kmpkg

```json title="kmpkg.json"
{
  "dependencies": [
    "utf8proc"
  ]
}
```

## cmake find and link

***find utf8proc package***:

```cmake "title="find"
find_package(utf8proc CONFIG REQUIRED)
```

***link utf8proc static***:

```bash
utf8proc::utf8proc
```
