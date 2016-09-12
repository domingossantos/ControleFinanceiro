'use strict';
/**
 * Created by domingossantos on 07/08/16.
 */
angular.module('controleFinanceiroApp')
  .controller('ContaCtrl',['$rootScope','$scope','ContaCorrenteResources','SubContaResources','BancoResources',
      function ($rootScope, $scope, ContaCorrenteResources, SubContaResources, BancoResources) {
    $scope.contas = [];
    $scope.subconta = [];
    $scope.grupoContaFisica = false;
    $scope.grupoContaVirtual = false;
    $scope.tipoConta = 1;
    $scope.bancoSelecionado = null;
    $scope.contaCorrenteSelecionado = null;
    $scope.conta = {
      numero : null,
      agencia : null,
      cliente : null,
      banco : null
    };
    $scope.subconta = {
      apelido : null,
      contaCorrente : null
    }
    BancoResources.query({},function(sucess){
      $scope.bancos = sucess.itens;
    });


    $scope.atualizar = function(){
      $scope.contas = [];
      ContaCorrenteResources.query({'idCliente':1},function(success){
        var itens = success.itens;
        $.each(itens, function(index, item){

          SubContaResources.query({'idContaCorrente': item.id}, function(sucess){
            item.subcontas = sucess.itens;
            $scope.contas.push(item);
          });

        });
      });
    }

    $scope.onSalvar = function () {
      if($scope.tipoConta == 1){
        $scope.conta.banco = $scope.bancoSelecionado;
        $scope.cliente = 1;
        ContaCorrenteResources.save({},angular.copy($scope.conta),function(success){
          alert(success.mensagem);
          $scope.atualizar();
        });
      } else {
        $scope.subconta.contaCorrente = $scope.contaCorrenteSelecionado;
        SubContaResources.save({idContaCorrente:$scope.contaCorrenteSelecionado.id, idSubConta:null}
          ,angular.copy($scope.subconta)
          ,function(success){

            alert(success.mensagem);
              $scope.atualizar();
          });
      }
    }

    $scope.onShowFormConta = function(){
      if($scope.tipoConta == 1){
        $scope.grupoContaFisica = true;
        $scope.grupoContaVirtual = false;
      } else {
        $scope.grupoContaFisica = false;
        $scope.grupoContaVirtual = true;
      }
    }

    $scope.onTabOrder = function(tab){
      $(tab).attr('class','active');
    }

    $scope.atualizar();
  }]);
