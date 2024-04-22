import Auth from "@aws-amplify/auth";
import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth/lib/types";
import { ICredentials } from "@aws-amplify/core";
import {
  CognitoUser,
  CognitoUserSession,
  ISignUpResult
} from "amazon-cognito-identity-js";

import { logEvent, LOGIN_FAILED, SIGN_UP_FAILED } from "~/services/analytics";
import { logError } from "~/utils/";

const signIn = async (
  username: string,
  password: string
): Promise<CognitoUser | undefined> => {
  try {
    return await Auth.signIn(username.toLowerCase(), password);
  } catch (error) {
    logError(`Error: signIn --auth.ts-- ${error}`);
    await logEvent(LOGIN_FAILED, { via: "email" });
    return Promise.reject(error);
  }
};

const signOut = async (): Promise<void> => {
  try {
    await Auth.signOut();
  } catch (error) {
    logError(`Error: signOut --auth.ts-- ${error}`);
  }
};

const authenticateCurrentUser = async (): Promise<CognitoUser | undefined> => {
  try {
    const user = await Auth.currentAuthenticatedUser();
    return user;
  } catch (error) {
    logError(`Error: authenticateCurrentUser --auth.ts-- ${error}`);
  }
};

const federatedSignIn = async (
  provider: CognitoHostedUIIdentityProvider
): Promise<ICredentials | undefined> => {
  try {
    const user = await Auth.federatedSignIn({ provider });
    return user;
  } catch (error) {
    logError(`Error: federatedSignIn --auth.ts-- provider=${provider} ${error}`);
    await logEvent(LOGIN_FAILED, { via: provider });
  }
};

const signUp: (
  firstName: string,
  lastName: string,
  mobile: string,
  password: string
) => Promise<ISignUpResult | undefined> = async (
  firstName,
  lastName,
  mobile,
  password
) => {
  try {
    return await Auth.signUp({
      username: mobile,
      password,
      attributes: {
        phone_number: mobile,
        given_name: firstName,
        family_name: lastName
      }
    });
  } catch (error) {
    logError(`Error: signUp --auth.ts-- ${error}`);
    await logEvent(SIGN_UP_FAILED, { via: "email" });
  }
};

const changePassword = (
  user: CognitoUser | any,
  oldPassword: string,
  newPassword: string
): Promise<"SUCCESS"> | undefined => {
  try {
    return Auth.changePassword(user, oldPassword, newPassword);
  } catch (error) {
    logError(`Error: changePassword --auth.ts-- ${error}`);
  }
};

const forgetPassword = (username: string): Promise<any> | undefined => {
  try {
    return Auth.forgotPassword(username);
  } catch (error) {
    logError(`Error: forgetPassword --auth.ts-- ${error}`);
  }
};
/** This method will automatically refresh the accessToken and idToken if tokens are expired and a valid refreshToken presented.
 *  So you can use this method to refresh the session if needed. */
const refreshToken = (): Promise<CognitoUserSession> | undefined => {
  try {
    return Auth.currentSession();
  } catch (error) {
    logError(`Error: refreshToken --auth.ts-- ${error}`);
  }
};

export {
  signIn,
  signOut,
  signUp,
  authenticateCurrentUser,
  federatedSignIn,
  changePassword,
  forgetPassword,
  refreshToken
};
