'use strict';
/**
 * Created by domingossantos on 12/08/16.
 */
angular.module('controleFinanceiroApp')
  .controller('ExtratoCtrl',['$rootScope', '$scope','$injector' ,function ($rootScope, $scope, $injector) {
    $scope.movimentos = [];
    $scope.dataInicio = null;
    $scope.dataFim = null;
    $scope.obraSelecionada = null;
    $scope.contaSelecionada = null;
    $scope.parametros = { inicio : null, fim : null, idObra : null, idContaCorrente : null };

    $scope.dateOptions = {
      formatYear: 'yyyy',
      maxDate: new Date(2020, 5, 22),
      minDate: new Date(2000,1,1),
      startingDay: 1,

    };

    $scope.popupDataInicio = {
      opened: false
    };

    $scope.openPopupDataInicio = function() {
      $scope.popupDataInicio.opened = true;
    };

    $scope.popupDataFim = {
      opened: false
    };

    $scope.openPopupDataFim = function() {
      $scope.popupDataFim.opened = true;
    };

    var movimentoResources = $injector.get('ExtratoResources');

    $scope.onPesquisar = function( dataInicio, dataFim) {
      $scope.parametros.inicio = dataInicio;
      $scope.parametros.fim = dataFim;

      if($scope.contaSelecionada == null && $scope.obraSelecionada == null) {
        alert('Selecione uma Conta Corrente ou Obra');
        return;
      }

      if($scope.tipoConsulta == 'C') {
        $scope.parametros.idContaCorrente = $scope.contaSelecionada.id;
        $scope.parametros.idObra = null;
      } else if($scope.tipoConsulta == 'O') {
        $scope.parametros.idObra = $scope.obraSelecionada.id;
        $scope.parametros.idContaCorrente = null;
      }

      console.log($scope.parametros);

      movimentoResources.query($scope.parametros).$promise.then(
        function (success) {
          $scope.movimentos = success.itens;

          if($scope.tipoConsulta == 'C') {
            $scope.saldoAtual = $scope.contaSelecionada.saldoAtual;
          } else if($scope.tipoConsulta == 'O') {
            $scope.saldoAtual = $scope.obraSelecionada.saldoAtual;
          }
        }
      );
    }

    $scope.atualizarObra = function(obra) {
      $scope.obraSelecionada = obra;
      $scope.movimentos = [];
      $scope.saldoAtual = null;
    }

    $scope.atualizarConta = function(conta) {
      $scope.contaSelecionada = conta;
      $scope.movimentos = [];
      $scope.saldoAtual = null;
    }

    $scope.preencherFiltros = function() {
      var obraResources = $injector.get('ObraResources');
      $scope.obras = obraResources.query();

      var contaCorrenteResources = $injector.get('ContaCorrenteResources');
      $scope.contas = contaCorrenteResources.query();
    }

    $scope.preencherFiltros();
  }]);
