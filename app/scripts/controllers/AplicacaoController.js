'use strict';
/**
 * Created by domingossantos on 07/08/16.
 */
angular.module('controleFinanceiroApp.controllers')
  .controller('AplicacaoCtrl', ['$rootScope','$scope','$injector','growl', function ($rootScope, $scope, $injector,growl ) {
    $scope.tipo = 0;
    $scope.labelContaOrigem = 'Conta Origem';
    $scope.labelContaDestino = 'Conta Destino';
    $scope.contaOrigemSelecionada = null;
    $scope.contaDestinoSelecionada = null;
    $scope.dataMovimento = null;
    $scope.contasOrigem = [];
    $scope.contasDestino = [];
    $scope.aplicacoes = [];

    $scope.aplicacao = {
      descricao : null,
      dataOperacao : null,
      origem : null,
      destino : null,
      tipo : null,
      status : null,
      valor : null
    }

    var aplicacaoResources = $injector.get('AplicacaoResources');

    $scope.onSalvar = function () {

        var data = new Date($scope.dataMovimento.substring(4,8),
                            $scope.dataMovimento.substring(2,4),
                            $scope.dataMovimento.substring(0,2));

      $scope.aplicacao.dataOperacao = data;
      $scope.aplicacao.status = 'PENDENTE_HOMOLOGACAO';
      $scope.aplicacao.origem = $scope.contaOrigemSelecionada;
      $scope.aplicacao.destino = $scope.contaDestinoSelecionada;

      if($scope.tipo == 1){
        $scope.aplicacao.tipo = 'APLICACAO';
      }
      if($scope.tipo == 2){
        $scope.aplicacao.tipo = 'TRANSFERENCIA';
      }
      if($scope.tipo == 3){
        $scope.aplicacao.tipo = 'RESGATE';
      }


      console.log($scope.aplicacao);
      aplicacaoResources.save({idContaCorrenteOrigem:$scope.contaOrigemSelecionada.id,
                               idContaCorrenteDestino:$scope.contaDestinoSelecionada.id,
                               tipo:$scope.aplicacao.tipo},
                              angular.copy($scope.aplicacao)).$promise.then(
        function (success) {
            growl.success(success.mensagem,{ttl:9000})
            $location.path('/movimento/aplicacao');
        },
        function (error) {
            growl.error('Erro ao salvar registro');
        }
      );
    }


    var contaCorrenteResources = $injector.get('ContaCorrenteResources');

    contaCorrenteResources.query({}).$promise.then(
      function (success) {

        $scope.contasOrigem = success.itens;
        $scope.contasDestino = success.itens;
      }, function (error) {
        console.log(error);
      }
    );

    $scope.escolhaTipo = function () {
      if($scope.tipo == 1){
        $scope.labelContaOrigem = 'Conta Origem do Recurso';
        $scope.labelContaDestino = 'Conta Destino da Aplicação';
      } else if($scope.tipo == 2){
        $scope.labelContaOrigem = 'Conta Origem do Recurso';
        $scope.labelContaDestino = 'Conta Destino da Transferência';
      } else if($scope.tipo == 3){
        $scope.labelContaOrigem = 'Conta Origem do Recurso';
        $scope.labelContaDestino = 'Conta Destino da Aplicação';
      } else {
        $scope.labelContaOrigem = 'Conta Origem';
        $scope.labelContaDestino = 'Conta Destino';
      }
    }

    $scope.onPesquisar = function () {
        aplicacaoResources.query({},function (success) {
            $scope.aplicacoes = success;
        })
    }

    $scope.onPesquisar();


  }]);
