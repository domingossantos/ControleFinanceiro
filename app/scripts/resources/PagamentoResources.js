'use strict';

angular.module('controleFinanceiroApp.resources').factory('PagamentoResources',['$resource', function($resource){
  return $resource(app.rootContext + 'rest/pagamentos/detalhe/:id',{id : '@id'},
    {'query' : {method : 'GET', isArray : false},
    'update' : {method : 'PUT'},
    'save' : {method : 'POST'}

    }
  );
}])
