module.exports = {
  onPreBuild: ({ utils }) => {
    const projectName = process.env.PROJECT_NAME;
    const latestCommit = 'HEAD'; // the current commit we're building
    const lastDeployedCommit = process.env.CACHED_COMMIT_REF;
    const url = process.env.REPOSITORY_URL;

    const isProjectChanged = projectChanged(projectName, latestCommit, lastDeployedCommit);

    if(!isProjectChanged) {
      utils.build.cancelBuild(`Cancelling build because the current website is unaffected. \n REPOSITORY_URL: ${url} `);
    }
  }
}

function projectChanged(currentProject, fromHash, toHash) {
  const execSync = require('child_process').execSync;
  const getAffected = `yarn --silent nx print-affected --base=${fromHash} --head=${toHash}`;
  const output = execSync(getAffected).toString();
  console.log(output);

  const changedProjects = JSON.parse(output).projects;

  return changedProjects.some(project => project === currentProject);
}
