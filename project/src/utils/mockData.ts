import { Blog, User, Comment } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'johndoe',
    email: 'john@example.com',
    fullName: 'John Doe',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Tech enthusiast and blogger',
    createdAt: new Date('2023-01-15'),
  },
  {
    id: '2',
    username: 'janesmith',
    email: 'jane@example.com',
    fullName: 'Jane Smith',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Lifestyle and travel writer',
    createdAt: new Date('2023-02-20'),
  },
  {
    id: '3',
    username: 'mikejohnson',
    email: 'mike@example.com',
    fullName: 'Mike Johnson',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Food and health blogger',
    createdAt: new Date('2023-03-10'),
  },
];

export const mockComments: Comment[] = [
  {
    id: '1',
    content: 'Great article! Really enjoyed reading this.',
    author: mockUsers[1],
    blogId: '1',
    createdAt: new Date('2024-01-16'),
    likes: ['2', '3'],
  },
  {
    id: '2',
    content: 'Thanks for sharing your insights on this topic.',
    author: mockUsers[2],
    blogId: '1',
    createdAt: new Date('2024-01-17'),
    likes: ['1'],
  },
];

export const mockBlogs: Blog[] = [
  {
    id: '1',
    title: 'The Future of Web Development: Trends to Watch in 2024',
    content: `<p>Web development is constantly evolving, and 2024 promises to bring exciting new trends and technologies. In this comprehensive guide, we'll explore the most significant developments that will shape the future of web development.</p>

<h2>1. AI-Powered Development Tools</h2>
<p>Artificial Intelligence is revolutionizing how we write code. From GitHub Copilot to ChatGPT, AI assistants are becoming indispensable tools for developers. These tools can help with code completion, debugging, and even generating entire functions from natural language descriptions.</p>

<h2>2. WebAssembly (WASM) Adoption</h2>
<p>WebAssembly continues to gain traction, allowing developers to run high-performance applications in web browsers. This technology enables languages like Rust, C++, and Go to run natively in the browser, opening up new possibilities for web applications.</p>

<h2>3. Progressive Web Apps (PWAs)</h2>
<p>PWAs are becoming more sophisticated, offering near-native app experiences while maintaining the accessibility of web applications. With improved offline capabilities and better integration with device features, PWAs are bridging the gap between web and mobile apps.</p>

<h2>4. Serverless Architecture</h2>
<p>The serverless paradigm is maturing, with more developers adopting Functions-as-a-Service (FaaS) for scalable, cost-effective solutions. This approach reduces infrastructure management overhead and allows developers to focus on business logic.</p>

<p>As we move forward, these trends will continue to shape how we build and deploy web applications. Stay tuned for more insights on emerging technologies!</p>`,
    excerpt: 'Explore the most significant web development trends that will shape 2024, from AI-powered tools to serverless architecture.',
    author: mockUsers[0],
    category: 'Technology',
    tags: ['Web Development', 'AI', 'WebAssembly', 'PWA', 'Serverless'],
    coverImage: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
    likes: ['2', '3'],
    comments: mockComments.filter(c => c.blogId === '1'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    published: true,
  },
  {
    id: '2',
    title: 'Digital Nomad Life: Working From Paradise',
    content: `<p>The digital nomad lifestyle has gained incredible popularity, especially after the pandemic changed how we view remote work. In this post, I'll share my experiences and tips for successfully working while traveling the world.</p>

<h2>The Reality of Digital Nomad Life</h2>
<p>While Instagram might show only the glamorous side of working from beaches and cafes, the reality is more nuanced. Yes, you get to explore amazing places, but you also face challenges like unreliable internet, time zone differences, and the constant need to find suitable workspaces.</p>

<h2>Essential Tools and Setup</h2>
<p>Having the right tools is crucial for maintaining productivity on the road. Here's what I consider essential:</p>
<ul>
<li>A reliable laptop with long battery life</li>
<li>Portable WiFi hotspot for backup internet</li>
<li>Noise-canceling headphones</li>
<li>Ergonomic laptop stand and external keyboard</li>
<li>Multiple adapters and chargers</li>
</ul>

<h2>Best Destinations for Digital Nomads</h2>
<p>Some cities are more nomad-friendly than others. My top picks include:</p>
<ul>
<li><strong>Lisbon, Portugal</strong> - Great weather, affordable, excellent internet</li>
<li><strong>Medellín, Colombia</strong> - Perfect time zone for US clients, low cost of living</li>
<li><strong>Canggu, Bali</strong> - Vibrant nomad community, beautiful beaches</li>
<li><strong>Mexico City, Mexico</strong> - Rich culture, great food, growing tech scene</li>
</ul>

<p>The key to successful nomadism is finding the right balance between work and exploration. It's not a permanent vacation, but rather a different way of living and working that can be incredibly rewarding when done right.</p>`,
    excerpt: 'Discover the realities of digital nomad life and learn practical tips for working remotely while traveling the world.',
    author: mockUsers[1],
    category: 'Lifestyle',
    tags: ['Digital Nomad', 'Remote Work', 'Travel', 'Productivity'],
    coverImage: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=800',
    likes: ['1', '3'],
    comments: [],
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
    published: true,
  },
  {
    id: '3',
    title: 'The Art of Mindful Eating: Transform Your Relationship with Food',
    content: `<p>In our fast-paced world, we often eat on autopilot, barely tasting our food or recognizing hunger and fullness cues. Mindful eating offers a different approach—one that can transform not only how we eat but also how we feel about food and our bodies.</p>

<h2>What is Mindful Eating?</h2>
<p>Mindful eating is the practice of paying full attention to the experience of eating and drinking. It involves observing how food makes you feel and the signals your body sends about taste, satisfaction, and fullness.</p>

<h2>Benefits of Mindful Eating</h2>
<p>Research has shown that mindful eating can help with:</p>
<ul>
<li>Weight management without restrictive dieting</li>
<li>Reduced binge eating and emotional eating</li>
<li>Better digestion and nutrient absorption</li>
<li>Increased satisfaction from meals</li>
<li>Improved relationship with food and body image</li>
</ul>

<h2>How to Practice Mindful Eating</h2>
<p>Start small with these simple techniques:</p>
<ol>
<li><strong>Slow down</strong> - Take at least 20 minutes to eat a meal</li>
<li><strong>Eliminate distractions</strong> - Turn off TV, put away phones</li>
<li><strong>Engage your senses</strong> - Notice colors, textures, aromas, and flavors</li>
<li><strong>Tune into hunger cues</strong> - Eat when hungry, stop when satisfied</li>
<li><strong>Practice gratitude</strong> - Appreciate the food and those who prepared it</li>
</ol>

<h2>Mindful Eating in Practice</h2>
<p>Try this exercise with your next meal: Before eating, take three deep breaths. Look at your food and notice its appearance. Take a small bite and chew slowly, paying attention to the flavors and textures. Put your fork down between bites and check in with your hunger level.</p>

<p>Remember, mindful eating isn't about perfection—it's about awareness. Even small steps toward more mindful eating can make a significant difference in your overall well-being.</p>`,
    excerpt: 'Learn how mindful eating can transform your relationship with food and improve your overall well-being through simple, practical techniques.',
    author: mockUsers[2],
    category: 'Health',
    tags: ['Mental Health', 'Nutrition', 'Mindfulness', 'Wellness'],
    coverImage: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    likes: ['1', '2'],
    comments: [],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    published: true,
  },
  {
    id: '4',
    title: 'Building Sustainable Business Practices in the Modern Era',
    content: `<p>Sustainability is no longer just a buzzword—it's a business imperative. Companies that integrate sustainable practices into their operations are not only contributing to environmental protection but also discovering new opportunities for growth and innovation.</p>

<h2>Why Sustainability Matters for Business</h2>
<p>The business case for sustainability is stronger than ever:</p>
<ul>
<li>Consumer demand for sustainable products is increasing</li>
<li>Regulatory requirements are becoming stricter</li>
<li>Sustainable practices often lead to cost savings</li>
<li>Investors are prioritizing ESG (Environmental, Social, Governance) factors</li>
<li>Employees want to work for responsible companies</li>
</ul>

<h2>Key Areas for Sustainable Business Practices</h2>

<h3>1. Supply Chain Management</h3>
<p>Evaluate your entire supply chain for environmental and social impact. Work with suppliers who share your sustainability values and implement transparency measures to track the origin of materials.</p>

<h3>2. Energy Efficiency</h3>
<p>Invest in renewable energy sources, upgrade to energy-efficient equipment, and implement smart building technologies to reduce energy consumption.</p>

<h3>3. Waste Reduction</h3>
<p>Implement circular economy principles by designing products for durability, repairability, and recyclability. Reduce packaging waste and implement comprehensive recycling programs.</p>

<h3>4. Water Conservation</h3>
<p>Monitor water usage, implement water-saving technologies, and ensure responsible water management throughout operations.</p>

<h2>Measuring and Reporting Progress</h2>
<p>Establish clear sustainability metrics and regularly report on progress. Use frameworks like GRI (Global Reporting Initiative) or SASB (Sustainability Accounting Standards Board) to ensure comprehensive and comparable reporting.</p>

<p>Remember, sustainability is a journey, not a destination. Start with small, manageable changes and gradually expand your efforts. The key is to remain committed to continuous improvement and transparent communication about your progress and challenges.</p>`,
    excerpt: 'Discover how to integrate sustainable practices into your business operations for long-term success and positive environmental impact.',
    author: mockUsers[0],
    category: 'Business',
    tags: ['Sustainability', 'Business Strategy', 'ESG', 'Corporate Responsibility'],
    coverImage: 'https://images.pexels.com/photos/8837453/pexels-photo-8837453.jpeg?auto=compress&cs=tinysrgb&w=800',
    likes: ['2'],
    comments: [],
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
    published: true,
  },
];

export const initializeMockData = () => {
  if (!localStorage.getItem('blogs')) {
    localStorage.setItem('blogs', JSON.stringify(mockBlogs));
  }
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(mockUsers));
  }
};