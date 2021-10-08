import React from "react";
import { shallow } from "enzyme";
import Login from "../LoginModal";
import LoginButton from "../../common/LoginButton";

jest.mock("react-redux");

describe("Login snapshot", () => {
  it("should create Login snapshot", () => {
    const component = shallow(<Login />);
    expect(
      component.containsAllMatchingElements([
        <LoginButton
          text="Login with Google"
          icon="fab fa-google"
          link="/auth/google"
          name="google"
        />,
        <LoginButton
          text="Login with Facebook"
          icon="fab fa-facebook-f"
          link="/auth/facebook"
          name="facebook"
        />,
        <LoginButton
          text="Login with GitHub"
          icon="fab fa-github-alt"
          link="/auth/github"
          name="github"
        />,
        <LoginButton
          text="Login with Reddit"
          icon="fab fa-reddit-alien"
          link="/auth/reddit"
          name="reddit"
        />,
      ]),
    ).toBeTruthy();
    expect(component).toMatchSnapshot();
  });
});
