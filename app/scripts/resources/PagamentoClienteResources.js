'use strict';

angular.module('controleFinanceiroApp.resources').factory('PagamentoClienteResources',['$resource', function($resource){
  return $resource(app.rootContext + 'rest/pagamentos/:id',{id : '@id', status : '@status'},
    {'query' : {method : 'GET' ,isArray : false}
  });
}])
