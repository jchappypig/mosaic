function mosaicImage(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      var image = new Image();
      image.src = e.target.result;

      image.onload = function () {
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
  return new Promise(function (resolve, reject) {
    var image = new Image();
    image.src = '/color/' + hex;

    image.onload = function () {
      return resolve(image);
    };

    image.onerror = function () {
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

function renderOriginalImage(image) {
  var inputCanvas = createCanvas("inputCanvas", image.width, image.height);
  var inputCanvasContext = inputCanvas.getContext('2d');

  inputCanvasContext.drawImage(image, 0, 0);
  document.getElementsByClassName('input')[0].replaceChild(inputCanvas, document.getElementById('inputCanvas'));

  return inputCanvas;
}

function retrieveImageData(canvas) {
  return canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
}

function renderMosaicImageAsync(inputCanvas, outputCanvas) {
  var outputCanvasContext = outputCanvas.getContext('2d');
  var imageData = retrieveImageData(inputCanvas);

  var worker = new Worker('js/hexMatrixCalculation.js');

  worker.onmessage = function(e) {
    var hexMatrix = e.data;

    hexMatrix.reduce(function (sequence, hexes, row) {
      return sequence.then(function () {
        return loadHexImagesOnOneRow(hexes);
      }).then(function (images) {
        images.map(function (image, col) {
          drawTile(outputCanvasContext, row, col, image);
        });
      });
    }, Promise.resolve());
  };

  worker.postMessage({width: inputCanvas.width, height: inputCanvas.height, imageData: imageData, tileWidth: TILE_WIDTH, tileHeight: TILE_HEIGHT});
}

function renderMosaicImage(inputCanvas) {
  var outputCanvas = createCanvas("outputCanvas", inputCanvas.width, inputCanvas.height);
  renderMosaicImageAsync(inputCanvas, outputCanvas);

  document.getElementsByClassName('output')[0].replaceChild(outputCanvas, document.getElementById('outputCanvas'));
}

var drawTile = function (context, row, col, tileImage) {
  context.drawImage(tileImage, col * TILE_WIDTH, row * TILE_HEIGHT);
};

window.onload = function () {
  document.getElementById('imageInput').onchange = function () {
    mosaicImage(this);
  }
};