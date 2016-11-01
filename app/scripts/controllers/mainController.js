'use strict';

/**
 * @ngdoc function
 * @name controleFinanceiroApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the controleFinanceiroApp
 */
angular.module('controleFinanceiroApp.controllers')
    .controller('MainCtrl', ['$rootScope','$scope', '$injector',function ($rootScope, $scope, $injector) {
        $scope.menu = false;

        $scope.login = function(){
            $scope.menu = true;
        };


        $scope.movimentos =[];
        $scope.status = 'PENDENTE_HOMOLOGACAO';

        $scope.posicaoContas = 0;

        $scope.maxResults = 10;
        $scope.firstResult = 0;
        $scope.registrosPorPagina = 10;

        $scope.detalheMovimento = {};
        $scope.itens = {};

        $scope.movimentoResources = $injector.get('MovimentoResources');
        $scope.itensPagamentoResources = $injector.get('ItemPagamentoResources');

        $scope.onAtualizarPosicao = function () {
            var posicaoContaCorrenteResources = $injector.get('PosicaoContaCorrenteResources');

            posicaoContaCorrenteResources.get({idCliente:1}).$promise.then(
                function (success) {
                    $scope.posicaoContas = success.item;

                }
            );
        };

        $scope.onDetalheMovimento = function(id, origem){

            if(origem == 1){
                $('#btnHomologar').hide();
            } else {
                $('#btnHomologar').show();
            }
            $scope.itens = {};
            $scope.movimentoResources.get({idMovimento:id}).$promise.then(
                function (success) {
                    $scope.detalheMovimento = success.item;

                    $scope.itensPagamentoResources.get({idPagamento:id}).$promise.then(
                        function (success) {
                            $scope.itens = success.itens;
                        }
                    );
                }
            );

        }

        $scope.onPesquisaMovimentos = function(){

            $scope.movimentoResources.query({idCliente: 1, status : $scope.status, maxResults : $scope.maxResults, firstResult: $scope.firstResult}).$promise.then(
                function (success) {
                    $scope.movimentos = success.itens;
                }
            );

        };

        $scope.onPesquisaPorStatus = function(){
            $scope.onPesquisaMovimentos();
        }

        $scope.onMudarStatus = function(movimento,status){

            movimento.status = status;


            var homologarResources = $injector.get('HomologarResources');

            homologarResources.update({idMovimento: movimento.id},{}).$promise.then(
                function (success) {

                    $('#modalHomologa').modal('hide');

                    $scope.onPesquisaMovimentos();

                    $scope.onAtualizarPosicao();
                }
            );
        }

        $scope.onPaginar = function (pagina) {

            if(pagina == '+1'){
                $scope.firstResult += $scope.maxResults;
            }

            if(pagina == '-1'){
                if($scope.firstResult > 0){
                    $scope.firstResult -= $scope.maxResults;
                }
            }

            $scope.onPesquisaMovimentos();
        }

        $scope.onIncrementaResultado = function(){
            $scope.maxResults += $scope.registrosPorPagina;
            $scope.onPesquisaMovimentos();
        }



        $scope.printDiv = function(divName) {
            var printContents = document.getElementById(divName).innerHTML;
            var popupWin = window.open('', '_blank', 'width=700,height=500');
            popupWin.document.open();
            popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /><link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css"></head><body onload="window.print()">' + printContents + '</body></html>');
            popupWin.document.close();
        }

        $scope.onPesquisaMovimentos();
        $scope.onAtualizarPosicao();

    }]);
