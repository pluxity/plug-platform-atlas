var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _IVXMediaWebCodec_instances, _draw_decoder_image_fn, _create_video_decoder_fn, _create_audio_decoder_fn;
import IVXMediaRenderer from "./media_renderer.js";
import IVXMediaQueue from "./media_queue.js";
class IVXMediaWebCodec {
  constructor(env_params, player_name) {
    __privateAdd(this, _IVXMediaWebCodec_instances);
    this.env_params = env_params;
    this.media_info = null;
    this.active_video_index = -1;
    this.active_audio_index = -1;
    this.video_timescale = 9e4;
    this.audio_timescale = 9e4;
    this.rescale_timestamp = 0;
    this.video_decode_config = {};
    this.audio_decode_config = {};
    this.enable_rendering = true;
    this.perform = {
      system: 0,
      stream: 0,
      last: 0,
      play: 0
    };
    this.frame_queue = new IVXMediaQueue("frame", 25);
    this.meta_queue = new IVXMediaQueue("meta", 25);
    this.time_queue = new IVXMediaQueue("time", 25);
    this.fnc_renderer_output = new Function("play_time", "			let opaque = self." + player_name + "; 			if(opaque) { 				let decoder = opaque.media_decoder; 				if(decoder && decoder.renderer ) { 					decoder.renderer.draw(decoder.pendingFrame); 					decoder.pendingFrame = null; 				}} ");
    this.fnc_video_output = new Function("frame", "			let opaque = self." + player_name + "; 			if(!opaque) frame.close(); 			else { 				opaque.media_decoder._on_video_output(frame); 			}");
    this.fnc_video_error = new Function("err", "			let opaque = self." + player_name + "; 			if(opaque) opaque.media_decoder._on_video_error(err)");
    if (env_params.canvas) {
      const renderer_options = { visibleVlmValidCode: env_params.visibleVlmValidCode ? env_params.visibleVlmValidCode : "all" };
      this.renderer = new IVXMediaRenderer("webgl2", env_params.canvas, env_params.pannel, env_params.lang, renderer_options);
    } else this.renderer = null;
    if (env_params.event_box_only) this.set_event_box_only(env_params.event_box_only);
    this.enable_check_video_key_frame = true;
    this.pendingFrame = null;
  }
  release() {
    if (this.frame_queue) {
      this.frame_queue.clear();
      delete this.frame_queue;
      this.frame_queue = null;
    }
    if (this.pendingFrame) this.pendingFrame.close();
    if (this.time_queue) {
      this.time_queue.clear();
      delete this.time_queue;
      this.time_queue = null;
    }
    if (this.renderer) {
      this.renderer.release();
      this.renderer = null;
    }
    console.log("deocde : release");
  }
  set_codec_config(media_info) {
    for (var i = 0; i < media_info.length; i++) {
      if (media_info[i].media_type == "video" && this.active_video_index < 0) {
        this.video_decode_config = {};
        this.active_video_index = i;
        this.video_timescale = media_info[i].timescale;
        if (media_info[i].codec == "avc")
          this.video_decode_config.codec = "avc1." + media_info[i].codec_desc;
        else if (media_info[i].codec == "hevc") {
          this.video_decode_config.codec = "hev1.1.6.L150.B0";
        }
        this.video_decode_config.description = media_info[i].extra_data;
        if (media_info[i].coded_width > 0) this.video_decode_config.codedWidth = media_info[i].coded_width;
        if (media_info[i].coded_height > 0) this.video_decode_config.codedHeight = media_info[i].coded_height;
        if (media_info[i].width > 0) this.video_decode_config.displayAspectWidth = media_info[i].width;
        if (media_info[i].height > 0) this.video_decode_config.displayAspectHeight = media_info[i].height;
        this.video_decode_config.optimizeForLatency = true;
        this.video_decode_config.hardwareAcceleration = "no-preference";
        __privateMethod(this, _IVXMediaWebCodec_instances, _create_video_decoder_fn).call(this, this.video_decode_config);
      } else if (media_info[i].media_type == "audio" && this.active_audio_index < 0)
        ;
    }
  }
  print_hex(data, len) {
    let str = "";
    for (let i = 0; i < len; i++) {
      if (i != 0 && i % 16 == 0) str += "\n";
      if (data[i] < 16) str += "0";
      str += data[i].toString(16) + " ";
    }
    console.log(str);
  }
  set_rendering_enable(enable_hidden) {
    this.enable_rendering = !enable_hidden;
    this.env_params.status("info", "Enable rendering = " + this.enable_rendering, this.env_params.id);
  }
  set_event_box_only(enable) {
    if (this.renderer) this.renderer.set_event_box_only(enable);
  }
  get_play_timestamp() {
    return this.perform.play;
  }
  on_mediaclock(timestamp) {
    __privateMethod(this, _IVXMediaWebCodec_instances, _draw_decoder_image_fn).call(this, this);
  }
  reset_timestamp() {
    this.perform.system = 0;
  }
  clear_meta_data_queue() {
    this.meta_queue.clear();
    this.last_meta = null;
  }
  put_video_frame(frame, meta_obj) {
    if (frame.payload.frame_size == 0) return;
    if (this.video_decoder && this.active_video_index >= 0) {
      let frame_data = frame.payload.frame.slice(0, frame.payload.frame_size);
      let frame_time = Math.trunc(1e6 * (frame.rtp_header.timestamp / this.video_timescale));
      if (this.enable_rendering && meta_obj && (meta_obj.objs && meta_obj.objs.length > 0 || meta_obj.evtzone && meta_obj.evtzone.length > 0)) {
        let meta_data = new Object(meta_obj);
        meta_data.time = frame_time;
        if (!this.meta_queue.push_data(meta_data)) {
          this.meta_queue.clear();
        }
      }
      if (this.enable_check_video_key_frame) {
        if (frame.payload.is_key == false) return;
        else this.enable_check_video_key_frame = false;
      }
      const chunk = new EncodedVideoChunk({ type: frame.payload.is_key ? "key" : "delta", timestamp: frame_time, duration: 0, data: frame_data });
      try {
        this.video_decoder.decode(chunk);
        if (this.enable_rendering) {
          if (!this.time_queue.push_data(frame.play_timestamp)) {
            this.time_queue.clear();
          }
        } else {
          this.time_queue.clear();
        }
      } catch (e) {
        if (this.video_decoder.state == "closed") ;
        console.error("Decoder error : " + e.message);
      }
    }
  }
  put_audio_frame(media_info, frame) {
    if (this.audio_decoder && media_info.channel == 2) {
      let frame_data = frame.payload.frame.slice(0, frame.payload.frame_size);
      const chunk = new EncodedAudioChunk({
        type: "key",
        data: frame_data,
        timestamp: 1e6 * frame.rtp_header.timestamp / this.audio_timescale,
        duration: 0
      });
      try {
        this.audio_decoder.decode(chunk);
      } catch (e) {
        console.log("Audio decoder error : " + e.message);
      }
    }
  }
  _on_video_output(frame) {
    let is_clear = false;
    if (this.enable_rendering) {
      if (!this.frame_queue.push_data(frame)) is_clear = true;
    } else {
      this.perform.system = 0;
      is_clear = true;
    }
    if (is_clear) {
      frame.close();
      this.frame_queue.clear();
      this.time_queue.clear();
      this.meta_queue.clear();
    }
  }
  _on_video_error(err) {
    console.error(err);
    __privateMethod(this, _IVXMediaWebCodec_instances, _create_video_decoder_fn).call(this, this.video_decode_config);
  }
  SetMetaBoxThick(box_thick) {
    if (this.renderer) {
      this.renderer.SetMetaBoxThick(box_thick);
    }
  }
  SetTimeBoxPosition(position) {
    if (this.renderer) {
      this.renderer.SetTimeBoxPosition(position);
    }
  }
  SetDrawTimeBox(draw) {
    if (this.renderer) {
      this.renderer.set_is_draw_time_box(draw);
    }
  }
  SetDrawMetaAll(draw) {
    if (this.renderer && !draw) {
      this.renderer.clear_float_array_all();
    }
  }
  SetDrawMetaBox(draw) {
    this.renderer.set_is_draw_box(draw);
  }
  SetDrawMetaEvtzone(draw) {
    this.renderer.set_is_draw_evtzone(draw);
  }
  fnc_audio_output(frame) {
  }
  fnc_audio_error(e) {
    console.log(e);
  }
}
_IVXMediaWebCodec_instances = new WeakSet();
_draw_decoder_image_fn = function(opaque) {
  if (!opaque || !opaque.frame_queue) {
    return;
  } else if (opaque.frame_queue.get_length() > 20) {
    opaque.frame_queue.clear();
    opaque.meta_queue.clear();
    opaque.time_queue.clear();
    opaque.perform.system = 0;
    return;
  }
  if (!opaque.pendingFrame) {
    var frame = opaque.frame_queue.view_data();
    if (frame) {
      if (opaque.perform.system == 0 || opaque.perform.last > frame.timestamp) {
        opaque.perform.system = performance.now();
        opaque.perform.stream = frame.timestamp;
      }
      opaque.perform.last = frame.timestamp;
      var frame_time = Math.floor((frame.timestamp - opaque.perform.stream) / 1e3);
      var system_time = Math.floor(performance.now() - opaque.perform.system);
      if (frame_time <= system_time) {
        if (system_time - frame_time > 100) {
          opaque.perform.system = 0;
        }
        var meta = opaque.meta_queue.view_data();
        if (meta) {
          if (meta.time > frame_time.timestamp) meta = null;
        }
        if (meta) {
          if (opaque.no_meta_time) opaque.no_meta_time = 0;
          opaque.last_meta = meta = opaque.meta_queue.pop_data();
        } else {
          if (!opaque.no_meta_time) {
            meta = opaque.last_meta;
            opaque.no_meta_time = performance.now();
          } else if (performance.now() - opaque.no_meta_time >= 250) {
            meta = null;
            opaque.last_meta = null;
          } else meta = opaque.last_meta;
        }
        frame = opaque.frame_queue.pop_data();
        var time = opaque.time_queue.pop_data();
        if (opaque.enable_rendering) {
          this.perform.play = time;
          opaque.renderer.draw(frame, meta, time);
        }
        if (meta) {
          var meta_gap = (frame.timestamp - meta.time) / 1e3;
          if (meta_gap > 500 || meta_gap < -500) {
            opaque.frame_queue.clear();
            opaque.meta_queue.clear();
            opaque.time_queue.clear();
            opaque.perform.system = 0;
          }
        }
        frame.close();
        meta = null;
      }
    }
  }
};
_create_video_decoder_fn = function(video_configure) {
  if (this.frame_queue) this.frame_queue.clear();
  if (this.time_queue) this.time_queue.clear();
  if (this.meta_queue) this.meta_queue.clear();
  if (this.video_decoder && this.video_decoder.state != "closed") {
    try {
      this.video_decoder.flush();
      this.video_decoder.close();
    } catch (e) {
      console.log(e);
    }
    delete this.video_decoder;
  }
  this.video_decoder = new VideoDecoder({
    output: this.fnc_video_output,
    error: this.fnc_video_error
  });
  if (video_configure) {
    try {
      this.video_decoder.configure(video_configure);
    } catch (e) {
      this.env_params.status("error", "deocde error[" + e.name + "],[code=" + e.code + ", message=" + e.message + "]", this.env_params.id);
    }
    this.enable_check_video_key_frame = true;
  }
};
_create_audio_decoder_fn = function(audio_decode_config) {
};
export {
  IVXMediaWebCodec as default
};
