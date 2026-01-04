---
sidebar_position: 1
---

# 概览

Kumo Search C++ 核心开发库是一套面向 **服务端开发** 的基础组件库，专为满足后端系统在 **高性能、稳定性和可维护性** 方面的核心需求而设计。整个库生态通过 **kmpkg 包管理器** 统一管理，能够简化依赖管理、版本控制与部署流程，大幅降低构建和维护服务端项目的复杂性。

每个集成的组件——无论是第三方依赖还是自研模块——均选用业内公认、成熟可靠的库。所有组件都经过 **万台级集群的长期生产验证**，在高并发、高可用的服务端场景下表现出稳健可靠的特性，为构建 Kumo Search 相关的服务端应用提供了坚实的技术基础。

Kumo Search C++ 核心开发库是面向服务端的基础工具包，由 kmpkg 管理。所有集成库均为业内认可的成熟组件，并在万台级生产集群中验证，能够为后端开发提供生产级可靠性。

---

## 基础模块

* [性能测试与单元测试](/docs/foundamentals/testing/) — 测试与基准框架
* [日志](/docs/foundamentals/log/) — 日志模块，[turbo](https://github.com/kumose/turbo)
* [时间](/docs/foundamentals/time/) — 时间模块，[turbo](https://github.com/kumose/turbo)
* [状态](/docs/category/standardized-errors-and-error-return-values) — 标准化错误和返回值处理模块，[turbo](https://github.com/kumose/turbo)
* [字符串](/docs/foundamentals/strings/) — 字符串操作模块，[turbo](https://github.com/kumose/turbo)

---

## Kumo 扩展

* [kmdo](https://github.com/kumose/kmdo) — Kumo Search 工具套件，详见 [文档](https://pub.kumose.cc/kmdo)
* [kmpkg](https://github.com/kumose/kmpkg) — Kumo 开发包管理器，详见 [文档](https://pub.kumose.cc/kmpkg)
* [kmcmake](https://github.com/kumose/kmcmake) — Kumo CMake 构建系统模板，详见 [文档](https://pub.kumose.cc/kmcmake)


