import { StyleSheet, Text, View } from "react-native";

import Colors from "../constants/colors";

// Custom title component used at the top of both screens.
// children = the main title text, subtitle is an optional smaller line under it.
function Title({ children, subtitle }) {
  return (
    <View style={styles.titleContainer}>
      <Text style={styles.titleText}>{children}</Text>
      {/* only show the subtitle if one was passed in */}
      {subtitle && <Text style={styles.subtitleText}>{subtitle}</Text>}
    </View>
  );
}

export default Title;

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 16,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: Colors.accent500,
    backgroundColor: "rgba(22, 57, 74, 0.85)",
  },
  titleText: {
    fontFamily: "righteous",
    fontSize: 32,
    color: Colors.cream,
    textAlign: "center",
  },
  subtitleText: {
    fontFamily: "lato",
    fontSize: 15,
    color: Colors.accent300,
    marginTop: 4,
    textAlign: "center",
    letterSpacing: 1,
  },
});
