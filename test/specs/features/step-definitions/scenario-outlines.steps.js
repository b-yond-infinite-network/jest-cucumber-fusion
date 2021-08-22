const { Before, Given, When, Then, Fusion } = require("../../../../src");

const { OnlineSales } = require("../../../src/online-sales");

let onlineSales;
let salesPrice;

Before(() => {
  onlineSales = new OnlineSales();
});

Given(/^I have a\(n\) (.*)$/, (item) => {
  onlineSales.listItem(item);
});

Given(
  /^I have an Item named '<ThatCouldLookLikeAnOutlineVariable>'$/,
  (item) => {
    onlineSales.listItem("Autographed Neil deGrasse Tyson book");
  }
);

When(/^I sell the (.*)$/, (item) => {
  salesPrice = onlineSales.sellItem(item);
});

When(/^I sell <ThatCouldLookLikeAnOutlineVariable With Spaces in it>$/, () => {
  salesPrice = onlineSales.sellItem("Autographed Neil deGrasse Tyson book");
});

Then(/^I should get \$(\d+)$/, (expectedSalesPrice) => {
  expect(salesPrice).toBe(parseInt(expectedSalesPrice));
});

Then(/^I get \$<Amount>$/, (expectedSalesPrice) => {
  expect(salesPrice).toBe(parseInt(100));
});

Given(/^I want to sell all my (.*)$/, (item) => {
  onlineSales.listItem(item);
});

When(
  /^I sell all my (.*) at the price of \$(\d+) CAD$/,
  (item, expectedSalesPrice) => {
    salesPrice = onlineSales.sellItem(item);
    if (salesPrice) salesPrice = parseInt(expectedSalesPrice);
  }
);

When(
  /^I sell all my (.*) with a starting price of \$(\d+) at the rebate price of \$(\d+)$/,
  (item, startingPrice, expectedSalesPrice) => {
    salesPrice = onlineSales.sellItem(item);
    if (salesPrice) {
      salesPrice = parseInt(expectedSalesPrice);
    } else {
      salesPrice = null;
    }
  }
);

When(
  /^I sell all my (.*) with a starting price of \$(\d+) at the fantastic price of (\d+)\$ USD which is nice$/,
  (item, startingPrice, expectedSalesPrice) => {
    salesPrice = onlineSales.sellItem(item);
    if (salesPrice) {
      salesPrice = parseInt(expectedSalesPrice);
    } else {
      salesPrice = null;
    }
  }
);

When(
  /^I sell all my (.*) with a starting price of \$(\d+) at the fantastic price of (\d+)\$ CAD which is nice$/,
  (item, startingPrice, expectedSalesPrice) => {
    salesPrice = onlineSales.sellItem(item);
    if (salesPrice) {
      salesPrice = parseInt(expectedSalesPrice);
    } else {
      salesPrice = null;
    }
  }
);

When(
  /^I sell all my (.*) with a starting price of \$(\d+) at the rebate price of (\d+)\$ CAD which is nice$/,
  (item, startingPrice, expectedSalesPrice) => {
    salesPrice = onlineSales.sellItem(item);
    if (salesPrice) {
      salesPrice = parseInt(expectedSalesPrice);
    } else {
      salesPrice = null;
    }
  }
);

Then(/^I should still get \$(\d+)$/, (expectedSalesPrice) => {
  expect(salesPrice).toBe(parseInt(expectedSalesPrice));
});

Then(
  /^the (\d+)(?:th|d|nd|rd|st) item (\d+)(?:th|d|nd|rd|st) price has a price amount of (\d+) which is a '(\w*)'$/,
  (indexItem, indexPrice, amountPrice, typePrice) => {
    expect(salesPrice).toBe(parseInt(amountPrice));
  }
);

Fusion("../scenario-outlines.feature");
