'use strict';

/* App Module */

var app = angular.module('app', [ ]);


app.controller('mainController', ['$scope','ParsePackageDependenciesService',
    function($scope, ParsePackageDependenciesService) {
        $scope.change = function(){
            $scope.output = ParsePackageDependenciesService.parse($scope.input);
        }
    }]);

app.factory('ParsePackageDependenciesService', function(){
    var parse = function(a){return a;}

    return{
        parse:parse
    }
})
