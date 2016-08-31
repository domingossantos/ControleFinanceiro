'use strict';

angular.module('controleFinanceiroApp.resources').factory('BancoResources',['$resource', function($resource){
  return $resource(app.rootContext + 'rest/bancos/:id',{id : '@id'},
    {'query' : {method : 'GET', isArray : false}
  });
}])
