var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
const _IVXEventText = class _IVXEventText {
  static chnage_language(lang) {
    if (lang == "KR") {
      _IVXEventText.event_type_string = _IVXEventText.EVENT_TYPES_KR;
      _IVXEventText.object_type_string = _IVXEventText.OBJECT_TYPES_KR;
      _IVXEventText.vehicle_type_string = _IVXEventText.VEHICLE_TYPES_KR;
    } else if (lang = "EN") {
      _IVXEventText.event_type_string = _IVXEventText.EVENT_TYPES_EN;
      _IVXEventText.object_type_string = _IVXEventText.OBJECT_TYPES_EN;
      _IVXEventText.vehicle_type_string = _IVXEventText.VEHICLE_TYPES_EN;
    }
  }
  static event_type_to_string_v1(event_type, event_count) {
    if (event_count == 0) return "";
    try {
      if (event_type == 0) return _IVXEventText.event_type_string[0];
      else if (1 & event_type) return _IVXEventText.event_type_string[0];
      else if (2 & event_type) return _IVXEventText.event_type_string[1];
      else if (4 & event_type) return _IVXEventText.event_type_string[2];
      else if (8 & event_type) return _IVXEventText.event_type_string[3];
      else if (16 & event_type) return _IVXEventText.event_type_string[4];
      else if (32 & event_type) return _IVXEventText.event_type_string[5];
      else if (64 & event_type) return _IVXEventText.event_type_string[6];
      else if (128 & event_type) return _IVXEventText.event_type_string[7];
      else if (256 & event_type) return _IVXEventText.event_type_string[8];
      else if (512 & event_type) return _IVXEventText.event_type_string[9];
      else if (1024 & event_type) return _IVXEventText.event_type_string[10];
      else if (2048 & event_type) return _IVXEventText.event_type_string[11];
      else if (4096 & event_type) return _IVXEventText.event_type_string[12];
      else if (8192 & event_type) return _IVXEventText.event_type_string[13];
      else if (16384 & event_type) return _IVXEventText.event_type_string[14];
      else if (32768 & event_type) return _IVXEventText.event_type_string[15];
      else if (65536 & event_type) return _IVXEventText.event_type_string[16];
      else if (131072 & event_type) return _IVXEventText.event_type_string[17];
      else if (262144 & event_type) return _IVXEventText.event_type_string[18];
      else if (524288 & event_type) return _IVXEventText.event_type_string[19];
      else if (1048576 & event_type) return _IVXEventText.event_type_string[20];
      else if (2097152 & event_type) return _IVXEventText.event_type_string[21];
      else if (4194304 & event_type) return _IVXEventText.event_type_string[22];
      else if (8388608 & event_type) return _IVXEventText.event_type_string[23];
      else if (16777216 & event_type) return _IVXEventText.event_type_string[24];
      else if (33554432 & event_type) return _IVXEventText.event_type_string[25];
      else if (67108864 & event_type) return _IVXEventText.event_type_string[26];
      else if (134217728 & event_type) return _IVXEventText.event_type_string[27];
      else if (268435456 & event_type) return _IVXEventText.event_type_string[28];
      else if (536870912 & event_type) return _IVXEventText.event_type_string[29];
      else if (1073741824 & event_type) return _IVXEventText.event_type_string[20];
      else if (2147483648 & event_type) return _IVXEventText.event_type_string[21];
      else if (4294967296 & event_type) return _IVXEventText.event_type_string[22];
      else if (8589934592 & event_type) return _IVXEventText.event_type_string[23];
      else if (17179869184 & event_type) return _IVXEventText.event_type_string[24];
      else if (34359738368 & event_type) return _IVXEventText.event_type_string[25];
      else if (68719476736 & event_type) return _IVXEventText.event_type_string[26];
      else if (137438953472 & event_type) return _IVXEventText.event_type_string[27];
      else if (274877906944 & event_type) return _IVXEventText.event_type_string[28];
      else if (549755813888 & event_type) return _IVXEventText.event_type_string[29];
      else if (1099511627776 & event_type) return _IVXEventText.event_type_string[30];
      else if (2199023255552 & event_type) return _IVXEventText.event_type_string[31];
      else if (4398046511104 & event_type) return _IVXEventText.event_type_string[32];
      else if (8796093022208 & event_type) return _IVXEventText.event_type_string[33];
      else if (17592186044416 & event_type) return _IVXEventText.event_type_string[34];
      else if (35184372088832 & event_type) return _IVXEventText.event_type_string[35];
      else if (70368744177664 & event_type) return _IVXEventText.event_type_string[36];
      else if (140737488355328 & event_type) return _IVXEventText.event_type_string[37];
      else if (281474976710656 & event_type) return _IVXEventText.event_type_string[38];
      else if (562949953421312 & event_type) return _IVXEventText.event_type_string[39];
      else if (1125899906842624 & event_type) return _IVXEventText.event_type_string[40];
      else if (2251799813685248 & event_type) return _IVXEventText.event_type_string[41];
      else if (4503599627370496 & event_type) return _IVXEventText.event_type_string[42];
      else if (9007199254740992 & event_type) return _IVXEventText.event_type_string[43];
      else if (18014398509481984 & event_type) return _IVXEventText.event_type_string[44];
      else if (36028797018963970 & event_type) return _IVXEventText.event_type_string[45];
      else if (72057594037927940 & event_type) return _IVXEventText.event_type_string[46];
      else if (144115188075855870 & event_type) return _IVXEventText.event_type_string[47];
      else if (288230376151711740 & event_type) return _IVXEventText.event_type_string[48];
      else return "";
    } catch (e) {
      return "";
    }
  }
  static event_type_to_string_v2(event_type, event_count) {
    if (event_count == 0) return "";
    try {
      return _IVXEventText.event_type_string[event_type];
    } catch (e) {
      return "";
    }
  }
  static object_type_to_string(object_type) {
    switch (object_type) {
      case 1:
        return _IVXEventText.object_type_string[0];
      case 2:
        return _IVXEventText.object_type_string[1];
      case 4:
        return _IVXEventText.object_type_string[2];
      case 8:
        return _IVXEventText.object_type_string[3];
      case 16:
        return _IVXEventText.object_type_string[4];
      case 32:
        return _IVXEventText.object_type_string[5];
      case 64:
        return _IVXEventText.object_type_string[6];
      case 128:
        return _IVXEventText.object_type_string[7];
      case 256:
        return _IVXEventText.object_type_string[8];
      case 512:
        return _IVXEventText.object_type_string[9];
      case 1024:
        return _IVXEventText.object_type_string[10];
      case 2048:
        return _IVXEventText.object_type_string[11];
      case 4096:
        return _IVXEventText.object_type_string[12];
      case 8192:
        return _IVXEventText.object_type_string[13];
      case 16384:
        return _IVXEventText.object_type_string[14];
      case 32768:
        return _IVXEventText.object_type_string[15];
      case 65536:
        return _IVXEventText.object_type_string[16];
      case 131072:
        return _IVXEventText.object_type_string[17];
      case 262144:
        return _IVXEventText.object_type_string[18];
      case 524288:
        return _IVXEventText.object_type_string[19];
      case 1048576:
        return _IVXEventText.object_type_string[20];
      case 2097152:
        return _IVXEventText.object_type_string[21];
      case 4194304:
        return _IVXEventText.object_type_string[22];
      case 8388608:
        return _IVXEventText.object_type_string[23];
      case 16777216:
        return _IVXEventText.object_type_string[24];
      case 33554432:
        return _IVXEventText.object_type_string[25];
      case 67108864:
        return _IVXEventText.object_type_string[26];
      case 134217728:
        return _IVXEventText.object_type_string[27];
      case 268435456:
        return _IVXEventText.object_type_string[28];
      case 1152921504606847e3:
        return _IVXEventText.object_type_string[29];
      default:
        return "";
    }
  }
  static vehicle_type_to_string(vehicle_attr) {
    switch (vehicle_attr) {
      case 0:
        return _IVXEventText.vehicle_type_string[0];
      case 1:
        return _IVXEventText.vehicle_type_string[0];
      case 2:
        return _IVXEventText.vehicle_type_string[1];
      case 4:
        return _IVXEventText.vehicle_type_string[2];
      case 8:
        return _IVXEventText.vehicle_type_string[3];
      case 16:
        return _IVXEventText.vehicle_type_string[4];
      case 32:
        return _IVXEventText.vehicle_type_string[5];
      case 64:
        return _IVXEventText.vehicle_type_string[6];
      case 128:
        return _IVXEventText.vehicle_type_string[7];
      case 256:
        return _IVXEventText.vehicle_type_string[8];
      case 512:
        return _IVXEventText.vehicle_type_string[9];
      case 1024:
        return _IVXEventText.vehicle_type_string[10];
      case 2048:
        return _IVXEventText.vehicle_type_string[11];
      case 4096:
        return _IVXEventText.vehicle_type_string[12];
      case 8192:
        return _IVXEventText.vehicle_type_string[13];
      case 16384:
        return _IVXEventText.vehicle_type_string[14];
      case 32768:
        return _IVXEventText.vehicle_type_string[15];
      case 65536:
        return _IVXEventText.vehicle_type_string[16];
      case 131072:
        return _IVXEventText.vehicle_type_string[17];
      case 262144:
        return _IVXEventText.vehicle_type_string[18];
      default:
        return "";
    }
  }
};
__publicField(_IVXEventText, "EVENT_TYPES_KR", [
  "배회",
  "경로 통과",
  "방향성 이동",
  "진입",
  "진출",
  "멈춤",
  "버려짐",
  "경계선 통과",
  "연기",
  "불꽃",
  "쓰러짐",
  "군중",
  "폭행",
  "다중선 교차",
  "교통 사고",
  "자동차 정지",
  "교통 혼잡",
  "색상 변경",
  "주차",
  "제거됨",
  "수위",
  "영역 색상",
  "체류",
  "밀집",
  "대기 지연",
  "잔류인원 거주",
  "안전모 미착용",
  "차량 도킹",
  "차량 도킹 해제",
  "고립",
  "접근",
  "좌측 이탈",
  "자세",
  "자동차 테일게이팅",
  "자동차 추월",
  "무단횡단",
  "무단 게이트 통과",
  "마스크 미착용",
  "안전 조끼 미착용",
  "SOW 상태",
  "SOW 상태 서",
  "SOW 상태 분만",
  "SOW 상태 거짓말",
  "보행자 위험",
  "",
  "작업복 미착용",
  "횡단보도 통계",
  "라이트 플래시",
  "번호 인식",
  "게이지 기록",
  "케이크 기록",
  "화면 이상",
  "화면 이상 결함",
  "화면 이상 정지",
  "카라비너 없음",
  "코레일 노유니폼",
  "군중 밀도",
  "얼굴 인식",
  "번호판",
  "흉기위협"
]);
__publicField(_IVXEventText, "OBJECT_TYPES_KR", [
  "사람",
  "차량",
  "미인식",
  "얼굴",
  "불꽃",
  "연기",
  "수위",
  "군중",
  "머리",
  "풍선",
  "유모차",
  "바퀴 달린 의자",
  "어린이",
  "성인",
  "두루미",
  "번호판",
  "동물",
  "배",
  "요약",
  "비행 물체",
  "카라비너",
  "하네스",
  "트래픽 콘",
  "안전블록",
  "무기",
  "게이지",
  "빛",
  "숫자",
  "",
  "케이크"
]);
__publicField(_IVXEventText, "VEHICLE_TYPES_KR", [
  "차량",
  "세단",
  "SUV",
  "밴",
  "트럭",
  "버스",
  "이륜차",
  "크레인",
  "덤프 트럭",
  "포크 리프트",
  "굴착기",
  "믹서 트럭",
  "화물차",
  "레미콘",
  "타워 크레인",
  "중장비",
  "소형 트럭",
  "대형 트럭",
  "농기계"
]);
__publicField(_IVXEventText, "EVENT_TYPES_EN", [
  "Loitering",
  "Route Passing",
  "Directional Movement",
  "Entering",
  "Exiting",
  "Stopping",
  "Abandoned",
  "Boundary Crossing",
  "Smoke",
  "Fire",
  "Callapse",
  "Crowd",
  "Violence",
  "Multi-line Crossing",
  "Traffic Accident",
  "Vehicle Stop",
  "Traffic Congestion",
  "Color Change",
  "Parking",
  "Removed",
  "Water Level",
  "Area Color",
  "Staying",
  "Congestion",
  "Waiting Delay",
  "Residual Personnel Residence",
  "No Safety Helmet",
  "Vehicle Docking",
  "Vehicle Undocking",
  "Isolation",
  "Approaching",
  "Left Departure",
  "Posture",
  "Vehicle Tailgating",
  "Vehicle Overtaking",
  "Jaywalking",
  "Unauthorized Gate Passing",
  "No Mask",
  "No Safety Vest",
  "SOW Status",
  "SOW Status Standing",
  "SOW Status Delivery",
  "SOW Status Lying",
  "Pedestrian Danger",
  "",
  "No Work Clothes",
  "Crosswalk Statistics",
  "Light Flash",
  "Number Recognition",
  "Gauge Recording",
  "Cake Recording",
  "Screen Anomaly",
  "Screen Anomaly Defect",
  "Screen Anomaly Stop",
  "No Carabiner",
  "KORAIL No Uniform",
  "Crowd Density",
  "Face Recognition",
  "License Plate",
  "Weapon Threat"
]);
__publicField(_IVXEventText, "OBJECT_TYPES_EN", [
  "Person",
  "Vehicle",
  "Unrecognized",
  "Face",
  "Flame",
  "Smoke",
  "Water Level",
  "Crowd",
  "Head",
  "Balloon",
  "Stroller",
  "Wheeled Chair",
  "Child",
  "Adult",
  "Crane",
  "License Plate",
  "Animal",
  "Ship",
  "Summary",
  "Flying Object",
  "Carabiner",
  "Harness",
  "Traffic Cone",
  "Safety Block",
  "Weapon",
  "Gauge",
  "Light",
  "Number",
  "",
  "Cake"
]);
__publicField(_IVXEventText, "VEHICLE_TYPES_EN", [
  "Vehicle",
  "Sedan",
  "SUV",
  "Van",
  "Truck",
  "Bus",
  "Two-Wheeled Vehicle",
  "Crane",
  "Dump Truck",
  "Forklift",
  "Excavator",
  "Mixer Truck",
  "Freight Car",
  "Ready-Mixed Concrete",
  "Tower Crane",
  "Heavy Equipment",
  "Small Truck",
  "Large Truck",
  "Agricultural Machinery"
]);
__publicField(_IVXEventText, "event_type_string", _IVXEventText.EVENT_TYPES_KR);
__publicField(_IVXEventText, "object_type_string", _IVXEventText.OBJECT_TYPES_KR);
__publicField(_IVXEventText, "vehicle_type_string", _IVXEventText.VEHICLE_TYPES_KR);
let IVXEventText = _IVXEventText;
export {
  IVXEventText as default
};
