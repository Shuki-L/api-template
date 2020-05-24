NAME = swg-pac

all: health

health:
	curl http://localhost:8123/api/v1/health

start:
	docker-compose up -d

dev:
	npm run dev

test:
	npm run test

lint:
	npm run lint

stop:
	docker ps | grep 'swg-pac' | awk '{print $$1}' | xargs docker stop 
	docker ps | grep 'localstack' | awk '{print $$1}' | xargs docker stop 
	docker ps | grep 'pac-svc-statsd' | awk '{print $$1}' | xargs docker stop 
	









