import { useEffect, useRef, useState } from 'react';
import '../ProjectModal.css';

export interface ProjectDetail {
  title: string;
  summary: string;
  details: string;
  tags: string[];
  screenshots: string[];
  repoUrl?: string;
  liveUrl?: string;
}

interface Props {
  project: ProjectDetail | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: Props) {
  const [activeImg, setActiveImg] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    setActiveImg(0);
    if (project) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [project]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!project) return null;

  return (
    <dialog ref={dialogRef} className="project-modal" onClick={(e) => { if (e.target === dialogRef.current) onClose(); }}>
      <div className="modal-inner">
        <button className="modal-close" onClick={onClose} aria-label="Close">&times;</button>

        <h2 className="modal-title">{project.title}</h2>

        <div className="tags modal-tags">
          {project.tags.map((t) => <span key={t} className="tag">{t}</span>)}
        </div>

        {project.screenshots.length > 0 && (
          <div className="modal-screenshots">
            <img
              className="modal-main-img"
              src={project.screenshots[activeImg]}
              alt={`${project.title} screenshot ${activeImg + 1}`}
            />
            {project.screenshots.length > 1 && (
              <div className="modal-thumbs">
                {project.screenshots.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`Thumbnail ${i + 1}`}
                    className={`modal-thumb ${i === activeImg ? 'active' : ''}`}
                    onClick={() => setActiveImg(i)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <p className="modal-details">{project.details}</p>

        <div className="modal-links">
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noreferrer" className="btn btn-secondary">
              GitHub
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
              Live Demo
            </a>
          )}
        </div>
      </div>
    </dialog>
  );
}
