'use strict';

angular.module('controleFinanceiroApp.resources').factory('FornecedorResources',['$resource', function($resource){
  return $resource(app.rootContext + 'rest/fornecedores/:idFornecedor',{idFornecedor : '@idFornecedor'},
    {'query' : {method : 'GET', isArray : false},
     'update' : {method:'PUT', isArray: false}
  });
}])
