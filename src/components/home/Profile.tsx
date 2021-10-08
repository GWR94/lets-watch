import { graphqlOperation, GraphQLResult } from "@aws-amplify/api-graphql";
import { AmplifyS3Image } from "@aws-amplify/ui-react";
import {
  Grid,
  TextField,
  Typography,
  Container,
  CircularProgress,
  useMediaQuery,
  createTheme,
} from "@mui/material";
import { API, Storage } from "aws-amplify";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { GetUserQuery, User } from "../../API";
import { updateUser } from "../../graphql/mutations";
import { getUser } from "../../graphql/queries";
import { AppState } from "../../interfaces/app.i";
import Button from "../../util/MuiButton";
import { openSnackbar } from "../../util/Notifier";
import awsExports from "../../aws-exports";
import WatchLater from "./WatchLater";

const Profile = (): JSX.Element => {
  const history = useHistory();
  const [isEditing, setEditing] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const theme = createTheme();
  const mobile = useMediaQuery(theme.breakpoints.only("xs"));

  const { uid } = useSelector(({ auth }: AppState) => auth);
  const [user, setUser] = useState<Partial<User> | null>({
    name: "",
    username: "",
    email: "",
    image: null,
    tvShows: [],
    movies: [],
  });

  useEffect(() => {
    const getUserData = async (): Promise<void> => {
      const { data } = (await API.graphql(
        graphqlOperation(getUser, {
          id: uid,
        }),
      )) as GraphQLResult<GetUserQuery>;
      setUser(data.getUser);
      setLoading(false);
    };
    getUserData();
  }, []);

  const uploadToS3 = async (file: File): Promise<void> => {
    try {
      const { key } = (await Storage.put(`${uid}/${file.name}`, file, {
        contentType: file.type,
      })) as { key: string };

      const image = {
        key,
        bucket: awsExports.aws_user_files_s3_bucket,
        region: awsExports.aws_user_files_s3_bucket_region,
      };

      const updatedUser = {
        id: uid,
        image,
      };

      await API.graphql(
        graphqlOperation(updateUser, {
          input: updatedUser,
        }),
      );
      window.location.reload();
    } catch (err) {
      openSnackbar({
        severity: "error",
        message: "Unable to upload image. Please try again.",
      });
      console.error(err);
    }
  };

  const handleUpdateProfile = async (): Promise<void> => {
    const { username, email, name } = user;
    try {
      await API.graphql(
        graphqlOperation(updateUser, {
          input: {
            id: uid,
            username,
            name,
            email,
          },
        }),
      );
    } catch (err) {
      openSnackbar({
        severity: "error",
        message: "Unable to update profile. Please try again.",
      });
      console.error(err);
    }
  };

  if (!uid) {
    openSnackbar({ message: "Please sign in to view profile", severity: "error" });
    history.push("/");
  }
  const { name, username, email, image, tvShows, movies } = user;

  return isLoading ? (
    <CircularProgress size={25} />
  ) : (
    <Container>
      <Typography variant="h4" className="discover__title" gutterBottom>
        Profile
      </Typography>
      <Typography className="discover__text" gutterBottom>
        Click the &apos;Edit Profile&apos; button to start updating your profile.
      </Typography>
      <div className="profile__image--container">
        {image !== null ? (
          <div className="profile__image">
            <AmplifyS3Image imgKey={image.key} style={{ width: "100%" }} />
          </div>
        ) : (
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
            alt="Profile"
            className="profile__image"
          />
        )}
        {isEditing && (
          <>
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              style={{ marginTop: 10 }}
              onClick={(): void => document.getElementById("fileInput")?.click()}
            >
              {image ? "Change Image" : "Upload Image"}
            </Button>
            <input
              hidden
              id="fileInput"
              type="file"
              onChange={(e): void => {
                if (e.target.files) {
                  uploadToS3(e.target.files[0]);
                }
              }}
            />
          </>
        )}
      </div>
      <Grid container spacing={2} rowSpacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            value={username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            variant="outlined"
            fullWidth
            disabled
            size={mobile ? "small" : "medium"}
            label="Username"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            value={name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            variant="outlined"
            fullWidth
            disabled={!isEditing}
            size={mobile ? "small" : "medium"}
            label="Name"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            value={email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            variant="outlined"
            fullWidth
            size={mobile ? "small" : "medium"}
            disabled={!isEditing}
            label="Email Address"
          />
        </Grid>
      </Grid>
      <div className="profile__button--container">
        <Button
          color="error"
          onClick={() => {
            isEditing ? setEditing(false) : history.push("/");
          }}
          size={mobile ? "small" : "medium"}
          variant="outlined"
          style={{ margin: "10px 4px 0" }}
        >
          Cancel
        </Button>
        {isEditing ? (
          <Button
            color="error"
            onClick={() => setEditing(true)}
            size={mobile ? "small" : "medium"}
            variant="contained"
            style={{ margin: "10px 4px 0" }}
          >
            Edit Profile
          </Button>
        ) : (
          <Button
            color="error"
            variant="contained"
            size={mobile ? "small" : "medium"}
            onClick={handleUpdateProfile}
            style={{ margin: "10px 4px 0" }}
          >
            Save Profile
          </Button>
        )}
      </div>
      {tvShows.length > 0 && <WatchLater type="tv" media={tvShows} />}
      {movies.length > 0 && <WatchLater type="movie" media={movies} />}
    </Container>
  );
};

export default Profile;
