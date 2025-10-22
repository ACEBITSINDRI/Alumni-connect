# Alumni Connect - BIT Sindri

A comprehensive alumni networking platform for the Association of Civil Engineers (ACE), BIT Sindri. This platform bridges the gap between current students and alumni, fostering mentorship, career guidance, and professional networking opportunities.

## Features

### For Students
- **Alumni Directory**: Browse and connect with alumni from various batches
- **Mentorship Opportunities**: Find mentors based on domain expertise
- **Career Guidance**: Access job opportunities and internships posted by alumni
- **Events & Workshops**: Register for technical workshops and networking events
- **Discussion Forum**: Engage in meaningful discussions and seek advice

### For Alumni
- **Networking**: Connect with fellow alumni and current students
- **Give Back**: Share experiences, post opportunities, and mentor students
- **Stay Connected**: Keep up with college events and developments
- **Community Engagement**: Participate in alumni meetups and reunions

### Core Functionalities
- User authentication and profile management
- Real-time messaging system
- Post creation and interaction (likes, comments, shares)
- Job and internship posting
- Event management and registration
- Advanced search and filtering
- Notification system
- Privacy controls

## Tech Stack

### Frontend
- **React 18+** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Context API** - State management

### Backend (Coming Soon)
- Node.js
- Express.js
- MongoDB
- JWT Authentication

## Project Structure

```
Alumni-connect/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Reusable UI components
│   │   │   ├── dashboard/      # Dashboard specific components
│   │   │   ├── events/         # Event related components
│   │   │   └── opportunities/  # Opportunity components
│   │   ├── pages/
│   │   │   ├── auth/          # Authentication pages
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── AlumniDirectoryPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── EventsPage.tsx
│   │   │   ├── OpportunitiesPage.tsx
│   │   │   ├── MessagesPage.tsx
│   │   │   ├── NotificationsPage.tsx
│   │   │   └── SettingsPage.tsx
│   │   ├── context/           # React Context providers
│   │   ├── routes/            # Route configuration
│   │   ├── utils/             # Utility functions
│   │   └── App.tsx
│   ├── public/
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/ACEBITSINDRI/Alumni-connect.git
cd Alumni-connect
```

2. Install frontend dependencies
```bash
cd frontend
npm install
```

3. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
cd frontend
npm run build
```

The production-ready files will be in the `frontend/dist` directory.

## Configuration

Create a `.env` file in the frontend directory with the following variables:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Alumni Connect - BIT Sindri
```

## Contributing

We welcome contributions from the community! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style Guidelines
- Use TypeScript for type safety
- Follow React best practices and hooks guidelines
- Write clean, self-documenting code
- Use meaningful variable and function names
- Add comments for complex logic
- Ensure responsive design for all screen sizes

## Development Roadmap

- [x] Frontend UI/UX Design
- [x] User Authentication Pages
- [x] Dashboard and Feed
- [x] Alumni Directory
- [x] Profile Management
- [x] Events System
- [x] Opportunities Board
- [x] Messaging System
- [x] Notifications
- [x] Settings and Privacy
- [ ] Backend API Development
- [ ] Database Integration
- [ ] Real-time Features (Socket.io)
- [ ] Image Upload and Storage
- [ ] Email Service Integration
- [ ] Mobile App (React Native)
- [ ] Analytics Dashboard

## Screenshots

_Screenshots will be added soon_

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

**Association of Civil Engineers (ACE)**
BIT Sindri, Dhanbad
Jharkhand, India

For queries and support:
- Email: ace@bitsindri.ac.in
- Website: [BIT Sindri](https://www.bitsindri.ac.in)

## Acknowledgments

- BIT Sindri Administration for their support
- All contributors and developers
- The alumni community for their valuable feedback

---

Made with ❤️ by the ACE Team, BIT Sindri
