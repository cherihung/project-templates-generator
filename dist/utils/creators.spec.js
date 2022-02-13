"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const creators_1 = require("./creators");
const mock = require('mock-fs');
describe('cli function tests', () => {
    beforeAll(() => {
        mock({
            'parentDir': {
                'templates': {
                    'projectA': {
                        'index.md': 'hello',
                    },
                    'projectB': {
                        'test.md': 'hello',
                    }
                },
            }
        });
    });
    beforeEach(() => {
        jest.resetModules();
        jest.resetAllMocks();
    });
    afterAll(() => {
        mock.restore();
    });
    it('generateCreateOpts(): should generate options for create based on user choice', () => {
        const results = (0, creators_1.generateCreateOpts)({
            name: 'my-project',
            template: 'projectA',
            proceed: true,
            benchmark_type: 'runner and viewer'
        }, 'parentDir');
        console.log(results);
    });
});
