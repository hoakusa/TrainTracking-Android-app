# TrainTracking

Build with [ReactNative](https://facebook.github.io/react-native/)

### [Download app at PlayStore](https://play.google.com/store/apps/details?id=com.traintracking&hl=en)

A train tracking application that is automatically populated with a live data from the digitrafic-service API build by ReactNative.

You can find:
* Search for a trip between 2 city stations with list of [traffic train](https://rata.digitraffic.fi/api/v1/) to get a list of trains passing by a station code
  Add data json in query parameter e.g `data : { station: "SLO" }`
* Find train compositions by fetched [composition API](https://rata.digitraffic.fi/api/v1/compositions/960?departure_date=2017-05-02)
* Color styling

### See more app at my [PlayStore](https://play.google.com/store/apps/developer?id=Alice%20Pham&hl=en)

# Getting Started

## Installing & Development

1. Download/Clone the folder: `git clone https://github.com/hoakusa/TrainTracking-Android-app.git`
2. Access your local folder:  `cd yourfolder`
3. Install dependencies: `npm install`
4. Run app in development browser: `npm start`

## Deploying app to a device

Make sure you have slready installed [Android SDK](https://developer.android.com/studio/index.html) or Xcode
Run `react-native run-android`

### See full doc at [Documentation](https://facebook.github.io/react-native/docs/running-on-device.html)

## License

MIT

