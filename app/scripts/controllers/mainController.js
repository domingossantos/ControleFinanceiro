'use strict';

/**
 * @ngdoc function
 * @name controleFinanceiroApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the controleFinanceiroApp
 */
angular.module('controleFinanceiroApp.controllers')
  .controller('MainCtrl', ['$rootScope','$scope', 'PagamentoResources','PagamentoClienteResources' , 'ItemPagamentoResources',function ($rootScope, $scope, PagamentoResources ,PagamentoClienteResources, ItemPagamentoResources) {
    $scope.menu = false;

    $scope.login = function(){
      $scope.menu = true;
    };

    $scope.movimentosHomologados =[];
    $scope.movimentosPendentes =[];
    $scope.movimentosNaoHomologados =[];

    $scope.detalheMovimento = {};
    $scope.itens = {};


    $scope.onDetalheMovimento = function(id){
      PagamentoResources.query({ idCliente:1, id : id}, function(success){
        $scope.detalheMovimento = success.item;
        var idPagamento = success.item.id;

        ItemPagamentoResources.query({id:idPagamento}, function(success){
          $scope.itens = success.itens;

        })

      });
    }

    $scope.onMovimentosPendentes = function(){
      PagamentoClienteResources.query({id : 1, status : 'PENDENTE_HOMOLOGACAO'}, function(success){

        $scope.movimentosPendentes = success.itens;
      });
    };

    $scope.onMovimentosHomologados = function(){
      PagamentoClienteResources.query({id : 1,status:'HOMOLOGADO'}, function(success){

        $scope.movimentosHomologados = success.itens;
      });
    };

    $scope.onMovimentosNaoHomologados = function(){
      PagamentoClienteResources.query({id : 1, status : 'NAO_HOMOLOGADO'}, function(success){
        $scope.movimentosNaoHomologados = success.itens;
      });
    };

    $scope.onMudarStatus = function(id,status){
      console.log(id);
      PagamentoResources.update({ id:id, status:status}, function(success){
        console.log(success);
      });
      $('#modalHomologa').modal('hide');
    }


    $scope.onMovimentosPendentes();
    $scope.onMovimentosHomologados();
    $scope.onMovimentosNaoHomologados();

  }]);
