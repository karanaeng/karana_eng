
import { Link } from 'react-router-dom';
import type { Project } from '../../data/projects';
import { CosmicCard } from '../cosmic/CosmicCard';
import { CosmicImage } from '../cosmic/CosmicImage';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Link to={`/works/${project.slug}`} className="block h-full cursor-pointer">
      <CosmicCard className="group overflow-hidden p-0 h-full">
        <div className="relative aspect-[4/5] overflow-hidden">
          <CosmicImage
            src={project.thumbnail}
            alt={project.title}
            title={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cosmic-black via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-0 left-0 p-6 z-10 w-full">
            <div className="flex flex-wrap gap-2 mb-3">
              {project.services.slice(0, 2).map(s => (
                <span key={s} className="text-cosmic-gold text-[9px] font-black uppercase tracking-widest bg-cosmic-gold/10 px-2 py-1 rounded-md">
                  {s.replace(/-/g, ' ')}
                </span>
              ))}
            </div>
            <h3 className="text-xl font-bold text-white mb-4 font-montserrat leading-tight group-hover:text-cosmic-gold transition-colors duration-300">
              {project.title}
            </h3>
            <div
              className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
            >
              View Case Study <span className="text-lg">→</span>
            </div>
          </div>
        </div>
      </CosmicCard>
    </Link>
  );
};

