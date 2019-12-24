const stepsDefinition = { given: {}, when: {}, then: {}, and: {}, but: {}, before: null, after: null  }

function addDefinitionFunction( definitionType, regexpSentence, fnForDefinition ){
    if( stepsDefinition[ definitionType ] ){
        if( regexpSentence.constructor === RegExp )
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

function But( regexpSentence, fnForDefinition ){
    addDefinitionFunction( "but", regexpSentence, fnForDefinition )
}

function Before( fnDefinition ){ stepsDefinition.before = fnDefinition }
function After( fnDefinition ){ stepsDefinition.after = fnDefinition }

function Fusion( featureFileToLoad, optionsToPassToJestCucumber ) {
    const path          = require( 'path' )
    const callerSites   = require("callsites" )
    const callerSiteCaller = callerSites.default()[ 1 ].getFileName()
    const dirOfCaller    = path.dirname(callerSiteCaller || '' )
    const absoluteFeatureFilePath = path.resolve( dirOfCaller, featureFileToLoad )

    const jestCucumber  = require( 'jest-cucumber' )
    const feature       = jestCucumber.loadFeature( absoluteFeatureFilePath, optionsToPassToJestCucumber )

    jestCucumber.defineFeature( feature, testFn => {

        if( feature.scenarios.length > 0 )
            matchJestTestSuiteWithCucumberFeature( feature.scenarios, beforeEach, afterEach, testFn )

        if( feature.scenarioOutlines.length > 0 )
            matchJestTestSuiteWithCucumberFeature( feature.scenarioOutlines, beforeEach, afterEach, testFn )
    } )
}

function matchJestTestSuiteWithCucumberFeature( featureScenariosOrOutline, beforeEachFn, afterEachFn, testFn ){
    featureScenariosOrOutline.forEach( ( currentScenarioOrOutline )  => {

        if( stepsDefinition.before )
            beforeEachFn( stepsDefinition.before )

        matchJestTestWithCucumberScenario( currentScenarioOrOutline.title, currentScenarioOrOutline.steps, testFn )
    
        if( stepsDefinition.after )
            afterEachFn( stepsDefinition.after )
    } )
}

function matchJestTestWithCucumberScenario( currentScenarioTitle, currentScenarioSteps, testFn ){
    testFn( currentScenarioTitle, ( { given, when, then, and, but } ) => {
        currentScenarioSteps.forEach( ( currentStep ) => {
            // if( !stepsDefinition[ currentStep.keyword ] )
            //     return

            matchJestDefinitionWithCucumberStep( { given, when, then, and, but }, currentStep.keyword, currentStep.stepText )
        } )
    } )
}

function matchJestDefinitionWithCucumberStep( { given, when, then, and, but }, currentStepKeyWork, currentStepText ){
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

        case "but":
            but( foundMatchingStep.stepExpression, foundMatchingStep.stepFn  )
            break

        case "and":
        default:
            and( foundMatchingStep.stepExpression, foundMatchingStep.stepFn  )
            break
    }
}

function findStep( scenarioType, scenarioSentence ) {
    // if( !stepsDefinition[ scenarioType ] )
    //     return null

    const foundStep = Object.keys( stepsDefinition[ scenarioType ] ).find( ( currentSentence ) => {
        if( stepsDefinition[ scenarioType ][ currentSentence ].stepRegExp ){
            if( /<.*>/.test( scenarioSentence ) ){
                const numGroupInStepDef = new RegExp( stepsDefinition[ scenarioType ][ currentSentence ].stepRegExp.source + '|' ).exec('').length - 1
                const numGroupInSentence = /(<[\w]*>)|/gm.exec( scenarioSentence ).length - 1
                //check that we have the same number of capture group than enclosed variables in the expression
                return numGroupInSentence === numGroupInStepDef
            }

            else
                return scenarioSentence.match( stepsDefinition[ scenarioType ][ currentSentence ].stepRegExp )

        }
        
        return scenarioSentence === stepsDefinition[ scenarioType ][ currentSentence ].stepExpression
    } )
    if( !foundStep )
        return null

    const stepObject = stepsDefinition[ scenarioType ][ foundStep ]
    
    if( !stepObject.stepRegExp )
        return {
            stepExpression:     scenarioSentence,
            stepFn:             stepObject.stepFn
        }
    
    const exprMatches = stepObject.stepRegExp.exec( scenarioSentence )
    
    if( !exprMatches ||
        /<.*>/.test( scenarioSentence ) )
        return {
            stepExpression:     stepObject.stepRegExp,
            stepFn:             stepObject.stepFn
        }
    
    exprMatches.shift()
    
    const dynamicMatchThatAreVariables = exprMatches.filter( ( currentMatch ) => {
        return foundStep.indexOf( currentMatch ) === -1
    } )

    return {
        stepExpression: stepObject.stepRegExp,
        stepFn:         () => ( stepObject.stepFn( ...dynamicMatchThatAreVariables ) )
    }
}

// const path        = require( 'path' )
//
// function walkthroughDirectory( directoryName, bRecursive, fnDoForEachFile ) {
//     const filesystem  = require( 'fs' )
//     let filenamesOrDirectorynames = filesystem.readdirSync( directoryName )
//
//     filenamesOrDirectorynames.forEach( ( currentFilenameOrDirectoryname ) => {
//         let currentFilepath = path.join( directoryName, currentFilenameOrDirectoryname )
//         let currentFileStats = filesystem.statSync( currentFilepath )
//         if( bRecursive && currentFileStats.isDirectory() )
//             walkthroughDirectory( currentFilepath, activeLoadings, bRecursive, fnOnLoading )
//
//         else
//             fnDoForEachFile( currentFilepath )
//     } )
// }

// function FusionAll( dirFeatureFiles, bRecursive ) {
//     const dirFinalDirectory = ( !dirFeatureFiles ? '<rootDir>/test/feature' : dirFeatureFiles )
//
//     walkthroughDirectory( dirFinalDirectory, bRecursive, Fusion )
// }


module.exports.Before       = Before
module.exports.After        = After
module.exports.Given        = Given
module.exports.When         = When
module.exports.Then         = Then
module.exports.And          = And
module.exports.But          = But
module.exports.Fusion       = Fusion
// module.exports.FusionAll    = FusionAll
