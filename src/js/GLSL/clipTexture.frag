varying vec2 vUv;
uniform sampler2D texture;
uniform bool isLeft;
const float clipWidth = 0.19;
void main() {
    vec2 uv = vUv;
    uv.x *= clipWidth;
    if(isLeft)
    {
        uv.x += (1.0-clipWidth);
    }

    vec3 diffuse = texture2D( texture, uv ).rgb;
    gl_FragColor.rgb = vec3( diffuse );
    gl_FragColor.a = 1.0;
}