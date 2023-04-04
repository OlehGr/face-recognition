import os
import pickle
import sys
import face_recognition
from cv2 import cv2


def train_model_by_img(name):

    if not os.path.exists(f"dataset/{name}"):
        print("[ERROR] there is no directory 'dataset'")
        sys.exit()

    known_encodings = []
    images = os.listdir(f"dataset/{name}")

    for image in images:

        face_img = face_recognition.load_image_file(f"dataset/{image}")
        face_enc = face_recognition.face_encodings(face_img)[0]

        if len(known_encodings) == 0:
            known_encodings.append(face_enc)
        else:
            for item in range(0, len(known_encodings)):
                result = face_recognition.compare_faces([face_enc], known_encodings[item])
                if result[0]:
                    known_encodings.append(face_enc)
                    break
                else:
                    break

    data = {
        "name": name,
        "encodings": known_encodings
    }

    with open(f"{name}_encodings.pickle", "wb") as file:
        file.write(pickle.dumps(data))


def take_screenshot_from_video(path):
    cap = cv2.VideoCapture(path)
    count = 0

    if not os.path.exists("dataset_from_video"):
        os.mkdir("dataset_from_video")

    while True:
        ret, frame = cap.read()
        fps = cap.get(cv2.CAP_PROP_FPS)
        multiplier = fps * 3
        # print(fps)

        if ret:
            frame_id = int(round(cap.get(1)))
            # print(frame_id)
            cv2.imshow("frame", frame)
            k = cv2.waitKey(20)

            print(frame_id % multiplier)
            if count >= 10:
                break
                print('Comleted')

            if frame_id % multiplier == 0:
                cv2.imwrite(f"dataset_from_video/{count}.jpg", frame)
                print(f"Take a screenshot {count}")
                count += 1

            if k == ord(" "):
                cv2.imwrite(f"dataset_from_video/{count}_extra_scr.jpg", frame)
                print(f"Take an extra screenshot {count}")
                count += 1



        else:
            print("[Error] Can't get the frame...")
            break

    cap.release()
    cv2.destroyAllWindows()


def main():
    print(train_model_by_img('Oleg'))
    # take_screenshot_from_video("video.mp4")


if __name__ == '__main__':
    main()
