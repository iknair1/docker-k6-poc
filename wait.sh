#!/bin/bash
set -e

host="$1"
shift

echo "waiting for ${host}"
until curl -sfk ${host}; do
  printf "."
  sleep 1
done
sleep 5
echo "${host} is now available."
echo "executing command..."
exec "$@"