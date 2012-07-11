if (!glass) {
    var glass = { };
}

glass.init_shaders = function(gl) {
    if (this.attrs && this.unis) {
        return null;
    }

    var shaderProgram = function(wgl) {
        var program;

        var getShader = function(id) {
            var shaderScript = document.getElementById(id);
            if (!shaderScript) {
                return null;
            }

            var str = "";
            var k = shaderScript.firstChild;
            while (k) {
                if (k.nodeType === 3) {
                    str += k.textContent;
                }
                k = k.nextSibling;
            }

            var shader;
            if (shaderScript.type === "x-shader/x-fragment") {
                shader = wgl.createShader(wgl.FRAGMENT_SHADER);
            } else if (shaderScript.type === "x-shader/x-vertex") {
                shader = wgl.createShader(wgl.VERTEX_SHADER);
            } else {
                throw "what in the world..."
            }

            wgl.shaderSource(shader, str);
            wgl.compileShader(shader);

            if (!wgl.getShaderParameter(shader, wgl.COMPILE_STATUS)) {
                alert(wgl.getShaderInfoLog(shader));
                return null;
            }

            return shader;
        };

        var fragmentShader = getShader("f");
        var vertexShader = getShader("v");

        program = wgl.createProgram();
        wgl.attachShader(program, fragmentShader);
        wgl.attachShader(program, vertexShader);
        wgl.linkProgram(shaderProgram);

        return program;
    }(gl);

    this.attrs = function(wgl) {
        var dict = {};
        var f = function(str) {
            var n = wgl.getAttribLocation(shaderProgram, str);
            wgl.enableVertexAttribArray(n);
            return n;
        };

        dict.vertexPosition = f("aVertexPosition");
        dict.vertexNormal = f("aVertexNormal");
        dict.textureCoord = f("aTextureCoord");

        return dict;
    }(gl);

    this.unis = function(wgl) {
        var dict = {};
        var f = function(str) {
            return wgl.getUniformLocation(shaderProgram, str);
        };

        dict.pMatrix = f("uPMatrix");
        dict.mvMatrix = f("uMVMatrix");
        dict.nMatrix = f("uNMatrix");
        dict.sampler = f("uSampler");
        dict.useLighting = f("uUseLighting");
        dict.ambientColor = f("uAmbientColor");
        dict.lightingDirection = f("uLightingDirection");
        dict.directionalColor = f("uDirectionalColor");
        dict.alpha = f("uAlpha");

        return dict;
    }(gl);

};
