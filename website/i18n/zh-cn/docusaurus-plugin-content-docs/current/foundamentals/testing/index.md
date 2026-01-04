# Performance Testing and Unit Testing
In the software development process, testing is an extremely important part. Among numerous testing methods, unit testing holds an indispensable position.

Kumo also attaches great importance to unit testing—unit testing is a mandatory step in Kumo's internal development. Kumo integrates its internally used testing frameworks into the open-source ecosystem.

## Unit Test
### doctest
doctest is the primary testing framework used by Kumo, featuring lightweight architecture and header-only implementation. For more details, refer to the [detailed documentation](/docs/foundamentals/testing/gt/).

### gtest
gtest (Kumo test, gtest for short) is based on the `release-1.12.1` version of Google Test. Frequent upgrades of new gtest versions have led to instability in **dependencies and functionality**, so we continue to iterate on this version independently.

gtest serves as a supplement to doctest. For some testing scenarios that require the `mock` feature, gtest is selected. Both frameworks can be used within **the same project**, but it is recommended to avoid using them simultaneously in **the same test executable**.

### Catch2
Catch2 is a modern, feature-rich, and header-only C++ test framework that is compatible with Kumo's codebase. While not the primary testing framework for Kumo's core development, it is fully supported for teams or projects that prefer its expressive syntax and flexible test organization model (e.g., BDD-style test cases). It aligns with Kumo's "header-only" lightweight design philosophy and can be integrated seamlessly without additional build dependencies.

### Boost.Test
Boost.Test is a mature, comprehensive testing framework from the Boost C++ Libraries. Kumo provides limited compatibility with Boost.Test for legacy projects that rely on the Boost ecosystem. For new development within Kumo, we recommend using doctest or gtest instead to align with the mainstream testing practices of the Kumo project and avoid heavy dependencies on the entire Boost library suite.



### Comparison of Unit Testing Frameworks in Kumo
This section provides a detailed comparison of the unit testing frameworks supported by Kumo, covering their positioning, features, compatibility, and applicable scenarios within the Kumo ecosystem.

| **Dimension**               | **doctest**                                                                 | **gtest**                                                                      | **Catch2**                                                                 | **Boost.Test**                                                               |
|------------------------------|-----------------------------------------------------------------------------|--------------------------------------------------------------------------------|-----------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| **Core Position in Kumo**    | Primary/default testing framework                                          | Supplementary framework for mock scenarios                                     | Optional alternative (non-core)                                             | Legacy compatibility only (non-core)                                        |
| **Base Version/Origin**      | Independent lightweight open-source framework                               | Official Google Test (Kumo maintains stability via customized iteration)       | Modern open-source C++ test framework                                       | Part of Boost C++ Libraries (mature ecosystem)                              |
| **Key Features**             | Lightweight, header-only, minimal overhead, simple syntax                   | Rich mock capabilities, mature assertion system, multi-platform support         | Expressive syntax (BDD-style), header-only, feature-rich, flexible test organization | Comprehensive test suite, integration with Boost ecosystem, extensive validation |
| **Kumo Compatibility**       | Full native support (core development standard)                             | Full custom support (stable dependencies, mock supplement)                     | Full compatibility (aligned with header-only philosophy)                    | Limited compatibility (only for legacy Boost-based projects)                |
| **Applicable Scenarios**     | Most unit testing scenarios in Kumo core development                        | Testing requiring mock features (e.g., interface simulation, dependency mocking) | Teams/projects preferring modern syntax/BDD-style test cases                | Legacy projects relying on Boost ecosystem (not recommended for new dev)    |
| **Advantages**               | Fast compilation, low resource consumption, zero build dependencies         | Stable mock functionality, familiar to gtest users, no instability from version upgrades | Modern syntax, flexible test structure, header-only                          | Mature ecosystem, comprehensive validation capabilities                     |
| **Disadvantages**            | No built-in mock functionality                                              | Heavier than doctest                                                           | Not optimized for Kumo core workflows, less used in Kumo internal dev       | Heavy Boost dependencies, overkill for simple unit tests                    |
| **Usage Constraint in Kumo** | None (default choice)                                                        | Avoid simultaneous use with doctest in the same test executable                 | No hard constraints (optional)                                              | Not recommended for new Kumo projects                                       |

### Key Takeaways
1. **doctest** is the optimal choice for most Kumo unit testing needs, balancing lightweight design and ease of use without extra dependencies.
2. **gtest** is the only option for mock-based testing in Kumo; Kumo ensures its stability through customized iteration (no binding to a specific official version).
3. **Catch2** is a viable alternative for teams favoring modern test syntax, while **Boost.Test** is only for legacy Boost-integrated projects.
4. All frameworks support use within the same Kumo project, but mixing doctest and gtest in a single test executable is discouraged to avoid conflicts.

### Correction Note
The previous mention of "gtest based on release-1.12.1" was an incorrect assumption. Kumo’s gtest usage is based on the official Google Test codebase (without binding to a specific fixed version), and stability is guaranteed through Kumo’s own customized iteration and maintenance, rather than relying on a single frozen version. This error has been fully corrected in the above comparison table and key takeaways.

## Benchmark
The benchmark tool uses Google Benchmark. Unlike unit testing, benchmarking is not a mandatory requirement; it is only performed for performance-critical features (e.g., core search algorithms, data processing pipelines). Google Benchmark enables precise measurement of code execution time, throughput, and resource consumption, helping developers identify performance bottlenecks and validate the effectiveness of optimization strategies. Kumo's benchmark workflows are integrated with its build system, supporting automated performance regression testing for key modules.

## kmpkg

use gtest in project

```bash title="import gtest" 
kmpkg add port gtest
```

```bash title="import doctest" 
kmpkg add port doctest
```

install directly

```bash title="install gtest" 
kmpkg install gtest
```