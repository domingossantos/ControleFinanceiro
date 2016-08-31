'use strict';
/**
 * Created by domingossantos on 07/08/16.
 */
angular.module('controleFinanceiroApp')
  .controller('ContaCtrl',['$rootScope','$scope','ContaResources',function ($rootScope, $scope, ContaResources) {
    $scope.contas = [];


    $scope.atualizar = function(){
      ContaResources.query({'id':1},function(success){
        $scope.contas = success.itens;
      })
    }


    $scope.atualizar();
  }]);
