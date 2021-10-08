import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { useDispatch, useSelector } from "react-redux";
import * as tmdbActions from "../../actions/tmdb.actions";
import { AppState } from "../../interfaces/app.i";
import { Chip, CircularProgress, Rating, useMediaQuery } from "@mui/material";
import Button from "../../util/MuiButton";
import { graphqlOperation, GraphQLResult } from "@aws-amplify/api-graphql";
import { getUser } from "../../graphql/queries";
import { useHistory } from "react-router-dom";
import { API } from "aws-amplify";
import { mobileStyles, styles } from "../../util/data";
import { GetUserQuery, UpdateUserInput, UpdateUserMutation } from "../../API";
import { updateUser } from "../../graphql/mutations";

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  id: number;
  type: "tv" | "movie";
}

dayjs.extend(advancedFormat);

/**
 * TODO
 * [ ] Fix labels showing through Modal
 */

const Modal: React.FC<ModalProps> = ({ isOpen, closeModal, id, type }): JSX.Element => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { uid } = useSelector(({ auth }: AppState) => auth);
  const { current } = useSelector(({ tmdb }: AppState) => tmdb);

  const [media, setMedia] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect((): void => {
    type === "tv"
      ? dispatch(tmdbActions.fetchCurrentTV(id))
      : dispatch(tmdbActions.fetchCurrentMovie(id));

    const getUserData = async (): Promise<void> => {
      if (!uid) {
        setLoading(false);
        return console.log("No current user");
      }
      try {
        const { data } = (await API.graphql(
          graphqlOperation(getUser, { id: uid }),
        )) as GraphQLResult<GetUserQuery>;

        if (type === "tv") {
          setMedia(data.getUser.tvShows);
        } else {
          setMedia(data.getUser.movies);
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    getUserData();
  }, []);

  const handleSaveMedia = async (): Promise<void> => {
    setBtnLoading(true);
    // if the current show/movie doesn't exist in media, add it to media and update user
    if (media.indexOf(current.id) === -1) {
      const updateUserInput: UpdateUserInput = {
        id: uid,
      };
      type === "tv"
        ? (updateUserInput.tvShows = [...media, current.id])
        : (updateUserInput.movies = [...media, current.id]);
      // set updated media in state
      setMedia([...media, current.id]);
      // update user with updateUser mutation
      await API.graphql(
        graphqlOperation(updateUser, {
          input: updateUserInput,
        }),
      );
    } else {
      // remove the shows id from media
      const updatedMedia = media.filter((show) => show !== current.id);
      const updateUserInput: UpdateUserInput = {
        id: uid,
      };
      if (type === "tv") {
        updateUserInput.tvShows = updatedMedia;
      } else {
        updateUserInput.movies = updatedMedia;
      }
      setMedia(updatedMedia);
      await API.graphql(
        graphqlOperation(updateUser, {
          input: updateUserInput,
        }),
      );
    }
    setBtnLoading(false);
  };

  const desktop = useMediaQuery("(min-width: 420px)");

  ReactModal.setAppElement("#app");

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={desktop ? styles : mobileStyles}
      contentLabel={current?.title ?? current?.name}
    >
      {isLoading ? (
        <div className="modal__loading">
          <CircularProgress size={60} />
        </div>
      ) : current ? (
        <div className="modal__container">
          <div className="modal__header">
            <div className="modal__poster-container">
              <img
                className="modal__poster"
                alt={current.title}
                src={
                  current.poster
                    ? `http://image.tmdb.org/t/p/w300/${current.poster}`
                    : "https://www.rspcansw.org.au/wp-content/themes/noPhotoFound.png"
                }
              />
            </div>
            <div className="modal__header-text-container">
              <p className="modal__title">{current.title}</p>
              {current.tagline && (
                <p className="modal__tagline">&quot;{current.tagline}&quot;</p>
              )}
              <p className="modal__header-text">
                {`Released ${dayjs(current.releaseDate).format("Do MMMM YYYY")}`}
              </p>
              <div className="modal__genres">
                {current.genres.map(
                  (genre): JSX.Element => (
                    <Chip
                      key={genre}
                      size="small"
                      label={genre}
                      className={`modal__genre-${genre} modal__genre`}
                    />
                  ),
                )}
              </div>

              {!!current.rating && (
                <div className="modal__rating">
                  <Rating value={current.rating / 2} readOnly precision={0.1} />
                </div>
              )}
            </div>
          </div>

          <p className="modal__overview">{current.overview}</p>
          <div className="modal__button--container">
            {uid ? (
              <Button
                color="secondary"
                size="small"
                variant="text"
                onClick={handleSaveMedia}
                style={{ marginBottom: 10 }}
              >
                {btnLoading ? (
                  <CircularProgress size={20} />
                ) : media.indexOf(current.id) === -1 ? (
                  "Save for Later"
                ) : (
                  "Remove from Saved"
                )}
              </Button>
            ) : (
              <Button
                color="secondary"
                variant="text"
                size="small"
                onClick={() => history.push("/login")}
                style={{ marginBottom: 10 }}
              >
                Login to Save
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="modal__loading">
          <CircularProgress size={60} />
        </div>
      )}
      <i
        className="fas fa-times modal__close-btn"
        role="button"
        tabIndex={0}
        onClick={(): void => closeModal()}
      />
    </ReactModal>
  );
};

export default Modal;
