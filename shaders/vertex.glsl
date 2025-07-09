#define PI 3.1415926535897932384626433832795;

vec3 pos;

uniform float shakeTime;
uniform float shakeProgress;
uniform bool isFractured;
uniform float fractureProgress;

vec3 shake(vec3 pos)
{
    if(isFractured) return pos;
    float shakeX = sin(shakeTime * 20.0 + position.y * 10.0);
    float shakeY = cos(shakeTime * 25.0 + position.x * 10.0);
    float shakeZ = sin(shakeTime * 15.0 + position.z * 10.0);
    pos += vec3(shakeX, shakeY, shakeZ) * shakeProgress;

    return pos;
}

vec3 hash3(vec3 p)
{
    float a = dot(p, vec3(127.1, 311.7, 74.7));
    float b = dot(p, vec3(269.5, 183.3, 246.1));
    float c = dot(p, vec3(113.5, 271.9, 124.6));

    return fract(sin(vec3(a, b, c)) * 45000.0);
}

vec3 fracture(vec3 pos)
{
    if(fractureProgress <= 0.0) return pos;

    vec3 dir = normalize(hash3(pos) - 0.5);
    pos += dir * fractureProgress;

    float angle = fractureProgress * PI;
    float sine = sin(angle);
    float cosine = cos(angle);
    mat3 rot = mat3(
    cosine, 0.0, sine,
    0.0, 1.0, 0.0,
    -sine, 0.0, cosine);

    return pos * rot;
}

void main()
{
    pos = shake(position);
    pos = fracture(pos);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}