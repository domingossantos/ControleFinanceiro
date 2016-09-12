/**
 * Created by domingossantos on 11/09/16.
 */
'use strict';
/**
 * Created by domingossantos on 07/08/16.
 */
/**
 * Created by domingossantos on 11/09/16.
 */
'use strict';

angular.module('controleFinanceiroApp.resources').factory('SubContaResources',['$resource', function($resource){
  return $resource(app.rootContext + 'rest/contascorrentes/:idContaCorrente/subconta/:idSubConta',
    {idContaCorrente : '@idContaCorrente', idSubConta: '@IdSubConta'},
    {
      'get' : {method : 'GET', isArray : false},
      'query' : {method : 'GET', isArray: false}
    });
}])

