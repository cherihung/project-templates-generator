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
const creators_1 = require("./utils/creators");
const inquirer_1 = __importDefault(require("inquirer"));
const DEST_DIR = process.cwd(); // where user invokes the CLI
const BENCHMARK_CHOICES = ['runner only', 'runner and viewer'];
const CHOICES = fs.readdirSync(path.join(__dirname, '..', 'templates'));
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
            return answers.template === 'benchmark';
        },
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
        },
    },
    {
        name: 'proceed',
        type: 'confirm',
        message(answers) {
            const options = (0, creators_1.generateCreateOpts)(answers, DEST_DIR);
            return `Proceed with these configurations? \n template choice: ${options.templateChoice} \n project path: ${options.targetPath}`;
        },
        when(answers) {
            return answers.template && answers.name;
        },
    },
];
inquirer_1.default
    .prompt(QUESTIONS)
    .then((answers) => {
    if (!answers.proceed) {
        console.log('ok, aborting....');
        process.exit(1);
    }
    const { targetPath, templatePath, projectName, templateChoice, benchmarkType, } = (0, creators_1.generateCreateOpts)(answers, DEST_DIR);
    console.log(colors_1.default.cyan(`created ${templateChoice}, type: ${benchmarkType}`));
    // create destination folder where the project will be copied to; then copy all files except the SKIP_FILES
    fs.mkdirSync(targetPath);
    (0, creators_1.createAndCopyTemplates)({ templatePath, projectName, templateChoice, benchmarkType }, { parentDir: DEST_DIR });
})
    .catch((err) => {
    console.error(err);
});
