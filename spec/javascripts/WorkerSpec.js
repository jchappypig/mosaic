describe('worker', function () {

  // Note: every four number compose a pixel.
  var imageData = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4,
    1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4,
    1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4,
    1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4,
    5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8,
    5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8,
    5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8,
    5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8];

  describe('colorUtils', function () {
    describe('averageRbg', function () {
      it('should calculate average rgb color of an interval to improve efficiency', function () {
        expect(colorUtils().averageRbg(imageData)).toEqual({r: 6, g: 6, b: 6});
      })
    });

    describe('rgbToHex', function () {
      it('should convert rgb to hex value', function () {
        expect(colorUtils().rgbToHex(0, 0, 0)).toEqual('000000');
        expect(colorUtils().rgbToHex(255, 255, 255)).toEqual('ffffff');
      });
    });
  });

  describe('imageDataHandler', function () {
    var startX = 0, startY = 4;
    var tileWidth = 1, tileHeight = 4;
    var imageWidth = 4, imageHeight = 8;
    var handler = imageDataHandler(tileWidth, tileHeight, imageWidth, imageHeight, imageData);

    describe('getTileImageData', function () {
      it('should retrieve image data of specific tile', function () {
        var expectedTileImageData = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]

        expect(handler.getTileImageData(startX, startY)).toEqual(expectedTileImageData);
      })
    });

    describe('getHexMatrix', function () {
      it('should retrieve average hex value of each tile and puts it into a matrix', function () {
        var expectedHexMatrix = [['010101', '020202', '030303', '040404'],
          ['050505', '060606', '070707', '080808']];

        expect(handler.getHexMatrix()).toEqual(expectedHexMatrix);
      })
    });
  });
});
