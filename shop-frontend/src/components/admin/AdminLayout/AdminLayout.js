// FIXED AdminLayout.js - Kết nối thực tế với APIs, không dùng demo data
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

  // Load data khi thay đổi menu
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        switch (activeMenu) {
          case 'products':
            const productsData = await apiService.getProducts();
            setProducts(productsData);
            console.log('Loaded products:', productsData.length);
            break;
            
          case 'brands':
            const brandsData = await apiService.getBrands();
            setBrands(brandsData);
            console.log('Loaded brands:', brandsData.length);
            break;
            
          case 'categories':
            const categoriesData = await apiService.getCategories();
            setCategories(categoriesData);
            console.log('Loaded categories:', categoriesData.length);
            break;
            
          case 'dashboard':
            const [productsRes, brandsRes, categoriesRes] = await Promise.allSettled([
              apiService.getProducts(),
              apiService.getBrands(),
              apiService.getCategories()
            ]);

            setStats({
              totalProducts: productsRes.status === 'fulfilled' ? productsRes.value.length : 0,
              totalBrands: brandsRes.status === 'fulfilled' ? brandsRes.value.length : 0,
              totalCategories: categoriesRes.status === 'fulfilled' ? categoriesRes.value.length : 0,
              totalRevenue: 0 // Cần tính từ dữ liệu thực
            });
            break;
        }
      } catch (error) {
        console.error('Error loading data:', error);
        notificationManager.error('Có lỗi xảy ra khi tải dữ liệu: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [activeMenu]);

  // Load brands và categories cho product form
  useEffect(() => {
    const loadFormData = async () => {
      if (activeMenu === 'products' && showProductModal && (brands.length === 0 || categories.length === 0)) {
        try {
          const [brandsData, categoriesData] = await Promise.allSettled([
            apiService.getBrands(),
            apiService.getCategories()
          ]);

          if (brandsData.status === 'fulfilled') setBrands(brandsData.value);
          if (categoriesData.status === 'fulfilled') setCategories(categoriesData.value);
        } catch (error) {
          console.error('Error loading form data:', error);
        }
      }
    };

    loadFormData();
  }, [activeMenu, showProductModal]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price || 0);
  };

  const getImageUrl = (filename) => {
    if (!filename) return 'https://via.placeholder.com/300x200?text=No+Image';
    return `http://localhost:9010/api/files/${filename}`;
  };

  const getMenuItems = () => [
    { id: 'dashboard', title: 'Trang chủ', icon: '🏠' },
    { id: 'products', title: 'Quản lý sản phẩm', icon: '📦' },
    { id: 'brands', title: 'Quản lý thương hiệu', icon: '🏷️' },
    { id: 'categories', title: 'Quản lý danh mục', icon: '📂' },
    { id: 'orders', title: 'Quản lý đơn hàng', icon: '🧾' }
  ];

  // Product functions
  const openProductModal = (type, product = null) => {
    setProductModalType(type);
    setSelectedProduct(product);
    if (type === 'edit' && product) {
      setEditingProduct({ ...product });
    } else if (type === 'add') {
      setEditingProduct({
        tenSP: '', moTa: '', giaTien: '', soLuongTrongKho: '',
        maDanhMuc: '', maHang: '', anh1: '', soLuongDaBan: 0
      });
    }
    setShowProductModal(true);
  };

  const handleSaveProduct = async () => {
    try {
      if (!editingProduct.tenSP?.trim()) {
        notificationManager.warning('Vui lòng nhập tên sản phẩm');
        return;
      }

      const productData = {
        tenSP: editingProduct.tenSP.trim(),
        moTa: editingProduct.moTa || '',
        giaTien: parseInt(editingProduct.giaTien) || 0,
        soLuongTrongKho: parseInt(editingProduct.soLuongTrongKho) || 0,
        soLuongDaBan: parseInt(editingProduct.soLuongDaBan) || 0,
        maDanhMuc: parseInt(editingProduct.maDanhMuc) || null,
        maHang: parseInt(editingProduct.maHang) || null,
        anh1: editingProduct.anh1 || ''
      };

      if (productModalType === 'edit') {
        const updated = await apiService.updateProduct(editingProduct.maSP, productData);
        setProducts(prev => prev.map(p => p.maSP === editingProduct.maSP ? { ...updated, maSP: editingProduct.maSP } : p));
        notificationManager.success('Cập nhật sản phẩm thành công');
      } else {
        const newProduct = await apiService.addProduct(productData);
        setProducts(prev => [...prev, newProduct]);
        notificationManager.success('Thêm sản phẩm thành công');
      }
      setShowProductModal(false);
    } catch (error) {
      console.error('Save product error:', error);
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
        console.error('Delete product error:', error);
        notificationManager.error('Có lỗi xảy ra: ' + error.message);
      }
    }
  };

  // Brand functions
  const openBrandModal = (type, brand = null) => {
    if (type === 'edit' && brand) {
      setEditingBrand({ ...brand });
    } else if (type === 'add') {
      setEditingBrand({ tenHang: '' });
    }
    setShowBrandModal(true);
  };

  const handleSaveBrand = async () => {
    if (!editingBrand.tenHang?.trim()) {
      notificationManager.warning('Vui lòng nhập tên thương hiệu');
      return;
    }

    try {
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
    }
  };

  const handleDeleteBrand = async (brand) => {
    if (!window.confirm(`Xóa thương hiệu "${brand.tenHang}"?`)) return;

    try {
      await apiService.deleteBrand(brand.maHang);
      setBrands(prev => prev.filter(b => b.maHang !== brand.maHang));
      notificationManager.success('Xóa thương hiệu thành công');
    } catch (error) {
      console.error('Brand delete error:', error);
      notificationManager.error('Có lỗi xảy ra: ' + error.message);
    }
  };

  // Category functions
  const openCategoryModal = (type, category = null) => {
    if (type === 'edit' && category) {
      setEditingCategory({ ...category });
    } else if (type === 'add') {
      setEditingCategory({ tenDanhMuc: '' });
    }
    setShowCategoryModal(true);
  };

  const handleSaveCategory = async () => {
    if (!editingCategory.tenDanhMuc?.trim()) {
      notificationManager.warning('Vui lòng nhập tên danh mục');
      return;
    }

    try {
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
    }
  };

  const handleDeleteCategory = async (category) => {
    if (!window.confirm(`Xóa danh mục "${category.tenDanhMuc}"?`)) return;

    try {
      await apiService.deleteCategory(category.maDanhMuc);
      setCategories(prev => prev.filter(c => c.maDanhMuc !== category.maDanhMuc));
      notificationManager.success('Xóa danh mục thành công');
    } catch (error) {
      console.error('Category delete error:', error);
      notificationManager.error('Có lỗi xảy ra: ' + error.message);
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

  // Dashboard
  const renderDashboard = () => (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>📊 Thống kê tổng quan</h1>
        <p>Tổng quan về hoạt động kinh doanh</p>
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
            <div className="stat-label">Doanh thu</div>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <button className="action-btn" onClick={() => setActiveMenu('products')}>
          ➕ Thêm sản phẩm
        </button>
        <button className="action-btn" onClick={() => setActiveMenu('brands')}>
          🏷️ Thêm thương hiệu
        </button>
        <button className="action-btn" onClick={() => setActiveMenu('categories')}>
          📂 Thêm danh mục
        </button>
      </div>
    </div>
  );

  // Render Products
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

  // Render Brands
  const renderBrands = () => (
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

  // Render Categories
  const renderCategories = () => (
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
              <div className="user-name">Administrator</div>
              <div className="user-role">Quản trị viên</div>
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
                    placeholder="Số lượng trong kho"
                    value={editingProduct?.soLuongTrongKho || ''}
                    onChange={(e) => setEditingProduct(prev => ({...prev, soLuongTrongKho: e.target.value}))}
                  />
                  <input
                    type="number"
                    placeholder="Số lượng đã bán"
                    value={editingProduct?.soLuongDaBan || ''}
                    onChange={(e) => setEditingProduct(prev => ({...prev, soLuongDaBan: e.target.value}))}
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
                  <input
                    type="text"
                    placeholder="URL Ảnh 1"
                    value={editingProduct?.anh1 || ''}
                    onChange={(e) => setEditingProduct(prev => ({...prev, anh1: e.target.value}))}
                  />
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
                  <p>Đã bán: {selectedProduct?.soLuongDaBan}</p>
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