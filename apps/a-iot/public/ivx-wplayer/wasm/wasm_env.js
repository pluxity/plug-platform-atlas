var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
const _IVX_WASM_LOADER = class _IVX_WASM_LOADER {
  constructor(init_params) {
    WebAssembly.instantiateStreaming(fetch(init_params.url), _IVX_WASM_LOADER.config()).then((mod) => {
      this.wasm = mod.instance;
      this.wasm_mem_offset = _IVX_WASM_LOADER.STACK_START_POINT;
      this.wasm_export = this.wasm.exports;
      this.wasm_memory = this.wasm_export.memory;
      _IVX_WASM_LOADER.wasm_export_malloc = this.wasm_export.malloc;
      this._initialize_memory(this.wasm_memory);
      console.log("Loaded WebAssembly module" + init_params.url);
    }).catch((e) => {
      console.error("Load failed WebAssembly module : " + e);
    });
  }
  _initialize_memory(wasm_memory) {
    this._heap8 = new Int8Array(wasm_memory.buffer);
    this._heap16 = new Int16Array(wasm_memory.buffer);
    this._heapu8 = new Uint8Array(wasm_memory.buffer);
    this._heapu16 = new Uint16Array(wasm_memory.buffer);
    this._heap32 = new Int32Array(wasm_memory.buffer);
    this._heapu32 = new Uint32Array(wasm_memory.buffer);
    this._heapf32 = new Float32Array(wasm_memory.buffer);
    this._heapf64 = new Float64Array(wasm_memory.buffer);
    this._heap64 = new BigInt64Array(wasm_memory.buffer);
    this._heapu64 = new BigUint64Array(wasm_memory.buffer);
  }
  _change_heap_memory() {
    if (_IVX_WASM_LOADER.heap_memory != this.wasm_memory) {
      _IVX_WASM_LOADER.HEAP8 = this._heap8;
      _IVX_WASM_LOADER.HEAPU8 = this._heapu8;
      _IVX_WASM_LOADER.HEAP16 = this._heap16;
      _IVX_WASM_LOADER.HEAPU16 = this._heapu16;
      _IVX_WASM_LOADER.HEAP32 = this._heap32;
      _IVX_WASM_LOADER.HEAPU32 = this._heapu32;
      _IVX_WASM_LOADER.HEAPF32 = this._heapf32;
      _IVX_WASM_LOADER.HEAPF64 = this._heapf64;
      _IVX_WASM_LOADER.HEAP64 = this._heap64;
      _IVX_WASM_LOADER.HEAPU64 = this._heapu64;
      _IVX_WASM_LOADER.heap_memory = this.wasm_memory;
      _IVX_WASM_LOADER.wasm_export_malloc = this.wasm_export.malloc;
    }
  }
  convert_arg(value, type) {
    var start_offset = -1;
    if (this.wasm_export) this._change_heap_memory();
    if (!value) return null;
    switch (type) {
      case "u8":
        start_offset = this.wasm_mem_offset;
        _IVX_WASM_LOADER.HEAPU8.set(value, start_offset);
        this.wasm_mem_offset += value.byteLength;
        break;
    }
    return start_offset;
  }
  convert_result(value, type = "u8", max = -1) {
    switch (type) {
      case "u8":
        return new Uint8Array(_IVX_WASM_LOADER.HEAPU8.slice(value));
      case "str":
        let max_size = max;
        if (max == -1) max_size = _IVX_WASM_LOADER.lengthBytes(this._heapu8.slice(value));
        return _IVX_WASM_LOADER.UTF8ToString(value, max_size);
    }
    return value;
  }
  run_interface(if_name, ...args) {
    var result;
    this.wasm_mem_offset = _IVX_WASM_LOADER.STACK_START_POINT;
    if (this.wasm_export) {
      this._change_heap_memory();
      result = this.wasm_export[if_name](...args);
    }
    return result;
  }
  static _convertI32PairToI53Checked(lo, hi) {
    _IVX_WASM_LOADER._assert(lo == lo >>> 0 || lo == (lo | 0));
    _IVX_WASM_LOADER._assert(hi === (hi | 0));
    return hi + 2097152 >>> 0 < 4194305 - !!lo ? (lo >>> 0) + hi * 4294967296 : NaN;
  }
  static _assert(condition, text) {
    if (!condition) {
      _IVX_WASM_LOADER._abort_s("Assertion failed" + (text ? ": " + text : ""));
    }
  }
  static ___assert_fail(condition, filename, line, func) {
    if (!condition) {
      _IVX_WASM_LOADER._abort_s("Assertion failed : " + filename + "(" + line + ") : " + func);
    }
  }
  static warnOnce(text) {
    warnOnce.shown || (warnOnce.shown = {});
    if (!warnOnce.shown[text]) {
      warnOnce.shown[text] = 1;
      if (ENVIRONMENT_IS_NODE) text = "warning: " + text;
      _IVX_WASM_LOADER.stderr(text);
    }
  }
  static __localtime_js(time_low, time_high, tmPtr) {
    var time = _IVX_WASM_LOADER._convertI32PairToI53Checked(time_low, time_high);
    var date = new Date(time * 1e3);
    _IVX_WASM_LOADER.HEAP32[tmPtr >> 2] = date.getSeconds();
    _IVX_WASM_LOADER.HEAP32[tmPtr + 4 >> 2] = date.getMinutes();
    _IVX_WASM_LOADER.HEAP32[tmPtr + 8 >> 2] = date.getHours();
    _IVX_WASM_LOADER.HEAP32[tmPtr + 12 >> 2] = date.getDate();
    _IVX_WASM_LOADER.HEAP32[tmPtr + 16 >> 2] = date.getMonth();
    _IVX_WASM_LOADER.HEAP32[tmPtr + 20 >> 2] = date.getFullYear() - 1900;
    _IVX_WASM_LOADER.HEAP32[tmPtr + 24 >> 2] = date.getDay();
    var yday = _IVX_WASM_LOADER.ydayFromDate(date) | 0;
    _IVX_WASM_LOADER.HEAP32[tmPtr + 28 >> 2] = yday;
    _IVX_WASM_LOADER.HEAP32[tmPtr + 36 >> 2] = -(date.getTimezoneOffset() * 60);
    var start = new Date(date.getFullYear(), 0, 1);
    var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
    var winterOffset = start.getTimezoneOffset();
    var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset)) | 0;
    _IVX_WASM_LOADER.HEAP32[tmPtr + 32 >> 2] = dst;
  }
  static UTF8ToString(ptr, maxBytesToRead) {
    _IVX_WASM_LOADER._assert(typeof ptr == "number", `UTF8ToString expects a number (got ${typeof ptr})`);
    return ptr ? _IVX_WASM_LOADER._UTF8ArrayToString(_IVX_WASM_LOADER.HEAPU8, ptr, maxBytesToRead) : "";
  }
  static _UTF8ArrayToString(heapOrArray, idx, maxBytesToRead) {
    var endIdx = idx + maxBytesToRead;
    var endPtr = idx;
    while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;
    if (endPtr - idx > 16 && heapOrArray.buffer && _IVX_WASM_LOADER.utf8_decoder) {
      return _IVX_WASM_LOADER.utf8_decoder.decode(heapOrArray.subarray(idx, endPtr));
    }
    var str = "";
    while (idx < endPtr) {
      var u0 = heapOrArray[idx++];
      if (!(u0 & 128)) {
        str += String.fromCharCode(u0);
        continue;
      }
      var u1 = heapOrArray[idx++] & 63;
      if ((u0 & 224) == 192) {
        str += String.fromCharCode((u0 & 31) << 6 | u1);
        continue;
      }
      var u2 = heapOrArray[idx++] & 63;
      if ((u0 & 240) == 224) {
        u0 = (u0 & 15) << 12 | u1 << 6 | u2;
      } else {
        if ((u0 & 248) != 240) _IVX_WASM_LOADER.warnOnce("Invalid UTF-8 leading byte " + ptrToString(u0) + " encountered when deserializing a UTF-8 string in wasm memory to a JS string!");
        u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heapOrArray[idx++] & 63;
      }
      if (u0 < 65536) {
        str += String.fromCharCode(u0);
      } else {
        var ch = u0 - 65536;
        str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
      }
    }
    return str;
  }
  static abortOnCannotGrowMemory(requestedSize) {
    _IVX_WASM_LOADER._abort_s(`Cannot enlarge memory arrays to size ${requestedSize} bytes (OOM). Either (1) compile with -sINITIAL_MEMORY=X with X higher than the current value ${HEAP8.length}, (2) compile with -sALLOW_MEMORY_GROWTH which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with -sABORTING_MALLOC=0`);
  }
  static _printChar(stream, curr) {
    var buffer = _IVX_WASM_LOADER.print_char_buffers[stream];
    _IVX_WASM_LOADER._assert(buffer);
    if (curr === 0 || curr === 10) {
      (stream === 1 ? _IVX_WASM_LOADER.stdout : _IVX_WASM_LOADER.stderr)(_IVX_WASM_LOADER._UTF8ArrayToString(buffer, 0));
      buffer.length = 0;
    } else {
      buffer.push(curr);
    }
  }
  static _emscripten_resize_heap(requestedSize) {
    _IVX_WASM_LOADER.HEAPU8.length;
    requestedSize >>>= 0;
    _IVX_WASM_LOADER._abortOnCannotGrowMemory(requestedSize);
  }
  static _emscripten_memcpy_js(dest, src, num) {
    _IVX_WASM_LOADER.HEAPU8.copyWithin(dest, src, src + num);
  }
  static _abort_s(what) {
    var e = new WebAssembly.RuntimeError(what);
    console.log(what + "," + e);
    throw e;
  }
  static _abort() {
    _IVX_WASM_LOADER._abort_s("native code called abort()");
  }
  static _fd_close(fd) {
    _IVX_WASM_LOADER._abort_s("fd_close called without SYSCALLS_REQUIRE_FILESYSTEM");
  }
  static _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
    _IVX_WASM_LOADER._convertI32PairToI53Checked(offset_low, offset_high);
    return 70;
  }
  static _fd_write(fd, iov, iovcnt, pnum, a, b, c) {
    var num = 0;
    for (var i = 0; i < iovcnt; i++) {
      var ptr = _IVX_WASM_LOADER.HEAPU32[iov >> 2];
      var len = _IVX_WASM_LOADER.HEAPU32[iov + 4 >> 2];
      iov += 8;
      for (var j = 0; j < len; j++) {
        _IVX_WASM_LOADER._printChar(fd, _IVX_WASM_LOADER.HEAPU8[ptr + j]);
      }
      num += len;
    }
    _IVX_WASM_LOADER.HEAPU32[pnum >> 2] = num;
    return 0;
  }
  static lengthBytes(str) {
    var len = 0;
    while (true) {
      len += 1;
      if (str[len] == 0) break;
    }
    return len;
  }
  static lengthBytesUTF8(str) {
    var len = 0;
    for (var i = 0; i < str.length; ++i) {
      var c = str.charCodeAt(i);
      if (c <= 127) len++;
      else if (c <= 2047) len += 2;
      else if (c >= 55296 && c <= 57343) {
        len += 4;
        ++i;
      } else len += 3;
    }
    return len;
  }
  static stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
    _IVX_WASM_LOADER._assert(typeof str === "string", `stringToUTF8Array expects a string (got ${typeof str})`);
    if (!(maxBytesToWrite > 0)) return 0;
    var startIdx = outIdx;
    var endIdx = outIdx + maxBytesToWrite - 1;
    for (var i = 0; i < str.length; ++i) {
      var u = str.charCodeAt(i);
      if (u >= 55296 && u <= 57343) {
        var u1 = str.charCodeAt(++i);
        u = 65536 + ((u & 1023) << 10) | u1 & 1023;
      }
      if (u <= 127) {
        if (outIdx >= endIdx) break;
        heap[outIdx++] = u;
      } else if (u <= 2047) {
        if (outIdx + 1 >= endIdx) break;
        heap[outIdx++] = 192 | u >> 6;
        heap[outIdx++] = 128 | u & 63;
      } else if (u <= 65535) {
        if (outIdx + 2 >= endIdx) break;
        heap[outIdx++] = 224 | u >> 12;
        heap[outIdx++] = 128 | u >> 6 & 63;
        heap[outIdx++] = 128 | u & 63;
      } else {
        if (outIdx + 3 >= endIdx) break;
        if (u > 1114111) _IVX_WASM_LOADER.warnOnce("Invalid Unicode code point " + ptrToString(u) + " encountered when serializing a JS string to a UTF-8 string in wasm memory! (Valid unicode code points should be in range 0-0x10FFFF).");
        heap[outIdx++] = 240 | u >> 18;
        heap[outIdx++] = 128 | u >> 12 & 63;
        heap[outIdx++] = 128 | u >> 6 & 63;
        heap[outIdx++] = 128 | u & 63;
      }
    }
    heap[outIdx] = 0;
    return outIdx - startIdx;
  }
  static stringToUTF8(str, outPtr, maxBytesToWrite) {
    _IVX_WASM_LOADER._assert(typeof maxBytesToWrite == "number", "stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!");
    return _IVX_WASM_LOADER.stringToUTF8Array(str, _IVX_WASM_LOADER.HEAPU8, outPtr, maxBytesToWrite);
  }
  static stringToNewUTF8(str) {
    var size = _IVX_WASM_LOADER.lengthBytesUTF8(str) + 1;
    var ret = _IVX_WASM_LOADER.wasm_export_malloc ? _IVX_WASM_LOADER.wasm_export_malloc(size) : null;
    console.log("malloc ptr : " + ret + ", size : " + size);
    if (ret) _IVX_WASM_LOADER.stringToUTF8(str, ret, size);
    return ret;
  }
  static ydayFromDate(date) {
    var leap = _IVX_WASM_LOADER.isLeapYear(date.getFullYear());
    var monthDaysCumulative = leap ? _IVX_WASM_LOADER.MONTH_DAYS_LEAP_CUMULATIVE : _IVX_WASM_LOADER.MONTH_DAYS_REGULAR_CUMULATIVE;
    var yday = monthDaysCumulative[date.getMonth()] + date.getDate() - 1;
    return yday;
  }
  static __tzset_js(timezone, daylight, tzname) {
    var currentYear = (/* @__PURE__ */ new Date()).getFullYear();
    var winter = new Date(currentYear, 0, 1);
    var summer = new Date(currentYear, 6, 1);
    var winterOffset = winter.getTimezoneOffset();
    var summerOffset = summer.getTimezoneOffset();
    var stdTimezoneOffset = Math.max(winterOffset, summerOffset);
    _IVX_WASM_LOADER.HEAPU32[timezone >> 2] = stdTimezoneOffset * 60;
    _IVX_WASM_LOADER.HEAP32[daylight >> 2] = Number(winterOffset != summerOffset);
    function extractZone(date) {
      var match = date.toTimeString().match(/\(([A-Za-z ]+)\)$/);
      return match ? match[1] : "GMT";
    }
    var winterName = extractZone(winter);
    var summerName = extractZone(summer);
    var winterNamePtr = _IVX_WASM_LOADER.stringToNewUTF8(winterName);
    var summerNamePtr = _IVX_WASM_LOADER.stringToNewUTF8(summerName);
    if (summerOffset < winterOffset) {
      _IVX_WASM_LOADER.HEAPU32[tzname >> 2] = winterNamePtr;
      _IVX_WASM_LOADER.HEAPU32[tzname + 4 >> 2] = summerNamePtr;
    } else {
      _IVX_WASM_LOADER.HEAPU32[tzname >> 2] = summerNamePtr;
      _IVX_WASM_LOADER.HEAPU32[tzname + 4 >> 2] = winterNamePtr;
    }
  }
  static _clock_time_get(clk_id, ignored_precision, ptime) {
    if (!(clk_id >= 0 && clk_id <= 3)) {
      return 28;
    }
    var now;
    if (clk_id === 0) {
      now = _IVX_WASM_LOADER._emscripten_date_now();
    } else {
      now = _IVX_WASM_LOADER._emscripten_get_now();
    }
    var nsec = Math.round(now * 1e3 * 1e3);
    _IVX_WASM_LOADER.HEAP64[ptime >> 3] = BigInt(nsec);
    return 0;
  }
  static config() {
    var wasm_imports = {
      __assert_fail: _IVX_WASM_LOADER.___assert_fail,
      _abort_js: _IVX_WASM_LOADER._abort,
      clock_time_get: _IVX_WASM_LOADER._clock_time_get,
      _emscripten_memcpy_js: _IVX_WASM_LOADER._emscripten_memcpy_js,
      _emscripten_get_now_is_monotonic: _IVX_WASM_LOADER.__emscripten_get_now_is_monotonic,
      emscripten_date_now: _IVX_WASM_LOADER._emscripten_date_now,
      emscripten_get_now: _IVX_WASM_LOADER._emscripten_get_now,
      emscripten_memcpy_js: _IVX_WASM_LOADER._emscripten_memcpy_js,
      emscripten_resize_heap: _IVX_WASM_LOADER._emscripten_resize_heap,
      _localtime_js: _IVX_WASM_LOADER.__localtime_js,
      _tzset_js: _IVX_WASM_LOADER.__tzset_js,
      abort: _IVX_WASM_LOADER._abort,
      fd_write: _IVX_WASM_LOADER._fd_write,
      fd_close: _IVX_WASM_LOADER._fd_close,
      fd_seek: _IVX_WASM_LOADER._fd_seek
    };
    var env = {
      env: wasm_imports,
      wasi_snapshot_preview1: wasm_imports
    };
    return env;
  }
};
__publicField(_IVX_WASM_LOADER, "HEAP");
__publicField(_IVX_WASM_LOADER, "HEAP8");
__publicField(_IVX_WASM_LOADER, "HEAPU8");
__publicField(_IVX_WASM_LOADER, "HEAP16");
__publicField(_IVX_WASM_LOADER, "HEAPU16");
__publicField(_IVX_WASM_LOADER, "HEAP32");
__publicField(_IVX_WASM_LOADER, "HEAPU32");
__publicField(_IVX_WASM_LOADER, "HEAPF32");
__publicField(_IVX_WASM_LOADER, "HEAPF64");
__publicField(_IVX_WASM_LOADER, "HEAP64");
__publicField(_IVX_WASM_LOADER, "HEAPU64");
__publicField(_IVX_WASM_LOADER, "wasm_export_malloc");
__publicField(_IVX_WASM_LOADER, "heap_memory", null);
__publicField(_IVX_WASM_LOADER, "print_char_buffers", [null, [], []]);
__publicField(_IVX_WASM_LOADER, "utf8_decoder", typeof TextDecoder != "undefined" ? new TextDecoder("utf8") : void 0);
__publicField(_IVX_WASM_LOADER, "stdout", console.log.bind(console));
__publicField(_IVX_WASM_LOADER, "stderr", console.error.bind(console));
__publicField(_IVX_WASM_LOADER, "STACK_START_POINT", 65536);
__publicField(_IVX_WASM_LOADER, "nowIsMonotonic", 1);
__publicField(_IVX_WASM_LOADER, "__emscripten_get_now_is_monotonic", () => _IVX_WASM_LOADER.nowIsMonotonic);
__publicField(_IVX_WASM_LOADER, "_emscripten_date_now", () => Date.now());
__publicField(_IVX_WASM_LOADER, "_emscripten_get_now", () => performance.now());
__publicField(_IVX_WASM_LOADER, "isLeapYear", (year) => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));
__publicField(_IVX_WASM_LOADER, "MONTH_DAYS_LEAP_CUMULATIVE", [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335]);
__publicField(_IVX_WASM_LOADER, "MONTH_DAYS_REGULAR_CUMULATIVE", [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]);
let IVX_WASM_LOADER = _IVX_WASM_LOADER;
export {
  IVX_WASM_LOADER as default
};
