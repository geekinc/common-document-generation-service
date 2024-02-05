#!/bin/bash

# Create the client
docker exec \
  -i local-keycloak \
  /bin/sh -c 'cat /opt/local-dev/keycloak/client.json | /opt/keycloak/bin/kcadm.sh create clients --realm master --server http://localhost:8080 --user admin --password admin -f -'
