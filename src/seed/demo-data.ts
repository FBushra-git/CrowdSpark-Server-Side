import bcrypt from "bcryptjs";
import { Campaign } from "../models/campaign.model.js";
import { User } from "../models/user.model.js";

const demoUsers = [
  {
    name: "Admin User",
    email: "admin@crowdspark.dev",
    password: "Admin@12345",
    photoUrl: "https://i.ibb.co/7QpKsCX/avatar-admin.png",
    role: "admin",
    credits: 500
  },
  {
    name: "Nadia Rahman",
    email: "creator@crowdspark.dev",
    password: "Creator@12345",
    photoUrl: "https://i.ibb.co/6P9xV4h/avatar-creator.png",
    role: "creator",
    credits: 20
  },
  {
    name: "Tariq Hasan",
    email: "supporter@crowdspark.dev",
    password: "Supporter@12345",
    photoUrl: "https://i.ibb.co/m5t8pN2/avatar-supporter.png",
    role: "supporter",
    credits: 50
  }
] as const;

const demoCampaigns = [
  {
    title: "Solar Water Pump for Coastal Families",
    story: "A community-backed campaign to build solar-powered water access for families affected by seasonal flooding.",
    category: "Community",
    fundingGoal: 24000,
    minimumContribution: 25,
    deadline: new Date("2026-08-28"),
    rewardInfo: "Supporters receive monthly impact notes and a public thank-you wall.",
    imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    amountRaised: 18750,
    status: "approved",
    creatorName: "Nadia Rahman",
    creatorEmail: "creator@crowdspark.dev"
  },
  {
    title: "FocusBand: Calm Productivity Wearable",
    story: "A compact wearable that helps remote workers track hydration, focus windows, and posture gently.",
    category: "Technology",
    fundingGoal: 42000,
    minimumContribution: 50,
    deadline: new Date("2026-09-10"),
    rewardInfo: "Early supporters get a beta device reservation and founder updates.",
    imageUrl: "https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=1200&q=80",
    amountRaised: 35980,
    status: "approved",
    creatorName: "Nadia Rahman",
    creatorEmail: "creator@crowdspark.dev"
  }
] as const;

export async function seedDemoData() {
  for (const demoUser of demoUsers) {
    const exists = await User.findOne({ email: demoUser.email });
    if (!exists) {
      const passwordHash = await bcrypt.hash(demoUser.password, 10);
      await User.create({ ...demoUser, passwordHash });
    }
  }

  for (const campaign of demoCampaigns) {
    const exists = await Campaign.findOne({ title: campaign.title });
    if (!exists) await Campaign.create(campaign);
  }
}
