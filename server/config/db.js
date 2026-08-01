import mongoose from "mongoose";
import dns from "dns";

// Fix Windows DNS SRV lookup failure for MongoDB Atlas (querySrv ECONNREFUSED)
try {
  dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
  if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder("ipv4first");
  }
} catch (dnsErr) {
  console.warn("[DNS Warning]: Could not set custom DNS servers:", dnsErr.message);
}

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`[MongoDB] Successfully Connected to Atlas Cluster: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB Warning] Connection error: ${error.message}`);
  }
};
