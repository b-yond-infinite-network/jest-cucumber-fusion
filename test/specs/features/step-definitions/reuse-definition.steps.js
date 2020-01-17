const { Given, Then, And, Fusion } = require( '../../../../src' )

const { Rocket } = require( '../../../src/rocket' )

let rocket
function getCurrentRocket() {
	return rocket
}

Given( /^I am Elon Musk and I launched a rocket in space already$/, () => {
	rocket = new Rocket()
} )


require( './reuse-code' )( getCurrentRocket )

Then( And( /^the mission was said to be '(.*)'$/, ( sayingForTheMission ) => {
	expect( sayingForTheMission ).toBeDefined( )
} ) )

Fusion( '../reuse-definition.feature' )
