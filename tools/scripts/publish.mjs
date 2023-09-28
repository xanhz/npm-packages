/**
 * This is a minimal script to publish your package to "npm".
 * This is meant to be used as-is or customize as you see fit.
 *
 * This script is executed on "dist/path/to/library" as "cwd" by default.
 *
 * You might need to authenticate with NPM before running this script.
 */

import { execSync } from 'child_process';
import fs from 'fs';

import devkit from '@nx/devkit';
const { readCachedProjectGraph } = devkit;

function invariant(condition, message) {
  if (!condition) {
    console.error(message);
    process.exit(1);
  }
}

// Executing publish script: node path/to/publish.mjs {name} --tag {tag}
// Default "tag" to "next" so we won't publish the "latest" tag by accident.
const [, , name, tag = 'next'] = process.argv;

const graph = readCachedProjectGraph();
const project = graph.nodes[name];
const outputPath = project.data?.targets?.build?.options?.outputPath;

// Check if project is existed
invariant(project, `Could not find project "${name}" in the workspace. Is the project.json configured correctly?`);

// Check where project is built
invariant(outputPath, `Could not find "build.options.outputPath" of project "${name}". Is project.json configured  correctly?`);

// Switch context to outputPath
process.chdir(outputPath);

// Check if package version is valid
try {
  const text = fs.readFileSync(`package.json`).toString();
  const json = JSON.parse(text);
  const version = json.version
  const validVersion = /^\d+\.\d+\.\d+(-\w+\.\d+)?/;
  invariant(version && validVersion.test(version), `Invalid version, expected: #.#.#-tag.# or #.#.#, got ${version}`);
} catch (error) {
  console.error(`Error reading package.json file from library build output`, error);
}

// Execute "npm publish" to publish
execSync(`npm publish --access public --tag ${tag}`);
