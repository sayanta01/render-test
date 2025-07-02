import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Note from "./Note.jsx";

test("verify that the component renders the contents of the note", () => {
  const note = {
    content: "Component testing is done with react-testing-library",
    important: true,
  };

  // Renders the component
  const { container } = render(<Note note={note} />);

  screen.debug();

  // const element = screen.getByText("Component testing is done with react-testing-library"); // Select the rendered component element
  // screen.debug(element);
  // expect(element).toBeDefined(); // check if function returned anything

  const div = container.querySelector(".note"); // Query the note container
  expect(div).toHaveTextContent("Component testing is done with react-testing-library");
});

test("clicking the button class event handler once", async () => {
  const note = {
    content: "Component testing is done with react-testing-library",
    important: true,
  };

  const mockHandler = vi.fn(); // mock the function
  render(<Note note={note} toggleImportance={mockHandler} />);

  const user = userEvent.setup(); // initialize simulation user interaction
  const button = screen.getByText("make note important"); // finds the button based on the text from the rendered component
  await user.click(button); // clicks the button

  expect(mockHandler.mock.calls).toHaveLength(1);
});
