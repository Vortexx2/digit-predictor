from typing import Optional

import logging
logging.basicConfig(level=logging.DEBUG)

import base64
from io import BytesIO
from PIL import Image

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from model import DigitModel
import numpy as np
import torch
from torchvision.transforms import ToTensor


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
  im_file = BytesIO(base64.b64decode(x.image))
  img = Image.open(im_file)
  trans = ToTensor()
  img_tensor = trans(img)
  
  # logging.debug(torch.unique(img_tensor))
  logging.debug(img_tensor)
  
  # logging.debug(x.generated_at)
  return x
