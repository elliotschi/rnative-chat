import React, { Component } from 'react';
import {
  StyleSheet,
  Navigator
} from 'react-native';
import Channels from './components/Channels';
import Chat from './components/Chat';
import Login from './components/Login';

const ROUTES = {
  channels: Channels,
  chat: Chat,
  login: Login
};

class Index extends Component {
  constructor(props) {
    super(props);

    this.renderScene = this.renderScene.bind(this);
  }

  renderScene(route, navigator) {
    const Comp = ROUTES[route.name];

    return <Comp routes={route} navigator={navigator} />
  }

  render() {
    return (
      <Navigator
        style={styles.container}
        initialRoute={{name: 'login'}}
        renderScene={this.renderScene}
        configureScene={() => Navigator.SceneConfigs.FloatFromRight}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default Index;
