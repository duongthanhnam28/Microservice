// FIXED AdminLayout.js - Handle missing APIs gracefully
import React, { useState, useEffect } from 'react';
import apiService from '../../../services/api/apiService';
import { notificationManager } from '../../layout/Notification/Notification';
import './AdminLayout.css';
import AdminOrderList from '../AdminOrderList';
import AdminOrderDetail from '../AdminOrderDetail';

const AdminLayout = ({ onModeChange }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Shared states
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Products states
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [productModalType, setProductModalType] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Brands states
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  
  // Categories states
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Dashboard stats
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalBrands: 0,
    totalCategories: 0,
    totalRevenue: 0
  });

  // Orders states
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // FIXED: API availability status
  const [apiStatus, setApiStatus] = useState({
    products: 'unknown',
    brands: 'unknown', 
    categories: 'unknown'
  });

  // Menu configuration - FIXED: Điều chỉnh dựa trên API availability
  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', title: 'Trang chủ', icon: '🏠' },
      { id: 'products', title: 'Quản lý sản phẩm', icon: '📦' }
    ];

    // Chỉ thêm brands/categories nếu API available
    if (apiStatus.brands === 'available') {
      baseItems.push({ id: 'brands', title: 'Quản lý thương hiệu', icon: '🏷️' });
    }
    
    if (apiStatus.categories === 'available') {
      baseItems.push({ id: 'categories', title: 'Quản lý danh mục', icon: '📂' });
    }

    baseItems.push({ id: 'orders', title: 'Quản lý đơn hàng', icon: '🧾' });
    
    return baseItems;
  };

  // FIXED: Load data với error handling tốt hơn
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        switch (activeMenu) {
          case 'products':
            try {
              const productsData = await apiService.getProducts();
              setProducts(productsData);
              setApiStatus(prev => ({ ...prev, products: 'available' }));
            } catch (error) {
              console.warn('Products API not available');
              setProducts([]);
              setApiStatus(prev => ({ ...prev, products: 'unavailable' }));
            }
            break;
            
          case 'brands':
            try {
              const brandsData = await apiService.getBrands();
              setBrands(brandsData);
              setApiStatus(prev => ({ ...prev, brands: 'available' }));
            } catch (error) {
              console.warn('Brands API not available');
              setBrands([]);
              setApiStatus(prev => ({ ...prev, brands: 'unavailable' }));
            }
            break;
            
          case 'categories':
            try {
              const categoriesData = await apiService.getCategories();
              setCategories(categoriesData);
              setApiStatus(prev => ({ ...prev, categories: 'available' }));
            } catch (error) {
              console.warn('Categories API not available');
              setCategories([]);
              setApiStatus(prev => ({ ...prev, categories: 'unavailable' }));
            }
            break;
            
          case 'dashboard':
            // FIXED: Load dashboard stats với error handling
            try {
              const [productsCount, brandsCount, categoriesCount] = await Promise.allSettled([
                apiService.getProducts().then(data => {
                  setApiStatus(prev => ({ ...prev, products: 'available' }));
                  return Array.isArray(data) ? data.length : 0;
                }),
                apiService.getBrands().then(data => {
                  setApiStatus(prev => ({ ...prev, brands: 'available' }));
                  return Array.isArray(data) ? data.length : 0;
                }),
                apiService.getCategories().then(data => {
                  setApiStatus(prev => ({ ...prev, categories: 'available' }));
                  return Array.isArray(data) ? data.length : 0;
                })
              ]);

              setStats({
                totalProducts: productsCount.status === 'fulfilled' ? productsCount.value : 0,
                totalBrands: brandsCount.status === 'fulfilled' ? brandsCount.value : 0,
                totalCategories: categoriesCount.status === 'fulfilled' ? categoriesCount.value : 0,
                totalRevenue: 125000000 // Mock data
              });

              // Update API status based on results
              if (productsCount.status === 'rejected') {
                setApiStatus(prev => ({ ...prev, products: 'unavailable' }));
              }
              if (brandsCount.status === 'rejected') {
                setApiStatus(prev => ({ ...prev, brands: 'unavailable' }));
              }
              if (categoriesCount.status === 'rejected') {
                setApiStatus(prev => ({ ...prev, categories: 'unavailable' }));
              }

            } catch (error) {
              console.error('Error loading dashboard stats:', error);
              setStats({
                totalProducts: 0,
                totalBrands: 0,
                totalCategories: 0,
                totalRevenue: 0
              });
            }
            break;
        }
      } catch (error) {
        console.error('Error loading data:', error);
        // FIXED: Không hiển thị notification error nữa, chỉ log
        
        // Reset data khi có lỗi
        switch (activeMenu) {
          case 'products':
            setProducts([]);
            break;
          case 'brands':
            setBrands([]);
            break;
          case 'categories':
            setCategories([]);
            break;
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [activeMenu]);

  // Rest of the component methods remain the same...
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getImageUrl = (filename) => {
    if (!filename) return 'https://via.placeholder.com/300x200?text=No+Image';
    return `http://localhost:9010/api/files/${filename}`;
  };

  // Product functions
  const openProductModal = (type, product = null) => {
    setProductModalType(type);
    setSelectedProduct(product);
    if (type === 'edit' && product) {
      setEditingProduct({ ...product });
    } else if (type === 'add') {
      setEditingProduct({
        tenSP: '', moTa: '', giaTien: '', soLuongTrongKho: '',
        maDanhMuc: '', maHang: '', anh1: ''
      });
    }
    setShowProductModal(true);
  };

  const handleSaveProduct = async () => {
    try {
      const productData = {
        tenSP: editingProduct.tenSP,
        moTa: editingProduct.moTa || '',
        giaTien: parseInt(editingProduct.giaTien),
        soLuongTrongKho: parseInt(editingProduct.soLuongTrongKho),
        maDanhMuc: parseInt(editingProduct.maDanhMuc),
        maHang: parseInt(editingProduct.maHang),
        anh1: editingProduct.anh1 || ''
      };

      if (productModalType === 'edit') {
        const updated = await apiService.updateProduct(editingProduct.maSP, productData);
        setProducts(prev => prev.map(p => p.maSP === editingProduct.maSP ? updated : p));
        notificationManager.success('Cập nhật sản phẩm thành công');
      } else {
        const newProduct = await apiService.addProduct(productData);
        setProducts(prev => [...prev, newProduct]);
        notificationManager.success('Thêm sản phẩm thành công');
      }
      setShowProductModal(false);
    } catch (error) {
      notificationManager.error('Có lỗi xảy ra: ' + error.message);
    }
  };

  const handleDeleteProduct = async (product) => {
    if (window.confirm(`Xóa sản phẩm "${product.tenSP}"?`)) {
      try {
        await apiService.deleteProduct(product.maSP);
        setProducts(prev => prev.filter(p => p.maSP !== product.maSP));
        notificationManager.success('Xóa sản phẩm thành công');
      } catch (error) {
        notificationManager.error('Có lỗi xảy ra: ' + error.message);
      }
    }
  };

  // FIXED: Brand functions với API status check
  const openBrandModal = (type, brand = null) => {
    if (apiStatus.brands !== 'available') {
      notificationManager.warning('API quản lý thương hiệu chưa được kích hoạt');
      return;
    }
    
    if (type === 'edit' && brand) {
      setEditingBrand({ ...brand });
    } else if (type === 'add') {
      setEditingBrand({ tenHang: '' });
    }
    setShowBrandModal(true);
  };

  const handleSaveBrand = async () => {
    if (!editingBrand.tenHang.trim()) {
      notificationManager.warning('Vui lòng nhập tên thương hiệu');
      return;
    }

    try {
      setLoading(true);
      if (editingBrand.maHang) {
        const updatedBrand = await apiService.updateBrand(editingBrand.maHang, editingBrand);
        setBrands(prev => prev.map(b => b.maHang === editingBrand.maHang ? updatedBrand : b));
        notificationManager.success('Cập nhật thương hiệu thành công');
      } else {
        const newBrand = await apiService.addBrand(editingBrand);
        setBrands(prev => [...prev, newBrand]);
        notificationManager.success('Thêm thương hiệu thành công');
      }
      setShowBrandModal(false);
      setEditingBrand(null);
    } catch (error) {
      console.error('Brand save error:', error);
      notificationManager.error('Có lỗi xảy ra: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBrand = async (brand) => {
    if (!window.confirm(`Xóa thương hiệu "${brand.tenHang}"?`)) {
      return;
    }

    try {
      setLoading(true);
      await apiService.deleteBrand(brand.maHang);
      setBrands(prev => prev.filter(b => b.maHang !== brand.maHang));
      notificationManager.success('Xóa thương hiệu thành công');
    } catch (error) {
      console.error('Brand delete error:', error);
      notificationManager.error('Có lỗi xảy ra: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // FIXED: Category functions với API status check
  const openCategoryModal = (type, category = null) => {
    if (apiStatus.categories !== 'available') {
      notificationManager.warning('API quản lý danh mục chưa được kích hoạt');
      return;
    }

    if (type === 'edit' && category) {
      setEditingCategory({ ...category });
    } else if (type === 'add') {
      setEditingCategory({ tenDanhMuc: '' });
    }
    setShowCategoryModal(true);
  };

  const handleSaveCategory = async () => {
    if (!editingCategory.tenDanhMuc.trim()) {
      notificationManager.warning('Vui lòng nhập tên danh mục');
      return;
    }

    try {
      setLoading(true);
      if (editingCategory.maDanhMuc) {
        const updatedCategory = await apiService.updateCategory(editingCategory.maDanhMuc, editingCategory);
        setCategories(prev => prev.map(c => c.maDanhMuc === editingCategory.maDanhMuc ? updatedCategory : c));
        notificationManager.success('Cập nhật danh mục thành công');
      } else {
        const newCategory = await apiService.addCategory(editingCategory);
        setCategories(prev => [...prev, newCategory]);
        notificationManager.success('Thêm danh mục thành công');
      }
      setShowCategoryModal(false);
      setEditingCategory(null);
    } catch (error) {
      console.error('Category save error:', error);
      notificationManager.error('Có lỗi xảy ra: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (category) => {
    if (!window.confirm(`Xóa danh mục "${category.tenDanhMuc}"?`)) {
      return;
    }

    try {
      setLoading(true);
      await apiService.deleteCategory(category.maDanhMuc);
      setCategories(prev => prev.filter(c => c.maDanhMuc !== category.maDanhMuc));
      notificationManager.success('Xóa danh mục thành công');
    } catch (error) {
      console.error('Category delete error:', error);
      notificationManager.error('Có lỗi xảy ra: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter data based on search
  const filteredProducts = products.filter(p => 
    p.tenSP && p.tenSP.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredBrands = brands.filter(b => 
    b.tenHang && b.tenHang.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredCategories = categories.filter(c => 
    c.tenDanhMuc && c.tenDanhMuc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // FIXED: Dashboard với API status indicators
  const renderDashboard = () => (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>📊 Thống kê tổng quan</h1>
        <p>Tổng quan về hoạt động kinh doanh</p>
      </div>

      {/* FIXED: API Status indicators */}
      <div className="api-status-section" style={{ 
        marginBottom: '2rem', 
        padding: '1rem', 
        background: '#f8fafc', 
        borderRadius: '12px',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{ marginBottom: '1rem', color: '#374151' }}>🔌 Trạng thái API</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ 
            padding: '0.5rem 1rem', 
            borderRadius: '20px', 
            background: apiStatus.products === 'available' ? '#dcfce7' : '#fef2f2',
            color: apiStatus.products === 'available' ? '#16a34a' : '#dc2626',
            border: `1px solid ${apiStatus.products === 'available' ? '#bbf7d0' : '#fecaca'}`
          }}>
            📦 Sản phẩm: {apiStatus.products === 'available' ? '✅ Hoạt động' : '❌ Không khả dụng'}
          </div>
          <div style={{ 
            padding: '0.5rem 1rem', 
            borderRadius: '20px', 
            background: apiStatus.brands === 'available' ? '#dcfce7' : '#fef2f2',
            color: apiStatus.brands === 'available' ? '#16a34a' : '#dc2626',
            border: `1px solid ${apiStatus.brands === 'available' ? '#bbf7d0' : '#fecaca'}`
          }}>
            🏷️ Thương hiệu: {apiStatus.brands === 'available' ? '✅ Hoạt động' : '❌ Không khả dụng'}
          </div>
          <div style={{ 
            padding: '0.5rem 1rem', 
            borderRadius: '20px', 
            background: apiStatus.categories === 'available' ? '#dcfce7' : '#fef2f2',
            color: apiStatus.categories === 'available' ? '#16a34a' : '#dc2626',
            border: `1px solid ${apiStatus.categories === 'available' ? '#bbf7d0' : '#fecaca'}`
          }}>
            📂 Danh mục: {apiStatus.categories === 'available' ? '✅ Hoạt động' : '❌ Không khả dụng'}
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalProducts}</div>
            <div className="stat-label">Sản phẩm</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏷️</div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalBrands}</div>
            <div className="stat-label">Thương hiệu</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📂</div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalCategories}</div>
            <div className="stat-label">Danh mục</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-number">{formatPrice(stats.totalRevenue)}</div>
            <div className="stat-label">Doanh thu tháng</div>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <button className="action-btn" onClick={() => setActiveMenu('products')}>
          ➕ Thêm sản phẩm
        </button>
        {apiStatus.brands === 'available' && (
          <button className="action-btn" onClick={() => setActiveMenu('brands')}>
            🏷️ Thêm thương hiệu
          </button>
        )}
        {apiStatus.categories === 'available' && (
          <button className="action-btn" onClick={() => setActiveMenu('categories')}>
            📂 Thêm danh mục
          </button>
        )}
      </div>
    </div>
  );

  // Render Products (same as before)
  const renderProducts = () => (
    <div className="admin-section">
      <div className="section-header">
        <h1>📦 Quản lý sản phẩm</h1>
        <button className="btn-primary" onClick={() => openProductModal('add')}>
          ➕ Thêm sản phẩm
        </button>
      </div>

      <div className="section-filters">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredProducts.length === 0 ? (
        <div className="no-data">
          <p>Không có sản phẩm nào{searchTerm && ` phù hợp với "${searchTerm}"`}</p>
        </div>
      ) : (
        <div className="data-grid">
          {filteredProducts.map(product => (
            <div key={product.maSP} className="data-card">
              <img src={getImageUrl(product.anh1)} alt={product.tenSP} />
              <div className="card-content">
                <h3>{product.tenSP}</h3>
                <p className="price">{formatPrice(product.giaTien)}</p>
                <p className="stock">Kho: {product.soLuongTrongKho}</p>
              </div>
              <div className="card-actions">
                <button onClick={() => openProductModal('view', product)}>👁️</button>
                <button onClick={() => openProductModal('edit', product)}>✏️</button>
                <button onClick={() => handleDeleteProduct(product)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // FIXED: Render Brands với API status check
  const renderBrands = () => {
    if (apiStatus.brands !== 'available') {
      return (
        <div className="admin-section">
          <div className="api-unavailable">
            <h2>🚫 API Thương hiệu không khả dụng</h2>
            <p>Endpoint /api/v1/brands chưa được triển khai trên server.</p>
            <p>Vui lòng liên hệ team backend để kích hoạt tính năng này.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="admin-section">
        <div className="section-header">
          <h1>🏷️ Quản lý thương hiệu</h1>
          <button className="btn-primary" onClick={() => openBrandModal('add')}>
            ➕ Thêm thương hiệu
          </button>
        </div>

        <div className="section-filters">
          <input
            type="text"
            placeholder="Tìm kiếm thương hiệu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {filteredBrands.length === 0 ? (
          <div className="no-data">
            <p>Không có thương hiệu nào{searchTerm && ` phù hợp với "${searchTerm}"`}</p>
          </div>
        ) : (
          <div className="data-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên thương hiệu</th>
                  <th>Số sản phẩm</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredBrands.map(brand => (
                  <tr key={brand.maHang}>
                    <td>#{brand.maHang}</td>
                    <td>{brand.tenHang}</td>
                    <td>{products.filter(p => p.maHang === brand.maHang).length}</td>
                    <td>
                      <button onClick={() => openBrandModal('edit', brand)}>✏️</button>
                      <button onClick={() => handleDeleteBrand(brand)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  // FIXED: Render Categories với API status check
  const renderCategories = () => {
    if (apiStatus.categories !== 'available') {
      return (
        <div className="admin-section">
          <div className="api-unavailable">
            <h2>🚫 API Danh mục không khả dụng</h2>
            <p>Endpoint /api/v1/categories chưa được triển khai trên server.</p>
            <p>Vui lòng liên hệ team backend để kích hoạt tính năng này.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="admin-section">
        <div className="section-header">
          <h1>📂 Quản lý danh mục</h1>
          <button className="btn-primary" onClick={() => openCategoryModal('add')}>
            ➕ Thêm danh mục
          </button>
        </div>

        <div className="section-filters">
          <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {filteredCategories.length === 0 ? (
          <div className="no-data">
            <p>Không có danh mục nào{searchTerm && ` phù hợp với "${searchTerm}"`}</p>
          </div>
        ) : (
          <div className="data-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên danh mục</th>
                  <th>Số sản phẩm</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map(category => (
                  <tr key={category.maDanhMuc}>
                    <td>#{category.maDanhMuc}</td>
                    <td>{category.tenDanhMuc}</td>
                    <td>{products.filter(p => p.maDanhMuc === category.maDanhMuc).length}</td>
                    <td>
                      <button onClick={() => openCategoryModal('edit', category)}>✏️</button>
                      <button onClick={() => handleDeleteCategory(category)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  // Render Orders
  const renderOrders = () => {
    if (selectedOrderId) {
      return <AdminOrderDetail orderId={selectedOrderId} onBack={() => setSelectedOrderId(null)} />;
    }
    return <AdminOrderList onSelectOrder={setSelectedOrderId} />;
  };

  // Handle logout
  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      notificationManager.success('Đã đăng xuất thành công');
      if (onModeChange) {
        onModeChange('customer');
      }
    }
  };

  // Main render
  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="admin-logo">
            <div className="logo-icon">🛠️</div>
            {!isSidebarCollapsed && (
              <div className="logo-text">
                <h2>Quản lý cửa hàng</h2>
              </div>
            )}
          </div>
          <button 
            className="sidebar-toggle"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            {isSidebarCollapsed ? '▶️' : '◀️'}
          </button>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">
            <img src="https://via.placeholder.com/40x40?text=HQ" alt="User" />
          </div>
          {!isSidebarCollapsed && (
            <div className="user-info">
              <div className="user-name">Xin chào! hq@gmail.com</div>
              <div className="user-role">Administrator</div>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-list">
            {getMenuItems().map(item => (
              <li key={item.id} className="nav-item">
                <button
                  className={`nav-link ${activeMenu === item.id ? 'active' : ''}`}
                  onClick={() => setActiveMenu(item.id)}
                  title={isSidebarCollapsed ? item.title : ''}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!isSidebarCollapsed && (
                    <span className="nav-text">{item.title}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="breadcrumb">
            <span>🏠 Home / {getMenuItems().find(item => item.id === activeMenu)?.title}</span>
          </div>
          <div className="header-actions">
            <button className="header-btn">🔔</button>
            <button className="header-btn">⚙️</button>
            <button className="logout-btn" onClick={handleLogout}>Đăng xuất</button>
          </div>
        </header>

        <div className="admin-content">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : (
            <>
              {activeMenu === 'dashboard' && renderDashboard()}
              {activeMenu === 'products' && renderProducts()}
              {activeMenu === 'brands' && renderBrands()}
              {activeMenu === 'categories' && renderCategories()}
              {activeMenu === 'orders' && renderOrders()}
            </>
          )}
        </div>
      </main>

      {/* Product Modal */}
      {showProductModal && (
        <div className="modal-overlay" onClick={() => setShowProductModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {productModalType === 'add' ? 'Thêm sản phẩm' : 
                 productModalType === 'edit' ? 'Sửa sản phẩm' : 'Chi tiết sản phẩm'}
              </h2>
              <button onClick={() => setShowProductModal(false)}>✕</button>
            </div>
            <div className="modal-content">
              {productModalType !== 'view' ? (
                <div className="form-grid">
                  <input
                    type="text"
                    placeholder="Tên sản phẩm"
                    value={editingProduct?.tenSP || ''}
                    onChange={(e) => setEditingProduct(prev => ({...prev, tenSP: e.target.value}))}
                  />
                  <input
                    type="number"
                    placeholder="Giá tiền"
                    value={editingProduct?.giaTien || ''}
                    onChange={(e) => setEditingProduct(prev => ({...prev, giaTien: e.target.value}))}
                  />
                  <input
                    type="number"
                    placeholder="Số lượng"
                    value={editingProduct?.soLuongTrongKho || ''}
                    onChange={(e) => setEditingProduct(prev => ({...prev, soLuongTrongKho: e.target.value}))}
                  />
                  <select
                    value={editingProduct?.maDanhMuc || ''}
                    onChange={(e) => setEditingProduct(prev => ({...prev, maDanhMuc: e.target.value}))}
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map(cat => (
                      <option key={cat.maDanhMuc} value={cat.maDanhMuc}>
                        {cat.tenDanhMuc}
                      </option>
                    ))}
                  </select>
                  <select
                    value={editingProduct?.maHang || ''}
                    onChange={(e) => setEditingProduct(prev => ({...prev, maHang: e.target.value}))}
                  >
                    <option value="">Chọn thương hiệu</option>
                    {brands.map(brand => (
                      <option key={brand.maHang} value={brand.maHang}>
                        {brand.tenHang}
                      </option>
                    ))}
                  </select>
                  <textarea
                    placeholder="Mô tả"
                    value={editingProduct?.moTa || ''}
                    onChange={(e) => setEditingProduct(prev => ({...prev, moTa: e.target.value}))}
                    rows="3"
                  />
                  <div className="modal-actions">
                    <button className="btn-primary" onClick={handleSaveProduct}>
                      {productModalType === 'edit' ? 'Cập nhật' : 'Thêm'}
                    </button>
                    <button onClick={() => setShowProductModal(false)}>Hủy</button>
                  </div>
                </div>
              ) : (
                <div className="product-details">
                  <h3>{selectedProduct?.tenSP}</h3>
                  <p>Giá: {formatPrice(selectedProduct?.giaTien)}</p>
                  <p>Kho: {selectedProduct?.soLuongTrongKho}</p>
                  <p>Mô tả: {selectedProduct?.moTa}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Brand Modal */}
      {showBrandModal && (
        <div className="modal-overlay" onClick={() => setShowBrandModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingBrand?.maHang ? 'Sửa thương hiệu' : 'Thêm thương hiệu'}</h2>
              <button onClick={() => setShowBrandModal(false)}>✕</button>
            </div>
            <div className="modal-content">
              <input
                type="text"
                placeholder="Tên thương hiệu"
                value={editingBrand?.tenHang || ''}
                onChange={(e) => setEditingBrand(prev => ({...prev, tenHang: e.target.value}))}
              />
              <div className="modal-actions">
                <button className="btn-primary" onClick={handleSaveBrand}>
                  {editingBrand?.maHang ? 'Cập nhật' : 'Thêm'}
                </button>
                <button onClick={() => setShowBrandModal(false)}>Hủy</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="modal-overlay" onClick={() => setShowCategoryModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCategory?.maDanhMuc ? 'Sửa danh mục' : 'Thêm danh mục'}</h2>
              <button onClick={() => setShowCategoryModal(false)}>✕</button>
            </div>
            <div className="modal-content">
              <input
                type="text"
                placeholder="Tên danh mục"
                value={editingCategory?.tenDanhMuc || ''}
                onChange={(e) => setEditingCategory(prev => ({...prev, tenDanhMuc: e.target.value}))}
              />
              <div className="modal-actions">
                <button className="btn-primary" onClick={handleSaveCategory}>
                  {editingCategory?.maDanhMuc ? 'Cập nhật' : 'Thêm'}
                </button>
                <button onClick={() => setShowCategoryModal(false)}>Hủy</button>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default AdminLayout;