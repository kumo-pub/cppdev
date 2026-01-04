# melon 压缩模块使用总结

## I. 支持的压缩算法及特性

`CodecType` 枚举定义了 12 种压缩算法，其核心特性如下表：

| 算法类型             | 压缩等级范围               | 默认等级 | 特殊说明                        |
| ---------------- | -------------------- | ---- | --------------------------- |
| `NO_COMPRESSION` | 仅 0 级                | 0    | 不进行压缩                       |
| `LZ4`            | 1（快速）、2（最优）          | 1    | 最大支持 1.9GiB 未压缩数据           |
| `SNAPPY`         | 仅 1 级                | 1    | 最大支持 4GiB 未压缩数据             |
| `ZLIB`           | 0–9（0 = 不压缩，9 = 最优）  | 6    | 支持流式压缩，无长度限制                |
| `ZSTD`           | 1–19（1 = 快速，19 = 最优） | 3    | 支持流式压缩                      |
| `ZSTD_FAST`      | 1–5（1 = 相对最优，5 = 最快） | 1    | 与 ZSTD 兼容，解压速度更快            |
| `GZIP`           | 0–9                  | 6    | 算法同 ZLIB，兼容 gzip 工具，支持流式压缩  |
| `BZIP2`          | 1–9                  | 9    | 支持流式压缩，但 `FLUSH` 操作不保证可完整读取 |

---

## II. 核心接口与使用方式

### 1. 基础压缩/解压 (`Codec` 类)

* **创建 Codec 实例**：通过 `getCodec(CodecType type, int level)` 获取实例。等级支持：

    * `COMPRESSION_LEVEL_FASTEST`（最快速）
    * `COMPRESSION_LEVEL_DEFAULT`（默认配置）
    * `COMPRESSION_LEVEL_BEST`（最佳压缩比）

```cpp
auto zstdCodec = melon::compression::getCodec(melon::compression::CodecType::ZSTD);
auto lz4Codec = melon::compression::getCodec(melon::compression::CodecType::LZ4, melon::compression::COMPRESSION_LEVEL_FASTEST);
```

* **压缩操作**：支持 `IOBuf` 与字符串输入

```cpp
// 压缩字符串
std::string original = "test data";
std::string compressed = zstdCodec->compress(original);

// 压缩 IOBuf
auto data = melon::IOBuf::copyBuffer(original);
std::unique_ptr<melon::IOBuf> compressedBuf = zstdCodec->compress(data.get());
```

* **解压操作**：部分算法（如 LZ4）需指定原始长度

```cpp
// 解压字符串
std::string decompressed = zstdCodec->uncompress(compressed);

// 解压 IOBuf（当需指定原始长度）
auto decompressedBuf = lz4Codec->uncompress(compressedBuf.get(), original.size());
```

---

### 2. 流式压缩/解压 (`StreamCodec` 类)

适用于大数据分块处理。通过 `getStreamCodec` 获取实例，核心方法：

* `resetStream()`：重置流状态，开始新任务
* `compressStream()` / `uncompressStream()`：分块处理数据
* 支持 `FlushOp` 控制（`NONE` / `FLUSH` / `END`）

示例：

```cpp
auto streamCodec = melon::compression::getStreamCodec(melon::compression::CodecType::ZLIB);
streamCodec->resetStream(original.size()); // 已知原始长度

melon::ByteRange input(reinterpret_cast<const uint8_t*>(original.data()), original.size());
std::vector<uint8_t> outputBuf(original.size() * 2);
melon::MutableByteRange output(outputBuf.data(), outputBuf.size());

// 流式压缩
bool done = false;
while (!done) {
  done = streamCodec->compressStream(input, output, melon::compression::StreamCodec::FlushOp::END);
}
```

---

## III. 关键辅助函数

1. **自动解压 Codec**：`getAutoUncompressionCodec` 可自动识别多种算法，按顺序尝试解压

```cpp
auto autoCodec = melon::compression::getAutoUncompressionCodec();
std::string decompressed = autoCodec->uncompress(unknownCompressedData);
```

2. **算法支持检查**：`hasCodec(type)` 和 `hasStreamCodec(type)` 判断指定算法是否支持

3. **长度相关方法**：

* `maxUncompressedLength()`：获取算法支持的最大未压缩长度
* `maxCompressedLength(len)`：估算输入长度 `len` 的最大压缩长度
* `needsUncompressedLength()`：检查解压是否需要指定原始长度

---

## IV. 注意事项

* 压缩等级仅影响压缩速度和比率，不影响解压兼容性
* 流式处理必须严格遵循状态调用顺序：

  ```
  resetStream → 循环 compressStream/uncompressStream → 再次 resetStream 后可重复使用
  ```
* BZIP2 的 `FLUSH` 操作不保证解压器可读取全部数据，应谨慎使用
