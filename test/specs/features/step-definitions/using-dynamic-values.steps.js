const { Before, Given, When, Then, Fusion } = require( '../../../../src' )

const { BankAccount } = require( '../../../src/bank-account' )

let myAccounts
		
Before( () => { myAccounts = [] } )

Given(/^I open new account with '(.+)' name$/, newAccountName => {
    myAccounts.push(new BankAccount());
    myAccounts[myAccounts.length - 1].name = newAccountName;
})

Given(/^my account#(\d+) balance is \$(\d+)$/, (nAcc, balance) => {
    myAccounts[nAcc - 1].deposit(parseInt(balance))
} )

When(/^I get paid \$(\d+) for writing some awesome code from my account#(\d+)$/, (paycheck, nAcc) => {
    myAccounts[nAcc - 1].deposit(parseInt(paycheck))
} )

Then(/^my account#(\d+) balance should be \$(\d+)$/, (nAcc, expectedBalance) => {
    expect(myAccounts[nAcc - 1].balance).toBe(parseInt(expectedBalance))
} )

Then(/^I have (\d+) accounts$/, nAccounts => {
    expect(myAccounts.length).toBe(parseInt(nAccounts));
})

Given(/^my account#(\d+) name is '(.*)'$/, (nAcc, nameAccount) => {
    myAccounts[nAcc - 1].name = nameAccount
} )

When(/^I get an new account#(\d+) name '(.*)' with a type (.*) from my old account named '(.*)'$/, ( nAcc, nameNewAccount, typeAccount, nameOldAccount ) => {
    myAccounts[nAcc - 1].name = nameNewAccount
    myAccounts[nAcc - 1].type = typeAccount
} )

Then(/^my account#(\d+) name should be "(.*)" and have a type (.*)$/, ( nAcc, nameAccount, typeAccount ) => {
    expect(myAccounts[nAcc - 1].name).toBe( nameAccount )
    expect(myAccounts[nAcc - 1].type).toBe( typeAccount )
} )

Then(/^my account#(\d+) should be:$/, (nAcc, table) => {
    if (typeof table === 'string') return;
    
    for (const [key, value] of Object.entries(myAccounts[nAcc - 1])) {
        table.forEach(row => {
            if (row.field === key) {
                expect(value.toString()).toBe(row.value);
            }
        });
    }
})

Fusion( '../using-dynamic-values.feature' )
