if (!glass) {
    var glass = { };
}

glass.initialize = function(gl) {
    var self = this;
    var LIGHTING = true;
    var BLENDING = true;
    var ALPHA = 0.45;

    var mvMatrix = mat4.create();
    var mvMatrixStack = [];
    var pMatrix = mat4.create();

    var mvPushMatrix = function() {
        var copy = mat4.create();
        mat4.set(mvMatrix, copy);
        mvMatrixStack.push(copy);
    };
    var mvPopMatrix = function() {
        if (mvMatrixStack.length === 0) {
            throw "invalid popMatrix!";
        }
        mvMatrix = mvMatrixStack.pop();
    };

    var render = function() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        mat4.perspective(85,
                         gl.canvas.width/gl.canvas.height,
                         0.1,
                         100.0,
                         pMatrix);
        mat4.identity(mvMatrix);
        mat4.translate(mvMatrix, [0.0, 0.0, z]);
        mat4.rotate(mvMatrix, xRot, [1, 0, 0]);
        mat4.rotate(mvMatrix, yRot, [0, 1, 0]);

        var setMatrixUniforms = function() {
            gl.uniformMatrix4fv(self.unis.pMatrix, false, pMatrix);
            gl.uniformMatrix4fv(self.unis.mvMatrix, false, mvMatrix);

            var normalMatrix = mat3.create();
            mat4.toInverseMat3(mvMatrix, normalMatrix);
            mat3.transpose(normalMatrix);
            gl.uniformMatrix3fv(self.unis.nMatrix, false, normalMatrix);
        };

        gl.uniform1i(self.unis.useLighting, LIGHTING);
        if (LIGHTING) {
            // These are misnomers. Should be: "Set Uniforms."
            glass.alight.render(gl);
            glass.dlight.render(gl);
        }
        if (BLENDING) {
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
            gl.enable(gl.BLEND);
            gl.disable(gl.DEPTH_TEST);
            gl.uniform1f(self.unis.alpha, ALPHA);
        } else {
            gl.enable(gl.BLEND);
            gl.enable(gl.DEPTH_TEST);
        }

        setMatrixUniforms();
        for (var i=0; i<self.windows.length; i++) {
            self.windows[i].render(gl);
        }
    };

    var keys = { };
    var handle_pressed = function() {
        if (keys[188]) z -= 0.05;
        if (keys[190]) z += 0.05;
        if (keys[37]) ySpeed -= 1;
        if (keys[39]) ySpeed += 1;
        if (keys[38]) xSpeed -= 1;
        if (keys[40]) xSpeed += 1;
    };
    var handle_tapped = function(keycode) {
        // This is just a stub.
        return null;
    };

    var xRot = 30.0;
    var yRot = 30.0;
    var xSpeed = 3.0;
    var ySpeed = -3.0;
    var z = -5.0;

    var last_time = 0;
    var step = function() {
        var on_step = function() {
            var curr_time = new Date().getTime();
            if (last_time != 0) {
                var elapsed = curr_time - last_time;
                xRot += (xSpeed * elapsed) * (Math.PI/180) / 1000.0;
                yRot += (ySpeed * elapsed) * (Math.PI/180) / 1000.0;
            }
            last_time = curr_time;
        };

        self.getRequestAnimationFrame()(step);
        handle_pressed();
        on_step();
        render();
    };

    (function() {
        self.initialize_interactions(keys, handle_tapped);

        self.initialize_shaders(gl);
        self.initialize_alight();
        self.initialize_dlight();
        self.initialize_windows(gl);

        step();
    })();
};
