
# kthread

* registry: [kmpkgcore](https://github.com/kumose/kmpkgcore)
* type: kumo system both static and shared library.

## install

```bash
kmpkg install kthread
```

## add port

add to project dependency list:

``` bash
kmpkg add port kthread
```

## kmpkg

```json title="kmpkg.json"
{
  "dependencies": [
    "kthread"
  ]
}
```

## cmake find and link

***find kthread package***:

```cmake "title="find"
find_packge(kthread REQUIRED)
```

***link kthread static***:

```bash
kthread::kthread_static
```

***link kthread dynamic***:

```bash
kthread::kthread_shared
```
