'use strict';

angular.module('controleFinanceiroApp.resources').factory('PlanoContaClienteResources',['$resource', function($resource){
  return $resource(app.rootContext + 'rest/planocontas/:idCliente/:id',{idCLiente : '@idCliente', id : '@id'},
    {'query' : {method : 'GET', isArray : false}});
}])
