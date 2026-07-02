class IVXMediaNegotiator {
  constructor(init_params) {
    this.init_params = init_params;
    if (init_params.session) this.session_key = init_params.session;
    else this.session_key = "";
  }
  static get CREATE_SESSION() {
    return "create.session";
  }
  static get DESCRIBE_SESSION() {
    return "describe.session";
  }
  static get PLAYCTRL_SESSION() {
    return "playctrl.session";
  }
  options() {
    let data = {
      auth_key: this.init_params.auth_key
    };
    return JSON.stringify({ "options": data });
  }
  release() {
  }
  request_create_session(web_socket) {
    let request_data;
    let command_data = {
      auth_key: this.init_params.auth_key,
      cam_id: this.init_params.cam_id,
      profile_id: this.init_params.profile_id,
      stream_type: this.init_params.stream_type,
      start_time: this.init_params.start_time,
      end_time: this.init_params.end_time
    };
    if (this.init_params.access_key) command_data.access_key = this.init_params.access_key;
    request_data = JSON.stringify({ "command": IVXMediaNegotiator.CREATE_SESSION, "data": command_data });
    web_socket.send(request_data);
    console.log("Request_create_session : " + request_data);
  }
  request_describe_session(web_socket) {
    let request_data;
    let command_data = {
      auth_key: this.init_params.auth_key,
      session_key: this.session_key
    };
    request_data = JSON.stringify({ "command": IVXMediaNegotiator.DESCRIBE_SESSION, "data": command_data });
    web_socket.send(request_data);
    console.log("Request_describe_session : " + request_data);
  }
  request_playctrl_session(web_socket) {
    let request_data;
    let command_data = {
      auth_key: this.init_params.auth_key,
      session_key: this.session_key,
      mode: "play"
    };
    request_data = JSON.stringify({ "command": IVXMediaNegotiator.PLAYCTRL_SESSION, "data": command_data });
    web_socket.send(request_data);
    console.log("Request_playctrl_session : " + request_data);
  }
  request_keepalive_session(web_socket) {
    let request_data;
    let command_data = {
      auth_key: this.init_params.auth_key,
      session_key: this.session_key,
      mode: "keepalive"
    };
    request_data = JSON.stringify({ "command": IVXMediaNegotiator.PLAYCTRL_SESSION, "data": command_data });
    web_socket.send(request_data);
  }
  request_pause_session(web_socket) {
    let request_data;
    let command_data = {
      auth_key: this.init_params.auth_key,
      session_key: this.session_key,
      mode: "pause"
    };
    request_data = JSON.stringify({ "command": IVXMediaNegotiator.PLAYCTRL_SESSION, "data": command_data });
    web_socket.send(request_data);
    console.log("Request_pause_session : " + request_data);
  }
  request_resume_session(web_socket) {
    let request_data;
    let command_data = {
      auth_key: this.init_params.auth_key,
      session_key: this.session_key,
      mode: "resume"
    };
    request_data = JSON.stringify({ "command": IVXMediaNegotiator.PLAYCTRL_SESSION, "data": command_data });
    web_socket.send(request_data);
    console.log("Request_resume_session : " + request_data);
  }
  request_seek_session(web_socket, seek_time) {
    let request_data;
    let command_data = {
      auth_key: this.init_params.auth_key,
      session_key: this.session_key,
      mode: "seek",
      seek_time: seek_time.toString()
    };
    request_data = JSON.stringify({ "command": IVXMediaNegotiator.PLAYCTRL_SESSION, "data": command_data });
    web_socket.send(request_data);
    console.log("Request_seek_session : " + request_data);
  }
  request_timeline_session(web_socket) {
    let request_data;
    let command_data = {
      auth_key: this.init_params.auth_key,
      session_key: this.session_key,
      mode: "timeline"
    };
    request_data = JSON.stringify({ "command": IVXMediaNegotiator.PLAYCTRL_SESSION, "data": command_data });
    web_socket.send(request_data);
    console.log("Request_seek_session : " + request_data);
  }
  request_event_timeline_session(web_socket) {
    let request_data;
    let command_data = {
      auth_key: this.init_params.auth_key,
      session_key: this.session_key,
      mode: "event_timeline"
    };
    request_data = JSON.stringify({ "command": IVXMediaNegotiator.PLAYCTRL_SESSION, "data": command_data });
    web_socket.send(request_data);
    console.log("Request_seek_session : " + request_data);
  }
  request_speed_session(web_socket, speed_value, direction) {
    let request_data;
    let command_data = {
      auth_key: this.init_params.auth_key,
      session_key: this.session_key,
      mode: "speed",
      speed: parseFloat(speed_value),
      direction
    };
    request_data = JSON.stringify({ "command": IVXMediaNegotiator.PLAYCTRL_SESSION, "data": command_data });
    web_socket.send(request_data);
    console.log("Request_speed_session : " + request_data);
  }
  request_direction_session(web_socket, direction_mode) {
    let request_data;
    let command_data = {
      auth_key: this.init_params.auth_key,
      session_key: this.session_key,
      mode: "direction",
      direction: direction_mode
    };
    request_data = JSON.stringify({ "command": IVXMediaNegotiator.PLAYCTRL_SESSION, "data": command_data });
    web_socket.send(request_data);
    console.log("Request_direction_session : " + request_data);
  }
}
export {
  IVXMediaNegotiator as default
};
