docker build -t msanogo/multi-client:latest -f ./client/Dockerfile ./client
docker build -t msanogo/multi-client:$SHA -f ./client/Dockerfile ./client
docker build -t msanogo/multi-server:latest -f ./server/Dockerfile  ./server
docker build -t msanogo/multi-server:$SHA -f ./server/Dockerfile  ./server
docker build -t msanogo/multi-worker:latest -f ./worker/Dockerfile  ./worker
docker build -t msanogo/multi-worker:$SHA -f ./worker/Dockerfile  ./worker
docker push msanogo/multi-client:latest
docker push msanogo/multi-server:latest
docker push msanogo/multi-worker:latest
docker push msanogo/multi-client:$SHA
docker push msanogo/multi-server:$SHA
docker push msanogo/multi-worker:$SHA
kubectl apply -f k8s
kubectl set image deployments/server-deployment server=msanogo/multi-server:$SHA
kubectl set image deployments/client-deployment client=msanogo/multi-client:$SHA
kubectl set image deployments/worker-deployment worker=msanogo/multi-worker:$SHA