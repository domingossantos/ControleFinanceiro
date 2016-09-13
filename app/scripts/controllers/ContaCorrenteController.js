'use strict';
/**
 * Created by domingossantos on 07/08/16.
 */
angular.module('controleFinanceiroApp')

.controller('ContaCorrenteCtrl',['$rootScope', '$scope', '$injector', function ($rootScope, $scope, $injector) {
  $scope.contaCorrenteSelecionada = null;
  $scope.contaCorrente = {};
  $scope.contasCorrentes = [];
  $scope.subcontas = [];
  $scope.subconta = {};
  $scope.subcontaSelecionada = null;

  $scope.listarContasCorrentes = function() {
    var contaCorrenteResources = $injector.get('ContaCorrenteResources');

    $scope.contasCorrentes = contaCorrenteResources.query(function(result) {
      if($scope.contasCorrentes.itens.length > 0) {
        $scope.contaCorrenteSelecionada = $scope.contasCorrentes.itens[0];
        $scope.listarSubContas($scope.contaCorrenteSelecionada);
      }
    });
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

  $scope.listarSubContas = function(contaCorrente) {
    var subContaResources = $injector.get('SubContaResources');
    $scope.subcontas = subContaResources.query({idContaCorrente : contaCorrente.id});
  }

  $scope.adicionarSubConta = function() {
    $scope.subconta = {};
    $scope.subconta.contaCorrente = $scope.contaCorrenteSelecionada;
    $('#modalSubConta').modal('show');
  }

  $scope.salvarSubConta = function() {
    var subContaResources = $injector.get('SubContaResources');

    if($scope.subconta.id) {
      subContaResources.update({
          idContaCorrente : $scope.subconta.contaCorrente.id,
          idSubConta : $scope.subconta.id
        }, $scope.subconta, function(result) {
          $('#modalSubConta').modal('hide');
          $scope.listarSubContas($scope.subconta.contaCorrente);
      });
    } else {
      subContaResources.save({idContaCorrente : $scope.subconta.contaCorrente.id}, $scope.subconta, function(result) {
        $('#modalSubConta').modal('hide');
        $scope.listarSubContas($scope.subconta.contaCorrente);
      });
    }
  }

  $scope.editarSubConta = function(subconta) {
    $scope.subconta = angular.copy(subconta);
    $('#modalSubConta').modal('show');
  }

  $scope.listarContasCorrentes();
}]);
