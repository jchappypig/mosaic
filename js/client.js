function processImage(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      var image = new Image();
      image.src = e.target.result;

      image.onload = function () {
        var canvas = renderer().drawOriginalImage(image);
        renderer().drawMosaicImage(canvas);
      }
    };

    reader.readAsDataURL(input.files[0]);
  }
}

function renderer() {
  return {
    createCanvas: function (id, width, height) {
      var canvas = document.createElement('canvas');

      canvas.id = id;
      canvas.width = width;
      canvas.height = height;

      return canvas;
    },

    drawTile: function (canvas, tileImage, row, col) {
      canvas.getContext('2d').drawImage(tileImage, col * TILE_WIDTH, row * TILE_HEIGHT);
    },

    drawOriginalImage: function (image) {
      var canvas = this.createCanvas("inputCanvas", image.width, image.height);
      var context = canvas.getContext('2d');

      context.drawImage(image, 0, 0);

      document.getElementsByClassName('input')[0].replaceChild(canvas, document.getElementById('inputCanvas'));

      return canvas;
    },

    drawMosaicImage: function (imageCanvas) {
      var canvas = this.createCanvas("outputCanvas", imageCanvas.width, imageCanvas.height);

      this.drawMosaicImageAsync(canvas, renderer().getImageData(imageCanvas));

      document.getElementsByClassName('output')[0].replaceChild(canvas, document.getElementById('outputCanvas'));
    },

    drawMosaicImageAsync: function (canvas, imageData) {
      var worker = new Worker('js/worker.js');

      worker.onmessage = function (e) {
        var hexMatrix = e.data;

        // load images row by row
        hexMatrix.reduce(function (sequence, hexes, row) {
          return sequence.then(function () {
            return imageLoader().loadHexImagesOnOneRow(hexes);
          }).then(function (images) {
            images.map(function (image, col) {
              renderer().drawTile(canvas, image, row, col);
            });
          });
        }, Promise.resolve());
      };

      // rely on worker to do the calculation and generate the hex matrix
      worker.postMessage({
        width: canvas.width, height: canvas.height, imageData: imageData, tileWidth: TILE_WIDTH, tileHeight: TILE_HEIGHT
      });
    },

    getImageData: function (canvas) {
      return canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
    }
  }
}

function imageLoader() {
  return {
    //Promise that is resolved only when all the images in one load has been loaded
    loadHexImagesOnOneRow: function (hexes) {
      return Promise.all(hexes.map(this.loadHexImage));
    },

    //Promise that load hex image from server
    loadHexImage: function (hex) {
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
  }
}

window.onload = function () {
  document.getElementById('imageInput').onchange = function () {
    processImage(this);
  }
};