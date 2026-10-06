import { useEffect, useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import HomeScreen from "./screens/HomeScreen";
import OrderReviewScreen from "./screens/OrderReviewScreen";
import Colors from "./constants/colors";

// keep the splash screen up until the fonts are done loading
SplashScreen.preventAutoHideAsync();

export default function App() {
  // load the custom fonts from the assets folder
  const [fontsLoaded] = useFonts({
    righteous: require("./assets/fonts/Righteous-Regular.ttf"),
    lato: require("./assets/fonts/Lato-Regular.ttf"),
    "lato-bold": require("./assets/fonts/Lato-Bold.ttf"),
  });

  // ---------- ALL app state lives here in App.js ----------

  // which screen is showing. "" = home screen, "review" = order review screen
  const [currentScreen, setCurrentScreen] = useState("");
  // price of the order before tax, gets calculated when the order is submitted
  const [currentPrice, setCurrentPrice] = useState(0);

  // radio buttons for the service time (standard / expedited / next day)
  // useMemo so the array isn't rebuilt every render (recommended by the library)
  const repairTimeRadioButtons = useMemo(
    () => [
      {
        id: "0",
        label: "Standard",
        value: "Standard",
        price: 0,
        borderColor: Colors.primary500,
        color: Colors.primary500,
      },
      {
        id: "1",
        label: "Expedited",
        value: "Expedited",
        price: 50,
        borderColor: Colors.primary500,
        color: Colors.primary500,
      },
      {
        id: "2",
        label: "Next Day",
        value: "Next Day",
        price: 100,
        borderColor: Colors.primary500,
        color: Colors.primary500,
      },
    ],
    []
  );

  // which radio button is picked. the radio button ids are strings,
  // so I start it at "0" so Standard is selected by default
  const [repairTimeId, setRepairTimeId] = useState("0");

  // checkbox service options. value = whether the box is checked
  const [services, setServices] = useState([
    { id: 0, name: "Basic Tune-Up", value: false, price: 50 },
    { id: 1, name: "Comprehensive Tune-Up", value: false, price: 75 },
    { id: 2, name: "Flat Tire Repair", value: false, price: 20 },
    { id: 3, name: "Brake Servicing", value: false, price: 50 },
    { id: 4, name: "Gear Servicing", value: false, price: 40 },
    { id: 5, name: "Chain Servicing", value: false, price: 15 },
    { id: 6, name: "Frame Repair", value: false, price: 35 },
    { id: 7, name: "Safety Check", value: false, price: 25 },
    { id: 8, name: "Accessory Install", value: false, price: 10 },
  ]);

  // switches
  const [newsletter, setNewsletter] = useState(false);
  const [rentalMembership, setRentalMembership] = useState(false);

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
    let price = 0;

    // price of the selected service time
    const selectedTime = repairTimeRadioButtons.find(
      (button) => button.id === repairTimeId
    );
    price += selectedTime.price;

    // add every checked service option
    for (const service of services) {
      if (service.value) {
        price += service.price;
      }
    }

    // newsletter is free, rental membership is $100
    if (rentalMembership) {
      price += 100;
    }

    setCurrentPrice(price);
    setCurrentScreen("review");
  }

  // runs when "Return Home" is pressed. puts everything back to the defaults
  // so the user can start a brand new order
  function returnHomeHandler() {
    setRepairTimeId("0");
    // uncheck every service option
    setServices((prevServices) =>
      prevServices.map((service) => ({ ...service, value: false }))
    );
    setNewsletter(false);
    setRentalMembership(false);
    setCurrentPrice(0);
    setCurrentScreen("");
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
        price={currentPrice}
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
