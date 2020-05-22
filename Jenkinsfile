pipeline {
    agent { label 'master' }
    stages{
        stage('checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/kaiquekk/book-manager.git'
            }
        }
        stage('install deps') {
            steps {
                bat 'npm install'
            }
        }
    }
}