
# ftxui

* registry: [kmpkgcore](https://github.com/kumose/kmpkgcore)
* type: kumo system both static and shared library.

## install

```bash
kmpkg install ftxui
```

## add port

add to project dependency list:

``` bash
kmpkg add port ftxui
```

## kmpkg

```json title="kmpkg.json"
{
  "dependencies": [
    "ftxui"
  ]
}
```

## cmake find and link

***find ftxui package***:

```cmake "title="find"
find_packge(ftxui REQUIRED)
```

***link ftxui static***:

```bash
ftxui::ftxui
```