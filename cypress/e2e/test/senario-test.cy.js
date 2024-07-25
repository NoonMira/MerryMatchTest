/// <reference types= "cypress" /> 

import { generate_random_string } from './random.js'
import { elements } from './variable.cy.js'

describe('Login and register', () => {
  let baseUrl = 'http://localhost:5173'
  let random_string = generate_random_string(150)
  const password = 'fufu12345678'
  const username = 'fufu@fontain'
  const hobbies = ['cycling', 'drawing', 'dancing', 'photography','traveling','gaming','camping','listening to music','watching movies','gardening'];
  const images = ['fu.jpg', 'fu2.jpg', 'fu3.jpeg','fu4.jpg','fu5.jpg']; 

  it('Open register page', () => {
    cy.viewport('macbook-11')
    cy.wait(200)
    cy.visit('/register')
    cy.get('article > .text-sm').should('contain.text','REGISTER')
    cy.get(elements.name).should('be.enabled').type('Furina')
    cy.get(elements.birthdate).should('be.enabled').click().type('1999-09-19')
    cy.wait(1000); 
    cy.get(elements.location).should('be.enabled').select('United Kingdom')
    cy.get(elements.city).should('be.enabled').select('London')
    cy.get(elements.username).should('not.have.class', 'disable').type(username).should('have.value', username)
    cy.get(elements.email).should('not.have.class', 'disable').type('fufu123@gmail.com')
    cy.get(elements.password).should('be.enabled').type(password).should('have.value', password);
    cy.get(elements.confirmPwd).type(password).should('have.value', password);
    cy.get(elements.nextBtn).click()
  })
  
  it('register: Identities and Interests', () => {
    cy.get('.mb-6').contains('Identities and Interests')
    cy.get('.text-red-500').click()
    cy.get(elements.nextBtn).click()
    cy.get(elements.sexInden).should('not.have.class', 'disable').select('male')
    cy.get(elements.sexPrefer).should('not.have.class', 'disable').select('female')
    cy.get(elements.racialPrefer).should('not.have.class', 'disable').select('White')
    cy.get(elements.meeting).should('not.have.class', 'disable').select('24-7 eleven')
    cy.get(elements.hobby).should('not.have.class', 'disable');
    cy.get(elements.hobby).then($box => {
      hobbies.forEach(hobby => {
        cy.wrap($box).type(`${hobby}{enter}`)
      });
    });
    cy.get('[id^="delete-hobby-btn"]').first().as('deleteButtons')
    cy.get('@deleteButtons').each($button => {
        cy.wrap($button).click({ timeout: 500000 });
    });  
    cy.get('a > .h-12').click()
  })

  it('register: Upload Photos', () => { 
    cy.get('.text-red-500').click()
    cy.get('a > .h-12').click()
    cy.get('.gap-1 > .text-purple-500').contains('Profile pictures')
    images.forEach((img, index) => {
      cy.get(`:nth-child(${index + 1}) > .relative > .opacity-0`).attachFile(img);
    });
    cy.contains('button', 'X').click();
    cy.get('#remove-image-btn\\ 0').click();
    cy.get(elements.nextBtn).click()
  });


  it('Register step1 failed', () => {
    cy.viewport('macbook-11')
    cy.wait(200)
    cy.visit(baseUrl+'/register')
    cy.get('article > .text-sm').should('contain.text','REGISTER')
    cy.get(elements.name).should('be.enabled').type('  ')
    cy.get(elements.birthdate).should('be.enabled').click().type('  ')
    cy.wait(1000); 
    cy.get(elements.location).should('be.enabled').select('  ')
    cy.get(elements.city).should('be.enabled').select('  ')
    cy.get(elements.username).should('not.have.class', 'disable').type(' ').should('have.value', username)
    cy.get(elements.email).should('not.have.class', 'disable').type('  ')
    cy.get(elements.password).should('be.enabled').type(' ').should('have.value', password);
    cy.get(elements.confirmPwd).type(' ').should('have.value', password);
    cy.get(elements.nextBtn).click()
    cy.get(':nth-child(1) > :nth-child(2) > .text-rose-600')
    cy.get(':nth-child(1) > :nth-child(1) > .text-rose-600')
    cy.get(':nth-child(2) > :nth-child(2) > .text-rose-600')
    cy.get(':nth-child(2) > :nth-child(1) > .text-rose-600')
    cy.get(':nth-child(3) > :nth-child(2) > .text-rose-600')
    cy.get(':nth-child(2) > :nth-child(1) > .text-rose-600')
    cy.get(':nth-child(3) > :nth-child(2) > .text-rose-600')
    cy.get(':nth-child(3) > :nth-child(1) > .text-rose-600')
    cy.get(':nth-child(4) > :nth-child(2) > .text-rose-600')
  })

  it('Login: input Email or Username', () => {
    cy.visit(baseUrl+'/login')
    cy.get(elements.usernameOrEmail).should('be.enabled').click()
    .type(username).should('have.value',username)
    cy.get(elements.password).should('be.enabled').type(password).should('have.value', password);
    cy.contains('Log in').click()
    
    cy.window().then((window)=>{
      const token = window.localStorage.getItem('token')
      expect(token).to.exist
    })
  })

  it('Check list Profile', () => {
    cy.get('.w-10 > img').click()
    cy.get('#list-1').contains('Profile').invoke('click').click()
    cy.url().should('include', '/user/:userId/edit')
    cy.get(':nth-child(2) > .mb-6').contains('Basic Information')
  })

  it('Logout', () => {
    cy.get('.w-10 > img').click()
    cy.get('#list-5').contains('Log out').invoke('click').click()
  })
})
