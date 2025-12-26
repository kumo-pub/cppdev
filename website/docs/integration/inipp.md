
# inipp

* registry: [kmpkgcore](https://github.com/kumose/kmpkgcore)
* type: kumo system both static and shared library.

## install

```bash
kmpkg install inipp
```

## add port

add to project dependency list:

``` bash
kmpkg add port inipp
```

## kmpkg

```json title="kmpkg.json"
{
  "dependencies": [
    "inipp"
  ]
}
```

## cmake find and link

***find inipp package***:

```cmake "title="find"
find_path(INIPP_INCLUDE_DIRS "inipp.h")
```

***link inipp static***:

```bash
target_include_directories(main PRIVATE ${INIPP_INCLUDE_DIRS})
```

***OR***:

```bash
include_directories(${INIPP_INCLUDE_DIRS})
```
