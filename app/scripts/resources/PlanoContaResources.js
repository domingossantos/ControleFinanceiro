'use strict';

angular.module('controleFinanceiroApp.resources').factory('PlanoContaResources',['$resource', function($resource){
  return $resource(app.rootContext + 'rest/planocontas/:id',{id : '@id', idCliente: '@idCliente'},
    {
      'query' : {method : 'GET', isArray : false},
      'get' : {method : 'GET', isArray : false}
  });
}])
