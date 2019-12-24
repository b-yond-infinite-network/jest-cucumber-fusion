## Step definition arguments

```gherkin
Feature: Getting rich writing software

Scenario: Depositing a paycheck
  Given my account balance is $10
  When I get paid $1000000 for writing some awesome code
  Then my account balance should be $1000010
```

```javascript
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


Fusion( '../using-dynamic-values.feature' )

```
