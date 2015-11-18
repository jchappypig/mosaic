function averageRbg(imageData, blockSize) {
  var i = -4;
  var rgb = {r: 0, g: 0, b: 0};
  var count = 0;

  while ((i += blockSize * 4) < imageData.length) {
    ++count;
    rgb.r += imageData[i];
    rgb.g += imageData[i + 1];
    rgb.b += imageData[i + 2];
  }

  rgb.r = Math.floor(rgb.r / count);
  rgb.g = Math.floor(rgb.g / count);
  rgb.b = Math.floor(rgb.b / count);

  return rgb;
}

function getTileImageData(startX, startY, tileWidth, tileHeight, canvasWidth, imageData) {
  var tileImageData = [];

  for (var x = startX; x < (startX + tileWidth); x++) {
    for (var y = startY; y < (startY + tileHeight); y++) {

      var position = x * 4 + y * canvasWidth * 4;

      tileImageData.push(
        imageData[position + 0],
        imageData[position + 1],
        imageData[position + 2],
        imageData[position + 3]
      );
    }
  }

  return tileImageData;
}

function rgbToHex(r, g, b) {
  return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function retrieveHexMatrix(width, height, imageData, tileWidth, tileHeight) {
  var pixelInterval = 8;
  var hexMatrix = [];

  var numberOfRows = Math.floor(height / tileHeight);
  var numberOfCols = Math.floor(width / tileWidth);

  for (var row = 0; row < numberOfRows; row++) {
    hexMatrix[row] = [];

    for (var col = 0; col < numberOfCols; col++) {
      var tileImageData = getTileImageData(col * tileWidth, row * tileHeight, tileWidth, tileHeight, width, imageData);
      var rgb = averageRbg(tileImageData, pixelInterval);

      hexMatrix[row].push(rgbToHex(rgb.r, rgb.g, rgb.b));
    }
  }

  return hexMatrix;
}

self.onmessage = function(e) {
  var receivedData = e.data;
  var width = receivedData.width;
  var height = receivedData.height;
  var imageData = receivedData.imageData;
  var tileWidth = receivedData.tileWidth;
  var tileHeight = receivedData.tileHeight;

  self.postMessage(retrieveHexMatrix(width, height, imageData, tileWidth, tileHeight));
};
