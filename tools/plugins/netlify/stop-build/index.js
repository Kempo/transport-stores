module.exports = {
  onPreBuild: ({ utils }) => {
    const projectName = process.env.PROJECT_NAME;
    const latestCommit = 'HEAD'; // the current commit we're building
    const lastDeployedCommit = process.env.CACHED_COMMIT_REF;
    const url = process.env.REPOSITORY_URL;

    const isProjectChanged = projectChanged(projectName, lastDeployedCommit, latestCommit);
    console.log(`Current commit: ${process.env.COMMIT_REF}`);
    console.log(`Previous deployed commit: ${process.env.CACHED_COMMIT_REF}`);

    if(!isProjectChanged) {
      utils.build.cancelBuild(`Cancelling build because the current '${projectName}' website is unaffected. \n REPOSITORY_URL: ${url} `);
    }
  }
}

function projectChanged(currentProject, fromHash, toHash) {
  const execSync = require('child_process').execSync;
  const getAffected = `yarn --silent nx print-affected --base=${fromHash} --head=${toHash}`;
  const output = execSync(getAffected).toString();

  const changedProjects = JSON.parse(output).projects;
  console.log(`Changed Projects: ${changedProjects}`)

  return changedProjects.some(project => project === currentProject);
}
