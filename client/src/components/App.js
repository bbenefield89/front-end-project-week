import React, { Component } from 'react';
import { Route } from 'react-router';
import axios from 'axios';

// components
import RegistrationContainer from './registration/RegistrationContainer';
import Sidebar from './sidebar/Sidebar';
import NoteView from './noteview/NoteView';
import NewNote from './newnote/NewNote';
import Note from './noteview/Note';
import NoteEdit from './noteedit/NoteEdit';

// presentational
import './App.css';

// database
import 'firebase/database';

class App extends Component {
  state = {
    content: '',
    search: '',
    title: '',
    ajaxRequests: (process.env.NODE_ENV === 'development') ? 'http://localhost:5000' : 'http://64.190.90.127:5000',
    showDeleteModal: false,
    noteList: []
  };

  // setInputVal
  setInputVal = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  // getAllNotes
  getAllNotes = () => {
    const { ajaxRequests } = this.state;
    const token = localStorage.getItem('token');
    const request = {
      method: 'post',
      url: `${ ajaxRequests }/api/tasks`,
      headers: { 'Content-Type': 'application/json' },
      data: { token }
    }
    
    axios(request)
      .then(({ data: tasks }) => {
        const noteList = [];

        for (let task of tasks) {
          const { _id: id, taskName: title, taskDescription: content } = task;
          noteList.push({ id, title, content });
        }

        this.setState({ noteList });
      })
      .catch(err => {
        return;
      });
  }

  // adds new note to `this.state.noteList`
  addNewNote = (e, props) => {
    e.preventDefault();
    const { ajaxRequests, title: taskName, content: taskDescription } = this.state;
    const token = localStorage.getItem('token');
    const method = 'post';
    const url = `${ ajaxRequests }/api/tasks/new`;
    const data = { taskName, taskDescription, token };
    const request = { method, url, data };

    axios(request)
      .then(({ data }) => {
        console.log(data);
        this.getAllNotes();
      })
      .catch(err => {
        console.log(err);
      });
    
    this.setState({ title: '', content: '' });
    props.history.push('/note');
  }

  // setEditNoteValues
  setEditNoteValues = (e, props, id, taskName, taskDescription) => {
    e.preventDefault();
    const { ajaxRequests } = this.state;
    const token = localStorage.getItem('token');
    const method = 'put';
    const url = `${ ajaxRequests }/api/tasks/${ id }`;
    const data = { taskName, taskDescription, token };
    const request = { method, url, data };

    axios(request)
      .then(() => {
        this.getAllNotes();
      })
      .catch(err => {
        console.log(err);
      });
    
    props.history.push('/note');
  }

  // setEditValues
  setEditValues = (title, content) => {
    this.setState({ title, content });
  }

  // setShowDeleteModal
  setShowDeleteModal = () => {
    this.setState({ showDeleteModal: !this.state.showDeleteModal });
  }

  // handleDeleteNote
  handleDeleteNote = id => {
    const { ajaxRequests } = this.state;
    const token = localStorage.getItem('token');
    const method = 'delete';
    const url = `${ ajaxRequests }/api/tasks/${ id }`;
    const data = { token };
    const request = { method, url, data };

    axios(request)
      .then(() => this.getAllNotes())
      .catch(err => console.log(err));
    
    this.setShowDeleteModal();
  }

  // handleSearchNotes
  handleSearchNotes = () => {
    if (this.state.search) {
      return this.state.noteList.filter(note => {
        const noteTitle = note.title.toLowerCase().match(this.state.search.toLowerCase());
        const noteContent = note.content.toLowerCase().match(this.state.search.toLocaleLowerCase());
        if (noteTitle) {
          return noteTitle;
        }
        return noteContent;
      });
    }
    return this.state.noteList;
  }

  /*****************************************
  ** component rendering for react router **
  *****************************************/
  // <NoteView />
  returnNoteView = props => {
    const { handleSearchNotes, getAllNotes } = this;
    return <NoteView { ...props } noteList={ handleSearchNotes() } getAllNotes={ getAllNotes() } />;
  }
  
  // <Note />
  returnNoteComponent = props => {
    const {
      state: { noteList, showDeleteModal },
      setEditValues, handleDeleteNote
    } = this;
    return (
      <Note
        { ...props }
        noteList={ noteList }
        setEditValues={ setEditValues }
        handleDeleteNote={ handleDeleteNote }
        showDeleteModal={ showDeleteModal }
        setShowDeleteModal={ this.setShowDeleteModal }
      />
    );
  }

  // <NewNote />
  returnNewNoteComponent = props => {
    const { state: { title, content }, setInputVal, addNewNote } = this;
    return (
      <NewNote
        { ...props }
        setInputVal={ setInputVal }
        setTextAreaVal={ setInputVal }
        title={ title }
        content={ content }
        buttonOnClick={ addNewNote }
      />
    );
  }

  // <NoteEdit />
  returnNoteEdit = props => {
    const { state: { noteList, title, content }, setInputVal, setEditNoteValues } = this;
    return (
      <NoteEdit
        { ...props }
        noteList={ noteList }
        title={ title }
        setInputVal={ setInputVal }
        setTextAreaVal={ setInputVal }
        content={ content }
        buttonOnClick={ setEditNoteValues }
      />
    );
  }
  
  // render
  render() {
    return (
      <div className="App">
        {/* RegistrationContainer */}
        <Route exact path='/' component={ RegistrationContainer } />
      
        {/* Sidebar */}
        <Route
          path='/note'
          render={ () => <Sidebar setInputVal={ this.setInputVal } search={ this.state.search } noteList={ this.handleSearchNotes() }/> }
        />

        {/* NoteView */}
        <Route
          exact path='/note'
          render={ props =>  this.returnNoteView(props) }
        />
        
        {/* NewNote */}
        <Route
          path='/note/new'
          render={ props => this.returnNewNoteComponent(props) }
        />

        {/* Note (specific note) */}
        <Route
          path='/note/:id'
          render={ props => this.returnNoteComponent(props) }
        />

        {/* NoteEdit */}
        <Route
          path='/note/edit/:id'
          render={ props =>  this.returnNoteEdit(props) }
        />
      </div>
    );
  }
}

export default App;
