pipeline {
    agent any

     // Define parameters for the pipeline, allowing users to customize the email during build trigger
     parameters {
            string(name: 'NOTIFICATION_RECIPIENTS', defaultValue: 'devs@myteam.com', description: 'Email(s) to notify on build result')
     }

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
        maven 'Maven_3.9'
    }

    // Constant environment variables for the pipeline, can be accessed in any stage using ${env.VARIABLE_NAME} or $VARIABLE_NAME
    environment {
        CLIENT_DIR              = 'client'
        SERVER_DIR              = 'server'

        // Separate image names for independent artifacts
        FRONTEND_IMAGE          = 'my-companion-frontend'
        BACKEND_IMAGE           = 'my-companion-backend'
        IMAGE_TAG               = "${BUILD_NUMBER}"

        SPRING_PROFILE          = 'DEV'
    }

    stages {
        stage('Checkout') {
            steps {
                echo '=== Stage 1: Checking out repository source code, on a branch :  ${env.BRANCH_NAME}'
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
    String recipients = params.NOTIFICATION_RECIPIENTS ?: 'dev@myteam.com'
    echo "Sending Email Notification to ${recipients} : Status=${status}, Color=${color}"

    emailext (
        to: "${recipients}",
        subject: "[Jenkins Pipeline] ${status}: ${env.JOB_NAME} [Build #${env.BUILD_NUMBER}]",
        body: "Build Details: ${details}",
        mimeType: 'text/html'
    )
}