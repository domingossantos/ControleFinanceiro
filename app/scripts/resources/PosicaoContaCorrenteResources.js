'use strict';

angular.module('controleFinanceiroApp.resources').factory('PosicaoContaCorrenteResources',['$resource', function($resource){
  return $resource(app.rootContext + 'rest/clientes/:idCliente/consolidado',{idCliente : '@idCliente'},
    {
      'query' : {method : 'GET', isArray : false},
      'update': { method: 'PUT'}
  });
}])
