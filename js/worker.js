var imageDataHandler = function(tileWidth, tileHeight, imageWidth, imageHeight, imageData) {
  return {

    // retrieve average hex value of each tile and puts it into a matrix
    getHexMatrix: function () {
      var hexMatrix = [];

      var numberOfRows = Math.floor(imageHeight / tileHeight);
      var numberOfCols = Math.floor(imageWidth / tileWidth);

      for (var row = 0; row < numberOfRows; row++) {
        hexMatrix[row] = [];

        for (var col = 0; col < numberOfCols; col++) {
          var tileImageData = this.getTileImageData(col * tileWidth, row * tileHeight);
          var rgb = colorUtils().averageRbg(tileImageData);

          hexMatrix[row].push(colorUtils().rgbToHex(rgb.r, rgb.g, rgb.b));
        }
      }

      return hexMatrix;
    },

    // return image data of a tile located on (startX, startY) of an image
    getTileImageData: function (startX, startY) {
      var tileImageData = [];

      for (var x = startX; x < (startX + tileWidth); x++) {
        for (var y = startY; y < (startY + tileHeight); y++) {

          var position = x * 4 + y * imageWidth * 4;

          tileImageData.push(
            imageData[position],
            imageData[position + 1],
            imageData[position + 2],
            imageData[position + 3]
          );
        }
      }

      return tileImageData;
    }
  }
};

var colorUtils = function () {
  return {

    // calculate average rgb color of given image data
    averageRbg: function (imageData) {
      var i = -4;
      var rgb = {r: 0, g: 0, b: 0};
      var count = 0;
      var pixelInterval = 4;

      while ((i += pixelInterval * 4) < imageData.length) {
        ++count;
        rgb.r += imageData[i];
        rgb.g += imageData[i + 1];
        rgb.b += imageData[i + 2];
      }

      rgb.r = Math.floor(rgb.r / count);
      rgb.g = Math.floor(rgb.g / count);
      rgb.b = Math.floor(rgb.b / count);

      return rgb;
    },

    rgbToHex: function (r, g, b) {
      return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
  };
};

self.onmessage = function (e) {
  var data = e.data;
  var imageWidth = data.width;
  var imageHeight = data.height;
  var imageData = data.imageData;
  var tileWidth = data.tileWidth;
  var tileHeight = data.tileHeight;

  self.postMessage(imageDataHandler(tileWidth, tileHeight, imageWidth, imageHeight, imageData).getHexMatrix());
};
