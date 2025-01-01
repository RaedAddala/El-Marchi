/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare namespace Cypress {
    interface Chainable<Subject> {
        login(email: string, password: string): Chainable<Subject>;
    }
}

const login = (email: string, password: string): void => {
    console.log('Custom command example: Login', email, password);
};

Cypress.Commands.addAll({ 
    login 
});

export {};