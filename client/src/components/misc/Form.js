import React from 'react';

import TextField from '../misc/TextField';
import Button from '../misc/Button';

const Form = props => {
  const {
    buttonClassName, buttonContent, buttonOnClick,
    children,
    content,
    formAutoComplete,
    formClassName,
    inputClassName,
    setInputVal, setTextAreaVal,
    title,
    textareaClassName
  } = props;

  return (
    (children)
    ?
      <form className={ formClassName } autoComplete={ formAutoComplete }>
        { props.children }
      </form>
    :
      <form className={ formClassName }>
        <div>
          <TextField
            variant='input'
            inputClassName={ inputClassName }
            inputName='title'
            inputType='text'
            inputVal={ title }
            inputOnChange={ setInputVal }
          />
        </div>

        <div>•••
          <TextField
            textareaClassName={ textareaClassName }
            textareaContent={ content }
            textareaName='content'
            textareaOnChange={ setTextAreaVal }
          />
        </div>

        <div className='form__submit-wrapper'>
          <Button
            buttonClassName={ buttonClassName }
            buttonContent={ buttonContent }
            buttonType='submit'
            buttonOnClick={ buttonOnClick }
          />
        </div>
      </form>
  )
}
 
export default Form;