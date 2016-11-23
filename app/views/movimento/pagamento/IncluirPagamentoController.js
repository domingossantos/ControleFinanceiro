/**
 * Created by domingossantos on 10/11/16.
 */
(function(){
   'use strict';
    angular.module('controleFinanceiroApp.controllers')
        .controller('IncluirPagamentoCtrl',['$rootScope','$scope', '$injector', '$location', '$routeParams' ,'MessageSrv', function ($rootScope, $scope, $injector, $location, $routeParams, MessageSrv) {

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
                status : null
            };

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

            $scope.itemPagamento = {
                historico: null,
                valor: null,
                obra: null,
                fornecedor : null,
                planoConta : null
            };
            $scope.itensPagamento = [];
            $scope.formaPagamentoSelecionada = null;
            $scope.obraSelecionada = null;
            $scope.contaSelecionada = null;
            $scope.planoContaSelecionado = null;
            $scope.fornecedorSelecionado = null;


            var pagamentoResources = $injector.get('PagamentoResources');
            var itemPagamentoResources = $injector.get('ItemPagamentoResources');
            var formaPagamantoResources = $injector.get('FormaPagamantoResources');
            var contaCorrenteResources = $injector.get('ContaCorrenteResources');
            var obraResources = $injector.get('ObraResources');
            var planoContaResources = $injector.get('PlanoContaResources');
            var fornecedorResources = $injector.get('FornecedorResources');

            formaPagamantoResources.query({},function(success){
                $scope.formasPagamento = success.itens;
            });

            contaCorrenteResources.query({},function(success){
                $scope.contas = success.itens;
            });

            obraResources.query({}, function (success) {
                    $scope.obras = success.itens;
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




            $scope.onSalvaPagamento = function(){

                $scope.pagamento.detalhePagamento = {formaPagamento : $scope.pagamento.detalhePagamento.formaPagamento};
                $scope.pagamento.status = 'RASCUNHO';
                $scope.pagamento.contaCorrente = $scope.contaSelecionada;
                $scope.pagamento.valor = 0.0;

                pagamentoResources.save({idContaCorrente: $scope.contaSelecionada.id},
                    angular.copy($scope.pagamento), function(success){
                        $scope.pagamento.id = success.item.id;
                        MessageSrv.info(success.mensagem+'<br>Agora Inclua os itens!');

                        $scope.carregaItens();
                        $scope.form_pagamento = false;
                        $scope.div_pagamento = true;
                        $scope.form_item = true;

                    });
            }

            $scope.onRegistraItem = function(){

                itemPagamentoResources.save({idPagamento:$scope.pagamento.id}
                    ,angular.copy($scope.itemPagamento)).$promise.then(
                    function (success) {
                        $scope.pagamento.valor += $scope.itemPagamento.valor;

                        $scope.onCarregaItens();
                        $scope.atualizarPagamento('RASCUNHO');
                        $scope.limparCamposItem();
                        $scope.calculaDiferenca();
                    },
                    function (error) {
                        console.log(error);
                    }
                );
            }


            $scope.onDeleteItem = function(item){

                itemPagamentoResources.delete({idItemPagamento:item.id}).$promise.then(
                    function (success) {
                        $scope.pagamento.valor -= item.valor;
                        $scope.calculaDiferenca();
                        $scope.atualizar('RASCUNHO');
                        $scope.onCarregaItens();
                    }
                );

                if($scope.itensPagamento.length <= 0 ){
                    $('#btnSalvar').attr('disabled','disabled');
                }

            }


            $scope.limparCamposItem = function () {
                $scope.itemPagamento = {
                    historico: null,
                    valor: null,
                    obra: null,
                    fornecedor : null,
                    planoConta : null
                }
            }

            $scope.carregaItens = function(){
                itemPagamentoResources.query({idPagamento:$scope.pagamento.id},function (success) {
                    $scope.itensPagamento = success.itens;
                });
            }


            $scope.atualizarPagamento = function(status){

                pagamentoResources.update({idPagamento: $scope.pagamento.id, status: status}
                    ,angular.copy($scope.pagamento)).$promise.then(
                    function (success) {
                        MessageSrv.info('Pagamento atualizado');
                    },
                    function (error) {
                        console.log(error);
                    }
                );
            }


        }]);


})();
