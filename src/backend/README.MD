# Deployment

```bash
# into the folder of Dockerfile
cd backend
# build image from Dockerfile
docker build -t speakeasy_backend .
# create container from image
docker run -id --name=speakeasy_backend -p 6503:6503 \
-v $PWD:/home/node \
speakeasy_backend
```

Access the command line interface of container

```bash
docker attach speakeasy_backend
```