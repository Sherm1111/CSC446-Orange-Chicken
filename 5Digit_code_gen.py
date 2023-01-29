import time
import hashlib


def generate_5Digit_code():
    secret_key = "secret".encode()

    current_time = time.time()
    rounded_time_30sec = str(int(current_time - (current_time % 30))).encode()

    data = rounded_time_30sec + secret_key

    hashlib_object = hashlib.sha256()
    hashlib_object.update(data)
    hashed_code = hashlib_object.hexdigest()

    return hashed_code[0:5]

code = generate_5Digit_code()
print(code, flush = True)
time.sleep(2)

while (True):
    # print("a")
    time.sleep(1)
    newcode = generate_5Digit_code()
    if(newcode != code):
        print(newcode, flush = True)
        code = newcode