import torch
from torchvision import transforms
import numpy as np


class DigitModel:
  """Loads model state into memory and will be used to make predictions"""

  def __init__(self, checkpoint_path: str = 'mnist-model.pth'):
    # initialize the device model will be running on
    self.dev = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

    # initialise the model with its state to subsequently make predictions in the `predict` function
    checkpoint = torch.load(checkpoint_path)
    self.model = checkpoint['model']
    self.model.load_state_dict(checkpoint['state_dict'])

    for param in self.model.parameters():
      param.requires_grad = False

    self.model.eval()

  def predict(self, x: np.ndarray):
    trans = transforms.Compose([transforms.ToTensor(), transforms.Normalize((0.5,), (0.5,))])

    x = trans(x)
    x = x.to(self.dev)
    x = x.reshape(784)

    return self.model(x)
