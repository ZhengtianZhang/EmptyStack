import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Profile from "../components/Profile";
import '@testing-library/jest-dom'

let mockIsAuthenticated = false;

jest.mock("@auth0/auth0-react", () => ({
  ...jest.requireActual("@auth0/auth0-react"),
  Auth0Provider: ({ children }) => children,
  useAuth0: () => {
    return {
      isLoading: false,
      user: {
        sub: "subId",
        name: "zhang.zhengti@northeastern.edu",
        email: "zhang.zhengti@northeastern.edu",
        email_verified: true,
      },
      isAuthenticated: mockIsAuthenticated,
      loginWithRedirect: jest.fn(),
    };
  },
}));

jest.mock("../AuthTokenContext", () => ({
  useAuthToken: () => {
    return { accessToken: "123" };
  },
}));

test("renders Profile", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Profile />
    </MemoryRouter>
  );

  expect(screen.getByText("zhang.zhengti@northeastern.edu")).toBeInTheDocument();
});

