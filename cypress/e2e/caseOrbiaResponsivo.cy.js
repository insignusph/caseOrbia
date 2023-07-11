const viewports = [
  { name: "iphone-6", width: 375, height: 667 },
  { name: "iphone-x", width: 375, height: 812 },
  { name: "galaxy-s9", width: 360, height: 740 },
  { name: "ipad-2", width: 768, height: 1024 },
  { name: "ipad-pro", width: 1024, height: 1366 },
  { name: "macbook-13", width: 1280, height: 800 },
  { name: "desktop", width: 1920, height: 1080 }
];

describe("Verificar se as páginas estão responsivas", () => {
  viewports.forEach(viewport => {
    it(`Exibindo corretamente em ${viewport.name}`, () => {
      cy.viewport(viewport.width, viewport.height);
      cy.login('standard_user', 'secret_sauce');

      // Realize as verificações específicas para cada viewport
      cy.get(".btn_inventory").first().click();
      cy.get(".btn_inventory").eq(1).click();
      cy.get(".shopping_cart_link").click();
      cy.get("#checkout").click();
      cy.get("#first-name").type("John");
      cy.get("#last-name").type("Doe");
      cy.get("#postal-code").type("12345678");
      cy.get("#continue").click();
      cy.url().should('include', 'checkout-step-two.html');
      cy.get(".cart_item").should("have.length", 2);
      cy.get(".cart_item").then((items) => {
        expect(items[0]).to.contain.text("Sauce Labs Backpack");
        expect(items[0]).to.contain.text("29.99");
        expect(items[1]).to.contain.text("Sauce Labs Bike Light");
        expect(items[1]).to.contain.text("9.99");
      });
      cy.get('.summary_subtotal_label').should("have.text", "Item total: $39.98");
      cy.get('.summary_tax_label').should("have.text", "Tax: $3.20");
      cy.get('.summary_total_label').should("have.text", "Total: $43.18");
      cy.get("#finish").click();
      cy.url().should('include', 'checkout-complete.html');
      cy.get(".complete-header").should("have.text", "Thank you for your order!");
    });
  });
});
