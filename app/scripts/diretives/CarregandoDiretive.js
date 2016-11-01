/**
 * Created by domingossantos on 27/10/16.
 */
'use restrict'

angular.module('controleFinanceiroApp.diretives')
    .directive("dirCarregando", ['$rootScope', function ($rootScope) {
    return {
        templateUrl: "<div ng-show='showMe'><span>Carregando</span></div>",
        link: function (scope, element, attrs) {
            console.log('Carregou a diretiva');
            $rootScope.on('loading-started', function () {
                console.log('Mostrar div');
                scope.showMe = true;
            });

            $rootScope.on('loading-complete', function () {
                console.log('Esconder div');
                scope.showMe = false;
            });
        }
    }
}]);