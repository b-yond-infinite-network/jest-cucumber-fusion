const stepsDefinition = { given: {}, when: {}, then: {}, and: {}, before: null, after: null  }

function addDefinitionFunction( definitionType, regexpSentence, fnForDefinition ){
    if( stepsDefinition[ definitionType ] ){
        if( regexpSentence.constructor == RegExp )
            stepsDefinition[ definitionType ][ regexpSentence.source ] = {
                stepRegExp :    regexpSentence,
                stepExpression: null,
                stepFn :        fnForDefinition
            }
        else if( typeof regexpSentence === 'string' )
            stepsDefinition[ definitionType ][ regexpSentence ] = {
                stepRegExp :    null,
                stepExpression: regexpSentence,
                stepFn :        fnForDefinition
            }
    }
}

function Given( regexpSentence, fnForDefinition ){
    addDefinitionFunction( "given", regexpSentence, fnForDefinition )
}
function When( regexpSentence, fnForDefinition ){
    addDefinitionFunction( "when", regexpSentence, fnForDefinition )
}
function Then( regexpSentence, fnForDefinition ){
    addDefinitionFunction( "then", regexpSentence, fnForDefinition )
}
function And( regexpSentence, fnForDefinition ){
    addDefinitionFunction( "and", regexpSentence, fnForDefinition )
}

function Before( fnDefinition ){ stepsDefinition.before = fnDefinition }
function After( fnDefinition ){ stepsDefinition.after = fnDefinition }

function Fusion( featureFileToLoad ) {
    const jestCucumber  = require( 'jest-cucumber' )
    const feature       = jestCucumber.loadFeature( featureFileToLoad )

    jestCucumber.defineFeature( feature, testFn => {

        if( feature.scenarios.length > 0 )
            matchJestTestSuiteWithCucumberFeature( feature.scenarios, beforeEach, afterEach, testFn )

        if( feature.scenarioOutlines.length > 0 )
            matchJestTestSuiteWithCucumberOutline( feature.scenarioOutlines, beforeEach, afterEach, testFn )
    } )
}

function matchJestTestSuiteWithCucumberFeature( featureScenarios, beforeEachFn, afterEachFn, testFn ){
    featureScenarios.forEach( ( currentScenario )  => {
        beforeEachFn( stepsDefinition.before )

        matchJestTestWithCucumberScenario( currentScenario.title, currentScenario.steps, testFn )

        afterEachFn( stepsDefinition.after )
    } )
}

function matchJestTestSuiteWithCucumberOutline( featureOutlines, beforeEachFn, afterEachFn, testFn ){
    featureOutlines.forEach( ( currentOutline ) => {
        beforeEachFn( stepsDefinition.before )

        testFn( currentOutline.title, ( { given, when, then, and } ) => {
            currentOutline.steps.forEach( ( currentStep ) => {
                if( !stepsDefinition[ currentStep.keyword ] )
                    return

                matchJestDefinitionWithCucumberStep( { given, when, then, and }, currentStep.keyword, currentStep.stepText )
            } )
        } )
        afterEachFn( stepsDefinition.after )
    } )

}

function matchJestTestWithCucumberScenario( currentScenarioTitle, currentScenarioSteps, testFn ){
    testFn( currentScenarioTitle, ( { given, when, then, and } ) => {
        currentScenarioSteps.forEach( ( currentStep ) => {
            if( !stepsDefinition[ currentStep.keyword ] )
                return

            matchJestDefinitionWithCucumberStep( { given, when, then, and }, currentStep.keyword, currentStep.stepText )
        } )
    } )
}

function matchJestDefinitionWithCucumberStep( { given, when, then, and }, currentStepKeyWork, currentStepText ){
    const foundMatchingStep = findStep( currentStepKeyWork, currentStepText )
    if( !foundMatchingStep )
        return

    switch ( currentStepKeyWork ) {
        case "given":
            given( foundMatchingStep.stepExpression, foundMatchingStep.stepFn  )
            break

        case "when":
            when( foundMatchingStep.stepExpression, foundMatchingStep.stepFn  )
            break

        case "then":
            then( foundMatchingStep.stepExpression, foundMatchingStep.stepFn  )
            break

        case "and":
        default:
            and( foundMatchingStep.stepExpression, foundMatchingStep.stepFn  )
            break
    }
}

function findStep( scenarioType, scenarioSentence ) {
    if( !stepsDefinition[ scenarioType ] )
        return null

    const foundStep = Object.keys( stepsDefinition[ scenarioType ] ).find( ( currentSentence ) => {
        if( stepsDefinition[ scenarioType ][ currentSentence ].stepRegExp )
            return scenarioSentence.match( stepsDefinition[ scenarioType ][ currentSentence ].stepRegExp )

        if( stepsDefinition[ scenarioType ][ currentSentence ].stepExpression )
            return scenarioSentence === stepsDefinition[ scenarioType ][ currentSentence ].stepExpression

        return false
    } )
    if( !foundStep )
        return null

    const stepObject = stepsDefinition[ scenarioType ][ foundStep ]

    if( !stepObject.stepRegExp )
        return {
            stepExpression:     stepObject.stepExpression,
            stepFn:             stepObject.stepFn
        }

    const exprMatches = stepObject.stepRegExp.exec( scenarioSentence )
    exprMatches.shift()
    const dynamicMatchThatAreVariables = exprMatches.filter( ( currentMatch ) => {
        return foundStep.indexOf( currentMatch ) === -1
    } )

    return {
        stepExpression: stepObject.stepRegExp,
        stepFn:         () => ( stepObject.stepFn( ...dynamicMatchThatAreVariables ) )
    }
}

const path        = require( 'path' )

function walkthroughDirectory( directoryName, bRecursive, fnDoForEachFile ) {
    const filesystem  = require( 'fs' )
    let filenamesOrDirectorynames = filesystem.readdirSync( directoryName )

    filenamesOrDirectorynames.forEach( ( currentFilenameOrDirectoryname ) => {
        let currentFilepath = path.join( directoryName, currentFilenameOrDirectoryname )
        let currentFileStats = filesystem.statSync( currentFilepath )
        if( bRecursive && currentFileStats.isDirectory() )
            walkthroughDirectory( currentFilepath, activeLoadings, bRecursive, fnOnLoading )

        else
            fnDoForEachFile( currentFilepath )
    } )
}

function FusionAll( dirFeatureFiles, bRecursive ) {
    const dirFinalDirectory = ( !dirFeatureFiles ? '<rootDir>/test/feature' : dirFeatureFiles )

    walkthroughDirectory( dirFinalDirectory, bRecursive, Fusion )
}


// module.exports.steps = stepsDefinition
module.exports.Before       = Before
module.exports.After        = After
module.exports.Given        = Given
module.exports.When         = When
module.exports.Then         = Then
module.exports.And          = And
module.exports.Fusion       = Fusion
module.exports.FusionAll    = FusionAll
