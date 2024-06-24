const handleImages = async ({
  image,
  file,
  width,
  height,
  quality,
  rotate,
  download,
}) => {
  const startTime = performance.now(); // Catat waktu mulai
  const canvas = document.createElement("canvas"); // Membuat elemen kanvas baru
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  let fileSizeInBytes = 0;

  if (image) {
    // Bersihkan rotasi sebelum menggambar gambar
    context.clearRect(0, 0, width, height);
    context.save(); // Simpan status konteks saat ini
    context.translate(width / 2, height / 2); // Pindahkan titik pusat rotasi ke tengah gambar
    context.rotate((rotate * Math.PI) / 180); // Terapkan rotasi
    context.drawImage(image, -width / 2, -height / 2, width, height); // Gambar gambar dengan rotasi
    context.restore(); // Pulihkan status konteks ke sebelumnya
  }

  // Menunggu sejenak agar canvas selesai menggambar
  await new Promise((resolve) => setTimeout(resolve, 100)); // Tunda selama 100ms (atau sesuaikan sesuai kebutuhan)

  const downloadUrl = canvas.toDataURL("image/jpeg", quality / 100); // Mendapatkan URL unduhan dari elemen kanvas
  const link = document.createElement("a"); // Membuat elemen <a> untuk tautan unduhan
  link.href = downloadUrl; // Menetapkan URL unduhan
  if (download) {
    link.download = `compressed_${file.name}.jpeg`; // Menetapkan nama file unduhan
    link.click(); // Memicu klik pada tautan unduhan
  }

  // Mengukur ukuran file setelah kompresi
  try {
    const response = await fetch(downloadUrl);
    const blob = await response.blob();
    fileSizeInBytes = blob.size;

    const endTime = performance.now(); // Catat waktu selesai
    const compressionTime = (endTime - startTime) / 1000; // Hitung waktu kompresi dalam detik
    return {
      originalName: file.name,
      compressedName: `compressed_${file.name}.jpeg`, // Nama file terkompresi
      originalSize: file.size / 1024, // Ukuran file asli dalam KB
      compressedSize: fileSizeInBytes / 1024, // Ukuran file terkompresi dalam KB
      compressionTime: compressionTime.toFixed(2), // Waktu kompresi dalam detik
    };
  } catch (error) {
    console.error("Error measuring compressed size:", error);
    throw error;
  }
};

export default handleImages;
