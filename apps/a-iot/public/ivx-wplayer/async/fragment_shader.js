var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
class IVXFragmentShader {
}
__publicField(IVXFragmentShader, "source", `
precision mediump float;
const int MAX_BOX = 100;
varying highp vec2 uv;
uniform sampler2D texture;
uniform sampler2D pannel_2d;

// 객체 박스
uniform vec4 u_roi_box[MAX_BOX];
uniform int u_is_event_box[MAX_BOX];
uniform float u_box_thick;
uniform vec2 u_start_offset;

// 이벤트 존 영역
const int MAX_EVT_ZONE_PT = 100;		
uniform vec2 u_evt_zone_pts[MAX_EVT_ZONE_PT];

// 이벤트 존 경계선 통과
const int MAX_EVT_ZONE_CROSSING = 100;
uniform float u_evt_zone_crossing[MAX_EVT_ZONE_CROSSING];

// 이벤트 존 방향성 이동
const int MAX_EVT_ZONE_DIRECTIONAL = 100;
uniform vec4 u_directional_movement[MAX_EVT_ZONE_DIRECTIONAL];


// 사각형 외곽선인지 내부인지 체크하는 함수
int check_rectangle(vec2 st, vec4 rect, float bthick)
{
    float vthick = bthick/2.0;
    bool b_y_axis  = (st.y < (rect.y + vthick) && st.y > (rect.y - vthick)) || ( st.y <= (rect.y - rect.w + vthick) && st.y >= (rect.y - rect.w - vthick) );
    bool b_x_axis  = (st.x < (rect.x + vthick) && st.x > (rect.x - vthick)) || ( st.x <= (rect.x + rect.z + vthick) && st.x >= (rect.x + rect.z - vthick) );
    bool b_x_range = (st.x >= rect.x && st.x <= (rect.x + rect.z));
    bool b_y_range = (st.y <= rect.y && st.y >= (rect.y - rect.w));
    
    if (b_y_axis && b_x_range) 		  return 1;
    else if (b_x_axis && b_y_range)   return 1;
    else if (b_x_range && b_y_range)  return 2;
    return 0;
}

// v1과 v2를 잇는 선분 사이에 있는 점인지 확인하는 함수
bool is_point_on_line(vec2 p, vec2 v1, vec2 v2, float thickness)
{
    // p v1,v2의 외적값을 length로 나눠서 점 p가 v1~v2 선분에 얼마나 가까이 있는지 길이 계산
    float d = length(cross(vec3(v2 - v1, 0.0), vec3(p - v1, 0.0))) / length(v2 - v1);
    
    // p가 v1과 v2 사이에 있지 않으면 선 위에 있지 않음
    float dot_product = dot(p - v1, v2 - v1);
    if (dot_product < 0.0 || dot_product > dot(v2 - v1, v2 - v1))
    {
        return false; 
    }
    
    // 픽셀 두께 이하이면 p가 v1~v2를 잇는 선분 내부에 있는 것
    return d <= thickness;
}

float sign(vec2 p1, vec2 p2, vec2 p3)
{
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
}

bool point_in_triangle(vec2 p, vec2 v1, vec2 v2, vec2 v3)
{
    float d1, d2, d3;
    bool has_neg, has_pos;

    d1 = sign(p, v1, v2);
    d2 = sign(p, v2, v3);
    d3 = sign(p, v3, v1);

    has_neg = (d1 < 0.0) || (d2 < 0.0) || (d3 < 0.0);
    has_pos = (d1 > 0.0) || (d2 > 0.0) || (d3 > 0.0);

    return !(has_neg && has_pos);
}

void main(void)
{
    vec4 flag_color = texture2D(texture, uv);
    int check_color = 0;

    // 객체 박스
    for (int i = 0 ; i < MAX_BOX ; i++)
    {
        float box_height = u_roi_box[i].w;
        if (u_roi_box[i].x < 0.0 ) break;
        else if (u_roi_box[i].w < 0.0)
        {
            box_height = u_roi_box[i].w * -1.0;
            //is_event = true;
        }

        bool is_event = (u_is_event_box[i] > 0) ? true : false;
        vec4 box_pos = vec4(u_roi_box[i].x + u_start_offset.x, u_roi_box[i].y + u_start_offset.y, u_roi_box[i].z, box_height);
        if (is_event)
        {
            check_color = check_rectangle(gl_FragCoord.xy, box_pos, u_box_thick+2.0);
            if (check_color == 1) flag_color += vec4(vec3(1.0, 0.0, 0.0), 1);
            else if (check_color == 2) flag_color += vec4(vec3(0.1, 0.0, 0.0), 0.010);
        }
        else
        {
            check_color = check_rectangle(gl_FragCoord.xy, box_pos, u_box_thick);
            if (check_color == 1) flag_color += vec4( vec3(1.0, 0.314, 0.0), 1);
            else if (check_color == 2) flag_color += vec4( vec3(0.1, 0.1, 0.0), 0.0001);
        }
    }

    // 이벤트 존 영역
    for (int i = 0; i < MAX_EVT_ZONE_PT; i++)
    {
        // 마지막이면 break;
        if (u_evt_zone_pts[i].x == -1.0 || u_evt_zone_pts[i + 1].x == -1.0)
        {
            break;
        }

        // 하나의 이벤트 존이 끝났으면 continue;
        if (u_evt_zone_pts[i].x == -2.0 || u_evt_zone_pts[i + 1].x == -2.0)
        { 
            continue;
        }

        // 현재 픽셀이 선분 사이의 픽셀이면 노란색상
        if (is_point_on_line(gl_FragCoord.xy, u_evt_zone_pts[i] + u_start_offset, u_evt_zone_pts[i + 1] + u_start_offset, 1.0)) 
        {
            flag_color = vec4(1.0, 1.0, 0.0, 0.75); 
        }
    }

    // 이벤트 존 경계선 통과
    for (int i = 0; i < MAX_EVT_ZONE_CROSSING; i+=8)
    {
        if (u_evt_zone_crossing[i] == -1.0 || u_evt_zone_crossing[i + 1] == -1.0)
        {
            break;
        }

        if (u_evt_zone_crossing[i] == -2.0 || u_evt_zone_crossing[i + 1] == -2.0)
        {
            continue;
        }
        
        // 끝점 기준의 방향 ex) 끝점에 내가 서있을때의 방향
        // 방향성 (0: 왼쪽, 1: 오른쪽, 2: 양쪽) , start , end
        int direction = int(u_evt_zone_crossing[i]);
        vec2 start = vec2(u_evt_zone_crossing[i + 1] + u_start_offset.x, u_evt_zone_crossing[i + 2] + u_start_offset.y);
        vec2 end = vec2(u_evt_zone_crossing[i + 3] + u_start_offset.x, u_evt_zone_crossing[i + 4] + u_start_offset.y);
        int is_multi = int(u_evt_zone_crossing[i + 5]);
        if (start.x <= 0.0 || start.y <= 0.0 || end.x <= 0.0 || end.y <= 0.0)
        {
            continue;
        }

        // 선분 벡터와 중점 계산
        vec2 line_vector = end - start;
        vec2 mid_point = start + 0.5 * line_vector;

        // 선분 방향 정규화
        vec2 line_dir = normalize(line_vector);

        // 시계방향 수직 벡터 계산
        vec2 perpendicular = vec2(-line_dir.y, line_dir.x);

        // 선분을 그리기위한 거리 계산
        float distance_to_line = length(cross(vec3(line_vector, 0.0), vec3(gl_FragCoord.xy - start, 0.0))) / length(line_vector);

        // 선분 그리기 (파란색)
        if (is_point_on_line(gl_FragCoord.xy, start, end, 1.0))
        {
            flag_color = vec4(0.0, 0.0, 1.0, 0.75);
        }
        
        // 화살표 그리기 위한 중점 거리 계산
        float distance_to_midpoint = length(gl_FragCoord.xy - mid_point);
        
        // 방향성에 따른 화살표 그리기
        float arrow_length = 30.0;
        float arrow_thickness = 2.0;
        float arrow_line_thickness = 3.0;
        if (distance_to_midpoint < arrow_length)
        {
            vec2 arrow_head_point;
            vec2 tri_bottom_center;
            vec2 tri_bottom_left;
            vec2 tri_bottom_right;

            // 끝점에 내가 섰을때의 왼쪽/오른쪽 방향
            if (is_multi > 0)
            {
                // 양방향
                if (direction == 1)
                {
                    // 끝점에서 왼쪽
                    arrow_head_point = mid_point + (-perpendicular * (arrow_length * 0.7));
                    if (is_point_on_line(gl_FragCoord.xy, mid_point, arrow_head_point, arrow_line_thickness))
                    {
                        flag_color = vec4(1.0, 0.0, 0.0, 0.75);
                    }
                    tri_bottom_center = arrow_head_point - (-perpendicular * arrow_thickness * 4.0);
                    tri_bottom_left = tri_bottom_center + (-line_dir * arrow_thickness * 5.0);
                    tri_bottom_right = tri_bottom_center + (line_dir * arrow_thickness * 5.0);
                    
                    arrow_head_point = mid_point + (-perpendicular * (arrow_length * 0.9));
                    if (point_in_triangle(gl_FragCoord.xy, tri_bottom_left, arrow_head_point, tri_bottom_right))
                    {
                        flag_color = vec4(1.0, 0.0, 0.0, 0.75);
                    }

                    // 끝점에서 오른쪽
                    arrow_head_point = mid_point + (perpendicular * (arrow_length * 0.7));
                    if (is_point_on_line(gl_FragCoord.xy, mid_point, arrow_head_point, arrow_line_thickness))
                    {
                        flag_color = vec4(1.0, 0.0, 0.0, 0.75);
                    }

                    tri_bottom_center = arrow_head_point - (perpendicular * arrow_thickness * 4.0);
                    tri_bottom_left = tri_bottom_center + (-line_dir * arrow_thickness * 5.0);
                    tri_bottom_right = tri_bottom_center + (line_dir * arrow_thickness * 5.0);

                    arrow_head_point = mid_point + (perpendicular * (arrow_length * 0.9));
                    if (point_in_triangle(gl_FragCoord.xy, tri_bottom_right, arrow_head_point, tri_bottom_left))
                    {
                        flag_color = vec4(1.0, 0.0, 0.0, 0.75);
                    }
                }
                // 단방향
                else
                {
                    arrow_head_point = mid_point + (-perpendicular * (arrow_length * 0.7));
                    if (is_point_on_line(gl_FragCoord.xy, mid_point, arrow_head_point, arrow_line_thickness))
                    {
                        flag_color = vec4(1.0, 0.0, 0.0, 0.75);
                    }
                    tri_bottom_center = arrow_head_point - (-perpendicular * arrow_thickness * 4.0);
                    tri_bottom_left = tri_bottom_center + (-line_dir * arrow_thickness * 5.0);
                    tri_bottom_right = tri_bottom_center + (line_dir * arrow_thickness * 5.0);
                    
                    arrow_head_point = mid_point + (-perpendicular * (arrow_length * 0.9));
                    if (point_in_triangle(gl_FragCoord.xy, tri_bottom_left, arrow_head_point, tri_bottom_right))
                    {
                        flag_color = vec4(1.0, 0.0, 0.0, 0.75);
                    }
                }
            }
            else
            {
                // 왼쪽 방향 화살표
                if (direction == 0 || direction == 2)
                {
                    arrow_head_point = mid_point + (-perpendicular * (arrow_length * 0.7));
                    if (is_point_on_line(gl_FragCoord.xy, mid_point, arrow_head_point, arrow_line_thickness))
                    {
                        flag_color = vec4(1.0, 0.0, 0.0, 0.75);
                    }

                    tri_bottom_center = arrow_head_point - (-perpendicular * arrow_thickness * 4.0);
                    tri_bottom_left = tri_bottom_center + (-line_dir * arrow_thickness * 5.0);
                    tri_bottom_right = tri_bottom_center + (line_dir * arrow_thickness * 5.0);

                    arrow_head_point = mid_point + (-perpendicular * (arrow_length * 0.9));
                    if (point_in_triangle(gl_FragCoord.xy, tri_bottom_left, arrow_head_point, tri_bottom_right))
                    {
                        flag_color = vec4(1.0, 0.0, 0.0, 0.75);
                    }
                }

                // 오른쪽 방향 화살표
                if (direction == 1 || direction == 2)
                {
                    arrow_head_point = mid_point + (perpendicular * (arrow_length * 0.7));
                    if (is_point_on_line(gl_FragCoord.xy, mid_point, arrow_head_point, arrow_line_thickness))
                    {
                        flag_color = vec4(1.0, 0.0, 0.0, 0.75);
                    }

                    tri_bottom_center = arrow_head_point - (perpendicular * arrow_thickness * 4.0);
                    tri_bottom_left = tri_bottom_center + (-line_dir * arrow_thickness * 5.0);
                    tri_bottom_right = tri_bottom_center + (line_dir * arrow_thickness * 5.0);

                    arrow_head_point = mid_point + (perpendicular * (arrow_length * 0.9));
                    if (point_in_triangle(gl_FragCoord.xy, tri_bottom_right, arrow_head_point, tri_bottom_left))
                    {
                        flag_color = vec4(1.0, 0.0, 0.0, 0.75);
                    }
                }
            }
            
        }
    }

    for (int i = 0; i < MAX_EVT_ZONE_DIRECTIONAL; i++)
    {
        if (u_directional_movement[i].z <= 0.0 || u_directional_movement[i].w <= 0.0)
        {
            break;
        } 

        float direction = u_directional_movement[i].x;
        float range = u_directional_movement[i].y;
        float center_x = u_directional_movement[i].z + u_start_offset.x;
        float center_y = u_directional_movement[i].w + u_start_offset.y;
        vec2 center_point = vec2(center_x, center_y);

        float start_angle = 0.0;
        float end_angle = 0.0;
        
        // start, end 각도 계산
        if (direction >= 0.0)
        {
            start_angle = (360.0 - direction) - (range / 2.0);
            end_angle = (360.0 - direction) + (range / 2.0);
        }
        else
        {
            direction = abs(direction);
            start_angle = direction - (range / 2.0);
            end_angle = direction + (range / 2.0);
        }

        // 중간 각도 계산
        float center_angle = (start_angle + end_angle) / 2.0;

        // 각도 정규화
        if (start_angle >= 360.0)
        {
            start_angle -= 360.0;
        }
        else if (start_angle < 0.0)
        {
            start_angle += 360.0;
        }

        if (end_angle >= 360.0)
        {
            end_angle -= 360.0;
        }
        else if (end_angle < 0.0)
        {
            end_angle += 360.0;
        }

        // 현재점과 중심점의 방향 벡터
        vec2 dir = gl_FragCoord.xy - vec2(center_x, center_y);

        // 현재점과 중심점까지의 거리
        float distance = length(dir);
        
        // 현재 점의 각도
        float angle = atan(dir.y, dir.x);
        angle = degrees(angle);

        if (angle < 0.0)
        {
            angle += 360.0;
        } 

        float radius = 40.0;
        float line_thick = 2.0;
        float min_radius = radius - line_thick * 0.5;
        float max_radius = radius + line_thick * 0.5;

        // 선의 끝점 계산
        vec2 start_point = vec2(center_x, center_y) + vec2(cos(radians(start_angle)), sin(radians(start_angle))) * max_radius;
        vec2 end_point = vec2(center_x, center_y) + vec2(cos(radians(end_angle)), sin(radians(end_angle))) * max_radius;

        // 호의 내부와 선 그리기
        if (distance >= min_radius && distance <= max_radius )
        {
            if (start_angle > end_angle)
            {
                if ((angle >= start_angle && angle <= 360.0) || (angle >= 0.0 && angle <= end_angle))
                {
                    flag_color = vec4(1.0, 0.0, 0.0, 0.75);
                }
            }
            else
            {
                // 360도를 넘지 않는 일반적인 경우
                if (angle >= start_angle && angle <= end_angle) 
                {
                    flag_color = vec4(1.0, 0.0, 0.0, 0.75);
                }
            }
        } 
        else if (is_point_on_line(gl_FragCoord.xy, start_point, center_point, 1.0) || is_point_on_line(gl_FragCoord.xy, end_point, center_point, 1.0))
        {
            flag_color = vec4(1.0, 0.0, 0.0, 0.75);   // 선의 색상
        }

        // center_angle -> radian
        float angle_rad = radians(center_angle);
        
        // 단위벡터
        vec2 line_unit_vector = vec2(cos(angle_rad), sin(angle_rad)); 
        vec2 line_end = center_point + line_unit_vector * (radius + 15.0);
        vec2 arrow_head_point = center_point + line_unit_vector * (radius + 20.0);

        // 선분 유닛 벡터
        vec2 line_vector = line_end - center_point;
        vec2 line_dir = normalize(line_vector);

        // 시계방향 수직 벡터 계산
        vec2 perpendicular = vec2(-line_dir.y, line_dir.x);

        // 삼각형 그리기 , bottom_center 값을 조정하면 삼각형 커짐
        vec2 tri_bottom_center = arrow_head_point - (line_dir * line_thick * 4.0);
        vec2 tri_bottom_left = tri_bottom_center + (-perpendicular * line_thick * 5.0);
        vec2 tri_bottom_right = tri_bottom_center + (perpendicular * line_thick * 5.0);
        if (point_in_triangle(gl_FragCoord.xy, tri_bottom_right, arrow_head_point, tri_bottom_left))
        {
            flag_color = vec4(1.0, 0.0, 0.0, 0.75);
        }

        // 선분 그리기
        if (is_point_on_line(gl_FragCoord.xy, center_point, line_end, 3.0))
        {
            flag_color = vec4(1.0, 0.0, 0.0, 0.75);
        }
    }

    gl_FragColor = flag_color;
}
`);
export {
  IVXFragmentShader as default
};
