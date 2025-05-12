import React from 'react';
import { Linkedin, Github, Mail, UserCircle } from 'lucide-react';

interface Developer {
  id: number;
  name: string;
  email: string;
  bio: string;
  linkedin: string;
  github: string;
  imageUrl: string;
}

const developers: Developer[] = [
  {
    id: 1,
    name: 'Trisha Ghosh',
    email: 'trisha.ghosh@example.com',
    bio: 'Passionate full-stack developer with a knack for creating intuitive user experiences. Loves to explore new technologies.',
    linkedin: 'https://linkedin.com/in/trishaghosh-demo',
    github: 'https://github.com/trishaghosh-demo',
    imageUrl: '/src/assets/images/trisha.jpg', // Placeholder image path
  },
  {
    id: 2,
    name: 'Priyanath Bhukta',
    email: 'priyanath.bhukta@example.com',
    bio: 'Backend specialist focused on building robust and scalable APIs. Enjoys solving complex problems.',
    linkedin: 'https://linkedin.com/in/priyanathbhukta-demo',
    github: 'https://github.com/priyanathbhukta-demo',
    imageUrl: '/src/assets/images/titas.png', // Placeholder image path
  },
  {
    id: 3,
    name: 'Sourav Kumar',
    email: 'sourav.kumar@example.com',
    bio: 'Frontend enthusiast dedicated to crafting beautiful and responsive web interfaces. Always learning and growing.',
    linkedin: 'https://linkedin.com/in/souravkumar-demo',
    github: 'https://github.com/souravkumar-demo',
    imageUrl: '/src/assets/images/sourav.png', // Placeholder image path
  },
  {
    id: 4,
    name: 'Soumyadip Paul',
    email: 'soumyadip.paul@example.com',
    bio: 'Innovative developer with a strong interest in AI and machine learning. Likes to build smart applications.',
    linkedin: 'https://linkedin.com/in/soumyadippaul-demo',
    github: 'https://github.com/soumyadippaul-demo',
    imageUrl: '/src/assets/images/soumodip.jpg', // Placeholder image path
  },
  {
    id: 5,
    name: 'Souvik Ghosh',
    email: 'souvik.ghosh@example.com',
    bio: 'Versatile developer experienced in both frontend and backend technologies. Committed to writing clean code.',
    linkedin: 'https://linkedin.com/in/souvikghosh-demo',
    github: 'https://github.com/souvikghosh-demo',
    imageUrl: '/src/assets/images/souvik.jpg', // Placeholder image path
  },
];

const AboutDevelopersPage: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-gray-100">
      <div className="container mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-teal-400 to-green-400">
            Meet the Architects of ThrivePro
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            The dedicated team of developers who poured their passion and expertise into building this platform.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 lg:gap-12">
          {developers.map((dev) => (
            <div
              key={dev.id}
              className="group bg-slate-800/50 backdrop-blur-md shadow-2xl rounded-xl p-6 transition-all duration-300 ease-in-out hover:shadow-blue-500/30 hover:scale-[1.02] border border-slate-700 hover:border-blue-500/50"
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <img
                    src={dev.imageUrl}
                    alt={dev.name}
                    className="w-36 h-36 rounded-full object-cover border-4 border-slate-700 group-hover:border-teal-400 transition-all duration-300 shadow-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://via.placeholder.com/150/334155/e0e7ff?text=${dev.name.split(' ')[0][0]}${dev.name.split(' ')[1]?.[0] || ''}`;
                    }}
                  />
                  <div className="absolute -bottom-2 -right-2 bg-teal-500 p-2 rounded-full shadow-md">
                     <UserCircle size={20} className="text-slate-900" />
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-sky-400 mb-1">
                  {dev.name}
                </h2>
                <a href={`mailto:${dev.email}`} className="text-sm text-sky-400 hover:text-sky-300 transition-colors duration-200 flex items-center gap-1 mb-4">
                  <Mail size={14} /> {dev.email}
                </a>
                
                <p className="text-slate-400 text-base mb-6 leading-relaxed h-20 overflow-hidden group-hover:overflow-visible transition-all duration-300">
                  {dev.bio}
                </p>
                
                <div className="flex justify-center space-x-5 mt-auto pt-4 border-t border-slate-700/50 w-full">
                  <a
                    href={dev.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-teal-400 transition-colors duration-200 flex items-center gap-2 p-2 rounded-md hover:bg-slate-700/50"
                    aria-label={`${dev.name}'s LinkedIn Profile`}
                  >
                    <Linkedin size={20} /> LinkedIn
                  </a>
                  <a
                    href={dev.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-sky-400 transition-colors duration-200 flex items-center gap-2 p-2 rounded-md hover:bg-slate-700/50"
                    aria-label={`${dev.name}'s GitHub Profile`}
                  >
                    <Github size={20} /> GitHub
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        <footer className="text-center mt-20 py-8 border-t border-slate-700">
          <p className="text-slate-500">ThrivePro &copy; {new Date().getFullYear()} - Built with passion.</p>
        </footer>
      </div>
    </div>
  );
};

export default AboutDevelopersPage;
