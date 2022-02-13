#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const colors_1 = __importDefault(require("colors"));
const inquirer_1 = __importDefault(require("inquirer"));
const CHOICES = fs.readdirSync(path.join(__dirname, '..', 'templates'));
const DEST_DIR = process.cwd(); // where use invokes the CLI
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
            return answers.template === 'benchmark';
        }
    },
    {
        name: 'name',
        type: 'input',
        message: 'Your Project name:',
        validate(input) {
            const targetPath = path.join(DEST_DIR, input);
            if (fs.existsSync(targetPath)) {
                return `Folder ${targetPath} already exists. Please use another name.`;
            }
            else {
                return true;
            }
        }
    },
    {
        name: 'proceed',
        type: 'confirm',
        message(answers) {
            const options = generateCreateOpts(answers);
            return `Proceed with these configurations? \n template choice: ${options.templateChoice} \n project path: ${options.targetPath}`;
        },
        when(answers) {
            return answers.template && answers.name;
        },
    }
];
function createAndCopyTemplates(templatePath, projectName, benchmarkRunnerOnly) {
    const FILES_TO_SKIP = [...SKIP_FILES];
    // if benchmark type and only runner, add `results` to skip
    benchmarkRunnerOnly && FILES_TO_SKIP.push('results');
    // read all first-level files/folders from template folder
    const filesToCreate = fs.readdirSync(templatePath);
    filesToCreate.forEach(file => {
        const origFilePath = path.join(templatePath, file);
        // determine if top level or sub directory
        const stats = fs.statSync(origFilePath);
        if (FILES_TO_SKIP.indexOf(file) > -1)
            return;
        if (stats.isFile()) {
            // TODO: add option to use template engine in the future to transform any template files
            let contents = fs.readFileSync(origFilePath, 'utf8');
            // write file to destination folder
            const writePath = path.join(DEST_DIR, projectName, file);
            fs.writeFileSync(writePath, contents, 'utf8');
        }
        else if (stats.isDirectory()) {
            // create folder in destination folder; then copy files/folders recursively
            fs.mkdirSync(path.join(DEST_DIR, projectName, file));
            createAndCopyTemplates(path.join(templatePath, file), path.join(projectName, file), benchmarkRunnerOnly);
        }
    });
}
/** create the options to be used in generating the template project **/
function generateCreateOpts(answers) {
    const templateChoice = answers.template;
    const projectName = answers.name;
    const benchmarkType = answers.benchmark_type === 'runner and viewer' ? 'full' : 'runner_only';
    const templatePath = path.join(__dirname, 'templates', templateChoice);
    const targetPath = path.join(DEST_DIR, projectName);
    const options = {
        projectName,
        templatePath,
        targetPath,
        templateChoice,
        benchmarkType
    };
    return options;
}
function main() {
    console.log(inquirer_1.default);
    inquirer_1.default.prompt(QUESTIONS)
        .then((answers) => {
        if (!answers.proceed) {
            console.log('ok, aborting....');
            process.exit(1);
        }
        const { targetPath, templatePath, projectName, templateChoice, benchmarkType } = generateCreateOpts(answers);
        const benchmarkRunnerOnly = templateChoice === 'benchmark' && benchmarkType === 'runner_only';
        console.log(colors_1.default.cyan(`created ${templateChoice}, type: ${benchmarkType}`));
        try {
            // create destination folder where the project will be copied to; then copy all files except the SKIP_FILES
            fs.mkdirSync(targetPath);
            createAndCopyTemplates(templatePath, projectName, benchmarkRunnerOnly);
        }
        catch (err) {
            throw err;
        }
    }).catch((err) => {
        console.error(err);
    });
}
exports.default = main;
main();
