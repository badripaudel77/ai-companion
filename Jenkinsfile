pipeline {
    agent any

    // Define parameters for the pipeline, allowing users to customize the email during build trigger
    parameters {
        string(name: 'NOTIFICATION_RECIPIENTS', defaultValue: 'devs@myteam.com', description: 'Email(s) to notify on build result')
        booleanParam(name: 'SEND_EMAIL', defaultValue: false, description: 'Whether to send email notification on build result')
        choice(name: 'DEPLOY_ENV', choices: ['development', 'production'], description: 'Which environment to build for')
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
        CLIENT_DIR     = 'client'
        SERVER_DIR     = 'server'
        FRONTEND_IMAGE = 'my-companion-frontend'
        BACKEND_IMAGE  = 'my-companion-backend'
        IMAGE_TAG      = "${BUILD_NUMBER}"
        SPRING_PROFILE = 'DEV'
    }

    stages {
        stage('Checkout') {
            steps {
                echo "=== Stage 1: Checking out repository source code in JOB_NAME ${env.JOB_NAME} ==="
                checkout scm
            }
        }

        stage('Environment Check') {
                steps {
                    echo '=== Stage: Verifying tool versions ==='
                    bat 'java -version'
                    bat 'node --version'
                    bat 'npm --version'
                    bat 'mvn -version'
                    bat 'docker --version'
                }
        }

        stage('Frontend: Install & Quality Checks') {
            steps {
                dir("${CLIENT_DIR}") {
                    echo 'ℹ️ Starting client Build ...'
                    echo "Checked out to directory: ${pwd()}"
                    echo "=== Stage 2: Installing dependencies & running quality checks (configuration on : ${params.DEPLOY_ENV}) environment ==="
                    bat 'npm ci'
                    script { runNpmLint() }
                    bat 'npm run test -- --watch=false'
                }
            }
        }

        stage('Frontend: Build') {
            steps {
                dir("${CLIENT_DIR}") {
                    bat "npm run build -- --configuration=${params.DEPLOY_ENV}"
                    echo 'ℹ️ Client build completed successfully ...'
                }
            }
        }


        stage('Backend: Build & Package') {
            steps {
                dir("${SERVER_DIR}") {
                    echo 'ℹ️ Starting server Build ... '
                    echo "Checked out to directory: ${pwd()}"
                    echo "=== Stage 3: Simulating Spring Boot REST API build & containerization on directory ${SERVER_DIR} ==="
                    bat "mvn clean package -DskipTests"
                }
                echo 'ℹ️ Server build completed successfully ... '
            }
        }
    }

    post {
        success {
            script {
                sendEmailNotification('#28a745', "Successfully built ${FRONTEND_IMAGE}:${IMAGE_TAG} and ${BACKEND_IMAGE}:${IMAGE_TAG}")
            }
        }
        failure {
            script {
                sendEmailNotification('#dc3545', 'Pipeline build failed.')
            }
        }
        always {
            echo '=== Post Action: Cleaning up workspace ==='
            cleanWs()
        }
    }
}

def runNpmLint() {
    def lintResult = bat(script: 'npm run lint', returnStatus: true)
    if (lintResult != 0) {
        currentBuild.result = 'UNSTABLE'
        echo "❌ Lint found issues (exit code ${lintResult}) — continuing anyway, build marked UNSTABLE."
    } else {
        echo "✔️ Lint passed."
    }
}

def sendEmailNotification(String color, String details) {
    if(!params.SEND_EMAIL) {
        echo "Email notification is disabled. Skipping email sending. The build status is: ${currentBuild.result}"
        return
    }
    String recipients = params.NOTIFICATION_RECIPIENTS ?: 'devs@myteam.com'
    emailext (
        to: "${recipients}",
        subject: "[Jenkins Pipeline] ${currentBuild.result}: ${env.JOB_NAME} [Build #${env.BUILD_NUMBER}]",
        body: "Build Details: ${details}",
        mimeType: 'text/html'
    )
}