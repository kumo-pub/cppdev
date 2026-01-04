
# openssl

* registry: [kmpkgcore](https://github.com/kumose/kmpkgcore)
* type: kumo system both static and shared library.

## install

```bash
kmpkg install openssl
```

## add port

add to project dependency list:

``` bash
kmpkg add port openssl
```

## kmpkg

```json title="kmpkg.json"
{
  "dependencies": [
    "openssl"
  ]
}
```

## cmake find and link

***find openssl package***:

```cmake "title="find"
find_package(OpenSSL REQUIRED)
```

***link openssl static***:

```bash
${OPENSSL_SSL_LIBRARY}
${OPENSSL_CRYPTO_LIBRARY}
```
