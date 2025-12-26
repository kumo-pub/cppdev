
# xlog

* registry: [kmpkgcore](https://github.com/kumose/kmpkgcore)
* type: kumo system both static and shared library.

## install

```bash
kmpkg install xlog
```

## add port

add to project dependency list:

``` bash
kmpkg add port xlog
```

## kmpkg

```json title="kmpkg.json"
{
  "dependencies": [
    "xlog"
  ]
}
```

## cmake find and link

***find xlog package***:

```cmake "title="find"
find_packge(xlog REQUIRED)
```

***link xlog static***:

```bash
xlog::xlog_static
```

***link xlog dynamic***:

```bash
xlog::xlog_shared
```
