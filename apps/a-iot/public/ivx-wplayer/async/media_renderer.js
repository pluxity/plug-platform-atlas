var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _IVXMediaRenderer_instances, _calculate_time_box_position_fn;
import IVXEventText from "./meta_event_text.js";
import IVXFragmentShader from "./fragment_shader.js";
import IVXVertexShader from "./vertex_shader.js";
class IVXMediaRenderer {
  constructor(type, canvas, pannel, lang, options) {
    __privateAdd(this, _IVXMediaRenderer_instances);
    this.text = null;
    this.canvas = null;
    this.ctx = null;
    this.enable_event_box_only = false;
    this.box_thick = 1;
    this.visibleVlmValidCode = options && options.visibleVlmValidCode ? options.visibleVlmValidCode : "all";
    this.is_draw_box = false;
    this.is_draw_evtzone = false;
    this.is_draw_time_box = true;
    this.text_time = null;
    this.old_time = null;
    this.last_width = 0;
    this.last_height = 0;
    this.time_box_offset_x = 10;
    this.time_box_offset_y = 20;
    this.time_box_position_mode = null;
    if (pannel) this.text = pannel.getContext("2d");
    this.canvas = canvas;
    const gl = this.ctx = canvas.getContext(type);
    const frame_vertex_shader = gl.createShader(gl.VERTEX_SHADER);
    this.test_loop = 0;
    gl.shaderSource(frame_vertex_shader, IVXVertexShader.source);
    gl.compileShader(frame_vertex_shader);
    if (!gl.getShaderParameter(frame_vertex_shader, gl.COMPILE_STATUS)) {
      throw gl.getShaderInfoLog(frame_vertex_shader);
    }
    const frame_fragment_shader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(frame_fragment_shader, IVXFragmentShader.source);
    gl.compileShader(frame_fragment_shader);
    if (!gl.getShaderParameter(frame_fragment_shader, gl.COMPILE_STATUS)) {
      throw gl.getShaderInfoLog(frame_fragment_shader);
    }
    this.frame_shader_program = gl.createProgram();
    gl.attachShader(this.frame_shader_program, frame_vertex_shader);
    gl.attachShader(this.frame_shader_program, frame_fragment_shader);
    gl.linkProgram(this.frame_shader_program);
    if (!gl.getProgramParameter(this.frame_shader_program, gl.LINK_STATUS)) {
      throw gl.getProgramInfoLog(this.frame_shader_program);
    }
    gl.useProgram(this.frame_shader_program);
    this.frame_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.frame_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1,
      -1,
      -1,
      1,
      1,
      1,
      1,
      -1
    ]), gl.STATIC_DRAW);
    const xyLocation = gl.getAttribLocation(this.frame_shader_program, "xy");
    gl.vertexAttribPointer(xyLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(xyLocation);
    this.frame_texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.frame_texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    this.last_width = gl.drawingBufferWidth;
    this.last_height = gl.drawingBufferHeight;
    if (this.text) {
      try {
        this.text.font = this.text.font.replace(/(?<value>\d+\.?\d*)/, 12);
      } catch (e) {
        console.error(e);
      }
    }
    this.clear_float_array_all();
    if (lang) IVXEventText.chnage_language(lang);
    console.log("Renderer created");
  }
  release() {
    console.log("release media renderer");
    if (this.ctx) {
      delete this.ctx;
      this.ctx = null;
    }
    if (this.text) {
      delete this.text;
      this.text = null;
    }
  }
  SetMetaBoxThick(box_thick) {
    this.box_thick = parseFloat(box_thick);
  }
  SetTimeBoxPosition(position) {
    if (typeof position === "string") {
      this.time_box_position_mode = position.toLowerCase();
      this.time_box_offset_x = null;
      this.time_box_offset_y = null;
    } else if (position && typeof position === "object") {
      this.time_box_position_mode = null;
      if (typeof position.x === "number") {
        this.time_box_offset_x = position.x;
      }
      if (typeof position.y === "number") {
        this.time_box_offset_y = position.y;
      }
    }
  }
  set_is_draw_time_box(draw) {
    this.is_draw_time_box = draw;
  }
  set_is_draw_box(draw) {
    this.is_draw_box = draw;
    if (!draw) {
      this.clear_float_array_box();
    }
  }
  set_is_draw_evtzone(draw) {
    this.is_draw_evtzone = draw;
    if (!draw) {
      this.clear_float_array_eventzone();
    }
  }
  /* 객체 박스 float array clear */
  clear_float_array_box() {
    const gl = this.ctx;
    if (gl == null) {
      return;
    }
    var uniform_offsetLoc = gl.getUniformLocation(this.frame_shader_program, "u_roi_box");
    gl.uniform4f(uniform_offsetLoc, -1, -1, -1, -1);
    if (this.text) {
      const canvas = this.text.canvas;
      this.text.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  /* 객체 박스 float array eventzone */
  clear_float_array_eventzone() {
    const gl = this.ctx;
    if (gl == null) {
      return;
    }
    var uniform_eventzone_loc = gl.getUniformLocation(this.frame_shader_program, "u_evt_zone_pts");
    gl.uniform2f(uniform_eventzone_loc, -1, -1);
    var uniform_evtzone_crossing_loc = gl.getUniformLocation(this.frame_shader_program, "u_evt_zone_crossing");
    gl.uniform1f(uniform_evtzone_crossing_loc, -1);
    var uniform_evtzone_directional_movement = gl.getUniformLocation(this.frame_shader_program, "u_directional_movement");
    gl.uniform4f(uniform_evtzone_directional_movement, -1, -1, -1, -1);
  }
  /* 모든 메타 클리어 */
  clear_float_array_all() {
    this.clear_float_array_box();
    this.clear_float_array_eventzone();
  }
  set_event_box_only(enable) {
    this.enable_event_box_only = enable;
  }
  /* 렌더링 영역 값 반환 */
  render_area_info(gl, frame) {
    var render_x = 0;
    var render_y = 0;
    var draw_width = gl.drawingBufferWidth;
    var draw_height = gl.drawingBufferHeight;
    var render_width = gl.drawingBufferWidth;
    var render_height = gl.drawingBufferHeight;
    if (draw_width <= 0) {
      render_width = this.last_width;
      draw_width = this.last_width;
    } else if (this.last_width != draw_width) this.last_width = draw_width;
    if (draw_height <= 0) {
      render_height = this.last_height;
      draw_height = this.last_height;
    } else if (this.last_height != draw_height) this.last_height = draw_height;
    var frame_res_rate = frame.displayWidth / frame.displayHeight;
    var webgl_res_rate = draw_width / draw_height;
    if (webgl_res_rate > frame_res_rate) {
      render_width = draw_height * frame_res_rate;
      render_height = draw_height;
      render_x = (draw_width - render_width) / 2;
      if (render_x < 0) render_x = 0;
    } else {
      render_width = draw_width;
      render_height = draw_width / frame_res_rate;
      render_y = (draw_height - render_height) / 2;
      if (render_y < 0) render_y = 0;
    }
    return { render_x, render_y, render_width, render_height };
  }
  /* 시간 그리기 */
  draw_time(time, render_info) {
    if (!this.text || !this.is_draw_time_box) {
      return;
    }
    var text_width = null;
    const text_height = 20;
    const padding = 10;
    if (!time && this.old_time) {
      text_width = this.text.measureText(this.old_time).width;
      const pos2 = __privateMethod(this, _IVXMediaRenderer_instances, _calculate_time_box_position_fn).call(this, render_info, text_width, text_height);
      this.text.fillStyle = "rgba(0, 0, 0, 0.5)";
      this.text.fillRect(render_info.render_x + pos2.x - padding / 2, render_info.render_y + pos2.y - text_height, text_width + padding, text_height + padding);
      this.text.fillStyle = "white";
      this.text.fillText(this.old_time, render_info.render_x + pos2.x, render_info.render_y + pos2.y);
      return;
    }
    const date = new Date(Number(time));
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const formatted_date = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    text_width = this.text.measureText(formatted_date).width;
    const pos = __privateMethod(this, _IVXMediaRenderer_instances, _calculate_time_box_position_fn).call(this, render_info, text_width, text_height);
    this.text.fillStyle = "rgba(0, 0, 0, 0.5)";
    this.text.fillRect(render_info.render_x + pos.x - padding / 2, render_info.render_y + pos.y - text_height, text_width + padding, text_height + padding);
    this.text.fillStyle = "white";
    this.text.fillText(formatted_date, render_info.render_x + pos.x, render_info.render_y + pos.y);
    this.old_time = formatted_date;
  }
  /* 객체 박스 그리기 */
  draw_box(gl, render_info, meta, is_draw_box) {
    var uniform_offsetLoc = gl.getUniformLocation(this.frame_shader_program, "u_roi_box");
    var uniform_box_thick = gl.getUniformLocation(this.frame_shader_program, "u_box_thick");
    var uniform_is_event_box = gl.getUniformLocation(this.frame_shader_program, "u_is_event_box");
    var box_array_count = 0;
    var box_float_array = null;
    var is_event_array_count = 0;
    var is_event_array = null;
    if (!meta || is_draw_box == false) {
      box_array_count = 0;
      box_float_array = new Float32Array(4);
      box_float_array[box_array_count++] = -1;
      box_float_array[box_array_count++] = -1;
      box_float_array[box_array_count++] = -1;
      box_float_array[box_array_count++] = -1;
      gl.uniform4fv(uniform_offsetLoc, box_float_array);
      return;
    }
    var box_text;
    var box_length = meta ? meta.objs.length : 0;
    box_float_array = new Float32Array((box_length + 1) * 4);
    is_event_array = new Int32Array(box_length + 1);
    box_array_count = 0;
    is_event_array_count = 0;
    var render_x = render_info.render_x;
    var render_y = render_info.render_y;
    var render_width = render_info.render_width;
    var render_height = render_info.render_height;
    if (this.text) {
      try {
        gl.uniform1f(uniform_box_thick, this.box_thick);
      } catch (e) {
        console.error(e);
      }
    }
    try {
      var dx = render_x / render_width;
      var dy = render_y / render_height;
      for (var i = 0; i < box_length && i < 100; i++) {
        var is_event = meta.objs[i].evn > 0 ? true : false;
        if (this.check_rendering_roi_enable(is_event)) {
          box_float_array[box_array_count++] = meta.objs[i].x * render_width;
          box_float_array[box_array_count++] = (1 - meta.objs[i].y) * render_height;
          box_float_array[box_array_count++] = meta.objs[i].w * render_width;
          if (is_event) {
            box_float_array[box_array_count++] = meta.objs[i].h * render_height * -1;
          } else {
            box_float_array[box_array_count++] = meta.objs[i].h * render_height;
          }
          is_event_array[is_event_array_count++] = meta.objs[i].evn;
          if (this.text) {
            this.text.font = "bold 14px verdana, sans-serif";
            if (meta.objs[i].type & 2) {
              box_text = this.get_vehicle_name(meta.objs[i].vattr);
            } else {
              box_text = this.get_object_name(meta.objs[i].type);
            }
            box_text += " ";
            box_text += this.get_event_name(meta.objs[i].evs, meta.objs[i].evn, meta.objs[i].ver);
            this.text.fillStyle = "rgba(0, 0, 0, 0.5)";
            var text_width = this.text.measureText(box_text).width;
            var text_height = 15;
            const padding = 2;
            this.text.fillRect((meta.objs[i].x + dx) * render_width - padding / 2, (meta.objs[i].y + dy) * render_height - text_height, text_width + padding, text_height + padding);
            if (is_event) {
              this.text.fillStyle = "#FFA500";
            } else {
              this.text.fillStyle = "#FFFFFF";
            }
            this.text.fillText(box_text, (meta.objs[i].x + dx) * render_width + padding, (meta.objs[i].y + dy) * render_height);
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
    box_float_array[box_array_count++] = -1;
    box_float_array[box_array_count++] = -1;
    box_float_array[box_array_count++] = -1;
    box_float_array[box_array_count++] = -1;
    is_event_array[is_event_array_count++] = -1;
    gl.uniform4fv(uniform_offsetLoc, box_float_array);
    gl.uniform1iv(uniform_is_event_box, is_event_array);
  }
  /* 이벤트 존 영역 그리기  */
  draw_eventzone_area(gl, evtzone, render_width, render_height) {
    var uniform_eventzone_loc = gl.getUniformLocation(this.frame_shader_program, "u_evt_zone_pts");
    var evtzone_array_size = 0;
    var float_array = null;
    var array_count = 0;
    var evtzone_count = evtzone.length;
    for (var i = 0; i < evtzone_count && i < 100; i++) {
      evtzone_array_size += evtzone[i].points.length * 2;
    }
    var evtzone_tail_flag_size = evtzone_count * 2;
    var last_point_size = 2 * evtzone_count;
    var last_flag_size = 4;
    var evtzone_float_array_size = evtzone_array_size + evtzone_tail_flag_size + last_point_size + last_flag_size;
    float_array = new Float32Array(evtzone_float_array_size);
    try {
      for (var i = 0; i < evtzone_count && i < 100; i++) {
        if (evtzone[i].points.length <= 0) continue;
        for (var j = 0; j < evtzone[i].points.length; j++) {
          float_array[array_count++] = evtzone[i].points[j].x * render_width;
          float_array[array_count++] = (1 - evtzone[i].points[j].y) * render_height;
        }
        float_array[array_count++] = evtzone[i].points[0].x * render_width;
        float_array[array_count++] = (1 - evtzone[i].points[0].y) * render_height;
        float_array[array_count++] = -2;
        float_array[array_count++] = -2;
      }
    } catch (e) {
      console.error(e);
    }
    if (float_array != null) {
      float_array[array_count++] = -1;
      float_array[array_count++] = -1;
      float_array[array_count++] = -1;
      float_array[array_count++] = -1;
      gl.uniform2fv(uniform_eventzone_loc, float_array);
    }
  }
  /* 이벤트 존 경계선 통과 그리기 */
  draw_eventzone_boundary_crossing(gl, evtzone, render_width, render_height) {
    var uniform_evtzone_crossing_loc = gl.getUniformLocation(this.frame_shader_program, "u_evt_zone_crossing");
    var float_array = null;
    var array_count = 0;
    var array_size = 0;
    var evtzone_count = evtzone.length;
    try {
      for (var i = 0; i < evtzone_count; i++) {
        var crossing_count = evtzone[i].crossing ? evtzone[i].crossing.length : 0;
        array_size += crossing_count * 8;
      }
      if (array_size == 0) {
        float_array = new Float32Array(2);
        float_array[array_count++] = -1;
        float_array[array_count++] = -1;
        gl.uniform1fv(uniform_evtzone_crossing_loc, float_array);
        return;
      }
      array_size += 2;
      float_array = new Float32Array(array_size);
      for (var i = 0; i < evtzone_count; i++) {
        if (evtzone[i].crossing == null) {
          continue;
        }
        for (var j = 0; j < evtzone[i].crossing.length; j++) {
          float_array[array_count++] = evtzone[i].crossing[j].direction;
          float_array[array_count++] = evtzone[i].crossing[j].start_x * render_width;
          float_array[array_count++] = (1 - evtzone[i].crossing[j].start_y) * render_height;
          float_array[array_count++] = evtzone[i].crossing[j].end_x * render_width;
          float_array[array_count++] = (1 - evtzone[i].crossing[j].end_y) * render_height;
          float_array[array_count++] = evtzone[i].crossing[j].multi;
          float_array[array_count++] = -2;
          float_array[array_count++] = -2;
        }
      }
    } catch (e) {
      console.error(e);
    }
    float_array[array_count++] = -1;
    float_array[array_count++] = -1;
    gl.uniform1fv(uniform_evtzone_crossing_loc, float_array);
  }
  /* 방향성 이동 그리기 */
  draw_eventzone_directional_movement(gl, evtzone, render_width, render_height) {
    var uniform_directional_movement = gl.getUniformLocation(this.frame_shader_program, "u_directional_movement");
    var array_count = 0;
    var float_array = null;
    var evtzone_count = evtzone.length;
    var float_array_size = 0;
    for (var i = 0; i < evtzone_count; i++) {
      if (evtzone[i].directional_move == null) {
        continue;
      }
      float_array_size += 4;
    }
    if (float_array_size == 0) {
      float_array = new Float32Array(4);
      float_array[array_count++] = -1;
      float_array[array_count++] = -1;
      float_array[array_count++] = -1;
      float_array[array_count++] = -1;
      gl.uniform4fv(uniform_directional_movement, float_array);
      return;
    }
    float_array = new Float32Array(float_array_size + 4);
    for (var i = 0; i < evtzone_count; i++) {
      if (evtzone[i].directional_move == null) {
        continue;
      }
      float_array[array_count++] = evtzone[i].directional_move.direction;
      float_array[array_count++] = evtzone[i].directional_move.range;
      float_array[array_count++] = evtzone[i].directional_move.center_x * render_width;
      float_array[array_count++] = (1 - evtzone[i].directional_move.center_y) * render_height;
    }
    float_array[array_count++] = -1;
    float_array[array_count++] = -1;
    float_array[array_count++] = -1;
    float_array[array_count++] = -1;
    gl.uniform4fv(uniform_directional_movement, float_array);
  }
  /* 이벤트 존 그리기 */
  draw_eventzone(gl, render_info, meta) {
    if (meta == null) {
      return;
    }
    var evtzone_count = meta && meta.evtzone ? meta.evtzone.length : 0;
    if (evtzone_count <= 0) {
      return;
    }
    var render_width = render_info.render_width;
    var render_height = render_info.render_height;
    this.draw_eventzone_area(gl, meta.evtzone, render_width, render_height);
    this.draw_eventzone_boundary_crossing(gl, meta.evtzone, render_width, render_height);
    this.draw_eventzone_directional_movement(gl, meta.evtzone, render_width, render_height);
  }
  /* 렌더링 */
  draw_shader(gl, render_info, frame) {
    var uniform_start_offset = gl.getUniformLocation(this.frame_shader_program, "u_start_offset");
    gl.uniform2f(uniform_start_offset, render_info.render_x, render_info.render_y);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, frame);
    frame.close();
    gl.viewport(render_info.render_x, render_info.render_y, render_info.render_width, render_info.render_height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  }
  _filterMetaByVlm(meta) {
    if (!meta || this.visibleVlmValidCode === "all") return meta;
    const code = String(this.visibleVlmValidCode);
    const filtered = { ...meta };
    if (meta.objs && Array.isArray(meta.objs)) {
      filtered.objs = meta.objs.filter(function(obj) {
        return String(obj.vlm) === code;
      });
    }
    return filtered;
  }
  /* 영상 및 메타 그리기 */
  draw(frame, meta, time) {
    if (frame == null) {
      return;
    }
    const gl = this.ctx;
    const render_info = this.render_area_info(gl, frame);
    if (this.text) {
      this.text.clearRect(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      this.text.font = "bold 12px verdana, sans-serif";
      this.text.fillStyle = "#ffFFFF";
      this.text.textRendering = "optimizeSpeed";
    }
    this.draw_time(time, render_info);
    const filtered_meta = this._filterMetaByVlm(meta);
    this.draw_box(gl, render_info, filtered_meta, this.is_draw_box);
    if (this.is_draw_evtzone)
      this.draw_eventzone(gl, render_info, filtered_meta);
    this.draw_shader(gl, render_info, frame);
  }
  check_rendering_roi_enable(is_event) {
    if (this.enable_event_box_only) {
      if (is_event) return true;
      else return false;
    } else return true;
  }
  get_object_name(obj_type) {
    return IVXEventText.object_type_to_string(obj_type);
  }
  get_event_name(evs, evn, ver) {
    if (evn == 0) return "";
    if (ver < 2) {
      return "(" + IVXEventText.event_type_to_string_v1(evs, evn) + ")";
    } else {
      return "(" + IVXEventText.event_type_to_string_v2(evs, evn) + ")";
    }
  }
  get_vehicle_name(vehicle_attr) {
    return IVXEventText.vehicle_type_to_string(vehicle_attr);
  }
}
_IVXMediaRenderer_instances = new WeakSet();
_calculate_time_box_position_fn = function(render_info, text_width, text_height) {
  let x = this.time_box_offset_x;
  let y = this.time_box_offset_y;
  if (this.time_box_position_mode) {
    const padding = 10;
    const canvas_width = render_info.render_width;
    const canvas_height = render_info.render_height;
    switch (this.time_box_position_mode) {
      case "top-left":
        x = 10;
        y = 20;
        break;
      case "top-center":
        x = (canvas_width - text_width - padding) / 2;
        y = 20;
        break;
      case "top-right":
        x = canvas_width - text_width - padding;
        y = 20;
        break;
      case "bottom-left":
        x = 10;
        y = canvas_height - text_height - 10;
        break;
      case "bottom-center":
        x = (canvas_width - text_width - padding) / 2;
        y = canvas_height - text_height - 10;
        break;
      case "bottom-right":
        x = canvas_width - text_width - padding;
        y = canvas_height - text_height - 10;
        break;
      default:
        x = this.time_box_offset_x || 10;
        y = this.time_box_offset_y || 20;
        break;
    }
  } else {
    x = this.time_box_offset_x !== null ? this.time_box_offset_x : 10;
    y = this.time_box_offset_y !== null ? this.time_box_offset_y : 20;
  }
  return { x, y };
};
export {
  IVXMediaRenderer as default
};
