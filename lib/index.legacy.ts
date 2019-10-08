// Polyfills for IE9, IE10 & IE11

import 'es6-symbol/implement';
import 'es6-promise/auto';
import 'core-js/es/symbol';
import 'core-js/es/object';
import 'core-js/es/function';
import 'core-js/es/number';
import 'core-js/es/string';
import 'core-js/es/date';
import 'core-js/es/array';
import 'core-js/es/map';
import 'core-js/es/set';

// Public API
export * from './client';
export * from './sdk-info.generated';
export * from './config';
export * from './data-contracts';
export * from './elements';
export * from './parser';
export * from './resolvers';
export * from './services';
export * from './mappers';
export * from './query';
export * from './models';
export * from './images';

