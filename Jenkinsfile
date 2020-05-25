pipeline {
    agent { label 'master' }
    stages{
        stage('checkout') {
            steps {
                dir('main') {
                    checkout scm
                }
                dir('tests') {
                    checkout resolveScm(source: git('https://github.com/kaiquekk/book-manager.git'), targets: [BRANCH_NAME,'master']
                }
            }
        }
        stage('install deps') {
            steps {
                bat 'npm install'
            }
        }
        stage('run test') {
            steps {
                bat 'npm run testOnce'
            }
        }
        stage('build') {
            steps {
                bat 'npm run build'
            }
        }
    }
}