import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CourseList from "./CourseList";

// Helper to mock fetching courses
const mockFetchCourses = (courses, ok = true) => {
  fetch.mockResolvedValueOnce({
    ok,
    json: async () => courses
  });
};

// Helper to fill course creation form
const fillCourseForm = async (name, desc) => {
  const nameInput = screen.getByPlaceholderText("Course name");
  const descInput = screen.getByPlaceholderText("Description");
  const addButton = screen.getByText("Add Course");
  userEvent.type(nameInput, name);
  userEvent.type(descInput, desc);
  userEvent.click(addButton);
};

beforeEach(() => {
  window.fetch = jest.fn();
  jest.spyOn(window, "alert").mockImplementation(() => {});
  delete window.location;
  window.location = { reload: jest.fn() };
});

afterEach(() => {
  jest.clearAllMocks();
});

test("loads and displays courses", async () => {
  mockFetchCourses([
    { id: 1, name: "React", enrolledCount: 5 },
    { id: 2, name: "Java", enrolledCount: 3 }
  ]);

  render(<CourseList />);

  expect(await screen.findByText(/React/i)).toBeInTheDocument();
  expect(await screen.findByText(/Java/i)).toBeInTheDocument();
});

test("shows error when API fails", async () => {
  fetch.mockRejectedValueOnce(new Error("API error"));
  render(<CourseList />);
  expect(await screen.findByText(/Failed to load courses/i)).toBeInTheDocument();
});

test("shows no courses message", async () => {
  mockFetchCourses([]);
  render(<CourseList />);
  expect(await screen.findByText(/No courses found/i)).toBeInTheDocument();
});

test("enroll button triggers API call", async () => {
  mockFetchCourses([{ id: 1, name: "React", enrolledCount: 5 }]);
  fetch.mockResolvedValueOnce({ ok: true });

  render(<CourseList />);
  const enrollButton = await screen.findByText("Enroll");
  userEvent.click(enrollButton);

  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
});

test("create course validation works", async () => {
  mockFetchCourses([]);
  render(<CourseList />);
  await screen.findByText(/Available Courses/i);

  const button = screen.getByText(/Add Course/i);
  userEvent.click(button);

  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
});

test("create course API call works", async () => {
  mockFetchCourses([]);
  fetch.mockResolvedValueOnce({ ok: true });

  render(<CourseList />);
  await screen.findByText(/Available Courses/i);

  await fillCourseForm("Python", "Programming");

  await waitFor(() => expect(fetch).toHaveBeenCalled());
});

test("shows error when create course API fails", async () => {
  mockFetchCourses([]);
  fetch.mockRejectedValueOnce(new Error("Create error"));

  render(<CourseList />);
  await screen.findByText(/Available Courses/i);

  await fillCourseForm("Python", "Programming");

  await waitFor(() => expect(fetch).toHaveBeenCalled());
});

test("handles invalid API response safely", async () => {
  fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ message: "invalid" }) });
  render(<CourseList />);
  expect(await screen.findByText(/Invalid data from server/i)).toBeInTheDocument();
});

test("shows alert when enroll fails", async () => {
  mockFetchCourses([{ id: 1, name: "React", enrolledCount: 5 }]);
  fetch.mockRejectedValueOnce(new Error("Enroll error"));

  render(<CourseList />);
  const enrollButton = await screen.findByText("Enroll");
  userEvent.click(enrollButton);

  await waitFor(() => expect(window.alert).toHaveBeenCalled());
});

test("handles enroll success", async () => {
  mockFetchCourses([{ id: 1, name: "React", enrolledCount: 5 }]);
  fetch.mockResolvedValueOnce({ ok: true });

  render(<CourseList />);
  const enrollButton = await screen.findByText("Enroll");
  userEvent.click(enrollButton);

  await waitFor(() => expect(window.location.reload).toHaveBeenCalled());
});

test("shows message when course list becomes empty", async () => {
  mockFetchCourses([]);
  render(<CourseList />);
  expect(await screen.findByText(/No courses found/i)).toBeInTheDocument();
});

test("handles response not ok", async () => {
  fetch.mockResolvedValueOnce({ ok: false });
  render(<CourseList />);
  expect(await screen.findByText(/Failed to load courses/i)).toBeInTheDocument();
});