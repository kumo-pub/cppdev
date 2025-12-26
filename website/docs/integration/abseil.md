
# abseil

* registry: [kmpkgcore](https://github.com/kumose/kmpkgcore)
* type: kumo system both static and shared library.

## install

```bash
kmpkg install abseil
```

## add port

add to project dependency list:

``` bash
kmpkg add port abseil
```

## kmpkg

```json title="kmpkg.json"
{
  "dependencies": [
    "abseil"
  ]
}
```

## cmake find and link

***find abseil package***:

```cmake "title="find"
find_package(absl REQUIRED CONFIG)
```

***link abseil static***:

```bash
absl::absl_check
absl::absl_log
absl::algorithm
absl::base
absl::bind_front
absl::bits
absl::btree
absl::cleanup
absl::cord
absl::core_headers
absl::debugging
absl::die_if_null
absl::dynamic_annotations
absl::flags
absl::flat_hash_map
absl::flat_hash_set
absl::function_ref
absl::hash
absl::layout
absl::log_initialize
absl::log_severity
absl::memory
absl::node_hash_map
absl::node_hash_set
absl::optional
absl::span
absl::status
absl::statusor
absl::strings
absl::synchronization
absl::time
absl::type_traits
absl::utility
absl::variant
```
