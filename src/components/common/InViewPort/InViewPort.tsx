// from `react-native-inviewport`
//https://github.com/yamill/react-native-inviewport
import React, { Component } from "react";
import { View, Dimensions } from "react-native";

import { InViewPortTypes, Timer, InViewPortState } from "./InViewPortTypes.types";

import { APP_SCREEN_WIDTH } from "~/constants/";

export default class InViewPort extends Component<InViewPortTypes, InViewPortState> {
  public lastValue: null | boolean;
  public interval: null | Timer = null;
  public myView: null | View | undefined = null;
  constructor(props: InViewPortTypes) {
    super(props);
    this.state = { rectTop: 0, rectBottom: 0, rectWidth: 0 };
    this.lastValue = null;
  }

  componentDidMount(): void {
    if (!this.props.disabled) {
      this.startWatching();
    }
  }

  componentWillUnmount(): void {
    this.stopWatching();
  }

  UNSAFE_componentWillReceiveProps(nextProps: InViewPortTypes): void {
    if (nextProps.disabled) {
      this.stopWatching();
    } else {
      this.lastValue = null;
      this.startWatching();
    }
  }

  startWatching(): void {
    if (this.interval) {
      return;
    }
    this.interval = setInterval(() => {
      if (!this.myView) {
        return;
      }
      this.myView.measure(
        (
          x: number,
          y: number,
          width: number,
          height: number,
          pageX: number,
          pageY: number
        ) => {
          this.setState({
            rectTop: pageY,
            rectBottom: pageY + height,
            rectWidth: this.props.useFullWidth ? APP_SCREEN_WIDTH : pageX + width
          });
        }
      );
      this.isInViewPort();
    }, this.props.delay || 100);
  }

  stopWatching(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  isInViewPort(): void {
    const window = Dimensions.get("window");
    const isVisible =
      this.state.rectBottom !== 0 &&
      this.state.rectTop >= 0 &&
      this.state.rectBottom <= window.height &&
      this.state.rectWidth > 0 &&
      this.state.rectWidth <= window.width;
    if (this.lastValue !== isVisible) {
      this.lastValue = isVisible;
      this.props.onChange(isVisible);
    }
  }

  render(): JSX.Element {
    return (
      <View
        collapsable={false}
        ref={component => {
          this.myView = component;
        }}
        {...this.props}
      >
        {this.props.children}
      </View>
    );
  }
}
