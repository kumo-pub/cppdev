
# bzip2

* registry: [kmpkgcore](https://github.com/kumose/kmpkgcore)
* type: kumo system both static and shared library.

## install

```bash
kmpkg install bzip2
```

## add port

add to project dependency list:

``` bash
kmpkg add port bzip2
```

## kmpkg

```json title="kmpkg.json"
{
  "dependencies": [
    "bzip2"
  ]
}
```

## cmake find and link

***find bzip2 package***:

```cmake "title="find"
find_package(BZip2 REQUIRED)
```

***link bzip2 static***:

```bash
BZip2::BZip2
```