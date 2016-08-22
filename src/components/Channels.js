import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  ListView,
  TouchableHighlight,
  StyleSheet
} from 'react-native';
import sendbird from 'sendbird';

const PULLDOWN_DISTANCE = 40;

class Channels extends Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

    this.state = {
      channelList: [],
      dataSource: ds.cloneWithRows([]),
      page: 0,
      next: 0,
      channelName: ''
    };

    this.handleChannelPress = this.handleChannelPress.bind(this);
    this.getChannelList = this.getChannelList.bind(this);
  }

  componentWillMount() {
    this.getChannelList(1);
  }

  handleChannelPress(url) {
    sendbird.joinChannel(
      url,
      {
        successFunc: (data) => {
          sendbird.connect({
            successFunc: (data) => {
              sendbird.getChannelInfo((channel) => {
                sendbird.connect({
                  successFunc: (data) => { this.props.navigator.push({ name: 'chat' }); },
                  errorFunc: (status, err) => { console.log(status, err); }
                });
              });
            },
            errorFunc: (status, err) => {
              console.log(status, err);
            }
          });
        },
        errorFunc: (status, err) => {
          console.log(status, err);
        }
      }
    );
  }

  getChannelList(page) {
    if (page == 0) {
      return;
    }

    const { channelList, dataSource } = this.state;

    sendbird.getChannelList({
      page,
      limit: 20,
      successFunc: ({ channels, page, next}) => {
        this.setState({
          channelList: [...channelList, ...channels]
        }, () => {
          this.setState({
            dataSource: dataSource.cloneWithRows(this.state.channelList),
            page,
            next
          });
        });
      },
      errorFunc(status, err) {
        console.log(status, err);
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.listContainer}>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={({ channel_url, cover_img_url, name, member_count }) =>
              <TouchableHighlight onPress={() => this.handleChannelPress(channel_url)}>
                <View style={styles.listItem}>
                  <View style={styles.listIcon}>
                    <Image style={styles.channelIcon} source={{uri: cover_img_url}} />
                  </View>
                  <View style={styles.listInfo}>
                    <Text style={styles.titleLabel}># {name}</Text>
                    <Text style={styles.memberLabel}>{member_count} members</Text>
                  </View>
                </View>
              </TouchableHighlight>
              }
            onEndReached={() => this.getChannelList(this.state.next)}
            onEndReachedThreshold={PULLDOWN_DISTANCE}
          />
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
  listContainer: {
    flex: 11,
    justifyContent: 'center',
    alignItems: 'stretch',
    marginTop: 10
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f8fc',
    borderBottomWidth: 0.5,
    borderColor: '#D0DBE4',
    padding: 5
  },
  listIcon: {
    justifyContent: 'flex-start',
    paddingLeft: 10,
    paddingRight: 15
  },
  channelIcon: {
    width: 30,
    height: 30
  },
  listInfo: {
    flex: 1,
    justifyContent: 'flex-start'
  },
  titleLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#60768b',
  },
  memberLabel: {
    fontSize: 13,
    fontWeight: '400',
    color: '#abb8c4',
  }
});

export default Channels;
