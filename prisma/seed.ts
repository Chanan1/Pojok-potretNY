import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🎨 REALISTIC USER DATA
const USERS = [
  {
    name: "Luna Creative",
    username: "luna_creative",
    email: "luna@creative.com",
    bio: "✨ Digital artist & template designer | Pastel vibes only",
    avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=luna_creative&scale=80",
    socials: JSON.stringify({
      instagram: "@luna_creative",
      tiktok: "@lunacreative",
    }),
    level: 4,
  },
  {
    name: "John Casual",
    username: "john_casual",
    email: "john@casual.com",
    bio: "Just capturing moments 📸",
    avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=john_casual&scale=80",
    socials: JSON.stringify({ instagram: "@johncasual" }),
    level: 1,
  },
  {
    name: "Sophia Design",
    username: "sophia_design",
    email: "sophia@design.studio",
    bio: "🎨 Professional designer | Aesthetic booth templates",
    avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=sophia_design&scale=80",
    socials: JSON.stringify({
      instagram: "@sophiadesignco",
      website: "www.sophiadesign.com",
    }),
    level: 5,
  },
  {
    name: "Alex Moments",
    username: "alex_moments",
    email: "alex@moments.com",
    bio: "Fun & colorful 🌈 | Event enthusiast",
    avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=alex_moments&scale=80",
    socials: JSON.stringify({ instagram: "@alexmoments" }),
    level: 2,
  },
  {
    name: "Maya Studio",
    username: "maya_studio",
    email: "maya@studio.pro",
    bio: "📷 Professional event photographer | Premium templates",
    avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=maya_studio&scale=80",
    socials: JSON.stringify({
      instagram: "@mayastudioco",
      website: "www.mayastudio.pro",
    }),
    level: 6,
  },
];

// 🎨 TEMPLATE CATEGORIES & DATA
const TEMPLATE_CONFIGS = [
  // Luna Creative - pastel & cute
  {
    creator: "luna_creative",
    templates: [
      {
        name: "Soft Pastel Duo",
        description: "Sweet pastel design for couples or best friends 💕",
        src: "/templates/2 Foto/Pink and White Fun Friendship Photostrip Bookmark.png",
        category: "couple",
        frameCount: 2,
      },
      {
        name: "Dreamy Moments",
        description: "Dreamy aesthetic with soft filters ✨",
        src: "/templates/4 Foto/Colorful Cute Retro Groovy Love My Buddie PhotoStrip.png",
        category: "cute",
        frameCount: 4,
      },
      {
        name: "Minimalist Vibes",
        description: "Clean and minimal design for modern aesthetic",
        src: "/templates/3 Foto/Pink and White Minimalist Photobooth Template Photostrip.png",
        category: "minimal",
        frameCount: 3,
      },
    ],
  },
  // John Casual - casual & fun
  {
    creator: "john_casual",
    templates: [
      {
        name: "Fun Friends Forever",
        description: "Vibrant design for group photos 🎉",
        src: "/templates/4 Foto/Colorful Summer Photobooth Template Photostrip.png",
        category: "fun",
        frameCount: 4,
      },
      {
        name: "Classic Duo",
        description: "Timeless design for any occasion",
        src: "/templates/2 Foto/White and Red Modern Friends Photostrip Bookmark (1).png",
        category: "minimal",
        frameCount: 2,
      },
    ],
  },
  // Sophia Design - professional & aesthetic
  {
    creator: "sophia_design",
    templates: [
      {
        name: "Professional Elegance",
        description: "Premium template for corporate events 👔",
        src: "/templates/6 Foto/Minimalist Aesthetic Photo Collage Polaroid Frame Instagram Story.png",
        category: "minimal",
        frameCount: 6,
      },
      {
        name: "Vintage Romance",
        description: "Vintage-inspired design with warm tones",
        src: "/templates/4 Foto/Monochrome Sepia Aesthetic Minimalist Modern Simple Retro Traditional Vintage Photo Strip Your Story.png",
        category: "vintage",
        frameCount: 4,
      },
      {
        name: "Aesthetic Couple",
        description: "Beautiful couples template with soft colors 💑",
        src: "/templates/3 Foto/Black and Beige Retro Portraits Photo Booth Bookmark.png",
        category: "couple",
        frameCount: 3,
      },
      {
        name: "Modern Chic",
        description: "Contemporary design with bold lines",
        src: "/templates/8 Foto/Colorful Cute Retro Groovy Love My Buddie PhotoStrip.png",
        category: "minimal",
        frameCount: 8,
      },
    ],
  },
  // Alex Moments - colorful & fun
  {
    creator: "alex_moments",
    templates: [
      {
        name: "Rainbow Fun",
        description: "Colorful and playful design for parties 🌈",
        src: "/templates/6 Foto/Blue Yellow and Pink Illustrative Birthday Photo Strip.png",
        category: "fun",
        frameCount: 6,
      },
      {
        name: "Happy Memories",
        description: "Bright and cheerful memories template",
        src: "/templates/4 Foto/Red Cute Illustration Valentine's Day Photostrip.png",
        category: "cute",
        frameCount: 4,
      },
      {
        name: "Friendship Gold",
        description: "Golden moments with friends ✨",
        src: "/templates/3 Foto/Blue and White Bright Sky Cloud Style Summer Photo Studio Photostrip.png",
        category: "fun",
        frameCount: 3,
      },
    ],
  },
  // Maya Studio - professional
  {
    creator: "maya_studio",
    templates: [
      {
        name: "Wedding Premium",
        description: "Elegant wedding template for special moments 💍",
        src: "/templates/8 Foto/Minimalist Aesthetic Photo Collage Polaroid Frame Instagram Story.png",
        category: "couple",
        frameCount: 8,
      },
      {
        name: "Corporate Event",
        description: "Professional template for business events",
        src: "/templates/6 Foto/Pink and White Fun Cute Grand Opening Photo Studio Photostrip.png",
        category: "minimal",
        frameCount: 6,
      },
      {
        name: "Black & Gold",
        description: "Luxurious black and gold design 🎩",
        src: "/templates/4 Foto/White and Grey Minimalist Photostrip.png",
        category: "vintage",
        frameCount: 4,
      },
      {
        name: "Studio Pro Collection",
        description: "Professional multi-photo collection layout",
        src: "/templates/2 Foto/Pink and White Fun Friendship Photostrip Bookmark.png",
        category: "minimal",
        frameCount: 2,
      },
    ],
  },
];

async function main() {
  try {
    console.log("🌱 Starting database seeding...\n");

    // Step 1: Clear existing data
    console.log("🗑️  Clearing existing data...");
    await prisma.like.deleteMany({});
    await prisma.boothSession.deleteMany({});
    await prisma.template.deleteMany({});
    await prisma.user.deleteMany({});
    console.log("✅ Data cleared\n");

    // Step 2: Create users
    console.log("👥 Creating 5 users...");
    const createdUsers: { [key: string]: string } = {};

    for (const userData of USERS) {
      const user = await prisma.user.create({
        data: {
          name: userData.name,
          username: userData.username,
          email: userData.email,
          password: "demo",
          bio: userData.bio,
          avatar: userData.avatar,
          socials: userData.socials,
          level: userData.level,
        },
      });
      createdUsers[user.username] = user.id;
      console.log(`  ✓ Created: ${user.name} (@${user.username})`);
    }
    console.log("✅ Users created\n");

    // Step 3: Create templates
    console.log("🎨 Creating templates...");
    const allTemplates: {
      templateId: string;
      creatorUsername: string;
      name: string;
      frameCount: number;
    }[] = [];

    for (const config of TEMPLATE_CONFIGS) {
      const creatorId = createdUsers[config.creator];

      for (const templateData of config.templates) {
        const template = await prisma.template.create({
          data: {
            name: templateData.name,
            description: templateData.description,
            src: templateData.src,
            category: templateData.category,
            frameCount: templateData.frameCount,
            creatorId: creatorId,
            status: "PUBLISHED",
            isPublic: true,
            usageCount: Math.floor(Math.random() * 100) + 5,
            downloadCount: Math.floor(Math.random() * 50) + 2,
          },
        });

        allTemplates.push({
          templateId: template.id,
          creatorUsername: config.creator,
          name: template.name,
          frameCount: template.frameCount,
        });

        console.log(
          `  ✓ Created: "${template.name}" (${template.frameCount} frame) by ${config.creator}`
        );
      }
    }
    console.log(`✅ ${allTemplates.length} templates created\n`);

    // Step 4: Simulate likes
    console.log("❤️  Simulating likes...");
    const usernames = Object.keys(createdUsers);
    let likeCount = 0;

    // Each user likes random templates (but not their own)
    for (const username of usernames) {
      const userId = createdUsers[username];
      const userTemplates = allTemplates.filter(
        (t) => t.creatorUsername !== username
      );

      // Random 3-8 likes per user
      const likeCount_ = Math.floor(Math.random() * 6) + 3;

      for (let i = 0; i < likeCount_; i++) {
        const randomTemplate =
          userTemplates[Math.floor(Math.random() * userTemplates.length)];

        try {
          await prisma.like.create({
            data: {
              userId: userId,
              templateId: randomTemplate.templateId,
            },
          });
          likeCount++;
        } catch (e) {
          // Duplicate like - skip
        }
      }

      const templateLikes = await prisma.like.count({
        where: { userId: userId },
      });
      console.log(`  ✓ ${username} liked ${templateLikes} templates`);
    }
    console.log(`✅ ${likeCount} likes created\n`);

    // Step 5: Create booth sessions
    console.log("📸 Creating booth sessions...");
    const layouts = ["portrait", "landscape"];
    const filters = ["normal", "bw", "warm", "cool", "vintage"];
    const sessionCount = 15;

    for (let i = 0; i < sessionCount; i++) {
      const randomTemplate =
        allTemplates[Math.floor(Math.random() * allTemplates.length)];

      await prisma.boothSession.create({
        data: {
          templateId: randomTemplate.templateId,
          layout: layouts[Math.floor(Math.random() * layouts.length)],
          filter: filters[Math.floor(Math.random() * filters.length)],
          photoCount: [2, 3, 4, 6][Math.floor(Math.random() * 4)],
          metadata: JSON.stringify({
            timestamp: new Date().toISOString(),
            userAgent: "Mozilla/5.0 (Photo Booth)",
            session: `session_${i + 1}`,
          }),
        },
      });
    }
    console.log(`✅ ${sessionCount} booth sessions created\n`);

    // Step 6: Summary
    console.log("═══════════════════════════════════════════════════");
    console.log("📊 SEEDING COMPLETE - DATABASE SUMMARY");
    console.log("═══════════════════════════════════════════════════\n");

    const userCount = await prisma.user.count();
    const templateCount = await prisma.template.count();
    const likeCountTotal = await prisma.like.count();
    const boothSessionCount = await prisma.boothSession.count();

    console.log(`👥 Users: ${userCount}`);
    console.log(`🎨 Templates: ${templateCount}`);
    console.log(`❤️  Total likes: ${likeCountTotal}`);
    console.log(`📸 Booth sessions: ${boothSessionCount}`);
    console.log("\n");

    // List all users with their templates
    console.log("📋 User Templates Overview:");
    console.log("───────────────────────────────────────────────────\n");

    for (const username of usernames) {
      const userId = createdUsers[username];
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          templates: {
            select: {
              name: true,
              category: true,
              frameCount: true,
              usageCount: true,
            },
          },
          _count: {
            select: { likes: true },
          },
        },
      });

      console.log(`🎨 ${user?.name} (@${username})`);
      console.log(`   📍 ${user?.templates.length} templates`);
      user?.templates.forEach((t) => {
        console.log(
          `     • ${t.name} (${t.category}, ${t.frameCount}F, used ${t.usageCount}x)`
        );
      });
      console.log("");
    }

    console.log("═══════════════════════════════════════════════════");
    console.log("✅ Database sudah berisi data realistis dan siap testing!");
    console.log("═══════════════════════════════════════════════════\n");

    console.log("🚀 Next steps:");
    console.log("  1. npx next dev");
    console.log("  2. Open http://localhost:3000/explore");
    console.log("  3. Test template browsing & filtering");
    console.log("  4. Check profile pages with real data\n");
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
