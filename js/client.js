function displayImage(input) {
  var imageWidth, imageHeight = 0;
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      imageDataUrl = e.target.result;
      var blockSize = 4;
      var image = new Image();
      image.src = imageDataUrl;
      image.onload = function() {
        imageWidth = this.width;
        imageHeight = this.height;

        var inputCanvas = document.createElement('canvas');
        inputCanvas.id = 'inputImage';
        inputCanvas.width = imageWidth;
        inputCanvas.height = imageHeight;
        var inputCanvasContext = inputCanvas.getContext('2d');
        inputCanvasContext.drawImage(image, 0, 0);
        document.getElementsByClassName('input')[0].replaceChild(inputCanvas, document.getElementById('inputImage'));


        var outputCanvas = document.createElement('canvas');
        outputCanvas.id = 'outputImage';
        outputCanvas.width = imageWidth;
        outputCanvas.height = imageHeight;
        var outputCanvasContext = outputCanvas.getContext('2d');

        var numberOfCols = Math.floor(imageWidth / TILE_WIDTH);
        var numberOfRows = Math.floor(imageHeight / TILE_HEIGHT);

        var drawTile = function(row, col, tileImage) {
          return function() {
            outputCanvasContext.drawImage(tileImage, col*TILE_WIDTH, row*TILE_HEIGHT);
          };
        };

        for(var row=0; row<numberOfRows; row++) {
          for(var col=0; col<numberOfCols; col++) {
            var tileImageData = inputCanvasContext.getImageData(col*TILE_WIDTH, row*TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT).data;
            var i = -4;
            var rgb = {r:0,g:0,b:0};
            var count = 0;

            while ( (i += blockSize * 4) < tileImageData.length ) {
              ++count;
              rgb.r += tileImageData[i];
              rgb.g += tileImageData[i+1];
              rgb.b += tileImageData[i+2];
            }

            rgb.r = ~~(rgb.r/count);
            rgb.g = ~~(rgb.g/count);
            rgb.b = ~~(rgb.b/count);

            function componentToHex(c) {
              var hex = c.toString(16);
              return hex.length == 1 ? "0" + hex : hex;
            }

            function rgbToHex(r, g, b) {
              return componentToHex(r) + componentToHex(g) + componentToHex(b);
            }

            var hex = rgbToHex(rgb.r, rgb.g, rgb.b);
            var tileImage = new Image();
            tileImage.src = '/color/' + hex;

            tileImage.onload = drawTile(row, col, tileImage);
          }
        }

        document.getElementsByClassName('output')[0].replaceChild(outputCanvas, document.getElementById('outputImage'));
      }
    };

    reader.readAsDataURL(input.files[0]);
  }
}

window.onload = function() {
  document.getElementById('imageInput').onchange = function () {
    displayImage(this);
  }
};