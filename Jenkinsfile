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
        BUILD_ID_UNIQUE = "SME-GIPE_${BUILD_NUMBER}_${new Date().format('yyyyMMdd_HHmmss')}"
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
                    echo "Iniciando execução dos testes Cypress..."
                    
                    // Carrega credenciais do Jenkins se existirem
                    def envVars = [:]
                    def credentialIds = [
                        'gipe-rf-gipe': 'RF_GIPE',
                        'gipe-senha-gipe': 'SENHA_GIPE',
                        'gipe-rf-gipe-admin': 'RF_GIPE_ADMIN',
                        'gipe-senha-gipe-admin': 'SENHA_GIPE_ADMIN',
                        'gipe-rf-ue': 'RF_UE',
                        'gipe-senha-ue': 'SENHA_UE',
                        'gipe-rf-cadastro': 'RF_CADASTRO',
                        'gipe-senha-cadastro': 'SENHA_CADASTRO',
                        'gipe-rf-dre': 'RF_DRE',
                        'gipe-senha-dre': 'SENHA_DRE',
                        'gipe-cpf-carga': 'CPF_CARGA',
                        'gipe-senha-carga': 'SENHA_CARGA',
                        'gipe-rf-invalido': 'RF_INVALIDO',
                        'gipe-senha-invalida': 'SENHA_INVALIDA'
                    ]
                    
                    // Tenta carregar cada credencial individualmente
                    credentialIds.each { credId, varName ->
                        try {
                            withCredentials([string(credentialsId: credId, variable: 'TEMP_VAR')]) {
                                envVars[varName] = env.TEMP_VAR
                            }
                        } catch (Exception e) {
                            echo "⚠️ Credential '${credId}' não encontrada, continuando sem ela..."
                        }
                    }
                    
                    // Monta string de variáveis de ambiente para o Docker
                    def envFlags = envVars.collect { k, v -> "-e ${k}='${v}'" }.join(' ')
                    echo "Credenciais carregadas: ${envVars.keySet().join(', ')}"
                    if (envVars.isEmpty()) {
                        echo "⚠️ Nenhuma credencial carregada. Testes rodarão sem credenciais."
                    }
                    
                    withDockerRegistry(credentialsId: 'jenkins_registry', url: 'https://registry.sme.prefeitura.sp.gov.br/repository/sme-registry/') {
                        sh """
                            docker pull registry.sme.prefeitura.sp.gov.br/devops/cypress-agent:14.5.2
                            docker run \
                                --rm \
                                -e CI=true \
                                ${envFlags} \
                                -v "\$WORKSPACE/testes/ui:/app" \
                                -w /app \
                                registry.sme.prefeitura.sp.gov.br/devops/cypress-agent:14.5.2 \
                                sh -c "rm -rf allure-results && \
                                       npm install --legacy-peer-deps && \
                                       npm install cypress-cloud@1.13.1 \
                                       @shelex/cypress-allure-plugin allure-mocha crypto-js@4.1.1 --save-dev && \
                                       npx cypress-cloud run \
                                            --parallel \
                                            --browser chrome \
                                            --headed true \
                                            --record \
                                            --key somekey \
                                            --reporter mocha-allure-reporter \
                                            --reporter-options reportDir=allure-results \
                                            --ci-build-id ${BUILD_ID_UNIQUE} && \
                                        chown 1001:1001 * -R || true && \
                                        chmod 777 * -R || true"
                        """
                    }

                    echo "Testes Cypress finalizados."
                    
                    def logText = currentBuild.rawBuild.getLog(100).join('\n')
                    
                    def matchUrl = logText =~ /Recorded Run:\s*(https?:\/\/\S+)/
                    if (matchUrl) {
                        env.CYPRESS_RUN_URL = matchUrl[0][1]
                    }
                    
                    if (logText.contains('No specs executed')) {
                        echo "ERRO: Nenhum teste foi executado!"
                        echo "Verifique o conflito de specs no cypress-cloud."
                        error("Pipeline abortado: Nenhum teste executado. Verifique os logs acima.")
                    }
                    
                    def matchSpecs = logText =~ /(\d+)\s+of\s+(\d+)\s+spec files? complete/
                    if (!matchSpecs) {
                        echo "Aviso: Não foi possível confirmar a execução dos specs."
                    } else {
                        echo "Specs executados: ${matchSpecs[0][1]} de ${matchSpecs[0][2]}"
                    }
                }
            }
        }

        stage('Gerar Relatório Allure') {
            steps {
                script {
                    catchError(buildResult: 'SUCCESS', stageResult: 'SUCCESS') {
                        def hasResults = fileExists("${ALLURE_PATH}") && sh(script: "ls -A ${ALLURE_PATH} | wc -l", returnStdout: true).trim() != "0"

                        if (hasResults) {
                            echo "Gerando relatório Allure..."
                            sh """
                                export JAVA_HOME=\$(dirname \$(dirname \$(readlink -f \$(which java)))); \
                                export PATH=\$JAVA_HOME/bin:/usr/local/bin:\$PATH; \
                                allure generate ${ALLURE_PATH} --clean --output testes/ui/allure-report; \
                                cd testes/ui; \
                                zip -r allure-results-${BUILD_NUMBER}-\$(date +"%d-%m-%Y").zip allure-results
                            """
                        } else {
                            echo "Nenhum resultado Allure encontrado em ${ALLURE_PATH}."
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                withDockerRegistry(credentialsId: 'jenkins_registry', url: 'https://registry.sme.prefeitura.sp.gov.br/repository/sme-registry/') {
                    sh '''
                        docker pull registry.sme.prefeitura.sp.gov.br/devops/cypress-agent:14.5.2
                        docker run \
                            --rm \
                            -v "$WORKSPACE:/app" \
                            -w /app \
                            registry.sme.prefeitura.sp.gov.br/devops/cypress-agent:14.5.2 \
                            sh -c "rm -rf package-lock.json node_modules/ || true && chown 1001:1001 * -R || true  && chmod 777 * -R || true"
                    '''
                }
                
                if (fileExists("${ALLURE_PATH}") && sh(script: "ls -A ${ALLURE_PATH} | wc -l", returnStdout: true).trim() != "0") {
                    allure includeProperties: false, jdk: '', results: [[path: "${ALLURE_PATH}"]]
                } else {
                    echo "Resultados do Allure não encontrados ou vazios, plugin não será acionado."
                }

                def zipExists = sh(script: "ls testes/ui/allure-results-*.zip 2>/dev/null || true", returnStdout: true).trim()
                if (zipExists) {
                    archiveArtifacts artifacts: 'testes/ui/allure-results-*.zip', fingerprint: true
                } else {
                    echo "Nenhum .zip de Allure encontrado para arquivamento."
                }
            }
        }

        success { sendTelegram("<b>SUCESSO</b>") }
        unstable { sendTelegram("<b>INSTAVEL</b>") }
        failure { sendTelegram("<b>FALHA</b>\n") }
        aborted { sendTelegram("<b>CANCELADO</b>\n") }
    }
}


def sendTelegram(message) {
    def messageTemplate = (
        "<b>Job Name:</b> <a href='${JOB_URL}'>${JOB_NAME}</a>\n\n" +
        "<b>Status:</b> ${message}\n" +
        "<b>Build Number:</b> ${BUILD_DISPLAY_NAME}\n" +
        "<b>Dashboard Link:</b> <a href='${env.CYPRESS_RUN_URL}'>Resultados no dashboard</a>\n" +
        "<b>Log:</b> <a href='${env.BUILD_URL}console'>Ver console output</a>"
    )
    
    def encodedMessage = URLEncoder.encode(messageTemplate, "UTF-8")

    withCredentials([string(credentialsId: 'telegramTokensigpae', variable: 'TOKEN'),
    string(credentialsId: 'telegramChatIdsigpae', variable: 'CHAT_ID')]) {
        response = httpRequest (consoleLogResponseBody: true,
            contentType: 'APPLICATION_JSON',
            httpMode: 'GET',
            url: 'https://api.telegram.org/bot'+"$TOKEN"+'/sendMessage?text='+encodedMessage+'&chat_id='+"$CHAT_ID"+'&parse_mode='+"HTML"+'&disable_web_page_preview=true',
            validResponseCodes: '200')
        return response
    }
}
