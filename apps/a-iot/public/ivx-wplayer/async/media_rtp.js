var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _IVXMediaRTP_instances, rtp_header_parser_fn, print_hex_fn, parsing_aac_payload_fn, parsing_ac3_payload_fn, parsing_h265_payload_fn, single_nal_h265_payload_fn, parsing_h264_payload_fn, singla_nal_h264_payload_fn, fu_a_h264_payload_fn, flush_channel_data_fn, clear_channel_payload_fn, sei_meta_data_check_fn;
import IVX_WASM_LOADER from "../wasm/wasm_env.js";
class IVXMediaRTP {
  constructor(init_params) {
    __privateAdd(this, _IVXMediaRTP_instances);
    this.decoder = init_params.decoder;
    this.rtp_packet = {};
    this.rtp_packet.channel = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
    this.annex_b = false;
    this.NVR_META_SEI_GUID = [157, 25, 99, 64, 51, 20, 17, 233, 181, 110, 8, 0, 32, 12, 154, 102].join("");
    this.NVR_TIME_SEI_GUID = [117, 21, 243, 179, 219, 128, 66, 41, 135, 250, 76, 230, 156, 148, 139, 54].join("");
    this.time_gen = init_params.time_gen;
    this.ivx_meta = new IVX_WASM_LOADER({ url: new URL("../wasm/zvameta.wasm", import.meta.url).toString() });
    if (!init_params.use_meta) this.use_meta = false;
    else this.use_meta = true;
  }
  release() {
  }
  static get MAX_FRAME_SIZE() {
    return 1 * 1024 * 1024;
  }
  current_play_time(channel_index) {
    if (this.rtp_packet.channel[channel_index])
      return this.rtp_packet.channel[channel_index].play_timestamp;
    else return 0;
  }
  put_rtp_data(media_info, data) {
    const RTP_HEADER_LEN = 12;
    const bin = new Uint8Array(data);
    let remain_len = data.byteLength;
    let index = 0;
    while (remain_len > 0) {
      if (bin[index++] != 36) {
        console.log("error : signature");
        break;
      } else {
        let channel = bin[index++];
        let length = bin[index++] << 8 | bin[index++];
        channel /= 2;
        if (channel < 0 || channel >= this.rtp_packet.channel.length) {
          console.error("error : invalid channel number");
          break;
        }
        remain_len -= 4;
        if (remain_len <= 0) return;
        if (remain_len >= RTP_HEADER_LEN) {
          __privateMethod(this, _IVXMediaRTP_instances, rtp_header_parser_fn).call(this, media_info[channel], bin.slice(index, index + RTP_HEADER_LEN), this.rtp_packet.channel[channel]);
          index += RTP_HEADER_LEN;
          length -= RTP_HEADER_LEN;
          remain_len -= RTP_HEADER_LEN;
          if (length > 0 && remain_len > 0) {
            if (media_info[channel].codec == "avc")
              __privateMethod(this, _IVXMediaRTP_instances, parsing_h264_payload_fn).call(this, bin.slice(index, index + length), this.rtp_packet.channel[channel]);
            else if (media_info[channel].codec == "hevc")
              __privateMethod(this, _IVXMediaRTP_instances, parsing_h265_payload_fn).call(this, bin.slice(index, index + length), this.rtp_packet.channel[channel]);
            else if (media_info[channel].codec == "aac")
              __privateMethod(this, _IVXMediaRTP_instances, parsing_aac_payload_fn).call(this, bin.slice(index, index + length), this.rtp_packet.channel[channel]);
            else if (media_info[channel].codec == "ac3")
              __privateMethod(this, _IVXMediaRTP_instances, parsing_ac3_payload_fn).call(this, bin.slice(index, index + length), this.rtp_packet.channel[channel]);
            index += length;
            remain_len -= length;
            if (remain_len <= 0) return;
          } else if (length == 0) {
            console.log("flush video stream ");
            __privateMethod(this, _IVXMediaRTP_instances, flush_channel_data_fn).call(this, media_info[channel], this.rtp_packet.channel[channel]);
          }
        } else break;
      }
    }
  }
  use_sei_meta_data(enable) {
    this.use_meta = enable;
    if (!this.use_meta) {
      if (this.decoder) {
        this.decoder.clear_meta_data_queue();
        this.decoder.SetDrawMetaAll(false);
      }
    }
  }
  set_is_draw_box(enable) {
    this.decoder.SetDrawMetaBox(enable);
  }
  set_is_draw_evtzone(enable) {
    this.decoder.SetDrawMetaEvtzone(enable);
  }
}
_IVXMediaRTP_instances = new WeakSet();
rtp_header_parser_fn = function(media_info, bin, channel) {
  let timestamp;
  if (bin.byteLength <= 0) return;
  else if (!channel.rtp_header) {
    channel.rtp_header = {};
    channel.rtp_header.timestamp = 0;
    channel.payload = {};
    channel.payload.frame_size = 0;
    channel.payload.frame = new Uint8Array(1024 * 1024);
  }
  channel.rtp_header.version = bin[0] >> 6 & 3;
  channel.rtp_header.padding = bin[0] >> 5 & 1;
  channel.rtp_header.extention = bin[0] >> 4 & 1;
  channel.rtp_header.csrc = bin[0] & 15;
  channel.rtp_header.mark = bin[1] >> 7 & 1;
  channel.rtp_header.type = bin[1] & 127;
  channel.rtp_header.sequence = bin[2] << 8 | bin[3];
  timestamp = bin[4] << 24 | bin[5] << 16 | bin[6] << 8 | bin[7];
  channel.rtp_header.ssrc = bin[8] << 24 | bin[9] << 16 | bin[10] << 8 | bin[11];
  timestamp >>>= 0;
  channel.rtp_header.sequence >>>= 0;
  if (channel.rtp_header.timestamp != timestamp) {
    __privateMethod(this, _IVXMediaRTP_instances, flush_channel_data_fn).call(this, media_info, channel);
    channel.rtp_header.timestamp = timestamp;
  }
};
print_hex_fn = function(data, len) {
  let str = "";
  for (let i = 0; i < len; i++) {
    if (i != 0 && i % 16 == 0) str += "\n";
    if (data[i] < 16) str += "0";
    str += data[i].toString(16) + " ";
  }
  console.log(str);
};
parsing_aac_payload_fn = function(bin, channel) {
  let index = channel.payload.frame_size;
  if (index == 0) {
    let offset = 0;
    channel.payload.aac_length = 0;
    for (offset = 0; offset < bin.byteLength; offset++) {
      channel.payload.aac_length += bin[offset];
      if (bin[offset] != 255) {
        offset += 1;
        break;
      }
    }
    channel.payload.frame.set(bin.slice(offset, bin.byteLength), index);
    channel.payload.frame_size = index + (bin.byteLength - offset);
  } else {
    channel.payload.frame.set(bin, index);
    channel.payload.frame_size = index + bin.byteLength;
  }
};
parsing_ac3_payload_fn = function(bin, channel) {
};
parsing_h265_payload_fn = function(bin, channel) {
  let index = channel.payload.frame_size;
  let fu_indicator = bin[0] << 8 | bin[1];
  let fu_cmd = (bin[2] & 192) >> 6;
  let nal_type = bin[2] & 63;
  let signature = fu_indicator >> 9 & 63;
  if (signature == 49) {
    var payload_slice = bin.slice(3, bin.byteLength);
    if (fu_cmd == 2) {
      let nal_unit;
      channel.payload.temporal_id = fu_indicator & 7;
      channel.payload.layer_id = fu_indicator >> 3 & 63;
      channel.payload.nal_type = nal_type;
      if (channel.payload.nal_type == 20 || channel.payload.nal_type == 19 || channel.payload.nal_type == 33) {
        channel.payload.is_key = true;
        if (channel.payload.nal_type == 33) channel.payload.exist_dsi = true;
      }
      channel.payload.start_nal_position = index;
      channel.payload.frame[index++] = 0;
      channel.payload.frame[index++] = 0;
      channel.payload.frame[index++] = 0;
      channel.payload.frame[index++] = 1;
      nal_unit = channel.payload.nal_type;
      nal_unit <<= 6;
      nal_unit |= channel.payload.layer_id & 63;
      nal_unit <<= 3;
      nal_unit |= channel.payload.temporal_id & 7;
      channel.payload.frame[index++] = nal_unit >> 8;
      channel.payload.frame[index++] = nal_unit & 255;
      channel.payload.frame.set(payload_slice, index);
      channel.payload.frame_size = index + payload_slice.byteLength;
      channel.payload.chunk_size = payload_slice.byteLength + 2;
    } else if (fu_cmd == 1) {
      if (this.annex_b == false) {
        let annex_a_index = channel.payload.start_nal_position;
        let annex_a_size = channel.payload.chunk_size + payload_slice.byteLength;
        channel.payload.frame[annex_a_index++] = annex_a_size >> 24 & 255;
        channel.payload.frame[annex_a_index++] = annex_a_size >> 16 & 255;
        channel.payload.frame[annex_a_index++] = annex_a_size >> 8 & 255;
        channel.payload.frame[annex_a_index++] = annex_a_size & 255;
      }
      channel.payload.frame.set(payload_slice, index);
      channel.payload.frame_size = index + payload_slice.byteLength;
      if (channel.payload.nal_type == 39) {
        let start_pos = channel.payload.start_nal_position;
        let end_pos = channel.payload.frame_size + channel.payload.start_nal_position;
        __privateMethod(this, _IVXMediaRTP_instances, sei_meta_data_check_fn).call(this, 6, channel.payload.frame.slice(start_pos, end_pos), channel);
      }
    } else {
      channel.payload.chunk_size += payload_slice.byteLength;
      channel.payload.frame.set(payload_slice, index);
      channel.payload.frame_size = index + payload_slice.byteLength;
    }
  } else {
    channel.payload.nal_type = fu_indicator >> 9 & 63;
    __privateMethod(this, _IVXMediaRTP_instances, single_nal_h265_payload_fn).call(this, bin, channel);
  }
};
single_nal_h265_payload_fn = function(bin, channel) {
  let index = channel.payload.frame_size;
  if (channel.payload.nal_type == 20 || channel.payload.nal_type == 19 || channel.payload.nal_type == 33) {
    channel.payload.is_key = true;
    if (channel.payload.nal_type == 33) channel.payload.exist_dsi = true;
  }
  if (channel.payload.nal_type == 39) {
    __privateMethod(this, _IVXMediaRTP_instances, sei_meta_data_check_fn).call(this, 2, bin, channel);
    return;
  }
  if (this.annex_b) {
    channel.payload.frame[index++] = 0;
    channel.payload.frame[index++] = 0;
    channel.payload.frame[index++] = 0;
    channel.payload.frame[index++] = 1;
  } else {
    channel.payload.frame[index++] = bin.byteLength >> 24 & 255;
    channel.payload.frame[index++] = bin.byteLength >> 16 & 255;
    channel.payload.frame[index++] = bin.byteLength >> 8 & 255;
    channel.payload.frame[index++] = bin.byteLength & 255;
  }
  channel.payload.frame.set(bin, index);
  channel.payload.frame_size = index + bin.byteLength;
};
parsing_h264_payload_fn = function(bin, channel) {
  let fu_type;
  let fu_cmd;
  if (bin.byteLength <= 0) return;
  fu_type = bin[0] & 31;
  fu_cmd = bin[1] >> 5;
  if (fu_type >= 1 && fu_type <= 23) fu_type = 1;
  switch (fu_type) {
    case 24:
      break;
    case 25:
      break;
    case 26:
      break;
    case 27:
      break;
    case 29:
      break;
    case 28:
      channel.payload.ref_idc = bin[0] >> 5;
      channel.payload.nal_type = bin[1] & 31;
      if (channel.payload.nal_type == 5 || channel.payload.nal_type == 7) {
        channel.payload.is_key = true;
        if (channel.payload.nal_type == 7) channel.payload.exist_dsi = true;
      }
      __privateMethod(this, _IVXMediaRTP_instances, fu_a_h264_payload_fn).call(this, bin.slice(2, bin.byteLength), fu_cmd, channel);
      break;
    default:
      __privateMethod(this, _IVXMediaRTP_instances, singla_nal_h264_payload_fn).call(this, bin, channel);
      break;
  }
};
singla_nal_h264_payload_fn = function(bin, channel) {
  let index = channel.payload.frame_size;
  channel.payload.ref_idc = bin[0] >> 5 & 3;
  channel.payload.nal_type = bin[0] & 31;
  if (channel.payload.nal_type == 5 || channel.payload.nal_type == 7) {
    channel.payload.is_key = true;
    if (channel.payload.nal_type == 7) channel.payload.exist_dsi = true;
  }
  if (channel.payload.nal_type == 6) {
    __privateMethod(this, _IVXMediaRTP_instances, sei_meta_data_check_fn).call(this, 1, bin, channel);
    return;
  }
  if (this.annex_b) {
    channel.payload.frame[index++] = 0;
    channel.payload.frame[index++] = 0;
    channel.payload.frame[index++] = 0;
    channel.payload.frame[index++] = 1;
  } else {
    channel.payload.frame[index++] = bin.byteLength >> 24 & 255;
    channel.payload.frame[index++] = bin.byteLength >> 16 & 255;
    channel.payload.frame[index++] = bin.byteLength >> 8 & 255;
    channel.payload.frame[index++] = bin.byteLength & 255;
  }
  channel.payload.frame.set(bin, index);
  channel.payload.frame_size = index + bin.byteLength;
};
fu_a_h264_payload_fn = function(bin, fu_cmd, channel) {
  let index = channel.payload.frame_size;
  if (fu_cmd == 4) {
    channel.payload.start_nal_position = index;
    channel.payload.frame[index++] = 0;
    channel.payload.frame[index++] = 0;
    channel.payload.frame[index++] = 0;
    channel.payload.frame[index++] = 1;
    channel.payload.frame[index++] = channel.payload.ref_idc << 5 | channel.payload.nal_type & 31;
    channel.payload.frame.set(bin, index);
    channel.payload.frame_size = index + bin.byteLength;
    channel.payload.chunk_size = bin.byteLength + 1;
  } else if (fu_cmd == 0) {
    channel.payload.chunk_size += bin.byteLength;
    channel.payload.frame.set(bin, index);
    channel.payload.frame_size = index + bin.byteLength;
  } else if (fu_cmd == 2) {
    if (this.annex_b == false) {
      let annex_a_index = channel.payload.start_nal_position;
      let annex_a_size = channel.payload.chunk_size + bin.byteLength;
      channel.payload.frame[annex_a_index++] = annex_a_size >> 24 & 255;
      channel.payload.frame[annex_a_index++] = annex_a_size >> 16 & 255;
      channel.payload.frame[annex_a_index++] = annex_a_size >> 8 & 255;
      channel.payload.frame[annex_a_index++] = annex_a_size & 255;
    }
    channel.payload.frame.set(bin, index);
    channel.payload.frame_size = index + bin.byteLength;
    if (channel.payload.nal_type == 6) {
      let start_pos = channel.payload.start_nal_position;
      let end_pos = channel.payload.frame_size + channel.payload.start_nal_position;
      __privateMethod(this, _IVXMediaRTP_instances, sei_meta_data_check_fn).call(this, 5, channel.payload.frame.slice(start_pos, end_pos), channel);
    }
  }
};
flush_channel_data_fn = function(media_info, channel) {
  if (this.decoder && media_info) {
    if (channel.payload.frame_size > 0) {
      if (media_info.media_type == "video") {
        var meta_json_obj = null;
        var current_timestamp = performance.now();
        try {
          if (this.use_meta) {
            var arg_meta_data = channel.va_meta ? this.ivx_meta.convert_arg(channel.va_meta, "u8") : null;
            var arg_meta_len = channel.va_meta ? channel.va_meta.length : 0;
            var res = this.ivx_meta.run_interface("vameta_decomp_parser", arg_meta_data, arg_meta_len);
            if (res == 0) {
              var json_data = this.ivx_meta.convert_result(this.ivx_meta.run_interface("vameta_get_json_data"), "str", this.ivx_meta.run_interface("vameta_get_json_length"));
              if (json_data && json_data.length > 0) meta_json_obj = JSON.parse(json_data);
            }
          }
        } catch (e) {
          meta_json_obj = null;
        }
        if (!this.gen_interval_post) this.gen_interval_post = current_timestamp;
        if (current_timestamp - this.gen_interval_post >= 100) {
          if (this.time_gen && this.time_gen.callback) this.time_gen.callback(current_timestamp, this.time_gen.opaque);
          this.gen_interval_post = current_timestamp;
        }
        this.decoder.put_video_frame(channel, meta_json_obj);
      } else if (media_info.media_type == "audio") {
        this.decoder.put_audio_frame(media_info, channel);
      }
    }
  }
  __privateMethod(this, _IVXMediaRTP_instances, clear_channel_payload_fn).call(this, channel);
};
clear_channel_payload_fn = function(channel) {
  if (channel.payload) {
    channel.payload.ref_idc = 0;
    channel.payload.nal_type = 0;
    channel.payload.exist_dsi = false;
    channel.payload.is_key = false;
    channel.payload.frame_size = 0;
    channel.va_meta = null;
  }
};
sei_meta_data_check_fn = function(check_index, bin, channel) {
  let index = check_index;
  let sei_payload_size = 0;
  if (bin[index++] == 5) {
    for (; index < bin.byteLength; index++) {
      sei_payload_size += bin[index];
      if (bin[index] != 255) break;
    }
    index += 1;
    let guid = bin.slice(index, index + 16).join("");
    index += 16;
    if (guid === this.NVR_TIME_SEI_GUID) {
      let play_timestamp = 0n;
      let c = 0, length = index + 16;
      while (index < length) {
        c = (bin[index] >> 6 & 1) * 9 + (bin[index++] & 15) << 4;
        c |= (bin[index] >> 6 & 1) * 9 + (bin[index++] & 15);
        play_timestamp <<= 8n;
        play_timestamp |= BigInt(c);
      }
      channel.play_timestamp = BigInt(play_timestamp);
    } else if (guid == this.NVR_META_SEI_GUID) {
      channel.va_meta = bin.slice(index, bin.byteLength - 1);
    }
  }
};
export {
  IVXMediaRTP as default
};
