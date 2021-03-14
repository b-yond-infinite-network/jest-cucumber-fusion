const { Given, When, Then, And, But, Fusion } = require('../../../../src')

const { Rocket } = require('../../../src/rocket')

let rocket

Given('ik ben Elon Musk die probeert een raket te lanceren in de ruimte', () => {
    rocket = new Rocket()
})

When('ik een raket lanceer', () => {
    rocket.launch()
})

When('ik de \'<raket>\' lanceer', () => {
    rocket.launch()
})

When(/^ik mijn persoonlijke raket benoemd '(.*)'$/, function (nameRocket) {
    expect(nameRocket).toBeDefined()
    rocket.launch()
});

Then('zou de raket in de ruimte moeten belanden', () => {
    expect(rocket.isInSpace).toBe(true)
})

/// Complex Regex :  at position (\[(?: *\d+(?: |, |,)*)+\]) with no value
And(/^mijn positie in de ruimte is (\[(?: *\d+(?: |, |,)*)+\])$/, function (arrayPosition) {

    const isAnArray = JSON.parse(arrayPosition)
    expect(isAnArray).toBeInstanceOf(Array)
})

And(/^de booster\(s\) zouden terug moeten landen op het lanceerplatform$/, () => {
    expect(rocket.boostersLanded).toBe(true)
})

But('niemand mag nog ooit in mij twijfelen', () => {
    expect('people').not.toBe('haters')
})


Fusion('../basic-scenarios-language.feature')
