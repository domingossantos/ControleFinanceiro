'use strict';

angular.module('controleFinanceiroApp.resources').factory('AlterarSenhaResources',['$resource', function($resource){
  return $resource(app.rootContext + 'rest/senha/:id',{id : '@id'},
    {'query' : {method : 'GET', isArray : false},
     'update' : {method : 'PUT'},
      'save' : {method : 'POST'}
    }
  );
}])
