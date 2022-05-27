FROM python:alpine
COPY requirements.txt ./
RUN pip install -r requirements.txt

WORKDIR /app
COPY ./sschat .

# Initialize an empty database
ENV SECRET_KEY=${SECRET_KEY}
RUN python3 manage.py flush --noinput

CMD ["gunicorn", "sschat.wsgi", "-b", "0.0.0.0:8000"]