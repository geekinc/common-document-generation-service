docker run \
  --name local-mysql \
  -d \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=Sunshine123! \
  -v $(pwd):/opt/local-dev \
  mysql \
  --default-authentication-plugin=mysql_native_password

docker run \
  --name local-elasticmq \
  -d \
  -p 9324:9324 \
  -p 9325:9325 \
  -v `pwd`/elasticmq/config.conf:/opt/elasticmq.conf \
  -v `pwd`/elasticmq/logback.xml:/opt/logback.xml \
  softwaremill/elasticmq

# Wait for MySQL to start
sleep 20

docker exec \
  -i local-mysql \
  /bin/sh -c 'mysql --defaults-extra-file=/opt/local-dev/mysql/config.conf < /opt/local-dev/mysql/create-tables.sql'
