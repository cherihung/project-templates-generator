#!/usr/bin/env node

import * as fs from 'fs'
import * as path from 'path'
import colors from 'colors'
import { generateCreateOpts } from './utils/index.js'
import inquirer from 'inquirer'

const DEST_DIR = process.cwd() // where user invokes the CLI
const CHOICES = ['react', 'vue', 'angular'];
const QUESTIONS = [
  {
    name: 'framework',
    type: 'list',
    message: 'Which FE framework would you like to generate?',
    choices: CHOICES,
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
      return `Proceed with these configurations? \n options: ${JSON.stringify(options)}`
    },
    when(answers) {
      return answers.framework && answers.name
    },
  },
]

export function main() {
  inquirer
    .prompt(QUESTIONS)
    .then((answers) => {
      // example of aborting the CLI based on answers
      if (!answers.proceed) {
        console.log('ok, aborting....')
        process.exit(1)
      }
      // your custom actions taken place here
      // example of generating options to act upon
      const options = generateCreateOpts(answers, DEST_DIR)
      console.log(colors.cyan(options))
    })
    .catch((err) => {
      console.error(err)
    })
}

// execute program
main();
