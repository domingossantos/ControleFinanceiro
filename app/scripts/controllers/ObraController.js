'use strict';
/**
 * Created by domingossantos on 12/08/16.
 */
angular.module('controleFinanceiroApp')
  .controller('ObraCtrl',['$rootScope', '$scope','$injector' ,function ($rootScope, $scope, $injector) {
    $scope.obras =[];
    $scope.obra = {
      apelido : null,
      endereco : null,
      cliente : null,
      ativo : true
    }

    $scope.listarObras = function(){
      var obraResources = $injector.get('ObraResources');
      var result = obraResources.query({idCliente:1});
      result.$promise.then(
        function(success){

          $scope.obras = success;
        }
        ,function(error){
          console.log(error);
        }
      )


    }

    $scope.validaCampos = function(){
      var valido = true;

      if($('#nome').val() == '' || $('#endereco').val() == ''){
        valido = false;
      }
      return valido;
    }

    $scope.onSalvar = function(){

      if($scope.validaCampos()) {
        var obraResources = $injector.get('ObraResources');
        var clienteResources = $injector.get('ClienteResources');
        clienteResources.get({idCliente:1}).$promise.then(
          function (success) {

            $scope.obra.cliente = success.item;

            obraResources.save({},angular.copy($scope.obra)).$promise.then(
              function (success) {
                $('#modalCadastrarObra').modal('hide');

              },
              function (error) {
                alert(error.mensagem);
              }
            )
          }
        )
      } else {
        alert('Todos os campos são obrigatorios');
      }

    }


    $scope.onDelete = function(obra){
      obra.ativo = false;
      var obraResources = $injector.get('ObraResources');

      obraResources.update({idObra:obra.id}, obra).$promise.then(
        function (success) {
          console.log(success);
          $scope.listarObras()
        },
        function (error) {
          alert(error);
        }
      )


    }


    $('#modalCadastrarObra').on('hidden.bs.modal', function () {
      $scope.listarObras();
    });

    $('#modalCadastrarObra').on('shown.bs.modal', function () {
      $('#nome').focus();
    })

    $scope.listarObras();


  }]);
