'use strict';

angular.module('controleFinanceiroApp.resources').factory('FormaPagamantoResources',['$resource', function($resource){
  return $resource(app.rootContext + 'rest/pagamentos/formas/:id',{id : '@id'},
    {'query' : {method : 'GET', isArray : false}
  });
}])
