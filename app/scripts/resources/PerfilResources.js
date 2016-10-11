'use strict';

angular.module('controleFinanceiroApp.resources').factory('PerfilResources',['$resource', function($resource){
  return $resource(app.rootContext + 'rest/clientes/:idCliente/perfis/:id',{idCliente : '@idCliente', id : '@id'},
    {
      'query' : {method : 'GET', isArray : false},
      'update': { method: 'PUT'}
  });
}])
