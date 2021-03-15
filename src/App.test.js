/* eslint-disable */
import { render, screen, fireEvent } from "@testing-library/react";
//import { shallow } from 'enzyme';
import App from "./App";

test("Empty login attempt does not give access to board", () => {
  const result = render(<App />);
  
  // get the login button
  const loginButtonElement = screen.getByText('Login');
  expect(loginButtonElement).toBeInTheDocument();
  
  // click login
  fireEvent.click(loginButtonElement);
  expect(loginButtonElement).toBeInTheDocument();
  
  // check if board is still hidden
  const board = screen.queryByTestId('tictactoe');
  expect(board).not.toBeInTheDocument();
});

test("The first click on board is X", () => {
  const result = render(<App />);
  
  // Enter dummy usernmae to get passed login
  const inputElement = screen.getByPlaceholderText('Enter username')
  fireEvent.change(inputElement, { target: { value: 'some username' } });
  
  // Click the login button
  const loginButtonElement = screen.getByText('Login');
  fireEvent.click(loginButtonElement);
  expect(loginButtonElement).not.toBeInTheDocument();
  
  // See if the board is visible
  const board = screen.queryByTestId('tictactoe');
  expect(board).toBeVisible;
  
  const square = screen.queryAllByTestId('boxClick')
  expect(square).toBeVisible;

  fireEvent.click(square[0]);
  
  // See if the click registered an X
  const squareValue = screen.getByText('X'); 
  expect(squareValue).toBeInTheDocument();
});

test("Can see leaderboard when toggled on click", () => {
  const result = render(<App />);
  
  // login
  const inputElement = screen.getByPlaceholderText('Enter username');
  fireEvent.change(inputElement, { target: { value: 'some username' } });
  
  const loginButtonElement = screen.getByText('Login');
  fireEvent.click(loginButtonElement);
  expect(loginButtonElement).not.toBeInTheDocument();
  
  // toggle leaderboard on
  const toggelLeaderboard = screen.getByText('Leaderboard');
  fireEvent.click(toggelLeaderboard);
  
  // see if the username and score columns are visible
  const username = screen.getByText('Username');
  const score = screen.getByText('Score');
  expect(username).toBeInTheDocument();
  expect(score).toBeInTheDocument();
});