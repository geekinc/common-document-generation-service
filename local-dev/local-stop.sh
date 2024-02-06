docker stop local-mysql
docker stop local-elasticmq
docker stop local-keycloak

docker rm local-mysql
docker rm local-elasticmq
docker rm local-keycloak

# Delete everything in the S3 bucket (except the .placeholder file for git to keep the directory)
find serverless-s3-local/cdgs-templates/ -type f -not -name '.placeholder' -delete
