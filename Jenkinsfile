pipeline {
    agent {
        label 'cypress-node'
    }

    triggers {
        cron('00 21 * * 0-4')
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '20', artifactNumToKeepStr: '20'))
        disableConcurrentBuilds()
        skipDefaultCheckout()
        ansiColor('xterm')
    }

    environment {
        TEST_DIR = 'testes/ui'
        ALLURE_PATH = 'testes/ui/allure-results'
        WORKSPACE_DIR = "${env.WORKSPACE}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Executar Testes') {
            steps {
                script {
                    withDockerRegistry(credentialsId: 'jenkins_registry', url: 'https://registry.sme.prefeitura.sp.gov.br/repository/sme-registry/') {
                        sh """
                            docker pull registry.sme.prefeitura.sp.gov.br/devops/cypress-agent:14.5.2
                            docker run --rm -v "$WORKSPACE:/app" -w /app registry.sme.prefeitura.sp.gov.br/devops/cypress-agent:14.5.2 sh -c "\
                                rm -rf package-lock.json node_modules allure-results || true && \
                                npm install && \
                                npm install cypress@14.5.2 cypress-cloud@beta @shelex/cypress-allure-plugin allure-mocha crypto-js@4.1.1 --save-dev && \
                                npx cypress-cloud run \
                                    --parallel \
                                    --browser chrome \
                                    --headed true \
                                    --record \
                                    --key somekey \
                                    --reporter mocha-allure-reporter \
                                    --ci-build-id SME-INTRANET_JENKINS-BUILD-${BUILD_NUMBER} && \
                                chown -R 1001:1001 * || true && \
                                chmod -R 777 * || true"
                        """
                    }
                    echo "✅ FIM DOS TESTES!"
                }
            }
        }

        stage('Gerar Relatório Allure') {
            steps {
                script {
                    catchError(buildResult: 'SUCCESS', stageResult: 'SUCCESS') {
                        sh """
                            mkdir -p ${ALLURE_PATH}
                            chown -R 1001:1001 ${ALLURE_PATH} || true
                            chmod -R 777 ${ALLURE_PATH} || true
                        """

                        def hasResults = fileExists("${ALLURE_PATH}") && sh(script: "ls -A ${ALLURE_PATH} | wc -l", returnStdout: true).trim() != "0"

                        if (hasResults) {
                            echo "📊 Gerando relatório Allure..."
                            sh """
                                export JAVA_HOME=\$(dirname \$(dirname \$(readlink -f \$(which java))))
                                export PATH=\$JAVA_HOME/bin:/usr/local/bin:\$PATH
                                allure generate ${ALLURE_PATH} --clean --output testes/ui/allure-report
                                cd testes/ui
                                zip -r allure-results-${BUILD_NUMBER}-\$(date +"%d-%m-%Y").zip allure-results
                            """
                        } else {
                            echo "⚠️ Diretório ${ALLURE_PATH} ausente ou vazio. Pulando geração do relatório."
                        }
                    }
                }
            }
        }
    }

//     post {
//         always {
//             script {
//                 // Garantir permissões finais
//                 sh "chown -R 1001:1001 ${WORKSPACE} || true && chmod -R 777 ${WORKSPACE} || true"

//                 // Gerar relatório no Jenkins
//                 def hasResults = fileExists("${ALLURE_PATH}") && sh(script: "ls -A ${ALLURE_PATH} | wc -l", returnStdout: true).trim() != "0"
//                 if (hasResults) {
//                     catchError(buildResult: 'SUCCESS', stageResult: 'SUCCESS') {
//                         allure includeProperties: false, jdk: '', results: [[path: "${ALLURE_PATH}"]]
//                     }
//                 } else {
//                     echo "⚠️ Resultados do Allure não encontrados ou vazios, plugin Allure não será acionado."
//                 }

//                 // Arquivar .zip
//                 def zipExists = sh(script: "ls testes/ui/allure-results-*.zip 2>/dev/null || true", returnStdout: true).trim()
//                 if (zipExists) {
//                     archiveArtifacts artifacts: 'testes/ui/allure-results-*.zip', fingerprint: true
//                 } else {
//                     echo "⚠️ Nenhum .zip de Allure encontrado para arquivamento."
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
//         httpRequest(
//             consoleLogResponseBody: true,
//             contentType: 'APPLICATION_JSON',
//             httpMode: 'GET',
//             url: "https://api.telegram.org/bot${TOKEN}/sendMessage?text=${encodedMessage}&chat_id=${CHAT_ID}&disable_web_page_preview=true",
//             validResponseCodes: '200'
//         )
//     }
}
