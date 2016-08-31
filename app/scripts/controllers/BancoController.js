'use strict';
/**
 * Created by domingossantos on 07/08/16.
 */
angular.module('controleFinanceiroApp.controllers')
  .controller('PlanoContaCtrl', ['$rootScope','$scope','BancoResources', function ($rootScope, $scope, BancoResources ) {

    $scope.bancos = [];

    $scope.atualizar = function(){
      BancoResources.query({},function (success) {
        $scope.bancos = success.itens;

      })
    };

    $scope.atualizar();



  }]);
