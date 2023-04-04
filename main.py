import os

import face_recognition
from PIL import Image, ImageDraw
import pickle
from cv2 import cv2

from webcam import WebcamStream


def face_rec():
    gal_face_img = face_recognition.load_image_file("img/gal1.jpg")
    gal_face_location = face_recognition.face_locations(gal_face_img)

    justice_league_img = face_recognition.load_image_file("img/justice_league_actors.jpg")
    justice_league_faces_locations = face_recognition.face_locations(justice_league_img)

    # print(gal_face_location)
    # print(justice_league_faces_locations)
    # print(f"Found {len(gal_face_location)} face(s) in this image")
    # print(f"Found {len(justice_league_faces_locations)} face(s) in this image")

    pil_img1 = Image.fromarray(gal_face_img)
    draw1 = ImageDraw.Draw(pil_img1)

    for(top, right, bottom, left) in gal_face_location:
        draw1.rectangle(((left, top), (right, bottom)), outline=(255, 255, 0), width=4)

    del draw1
    pil_img1.save("img/new_gal1.jpg")

    pil_img2 = Image.fromarray(justice_league_img)
    draw2 = ImageDraw.Draw(pil_img2)

    for(top, right, bottom, left) in justice_league_faces_locations:
        draw2.rectangle(((left, top), (right, bottom)), outline=(255, 255, 0), width=4)

    del draw2
    pil_img2.save("img/new_justice_league.jpg")


def extracting_faces(img_path):
    count = 0
    faces = face_recognition.load_image_file(img_path)
    faces_locations = face_recognition.face_locations(faces)

    for face_location in faces_locations:
        top, right, bottom, left = face_location

        face_img = faces[top:bottom, left:right]
        pil_img = Image.fromarray(face_img)
        pil_img.save(f"img/{count}_face_img.jpg")
        count += 1

    return f"Found {count} face(s) in this photo"


def compare_faces(img1_path, img2_path):
    img1 = face_recognition.load_image_file(img1_path)
    img1_encodings = face_recognition.face_encodings(img1)[0]
    # print(img1_encodings)

    img2 = face_recognition.load_image_file(img2_path)
    img2_encodings = face_recognition.face_encodings(img2)[0]

    result = face_recognition.compare_faces([img1_encodings], img2_encodings)
    # print(result)

    if result[0]:
        print("Welcome to the club! :*")
    else:
        print("Sorry, not today... Next!")


def compare_user_with_encodings(screenshot, screenshot_encodings, screenshot_locations, users_models):
    for face_encoding, face_location in zip(screenshot_encodings, screenshot_locations):

        founded_user = None

        for user_model in users_models:
            user_encodings = user_model['encodings']
            result = face_recognition.compare_faces(user_encodings, face_encoding)

            if result.count(True) > 3:
                founded_user = user_model["user"]

        if founded_user:
            print(f'Нашли {founded_user}')
            left_top = (face_location[3], face_location[0])
            right_bottom = (face_location[1], face_location[2])
            color = [0, 255, 0]
            cv2.rectangle(screenshot, left_top, right_bottom, color, 4)

            left_bottom = (face_location[3], face_location[2])
            right_bottom = (face_location[1], face_location[2] + 20)
            cv2.rectangle(screenshot, left_bottom, right_bottom, color, cv2.FILLED)
            cv2.putText(
                screenshot,
                founded_user,
                (face_location[3] + 10, face_location[2] + 15),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (255, 255, 255),
                4
            )


def watch_video_for_users():
    users_models=[]
    if len(os.listdir(f"db/models")) > 0:
        users_models = [pickle.loads(open(f"db/models/{model_file}", "rb").read()) for model_file in os.listdir(f"db/models")]

    webcam_stream = WebcamStream(stream_id=0)
    webcam_stream.start()
    num_frames_processed = 0
    while True:
        current_users_models = os.listdir(f"db/models")

        if len(users_models) != len(current_users_models):
            users_models = [pickle.loads(open(f"db/models/{model_file}", "rb").read()) for model_file in current_users_models]

        screenshot = webcam_stream.read()

        screenshot_locations = face_recognition.face_locations(screenshot)
        screenshot_encodings = face_recognition.face_encodings(screenshot, screenshot_locations)

        if len(current_users_models) > 0:
            compare_user_with_encodings(screenshot=screenshot,
                                        screenshot_locations=screenshot_locations,
                                        screenshot_encodings=screenshot_encodings,
                                        users_models=users_models
                                        )
        num_frames_processed += 1

        cv2.imshow('dd', screenshot)
        k = cv2.waitKey(1)
        if k == ord("q"):
            print("Q pressed, closing the app")
            break



# async def detect_person_in_video():
#     data = os.listdir(f"db/models")
#
#
#
#     data = pickle.loads(open(f"db/models/{user}_encodings.pickle", "rb").read())
#     video = cv2.VideoCapture(0)
#
#     while True:
#         ret, image = video.read()
#
#         locations = face_recognition.face_locations(image)
#         encodings = face_recognition.face_encodings(image, locations)
#
#         for face_encoding, face_location in zip(encodings, locations):
#             result = face_recognition.compare_faces(data["encodings"], face_encoding)
#             match = None
#             print(result)
#             if result.count(True) > 3:
#                 match = data["name"]
#                 print(f"Match found! {match}")
#             else:
#                 print("ACHTUNG! ALARM!")
#
#             left_top = (face_location[3], face_location[0])
#             right_bottom = (face_location[1], face_location[2])
#             color = [0, 255, 0]
#             cv2.rectangle(image, left_top, right_bottom, color, 4)
#
#             left_bottom = (face_location[3], face_location[2])
#             right_bottom = (face_location[1], face_location[2] + 20)
#             cv2.rectangle(image, left_bottom, right_bottom, color, cv2.FILLED)
#             cv2.putText(
#                 image,
#                 match,
#                 (face_location[3] + 10, face_location[2] + 15),
#                 cv2.FONT_HERSHEY_SIMPLEX,
#                 1,
#                 (255, 255, 255),
#                 4
#             )
#
#         cv2.imshow("detect_person_in_video is running", image)
#
#         k = cv2.waitKey(10000)
#         if k == ord("q"):
#             print("Q pressed, closing the app")
#             break


def main():
    # face_rec()
    # print(extracting_faces("img/justice_league_actors.jpg"))
    # compare_faces("img/gal1.jpg", "img/gal2.jpg")

    watch_video_for_users()



if __name__ == '__main__':
    main()
