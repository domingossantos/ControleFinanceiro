'use strict';
/**
 * Created by domingossantos on 07/08/16.
 */
angular.module('controleFinanceiroApp')
  .controller('DepositoCtrl',['$rootScope','$scope', '$injector', '$location','$timeout', '$q', '$log', function ($rootScope, $scope, $injector, $location,$timeout, $q, $log) {

    $scope.formasPagamento = [];
    $scope.contas = [];
    $scope.obras = [];
    $scope.planoContas = [];
    $scope.formaPagamentoSelecionada = null;
    $scope.obraSelecionada = null;
    $scope.contaSelecionada = null;
    $scope.planoContaSelecionado;
    $scope.valor = null;
    $scope.dataMovimento = null;

    $scope.deposito = {
      subConta : null,
      obra : null,
      descricao : null,
      valor : null,
      dataOperacao : null,
      planoConta : null
    }

    $scope.limparCampos = function(){
      $scope.formaPagamentoSelecionada = null;
      $scope.obraSelecionada = null;
      $scope.contaSelecionada = null;
      $scope.valor = null;
      $scope.dataMovimento = null;
    }

    $scope.onSalvar = function(){
      var data = $scope.dataMovimento.substring(4,8).concat('-'+$scope.dataMovimento.substring(2,4)).concat('-'+ $scope.dataMovimento.substring(0,2));
      var deposito = {
        contaCorrente : $scope.contaSelecionada,
        obra : $scope.obraSelecionada,
        descricao : 'Deposito',
        valor : $scope.valor,
        dataOperacao : data,
        status : 'PENDENTE_HOMOLOGACAO',
        planoConta : $scope.planoContaSelecionado
      }

      var depositoResources = $injector.get('DepositoResources');
      depositoResources.save({},angular.copy(deposito)).$promise.then(
        function (success) {

          $scope.limparCampos();
          alert('Registro salvo');
          $location.path('/main');
        }
      )
    }


    var planoContaResources = $injector.get('PlanoContaResources');

    planoContaResources.query({idCliente:1,tipo:'RECEITA'}).$promise.then(
      function (success) {

        for(var i = 0; i < success.itens.length; i++){

          var itemPlano = {
            planoConta : {},
            descricao : null
          }
          itemPlano.planoConta = success.itens[i];
          itemPlano.descricao = success.itens[i].codigo + ' - '+ success.itens[i].descricao;

          $scope.planoContas[i] = itemPlano;
        }


      }
    );


    var formaPagamantoResources = $injector.get('FormaPagamantoResources');

    formaPagamantoResources.query({}).$promise.then(
      function(success){
        $scope.formasPagamento = success.itens;
      }
    )

    var contaCorrenteResources = $injector.get('ContaCorrenteResources');

    contaCorrenteResources.query({}).$promise.then(
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


    /**
     *  Código para autocomplete
     */

    var self = this;

    self.simulateQuery = false;
    self.isDisabled    = false;

    // list of `state` value/display objects
    self.states        = $scope.planoContas;
    self.querySearch   = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange   = searchTextChange;

    self.newState = newState;

    function newState(state) {
      alert("Sorry! You'll need to create a Constitution for " + state + " first!");
    }


    function querySearch (query) {
      var results = query ? self.states.filter( createFilterFor(query) ) : self.states,
        deferred;
      if (self.simulateQuery) {
        deferred = $q.defer();
        $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
        return deferred.promise;
      } else {
        return results;
      }
    }

    function searchTextChange(text) {
      $log.info('Text changed to ' + text);
    }

    function selectedItemChange(item) {
      $log.info('Item changed to ' + JSON.stringify(item));
    }

    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
      };

    }

  }]);
