import axios from "axios";
// const baseUrl = "http://localhost:3001/api/notes";
const baseUrl = "/api/notes"; // Because, both frontend & backend are at the same address

const getAll = async () => {
  const request = axios.get(baseUrl);
  const nonExisting = {
    id: 1000,
    content: "This note is not saved to server",
    important: true,
  };
  const response = await request;
  return response.data.concat(nonExisting);
};

// const getAll = async () => {
//   const request = axios.get(baseUrl);
//   return request.then((response) => {
//     return response.data;
//   });
// };

const create = (newObject) => {
  return axios.post(baseUrl, newObject);
};

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject);
};

export default { getAll, create, update };
