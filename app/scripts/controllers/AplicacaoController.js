'use strict';
/**
 * Created by domingossantos on 07/08/16.
 */
angular.module('controleFinanceiroApp.controllers')
  .controller('AplicacaoCtrl', ['$rootScope','$scope','$injector', function ($rootScope, $scope, $injector ) {
  $scope.tipo = 0;
  $scope.escolhaTipo = function () {
    console.log($scope.tipo);
  }
  }]);
