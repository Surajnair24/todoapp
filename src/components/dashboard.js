import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for API calls
import { useLocation } from 'react-router-dom';
import ProjectView from './projectview';
import './projectviewanddashboard.css';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state for API calls

  const location = useLocation();
  const username = location.state?.username || 'Guest';

  useEffect(() => {
    if (username !== 'Guest') {
      fetchProjects();
    }
  }, [username]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost/api/get_project.php?username=${username}`);
      if (response.data.status === 'success') {
        setProjects(response.data.projects);
      } else {
        setError(response.data.message || 'Failed to fetch projects');
      }
    } catch (error) {
      setError('Error fetching projects');
    } finally {
      setLoading(false);  // Set loading to false after the request is complete
    }
  };

  const handleInputChange = (e) => {
    setNewProjectTitle(e.target.value);
    setError('');
  };

  const createProject = async () => {
    if (newProjectTitle.trim() === '') {
      setError('Project title cannot be empty.');
      return;
    }

    if (projects.some((project) => project.title === newProjectTitle.trim())) {
      setError('Project title already exists.');
      return;
    }

    try {
      // Call the add_project.php API
      const response = await axios.post('http://localhost/api/add_project.php', {
        username,
        project_title: newProjectTitle.trim(),
      });

      if (response.data.status === 'success') {
        const newProject = {
          id: Date.now(),
          title: newProjectTitle.trim(),
          todos: [],
        };

        setProjects([...projects, newProject]);
        setNewProjectTitle('');
        setError('');
      } else {
        setError(response.data.message || 'Failed to create project in the database.');
      }
    } catch (err) {
      setError('Error: Unable to connect to the server.');
    }
  };

  const deleteProject = async (id, title) => {
    try {
      // Call the delete_project.php API
      const response = await axios.post('http://localhost/api/delete_project.php', {
        username,
        project_title: title,
      });

      if (response.data.status === 'success') {
        // Remove the project from the state
        const updatedProjects = projects.filter((project) => project.id !== id);
        setProjects(updatedProjects);
      } else {
        alert(response.data.message || 'Failed to delete project from the database.');
      }
    } catch (err) {
      alert('Error: Unable to connect to the server.');
    }
  };

  const viewProject = (project) => {
    setSelectedProject(project);
  };

  const goBack = () => {
    setSelectedProject(null);
  };

  return (
    <div className="dashboard">
      <h1>Welcome, {username}!</h1>

      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <>
          {!selectedProject ? (
            <div className="project-list">
              <h2>Projects</h2>
              <input
                type="text"
                placeholder="Enter project title"
                value={newProjectTitle}
                onChange={handleInputChange}
              />
              <button onClick={createProject}>Create Project</button>

              {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}

              {projects.length === 0 ? (
                <p>No projects available. Start by creating a new project.</p>
              ) : (
                <ul>
                  {projects.map((project) => (
                    <li key={project.id} className="project-card">
                      <span>{project.title}</span>
                      <div>
                        <button
                          className="view-button"
                          onClick={() => viewProject(project)}
                        >
                          View
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => deleteProject(project.id, project.title)}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <ProjectView project={selectedProject} goBack={goBack} username={username}/>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
