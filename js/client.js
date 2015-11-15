function displayImage(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      var original = document.getElementById('original');
      original.src = e.target.result;
    };

    reader.readAsDataURL(input.files[0]);
  }
}