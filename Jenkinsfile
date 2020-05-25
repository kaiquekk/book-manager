pipeline {
    agent any
    stages{        
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