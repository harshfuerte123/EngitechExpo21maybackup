require('dotenv').config();
const mongoose = require('mongoose');
const Blog = require('./models/Blog');

const blogsData = [
  {
    title: "Industry 4.0: The Future of Smart Manufacturing in Gujarat",
    shortDescription: "Discover how Industrial IoT, automation, and cyber-physical systems are transforming traditional factories in Rajkot and Ahmedabad into highly efficient smart production facilities.",
    fullDescription: `
      <p>The global manufacturing landscape is undergoing a monumental paradigm shift, commonly referred to as <strong>Industry 4.0</strong> or the Fourth Industrial Revolution. In Gujarat, a leading industrial powerhouse of India, this transformation is not just a technology trend but an absolute operational necessity for companies aiming to remain globally competitive.</p>
      
      <h3>What is Smart Manufacturing?</h3>
      <p>Smart manufacturing integrates advanced technologies such as the Industrial Internet of Things (IIoT), artificial intelligence (AI), machine learning, big data analytics, and cloud computing into factory production lines. By connecting machines to digital networks, manufacturers gain real-time visibility into their entire workflow, enabling unprecedented levels of efficiency, quality control, and customizability.</p>
      
      <h3>Key Pillars of Industry 4.0 at EngiTech Expo</h3>
      <ul>
        <li><strong>Industrial IoT (IIoT):</strong> Deploying sensors on machine components to gather predictive maintenance data and reduce costly unplanned downtime.</li>
        <li><strong>Cyber-Physical Systems:</strong> Seamless communication between physical machinery and virtual software platforms, creating virtual twins of manufacturing plants.</li>
        <li><strong>Collaborative Robotics (Cobots):</strong> Smart robots designed to work alongside human operators, performing repetitive or high-precision tasks with absolute accuracy.</li>
        <li><strong>Additive Manufacturing:</strong> Precision 3D printing for rapid prototyping and tool generation, slashing product development life cycles.</li>
      </ul>
      
      <h3>Transforming Gujarat's SME Landscape</h3>
      <p>Gujarat is home to vibrant SME clusters in cities like Rajkot, Ahmedabad, Vadodara, and Jamnagar. For these companies, adopting Industry 4.0 technologies allows them to elevate their product quality to meet international export standards, lower energy consumption, and optimize raw material utilization.</p>
      <p>At the upcoming <strong>EngiTech Expo</strong>, visitors will get a hands-on look at live smart manufacturing setups, plug-and-play automation systems tailored for SMEs, and next-generation CNC machine tools designed to bring local factories into the digital age.</p>
    `,
    featuredImage: {
      url: "/images/solutionsimg_Factory_Automation_banner.webp",
      publicId: "solutionsimg_Factory_Automation_banner"
    },
    category: "Technology",
    tags: ["Industry 4.0", "Smart Manufacturing", "Automation", "IIoT"],
    author: "EngiTech Expo Team",
    seoTitle: "Industry 4.0 & Smart Manufacturing in Gujarat | EngiTech Expo Blog",
    seoDescription: "Learn how IoT, AI, and robotics are transforming manufacturing factories in Ahmedabad and Rajkot, Gujarat. Live demonstrations at EngiTech Expo.",
    status: "published"
  },
  {
    title: "Ahmedabad Engineering Trade Show 2026: The Ultimate Guide",
    shortDescription: "A comprehensive preview of the upcoming EngiTech Expo 2026 in Ahmedabad, highlighting top technology pavilions, key industrial exhibitors, and business matchmaking opportunities.",
    fullDescription: `
      <p>We are thrilled to present the definitive guide to the upcoming <strong>EngiTech Expo 2026 in Ahmedabad</strong>. As one of Western India's most highly anticipated industrial events, the expo is poised to act as a crucial catalyst for business networking, technology exchange, and industrial development.</p>
      
      <h3>Event Highlights & Pavilions</h3>
      <p>This year's exhibition will span across multiple grand dome structures, hosting hundreds of national and international exhibitors. The floor plan is strategically organized into dedicated technology zones to enhance the attendee experience:</p>
      <ul>
        <li><strong>Machine Tools Zone:</strong> Featuring high-precision CNC lathes, multi-axis machining centers, milling, and grinding machinery from top manufacturers.</li>
        <li><strong>Automation & Robotics Pavilion:</strong> Dedicated to factory automation systems, pneumatics, hydraulics, controllers, and smart sensors.</li>
        <li><strong>Welding & Cutting Arena:</strong> Spotlighting laser cutting systems, plasma cutting machines, and state-of-the-art robotic welding cells.</li>
        <li><strong>Power Tools & Hand Tools Section:</strong> Hosting reliable hand tools, electrical tools, fasteners, and industrial consumables.</li>
      </ul>
      
      <h3>Why You Must Attend</h3>
      <p>Whether you are a manufacturing business owner, an engineering specialist, a procurement professional, or an aspiring technical entrepreneur, EngiTech Expo offers valuable takeaways:</p>
      <ol>
        <li><strong>Live Demonstrations:</strong> Witness state-of-the-art machinery running in real-time, allowing you to gauge performance, speed, and precision firsthand.</li>
        <li><strong>B2B Networking:</strong> Meet directly with manufacturers, key distributors, and technology integrators to forge profitable partnerships.</li>
        <li><strong>Expert Seminars:</strong> Attend high-level technical sessions led by industry pioneers addressing topics like energy efficiency, lean manufacturing, and industrial safety.</li>
      </ol>
      
      <p>Secure your presence today! Visit our <strong>Visitor Registration</strong> portal to request your complimentary entry pass, or explore the <strong>Stall Booking</strong> section to showcase your brand to thousands of potential customers.</p>
    `,
    featuredImage: {
      url: "/images/portfolio-4.png",
      publicId: "portfolio-4"
    },
    category: "Exhibition",
    tags: ["Exhibition", "Ahmedabad 2026", "Trade Show", "B2B Events"],
    author: "Exhibition Director",
    seoTitle: "Ahmedabad EngiTech Expo 2026 Guide | Engineering Exhibition",
    seoDescription: "Your complete guide to the EngiTech Expo 2026 in Ahmedabad. Learn about machine tool pavilions, registration details, and live industrial demos.",
    status: "published"
  },
  {
    title: "Key Machine Tool Trends Revolutionizing the Engineering Sector",
    shortDescription: "An in-depth analysis of the latest technical advances in multi-axis machining, green coolants, and CNC controller systems that are optimizing modern machining workshops.",
    fullDescription: `
      <p>The engineering and machining sector is experiencing a massive push towards higher speed, absolute precision, and sustainable green operations. Today's toolrooms and production workshops are adopting innovative hardware and software trends that are fundamentally altering daily productivity standards.</p>
      
      <h3>1. Five-Axis Machining Becoming Mainstream</h3>
      <p>While 3-axis CNC systems remain popular for simple shapes, 5-axis machining is rapidly becoming the standard for complex components used in aerospace, automotive, and medical industries. By enabling a machine tool to move along five different axes simultaneously, operators can machine extremely intricate profiles in a single setup—reducing cycle times and eliminating alignment errors.</p>
      
      <h3>2. Digital Twin and CNC Virtual Simulation</h3>
      <p>Modern machine tools are now paired with virtual digital twins. Before executing a program on physical metal, machinist specialists simulate the entire operation inside advanced software. This eliminates the risk of expensive spindle crashes, optimizes tool path coordinates, and ensures the absolute safety of both operators and high-value machinery.</p>
      
      <h3>3. Eco-Friendly and Dry Machining</h3>
      <p>Environmental standards and health regulations are driving a shift away from traditional flood coolant systems towards dry machining or Minimum Quantity Lubrication (MQL). MQL delivers an incredibly fine mist of biodegradable vegetable-based lubricant directly to the cutting edge of the tool, minimizing fluid waste, reducing cleanup costs, and improving the workshop's indoor air quality.</p>
      
      <h3>4. Adaptive Control and Smart Spindles</h3>
      <p>Next-generation CNC controllers use integrated vibration and heat sensors to dynamically adapt speed and feed rates during active cutting. If the machine detects micro-vibrations or excessive tool wear, it auto-corrects parameters instantly to protect the finish quality and prevent sudden tool breakage.</p>
      
      <p>At the <strong>EngiTech Expo</strong>, leading global machine tool manufacturers will showcase these advancements live. Join us to consult directly with engineering experts and find the exact systems needed to upgrade your shop's performance.</p>
    `,
    featuredImage: {
      url: "/images/Screenshot-2026-02-02-at-7.18.15-PM.png",
      publicId: "screenshot-2026-02-02-at-7.18.15-pm"
    },
    category: "Machine Tools",
    tags: ["CNC Machining", "Machine Tools", "Engineering", "Precision Tools"],
    author: "Technical Expert",
    seoTitle: "CNC Machine Tool Trends 2026 | EngiTech Expo Insights",
    seoDescription: "Discover how five-axis machining, digital twin simulation, and green lubricants are transforming modern CNC machine workshops and boosting engineering precision.",
    status: "published"
  }
];

async function seedDatabase() {
  try {
    // Connect to database
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // Clear existing blogs
    console.log('Clearing existing blogs...');
    const deleteResult = await Blog.deleteMany({});
    console.log(`🧹 Deleted ${deleteResult.deletedCount} existing blogs`);

    // Insert new blogs
    console.log('Inserting seed blogs...');
    const insertedBlogs = [];
    for (const blogData of blogsData) {
      const blog = new Blog(blogData);
      const savedBlog = await blog.save();
      insertedBlogs.push(savedBlog);
      console.log(`- Created blog: ${savedBlog.title} (Slug: ${savedBlog.slug})`);
    }
    console.log(`🎉 Successfully seeded ${insertedBlogs.length} blogs!`);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    // Close database connection
    await mongoose.disconnect();
    console.log('Database connection closed.');
    process.exit(0);
  }
}

seedDatabase();
