#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { answerOpts, createOpts } from './types';
import inquirer from 'inquirer';

const CHOICES = fs.readdirSync(path.join(__dirname, '..', 'templates'));
const CURR_DIR = process.cwd();
const BENCHMARK_CHOICES = ['runner only', 'runner and viewer'];
const SKIP_FILES = ['node_modules', 'dist'];

const QUESTIONS = [
{
    name: 'template',
    type: 'list',
    message: 'Which template would you like to generate?',
    choices: CHOICES
},
{
  name: 'benchmark_type',
  type: 'list',
  message: 'Which Benchmark type would you like to generate?',
  choices: BENCHMARK_CHOICES,
  when(answers) {
    return answers.template === 'benchmark'
  }
},
{
    name: 'name',
    type: 'input',
    message: 'Your Project name:',
    validate(input) {
      const targetPath = path.join(CURR_DIR, input);
      if(fs.existsSync(targetPath)) {
        return `Folder ${targetPath} already exists. Please use another name.`
      } else {
        return true;
      }
    }
},
{
  name: 'proceed',
  type: 'confirm', 
  message(answers) {
    const options = generateCreateOpts(answers);
    return `Proceed with these configurations? \n template choice: ${options.templateChoice} \n project path: ${options.targetPath}`
  },
  when(answers) {
    return answers.template && answers.name;
  },
}
];

inquirer.prompt(QUESTIONS)
  .then((answers: answerOpts) => {
    if(!answers.proceed) {
      console.log('ok, aborting....')
      process.exit(1);
    }
    const {targetPath, templatePath, projectName, templateChoice, benchmarkType} = generateCreateOpts(answers);
    const benchmarkRunnerOnly = templateChoice === 'benchmark' && benchmarkType === 'runner_only' ;
    console.log(`creating ${templateChoice}, type: ${benchmarkType}`)
    try {
      // create destination folder where the project will be copied to; then copy all files except the SKIP_FILES
      fs.mkdirSync(targetPath);
      createDirectoryContents(templatePath, projectName, benchmarkRunnerOnly);
    } catch(err) {
      throw err;
    }
}).catch((err) => {
  console.error(err)
})

function createDirectoryContents(templatePath: string, projectName: string, benchmarkRunnerOnly: boolean) {
    const FILES_TO_SKIP = [...SKIP_FILES];
    // if benchmark type and only runner, add `results` to skip
    benchmarkRunnerOnly && FILES_TO_SKIP.push('results');

    // read all first-level files/folders from template folder
    const filesToCreate = fs.readdirSync(templatePath);
    filesToCreate.forEach(file => {
        const origFilePath = path.join(templatePath, file);
        
        // get stats to determine if top level or sub directory
        const stats = fs.statSync(origFilePath);
    
        if (FILES_TO_SKIP.indexOf(file) > -1) return;
        
        if (stats.isFile()) {
            // TODO: add option to use template engine in the future to transform any template files
            let contents = fs.readFileSync(origFilePath, 'utf8');
            // write file to destination folder
            const writePath = path.join(CURR_DIR, projectName, file);
            fs.writeFileSync(writePath, contents, 'utf8');  
        } else if (stats.isDirectory()) {
            // create folder in destination folder; then copy files/folders recursively
            fs.mkdirSync(path.join(CURR_DIR, projectName, file));
            createDirectoryContents(path.join(templatePath, file), path.join(projectName, file), benchmarkRunnerOnly);
        }
    });
}

/** create the options to be used in generating the template project **/
function generateCreateOpts(answers: answerOpts): createOpts {
  const templateChoice = answers.template;
  const projectName = answers.name;
  const benchmarkType = answers.benchmark_type === 'runner and viewer' ? 'full' : 'runner_only'

  const templatePath = path.join(__dirname, 'templates', templateChoice);
  const targetPath = path.join(CURR_DIR, projectName);
  const options: createOpts = {
    projectName,
    templatePath,
    targetPath,
    templateChoice,
    benchmarkType
  }
  return options;
}
