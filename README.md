# CI/CD Final Project

Project name: **CI/CD Final Project — GitHub Actions, Tekton, and OpenShift**

A small Node.js HTTP application with an automated CI/CD pipeline. GitHub Actions
installs dependencies, runs ESLint and Jest, validates YAML, and builds a container.
The OpenShift pipeline runs `cleanup → git-clone → eslint → jest → buildah → deploy`.

The application listens on port **8000**. At startup it logs
`SERVICERUNNING on port 8000` between separator lines. `GET /` returns the project
name and service message; `GET /health` returns a health status for deployment probes.

This is a standalone implementation of the supplied rubric using its ESLint/Jest
options. If your lab requires a particular starter application, use that application
instead and adapt the test and build commands before submitting.

## Run locally

Requires Node.js 22 or newer.

```sh
npm ci
npm run lint
npm test
node scripts/validate-manifests.js
npm start
```

Visit `http://localhost:8000/`. Stop the server with Ctrl+C.

## Push to GitHub

Create an empty public GitHub repository, then run these commands **inside this folder**:

```sh
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

The workflow at [`.github/workflows/workflow.yml`](.github/workflows/workflow.yml)
runs on pushes and pull requests to `main`, and supports manual runs. If you edit
any files before pushing, commit those edits first. Keep this project's files at
the repository root so that GitHub discovers the workflow.

## Run on the course OpenShift cluster

Use the course lab terminal with `oc`, `tkn`, and access to an OpenShift cluster
with OpenShift Pipelines installed. Clone your pushed repo there and enter it.
The commands below use Bash, available in the lab terminal or Git Bash.

```sh
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
oc whoami
oc project
bash scripts/openshift-setup.sh
bash scripts/openshift-run.sh https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
```

The setup creates a `pipeline-pvc` PVC using the required
`skills-network-learner` storage class and **1Gi** requested storage (displayed as
1 GiB by Kubernetes). Do not run multiple pipelines concurrently against this PVC:
the cleanup stage clears this dedicated workspace before cloning.

The scripts use the current OpenShift project/namespace. Check it before running.
The pipeline pushes a unique image tag to the cluster's internal image registry,
deploys it, waits for a successful rollout, and prints the application logs.
Lint and tests run sequentially to avoid concurrent writes to the shared workspace.

The build uses Buildah with the `vfs` storage driver and `chroot` isolation. The
cluster must allow the `pipeline` service account to run that build step as UID 0
with `SETFCAP` (usually through its configured Pipelines SCC). The repository does
not grant SCC permissions. If your cluster rejects the build pod, use the course's
supported Buildah task/security configuration or ask the lab administrator for the
appropriate configuration. The deployed application itself runs as a non-root user.
Registry TLS verification is disabled only for this lab's internal image registry.

This requires the course storage class, internal image registry, image pull access,
and permissions to create the included namespaced resources and role bindings.
The manifests use `tekton.dev/v1`; an older lab may require its supported API version.
See [Tekton's migration guide](https://github.com/tektoncd/pipeline/blob/main/docs/migrating-v1beta1-to-v1.md)
before changing the API version because `taskRunTemplate` also differs.

To expose the application in a browser after the pipeline succeeds:

```sh
oc expose service/cicd-final-project
oc get route cicd-final-project
```

Alternatively, use `oc port-forward service/cicd-final-project 8000:8000`.

## Submission evidence

See [docs/SUBMISSION.md](docs/SUBMISSION.md) for the exact eight answers and
evidence collection commands. Screenshots and logs must come from your actual
GitHub Actions and OpenShift runs. Local test output does not establish that those
remote runs succeeded. `evidence/` is ignored by Git so generated logs and screenshots
stay local unless you intentionally add them.

Useful references: [Tekton pipelines](https://tekton.dev/docs/pipelines/pipelines/),
[OpenShift Buildah security](https://docs.redhat.com/en/documentation/red_hat_openshift_pipelines/1.14/html/securing_openshift_pipelines/unprivileged-building-of-container-images-using-buildah).
