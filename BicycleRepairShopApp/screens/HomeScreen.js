import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RadioGroup from "react-native-radio-buttons-group";
import BouncyCheckbox from "react-native-bouncy-checkbox";

import Title from "../components/Title";
import NavButton from "../components/NavButton";
import Colors from "../constants/colors";

// Home screen - this is where the user builds their repair order.
// This screen does NOT hold any state itself. Everything comes in as props
// from App.js and any change gets sent back up with the "on..." functions.
function HomeScreen(props) {
  // add the price to each radio button label so the user can see it,
  // ex: "Expedited" -> "Expedited ($50)"
  const radioButtonsWithPrices = props.repairTimeRadioButtons.map((button) => ({
    ...button,
    label: button.label + " ($" + button.price + ")",
  }));

  return (
    <ImageBackground
      source={require("../assets/images/shop-background.png")}
      resizeMode="cover"
      style={styles.rootContainer}
    >
      <SafeAreaView style={styles.rootContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Title subtitle="Bike Repair Shop">Spoke & Sprocket</Title>

          {/* ---------- Service time (radio buttons) ---------- */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Service Time</Text>
            <Text style={styles.sectionHint}>Pick one</Text>
            <RadioGroup
              radioButtons={radioButtonsWithPrices}
              onPress={props.onChangeRepairTime}
              selectedId={props.repairTimeId}
              layout="column"
              containerStyle={styles.radioGroup}
              labelStyle={styles.optionText}
            />
          </View>

          {/* ---------- Service options (checkboxes) ---------- */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Service Options</Text>
            <Text style={styles.sectionHint}>Pick as many as you need</Text>
            {/* loop through every service and make a checkbox for it */}
            {props.services.map((service, index) => {
              return (
                <BouncyCheckbox
                  key={service.id}
                  text={service.name + " ($" + service.price + ")"}
                  isChecked={service.value}
                  // I control the checked state from App.js so it can be reset
                  useBuiltInState={false}
                  onPress={() => props.onChangeServices(index)}
                  size={24}
                  fillColor={Colors.accent500}
                  unFillColor={Colors.white}
                  innerIconStyle={styles.checkboxBorder}
                  textStyle={styles.optionText}
                  style={styles.checkbox}
                />
              );
            })}
          </View>

          {/* ---------- Extras (switches) ---------- */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Extras</Text>

            <View style={styles.switchRow}>
              <Text style={styles.optionText}>Newsletter Signup ($0)</Text>
              <Switch
                value={props.newsletter}
                onValueChange={props.onChangeNewsletter}
                trackColor={{ false: "#B8C4C9", true: Colors.accent300 }}
                thumbColor={props.newsletter ? Colors.accent500 : "#F4F4F4"}
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.optionText}>
                Rental Membership Signup ($100)
              </Text>
              <Switch
                value={props.rentalMembership}
                onValueChange={props.onChangeRentalMembership}
                trackColor={{ false: "#B8C4C9", true: Colors.accent300 }}
                thumbColor={
                  props.rentalMembership ? Colors.accent500 : "#F4F4F4"
                }
              />
            </View>
          </View>

          {/* submit sends everything back to App.js to get the total */}
          <NavButton onPress={props.onSubmit}>Submit Order</NavButton>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  sectionCard: {
    backgroundColor: "rgba(255, 246, 233, 0.93)",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 14,
    borderLeftWidth: 6,
    borderLeftColor: Colors.accent500,
  },
  sectionTitle: {
    fontFamily: "righteous",
    fontSize: 22,
    color: Colors.primary500,
  },
  sectionHint: {
    fontFamily: "lato",
    fontSize: 13,
    color: Colors.lightText,
    marginBottom: 8,
  },
  radioGroup: {
    alignItems: "flex-start",
  },
  optionText: {
    fontFamily: "lato",
    fontSize: 17,
    color: Colors.darkText,
    textDecorationLine: "none", // bouncy checkbox crosses text out by default
  },
  checkbox: {
    marginVertical: 6,
  },
  checkboxBorder: {
    borderWidth: 2,
    borderColor: Colors.accent500,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 6,
  },
});
