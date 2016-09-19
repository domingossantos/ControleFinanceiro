'use strict';

angular.module('controleFinanceiroApp.resources').factory('DepositoResources',['$resource', function($resource){
  return $resource(app.rootContext + 'rest/depositos/:idDeposito',{idDeposito : '@idDeposito'},
    {'query' : {method : 'GET', isArray : false},
    'update' : {method : 'PUT'},
    'save' : {method : 'POST'}
    }
  );
}])
