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

function Given( regexpSentenceOrChainedObject, fnForDefinition ){
    return defineAndChain( "given", regexpSentenceOrChainedObject, fnForDefinition )
}
function When( regexpSentenceOrChainedObject, fnForDefinition ){
    return defineAndChain( "when", regexpSentenceOrChainedObject, fnForDefinition )
}
function Then( regexpSentenceOrChainedObject, fnForDefinition ){
    return defineAndChain( "then", regexpSentenceOrChainedObject, fnForDefinition )
}
function And( regexpSentenceOrChainedObject, fnForDefinition ){
    return defineAndChain( "and", regexpSentenceOrChainedObject, fnForDefinition )
}

function But( regexpSentenceOrChainedObject, fnForDefinition ){
    return defineAndChain( "but", regexpSentenceOrChainedObject, fnForDefinition )
}

function defineAndChain( stepType, stepObjectOrSentence, fnForStep ){
    if( !fnForStep
        && stepObjectOrSentence instanceof Object
        && Object.prototype.toString.call( stepObjectOrSentence ) !== '[object RegExp]'
        && stepObjectOrSentence.stepSentence ){
        addDefinitionFunction( stepType,
                               stepObjectOrSentence.stepSentence,
                               stepObjectOrSentence.stepFnDefinition )
        
        return stepObjectOrSentence
    }
    
    addDefinitionFunction( stepType, stepObjectOrSentence, fnForStep )
    
    return {    stepSentence: stepObjectOrSentence,
                stepFnDefinition: fnForStep }
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
            matchJestTestSuiteWithCucumberFeature( feature.scenarioOutlines, beforeEach, afterEach, testFn, true )
    } )
}

function matchJestTestSuiteWithCucumberFeature( featureScenariosOrOutline, beforeEachFn, afterEachFn, testFn, isOutline ){
    featureScenariosOrOutline.forEach( ( currentScenarioOrOutline )  => {

        if( stepsDefinition.before )
            beforeEachFn( stepsDefinition.before )

        matchJestTestWithCucumberScenario( currentScenarioOrOutline.title, currentScenarioOrOutline.steps, testFn, isOutline )
    
        if( stepsDefinition.after )
            afterEachFn( stepsDefinition.after )
    } )
}

function matchJestTestWithCucumberScenario( currentScenarioTitle, currentScenarioSteps, testFn, isOutline ){
    testFn( currentScenarioTitle, ( { given, when, then, and, but } ) => {
        currentScenarioSteps.forEach( ( currentStep ) => {
            // if( !stepsDefinition[ currentStep.keyword ] )
            //     return

            matchJestDefinitionWithCucumberStep( { given, when, then, and, but }, currentStep.keyword, currentStep.stepText, isOutline )
        } )
    } )
}

function matchJestDefinitionWithCucumberStep( { given, when, then, and, but }, currentStepKeyWork, currentStepText, isOutline ){
    const foundMatchingStep = findStep( currentStepKeyWork, currentStepText, isOutline )
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

function findStep( scenarioType, scenarioSentence, isOutline ) {
    // if( !stepsDefinition[ scenarioType ] )
    //     return null

    const foundStep = Object.keys( stepsDefinition[ scenarioType ] ).find( ( currentSentence ) => {
        if( stepsDefinition[ scenarioType ][ currentSentence ].stepRegExp ){
            if( isOutline && /<[\w]*>/.test( scenarioSentence ) ){
                const cleanedSentence = scenarioSentence.replace( /<[\w]*>/gi, '' )
                const cleanedRegexp = stepsDefinition[ scenarioType ][ currentSentence ].stepRegExp.source
                                                                                        .replace( /^\^/, '' )
                                                                                        .replace( /\\\(/g, '(' )
                                                                                        .replace( /\\\)/g, ')')
                                                                                        .replace( /\\\^/g, '^')
                                                                                        .replace( /\\\$/g, '$')
                                                                                        .replace( /\$$/, '' )
                                                                                        .replace( /\([.\\]+[sSdDwWbB*][*?+]?\)/g, '')
                                                                                        .replace( /\(\[.*\](?:[+?*]{1}|\{\d\})\)/g, '' )
                
                // const groupInStepDef = new RegExp( stepsDefinition[ scenarioType ][ currentSentence ].stepRegExp.source + '|' ).exec('')
                // const numGroupInStepDef = groupInStepDef.length - 1
                // const groupInSentence = /(<[\w]*>)|/gm.exec( scenarioSentence )
                // const numGroupInSentence = /(<[\w]*>)|/gm.exec( scenarioSentence ).length - 1
                //check that we have the same number of capture group than enclosed variables in the expression
                return cleanedRegexp === cleanedSentence
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
