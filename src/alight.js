if (!glass) {
    var glass = { };
}

glass.initialize_alight = function() {
    if (this.alight) {
        return null;
    }
    this.alight = function() {
        var ambientR = 0.1;
        var ambientG = 0.1;
        var ambientB = 0.1;

        return {
            render: function(gl) {
                gl.uniform3f(
                    glass.unis.ambientColor,
                    ambientR,
                    ambientG,
                    ambientB
                );
            }
        };
    }();
};
