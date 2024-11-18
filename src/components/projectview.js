import React, { Component } from 'react';
import axios from 'axios';
import './projectviewanddashboard.css';

class ProjectView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.project.title, // Project title passed as prop
      todos: [], // Pending todos
      completedTodos: [], // Completed todos
      newTodoDescription: '', // New todo description input
      editingTodoId: null, // Editing state
      editedDescription: '', // Edited description
      loading: false,
      error: null, // Error state for fetching or adding todos
    };
  }

  // Fetch all todos from the API when component mounts
  componentDidMount() {
    this.fetchTodos();
  }

  fetchTodos = async () => {
    const { username } = this.props;
    const { title } = this.state;

    this.setState({ loading: true });

    try {
      const response = await axios.get(
        `http://localhost/api/get_todos.php?username=${username}&project_name=${title}`
      );

      if (response.data.status === 'success') {
        const todos = response.data.todos;

        // Separate todos into 'pending' and 'completed' based on the 'completed' field
        const pendingTodos = todos.filter((todo) => todo.completed == 0); // completed = 0 for pending
        const completedTodos = todos.filter((todo) => todo.completed == 1); // completed = 1 for completed

        // Update state with the filtered lists
        this.setState({
          todos: pendingTodos, // Pending todos
          completedTodos: completedTodos, // Completed todos
        });
      } else {
        this.setState({ error: 'Failed to fetch todos' });
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
      this.setState({ error: 'Error fetching todos' });
    } finally {
      this.setState({ loading: false });
    }
  };

  // Handle change in input fields
  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  // Add a new todo to the database
  addTodo = async () => {
    const { newTodoDescription } = this.state;
    const { username } = this.props;
    const { title } = this.state;

    if (newTodoDescription.trim() === '') return;

    const todo = {
      username,
      project_name: title,
      description: newTodoDescription,
      completed: 0, // Mark new todos as incomplete
    };

    this.setState({ loading: true });

    try {
      const response = await axios.post('http://localhost/api/add_todos.php', todo);
      if (response.data.status === 'success') {
        this.fetchTodos(); // Refresh todos list
        this.setState({ newTodoDescription: '' });
      } else {
        console.log(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error adding todo:', error);
      alert('There was an issue adding your todo');
    } finally {
      this.setState({ loading: false });
    }
  };

  // Toggle completion status of a todo
  toggleCompletion = async (description, isCompleted) => {
    const { username } = this.props;
    const { title } = this.state;

    try {
      await axios.post('http://localhost/api/update_todo_status.php', {
        username,
        project_name: title,
        description,
      });
      this.fetchTodos(); // Refresh todos list
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  // Delete a todo from the database
  deleteTodo = async (description) => {
    const { username } = this.props;
    const { title } = this.state;

    try {
      await axios.post('http://localhost/api/delete_todos.php', {
        username,
        project_name: title,
        description,
      });
      this.fetchTodos(); // Refresh todos list
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  // Start editing a todo description
  startEditing = (description) => {
    this.setState({
      editingTodoId: description,
      editedDescription: description,
    });
  };

  // Save edited todo description
  saveEditedTodo = async () => {
    const { editedDescription, editingTodoId } = this.state;
    const { username } = this.props;
    const { title } = this.state;

    if (editedDescription.trim() === '') return;

    const updatedTodo = {
      username,
      project_name: title,
      oldDescription: editingTodoId,
      newDescription: editedDescription,
    };

    try {
      await axios.post('http://localhost/api/update_todo.php', updatedTodo);
      this.fetchTodos(); // Refresh todos list
      this.setState({
        editingTodoId: null,
        editedDescription: '',
      });
    } catch (error) {
      console.error('Error saving edited todo:', error);
    }
  };

  // Cancel the editing of a todo
  cancelEditing = () => {
    this.setState({
      editingTodoId: null,
      editedDescription: '',
    });
  };

  render() {
    const { goBack, username } = this.props;
    const {
      title,
      todos,
      completedTodos,
      newTodoDescription,
      editingTodoId,
      editedDescription,
      loading,
      error,
    } = this.state;

    return (
      <div className="project-view">
        <button className="back-button" onClick={goBack}>
          Back to Projects
        </button>
        <h4 className="welcome-message">Welcome, {username}!</h4>

        <h2 className="project-title">Project Name: {title}</h2>

        {loading && <div>Loading...</div>}
        {error && <div className="error-message">{error}</div>}

        <div className="todo-section">
          <h3>Todos</h3>
          <input
            type="text"
            placeholder="Enter todo description"
            name="newTodoDescription"
            value={newTodoDescription}
            onChange={this.handleInputChange}
            className="todo-input"
          />
          <button className="add-todo" onClick={this.addTodo}>
            Add Todo
          </button>
          <ul className="todo-list">
            {todos.map((todo) => (
              <li key={todo.description} className="todo-item">
                {editingTodoId === todo.description ? (
                  <div>
                    <input
                      type="text"
                      value={editedDescription}
                      onChange={(e) => this.setState({ editedDescription: e.target.value })}
                      className="edit-input"
                    />
                    <button className="save-edit" onClick={this.saveEditedTodo}>
                      Save
                    </button>
                    <button className="cancel-edit" onClick={this.cancelEditing}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div>
                    <span>{todo.description}</span>
                    <div className="todo-date">{todo.date}</div>
                    <button
                      className="mark-complete"
                      onClick={() => this.toggleCompletion(todo.description, todo.completed)}
                    >
                      Mark as Complete
                    </button>
                    <button
                      className="remove"
                      onClick={() => this.deleteTodo(todo.description)}
                    >
                      Remove
                    </button>
                    <button
                      className="edit-todo"
                      onClick={() => this.startEditing(todo.description)}
                    >
                      Edit
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="completed-section">
          <h3>Completed Tasks</h3>
          <ul className="completed-list">
            {completedTodos.map((todo) => (
              <li key={todo.description} className="todo-item completed">
                <span>{todo.description}</span>
                <button
                  className="mark-pending"
                  onClick={() => this.toggleCompletion(todo.description, todo.completed)}
                >
                  Mark as Pending
                </button>
                <button
                  className="remove"
                  onClick={() => this.deleteTodo(todo.description)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default ProjectView;
