'use strict';

angular.module('controleFinanceiroApp.resources').factory('AplicacaoResources',['$resource', function($resource){
  return $resource(app.rootContext + 'rest/aplicacoes/:idAplicacao',{idAplicacao : '@idAplicacao'},
    {'query' : {method : 'GET', isArray : false},
     'update' : {method : 'PUT'},
      'save' : {method : 'POST'}
    }
  );
}])
