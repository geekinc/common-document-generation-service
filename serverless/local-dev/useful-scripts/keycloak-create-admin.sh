#!/bin/bash

# Create the application admin user
docker exec \
  -i local-keycloak \
  /bin/sh -c '/opt/keycloak/bin/kcadm.sh create users -s username=foo -s email=foo@example.com -s enabled=true -s emailVerified=true --server http://localhost:8080 --realm master --user admin --password admin'

# Create the password
docker exec \
  -i local-keycloak \
  /bin/sh -c '/opt/keycloak/bin/kcadm.sh set-password --username foo --new-password 456 --server http://localhost:8080 --realm master --user admin --password admin'

# Apply an admin role to the user
docker exec \
  -i local-keycloak \
  /bin/sh -c '/opt/keycloak/bin/kcadm.sh add-roles --uusername foo --rolename admin --server http://localhost:8080 --realm master --user admin --password admin'
