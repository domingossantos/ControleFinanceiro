'use strict';
/**
 * Created by domingossantos on 07/08/16.
 */
angular.module('controleFinanceiroApp.controllers')
  .controller('PagamentoEdicaoCtrl',['$rootScope','$scope', '$injector', '$location', '$routeParams', 'growl', function ($rootScope, $scope, $injector, $location, $routeParams, growl) {

    $scope.planosContas = [];
    $scope.fornecedores = [];
    $scope.obras = [];



    $scope.itemPagamento = {
      historico: null,
      valor: null,
      obra: null,
      fornecedor : null,
      planoConta : null
    }

    $scope.limparCampos = function () {
      $scope.itemPagamento = {
        historico: null,
        valor: null,
        obra: null,
        fornecedor : null,
        planoConta : null
      }
    }


    var formaPagamantoResources = $injector.get('FormaPagamantoResources');
    formaPagamantoResources.query({},function(success){
      $scope.formasPagamento = success.itens;
    })

    var pagamentoResources = $injector.get('PagamentoResources');

    $scope.onCarregaPagamento = function(idPagamento){
      pagamentoResources.get({idPagamento:idPagamento},function (success) {
        $scope.pagamento = success.item;
        $scope.onCarregaItens();
      })
    }

    if($routeParams.idPagamento != null) {
      $scope.onCarregaPagamento($routeParams.idPagamento);
    }

    var itemPagamentoResources = $injector.get('ItemPagamentoResources');
    $scope.onCarregaItens = function(){
      itemPagamentoResources.query({idPagamento:$scope.pagamento.id},function (success) {
        $scope.itensPagamento = success.itens;
      });
    }

    var obraResources = $injector.get('ObraResources');
    obraResources.query(function (success) {
      $scope.obras = success.itens;
    });

    var planoContaResources = $injector.get('PlanoContaResources');

    planoContaResources.query({tipo:'DESPESA'},function (success) {
      for(var i = 0; i < success.itens.length; i++){
        var itemPlano = {
          planoConta : {},
          descricao : null
        }

        itemPlano.planoConta = success.itens[i];
        itemPlano.descricao = success.itens[i].codigo + ' - '+ success.itens[i].descricao;

        $scope.planosContas[i] = itemPlano;
      }

      console.log($scope.planosContas);
    });

    var fornecedorResources = $injector.get('FornecedorResources');
    fornecedorResources.query({}, function (success) {
      for(var i = 0; i < success.itens.length; i++){
        var itemFornecedor = {
          fornecedor : {},
          descricao : null
        }
        itemFornecedor.fornecedor = success.itens[i];
        itemFornecedor.descricao = success.itens[i].id + ' - '+ success.itens[i].nome;

        $scope.fornecedores[i] = itemFornecedor;
      }

    })


    $scope.onRegistraItem = function(){

      console.log($scope.itemPagamento);
      itemPagamentoResources.save({idPagamento:$scope.pagamento.id}
        ,angular.copy($scope.itemPagamento)).$promise.then(
        function (success) {
          $scope.pagamento.valor += $scope.itemPagamento.valor;
          $scope.onCarregaItens();
          $scope.atualizarPagamento('RASCUNHO');
          $scope.limparCampos();
        },
        function (error) {
          console.log(error);
        }
      );
    }

    $scope.onDeleteItem = function(item){

      itemPagamentoResources.delete({idItemPagamento:item.id}).$promise.then(
        function (success) {
          $scope.pagamento.valor -= item.valor;

          $scope.onCarregaItens();
        }
      );

    }

    $scope.atualizarPagamento = function(status){

      pagamentoResources.update({idPagamento: $scope.pagamento.id, status: status}
        ,angular.copy($scope.pagamento)).$promise.then(
        function (success) {
          growl.info('Pagamento atualizado');
        },
        function (error) {
          console.log(error);
        }
      );
    }

    $scope.onSalvar = function () {
      $scope.atualizarPagamento('PENDENTE_HOMOLOGACAO');
      $location.path('/movimento/pagamento');
    }


  }]);
