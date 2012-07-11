if (!glass) {
    var glass = { };
}

glass.create_window = function(gl, spec, index) {

    var texture = function() {
        var handleLoadedTexture = function(bt) {
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

            gl.bindTexture(gl.TEXTURE_2D, bt);
            gl.texImage2D(gl.TEXTURE_2D,
                          0,
                          gl.RGBA,
                          gl.RGBA,
                          gl.UNSIGNED_BYTE,
                          bt.image);
            gl.texParameteri(gl.TEXTURE_2D,
                             gl.TEXTURE_MAG_FILTER,
                             gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D,
                             gl.TEXTURE_MIN_FILTER,
                             gl.LINEAR_MIPMAP_NEAREST);
            gl.generateMipmap(gl.TEXTURE_2D);

            gl.bindTexture(gl.TEXTURE_2D, null);
        };

        var at = gl.createTexture();
        at.image = new Image();
        at.image.onload = function() {
            handleLoadedTexture(at);
        };
        at.image.src = "res/c"+index.toFixed()+".jpg";
        return at;
    }();

    var init_buffer = function(buffer, data) {
        var n=0, flat=[];
        for(var i=0; i<data.length; i++) {
            n += data[i].length;
            flat = flat.concat(data[i]);
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER,
                      new Float32Array(flat),
                      gl.STATIC_DRAW);

        buffer.itemSize = n / data.length;
        buffer.numItems = data.length;

        return buffer;
    };

    var vPosnBuffer = init_buffer(gl.createBuffer(), spec.posns);
    var vNormBuffer = init_buffer(gl.createBuffer(), spec.norms);
    var vTextureCoordBuffer = init_buffer(gl.createBuffer(), spec.tcoords);

    var vIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
                  new Uint16Array(spec.indices),
                  gl.STATIC_DRAW);
    vIndexBuffer.itemSize = 1;
    vIndexBuffer.numItems = 6;

    return {
        render: function(wgl) {
            var bind_to_attr = function(buffer, attr) {
                wgl.bindBuffer(wgl.ARRAY_BUFFER, buffer);
                wgl.vertexAttribPointer(attr,
                                        buffer.itemSize,
                                        wgl.FLOAT,
                                        false,
                                        0,
                                        0);
            };
            bind_to_attr(vPosnBuffer, glass.attrs.vertexPosition);
            bind_to_attr(vNormBuffer, glass.attrs.vertexNormal);
            bind_to_attr(vTextureCoordBuffer, glass.attrs.textureCoord);

            wgl.activeTexture(wgl.TEXTURE0)
            wgl.bindTexture(gl.TEXTURE_2D, texture);
            wgl.uniform1i(glass.unis.sampler, 0);

            // wgl.drawArrays(wgl.TRIANGLE_STRIP, 0, vPosnBuffer.numItems);

            wgl.bindBuffer(wgl.ELEMENT_ARRAY_BUFFER, vIndexBuffer);
            wgl.drawElements(wgl.TRIANGLES,
                             vIndexBuffer.numItems,
                             wgl.UNSIGNED_SHORT,
                             0);
        },
    };
};
