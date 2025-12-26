
# protobuf

* registry: [kmpkgcore](https://github.com/kumose/kmpkgcore)
* type: kumo system both static and shared library.

## install

```bash
kmpkg install protobuf[zlib]
```

## add port

add to project dependency list:

``` bash
kmpkg add port protobuf[zlib]
```

## kmpkg

```json title="kmpkg.json"
{
  "dependencies": [
    {
      "name": "protobuf",
      "features": [
        "zlib"
      ]
    }
  ]
}
```

## cmake find and link

***find protobuf package***:

```cmake "title="find"
find_packge(Protobuf REQUIRED)

if (Protobuf_VERSION GREATER 4.21)
    # required by absl
    find_package(absl REQUIRED CONFIG)
    set(protobuf_ABSL_USED_TARGETS
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
    )
endif ()

```

***link protobuf static***:

```bash
protobuf::libprotobuf
${protobuf_ABSL_USED_TARGETS}
protobuf::libprotoc
```

## cmake

```cmake title="compile proto to object"
set(PROTO_FILES
        proto/key.proto
)

kmcmake_cc_proto(
        NAME proto_obj
        PROTOS
        ${PROTO_FILES}
        OUTDIR
        ${PROJECT_SOURCE_DIR}
)

kmcmake_cc_object(
        NAMESPACE cantor
        NAME proto_obj
        SOURCES
        ${proto_obj_SRCS}
        CXXOPTS
        ${KMCMAKE_CXX_OPTIONS}
)
```

```cmake title="compile proto to library"
set(PROTO_FILES
        proto/key.proto
)

kmcmake_cc_proto(
        NAME proto_obj
        PROTOS
        ${PROTO_FILES}
        OUTDIR
        ${PROJECT_SOURCE_DIR}
)

kmcmake_cc_library(
        NAMESPACE cantor
        NAME proto_obj
        SOURCES
        ${proto_obj_SRCS}
        CXXOPTS
        ${KMCMAKE_CXX_OPTIONS}
)
```
