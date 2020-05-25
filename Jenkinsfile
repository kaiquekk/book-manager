pipeline {
    agent { label 'master' }
    stages{
        stage('checkout') {
            steps {
                git branch: env.BRANCH_NAME, url: 'https://github.com/kaiquekk/book-manager.git'
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