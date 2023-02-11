# Python program implementing Image Steganography

# PIL module is used to extract
# pixels of image and modify it
from PIL import Image

# Convert encoding data into 8-bit binary
# form using ASCII value of characters
def genData(data):

		# list of binary codes
		# of given data
		newd = []

		for i in data:
			newd.append(format(ord(i), '08b'))
		return newd

# Pixels are modified according to the
# 8-bit binary data and finally returned
def modPix(pix, data):

	datalist = genData(data)
	lendata = len(datalist)
	imdata = iter(pix)

	for i in range(lendata):

		# Extracting 3 pixels at a time
		pix = [value for value in imdata.__next__()[:3] +
								imdata.__next__()[:3] +
								imdata.__next__()[:3]]

		# Pixel value should be made
		# odd for 1 and even for 0
		for j in range(0, 8):
			if (datalist[i][j] == '0' and pix[j]% 2 != 0):
				pix[j] -= 1

			elif (datalist[i][j] == '1' and pix[j] % 2 == 0):
				if(pix[j] != 0):
					pix[j] -= 1
				else:
					pix[j] += 1
				# pix[j] -= 1

		# Eighth pixel of every set tells
		# whether to stop ot read further.
		# 0 means keep reading; 1 means the
		# message is over.
		if (i == lendata - 1):
			if (pix[-1] % 2 == 0):
				if(pix[-1] != 0):
					pix[-1] -= 1
				else:
					pix[-1] += 1

		else:
			if (pix[-1] % 2 != 0):
				pix[-1] -= 1

		pix = tuple(pix)
		yield pix[0:3]
		yield pix[3:6]
		yield pix[6:9]

def encode_enc(newimg, data):
	w = newimg.size[0]
	z = newimg.size[1]
	(strx, stry) = (input("input a number pair less than {},{}: ".format(w, z))).split(",")
	x = int(strx)
	y = int(stry)
	# (x, y) = (0, 0)

	try:
		for pixel in modPix(newimg.getdata(), data):

			# Putting modified pixels in the new image
			newimg.putpixel((x, y), pixel)
			if (x == w - 1):
				x = 0
				y += 1
			else:
				x += 1
	except:
		print("Data too large for image at the specified indexies. Please try a lower number, less data, or a larger image")
		encode()

# Encode data into image
def encode():
	try:
		img = input("Enter image name(with extension) : ")
		image = Image.open(img, 'r')

		data = input("Enter data to be encoded : ")
		if (len(data) == 0):
			raise ValueError('Data is empty')

		newimg = image.copy()
		encode_enc(newimg, data)

		new_img_name = input("Enter the name of new image(with extension) : ")
		newimg.save(new_img_name, str(new_img_name.split(".")[1].upper()))
	except:
		print("error")
		main()

# Decode the data in the image
def decode():
	try:
		img = input("Enter image name(with extension) : ")
		image = Image.open(img, 'r')
	
		w = image.size[0]
		z = image.size[1]
		(strx, stry) = (input("number pair: ")).split(",")
		x = int(strx)
		y = int(stry)

		data = ''
		imgdata = iter(image.getdata())

		while (True):
			newpixels = []
			for i in range(3):
				newpixels += image.getpixel((x, y))[:3]
				if (x == w - 1):
					x = 0
					y += 1
				else:
					x += 1
			# print("newpixels = ", newpixels)
			# # pixelsNum = pixels[0] + pixels[1] + pixels[2]
			# pixels = [value for value in imgdata.__next__()[:3] +
			# 						imgdata.__next__()[:3] +
			# 						imgdata.__next__()[:3]]
			# print("pixels = ", pixels)

			# string of binary data
			binstr = ''

			for i in newpixels[:8]:
				if (i % 2 == 0):
					binstr += '0'
				else:
					binstr += '1'

			data += chr(int(binstr, 2))
			if (newpixels[-1] % 2 != 0):
				return data
	except:
		print("error")
		return ""

# Main Function
def main():
	a = int(input("1. Encode\n2. Decode\n3. Exit\n"))
	if (a == 1):
		encode()
		main()

	elif (a == 2):
		print("Decoded Word : " + decode())
		main()
	elif (a == 3):
		print("")
	else:
		raise Exception("Enter correct input")

# Driver Code
# if __name__ == '__main__' :

# Calling main function
"*~ Welcome to our Stegger! ~*\n"
main()
