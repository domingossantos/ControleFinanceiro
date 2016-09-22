'use strict';

angular.module('controleFinanceiroApp.resources').factory('ItemPagamentoResources',['$resource', function($resource){
  return $resource(app.rootContext + 'rest/pagamentos/item/:idPagamento',{idPagamento : '@idPagamento'},
    {'query' : {method : 'GET', isArray : false},
      'save' : {method : 'POST'}
  });
}])
