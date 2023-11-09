/* eslint-disable indent */
/* eslint-disable unicorn/consistent-destructuring */
/* eslint-disable unicorn/no-null */

import * as core from '@actions/core';
import { exec } from '@actions/exec';
import * as github from '@actions/github';

import { execSurgeCommand } from '../helpers';

let failOnErrorGlobal = false;
let fail: (err: Error) => void;

export const deployBranch = async ({ surgeToken, dist, failOnError }: any) => {
  failOnErrorGlobal = failOnError;
  core.debug(`failOnErrorGlobal: ${typeof failOnErrorGlobal} + ${failOnErrorGlobal.toString()}`);

  core.debug('github.context');
  core.debug(JSON.stringify(github.context, null, 2));

  // @ts-ignore
  const repoOwner = github.context.repo.owner.replaceAll('.', '-');
  // @ts-ignore
  const repoName = github.context.repo.repo.replaceAll('.', '-');

  const currentBranch = github.context.ref.replace('refs/heads/', '');

  const url = `${repoOwner}-${repoName}-${currentBranch}.surge.sh`;

  core.setOutput('preview_url', url);

  const startTime = Date.now();
  try {
    if (core.getInput('build')) {
      const buildCommands = core.getInput('build').split('\n');
      for (const command of buildCommands) {
        core.info(`RUN: ${command}`);
        await exec(command);
      }
    } else {
      await exec('npm install');
      await exec('npm run build');
    }

    await exec('cp', [`${dist}/index.html`, `${dist}/200.html`]);

    const duration = (Date.now() - startTime) / 1000;
    core.info(`Build time: ${duration} seconds`);
    core.info(`Deploy to ${url}`);
    core.setSecret(surgeToken);

    await execSurgeCommand({
      command: ['surge', `./${dist}`, '--token', surgeToken, '--cleanup'],
    });

    await execSurgeCommand({
      command: ['surge', `./${dist}`, url, '--token', surgeToken],
    });
  } catch (error: any) {
    fail?.(error);
  }
};
