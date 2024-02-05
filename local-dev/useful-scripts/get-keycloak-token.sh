#!/bin/bash

curl -X POST 'http://localhost:8080/realms/master/protocol/openid-connect/token' \
 --header 'Content-Type: application/x-www-form-urlencoded' \
 --data-urlencode 'grant_type=password' \
 --data-urlencode 'client_id=local-client' \
 --data-urlencode 'client_secret=1f88bd14-7e7f-45e7-be27-d680da6e48d8' \
 --data-urlencode 'username=foo' \
 --data-urlencode 'password=123'
