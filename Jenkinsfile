pipeline {
    agent any

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
        ansiColor('xterm')
    }

    tools {
        jdk 'JDK_25'
        nodejs 'NodeJS_24'
    }

    environment {
        CLIENT_DIR              = 'client'
        SERVER_DIR              = 'server'

        // Separate image names for independent artifacts
        FRONTEND_IMAGE          = 'my-companion-frontend'
        BACKEND_IMAGE           = 'my-companion-backend'
        IMAGE_TAG               = "${BUILD_NUMBER}"

        SPRING_PROFILE          = 'prod'
        NOTIFICATION_RECIPIENTS = 'devops-team@yourdomain.com'
    }

    stages {
        stage('Checkout') {
            steps {
                echo '=== Stage 1: Checking out repository source code ==='
                checkout scm
            }
        }

        stage('Build & Containerize Frontend') {
            steps {
                dir("${CLIENT_DIR}") {
                    echo '=== Stage 2: Simulating Angular compilation & Nginx Docker build ==='
                }
            }
        }

        stage('Build & Containerize Backend') {
            steps {
                dir("${SERVER_DIR}") {
                    echo '=== Stage 3: Simulating Spring Boot REST API build & containerization ==='
                }
            }
        }
    }

    post {
        success {
            script {
                sendEmailNotification('SUCCESS', '#28a745', "Successfully built ${FRONTEND_IMAGE}:${IMAGE_TAG} and ${BACKEND_IMAGE}:${IMAGE_TAG}")
            }
        }
        failure {
            script {
                sendEmailNotification('FAILURE', '#dc3545', 'Pipeline build failed.')
            }
        }
        always {
            echo '=== Post Action: Cleaning up workspace ==='
            cleanWs()
        }
    }
}

def sendEmailNotification(String status, String color, String details) {
    echo "Sending Email Notification: Status=${status}, Color=${color}"

    /*
    emailext (
        to: "${env.NOTIFICATION_RECIPIENTS}",
        subject: "[Jenkins Pipeline] ${status}: ${env.JOB_NAME} [Build #${env.BUILD_NUMBER}]",
        body: "Build Details: ${details}",
        mimeType: 'text/html'
    )
    */
}