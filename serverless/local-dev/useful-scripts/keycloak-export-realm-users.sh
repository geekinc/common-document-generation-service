#!/bin/bash

# Create the client
docker exec \
  -i local-keycloak \
  /bin/sh -c '/opt/keycloak/bin/kc.sh export --file /tmp/realm-export.json --realm master && cat /tmp/realm-export.json'
