import { render, screen } from '@testing-library/react';
import App from './App';

test('renders course enrollment heading', () => {
  render(<App />);
  const heading = screen.getByText("Course Enrollment");
  expect(heading).toBeInTheDocument();
});