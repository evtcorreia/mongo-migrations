#!/bin/bash

if [ $# -ne 1 ]; then
  echo "Usage: $0 <tag>"
  echo "Ex: $0 1.10.40"
  exit 1
fi

echo "Abrindo release/$1"

git flow release start $1

git flow release publish

echo "Atualizando a branch staging"

git checkout staging

git pull

git merge release/$1

git push

echo "Atualizando a branch master"

git checkout master

git pull

git merge release/$1

git push

echo "Finalizando release/$1"

git checkout release/$1

git flow release finish $1

git push

git push --tags

git checkout develop

echo "Script finalizado - release/$1 fechada"
