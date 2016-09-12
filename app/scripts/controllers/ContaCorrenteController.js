'use strict';
/**
 * Created by domingossantos on 07/08/16.
 */
angular.module('controleFinanceiroApp')

.controller('ContaCorrenteCtrl',['$rootScope', '$scope', '$injector', function ($rootScope, $scope, $injector) {
    $scope.contasCorrentes = [];

    $scope.listarContasCorrentes = function() {
      var contaCorrenteResources = $injector.get('ContaCorrenteResources');
      $scope.contasCorrentes = contaCorrenteResources.query();
    }

    $scope.visualizarContaCorrente = function(idContaCorrente) {
      var contaCorrenteResources = $injector.get('ContaCorrenteResources');
      $scope.contaCorrenteVisualizar = contaCorrenteResources.get({ id: idContaCorrente });

      $('#modalContaCorrenteVisualizar').modal('show');
    }

    $scope.listarBancos = function() {
      var bancoResources = $injector.get('BancoResources');
      $scope.bancos = bancoResources.query();
    }

    $('#modalContaCorrente').on('shown.bs.modal', function () {
      $scope.listarBancos();
    });

    $('#modalContaCorrenteVisualizar').on('shown.bs.modal', function () {
      $scope.contaCorrenteVisualizar = null;
    });

    $scope.listarContasCorrentes();
}]);
