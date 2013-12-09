'use strict';

/* App Module */

var app = angular.module('app', [ ]);


app.controller('mainController', ['$scope', 'ParsePackageDependenciesService',
    function ($scope, ParsePackageDependenciesService) {
        $scope.change = function () {
            $scope.output = ParsePackageDependenciesService.parse($scope.input);
        }
    }]);

app.factory('ParsePackageDependenciesService', function () {
    var createPackageObjects = function (inputArray) {
            var i, tempArray, packages = [];
            try {
                for (i = 0; i < inputArray.length; i++) {
                    tempArray = inputArray[i].split(':');
                    packages[i] = {name: tempArray[0], requires: tempArray[1].trim()};
                }
            }
            catch (error) {
                throw  "PARSE ERROR: line " + (i + 1);
            }
            return packages;
        },
        getDependencies = function(currentPackage, packages, dependencyHistory){
            var dhI, pI, nextPackage, returnedDependencies;
            if(currentPackage.requires === '')
            {
                returnedDependencies = [];
                returnedDependencies.push(currentPackage.name);
                return returnedDependencies;
            }
            else {
                for(dhI = 0; dhI < dependencyHistory.length; dhI++){
                    if(currentPackage.requires === dependencyHistory[dhI]){
                        dependencyHistory.push(currentPackage.name);
                        dependencyHistory.push("*"+currentPackage.requires+"*");

                        throw "ERROR:Cyclical reference - " + dependencyHistory.join(', ').trim();
                    }
                }
                for(pI = 0; pI < packages.length; pI++){
                    if(packages[pI].name === currentPackage.requires){
                        nextPackage =  packages[pI];
                        dependencyHistory.push(currentPackage.name);
                        returnedDependencies = getDependencies(nextPackage, packages, dependencyHistory);
                        returnedDependencies.push(currentPackage.name);
                        return returnedDependencies;
                    }

                }

                throw "ERROR: missing required package '" + currentPackage.requires + "'";

            }
        },
        parseDependencies = function( packages){
            var i, j, dependencyHistory,
                currentPackage, dependenciesInOrder = [],
                distinctDependencies = [];
            for (i = 0; i < packages.length; i++) {
                dependencyHistory = [];
                currentPackage = packages[i];
                dependenciesInOrder = dependenciesInOrder.concat( getDependencies(currentPackage, packages, dependencyHistory));
            }
            for(i = 0; i < dependenciesInOrder.length; i++){
                if(distinctDependencies.indexOf(dependenciesInOrder[i]) < 0)
                    distinctDependencies.push(dependenciesInOrder[i]);
            }
            return distinctDependencies;
        },
        parse = function (input) {
            var inputArray = input.split('\n'),
                packages,
                dependencies;
            try {
                packages = createPackageObjects(inputArray)
                dependencies =  parseDependencies(packages);
            }
            catch (error) {
                return error;
            }

            return dependencies.join(', ');
        }


    return{
        parse: parse
    }
})
