'use strict';
/**
 * Created by domingossantos on 07/08/16.
 */
angular.module('controleFinanceiroApp.controllers')
    .controller('PagamentoIncluirCtrl',['$rootScope','$scope', '$injector', '$location', '$routeParams' ,'MessageSrv', function ($rootScope, $scope, $injector, $location, $routeParams, MessageSrv) {

        $scope.form_pagamento = true;
        $scope.div_pagamento = false;
        $scope.form_item = false;


        $scope.formasPagamento = [];
        $scope.contas = [];
        $scope.obras = [];
        $scope.planosContas = [];
        $scope.fornecedores = [];
        $scope.gruposPlano = [];
        $scope.dataMovimento = null;
        $scope.pagamento = {
            id : null,
            descricao : null,
            valor : null,
            dataOperacao : null,
            contaCorrente : null,
            valorEsperado : null,
            detalhePagamento : null,
            status : null,
            situacaoRegistro : null
        };


        $scope.itemPagamento = {
            historico: null,
            valor: null,
            obra: null,
            fornecedor : null,
            planoConta : null
        }

        $scope.valor = null;
        $scope.historico = null;

        $scope.itensPagamento = [];
        $scope.formaPagamentoSelecionada = null;
        $scope.obraSelecionada = null;
        $scope.contaSelecionada = null;
        $scope.planoContaSelecionado = null;
        $scope.fornecedorSelecionado = null;

        $scope.dateOptions = {
            formatYear: 'yyyy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(2000,1,1),
            startingDay: 1,

        };

        $scope.popupData = {
            opened: false
        };

        $scope.openPopupData = function() {
            $scope.popupData.opened = true;
        };

        $scope.altInputFormats = ['dd/MM/yyyy'];

        $scope.limparItem = function(){
            $scope.itemPagamento = {
                historico: null,
                valor: null,
                obra: null,
                fornecedor : null,
                planoConta : null
            }
            $scope.obraSelecionada = null;
            $scope.planoContaSelecionado = null;
            $scope.fornecedorSelecionado = null;
        };

        $scope.resetCampos = function(){
            $scope.pagamento = {
                id : null,
                descricao : null,
                valor : null,
                dataOperacao : null,
                contaCorrente : null,
                valorEsperado : null,
                detalhePagamento : null,
                status : null
            };

            $scope.itensPagamento = [];
            $scope.formaPagamentoSelecionada = null;
            $scope.obraSelecionada = null;
            $scope.contaSelecionada = null;
            $scope.planoContaSelecionado = null;
            $scope.fornecedorSelecionado = null;
            $scope.planoDigitado = null;
            $scope.fornecedorDigitado = null;

        }

        var pagamentoResources = $injector.get('PagamentoResources');
        var formaPagamantoResources = $injector.get('FormaPagamantoResources');
        var itemPagamentoResources = $injector.get('ItemPagamentoResources');
        var contaCorrenteResources = $injector.get('ContaCorrenteResources');
        var planoContaResources = $injector.get('PlanoContaResources');
        var fornecedorResources = $injector.get('FornecedorResources');


        formaPagamantoResources.query({},function(success){
            $scope.formasPagamento = success.itens;

        });


        $scope.validaCampos = function(){
            var valido = true;

            if($scope.obraSelecionada == null){
                valido = false;
            }
            if($scope.planoContaSelecionado == null){
                valido = false;
            }
            if($scope.fornecedorSelecionado == null){
                valido = false;
            }
            if($scope.itemPagamento.historico == null){
                valido = false;
            }
            if($scope.itemPagamento.valor == null){
                valido = false;
            }

            return valido;
        }


        $scope.onSalvarPagamento = function(){
            $scope.pagamento.detalhePagamento = {formaPagamento : $scope.pagamento.detalhePagamento.formaPagamento};
            $scope.pagamento.status = 'RASCUNHO';
            $scope.pagamento.contaCorrente = $scope.contaSelecionada;
            $scope.pagamento.valor = 0.0;
            $scope.pagamento.situacaoRegistro = 'ATIVO';

            pagamentoResources.save({idContaCorrente: $scope.contaSelecionada.id}
                ,angular.copy($scope.pagamento),function (success) {
                    $scope.pagamento.id = success.item.id;
                    MessageSrv.info(success.mensagem);
                    $scope.form_pagamento = false;
                    $scope.div_pagamento = true;
                    $scope.form_item = true;
                });
        }

        $scope.onAtualizarPagamento = function(){

            if($scope.pagamento.valor == $scope.pagamento.valorEsperado){
                $scope.atualizarPagamento('PENDENTE_HOMOLOGACAO','ATIVO');
                $location.path('/main');
            } else {
                MessageSrv.warning('Valor Total é diferente do Valor Esperado!');
            }
        }

        $scope.onCarregaItens = function(){
            itemPagamentoResources.query({idPagamento:$scope.pagamento.id}).$promise.then(
                function (success) {
                    $scope.itensPagamento = success.itens;
                }
            );
        }

        $scope.onRegistraItem = function(){

            if($scope.pagamento.id != null){
                var item = $scope.itemPagamento;

                itemPagamentoResources.save({idPagamento:$scope.pagamento.id}
                    ,angular.copy(item)).$promise.then(
                    function (success) {

                        $scope.pagamento.valor += $scope.itemPagamento.valor;

                        $scope.atualizarPagamento('RASCUNHO', 'ATIVO');
                        $scope.calculaDiferenca();
                        $scope.onCarregaItens();
                        $scope.limparItem();
                        $('#myModal').modal('hide');

                    },
                    function (error) {
                        console.log(error);
                    }
                );
            } else {
                MessageSrv.warning('Não existe um pagamento para associar a este item!');
            }

        }

        $scope.onDeleteItem = function(item){

            itemPagamentoResources.delete({idItemPagamento:item.id}).$promise.then(
                function (success) {
                    $scope.pagamento.valor -= item.valor;
                    $scope.calculaDiferenca();
                    $scope.atualizarPagamento('RASCUNHO', 'ATIVO');
                    $scope.onCarregaItens();
                }
            );

        }

        $scope.atualizarPagamento = function(statusPagamento, situacaoRegistro){
            pagamentoResources.update({idPagamento: $scope.pagamento.id, statusPagamento: statusPagamento, statusRegistro: situacaoRegistro}
                ,angular.copy($scope.pagamento)).$promise.then(
                function (success) {
                    MessageSrv.info('Pagamento atualizado');
                },
                function (error) {
                    console.log(error);
                }
            );
        }




        contaCorrenteResources.query({}).$promise.then(
            function (success) {
                $scope.contas = success.itens;
            }
        );

        var obraResources = $injector.get('ObraResources');
        obraResources.query().$promise.then(
            function (success) {
                $scope.obras = success.itens;
            }
        );




        planoContaResources.query({idCliente:1,tipo:'GERAL'}, function (success) {
            $scope.gruposPlano = success.itens;
        });

        planoContaResources.query({idCliente:1,tipo:'DESPESA'}).$promise.then(
            function (success) {
                for(var i = 0; i < success.itens.length; i++){

                    var itemPlano = {
                        planoConta : {},
                        descricao : null,
                        grupo:null
                    }
                    itemPlano.planoConta = success.itens[i];
                    itemPlano.descricao = success.itens[i].codigo + ' - '+ success.itens[i].descricao;

                    for(var x = 0; x < $scope.gruposPlano.length; x++ ){
                        var parte = success.itens[i].codigo.substring(0, 3);
                        if($scope.gruposPlano[x].codigo == parte){
                            itemPlano.grupo = $scope.gruposPlano[x].descricao;
                        }
                    }

                    $scope.planosContas[i] = itemPlano;
                }

            }
        );


        fornecedorResources.query({idCliente:1}).$promise.then(
            function (success) {

                for(var i = 0; i < success.itens.length; i++){
                    var itemFornecedor = {
                        fornecedor : {},
                        descricao : null
                    }
                    itemFornecedor.fornecedor = success.itens[i];
                    itemFornecedor.descricao = success.itens[i].id + ' - '+ success.itens[i].nome;

                    $scope.fornecedores[i] = itemFornecedor;
                }

            }
        );

        $scope.calculaDiferenca = function () {
            $scope.diferencaValor = $scope.pagamento.valorEsperado - $scope.pagamento.valor;
        }


    }]);
