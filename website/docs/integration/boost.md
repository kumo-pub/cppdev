# boost

* registry: [kmpkgcore](https://github.com/kumose/kmpkgcore)
* type: kumo system both static and shared library.

## components

- boost-accumulators
- boost-algorithm
- boost-align
- boost-any
- boost-array
- boost-asio
- boost-assert
- boost-assign
- boost-atomic
- boost-beast
- boost-bimap
- boost-bind
- boost-bloom
- boost-callable-traits
- boost-charconv
- boost-chrono
- boost-circular-buffer
- boost-compat
- boost-compute
- boost-concept-check
- boost-config
- boost-container
- boost-container-hash
- boost-context
- boost-contract
- boost-conversion
- boost-convert
- boost-core
- boost-coroutine
- boost-coroutine2
- boost-crc
- boost-date-time
- boost-describe
- boost-detail
- boost-dll
- boost-dynamic-bitset
- boost-endian
- boost-exception
- boost-fiber
- boost-filesystem
- boost-flyweight
- boost-foreach
- boost-format
- boost-function
- boost-functional
- boost-function-types
- boost-fusion
- boost-geometry
- boost-gil
- boost-graph
- boost-hana
- boost-hash2
- boost-headers
- boost-heap
- boost-histogram
- boost-hof
- boost-icl
- boost-integer
- boost-interprocess
- boost-interval
- boost-intrusive
- boost-io
- boost-iostreams
- boost-iterator
- boost-json
- boost-lambda
- boost-lambda2
- boost-leaf
- boost-lexical-cast
- boost-locale
- boost-local-function
- boost-lockfree
- boost-log
- boost-logic
- boost-math
- boost-metaparse
- boost-move
- boost-mp11
- boost-mpl
- boost-mqtt5
- boost-msm
- boost-multi-array
- boost-multi-index
- boost-multiprecision
- boost-mysql
- boost-nowide
- boost-numeric-conversion
- boost-odeint
- boost-optional
- boost-outcome
- boost-parameter
- boost-parameter-python
- boost-parser
- boost-pfr
- boost-phoenix
- boost-poly-collection
- boost-polygon
- boost-pool
- boost-predef
- boost-preprocessor
- boost-process
- boost-program-options
- boost-property-map
- boost-property-tree
- boost-proto
- boost-ptr-container
- boost-python
- boost-qvm
- boost-random
- boost-range
- boost-ratio
- boost-rational
- boost-redis
- boost-regex
- boost-safe-numerics
- boost-scope
- boost-scope-exit
- boost-serialization
- boost-signals2
- boost-smart-ptr
- boost-sort
- boost-spirit
- boost-stacktrace
- boost-statechart
- boost-static-assert
- boost-static-string
- boost-stl-interfaces
- boost-system
- boost-test
- boost-thread
- boost-throw-exception
- boost-timer
- boost-tokenizer
- boost-tti
- boost-tuple
- boost-type-erasure
- boost-type-index
- boost-typeof
- boost-type-traits
- boost-ublas
- boost-uninstall
- boost-units
- boost-unordered
- boost-url
- boost-utility
- boost-uuid
- boost-variant
- boost-variant2
- boost-vmd
- boost-wave
- boost-winapi
- boost-xpressive
- boost-yap

:::warning
boost-cobalt
need c++20, the kmpkgcore repos do not enable this module.
:::

## install

> Note: It is strongly recommended to install only required components instead of the full boost library. Installing the full boost will bring in unnecessary dependencies, increase compilation time and binary size.

### Install full boost (NOT recommended)
```bash
kmpkg install boost
```
### Install specific components (RECOMMENDED)
```bash
# Example: Install only boost-asio and boost-filesystem
kmpkg install boost-asio boost-filesystem
```

## add port
> Note: Add only required components to dependencies instead of the full boost to avoid full installation.
### Add full boost to project dependency list (NOT recommended)
``` bash
kmpkg add port boost
```
### Add specific components to project dependency list (RECOMMENDED)
``` bash
# Example: Add only boost-asio and boost-coroutine2
kmpkg add port boost-asio boost-coroutine2
```

## kmpkg
> Note: Always declare only required components in dependencies to follow on-demand dependency principle.
### Full boost dependency (NOT recommended)
```json title="kmpkg.json"
{
  "dependencies": [
    "boost"
  ]
}
```
### Specific components dependency (RECOMMENDED)

```json title="kmpkg.json"
{
  "dependencies": [
    "boost-asio",
    "boost-coroutine2",
    "boost-filesystem"
  ]
}
```

## cmake find and link

> Note: Find and link only required boost sub-modules. Each sub-package corresponds to a CMake module name (remove "boost-" prefix from sub-package name for the module name). Header-only sub-modules (e.g., boost-core, boost-assert) only require including headers without linking libraries.

***find boost package***:
```cmake title="find"
# Find full boost (NOT recommended)
# find_package(boost REQUIRED)

# Find specific sub-modules (RECOMMENDED)
# Syntax: find_package(Boost REQUIRED COMPONENTS <sub-module-name1> <sub-module-name2>)
# Sub-module name = sub-package name without "boost-" prefix (e.g., boost-asio → asio)
find_package(Boost REQUIRED COMPONENTS asio coroutine2 filesystem)
```

***link boost static***:
> Link only required components. CMake target format: `Boost::${sub-module-name}`
```cmake
# Link specific sub-modules statically (RECOMMENDED)
target_link_libraries(your_project PRIVATE Boost::asio Boost::coroutine2 Boost::filesystem)

# Link full boost statically (NOT recommended)
# target_link_libraries(your_project PRIVATE boost::boost_static)
```

***link boost dynamic***:
> Link only required sub-modules. CMake target format: `Boost::${sub-module-name}`
```cmake
# Link specific sub-modules dynamically (RECOMMENDED)
target_link_libraries(your_project PRIVATE Boost::asio Boost::coroutine2 Boost::filesystem)

# Link full boost dynamically (NOT recommended)
# target_link_libraries(your_project PRIVATE boost::boost_shared)
```