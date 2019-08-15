#!/usr/bin/env node
const yargs = require('yargs');

import { generatorConfig } from './config';
import { Generator } from './generator';
import { utilities } from './utilities';

const argv = yargs['argv'];

// user config
const projectId = argv.projectId;
const moduleResolution = argv.moduleResolution;
const codeType = argv.codeType;
const secureAccessKey = argv.secureAccessKey;
const strictPropertyInitalization = argv.strictPropertyInitalization;

if (!moduleResolution) {
  throw Error(`Please specify 'moduleResolution' argument. Available options are: ${generatorConfig.moduleOptions.join(',')}`);
}

if (!codeType) {
  throw Error(`Please specify 'codeType' argument. Available options are: ${generatorConfig.codeOptions.join(',')}`);
}

if (!projectId) {
  throw Error(`Please provide project id using 'projectId' argument`);
}

// init & start generator
const generator = new Generator({
  projectId: projectId,
  type: moduleResolution,
  codeType: utilities.getCodeType(codeType),
  moduleResolution: utilities.getModuleResolution(moduleResolution),
  secureAccessKey: secureAccessKey,
  strictPropertyInitalization: strictPropertyInitalization === 'true' ? true : false
});

generator.startModelGenerator();

