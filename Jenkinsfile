@Library('shared@0.2')
import gd.mrx.ci.DockerStack

node('builder') {
    stage('Checkout') {
        checkout scm
    }
}

def stack = new gd.mrx.ci.DockerStack(this, 'localyfe-frontend', [
    project_name: 'localyfe',
    extra_env: { s ->
        backend_hostname = s.getAPIHostname('localyfe-backend', 'backend', 'develop')
        [
            "BACKEND_URL=http://${backend_hostname}/api/",
        ]
    }
])
stack.execute()
