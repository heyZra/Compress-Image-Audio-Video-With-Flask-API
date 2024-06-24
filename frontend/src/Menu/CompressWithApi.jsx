import requestApi from "../utils/requestAPI";

const CompressWithApi = ({ onClose, type, file, saveToParent }) => {
  const clickSave = () => {
    requestApi(type, file).then((response) => {
      saveToParent(
        response,
        `compressed ${file.type} with api succed ${response.compressionTime}s`
      );
    });
    console.log("req api succed");
    onClose();
  };
  return (
    <div className="w-full h-fit flex justify-center">
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
  );
};
export default CompressWithApi;
