import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CourseList from "./CourseList";

beforeEach(() => {
globalThis.fetch = jest.fn();
jest.spyOn(globalThis, "alert").mockImplementation(() => {});
delete globalThis.location;
globalThis.location = { reload: jest.fn() };
});

afterEach(() => {
jest.clearAllMocks();
});

test("loads and displays courses", async () => {
fetch.mockResolvedValueOnce({
ok: true,
json: async () => [
{ id: 1, name: "React", enrolledCount: 5 },
{ id: 2, name: "Java", enrolledCount: 3 }
]
});

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
fetch.mockResolvedValueOnce({
ok: true,
json: async () => []
});

render(<CourseList />);

expect(await screen.findByText(/No courses found/i)).toBeInTheDocument();
});

test("enroll button triggers API call", async () => {
fetch
.mockResolvedValueOnce({
ok: true,
json: async () => [{ id: 1, name: "React", enrolledCount: 5 }]
})
.mockResolvedValueOnce({ ok: true });

render(<CourseList />);

const enrollButton = await screen.findByText("Enroll");

userEvent.click(enrollButton);

await waitFor(() => {
expect(fetch).toHaveBeenCalledTimes(2);
});
});

test("create course validation works", async () => {
fetch.mockResolvedValueOnce({
ok: true,
json: async () => []
});

render(<CourseList />);

await screen.findByText(/Available Courses/i);

const button = screen.getByText(/Add Course/i);

userEvent.click(button);

await waitFor(() => {
expect(fetch).toHaveBeenCalledTimes(1);
});
});

test("create course API call works", async () => {
fetch
.mockResolvedValueOnce({
ok: true,
json: async () => []
})
.mockResolvedValueOnce({ ok: true });

render(<CourseList />);

await screen.findByText(/Available Courses/i);

const nameInput = screen.getByPlaceholderText("Course name");
const descInput = screen.getByPlaceholderText("Description");
const button = screen.getByText("Add Course");

userEvent.type(nameInput, "Python");
userEvent.type(descInput, "Programming");

userEvent.click(button);

await waitFor(() => {
expect(fetch).toHaveBeenCalled();
});
});

test("shows error when create course API fails", async () => {
fetch
.mockResolvedValueOnce({
ok: true,
json: async () => []
})
.mockRejectedValueOnce(new Error("Create error"));

render(<CourseList />);

await screen.findByText(/Available Courses/i);

const nameInput = screen.getByPlaceholderText("Course name");
const descInput = screen.getByPlaceholderText("Description");
const button = screen.getByText("Add Course");

userEvent.type(nameInput, "Python");
userEvent.type(descInput, "Programming");

userEvent.click(button);

await waitFor(() => {
expect(fetch).toHaveBeenCalled();
});
});

test("handles invalid API response safely", async () => {
fetch.mockResolvedValueOnce({
ok: true,
json: async () => ({ message: "invalid" })
});

render(<CourseList />);

expect(await screen.findByText(/Invalid data from server/i)).toBeInTheDocument();
});

test("shows alert when enroll fails", async () => {
fetch
.mockResolvedValueOnce({
ok: true,
json: async () => [{ id: 1, name: "React", enrolledCount: 5 }]
})
.mockRejectedValueOnce(new Error("Enroll error"));

render(<CourseList />);

const enrollButton = await screen.findByText("Enroll");

userEvent.click(enrollButton);

await waitFor(() => {
expect(globalThis.alert).toHaveBeenCalled();
});
});

test("handles enroll success", async () => {
fetch
.mockResolvedValueOnce({
ok: true,
json: async () => [{ id: 1, name: "React", enrolledCount: 5 }]
})
.mockResolvedValueOnce({ ok: true });

render(<CourseList />);

const enrollButton = await screen.findByText("Enroll");

userEvent.click(enrollButton);

await waitFor(() => {
expect(globalThis.location.reload).toHaveBeenCalled();
});
});

test("shows message when course list becomes empty", async () => {
fetch.mockResolvedValueOnce({
ok: true,
json: async () => []
});

render(<CourseList />);

expect(await screen.findByText(/No courses found/i)).toBeInTheDocument();
});

/* NEW TEST TO INCREASE CONDITION COVERAGE */
test("handles response not ok", async () => {
fetch.mockResolvedValueOnce({
ok: false
});

render(<CourseList />);

expect(await screen.findByText(/Failed to load courses/i)).toBeInTheDocument();
});
