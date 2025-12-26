
# leveldb

* registry: [kmpkgcore](https://github.com/kumose/kmpkgcore)
* type: kumo system both static and shared library.

## install

```bash
kmpkg install leveldb
```

## add port

add to project dependency list:

``` bash
kmpkg add port leveldb
```

## kmpkg

```json title="kmpkg.json"
{
  "dependencies": [
    "leveldb"
  ]
}
```

## cmake find and link

***find leveldb package***:

```cmake "title="find"
find_package(leveldb REQUIRED)
```

***link leveldb static***:

```bash
leveldb::leveldb
```