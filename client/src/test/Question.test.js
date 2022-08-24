import { render, screen } from "@testing-library/react";
import Question from "../components/Question";
import { MemoryRouter } from "react-router-dom";
import '@testing-library/jest-dom'

const mockUseNavigate = jest.fn();

jest.mock("@auth0/auth0-react", () => ({
  ...jest.requireActual("@auth0/auth0-react"),
  Auth0Provider: ({ children }) => children,
  useAuth0: () => {
    return {
      isLoading: false,
      user: { sub: "foobar" },
      isAuthenticated: true,
      loginWithRedirect: jest.fn(),
    };
  },
}));

jest.mock("../AuthTokenContext", () => ({
  useAuthToken: () => {
    return { accessToken: "123" };
  },
}));

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => {
      return mockUseNavigate;
    },
}));

test("renders Question", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Question />
    </MemoryRouter>
  );

  expect(screen.getByText("Post Answer")).toBeInTheDocument();
});
