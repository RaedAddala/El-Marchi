import { getPage } from '../support/app.po';

describe('el-marchi-ui-e2e', () => {
  beforeEach(() => cy.visit('/'));

  it('should renders', () => {
    getPage().should('exist');
  });
});
