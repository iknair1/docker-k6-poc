#!groovy

@Library('cpt-jenkins-library') _
import org.cpt.jenkins.Binaries
import org.cpt.jenkins.Git
import org.cpt.jenkins.NPM
import org.cpt.jenkins.SlackBuildNotifier

def gitlabGroup = "fpr";
def projectName = "fpr-ui-performance-tests";

properties([gitLabConnection('Pensions Gitlab'), disableConcurrentBuilds()])
properties([pipelineTriggers([cron('H 5 * * 1-5')])])

node("sbx") {
  try {
    def npm = new NPM(_jenkins: this).init()
    def binaries = new Binaries()
    env.NVM_NODEJS_ORG_MIRROR = binaries.getAssetURL("node")

    env.CI = 'true'

    stage("Report environment") {
      sh "env"
    }

    stage("Git checkout") {
      checkout scm
    }

    notifyGitlab('running')

    always {
      try {
        sh "docker-compose -f docker-compose.yml rm -fsv"
      } catch (e) {
          echo "error in removing performance test containers"
        }
      deleteDir()
    }

    stage("Start the BE stack") {
          echo "Start all the services required for performance tests"
          sh '''
          docker-compose up -d
          docker ps
          '''
    }

    stage ("Run load test") {
        sh '''
        sleep 30
        docker-compose run fpr-small-pots-perf run --vus 2 --duration 30s - <script_http.js
        '''
    }

    currentBuild.result = 'SUCCESS'
  } catch (Exception e) {
    currentBuild.result = 'FAILURE'
  } finally {
    stage("Update Gitlab") {
      def gitlabBuildState = gitlabFinalBuildStatus(currentBuild.result)
      notifyGitlab(gitlabBuildState)
    }

    stage("Notify Slack") {
      def gitlabBuildState = gitlabFinalBuildStatus(currentBuild.result)
      notifySlack(gitlabBuildState)
    }

    stage("Clean Up") {
      try {
        sh "docker-compose -f docker-compose.yml rm -fsv"
      } catch (e) {
          echo "error in removing performance test containers"
        }
      deleteDir()
    }
  }
}

def notifyGitlab(String buildState) {
  updateGitlabCommitStatus state: buildState
}

def notifySlack(buildStatus) {
  SlackBuildNotifier.notify(this, '#fpr-rj-dev', buildStatus)
}

def gitlabFinalBuildStatus(build) {
  switch (build) {
    case null:       return 'success'
    case 'SUCCESS':  return 'success'
    case 'ABORTED':  return 'canceled'
    default:         return 'failed'
  }
}