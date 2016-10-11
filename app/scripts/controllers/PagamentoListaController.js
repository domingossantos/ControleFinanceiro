'use strict';
/**
 * Created by domingossantos on 07/08/16.
 */
angular.module('controleFinanceiroApp.controllers')
  .controller('PagamentoListaCtrl',['$rootScope','$scope', '$injector', '$location', 'growl', function ($rootScope, $scope, $injector, $location, growl) {

    $scope.pagamentos = [];
    $scope.valorTotal = 0;

    var pagamentoListaResources = $injector.get('PagamentoListaResources');

    pagamentoListaResources.query({idContaCorrente:0, status:'', maxResults : 10, firstResult: 0}).$promise.then(
      function (success) {
        $scope.pagamentos = success;
        console.log(success);
      }
    );

  }]);
