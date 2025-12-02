// config/inngest.js
import connectDB from "@/config/db";
import Order from "@/models/Order";
import { User } from "@/models/User";
import { Inngest } from "inngest";

// ✅ MUST EXPORT this
export const inngest = new Inngest({
  id: "safamarwa-next",
  eventKey: process.env.INNGEST_EVENT_KEY, 
});

// USER CREATED
export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    await connectDB();
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    await User.create({
      _id: id,
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      imageUrl: image_url,
    });
  }
);

// USER UPDATED
export const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    await connectDB();
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    await User.findByIdAndUpdate(id, {
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      imageUrl: image_url,
    });
  }
);

// USER DELETED
export const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectDB();
    await User.findByIdAndDelete(event.data.id);
  }
);

// ORDER CREATED
export const createUserOrder = inngest.createFunction(
  { id: "create-user-order" },
  { event: "order/created" },
  async ({ event }) => {
    await connectDB();

    await Order.create({
      userId: event.data.userId,
      items: event.data.items,
      amount: event.data.amount,
      address: event.data.address,
      date: event.data.date,
    });

    return { success: true };
  }
);
