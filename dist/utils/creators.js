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
exports.generateCreateOpts = exports.createAndCopyTemplates = void 0;
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const SKIP_FILES = ['node_modules', 'dist'];
function createAndCopyTemplates(templatePath, projectName, benchmarkRunnerOnly, parentDir) {
    const DEST_DIR = parentDir;
    const FILES_TO_SKIP = [...SKIP_FILES];
    // if benchmark type and only runner, add `results` to skip
    benchmarkRunnerOnly && FILES_TO_SKIP.push('results');
    // read all first-level files/folders from template folder
    const filesToCreate = fs.readdirSync(templatePath);
    filesToCreate.forEach(file => {
        const origFilePath = path_1.default.join(templatePath, file);
        // determine if top level or sub directory
        const stats = fs.statSync(origFilePath);
        if (FILES_TO_SKIP.indexOf(file) > -1)
            return;
        if (stats.isFile()) {
            // TODO: add option to use template engine in the future to transform any template files
            let contents = fs.readFileSync(origFilePath, 'utf8');
            // write file to destination folder
            const writePath = path_1.default.join(DEST_DIR, projectName, file);
            fs.writeFileSync(writePath, contents, 'utf8');
        }
        else if (stats.isDirectory()) {
            // create folder in destination folder; then copy files/folders recursively
            fs.mkdirSync(path_1.default.join(DEST_DIR, projectName, file));
            createAndCopyTemplates(path_1.default.join(templatePath, file), path_1.default.join(projectName, file), benchmarkRunnerOnly, DEST_DIR);
        }
    });
}
exports.createAndCopyTemplates = createAndCopyTemplates;
/** create the options to be used in generating the template project **/
function generateCreateOpts(answers, parentDir) {
    const DEST_DIR = parentDir;
    const templateChoice = answers.template;
    const projectName = answers.name;
    const benchmarkType = answers.benchmark_type === 'runner and viewer' ? 'full' : 'runner_only';
    const templatePath = path_1.default.join(DEST_DIR, 'templates', templateChoice);
    const targetPath = path_1.default.join(DEST_DIR, projectName);
    const options = {
        projectName,
        templatePath,
        targetPath,
        templateChoice,
        benchmarkType
    };
    return options;
}
exports.generateCreateOpts = generateCreateOpts;
