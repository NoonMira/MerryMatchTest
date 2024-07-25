const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173', 
    setupNodeEvents(on, config) {
      // implement node event listeners here
      
    },

  testIsolation:false,
  experimentalStudio: true,
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/results',
    overwrite: false,
    html: false,
    json: true,
  },
  },
});

