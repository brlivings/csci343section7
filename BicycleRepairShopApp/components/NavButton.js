import { Pressable, StyleSheet, Text, View } from "react-native";

import Colors from "../constants/colors";

// Custom navigation button. Used for "Submit Order" on the home screen
// and "Return Home" on the order review screen.
// onPress = function that runs when the button is tapped
// children = the text shown on the button
function NavButton({ children, onPress }) {
  return (
    <View style={styles.buttonOuterContainer}>
      <Pressable
        onPress={onPress}
        android_ripple={{ color: Colors.accent300 }}
        // make the button fade a little when pressed on iOS
        style={({ pressed }) =>
          pressed
            ? [styles.buttonInnerContainer, styles.pressed]
            : styles.buttonInnerContainer
        }
      >
        <Text style={styles.buttonText}>{children}</Text>
      </Pressable>
    </View>
  );
}

export default NavButton;

const styles = StyleSheet.create({
  buttonOuterContainer: {
    marginHorizontal: 40,
    marginVertical: 20,
    borderRadius: 30,
    overflow: "hidden", // keeps the android ripple inside the rounded corners
    elevation: 4,
  },
  buttonInnerContainer: {
    backgroundColor: Colors.accent500,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  buttonText: {
    fontFamily: "lato-bold",
    fontSize: 20,
    color: Colors.white,
    textAlign: "center",
  },
  pressed: {
    opacity: 0.75,
  },
});
