// FIXED AdminLayout.js - Thêm thống kê doanh thu thực từ database
import React, { useState, useEffect } from 'react';
import apiService from '../../../services/api/apiService';
import orderApiService from '../../../services/api/orderApiService';
import authService from '../../../services/api/authService';
import { notificationManager } from '../../layout/Notification/Notification';
import './AdminLayout.css';
import AdminOrderList from '../AdminOrderList';
import AdminOrderDetail from '../AdminOrderDetail';

const AdminLayout = ({ onModeChange, authState, onLogout }) => {
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

  // FIXED: Dashboard stats với doanh thu thực
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalBrands: 0,
    totalCategories: 0,
    totalRevenue: 0,
    totalOrders: 0,
    deliveredOrders: 0
  });

  // Orders states
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Thêm state cho chi tiết sản phẩm
  const [showProductDetail, setShowProductDetail] = useState(false);

  // Cập nhật hoặc tạo lại openProductModal
  const openProductModal = (type, product = null) => {
    setProductModalType(type);
    setSelectedProduct(product);
    
    if (type === 'view') {
      setShowProductDetail(true);
    } else {
      if (type === 'edit' && product) {
        setEditingProduct({ ...product });
      } else if (type === 'add') {
        setEditingProduct({
          tenSP: '', moTa: '', giaTien: '', soLuongTrongKho: '',
          maDanhMuc: '', maHang: '', anh1: '', soLuongDaBan: 0
        });
      }
      setShowProductModal(true);
    }
  };

  // THÊM: Check permissions
  const canManageProducts = authService.hasPermission('MANAGE_PRODUCTS') || authService.hasRole('ADMIN');
  const canManageBrands = authService.hasPermission('MANAGE_BRANDS') || authService.hasRole('ADMIN');
  const canManageCategories = authService.hasPermission('MANAGE_CATEGORIES') || authService.hasRole('ADMIN');
  const canViewOrders = authService.hasPermission('VIEW_ORDERS') || authService.hasRole('ADMIN');
  const canViewDashboard = authService.hasPermission('VIEW_DASHBOARD') || authService.hasRole('ADMIN');

  // KIỂM TRA ADMIN KHI MOUNT
  useEffect(() => {
    // Nếu không phải admin, chuyển về customer
    if (!authService.isAdmin()) {
      notificationManager.error('Bạn không có quyền truy cập trang quản trị');
      if (onModeChange) {
        onModeChange('customer');
      }
    }
  }, [onModeChange]);

  // Menu items đơn giản - không cần check quyền
  const getMenuItems = () => [
    { id: 'dashboard', title: 'Trang chủ', icon: '🏠' },
    { id: 'products', title: 'Quản lý sản phẩm', icon: '📦' },
    { id: 'brands', title: 'Quản lý thương hiệu', icon: '🏷️' },
    { id: 'categories', title: 'Quản lý danh mục', icon: '📂' },
    { id: 'orders', title: 'Quản lý đơn hàng', icon: '🧾' }
  ];

  // FIXED: Load data và tính toán thống kê thực tế
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
            await loadDashboardStats();
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

  // FIXED: Load thống kê dashboard từ dữ liệu thực
  const loadDashboardStats = async () => {
    try {
      const [productsRes, brandsRes, categoriesRes, ordersRes] = await Promise.allSettled([
        apiService.getProducts(),
        apiService.getBrands(),
        apiService.getCategories(),
        orderApiService.getAllOrders()
      ]);

      // Tính toán thống kê từ dữ liệu thực
      const totalProducts = productsRes.status === 'fulfilled' ? productsRes.value.length : 0;
      const totalBrands = brandsRes.status === 'fulfilled' ? brandsRes.value.length : 0;
      const totalCategories = categoriesRes.status === 'fulfilled' ? categoriesRes.value.length : 0;
      
      let totalRevenue = 0;
      let totalOrders = 0;
      let deliveredOrders = 0;

      if (ordersRes.status === 'fulfilled' && Array.isArray(ordersRes.value)) {
        const orders = ordersRes.value;
        totalOrders = orders.length;
        
        // FIXED: Tính doanh thu từ các đơn hàng đã giao (status = 3)
        orders.forEach(order => {
          if (order.status === 3) { // Đã giao hàng
            deliveredOrders++;
            totalRevenue += (order.total || 0);
          }
        });
      }

      setStats({
        totalProducts,
        totalBrands,
        totalCategories,
        totalRevenue,
        totalOrders,
        deliveredOrders
      });

      console.log('Dashboard stats loaded:', {
        totalProducts,
        totalBrands,
        totalCategories,
        totalRevenue,
        totalOrders,
        deliveredOrders
      });

    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      // Set default stats on error
      setStats({
        totalProducts: 0,
        totalBrands: 0,
        totalCategories: 0,
        totalRevenue: 0,
        totalOrders: 0,
        deliveredOrders: 0
      });
    }
  };

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

  // CẬP NHẬT: Các handler với check permission
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
      
      // Xử lý lỗi 401 từ backend
      if (error.message.includes('UNAUTHORIZED')) {
        notificationManager.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại');
        if (onLogout) onLogout();
      } else {
        notificationManager.error('Có lỗi xảy ra: ' + error.message);
      }
    }
  };

  const handleDeleteProduct = async (product) => {
    try {
      await apiService.deleteProduct(product.maSP);
      setProducts(prev => prev.filter(p => p.maSP !== product.maSP));
      notificationManager.success('Xóa sản phẩm thành công');
    } catch (error) {
      console.error('Delete product error:', error);
      if (error.message.includes('UNAUTHORIZED')) {
        notificationManager.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại');
        if (onLogout) onLogout();
      } else {
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
      if (error.message.includes('UNAUTHORIZED')) {
        notificationManager.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại');
        if (onLogout) onLogout();
      } else {
        notificationManager.error('Có lỗi xảy ra: ' + error.message);
      }
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
      if (error.message.includes('UNAUTHORIZED')) {
        notificationManager.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại');
        if (onLogout) onLogout();
      } else {
        notificationManager.error('Có lỗi xảy ra: ' + error.message);
      }
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
      if (error.message.includes('UNAUTHORIZED')) {
        notificationManager.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại');
        if (onLogout) onLogout();
      } else {
        notificationManager.error('Có lỗi xảy ra: ' + error.message);
      }
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
      if (error.message.includes('UNAUTHORIZED')) {
        notificationManager.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại');
        if (onLogout) onLogout();
      } else {
        notificationManager.error('Có lỗi xảy ra: ' + error.message);
      }
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

  // FIXED: Dashboard với thống kê doanh thu thực
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
          <div className="stat-icon">🧾</div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalOrders}</div>
            <div className="stat-label">Tổng đơn hàng</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-number">{stats.deliveredOrders}</div>
            <div className="stat-label">Đã giao hàng</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-number">{formatPrice(stats.totalRevenue)}</div>
            <div className="stat-label">Tổng doanh thu</div>
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
        <button className="action-btn" onClick={() => loadDashboardStats()}>
          🔄 Làm mới thống kê
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
                <button onClick={() => {
                  setSelectedProduct(product);
                  setShowProductDetail(true);
                }}>👁️</button>
                <button onClick={() => {
                  setProductModalType('edit');
                  setSelectedProduct(product);
                  setEditingProduct({ ...product });
                  setShowProductModal(true);
                }}>✏️</button>
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

  // CẬP NHẬT: handleLogout
  const handleLogout = async () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      try {
        await authService.logout();
        notificationManager.success('Đã đăng xuất thành công');
        if (onLogout) {
          await onLogout();
        }
      } catch (error) {
        console.error('Logout error:', error);
        // Force logout
        if (onLogout) {
          await onLogout();
        }
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
            <img src="https://via.placeholder.com/40x40?text=AD" alt="User" />
          </div>
          {!isSidebarCollapsed && (
            <div className="user-info">
              <div className="user-name">{authState?.user?.ten || 'Administrator'}</div>
              <div className="user-role">
                {authState?.user?.roles?.[0]?.name || 'Quản trị viên'}
              </div>
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