import React, { useState } from 'react';
import { FormFieldWrapper } from '@plone/volto/components';
import { Input } from 'semantic-ui-react';

const ConfirmInputWidget = (props) => {
  const { id, value, onChange } = props;
  const [inputValue, setInputValue] = useState('');
  const [isInputChanged, setIsInputChanged] = useState(false);
  const [isInputEntered, setIsInputEntered] = useState(false);

  return (
    <FormFieldWrapper {...props}>
      <Input
        id={`field-${id}`}
        name={id}
        type="url"
        value={inputValue || value}
        onChange={(e) => {
          setInputValue(e.target.value);
          setIsInputChanged(true);
          setIsInputEntered(false);
        }}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            onChange(id, e.target.value === '' ? undefined : e.target.value);
            setIsInputEntered(true);
            setIsInputChanged(false);
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        className={`${isInputChanged ? 'red-border' : ''}
           ${isInputEntered ? 'green-border' : ''}`}
      />
    </FormFieldWrapper>
  );
};

export default ConfirmInputWidget;
