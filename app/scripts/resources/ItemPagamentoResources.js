'use strict';

angular.module('controleFinanceiroApp.resources').factory('ItemPagamentoResources',['$resource', function($resource){
  return $resource(app.rootContext + 'rest/pagamentos/item/:idItemPagamento',{idItemPagamento : '@idItemPagamento'},
    {'query' : {method : 'GET', isArray : false},
      'save' : {method : 'POST', isArray: false},
      'delete' : {method:'DELETE', isArray: false}
  });
}])
