import * as React from "react"
import { ActivityIndicator, Alert, View, Image, ViewStyle, TextStyle, ImageStyle, SafeAreaView, StatusBar } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { Text } from "../../components/text"
import { Button } from "../../components/button"
import { Screen } from "../../components/screen"
import { Wallpaper } from "../../components/wallpaper"
import { Header } from "../../components/header"
import { color, spacing } from "../../theme"
import { bowserLogo } from "."
import { BleManager, Device } from "react-native-ble-plx"

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[4],
}
const TEXT: TextStyle = {
  color: color.palette.white,
  fontFamily: "Montserrat",
}
const BOLD: TextStyle = { fontWeight: "bold" }
const HEADER: TextStyle = {
  paddingTop: spacing[3],
  paddingBottom: spacing[4] + spacing[1],
  paddingHorizontal: 0,
}
const HEADER_TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 12,
  lineHeight: 15,
  textAlign: "center",
  letterSpacing: 1.5,
}
const TITLE_WRAPPER: TextStyle = {
  ...TEXT,
  textAlign: "center",
}
const TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 28,
  lineHeight: 38,
  textAlign: "center",
}
const ALMOST: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 26,
  fontStyle: "italic",
}
const BOWSER: ImageStyle = {
  alignSelf: "center",
  marginVertical: spacing[5],
  maxWidth: "100%",
}
const CONTENT: TextStyle = {
  ...TEXT,
  color: "#BAB6C8",
  fontSize: 15,
  lineHeight: 22,
  marginBottom: spacing[5],
  textAlign: "center",
}
const CONTINUE: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
  backgroundColor: "#5D2555",
}
const CONTINUE_TEXT: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 13,
  letterSpacing: 2,
}
const FOOTER: ViewStyle = { backgroundColor: "#20162D" }
const FOOTER_CONTENT: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
}

const manager = new BleManager();

export interface HomeScreenProps extends NavigationScreenProps<{}> {}

export class HomeScreen extends React.Component<HomeScreenProps, {bleDevice}> {

  async componentDidMount() {
    manager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        this.scanAndConnect();
      }
    }, true);
  }

  displayAlert() {
    Alert.alert(
      'Error Scanning for Devices',
      '',
      [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      {cancelable: false},
    );
  }

  scanAndConnect() {
    this.setState({bleDevice: null});
    manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          this.displayAlert();
          return;
        }
        if (device.name === 'Pinnacle') {
            this.setState({bleDevice: device})
            manager.stopDeviceScan();
            return;
        }
    });
  }

  nextScreen = () => this.props.navigation.navigate("settings")

  render() {

    const bleDevice = this.state && this.state.bleDevice;

    return (
      <View style={FULL}>
        <StatusBar barStyle="light-content" />
        <Wallpaper />
        <SafeAreaView style={FULL}>
          <Screen style={CONTAINER} backgroundColor={color.transparent} preset="scrollStack">
            <Header
              headerTx="homeScreen.poweredBy"
              style={HEADER}
              titleStyle={HEADER_TITLE}
            />
            <Text style={TITLE_WRAPPER}>
            <Text style={TITLE} text={bleDevice ? ` ` : `Please Wait`} />
            </Text>
            <Image source={bowserLogo} style={BOWSER} />
            <Text style={CONTENT}>
            {bleDevice ? '1 Device Found.' : 'Searching for Pinnacle devices'}
            </Text>
            <ActivityIndicator size="large" color="#ffffff" animating={bleDevice ? false : true} />
          </Screen>
        </SafeAreaView>
        <SafeAreaView style={FOOTER}>
          <View style={FOOTER_CONTENT}>
            <Button
              style={CONTINUE}
              textStyle={CONTINUE_TEXT}
              text="REFRESH"
              onPress={() => this.scanAndConnect()}
              />
          </View>
        </SafeAreaView>
      </View>
    )
  }
}
