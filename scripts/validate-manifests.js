const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const YAML = require('yaml');

function readDocuments(file) {
  return YAML.parseAllDocuments(fs.readFileSync(file, 'utf8')).map((document) => {
    assert.equal(document.errors.length, 0, `${file}: ${document.errors}`);
    return document.toJS();
  });
}

for (const directory of ['.tekton', 'openshift', '.github/workflows']) {
  for (const file of fs.readdirSync(directory).filter((file) => file.endsWith('.yml'))) {
    readDocuments(path.join(directory, file));
  }
}

const tasks = readDocuments('.tekton/tasks.yml');
const taskMap = new Map(tasks.map((task) => [task.metadata.name, task]));
const [pipeline] = readDocuments('.tekton/pipeline.yml');
const completed = new Set();
for (const task of pipeline.spec.tasks) {
  assert(taskMap.has(task.taskRef.name), `Missing task: ${task.taskRef.name}`);
  for (const dependency of task.runAfter || []) {
    assert(completed.has(dependency), `Invalid ordering: ${task.name} after ${dependency}`);
  }
  const definition = taskMap.get(task.taskRef.name);
  for (const param of definition.spec.params || []) {
    assert(param.default !== undefined || (task.params || []).some((p) => p.name === param.name),
      `Missing parameter ${param.name} for ${task.name}`);
  }
  completed.add(task.name);
}
assert.deepEqual([...completed], ['cleanup', 'git-clone', 'eslint', 'jest', 'buildah', 'deploy']);
const [pvc] = readDocuments('.tekton/pvc.yml');
assert.equal(pvc.spec.storageClassName, 'skills-network-learner');
assert.equal(pvc.spec.resources.requests.storage, '1Gi');
console.log('YAML parsed; task references, required task parameters, stage ordering and PVC checked.');
