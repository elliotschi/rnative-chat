import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  TextInput,
  Dimensions,
  ScrollView
} from 'react-native';
import sendbird from 'sendbird';
const windowSize = Dimensions.get('window');

const List = ({ messageList, nameLabel }) =>
  <View>
  {messageList.map(({ user, message }, i) => (
    <View
      style={styles.messageContainer}
      key={`message-${i}`}
    >
      <Text>
        {user.name}
        <Text style={styles.messageLabel}>: {message}</Text>
      </Text>
    </View>
  ))}
  </View>

class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      messageList: []
    };

    this.handleBackPress = this.handleBackPress.bind(this);
    this.handleSendPress = this.handleSendPress.bind(this);
    this.getMessages = this.getMessages.bind(this);
  }

  componentWillMount() {
    sendbird.events.onMessageReceived = message => {
      this.setState({
        messageList: [...this.state.messageList, ...message]
      });
    };

    this.getMessages();
  }

  getMessages() {
    const { messageList } = this.state;
    sendbird.getMessageLoadMore({
      limit: 100,
      successFunc: ({ messages }) => {
        this.setState({
          messageList: [
          ...messageList,
          ...messages.reverse().reduce(
            (prev, curr) => sendbird.isMessage(curr.cmd) ? [...prev, curr.payload] : prev
            , [])
          ]
        });
      },
      errorFunc(status, err) {
        console.log(status, err);
      }
    });
  }

  handleBackPress() {
    sendbird.disconnect();
    this.props.navigator.pop();
  }

  handleSendPress() {
    sendbird.message(this.state.message);
    this.setState({ message: '' });
  }

  render() {
    const { messageList } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <TouchableHighlight
            underlayColor={'#4e4273'}
            onPress={this.handleBackPress}
            style={{marginLeft: 15}}
            >
            <Text style={{color: '#fff'}}>&lt; Back</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.chatContainer}>
          <ScrollView
            ref={node => { this._scrollView = node; }}
            onScroll={this.getMessages}
            scrollEventThrottle={16}
            onContentSizeChange={(e) => {}}
          >
            <List messageList={messageList} />
          </ScrollView>
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.textContainer}>
            <TextInput
              style={styles.input}
              value={this.state.message}
              onChangeText={text => this.setState({ message: text })}
            />
          </View>
          <View style={styles.sendContainer}>
            <TouchableHighlight
              underlayColor="#4e4273"
              onPress={this.handleSendPress}
              >
              <Text style={styles.sendLabel}>Send</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#ffffff'
  },
  topContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#6E5BAA',
    paddingTop: 20,
  },
  chatContainer: {
    flex: 11,
    justifyContent: 'center',
    alignItems: 'stretch'
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#6E5BAA'
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  sendContainer: {
    justifyContent: 'flex-end',
    paddingRight: 10
  },
  sendLabel: {
    color: '#ffffff',
    fontSize: 15
  },
  input: {
    width: windowSize.width - 70,
    color: '#555555',
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 5,
    height: 32,
    borderColor: '#6E5BAA',
    borderWidth: 1,
    borderRadius: 2,
    alignSelf: 'center',
    backgroundColor: '#ffffff'
  },
});

export default Chat;
