import axios from "axios";
const requestApi = async (type, file) => {
  try {
    if (!file) {
      throw new Error("File is required.");
    }
    const formData = new FormData();
    formData.append("compression_type", type);
    formData.append("file", file);

    const response = await axios.post("http://localhost:5000/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error uploading file: ", error);
  }
};
export default requestApi;
