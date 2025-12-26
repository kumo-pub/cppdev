
# tally

* registry: [kmpkgcore](https://github.com/kumose/kmpkgcore)
* type: kumo system both static and shared library.

## install

```bash
kmpkg install tally
```

## add port

add to project dependency list:

``` bash
kmpkg add port tally
```

## kmpkg

```json title="kmpkg.json"
{
  "dependencies": [
    "tally"
  ]
}
```

## cmake find and link

***find tally package***:

```cmake "title="find"
find_packge(tally REQUIRED)
```

***link tally static***:

```bash
tally::tally_static
```

***link tally dynamic***:

```bash
tally::tally_shared
```
