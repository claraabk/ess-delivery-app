Scenario: Adicionar nova promoção
    Given Eu estou logado como administrador do estabelecimento "Bodega do Matheus" de ID "414250"
    And Eu estou na página de promoções
    When Eu clico em "Adicionar Nova Promoção"
    And Eu seleciono o produto "Hambúrguer" de ID "0237802178590347"
    And Eu seleciono o produto "Coca-Cola 350 mL" de ID "9239423230094129"
    And Eu defino o valor do desconto como "10%"
    And Eu cadastro a promoção
    Then Eu recebo um mensagem de confirmação
    And Eu vejo que a promoção foi cadastrada com ID "9181244520"
    
Scenario: Remover uma promoção
    Given Eu estou logado como administrador do estabelecimento "Bodega do Matheus" de ID "414250"
    And Eu estou na página de promoções
    And Eu quero remover a promoção de ID "9181244520"
    When Eu clico em "Remover Promoção"
    And Eu seleciono a promoção com ID "9181244520"
    And eu confirmo a remoção
    Then Eu recebo um mensagem de confirmação
    And Eu veja que a promoção de ID "9181244520" foi removida

Scenario: Modificar uma promoção
    Given Eu estou logado como administrador do estabelecimento "Bodega do Matheus" de ID "414250"
    And Eu estou na página de promoções
    And Eu quero modificar a promoção de ID "9181244520"
    When Eu clico em "Modificar Promoção"
    And Eu seleciono a promoção com ID "9181244520"
    And Eu atualizo o valor do desconto para "15%"
    And Eu confirmo as alterações
    Then Eu recebo um mensagem de confirmação
    And Eu vejo que a promoção de ID "9181244520" foi modificada
