import "dotenv/config";
import mongoose from "mongoose";
import { Campaign } from "../models/campaign.model.js";

const campaigns = [
  {
    title: "Urban Tree Nursery for Heat-Resilient Streets",
    story: "This campaign builds a small community tree nursery that grows shade trees for overheated streets, schools, and public walkways. Funds cover seedlings, soil, watering tools, protective guards, and volunteer planting days.",
    category: "Environment",
    fundingGoal: 36000,
    minimumContribution: 40,
    deadline: new Date("2026-10-15"),
    rewardInfo: "Supporters receive planting updates, a digital certificate, and their name on the community impact wall.",
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80",
    amountRaised: 11200,
    status: "approved" as const,
    creatorName: "Nadia Rahman",
    creatorEmail: "creator@crowdspark.dev"
  },
  {
    title: "Mobile STEM Lab for Rural Schools",
    story: "A traveling STEM lab will bring hands-on science kits, robotics lessons, and basic coding workshops to rural schools that do not have dedicated lab facilities.",
    category: "Technology",
    fundingGoal: 52000,
    minimumContribution: 50,
    deadline: new Date("2026-11-04"),
    rewardInfo: "Backers receive classroom photos, student project showcases, and beta access to lesson materials.",
    imageUrl: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&w=1200&q=80",
    amountRaised: 18450,
    status: "approved" as const,
    creatorName: "Nadia Rahman",
    creatorEmail: "creator@crowdspark.dev"
  },
  {
    title: "Emergency Food Packs for Working Families",
    story: "We will prepare weekly food packs for families facing temporary income loss. Each pack includes rice, lentils, oil, vegetables, and child-friendly nutrition items.",
    category: "Community",
    fundingGoal: 28000,
    minimumContribution: 25,
    deadline: new Date("2026-09-22"),
    rewardInfo: "Supporters receive transparent distribution logs and monthly impact notes.",
    imageUrl: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80",
    amountRaised: 9650,
    status: "approved" as const,
    creatorName: "Nadia Rahman",
    creatorEmail: "creator@crowdspark.dev"
  },
  {
    title: "Clean Air Classroom Ventilation Kits",
    story: "This project installs low-cost ventilation and air-quality monitoring kits in classrooms to improve student health during hot and polluted months.",
    category: "Health",
    fundingGoal: 44000,
    minimumContribution: 60,
    deadline: new Date("2026-12-12"),
    rewardInfo: "Supporters get installation updates, air-quality reports, and school thank-you notes.",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
    amountRaised: 15100,
    status: "approved" as const,
    creatorName: "Nadia Rahman",
    creatorEmail: "creator@crowdspark.dev"
  },
  {
    title: "Reusable Art Kits for Young Creators",
    story: "We are building reusable art kits for children in community learning centers. Kits include paints, sketchbooks, clay tools, recycled craft supplies, and guided activity cards.",
    category: "Art",
    fundingGoal: 19000,
    minimumContribution: 20,
    deadline: new Date("2026-10-30"),
    rewardInfo: "Backers receive a digital gallery of student artwork and behind-the-scenes studio updates.",
    imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80",
    amountRaised: 7100,
    status: "approved" as const,
    creatorName: "Nadia Rahman",
    creatorEmail: "creator@crowdspark.dev"
  },
  {
    title: "Women-Led Sewing Microstudio",
    story: "A neighborhood sewing microstudio will train women in tailoring, repair, and product finishing while providing shared machines and starter materials.",
    category: "Community",
    fundingGoal: 33000,
    minimumContribution: 35,
    deadline: new Date("2026-11-20"),
    rewardInfo: "Supporters receive maker stories, product previews, and early access to community-made items.",
    imageUrl: "https://images.unsplash.com/photo-1517840933437-c41356892b35?auto=format&fit=crop&w=1200&q=80",
    amountRaised: 12750,
    status: "approved" as const,
    creatorName: "Nadia Rahman",
    creatorEmail: "creator@crowdspark.dev"
  },
  {
    title: "Smart Compost Bins for Apartment Blocks",
    story: "This campaign funds smart compost bins and resident training for apartment buildings, reducing food waste and producing compost for rooftop gardens.",
    category: "Environment",
    fundingGoal: 30000,
    minimumContribution: 30,
    deadline: new Date("2026-10-08"),
    rewardInfo: "Backers receive waste reduction dashboards, composting guides, and monthly progress updates.",
    imageUrl: "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=1200&q=80",
    amountRaised: 8900,
    status: "approved" as const,
    creatorName: "Nadia Rahman",
    creatorEmail: "creator@crowdspark.dev"
  },
  {
    title: "Accessible Reading Corner for Children",
    story: "We will create a quiet reading corner with accessible books, soft seating, audio stories, and weekend reading circles for children of different learning needs.",
    category: "Education",
    fundingGoal: 21000,
    minimumContribution: 25,
    deadline: new Date("2026-09-30"),
    rewardInfo: "Supporters receive book lists, reading-circle updates, and a thank-you page in the community library.",
    imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80",
    amountRaised: 6400,
    status: "approved" as const,
    creatorName: "Nadia Rahman",
    creatorEmail: "creator@crowdspark.dev"
  },
  {
    title: "Low-Cost Telehealth Booth for Villages",
    story: "A telehealth booth will connect patients in remote villages with doctors for routine consultations, follow-ups, and health education sessions.",
    category: "Health",
    fundingGoal: 48000,
    minimumContribution: 50,
    deadline: new Date("2026-12-05"),
    rewardInfo: "Supporters receive anonymized visit stats, launch photos, and healthcare impact updates.",
    imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
    amountRaised: 17300,
    status: "approved" as const,
    creatorName: "Nadia Rahman",
    creatorEmail: "creator@crowdspark.dev"
  },
  {
    title: "Community Solar Charging Hub",
    story: "This hub will provide solar-powered phone and device charging during outages, supporting students, workers, and small vendors who rely on mobile connectivity.",
    category: "Technology",
    fundingGoal: 39000,
    minimumContribution: 40,
    deadline: new Date("2026-11-14"),
    rewardInfo: "Supporters get build progress, usage statistics, and a launch-day recognition card.",
    imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80",
    amountRaised: 14680,
    status: "approved" as const,
    creatorName: "Nadia Rahman",
    creatorEmail: "creator@crowdspark.dev"
  }
];

async function main() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required");
  await mongoose.connect(process.env.MONGODB_URI);
  let inserted = 0;
  for (const campaign of campaigns) {
    const exists = await Campaign.findOne({ title: campaign.title });
    if (!exists) {
      await Campaign.create(campaign);
      inserted += 1;
    }
  }
  const total = await Campaign.countDocuments();
  console.log(`Inserted ${inserted} new campaigns. Total campaigns: ${total}`);
  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});

