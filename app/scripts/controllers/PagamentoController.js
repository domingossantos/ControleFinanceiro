'use strict';
/**
 * Created by domingossantos on 07/08/16.
 */
angular.module('controleFinanceiroApp')
  .controller('PagamentoCtrl',['$rootScope','$scope', '$injector', function ($rootScope, $scope, $injector) {

    $scope.formasPagamento = [];
    $scope.contas = [];
    $scope.obras = [];
    $scope.planosContas = [];
    $scope.fornecedores = [];

    $scope.itensPagamento = [];
    $scope.formaPagamentoSelecionada = null;
    $scope.obraSelecionada = null;
    $scope.contaSelecionada = null;
    $scope.planoContaSelecionado = null;
    $scope.fornecedorSelecionado = null;
    $scope.historico = null;
    $scope.valor = null;
    $scope.dataMovimento = null;

    $scope.valorTotal = 0;

    $scope.limparItem = function(){
      $scope.obraSelecionada = null;
      $scope.planoContaSelecionado = null;
      $scope.fornecedorSelecionado = null;
      $scope.historico = null;
      $scope.valor = null;

    }

    $scope.onSalvar = function(){
      console.log($scope.dataMovimento);

      var pagamentoResources = $injector.get('PagamentoResources');
      var pagamento = {
        descricao:'Pagamento',
        status : 'PENDENTE_HOMOLOGACAO',
        valor : $scope.valorTotal,
        dataOperacao : $scope.dataMovimento,
        detalhePagamento : {
          formaPagamento : $scope.formaPagamentoSelecionada
        }
      }

      var itensPagamento = $scope.itensPagamento;
      console.log($scope.itensPagamento);
      pagamentoResources.save({idSubConta: $scope.contaSelecionada.id}
                              ,pagamento,itensPagamento).$promise.then(
        function (success) {
          console.log(success);
        }
      );
    }

    $scope.onRegistraItem = function(){
      var item = {
        historico: $scope.historico,
        valor: $scope.valor,
        obra: $scope.obraSelecionada,
        fornecedor : $scope.fornecedorSelecionado,
        conta: $scope.contaSelecionada,
        planoConta : $scope.planoContaSelecionado

      }
      $scope.valorTotal = $scope.valorTotal + $scope.valor;

      $scope.itensPagamento.push(item);

      $scope.limparItem();
    }


    $scope.onDeleteItem = function(item){
      var index = $scope.itensPagamento.indexOf(item);
      $scope.itensPagamento.splice(index,1);

      $scope.valorTotal = $scope.valorTotal - item.valor;
    }

    var formaPagamantoResources = $injector.get('FormaPagamantoResources');

    formaPagamantoResources.query({}).$promise.then(
      function(success){
        $scope.formasPagamento = success.itens;
      }
    )

    var subContaResources = $injector.get('SubContaResources');

    subContaResources.query({idContaCorrente:1}).$promise.then(
      function (success) {
        $scope.contas = success.itens;
      }
    );


    var obraResources = $injector.get('ObraResources');
    obraResources.query({idCliente:1}).$promise.then(
      function (success) {
        $scope.obras = success.itens;
      }
    );

    var planoContaResources = $injector.get('PlanoContaResources');
    planoContaResources.query({idCliente:1}).$promise.then(
      function (success) {
        $scope.planosContas = success.itens;
      }
    );


    var fornecedorResources = $injector.get('FornecedorResources');
    fornecedorResources.query({idCliente:1}).$promise.then(
      function (success) {
        $scope.fornecedores = success.itens;
      }
    );



  }]);
