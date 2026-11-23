#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

command -v oc >/dev/null
oc whoami
oc project
oc get storageclass skills-network-learner
oc apply -f .tekton/rbac.yml
oc apply -f .tekton/pvc.yml
oc apply -f .tekton/tasks.yml
oc apply -f .tekton/pipeline.yml
oc create imagestream cicd-final-project --dry-run=client -o yaml | oc apply -f -
echo 'Setup applied. Check PVC status and run scripts/openshift-run.sh next.'
