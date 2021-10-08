import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import axios from "axios";
import * as actions from "../../../actions/auth.actions";
import { ADD_TO_USER } from "../../../interfaces/auth.redux.i";

describe("Database Button test cases", () => {
  let wrapper;
  const setState = jest.fn();
  const useStateSpy: any = jest.spyOn(React, "useState");
  useStateSpy.mockImplementation((init) => [init, setState]);

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockStore = configureStore([thunk]);
  const initialState = {
    auth: {
      profile: {
        tvShows: [12, 245, 656],
        movies: [2, 155, 222],
      },
    },
  };
  let store;
  jest.mock("react-redux");
  jest.mock("axios");

  beforeEach(() => {
    store = mockStore(initialState);
    wrapper = mount(
      <Provider store={store}>
        <DatabaseButton type="movie" id={123} />
      </Provider>,
    );
  });

  describe("snapshot test", () => {
    it("should render the connected component", () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe("store based test cases", () => {
    it("should return the correct button text when the id is not in store for movies", () => {
      const buttonText = wrapper.find(".btn").text();
      expect(buttonText).toBe("Add to My Movies");
    });
    it("should return the correct button text when the id is not in store for tv shows", () => {
      wrapper = mount(
        <Provider store={store}>
          <DatabaseButton type="tv" id={123} />
        </Provider>,
      );
      const buttonText = wrapper.find(".btn").text();
      expect(buttonText).toBe("Add to My TV Shows");
    });
    it("should return the correct button text when the id is in the store for movies", () => {
      wrapper = mount(
        <Provider store={store}>
          <DatabaseButton type="movie" id={2} />
        </Provider>,
      );
      const buttonText = wrapper.find(".btn").text();
      expect(buttonText).toBe("Remove from My Movies");
    });
    it("should return the correct button text when the id is in the store for tv shows", () => {
      wrapper = mount(
        <Provider store={store}>
          <DatabaseButton type="tv" id={12} />
        </Provider>,
      );
      const buttonText = wrapper.find(".btn").text();
      expect(buttonText).toBe("Remove from My TV Shows");
    });
    it("should dispatch the correct action when the button is clicked when not in store", async () => {
      wrapper
        .find(".modal__button")
        .at(0)
        .simulate("click");
      expect(setState).toBeCalledWith(true);
      await store.dispatch(actions.addToUser(123, "movies"));
      expect(store).toEqual({
        auth: {
          profile: {
            tvShows: [12, 245, 656],
            movies: [2, 155, 222],
          },
        },
      });
    });
  });
});
