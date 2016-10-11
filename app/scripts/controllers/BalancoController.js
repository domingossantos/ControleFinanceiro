'use strict';
/**
 * Created by domingossantos on 07/08/16.
 */
angular.module('controleFinanceiroApp')

.controller('BalancoCtrl', ['$scope', '$injector', function ($scope, $injector) {

  $scope.dataInicio = null;
  $scope.dataFim = null;

  $scope.gerar = function() {
    var balancoResources = $injector.get('BalancoResources');
    $scope.balanco = balancoResources.query({inicio : $scope.dataInicio, fim : $scope.dataFim});
  }

}]);
