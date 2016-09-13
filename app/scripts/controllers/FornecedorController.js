'use strict';
/**
 * Created by domingossantos on 12/08/16.
 */
angular.module('controleFinanceiroApp')
  .controller('FornecedorCtrl',['$rootScope', '$scope','$injector' ,function ($rootScope, $scope, $injector) {
    $scope.fornecedores =[];
    $scope.fornecedor = {
      descricao : null,
      nome : null,
      cliente : null
    }

    $scope.listarFornecedor = function(){
      var fornecedorResources = $injector.get('FornecedorResources');
      var result = fornecedorResources.query({idCliente:1});
      result.$promise.then(
        function(success){
          $scope.fornecedores = success;
          console.log(success);
        }
        ,function(error){
          console.log(error);
        }
      )
    }

    $scope.validaCampos = function(){
      var valido = true;

      if($('#nome').val() == '' || $('#descricao').val() == ''){
        valido = false;
      }
      return valido;
    }

    $scope.limparCampos = function () {
      $('#nome').val('');
      $('#descricao').val('');
    }

    $scope.onSalvar = function(){

      if($scope.validaCampos()) {
        var fornecedorResources = $injector.get('FornecedorResources');
        var clienteResources = $injector.get('ClienteResources');
        clienteResources.get({idCliente:1}).$promise.then(
          function (success) {

            $scope.fornecedor.cliente = success.item;

            console.log($scope.fornecedor);

            fornecedorResources.save({},angular.copy($scope.fornecedor)).$promise.then(
              function (success) {
                $('#modalCadastrarFornecedor').modal('hide');
                $scope.limparCampos();

              },
              function (error) {
                console.log('Erro ao gravar fornecedor');
                alert(error);
              }
            )
          },
          function (error) {
            console.log('Erro ao carregar cliente');
            console.log(error);
          }
        )
      } else {
        alert('Todos os campos são obrigatorios');
      }

    }


    $scope.onAtualizar = function(fornecedor){

      var fornecedorResources = $injector.get('FornecedorResources');

      fornecedorResources.update({idFornecedor:fornecedor.id}, fornecedor).$promise.then(
        function (success) {
          console.log(success);
          $scope.listarFornecedor();
        },
        function (error) {
          alert(error);
        }
      )


    }


    $('#modalCadastrarFornecedor').on('hidden.bs.modal', function () {
      $scope.listarFornecedor();
    });

    $('#modalCadastrarFornecedor').on('shown.bs.modal', function () {
      $('#nome').focus();
    })

    $scope.listarFornecedor();


  }]);
