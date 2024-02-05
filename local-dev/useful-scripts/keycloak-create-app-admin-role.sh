#!/bin/bash

# Create the basic application admin role
docker exec \
  -i local-keycloak \
  /bin/sh -c '/opt/keycloak/bin/kcadm.sh create roles -s name=app_admin --server http://localhost:8080 --realm master --user admin --password admin'
