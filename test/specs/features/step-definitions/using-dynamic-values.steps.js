const { Before, Given, When, Then, Fusion } = require( '../../../../src' )

const { BankAccount } = require( '../../../src/bank-account' )

let myAccount
		
Before( () => { myAccount = new BankAccount() } )

Given(/^my account balance is \$(\d+)$/, balance => {
    myAccount.deposit(parseInt(balance))
} )

When(/^I get paid \$(\d+) for writing some awesome code$/, paycheck => {
    myAccount.deposit(parseInt(paycheck))
} )

Then(/^my account balance should be \$(\d+)$/, expectedBalance => {
    expect(myAccount.balance).toBe(parseInt(expectedBalance))
} )

Given(/^my account name is '(.*)'$/, nameAccount => {
    myAccount.name = nameAccount
} )

When(/^I get an new account name '(.*)' with a type (.*) from my old account named '(.*)'$/, ( nameNewAccount, typeAccount, nameOldAccount ) => {
    
    myAccount.name = nameNewAccount
    myAccount.type = typeAccount
} )

Then(/^my account name should be "(.*)" and have a type (.*)$/, ( nameAccount, typeAccount ) => {
    expect(myAccount.name).toBe( nameAccount )
    expect(myAccount.type).toBe( typeAccount )
} )

Fusion( '../using-dynamic-values.feature' )
