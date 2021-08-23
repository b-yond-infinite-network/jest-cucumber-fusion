const stepsDefinition = {
  given: {},
  when: {},
  then: {},
  and: {},
  but: {},
  before: null,
  after: null,
};

const addDefinitionFunction = (
  definitionType,
  regexpSentence,
  fnForDefinition
) => {
  if (stepsDefinition[definitionType]) {
    if (regexpSentence.constructor === RegExp)
      stepsDefinition[definitionType][regexpSentence.source] = {
        stepRegExp: regexpSentence,
        stepExpression: null,
        stepFn: fnForDefinition,
      };
    else if (typeof regexpSentence === "string")
      stepsDefinition[definitionType][regexpSentence] = {
        stepRegExp: null,
        stepExpression: regexpSentence,
        stepFn: fnForDefinition,
      };
  }
};

const Given = (regexpSentenceOrChainedObject, fnForDefinition) => {
  return defineAndChain(
    "given",
    regexpSentenceOrChainedObject,
    fnForDefinition
  );
};
const When = (regexpSentenceOrChainedObject, fnForDefinition) => {
  return defineAndChain("when", regexpSentenceOrChainedObject, fnForDefinition);
};
const Then = (regexpSentenceOrChainedObject, fnForDefinition) => {
  return defineAndChain("then", regexpSentenceOrChainedObject, fnForDefinition);
};
const And = (regexpSentenceOrChainedObject, fnForDefinition) => {
  return defineAndChain("and", regexpSentenceOrChainedObject, fnForDefinition);
};

const But = (regexpSentenceOrChainedObject, fnForDefinition) => {
  return defineAndChain("but", regexpSentenceOrChainedObject, fnForDefinition);
};

const defineAndChain = (stepType, stepObjectOrSentence, fnForStep) => {
  if (
    !fnForStep &&
    stepObjectOrSentence instanceof Object &&
    Object.prototype.toString.call(stepObjectOrSentence) !==
      "[object RegExp]" &&
    stepObjectOrSentence.stepSentence
  ) {
    addDefinitionFunction(
      stepType,
      stepObjectOrSentence.stepSentence,
      stepObjectOrSentence.stepFnDefinition
    );

    return stepObjectOrSentence;
  }

  addDefinitionFunction(stepType, stepObjectOrSentence, fnForStep);

  return { stepSentence: stepObjectOrSentence, stepFnDefinition: fnForStep };
};

const Before = (fnDefinition) => {
  stepsDefinition.before = fnDefinition;
};
const After = (fnDefinition) => {
  stepsDefinition.after = fnDefinition;
};

const Fusion = (featureFileToLoad, optionsToPassToJestCucumber) => {
  const path = require("path");
  const callerSites = require("callsites");
  const callerSiteCaller = callerSites.default()[1].getFileName();
  const dirOfCaller = path.dirname(callerSiteCaller || "");
  const absoluteFeatureFilePath = path.resolve(dirOfCaller, featureFileToLoad);

  const jestCucumber = require("jest-cucumber");
  const feature = jestCucumber.loadFeature(
    absoluteFeatureFilePath,
    optionsToPassToJestCucumber
  );

  jestCucumber.defineFeature(feature, (testFn) => {
    if (feature.scenarios.length > 0)
      matchJestTestSuiteWithCucumberFeature(
        feature.scenarios,
        beforeEach,
        afterEach,
        testFn
      );

    if (feature.scenarioOutlines.length > 0)
      matchJestTestSuiteWithCucumberFeature(
        feature.scenarioOutlines,
        beforeEach,
        afterEach,
        testFn
      );
  });
};

const matchJestTestSuiteWithCucumberFeature = (
  featureScenariosOrOutline,
  beforeEachFn,
  afterEachFn,
  testFn
) => {
  featureScenariosOrOutline.forEach((currentScenarioOrOutline) => {
    if (stepsDefinition.before) beforeEachFn(stepsDefinition.before);

    matchJestTestWithCucumberScenario(
      currentScenarioOrOutline.title,

      // when scenario outline table contains examples then jest-cucumber.loadFeature
      //  calculates scenario parameters and place them into currentScenarioOrOutline.scenarios[0].steps
      // at the same time currentScenarioOrOutline.steps contains pure steps without
      //  example substutions for example if the scenario outline looks like:
      //   Scenario Outline: test scenario
      //     Given Step sentence
      //       | field     |
      //       | <example> |
      //   Examples:
      //     | example |
      //     | myValue |
      //  then currentScenarioOrOutline.steps will contain {field: '<example>'}
      //  and at the same time currentScenarioOrOutline.scenarios[0].steps will contain {field: 'myValue'}
      currentScenarioOrOutline.scenarios != null
        ? currentScenarioOrOutline.scenarios[0].steps
        : currentScenarioOrOutline.steps,
      testFn
    );

    if (stepsDefinition.after) afterEachFn(stepsDefinition.after);
  });
};

const matchJestTestWithCucumberScenario = (
  currentScenarioTitle,
  currentScenarioSteps,
  testFn
) => {
  testFn(currentScenarioTitle, ({ given, when, then, and, but }) => {
    currentScenarioSteps.forEach((currentStep) => {
      matchJestDefinitionWithCucumberStep(
        { given, when, then, and, but },
        currentStep
      );
    });
  });
};

const matchJestDefinitionWithCucumberStep = (verbFunction, currentStep) => {
  const foundMatchingStep = findMatchingStep(currentStep);
  if (!foundMatchingStep) return;

  // this will be the "given", "when", "then"...functions
  verbFunction[currentStep.keyword](
    foundMatchingStep.stepExpression,
    foundMatchingStep.stepFn
  );
};

const findMatchingStep = (currentStep) => {
  const scenarioType = currentStep.keyword;
  const scenarioSentence = currentStep.stepText;
  const foundStep = Object.keys(stepsDefinition[scenarioType]).find(
    (currentStepDefinitionFunction) => {
      return isFunctionForScenario(
        scenarioSentence,
        stepsDefinition[scenarioType][currentStepDefinitionFunction]
      );
    }
  );
  if (!foundStep) return null;

  return injectVariable(
    scenarioType,
    scenarioSentence,
    foundStep,
    currentStep.stepArgument
  );
};

const isFunctionForScenario = (scenarioSentence, stepDefinitionFunction) =>
  stepDefinitionFunction.stepRegExp
    ? scenarioSentence.match(stepDefinitionFunction.stepRegExp)
    : scenarioSentence === stepDefinitionFunction.stepExpression;

const injectVariable = (
  scenarioType,
  scenarioSentence,
  stepFunctionDefinition,
  stepArgs
) => {
  const stepObject = stepsDefinition[scenarioType][stepFunctionDefinition];

  if (!stepObject.stepRegExp)
    return {
      stepExpression: scenarioSentence,
      stepFn: stepObject.stepFn,
    };

  const exprMatches = stepObject.stepRegExp.exec(scenarioSentence);

  if (!exprMatches || /<.*>/.test(scenarioSentence))
    return {
      stepExpression: stepObject.stepRegExp,
      stepFn: stepObject.stepFn,
    };

  const dynamicMatchThatAreVariables = [];

  exprMatches.forEach((match, groupIndex) => {
    if (groupIndex > 0) dynamicMatchThatAreVariables.push(match);
  });

  if (Array.isArray(stepArgs) && stepArgs.length > 0) {
    dynamicMatchThatAreVariables.push(stepArgs);
  }

  return {
    stepExpression: stepObject.stepRegExp,
    stepFn: () => stepObject.stepFn(...dynamicMatchThatAreVariables),
  };
};

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

module.exports.Before = Before;
module.exports.After = After;
module.exports.Given = Given;
module.exports.When = When;
module.exports.Then = Then;
module.exports.And = And;
module.exports.But = But;
module.exports.Fusion = Fusion;
// module.exports.FusionAll    = FusionAll
