import { getPage } from '../support/app.po';

describe('el-marchi-ui-e2e', () => {
  beforeEach(() => cy.visit('/'));

  it('should renders', () => {
    getPage().should('exist');
  });

  it('should display the navbar', () => {
    // Check that the navbar exists
    cy.get('#navbar').should('exist');

    // Check that the logo is present
    cy.get('#navbar a[href="/"]').should('contain.text', 'El-Marchi');

    // Check for navigation links
    cy.get('#navbar .menu li a').should('have.length.at.least', 1);

    // Check for dropdowns
    cy.get('#navbar .dropdown').should('exist');
  });

  it('should display the newsletter', () => {
    cy.get('#newsletter').should('exist');
    cy.get('#newsletter').should('be.visible');
    cy.get('#newsletter').should('contain.text', 'Subscribe to our newsletter');
  });

  it('should display the footer', () => {
    cy.get('#footer').should('exist');
    cy.get('#footer').should('be.visible');
    cy.get('#footer').should(
      'contain.text',
      'Your Partner in Business and Trade',
    );
    cy.get('#footer a[aria-label="Twitter/X Page"]').should('exist');
  });

  it('should handle newsletter interactions', () => {
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('#newsletter input[type="email"]')
      .type('test@example.com')
      .should('have.value', 'test@example.com');
  });
});
