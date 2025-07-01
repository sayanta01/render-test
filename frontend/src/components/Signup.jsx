const SignupForm = ({
  fullName,
  username,
  password,
  handleFullNameChange,
  handleUsernameChange,
  handlePasswordChange,
  handleSubmit,
}) => {
  return (
    <div>
      {/* <h2>Signup</h2> */}

      <form onSubmit={handleSubmit}>
        <div>
          fullname 
          <input
            type="text"
            name="Fullname"
            value={fullName}
            onChange={handleFullNameChange}
          />
        </div>
        <div>
          username
          <input
            type="text"
            name="Username"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          password
          <input
            type="password"
            name="Password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit">signup</button>
      </form>
    </div>
  );
};

export default SignupForm;
