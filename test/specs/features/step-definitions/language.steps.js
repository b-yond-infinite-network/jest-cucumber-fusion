const { Before, Given, When, Then, Fusion, And, But } = require('../../../../src')

const { OnlineSales } = require('../../../src/online-sales')

let onlineSales
let salesPrice

Before(() => { onlineSales = new OnlineSales() })

Given(/^ik heb een t-shirt$/, item => {
    onlineSales.listItem('Rick Astley t-shirt')
})

When(/^ik een t-shirt wil verkopen$/, item => {
    salesPrice = onlineSales.sellItem('Rick Astley t-shirt')
})

Then(/^ontvang ik €22$/, item => {
    expect(salesPrice).toEqual(22)
})

And(/^ben ik blij$/, item => {
    expect('ik').not.toEqual('boos')
})

But(/^heb ik geen t-shirts over$/, item => {
    expect(onlineSales.listedItems).not.toContain('Rick Astley t-shirt')
})

Given(/^ik heb een: (.*)$/, item => {
    onlineSales.listItem(item)
})

When(/^ik (.*) verkoop$/, item => {
    salesPrice = onlineSales.sellItem(item)
})

Then(/^zou ik er €(\d+) voor moeten krijgen$/, expectedSalesPrice => {
    expect(salesPrice).toBe(parseInt(expectedSalesPrice))
})

Given(/^'(.*)' is te koop$/, object => {
    onlineSales.listItem(object);
})

When(/^ik '(.*)' koop$/, object => {
    salesPrice = onlineSales.sellItem(object)
})

Then(/^heb ik €(\d+) uitgegeven$/, amount => {
    expect(salesPrice).toEqual(100)
})

Given('mijn voorraad bevat:', table => {
    table.forEach(row => {
        onlineSales.listItem(row.Object);
    })
})

When('ik de volgende producten toevoeg:', table => {
    onlineSales.listItem(table[0].Object);
});

Then(/^zitten er (\d) objecten in mijn voorraad, bestaant uit:$/, (nbre, table) => {
    expect(onlineSales.listedItems.length).toBe(parseInt(nbre))
    expect(onlineSales.listedItems.length).toBe(table.length)

    table.forEach((row, index) => {
        expect(onlineSales.listedItems).toContain(table[index].Object)
    })
})

Fusion('../language.feature')
