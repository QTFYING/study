/* jshint esversion: 6 */
import React, { Component } from 'react';
import {
  StyleSheet, Text, View, Image, FlatList, Animated, Easing, TouchableOpacity, ScrollView, TouchableHighlight, PixelRatio, Dimensions
} from 'react-native';
import PropTypes from "prop-types";
const { width, height } = Dimensions.get('window');

class Main extends Component {
  constructor(props, context) {
    super(props, context);
    var selectIndex = new Array(this.props.data.length);
    for (var i = 0; i < selectIndex.length; i++) {
      selectIndex[i] = 0;
    }
    this.state = {
      activityIndex: -1,
      selectIndex: selectIndex,
      rotationAnims: props.data.map(() => new Animated.Value(0))
    };

    this.defaultConfig = {
      bgColor: "grey",
      tintColor: "#323232",          //正常状态下
      activityTintColor: "#ff8800",  //按下Tab时
      arrowImg: require("../images/dropdown_arrow.png"),
      checkImage: require("../images/menu_check.png")
    };
  }

  renderCheck(index, title) {
    var activityIndex = this.state.activityIndex;
    if (this.state.selectIndex[activityIndex] == index) {
      var checkImage = this.props.checkImage ? this.props.checkImage : this.defaultConfig.checkImage;
      return (
        <View style={styles.ListItemCon}>
          <Text
            style={[
              styles.item_text_style,
              { color: this.props.activityTintColor ? this.props.activityTintColor : this.defaultConfig.activityTintColor }
            ]}
          >
            {title}
          </Text>
          <Image
            source={checkImage}
            style={{
              tintColor: this.props.activityTintColor ? this.props.activityTintColor : this.defaultConfig.activityTintColor
            }}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.ListItemCon}>
          <Text
            style={[
              styles.item_text_style,
              { color: this.props.tintColor ? this.props.tintColor : this.defaultConfig.tintColor}
            ]}
          >
            {title}
          </Text>
        </View>
      );
    }
  }

  renderActivityPanel() {
    if (this.state.activityIndex >= 0) {
      var currentTitles = this.props.data[this.state.activityIndex];
      var heightStyle = {};
      if (
        this.props.maxHeight &&
        this.props.maxHeight < currentTitles.length * 44
      ) {
        heightStyle.height = this.props.maxHeight;
      }

      return (
        <Animated.View style={[styles.listConPosition, {height: height, top: 47, opacity: this.state.rotationAnims[this.state.activityIndex]}]}>
          <TouchableOpacity
            onPress={() => this.openOrClosePanel(this.state.activityIndex)}
            activeOpacity={1}>
            <View style={[styles.listConPosition, { opacity: 0.4, backgroundColor: "black", height: height }]} />
          </TouchableOpacity>

          <ScrollView
            style={[
              {
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                backgroundColor: "#fff"
              },
              heightStyle
            ]}
          >
            {currentTitles.map((title, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={1}
                style={{ flex: 1, height: 44 }}
                onPress={this.itemOnPress.bind(this, index)}
              >
                {this.renderCheck(index, title)}
                <View style={styles.grayLine}/>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      );
    } else {
      return null;
    }
  }

  openOrClosePanel(index) {
    if (this.state.activityIndex == index) {
      this.closePanel(index);
      this.setState({
        activityIndex: -1
      });
    } else {
      if (this.state.activityIndex > -1) {
        this.closePanel(this.state.activityIndex);
      }
      this.openPanel(index);
      this.setState({
        activityIndex: index
      });
    }
  }

  openPanel(index) {
    Animated.timing(this.state.rotationAnims[index], {
      toValue: 1,
      duration: 300,
      easing: Easing.linear
    }).start();
  }

  closePanel(index) {
    Animated.timing(this.state.rotationAnims[index], {
      toValue: 0,
      duration: 300,
      easing: Easing.linear
    }).start();
  }

  split(data){
    return data.length > 6 ? data.substring(0, 6) + '...' : data
  }

  itemOnPress(index) {
    if (this.state.activityIndex > -1) {
      var selectIndex = this.state.selectIndex;
      selectIndex[this.state.activityIndex] = index;
      this.setState({
        selectIndex: selectIndex
      });
    }
    this.openOrClosePanel(this.state.activityIndex);
  }

  renderDropDownArrow(index) {
    var icon = this.props.arrowImg ? this.props.arrowImg : this.defaultConfig.arrowImg;
    return (
      <Animated.Image
        source={icon}
        style={[styles.TabConIcon, {
          tintColor:
            index === this.state.activityIndex
              ? this.props.activityTintColor
                ? this.props.activityTintColor
                : this.defaultConfig.activityTintColor
              : this.props.tintColor
                ? this.props.tintColor
                : this.defaultConfig.tintColor,
          transform: [
            {
              rotateZ: this.state.rotationAnims[index].interpolate({
                inputRange: [0, 1],
                outputRange: ["0deg", "180deg"]
              })
            }
          ]
        }]}
      />
    );
  }

  render() {
    return (
      <View style = {styles.selectPage }>
        <View style = {styles.TabAllCon }>
          {this.props.data.map((rows, index) => (
            <TouchableOpacity
              activeOpacity = { 0.8 }
              onPress = { this.openOrClosePanel.bind(this, index) }
              key = { index }
              style = { styles.TabCon }
            >
              <View style = {styles.TabItemCon }>
                <Text
                  style = {[
                    styles.title_style,
                    this.props.titleStyle,
                    {
                      color:
                        index === this.state.activityIndex
                          ? this.props.activityTintColor
                            ? this.props.activityTintColor
                            : this.defaultConfig.activityTintColor
                          : this.props.tintColor
                            ? this.props.tintColor
                            : this.defaultConfig.tintColor
                    }
                  ]}
                >
                  {/* {rows[this.state.selectIndex[index]]} */}
                  {this.split(rows[this.state.selectIndex[index]])}
                </Text>
                {this.renderDropDownArrow(index)}
              </View>
            </TouchableOpacity>
          ))}
        </View>
        {this.renderActivityPanel()}
      </View>
    );
  }
}

Main.propTypes = {
  bgColor: PropTypes.string,
  tintColor: PropTypes.string,
  activityTintColor: PropTypes.string,
  arrowImg: PropTypes.number,
  checkImage: PropTypes.number,
  data: PropTypes.array,
  bannerAction: PropTypes.func,
  optionTextStyle: PropTypes.object,
  titleStyle: PropTypes.object,
  maxHeight: PropTypes.number
};

const styles = StyleSheet.create({
  grayLine: {
    backgroundColor: "#F6F6F6",
    height: 1,
    marginLeft: 15
  },
  listConPosition: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
  ListItemCon: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    flexDirection: "row",
  },
  TabItemCon: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  TabConIcon: {
    width: 16,
    height: 16,
    marginLeft: 8,
  },
  TabCon: {
    flex: 1,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#dedede',
    borderBottomWidth: 2 / PixelRatio.get(),
    borderBottomColor: '#dedede'
  },
  TabAllCon: {
    flexDirection: "row",
    flex: 1
  },
  title_style: {
    fontSize: 14
  },
  item_text_style: {
    color: "#333333",
    fontSize: 14
  },
  selectPage: {
    flexDirection: "column",
    flex: 1
  }
});

export default Main;