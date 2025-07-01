// Logs all given arguments
const info = (...params) => {
  // Don't run on test
  if (process.env.NODE_ENV !== "test") {
    console.log(...params);
  }
};

const error = (...params) => {
  if (process.env.NODE_ENV !== "test") {
    console.error(...params);
  }
};

export default { info, error };
