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

Given( /^I want to sell all my (.*)$/, item => {
    onlineSales.listItem(item)
} )

When( /^I sell all my (.*) at the price of \$(\d+)$/, ( item, expectedSalesPrice ) => {
    salesPrice = onlineSales.sellItem(item)
} )

Then( /^I should still get \$(\d+)$/, expectedSalesPrice => {
    expect(salesPrice).toBe(parseInt(expectedSalesPrice))
} )


Fusion( '../scenario-outlines.feature' )
