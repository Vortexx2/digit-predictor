from typing import List

from fastapi import FastAPI
from model import DigitModel
import torch

app = FastAPI()
model = DigitModel()


@app.get('/')
def read_root():
  return {"Hello": "World"}


# @app.post('/predict')
# def predict_digit(x: List[List[int]]):

