
# rocksdb

* registry: [kmpkgcore](https://github.com/kumose/kmpkgcore)
* type: kumo system both static and shared library.

## install

```bash
kmpkg add port rocksdb[zlib,snappy,lz4,bzip2]
```

## add port

add to project dependency list:

``` bash
kmpkg add port rocksdb[zlib,snappy,lz4,bzip2]
```

:::warning
```bash
kmpkg add port rocksdb[zlib,snappy[rtti],lz4,bzip2]
```
this command is not valid,if you want to enable snappy with feathure `rtti`,
using 
```bash
kmpkg add port rocksdb[zlib,snappy,lz4,bzip2]
```
and then, edit the `kmpkg.json`, replace "snappy" with 
```json
{
  "name": "snappy",
  "features": [
      "rtti"
  ]
}
```
:::

## kmpkg

```json title="kmpkg.json"
{
  "dependencies": [
    {
      "name": "rocksdb",
      "features": [
        "zlib",
        {
          "name": "snappy",
          "features": [
              "rtti"
          ]
        }
        "lz4",
        "bzip2"
      ]
    }
  ]
}
```

## cmake find and link

***find rocksdb package***:

```cmake "title="find"
find_package(RocksDB CONFIG REQUIRED)
```

***link rocksdb static***:

```bash
RocksDB::rocksdb
```