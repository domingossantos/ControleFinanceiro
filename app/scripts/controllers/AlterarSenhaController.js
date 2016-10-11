'use strict';
/**
 * Created by gilson on 06/10/16.
 */
angular.module('controleFinanceiroApp')

.controller('AlterarSenhaCtrl', ['$scope', '$injector', '$location', 'growl', function ($scope, $injector, $location, growl) {

  $scope.novaSenha = null;
  $scope.repetirSenha = null;

  $scope.salvar = function() {
    if($scope.novaSenha != null && $scope.novaSenha === $scope.repetirSenha) {
      var usuario = {
        senha : $scope.novaSenha
      }

      var alterarSenhaResources = $injector.get('AlterarSenhaResources');
      alterarSenhaResources.save(usuario, function(success) {
        growl.success('Senha alterada com sucesso.');
        $location.path('/main');
      });
    } else {
      growl.warning('As senhas informadas não conferem.');
    }
  }

}]);
