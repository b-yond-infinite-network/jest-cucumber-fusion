const { Given, When, Then, And, But, Fusion } = require( '../../../../src' )

const { Rocket } = require( '../../../src/rocket' )

let rocket

Given( 'I am Elon Musk attempting to launch a rocket into space', () => {
    rocket = new Rocket()
} )

When( 'I launch the rocket', () => {
    rocket.launch()
} )


When( 'I launch the \'<rocket>\'', () => {
    rocket.launch()
} )

When( /^I launch my personal rocket named '(.*)'$/, function ( nameRocket ) {
    expect( nameRocket ).toBeDefined()
    rocket.launch()
} );

Then( 'the rocket should end up in space', () => {
    expect(rocket.isInSpace).toBe(true)
} )

And( /^the booster\(s\) should land back on the launch pad$/, () => {
    expect(rocket.boostersLanded).toBe(true)
} )

But( 'nobody should doubt me ever again', () => {
    expect('people').not.toBe('haters')
} )


Fusion( '../basic-scenarios.feature' )
