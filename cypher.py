import glob
import os

def encrypt(text,s):
  result = ""
    # transverse the plain text
  for i in range(len(text)):
    char = text[i]
    result += chr((ord(char) + s - 97) % 26 + 97)
  return result

path = r"C:/Users/alybe/Desktop/Nuevo bot/assets/Champs/"
abilities = glob.glob(r'assets/Champs/*.png')
shift = 15

for file in abilities:
  ability = file.split('.')[0].split('Champs\\')[1]
  os.rename(path+ability+'.png',path +encrypt(ability.lower(),shift)+'.png')