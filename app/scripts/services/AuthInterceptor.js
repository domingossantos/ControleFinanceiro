/**
 * Created by domingossantos on 02/10/16.
 */
"use strict";

angular.module('controleFinanceiroApp.services', [])
  .factory('AuthInterceptor', AuthInterceptor)
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
  });

function v ($location, $q) {
  return {
    request: function(config) {
      config.headers = config.headers || {};

      if ($rootScope.usuario.token) {
        config.headers['Authorization'] = 'Bearer ' + $rootScope.usuario.token;
      }

      return config;
    },

    responseError: function(response) {
      if (response.status === 401 || response.status === 403) {
        $location.path('/');
      }

      return $q.reject(response);
    }
  }
}
