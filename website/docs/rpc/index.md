# RPC Overview

This section provides an overview of RPC frameworks relevant to Kumo systems. The focus is scene-driven selection rather than deep protocol analysis. Each framework is compared along three dimensions: ecosystem & usage scenario, performance, and integration & operational complexity.

The goal is to guide quick selection based on practical business or backend needs. High QPS claims should be treated cautiously, as typical server CPU load constraints and single-thread limitations make extreme values unrealistic.

---

## Ecosystem & Usage Scenarios

| Framework | Layer | Strengths | Typical Usage / Scenario |
|-----------|-------|-----------|------------------------|
| gRPC      | Business | Multi-language ecosystem, widely adopted | Business layer, pipeline orchestration, multi-language clients |
| httplib   | Business | Header-only, lightweight | Quick prototyping, temporary services, validation |
| brpc      | Backend | Mature, high throughput, Raft-compatible | Backend services, Raft consensus, high reliability |
| krpc      | Backend | Kumo-enhanced brpc, better ops | Internal backend preferred choice |
| ACL       | Backend | High-quality C++ library | High-performance backend services, IO-intensive tasks |
| Thrift    | Legacy | Moderate performance | Legacy interop, declining ecosystem |
| Seastar   | Extreme IO | NUMA-aware, very high throughput | Extreme IO services, dedicated ops required |

Business layer favors gRPC for multi-language integration and pipeline control. Backend layer favors brpc/krpc for throughput and operational reliability. Extreme IO frameworks like Seastar require specialized environments.

---

## Performance Metrics

| Framework | Typical QPS per Server | CPU Load | Notes |
|-----------|----------------------|----------|-------|
| gRPC      | 3k–10k               | 30–50%  | Suitable for orchestrating pipelines; practical business throughput |
| httplib   | `<1k`                  | `<20%`    | Lightweight testing or prototyping only |
| brpc      | 10k–30k              | 40–70%  | Required for Raft; operational expertise needed |
| krpc      | 10k–30k              | 40–70%  | Optimized brpc with better internal ops |
| ACL       | 10k–30k              | 40–70%  | High-quality backend C++ services |
| Thrift    | 5k–15k               | 40–60%  | Legacy support only |
| Seastar   | 50k–100k+ (pure IO)  | 50–70%  | Extreme IO; dedicated ops required |

CPU load above 70% is risky. Most claimed "million QPS" values are theoretical. Business layer rarely exceeds 10k QPS per server; backend systems may target 30k QPS. Extreme IO scenarios require dedicated operational expertise.

---

## Integration & Operational Complexity

| Framework | Language Support | Integration Difficulty | Ops Notes |
|-----------|----------------|----------------------|-----------|
| gRPC      | Multi-language | Medium | Multiple C++ libraries; kmpkg simplifies integration |
| httplib   | C++            | Very Low | Header-only, trivial integration |
| brpc      | C++            | Medium | Requires ops expertise; Raft-compatible |
| krpc      | C++            | Medium | Kumo-enhanced brpc; easier internal ops |
| ACL       | C++            | Low-Medium | High-quality library; not ideal for multi-language business layer |
| Thrift    | Multi-language | Medium | Ecosystem declining; mainly for legacy support |
| Seastar   | C++            | High | Complex ops; NUMA-aware; dedicated environment; high cost |

Business layer frameworks prioritize ecosystem integration over raw throughput. Backend frameworks must handle high CPU and throughput reliably. Extreme IO frameworks like Seastar require professional operations for protocol stack management.

---

## Summary

The RPC ecosystem is diverse. Selection should be scene-driven:

- Business layer: Use gRPC for multi-language clients and pipeline orchestration. Lightweight alternatives like httplib are only for rapid prototyping.
- Backend layer: brpc or krpc provides high throughput, mature operations, and Raft compatibility. ACL can be used for high-performance C++ backend tasks.
- Extreme IO: Seastar is suitable only for specialized, high-throughput IO services and requires dedicated operational expertise.

Because of ecosystem limitations, implementation choices are relatively fixed. For special requirements, custom implementations may be necessary.
