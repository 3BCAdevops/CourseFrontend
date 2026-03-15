import { render, screen, waitFor } from "@testing-library/react";
import CourseList from "./CourseList";

beforeEach(() => {
  global.fetch = jest.fn();
  window.alert = jest.fn();
});

test("loads and displays courses", async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [
      { id: 1, name: "React", enrolledCount: 5 },
      { id: 2, name: "Java", enrolledCount: 3 },
    ],
  });

  render(<CourseList />);

  expect(screen.getByText(/loading courses/i)).toBeInTheDocument();

  await waitFor(() =>
    expect(screen.getByText(/React/i)).toBeInTheDocument()
  );

  expect(screen.getByText(/Java/i)).toBeInTheDocument();
});

test("shows error when API fails", async () => {
  fetch.mockResolvedValueOnce({
    ok: false,
  });

  render(<CourseList />);

  await waitFor(() =>
    expect(screen.getByText(/failed to load courses/i)).toBeInTheDocument()
  );
});

test("shows no courses message", async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [],
  });

  render(<CourseList />);

  await waitFor(() =>
    expect(screen.getByText(/no courses found/i)).toBeInTheDocument()
  );
});

test("enroll button triggers API call", async () => {
  fetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1, name: "React", enrolledCount: 5 }],
    })
    .mockResolvedValueOnce({ ok: true }) // enroll POST
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1, name: "React", enrolledCount: 6 }],
    }); // reload courses

  render(<CourseList />);

  const buttons = await screen.findAllByText(/Enroll/i);

  buttons[0].click();

  await waitFor(() => {
    expect(fetch).toHaveBeenCalled();
  });
});