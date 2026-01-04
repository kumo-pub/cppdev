
# ghc-filesystem

* registry: [kmpkgcore](https://github.com/kumose/kmpkgcore)
* type: kumo system both static and shared library.

## install

```bash
kmpkg install ghc-filesystem
```

## add port

add to project dependency list:

``` bash
kmpkg add port ghc-filesystem
```

## kmpkg

```json title="kmpkg.json"
{
  "dependencies": [
    "ghc-filesystem"
  ]
}
```

## cmake find and link

***find ghc-filesystem package***:

```cmake "title="find"
find_package(ghc_filesystem CONFIG REQUIRED)
```

***link ghc-filesystem static***:

```bash
ghcFilesystem::ghc_filesystem
```
