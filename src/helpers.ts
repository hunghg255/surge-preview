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
  imageUrl,
  gitCommitSha,
  url,
  status,
  buildTime,
}: {
  buildingLogUrl: string;
  imageUrl: string;
  gitCommitSha: string;
  url: string;
  status: string;
  buildTime?: string;
}) => {
  return `
  |  Name  |   |
  |---|---|
  |  Status |   ${status} |
  |  Commit |  ${gitCommitSha} |
  |  Deploy log |  [1223123](${buildingLogUrl}) |
  |  Build time |  ${buildTime || '...'} |
  |  Preview |  ${url} |
  |  Preview on Mobile |  <details> <summary>Click me</summary> <img style="display: block;-webkit-user-select: none;margin: auto;background-color: hsl(0, 0%, 90%);transition: background-color 300ms;" src="https://images.unsplash.com/photo-1682687220975-7b2df674d3ce?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"> </details> |
`;
};

export const getCommentFooter = () => {
  return '<sub>🤖 By [surge-preview](https://github.com/hunghg255/surge-preview)</sub>';
};
