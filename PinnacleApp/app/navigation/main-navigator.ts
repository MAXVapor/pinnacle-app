import { createStackNavigator } from "react-navigation"
import { HomeScreen } from "../screens/home-screen"
import { SettingsScreen } from "../screens/settings-screen"

export const MainNavigator = createStackNavigator({
  home: { screen: HomeScreen },
  settings: { screen: SettingsScreen },
},
{
  headerMode: "none",
})
