
# 🚙 PicReport - HackIdc 2021


PicReport is a web application, with a server written in python - flask and client written in vanilla js, jquery, html, css and bootstrap.
It will automatically fill in for you the insurance forms that need to be fill out in a car accident incident,
by provided images of - driver license, car license and car policy.

## How to run

You can run this app by following these steps.

```bash
git clone https://github.com/Shir-Nitzan/HackIdc2021.git
```

Text extraction:

You’ll need to install 2 libraries- 

OpenCV which used to load images use -
```bash
pip install opencv-python
```

Once this installation was successful, install PyTesseract which is the actual library that converts image into text;
first, use this link - https://github.com/UB-Mannheim/tesseract/wiki
to download the 64/32 bit version that matches your laptop. Once you got that cover, use - 
```bash
pip install pytesseract
```

In order to make sure this library will be compatible for hebrew as well, please download this file from github and save it in the following location- 
```bash
C:\Program Files\Tesseract-OCR\tessdata
```

For this library, we need to tell python where Tesseract is installed, the last line in the following code snippet does exactly that-
```bash
Import cv2
Import pytesseract
Pytesseract.pytesseract.tesseract_cmd = r'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'
```

Web - Application
Please install-
```bash
pip install flask
pip install flask-login
```

## Use case 📲
1. Run the python server from app.py start point.
2. Enter localhost:
```bash
http://127.0.0.1:8080/
```
3. Follow the demo:

![HackatonIDC2021](https://user-images.githubusercontent.com/62726511/120941407-4cbe6780-c72b-11eb-9158-a4371a007288.gif)

4. Once you upload images of driver license, car license and car policy, the app will automatically fill all of the forms details 📝.


