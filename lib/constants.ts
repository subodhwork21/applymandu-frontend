export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  shortDescription: string;
  fullDescription: string;
  skills: string[];
  postedTime: string;
  featured: boolean;
  closingDate: string;
  views: number;
  applications: number;
  tags?: string[];
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
}

export const jobs: Job[] = [
  {
    id: 1,
    title: 'Senior Software Engineer',
    company: 'TechCorp Solutions',
    location: 'Kathmandu, Nepal',
    shortDescription: 'Join our growing team as a Senior Software Engineer to build scalable solutions and lead technical initiatives.',
    fullDescription: `TechCorp Solutions is seeking an exceptional Senior Software Engineer to join our innovative development team. As a senior member of our engineering team, you'll play a crucial role in shaping our technical direction and mentoring junior developers.

We're building next-generation software solutions that help businesses transform their operations through cloud-native architectures and modern development practices. Our ideal candidate is passionate about clean code, has a strong background in full-stack development, and thrives in a collaborative environment.

You'll be working on challenging projects that push the boundaries of what's possible in web development, from high-performance microservices to sophisticated front-end applications. We value technical excellence, continuous learning, and a user-centered approach to problem-solving.

Our engineering culture emphasizes code quality, peer review, and knowledge sharing. We believe in using the right tool for the job and staying current with industry best practices while maintaining a pragmatic approach to technology adoption.`,
    skills: ['React', 'Node.js', 'AWS'],
    type: 'Full-time',
    salary: '80K - 120K',
    postedTime: '2 days ago',
    featured: false,
    closingDate: '2024-04-25',
    views: 1200,
    applications: 45,
    requirements: [
      '5+ years of experience in software development',
      'Strong proficiency in React, Node.js, and AWS',
      'Experience with microservices architecture',
      'Excellent problem-solving and communication skills',
      'Bachelor\'s degree in Computer Science or related field'
    ],
    responsibilities: [
      'Design and implement scalable software solutions',
      'Lead technical projects and mentor junior developers',
      'Collaborate with cross-functional teams to define and develop new features',
      'Ensure code quality through testing and code reviews',
      'Participate in architectural decisions and system design'
    ],
    benefits: [
      'Competitive salary and equity package',
      'Health, dental, and vision insurance',
      'Flexible working hours and remote work options',
      'Professional development budget',
      'Annual performance bonus'
    ]
  },
  {
    id: 2,
    title: 'Product Designer',
    company: 'DesignHub',
    location: 'Remote',
    shortDescription: 'Create beautiful and intuitive user experiences as part of our innovative design team.',
    fullDescription: `DesignHub is looking for a talented Product Designer to join our creative team and help shape the future of digital experiences. We're a design-first company that believes in the power of thoughtful, user-centered design to solve complex problems and create delightful experiences.

As a Product Designer at DesignHub, you'll be involved in every aspect of the product development process, from initial concept and user research to final implementation. You'll work closely with our product and engineering teams to ensure that our designs are not only beautiful but also feasible and scalable.

We're passionate about creating design systems that scale, conducting meaningful user research, and iterating based on real user feedback. Our ideal candidate brings a strong portfolio demonstrating end-to-end product design work, with a keen eye for detail and a deep understanding of user experience principles.

You'll have the opportunity to work on diverse projects across various industries, each presenting unique challenges and opportunities to innovate. We believe in a collaborative design process and encourage sharing ideas and feedback across the team.`,
    skills: ['Figma', 'UI/UX', 'Design Systems'],
    type: 'Contract',
    salary: '70K - 90K',
    postedTime: '5 days ago',
    featured: false,
    closingDate: '2024-04-24',
    views: 800,
    applications: 32,
    requirements: [
      '3+ years of experience in product design',
      'Strong proficiency in Figma and other design tools',
      'Experience with design systems and component libraries',
      'Excellent communication and collaboration skills',
      'Portfolio demonstrating user-centered design thinking'
    ],
    responsibilities: [
      'Create user-centered designs by understanding business requirements',
      'Develop and maintain design systems',
      'Create wireframes, user flows, and prototypes',
      'Conduct user research and usability testing',
      'Collaborate with developers to ensure design implementation'
    ],
    benefits: [
      'Competitive contract rates',
      'Flexible working hours',
      'Remote work setup allowance',
      'Learning and development opportunities',
      'Access to design tools and resources'
    ]
  },
  {
    id: 3,
    title: 'Marketing Manager',
    company: 'GrowthCo',
    location: 'Pokhara, Nepal',
    shortDescription: 'Drive marketing initiatives and lead business growth strategies for an innovative company.',
    fullDescription: `GrowthCo is seeking a dynamic Marketing Manager to spearhead our marketing initiatives and drive sustainable business growth. As our Marketing Manager, you'll be responsible for developing and executing comprehensive marketing strategies that align with our business objectives and market opportunities.

We're a fast-growing company that believes in data-driven decision making and innovative marketing approaches. You'll have the opportunity to work with cutting-edge marketing tools and technologies while leading a talented team of marketing professionals.

The role involves a perfect blend of strategic thinking and hands-on execution. You'll be responsible for both developing high-level marketing strategies and ensuring their effective implementation across various channels. We're looking for someone who can think creatively, analyze data effectively, and adapt quickly to market changes.

Our ideal candidate brings a strong track record of successful marketing campaigns, experience with digital marketing platforms, and the ability to lead and inspire a team. You'll work closely with our sales, product, and leadership teams to ensure our marketing efforts drive meaningful business results.`,
    skills: ['Digital Marketing', 'SEO', 'Analytics'],
    type: 'Full-time',
    salary: '60K - 85K',
    postedTime: '1 week ago',
    featured: false,
    closingDate: '2025-05-10',
    views: 950,
    applications: 28,
    requirements: [
      '5+ years of marketing experience',
      'Strong understanding of digital marketing channels',
      'Experience with marketing analytics tools',
      'Excellent leadership and communication skills',
      'Bachelor\'s degree in Marketing or related field'
    ],
    responsibilities: [
      'Develop and implement marketing strategies',
      'Manage digital marketing campaigns',
      'Analyze marketing metrics and ROI',
      'Lead and mentor the marketing team',
      'Coordinate with sales team to achieve business goals'
    ],
    benefits: [
      'Competitive salary with performance bonuses',
      'Comprehensive health insurance',
      'Professional development opportunities',
      'Flexible work arrangements',
      'Team building events and activities'
    ]
  },
  {
    id: 101,
    title: 'Senior Full Stack Developer',
    company: 'CloudTech Solutions',
    tags: ['React', 'Node.js', 'MongoDB'],
    location: 'Remote',
    type: 'Full-time',
    salary: '90K - 120K',
    shortDescription: 'Join our dynamic team to build innovative solutions that transform businesses.',
    fullDescription: `CloudTech Solutions is looking for a Senior Full Stack Developer to join our team of passionate technologists. We're building cloud-native applications that help businesses modernize their operations and achieve digital transformation.

As a Senior Full Stack Developer, you'll be working on challenging projects that require expertise across the entire technology stack. From designing robust backend services to creating responsive and performant front-end applications, you'll have the opportunity to work with cutting-edge technologies and solve complex technical challenges.

We believe in empowering our developers to make technical decisions and contribute to the architectural direction of our projects. You'll be working in an agile environment where continuous learning and innovation are encouraged. Our team values clean code, thorough testing, and thoughtful documentation.

The ideal candidate brings not only technical expertise but also the ability to mentor junior developers and collaborate effectively with cross-functional teams. We're looking for someone who can balance technical excellence with practical business needs and help drive our engineering culture forward.`,
    featured: true,
    closingDate: '2025-06-01',
    views: 2500,
    applications: 89,
    skills: ['React', 'Node.js', 'MongoDB', 'AWS'],
    postedTime: '1 day ago',
    requirements: [
      '5+ years of experience in full-stack development',
      'Strong proficiency in React, Node.js, and MongoDB',
      'Experience with cloud platforms (AWS/GCP)',
      'Excellent problem-solving and communication skills',
      'Bachelor\'s degree in Computer Science or related field'
    ],
    responsibilities: [
      'Design and implement new features and functionality',
      'Write clean, maintainable, and efficient code',
      'Collaborate with cross-functional teams',
      'Participate in code reviews and technical discussions',
      'Mentor junior developers'
    ],
    benefits: [
      'Competitive salary and equity',
      'Health, dental, and vision insurance',
      'Flexible working hours',
      'Remote work options',
      'Professional development budget'
    ]
  },
  {
    id: 102,
    title: 'Senior Product Manager',
    company: 'InnovateTech Inc.',
    tags: ['Product Strategy', 'Agile', 'Leadership'],
    location: 'Kathmandu',
    type: 'Full-time',
    salary: '85K - 110K',
    shortDescription: 'Lead product development initiatives and drive innovation in our fast-growing company.',
    fullDescription: `InnovateTech Inc. is seeking an experienced Senior Product Manager to drive our product strategy and development initiatives. As our Senior Product Manager, you'll play a crucial role in shaping our product roadmap and ensuring we deliver exceptional value to our customers.

We're a technology company focused on building innovative solutions that solve real-world problems. You'll be working with a cross-functional team of engineers, designers, and business stakeholders to identify opportunities, define requirements, and deliver successful products to market.

The ideal candidate brings a strong technical background combined with excellent product sense and business acumen. You should be comfortable making data-driven decisions while also understanding the importance of user feedback and market trends. We're looking for someone who can think strategically while maintaining attention to detail in execution.

This role offers the opportunity to have a significant impact on our product direction and company growth. You'll be empowered to make important decisions and will have the resources needed to execute on your vision. We believe in continuous learning and provide opportunities for professional development and growth.`,
    featured: true,
    closingDate: '2025-05-25',
    views: 1800,
    applications: 65,
    skills: ['Product Strategy', 'Agile', 'Leadership', 'Technical Background'],
    postedTime: '3 days ago',
    requirements: [
      '5+ years of product management experience',
      'Strong technical background',
      'Experience with Agile methodologies',
      'Excellent leadership and communication skills',
      'MBA or related advanced degree preferred'
    ],
    responsibilities: [
      'Define product vision and strategy',
      'Lead product development lifecycle',
      'Work with engineering and design teams',
      'Conduct market research and analysis',
      'Drive product launches and go-to-market strategies'
    ],
    benefits: [
      'Competitive salary and equity package',
      'Comprehensive health benefits',
      'Flexible work arrangements',
      'Professional development opportunities',
      'Annual performance bonus'
    ]
  },
  {
    id: 201,
    title: 'Data Analyst',
    company: 'DataVision',
    location: 'Kathmandu',
    salary: '55K - 70K',
    applications: 1200,
    shortDescription: 'Help drive data-driven decisions through advanced analytics and insights.',
    fullDescription: `DataVision is looking for a skilled Data Analyst to join our analytics team. In this role, you'll be responsible for transforming complex data into actionable insights that drive business decisions. We're a company that believes in the power of data to transform businesses and improve decision-making.

As a Data Analyst at DataVision, you'll work with large datasets, develop analytical models, and create compelling visualizations that tell stories with data. You'll collaborate with various departments to understand their data needs and provide solutions that help them achieve their objectives.

The ideal candidate has strong analytical skills, proficiency in SQL and Python, and experience with modern data visualization tools. You should be comfortable working with stakeholders across different levels of the organization and be able to communicate complex findings in a clear, accessible way.

We offer a collaborative environment where you'll have the opportunity to work on diverse projects across different industries. You'll be part of a team that values innovation, continuous learning, and data-driven decision making.`,
    featured: false,
    closingDate: '2025-05-08',
    views: 3200,
    skills: ['SQL', 'Python', 'Data Visualization', 'Statistics'],
    type: 'Full-time',
    postedTime: '1 week ago',
    requirements: [
      '2+ years of data analysis experience',
      'Strong SQL and Excel skills',
      'Experience with visualization tools',
      'Strong problem-solving abilities',
      'Bachelor\'s degree in Statistics, Mathematics, or related field'
    ],
    responsibilities: [
      'Analyze complex data sets',
      'Create dashboards and reports',
      'Identify trends and patterns',
      'Present findings to stakeholders',
      'Develop and maintain data pipelines'
    ],
    benefits: [
      'Competitive salary',
      'Health insurance coverage',
      'Flexible working hours',
      'Learning and development budget',
      'Regular team events'
    ]
  },
  {
    id: 301,
    title: 'Backend Developer',
    company: 'CodeCraft',
    location: 'Remote',
    shortDescription: 'Build scalable backend systems and APIs for modern web applications.',
    fullDescription: `CodeCraft is seeking a talented Backend Developer to join our engineering team. As a Backend Developer, you'll be responsible for designing and implementing robust, scalable backend systems that power our web applications. We're a technology company focused on building high-performance, secure, and reliable software solutions.

In this role, you'll work on developing RESTful APIs, optimizing database performance, and implementing security measures to protect our systems and data. You'll collaborate with frontend developers to ensure seamless integration between client and server components.

The ideal candidate has strong experience with backend technologies, particularly Node.js and Python, along with a solid understanding of database design and optimization. You should be passionate about writing clean, maintainable code and have experience with modern development practices including CI/CD and automated testing.

We offer a supportive environment where you can grow your skills and work on challenging projects. Our team values collaboration, continuous learning, and technical excellence. You'll have the opportunity to contribute to architectural decisions and help shape our technical direction.`,
    featured: false,
    closingDate: '2025-04-30',
    views: 1500,
    applications: 42,
    skills: ['Node.js', 'Python', 'Databases', 'API Design'],
    type: 'Full-time',
    salary: '75K - 95K',
    postedTime: '2 weeks ago',
    requirements: [
      '3+ years of backend development experience',
      'Strong knowledge of Node.js/Python',
      'Experience with databases',
      'Understanding of security best practices',
      'Computer Science degree or equivalent experience'
    ],
    responsibilities: [
      'Design and implement APIs',
      'Optimize database performance',
      'Implement security measures',
      'Write clean, maintainable code',
      'Collaborate with frontend developers'
    ],
    benefits: [
      'Competitive compensation',
      'Health and wellness benefits',
      'Remote work setup',
      'Continuous learning opportunities',
      'Flexible time off'
    ]
  }
];

export const getFeaturedJobs = () => jobs.filter(job => job.featured);
export const featuredJobs = getFeaturedJobs();

export const getPopularJobs = () => 
  [...jobs].sort((a, b) => (b.views + b.applications) - (a.views + a.applications)).slice(0, 3);
export const popularJobs = getPopularJobs();

export const getClosingJobs = () => {
  const today = new Date();
  return [...jobs]
    .filter(job => {
      const closingDate = new Date(job.closingDate);
      const daysUntilClosing = Math.ceil((closingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilClosing <= 7 && daysUntilClosing > 0;
    })
    .sort((a, b) => new Date(a.closingDate).getTime() - new Date(b.closingDate).getTime())
    .slice(0, 3);
};
export const closingJobs = getClosingJobs();

export const getTimeUntilClosing = (closingDate: string) => {
  const today = new Date();
  const closing = new Date(closingDate);
  const daysUntilClosing = Math.ceil((closing.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilClosing === 0) return 'Closes today';
  if (daysUntilClosing === 1) return 'Closes tomorrow';
  if (daysUntilClosing <= 7) return `Closes in ${daysUntilClosing} days`;
  return `Closes on ${closing.toLocaleDateString()}`;
};

export const popularSearches = [
  'Software Engineer',
  'Product Manager',
  'UI/UX Designer',
  'Digital Marketing',
  'Data Analyst',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'DevOps Engineer',
  'Project Manager'
];

export interface UserProfile {
  personalDetails: {
    firstName: string;
    middleName: string;
    lastName: string;
    district: string;
    municipality: string;
    cityTole: string;
    dateOfBirth: Date | null;
    mobile: string;
    hasLicense: boolean;
    hasVehicle: boolean;
    industry: string;
    preferredJobType: string;
    gender: string;
    lookingFor: string;
    salaryExpectations: string;
    careerObjectives: string;
    email: string;
  };
  experiences: Array<{
    id: number;
    position: string;
    company: string;
    industry: string;
    jobLevel: string;
    responsibilities: string;
    startDate: Date | null;
    endDate: Date | null;
    currentlyWorking: boolean;
  }>;
  education: Array<{
    id: number;
    degree: string;
    subject: string;
    institution: string;
    university: string;
    gradingType: string;
    joinedYear: Date | null;
    passedYear: Date | null;
    currentlyStudying: boolean;
  }>;
  additionalDetails: {
    skills: string[];
    languages: Array<{
      id: number;
      language: string;
      proficiency: string;
    }>;
    training: Array<{
      id: number;
      title: string;
      institution: string;
      description: string;
    }>;
    certificates: Array<{
      id: number;
      title: string;
      issuer: string;
      year: string;
    }>;
    socialLinks: {
      linkedin: string;
      github: string;
      portfolio: string;
    };
    references: Array<{
      id: number;
      name: string;
      position: string;
      company: string;
      email: string;
      phone: string;
    }>;
  };
}

export const mockUserProfile: UserProfile = {
  personalDetails: {
    firstName: "John",
    middleName: "",
    lastName: "Doe",
    district: "Kathmandu",
    municipality: "Kathmandu Metropolitan City",
    cityTole: "Thamel",
    dateOfBirth: new Date("1995-05-15"),
    mobile: "+977 98XXXXXXXX",
    hasLicense: true,
    hasVehicle: true,
    industry: "Technology",
    preferredJobType: "Full-time",
    gender: "male",
    lookingFor: "Senior Frontend Developer",
    salaryExpectations: "$80,000 - $100,000",
    careerObjectives: "Experienced Frontend Developer with 5+ years of expertise in building responsive web applications. Proficient in modern JavaScript frameworks and UI/UX principles. Strong track record of delivering high-quality projects and collaborating with cross-functional teams.",
    email: "john.doe@example.com"
  },
  experiences: [
    {
      id: 1,
      position: "Senior Frontend Developer",
      company: "TechCorp Nepal",
      industry: "Technology",
      jobLevel: "Senior",
      responsibilities: "Led frontend development for major client projects\nMentored junior developers and conducted code reviews\nImplemented responsive design principles",
      startDate: new Date("2023-01-01"),
      endDate: null,
      currentlyWorking: true
    },
    {
      id: 2,
      position: "Frontend Developer",
      company: "WebTech Solutions",
      industry: "Technology",
      jobLevel: "Mid",
      responsibilities: "Developed and maintained client websites\nCollaborated with design team on UI implementations\nOptimized application performance",
      startDate: new Date("2020-06-01"),
      endDate: new Date("2022-12-31"),
      currentlyWorking: false
    }
  ],
  education: [
    {
      id: 1,
      degree: "Bachelor's Degree",
      subject: "Computer Science",
      institution: "Tribhuvan University",
      university: "Tribhuvan University",
      gradingType: "GPA",
      joinedYear: new Date("2016-01-01"),
      passedYear: new Date("2020-12-31"),
      currentlyStudying: false
    }
  ],
  additionalDetails: {
    skills: [
      "JavaScript",
      "React.js",
      "Vue.js",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "Git",
      "Responsive Design"
    ],
    languages: [
      {
        id: 1,
        language: "English",
        proficiency: "fluent"
      },
      {
        id: 2,
        language: "Nepali",
        proficiency: "native"
      }
    ],
    training: [
      {
        id: 1,
        title: "Advanced React Patterns",
        institution: "Frontend Masters",
        description: "In-depth training on advanced React patterns and best practices"
      }
    ],
    certificates: [
      {
        id: 1,
        title: "AWS Certified Developer",
        issuer: "Amazon Web Services",
        year: "2023"
      }
    ],
    socialLinks: {
      linkedin: "https://linkedin.com/in/johndoe",
      github: "https://github.com/johndoe",
      portfolio: "https://johndoe.dev"
    },
    references: [
      {
        id: 1,
        name: "Jane Smith",
        position: "Engineering Manager",
        company: "TechCorp Nepal",
        email: "jane.smith@techcorp.com",
        phone: "+977 98XXXXXXXX"
      }
    ]
  }
};