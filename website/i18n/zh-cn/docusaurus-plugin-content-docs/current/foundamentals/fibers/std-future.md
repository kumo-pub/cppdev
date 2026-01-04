# `std::future` 详解

`std::future` 是 C++ 异步编程的核心组件（C++11 引入，定义于 `<future>` 头文件）。本文档提供全面、面向实践的解释，涵盖其功能、使用场景及最佳实践，并附增强型代码示例，适用于生产环境。

## 核心功能

`std::future` 是 C++ 标准库中的类模板，用于 **安全访问异步操作的结果**。它充当轻量级句柄，连接异步任务的创建者（例如通过 `std::async`、`std::packaged_task` 或 `std::promise`）和任务的执行结果——返回值或执行期间抛出的异常。

核心设计目标：

* 将任务执行流程与结果获取流程解耦
* 保证结果和异常在多线程间的安全传递
* 提供灵活机制等待任务完成而不阻塞线程过久

## 主要使用场景

### 异步结果获取

`get()` 方法会阻塞调用线程，直到异步任务完成，然后返回任务结果。如果任务抛出异常，`get()` 会在调用线程中重新抛出该异常，实现跨线程的一致错误处理。

### 非阻塞任务状态查询

`wait()` 会阻塞直到任务准备就绪，`wait_for()` 和 `wait_until()` 支持带超时的等待。它们返回 `std::future_status` 枚举，指示任务状态，使调用线程可以在等待期间执行其他操作。

### 生产者-消费者线程同步

结合 `std::promise`，`std::future` 可以实现生产者线程（生成数据或结果）与消费者线程（处理结果）之间的显式同步。这在高性能场景下尤其有用，例如需要手动控制线程生命周期的实时数据处理管道。

## 状态管理

`std::future` 对象管理内部共享状态，可能的状态有三种：

* **Not Ready**：异步任务仍在运行；结果或异常尚不可用。
* **Ready**：任务成功完成；可以通过 `get()` 获取结果。
* **Exceptional**：任务执行期间抛出异常；调用 `get()` 将重新抛出异常。

### 状态转换规则

* `std::future` 的初始状态为 **Not Ready**。
* 一旦任务完成（成功或异常），状态转换为 **Ready** 或 **Exceptional** 并变为不可变。
* 调用 `get()` 后，共享状态被销毁，`std::future` 变为无效。再次调用 `get()` 或 `wait()` 会抛出带错误码 `std::future_errc::no_state` 的 `std::future_error`。

## 使用示例

### `std::async` 基本使用

示例展示强制异步执行、超时状态检查和异常处理，对于线程资源利用率敏感的高性能应用至关重要。

```cpp
#include <iostream>
#include <future>
#include <thread>
#include <chrono>
#include <stdexcept>

int factorial(int n) {
    if (n < 0) {
        throw std::invalid_argument("n must be non-negative");
    }
    int result = 1;
    for (int i = 2; i <= n; ++i) {
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
        result *= i;
    }
    return result;
}

int main() {
    std::future<int> fut = std::async(std::launch::async, factorial, 5);

    std::cout << "主线程：执行其他任务..." << std::endl;
    std::this_thread::sleep_for(std::chrono::milliseconds(200));

    std::future_status status = fut.wait_for(std::chrono::milliseconds(100));
    switch (status) {
        case std::future_status::ready:
            std::cout << "任务提前完成！" << std::endl;
            break;
        case std::future_status::timeout:
            std::cout << "任务仍在运行（超时）！" << std::endl;
            break;
        case std::future_status::deferred:
            std::cout << "任务被延迟执行（在 get() 时运行）！" << std::endl;
            break;
    }

    try {
        int fact_result = fut.get();
        std::cout << "5 的阶乘：" << fact_result << std::endl;
    } catch (const std::invalid_argument& e) {
        std::cerr << "错误: " << e.what() << std::endl;
    }

    return 0;
}
```

### 生产者-消费者模型示例

适用于需要手动控制线程生命周期和结果交付的高性能系统。

```cpp
#include <iostream>
#include <future>
#include <thread>
#include <stdexcept>
#include <chrono>

void produce_data(std::promise<int>& prom) {
    try {
        std::cout << "生产者：生成数据中..." << std::endl;
        std::this_thread::sleep_for(std::chrono::seconds(1));
        
        int data = 42;
        prom.set_value(data);

        // 测试异常传播可取消注释
        // throw std::runtime_error("数据生成失败");
        // prom.set_exception(std::current_exception());
    } catch (...) {
        prom.set_exception(std::current_exception());
    }
}

int main() {
    std::promise<int> data_promise;
    std::future<int> data_future = data_promise.get_future();

    std::thread producer(produce_data, std::ref(data_promise));

    std::cout << "消费者：等待数据..." << std::endl;
    try {
        int result = data_future.get();
        std::cout << "消费者：收到数据：" << result << std::endl;
    } catch (const std::runtime_error& e) {
        std::cerr << "消费者：错误 - " << e.what() << std::endl;
    }

    if (producer.joinable()) {
        producer.join();
    }

    return 0;
}
```

### 多线程共享结果示例

`std::future` 是移动语义（独占所有权），当多个线程需要访问同一异步结果时，需要使用 `std::shared_future`，避免重复任务执行并降低开销。

```cpp
#include <iostream>
#include <future>
#include <thread>
#include <vector>

void process_result(std::shared_future<int> shared_fut, int thread_id) {
    try {
        int result = shared_fut.get();
        std::cout << "线程 " << thread_id << ": 结果 = " << result << std::endl;
    } catch (const std::exception& e) {
        std::cerr << "线程 " << thread_id << ": 错误 - " << e.what() << std::endl;
    }
}

int main() {
    std::promise<int> prom;
    std::shared_future<int> shared_fut = prom.get_future();

    std::vector<std::thread> workers;
    for (int i = 0; i < 3; ++i) {
        workers.emplace_back(process_result, shared_fut, i);
    }

    prom.set_value(99);

    for (auto& t : workers) {
        if (t.joinable()) {
            t.join();
        }
    }

    return 0;
}
```

## 关键特性

### `std::future` 的独占所有权

`std::future` 是 **仅能移动** 的对象——拷贝构造和拷贝赋值被删除。保证共享状态的独占访问，避免竞争条件和重复结果处理。

所有权可以通过 `std::move` 转移，适用于在函数或线程间传递 `std::future` 而不增加拷贝开销。

### 异常传播机制

异步任务中抛出的异常存储在共享状态中，而不是直接在任务线程抛出。调用 `get()` 时，存储的异常将在调用线程中重新抛出，使开发者可用与同步代码相同的 try-catch 机制处理错误。

### 与其他异步工具的兼容性

| 工具                   | 作用                                                       |
| -------------------- | -------------------------------------------------------- |
| `std::async`         | 启动异步任务并自动管理线程；直接返回 `std::future`                         |
| `std::packaged_task` | 将可调用对象封装为可异步执行的任务；`get_future` 方法返回 `std::future` 用于结果获取 |
| `std::promise`       | 手动设置异步操作结果或异常；与 `std::future` 配合实现显式生产者-消费者同步            |

## 注意事项

### 阻塞行为控制

`get()` 会无限阻塞，在高性能应用中可能导致线程饥饿。为避免此问题，应在调用 `get()` 前使用 `wait_for()` 或 `wait_until()` 设置合理超时，让调用线程能够优雅处理超时。

### 延迟执行任务警示

未显式指定启动策略的 `std::async` 可能选择 `std::launch::deferred`，此时任务在调用 `get()` 或 `wait()` 时同步执行，不会创建新线程，可能造成性能瓶颈。需要强制异步执行时，应明确使用 `std::launch::async`。

### 线程安全考虑

* `std::future` 管理的 **共享状态** 是线程安全的；允许多线程并发调用 `wait()`。
* `std::future` 对象自身 **不是线程安全的**；在同一对象上并发调用 `get()` 或 `move()` 会产生未定义行为。多线程访问请使用 `std::shared_future`。

### 资源管理最佳实践

* 始终 join 或 detach 与 `std::promise` 关联的线程，避免资源泄露。
* 避免长时间在容器中存储 `std::future`；调用 `get()` 后对象失效，应丢弃。

## 总结

`std::future` 是 C++ 异步编程的基础工具，实现安全高效的结果获取和线程同步。其主要优势是严格的所有权语义、无缝的异常传播，以及与多种异步工具兼容。

高性能应用的最佳实践：

* 使用显式启动策略的 `std::async`，避免延迟执行带来的意外
* 优先使用 `wait_for()` / `wait_until()` 控制阻塞行为，而非直接调用 `get()`
* 多消费者场景使用 `std::shared_future`，降低开销
* 始终处理异步任务传播的异常
