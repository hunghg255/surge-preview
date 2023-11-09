import * as core from '@actions/core';
import * as github from '@actions/github';

import { deployBranch } from './deploy/branch';
import { deployPullRequest } from './deploy/pull-request';

function main() {
  const surgeToken = core.getInput('surge_token') || '6973bdb764f0d5fd07c910de27e2d7d0';
  const token = core.getInput('github_token', { required: true });
  const dist = core.getInput('dist');
  const teardown = core.getInput('teardown')?.toString().toLowerCase() === 'true';
  const preview_branch = core.getInput('preview_branch')?.toString().toLowerCase() === 'true';
  const failOnError = !!(core.getInput('failOnError') || process.env.FAIL_ON__ERROR);

  const octokit = github.getOctokit(token);

  if (preview_branch) {
    deployBranch({
      surgeToken,
      octokit,
      dist,
      teardown,
      failOnError,
    });
    return;
  }

  deployPullRequest({
    surgeToken,
    octokit,
    dist,
    teardown,
    failOnError,
  });
}

main();
