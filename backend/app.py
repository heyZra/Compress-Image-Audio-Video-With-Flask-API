from flask import Flask, request, render_template, send_from_directory
import os
from pydub import AudioSegment
import soundfile as sf
import numpy as np
import subprocess as sp
import logging
from PIL import Image
import glob
from flask_cors import CORS, cross_origin
import time

app = Flask(__name__)
CORS(app)
UPLOAD_FOLDER = 'static/uploads'
COMPRESSED_FOLDER = 'static/compressed'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['COMPRESSED_FOLDER'] = COMPRESSED_FOLDER

# Explicitly set the path to ffmpeg
# os.environ["PATH"] += os.pathsep + r"C:\ffmpeg\bin"  # Update this path to your actual ffmpeg.exe path
os.environ["PATH"] += os.pathsep + r"C:\Program Files\ffmpeg\bin"  # Update this path to your actual ffmpeg.exe path
# os.environ["PATH"] += os.pathsep + r"usr\bin\ffmpeg"  # Update this path to your actual ffmpeg.exe path

def clear_folder(folder_path):
    files = glob.glob(os.path.join(folder_path, '*'))
    for f in files:
        os.remove(f)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        # Clear previous files
        clear_folder(app.config['UPLOAD_FOLDER'])
        clear_folder(app.config['COMPRESSED_FOLDER'])

        if 'file' not in request.files:
            return 'No file part'
        file = request.files['file']
        if file.filename == '':
            return 'No selected file'
        compression_type = request.form.get('compression_type')
        if file:
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
            file.save(file_path)
            
            # Perform compression
            compressed_file = compress_file(file_path, compression_type)
            
            # Return the download link
            # return render_template('index.html', filename=compressed_file)
            return compressed_file
    return render_template('index.html')

# @app.route('/download/<filename>')
# def download_file(filename):
#     return send_from_directory(app.config['COMPRESSED_FOLDER'], filename)

def compress_file(file_path, compression_type):
    if compression_type == 'mp3':
        return compress_to_mp3(file_path)
    elif compression_type == 'm4a':
        return compress_to_m4a(file_path)
    elif compression_type == 'mp4':
        return compress_to_mp4(file_path)
    elif compression_type == 'image':
        return compress_image(file_path)
    else:
        return None
    
def compress_image(file_path):
    file_name = os.path.basename(file_path)  # Get the file name
    nameCompressed = f'compressed_{os.path.splitext(file_name)[0].lower()}.jpeg'
    file_extension = os.path.splitext(file_name)[1].lower()
    compressed_image_path = os.path.join(app.config['COMPRESSED_FOLDER'], nameCompressed)
    
    start_time = time.time()  # Mulai pengukuran waktu

    with Image.open(file_path) as img:
        if file_extension in ['.png', '.jpeg', '.jpg']:
            img = img.convert("RGB")  # Convert to RGB mode
            img.save(compressed_image_path, "JPEG", optimize=True, quality=20)
        else:
            raise ValueError(f"Unsupported file extension: {file_extension}")
    
    end_time = time.time()  # Akhiri pengukuran waktu

    # Hitung waktu kompresi
    compression_time = end_time - start_time
    
    # Get original and compressed file sizes
    original_size = os.path.getsize(file_path) / 1024  # KB
    compressed_size = os.path.getsize(compressed_image_path) / 1024  # KB
    
    json_obj = {
        "url": [f"/static/compressed/{nameCompressed}"],
        "originalName": [file_name],
        "originalSize": [round(original_size, 2)],
        "compressedName": [nameCompressed],
        "compressedSize": [round(compressed_size, 2)],
        "compressionTime": [round(compression_time, 2)]  # Menambahkan waktu kompresi
    }
    return json_obj

def compress_to_mp3(file_path):
    # Mendapatkan nama berkas dan ekstensinya
    file_name, file_extension = os.path.splitext(os.path.basename(file_path))
    file_extension = file_extension.lower()

    # Menyiapkan nama file untuk file terkompresi
    name_compressed = f'compressed_{file_name.lower()}'
    compressed_mp3_path = os.path.join(app.config['COMPRESSED_FOLDER'], name_compressed + ".mp3")
    compressed_wav_path = os.path.join(app.config['COMPRESSED_FOLDER'], name_compressed + ".wav")

    start_time = time.time()  # Mulai pengukuran waktu

    # Jika berkas adalah MP3, konversi ke WAV terlebih dahulu
    if file_extension == '.mp3':
        try:
            audio = AudioSegment.from_file(file_path, "mp3")
        except:
            audio = AudioSegment.from_file(file_path, format="mp4")
        # audio = AudioSegment.from_mp3(file_path)
        wav_file_path = os.path.join(app.config['UPLOAD_FOLDER'], f'{file_name}.wav')
        audio.export(wav_file_path, format="wav")
    else:
        wav_file_path = file_path

    # Baca data WAV
    data, samplerate = sf.read(wav_file_path)
    n = len(data)
    Fs = samplerate

    # Ambil saluran pertama dari data dan lakukan transformasi Fourier
    ch1 = np.array([data[i][0] for i in range(n)])
    ch1_Fourier = np.fft.fft(ch1)
    abs_ch1_Fourier = np.absolute(ch1_Fourier[:n//2])

    # Hitung frekuensi fundamental f0
    eps = 1e-5
    frequencies_to_remove = (1 - eps) * np.sum(abs_ch1_Fourier) < np.cumsum(abs_ch1_Fourier)
    f0 = (len(frequencies_to_remove) - np.sum(frequencies_to_remove)) * (Fs / 2) / (n / 2)

    # Tentukan faktor downsampling D
    D = int(Fs / f0)
    new_data = data[::D, :]

    # Tulis data terkompresi ke berkas WAV
    sf.write(compressed_wav_path, new_data, int(Fs / D), 'PCM_16')

    # Konversi berkas WAV terkompresi ke MP3
    audio_compressed = AudioSegment.from_wav(compressed_wav_path)
    audio_compressed.export(compressed_mp3_path, format="mp3")

    end_time = time.time()  # Akhiri pengukuran waktu

    # Hitung waktu kompresi
    compression_time = end_time - start_time

    # Hitung ukuran file dalam kilobyte (KB)
    original_size_mp3 = os.path.getsize(file_path) / 1024  # KB
    original_size_wav = os.path.getsize(wav_file_path) / 1024  # KB
    compressed_size_mp3 = os.path.getsize(compressed_mp3_path) / 1024  # KB
    compressed_size_wav = os.path.getsize(compressed_wav_path) / 1024  # KB

    # Siapkan objek JSON untuk respons
    json_obj = {
        "url": [f"/static/compressed/{name_compressed}.mp3", f"/static/compressed/{name_compressed}.wav"],
        "originalName": [f'{file_name}.mp3', f'{file_name}.wav'],
        "originalSize": [round(original_size_mp3,2), round(original_size_wav,2)],
        "compressedName": [f"{name_compressed}.mp3", f"{name_compressed}.wav"],
        "compressedSize": [round(compressed_size_mp3,2), round(compressed_size_wav,2)],
        "compressionTime": [round(compression_time, 2)]  # Menambahkan waktu kompresi
    }
    return json_obj

def compress_to_m4a(file_path):
    try:
        start_time = time.time()  # Mulai pengukuran waktu
        compressed_m4a_path = os.path.join(app.config['COMPRESSED_FOLDER'], 'compressed.m4a')
        command = f"ffmpeg -y -i \"{file_path}\" -map 0:a:0 -b:a 24k -c:a aac -vn \"{compressed_m4a_path}\""
        result = sp.run(command, shell=True, stdout=sp.PIPE, stderr=sp.PIPE)
        
        if result.returncode == 0:
            # Get original and compressed file sizes
            original_size = os.path.getsize(file_path) / 1024  # KB
            compressed_size = os.path.getsize(compressed_m4a_path) / 1024  # KB
            
            end_time = time.time()
            compression_time = end_time - start_time
            json_obj = {
                "url": [f"/static/compressed/compressed.m4a"],
                "originalName": [os.path.basename(file_path)],
                "originalSize": [round(original_size, 2)],
                "compressedName": ["compressed.m4a"],
                "compressedSize": [round(compressed_size, 2)],
                "compressionTime": [round(compression_time, 2)]  # Menambahkan waktu kompresi
            }
            logging.info("Compression successful.")
            return json_obj
        else:
            error_message = result.stderr.decode()
            logging.error(f"Compression failed: {error_message}")
            return None
    except Exception as e:
        logging.error(f"An error occurred: {str(e)}")
        return None


def compress_to_mp4(file_path):
    try:
        start_time = time.time()
        compressed_mp4_path = os.path.join(app.config['COMPRESSED_FOLDER'], 'compressed.mp4')
        command = [
            'ffmpeg', '-y', '-i', file_path, 
            '-vcodec', 'libx264', '-crf', '30', '-preset', 'slow',
            '-maxrate', '800k', '-bufsize', '1M',
            '-acodec', 'aac', '-b:a', '16k', 
            compressed_mp4_path
        ]
        
        result = sp.run(command, stdout=sp.PIPE, stderr=sp.PIPE)
        
        if result.returncode == 0:
            # Get original and compressed file sizes
            original_size = os.path.getsize(file_path) / 1024  # KB
            compressed_size = os.path.getsize(compressed_mp4_path) / 1024  # KB
            
            end_time = time.time()
            compression_time = end_time-start_time
            json_obj = {
                "url": [f"/static/compressed/compressed.mp4"],
                "originalName": [os.path.basename(file_path)],
                "originalSize": [round(original_size, 2)],
                "compressedName": ["compressed.mp4"],
                "compressedSize": [round(compressed_size, 2)],
                "compressionTime": [round(compression_time, 2)]  # Menambahkan waktu kompresi
            }
            logging.info("Compression successful.")
            return json_obj
        else:
            error_message = result.stderr.decode()
            logging.error(f"Compression failed: {error_message}")
            return None
    except Exception as e:
        logging.error(f"An error occurred: {str(e)}")
        return None
    
    
if __name__ == '__main__':
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    if not os.path.exists(COMPRESSED_FOLDER):
        os.makedirs(COMPRESSED_FOLDER)
    app.run(debug=True)
