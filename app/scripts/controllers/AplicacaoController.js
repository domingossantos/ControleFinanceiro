'use strict';
/**
 * Created by domingossantos on 07/08/16.
 */
angular.module('controleFinanceiroApp.controllers')
  .controller('AplicacaoCtrl', ['$rootScope','$scope','$injector','$location','MessageSrv', function ($rootScope, $scope, $injector, $location, MessageSrv ) {
    $scope.tipo = 0;
    $scope.labelContaOrigem = 'Conta Origem';
    $scope.labelContaDestino = 'Conta Destino';
    $scope.contaOrigemSelecionada = null;
    $scope.contaDestinoSelecionada = null;
    $scope.dataMovimento = null;
    $scope.contasOrigem = [];
    $scope.contasDestino = [];
    $scope.aplicacoes = [];
    $scope.aplicacao = [];
    $scope.valorTributoResgate = 0;

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
      var now = new Date;
      var mes = parseInt(now.getMonth());
      $scope.mes = $scope.meses[mes];
    $scope.aplicacao = {
      descricao : null,
      dataOperacao : null,
      origem : null,
      destino : null,
      tipo : null,
      status : null,
      valor : null
    }

    var aplicacaoResources = $injector.get('AplicacaoResources');

    $scope.onSalvar = function () {

        var data = new Date($scope.dataMovimento.substring(4,8),
                            parseInt($scope.dataMovimento.substring(2,4) - 1),
                            $scope.dataMovimento.substring(0,2));

        $scope.aplicacao.dataOperacao = data;
      $scope.aplicacao.status = 'PENDENTE_HOMOLOGACAO';
      $scope.aplicacao.origem = $scope.contaOrigemSelecionada;
      $scope.aplicacao.destino = $scope.contaDestinoSelecionada;

      if($scope.tipo == 1){
        $scope.aplicacao.tipo = 'APLICACAO';
      }
      if($scope.tipo == 2){
        $scope.aplicacao.tipo = 'TRANSFERENCIA';
      }
      if($scope.tipo == 3){
        $scope.aplicacao.tipo = 'RESGATE';
      }

        var formaPagamentoResources = $injector.get('FormaPagamantoResources');
        var formaPagamento = {};
        formaPagamentoResources.query({})
        formaPagamentoResources.query({id:3},function (result) {
            formaPagamento = result.item;
        });
        var fornecedorResources = $injector.get('FornecedorResources');
        var fornecedor = {};

        fornecedorResources.query({idFornecedor:40}, function (result) {
            fornecedor = result.item;
        });

        var obraResources = $injector.get('ObraResources');
        var obra = {};

        obraResources.query({id:66}, function (result) {
            obra = result.item;
        });

        var planoContaResources = $injector.get('PlanoContaResources');
        var planoConta = {};
        planoContaResources.query({idPlanoConta:31}, function (result) {
            planoConta = result.item;
        });

        console.log(formaPagamento);
        console.log(fornecedor);
        console.log(obra);
        console.log(planoConta);

      console.log($scope.aplicacao);

      aplicacaoResources.save({idContaCorrenteOrigem:$scope.contaOrigemSelecionada.id,
                               idContaCorrenteDestino:$scope.contaDestinoSelecionada.id,
                               tipo:$scope.aplicacao.tipo},
                              angular.copy($scope.aplicacao)).$promise.then(
        function (success) {
            if($scope.tipo == 3){
                var pagamento = {};
                pagamento.descricao = $scope.aplicacao.descricao;
                pagamento.detalhePagamento = {formaPagamento : formaPagamento};
                pagamento.status = 'RASCUNHO';
                pagamento.contaCorrente = $scope.contaOrigemSelecionada;
                pagamento.dataOperacao = data;
                pagamento.valor = $scope.valorTributoResgate;

                var pagamentoResources = $injector.get('PagamentoResources');

                pagamentoResources.save({idContaCorrente: $scope.contaOrigemSelecionada.id}
                    ,angular.copy(pagamento),function (result) {
                        pagamento.id = result.item.id;

                        var itemPagamento = {};

                        itemPagamento.historico = $scope.aplicacao.descricao;
                        itemPagamento.fornecedor = fornecedor;
                        itemPagamento.obra = obra;
                        itemPagamento.planoConta = planoConta;

                        itemPagamentoResources.save({idPagamento:pagamento.id}
                            ,angular.copy(itemPagamento)).$promise.then(
                            function (result) {
                                MessageSrv.success('Resgate Realizado com sucesso!')
                            },
                            function (error) {
                                MessageSrv.error('Erro ao realizar registro de pagamento!');
                            }
                        );

                    },
                    function (error) {
                        MessageSrv.error('Erro ao realizar resgate');
                        console.log(error);
                    }
                );
            }


            $location.path('/movimento/aplicacao');
        },
        function (error) {
            MessageSrv.error('Erro ao salvar registro');
        }
      );


    }

    var contaCorrenteResources = $injector.get('ContaCorrenteResources');

    contaCorrenteResources.query({}).$promise.then(
      function (success) {

        $scope.contasOrigem = success.itens;
        $scope.contasDestino = success.itens;
      }, function (error) {
        console.log(error);
      }
    );

    $scope.escolhaTipo = function () {
      if($scope.tipo == 1){
        $scope.labelContaOrigem = 'Conta Origem do Recurso';
        $scope.labelContaDestino = 'Conta Destino da Aplicação';
      } else if($scope.tipo == 2){
        $scope.labelContaOrigem = 'Conta Origem do Recurso';
        $scope.labelContaDestino = 'Conta Destino da Transferência';
      } else if($scope.tipo == 3){
        $scope.labelContaOrigem = 'Conta Origem do Recurso';
        $scope.labelContaDestino = 'Conta Destino da Aplicação';
      } else {
        $scope.labelContaOrigem = 'Conta Origem';
        $scope.labelContaDestino = 'Conta Destino';
      }
    }

    $scope.onPesquisar = function () {

        var mes = $scope.mes.id;
        var ano = new Date().getFullYear();
        var dataInicio = '01/'+mes+'/'+ano;
        var dataFim = $scope.getUltimoDiaMes(mes,ano)+'/'+mes+'/'+ano;

        aplicacaoResources.query({dataInicio:dataInicio, dataFim:dataFim},function (success) {
            $scope.aplicacoes = success;
        })
    }
    
    $scope.onDetalheAplicacao = function (aplicacao) {
        $scope.aplicacao = aplicacao;
    } 

    $scope.onPesquisar();

    $scope.onHomologar = function(movimento){
        var homologarResources = $injector.get('HomologarResources');

        homologarResources.update({idMovimento: movimento.id},function (success) {
            MessageSrv.info('Aplicação Homologada!');
            $('#modalHomologa').modal('hide');
            $scope.onPesquisar();
        })

    }


  }]);
