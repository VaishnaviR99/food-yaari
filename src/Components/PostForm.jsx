import { useState } from "react";
export const PostForm=({ onSuccess })=> {
    const [formData, setFormData] = useState({
      title: '',
      content: '',
      type: 'blog',
      category: '',
      image: null
    });
  const handleChange =()=>{
console.log('handleChange')
  }
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const formData = new FormData();
        Object.keys(formData).forEach(key => {
          formData.append(key, formData[key]);
        });
        
        // await api.post('/posts', formData);
        onSuccess?.();
      } catch (error) {
        console.error('Error creating post:', error);
      }
    };
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 h-32"
            required
          />
        </div>
  
        <div>
          <label className="block text-gray-700 mb-2">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="blog">Blog</option>
            <option value="news">News</option>
          </select>
        </div>
  
        <div>
          <label className="block text-gray-700 mb-2">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
  
        <div>
          <label className="block text-gray-700 mb-2">Image</label>
          <input
            type="file"
            name="image"
            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
            className="w-full"
            accept="image/*"
            required
          />
        </div>
  
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit Post
        </button>
      </form>
    );
  }
  