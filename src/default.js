window.addEventListener('load', function() {
    var cvs = document.getElementById('canvas');
    var wgl = cvs.getContext('moz-webgl') || cvs.getContext('webkit-3d');

    wgl.clearColor(0.0, 0.0, 0.0, 1.0);
    wgl.enable(wgl.DEPTH_TEST);

    var resized = function() {
        cvs.width = window.innerWidth;
        cvs.height = window.innerHeight;
        wgl.viewport(0, 0, cvs.width, cvs.height);
    }
    resized();
    window.onresize = resized;

    glass.initialize(wgl);
    return;
}, false);
