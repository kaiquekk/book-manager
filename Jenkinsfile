pipeline {
    agent { label 'master' }
    stages{
        stage('install deps') {
            steps {
                bat 'npm install'
            }
        }
    }
}