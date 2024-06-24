import handleCompressAudio from "../utils/handleCompressAudio";

const CompressAudio = ({ onClose, music, dataResponse }) => {
  const clickSave = () => {
    handleCompressAudio({ music, download: false }).then((response) => {
      dataResponse(
        response,
        `compressed ${music.type} with api succed ${response.compressionTime}s`
      );
    });
    console.log("click saved image");

    onClose();
  };

  return (
    <>
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
