'use strict';
/**
 * Created by domingossantos on 07/08/16.
 */
angular.module('controleFinanceiroApp')
  .controller('MovimentoCtrl', ['$rootScope',
      '$scope','FormaPagamantoResources','BancoResources','ContaResources','ObraResources', 'PlanoContaResources','PagamentoResources',
      function ($rootScope, $scope, FormaPagamantoResources, BancoResources, ContaResources, ObraResources, PlanoContaResources, PagamentoResources) {

    $scope.itensPagamento = [];
    $scope.detalhePagamento = {
      tipo : null,
      agencia : null,
      conta : null,
      numerocheque : null,
      cpfCpnj : null
    };

    $scope.detalhePagamento = {}
    $scope.formaPagamentoSelecionada = 0;
    $scope.formasPagamento = [];
    $scope.ContaSelecionada = 0;
    $scope.contas = [];
    $scope.obraSelecionada = 0;
    $scope.obras = [];
    $scope.planoContaSelecionado = 0;
    $scope.planosContas = [];
    $scope.historico = '';
    $scope.valor;
    $scope.valorTotal = 0;
     $scope.onCarregaFormasPagamento = function () {
      FormaPagamantoResources.query({},function (success) {
        $scope.formasPagamento = success.itens;
      })
    };

    $scope.onCarregaContas = function(){
      ContaResources.query({id:1}, function(success){
        $scope.contas = success.itens;

      })
    };

    $scope.onCarregaObras = function(){
      ObraResources.query({id:1}, function(success){
        $scope.obras = success.itens;
        //console.log(success);
      })
    };

    $scope.onCarregaPlanosContas = function(){
      PlanoContaResources.query({id:1}, function(success){
        $scope.planosContas = success.itens;
        console.log(success);
      })
    };

    $scope.noRegistraItem = function(){
      var itemPagamento = {
        obra : $scope.obraSelecionada,
        descricao : $scope.historico,
        valor : $scope.valor,
        planoConta : $scope.planoContaSelecionado
      };

      $scope.itensPagamento.push(itemPagamento);

      $scope.valorTotal = Number (parseFloat($scope.valorTotal) + parseFloat($scope.valor)).toFixed(2);
      console.log($scope.itensPagamento);
    }

    $scope.onSalvar = function () {



      //PagamentoResources.save({}, angula.copy())
    }

    $scope.onCarregaFormasPagamento();
    $scope.onCarregaContas();
    $scope.onCarregaObras();
    $scope.onCarregaPlanosContas();

  }]);
