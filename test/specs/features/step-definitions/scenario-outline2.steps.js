const { Given, When, Then, Fusion, Before } = require("../../../../src");

const { OnlineSales } = require("../../../src/online-sales");

const onlineSales = new OnlineSales();

Before(()=>{
  if (onlineSales.nItems() >= 2) {
    onlineSales.listedItems = [];
  }
})

Given(/^I have (\d+) items for sale$/, (nItems) => {
  expect(Number(nItems)).toBe(onlineSales.nItems());
});

When(/^I bought "(.+)"/, (item) => {
  onlineSales.buyItem(item);
});

When(/^I bought the following items:$/, (table) => {
    if (typeof table === "string") return;

    table.forEach((row) => {
      onlineSales.buyItem(row.Item)
    });
});

Then(/^I have (\d+) items for sale$/, (nItems) => {
  expect(Number(nItems)).toBe(onlineSales.nItems());
});

Then(/^I want to sell (\d+) items if they in list$/, (nItems, table) => {
  if (typeof nItems !== "string") return;
  if (typeof table === "string") return;
  let iNumber = Number(nItems);

  table.forEach((row) => {
    if (iNumber > 0 && onlineSales.listedItems.includes(row.Item)) {
      onlineSales.sellItem(row.Item);
      iNumber--;
    }
  });
});

Fusion("../scenario-outline2.feature");
