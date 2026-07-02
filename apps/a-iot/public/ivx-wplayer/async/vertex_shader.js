var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
class IVXVertexShader {
}
__publicField(IVXVertexShader, "source", `
attribute vec2 xy;
varying highp vec2 uv;
void main(void) 
{
    gl_Position = vec4(xy, 0.0, 1.0);
    uv = vec2((1.0 + xy.x) / 2.0, (1.0 - xy.y) / 2.0);
}
`);
export {
  IVXVertexShader as default
};
