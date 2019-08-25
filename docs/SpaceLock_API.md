# SpaceLock API

* [class: SpaceLock](#class-spacelock)
  * [new SpaceLock(key[, options])](#-new-spacelockkey-options)
  * [spaceLock.isFull](#-spacelockisfull)
  * [spaceLock.isLocked](#-spacelockislocked)
  * [spaceLock.spaceSize](#-spacelockspacesize)
  * [spaceLock.checkIn()](#-spacelockcheckin)
  * [spaceLock.checkOut()](#-spacelockcheckout)
  * [spaceLock.doOnce(func)](#-spacelockdooncefunc)
* [class: Ymir](#class-ymir)

## class: SpaceLock
核心類，可以将 SpaceLock 想像為一個容量有限的空間。

如果裡面擠滿了任務，那麼後來者就只能等待裡面的任務出來後，騰出空間才能進入。

### # new SpaceLock(key[, options])
* `key` (string)
* `options` (?object)
  * `spaceSize` (number) 空间的容量。默认为 1。


### # spaceLock.isFull
空間是否達到了可容納的任務數量。

* `Return` (boolean)

### # spaceLock.isLocked
等同於 `spaceLock.isFull`。因為如果「空間是否達到了可容納的任務數量」，將會對空間上鎖。

* `Return` (boolean)

### # spaceLock.spaceSize
空间的可容納的任務數量

* `Return` (number)

### # spaceLock.checkIn()
一個任務簽入空間。

* `Returns` (Promise\<void\>)
  
  以下情況，返回值的狀態將被置為 `fulfilled`：

    * 成功簽入空間。


### # spaceLock.checkOut()
一個任務簽出空間。

### # spaceLock.doOnce(func)
對 [`spaceLock.checkIn()`](#-spacelockcheckin) 和 [`spaceLock.checkOut()`](#-spacelockcheckout) 的封裝。

一個任務，等待簽入 -> 簽入 -> 執行任務 -> 簽出。

* `func` (function) 需要執行的任務函式。
* `Return` (Promise<any>)
  任務函式的執行結果。
  

## class: Ymir
方便快捷的操作 [`SpaceLock`](#class-spacelock) 类。
