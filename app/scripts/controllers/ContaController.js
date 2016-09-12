'use strict';
/**
 * Created by domingossantos on 07/08/16.
 */
angular.module('controleFinanceiroApp')
  .controller('ContaCtrl',['$rootScope','$scope','ContaCorrenteResources','SubContaResources',
      function ($rootScope, $scope, ContaCorrenteResources, SubContaResources) {
    $scope.contas = [];
    $scope.subconta = [];


    $scope.atualizar = function(){
      ContaCorrenteResources.query({'idCliente':1},function(success){
        $scope.contas = success.itens;
        var tab = success.itens[0].banco.sigla;
        console.log(tab);
        $scope.onTabOrder(tab);

      })
    }

    $scope.onTabOrder = function(tab){
      $(tab).attr('class','active');
    }

    $scope.atualizar();
  }]);
