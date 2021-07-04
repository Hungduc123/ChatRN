import { Dimensions, StyleSheet } from "react-native";
import colors from "../colors/colors";
const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  tab: {
    width: "32%",
    padding: 10,
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 15,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  checkbox: {
    alignSelf: "center",
  },
  input: {
    width: "80%",
    borderRadius: 20,
    borderColor: colors.first,
    borderWidth: 1,
  },

  text: {
    fontSize: 30,
  },
  name: {
    fontWeight: "bold",
    fontSize: 17,
  },
  image: {
    width: 100,
    height: 100,
    backgroundColor: "black",
    borderRadius: 20,
    borderColor: colors.first,
    borderWidth: 2,
  },
  child: { width, justifyContent: "center" },
  card: {
    width: "80%",
    borderRadius: 20,
    borderColor: colors.first,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleTable: {
    width: "25%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  textTable: {
    width: "25%",
    fontSize: 15,

    //  alignItems: "center",
    // justifyContent: "center",
  },
});
export default styles;
