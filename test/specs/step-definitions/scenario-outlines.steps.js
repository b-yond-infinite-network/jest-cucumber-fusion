const { Before, Given, When, Then, Fusion } = require( '../../../src' )

const { OnlineSales } = require( '../../src/online-sales' )

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


Fusion( '../features/scenario-outlines.feature' )
