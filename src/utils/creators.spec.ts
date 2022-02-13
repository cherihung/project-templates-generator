import { answerOpts } from '../types'
import { generateCreateOpts, createAndCopyTemplates } from './creators'
import mock = require('mock-fs')
import fs = require('fs')

describe('cli function tests', () => {
    const mock_target_path = 'my-project'
    const opt1: answerOpts = {
        name: mock_target_path,
        template: 'projectA',
        proceed: true,
        benchmark_type: 'runner and viewer',
    }
    const opt2: answerOpts = {
        name: 'my-project-two',
        template: 'projectB',
        proceed: true,
        benchmark_type: 'runner only',
    }

    beforeAll(() => {
        mock({
            templates: {
                projectA: {
                    'projectA.md': 'hello',
                    subFolder: {
                        'document.md': 'hello document',
                    },
                    node_modules: {
                        some_module: {
                            'main.js': '1',
                        },
                    },
                },
                projectB: {
                    'test.md': 'test file',
                },
            },
            [mock_target_path]: {}, // pre-setup for ease of testing
        })
    })

    beforeEach(() => {
        jest.resetModules()
        jest.resetAllMocks()
    })

    afterAll(() => {
        mock.restore()
    })

    it('generateCreateOpts(): should generate options for create based on user choice', () => {
        const parentDir = process.cwd()

        expect(generateCreateOpts(opt1, parentDir)).toStrictEqual({
            projectName: opt1.name,
            templatePath: `${parentDir}/templates/${opt1.template}`,
            targetPath: `${parentDir}/${opt1.name}`,
            templateChoice: opt1.template,
            benchmarkType: 'full',
        })
        expect(generateCreateOpts(opt2, parentDir)).toStrictEqual({
            projectName: opt2.name,
            templatePath: `${parentDir}/templates/${opt2.template}`,
            targetPath: `${parentDir}/${opt2.name}`,
            templateChoice: opt2.template,
            benchmarkType: 'runner_only',
        })
    })

    it('should copy target template to destination', () => {
        const parentDir = process.cwd()
        const { templatePath, projectName, templateChoice, benchmarkType } =
            generateCreateOpts(opt1, parentDir)

        createAndCopyTemplates(
            {
                templatePath,
                projectName,
                templateChoice,
                benchmarkType,
            },
            { parentDir }
        )
        const result = fs.readdirSync(parentDir + '/' + projectName)
        // expect projectA copied over to newly created target directory
        // without node_modules
        expect(result).toEqual(['projectA.md', 'subFolder'])
    })
})
