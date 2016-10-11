'use strict';
/**
 * Created by gilson on 11/10/16.
 */
angular.module('controleFinanceiroApp')

.controller('UsuarioCtrl', ['$scope', '$rootScope', '$injector', function ($scope, $rootScope, $injector) {

  $scope.usuario = {}

  $scope.salvar = function() {

  }

  $scope.adicionarUsuario = function() {
    $scope.usuario = {};
    $('#modalCadastrarUsuario').modal('show');
  }

  $scope.listar = function() {
    var usuarioResources = $injector.get('UsuarioResources');
    $scope.usuarios = usuarioResources.query({ 'idCliente' : $rootScope.usuario.cliente.id});
  }

  $scope.listarPerfis = function() {
    var perfilResources = $injector.get('PerfilResources');
    $scope.perfis = perfilResources.query({ 'idCliente' : $rootScope.usuario.cliente.id});
  }

  $('#modalCadastrarUsuario').on('shown.bs.modal', function () {
    $scope.listarPerfis();
  });

  $scope.listar();

}]);
