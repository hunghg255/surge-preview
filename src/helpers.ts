/* eslint-disable indent */
import { exec } from '@actions/exec';

interface ExecSurgeCommandOptions {
  command: string[];
}

export const execSurgeCommand = async ({ command }: ExecSurgeCommandOptions): Promise<void> => {
  let myOutput = '';
  const options = {
    listeners: {
      stdout: (stdoutData: Buffer) => {
        myOutput += stdoutData.toString();
      },
    },
  };
  await exec('npx', command, options);
  if (myOutput && !myOutput.includes('Success')) {
    throw new Error(myOutput);
  }
};

export const formatImage = ({
  buildingLogUrl,
  qrUrl,
  gitCommitSha,
  url,
  status,
  buildTime,
}: {
  buildingLogUrl: string;
  qrUrl?: string;
  gitCommitSha: string;
  url: string;
  status: string;
  buildTime?: string;
}) => {
  return `
  |  Name  |   |
  |---|---|
  |  🎊 Status |   ${status} |
  |  💬 Latest commit |  ${gitCommitSha} |
  |  🔍 Latest deploy log | ${buildingLogUrl} |
  |  ⌛ Build time | ${buildTime || '...'} |
  |  🚀 Deploy Preview |  ${url} |
  |  📱 Preview on mobile |  <details> <summary>Click me</summary><p><i>Use your smartphone camera to open QR code link.</i></p>![Mobile](${
    qrUrl || 'https://avatar.vercel.sh/vercel.svg?text=QR'
  }) </details> |
`;
};

export const getCommentFooter = () => {
  return '<sub>🤖 Contribute at [surge-preview](https://github.com/hunghg255/surge-preview)</sub>';
};
