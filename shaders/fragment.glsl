uniform float colorTime;
uniform int colorFunction;
uniform vec3 normalColor;
uniform vec3 crushedColor;
uniform float fractureProgress;

void main()
{
    float trig;
    float adjustedTime = colorTime * 0.1;
    switch(colorFunction)
    {
        case 0: trig = sin(adjustedTime); break;
        case 1: trig = cos(adjustedTime); break;
        default: trig = tan(adjustedTime); break;
    }

    float pulse = abs(trig);
    vec3 color = mix(normalColor, crushedColor, fractureProgress);
    gl_FragColor = vec4(color * pulse, 1.0);
}