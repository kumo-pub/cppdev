
# nlohmann-json

* registry: [kmpkgcore](https://github.com/kumose/kmpkgcore)
* type: kumo system both static and shared library.

## install

```bash
kmpkg install nlohmann-json
```

## add port

add to project dependency list:

``` bash
kmpkg add port nlohmann-json
```

## kmpkg

```json title="kmpkg.json"
{
  "dependencies": [
    "nlohmann-json"
  ]
}
```

## cmake find and link

***find nlohmann-json package***:

```cmake "title="find"
find_package(nlohmann_json CONFIG REQUIRED)
```

***link nlohmann-json static***:

```bash
nlohmann_json::nlohmann_json
```
