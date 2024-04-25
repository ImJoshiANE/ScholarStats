import React from 'react'
import "./Input.scss";

const Input = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Read the form data
        const form = e.target;
        const formData = new FormData(form);
    
        // Or you can work with it as a plain object:
        const formJson = Object.fromEntries(formData.entries());
        console.log(formJson);
      }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        <input name="myInput" defaultValue="Enter Google ScholarID" />
      </label>
      <button type="submit">Submit</button>
    </form>
  )
}

export default Input