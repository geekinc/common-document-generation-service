docker container run \
  --name local-carbone \
  -p 4000:4000 \
  --platform linux/amd64 \
  --volume=$(pwd)/key:/key \
  --env CARBONE_EE_LICENSEDIR=/key \
  --entrypoint ./carbone-ee-linux \
  carbone/carbone-ee:latest \
  webserver
