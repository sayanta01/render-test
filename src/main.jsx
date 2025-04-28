import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import Pb from "./Pb.jsx";
import Ex from "./Ex.jsx";
import Ct from "./Ct.jsx";
import "./index.css";

// const promise = axios.get("http://localhost:3001/notes");
// console.log(promise)
// promise.then(response => {
//   console.log(response)
// })

// axios.get("http://localhost:3001/notes").then((response) => {
//   const notes = response.data;
//   console.log(notes);
//   // createRoot(document.getElementById("root")).render(
//   //   <App notes={notes} />,
//   // );
// });

// const notes = [
//   { id: 1, content: "HTML is easy", important: true },
//   { id: 2, content: "Browser can execute only JavaScript", important: false },
//   { id: 3, content: "GET and POST are the most important methods of HTTP protocol", important: true },
// ];

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    {/* <Pb /> */}
    {/* <Ex /> */}
    {/* <Ct /> */}
  </StrictMode>,
);
