docker build -t flask-app .
docker run -p 5000:5000 --name c-flask-app flask-app