
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { AlumniModel } from './src/models/User.js';

// Load env vars
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Companies and Roles for Random Generation
const companies = [
    'Google', 'Microsoft', 'Amazon', 'TCS', 'Infosys', 'Wipro', 'Accenture',
    'L&T', 'Tata Steel', 'Jindal Steel', 'Adani Power', 'HDFC Bank', 'ICICI Bank',
    'Flipkart', 'Uber', 'Ola', 'Paytm', 'Swiggy', 'Zomato', 'Reliance Industries'
];

const roles = [
    'Software Engineer', 'Senior Software Engineer', 'Product Manager', 'Data Scientist',
    'Civil Engineer', 'Structural Engineer', 'Site Engineer', 'Project Manager',
    'Business Analyst', 'Consultant', 'System Architect', 'DevOps Engineer'
];

const locations = [
    'Bangalore, India', 'Mumbai, India', 'Delhi, India', 'Pune, India', 'Hyderabad, India',
    'Chennai, India', 'Kolkata, India', 'Gurgaon, India', 'Noida, India', 'San Francisco, USA',
    'London, UK', 'Singapore', 'Dubai, UAE'
];

const skillsList = [
    'JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'MongoDB', 'SQL',
    'AutoCAD', 'STAAD Pro', 'Revit', 'Project Management', 'Data Analysis',
    'Machine Learning', 'AWS', 'Azure', 'Docker', 'Kubernetes'
];

const degrees = ['B.Tech', 'M.Tech', 'MBA', 'PhD'];

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getRandomSubarray = (arr, size) => {
    const shuffled = arr.slice(0);
    let i = arr.length;
    let temp, index;
    while (i--) {
        index = Math.floor(Math.random() * (i + 1));
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
};

const generateAlumniData = (originalStudent, index) => {
    const company = getRandomElement(companies);
    const role = getRandomElement(roles);
    const location = getRandomElement(locations);
    const batch = (2015 + Math.floor(Math.random() * 8)).toString(); // 2015-2022
    const experienceYears = 2024 - parseInt(batch);

    return {
        firstName: originalStudent.firstName,
        lastName: originalStudent.lastName || 'Alumni', // Default last name if missing
        email: `alumni.${originalStudent.firstName.toLowerCase().replace(/\s+/g, '')}.${index + 1}@example.com`, // Ensure unique email and remove spaces
        password: originalStudent.password || '$2a$10$nYRnnXVxL2laRu5hbNderuuwnM2MTHLCdH33aDp0itS6Gdgyps7FS', // Use existing or default hash
        role: 'alumni',
        batch: batch,
        department: originalStudent.department || 'Civil Engineering',
        currentRole: role,
        company: company,
        location: location,
        yearsOfExperience: experienceYears,
        profilePicture: originalStudent.profilePicture,
        bio: `Experienced ${role} at ${company} with a passion for technology and engineering.`,
        linkedinUrl: `https://linkedin.com/in/${originalStudent.firstName.toLowerCase()}-${originalStudent.lastName.toLowerCase()}`,
        skills: getRandomSubarray(skillsList, 3 + Math.floor(Math.random() * 3)),
        privacySettings: originalStudent.privacySettings,
        isActive: true,
        isEmailVerified: true,

        // Generate Experience Array
        experience: [
            {
                title: role,
                company: company,
                location: location,
                type: 'Full-time',
                startDate: `${parseInt(batch) + 1}-06`,
                current: true,
                description: `Working as a ${role} responsible for various key projects.`
            }
        ],

        // Generate Education Array
        education: [
            {
                degree: 'B.Tech',
                institution: 'BIT Sindri',
                year: batch,
                score: '8.5 CGPA'
            }
        ]
    };
};

const seedAlumni = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: process.env.DB_NAME || 'ALUMNI-CONNECT',
        });
        console.log('MongoDB Connected');

        // Read Student Data
        const studentDataPath = path.resolve(__dirname, '../ALUMNI-CONNECT.student_data.json');
        const studentDataRaw = await fs.readFile(studentDataPath, 'utf8');
        const students = JSON.parse(studentDataRaw);

        // Select first 25 students to convert to alumni (or fewer if not enough)
        const studentsToConvert = students.slice(0, 30);

        const alumniToInsert = studentsToConvert.map((student, index) => generateAlumniData(student, index));

        // Clear existing alumni with these test emails to avoid duplicates on re-run
        const emails = alumniToInsert.map(a => a.email);
        await AlumniModel.deleteMany({ email: { $in: emails } });
        console.log('Cleaned up existing test alumni');

        // Insert new alumni
        const result = await AlumniModel.insertMany(alumniToInsert);
        console.log(`Successfully inserted ${result.length} alumni profiles.`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding alumni data:', error.message);
        if (error.errors) {
            Object.keys(error.errors).forEach(key => {
                console.error(`Validation Error on field "${key}":`, error.errors[key].message);
                console.error(`Value:`, error.errors[key].value);
            });
        }
        process.exit(1);
    }
};

seedAlumni();
