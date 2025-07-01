import { render, screen } from "@testing-library/react";
import NoteForm from "./NoteForm";
import userEvent from "@testing-library/user-event";

test("<NoteForm /> updates parent state and calls onSubmit", async () => {
  const createNote = vi.fn(); // [ [ { content: 'testing a form...', important: true } ] ]
  const user = userEvent.setup();

  render(<NoteForm createNote={createNote} />);

  const input = screen.getByRole("textbox"); // get access to the input field
  const sendButton = screen.getByText("save");

  await user.type(input, "testing a form..."); // write text to the input field
  await user.click(sendButton);

  expect(createNote.mock.calls).toHaveLenght(1);
  // checks that the event handler is called with the right parameters
  expect(createNote.mock.calls[0][0].content).toBe("testing a form...");
});
