# Scenario outlines

```gherkin
Feature: Online sales

Scenario Outline: Selling an item
  Given I have a(n) <Item>
  When I sell the <Item>
  Then I should get $<Amount>

  Examples:

  | Item                                           | Amount |
  | Autographed Neil deGrasse Tyson book           | 100    |
  | Rick Astley t-shirt                            | 22     |
  | An idea to replace EVERYTHING with blockchains | $0     |
```

```javascript
const { Before, Given, When, Then, Fusion } = require( '../../../../src' )

const { OnlineSales } = require( '../../../src/online-sales' )
let onlineSales
let salesPrice


Before( () => { onlineSales = new OnlineSales() } )

Given( /^I have a\(n\) (.*)$/, item => {
    onlineSales.listItem(item)
} )

When( /^I sell the (.*)$/, item => {
    salesPrice = onlineSales.sellItem(item)
} )

Then( /^I should get \$(\d+)$/, expectedSalesPrice => {
    expect(salesPrice).toBe(parseInt(expectedSalesPrice))
} )


Fusion( '../scenario-outlines.feature' )
```
