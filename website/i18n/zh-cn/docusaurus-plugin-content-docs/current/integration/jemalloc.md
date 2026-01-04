
# jemalloc

* registry: [kmpkgcore](https://github.com/kumose/kmpkgcore)
* type: kumo system both static and shared library.

## install

```bash
kmpkg install jemalloc
```

## add port

add to project dependency list:

``` bash
kmpkg add port jemalloc
```

## kmpkg

```json title="kmpkg.json"
{
  "dependencies": [
    "jemalloc"
  ]
}
```

## cmake find and link

***find jemalloc package***:

`jemalloc` do **not** provide a cmake config target exported,
we write a wrap for found jemalloc:

```cmake "title="find"
option(MUST_JEMALLOC "must using jemalloc" OFF)
set(JEMALLOC_FOUND FALSE)
find_library(JEMALLOC_LIB NAMES jemalloc)
find_path(JEMALLOC_INCLUDE_DIR jemalloc/jemalloc.h)
if (JEMALLOC_LIB AND JEMALLOC_INCLUDE_DIR)
   set(JEMALLOC_FOUND TRUE)
endif()

if (MUST_JEMALLOC AND NOT JEMALLOC_FOUND)
  message(FATAL_ERROR "jemalloc not found")
endif()

```

***link jemalloc static***:

```bash
${JEMALLOC_LIB}
```
