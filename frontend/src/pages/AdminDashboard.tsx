import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePlants } from '@/hooks/usePlants';
import { useCategories } from '@/hooks/useCategories';
import { useToast } from '@/components/ui/use-toast';

const navItems = [
  { label: 'Dashboard', key: 'dashboard' },
  { label: 'Plants', key: 'plants' },
  { label: 'Categories', key: 'categories' },
  { label: 'Hero Section', key: 'hero' },
  { label: 'Trending', key: 'trending' },
  { label: 'Best Sellers', key: 'bestsellers' },
];

const initialPlants = [
  {
    id: 1,
    name: 'Snake Plant',
    price: 499,
    category: 'Indoor',
    trending: true,
    bestSeller: false,
    image: '/images/plants/snake-plant.jpg',
    stock: 10,
  },
  {
    id: 2,
    name: 'ZZ Plant',
    price: 699,
    category: 'Indoor',
    trending: false,
    bestSeller: true,
    image: '/images/plants/zz-plant.jpg',
    stock: 5,
  },
];

const initialCategories = [
  { id: 1, name: 'Indoor', description: 'Plants for indoor spaces' },
  { id: 2, name: 'Outdoor', description: 'Plants for outdoor gardens' },
  { id: 3, name: 'Succulents', description: 'Low-maintenance succulents' },
];

const initialHeroSlides = [
  { id: 1, title: 'Spring Collection', subtitle: 'Discover our new arrivals to brighten your space', image: '/images/hero/spring.jpg', cta: 'Shop Now', link: '/shopPlant' },
  { id: 2, title: 'Indoor Oasis', subtitle: 'Transform your home with our air-purifying plants', image: '/images/hero/indoor.jpg', cta: 'Explore Indoor Plants', link: '/category/indoor' },
];

const AdminDashboard = () => {
  const [active, setActive] = useState('dashboard');
  const { toast } = useToast();
  const { 
    plants, 
    isLoadingPlants,
    createPlant,
    updatePlant,
    deletePlant,
    setTrendingStatus,
    setBestSellerStatus
  } = usePlants();

  const {
    categories,
    isLoadingCategories,
    createCategory,
    updateCategory,
    deleteCategory
  } = useCategories();

  const [showForm, setShowForm] = useState(false);
  const [editPlant, setEditPlant] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    discountPercentage: '',
    isTrending: false,
    isBestSeller: false,
    image: null as File | null,
  });
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
  const [heroSlides, setHeroSlides] = useState(initialHeroSlides);
  const [showHeroForm, setShowHeroForm] = useState(false);
  const [editHero, setEditHero] = useState(null);
  const [heroForm, setHeroForm] = useState({ title: '', subtitle: '', image: '', cta: '', link: '' });

  const openAddForm = () => {
    setEditPlant(null);
    setForm({
      name: '',
      description: '',
      price: '',
      categoryId: '',
      discountPercentage: '',
      isTrending: false,
      isBestSeller: false,
      image: null,
    });
    setShowForm(true);
  };

  const openEditForm = (plant) => {
    setEditPlant(plant);
    setForm({
      name: plant.name,
      description: plant.description,
      price: plant.price.toString(),
      categoryId: plant.categoryId.toString(),
      discountPercentage: plant.discountPercentage.toString(),
      isTrending: plant.isTrending,
      isBestSeller: plant.isBestSeller,
      image: null,
    });
    setShowForm(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm(prev => ({ ...prev, image: file }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editPlant) {
        await updatePlant.mutateAsync({
          id: editPlant.id,
          ...form,
          price: Number(form.price),
          categoryId: Number(form.categoryId),
          discountPercentage: Number(form.discountPercentage),
        });
      } else {
        await createPlant.mutateAsync({
          ...form,
          price: Number(form.price),
          categoryId: Number(form.categoryId),
          discountPercentage: Number(form.discountPercentage),
        });
      }
      setShowForm(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save plant',
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePlant.mutateAsync(id);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete plant',
      });
    }
  };

  const toggleTrending = async (id, currentStatus) => {
    try {
      await setTrendingStatus.mutateAsync({ id, isTrending: !currentStatus });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update trending status',
      });
    }
  };

  const toggleBestSeller = async (id, currentStatus) => {
    try {
      await setBestSellerStatus.mutateAsync({ id, isBestSeller: !currentStatus });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update bestseller status',
      });
    }
  };

  const openAddCategoryForm = () => {
    setEditCategory(null);
    setCategoryForm({ name: '', description: '' });
    setShowCategoryForm(true);
  };

  const openEditCategoryForm = (cat) => {
    setEditCategory(cat);
    setCategoryForm({ name: cat.name, description: cat.description });
    setShowCategoryForm(true);
  };

  const handleCategoryFormChange = (e) => {
    const { name, value } = e.target;
    setCategoryForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editCategory) {
        await updateCategory.mutateAsync({
          id: editCategory.id,
          data: categoryForm
        });
      } else {
        await createCategory.mutateAsync(categoryForm);
      }
      setShowCategoryForm(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save category',
      });
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await deleteCategory.mutateAsync(id);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete category',
      });
    }
  };

  const openAddHeroForm = () => {
    setEditHero(null);
    setHeroForm({ title: '', subtitle: '', image: '', cta: '', link: '' });
    setShowHeroForm(true);
  };

  const openEditHeroForm = (slide) => {
    setEditHero(slide);
    setHeroForm({ title: slide.title, subtitle: slide.subtitle, image: slide.image, cta: slide.cta, link: slide.link });
    setShowHeroForm(true);
  };

  const handleHeroFormChange = (e) => {
    const { name, value } = e.target;
    setHeroForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleHeroFormSubmit = (e) => {
    e.preventDefault();
    if (editHero) {
      setHeroSlides((prev) =>
        prev.map((s) => (s.id === editHero.id ? { ...s, ...heroForm } : s))
      );
    } else {
      setHeroSlides((prev) => [
        ...prev,
        { ...heroForm, id: Date.now() },
      ]);
    }
    setShowHeroForm(false);
  };

  const handleDeleteHero = (id) => {
    setHeroSlides((prev) => prev.filter((s) => s.id !== id));
  };

  if (isLoadingPlants || isLoadingCategories) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-growmor-green-dark">Admin Panel</h1>
        </div>
        <nav className="mt-6">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`w-full text-left px-6 py-3 ${
                active === item.key
                  ? 'bg-growmor-green-pale text-growmor-green-dark'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActive(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-10">
        {active === 'dashboard' && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white rounded shadow p-6 text-center">
                <div className="text-2xl font-bold text-growmor-green-dark">
                  {categories?.length || 0}
                </div>
                <div className="text-gray-500">Categories</div>
              </div>
              <div className="bg-white rounded shadow p-6 text-center">
                <div className="text-2xl font-bold text-growmor-green-dark">
                  {plants?.length || 0}
                </div>
                <div className="text-gray-500">Plants</div>
              </div>
              <div className="bg-white rounded shadow p-6 text-center">
                <div className="text-2xl font-bold text-growmor-green-dark">
                  {heroSlides.length}
                </div>
                <div className="text-gray-500">Hero Slides</div>
              </div>
            </div>
            <div className="bg-white rounded shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <ul className="text-gray-700 space-y-2">
                <li>Added new plant: <span className="font-semibold">Aloe Vera</span></li>
                <li>Updated hero slide: <span className="font-semibold">Spring Collection</span></li>
                <li>Marked <span className="font-semibold">ZZ Plant</span> as Best Seller</li>
              </ul>
            </div>
          </div>
        )}
        {active === 'plants' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Manage Plants</h1>
              <button 
                className="bg-growmor-green-dark text-white px-4 py-2 rounded hover:bg-growmor-green-dark/90" 
                onClick={openAddForm}
              >
                Add Plant
              </button>
            </div>
            {isLoadingPlants ? (
              <div>Loading plants...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded shadow">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 text-left">Image</th>
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Price</th>
                      <th className="p-3 text-left">Category</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plants?.map((plant) => (
                      <tr key={plant.id} className="border-b">
                        <td className="p-3">
                          <img
                            src={plant.images[0]?.url}
                            alt={plant.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        </td>
                        <td className="p-3 font-medium">{plant.name}</td>
                        <td className="p-3">₹{plant.price}</td>
                        <td className="p-3">
                          {categories?.find(cat => cat.id === plant.categoryId)?.name}
                        </td>
                        <td className="p-3">
                          <div className="flex space-x-2">
                            <button
                              className={`px-2 py-1 rounded text-sm ${
                                plant.isTrending
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                              onClick={() => toggleTrending(plant.id, plant.isTrending)}
                            >
                              Trending
                            </button>
                            <button
                              className={`px-2 py-1 rounded text-sm ${
                                plant.isBestSeller
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                              onClick={() => toggleBestSeller(plant.id, plant.isBestSeller)}
                            >
                              Best Seller
                            </button>
                          </div>
                        </td>
                        <td className="p-3 space-x-2">
                          <button
                            className="text-blue-600 hover:underline"
                            onClick={() => openEditForm(plant)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-500 hover:underline"
                            onClick={() => handleDelete(plant.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {active === 'categories' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Manage Categories</h1>
              <button 
                className="bg-growmor-green-dark text-white px-4 py-2 rounded hover:bg-growmor-green-dark/90" 
                onClick={openAddCategoryForm}
              >
                Add Category
              </button>
            </div>
            {isLoadingCategories ? (
              <div>Loading categories...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded shadow">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Description</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories?.map((category) => (
                      <tr key={category.id} className="border-b">
                        <td className="p-3 font-medium">{category.name}</td>
                        <td className="p-3">{category.description}</td>
                        <td className="p-3 space-x-2">
                          <button
                            className="text-blue-600 hover:underline"
                            onClick={() => openEditCategoryForm(category)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-500 hover:underline"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {active === 'hero' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Manage Hero Section</h1>
              <button className="bg-growmor-green-dark text-white px-4 py-2 rounded hover:bg-growmor-green-dark/90" onClick={openAddHeroForm}>Add Slide</button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded shadow">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left">Image</th>
                    <th className="p-3 text-left">Title</th>
                    <th className="p-3 text-left">Subtitle</th>
                    <th className="p-3 text-left">CTA</th>
                    <th className="p-3 text-left">Link</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {heroSlides.map((slide) => (
                    <tr key={slide.id} className="border-b">
                      <td className="p-3"><img src={slide.image} alt={slide.title} className="w-20 h-12 object-cover rounded" /></td>
                      <td className="p-3 font-medium">{slide.title}</td>
                      <td className="p-3">{slide.subtitle}</td>
                      <td className="p-3">{slide.cta}</td>
                      <td className="p-3">{slide.link}</td>
                      <td className="p-3 space-x-2">
                        <button className="text-blue-600 hover:underline" onClick={() => openEditHeroForm(slide)}>Edit</button>
                        <button className="text-red-500 hover:underline" onClick={() => handleDeleteHero(slide.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Add/Edit Hero Slide Form Modal */}
            {showHeroForm && (
              <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
                  <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setShowHeroForm(false)}>&times;</button>
                  <h2 className="text-xl font-bold mb-4">{editHero ? 'Edit Slide' : 'Add Slide'}</h2>
                  <form className="space-y-4" onSubmit={handleHeroFormSubmit}>
                    <div>
                      <label className="block font-semibold mb-1">Title</label>
                      <input name="title" value={heroForm.title} onChange={handleHeroFormChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Subtitle</label>
                      <input name="subtitle" value={heroForm.subtitle} onChange={handleHeroFormChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Image URL</label>
                      <input name="image" value={heroForm.image} onChange={handleHeroFormChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">CTA Text</label>
                      <input name="cta" value={heroForm.cta} onChange={handleHeroFormChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Link</label>
                      <input name="link" value={heroForm.link} onChange={handleHeroFormChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button type="button" className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300" onClick={() => setShowHeroForm(false)}>Cancel</button>
                      <button type="submit" className="bg-growmor-green-dark text-white px-4 py-2 rounded hover:bg-growmor-green-dark/90">Save</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
        {active === 'trending' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Manage Trending Plants</h1>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded shadow">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left">Image</th>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Category</th>
                    <th className="p-3 text-left">Trending</th>
                  </tr>
                </thead>
                <tbody>
                  {plants.map((plant) => (
                    <tr key={plant.id} className="border-b">
                      <td className="p-3"><img src={plant.imageUrl} alt={plant.name} className="w-12 h-12 object-cover rounded" /></td>
                      <td className="p-3 font-medium">{plant.name}</td>
                      <td className="p-3">{plant.category?.name}</td>
                      <td className="p-3">
                        <input type="checkbox" checked={plant.isTrending} onChange={() => toggleTrending(plant.id, plant.isTrending)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Currently Trending Plants</h2>
              <ul className="list-disc pl-6">
                {plants.filter(p => p.isTrending).length === 0 && <li className="text-gray-500">No trending plants selected.</li>}
                {plants.filter(p => p.isTrending).map(p => (
                  <li key={p.id}>{p.name}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
        {active === 'bestsellers' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Manage Best Sellers</h1>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded shadow">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left">Image</th>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Category</th>
                    <th className="p-3 text-left">Best Seller</th>
                  </tr>
                </thead>
                <tbody>
                  {plants.map((plant) => (
                    <tr key={plant.id} className="border-b">
                      <td className="p-3"><img src={plant.imageUrl} alt={plant.name} className="w-12 h-12 object-cover rounded" /></td>
                      <td className="p-3 font-medium">{plant.name}</td>
                      <td className="p-3">{plant.category?.name}</td>
                      <td className="p-3">
                        <input type="checkbox" checked={plant.isBestSeller} onChange={() => toggleBestSeller(plant.id, plant.isBestSeller)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Current Best Sellers</h2>
              <ul className="list-disc pl-6">
                {plants.filter(p => p.isBestSeller).length === 0 && <li className="text-gray-500">No best sellers selected.</li>}
                {plants.filter(p => p.isBestSeller).map(p => (
                  <li key={p.id}>{p.name}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>

      {/* Plant Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button 
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" 
              onClick={() => setShowForm(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">
              {editPlant ? 'Edit Plant' : 'Add Plant'}
            </h2>
            <form className="space-y-4" onSubmit={handleFormSubmit}>
              <div>
                <label className="block font-semibold mb-1">Name</label>
                <input 
                  name="name" 
                  value={form.name} 
                  onChange={handleFormChange} 
                  className="w-full border border-gray-300 rounded px-3 py-2" 
                  required 
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea 
                  name="description" 
                  value={form.description} 
                  onChange={handleFormChange} 
                  className="w-full border border-gray-300 rounded px-3 py-2" 
                  required 
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Price</label>
                <input 
                  type="number" 
                  name="price" 
                  value={form.price} 
                  onChange={handleFormChange} 
                  className="w-full border border-gray-300 rounded px-3 py-2" 
                  required 
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Category</label>
                <select 
                  name="categoryId" 
                  value={form.categoryId} 
                  onChange={handleFormChange} 
                  className="w-full border border-gray-300 rounded px-3 py-2" 
                  required
                >
                  <option value="">Select a category</option>
                  {categories?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Discount Percentage</label>
                <input 
                  type="number" 
                  name="discountPercentage" 
                  value={form.discountPercentage} 
                  onChange={handleFormChange} 
                  className="w-full border border-gray-300 rounded px-3 py-2" 
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Image</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="w-full border border-gray-300 rounded px-3 py-2" 
                  required={!editPlant}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  name="isTrending" 
                  checked={form.isTrending} 
                  onChange={handleFormChange} 
                  className="rounded" 
                />
                <label>Trending</label>
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  name="isBestSeller" 
                  checked={form.isBestSeller} 
                  onChange={handleFormChange} 
                  className="rounded" 
                />
                <label>Best Seller</label>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300" 
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-growmor-green-dark text-white px-4 py-2 rounded hover:bg-growmor-green-dark/90"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Form Modal */}
      {showCategoryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button 
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" 
              onClick={() => setShowCategoryForm(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">
              {editCategory ? 'Edit Category' : 'Add Category'}
            </h2>
            <form className="space-y-4" onSubmit={handleCategoryFormSubmit}>
              <div>
                <label className="block font-semibold mb-1">Name</label>
                <input 
                  name="name" 
                  value={categoryForm.name} 
                  onChange={handleCategoryFormChange} 
                  className="w-full border border-gray-300 rounded px-3 py-2" 
                  required 
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Description</label>
                <input 
                  name="description" 
                  value={categoryForm.description} 
                  onChange={handleCategoryFormChange} 
                  className="w-full border border-gray-300 rounded px-3 py-2" 
                  required 
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300" 
                  onClick={() => setShowCategoryForm(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-growmor-green-dark text-white px-4 py-2 rounded hover:bg-growmor-green-dark/90"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
