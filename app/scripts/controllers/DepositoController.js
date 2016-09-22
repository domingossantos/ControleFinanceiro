'use strict';
/**
 * Created by domingossantos on 07/08/16.
 */
angular.module('controleFinanceiroApp')
  .controller('DepositoCtrl',['$rootScope','$scope', '$injector', '$location', function ($rootScope, $scope, $injector, $location) {

    $scope.formasPagamento = [];
    $scope.contas = [];
    $scope.obras = [];
    $scope.formaPagamentoSelecionada = null;
    $scope.obraSelecionada = null;
    $scope.contaSelecionada = null;
    $scope.valor = null;
    $scope.dataMovimento = null;

    $scope.deposito = {
      subConta : null,
      obra : null,
      descricao : null,
      valor : null,
      dataOperacao : null
    }

    $scope.limparCampos = function(){
      $scope.formaPagamentoSelecionada = null;
      $scope.obraSelecionada = null;
      $scope.contaSelecionada = null;
      $scope.valor = null;
      $scope.dataMovimento = null;
    }

    $scope.onSalvar = function(){

      var deposito = {
        subConta : $scope.contaSelecionada,
        obra : $scope.obraSelecionada,
        descricao : 'Deposito',
        valor : $scope.valor,
        dataOperacao : $scope.dataMovimento,
        status : 'PENDENTE_HOMOLOGACAO'
      }

      var depositoResources = $injector.get('DepositoResources');
      depositoResources.save({},angular.copy(deposito)).$promise.then(
        function (success) {
          console.log(success);
          $scope.limparCampos();
          alert('Registro salvo');
          $location.path('/main');
        }
      )
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






  }]);
