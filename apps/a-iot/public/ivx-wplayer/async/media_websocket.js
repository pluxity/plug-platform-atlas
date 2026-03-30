var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _IVXMediaWebSocket_instances, _init_internal_instance_fn, _mediaclock_callback_fn, _set_mediaclock_generator_fn, _clear_internal_instance_fn, _internal_stop_media_fn, get_websocket_url_fn, call_websocket_fn, connect_websocket_fn, websock_on_open_fn, websock_on_close_fn, websock_on_error_fn, websock_on_message_fn, _request_result_command_proc_fn, _on_keepalive_timer_fn, _fill_media_info_fn, _fill_extradata_fn;
import IVXMediaNegotiator from "./media_negotiator.js";
import IVXMediaWebCodec from "./media_webcodec.js";
import IVXMediaRTP from "./media_rtp.js";
var gen_mediaclock_opaque = null;
class IVXMediaWebSocket {
  constructor(init_params, env_params) {
    __privateAdd(this, _IVXMediaWebSocket_instances);
    if (init_params && env_params)
      __privateMethod(this, _IVXMediaWebSocket_instances, _init_internal_instance_fn).call(this, init_params, env_params);
  }
  release_websocket() {
    __privateMethod(this, _IVXMediaWebSocket_instances, _clear_internal_instance_fn).call(this);
  }
  reinitialize(init_params, env_params) {
    console.error("Error : reinitialize player params");
    __privateMethod(this, _IVXMediaWebSocket_instances, _clear_internal_instance_fn).call(this);
    __privateMethod(this, _IVXMediaWebSocket_instances, _init_internal_instance_fn).call(this, init_params, env_params);
  }
  get play_status() {
    return this.play_stat;
  }
  StopMedia() {
    this.play_stat = "stop";
    if (this.websock && this.websock.readyState == WebSocket.OPEN) {
      __privateMethod(this, _IVXMediaWebSocket_instances, _internal_stop_media_fn).call(this, false);
    } else {
      setTimeout(() => {
        __privateMethod(this, _IVXMediaWebSocket_instances, _internal_stop_media_fn).call(this, false);
      }, 5e3);
    }
  }
  StartMedia() {
    try {
      this.media_clock.status = "start";
      this.play_stat = "start";
      this.env_params.status("info", this.play_stat, this.env_params.id);
      if (this.ivx_index < 0) {
        this.env_params.status("error", "IVX Player instance error : max limit", this.env_params.id);
        return;
      }
      if (!this.websock_url) {
        if (this.init_params.is_secure) this.websock_url = "wss://";
        else this.websock_url = "ws://";
        this.websock_url += this.host;
        __privateMethod(this, _IVXMediaWebSocket_instances, get_websocket_url_fn).call(this);
      } else {
        __privateMethod(this, _IVXMediaWebSocket_instances, connect_websocket_fn).call(this, this.websock_url);
      }
    } catch (e) {
      console.log(e);
      setTimeout(() => {
        this.env_params.worker.close();
      }, 5e3);
      __privateMethod(this, _IVXMediaWebSocket_instances, _clear_internal_instance_fn).call(this);
      this.env_params.status("error", e.message, this.env_params.id);
    }
  }
  PauseMedia() {
    this.env_params.status("info", "pause", this.env_params.id);
    this.negotiator.request_pause_session(this.websock);
    this.play_stat = "pause";
  }
  ResumeMedia() {
    if (this.media_decoder) this.media_decoder.reset_timestamp();
    this.env_params.status("info", "resume", this.env_params.id);
    this.negotiator.request_resume_session(this.websock);
    this.play_stat = "play";
  }
  //seek_time format = YYYYMMDDHHMMSS
  SeekMedia(seek_time) {
    this.seek_status.flag = true;
    this.seek_status.trigger_time = performance.now();
    this.negotiator.request_seek_session(this.websock, seek_time);
  }
  Timeline() {
    this.negotiator.request_timeline_session(this.websock);
  }
  EventTimeline() {
    this.negotiator.request_event_timeline_session(this.websock);
  }
  GetPlayTime() {
    if (this.media_rtp) {
      return this.media_rtp.current_play_time(0);
    }
  }
  SetResizeWindow(width, height) {
    if (this.env_params.canvas) {
      this.env_params.canvas.width = width;
      this.env_params.canvas.height = height;
    }
    if (this.env_params.pannel) {
      this.env_params.pannel.width = width;
      this.env_params.pannel.height = height;
    }
  }
  SetMetaMode(meta_mode) {
    switch (meta_mode) {
      case "none":
        if (this.media_rtp) {
          this.media_rtp.use_sei_meta_data(true);
          this.media_rtp.set_is_draw_box(false);
        }
        if (this.media_decoder) this.media_decoder.set_event_box_only(false);
        break;
      case "event":
        if (this.media_rtp) {
          this.media_rtp.use_sei_meta_data(true);
          this.media_rtp.set_is_draw_box(true);
        }
        if (this.media_decoder) this.media_decoder.set_event_box_only(true);
        break;
      case "all":
        if (this.media_rtp) {
          this.media_rtp.use_sei_meta_data(true);
          this.media_rtp.set_is_draw_box(true);
        }
        if (this.media_decoder) this.media_decoder.set_event_box_only(false);
        break;
    }
  }
  DrawMetaEvtzone(checked_enable) {
    if (this.media_rtp) {
      this.media_rtp.set_is_draw_evtzone(checked_enable);
    }
  }
  get MediaInfo() {
    return this.media_info;
  }
  set_document_hidden(enable_hidden) {
    if (this.media_decoder) {
      this.media_decoder.set_rendering_enable(enable_hidden);
    }
  }
  SetMetaBoxThick(box_thick) {
    if (this.media_decoder) {
      this.media_decoder.SetMetaBoxThick(box_thick);
    }
  }
  SetTimeBoxPosition(position) {
    if (this.media_decoder) {
      this.media_decoder.SetTimeBoxPosition(position);
    }
  }
  SetDrawTimeBox(draw) {
    if (this.media_decoder) {
      this.media_decoder.SetDrawTimeBox(draw);
    }
  }
  SetSpeed(speed_value, direction) {
    this.env_params.status("info", speed_value, this.env_params.id);
    this.negotiator.request_speed_session(this.websock, speed_value, direction);
  }
  SetDirection(direction_mode) {
    this.env_params.status("info", direction_mode, this.env_params.id);
    this.negotiator.request_direction_session(this.websock, direction_mode);
  }
}
_IVXMediaWebSocket_instances = new WeakSet();
_init_internal_instance_fn = function(init_params, env_params) {
  this.init_params = init_params;
  this.env_params = env_params;
  this.use_meta = true;
  if (init_params.stream_mode == "relay") {
    this.host = "";
    this.websock_url = this.init_params.url;
  } else {
    this.host = this.init_params.ip + ":" + this.init_params.port;
    this.websock_url = null;
    this.conn_url = this.init_params.is_secure ? "https://" : "http://";
    this.conn_url += this.host + "/NVR/media_websocket/websock_url";
  }
  this.websock = null;
  this.renderer = null;
  this.keepalive_timer = null;
  this.play_stat = "ready";
  this.seek_status = {
    flag: false,
    trigger_time: 0,
    seek_time: 0
  };
  this.seek_status.trigger_time = 0;
  this.seek_status;
  __privateMethod(this, _IVXMediaWebSocket_instances, _clear_internal_instance_fn).call(this);
  this.player_unique_name = "player_" + this.init_params.session;
  this.generator_name = new Function("self." + this.player_unique_name + "= this");
  this.delete_name = new Function("self." + this.player_unique_name + "= null");
  this.generator_name();
  this.negotiator = new IVXMediaNegotiator(init_params);
  this.media_decoder = new IVXMediaWebCodec(env_params, this.player_unique_name);
  this.media_rtp = new IVXMediaRTP({ decoder: this.media_decoder, use_meta: this.use_meta, time_gen: { callback: __privateMethod(this, _IVXMediaWebSocket_instances, _on_keepalive_timer_fn), opaque: this } });
  this.SetMetaMode(env_params.meta_mode);
  this.DrawMetaEvtzone(env_params.eventzone);
  __privateMethod(this, _IVXMediaWebSocket_instances, _set_mediaclock_generator_fn).call(this);
};
_mediaclock_callback_fn = function(timestamp) {
  var _a;
  if (!gen_mediaclock_opaque) return;
  try {
    if (gen_mediaclock_opaque.websock && gen_mediaclock_opaque.websock.readyState == WebSocket.OPEN) {
      if (gen_mediaclock_opaque.media_decoder) gen_mediaclock_opaque.media_decoder.on_mediaclock(timestamp);
      if (gen_mediaclock_opaque.media_clock.close_time != 0) gen_mediaclock_opaque.media_clock.close_time = 0;
    } else {
      if (gen_mediaclock_opaque.media_clock.close_time == 0) gen_mediaclock_opaque.media_clock.close_time = timestamp;
      else if (timestamp - gen_mediaclock_opaque.media_clock.close_time >= 15e3) {
        console.error("unclosed webplayer worker thread!!");
        try {
          __privateMethod(_a = gen_mediaclock_opaque, _IVXMediaWebSocket_instances, _internal_stop_media_fn).call(_a, true);
          if (gen_mediaclock_opaque.media_clock.id > 0) cancelAnimationFrame(gen_mediaclock_opaque.media_clock.id);
        } catch (e) {
          console.error(e);
          if (gen_mediaclock_opaque.env_params.worker) gen_mediaclock_opaque.env_params.worker.close();
        }
        return;
      }
    }
  } catch (e) {
    console.error(e);
  }
  gen_mediaclock_opaque.media_clock.id = requestAnimationFrame(__privateMethod(gen_mediaclock_opaque, _IVXMediaWebSocket_instances, _mediaclock_callback_fn));
};
_set_mediaclock_generator_fn = function() {
  gen_mediaclock_opaque = this;
  gen_mediaclock_opaque.media_clock = {
    id: 0,
    status: "ready",
    close_time: 0
  };
  gen_mediaclock_opaque.media_clock.id = requestAnimationFrame(__privateMethod(gen_mediaclock_opaque, _IVXMediaWebSocket_instances, _mediaclock_callback_fn));
};
_clear_internal_instance_fn = function() {
  if (this.websock) {
    this.websock.close();
    this.websock = null;
  }
  if (this.negotiator) {
    this.negotiator.release();
    this.negotiator = null;
  }
  if (this.media_rtp) {
    this.media_rtp.release();
    this.media_rtp = null;
  }
  if (this.media_decoder) {
    this.media_decoder.release();
    this.media_decoder = null;
  }
};
_internal_stop_media_fn = function(force_close_flag) {
  try {
    this.play_stat = "stop";
    __privateMethod(this, _IVXMediaWebSocket_instances, _clear_internal_instance_fn).call(this);
    if (this.media_info) {
      for (var i = 0; i < this.media_info.length; i++) {
        if (this.media_info.extra_data) {
          this.media_info.extra_data = null;
        }
      }
      this.media_info = null;
    }
    this.delete_name();
    if (this.env_params.status) {
      this.env_params.status("info", "stop", this.env_params.id);
    }
  } catch (e) {
    console.error(e);
  }
  if (force_close_flag == false) {
    if (this.env_params.worker) {
      this.worker_timeout_id = setTimeout(() => {
        console.log("_internal_stop_media : timeout : env = " + this.env_params + ", worker = " + this.env_params.worker);
        this.env_params.worker.close();
      }, 5e3);
    }
  } else {
    console.log("_internal_stop_media : internal force close : env = " + this.env_params + ", worker = " + this.env_params.worker);
    this.env_params.worker.close();
  }
};
get_websocket_url_fn = function() {
  var httpRequest = new XMLHttpRequest();
  httpRequest.conn_url = this.conn_url;
  httpRequest.opaque = this;
  httpRequest.onerror = function(e) {
    this.opaque.env_params.status("error", "HTTP request connection progress failed", this.opaque.env_params.id);
  };
  httpRequest.onreadystatechange = function() {
    var _a;
    switch (this.readyState) {
      case XMLHttpRequest.DONE:
        if (this.status >= 200 && this.status < 400) {
          var json_data = JSON.parse(this.responseText);
          __privateMethod(_a = this.opaque, _IVXMediaWebSocket_instances, call_websocket_fn).call(_a, json_data);
        } else
          this.opaque.env_params.status("error", this.statusText + "(" + this.status + ")", this.opaque.env_params.id);
        delete this;
        break;
    }
  };
  try {
    httpRequest.open("GET", this.conn_url, true);
  } catch (e) {
    this.env_params.status("error", e.message, this.env_params.id);
    this.StopMedia();
    return;
  }
  httpRequest.setRequestHeader("AUTH-KEY", this.init_params.auth_key);
  if (this.init_params.access_key)
    httpRequest.setRequestHeader("ACCESS-KEY", this.init_params.access_key);
  httpRequest.send();
};
call_websocket_fn = function(websock_json) {
  console.log("websock url ==> " + this.websock_url + websock_json.websockurl);
  __privateMethod(this, _IVXMediaWebSocket_instances, connect_websocket_fn).call(this, this.websock_url + websock_json.websockurl);
};
connect_websocket_fn = function(websock_url) {
  if (this.websock) {
    this.websock.close(1e3, "websocket close");
    delete this.websock;
  }
  this.websock = new WebSocket(websock_url);
  this.websock.opaque = this;
  this.websock.timeout = 5e3;
  this.websock.binaryType = "arraybuffer";
  this.websock.onopen = __privateMethod(this, _IVXMediaWebSocket_instances, websock_on_open_fn);
  this.websock.onclose = __privateMethod(this, _IVXMediaWebSocket_instances, websock_on_close_fn);
  this.websock.onerror = __privateMethod(this, _IVXMediaWebSocket_instances, websock_on_error_fn);
  this.websock.onmessage = __privateMethod(this, _IVXMediaWebSocket_instances, websock_on_message_fn);
};
websock_on_open_fn = function() {
  if (this.opaque.init_params.stream_mode == "relay" && this.opaque.init_params.session) {
    this.opaque.negotiator.request_describe_session(this);
  } else {
    this.opaque.negotiator.request_create_session(this);
  }
};
websock_on_close_fn = function(e) {
  if (this.opaque.error_mark)
    console.log("close, websocket close clean = " + e.wasClean + ", code = " + e.code + ", reason = " + e.reason);
  this.opaque.release_websocket();
  this.opaque.env_params.status("eos", "close websocket", this.opaque.env_params.id);
  if (this.opaque.env_params.worker) {
    if (this.worker_timeout_id) clearTimeout(this.worker_timeout_id);
    this.opaque.env_params.worker.close();
  }
};
websock_on_error_fn = function(e) {
  this.opaque.error_mark = true;
  this.opaque.StopMedia();
  console.error(e);
  this.opaque.env_params.status("error", "websock_on_error : " + e, this.opaque.env_params.id);
};
websock_on_message_fn = function(msg) {
  var _a;
  try {
    if (typeof msg.data == "object") {
      if (!this.opaque.media_rtp) {
        console.log("on message media_rtp is nullptr");
      } else this.opaque.media_rtp.put_rtp_data(this.opaque.media_info, msg.data);
    } else {
      var command2 = JSON.parse(msg.data);
      if (command2 && command2.data) {
        if (command2.command == "result") __privateMethod(_a = this.opaque, _IVXMediaWebSocket_instances, _request_result_command_proc_fn).call(_a, command2, this, this.opaque);
      } else this.opaque.env_params.status("error", "Json message format error", this.opaque.env_params.id);
    }
  } catch (e) {
    console.error(e);
  }
};
_request_result_command_proc_fn = function(json_command, web_sock, opaque) {
  var _a;
  if (json_command.data.code != 0) {
    opaque.env_params.status("warn", "json : loc = " + json_command.data.type + ", code = " + json_command.data.code + ", msg = " + json_command.data.message, opaque.env_params.id);
    return;
  }
  switch (json_command.data.type) {
    case IVXMediaNegotiator.CREATE_SESSION:
      JSON.stringify(json_command.data);
      opaque.negotiator.session_key = json_command.data.session;
      opaque.negotiator.request_describe_session(web_sock);
      break;
    case IVXMediaNegotiator.DESCRIBE_SESSION:
      JSON.stringify(json_command.data);
      __privateMethod(_a = opaque, _IVXMediaWebSocket_instances, _fill_media_info_fn).call(_a, json_command.data.data.track);
      opaque.media_decoder.set_codec_config(opaque.media_info);
      opaque.negotiator.request_playctrl_session(web_sock);
      break;
    case IVXMediaNegotiator.PLAYCTRL_SESSION:
      JSON.stringify(json_command.data);
      if (json_command.data.data.mode == "play" || json_command.data.data.mode == "resume")
        opaque.env_params.status("info", "play", opaque.env_params.id);
      else if (json_command.data.data.mode == "timeline" || json_command.data.data.mode == "event_timeline") {
        opaque.env_params.status(json_command.data.data.mode, json_command.data.data.append, opaque.env_params.id);
      } else if (json_command.data.data.mode == "seek") {
        opaque.seek_status.seek_time = new Date(json_command.data.data.playtime2).getTime();
        console.log("response SEEK Result : " + json_command.data.data.playtime2 + ", " + json_command.data.data.playtime + "&& " + opaque.seek_status.seek_time);
      }
      break;
    default:
      opaque.env_params.status("error", "Unknown result command : " + command.data.type, opaque.env_params.id);
      break;
  }
};
_on_keepalive_timer_fn = function(current_time, opaque) {
  var play_time = opaque.media_decoder.get_play_timestamp();
  if (!opaque.keepalive_post_time) opaque.keepalive_post_time = current_time;
  if (current_time - opaque.keepalive_post_time >= 5e3) {
    opaque.negotiator.request_keepalive_session(opaque.websock);
    opaque.keepalive_post_time = current_time;
  }
  if (opaque.media_decoder) {
    if (opaque.seek_status.flag == true) {
      if (performance.now() - opaque.seek_status.trigger_time >= 1e3) {
        opaque.seek_status.flag = false;
      } else if (opaque.seek_status.seek_time > 0 && (play_time > opaque.seek_status.seek_time - 1e3 && play_time < opaque.seek_status.seek_time + 1e3)) {
        opaque.seek_status.flag = false;
      }
      if (opaque.seek_status.flag == false) {
        opaque.seek_status.trigger_time = 0;
        opaque.seek_status.seek_time = 0;
      }
    }
    if (opaque.seek_status.flag == false)
      opaque.env_params.status("time", play_time, opaque.env_params.id);
  }
};
_fill_media_info_fn = function(track) {
  if (this.media_info) delete this.media_info;
  this.media_info = new Array(track.length);
  for (var i = 0; i < track.length; i++) {
    this.media_info[i] = track[i];
    if (this.media_info[i].media_type == "video") {
      if (this.media_info[i].codec == "avc") {
        if (this.media_info[i].extradata) {
          let extra_binary = atob(this.media_info[i].extradata);
          __privateMethod(this, _IVXMediaWebSocket_instances, _fill_extradata_fn).call(this, this.media_info[i], extra_binary);
        }
      } else if (this.media_info[i].codec == "hevc") {
        let extra_binary = atob(this.media_info[i].extradata);
        __privateMethod(this, _IVXMediaWebSocket_instances, _fill_extradata_fn).call(this, this.media_info[i], extra_binary);
      }
    }
  }
};
_fill_extradata_fn = function(media_info, extradata) {
  media_info.extra_data = new Uint8Array(new ArrayBuffer(extradata.length));
  for (let index = 0; index < extradata.length; index++) {
    media_info.extra_data[index] = extradata.charCodeAt(index);
  }
};
export {
  IVXMediaWebSocket as default
};
