'use strict';

angular.module('controleFinanceiroApp.resources').factory('PagamentoResources',['$resource', function($resource){
  return $resource(app.rootContext + 'rest/pagamentos/:idPagamento',{idPagamento : '@idPagamento'},
    {'query' : {method : 'GET', isArray : false},
    'update' : {method : 'PUT'},
    'save' : {method : 'POST', isArray: true}

    }
  );
}])
