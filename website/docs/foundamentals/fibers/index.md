# Fiber Pattern Selection: A Multi-threaded Contention Perspective (Supplemented with Memory Contention Management Costs)
## 1. Selection Background
In high-concurrency service development, **multi-threaded contention** (including CPU contention and memory contention) is a core pain point restricting system performance and stability. Traditional kernel-level threads (pthread) rely on native locking mechanisms, which are prone to lock contention, deadlocks, and cache thrashing in high-contention scenarios. Meanwhile, the management costs of memory contention (shared memory synchronization, stack resource management, and cache coherence maintenance) are often overlooked, yet they directly determine development complexity and runtime performance overhead.

User-level threads (Fiber) have emerged as a key technology to address this issue, thanks to their lightweight scheduling and low context-switching costs. However, mainstream Fiber-related models (N:1 coroutines, M:N kthread, melon Fiber, etc.) exhibit significant differences in **memory contention management mechanisms, resource overhead, and maintenance costs**. This document provides precise selection guidance by analyzing the underlying implementation logic and technical attributes of each model from both CPU and memory contention perspectives.

## 2. Core Architecture and Characteristics of Each Model (Supplemented with Memory Contention Management)
The fundamental differences between these models stem from their underlying architectural designs, which directly determine CPU utilization efficiency, memory contention management costs, and development thresholds. Below is an analysis of each model's core architecture, with a focus on memory contention management details.

### 2.1 N:1 Coroutines (Single-threaded)
The core architecture of N:1 coroutines is **a single kernel thread hosting all user-level coroutines**, with context switching implemented via `ucontext` or `fcontext`, taking only 100-200 nanoseconds per switch.

**CPU Contention Characteristics**: No multi-core CPU contention; all coroutines execute serially without requiring locking mechanisms.

**Memory Contention Management Costs**:
- **Shared Memory**: No multi-core memory contention; only serial read/write operations on local and global variables within coroutines need to be handled, resulting in **extremely low** management costs.
- **Stack Resources**: Each coroutine has an independent user-level stack with flexibly configurable size (usually several KB to tens of KB), offering much lower memory overhead than kernel thread stacks. However, there is a high risk of stack overflow, requiring careful pre-planning of stack sizes.
- **Cache Coherence**: No multi-core cache synchronization overhead in a single-threaded architecture, resulting in extremely high data cache hit rates and no cache thrashing issues.

**Limitations**: Blocking of a single coroutine will stall all coroutines in the thread. Full asynchronous refactoring is required to adapt to blocking scenarios, leading to a sharp increase in code complexity. Suitable only for ultra-simple, IO-bound scenarios with no multi-core requirements.

### 2.2 M:N kthread
The M:N kthread adopts an architecture of **multiple user-level Fibers mapped to a small number of kernel pthread threads**, with pthread resource pools managed by `TaskGroup` and a built-in `work stealing` scheduler for cross-core load balancing.

**CPU Contention Characteristics**: Multi-core CPU contention is balanced through `work stealing` scheduling. Blocked Fibers voluntarily yield their pthread, ensuring high CPU utilization.

**Memory Contention Management Costs**:
- **Shared Memory**: Shared resources across `TaskGroup` instances require synchronization via `butex` (a kthread-specific synchronization primitive). `butex` combines the advantages of spinlocks and condition variables—with minimal spin overhead under low contention and automatic hibernation under high contention—resulting in **moderate** memory contention management costs.
- **Stack Resources**: All Fibers reuse the user-level stack pool of `TaskGroup`, minimizing stack creation/destruction overhead. Dynamic stack expansion is supported for high memory utilization. Attention should be paid to stack pool size configuration to avoid performance degradation caused by pool exhaustion.
- **Cache Coherence**: The `work stealing` scheduler attempts to execute Fibers on the same CPU core (affinity optimization), reducing multi-core cache synchronization overhead. Batch task processing further improves cache locality and mitigates cache thrashing caused by memory contention.

**Limitations**: Requires understanding of underlying concepts such as `TaskGroup`, stack pools, and `butex`, leading to a high development threshold. Must be adapted to the krpc ecosystem. Suitable for high-concurrency, high-contention scenarios.

### 2.3 melon Fiber
The core architecture of melon Fiber is **1:1 mapping + user-level stack reuse**—each Fiber corresponds to an independent kernel pthread thread, with the key optimization being user-level stack reuse to reduce creation/destruction overhead.

**CPU Contention Characteristics**: Multi-core CPU contention relies on kernel scheduling with no Fiber-level load balancing. Blocked Fibers occupy kernel threads.

**Memory Contention Management Costs**:
- **Shared Memory**: Relies entirely on pthread native locks (`mutex`/`condition_variable`) for synchronization. Frequent lock contention occurs in high-contention scenarios, resulting in **high** memory contention management costs. No special optimization mechanisms are provided; lock granularity must be manually designed to avoid deadlocks.
- **Stack Resources**: Stack reuse reduces memory allocation overhead, but each Fiber still corresponds to a kernel-thread-level stack (usually several MB), with much higher memory overhead than the user-level stacks of M:N kthread. Stack management is simple, requiring no attention to underlying details, thus lowering development costs.
- **Cache Coherence**: No affinity optimization; Fiber scheduling depends on the kernel, leading to frequent cross-core execution, cache invalidation, and thrashing. In high-concurrency scenarios, cache issues caused by memory contention significantly amplify performance losses.

**Core Advantages**: Extremely simple API, allowing direct migration of synchronous code with low development and maintenance costs. Suitable for low-contention, concurrency-controlled scenarios.

### 2.4 ExecutionQueue
ExecutionQueue is not a general-purpose Fiber model; its core architecture is a **wait-free asynchronous serial queue**, where a single pthread processes all tasks in the queue serially.

**CPU Contention Characteristics**: No CPU contention; serial execution results in zero multi-core utilization.

**Memory Contention Management Costs**:
- **Shared Memory**: Eliminates memory contention entirely. All tasks read/write shared resources serially without requiring any locking mechanisms, achieving **ultra-low** management costs.
- **Stack Resources**: Reuses the stack of the executing thread with no additional stack overhead. Task data is transmitted via the queue; attention should be paid to queue memory usage to avoid memory overflow.
- **Cache Coherence**: Serial task execution ensures continuous access to shared resources, achieving a near-100% cache hit rate with no cache thrashing. Batch processing further reduces memory access latency.

**Limitations**: No multi-core parallel processing capability. Suitable only as a supplement to other models for solving sub-problems requiring high-contention, ordered execution (e.g., shared resource read/write, batch log persistence).

### 2.5 Mutex+pthread
Mutex+pthread is the most basic concurrency model, relying on pure kernel threads and native locking mechanisms with no user-level scheduling capabilities.

**CPU Contention Characteristics**: Multi-core CPU contention relies on kernel scheduling. Blocked threads occupy kernel resources, resulting in low CPU utilization.

**Memory Contention Management Costs**:
- **Shared Memory**: Relies on coarse-grained locking for synchronization. Severe lock contention occurs in high-contention scenarios, with high risks of deadlocks and priority inversion, leading to **extremely high** memory contention management costs.
- **Stack Resources**: Each thread corresponds to a kernel stack of several MB, resulting in high memory overhead. Stack management is handled by the kernel, requiring no developer intervention.
- **Cache Coherence**: The randomness of kernel scheduling leads to frequent cross-core execution, severe cache invalidation, prominent cache thrashing, and poor memory access performance.

**Applicable Scenarios**: Low-concurrency, simple logic utility programs that do not require performance optimization.

## 3. Comprehensive Comparison of All Models (Added Memory Contention Management Cost Dimension)
The following table provides a horizontal comparison of the models across five core dimensions: **multi-core CPU utilization efficiency**, **memory contention management cost**, **ease of use**, **synchronous code migration cost**, and **typical applicable technical scenarios**. Memory contention management costs are classified into five levels (Extremely Low/Low/Moderate/High/Extremely High), while ease of use is rated on a 5-star scale (★).

| Model | Multi-core CPU Utilization Efficiency | Memory Contention Management Cost | Ease of Use (★) | Synchronous Code Migration Cost | Typical Applicable Technical Scenarios |
|-------|---------------------------------------|-----------------------------------|-----------------|---------------------------------|----------------------------------------|
| N:1 Coroutines | None (single-threaded) | Extremely Low | ★★★★ | Extremely High | Ultra-simple IO-bound services with no multi-core requirements (e.g., small HTTP proxies, lightweight crawlers) |
| M:N kthread | High (work stealing scheduling) | Moderate | ★ | Moderate | High-concurrency, high-contention scenarios (e.g., large-scale search services, real-time data processing platforms) |
| melon Fiber | Moderate (kernel-dependent scheduling) | High | ★★★★★ | Extremely Low | Low-contention, concurrency-controlled scenarios (e.g., approval process backends, data synchronization services) |
| ExecutionQueue | None (serial execution) | Extremely Low | ★★ | Moderate | Sub-problems requiring high-contention, ordered execution (e.g., shared resource read/write, batch log persistence) |
| Mutex+pthread | Moderate (kernel-dependent scheduling) | Extremely High | ★★★ | Low | Low-concurrency, simple logic utility programs (e.g., log collection scripts, configuration verification tools) |

## 4. Precise Selection Recommendations (Incorporating Memory Contention Management Costs)
The core of model selection lies in balancing **CPU contention requirements**, **memory contention intensity**, and **development/maintenance costs**, with the following specific criteria:

### 4.1 Priority Selection: M:N kthread
Choose M:N kthread when the business meets the following criteria:
1. High concurrency and high contention (`QPS × latency` far exceeds the number of CPU cores);
2. Frequent read/write operations on shared memory (e.g., global caches, counters);
3. Performance priority outweighs development costs.

**Core Rationale**: Moderate memory contention management costs. `butex` and `work stealing` balance synchronization efficiency and cache coherence, maximizing multi-core resource utilization. Ideal for core businesses with stringent performance requirements.

### 4.2 Priority Selection: melon Fiber
Choose melon Fiber when the business meets the following criteria:
1. Low contention (low-frequency read/write operations on shared resources, with critical section execution time < 1μs);
2. Controlled concurrency (`QPS × latency` ≤ 2 × number of CPU cores);
3. Development/maintenance cost priority outweighs performance optimization.

**Core Rationale**: High memory contention management costs, but extremely low development threshold. Synchronous code can be directly migrated, making it suitable for rapid deployment scenarios where no investment is required for memory contention optimization.

### 4.3 Priority Selection: ExecutionQueue
Introduce ExecutionQueue as a supplement regardless of the main process model when the business has **sub-modules requiring high-contention, ordered execution**.

**Core Rationale**: Ultra-low memory contention management costs, completely eliminating lock contention and cache thrashing. It is the optimal solution for high-contention memory scenarios.

### 4.4 Priority Selection: N:1 Coroutines
Consider N:1 coroutines **only** when the business is **purely IO-bound with no multi-core requirements**, and the team has mature asynchronous programming capabilities.

**Core Rationale**: Extremely low memory contention management costs, but requires full asynchronous refactoring, making it suitable for extremely limited scenarios.

## 5. Conclusion
Fiber model selection essentially involves balancing **CPU utilization**, **memory contention management**, and **development costs**. Memory contention management cost is an easily overlooked yet critical dimension:
- For high-contention memory scenarios, prioritize the **M:N kthread + ExecutionQueue** combination to balance multi-core parallelism and memory contention optimization;
- For low-contention, rapid deployment scenarios, prioritize **melon Fiber**, trading development efficiency for performance costs;
- For extremely simple scenarios, **N:1 coroutines** or **Mutex+pthread** can be selected without over-engineering.

In practical development, it is recommended to verify selection rationality through **memory contention analysis tools (e.g., cachegrind) + stress testing**, focusing on matching technical attributes with business requirements.

## 6. Final Summary

The ultimate value of Fiber technology is to resolve the contradiction between asynchronous execution and sequential code writing—it allows developers to implement asynchronous task scheduling using synchronous code logic, avoiding code fragmentation caused by callback hell and reducing the mental burden of multi-threaded programming. However, in C++ development scenarios, **memory lifecycle management is always the most critical aspect of any concurrent model**. Issues such as dangling pointers, invalid references, contention conflicts, and memory leaks directly lead to program crashes or performance degradation, and their importance far outweighs that of scheduling models themselves. Regardless of the Fiber model chosen, two core issues must be clarified first: first, **memory contention state management**—identifying shared vs. exclusive memory and selecting appropriate synchronization primitives for shared memory (e.g., kthread's butex, ExecutionQueue's serialization, melon Fiber's pthread locks) to avoid unnecessary lock contention or cache thrashing; second, **memory lifecycle management**—defining the creator, holder, and releaser of memory resources, and planning memory release timing based on Fiber stack characteristics (e.g., M:N kthread's stack pool reuse, melon Fiber's user-level stack reuse) to prevent memory leaks or dangling references caused by Fiber scheduling switches. In summary, Fiber model selection is not a simple choice of technical framework, but a comprehensive decision based on **memory management strategy + concurrent scheduling strategy** tailored to specific business scenarios. Only by clarifying memory-related issues can the performance and development efficiency advantages of Fiber technology be truly realized.

