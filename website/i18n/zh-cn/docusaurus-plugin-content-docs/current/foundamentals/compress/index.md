# 压缩与解压缩

## I. 压缩算法概览

下表对主流压缩算法的核心特性进行了对比，包括压缩比、速度、核心原理及适用场景，便于快速评估算法特性：

| 算法               | 核心原理                            | 压缩比 (低 → 高) | 压缩速度 (快 → 慢) | 解压速度 (快 → 慢) | 核心特点                                     |
| ---------------- | ------------------------------- | ----------- | ------------ | ------------ | ---------------------------------------- |
| LZO              | 基于字典的无损 Lempel-Ziv 压缩           | 低           | 极快           | 极快           | 纯 C 实现，无专利，超低内存占用，适合嵌入式/实时场景             |
| LZ4              | LZ77 变体 + 哈希表匹配                 | 低-中         | 极快           | 极快           | 工业级高速压缩，压缩比略优于 LZO，广泛用于 KV 存储和实时数据压缩     |
| Snappy           | LZ77 + 哈希查找                     | 低-中         | 极快           | 极快           | Google 开发，优化大数据，速度与压缩比平衡，无压缩等级选项         |
| zlib             | DEFLATE（LZ77 + Huffman 编码）      | 中           | 中            | 快            | 高标准化和兼容性，gzip 基于其核心实现                    |
| gzip             | zlib + 文件头校验                    | 中           | 中            | 快            | 实际为 zlib 封装，适合文件压缩，常与 tar (tar.gz) 配合使用  |
| Zstd (Zstandard) | LZ77 + 熵编码 + 字典预训练              | 中-高         | 快            | 快            | Facebook 开发，次世代算法，可调压缩等级 (1–22)，兼顾速度与压缩比 |
| bzip2            | Burrows-Wheeler 变换 + Huffman 编码 | 高           | 慢            | 中            | 压缩比高但速度慢，适合静态大文件，尤其是文本数据                 |

> 关键说明：gzip 并非独立算法，而是 zlib 的文件级封装（增加文件头、校验等）。工程实践中，zlib 常用于内存数据压缩，gzip 常用于文件压缩。

---

## II. 场景选型

### 2.1 KV 存储集成（核心需求：低延迟、高吞吐）

**首选 LZ4 与 Snappy**，核心原因：

* 极快的解压速度（微秒级延迟），符合 KV 存储“读写低延迟”核心需求；
* 内存占用低，避免压缩/解压时占用过多内存降低 KV 缓存命中率；
* 配置简单、集成成本低，适合嵌入 KV 引擎（RocksDB/LevelDB 原生支持 LZ4/Snappy）。

> 补充：如需略高压缩比且性能影响可接受，可选择 Zstd（等级 1–3），避免使用高等级 (> 10) 导致延迟波动。

### 2.2 大文件压缩（核心需求：高压缩比、节省存储）

推荐优先顺序：

1. **Zstd（等级 10–19）**：压缩比和速度兼顾，比 zlib 压缩比高 10–20%，速度快 50%；目前大文件压缩首选。
2. **gzip/zlib**：兼容性极佳，几乎所有系统原生支持，适合跨平台文件传输（如 tar.gz）。
3. **bzip2**：仅在“压缩比优先于速度”场景使用（静态文本或归档文件）。
4. **LZ4（等级 9）**：适用于需快速解压的大文件（视频素材、日志归档），解压速度比 bzip2 快 10 倍，压缩比略低。

### 2.3 其他场景建议

| 扩展场景           | 推荐算法       | 核心原因                  |
| -------------- | ---------- | --------------------- |
| 嵌入式/资源受限设备     | LZO、LZ4    | 内存占用 < 1MB，纯 C 实现，无依赖 |
| 网络传输（如 RPC 数据） | Zstd（等级 3） | 压缩比优于 LZ4，延迟可控        |
| 日志压缩（实时写入）     | LZ4、Snappy | 非阻塞写入，解压速度快，方便查询      |

---

## III. 工程集成（C++ 示例）

### 3.1 通用集成步骤

1. **依赖安装（Linux）**：

```bash
# LZ4
sudo apt install liblz4-dev  # Debian/Ubuntu
sudo yum install lz4-devel   # CentOS/RHEL

# Zstd
sudo apt install libzstd-dev
sudo yum install libzstd-devel

# Snappy
sudo apt install libsnappy-dev
sudo yum install snappy-devel

# zlib/gzip（多数系统已预装）
sudo apt install zlib1g-dev
```

2. **kmpkg 集成**：

```bash title="kmpkg integrate"
kmpkg install lz4
kmpkg install zlib
kmpkg install zstd
kmpkg install snappy
kmpkg install bzip2
kmpkg install lzo
```

参考集成文档：

* [zlib 集成](../../integration/zlib.md)
* [lz4 集成](../../integration/lz4.md)
* [zstd 集成](../../integration/zstd.md)
* [snappy 集成](../../integration/snappy.md)
* [bzip2 集成](../../integration/bzip2.md)
* [lzo 集成](../../integration/lzo.md)

3. **编译与链接**：
   在 `CMakeLists.txt` 中添加链接依赖，例如：

```cmake
# LZ4 示例
find_package(LZ4 REQUIRED)
include_directories(${LZ4_INCLUDE_DIRS})
target_link_libraries(your_project ${LZ4_LIBRARIES})

# Zstd 示例
find_package(ZSTD REQUIRED)
target_link_libraries(your_project ${ZSTD_LIBRARIES})
```

4. **核心封装思路**：
   统一封装压缩/解压接口，屏蔽不同算法的 API 差异：

```cpp
#include <string>

// 压缩接口
bool compress(const std::string& input, std::string& output, const std::string& algo);
// 解压接口
bool decompress(const std::string& input, std::string& output, const std::string& algo);
```

### 3.2 集成注意事项

* **内存管理**：压缩/解压前预估输出缓冲区大小（各算法提供估算函数，如 `LZ4_compressBound`），避免内存溢出；
* **等级配置**：Zstd 与 zlib 支持压缩等级，默认选“平衡等级”（Zstd=3，zlib=6），高等级仅用于离线压缩；
* **流式处理**：大文件压缩使用流式 API（如 zlib 的 `z_stream`，Zstd 的 `ZSTD_CStream`），避免一次性加载全文件。

---

## IV. 使用示例（C++ 可直接运行）

### 4.1 LZ4（KV 存储首选）

```cpp
#include <lz4.h>
#include <string>
#include <iostream>

// LZ4 压缩
bool lz4_compress(const std::string& input, std::string& output) {
    int input_size = input.size();
    int max_output_size = LZ4_compressBound(input_size);
    output.resize(max_output_size);
    int compressed_size = LZ4_compress_default(input.data(), output.data(), input_size, max_output_size);
    if (compressed_size <= 0) return false;
    output.resize(compressed_size);
    return true;
}

// LZ4 解压
bool lz4_decompress(const std::string& input, std::string& output, int original_size) {
    output.resize(original_size);
    int decompressed_size = LZ4_decompress_safe(input.data(), output.data(), input.size(), original_size);
    return decompressed_size == original_size;
}

// 测试
int main() {
    std::string data = "Hello LZ4! This is a test for KV storage compression.";
    std::string compressed, decompressed;
    if (lz4_compress(data, compressed)) {
        std::cout << "LZ4 before: " << data.size() << ", after: " << compressed.size() << "\n";
        if (lz4_decompress(compressed, decompressed, data.size())) {
            std::cout << "Decompressed: " << decompressed << "\n";
        }
    }
    return 0;
}
```

### 4.2 Zstd（大文件/平衡场景首选）

```cpp
#include <zstd.h>
#include <string>
#include <iostream>

bool zstd_compress(const std::string& input, std::string& output, int level = 3) {
    size_t max_output_size = ZSTD_compressBound(input.size());
    output.resize(max_output_size);
    size_t compressed_size = ZSTD_compress(output.data(), max_output_size, input.data(), input.size(), level);
    if (ZSTD_isError(compressed_size)) return false;
    output.resize(compressed_size);
    return true;
}

bool zstd_decompress(const std::string& input, std::string& output) {
    unsigned long long original_size = ZSTD_getFrameContentSize(input.data(), input.size());
    if (original_size == ZSTD_CONTENTSIZE_UNKNOWN || original_size == ZSTD_CONTENTSIZE_ERROR) return false;
    output.resize(original_size);
    size_t decompressed_size = ZSTD_decompress(output.data(), original_size, input.data(), input.size());
    return !ZSTD_isError(decompressed_size);
}

int main() {
    std::string data = "Hello Zstd! This is a test for large file compression.";
    std::string compressed, decompressed;
    if (zstd_compress(data, compressed)) {
        std::cout << "Zstd before: " << data.size() << ", after: " << compressed.size() << "\n";
        if (zstd_decompress(compressed, decompressed)) {
            std::cout << "Decompressed: " << decompressed << "\n";
        }
    }
    return 0;
}
```

### 4.3 zlib/gzip（通用文件压缩）

```cpp
#include <zlib.h>
#include <string>
#include <iostream>
#include <cstring>

// 压缩
bool zlib_compress(const std::string& input, std::string& output, int level = Z_DEFAULT_COMPRESSION) {
    z_stream zs;
    memset(&zs, 0, sizeof(zs));
    if (deflateInit(&zs, level) != Z_OK) return false;
    zs.next_in = (Bytef*)input.data();
    zs.avail_in = input.size();
    char buffer[4096];
    int ret;
    do {
        zs.next_out = (Bytef*)buffer;
        zs.avail_out = sizeof(buffer);
        ret = deflate(&zs, Z_FINISH);
        if (output.size() < zs.total_out) output.append(buffer, zs.total_out - output.size());
    } while (ret == Z_OK);
    deflateEnd(&zs);
    return ret == Z_STREAM_END;
}

// 解压
bool zlib_decompress(const std::string& input, std::string& output) {
    z_stream zs;
    memset(&zs, 0, sizeof(zs));
    if (inflateInit(&zs) != Z_OK) return false;
    zs.next_in = (Bytef*)input.data();
    zs.avail_in = input.size();
    char buffer[4096];
    int ret;
    do {
        zs.next_out = (Bytef*)buffer;
        zs.avail_out = sizeof(buffer);
        ret = inflate(&zs, 0);
        if (output.size() < zs.total_out) output.append(buffer, zs.total_out - output.size());
    } while (ret == Z_OK);
    inflateEnd(&zs);
    return ret == Z_STREAM_END;
}

int main() {
    std::string data = "Hello zlib/gzip! This is a test for general file compression.";
    std::string compressed, decompressed;
    if (zlib_compress(data, compressed)) {
        std::cout << "zlib before: " << data.size() << ", after: " << compressed.size() << "\n";
        if (zlib_decompress(compressed, decompressed)) {
            std::cout << "Decompressed: " << decompressed << "\n";
        }
    }
    return 0;
}
```

### 4.4 Snappy（大数据/低延迟）

```cpp
#include <snappy.h>
#include <string>
#include <iostream>

bool snappy_compress(const std::string& input, std::string& output) {
    snappy::Compress(input.data(), input.size(), &output);
    return true;
}

bool snappy_decompress(const std::string& input, std::string& output) {
    return snappy::Uncompress(input.data(), input.size(), &output);
}

int main() {
    std::string data = "Hello Snappy! This is a test for big data compression.";
    std::string compressed, decompressed;
    snappy_compress(data, compressed);
    std::cout << "Snappy before: " << data.size() << ", after: " << compressed.size() << "\n";
    if (snappy_decompress(compressed, decompressed)) {
        std::cout << "Decompressed: " << decompressed << "\n";
    }
    return 0;
}
```

### 4.5 bzip2（高压缩比/静态文件）

```cpp
#include <bzlib.h>
#include <string>
#include <iostream>
#include <cstring>

bool bzip2_compress(const std::string& input, std::string& output, int blockSize100k = 9) {
    bz_stream bzs;
    memset(&bzs, 0, sizeof(bzs));
    if (BZ2_bzCompressInit(&bzs, blockSize100k, 0, 0) != BZ_OK) return false;
    bzs.next_in = (char*)input.data();
    bzs.avail_in = input.size();
    char buffer[4096];
    int ret;
    do {
        bzs.next_out = buffer;
        bzs.avail_out = sizeof(buffer);
        ret = BZ2_bzCompress(&bzs, BZ_FINISH);
        if (output.size() < bzs.total_out_lo32) output.append(buffer, bzs.total_out_lo32 - output.size());
    } while (ret == BZ_RUN_OK);
    BZ2_bzCompressEnd(&bzs);
    return ret == BZ_STREAM_END;
}

bool bzip2_decompress(const std::string& input, std::string& output) {
    bz_stream bzs;
    memset(&bzs, 0, sizeof(bzs));
    if (BZ2_bzDecompressInit(&bzs, 0, 0) != BZ_OK) return false;
    bzs.next_in = (char*)input.data();
    bzs.avail_in = input.size();
    char buffer[4096];
    int ret;
    do {
        bzs.next_out = buffer;
        bzs.avail_out = sizeof(buffer);
        ret = BZ2_bzDecompress(&bzs);
        if (output.size() < bzs.total_out_lo32) output.append(buffer, bzs.total_out_lo32 - output.size());
    } while (ret == BZ_RUN_OK);
    BZ2_bzDecompressEnd(&bzs);
    return ret == BZ_STREAM_END;
}

int main() {
    std::string data = "Hello bzip2! This is a test for high compression ratio static files.";
    std::string compressed, decompressed;
    if (bzip2_compress(data, compressed)) {
        std::cout << "bzip2 before: " << data.size() << ", after: " << compressed.size() << "\n";
        if (bzip2_decompress(compressed, decompressed)) {
            std::cout << "Decompressed: " << decompressed << "\n";
        }
    }
    return 0;
}
```

### 4.6 LZO（嵌入式/资源受限）

```cpp
#include <lzo/lzo1x.h>
#include <string>
#include <iostream>
#include <cstring>

static bool lzo_inited = false;
void lzo_init_once() {
    if (!lzo_inited) {
        lzo_init();
        lzo_inited = true;
    }
}

bool lzo_compress(const std::string& input, std::string& output) {
    lzo_init_once();
    lzo_uint input_size = input.size();
    lzo_uint max_output_size = input_size + input_size / 16 + 64 + 3;
    output.resize(max_output_size);
    lzo_uint compressed_size;
    lzo_voidp wrkmem = lzo_malloc(LZO1X_1_MEM_COMPRESS);
    int ret = lzo1x_1_compress((const lzo_bytep)input.data(), input_size, (lzo_bytep)output.data(), &compressed_size, wrkmem);
    lzo_free(wrkmem);
    if (ret != LZO_E_OK) return false;
    output.resize(compressed_size);
    return true;
}

bool lzo_decompress(const std::string& input, std::string& output, int original_size) {
    lzo_init_once();
    output.resize(original_size);
    lzo_uint decompressed_size = original_size;
    int ret = lzo1x_decompress((const lzo_bytep)input.data(), input.size(), (lzo_bytep)output.data(), &decompressed_size, NULL);
    return ret == LZO_E_OK && decompressed_size == original_size;
}

int main() {
    std::string data = "Hello LZO! This is a test for embedded device compression.";
    std::string compressed, decompressed;
    if (lzo_compress(data, compressed)) {
        std::cout << "LZO before: " << data.size() << ", after
```

## V. 总结

### 核心要点

1. **核心算法选择**：

    * **速度优先**：LZ4 / Snappy
    * **最大压缩比**：bzip2
    * **平衡方案**：Zstd
    * **兼容性优先**：zlib / gzip

2. **场景实现**：

    * KV 存储：LZ4 / Snappy
    * 大文件：Zstd / gzip
    * 嵌入式系统：LZO / LZ4

3. **工程集成建议**：

    * 统一压缩/解压接口，屏蔽算法差异
    * 大文件使用流式 API，避免一次性占用过多内存
    * 默认选择“平衡等级”进行压缩，高等级仅用于离线场景

> 所有示例代码均可直接编译运行（需先安装对应依赖）。工程实践中，可将这些示例封装为统一压缩工具类，降低多算法使用成本。

---

## VI. Docusaurus 兼容性关键调整

1. 修正 `>10)` 为 `> 10)`，保证 blockquote 渲染正常
2. 统一代码块语言标识（`bash` / `cmake` / `cpp`）以符合 Docusaurus
3. 对带标题的代码块使用 Docusaurus 支持的语法（例如 `bash title="kmpkg integrate"`）
4. 确保相对路径 (`../../integration/xxx`) 符合文件结构规则
5. 标准化表格格式（列对齐一致，无多余换行），避免渲染错误
6. 列表缩进统一为 4 个空格，符合 Markdown 解析规则
