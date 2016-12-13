'use strict';
/**
 * Created by domingossantos on 07/08/16.
 */
angular.module('controleFinanceiroApp')

.controller('ContaCorrenteCtrl',['$rootScope', '$scope', '$injector', 'ImpressaoSrv', function ($rootScope, $scope, $injector, ImpressaoSrv) {
  $scope.contaCorrenteSelecionada = null;
  $scope.contaCorrente = {};
  $scope.contasCorrentes = [];
  $scope.valorTotal = 0;

  $scope.listarContasCorrentes = function() {
    var contaCorrenteResources = $injector.get('ContaCorrenteResources');
    contaCorrenteResources.query().$promise.then(
      function (success) {
        $scope.contasCorrentes = success;

        for(var i = 0; i < success.itens.length; i++){
          $scope.valorTotal += success.itens[i].saldoAtual;
        }
      }
    );
  }

  $scope.selecionarContaCorrente = function(contaCorrente) {
    $scope.contaCorrenteSelecionada = contaCorrente;
    $scope.listarSubContas($scope.contaCorrenteSelecionada);
  }

  $scope.adicionarContaCorrente = function() {
    $scope.contaCorrente = {};
    $('#modalContaCorrente').modal('show');
  }

  $scope.salvarContaCorrente = function() {
    var contaCorrenteResources = $injector.get('ContaCorrenteResources');

    if($scope.contaCorrente.id) {
      contaCorrenteResources.update({id : $scope.contaCorrente.id}, $scope.contaCorrente, function(result) {
        $('#modalContaCorrente').modal('hide');
        $scope.listarContasCorrentes();
      });
    } else {
      contaCorrenteResources.save($scope.contaCorrente, function(result) {
        $('#modalContaCorrente').modal('hide');
        $scope.listarContasCorrentes();
      });
    }
  }

  $scope.editarContaCorrente = function(contaCorrente) {
    $scope.contaCorrente = angular.copy(contaCorrente);
    $('#modalContaCorrente').modal('show');
  }

  $scope.atualizarBanco = function(bancoSelecionado) {
    $scope.contaCorrente.banco = bancoSelecionado;
  }

  $scope.listarBancos = function() {
    var bancoResources = $injector.get('BancoResources');
    $scope.bancos = bancoResources.query();
  }

  $('#modalContaCorrente').on('shown.bs.modal', function () {
    $scope.listarBancos();
  });

  $scope.listarContasCorrentes();

    $scope.onImprimir = function (nomeDiv) {
        ImpressaoSrv.imprimirDiv(nomeDiv);
    }
}]);
