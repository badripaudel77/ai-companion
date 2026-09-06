pipeline {
    agent any

    // Define parameters for the pipeline, allowing users to customize the email during build trigger
    parameters {
        string(name: 'NOTIFICATION_RECIPIENTS', defaultValue: 'devs@myteam.com', description: 'Email(s) to notify on build result')
        booleanParam(name: 'SEND_EMAIL', defaultValue: false, description: 'Whether to send email notification on build result')
        choice(name: 'DEPLOY_ENV', choices: ['development', 'production'], description: 'Which environment to build for')
        booleanParam(name: 'PUBLISH_IMAGE', defaultValue: false, description: 'Push image to Artifactory after building')
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
        FRONTEND_IMAGE = 'client-aicompanion'
        BACKEND_IMAGE  = 'server-aicompanion'
        IMAGE_TAG      = "${BUILD_NUMBER}"
        SPRING_PROFILE = 'DEV'
        ARTIFACTORY_URL = 'docker.io/badripaudel77'
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
                    echo "=== Stage 2: Installing dependencies & running quality checks (configuration on : ${params.DEPLOY_ENV} environment) ==="
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

        stage('Frontend: Package') {
              steps {
                  dir("${CLIENT_DIR}") {
                      echo 'ℹ️ Starting client packaging ...'
                      echo "Checked out to directory: ${pwd()}"
                      echo "=== Stage: Building Docker image for frontend in ${CLIENT_DIR} ==="
                      bat "docker build --build-arg BUILD_CONFIG=${params.DEPLOY_ENV} -t ${FRONTEND_IMAGE}:${IMAGE_TAG} ."
                  }
                  echo 'ℹ️ Client packaging completed successfully ...'
              }
        }

        stage('Frontend: Publish') {
            when {
                expression { params.PUBLISH_IMAGE == true }
            }
            steps {
                dir("${CLIENT_DIR}") {
                    withCredentials([usernamePassword(credentialsId: 'ARTIFACTORY_CREDS',
                        usernameVariable: 'AF_USER',
                        passwordVariable: 'AF_PASS')]) {
                        echo "ℹ️ Publishing ${FRONTEND_IMAGE}:${IMAGE_TAG} to ${ARTIFACTORY_URL} owned by ${env.AF_USER}..."
                        bat 'echo %AF_PASS% | docker login -u %AF_USER% --password-stdin'
                        bat "docker tag ${FRONTEND_IMAGE}:${IMAGE_TAG} ${ARTIFACTORY_URL}/${FRONTEND_IMAGE}:${IMAGE_TAG}"
                        bat "docker tag ${FRONTEND_IMAGE}:${IMAGE_TAG} ${ARTIFACTORY_URL}/${FRONTEND_IMAGE}:latest"
                        bat "docker push ${ARTIFACTORY_URL}/${FRONTEND_IMAGE}:${IMAGE_TAG}"
                        bat "docker push ${ARTIFACTORY_URL}/${FRONTEND_IMAGE}:latest"
                        bat 'docker logout'
                        echo "✔️ Published ${FRONTEND_IMAGE}:${IMAGE_TAG} and :latest to ${ARTIFACTORY_URL}."
                    }
                }
            }
        }

        stage('Backend: Build') {
            steps {
                dir("${SERVER_DIR}") {
                    echo 'ℹ️ Starting server Build ... '
                    echo "Checked out to directory: ${pwd()}"
                    echo "=== Stage: Building Spring Boot app in ${SERVER_DIR} ==="
                    bat "mvn clean package -DskipTests"
                }
                echo 'ℹ️ Server build completed successfully ... '
            }
        }
        stage('Backend: Package') {
            steps {
                dir("${SERVER_DIR}") {
                    echo "=== Stage: Building Docker image for backend in ${SERVER_DIR} ==="
                    bat "docker build -t ${BACKEND_IMAGE}:${IMAGE_TAG} ."
                }
            }
        }

        stage('Backend: Publish') {
            when {
                expression { params.PUBLISH_IMAGE == true }
            }
            steps {
                dir("${SERVER_DIR}") {
                    withCredentials([usernamePassword(credentialsId: 'ARTIFACTORY_CREDS',
                        usernameVariable: 'AF_USER',
                        passwordVariable: 'AF_PASS')]) {
                        echo "ℹ️ Publishing ${BACKEND_IMAGE}:${IMAGE_TAG} to ${ARTIFACTORY_URL} owned by ${env.AF_USER}..."
                        bat 'echo %AF_PASS% | docker login -u %AF_USER% --password-stdin'
                        bat "docker tag ${BACKEND_IMAGE}:${IMAGE_TAG} ${ARTIFACTORY_URL}/${BACKEND_IMAGE}:${IMAGE_TAG}"
                        bat "docker tag ${BACKEND_IMAGE}:${IMAGE_TAG} ${ARTIFACTORY_URL}/${BACKEND_IMAGE}:latest"
                        bat "docker push ${ARTIFACTORY_URL}/${BACKEND_IMAGE}:${IMAGE_TAG}"
                        bat "docker push ${ARTIFACTORY_URL}/${BACKEND_IMAGE}:latest"
                        bat 'docker logout'
                        echo "✔️ Published ${BACKEND_IMAGE}:${IMAGE_TAG} and :latest to ${ARTIFACTORY_URL}."
                    }
                }
            }
        }

        stage('Local Artifacts Cleanup') {
            steps {
                echo 'ℹ️ Stage: Cleaning up workspace ...'
                cleanWs()
                echo 'ℹ️ Removing local Docker images for frontend and backend in parallel ...'
            }
        }

        stage('Remove Docker Images') {
            parallel {
                stage('Remove Frontend Image') {
                    steps {
                        echo "ℹ️ Removing image: ${FRONTEND_IMAGE}:${IMAGE_TAG}"
                        bat "docker rmi ${FRONTEND_IMAGE}:${IMAGE_TAG} || echo 'not found'"
                        echo "✔️ Frontend image cleanup step completed."
                    }
                }
                stage('Remove Backend Image') {
                    steps {
                        echo "ℹ️ Removing image: ${BACKEND_IMAGE}:${IMAGE_TAG}"
                        bat "docker rmi ${BACKEND_IMAGE}:${IMAGE_TAG} || echo 'not found'"
                        echo "✔️ Backend image cleanup step completed."
                    }
                }
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