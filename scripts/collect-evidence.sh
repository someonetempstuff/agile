#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p evidence

case "${1:-}" in
  github)
    REPO="${2:?Usage: bash scripts/collect-evidence.sh github USER/REPO RUN_ID}"
    RUN_ID="${3:?Provide the successful GitHub Actions run ID from its URL}"
    gh run watch "$RUN_ID" --repo "$REPO" --exit-status
    test "$(gh run view "$RUN_ID" --repo "$REPO" --json conclusion --jq .conclusion)" = success
    gh run view "$RUN_ID" --repo "$REPO" > evidence/cicd-github-validate.txt
    gh run view "$RUN_ID" --repo "$REPO" --log >> evidence/cicd-github-validate.txt
    echo 'Saved evidence/cicd-github-validate.txt'
    ;;
  openshift)
    RUN="${2:?Usage: bash scripts/collect-evidence.sh openshift PIPELINERUN_NAME}"
    test "$(oc get pipelinerun "$RUN" -o 'jsonpath={.status.conditions[?(@.type=="Succeeded")].status}')" = True
    oc rollout status deployment/cicd-final-project --timeout=180s
    oc logs deployment/cicd-final-project > evidence/oc-pipeline-application-logs.txt
    grep -F 'SERVICERUNNING on port 8000' evidence/oc-pipeline-application-logs.txt
    oc get pipelinerun "$RUN" -o yaml > evidence/pipelinerun.yml
    oc get pvc pipeline-pvc -o yaml > evidence/pvc.yml
    echo 'Saved application logs and supporting manifests in evidence/.'
    ;;
  *)
    echo 'Usage: bash scripts/collect-evidence.sh {github USER/REPO RUN_ID|openshift PIPELINERUN_NAME}' >&2
    exit 1
    ;;
esac
