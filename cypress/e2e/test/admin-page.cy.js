/// <reference types= "cypress" /> 
import { generate_random_string } from '../spec/random.js'

describe('template spec', () => {
    let img = ['star.png', 'like.png']
    let random_string = generate_random_string(50)
    it('Add Package', () => {
        let baseUrl = 'http://localhost:5173'
        cy.visit(baseUrl+'/package/view')
        cy.get('.text-slate-800').should('contain.text','Merry Package')
        cy.get('.items-start > .px-6').contains('Add Package').click()
        cy.url().should('include', '/package/add')
        cy.get(':nth-child(1) > .input').should('not.have.class', 'disable').type('Platinum')
        cy.get('.grid > :nth-child(2) > .input').invoke('attr', 'type')
        .should('equal', 'number');
        cy.get('.w-\[150px\] > :nth-child(2) > .input').attachFile(img)
        cy.get('[name="icons"]').attachFile(img)
        cy.get(':nth-child(2) > .flex > .input').should('be.enabled').type('random_string')
      })

      it('Upload Img and input detail', () => {
        cy.get('[name="icons"]').attachFile(img[1])
        cy.get('.absolute > img').click()
        cy.get('[name="icons"]').attachFile(img[0])
        cy.get('.ml-4').click().should('be.disabled')
        cy.get(':nth-child(2) > .flex > .input').should('not.exist')
        cy.get('#add-detail').contains('Add detail').click()
        cy.get(':nth-child(2) > .flex > .input').should('be.enabled').type('random_string')
        cy.get('#add-detail').click()
        cy.get(':nth-child(3) > .flex > .input').should('be.enabled').type('random_string')
        cy.get('.bg-rose-700').click()
  })
})
