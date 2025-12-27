# Usage Summary of melon compression Module

## I. Supported Compression Algorithms and Features
The `CodecType` enumeration defines 12 compression algorithms, with core features as follows:

| Algorithm Type | Compression Level Range | Default Level | Special Notes |
|----------------|-------------------------|---------------|---------------|
| `NO_COMPRESSION` | Level 0 only | 0 | No compression applied |
| `LZ4` | 1 (fast), 2 (optimal) | 1 | Max supports 1.9GiB uncompressed data |
| `SNAPPY` | Level 1 only | 1 | Max supports 4GiB uncompressed data |
| `ZLIB` | 0–9 (0 = no compression, 9 = optimal) | 6 | Supports stream compression, no length limit |
| `ZSTD` | 1–19 (1 = fast, 19 = optimal) | 3 | Supports stream compression |
| `ZSTD_FAST` | 1–5 (1 = relatively optimal, 5 = fastest) | 1 | Compatible with ZSTD, faster decompression speed |
| `GZIP` | 0–9 | 6 | Same algorithm as ZLIB, compatible with gzip tool, supports stream compression |
| `BZIP2` | 1–9 | 9 | Supports stream compression, but the `FLUSH` operation does not guarantee full readability |

## II. Core Interfaces and Usage Methods

### 1. Basic Compression/Decompression (`Codec` Class)
- **Create Codec Instance**: Obtain instances via `getCodec(CodecType type, int level)`. Levels support `COMPRESSION_LEVEL_FASTEST` (fastest speed), `COMPRESSION_LEVEL_DEFAULT` (default configuration), and `COMPRESSION_LEVEL_BEST` (optimal compression ratio).
  ```cpp
  auto zstdCodec = melon::compression::getCodec(melon::compression::CodecType::ZSTD);
  auto lz4Codec = melon::compression::getCodec(melon::compression::CodecType::LZ4, melon::compression::COMPRESSION_LEVEL_FASTEST);
  ```

- **Compression Operation**: Supports both `IOBuf` and string input
  ```cpp
  // Compress string
  std::string original = "test data";
  std::string compressed = zstdCodec->compress(original);

  // Compress IOBuf
  auto data = melon::IOBuf::copyBuffer(original);
  std::unique_ptr<melon::IOBuf> compressedBuf = zstdCodec->compress(data.get());
  ```

- **Decompression Operation**: Some algorithms (e.g., LZ4) require specifying the uncompressed length
  ```cpp
  // Decompress string
  std::string decompressed = zstdCodec->uncompress(compressed);

  // Decompress IOBuf (when uncompressed length is required)
  auto decompressedBuf = lz4Codec->uncompress(compressedBuf.get(), original.size());
  ```

### 2. Stream Compression/Decompression (`StreamCodec` Class)
Suitable for chunked processing of large data. Create instances via `getStreamCodec`, with core methods:
- `resetStream()`: Reset the codec state to start a new stream processing task
- `compressStream()`/`uncompressStream()`: Process data in chunks
- Supports `FlushOp` control (`NONE`/`FLUSH`/`END`)

Example:
```cpp
auto streamCodec = melon::compression::getStreamCodec(melon::compression::CodecType::ZLIB);
streamCodec->resetStream(original.size()); // Uncompressed length is known

melon::ByteRange input(reinterpret_cast<const uint8_t*>(original.data()), original.size());
std::vector<uint8_t> outputBuf(original.size() * 2);
melon::MutableByteRange output(outputBuf.data(), outputBuf.size());

// Stream compression
bool done = false;
while (!done) {
  done = streamCodec->compressStream(input, output, melon::compression::StreamCodec::FlushOp::END);
}
```

## III. Key Auxiliary Functions
1. **Auto-Decompression Codec**: `getAutoUncompressionCodec` creates a decoder that automatically identifies multiple algorithms, attempting decompression in sequence
   ```cpp
   auto autoCodec = melon::compression::getAutoUncompressionCodec();
   std::string decompressed = autoCodec->uncompress(unknownCompressedData);
   ```

2. **Algorithm Support Check**: `hasCodec(type)` and `hasStreamCodec(type)` determine whether a specified algorithm is supported

3. **Length-Related Methods**:
   - `maxUncompressedLength()`: Get the maximum supported uncompressed data length for the algorithm
   - `maxCompressedLength(len)`: Estimate the maximum compressed length for input data of length `len`
   - `needsUncompressedLength()`: Check if the decompression operation requires specifying the original data length

## IV. Notes
- Compression levels only affect compression speed and ratio, without impacting decompression compatibility
- Stream processing must follow strict stateful calling sequences (`resetStream` → loop `compressStream`/`uncompressStream` → call `resetStream` again before reuse)
- The `FLUSH` operation of `BZIP2` does not guarantee that the decompressor can read all data, so use it with caution
