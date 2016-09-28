'use strict';
/**
 * Created by domingossantos on 12/08/16.
 */
angular.module('controleFinanceiroApp')
  .controller('ExtratoCtrl',['$rootScope', '$scope','$injector' ,function ($rootScope, $scope, $injector) {
    $scope.movimentos = [];
    $scope.dataInicio = null;
    $scope.dataFim = null;

    var movimentoResources = $injector.get('ExtratoResources');

    $scope.onPesquisar = function( dataInicio, dataFim){
      movimentoResources.query({inicio:dataInicio, fim:dataFim}).$promise.then(
        function (success) {
          $scope.movimentos = success.itens;
        }
      );
    }

    $scope.onPesquisar('01012016', '01102016');
  }]);
