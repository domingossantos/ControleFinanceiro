'use strict';

angular.module('controleFinanceiroApp.resources').factory('ExtratoResources',['$resource', function($resource){
  return $resource(app.rootContext + 'rest/extratos/:idMovimento',{idMovimento : '@idMovimento'},
    {'query' : {method : 'GET', isArray : false}
    }
  );
}])
