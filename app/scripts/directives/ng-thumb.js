'use strict';

angular.module('ng-thumb', [])
    .directive('ngThumb', ['$window', function($window) {
        var helper = {
            support: !!($window.FileReader && $window.CanvasRenderingContext2D),
            isFile: function(item) {
                return angular.isObject(item) && item instanceof $window.File;
            },
            isImage: function(file) {
                var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        };

        return {
            restrict: 'A',
            scope: {
                ngThumb: '=',
                imageReady: '&'
            },
            template: '<canvas/>',
            link: function(scope, element, attributes) {
                if (!helper.support) return;

                var file = scope.ngThumb;

                if (!helper.isFile(file)) return;
                if (!helper.isImage(file)) return;

                var canvas = element.find('canvas');
                var reader = new FileReader();

                reader.onload = onLoadFile;
                reader.readAsDataURL(file);

                attributes.$observe('imageData', function(imageData) {
                    console.log('imageData', imageData);
                    if(imageData) {
                        element[0].src = imageData;
                    }
                });

                function onLoadFile(event) {
                    var img = new Image();
                    img.onload = onLoadImage;
                    img.src = event.target.result;
                }

                function onLoadImage(event) {

                    var img = event.path ? event.path[0] : event.target;
                    var resolutionWidth = 600; // resolution width
                    var resolutionHeight = 450; // resolution height
                    var unrotatedResolutionWidth = resolutionWidth;
                    var unrotatedResolutionHeight = resolutionHeight;
                    var orientation = null;

                    EXIF.getData(img, function () {
                        var exifDetails = EXIF.pretty(this);
                        if(exifDetails) {
                            orientation = parseInt(exifDetails.split("\n")[0].split(" : ")[1]);
                            console.log('orientation', orientation);
                        }
                    });
                    console.log('after', orientation);
                    // it is rotated 90 deg so we crop it vertically
                    // then we will deal with rotate it and flip
                    if(orientation > 4 && orientation <= 8) {
                        unrotatedResolutionWidth = resolutionHeight;
                        unrotatedResolutionHeight = resolutionWidth;
                    }

                    var finalWidth = 0; // final width
                    var finalHeight = 0; // final height
                    var resolutionRatio = unrotatedResolutionWidth/unrotatedResolutionHeight;
                    var marginLeft = 0; // margin left
                    var marginTop = 0; // margin top
                    var imgRatio = img.width/img.height;
                    var unscaledWidth = 0;
                    var unscaledHeight = 0;

                    if(imgRatio > resolutionRatio) {
                        unscaledHeight = img.height;
                        unscaledWidth = Math.ceil(unscaledHeight * resolutionRatio);
                        marginLeft = Math.round((img.width - unscaledWidth) / 2);
                    }
                    else {
                        unscaledWidth = img.width;
                        unscaledHeight = Math.ceil(unscaledWidth / resolutionRatio);
                        marginTop = Math.round((img.height - unscaledHeight) / 2);
                    }

                    canvas.attr({ width: unscaledWidth, height: unscaledHeight});
                    flipRotateBaseOnOrientation(canvas[0], orientation);
                    canvas[0].getContext('2d').drawImage(this, -marginLeft, -marginTop, img.width, img.height);
                    var rotatedUnscaledWidth = unscaledWidth;
                    var rotatedUnscaledHeight = unscaledHeight;
                    if(orientation > 4 && orientation <= 8) {
                        rotatedUnscaledWidth = unscaledHeight;
                        rotatedUnscaledHeight = unscaledWidth;
                    }
                    resampleHermite(canvas[0], rotatedUnscaledWidth, rotatedUnscaledHeight, resolutionWidth, resolutionHeight);

                    scope.imageReady({imageData: canvas[0].toDataURL("image/jpeg", .8)});
                }

                function flipRotateBaseOnOrientation(canvas, orientation) {

                    var ctx = canvas.getContext('2d'),
                        width = canvas.width,
                        height = canvas.height;

                    if (!orientation || orientation > 8) {
                        return;
                    }
                    if (orientation > 4) {
                        canvas.width = height;
                        canvas.height = width;
                    }
                    switch (orientation) {
                        case 2:
                            // horizontal flip
                            ctx.translate(width, 0);
                            ctx.scale(-1, 1);
                            break;
                        case 3:
                            // 180° rotate left
                            ctx.translate(width, height);
                            ctx.rotate(Math.PI);
                            break;
                        case 4:
                            // vertical flip
                            ctx.translate(0, height);
                            ctx.scale(1, -1);
                            break;
                        case 5:
                            // vertical flip + 90 rotate right
                            ctx.rotate(0.5 * Math.PI);
                            ctx.scale(1, -1);
                            break;
                        case 6:
                            // 90° rotate right
                            ctx.rotate(0.5 * Math.PI);
                            ctx.translate(0, -height);
                            break;
                        case 7:
                            // horizontal flip + 90 rotate right
                            ctx.rotate(0.5 * Math.PI);
                            ctx.translate(width, -height);
                            ctx.scale(-1, 1);
                            break;
                        case 8:
                            // 90° rotate left
                            ctx.rotate(-0.5 * Math.PI);
                            ctx.translate(-width, 0);
                            break;
                    }
                }

                function resampleHermite(canvas, W, H, W2, H2){
                    var time1 = Date.now();
                    W2 = Math.round(W2);
                    H2 = Math.round(H2);
                    var img = canvas.getContext("2d").getImageData(0, 0, W, H);
                    var img2 = canvas.getContext("2d").getImageData(0, 0, W2, H2);
                    var data = img.data;
                    var data2 = img2.data;
                    var ratio_w = W / W2;
                    var ratio_h = H / H2;
                    var ratio_w_half = Math.ceil(ratio_w/2);
                    var ratio_h_half = Math.ceil(ratio_h/2);
                    
                    for(var j = 0; j < H2; j++){
                        for(var i = 0; i < W2; i++){
                            var x2 = (i + j*W2) * 4;
                            var weight = 0;
                            var weights = 0;
                            var weights_alpha = 0;
                            var gx_r = 0;
                            var gx_g = 0;
                            var gx_b = 0;
                            var gx_a = 0;
                            var center_y = (j + 0.5) * ratio_h;
                            for(var yy = Math.floor(j * ratio_h); yy < (j + 1) * ratio_h; yy++){
                                var dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half;
                                var center_x = (i + 0.5) * ratio_w;
                                var w0 = dy*dy //pre-calc part of w
                                for(var xx = Math.floor(i * ratio_w); xx < (i + 1) * ratio_w; xx++){
                                    var dx = Math.abs(center_x - (xx + 0.5)) / ratio_w_half;
                                    var w = Math.sqrt(w0 + dx*dx);
                                    if(w >= -1 && w <= 1){
                                        //hermite filter
                                        weight = 2 * w*w*w - 3*w*w + 1;
                                        if(weight > 0){
                                            dx = 4*(xx + yy*W);
                                            //alpha
                                            gx_a += weight * data[dx + 3];
                                            weights_alpha += weight;
                                            //colors
                                            if(data[dx + 3] < 255)
                                                weight = weight * data[dx + 3] / 250;
                                            gx_r += weight * data[dx];
                                            gx_g += weight * data[dx + 1];
                                            gx_b += weight * data[dx + 2];
                                            weights += weight;
                                            }
                                        }
                                    }       
                                }
                            data2[x2]     = gx_r / weights;
                            data2[x2 + 1] = gx_g / weights;
                            data2[x2 + 2] = gx_b / weights;
                            data2[x2 + 3] = gx_a / weights_alpha;
                            }
                        }
                    //console.log("hermite = "+(Math.round(Date.now() - time1)/1000)+" s");
                    canvas.getContext("2d").clearRect(0, 0, Math.max(W, W2), Math.max(H, H2));
                    canvas.width = W2;
                    canvas.height = H2;
                    canvas.getContext("2d").putImageData(img2, 0, 0);
                }
            }
        };
    }]);