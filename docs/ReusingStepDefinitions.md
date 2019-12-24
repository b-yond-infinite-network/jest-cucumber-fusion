# Re-using step definitions

One of the advantage of using jest-cucumber-fusion is that it will manage your test suite scope inside its execution
Your automation code easy to read: it reads pretty much like your feature file. 
You can then reuse the same steps repeatedly in multiple scenarios.

It is normally recommended that your test code contain as little logic as possible, with common setup logic abstracted into other modules (e.g., test data creation), so there really shouldn't be much duplicated code in the first place. To further reduce duplicated code, you could do something like this:
```gherkin
# reuse-rocket.feature
Feature: Rocket reuse

Scenario: Reusing a SpaceX rocket
  Given I am Elon Musk and I launched a rocket in space already
  Then I'm happy
```

Write you step definitions as usual but require (or import) your shared step definition file
```javascript
// reuse-rocket.steps.js
const { Given, Fusion } = require( 'jest-cucumber-fusion' )



Given( 'I am Elon Musk and I launched a rocket in space already', () => {
    const hasLaunchedARocket = true
    expect( hasLaunchedARocket ).toBe( true )
} )

///
///This is our shared test code
///
require( './reuse-code' )


Fusion( '../reuse-rocket.feature' )
```

Place you shared step definitions in a shared step definition file, jest-cucumber-fusion takes care of the rest
```javascript
// reuse-code.js
const { Then } = require( 'jest-cucumber-fusion' )

Then( 'I\'m happy', () => {
    const localHappy = true
    expect( localHappy ).toBe( true )
} )
```


### Managing dependencies
Though it is not best practice, you sometime need to pass value to the shared step definitions file, like in this example:

```gherkin
# reuse-rocket.feature
Feature: Rocket reuse

Scenario: Reusing a SpaceX rocket
  Given I am Elon Musk and I launched a rocket in space already
  When I relaunch the rocket
  Then the rocket end up in space again
  And I drop my mic
```


You will now need to encapsulate the variables in an accessor function and pass the accessor to the constructor/init of your file
```javascript
// reuse-rocket.steps.js
const { Given, Fusion } = require( 'jest-cucumber-fusion' )

const { Rocket } = require( '../../../src/rocket' )

let rocket
function getCurrentRocket() {
	return rocket
}

Given( 'I am Elon Musk and I launched a rocket in space already', () => {
	rocket = new Rocket()
} )


require( './reuse-code' )( getCurrentRocket )


Fusion( '../reuse-definition.feature' )
```


Inside you shared step file, be carefulle to call the accessor inside your test step function not outside
```javascript
// reuse-code.js
const { When, Then, And } = require( 'jest-cucumber-fusion' )

And( 'I drop my mic', () => {  
    const micDropped = true
    expect( micDropped ).toBe( true )
} )

module.exports = exports = function( fnRocket ) {
	When( 'I relaunch the rocket', () => {
            const rocketUsed = fnRocket()
            rocketUsed.launch()
	} )
	
	Then( 'the rocket end up in space again', () => {
            const rocketUsed = fnRocket()
            expect( rocketUsed.isInSpace ).toBe(true)
	} )
}
```
