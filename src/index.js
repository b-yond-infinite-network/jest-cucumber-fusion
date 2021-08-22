const stepsDefinition = { given: {}, when: {}, then: {}, and: {}, but: {}, before: null, after: null  }

const addDefinitionFunction = ( definitionType, regexpSentence, fnForDefinition ) => {
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

const Given = ( regexpSentenceOrChainedObject, fnForDefinition ) => {
    return defineAndChain( "given", regexpSentenceOrChainedObject, fnForDefinition )
}
const When = ( regexpSentenceOrChainedObject, fnForDefinition ) => {
    return defineAndChain( "when", regexpSentenceOrChainedObject, fnForDefinition )
}
const Then = ( regexpSentenceOrChainedObject, fnForDefinition ) => {
    return defineAndChain( "then", regexpSentenceOrChainedObject, fnForDefinition )
}
const And = ( regexpSentenceOrChainedObject, fnForDefinition ) => {
    return defineAndChain( "and", regexpSentenceOrChainedObject, fnForDefinition )
}

const But = ( regexpSentenceOrChainedObject, fnForDefinition ) => {
    return defineAndChain( "but", regexpSentenceOrChainedObject, fnForDefinition )
}

const defineAndChain = ( stepType, stepObjectOrSentence, fnForStep ) =>{
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

const Before = ( fnDefinition ) => { stepsDefinition.before = fnDefinition }
const After = ( fnDefinition ) => { stepsDefinition.after = fnDefinition }

const Fusion = ( featureFileToLoad, optionsToPassToJestCucumber ) => {
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

const matchJestTestSuiteWithCucumberFeature = ( featureScenariosOrOutline, beforeEachFn, afterEachFn, testFn, isOutline ) => {
    featureScenariosOrOutline.forEach( ( currentScenarioOrOutline )  => {

        if( stepsDefinition.before )
            beforeEachFn( stepsDefinition.before )

        matchJestTestWithCucumberScenario( currentScenarioOrOutline.title, currentScenarioOrOutline.steps, testFn, isOutline )
    
        if( stepsDefinition.after )
            afterEachFn( stepsDefinition.after )
    } )
}

const matchJestTestWithCucumberScenario = ( currentScenarioTitle, currentScenarioSteps, testFn, isOutline ) => {
    testFn( currentScenarioTitle, ( { given, when, then, and, but } ) => {
        currentScenarioSteps.forEach( ( currentStep ) => {

            matchJestDefinitionWithCucumberStep( { given, when, then, and, but }, currentStep, isOutline )

        } )
    } )
}

const matchJestDefinitionWithCucumberStep = ( verbFunction, currentStep, isOutline ) => {
    const foundMatchingStep = findMatchingStep( currentStep, isOutline )
    if( !foundMatchingStep ) return
    
    // this will be the "given", "when", "then"...functions
    verbFunction[ currentStep.keyword ] ( foundMatchingStep.stepExpression, foundMatchingStep.stepFn )
}

const findMatchingStep = ( currentStep, isOutline ) => {
    const scenarioType = currentStep.keyword
    const scenarioSentence = currentStep.stepText
    const foundStep = Object.keys( stepsDefinition[ scenarioType ] )
                            .find( ( currentStepDefinitionFunction ) => {
                                return isFunctionForScenario( scenarioSentence,
                                                              stepsDefinition[ scenarioType ][ currentStepDefinitionFunction ],
                                                              isOutline )
                            } )
    if( !foundStep ) return null

    return injectVariable( scenarioType, scenarioSentence, foundStep, currentStep.stepArgument )
}

const isFunctionForScenario = ( scenarioSentence, stepDefinitionFunction, isOutline ) => {
    if( stepDefinitionFunction.stepRegExp ){
        if( isOutline && /<[\w]*>/.test( scenarioSentence ) ){
            return isPotentialStepFunctionForScenario( scenarioSentence, stepDefinitionFunction.stepRegExp )
        }
        
        else return scenarioSentence.match( stepDefinitionFunction.stepRegExp )
    }
    
    return scenarioSentence === stepDefinitionFunction.stepExpression
}

const isPotentialStepFunctionForScenario = ( scenarioDefinition, regStepFunc ) => {
    //so this one is tricky, to ensure we only find the
    // step definition corresponding to actual steps function in the case of outlined gherkin
    // we have to "disable" the outlining (since it can replace regular expression
    // and then ensure that all "non-outlined" part do respect the regular expression of
    // of the step function
    // FIRST, we clean the string version of the step definition that has outline variable
    const cleanedStepFunc   = regStepFunc.source
                                         .replace( /^\^/, '' )
                                         // .replace( /\\\(/g, '(' )
                                         // .replace( /\\\)/g, ')')
                                         // .replace( /\\\^/g, '^')
                                         // .replace( /\\\$/g, '$')
                                         .replace( /\$$/, '' )
                                         // .replace( /\([.\\]+[sSdDwWbB*][*?+]?\)|\(\[.*\](?:[+?*]{1}|\{\d\})\)/g, '' )
    
    let currentScenarioPart
    let currentStepFuncLeft     = cleanedStepFunc
    let currentScenarioDefLeft  = scenarioDefinition
    
    //we step through each of the scenario outline variables
    // from there, we will try to detect any regexp present in the
    // step definition, so that we can ensure to find the right match
    while( ( currentScenarioPart = /<[\w]*>/gi.exec( currentScenarioDefLeft ) ) != null ){
        
        let fixedPart           = currentScenarioPart.input.substring( 0, currentScenarioPart.index )
        let idxCutScenarioPart  = currentScenarioPart.index + currentScenarioPart[ 0 ].length
    
        const regEscapedStepFunc = /\([a-zA-Z0!|,:?*+.^=${}><\\\-]+\)/g.exec( currentStepFuncLeft.replace( /\\\(/g, '(' )
                                                                                                 .replace( /\\\)/g, ')')
                                                                                                 .replace( /\\\^/g, '^')
                                                                                                 .replace( /\\\$/g, '$') )
        const regStepFuncLeft   = /\([a-zA-Z0!|,:?*+.^=${}><\\\-]+\)/g.exec( currentStepFuncLeft )
        
        if( regStepFuncLeft && regEscapedStepFunc.index == currentScenarioPart.index ){
            //if we have a regex inside our step function definition
            // and that regex is at the same position than our Outlined variable
            // we just need to check that the sentence match,
            // so we can "evaluate" the step function and remove the regex in it
            currentStepFuncLeft = regEscapedStepFunc.input.substring( 0, regEscapedStepFunc.index )
                                  + currentStepFuncLeft.substring( regStepFuncLeft.index + regStepFuncLeft[ 0 ].length )
            
        }
        else if( regStepFuncLeft && regStepFuncLeft.index < currentScenarioPart.index ){
            //if we have a regex inside our step function definition
            // but that regex is not at the same position than our outlined variable
            // we need to evaluate the regex against the scenario part
            const strRegexToEvaluate = regStepFuncLeft.input.substring( 0, regStepFuncLeft.index + regStepFuncLeft[ 0 ].length )
            const regexToEvaluate = new RegExp( strRegexToEvaluate )
            const regIntermediatePart   = regexToEvaluate.exec( currentScenarioPart.input )
            if( regIntermediatePart ){
                fixedPart           = regStepFuncLeft.input.substring( 0, regStepFuncLeft.index + regStepFuncLeft[ 0 ].length )
                idxCutScenarioPart  = regIntermediatePart[ 0 ].length
            }
        }
    
        const partIndex = currentStepFuncLeft.indexOf( fixedPart )
        if( partIndex !== -1 ){
            currentStepFuncLeft     = currentStepFuncLeft.substring( partIndex + fixedPart.length )
            currentScenarioDefLeft  = currentScenarioDefLeft.substring( idxCutScenarioPart )
        }
        else {
            return false
        }
    }
    
    return ( currentScenarioDefLeft === '' && currentStepFuncLeft === '' )
           || evaluateStepFuncEndVsScenarioEnd( currentStepFuncLeft, currentScenarioDefLeft )
}

const evaluateStepFuncEndVsScenarioEnd = ( stepFunctionDef, scenarioDefinition ) => {
    if( /\(.*(\?\:)?[.\\]*[sSdDwWbB*][*?+]?.*\)|\(\[.*\](?:[+?*]{1}|\{\d\})\)/g.test( stepFunctionDef ) ){
        return new RegExp( stepFunctionDef ).test( scenarioDefinition )
    }
    
    return stepFunctionDef.endsWith( scenarioDefinition )
}

const injectVariable = ( scenarioType, scenarioSentence, stepFunctionDefinition , stepArgs) => {

    const stepObject = stepsDefinition[ scenarioType ][ stepFunctionDefinition ]
    
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

    const dynamicMatchThatAreVariables = []

    exprMatches.forEach((match, groupIndex) => {
        if(groupIndex > 0)
            dynamicMatchThatAreVariables.push(match)
    });

    if(Array.isArray(stepArgs) && stepArgs.length > 0){
        dynamicMatchThatAreVariables.push(stepArgs)
    }

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
