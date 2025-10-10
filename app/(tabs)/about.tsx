import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");
const SWIPE_THRESHOLD = 0.25 * width;

type Page = {
  id: number;
  text: string;
};

export default function About() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About Us</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  }
});

// const pages: Page[] = [
//   { id: 1, text: "Page 1" },
//   { id: 2, text: "Page 2" },
//   { id: 3, text: "Page 3" },
//   { id: 4, text: "Page 4" },
// ];

// export default function SlidingCards() {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const translateX = useSharedValue(0);

//   const handleSwipe = (direction: "left" | "right") => {
//     if (direction === "left" && currentIndex < pages.length - 1) {
//       setCurrentIndex((prev) => prev + 1);
//     } else if (direction === "right" && currentIndex > 0) {
//       setCurrentIndex((prev) => prev - 1);
//     }
//     translateX.value = 0;
//   };

//   const onGestureEvent = (event: PanGestureHandlerGestureEvent) => {
//     translateX.value = event.nativeEvent.translationX;
//     if (event.nativeEvent.state === 5) {
//       // END
//       if (translateX.value < -SWIPE_THRESHOLD) {
//         runOnJS(handleSwipe)("left");
//       } else if (translateX.value > SWIPE_THRESHOLD) {
//         runOnJS(handleSwipe)("right");
//       } else {
//         translateX.value = withSpring(0);
//       }
//     }
//   };

//   const animatedStyle = useAnimatedStyle(() => {
//     return {
//       transform: [{ translateX: translateX.value }],
//     };
//   });

//   return (
//     <View style={styles.container}>
//       <PanGestureHandler onGestureEvent={onGestureEvent}>
//         <Animated.View style={[styles.card, animatedStyle]}>
//           <Text style={styles.text}>{pages[currentIndex].text}</Text>
//         </Animated.View>
//       </PanGestureHandler>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#f5f5f5",
//   },
//   card: {
//     width: width * 0.8,
//     height: 400,
//     backgroundColor: "white",
//     borderRadius: 16,
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOpacity: 0.15,
//     shadowOffset: { width: 0, height: 6 },
//     shadowRadius: 10,
//     elevation: 5,
//   },
//   text: {
//     fontSize: 32,
//     fontWeight: "bold",
//   },
// });
