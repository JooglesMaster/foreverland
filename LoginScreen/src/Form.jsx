import React from 'react';
import './Overlay.css';

function Form() {
  return (
    <div className="overlay">
      <form>
        <label htmlFor="name">Name:</label><br/>
        <input type="text" id="name" name="name"/><br/>
        <input type="submit" value="Submit"/>
      </form>
    </div>
  );
}

export default Form;
