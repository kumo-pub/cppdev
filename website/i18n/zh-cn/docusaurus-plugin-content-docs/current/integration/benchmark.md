
# benchmark

* registry: [kmpkgcore](https://github.com/kumose/kmpkgcore)
* type: static library.

## install

```bash
kmpkg install benchmark
```

## add port

add to project dependency list:

``` bash
kmpkg add port benchmark
```

## kmpkg

```json title="kmpkg.json"
{
  "dependencies": [
    "benchmark"
  ]
}
```

## cmake find and link

***find benchmark package***:

```cmake "title="find"
find_packge(benchmark REQUIRED)
```

***link benchmark static***:

```bash
benchmark::benchmark
```


```bash
benchmark::benchmark_main
```
