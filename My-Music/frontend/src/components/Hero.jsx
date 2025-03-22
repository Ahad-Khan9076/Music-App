import { useState, useEffect } from 'react';

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [files, setFiles] = useState([]);
  const [fileType, setFileType] = useState(''); // <-- Add this line

  // Fetch files from backend
  const fetchFiles = async () => {
    try {
      const response = await fetch('http://localhost:5000/files');
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
  
    if (!file || !title || !fileType) {
      alert('Please provide a title, select a file, and choose a file type');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file); // Ensure this matches multer's field name
    formData.append('title', title);
    formData.append('fileType', fileType);
  
    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
      console.log('Response:', data);
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Upload failed');
    }
  };
  
  const handleDelete = async (fileId) => {
    if (!fileId) {
      console.error('Error: fileId is undefined!');
      alert('Failed to delete. File ID is missing.');
      return;
    }
  
    if (!window.confirm('Are you sure you want to delete this file?')) return;
  
    try {
      console.log(`Deleting file with ID: ${fileId}`);
      const response = await fetch(`http://localhost:5000/files/${fileId}`, { method: 'DELETE' });
  
      if (!response.ok) {
        throw new Error('Failed to delete file');
      }
  
      alert('File deleted successfully!');
      fetchFiles(); // Refresh file list
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Failed to delete file');
    }
  };
  

  return (
    <div>
      {/* Upload Form */}
      <form onSubmit={handleUpload}>
        <h2>Upload File</h2>
        <input type="text" placeholder="Enter file title" value={title} onChange={handleTitleChange} />
        <input type="file" onChange={handleFileChange} />
        <select value={fileType} onChange={(e) => setFileType(e.target.value)}>
    <option value="">Select File Type</option>
    <option value="Song">Songs-MP3</option>
    <option value="Wave">Binaural-Wave</option>
  </select>
        <button type="submit">Upload</button>
      </form>

      {/* File List */}
      <h2>Uploaded Files</h2>
      <ul>
  {files.length > 0 ? (
    files.map((file) => (
      <li key={file._id}>
        <span>{file.title} - <strong>{file.fileType}</strong>-<strong>{file.downloadUrl}</strong></span>
        <a href={file.downloadUrl} download>
          <button>Download</button>
        </a>
        <button onClick={() => handleDelete(file._id)}>Delete</button>
      </li>
    ))
  ) : (
    <p>No files uploaded yet.</p>
  )}
</ul>

    </div>
  );
};

export default FileUploader;
