import React, {
  Component,
  PropTypes,
} from 'react';
import {
  StyleSheet,
  Text,
  Animated,
  Dimensions,
} from 'react-native';

const Screen = Dimensions.get('window');

const propTypes = {
  timeout: PropTypes.number,
  fadeTime: PropTypes.number,
  minOpacity: PropTypes.number,
  maxOpacity: PropTypes.number,
  message: PropTypes.string,
};

const defaultProps = {
  timeout: 3000,
  fadeTime: 500,
  minOpacity: 0.0,
  maxOpacity: 0.9,
  message: '',
};

class Notification extends Component {
  constructor(props) {
    super(props);

    this.state = {
      opacityValue: new Animated.Value(this.props.minOpacity),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.random == this.props.random 
      && nextProps.random != void 0) {
      return;
    }

    if (nextProps.message) {
      this.fadeIn();

      const timerId = setTimeout(() => {
        this.fadeOut();
        clearTimeout(timerId);
      }, this.props.timeout);
    }
  }

  fadeIn = () => {
    Animated.timing(this.state.opacityValue, {
      duration: this.props.fadeTime,
      toValue: this.props.maxOpacity,
    }).start();
  }

  fadeOut = () => {
    Animated.timing(this.state.opacityValue, {
      duration: this.props.fadeTime,
      toValue: this.props.minOpacity,
    }).start();
  }

  render() {
    if ( this.props.message === '' ) {
      return null;
    }

    return (
      <Animated.View style={[styles.container, { opacity: this.state.opacityValue }]}>
        <Text style={styles.message}>{this.props.message}</Text>
      </Animated.View>
    );
  }
}

Notification.propTypes = propTypes;
Notification.defaultProps = defaultProps;
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 200,
    width: Screen.width - 200,
    left: 100,
    right: 100,
    backgroundColor: '#444',
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 1,
    shadowOffset: {
      width: 0,
      height: 1,
    },
  },
  message: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Notification;
