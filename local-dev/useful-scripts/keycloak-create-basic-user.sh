#!/bin/bash


# Create the application general user
docker exec \
  -i local-keycloak \
  /bin/sh -c '/opt/keycloak/bin/kcadm.sh create users -s username=bar -s email=bar@example.com -s enabled=true -s emailVerified=true --server http://localhost:8080 --realm master --user admin --password admin'

# Create the password
docker exec \
  -i local-keycloak \
  /bin/sh -c '/opt/keycloak/bin/kcadm.sh set-password --username bar --new-password 456 --server http://localhost:8080 --realm master --user admin --password admin'

# Apply an application user role to the user
docker exec \
  -i local-keycloak \
  /bin/sh -c '/opt/keycloak/bin/kcadm.sh add-roles --uusername bar --rolename app_user --server http://localhost:8080 --realm master --user admin --password admin'

