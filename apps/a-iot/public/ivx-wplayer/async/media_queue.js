class IVXMediaQueue {
  constructor(queue_name, queue_count) {
    this.queue_name = queue_name;
    this.queue_count = queue_count;
    this.length = 0;
    this.head = 0;
    this.tail = 0;
    this.queue_buffer = new ArrayBuffer(this.queue_count);
    this.post_time = 0;
  }
  push_data(val) {
    if (this.head == this.tail && this.length > 0) {
      return false;
    }
    this.queue_buffer[this.head] = val;
    this.head += 1;
    this.length += 1;
    if (this.head >= this.queue_count) this.head = 0;
    if (this.post_time == 0) this.post_time = performance.now();
    else if (performance.now() - this.post_time > 1e3) {
      this.post_time = performance.now();
    }
    return true;
  }
  view_data() {
    if (this.head == this.tail && this.length == 0) {
      return null;
    }
    return this.queue_buffer[this.tail];
  }
  pop_data() {
    var temp;
    if (this.head == this.tail && this.length == 0) {
      return null;
    }
    temp = this.queue_buffer[this.tail];
    this.tail += 1;
    this.length -= 1;
    if (this.tail >= this.queue_count) this.tail = 0;
    return temp;
  }
  get_length() {
    return this.length;
  }
  clear() {
    var frame_data = null;
    for (var i = 0; i < this.queue_count; i++) {
      frame_data = this.pop_data();
      if (frame_data && frame_data.close) {
        frame_data.close();
      } else break;
    }
    this.length = 0;
    this.head = 0;
    this.tail = 0;
  }
}
export {
  IVXMediaQueue as default
};
