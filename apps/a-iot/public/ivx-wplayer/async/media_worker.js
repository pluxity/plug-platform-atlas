import IVXMediaWebSocket from "./media_websocket.js";
addEventListener("message", (p) => {
  if (!self.on_player_message) {
    self.on_player_message = function(stat, msg) {
      postMessage({ stat, msg });
    };
  }
  if (!self.create_player) {
    self.create_player = function(cmd) {
      try {
        var env_params = {
          status: self.on_player_message,
          meta_mode: cmd.init.env.meta_mode,
          eventzone: cmd.init.env.eventzone,
          lang: cmd.init.env.lang,
          visibleVlmValidCode: cmd.init.env.visibleVlmValidCode ? cmd.init.env.visibleVlmValidCode : "all",
          canvas: cmd.canvas,
          pannel: cmd.pannel,
          worker: self
        };
        if (self.player) self.player.reinitialize(cmd.init, env_params);
        else self.player = new IVXMediaWebSocket(cmd.init, env_params);
      } catch (e) {
        console.log(e);
        self.close();
      }
    };
  }
  try {
    switch (p.data.command) {
      case "create":
        self.create_player(p.data.value);
        postMessage({ stat: "ok", msg: "create success : ivx player instance" });
        break;
      case "play":
        self.player.StartMedia();
        postMessage({ stat: "ok", msg: "Start play" });
        break;
      case "stop":
        self.player.StopMedia();
        break;
      case "pause":
        self.player.PauseMedia();
        break;
      case "resume":
        self.player.ResumeMedia();
        break;
      case "seek":
        self.player.SeekMedia(p.data.value);
        break;
      case "timeline":
        self.player.Timeline();
        break;
      case "event_timeline":
        self.player.EventTimeline();
        break;
      case "document_hidden":
        console.log("document hidden status : " + p.data.value);
        self.player.set_document_hidden(p.data.value);
        break;
      case "SetSpeed":
        self.player.SetSpeed(p.data.value, p.data.direction);
        break;
      case "SetDirection":
        self.player.SetDirection(p.data.value);
        break;
      case "SetMetaMode":
        self.player.SetMetaMode(p.data.value);
        break;
      case "DrawMetaEvtzone":
        self.player.DrawMetaEvtzone(p.data.value);
        break;
      case "SetMetaBoxThick":
        self.player.SetMetaBoxThick(p.data.value);
        break;
      case "SetTimeBoxPosition":
        self.player.SetTimeBoxPosition(p.data.value);
        break;
      case "SetDrawTimeBox":
        self.player.SetDrawTimeBox(p.data.value);
        break;
      case "SetResizeWindow":
        self.player.SetResizeWindow(p.data.value.width, p.data.value.height);
        break;
      default:
        postMessage({ stat: "error", msg: "Invalid command" });
        break;
    }
  } catch (e) {
    console.log("Work Thread error");
    console.log(e);
    postMessage({ stat: "fatal", msg: "Work Thread error" });
  }
});
