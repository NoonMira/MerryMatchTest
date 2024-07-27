/// <reference types= "cypress" /> 
import { generate_random_string } from '../../fixtures/random.js'
import { elements } from './variable.cy.js'
import { formData,formData2,images,hobbies,failedData } from './form-data.js'

describe('Login and register', () => {
  let random_string = generate_random_string(150)
  let baseUrl = "http://localhost:5173"
  beforeEach(() => {
    cy.fixture('example.json').as('loginData');
  })

it('Open register page', () => {
        cy.viewport('macbook-11');
        cy.wait(200);
        cy.visit('/register'); 
        cy.get('article > .text-sm').should('contain.text', 'REGISTER');
        
        for (const [key, value] of Object.entries(formData)) {
          const element = elements[key];  
          cy.get(element).should('be.enabled');
          if (key === 'birthdate') {
            cy.get(element).click().type(value).should('have.value', value);
          } else if (key === 'location' || key === 'city') {
            cy.get(element).select(value).should('have.value', value);
          } else {
            cy.get(element).type(value).should('have.value', value);
          }
        }
        cy.get(elements.nextBtn).should('be.enabled').click();
      });
 
  it('register: Identities and Interests', () => {
    cy.get('.mb-6').contains('Identities and Interests')
    cy.get('.text-red-500').click()
    cy.get(elements.nextBtn).click()

    for (let [key,value] of Object.entries(formData2)) {
      const element = elements[key];
      cy.get(element).should('not.have.class', 'disable')
      cy.get(element).select(value)
    }
    cy.get(elements.hobby).then($box => {
      hobbies.forEach(hobby => {
        cy.wrap($box).type(`${hobby}{enter}`)
      });
    });
    cy.get('[id^="delete-hobby-btn"]').first().as('deleteButtons')
    cy.get('@deleteButtons').each($button => {
        cy.wrap($button).click({ timeout: 500000 });
    });  
    cy.get(elements.nextBtn).click()
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
    cy.viewport('macbook-11');
    cy.wait(200);
    cy.visit('/register');
    for (let [key,value] of Object.entries(failedData)) {
      const element = elements[key];
      cy.get(element).should('be.enabled')
      cy.get(element).type(value)
    }
    cy.get(elements.nextBtn).click()
    cy.get('article > .text-sm').should('contain.text', 'REGISTER');
    cy.url().should('contain','/register')
  })

  it('Login: input Email or Username', function() {
    cy.visit(baseUrl+'/login')
    this.loginData.forEach(data =>{
      cy.login(data.username,data.password)
    })
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
})
