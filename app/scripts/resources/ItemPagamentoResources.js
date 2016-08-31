'use strict';

angular.module('controleFinanceiroApp.resources').factory('ItemPagamentoResources',['$resource', function($resource){
  return $resource(app.rootContext + 'rest/pagamentos/item/:id',{id : '@id'},
    {'query' : {method : 'GET', isArray : false}
  });
}])
