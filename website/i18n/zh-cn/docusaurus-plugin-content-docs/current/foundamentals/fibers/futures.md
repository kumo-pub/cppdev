# Melon Futures 使用总结

Melon Futures 是 C++ 异步框架，基于 **Promise/Future** 模式，灵感来源于 Twitter 的 Scala Futures，扩展了 C++11 `std::future` 和 `boost::future` 的概念。核心优势在于支持 **回调链式组合**，并可通过执行器控制任务运行位置，避免传统异步 API 的“回调地狱”。

---

## 1. 基本概念

* **Future / SemiFuture**

    * `SemiFuture<T>` 表示尚未完成的异步结果，可转为 `Future<T>` 绑定执行器。
    * 初始状态：未完成

      ```cpp
      fut.isReady() == false;
      fut.value(); // 未完成时抛异常
      ```
    * 完成后：

      ```cpp
      fut.isReady() == true;
      T& val = fut.value();
      ```
    * 支持异常封装：

      ```cpp
      fut.isReady() == true;
      fut.value(); // 如果被异常完成，会重新抛出
      ```

* **Promise**

    * 每个 Future 都对应一个 Promise，用于在未来某个时刻**完成** Future：

      ```cpp
      Promise<int> p;
      SemiFuture<int> f = p.getSemiFuture();
  
      p.setValue(42);  // 完成 Future
      f.value() == 42;
  
      p.setException(std::runtime_error("Fail")); // 用异常完成 Future
      ```

* **setWith**

    * 自动捕获异常的安全方式：

      ```cpp
      Promise<int> p;
      p.setWith([]{
        // 可能抛异常的操作
        return 42;
      });
      ```

---

## 2. 回调与链式组合

* **thenValue / thenTry**

    * `thenValue(fn)`：回调接收 `T&&`，若 Future 异常则跳过
    * `thenTry(fn)`：回调接收 `melon::Try<T>`，封装值或异常

* **thenError**

    * 按异常类型捕获：

      ```cpp
      fut.thenError(melon::tag_t<std::exception>{}, [](const std::exception& e){
          cerr << e.what() << endl;
      });
      ```

* **例子：链式调用**

```cpp
SemiFuture<GetReply> semiFut = mc.future_get("foo");
Future<GetReply> fut1 = std::move(semiFut).via(&executor);

Future<string> fut2 = std::move(fut1).thenValue([](GetReply reply){
    if(reply.result == MemcacheClient::GetReply::Result::FOUND)
        return reply.value;
    throw SomeException("No value");
});

Future<Unit> fut3 = std::move(fut2)
    .thenValue([](string str){ cout << str << endl; })
    .thenTry([](melon::Try<string> t){ cout << t.value() << endl; })
    .thenError(melon::tag_t<std::exception>{}, [](const std::exception& e){ cerr << e.what() << endl; });
```

> `.thenValue` 和 `.thenTry` 避免了传统异步回调的“地狱式嵌套”。

---

## 3. 聚合 Futures

* **collectAll / collectAny / collectN / collectAnyWithoutException**

    * `collectAll(futures)` → 所有 Future 完成后完成
    * `collectAny(futures)` → 任意一个 Future 完成后完成
    * `collectAnyWithoutException(futures)` → 获取一个不抛异常的 Future
* 示例：

```cpp
vector<SemiFuture<GetReply>> futs;
for(auto& key : keys) futs.push_back(mc.future_get(key));

auto all = collectAll(futs.begin(), futs.end());
auto any = collectAny(futs.begin(), futs.end());
auto anyv = collectAnyWithoutException(futs.begin(), futs.end());
```

---

## 4. 执行器与线程控制

* **via(executor)**

    * 将 `SemiFuture` 转为绑定执行器的 `Future`，后续回调在指定执行器上下文运行

```cpp
melon::ThreadedExecutor executor;
SemiFuture<GetReply> semiFut = mc.future_get("foo");
Future<GetReply> fut = std::move(semiFut).via(&executor);
```

* **线程安全注意事项**

    * `thenValue` 和 `setValue` 可以跨线程调用
    * 没有绑定执行器的 Future 回调线程不可预期
    * 建议使用 `.via` 控制回调线程：

```cpp
std::move(aFuture)
  .thenValue(x)
  .via(e1).thenValue(y1).thenValue(y2)
  .via(e2).thenValue(z);
```

* 回调顺序保证，但执行线程依赖 `.via` 的执行器。

---

## 5. 安全实践

1. **优先使用 SemiFuture + via** 控制回调执行线程。
2. **链式调用**避免 callback hell。
3. **使用 setWith** 捕获异常，保证 Promise 完成。
4. **聚合 Futures** 实现批量异步处理。
5. **异常处理**可通过 `thenError` 或 `thenTry` 进行精确控制。

---

总结：Melon Futures 提供了现代 C++ 异步编程的基础设施，结合执行器、回调链式组合和聚合操作，可实现安全、可读、可维护的异步代码，避免了传统回调风格下的复杂性。
