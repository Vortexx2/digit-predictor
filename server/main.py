from torchvision.transforms import ToTensor
import torch
import numpy as np
from model import DigitModel
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from PIL import Image, ImageOps
from io import BytesIO
import base64
from typing import Optional

import logging
logging.basicConfig(level=logging.DEBUG)


app = FastAPI()
model = DigitModel()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ImageModel(BaseModel):
  generated_at: Optional[str]
  image: str


class PredictionModel(BaseModel):
  prob: float
  num: int


@app.get('/')
def read_root():
  return {"Hello": "World"}


@app.post('/predict', response_model=PredictionModel)
def predict_digit(x: ImageModel):
  im_file = BytesIO(base64.b64decode(x.image))
  img = Image.open(im_file)
  img = img.resize((28, 28), resample=Image.BILINEAR)
  img = ImageOps.grayscale(img)
  trans = ToTensor()
  img_tensor = trans(img)

  prob_array = torch.exp(model.predict(img_tensor))
  predicted_num = torch.argmax(prob_array)

  logging.debug(prob_array)
  response = {
      "prob": prob_array[0, predicted_num],
      "num": predicted_num
  }
  return response
