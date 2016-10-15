'use strict';
/**
 * Created by gilson on 11/10/16.
 */
angular.module('controleFinanceiroApp')

.controller('PerfilCtrl', ['$scope', '$rootScope', '$injector', function ($scope, $rootScope, $injector) {

  $scope.perfil = {}

  $scope.salvar = function() {
    var perfilResources = $injector.get('PerfilResources');

    if($scope.perfil.id) {
      perfilResources.update({ 'id' : $scope.perfil.id, 'idCliente' : $rootScope.usuario.cliente.id}, $scope.perfil, function(result) {
        $('#modalCadastrarPerfil').modal('hide');
        $scope.listar();
      });
    } else {
      perfilResources.save({ 'idCliente' : $rootScope.usuario.cliente.id}, $scope.perfil, function(result) {
        $('#modalCadastrarPerfil').modal('hide');
        $scope.listar();
      });
    }
  }

  $scope.adicionar = function() {
     $scope.perfil = {};
     $('#modalCadastrarPerfil').modal('show');
  }

  $scope.editar = function(perfil) {
    $scope.perfil = angular.copy(perfil);
    $('#modalCadastrarPerfil').modal('show');
  }

  $scope.removerUsuario = function(usuario) {
    // var usuarioResources = $injector.get('UsuarioResources');
    // usuarioResources.delete({ 'id' : usuario.id, 'idCliente' : $rootScope.usuario.cliente.id}, function(result) {
    //   $scope.listar();
    // });
  }

  $scope.listar = function() {
    var perfilResources = $injector.get('PerfilResources');
    $scope.perfis = perfilResources.query({ 'idCliente' : $rootScope.usuario.cliente.id});
  }

  $scope.listarOperacoes = function() {
    var operacaoResources = $injector.get('OperacaoResources');
    $scope.operacoes = operacaoResources.query();
  }

  $('#modalCadastrarPerfil').on('shown.bs.modal', function () {
    $scope.listarOperacoes();
  });

  $scope.listar();

}]);
