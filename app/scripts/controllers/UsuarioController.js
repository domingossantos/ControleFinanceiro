'use strict';
/**
 * Created by gilson on 11/10/16.
 */
angular.module('controleFinanceiroApp')

.controller('UsuarioCtrl', ['$scope', '$rootScope', '$injector', function ($scope, $rootScope, $injector) {

  $scope.usuario = {}

  $scope.salvar = function() {
    var usuarioResources = $injector.get('UsuarioResources');

    if($scope.usuario.id) {
      usuarioResources.update({ 'id' : $scope.usuario.id, 'idCliente' : $rootScope.usuario.cliente.id}, $scope.usuario, function(result) {
        $('#modalCadastrarUsuario').modal('hide');
        $scope.listar();
      });
    } else {
      usuarioResources.save({ 'idCliente' : $rootScope.usuario.cliente.id}, $scope.usuario, function(result) {
        $('#modalCadastrarUsuario').modal('hide');
        $scope.listar();
      });
    }
  }

  $scope.adicionarUsuario = function() {
    $scope.usuario = {};
    $('#modalCadastrarUsuario').modal('show');
  }

  $scope.atualizarPerfil = function(perfilSelecionado) {
    $scope.usuario.perfil = perfilSelecionado;
  }

  $scope.editarUsuario = function(usuario) {
    $scope.usuario = angular.copy(usuario);
    $('#modalCadastrarUsuario').modal('show');
  }

  $scope.removerUsuario = function(usuario) {
    var usuarioResources = $injector.get('UsuarioResources');
    usuarioResources.delete({ 'id' : usuario.id, 'idCliente' : $rootScope.usuario.cliente.id}, function(result) {
      $scope.listar();
    });
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
