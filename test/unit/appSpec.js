'use strict';

/* jasmine specs for controllers go here */
describe('controllers', function () {

    beforeEach(module('app'));

    describe('mainController', function () {
        var scope, ctrl, _mockParsingService, _expectedParsedReturnValue;

        beforeEach(inject(function ($rootScope, $controller) {

            scope = $rootScope.$new();
            _mockParsingService = {parse: function () {
            }};


            ctrl = $controller('mainController', {$scope: scope, "ParsePackageDependenciesService": _mockParsingService});
        }));
        it('should receive input in $scope.input when $scope.change is triggered and output the results to $scope.output', function () {
            _expectedParsedReturnValue = "bob";
            var expectedInput = "abcd:asdf123";
            spyOn(_mockParsingService, 'parse').andCallFake(function () {
                return _expectedParsedReturnValue;
            });
            scope.input = expectedInput;
            scope.change();
            expect(scope.output).toBe(_expectedParsedReturnValue);
            expect(_mockParsingService.parse).toHaveBeenCalledWith(expectedInput);
        })
    });

    describe('ParsePackageDependenciesService', function () {
        var  parsePackageDependenciesSvc;
        beforeEach(inject(function($injector){

            parsePackageDependenciesSvc = $injector.get('ParsePackageDependenciesService');
        }))
        describe('invalid Input tests', function(){
            it('should return an error if references are cyclical', function(){
                var input = "KittenService:\n"+
                "Leetmeme: Cyberportal\n" +
                "Cyberportal: Ice\n" +
                "CamelCaser: KittenService\n" +
                "Fraudstream:\n" +
                "Ice: Leetmeme",
                expectedOutput = "ERROR:Cyclical reference - Leetmeme, Cyberportal, Ice, *Leetmeme*",
                output = parsePackageDependenciesSvc.parse(input);
                expect(output).toBe(expectedOutput);
            })
            it('should return an error if input is malformed', function(){
                var input = "KittenService:\n"+
                    "Leetmeme",

                expectedOutput ="PARSE ERROR: line 2",
                output = parsePackageDependenciesSvc.parse(input);
                expect(output).toBe(expectedOutput);
            })

            it('should return an error if required package is missing', function(){
                var input = "KittenService:Bad\n"+
                        "Leetmeme:",

                    expectedOutput ="ERROR: missing required package 'Bad'",
                    output = parsePackageDependenciesSvc.parse(input);
                expect(output).toBe(expectedOutput);
            })
        })
        describe('Valid input tests', function(){
            it('should accept valid input #1', function(){
                var input = 'KittenService:\n'+
                    'Leetmeme: Cyberportal\n'+
                'Cyberportal: Ice\n'+
                'CamelCaser: KittenService\n'+
                'Fraudstream: Leetmeme\n'+
                'Ice:',
                expectedOutput = 'KittenService, Ice, Cyberportal, Leetmeme, CamelCaser, Fraudstream',
                output = parsePackageDependenciesSvc.parse(input);
                expect(output).toBe(expectedOutput);
            })
            it('should accept valid input #2', function(){
                var input = 'KittenService: CamelCaser\n'+
                'CamelCaser:',
                expectedOutput = 'CamelCaser, KittenService',
                output = parsePackageDependenciesSvc.parse(input);
                expect(output).toBe(expectedOutput);
            })
        })
    })

});
