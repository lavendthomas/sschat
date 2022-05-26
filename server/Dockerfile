FROM python:alpine
COPY requirements.txt ./
RUN pip install -r requirements.txt

WORKDIR /app
COPY ./sschat .

CMD ["gunicorn", "sschat.wsgi"]