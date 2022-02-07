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
    console.log(`creating ${templateChoice}, type ${benchmarkType}`)
    try {
      // create the user specified folder
      fs.mkdirSync(targetPath);
      // copy and transfer all template files minus SKIP_FILES
      createDirectoryContents(templatePath, projectName, benchmarkRunnerOnly);
    } catch(err) {
      throw err;
    }
}).catch((err) => {
  console.error(err)
})

// list of file/folder that should not be copied
function createDirectoryContents(templatePath: string, projectName: string, benchmarkRunnerOnly: boolean) {
    const FILES_TO_SKIP = [...SKIP_FILES];
    // if benchmark type and only runner, add `results` to skip
    benchmarkRunnerOnly && FILES_TO_SKIP.push('results');

    // read all first-level files/folders from template folder
    const filesToCreate = fs.readdirSync(templatePath);
    filesToCreate.forEach(file => {
        const origFilePath = path.join(templatePath, file);
        
        // get stats about the current file
        const stats = fs.statSync(origFilePath);
    
        if (FILES_TO_SKIP.indexOf(file) > -1) return;
        
        if (stats.isFile()) {
            // read file content and transform it using template engine
            let contents = fs.readFileSync(origFilePath, 'utf8');
            if (file === '.npmignore') file = '.gitignore';
            // write file to destination folder
            const writePath = path.join(CURR_DIR, projectName, file);
            fs.writeFileSync(writePath, contents, 'utf8');  
        } else if (stats.isDirectory()) {
            // create folder in destination folder
            fs.mkdirSync(path.join(CURR_DIR, projectName, file));
            // copy files/folder inside current folder recursively
            createDirectoryContents(path.join(templatePath, file), path.join(projectName, file), benchmarkRunnerOnly);
        }
    });
}


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
