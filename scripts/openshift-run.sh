#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

REPO_URL="${1:?Usage: bash scripts/openshift-run.sh https://github.com/USER/REPO.git [branch]}"
REVISION="${2:-main}"
NAMESPACE="$(oc project -q)"
command -v tkn >/dev/null
tkn pipeline start oc-final \
  --serviceaccount pipeline \
  --param "repo-url=$REPO_URL" \
  --param "revision=$REVISION" \
  --param "image-repository=image-registry.openshift-image-registry.svc:5000/$NAMESPACE/cicd-final-project" \
  --workspace name=shared-workspace,claimName=pipeline-pvc \
  --showlog

echo 'Inspect the PipelineRun result in the console before collecting evidence.'
