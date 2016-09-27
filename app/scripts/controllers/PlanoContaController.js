'use strict';
/**
 * Created by domingossantos on 07/08/16.
 */
angular.module('controleFinanceiroApp.controllers')
  .controller('PlanoContaCtrl', ['$rootScope','$scope','$injector','PlanoContaResources','PlanoContaClienteResources',
      function ($rootScope, $scope, $injector ) {

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

      var planoContaResources = $injector.get('PlanoContaResources');

      planoContaResources.query({idCliente:1}).$promise.then(
        function(success){
          $scope.planocontas = success;
      }
      );


    };

    $scope.getCodigoConta = function(conta){
      var partes = conta.codigo.split(".");

      var ultimaParte = partes[partes.length - 1];
      $scope.incremento = ultimaParte;

    }

    $scope.onSalvar = function(){
      $scope.planoconta.codigo = $scope.incremento;
      var planoContaResource = $injector.get('PlanoContaResources');
      var clienteResources = $injector.get('ClienteResources');
      clienteResources.get({idCliente:1}).$promise.then(
        function(success){
          $scope.planoconta.cliente = success.item;
          planoContaResource.save({},angular.copy($scope.planoconta)).$promise.then(
            function (success) {
              $('#modalCadastro').modal('hide');
              $scope.atualizar();
            }
          );
        }
      );


    };

    $scope.onCarregar = function(conta){
      $scope.planoconta = conta;
      $scope.codigoSelecionado = conta;
      console.log($scope.planoconta);
    }

    $scope.atualizar();



  }]);
