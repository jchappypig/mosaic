function displayImage(input) {
  var imageWidth, imageHeight = 0;
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      var imageDataUrl = e.target.result;
      var blockSize = 8;
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
          outputCanvasContext.drawImage(tileImage, col*TILE_WIDTH, row*TILE_HEIGHT);
        };

        document.getElementsByClassName('output')[0].replaceChild(outputCanvas, document.getElementById('outputImage'));

        var hexMatrix = [];

        for(var row=0; row<numberOfRows; row++) {
          hexMatrix[row] = [];
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
            hexMatrix[row].push(hex);
          }
        }

        hexMatrix.reduce(function(sequence, hexes, row) {
          return sequence.then(function() {
            return loadHexImagesOnRow(hexes);
          }).then(function(images) {
            images.map(function(image, col) {
              console.log("image is loaded: " + image.src);
              drawTile(row, col, image);
            });
            console.log(row);
          });
        }, Promise.resolve());
      }
    };

    reader.readAsDataURL(input.files[0]);
  }
}

function loadHexImagesOnRow(hexes) {
  return Promise.all(hexes.map(loadHexImage));
}

function loadHexImage(hex) {
  return new Promise(function(resolve, reject) {
    var image = new Image();
    image.src = '/color/' + hex;

    image.onload = function() {
      return resolve(image);
    };

    image.onerror = function() {
      return reject(Error('Failed to load image: ' + image.src));
    }
  });
}

window.onload = function() {
  document.getElementById('imageInput').onchange = function () {
    displayImage(this);
  }
};