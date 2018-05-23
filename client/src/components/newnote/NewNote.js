import React from 'react';

// components
import Form from '../misc/Form';

// style
import './NewNote.css';

const NewNote = props => {
  return (
    <div className='new-note-wrapper'>
      <div className='new-note-wrapper__title-wrapper'>
        <h2 className='title-wrapper__h2'>Create New Note</h2>
      </div>

      <Form
        buttonClassName='submit-wrapper__submit-newnote button'
        formClassName='new-note-wrapper__form'
        inputClassName='form__input-title'
        textareaClassName='form__input-textarea'
        setInputVal={ props.setInputVal }
        setTextAreaVal={ props.setTextAreaVal }
        title={ props.title }
        content={ props.content }
        buttonOnClick={ props.buttonOnClick }
      />
    </div>
  )
}
 
export default NewNote;