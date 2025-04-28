import { useState, useEffect } from "react";
import axios from "axios";

const Ct = () => {
  const [name, setName] = useState("");
  const [data, setData] = useState({});

  const onSearch = (event) => {
    event.preventDefault();
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all/`)
      .then((res) => {
        console.log(res);
        const filtered = res.data.filter((country) =>
          country.name.common.toLowerCase().includes(name.toLowerCase()),
        );

        setData(filtered);
      });
  };

  const handleChange = (event) => {
    setName(event.target.value);
  };

  return (
    <div>
      <form onSubmit={onSearch}>
        Find Countries: <input value={name} onChange={handleChange} />
        <button type="submit">Search</button>
      </form>

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default Ct;
