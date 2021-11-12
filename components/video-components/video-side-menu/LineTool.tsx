import React, { useRef, useState } from "react";
import { Animated, View, StyleSheet, PanResponder } from "react-native";

import Svg, { Line } from "react-native-svg";

const RADIUS_OF_POINT = 15;

export interface LineToolProps {
  isActive: boolean;
}

export default function LineTool(props: LineToolProps) {
  const pan1 = useRef(new Animated.ValueXY()).current;
  const pan2 = useRef(new Animated.ValueXY()).current;
  const point1 = useRef(null);
  const point2 = useRef(null);
  const [x1, setX1] = useState<number>(0);
  const [x2, setX2] = useState<number>(0);
  const [y1, setY1] = useState<number>(0);
  const [y2, setY2] = useState<number>(0);
  const [transformX1, setTransformX1] = useState<number>(0);
  const [transformY1, setTransformY1] = useState<number>(0);
  const [transformX2, setTransformX2] = useState<number>(0);
  const [transformY2, setTransformY2] = useState<number>(0);

  React.useEffect(() => {
    pan1.addListener(({ x, y }) => {
      setTransformX1(x);
      setTransformY1(y);
    });
    pan2.addListener(({ x, y }) => {
      setTransformX2(x);
      setTransformY2(y);
    });
    return () => {
      pan1.removeAllListeners();
      pan2.removeAllListeners();
    };
  }, [pan1, pan2]);

  const panResponder1 = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan1.setOffset({
          x: pan1.x._value,
          y: pan1.y._value,
        });
      },
      onPanResponderMove: Animated.event([null, { dx: pan1.x, dy: pan1.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        pan1.flattenOffset();
      },
    })
  ).current;

  const panResponder2 = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan2.setOffset({
          x: pan2.x._value,
          y: pan2.y._value,
        });
      },
      onPanResponderMove: Animated.event([null, { dx: pan2.x, dy: pan2.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        pan2.flattenOffset();
      },
    })
  ).current;
  return (
    <>
      {props.isActive && (
        <>
          <Svg position="absolute" zIndex={1}>
            <Line
              x1={x1 + transformX1}
              y1={y1 + transformY1}
              x2={x2 + transformX2}
              y2={y2 + transformY2}
              stroke="red"
              strokeWidth="2"
            />
          </Svg>

          <Animated.View
            // style={{ left: pan1.x, top: pan1.y }}
            style={{
              position: "absolute",
              transform: [{ translateX: pan1.x }, { translateY: pan1.y }],
              zIndex: 1,
            }}
            onLayout={(event) => {
              console.log(
                `p1: (${event.nativeEvent.layout.x}, ${event.nativeEvent.layout.y})`
              );
              setX1(event.nativeEvent.layout.x + RADIUS_OF_POINT);
              setY1(event.nativeEvent.layout.y + RADIUS_OF_POINT);
            }}
            {...panResponder1.panHandlers}
          >
            <View ref={point1} style={styles.box} />
          </Animated.View>
          <Animated.View
            // style={{ left: pan2.x, top: pan2.y }}
            style={{
              position: "absolute",
              transform: [{ translateX: pan2.x }, { translateY: pan2.y }],
              zIndex: 1,
            }}
            onLayout={(event) => {
              setX2(event.nativeEvent.layout.x + RADIUS_OF_POINT);
              setY2(event.nativeEvent.layout.y + RADIUS_OF_POINT);
            }}
            {...panResponder2.panHandlers}
          >
            <View ref={point2} style={styles.box} />
          </Animated.View>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  parentView: {
    position: "absolute",
    bottom: 250,
    left: 300,
    backgroundColor: "rgba(0,0,0,0)",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: 50,
    borderRadius: 25,
    zIndex: 1,
  },
  box: {
    height: RADIUS_OF_POINT * 2,
    width: RADIUS_OF_POINT * 2,
    backgroundColor: "blue",
    borderRadius: RADIUS_OF_POINT,
  },
});
