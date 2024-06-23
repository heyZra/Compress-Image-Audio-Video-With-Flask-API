import { useState } from "react";

const CompressAudio = ({ percentageAudio, onClose, saveToParent }) => {
  const [percentage, setPercentage] = useState(percentageAudio);
  const clickSave = () => {
    saveToParent(percentage, `compressed audio: ${percentage}%`);
    onClose();
    console.log(percentage);
  };
  const handlePercentage = (event) => {
    setPercentage(event.target.value);
  };
  return (
    <>
      <div className="flex justify-center">
        <div className="flex flex-col items-center ml-8">
          <input
            type="number"
            className="w-24 h-10 border text-2xl text-center placeholder:text-2xl placeholder:text-center"
            placeholder="--"
            value={percentage}
            onChange={handlePercentage}
          />
          <label className="text-lg font-bold">Percentage</label>
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

export default CompressAudio;
