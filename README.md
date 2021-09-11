# Digit Recognizer

A beginner's take on deployment of an ML model for digit recognition trained on the MNIST dataset. Built to be hosted locally only, and to learn more about deployment of ML APIs.

## Client

To start the client locally, use a Live Server development server to host the client HTML page.

## Server

1. Create a conda environment and install the required dependencies with conda.

- `conda env create --name fastapi-ml --file environment.yml`

2. In the `server` directory, run the following command to start a uvicorn ASGI development server.

- `uvicorn main:app --reload`

