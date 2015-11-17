function displayImage(input) {
  var imageWidth, imageHeight = 0;
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      imageDataUrl = e.target.result;
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

        numberOfCols = Math.floor(imageWidth/TILE_WIDTH);
        numberOfRows = Math.floor(imageHeight/TILE_HEIGHT);

        for(var row=0; row<numberOfRows; row++) {
          for(var col=0; col<numberOfCols; col++) {
            outputCanvasContext.drawImage(image, col*TILE_WIDTH, row*TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT, col*TILE_WIDTH, row*TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
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