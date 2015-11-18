function mosaicImage(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (event) {
      var image = new Image();
      image.src = event.target.result;

      image.onload = function() {
        var inputCanvas = renderOriginalImage(image);
        renderMosaicImage(inputCanvas);
      }
    };

    reader.readAsDataURL(input.files[0]);
  }
}

function loadHexImagesOnOneRow(hexes) {
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

function createCanvas(id, width, height) {
  var canvas = document.createElement('canvas');

  canvas.id = id;
  canvas.width = width;
  canvas.height = height;

  return canvas;
}

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

function retrieveHexMatrix(canvas) {
  var context = canvas.getContext('2d');
  var pixelInterval = 8;
  var hexMatrix = [];

  var numberOfRows = Math.floor(canvas.height / TILE_HEIGHT);
  var numberOfCols = Math.floor(canvas.width / TILE_WIDTH);

  for (var row = 0; row < numberOfRows; row++) {
    hexMatrix[row] = [];

    for (var col = 0; col < numberOfCols; col++) {
      var tileImageData = context.getImageData(col * TILE_WIDTH, row * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT).data;
      var rgb = averageRbg(tileImageData, pixelInterval);
      var rgb = rgb;

      var hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      hexMatrix[row].push(hex);
    }
  }

  return hexMatrix;
}

function rgbToHex(r, g, b) {
  return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function renderOriginalImage(image) {
  var inputCanvas = createCanvas("inputCanvas", image.width, image.height);
  var inputCanvasContext = inputCanvas.getContext('2d');

  inputCanvasContext.drawImage(image, 0, 0);
  document.getElementsByClassName('input')[0].replaceChild(inputCanvas, document.getElementById('inputCanvas'));

  return inputCanvas;
}

function renderMosaicImageAsync(inputCanvas, outputCanvas) {
  var outputCanvasContext = outputCanvas.getContext('2d');
  var hexMatrix = retrieveHexMatrix(inputCanvas);

  hexMatrix.reduce(function (sequence, hexes, row) {
    return sequence.then(function () {
      return loadHexImagesOnOneRow(hexes);
    }).then(function (images) {
      images.map(function (image, col) {
        drawTile(outputCanvasContext, row, col, image);
      });
    });
  }, Promise.resolve());
}

function renderMosaicImage(inputCanvas) {
  var outputCanvas = createCanvas("outputCanvas", inputCanvas.width, inputCanvas.height);
  renderMosaicImageAsync(inputCanvas, outputCanvas);

  document.getElementsByClassName('output')[0].replaceChild(outputCanvas, document.getElementById('outputCanvas'));
}

var drawTile = function (context, row, col, tileImage) {
  context.drawImage(tileImage, col * TILE_WIDTH, row * TILE_HEIGHT);
};

window.onload = function() {
  document.getElementById('imageInput').onchange = function () {
    mosaicImage(this);
  }
};