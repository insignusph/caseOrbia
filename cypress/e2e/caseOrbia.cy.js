describe("Realizar compra na Sauce Demo com sucesso", () => {
  
  beforeEach(() => {
    cy.clearCookies()

    cy.login("standard_user", "secret_sauce");

  });

  it("Deve estar visível o nome e o preço do produto na vitrine da plataforma", () => {
    cy.get(".inventory_item_name").should("be.visible");
    cy.get(".inventory_item_name").should("have.length", 6)
    cy.get(".inventory_item_price").should("be.visible");
    cy.get(".inventory_item_price").should("have.length", 6);
  });

  it("É possível ordenar os produtos por preço, relevância ou ordem alfabética", () => {

    // Verificar se os produtos estão em ordem decrescente de preço
    cy.get('[data-test="product_sort_container"]').select("hilo");
    cy.get(":nth-child(1) > .inventory_item_description > .pricebar > .inventory_item_price").should('contain', "49.99");

    // Verificar se os produtos estão em ordem alfabética reversa
    cy.get('[data-test="product_sort_container"]').select("za");
    cy.get(":nth-child(1) > .inventory_item_description > .inventory_item_label > #item_3_title_link > .inventory_item_name").should('contain', "Test.allTheThings() T-Shirt (Red)");

    // Verificar se os produtos estão em ordem crescente de preço
    cy.get('[data-test="product_sort_container"]').select("lohi");
    cy.get(":nth-child(1) > .inventory_item_description > .pricebar > .inventory_item_price").should('contain', "7.99");

  });

  it("Deve ser possível adicionar mais de um item no carrinho", () => {
    cy.get(".btn_inventory").first().click();
    cy.get(".btn_inventory").eq(1).click();
    cy.get(".shopping_cart_badge").should("have.text", "2");
  });

  it("É possível remover o produto do carrinho", () => {
    cy.get(".btn_inventory").first().click();
    cy.get(".shopping_cart_link").click();
    cy.get(".cart_item").should("have.length", 1);
    cy.get('[data-test="remove-sauce-labs-backpack"]').contains("Remove").click();
    cy.get(".cart_item").should("not.exist");
  });

  it("Usuário deve informar o nome completo e endereço postal para envio do pedido", () => {
    cy.get(".btn_inventory").first().click();
    cy.get(".shopping_cart_link").click();
    cy.get("#checkout").click();
    cy.url().should('include', 'checkout-step-one.html');
    cy.get("#first-name").type("John");
    cy.get("#last-name").type("Doe");
    cy.get("#postal-code").type("12345678");
    cy.get("#continue").click();

    // Verificar se o usuário foi redirecionado para a página de resumo do pedido
    cy.url().should('include', 'checkout-step-two.html');

  }); 

  it("O campo nome não deve estar vazio", () => {
    cy.get(".btn_inventory").first().click();
    cy.get(".shopping_cart_link").click();
    cy.get("#checkout").click();
    cy.get("#last-name").type("Doe");
    cy.get("#postal-code").type("12345678");
    cy.get("#continue").click();

    // Verificar se há uma mensagem de erro indicando que o campo nome deve conter ao menos uma palavra
    cy.get('.error-message-container').should('contain', "Error: First Name is required");

  });

  it("Campo CEP não deve estar vazio", () => {
    cy.get(".btn_inventory").eq(2).click();
    cy.get(".shopping_cart_link").click();
    cy.get("#checkout").click();
    cy.get("#first-name").type("John123");
    cy.get("#last-name").type("Doe");
    cy.get("#continue").click();

    // Verifique se as mensagens de erro são exibidas corretamente e o formulário não é enviado
    cy.get('.error-message-container').should('contain', "Error: Postal Code is required");

  });

  it("Visualizar o resumo do pedido antes de fechar a transação", () => {
    cy.get(".btn_inventory").first().click();
    cy.get(".shopping_cart_link").click();
    cy.get("#checkout").click();
    cy.url().should('include', 'checkout-step-one.html');
    cy.get("#first-name").type("John");
    cy.get("#last-name").type("Doe");
    cy.get("#postal-code").type("12345678");
    cy.get("#continue").click();
    cy.url().should('include', 'checkout-step-two.html');

    // Verifique se há produtos no resumo do pedido
    cy.get(".cart_item").should("exist");

    // Verifique o valor do produto
    cy.get('.summary_subtotal_label').contains("Item total: $" + "29.99");

    // Verifique a taxa do pedido
    cy.get('.summary_tax_label').contains("Tax: $" + "2.40");

    // Verifique o total do pedido
    cy.get('.summary_total_label').contains("Total: $" + "32.39");

  });


  it("Fluxo de pagamento", () => {
    // Adicionar itens ao carrinho
    cy.get(".btn_inventory").first().click();
    cy.get(".btn_inventory").eq(1).click();
  
    // Prossiga para a página de checkout
    cy.get(".shopping_cart_link").click();
    cy.get("#checkout").click();
  
    // Preencha as informações de pagamento
    cy.get("#first-name").type("John");
    cy.get("#last-name").type("Doe");
    cy.get("#postal-code").type("12345678");
  
    // Simule um pagamento bem-sucedido
    cy.get("#continue").click();

    cy.url().should('include', 'checkout-step-two.html');

     // Verifique as informações do produto na página de checkout
     cy.get(".cart_item").should("have.length", 2);
     cy.get(".cart_item").then((item) => {
       cy.wrap(item).contains("Sauce Labs Backpack");
       cy.wrap(item).contains("29.99");
       cy.wrap(item).contains("Sauce Labs Bike Light");
       cy.wrap(item).contains("9.99");
    });

    cy.get('.summary_subtotal_label').contains("Item total: $" + "39.98");

    // Verifique a taxa do pedido
    cy.get('.summary_tax_label').contains("Tax: $" + "3.20");

    // Verifique o total do pedido
    cy.get('.summary_total_label').contains("Total: $" + "43.18");

    cy.get("#finish").click();

    // Verifique se a transação foi concluída com sucesso
    cy.get(".complete-header").should("have.text", "Thank you for your order!");

  });

})