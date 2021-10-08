import React from "react";
import renderer from "react-test-renderer";

import LoginButton from "../../common/LoginButton";

describe("Login Button snapshots", () => {
  it("should create Google login button snapshot", () => {
    const component = renderer.create(
      <LoginButton
        text="Login with Google"
        icon="fab fa-google"
        link="/auth/google"
        name="google"
      />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("should create Facebook login button snapshot", () => {
    const component = renderer.create(
      <LoginButton
        text="Login with Facebook"
        icon="fab fa-facebook-f"
        link="/auth/facebook"
        name="facebook"
      />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("should create GitHub login button snapshot", () => {
    const component = renderer.create(
      <LoginButton
        text="Login with Github"
        icon="fab fa-github-alt"
        link="/auth/github"
        name="github"
      />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("should create Reddit login button snapshot", () => {
    const component = renderer.create(
      <LoginButton
        text="Login with Reddit"
        icon="fab fa-reddit-alien"
        link="/auth/reddit"
        name="reddit"
      />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
