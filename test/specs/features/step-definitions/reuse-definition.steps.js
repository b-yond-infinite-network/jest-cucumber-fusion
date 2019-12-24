const { Given, Fusion } = require( '../../../../src' )

const { Rocket } = require( '../../../src/rocket' )

let rocket
function getCurrentRocket() {
	return rocket
}

Given( 'I am Elon Musk and I launched a rocket in space already', () => {
	rocket = new Rocket()
} )


const vlaue = require( './reuse-code' )( getCurrentRocket )


Fusion( '../reuse-definition.feature' )
