import React from 'react';
import PropTypes from 'prop-types';

export function ListItem({ name }) {
  return <div>{name}</div>;
}

ListItem.propTypes = {
  name: PropTypes.string.isRequired,
};
export default ListItem;
