'use strict';
/**
 * Created by domingossantos on 07/08/16.
 */
angular.module('controleFinanceiroApp.controllers')
  .controller('PlanoContaCtrl', ['$rootScope','$scope','$injector','growl', function ($rootScope, $scope, $injector ,growl) {

    $scope.planoconta = {
      codigo : 0,
      descricao : null,
      tipoPlanoConta : null,
      status : null
    };

    $scope.incremento = 0;
    $scope.codigoSelecionado = 0;
    $scope.formulario = false;
    $scope.painel = true;

    $scope.planoContasCombo = [];
    $scope.planocontas = [];
    var planoContaResources = $injector.get('PlanoContaResources');


    $scope.atualizar = function(){
      planoContaResources.query({tipo:'GERAL'}).$promise.then(
        function(success){
          $scope.planoContasCombo = success;
      }
      );

      planoContaResources.query({}).$promise.then(
        function(success){
          $scope.planocontas = success;
        }
      );

    };

    $scope.gerarCodigo = function(plano){

      var parte = '';

      if(plano.codigo == '1'){
        parte = parte+'.';
      }

      parte = plano.codigo+'.';
      planoContaResources.query({tipo:null,parte:parte}).$promise.then(
        function(success){
          var i = success.itens.length+1;
          parte = parte + i;
          $scope.incremento = parte;
        }

      );

    }

    $scope.onAtualizarStatus = function(planoConta){

      if(planoConta.status == 'INATIVO'){
        planoConta.status = 'ATIVO';
      } else {
        planoConta.status = 'INATIVO';
      }

      planoContaResources.update({idPlanoConta:planoConta.id},angular.copy(planoConta)).$promise.then(
        function (success) {
          growl.info(success.mensagem);
          $scope.atualizar();
        }
      );
    }

    $scope.onAtualizar = function(planoConta){
      planoContaResources.update({idPlanoConta:planoConta.id},angular.copy(planoConta)).$promise.then(
        function (success) {
          growl.info(success.mensagem);
          $scope.atualizar();
          $('#modalAlteracao').modal('hide');
        }
      );
    }

    $scope.onSalvar = function(){
      $scope.planoconta.codigo = $scope.incremento;
      $scope.planoconta.status = 'ATIVO';
      var planoContaResource = $injector.get('PlanoContaResources');
      planoContaResource.save({},angular.copy($scope.planoconta)).$promise.then(
        function (success) {
          growl.info(success.mensagem);

          $('#modalCadastro').modal('hide');
          $scope.atualizar();
        }
      );

    };

    $scope.onCarregar = function(conta){
      $scope.planoconta = conta;
    }

    $scope.atualizar();



  }]);
