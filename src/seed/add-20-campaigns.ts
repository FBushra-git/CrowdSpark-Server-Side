import "dotenv/config";
import mongoose from "mongoose";
import { Campaign } from "../models/campaign.model.js";

type SeedCampaign = {
  title: string;
  story: string;
  category: string;
  fundingGoal: number;
  minimumContribution: number;
  deadline: Date;
  rewardInfo: string;
  imageUrl: string;
  amountRaised: number;
  status: "approved";
  creatorName: string;
  creatorEmail: string;
};

const creatorName = "Nadia Rahman";
const creatorEmail = "creator@crowdspark.dev";

const rawCampaigns = [
  { title: "Riverbank Library for Young Readers", category: "Education", fundingGoal: 26000, minimumContribution: 25, deadline: "2026-10-18", amountRaised: 8200, story: "A compact riverside reading room with books, mats, lights, and weekly reading mentors for children in isolated communities.", rewardInfo: "Supporters receive reading-circle photos and a digital library donor card.", imageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80" },
  { title: "Flood-Safe School Bag Project", category: "Relief", fundingGoal: 24000, minimumContribution: 20, deadline: "2026-09-26", amountRaised: 7600, story: "Waterproof school bags with notebooks, dry clothes, and hygiene kits for children affected by seasonal flooding.", rewardInfo: "Backers receive delivery updates and student thank-you notes.", imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80" },
  { title: "Solar Lanterns for Evening Study", category: "Technology", fundingGoal: 31000, minimumContribution: 30, deadline: "2026-11-02", amountRaised: 12100, story: "Solar lanterns will help students continue studying during power cuts and reduce household kerosene use.", rewardInfo: "Supporters receive impact metrics on study hours powered.", imageUrl: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1200&q=80" },
  { title: "Community Rain Garden Network", category: "Environment", fundingGoal: 28000, minimumContribution: 35, deadline: "2026-10-21", amountRaised: 9900, story: "Neighborhood rain gardens will absorb stormwater, reduce street flooding, and create small green learning spaces.", rewardInfo: "Supporters receive planting maps and seasonal garden updates.", imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&q=80" },
  { title: "Mothers Health Checkup Camp", category: "Health", fundingGoal: 36000, minimumContribution: 40, deadline: "2026-12-09", amountRaised: 14300, story: "Monthly checkup camps will provide basic screening, nutrition counseling, and referral support for mothers.", rewardInfo: "Backers receive anonymized health outreach reports.", imageUrl: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80" },
  { title: "Youth Podcast Studio for Local Stories", category: "Art", fundingGoal: 22000, minimumContribution: 25, deadline: "2026-10-03", amountRaised: 6800, story: "A small recording setup will train youth to document local stories, oral history, and community problem-solving.", rewardInfo: "Supporters get early access to selected podcast episodes.", imageUrl: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80" },
  { title: "Clean Cooking Stove Pilot", category: "Environment", fundingGoal: 45000, minimumContribution: 50, deadline: "2026-12-18", amountRaised: 16800, story: "Efficient cooking stoves will reduce smoke exposure and fuel costs for low-income households.", rewardInfo: "Backers receive household impact stories and emissions estimates.", imageUrl: "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&w=1200&q=80" },
  { title: "Accessible Sports Day for Children", category: "Community", fundingGoal: 18000, minimumContribution: 20, deadline: "2026-09-19", amountRaised: 5700, story: "An inclusive sports day will provide adaptive games, volunteer coaches, transport, and safe event support.", rewardInfo: "Supporters receive event photos and a community recognition badge.", imageUrl: "https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=1200&q=80" },
  { title: "Digital Safety Workshops for Teens", category: "Technology", fundingGoal: 27000, minimumContribution: 25, deadline: "2026-11-08", amountRaised: 10300, story: "Workshops will teach online safety, privacy basics, and responsible social media habits to teenagers.", rewardInfo: "Backers receive workshop materials and session recaps.", imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80" },
  { title: "Nutritious Breakfast for Exam Students", category: "Health", fundingGoal: 20000, minimumContribution: 20, deadline: "2026-09-28", amountRaised: 9300, story: "Healthy breakfast packs will support students during exam weeks in schools serving low-income families.", rewardInfo: "Supporters receive distribution logs and school feedback.", imageUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80" },
  { title: "Repair Cafe for Community Tools", category: "Community", fundingGoal: 23000, minimumContribution: 30, deadline: "2026-10-26", amountRaised: 7400, story: "A monthly repair cafe will help residents fix small appliances, bicycles, and household tools instead of replacing them.", rewardInfo: "Backers receive repair statistics and volunteer stories.", imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80" },
  { title: "Water Testing Kits for Villages", category: "Health", fundingGoal: 34000, minimumContribution: 35, deadline: "2026-11-29", amountRaised: 11600, story: "Affordable water testing kits and training will help villages detect unsafe water before illness spreads.", rewardInfo: "Supporters receive test result summaries and prevention updates.", imageUrl: "https://images.unsplash.com/photo-1581093458791-9d42e4fbd4f6?auto=format&fit=crop&w=1200&q=80" },
  { title: "Rooftop Garden Starter Kits", category: "Environment", fundingGoal: 25000, minimumContribution: 25, deadline: "2026-10-12", amountRaised: 8700, story: "Starter kits with soil, seeds, planters, and training will help families grow herbs and vegetables in dense neighborhoods.", rewardInfo: "Backers receive harvest updates and beginner guides.", imageUrl: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1200&q=80" },
  { title: "Local Maker Fair for Student Products", category: "Art", fundingGoal: 29000, minimumContribution: 30, deadline: "2026-11-17", amountRaised: 11100, story: "Students will build and showcase handmade products, prototypes, and creative work at a local maker fair.", rewardInfo: "Supporters receive fair highlights and a digital showcase catalog.", imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80" },
  { title: "First Aid Kits for Community Centers", category: "Health", fundingGoal: 21000, minimumContribution: 20, deadline: "2026-09-24", amountRaised: 7800, story: "Community centers will receive first aid kits, basic training, and emergency response posters.", rewardInfo: "Backers receive center-by-center installation updates.", imageUrl: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=1200&q=80" },
  { title: "Bike-to-School Safety Program", category: "Education", fundingGoal: 32000, minimumContribution: 40, deadline: "2026-10-31", amountRaised: 12400, story: "This program provides helmets, reflectors, safety lessons, and route planning for students who bike to school.", rewardInfo: "Supporters receive safety campaign materials and progress notes.", imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80" },
  { title: "Neighborhood Mental Wellness Circles", category: "Health", fundingGoal: 30000, minimumContribution: 35, deadline: "2026-12-01", amountRaised: 9800, story: "Facilitated peer circles will create safe spaces for stress support, referrals, and wellness education.", rewardInfo: "Backers receive anonymized attendance and wellness resource updates.", imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80" },
  { title: "Low-Cost Robotics Club", category: "Technology", fundingGoal: 37000, minimumContribution: 45, deadline: "2026-11-23", amountRaised: 15500, story: "A school robotics club will use low-cost kits to teach electronics, teamwork, and problem solving.", rewardInfo: "Supporters receive project videos and competition updates.", imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80" },
  { title: "Community Fridge Food Rescue", category: "Community", fundingGoal: 41000, minimumContribution: 40, deadline: "2026-12-15", amountRaised: 16200, story: "A community fridge and food rescue volunteer network will redirect safe surplus food to families who need it.", rewardInfo: "Backers receive monthly rescued-meal estimates and operations updates.", imageUrl: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=1200&q=80" },
  { title: "Wetland Cleanup and Bird Watch Deck", category: "Environment", fundingGoal: 35000, minimumContribution: 35, deadline: "2026-11-11", amountRaised: 13200, story: "Volunteers will clean a local wetland and build a small educational bird watch deck for students and families.", rewardInfo: "Supporters receive cleanup photos, species notes, and deck progress updates.", imageUrl: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80" }
] as const;

const campaigns: SeedCampaign[] = rawCampaigns.map((campaign) => ({
  ...campaign,
  deadline: new Date(campaign.deadline),
  status: "approved",
  creatorName,
  creatorEmail
}));

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
