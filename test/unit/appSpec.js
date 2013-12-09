'use strict';

/* jasmine specs for controllers go here */
describe('controllers', function() {

  beforeEach(module('app'));

  describe('mainController', function(){
    var scope, ctrl, _mockParsingService, _expectedParsedReturnValue;

    beforeEach(inject(function( $rootScope, $controller, ParsePackageDependenciesService ) {

      scope = $rootScope.$new();
      _mockParsingService = {parse:  function(){   }};


      ctrl = $controller('mainController', {$scope: scope, "ParsePackageDependenciesService":_mockParsingService});
    }));
    it('should receive input in $scope.input when $scope.change is triggered and output the results to $scope.output', function(){
        _expectedParsedReturnValue = "bob";
        var expectedInput =  "abcd:asdf123";
        spyOn(_mockParsingService, 'parse').andCallFake(function(){
            return _expectedParsedReturnValue;
        });
        scope.input = expectedInput;
        scope.change();
        expect( scope.output).toBe(_expectedParsedReturnValue);
        expect(_mockParsingService.parse).toHaveBeenCalledWith(expectedInput);
    })
  });


});
