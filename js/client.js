function displayImage(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      var original = document.getElementById('original');
      original.src = e.target.result;
      original.style.display = "inline-block";
    };

    reader.readAsDataURL(input.files[0]);
  }
}

window.onload = function() {
  document.getElementById('original').style.display = 'none';
  document.getElementById('inputOriginal').onchange = function() {
    displayImage(this);
  }
}