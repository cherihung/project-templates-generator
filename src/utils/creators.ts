import * as fs from 'fs'
import * as path from 'path'
import { answerOpts, createOpts } from '../types'

const SKIP_FILES = ['node_modules', 'dist']

type templateConfigs = Omit<createOpts, 'targetPath'>
type templateOpts = { parentDir: string }
export function createAndCopyTemplates(
    {
        templateChoice,
        templatePath,
        projectName,
        benchmarkType,
    }: templateConfigs,
    { parentDir }: templateOpts
) {
    const benchmarkRunnerOnly =
        templateChoice === 'benchmark' && benchmarkType === 'runner_only'
    const DEST_DIR = parentDir
    const FILES_TO_SKIP = [...SKIP_FILES]
    // if benchmark type and only runner, add `results` to skip
    benchmarkRunnerOnly && FILES_TO_SKIP.push('results')

    // read all first-level files/folders from template folder
    const filesToCreate = fs.readdirSync(templatePath)
    filesToCreate.forEach((file) => {
        const origFilePath = path.join(templatePath, file)

        // determine if top level or sub directory
        const stats = fs.statSync(origFilePath)

        if (FILES_TO_SKIP.indexOf(file) > -1) return

        if (stats.isFile()) {
            // TODO: add option to use template engine in the future to transform any template files
            const contents = fs.readFileSync(origFilePath, 'utf8')
            // write file to destination folder
            const writePath = path.join(DEST_DIR, projectName, file)
            fs.writeFileSync(writePath, contents, 'utf8')
        } else if (stats.isDirectory()) {
            // create folder in destination folder; then copy files/folders recursively
            fs.mkdirSync(path.join(DEST_DIR, projectName, file))
            createAndCopyTemplates(
                {
                    templatePath: path.join(templatePath, file),
                    projectName: path.join(projectName, file),
                    templateChoice,
                    benchmarkType,
                },
                { parentDir: DEST_DIR }
            )
        }
    })
}

/** create the options to be used in generating the template project **/
export function generateCreateOpts(
    answers: answerOpts,
    parentDir: string
): createOpts {
    const DEST_DIR = parentDir
    const templateChoice = answers.template
    const projectName = answers.name
    const benchmarkType =
        answers.benchmark_type === 'runner and viewer' ? 'full' : 'runner_only'

    const templatePath = path.join(DEST_DIR, 'templates', templateChoice)
    const targetPath = path.join(DEST_DIR, projectName)
    const options: createOpts = {
        projectName,
        templatePath,
        targetPath,
        templateChoice,
        benchmarkType,
    }
    return options
}
