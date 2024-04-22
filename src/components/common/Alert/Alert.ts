import { Alert, AlertButton } from "react-native";

const showAlert = (
  title = "error",
  message = "general error",
  buttons?: AlertButton[]
): void => {
  Alert.alert(title, message, buttons);
};

export default showAlert;
