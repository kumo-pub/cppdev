
# eigen3

* registry: [kmpkgcore](https://github.com/kumose/kmpkgcore)
* type: kumo system both static and shared library.

## install

```bash
kmpkg install eigen3
```

## add port

add to project dependency list:

``` bash
kmpkg add port eigen3
```

## kmpkg

```json title="kmpkg.json"
{
  "dependencies": [
    "eigen3"
  ]
}
```

## cmake find and link

***find eigen3 package***:

```cmake "title="find"
find_packge(Eigen3 REQUIRED)
```

***link eigen3 static***:

```bash
Eigen3::Eigen
```