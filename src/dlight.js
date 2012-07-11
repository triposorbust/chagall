if (!glass) {
    var glass = { };
}

glass.initialize_dlight = function() {
    if (this.dlight) {
        return null;
    }
    this.dlight = function() {
        var dX =  0.25;
        var dY = -0.25;
        var dZ =  0.35;

        var dR = 0.2;
        var dG = 0.2;
        var dB = 0.2;

        return {
            render: function(gl) {
                var direction = [dX, dY, dZ];
                var normalized = vec3.create();
                vec3.normalize(direction, normalized);
                vec3.scale(normalized, -1);

                gl.uniform3fv(glass.unis.lightingDirection, normalized);
                gl.uniform3f(glass.unis.directionalColor,
                             dR, dG, dB);
            }
        };
    }();
};
