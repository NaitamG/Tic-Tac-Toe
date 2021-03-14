import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

test("empty login attempt does not give access to board", () => {
  const result = render(<App />);
  
  const loginButtonElement = screen.getByText('Login');
  expect(loginButtonElement).toBeInTheDocument();
  
  fireEvent.click(loginButtonElement);
  expect(result).toEqual({ isLoggedIn: false });
  
  
});
