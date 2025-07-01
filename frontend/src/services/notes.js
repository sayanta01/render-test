import axios from "axios";
// const baseUrl = "http://localhost:3001/notes";
const baseUrl = "/api/notes"; // because, both frontend & backend are at the same address

let token = null;
const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const request = axios.get(baseUrl);
  // const nonExisting = {
  //   id: 1000,
  //   content: "This note is not saved to server",
  //   important: true,
  // };
  // return response.data.concat(nonExisting);
  const response = await request;
  return response.data;
};

// const getAll = async () => {
//   const response = await axios.get(baseUrl);
//   return response.data;
// };

const create = async (newObject) => {
  const config = { headers: { Authorization: token } };

  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
  // return axios.post(baseUrl, newObject);
};

const update = async (id, updatedNote) => {
  const config = { headers: { Authorization: token } };
  const response = await axios.patch(`${baseUrl}/${id}`, updatedNote, config);
  return response.data;
};

export default { setToken, getAll, create, update };
