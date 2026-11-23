# Submission checklist

Replace `YOUR_USERNAME/YOUR_REPOSITORY` with your public GitHub repository.
Open the resulting links in a signed-out browser to check access.

## Question 1 — README URL (2 points)

```text
https://github.com/YOUR_USERNAME/YOUR_REPOSITORY/blob/main/README.md
```

## Question 2 — workflow URL (4 points)

```text
https://github.com/YOUR_USERNAME/YOUR_REPOSITORY/blob/main/.github/workflows/workflow.yml
```

Contains the complete `Lint with ESLint` and `Run unit tests with Jest` steps.

## Question 3 — tasks URL (4 points)

```text
https://github.com/YOUR_USERNAME/YOUR_REPOSITORY/blob/main/.tekton/tasks.yml
```

Contains the `cleanup` task and the `jest` task, along with the other pipeline tasks.

## Question 4 — GitHub Actions terminal output (2 points)

Wait for your pushed workflow to succeed. With GitHub CLI installed and signed in,
find the run ID at the end of its GitHub Actions URL, then run:

```sh
bash scripts/collect-evidence.sh github YOUR_USERNAME/YOUR_REPOSITORY RUN_ID
```

Paste the contents of `evidence/cicd-github-validate.txt` into the answer box.
This includes the workflow summary and full available step logs. As an alternative
to the script, use `gh run view RUN_ID --repo USER/REPO --log` in a terminal and save
its output after verifying the run succeeded.

## Question 5 — PVC screenshot (2 points)

In the OpenShift web console, select your project and open
**Storage → PersistentVolumeClaims → pipeline-pvc → Details**.
Capture the name, storage class `skills-network-learner`, requested capacity `1Gi`,
and status. Save as `oc-pipelines-console-pvc-details.png` or `.jpeg`.

## Question 6 — pipeline definition screenshot (2 points)

Open **Pipelines → Pipelines → oc-final**. Capture its graph showing all six stages:
`cleanup`, `git-clone`, `eslint`, `jest`, `buildah`, and `deploy`.
Save as `oc-pipelines-oc-final.png` or `.jpeg`.
Console menu labels can vary by OpenShift version and selected perspective.

## Question 7 — successful PipelineRun screenshot (2 points)

Open the successful run of `oc-final` in **Pipelines → PipelineRuns**.
Capture its successful status and all six green stages.
Save as `oc-pipelines-oc-green.png` or `.jpeg`.
Inspect a failed stage's logs and fix the issue before retrying if needed.

## Question 8 — OpenShift application logs (2 points)

Get the exact successful run name from the console or `oc get pipelineruns`, then:

```sh
bash scripts/collect-evidence.sh openshift YOUR_PIPELINERUN_NAME
```

Paste the contents of `evidence/oc-pipeline-application-logs.txt` into the answer box.
The actual application emits the required message in the middle of its startup log:
`SERVICERUNNING on port 8000`.

The first three URLs cover 10 of 20 available points. The 70% threshold requires
14 points, so successful execution evidence is also necessary.
