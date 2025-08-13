pipeline {
    triggers {
        cron('00 21 * * 0-4')
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '20', artifactNumToKeepStr: '20'))
        disableConcurrentBuilds()
        skipDefaultCheckout()
    }

    agent {
        label 'cypress-node'
    }

    environment {
        TEST_DIR = 'cypress'
        ALLURE_PATH = 'allure-results'
        WORKSPACE_DIR = "${env.WORKSPACE}"
        CURRENTS_PROJECT_ID = 'SME-GIPE'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Executar') {
            steps {
                script {
                    withDockerRegistry(credentialsId: 'jenkins_registry', url: 'https://registry.sme.prefeitura.sp.gov.br/repository/sme-registry/') {
                        sh """
                            docker pull registry.sme.prefeitura.sp.gov.br/devops/cypress-agent:14.5.2
                            docker run --rm -v "$WORKSPACE:/app" -w /app -e CURRENTS_PROJECT_ID=${CURRENTS_PROJECT_ID} \
                                registry.sme.prefeitura.sp.gov.br/devops/cypress-agent:14.5.2 \
                                sh -c "\
                                    rm -rf package-lock.json node_modules/ allure-results/ || true && \
                                    npm install && \
                                    npm install cypress@14.5.2 cypress-cloud@beta && \
                                    npm install @shelex/cypress-allure-plugin allure-mocha crypto-js@4.1.1 --save-dev && \
                                    npx cypress-cloud run --parallel --browser chrome --headed true --record --key somekey --projectId ${CURRENTS_PROJECT_ID} --reporter mocha-allure-reporter --ci-build-id SME-INTRANET_JENKINS-BUILD-${BUILD_NUMBER} || true && \
                                    mkdir -p allure-results && chown -R 1001:1001 allure-results && chmod -R 777 allure-results"
                        """
                    }
                    echo "✅ FIM DOS TESTES!"
                }
            }
        }

        stage('Generate Allure Report') {
            steps {
                script {
                    catchError(buildResult: 'SUCCESS', stageResult: 'SUCCESS') {
                        sh "mkdir -p ${ALLURE_PATH} && chmod -R 777 ${ALLURE_PATH}"

                        def hasResults = fileExists("${ALLURE_PATH}") && sh(script: "ls -A ${ALLURE_PATH} | wc -l", returnStdout: true).trim() != "0"

                        if (hasResults) {
                            echo "📊 Gerando relatório Allure..."
                            sh """
                                export JAVA_HOME=\$(dirname \$(dirname \$(readlink -f \$(which java)))); \
                                export PATH=\$JAVA_HOME/bin:/usr/local/bin:\$PATH; \
                                allure generate ${ALLURE_PATH} --clean --output allure-report || true; \
                                zip -r allure-results-${BUILD_NUMBER}-\$(date +"%d-%m-%Y").zip ${ALLURE_PATH} || true
                            """
                        } else {
                            echo "⚠️ Diretório ${ALLURE_PATH} vazio ou ausente. Pulando relatório."
                        }
                    }
                }
            }
        }
    }

//     post {
//         always {
//             script {
//                 sh "chmod -R 777 $WORKSPACE/${ALLURE_PATH} || true"

//                 if (fileExists("${ALLURE_PATH}") && sh(script: "ls -A ${ALLURE_PATH} | wc -l", returnStdout: true).trim() != "0") {
//                     catchError(buildResult: 'SUCCESS', stageResult: 'SUCCESS') {
//                         allure includeProperties: false, jdk: '', results: [[path: "${ALLURE_PATH}"]]
//                     }
//                 }

//                 def zipExists = sh(script: "ls allure-results-*.zip 2>/dev/null || true", returnStdout: true).trim()
//                 if (zipExists) {
//                     archiveArtifacts artifacts: 'allure-results-*.zip', fingerprint: true
//                 } else {
//                     echo "⚠️ Nenhum .zip de Allure encontrado. Pulando archiveArtifacts."
//                 }
//             }
//         }

//         success {
//             sendTelegram("☑️ Job Name: ${JOB_NAME} \nBuild: ${BUILD_DISPLAY_NAME} \nStatus: Success \nLog: \n${env.BUILD_URL}allure")
//         }

//         unstable {
//             sendTelegram("💣 Job Name: ${JOB_NAME} \nBuild: ${BUILD_DISPLAY_NAME} \nStatus: Unstable \nLog: \n${env.BUILD_URL}allure")
//         }

//         failure {
//             sendTelegram("💥 Job Name: ${JOB_NAME} \nBuild: ${BUILD_DISPLAY_NAME} \nStatus: Failure \nLog: \n${env.BUILD_URL}allure")
//         }

//         aborted {
//             sendTelegram("😥 Job Name: ${JOB_NAME} \nBuild: ${BUILD_DISPLAY_NAME} \nStatus: Aborted \nLog: \n${env.BUILD_URL}console")
//         }
//     }
// }

// def sendTelegram(message) {
//     def encodedMessage = URLEncoder.encode(message, "UTF-8")
//     withCredentials([
//         string(credentialsId: 'telegramTokensigpae', variable: 'TOKEN'),
//         string(credentialsId: 'telegramChatIdsigpae', variable: 'CHAT_ID')
//     ]) {
//         httpRequest (
//             consoleLogResponseBody: true,
//             contentType: 'APPLICATION_JSON',
//             httpMode: 'GET',
//             url: "https://api.telegram.org/bot${TOKEN}/sendMessage?text=${encodedMessage}&chat_id=${CHAT_ID}&disable_web_page_preview=true",
//             validResponseCodes: '200'
//         )
//     }
}
