class IVXSessionManager {
  constructor() {
    this.web_media_url = "";
    this.web_media_session = "";
  }
  release() {
  }
  get session_url() {
    return this.web_media_url;
  }
  get session_key() {
    return this.web_media_session;
  }
  create_wm_session(session_params) {
    let http_request = new XMLHttpRequest();
    http_request.conn_url = "/NVR/media_websocket/create_session";
    http_request.session_params = session_params;
    http_request.opaque = this;
    http_request.id = session_params.params.cam_id;
    http_request.onerror = function(e) {
      console.log(e);
    };
    http_request.onreadystatechange = function() {
      switch (this.readyState) {
        case XMLHttpRequest.DONE:
          if (this.status >= 200 && this.status < 400) {
            var json_data = JSON.parse(this.responseText);
            console.log("result => " + this.responseText);
            if (json_data.code == 0) {
              this.opaque.web_media_url = json_data.url;
              this.opaque.web_media_session = json_data.session;
              if (this.session_params.params.status) {
                this.session_params.params.status("info", "url : " + this.opaque.web_media_url, this.id);
                this.session_params.params.status("ok", "create session : " + this.opaque.web_media_session, this.id);
              } else {
                console.log("url : " + this.opaque.web_media_url);
                console.log("session : " + this.opaque.web_media_session);
              }
            } else if (this.session_params.params.status)
              this.session_params.params.status("error", "code : " + json_data.code + ", message : " + json_data.message, this.id);
          } else {
            if (this.session_params.params.status)
              this.session_params.params.status("error", "Http error : " + this.statusText + "(" + this.status + ")", this.id);
            else
              console.log("Http error : " + this.statusText + "(" + this.status + ")");
          }
          delete this;
          break;
      }
    };
    try {
      http_request.open("PUT", http_request.conn_url, true);
    } catch (e) {
      if (session_params.params.status)
        session_params.params.status("error", "http open failed :" + e, http_request.id);
      else
        console.log("http open failed : " + e.message);
      return;
    }
    http_request.setRequestHeader("AUTH-KEY", session_params.params.auth_key);
    http_request.setRequestHeader("ACCESS-KEY", session_params.params.access_key);
    http_request.send(JSON.stringify(session_params));
  }
}
export {
  IVXSessionManager
};
