import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Togglable from "./Togglable";
import { describe, expect } from "vitest";

// Renders the Togglable component and saves the field container of the returned value
describe("<Togglable/>", () => {
  let container;

  beforeEach(() => {
    container = render(
      <Togglable buttonLabel={"show..."}>
        <div className="testDiv">togglable content</div>
      </Togglable>,
    ).container; // ?
  });
});

test("renders its children", async () => {
  await screen.findAllByAltText("togglable content");
});

test("at start the children are not displayed", () => {
  const div = container.querySelector(".togglableContent");
  expect(div).toHaveStyle("display: none");
});

test("after clicking the button, children are displayed", async () => {
  const user = userEvent.setup();
  const button = screen.getByText("show...");
  await user.click(button);

  const div = container.querySelector(".togglableContent");
  expect(div).not.toHaveStyle("display: none");
});

test("toggle content can be closed", async () => {
  const user = userEvent.setup();
  const button = screen.getByText("show...");
  await user.click(button);

  const closeButton = screen.getByText("cancel");
  await user.click(closeButton);

  const div = container.querySelector(".togglableContent");
  expect(div).toHaveStyle("display: none");
});
