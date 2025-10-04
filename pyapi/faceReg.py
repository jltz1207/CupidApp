import face_recognition
import base64
from PIL import Image
import io
import requests


    

def PreprocessEncoding():
    r = requests.get(url = "https://localhost:7053/api/Summary/GetAllUserPhotos", verify=False)
    pre_user_photos_database = r.json()
    res ={}
    index=0
    for user_id, user_photos_base64 in pre_user_photos_database.items():
        index+=1
        photoEncodings = []
        for user_photo_base64 in user_photos_base64:

            user_photo_bytes = base64.b64decode(user_photo_base64)
            user_photo = face_recognition.load_image_file(io.BytesIO(user_photo_bytes))
            
            user_face_locations = face_recognition.face_locations(user_photo)
            if len(user_face_locations) == 0:
                print(f"No faces detected in the photo of user {user_id}.")
                continue
        
            user_face_encodings = face_recognition.face_encodings(user_photo)

            if len(user_face_encodings) == 0:
                print(f"No face encodings found in the photo of user {user_id}.")
                continue
            user_face_encoding = user_face_encodings[0]
            photoEncodings.append(user_face_encoding)
        
        print(f"Done for {user_id}, {index}/{len(pre_user_photos_database)}")
        res[user_id] = photoEncodings

    print(f'Finished. {res}')
    return res

pre_user_photos_database = PreprocessEncoding()

def update_face_encodings(user_id, profileByteList):
    photoEncodings = []
    
    for user_photo_base64 in profileByteList:
        user_photo_bytes = base64.b64decode(user_photo_base64)
        user_photo = face_recognition.load_image_file(io.BytesIO(user_photo_bytes))
            
        user_face_locations = face_recognition.face_locations(user_photo)
        if len(user_face_locations) == 0:
            print(f"No faces detected in the photo of user {user_id}.")
            continue
        
        user_face_encodings = face_recognition.face_encodings(user_photo)

        if len(user_face_encodings) == 0:
            print(f"No face encodings found in the photo of user {user_id}.")
            continue
        user_face_encoding = user_face_encodings[0]
        photoEncodings.append(user_face_encoding)

    print("Old: " ,pre_user_photos_database[user_id])
    pre_user_photos_database[user_id] = photoEncodings
    print("New: " ,pre_user_photos_database[user_id])


def find_similar_face(new_image_base64, otherUserIds):
    if pre_user_photos_database is None:
        print('pre_user_photos_database has not set up')
        return None

    new_image_bytes = base64.b64decode(new_image_base64)
    new_image = face_recognition.load_image_file(io.BytesIO(new_image_bytes))
    
    face_locations = face_recognition.face_locations(new_image)
    if len(face_locations) == 0:
        print("No faces detected in the new image.")
        return None  # No faces detected 
    
    new_face_encodings = face_recognition.face_encodings(new_image)
    if len(new_face_encodings) == 0:
        print("No face encodings found in the new image.")
        return None
    new_face_encoding = new_face_encodings[0]

    best_match_user = None
    best_match_distance = float('inf')

    for user_id in otherUserIds:
        user_face_distances = []

        photoEncodings = pre_user_photos_database[user_id]

        for photoEncoding in photoEncodings:
            # Compare
            face_distance = face_recognition.face_distance([new_face_encoding], photoEncoding)[0]
            user_face_distances.append(face_distance)

        if not user_face_distances:
            continue  

        avg_face_distance = sum(user_face_distances) / len(user_face_distances)
        print(f"{user_id}: {avg_face_distance}")

        if avg_face_distance < best_match_distance:
            best_match_user = user_id
            best_match_distance = avg_face_distance

    return best_match_user