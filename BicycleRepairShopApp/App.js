import { useEffect, useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import HomeScreen from "./screens/HomeScreen";
import OrderReviewScreen from "./screens/OrderReviewScreen";

// keep the splash screen up until the fonts are done loading
SplashScreen.preventAutoHideAsync();

// sales tax rate used on the order review screen (6%)
const salesTaxRate = 0.06;

// starting list of service options. value = whether the box is checked.
// I keep this outside the component so I can reuse it to reset the order.
const initialServices = [
  { id: 0, name: "Basic Tune-Up", price: 50, value: false },
  { id: 1, name: "Comprehensive Tune-Up", price: 75, value: false },
  { id: 2, name: "Flat Tire Repair", price: 20, value: false },
  { id: 3, name: "Brake Servicing", price: 50, value: false },
  { id: 4, name: "Gear Servicing", price: 40, value: false },
  { id: 5, name: "Chain Servicing", price: 15, value: false },
  { id: 6, name: "Frame Repair", price: 35, value: false },
  { id: 7, name: "Safety Check", price: 25, value: false },
  { id: 8, name: "Accessory Install", price: 10, value: false },
];

export default function App() {
  // load the custom fonts from the assets folder
  const [fontsLoaded] = useFonts({
    righteous: require("./assets/fonts/Righteous-Regular.ttf"),
    lato: require("./assets/fonts/Lato-Regular.ttf"),
    "lato-bold": require("./assets/fonts/Lato-Bold.ttf"),
  });

  // ---------- ALL app state lives here in App.js ----------

  // which screen is showing: "home" or "review"
  const [currentScreen, setCurrentScreen] = useState("home");

  // radio buttons for the service time (standard / expedited / next day)
  // useMemo so the array isn't rebuilt every render (recommended by the library)
  const repairTimeRadioButtons = useMemo(
    () => [
      { id: "0", label: "Standard ($0)", value: "Standard", price: 0 },
      { id: "1", label: "Expedited ($50)", value: "Expedited", price: 50 },
      { id: "2", label: "Next Day ($100)", value: "Next Day", price: 100 },
    ],
    []
  );
  // standard ("0") is picked by default
  const [repairTimeId, setRepairTimeId] = useState("0");

  // checkbox service options
  const [services, setServices] = useState(initialServices);

  // switches
  const [newsletter, setNewsletter] = useState(false);
  const [rentalMembership, setRentalMembership] = useState(false);

  // prices that get calculated when the order is submitted
  const [subtotal, setSubtotal] = useState(0);
  const [salesTax, setSalesTax] = useState(0);
  const [total, setTotal] = useState(0);

  // once the fonts are loaded we can hide the splash screen
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // toggles one checkbox on/off. index = which service was tapped
  function servicesHandler(index) {
    setServices((prevServices) =>
      prevServices.map((service, serviceIndex) =>
        serviceIndex === index ? { ...service, value: !service.value } : service
      )
    );
  }

  // runs when "Submit Order" is pressed on the home screen.
  // adds up the price of everything the user picked, then goes to the review screen
  function submitOrderHandler() {
    let newSubtotal = 0;

    // price of the selected service time
    const selectedTime = repairTimeRadioButtons.find(
      (button) => button.id === repairTimeId
    );
    newSubtotal += selectedTime.price;

    // add every checked service option
    for (const service of services) {
      if (service.value) {
        newSubtotal += service.price;
      }
    }

    // newsletter is free, rental membership is $100
    if (rentalMembership) {
      newSubtotal += 100;
    }

    const newSalesTax = newSubtotal * salesTaxRate;

    setSubtotal(newSubtotal);
    setSalesTax(newSalesTax);
    setTotal(newSubtotal + newSalesTax);
    setCurrentScreen("review");
  }

  // runs when "Return Home" is pressed. puts everything back to the defaults
  // so the user can start a brand new order
  function returnHomeHandler() {
    setRepairTimeId("0");
    setServices(initialServices);
    setNewsletter(false);
    setRentalMembership(false);
    setSubtotal(0);
    setSalesTax(0);
    setTotal(0);
    setCurrentScreen("home");
  }

  // don't show anything (splash stays up) until the fonts are ready
  if (!fontsLoaded) {
    return null;
  }

  // home screen is shown by default
  let screen = (
    <HomeScreen
      repairTimeRadioButtons={repairTimeRadioButtons}
      repairTimeId={repairTimeId}
      onChangeRepairTime={setRepairTimeId}
      services={services}
      onChangeServices={servicesHandler}
      newsletter={newsletter}
      onChangeNewsletter={setNewsletter}
      rentalMembership={rentalMembership}
      onChangeRentalMembership={setRentalMembership}
      onSubmit={submitOrderHandler}
    />
  );

  // switch to the review screen after the order is submitted
  if (currentScreen === "review") {
    screen = (
      <OrderReviewScreen
        repairTime={repairTimeRadioButtons.find(
          (button) => button.id === repairTimeId
        )}
        services={services}
        newsletter={newsletter}
        rentalMembership={rentalMembership}
        subtotal={subtotal}
        salesTax={salesTax}
        total={total}
        onReturnHome={returnHomeHandler}
      />
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      {screen}
    </SafeAreaProvider>
  );
}
