'use strict';
/**
 * Created by gilson on 16/09/16.
 */
angular.module('controleFinanceiroApp')

.controller('LoginCtrl', ['$scope', '$rootScope', '$http', '$location', '$injector', 'MessageSrv', function ($scope, $rootScope, $http, $location, $injector, MessageSrv) {

  $scope.usuario = {
    email: null,
    senha:null
  }

  $scope.login = function() {

    var loginResources = $injector.get('LoginResources');

    loginResources.save($scope.usuario, function(success) {
      $rootScope.usuario = success.item;

      if ($rootScope.usuario != null) {
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $rootScope.usuario.token;
        $location.path('/main');
      } else {
          MessageSrv.warning('Usuario Inválido!!');
      }

    });
  }

  $rootScope.sair = function() {
    $http.defaults.headers.common['Authorization'] = null;
    $rootScope.usuario = null;
    $location.path('#/');
  };
}]);
