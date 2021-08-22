const { When, Then, And } = require("../../../../src");

And("I drop my mic", () => {
  const micDropped = true;
});

module.exports = exports = (fnRocket) => {
  When("I relaunch the rocket", () => {
    const rocketUsed = fnRocket();
    rocketUsed.launch();
  });

  Then("the rocket end up in space again", () => {
    const rocketUsed = fnRocket();
    expect(rocketUsed.isInSpace).toBe(true);
  });
};
