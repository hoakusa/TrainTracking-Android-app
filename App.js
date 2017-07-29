import React from 'react';
import {
  AppRegistry,
  Text,
  TextInput,
  View,
  ScrollView,
  Button,
  StyleSheet,
  Picker,
  Image
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Form,
  Separator,InputField, LinkField,
  SwitchField, PickerField,DatePickerField,TimePickerField
} from 'react-native-form-generator';
import moment from 'moment';

class SearchScreen extends React.Component {
  static navigationOptions = {
    title: 'TRAIN TRACKING',
    headerStyle:{ backgroundColor: '#303841'},
    headerTitleStyle:{ 
      color: '#ecf0f1'
    },
  }

  constructor(props){
    super(props);
    this.state = {
      data:{},
      formData:{},
      stations: [],
      textDeparture: '',
      textArrival: '',
      arrDeparture: [],
      arrArrival: [],
      searchType: 0 // 0: no search, 1: departure, 2: arrival
    }
  }

  handleFormChange(formData){
    this.setState({
      formData:{
        departure: this.state.textDeparture,
        arrival: this.state.textArrival,
        date: moment(formData.date).format('YYYY-MM-DD')
      },
      data: {
        departure: this.state.data.departure,
        arrival: this.state.data.arrival,
        date: moment(formData.date).format('YYYY-MM-DD')
      }
    })
    this.props.onFormChange && this.props.onFormChange(formData);
  }
  handleFormFocus(e, component){
    //console.log(e, component);
  }
  openTermsAndConditionsURL(){

  }

  searchStation(key) {    
    var regex = new RegExp(key, 'gi');
    return filter = this.state.stations.filter((station) => {
      return station.stationName.match(regex);
    });    
  }

  searchDeparture = (key) => {
    if (key.length > 2) {
      var stations = this.searchStation(key);

      if (!!stations && stations.length > 0) {
        this.setState({
          arrDeparture: stations,
          textDeparture: stations[0].stationName,
          data: {
            departure: stations[0].stationShortCode,
            arrival: this.state.data.arrival,
            date: this.state.formData.date
          }
        });
      }
      
    }
  }

  searchArrival = (key) => {
    if (key.length > 2) {
      var stations = this.searchStation(key);

      if (!!stations && stations.length > 0) {        
        this.setState({
          arrArrival: this.searchStation(key),
          textDeparture: stations[0].stationName,
          data: {
            departure: this.state.data.departure,
            arrival: stations[0].stationShortCode,
            date: this.state.formData.date
          }
        });
      }
      
    }
  }

  selectDeparture = (val, i) => {
    var stationCode = this.state.arrDeparture.filter((station) => {
      return station.stationName === val;
    })[0].stationShortCode;

    this.setState({
      textDeparture: val,
      data: {
        departure: stationCode,
        arrival: this.state.data.arrival,
        date: this.state.formData.date
      }
    });
  } 

  selectArrival = (val, i) => {
    var stationCode = this.state.arrArrival.filter((station) => {
      return station.stationName === val;
    })[0].stationShortCode;

    this.setState({
      textArrival: val,
      data: {
        departure: this.state.data.departure,
        arrival: stationCode,
        date: this.state.formData.date
      }
    });   
  }

  getStation() {
    var url = 'https://rata.digitraffic.fi/api/v1/metadata/stations';
    fetch(url,{
      method: 'GET'
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        stations: responseJson
      })
    })
    .catch((error) => {
      console.error(error);
    });
  }

  componentDidMount() {
    this.getStation();
  }  

  render() {
    const { navigate } = this.props.navigation;

    return (
      <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
        <Form
          ref='trainsearch'
          onFocus={this.handleFormFocus.bind(this)}
          onChange={this.handleFormChange.bind(this)}
          label="Train Search">
          
          <InputField style={styles.inputText}
                      ref='departure' placeholder='From'
                      placeholderTextColor="#aaa"
                      selectionColor="#aaa"
                      underlineColorAndroid="#ddd"
                      onChangeText={this.searchDeparture}
                      value={this.state.textDeparture}/>
                      
          {(this.state.arrDeparture.length > 0) ? (
            <Picker
              selectedValue={this.state.textDeparture}
              onValueChange={this.selectDeparture}>
              {this.state.arrDeparture.map((station, i) =>
                <Picker.Item key={i} label={station.stationName} value={station.stationName} />
              )}
            </Picker>
          ):false}
          
          <InputField style={styles.inputText}
                      ref='arrival' placeholder='To'
                      placeholderTextColor="#aaa"
                      selectionColor="#aaa"
                      underlineColorAndroid="#ddd"
                      onChangeText={this.searchArrival}
                      value={this.state.textArrival}/>

          {(this.state.arrArrival.length > 0) ? (
            <Picker
              selectedValue={this.state.textArrival}
              onValueChange={this.selectArrival}>
              {this.state.arrArrival.map((station, i) =>
                <Picker.Item key={i} label={station.stationName} value={station.stationName} />
              )}
            </Picker>
          ):false}          
          <Separator /> 
          <DatePickerField ref='date'
            minimumDate={new Date('1/1/2017')}
            maximumDate={new Date()}
            placeholder='Date'/>

        </Form>
        <Separator /> 
        <Button style={styles.mainButton}
          color='#EA9215'
          onPress={() => navigate('Result', { data: this.state.data })}
          title="Search"
        />
      </ScrollView>
    );
  }
}

class ResultScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `Search Result`,
    headerStyle:{ backgroundColor: '#303841'},
    headerTitleStyle:{ 
      color: '#ecf0f1'
    },
  });

  constructor(props){
    super();
    this.state = {
      data: props.navigation.state.params.data,
      trains: [],
      isLoading: true,
      isError: false
    }
  }

  getData() {
    var url = 'https://rata.digitraffic.fi/api/v1/schedules?departure_station=' + this.state.data.departure + '&arrival_station=' + this.state.data.arrival + '&departure_date=' + this.state.data.date;
    fetch(url,{
      method: 'GET'
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        isLoading: false,
        trains: responseJson
      })
    })
    .catch((error) => {
      this.setState({
        isLoading: false,
        isError: true
      })
      console.error(error);
    });
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    const { params } = this.props.navigation.state;

    if (!this.state.isLoading && !this.state.isError && this.state.trains.length > 0) {
      return (
        <ScrollView style={styles.container}>
          {this.state.trains.map((train,i) => <Train train={train} key={i} 
            departure={params.data.departure}
            arrival={params.data.arrival}
            />)}
        </ScrollView>
      );
    } else {
      return (
        <ScrollView style={styles.container}>
          <Text>No train is on running.</Text>
        </ScrollView>
      )
    }
  }
}

class Train extends React.Component {
  render() {
    var train = this.props.train;
    var departure = train.timeTableRows.filter((item) => {
      return item.stationShortCode == this.props.departure && item.type == "DEPARTURE";
    })[0];
    var arrival = train.timeTableRows.filter((item) => {
      return item.stationShortCode == this.props.arrival && item.type == "ARRIVAL";
    })[0];

    return (
      <ScrollView style={styles.trainItem}>
        { train.runningCurrently ? (
          <View style={styles.tagOn}>
            <Text style={styles.tagtext}>ON RUNNING</Text>
          </View>
        ) : (
          <View style={styles.tagOff}>
            <Text style={styles.tagtext}>OFF</Text>
          </View>
        )}

        <View style={styles.trainDetail}>
          <View style={styles.departure}>
            <Text style={styles.traintitle}>Departure</Text>
            <Text style={styles.stationname}>{departure.stationShortCode.toUpperCase()}</Text>
            <Text style={styles.traintime}>{moment(departure.scheduledTime).format('HH:mm')}</Text>
          </View>

          <View style={styles.trainName}>
            <Text style={styles.trainname}>{train.trainType.toUpperCase() + ' ' + train.trainNumber}</Text>
            <Image style={styles.iconTrain} source={require('./img/train.png')}/>
          </View>

          <View style={styles.arrival}>
            <Text style={styles.traintitle}>Arrival</Text>
            <Text style={styles.stationname}>{arrival.stationShortCode.toUpperCase()}</Text>
            <Text style={styles.traintime}>{moment(arrival.scheduledTime).format('HH:mm')}</Text>
          </View>
        </View>

      </ScrollView>
      
    );
  }
}

const traintracking = StackNavigator({
  Search: { screen: SearchScreen },
  Result: { screen: ResultScreen },
});

var styles = StyleSheet.create({
  container: {
    paddingTop: 15,
    paddingLeft: 15,
    paddingBottom: 15,
    paddingRight: 15,
    backgroundColor: '#f5f5f5'
  },
  inputText: {
    paddingTop: 8,
    paddingBottom: 8,
    color: '#aaaaaa',
    borderColor: '#dddddd'
  },
  tagOn: {
    width: 120,
    height: 30,
    paddingTop: 6,
    paddingBottom: 6,
    backgroundColor: '#EA9215'   
  },
  tagOff: {
    width: 120,
    height: 30,
    paddingTop: 5,
    paddingBottom: 8,
    backgroundColor: '#66778A'   
  },
  tagtext: {
    color: '#eee',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  trainItem: {
    paddingTop: 20,
    paddingBottom: 20,
    borderTopColor: '#ddd',
    borderTopWidth: 1,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  trainDetail: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 16
  },
  departure: {
    flex: 1,
  },
  trainName: {
    flex: 1,
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrival: {
    flex: 1,
  },
  traintitle: {
    textAlign: 'center',
    fontSize: 14,
    color: '#aaa'
  },
  stationname: {
    textAlign: 'center',
    fontSize: 40,
    color: '#5a5a5a',
    fontFamily: 'Exo'
  },
  traintime: {
    textAlign: 'center',
    fontSize: 20,
    color: '#7a7a7a'
  },
  trainname: {
    textAlign: 'center',
    fontSize: 16,
    color: '#7a7a7a'
  },
  iconTrain: {
    width: 52,
    height: 52
  }
});

AppRegistry.registerComponent('traintracking', () => traintracking);