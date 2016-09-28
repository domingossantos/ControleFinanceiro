'use strict';
/**
 * Created by domingossantos on 07/08/16.
 */
angular.module('controleFinanceiroApp')

.controller('BalancoCtrl', ['$scope', '$injector', function ($scope, $injector) {

  $scope.gerar = function() {
    var balancoResources = $injector.get('BalancoResources');
    $scope.balanco = balancoResources.query();
  }

  $scope.isNegativo = function(index) {
    return
  }

}]);
