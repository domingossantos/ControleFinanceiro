'use strict';

angular.module('controleFinanceiroApp.resources').factory('ClienteResources',['$resource', function($resource){
  return $resource(app.rootContext + 'rest/clientes/:idCliente',{idCliente : '@idCliente'},
    {'query' : {method : 'GET', isArray : false}
  });
}])
