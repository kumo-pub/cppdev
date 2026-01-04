
# zeromq

* registry: [kmpkgcore](https://github.com/kumose/kmpkgcore)
* type: kumo system both static and shared library.

## install

```bash
kmpkg install zeromq
```

## add port

add to project dependency list:

``` bash
find_package(ZeroMQ CONFIG REQUIRED)
```

## kmpkg

```json title="kmpkg.json"
{
  "dependencies": [
    "zeromq"
  ]
}
```

## cmake find and link

***find zeromq package***:

```cmake "title="find"
find_packge(zeromq REQUIRED)
```

***link zeromq static***:

```bash
zeromq::zeromq_static
```

***link zeromq dynamic***:

```bash
libzmq-static
```

```bash
libzmq
```

