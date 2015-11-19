describe('hexMatrixCalculator', function () {

  // Note: every four number compose a pixel.
  var imageData = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4,
    1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4,
    1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4,
    1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4,
    5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8,
    5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8,
    5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8,
    5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8];

  describe('averageRbg', function () {
    it('should calculate average rgb color of an interval to improve efficiency', function () {
      expect(averageRbg(imageData, 1)).toEqual({r: 4, g: 4, b: 4});
      expect(averageRbg(imageData, 2)).toEqual({r: 5, g: 5, b: 5});
    })
  });

  describe('rgbToHex', function () {
    it('should convert rgb to hex value', function () {
      expect(rgbToHex(0, 0, 0)).toEqual('000000');
      expect(rgbToHex(255, 255, 255)).toEqual('ffffff');
    });
  });

  describe('getTileImageData', function () {
    it('should retrieve image data of specific tile', function () {

      var startX = 0;
      var startY = 4;
      var tileWidth = 1;
      var tileHeight = 4;
      var canvasWidth = 4;

      var expectedTileImageData = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]

      expect(getTileImageData(startX, startY, tileWidth, tileHeight, canvasWidth, imageData)).toEqual(expectedTileImageData);
    })
  });

  describe('retrieveHexMatrix', function () {
    it('should retrieve average hex value of each tile and puts it into a matrix', function () {
      var tileWidth = 1;
      var tileHeight = 4;
      var canvasWidth = 4;
      var canvasHeight = 8;

      var expectedHexMatrix = [ ['010101', '020202', '030303', '040404'],
                                ['050505', '060606', '070707', '080808']];

      expect(retrieveHexMatrix(tileWidth, tileHeight, canvasWidth, canvasHeight, imageData)).toEqual(expectedHexMatrix);
    })
  });
});