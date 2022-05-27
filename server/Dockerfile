FROM python:alpine
COPY requirements.txt ./
RUN pip install -r requirements.txt

WORKDIR /app
COPY ./sschat .

CMD ["gunicorn", "sschat.wsgi", "-b", "0.0.0.0:8000"]