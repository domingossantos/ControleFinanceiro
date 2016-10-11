'use strict';

angular.module('controleFinanceiroApp.resources').factory('UsuarioResources',['$resource', function($resource){
  return $resource(app.rootContext + 'rest/clientes/:idCliente/usuarios/:id',{idCliente : '@idCliente', id : '@id'},
    {
      'query' : {method : 'GET', isArray : false},
      'update': { method: 'PUT'}
  });
}])
