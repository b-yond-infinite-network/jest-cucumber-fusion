# Jest Cucumber Fusion

Write 'pure' cucumber test in Jest without syntax clutter 

[![Build Status](https://travis-ci.com/b-yond-infinite-network/infinity-scripting.svg?token=sqPtR1VpUDp2Kdz2PxNw&branch=master)](https://travis-ci.com/b-yond-infinite-network/infinity-scripting)
[![Codecov](https://codecov.io/gh/b-yond-infinite-network/infinity-scripting/branch/master/graph/badge.svg?token=Elub4pCrMM)](https://codecov.io/gh/b-yond-infinite-network/infinity-scripting)
[![npm downloads](https://img.shields.io/npm/dm/jest-cucumber-fusion.svg?style=flat-square)](https://www.npmjs.com/package/jest-cucumber-fusion)


## Overview
Build on top of [Jest-cucumber](https://github.com/bencompton/jest-cucumber), Jest-Cucumber-Fusion handle the writing of the corresponding Jest test steps using an uncluttered cucumber style.
Instead of using `describe` and `it` blocks, you instead write a Jest test for each scenario, and then define `Given`, `When`, and `Then` step definitions inside of your Jest tests. 
jest-cucumber-fusion then allows you to link these Cucumber tests to your javascript Cucumber feature steps.
Adding `Fusion`, jest-cucumber-fusion then make the links between and build the necessary scaffolding for jest-cucumber to do its job.
Now allowed to use jest naturally in your project like you would use native Cucumber.

## Motivation

Jest-cucumber is an amazing project but forces you to write a lot of repetitive scaffolding code to setup the link betwen Jest and Cucumber.
With Jest-Cucumber-Fusion, it really takes only the minimal code possible:
 - a Cucumber Feature file with gherkin sentences
 - a Cucumber Feature step file with your javascript validation code, ended with the `Fusion` function to link the two



## Getting Started

### Install Jest Cucumber Fusion:

```
npm install jest-cucumber-fusion --save-dev
```

### Add a Feature file:

```gherkin
###filename: rocket-launching.feature
Feature: Rocket Launching

Scenario: Launching a SpaceX rocket
  Given I am Elon Musk attempting to launch a rocket into space
  When I launch the rocket
  Then the rocket should end up in space
  And the booster(s) should land back on the launch pad
  And nobody should doubt me ever again
```

### Add the following to your Jest configuration:

```javascript  
  "testMatch": [
    "**/*.steps.js"
  ],
```

Or if you don't have a jest configuration already, at the first-level element of your package.json:
```javascript
"jest": {
    "testMatch": [
      "**/*.steps.js"
    ]
    "
```

Or if you want full coverage report (to use in your CI, for example)
```javascript
"jest": {
    "testMatch": [
      "**/*.steps.js"
    ],
    "coveragePathIgnorePatterns": [
      "/node_modules/",
      "/test/"
    ],
    "coverageDirectory": "./coverage/",
    "collectCoverage": true
  }
```

### Add a your Cucumber feature step definition file and load Fusion
```javascript
//filename: rocket-launching.steps.js
const { Given, When, Then, And, But, Fusion } = require( 'jest-cucumber-fusion' )

```

### Load any dependency you need to do your test

```javascript
//filename: rocket-launching.steps.js
const { Given, When, Then, And, But, Fusion } = require( 'jest-cucumber-fusion' )

const { Rocket } = require( '../../src/rocket' )
let rocket

```

### Add step definitions to your scenario Jest tests:

```javascript
//filename: rocket-launching.steps.js
const { Given, When, Then, And, But, Fusion } = require( 'jest-cucumber-fusion' )

const { Rocket } = require( '../../src/rocket' )
let rocket

Given( 'I am Elon Musk attempting to launch a rocket into space', () => {
    rocket = new Rocket()
} )

When( 'I launch the rocket', () => {
    rocket.launch()
} )

Then( 'the rocket should end up in space', () => {
    expect(rocket.isInSpace).toBe(true)
} )

And( /^the booster\(s\) should land back on the launch pad$/, () => {
    expect(rocket.boostersLanded).toBe(true)
} )

But( 'nobody should doubt me ever again', () => {
    expect('people').not.toBe('haters')
} )
```

### Adding the Fusion() call at the end of your Cucumber feature step
You have to match it with your Cucumber Feature definition file:
```javascript
//filename: rocket-launching.steps.js
const { Given, When, Then, And, But, Fusion } = require( 'jest-cucumber-fusion' )

const { Rocket } = require( '../../src/rocket' )
let rocket

Given( 'I am Elon Musk attempting to launch a rocket into space', () => {
    rocket = new Rocket()
} )

When( 'I launch the rocket', () => {
    rocket.launch()
} )

Then( 'the rocket should end up in space', () => {
    expect(rocket.isInSpace).toBe(true)
} )

And( /^the booster\(s\) should land back on the launch pad$/, () => {
    expect(rocket.boostersLanded).toBe(true)
} )

But( 'nobody should doubt me ever again', () => {
    expect('people').not.toBe('haters')
} )


Fusion( 'rocket-launching.feature' )
```


## Additional Documentation 

  * [Gherkin tables](./docs/GherkinTables.md)
  * [Step definition arguments](./docs/StepDefinitionArguments.md)
  * [Scenario outlines](./docs/ScenarioOutlines.md)
  * [Re-using step definitions](./docs/ReusingStepDefinitions.md)  
  * [Configuration options](./docs/AdditionalConfiguration.md)
  * [Running the examples](./docs/RunningTheExamples.md)
