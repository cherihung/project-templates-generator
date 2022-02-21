import * as fs from 'fs'
import * as path from 'path'

/** create the options to be used in generating project options **/
export function generateCreateOpts(
  answers,
  parentDir
) {
  const DEST_DIR = parentDir
  const framework = answers.framework
  const projectName = answers.name
  const targetPath = path.join(DEST_DIR, projectName)
  const options = {
    framework,
    projectName,
    targetPath
  }
  return options
}
