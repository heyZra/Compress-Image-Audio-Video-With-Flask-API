const handleImages = (image, width, height, quality, rotate) => {
  const canvas = document.createElement("canvas"); // Membuat elemen kanvas baru
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");

  if (image) {
    // Bersihkan rotasi sebelum menggambar gambar
    context.clearRect(0, 0, width, height);
    context.save(); // Simpan status konteks saat ini
    context.translate(width / 2, height / 2); // Pindahkan titik pusat rotasi ke tengah gambar
    context.rotate((rotate * Math.PI) / 180); // Terapkan rotasi
    context.drawImage(image, -width / 2, -height / 2, width, height); // Gambar gambar dengan rotasi
    context.restore(); // Pulihkan status konteks ke sebelumnya
  }
  const downloadUrl = canvas.toDataURL("image/jpeg", quality / 100); // Mendapatkan URL unduhan dari elemen kanvas
  const link = document.createElement("a"); // Membuat elemen <a> untuk tautan unduhan
  link.href = downloadUrl; // Menetapkan URL unduhan
  link.download = new Date().getTime(); // Menetapkan nama file unduhan
  link.click(); // Memicu klik pada tautan unduhan
};

export default handleImages;
