import { supabaseClient } from "@/lib/supbaseClient";

// interface TableRow {
//   id?: number; // Add id if it's returned from the database
//   name: string;
//   email: string;
//   contact: string;
//   address: string;
//   dateOfBirth: string;
// }

export const addData = async (): Promise<void> => {
  try {
    const response = await supabaseClient.from("clients").insert([
      {
        name: "John Doe",
        email: "john.doe@example.com",
        contact: "1234567890",
        address: "123 Main St",
        dateofbirth: "1990-01-01",
      },
    ]);

    console.log("Response data:", response);
  } catch (error) {
    console.error("Error adding data:", error);
  }
};
