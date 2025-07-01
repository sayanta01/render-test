import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Note from "./Note.jsx";
import { expect } from "vitest";

test("renders content", () => {
  const note = {
    content: "Component testing is done with react-testing-library",
    important: true,
  };

  // Renders the component with the render function
  const { container } = render(<Note note={note} />);
  const div = container.querySelector(".note");

  // screen.debug();

  // Access the rendered component element
  const element = screen.getByText(
    "Component testing is done with react-testing-library",
  );
  screen.debug(element);
  // expect(element).toBeDefined(); // check if function returned anything
  // expect(div).toHaveTextContent("Component testing is done with react-testing-library");
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
