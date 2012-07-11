if (!glass) {
    var glass = { };
}

glass.getRequestAnimationFrame = function() {
    return (
        window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(/* function */ callback) {
            window.setTimeout(callback, 1000/60);
        }
    );
};
