import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import Title from "../components/Title";
import NavButton from "../components/NavButton";
import Colors from "../constants/colors";

// Order review screen - shows a breakdown of everything the user picked
// plus the subtotal, sales tax and final total.
// props.price is the order price (before tax) that App.js calculated.
function OrderReviewScreen(props) {
  // only keep the services that were actually checked
  const selectedServices = props.services.filter((service) => service.value);

  // 6% sales tax on top of the subtotal
  const salesTax = props.price * 0.06;
  const finalTotal = props.price + salesTax;

  return (
    <LinearGradient
      colors={[Colors.primary800, Colors.primary300, Colors.accent300]}
      style={styles.rootContainer}
    >
      <SafeAreaView style={styles.rootContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Title subtitle="Here's what you picked">Order Review</Title>

          <View style={styles.receiptCard}>
            {/* ---------- service time ---------- */}
            <Text style={styles.sectionTitle}>Service Time</Text>
            <View style={styles.lineItem}>
              <Text style={styles.itemText}>{props.repairTime.value}</Text>
              <Text style={styles.priceText}>
                ${props.repairTime.price.toFixed(2)}
              </Text>
            </View>

            {/* ---------- service options ---------- */}
            <Text style={styles.sectionTitle}>Service Options</Text>
            {selectedServices.length === 0 ? (
              <Text style={styles.emptyText}>No service options selected</Text>
            ) : (
              selectedServices.map((service) => (
                <View style={styles.lineItem} key={service.id}>
                  <Text style={styles.itemText}>{service.name}</Text>
                  <Text style={styles.priceText}>
                    ${service.price.toFixed(2)}
                  </Text>
                </View>
              ))
            )}

            {/* ---------- extras ---------- */}
            <Text style={styles.sectionTitle}>Extras</Text>
            <View style={styles.lineItem}>
              <Text style={styles.itemText}>
                Newsletter Signup: {props.newsletter ? "Yes" : "No"}
              </Text>
              <Text style={styles.priceText}>$0.00</Text>
            </View>
            <View style={styles.lineItem}>
              <Text style={styles.itemText}>
                Rental Membership: {props.rentalMembership ? "Yes" : "No"}
              </Text>
              <Text style={styles.priceText}>
                ${props.rentalMembership ? "100.00" : "0.00"}
              </Text>
            </View>

            {/* ---------- totals ---------- */}
            <View style={styles.divider} />
            <View style={styles.lineItem}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalLabel}>
                ${props.price.toFixed(2)}
              </Text>
            </View>
            <View style={styles.lineItem}>
              <Text style={styles.totalLabel}>Sales Tax (6%)</Text>
              <Text style={styles.totalLabel}>
                ${salesTax.toFixed(2)}
              </Text>
            </View>
            <View style={[styles.lineItem, styles.finalRow]}>
              <Text style={styles.finalText}>Total</Text>
              <Text style={styles.finalText}>${finalTotal.toFixed(2)}</Text>
            </View>
          </View>

          {/* goes back home and App.js resets everything */}
          <NavButton onPress={props.onReturnHome}>Return Home</NavButton>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

export default OrderReviewScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  receiptCard: {
    backgroundColor: Colors.cream,
    marginHorizontal: 16,
    padding: 18,
    borderRadius: 14,
    borderTopWidth: 6,
    borderTopColor: Colors.accent500,
  },
  sectionTitle: {
    fontFamily: "righteous",
    fontSize: 20,
    color: Colors.primary500,
    marginTop: 10,
    marginBottom: 4,
  },
  lineItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  itemText: {
    fontFamily: "lato",
    fontSize: 16,
    color: Colors.darkText,
    flexShrink: 1,
    paddingRight: 10,
  },
  priceText: {
    fontFamily: "lato",
    fontSize: 16,
    color: Colors.darkText,
  },
  emptyText: {
    fontFamily: "lato",
    fontSize: 15,
    color: Colors.lightText,
  },
  divider: {
    height: 2,
    backgroundColor: Colors.accent500,
    marginVertical: 12,
  },
  totalLabel: {
    fontFamily: "lato-bold",
    fontSize: 17,
    color: Colors.darkText,
  },
  finalRow: {
    marginTop: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#D9CBB8",
  },
  finalText: {
    fontFamily: "righteous",
    fontSize: 24,
    color: Colors.primary500,
  },
});
