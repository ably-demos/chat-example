import React from 'react'
import MessageInput from './index'

describe('<MessageInput />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<MessageInput />)
  })
})