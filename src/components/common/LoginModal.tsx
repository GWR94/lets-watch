import React from "react";
import { Auth } from "aws-amplify";
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import landing from "../../../public/img/landing.jpg";

export enum CognitoHostedUIIdentityProvider {
  Cognito = "COGNITO",
  Google = "Google",
  Facebook = "Facebook",
  Amazon = "LoginWithAmazon",
  Apple = "SignInWithApple",
}

interface LoginProps {
  open: boolean;
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ open, onClose }): JSX.Element => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Let&apos;s Watch - Login</DialogTitle>

      <DialogContent>
        <DialogContentText gutterBottom>
          Login to save your preferences for later!
        </DialogContentText>
        <div className="login__button-container">
          <Button
            className="login__button"
            variant="outlined"
            fullWidth
            onClick={async (): Promise<void> => {
              await Auth.federatedSignIn({
                provider: CognitoHostedUIIdentityProvider.Google,
              });
            }}
            startIcon={<i className="fab fa-google login__icon" />}
            style={{ marginBottom: 8, width: 250 }}
          >
            Login with Google
          </Button>
          <Button
            className="login__button"
            variant="outlined"
            fullWidth
            onClick={async (): Promise<void> => {
              await Auth.federatedSignIn({
                provider: CognitoHostedUIIdentityProvider.Facebook,
              });
            }}
            startIcon={<i className="fab fa-facebook-f login__icon" />}
            style={{ marginBottom: 8, width: 250 }}
          >
            Login with Facebook
          </Button>
          <Button
            className="login__button"
            variant="outlined"
            fullWidth
            onClick={async (): Promise<void> => {
              await Auth.federatedSignIn({
                provider: CognitoHostedUIIdentityProvider.Amazon,
              });
            }}
            startIcon={<i className="fab fa-amazon login__icon" />}
            style={{ marginBottom: 8, width: 250 }}
          >
            Login with Amazon
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Login;
