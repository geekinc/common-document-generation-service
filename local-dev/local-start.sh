# --------------------- MySQL ---------------------
docker run \
  --name local-mysql \
  -d \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=Sunshine123! \
  -v $(pwd):/opt/local-dev \
  mysql \
  --default-authentication-plugin=mysql_native_password

# --------------------- ElasticMQ ---------------------
docker run \
  --name local-elasticmq \
  -d \
  -p 9324:9324 \
  -p 9325:9325 \
  -v `pwd`/elasticmq/config.conf:/opt/elasticmq.conf \
  -v `pwd`/elasticmq/logback.xml:/opt/logback.xml \
  softwaremill/elasticmq

# --------------------- Keycloak ---------------------
docker run \
  --name local-keycloak \
  -d \
  -p 8080:8080 \
  -p 8090:8090 \
  -v $(pwd):/opt/local-dev \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:23.0.6 \
  start-dev


# Wait for containers to complete initialization
sleep 30

# Post startup setup commands
# -----------------------------------------------------

# Create the database
docker exec \
  -i local-mysql \
  /bin/sh -c 'mysql --defaults-extra-file=/opt/local-dev/mysql/config.conf < /opt/local-dev/mysql/create-tables.sql'

# Populate the database
docker exec \
  -i local-mysql \
  /bin/sh -c 'mysql --defaults-extra-file=/opt/local-dev/mysql/config.conf < /opt/local-dev/mysql/populate-tables.sql'

# Verify credentials
docker exec \
  -i local-keycloak \
  /bin/sh -c '/opt/keycloak/bin/kcadm.sh config credentials --server http://localhost:8080 --realm master --user admin --password admin'

# Create the client
docker exec \
  -i local-keycloak \
  /bin/sh -c 'cat /opt/local-dev/keycloak/client.json | /opt/keycloak/bin/kcadm.sh create clients --realm master --server http://localhost:8080 --user admin --password admin -f -'

# Create the basic application admin role
docker exec \
  -i local-keycloak \
  /bin/sh -c '/opt/keycloak/bin/kcadm.sh create roles -s name=app_admin --server http://localhost:8080 --realm master --user admin --password admin'

# Create the basic application user role
docker exec \
  -i local-keycloak \
  /bin/sh -c '/opt/keycloak/bin/kcadm.sh create roles -s name=app_user --server http://localhost:8080 --realm master --user admin --password admin'

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

# Apply an application admin role to the user
docker exec \
  -i local-keycloak \
  /bin/sh -c '/opt/keycloak/bin/kcadm.sh add-roles --uusername foo --rolename app_admin --server http://localhost:8080 --realm master --user admin --password admin'

# Apply an application user role to the user
docker exec \
  -i local-keycloak \
  /bin/sh -c '/opt/keycloak/bin/kcadm.sh add-roles --uusername foo --rolename app_user --server http://localhost:8080 --realm master --user admin --password admin'

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

