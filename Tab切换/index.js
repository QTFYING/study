/* jshint esversion: 6 */
import React, { Component } from 'react';
import {
  StyleSheet, Text, View, Image, FlatList, Animated, Easing, TouchableOpacity, ScrollView, TouchableHighlight, PixelRatio
} from 'react-native';
import Main from './main';

class SelectPage extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      text: ''
    };
  }

  render() {
    let data = [
      ["全部银行", "银行1", "银行2", "银行3", "银行4", "银行5", "银行6", "银行7", "银行8"],
      ["全部标签", "标签1", "标签2", "标签3", "标签4"],
      ["全部等级", "等级1", "等级2", "等级3"]
    ];
    let HomeStore = {};
    return (
      <View style={styles.selectPage}>
          <Main
            tintColor={"#323232"}                  //正常状态下
            activityTintColor={"#ff8800"}         //按下Tab时
             data = {data}
            handler={(selection, row) =>
              this.setState({ text: data[selection][row] })
            }
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({

});

export default SelectPage;