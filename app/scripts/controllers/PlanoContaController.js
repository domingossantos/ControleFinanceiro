'use strict';
/**
 * Created by domingossantos on 07/08/16.
 */
angular.module('controleFinanceiroApp.controllers')
  .controller('PlanoContaCtrl', ['$rootScope','$scope','PlanoContaResources','PlanoContaClienteResources', function ($rootScope, $scope, PlanoContaResources, PlanoContaClienteResources ) {
    $scope.planoconta = {
      codigo : 0,
      descricao : null,
      tipoPlanoConta : null
    };

    $scope.incremento = 0;
    $scope.codigoSelecionado = 0;
    $scope.formulario = false;
    $scope.painel = true;


    $scope.planocontas = [];

    $scope.atualizar = function(){
      PlanoContaResources.query({ idCliente : 1},function(success){
        console.log(success);
        $scope.planocontas = success.itens;
      });
    };


    $scope.onSalvar = function(){
      $scope.planoconta.codigo = $scope.incremento;
      PlanoContaResources.save({id : 1},angular.copy($scope.planoconta),function(success){
        alert(success.mensagem);
        $scope.atualizar();
        $scope.onCancelar();
      });
    };

    $scope.onNovo = function(){
      $scope.painel = false;
      $scope.formulario = true;
    }


    $scope.onCancelar = function(){
      $scope.painel = true;
      $scope.formulario = false;
      $scope.onLimpar();
    }

    $scope.onLimpar = function () {
      $scope.planoconta.codigo = 0;
      $scope.planoconta.descricao = "";
      $scope.planoconta.tipoPlanoConta = "";

    }


    $scope.getCodigoConta = function(id){
      var idx = parseFloat(id.codigo) + 0.1;
      $scope.incremento = Number(idx).toFixed(1);
    }


    $scope.onCarregar = function(id){
      PlanoContaResources.get({id : id},function(success){

        console.log(success.item);
        $scope.painel = false;
        $scope.formulario = true;

        $scope.planoconta = success.item;

      })

    }


    $scope.atualizar();



  }]);
