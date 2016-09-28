'use strict';

/**
 * @ngdoc function
 * @name controleFinanceiroApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the controleFinanceiroApp
 */
angular.module('controleFinanceiroApp.controllers')
  .controller('MainCtrl', ['$rootScope','$scope', '$injector',function ($rootScope, $scope, $injector) {
    $scope.menu = false;

    $scope.login = function(){
      $scope.menu = true;
    };

    $scope.movimentosHomologados =[];
    $scope.movimentosPendentes =[];
    $scope.movimentosNaoHomologados =[];

    $scope.posicaoContas = 0;

    $scope.detalheMovimento = {};
    $scope.itens = {};

    $scope.movimentoResources = $injector.get('MovimentoResources');
    $scope.itensPagamentoResources = $injector.get('ItemPagamentoResources');

    $scope.onAtualizarPosicao = function () {
      var posicaoContaCorrenteResources = $injector.get('PosicaoContaCorrenteResources');

      posicaoContaCorrenteResources.get({idCliente:1}).$promise.then(
        function (success) {
          $scope.posicaoContas = success.item;

        }
      );
    };

    $scope.onDetalheMovimento = function(id, origem){

      if(origem == 1){
        $('#btnHomologar').hide();
      } else {
        $('#btnHomologar').show();
      }
      $scope.itens = {};
      $scope.movimentoResources.get({idMovimento:id}).$promise.then(
        function (success) {
          $scope.detalheMovimento = success.item;

          $scope.itensPagamentoResources.get({idPagamento:id}).$promise.then(
            function (success) {
              $scope.itens = success.itens;
            }
          );
        }
      );

    }

    $scope.onMovimentosPendentes = function(){

      $scope.movimentoResources.query({idCliente: 1, status : 'PENDENTE_HOMOLOGACAO'}).$promise.then(
        function (success) {
          $scope.movimentosPendentes = success.itens;
        }
      );

    };

    $scope.onMovimentosHomologados = function(){

      $scope.movimentoResources.query({idCliente: 1, status : 'HOMOLOGADO'}).$promise.then(
        function (success) {
          $scope.movimentosHomologados = success.itens;
        }
      );

    };

    $scope.onMovimentosNaoHomologados = function(){

      $scope.movimentoResources.query({idCliente: 1, status : 'NAO_HOMOLOGADO'}).$promise.then(
        function (success) {
          $scope.movimentosNaoHomologados = success.itens;
        }
      );
    };

    $scope.onMudarStatus = function(movimento,status){

      movimento.status = status;


      var homologarResources = $injector.get('HomologarResources');

      homologarResources.update({idMovimento: movimento.id},{}).$promise.then(
        function (success) {

          $('#modalHomologa').modal('hide');

          $scope.onMovimentosPendentes();
          $scope.onMovimentosHomologados();
          $scope.onMovimentosNaoHomologados();
          $scope.onAtualizarPosicao();
        }
      );




    }


    $scope.onMovimentosPendentes();
    $scope.onMovimentosHomologados();
    $scope.onMovimentosNaoHomologados();
    $scope.onAtualizarPosicao();

  }]);
