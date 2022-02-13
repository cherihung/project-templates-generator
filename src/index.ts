#!/usr/bin/env node

import * as fs from 'fs'
import * as path from 'path'
import colors from 'colors'
import { createAndCopyTemplates, generateCreateOpts } from './utils/creators'
import { answerOpts } from './types'
import inquirer from 'inquirer'

const DEST_DIR = process.cwd() // where user invokes the CLI
const BENCHMARK_CHOICES = ['runner only', 'runner and viewer']

const CHOICES = fs.readdirSync(path.join(__dirname, '..', 'templates'))
const QUESTIONS = [
    {
        name: 'template',
        type: 'list',
        message: 'Which template would you like to generate?',
        choices: CHOICES,
    },
    {
        name: 'benchmark_type',
        type: 'list',
        message: 'Which Benchmark type would you like to generate?',
        choices: BENCHMARK_CHOICES,
        when(answers) {
            return answers.template === 'benchmark'
        },
    },
    {
        name: 'name',
        type: 'input',
        message: 'Your Project name:',
        validate(input) {
            const targetPath = path.join(DEST_DIR, input)
            if (fs.existsSync(targetPath)) {
                return `Folder ${targetPath} already exists. Please use another name.`
            } else {
                return true
            }
        },
    },
    {
        name: 'proceed',
        type: 'confirm',
        message(answers) {
            const options = generateCreateOpts(answers, DEST_DIR)
            return `Proceed with these configurations? \n template choice: ${options.templateChoice} \n project path: ${options.targetPath}`
        },
        when(answers) {
            return answers.template && answers.name
        },
    },
]

inquirer
    .prompt(QUESTIONS)
    .then((answers: answerOpts) => {
        if (!answers.proceed) {
            console.log('ok, aborting....')
            process.exit(1)
        }
        const {
            targetPath,
            templatePath,
            projectName,
            templateChoice,
            benchmarkType,
        } = generateCreateOpts(answers, DEST_DIR)
        console.log(
            colors.cyan(`created ${templateChoice}, type: ${benchmarkType}`)
        )
        // create destination folder where the project will be copied to; then copy all files except the SKIP_FILES
        fs.mkdirSync(targetPath)
        createAndCopyTemplates(
            { templatePath, projectName, templateChoice, benchmarkType },
            { parentDir: DEST_DIR }
        )
    })
    .catch((err) => {
        console.error(err)
    })
