
# gtest

* registry: [kmpkgcore](https://github.com/kumose/kmpkgcore)
* type: static library.

## install

```bash
kmpkg install gtest
```

## add port

add to project dependency list:

``` bash
kmpkg add port gtest
```

## kmpkg

```json title="kmpkg.json"
{
  "dependencies": [
    "gtest"
  ]
}
```

## cmake find and link

***find gtest package***:

```cmake "title="find"
find_packge(GTest REQUIRED)
```

***link gtest static***:

```bash
GTest::gtest
```


```bash
GTest::gtest_main
```


```bash
GTest::gmock
```


```bash
GTest::gmock_main
```