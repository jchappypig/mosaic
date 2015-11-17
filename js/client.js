function displayImage(input) {
  var imageWidth, imageHeight = 0;
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      var original = document.getElementById('original');
      original.src = e.target.result;
      original.style.display = "inline-block";
      original.onload = function() {
        imageWidth = this.width;
        imageHeight = this.height;

        var image = new Image();
        image.src = original.src;

        var canvas = document.createElement('canvas');
        canvas.width = imageWidth;
        canvas.height = imageHeight;
        canvas.id = 'outputImage';

        numberOfCols = Math.floor(imageWidth/TILE_WIDTH);
        numberOfRows = Math.floor(imageHeight/TILE_HEIGHT);

        for(var row=0; row<numberOfRows; row++) {
          for(var col=0; col<numberOfCols; col++) {
            canvas.getContext('2d').drawImage(image, col*TILE_WIDTH, row*TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT, col*TILE_WIDTH, row*TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
          }
        }

        document.getElementsByClassName('output')[0].replaceChild(canvas, document.getElementById('outputImage'));
      }
    };



    reader.readAsDataURL(input.files[0]);
  }
}

window.onload = function() {
  document.getElementById('original').style.display = 'none';
  document.getElementById('imageInput').onchange = function () {
    displayImage(this);
  }
};