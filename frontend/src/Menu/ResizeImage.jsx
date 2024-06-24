import { useState, useEffect } from "react";

const ResizeImage = ({ height, width, onClose, image, saveToParent }) => {
  const [inputWidth, setInputWidth] = useState("");
  const [inputHeight, setInputHeight] = useState("");

  useEffect(() => {
    if (height !== null && height !== undefined) {
      setInputHeight(height);
    }
    if (width !== null && width !== undefined) {
      setInputWidth(width);
    }
  }, [height, width, image]);

  const handleWidthChange = (event) => {
    setInputWidth(event.target.value);
  };

  const handleHeightChange = (event) => {
    setInputHeight(event.target.value);
  };

  const clickSave = () => {
    saveToParent(inputWidth, inputHeight); // Corrected syntax
    onClose();
  };
  return (
    <div className="w-full h-fit flex flex-col">
      <div className="flex justify-between px-10">
        <div className="mt-3">
          <input
            type="number"
            className="w-24 h-10 border text-2xl text-center placeholder:text-2xl placeholder:text-center"
            placeholder="--"
            value={inputWidth}
            onChange={handleWidthChange}
          />
          <label className="text-lg font-bold">Width</label>
        </div>
        <h1 className="text-5xl">:</h1>
        <div className="mt-3">
          <input
            type="number"
            className="w-24 h-10 border text-2xl text-center placeholder:text-2xl placeholder:text-center"
            placeholder="--"
            value={inputHeight}
            onChange={handleHeightChange}
          />
          <label className="text-lg font-bold" htmlFor="height">
            Height
          </label>
        </div>
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
    </div>
  );
};

export default ResizeImage;
