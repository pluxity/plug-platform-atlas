var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _IVXMediaPlayer_instances, _get_off_screen_fn, _on_player_message_fn;
import IVXMediaWebSocket from "./media_websocket.js";
class IVXMediaPlayer {
  constructor(init_params, env_params) {
    __privateAdd(this, _IVXMediaPlayer_instances);
    let canvas_id = env_params.canvas.id;
    let canvas_html = env_params.canvas.outerHTML;
    let pannel_id = env_params.pannel ? env_params.pannel.id : null;
    let pannel_html = env_params.pannel ? env_params.pannel.outerHTML : null;
    window.navigator.userAgent.toLowerCase();
    this.init_params = init_params;
    this.env_params = env_params;
    this.async_mode = env_params.async_mode;
    this.document_hidden = false;
    this.sync_mode_player = null;
    this.current_direction_mode = "forward";
    this.backward_speed = 1;
    this.forward_speed = 1;
    env_params.canvas.outerHTML = canvas_html;
    this.canvas_object = document.getElementById(canvas_id);
    if (pannel_html) {
      env_params.pannel.outerHTML = pannel_html;
      this.pannel = document.getElementById(pannel_id);
    } else this.pannel = null;
    if (this.worker) {
      this.worker.postMessage({ command: "stop", value: "none" });
      this.worker = null;
    }
    if (this.async_mode) {
      try {
        const offpannel = this.pannel ? __privateMethod(this, _IVXMediaPlayer_instances, _get_off_screen_fn).call(this, this.pannel) : null;
        const offscreen = __privateMethod(this, _IVXMediaPlayer_instances, _get_off_screen_fn).call(this, this.canvas_object);
        this.worker = new Worker(new URL("./media_worker.js", import.meta.url), { type: "module" });
        this.worker.addEventListener("message", (e) => {
          if (this.env_params.status) {
            this.env_params.status(e.data.stat, e.data.msg, this.env_params.id, this);
            if (e.data.stat == "eos") {
              console.log("Async mode player EOS");
            }
          } else console.log("_on_worker_message : " + JSON.stringify(e.data));
          if (document.hidden != this.document_hidden) {
            this.document_hidden = document.hidden;
            if (this.worker)
              this.worker.postMessage({ command: "document_hidden", value: this.document_hidden });
          }
        });
        if (this.worker) {
          this.init_params.env = { meta_mode: this.env_params.meta_mode, eventzone: this.env_params.eventzone, lang: this.env_params.lang, visibleVlmValidCode: this.env_params.visibleVlmValidCode };
          let create_params = { command: "create", value: { init: this.init_params, canvas: offscreen, pannel: offpannel } };
          this.worker.postMessage(create_params, [offscreen, offpannel]);
        }
      } catch (e) {
        console.error("Thread worker load failed");
        console.error(e);
        if (this.worker) {
          this.worker.close();
        }
      }
    } else {
      var env_params = {
        opaque: this,
        status: __privateMethod(this, _IVXMediaPlayer_instances, _on_player_message_fn),
        canvas: this.canvas_object,
        pannel: this.pannel,
        lang: this.env_params.lang ? this.env_params.lang : "KR",
        meta_mode: this.env_params.meta_mode ? this.env_params.meta_mode : "none",
        eventzone: this.env_params.eventzone ? this.env_params.eventzone : false,
        visibleVlmValidCode: this.env_params.visibleVlmValidCode ? this.env_params.visibleVlmValidCode : "all"
      };
      this.sync_mode_player = new IVXMediaWebSocket(this.init_params, env_params);
    }
  }
  Play() {
    if (this.async_mode) {
      if (this.worker)
        this.worker.postMessage({ command: "play", value: 1111 });
      else {
        __privateMethod(this, _IVXMediaPlayer_instances, _on_player_message_fn).call(this, "error", "Not allocated player woker thread instance");
      }
    } else {
      this.sync_mode_player.StartMedia();
      __privateMethod(this, _IVXMediaPlayer_instances, _on_player_message_fn).call(this, "ok", "Start play");
    }
  }
  Pause() {
    if (this.async_mode) {
      if (this.worker) {
        this.worker.postMessage({ command: "pause", value: "none" });
      } else {
        __privateMethod(this, _IVXMediaPlayer_instances, _on_player_message_fn).call(this, "error", "Not allocated player woker thread instance");
      }
    } else {
      this.sync_mode_player.PauseMedia();
      __privateMethod(this, _IVXMediaPlayer_instances, _on_player_message_fn).call(this, "ok", "Pause");
    }
  }
  Resume() {
    if (this.async_mode) {
      if (this.worker) {
        this.worker.postMessage({ command: "resume", value: "none" });
      } else {
        __privateMethod(this, _IVXMediaPlayer_instances, _on_player_message_fn).call(this, "error", "Not allocated player woker thread instance");
      }
    } else {
      this.sync_mode_player.ResumeMedia();
      __privateMethod(this, _IVXMediaPlayer_instances, _on_player_message_fn).call(this, "ok", "Resume");
    }
  }
  Seek(seek_time) {
    if (this.async_mode) {
      if (this.worker) {
        this.worker.postMessage({ command: "seek", value: seek_time });
      } else {
        __privateMethod(this, _IVXMediaPlayer_instances, _on_player_message_fn).call(this, "error", "Not allocated player woker thread instance");
      }
    } else {
      this.sync_mode_player.SeekMedia(seek_time);
      __privateMethod(this, _IVXMediaPlayer_instances, _on_player_message_fn).call(this, "ok", "seek");
    }
  }
  GetTimeline() {
    if (this.async_mode) {
      if (this.worker) {
        this.worker.postMessage({ command: "timeline", value: "none" });
      } else {
        __privateMethod(this, _IVXMediaPlayer_instances, _on_player_message_fn).call(this, "error", "Not allocated player woker thread instance");
      }
    } else {
      this.sync_mode_player.Timeline();
      __privateMethod(this, _IVXMediaPlayer_instances, _on_player_message_fn).call(this, "ok", "timeline");
    }
  }
  GetEventTimeline() {
    if (this.async_mode) {
      if (this.worker) {
        this.worker.postMessage({ command: "event_timeline", value: "none" });
      } else {
        __privateMethod(this, _IVXMediaPlayer_instances, _on_player_message_fn).call(this, "error", "Not allocated player woker thread instance");
      }
    } else {
      this.sync_mode_player.EventTimeline();
      __privateMethod(this, _IVXMediaPlayer_instances, _on_player_message_fn).call(this, "ok", "event_timeline");
    }
  }
  GetSpeed(direction) {
    if (direction == "backward") return this.backward_speed;
    else return this.forward_speed;
  }
  SetSpeed(speed_value, direction) {
    if (direction == "backward") this.backward_speed = speed_value;
    else this.forward_speed = speed_value;
    if (this.async_mode) {
      if (this.worker) {
        this.worker.postMessage({ command: "SetSpeed", value: speed_value, direction });
      } else {
        __privateMethod(this, _IVXMediaPlayer_instances, _on_player_message_fn).call(this, "error", "Not allocated player woker thread instance");
      }
    } else {
      this.sync_mode_player.SetSpeed(speed_value, direction);
      __privateMethod(this, _IVXMediaPlayer_instances, _on_player_message_fn).call(this, "ok", "SetSpeed");
    }
  }
  GetDirection() {
    return this.current_direction_mode;
  }
  SetDirection(direction_mode) {
    this.current_direction_mode = direction_mode;
    if (this.async_mode) {
      if (this.worker) {
        this.worker.postMessage({ command: "SetDirection", value: direction_mode });
      } else {
        __privateMethod(this, _IVXMediaPlayer_instances, _on_player_message_fn).call(this, "error", "Not allocated player woker thread instance");
      }
    } else {
      this.sync_mode_player.SetDirection(direction_mode);
      __privateMethod(this, _IVXMediaPlayer_instances, _on_player_message_fn).call(this, "ok", "SetDirection");
    }
  }
  Stop() {
    if (this.async_mode) {
      if (this.worker) {
        this.worker.postMessage({ command: "stop", value: "none" });
        this.worker = null;
      } else {
        console.log("Not allocated player woker thread instance");
      }
    } else {
      this.sync_mode_player.StopMedia();
      __privateMethod(this, _IVXMediaPlayer_instances, _on_player_message_fn).call(this, "ok", "Stop play");
    }
  }
  SetMetaMode(meta_mode) {
    if (this.async_mode) {
      if (this.worker) {
        this.worker.postMessage({ command: "SetMetaMode", value: meta_mode });
      } else {
        __privateMethod(this, _IVXMediaPlayer_instances, _on_player_message_fn).call(this, "error", "Not allocated player woker thread instance");
      }
    } else {
      this.sync_mode_player.SetMetaMode(meta_mode);
    }
  }
  EnableDrawMetaEvtzone(check_enable) {
    if (this.async_mode) {
      if (this.worker) {
        this.worker.postMessage({ command: "DrawMetaEvtzone", value: check_enable });
      } else {
        __privateMethod(this, _IVXMediaPlayer_instances, _on_player_message_fn).call(this, "error", "Not allocated player woker thread instance");
      }
    } else {
      this.sync_mode_player.DrawMetaEvtzone(check_enable);
    }
  }
  SetMetaBoxThick(box_thick) {
    if (this.async_mode) {
      if (this.worker) {
        this.worker.postMessage({ command: "SetMetaBoxThick", value: box_thick });
      } else {
        __privateMethod(this, _IVXMediaPlayer_instances, _on_player_message_fn).call(this, "error", "Not allocated player woker thread instance");
      }
    } else {
      this.sync_mode_player.SetMetaBoxThick(box_thick);
    }
  }
  SetResizeWindow(width, height) {
    if (this.async_mode) {
      if (this.worker) {
        this.worker.postMessage({ command: "SetResizeWindow", value: { width, height } });
      } else {
        __privateMethod(this, _IVXMediaPlayer_instances, _on_player_message_fn).call(this, "error", "Not allocated player woker thread instance");
      }
    } else {
      this.sync_mode_player.SetResizeWindow(width, height);
    }
  }
  Release() {
    this.Stop();
    if (this.async_mode && this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
  SetTimeBoxPosition(position) {
    if (this.async_mode) {
      if (this.worker) {
        this.worker.postMessage({
          command: "SetTimeBoxPosition",
          value: position
        });
      }
    } else {
      if (this.sync_mode_player) {
        this.sync_mode_player.SetTimeBoxPosition(position);
      }
    }
  }
  SetDrawTimeBox(draw) {
    if (this.async_mode) {
      if (this.worker) {
        this.worker.postMessage({
          command: "SetDrawTimeBox",
          value: draw
        });
      }
    } else {
      if (this.sync_mode_player) {
        this.sync_mode_player.SetDrawTimeBox(draw);
      }
    }
  }
}
_IVXMediaPlayer_instances = new WeakSet();
_get_off_screen_fn = function(screen) {
  if (screen) return screen.transferControlToOffscreen();
  else return null;
};
//sync mode player only
_on_player_message_fn = function(stat, msg) {
  var local;
  if (this.opaque) local = this.opaque;
  else local = this;
  try {
    if (local.env_params.status)
      local.env_params.status(stat, msg, local.env_params.id, local);
    if (document.hidden != local.document_hidden) {
      local.document_hidden = document.hidden;
      local.sync_mode_player.set_document_hidden(local.document_hidden);
    }
  } catch (e) {
    console.log(e);
  }
};
export {
  IVXMediaPlayer
};
