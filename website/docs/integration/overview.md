
# overview

this section list the repos integrations, all the `ports` are supported by [`kmpkg`](https://github.com/kumose/kmpkgcore). 

```bash title="install kmpkgcore"
git clone https://github.com/kumose/kmpkgcore.git
./bootstrap-kmpkg.sh
echo KMPKG_HOME=/you/path
```

all the ports operation should be on this repos. the kmdo tools reference [kmdo docs](https://pub.kumose.cc/kmdo).


## init a cmake build system

1. first init cmake building

```bash title="1. init cmake"
kmdo kmpkg gencmake -o . -n hello
  • Checking CMake          Checking(seq/total)=1/3
  • Prepare Kmcmake         Prepare(seq/total)=2/3
      • Kmcmake Ready
  • Generating CMake        Generating(seq/total)=3/3
  • kmcmake installed success                        path=. project=hello
  • thanks for using kmdo!
```

```bash title="2. init kmpkg"
kmpkg new --application
```


```bash title="3. add port"
kmpkg add port fmt
Succeeded in adding ports to kmpkg.json file.
```


```bash title="4. configure cmake"
cmake --preset=default
```


```bash title="5. cmake build"
cmake --build build
```

## important files examples

```json title="CMakePresets.json"
{
  "version": 2,
  "configurePresets": [
    {
      "name": "default",
      "generator": "Unix Makefiles",
      "binaryDir": "${sourceDir}/build",
      "cacheVariables": {
        "CMAKE_TOOLCHAIN_FILE": "$env{KMPKG_CMAKE}"
      }
    }
  ]
}
```

```json title="kmpkg-configuration.json"
{
  "default-registry": {
    "kind": "git",
    "baseline": "32b93125c33fa5c967417aa6797b2fbf6d883c22",
    "repository": "https://github.com/kumose/kmpkgcore.git"
  },
  "registries": [
    {
      "kind": "artifact",
      "location": "https://github.com/kumose/kmpkg-ce-catalog/archive/refs/heads/main.zip",
      "name": "microsoft"
    }
  ]
}
```

```json title="kmpkg.json"
{
  "dependencies": [
    "fmt"
  ]
}
```

## dependency

in kmcmake system, we alway collect denpendencies in the file `cmake/xxx_deps.cmake`,
in the `hello` examples, it is `cmake/hello_deps.cmake`


```cmake title="cmake/hello_deps.cmake"
# Copyright (C) Kumo inc. and its affiliates.
# Author: Jeff.li lijippy@163.com
# All rights reserved.
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published
# by the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.
#
############################################################
# system pthread and rt, dl
############################################################
set(KMCMAKE_SYSTEM_DYLINK)
if (APPLE)
    find_library(CoreFoundation CoreFoundation)
    list(APPEND KMCMAKE_SYSTEM_DYLINK ${CoreFoundation} pthread)
elseif (${CMAKE_SYSTEM_NAME} STREQUAL "Linux")
    list(APPEND KMCMAKE_SYSTEM_DYLINK rt dl pthread)
endif ()

if (KMCMAKE_BUILD_TEST)
    enable_testing()
    #include(require_gtest)
    #include(require_gmock)
    #include(require_doctest)
endif (KMCMAKE_BUILD_TEST)

if (KMCMAKE_BUILD_BENCHMARK)
    #include(require_benchmark)
endif ()

find_package(Threads REQUIRED)

############################################################
#
# add you libs to the KMCMAKE_DEPS_LINK variable eg as turbo
# so you can and system pthread and rt, dl already add to
# KMCMAKE_SYSTEM_DYLINK, using it for fun.
##########################################################
set(KMCMAKE_DEPS_LINK
        #${TURBO_LIB}
        ${KMCMAKE_SYSTEM_DYLINK}
        )
list(REMOVE_DUPLICATES KMCMAKE_DEPS_LINK)
kmcmake_print_list_label("Denpendcies:" KMCMAKE_DEPS_LINK)

############################################################
# for binary
############################################################
set(KMCMAKE_STATIC_BIN_OPTION -static-libgcc -static-libstdc++)

```


we alway process `find` around the `find_package(Threads REQUIRED)`,

and add the target or lib around 

```cmake
set(KMCMAKE_DEPS_LINK
        fmt::fmt
        ${KMCMAKE_SYSTEM_DYLINK}
        )
```

using `${KMCMAKE_DEPS_LINK}` in the kmcmake's system any where, it
will link all the denpend libraries.

like this:

```cmake title="create a library"
kmcmake_cc_library(
        NAMESPACE ${PROJECT_NAME}
        NAME foo
        SOURCES
        foo.cc
        CXXOPTS
        ${KMCMAKE_CXX_OPTIONS}
        PLINKS
        # private the libs
        ${KMCMAKE_DEPS_LINK}
        PUBLIC
)
```
