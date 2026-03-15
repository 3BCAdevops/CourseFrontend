import { render, screen, waitFor } from "@testing-library/react";
import EnrollmentList from "./EnrollmentList";

beforeEach(() => {
  global.fetch = jest.fn();
});

test("loads and displays enrollments", async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [
      { id: 1, courseId: 101, studentId: 1 }
    ],
  });

  render(<EnrollmentList />);

  await waitFor(() =>
    expect(screen.getByText(/courseId/i)).toBeInTheDocument()
  );
});

test("drop enrollment triggers delete", async () => {
  fetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: 1, courseId: 101, studentId: 1 }
      ],
    })
    .mockResolvedValueOnce({
      ok: true
    });

  render(<EnrollmentList />);

  const dropButton = await screen.findByText(/Drop/i);

  dropButton.click();

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});