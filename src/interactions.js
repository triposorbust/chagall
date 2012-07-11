if (!glass) {
    var glass = { };
}

glass.initialize_interactions = function(d, f) {
    if (document.onkeydown && document.onkeyup) {
        return null;
    }
    document.onkeydown = function(keys, callback) {
        return (function(e) {
            keys[e.keyCode] = true;
            callback(e.keyCode);
        });
    }(d, f);
    document.onkeyup = function(keys) {
        return (function(e) {
            keys[e.keyCode] = false;
        });
    }(d);
};
