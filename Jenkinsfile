pipeline {
    agent {
        label 'cypress-node'
    }

    triggers {
        cron('30 20 * * 0-5')
    }

    options {
        ansiColor('xterm')
        buildDiscarder(logRotator(numToKeepStr: '20', artifactNumToKeepStr: '20'))
        disableConcurrentBuilds()
        skipDefaultCheckout()
    }

    environment {
        ALLURE_PATH = 'testes/ui/allure-results'
        WORKSPACE_DIR = "${env.WORKSPACE}"
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
                        sh '''
                            docker pull registry.sme.prefeitura.sp.gov.br/devops/cypress-agent:14.5.2
                            docker run \
                                --rm \
                                -v "$WORKSPACE/testes/ui:/app" \
                                -w /app \
                                registry.sme.prefeitura.sp.gov.br/devops/cypress-agent:14.5.2 \
                                sh -c "rm -rf allure-results && \
                                       npm install && \
                                       npm install cypress@14.5.2 cypress-cloud@beta \
                                       @shelex/cypress-allure-plugin allure-mocha crypto-js@4.1.1 --save-dev && \
                                       npx cypress-cloud run \
                                            --parallel \
                                            --browser chrome \
                                            --headed true \
                                            --record \
                                            --key somekey \
                                            --reporter mocha-allure-reporter \
                                            --reporter-options reportDir=allure-results \
                                            --ci-build-id SME-GIPE_JENKINS-BUILD-${BUILD_NUMBER} && \
                                       chown 1001:1001 * -R && \
                                       chmod 777 * -R"
                        '''
                    }
                    echo "Testes Cypress finalizados."
                }
            }
        }

        stage('Gerar Relatório Allure') {
            steps {
                script {
                    catchError(buildResult: 'SUCCESS', stageResult: 'SUCCESS') {
                        def hasResults = fileExists("${ALLURE_PATH}") && sh(script: "ls -A ${ALLURE_PATH} | wc -l", returnStdout: true).trim() != "0"

                        if (hasResults) {
                            echo "📊 Gerando relatório Allure..."
                            sh """
                                export JAVA_HOME=\$(dirname \$(dirname \$(readlink -f \$(which java)))); \
                                export PATH=\$JAVA_HOME/bin:/usr/local/bin:\$PATH; \
                                allure generate ${ALLURE_PATH} --clean --output testes/ui/allure-report; \
                                cd testes/ui; \
                                zip -r allure-results-${BUILD_NUMBER}-\$(date +"%d-%m-%Y").zip allure-results
                            """
                        } else {
                            echo "⚠️ Nenhum resultado Allure encontrado em ${ALLURE_PATH}."
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                if (fileExists("${ALLURE_PATH}") && sh(script: "ls -A ${ALLURE_PATH} | wc -l", returnStdout: true).trim() != "0") {
                    allure includeProperties: false, jdk: '', results: [[path: "${ALLURE_PATH}"]]
                } else {
                    echo "⚠️ Resultados do Allure não encontrados ou vazios, plugin não será acionado."
                }

                def zipExists = sh(script: "ls testes/ui/allure-results-*.zip 2>/dev/null || true", returnStdout: true).trim()
                if (zipExists) {
                    archiveArtifacts artifacts: 'testes/ui/allure-results-*.zip', fingerprint: true
                } else {
                    echo "⚠️ Nenhum .zip de Allure encontrado para arquivamento."
                }
            }
        }

        
        success {
            sendTelegram("☑️ Job Name: ${JOB_NAME} \nBuild: ${BUILD_DISPLAY_NAME} \nStatus: Success \nLog: \n${env.BUILD_URL}allure")
        }

        unstable {
            sendTelegram("💣 Job Name: ${JOB_NAME} \nBuild: ${BUILD_DISPLAY_NAME} \nStatus: Unstable \nLog: \n${env.BUILD_URL}allure")
        }

        failure {
            sendTelegram("💥 Job Name: ${JOB_NAME} \nBuild: ${BUILD_DISPLAY_NAME} \nStatus: Failure \nLog: \n${env.BUILD_URL}allure")
        }

        aborted {
            sendTelegram("😥 Job Name: ${JOB_NAME} \nBuild: ${BUILD_DISPLAY_NAME} \nStatus: Aborted \nLog: \n${env.BUILD_URL}console")
        }
        
    }
}


def sendTelegram(message) {
    def encodedMessage = URLEncoder.encode(message, "UTF-8")
    withCredentials([
        string(credentialsId: 'telegramTokensigpae', variable: 'TOKEN'),
        string(credentialsId: 'telegramChatIdsigpae', variable: 'CHAT_ID')
    ]) {
        response = httpRequest (
            consoleLogResponseBody: true,
            contentType: 'APPLICATION_JSON',
            httpMode: 'GET',
            url: "https://api.telegram.org/bot${TOKEN}/sendMessage?text=${encodedMessage}&chat_id=${CHAT_ID}&disable_web_page_preview=true",
            validResponseCodes: '200'
        )
        return response
    }
}