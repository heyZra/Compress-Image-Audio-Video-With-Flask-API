import { useState } from "react";

const CompressImage = ({
  qualityParent,
  onClose,
  saveToParent,
  dataResponse,
  image,
}) => {
  const [quality, setQuality] = useState(qualityParent);

  const clickSave = () => {
    // Setelah mengubah kualitas, simpan ke parent dengan log
    saveToParent(quality, `compressed image: ${quality}%`);
    const responseData = {
      originalName: [image.name],
      compressedName: [`compressed_${image.name}.jpg`],
      originalSize: [image.size],
      compressedSize: [(image.size * quality) / 100],
    };

    // Panggil dataResponse dengan responseData yang sudah ada
    dataResponse(responseData, "succeed update size");
    // Panggil canvasToBlob untuk membuat blob dan mendapatkan responseData
  };

  const handleQualityChange = (event) => {
    let value = event.target.value;
    if (value > 100) {
      value = 100;
    }
    setQuality(value);
  };

  return (
    <>
      <div className="flex justify-center">
        <div className="flex flex-col items-center ml-8">
          <input
            type="number"
            className="w-24 h-10 border text-2xl text-center placeholder:text-2xl placeholder:text-center"
            placeholder="--"
            value={quality}
            onChange={handleQualityChange}
          />
          <label className="text-lg font-bold">Quality</label>
        </div>
        <h1 className="text-3xl font-bold">%</h1>
      </div>
      <div className="mt-3">
        <button
          className="w-1/4 p-1 h-34 bg-red-400 rounded-lg hover:bg-red-500 cursor-pointer mr-2"
          onClick={onClose}
        >
          Close
        </button>
        <button
          className="w-1/4 p-1 h-34 bg-green-400 rounded-lg hover:bg-green-500 cursor-pointer"
          onClick={clickSave}
        >
          Save
        </button>
      </div>
    </>
  );
};

export default CompressImage;
