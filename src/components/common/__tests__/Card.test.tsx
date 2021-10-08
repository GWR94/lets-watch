import { shallow, mount } from "enzyme";
import React from "react";
import Card from "../Card";

describe("<Card />", () => {
  let wrapper;
  const setState = jest.fn();
  const useStateSpy: any = jest.spyOn(React, "useState");
  useStateSpy.mockImplementation((init) => [init, setState]);

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("snapshot test", () => {
    it("should render the component correctly", () => {
      wrapper = shallow(<Card posterLink="test" id={1} title="test" type="movie" />);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe("values and styles checks", () => {
    it("should render the correct image when a valid posterLink is included in props", () => {
      const wrapper = shallow(
        <Card posterLink="test" id={1} title="test" type="movie" />,
      );
      expect(wrapper.find(".card__image").prop("src")).toBe(
        "http://image.tmdb.org/t/p/w300/test",
      );
      expect(wrapper.find(".card__image").prop("style").border).toBe("none");
      expect(wrapper.find(".card__text").text()).toEqual("test");
    });

    it("should render the placeholder image when no posterLink is included in props", () => {
      const wrapper = shallow(<Card id={1} title="a b c" type="movie" />);
      expect(wrapper.find(".card__image").prop("src")).toBe(
        "https://www.rspcansw.org.au/wp-content/themes/noPhotoFound.png",
      );
      expect(wrapper.find(".card__text").text()).toEqual("a b c");
      expect(wrapper.find(".card__image").prop("style").border).toBe("1px solid white");
    });
  });

  describe("modal tests on click from Card", () => {
    it("should set isOpen to true when container is clicked", () => {
      const wrapper = mount(<Card posterLink="test" id={1} title="a b c" type="movie" />);
      wrapper
        .find(".card__image")
        .at(0)
        .simulate("click");
      expect(setState).toHaveBeenCalledWith(true);
    });
  });
});
