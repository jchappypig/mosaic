var calculator = function () {
  var pixelInterval = 4;

  return {

    // calculate average rgb color of given image data
    averageRbg: function (imageData) {
      var i = -4;
      var rgb = {r: 0, g: 0, b: 0};
      var count = 0;

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

    // return image data of a tile located on (startX, startY) of an image
    getTileImageData: function (startX, startY, tileWidth, tileHeight, imageWidth, imageData) {
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
    },

    rgbToHex: function (r, g, b) {
      return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },

    retrieveHexMatrix: function (tileWidth, tileHeight, imageWidth, imageHeight, imageData) {
      var pixelInterval = 4;
      var hexMatrix = [];

      var numberOfRows = Math.floor(imageHeight / tileHeight);
      var numberOfCols = Math.floor(imageWidth / tileWidth);

      for (var row = 0; row < numberOfRows; row++) {
        hexMatrix[row] = [];

        for (var col = 0; col < numberOfCols; col++) {
          var tileImageData = this.getTileImageData(col * tileWidth, row * tileHeight, tileWidth, tileHeight, imageWidth, imageData);
          var rgb = this.averageRbg(tileImageData, pixelInterval);

          hexMatrix[row].push(this.rgbToHex(rgb.r, rgb.g, rgb.b));
        }
      }

      return hexMatrix;
    }
  }
    ;
};

self.onmessage = function (e) {
  var receivedData = e.data;
  var width = receivedData.width;
  var height = receivedData.height;
  var imageData = receivedData.imageData;
  var tileWidth = receivedData.tileWidth;
  var tileHeight = receivedData.tileHeight;

  self.postMessage(calculator().retrieveHexMatrix(tileWidth, tileHeight, width, height, imageData));
};
