'use strict';

angular.module('controleFinanceiroApp.resources').factory('PagamentoListaResources',['$resource', function($resource){
  return $resource(app.rootContext + 'rest/pagamentos/paginacao/:idPagamento',{idPagamento : '@idPagamento'},
    {'query' : {method : 'GET', isArray : false}}
  );
}])
