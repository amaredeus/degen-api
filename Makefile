.DEFAULT_GOAL := help
.PHONY: help

## Prints make command list
help:
	@printf "\nusage: make <commands> \n\n"
	@cat Makefile | awk '/^#{2,2} .*/ { print; getline; gsub(/:.*/, ""); print; }' | awk '{ getline x; print x; }1' | awk '{gsub(":", ""); key=$$0; getline; gsub("## ", ""); printf("%02d ", i++); printf  "%.43s %s\n", "\033[36m"key"\033[0m \033[35m....................................", "\033[0m\033[34m"$$0"\033[0m"}'
	@printf "\n"
# > only works in bash like shells

#################
##### Setup #####
#################

## Installs npm packages locally & inits .env
install:
	npm install
	npx shx cp -n sample.env .env

#################
##### Start #####
#################

## Starts the NestJS API
start.api:
	npx nx run degen-api:serve

## Starts the mongo db
start.db:
	docker-compose -p degen-api -f docker-compose.yaml up -d degen-api-db

## Starts all detached containers & the NestJS API
start: start.db start.api

#################
##### Build #####
#################

## Builds the prod API image
build.api:
	npx nx run degen-api:build
	docker build -f api.prod.dockerfile -t degen-api .

################
##### Stop #####
################

## Stops all detached containers
stop:
	docker-compose -p degen-api -f docker-compose.yaml down || truncate

################
##### Misc #####
################

version:
	npx standard-version