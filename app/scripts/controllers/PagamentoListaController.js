'use strict';
/**
 * Created by domingossantos on 07/08/16.
 */
angular.module('controleFinanceiroApp.controllers')
.controller('PagamentoListaCtrl',['$rootScope','$scope', '$injector', '$location','$route' ,'MessageSrv', 'ImpressaoSrv', function ($rootScope, $scope, $injector, $location, $route, MessageSrv, ImpressaoSrv) {

    $scope.pagamentos = [];
    $scope.itensPagamento = [];
    $scope.pagamento = {};

    $scope.maxResults = 10;
    $scope.firstResult = 0;
    $scope.registrosPorPagina = 10;
    $scope.origemPesquisa = 1;
    $scope.inicioPesquisa = 0;
    $scope.ano = new Date().getFullYear();

    $scope.paginaAtual = 1;
    $scope.totalRegistros = 0;

    $scope.dataFim = null;
    $scope.dataInicio = null;

    $scope.dataInicioP = null;
    $scope.dataFimP = null;

    $scope.meses = [
        {id:1,nome:'JANEIRO'},
        {id:2,nome:'FEVEVEIRO'},
        {id:3,nome:'MARÇO'},
        {id:4,nome:'ABRIL'},
        {id:5,nome:'MAIO'},
        {id:6,nome:'JUNHO'},
        {id:7,nome:'JULHO'},
        {id:8,nome:'AGOSTO'},
        {id:9,nome:'SETEMBRO'},
        {id:10,nome:'OUTUBRO'},
        {id:11,nome:'NOVEMBRO'},
        {id:12,nome:'DEZEMBRO'}
    ];

    $scope.anos = [{ano:2017},{ano:2016}];

    $scope.getUltimoDiaMes = function(month,year)
    {
        var day;
        switch(month) {
            case 1 :
            case 3 :
            case 5 :
            case 7 :
            case 8 :
            case 10:
            case 12:
                day = 31;
                break;
            case 4 :
            case 6 :
            case 9 :
            case 11:
                day = 30;
                break;
            case 2 :
                if( ( (year % 4 == 0) && ( year % 100 != 0) ) || (year % 400 == 0) )
                    day = 29;
                else
                    day = 28;
                break;
        }

        return day;
    }

    $scope.dateOptions = {
        formatYear: 'yyyy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(2000,1,1),
        startingDay: 1,
    };

    $scope.popupDataInicio = {
        opened: false
    };
    $scope.popupDataFim = {
        opened: false
    };

    $scope.openPopupDataInicio = function() {
        $scope.popupDataInicio.opened = true;
    };

    $scope.openPopupDataFim = function() {
        $scope.popupDataFim.opened = true;
    };

    $scope.altInputFormats = ['dd/MM/yyyy'];

    var now = new Date;
    var mes = parseInt(now.getMonth());
    $scope.mes = $scope.meses[mes];


    var pagamentoListaResources = $injector.get('PagamentoResources');
    var pagamentoListaQtdResources = $injector.get('PagamentoListaQtdResources');
    var itemPagamentoResources = $injector.get('ItemPagamentoResources');

    $scope.pesquisaPeriodo = function(){
        $rootScope.atualizar = false;

        pagamentoListaResources.query({idContaCorrente:0, status:'',dataInicio:$scope.dataInicioP, dataFim:$scope.dataFimP, maxResults : $scope.maxResults, firstResult: $scope.firstResult, ordem:'asc'}).$promise.then(
            function (success) {
                $scope.pagamentos = success;
            }
        );
    }

    $scope.getTotalRegistros = function(){
        pagamentoListaQtdResources.query({idContaCorrente:0, status:'',dataInicio:$scope.dataInicioP, dataFim:$scope.dataFimP}).$promise.then(
            function (success) {
                $scope.totalRegistros = success.item;
            }
        );
    }


    $scope.onPesquisar = function(){
        var mes = $scope.mes.id;

        $scope.dataInicioP =  '01/'+mes+'/'+$scope.ano;
        $scope.dataFimP = $scope.getUltimoDiaMes(mes,$scope.ano)+'/'+mes+'/'+$scope.ano;
        $scope.firstResult = 0;
        $scope.maxResults = 10;

        $rootScope.dataInicio = $scope.dataInicioP;
        $rootScope.dataFim = $scope.dataFimP;
        $rootScope.paginaAtual = 0;
        $rootScope.atualizar = false;

        $scope.pesquisaPeriodo();
        $scope.getTotalRegistros();

    }

    $scope.onPesquisarPeriodo = function(){
        $scope.origemPesquisa = 2;

        $scope.dataInicioP = $scope.dataInicio.toLocaleDateString();
        $scope.dataFimP = $scope.dataFim.toLocaleDateString();
        $scope.maxResults = 10;
        $scope.firstResult = 0;
        $scope.registrosPorPagina = 10;

        $rootScope.dataInicio = $scope.dataInicioP;
        $rootScope.dataFim = $scope.dataFimP;
        $rootScope.paginaAtual = 0;
        $rootScope.atualizar = false;

        $scope.pesquisaPeriodo();
        $scope.getTotalRegistros();
    }


    $scope.onDetalhePagamento = function (pagamento) {
        $scope.pagamento = pagamento;

        itemPagamentoResources.query({idPagamento:$scope.pagamento.id},function (success) {
            $scope.itensPagamento = success.itens;
        });
    }

    $scope.onHomologar = function(movimento){
        if(movimento.valor == movimento.valorEsperado){
            var homologarResources = $injector.get('HomologarResources');
            movimento.status = 'HOMOLOGADO';
            homologarResources.update({idMovimento: movimento.id},{}).$promise.then(
                function (success) {
                    $('#modalHomologa').modal('hide');
                    $scope.onPesquisar();
                    MessageSrv.info('Pagamento Homologado!');
                }
            );
        } else {
            MessageSrv.warning('Valor do pagamento é inferior ao Valor Esperado!');
        }
    }

    $scope.onPaginar = function (pagina) {

        if(pagina == '+1'){
            $scope.firstResult += $scope.maxResults;
            $scope.paginaAtual++;
        }

        if(pagina == '-1'){
            if($scope.firstResult > 0){
                $scope.firstResult -= $scope.maxResults;
                $scope.paginaAtual--;
            }
        }
        $rootScope.paginaAtual = $scope.firstResult;
        $scope.pesquisaPeriodo();


    }

    $scope.onIncrementaResultado = function(){

        $scope.maxResults = $scope.totalRegistros;
        $scope.firstResult = 0;

        $scope.pesquisaPeriodo();
    }


    $scope.onApagarRegistro = function(pagamento){
        $scope.pagamento = pagamento;
        itemPagamentoResources.query({idPagamento:$scope.pagamento.id},function (success) {
            $scope.itensPagamento = success.itens;

        });
        $('#modalApagar').modal('show');
    }
    var movimentoResources = $injector.get('MovimentoResources');

    $scope.onDeletePagamento = function (pagamento) {
        movimentoResources.delete({idMovimento:pagamento.id}).$promise.then(
            function (success) {
                MessageSrv.info('Pagamento apagado!');
                $('#modalApagar').modal('hide');
                $scope.onPesquisar();
            }
        )
    }

    $scope.printDiv = function(divName) {
        var printContents = document.getElementById(divName).innerHTML;
        var popupWin = window.open('', '_blank', 'width=700,height=500');
        popupWin.document.open();
        popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /><link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css"></head><body onload="window.print()">' + printContents + '</body></html>');
        popupWin.document.close();
    }




    if($rootScope.atualizar){
        $scope.dataInicioP = $rootScope.dataInicio;
        $scope.dataFimP = $rootScope.dataFim;
        $scope.firstResult = $rootScope.paginaAtual;
    } else {
        var mes = $scope.mes.id;
        $scope.dataInicioP =  '01/'+mes+'/'+$scope.ano;
        $scope.dataFimP = $scope.getUltimoDiaMes(mes,$scope.ano)+'/'+mes+'/'+$scope.ano;
        $scope.firstResult = 0;
    }

    $scope.pesquisaPeriodo();


    $scope.onImprimir = function (nomeDiv) {
        ImpressaoSrv.imprimirDiv(nomeDiv);
    }

}]);

