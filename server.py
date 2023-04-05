import os
import pickle
import sys
from typing import List
import aiofiles as aiofiles
import face_recognition
from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi import exceptions
from  fastapi.responses import FileResponse

app = FastAPI()

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount('/static', StaticFiles(directory='static', html=True), name='static')

async def train_model_by_img(user):
    if not os.path.exists(f"db/photos/{user}"):
        print("[ERROR] there is no directory 'dataset'")
        sys.exit()

    known_encodings = []
    images = os.listdir(f"db/photos/{user}")

    for image in images:
        face_img = face_recognition.load_image_file(f"db/photos/{user}/{image}")
        founded_faces = face_recognition.face_encodings(face_img)
        if len(founded_faces) == 0:
            continue
        face_enc = founded_faces[0]



        if len(known_encodings) == 0:
            known_encodings.append(face_enc)
        else:
            for item in known_encodings:
                result = face_recognition.compare_faces([face_enc], item)
                if result[0]:
                    known_encodings.append(face_enc)
                    break
                else:
                    break

    data = {
        "user": user,
        "encodings": known_encodings
    }

    with open(f"db/models/{user}_encodings.pickle", "wb") as file:
        file.write(pickle.dumps(data))


@app.post("/reg")
async def post_endpoint(files: List[UploadFile], user: str = None):
    try:
        os.mkdir(f'db/photos/{user}')
    except:
        return exceptions.ValidationError('Invalid user')
    for file in files:
        async with aiofiles.open(f"db/photos/{user}/{file.filename}", 'wb') as out_file:
            content = await file.read()
            await out_file.write(content)

    await train_model_by_img(user)

    return {"message": "OK"}


@app.get("/")
async def index():
    return FileResponse('./static/reg_page/index.html', media_type='text/html')