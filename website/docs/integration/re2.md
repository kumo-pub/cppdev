
# re2

* registry: [kmpkgcore](https://github.com/kumose/kmpkgcore)
* type: kumo system both static and shared library.

## install

```bash
kmpkg install re2
```

## add port

add to project dependency list:

``` bash
kmpkg add port re2
```

## kmpkg

```json title="kmpkg.json"
{
  "dependencies": [
    "re2"
  ]
}
```

## cmake find and link

***find re2 package***:

```cmake "title="find"
find_packge(re2 REQUIRED)
```

***link re2 static***:

```bash
re2::re2
```