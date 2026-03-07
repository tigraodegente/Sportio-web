import { View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

export default function RegisterScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join the Sportio community</Text>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            Registration form with persona selection (Fan, Athlete, Bettor) will be implemented here.
          </Text>
        </View>
        <Link href="/auth/login" asChild>
          <Pressable style={styles.link}>
            <Text style={styles.linkText}>
              Already have an account? Sign in
            </Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A1628",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#78909C",
    marginBottom: 32,
  },
  placeholder: {
    backgroundColor: "#1B2838",
    borderRadius: 12,
    padding: 24,
    width: "100%",
    marginBottom: 24,
  },
  placeholderText: {
    fontSize: 14,
    color: "#78909C",
    textAlign: "center",
  },
  link: {
    padding: 12,
  },
  linkText: {
    color: "#00C853",
    fontSize: 14,
  },
});
