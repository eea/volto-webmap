import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import { compose } from 'redux';
import { map, find, isBoolean, isObject, intersection } from 'lodash';
import { defineMessages } from 'react-intl'; //
import loadable from '@loadable/component';

import {
  getBoolean,
  // getVocabFromHint,
  // getVocabFromField,
  // getVocabFromItems,
} from '@plone/volto/helpers';
import { FormFieldWrapper } from '@plone/volto/components';
// import { getVocabulary, getVocabularyTokenTitle } from '@plone/volto/actions';

import {
  Option,
  DropdownIndicator,
  selectTheme,
  customSelectStyles,
} from '@plone/volto/components/manage/Widgets/SelectStyling';

const Select = loadable(() => import('react-select'));
const AsyncPaginate = loadable(() => import('react-select-async-paginate'));

const messages = defineMessages({
  default: {
    id: 'Default',
    defaultMessage: 'Default',
  },
  idTitle: {
    id: 'Short Name',
    defaultMessage: 'Short Name',
  },
  idDescription: {
    id: 'Used for programmatic access to the fieldset.',
    defaultMessage: 'Used for programmatic access to the fieldset.',
  },
  title: {
    id: 'Title',
    defaultMessage: 'Title',
  },
  description: {
    id: 'Description',
    defaultMessage: 'Description',
  },
  close: {
    id: 'Close',
    defaultMessage: 'Close',
  },
  choices: {
    id: 'Choices',
    defaultMessage: 'Choices',
  },
  required: {
    id: 'Required',
    defaultMessage: 'Required',
  },
  select: {
    id: 'Select…',
    defaultMessage: 'Select…',
  },
  no_value: {
    id: 'No value',
    defaultMessage: 'No value',
  },
  no_options: {
    id: 'No options',
    defaultMessage: 'No options',
  },
});

function getDefaultValues(choices, value) {
  if (!isObject(value) && isBoolean(value)) {
    // We have a boolean value, which means we need to provide a "No value"
    // option
    const label = find(choices, (o) => getBoolean(o[0]) === value);
    return label
      ? {
          label: label[1],
          value,
        }
      : {};
  }
  if (value === 'no-value') {
    return {
      label: this.props.intl.formatMessage(messages.no_value),
      value: 'no-value',
    };
  }
  if (isObject(value)) {
    return {
      label: value.title !== 'None' && value.title ? value.title : value.token,
      value: value.token,
    };
  }
  if (value && choices.length > 0) {
    return { label: find(choices, (o) => o[0] === value)?.[1] || value, value };
  } else {
    return {};
  }
}

/**
 * SelectWidget component class.
 * @function SelectWidget
 * @returns {string} Markup of the component.
 */
class SelectWidget extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    required: PropTypes.bool,
    error: PropTypes.arrayOf(PropTypes.string),
    getVocabulary: PropTypes.func.isRequired,
    getVocabularyTokenTitle: PropTypes.func.isRequired,
    choices: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    ),
    loading: PropTypes.bool,
    items: PropTypes.shape({
      vocabulary: PropTypes.object,
    }),
    widgetOptions: PropTypes.shape({
      vocabulary: PropTypes.object,
    }),
    value: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
      PropTypes.bool,
    ]),
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    onClick: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    itemsTotal: PropTypes.number,
    wrapped: PropTypes.bool,
  };

  /**
   * Default properties
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    description: null,
    required: false,
    items: {
      vocabulary: null,
    },
    widgetOptions: {
      vocabulary: null,
    },
    error: [],
    choices: [],
    loading: false,
    value: null,
    onChange: () => {},
    onBlur: () => {},
    onClick: () => {},
    onEdit: null,
    onDelete: null,
  };

  state = {
    selectedOption: this.props.value
      ? { label: this.props.value.title, value: this.props.value.value }
      : {},
  };

  /**
   * Component did mount
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    if (!this.props.choices && this.props.vocabBaseUrl) {
      this.props.getVocabulary(this.props.vocabBaseUrl);
    }
  }

  /**
   * Initiate search with new query
   * @method loadOptions
   * @param {string} search Search query.
   * @param {string} previousOptions The previous options rendered.
   * @param {string} additional Additional arguments to pass to the next loadOptions.
   * @returns {undefined}
   */
  loadOptions = (search, previousOptions, additional) => {
    let hasMore = this.props.itemsTotal > previousOptions.length;
    if (hasMore) {
      const offset = this.state.search !== search ? 0 : additional.offset;
      this.props.getVocabulary(this.props.vocabBaseUrl, search, offset);
      this.setState({ search });

      return {
        options:
          intersection(previousOptions, this.props.choices).length ===
          this.props.choices.length
            ? []
            : this.props.choices,
        hasMore: hasMore,
        additional: {
          offset: offset === additional.offset ? offset + 25 : offset,
        },
      };
    }
    return null;
  };

  /**
   * Handle the field change, store it in the local state and back to simple
   * array of tokens for correct serialization
   * @method handleChange
   * @param {array} selectedOption The selected options (already aggregated).
   * @returns {undefined}
   */
  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
    this.props.onChange(this.props.id, selectedOption.value);
  };

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const { id, choices, value, onChange } = this.props;

    return (
      <FormFieldWrapper {...this.props}>
        {this.props.vocabBaseUrl ? (
          <>
            <AsyncPaginate
              isDisabled={this.props.isDisabled}
              className="react-select-container"
              classNamePrefix="react-select"
              options={this.props.choices || []}
              styles={customSelectStyles}
              theme={selectTheme}
              components={{ DropdownIndicator, Option }}
              value={this.state.selectedOption}
              loadOptions={this.loadOptions}
              onChange={this.handleChange}
              additional={{
                offset: 25,
              }}
              placeholder={this.props.intl.formatMessage(messages.select)}
              noOptionsMessage={() =>
                this.props.intl.formatMessage(messages.no_options)
              }
            />
          </>
        ) : (
          <Select
            id={`field-${id}`}
            key={this.props.choices}
            name={id}
            isDisabled={this.props.isDisabled}
            className="react-select-container"
            classNamePrefix="react-select"
            isMulti={id === 'roles' || id === 'groups'}
            options={[
              ...map(choices, (option) => ({
                value: option[0],
                label:
                  // Fix "None" on the serializer, to remove when fixed in p.restapi
                  option[1] !== 'None' && option[1] ? option[1] : option[0],
              })),
              {
                label: this.props.intl.formatMessage(messages.no_value),
                value: 'no-value',
              },
            ]}
            styles={customSelectStyles}
            theme={selectTheme}
            components={{ DropdownIndicator, Option }}
            defaultValue={
              id === 'roles' || id === 'groups'
                ? null
                : getDefaultValues(choices, value)
            }
            onChange={(data) => {
              let dataValue = [];
              if (Array.isArray(data)) {
                for (let obj of data) {
                  dataValue.push(obj.value);
                }
                return onChange(id, dataValue);
              }
              return onChange(
                id,
                data.value === 'no-value' ? undefined : data.value,
              );
            }}
          />
        )}
      </FormFieldWrapper>
    );
  }
}

export default SelectWidget;
