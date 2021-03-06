'use strict';
/**
 * Created by domingossantos on 07/08/16.
 */
angular.module('controleFinanceiroApp.controllers')
    .controller('PagamentoCtrl',['$rootScope','$scope', '$injector', '$location', '$routeParams' ,'MessageSrv', function ($rootScope, $scope, $injector, $location, $routeParams, MessageSrv) {

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

        formaPagamantoResources.query({},function(success){
            $scope.formasPagamento = success.itens;

        });


        $scope.validaCampos = function(){
            var valido = true;

            if($scope.pagamento.detalhePagamento.formaPagamento == null){
                valido = false;
            }
            if($scope.obraSelecionada == null){
                valido = false;
            }
            if($scope.contaSelecionada == null){
                valido = false;
            }
            if($scope.planoContaSelecionado == null){
                valido = false;
            }
            if($scope.fornecedorSelecionado == null){
                valido = false;
            }
            if($scope.pagamento.descricao == null){
                valido = false;
            }
            if($scope.pagamento.valorEsperado == null){
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

        $scope.onSalvar = function(){

            if($scope.pagamento.valor == $scope.pagamento.valorEsperado){
                $scope.atualizarPagamento('PENDENTE_HOMOLOGACAO');
                $location.path('/main');
            } else {
                MessageSrv.warning('Valor Total é diferente do Valor Esperado!');
            }
        }

        $scope.registraPagamento = function() {
            if($scope.pagamento.id == null){




                $scope.pagamento.detalhePagamento = {formaPagamento : $scope.pagamento.detalhePagamento.formaPagamento};
                $scope.pagamento.status = 'RASCUNHO';
                $scope.pagamento.contaCorrente = $scope.contaSelecionada;
                $scope.pagamento.valor = $scope.itemPagamento.valor;


                pagamentoResources.save({idContaCorrente: $scope.contaSelecionada.id}
                    ,angular.copy($scope.pagamento),function (success) {
                        $scope.pagamento.id = success.item.id;
                        MessageSrv.info(success.mensagem);

                        $scope.itemPagamento.fornecedor = $scope.fornecedorSelecionado;
                        $scope.itemPagamento.obra = $scope.obraSelecionada;
                        $scope.itemPagamento.planoConta = $scope.planoContaSelecionado;


                        var item = $scope.itemPagamento;

                        itemPagamentoResources.save({idPagamento:$scope.pagamento.id}
                            ,angular.copy(item)).$promise.then(
                            function (success) {
                                $scope.onCarregaItens();
                                $scope.calculaDiferenca();
                                $scope.limparItem();
                                if($scope.itensPagamento.length > 0 ){
                                    $('#btnSalvar').removeAttr('disabled','disabled');
                                }
                            },
                            function (error) {
                                console.log(error);
                            }
                        );

                    });


            }
        };

        var itemPagamentoResources = $injector.get('ItemPagamentoResources');
        $scope.onCarregaItens = function(){
            itemPagamentoResources.query({idPagamento:$scope.pagamento.id}).$promise.then(
                function (success) {
                    $scope.itensPagamento = success.itens;
                }
            );
        }

        $scope.onRegistraItem = function(){

            if($scope.validaCampos()){

                $scope.registraPagamento();

                if($scope.pagamento.id != null){
                    $scope.itemPagamento.fornecedor = $scope.fornecedorSelecionado;
                    $scope.itemPagamento.obra = $scope.obraSelecionada;
                    $scope.itemPagamento.planoConta = $scope.planoContaSelecionado;


                    var item = $scope.itemPagamento;

                    itemPagamentoResources.save({idPagamento:$scope.pagamento.id}
                        ,angular.copy(item)).$promise.then(
                        function (success) {

                            $scope.pagamento.valor += $scope.itemPagamento.valor;

                            $scope.atualizarPagamento('RASCUNHO');
                            $scope.calculaDiferenca();
                            $scope.onCarregaItens();
                            $scope.limparItem();
                            if($scope.itensPagamento.length > 0 ){
                                $('#btnSalvar').removeAttr('disabled','disabled');
                            }
                        },
                        function (error) {
                            console.log(error);
                        }
                    );
                }

            } else {
                MessageSrv.warning('Todos os campos de item de pagamento são obrigadótios!');
            }

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

        $scope.atualizarPagamento = function(status){
            pagamentoResources.update({idPagamento: $scope.pagamento.id, status: 'ATIVO'}
                ,angular.copy($scope.pagamento)).$promise.then(
                function (success) {
                    MessageSrv.info('Pagamento atualizado');
                },
                function (error) {
                    console.log(error);
                }
            );
        }


        var contaCorrenteResources = $injector.get('ContaCorrenteResources');

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


        var planoContaResources = $injector.get('PlanoContaResources');

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

        var fornecedorResources = $injector.get('FornecedorResources');
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
