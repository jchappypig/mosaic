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
        canvas.width = this.width;
        canvas.height = this.height;
        canvas.id = 'outputImage';
        canvas.getContext('2d').drawImage(image, 0, 0);

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