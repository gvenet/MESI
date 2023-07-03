FROM python:3.9-slim

WORKDIR /app

COPY requirements .

RUN pip install --no-cache-dir -r requirements

COPY . .

EXPOSE 5000

ENV FLASK_APP=back-end.py
ENV FLASK_RUN_HOST=0.0.0.0

CMD ["flask", "run"]
