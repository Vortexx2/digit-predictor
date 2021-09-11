from typing import Optional

import logging
logging.basicConfig(level=logging.DEBUG)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from model import DigitModel

app = FastAPI()
model = DigitModel()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PostModel(BaseModel):
  generated_at: Optional[str]
  image: str


@app.get('/')
def read_root():
  return {"Hello": "World"}


@app.post('/predict')
def predict_digit(x: PostModel):
  logging.debug(x.generated_at)
  return x
