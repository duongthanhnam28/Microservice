USE [master]
GO
/****** Object:  Database [OnlineShop]    Script Date: 3/5/2025 3:51:20 PM ******/
CREATE DATABASE [OnlineShop]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'OnlineShop', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\OnlineShop.mdf' , SIZE = 73728KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'OnlineShop_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\OnlineShop_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [OnlineShop] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [OnlineShop].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [OnlineShop] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [OnlineShop] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [OnlineShop] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [OnlineShop] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [OnlineShop] SET ARITHABORT OFF 
GO
ALTER DATABASE [OnlineShop] SET AUTO_CLOSE ON 
GO
ALTER DATABASE [OnlineShop] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [OnlineShop] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [OnlineShop] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [OnlineShop] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [OnlineShop] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [OnlineShop] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [OnlineShop] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [OnlineShop] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [OnlineShop] SET  ENABLE_BROKER 
GO
ALTER DATABASE [OnlineShop] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [OnlineShop] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [OnlineShop] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [OnlineShop] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [OnlineShop] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [OnlineShop] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [OnlineShop] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [OnlineShop] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [OnlineShop] SET  MULTI_USER 
GO
ALTER DATABASE [OnlineShop] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [OnlineShop] SET DB_CHAINING OFF 
GO
ALTER DATABASE [OnlineShop] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [OnlineShop] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [OnlineShop] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [OnlineShop] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [OnlineShop] SET QUERY_STORE = ON
GO
ALTER DATABASE [OnlineShop] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [OnlineShop]
GO
/****** Object:  Table [dbo].[ActionT]    Script Date: 3/5/2025 3:51:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ActionT](
	[MaA] [int] NOT NULL,
	[TenA] [nvarchar](100) NULL,
 CONSTRAINT [PK_Action] PRIMARY KEY CLUSTERED 
(
	[MaA] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CHITIETDONHANG]    Script Date: 3/5/2025 3:51:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CHITIETDONHANG](
	[MaDonHang] [int] NOT NULL,
	[MaSP] [int] NOT NULL,
	[SoLuongMua] [int] NULL,
 CONSTRAINT [PK_CHITIETDONHANG] PRIMARY KEY CLUSTERED 
(
	[MaDonHang] ASC,
	[MaSP] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ChucNang]    Script Date: 3/5/2025 3:51:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ChucNang](
	[MaChucNang] [int] IDENTITY(1,1) NOT NULL,
	[TenChucNang] [varchar](100) NULL,
PRIMARY KEY CLUSTERED 
(
	[MaChucNang] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ChucVu]    Script Date: 3/5/2025 3:51:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ChucVu](
	[MaCV] [int] NOT NULL,
	[Ten] [nvarchar](100) NULL,
 CONSTRAINT [PK_ChucVu] PRIMARY KEY CLUSTERED 
(
	[MaCV] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ChucVu2]    Script Date: 3/5/2025 3:51:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ChucVu2](
	[MaChucVu] [int] IDENTITY(1,1) NOT NULL,
	[TenChucVu] [varchar](100) NULL,
PRIMARY KEY CLUSTERED 
(
	[MaChucVu] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CV_Q_A]    Script Date: 3/5/2025 3:51:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CV_Q_A](
	[MaA] [int] NOT NULL,
	[MaCV] [int] NOT NULL,
	[MaQ] [int] NOT NULL,
	[Ten] [nvarchar](50) NULL,
 CONSTRAINT [PK_CV_Q_A] PRIMARY KEY CLUSTERED 
(
	[MaA] ASC,
	[MaCV] ASC,
	[MaQ] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[DANHGIASANPHAM]    Script Date: 3/5/2025 3:51:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DANHGIASANPHAM](
	[MaTaiKhoan] [int] NOT NULL,
	[MaSP] [int] NOT NULL,
	[DanhGia] [int] NULL,
	[NoiDungBinhLuan] [nvarchar](200) NULL,
	[NgayDanhGia] [date] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[DANHMUCSANPHAM]    Script Date: 3/5/2025 3:51:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DANHMUCSANPHAM](
	[MaDanhMuc] [int] IDENTITY(1,1) NOT NULL,
	[TenDanhMuc] [nvarchar](30) NULL,
 CONSTRAINT [PK_DANHMUCSANPHAM] PRIMARY KEY CLUSTERED 
(
	[MaDanhMuc] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[DONHANG]    Script Date: 3/5/2025 3:51:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DONHANG](
	[MaDonHang] [int] IDENTITY(1,1) NOT NULL,
	[MaTaiKhoan] [int] NULL,
	[TongTien] [bigint] NULL,
	[TinhTrang] [int] NULL,
	[NgayLap] [date] NULL,
 CONSTRAINT [PK_DONHANG] PRIMARY KEY CLUSTERED 
(
	[MaDonHang] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[DonVi]    Script Date: 3/5/2025 3:51:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DonVi](
	[MaDonVi] [int] IDENTITY(1,1) NOT NULL,
	[TenDonVi] [varchar](100) NULL,
	[MaDonViCha] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[MaDonVi] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[GioHang]    Script Date: 3/5/2025 3:51:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[GioHang](
	[MaTaiKhoan] [int] NOT NULL,
	[MaSP] [int] NOT NULL,
	[soluong] [int] NULL,
 CONSTRAINT [PK_GioHang] PRIMARY KEY CLUSTERED 
(
	[MaTaiKhoan] ASC,
	[MaSP] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[HANGSANXUAT]    Script Date: 3/5/2025 3:51:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[HANGSANXUAT](
	[MaHang] [int] IDENTITY(1,1) NOT NULL,
	[TenHang] [nvarchar](20) NULL,
 CONSTRAINT [PK_HANGSANXUAT] PRIMARY KEY CLUSTERED 
(
	[MaHang] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[HanhDong]    Script Date: 3/5/2025 3:51:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[HanhDong](
	[MaHanhDong] [int] IDENTITY(1,1) NOT NULL,
	[TenHanhDong] [varchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[MaHanhDong] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Message]    Script Date: 3/5/2025 3:51:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Message](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[SenderId] [int] NULL,
	[ReceiverId] [int] NULL,
	[Content] [nvarchar](1000) NULL,
	[IsRead] [smallint] NULL,
	[CreatedAt] [datetime] NULL,
 CONSTRAINT [PK_Message] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PhanQuyen]    Script Date: 3/5/2025 3:51:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PhanQuyen](
	[MaPhanQuyen] [int] IDENTITY(1,1) NOT NULL,
	[MaChucVu] [int] NULL,
	[MaChucNang] [int] NULL,
	[MaHanhDong] [int] NULL,
	[MaDonVi] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[MaPhanQuyen] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Quyen]    Script Date: 3/5/2025 3:51:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Quyen](
	[MaQ] [int] NOT NULL,
	[ActionName] [nvarchar](200) NULL,
	[Ten] [nvarchar](200) NULL,
	[ControllerName] [nvarchar](200) NULL,
 CONSTRAINT [PK_Quyen] PRIMARY KEY CLUSTERED 
(
	[MaQ] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Roles]    Script Date: 3/5/2025 3:51:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Roles](
	[RoleId] [int] IDENTITY(1,1) NOT NULL,
	[RoleName] [nvarchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[RoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SANPHAM]    Script Date: 3/5/2025 3:51:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SANPHAM](
	[MaSP] [int] IDENTITY(1,1) NOT NULL,
	[TenSP] [nvarchar](100) NULL,
	[MoTa] [nvarchar](1000) NULL,
	[Anh1] [nvarchar](100) NULL,
	[Anh2] [nvarchar](100) NULL,
	[Anh3] [nvarchar](100) NULL,
	[Anh4] [nvarchar](100) NULL,
	[Anh5] [nvarchar](100) NULL,
	[Anh6] [nvarchar](100) NULL,
	[SoLuongDaBan] [int] NULL,
	[SoLuongTrongKho] [int] NULL,
	[GiaTien] [bigint] NULL,
	[MaHang] [int] NULL,
	[MaDanhMuc] [int] NULL,
 CONSTRAINT [PK_SANPHAM] PRIMARY KEY CLUSTERED 
(
	[MaSP] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TAIKHOAN]    Script Date: 3/5/2025 3:51:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TAIKHOAN](
	[MaTaiKhoan] [int] IDENTITY(1,1) NOT NULL,
	[Ten] [nvarchar](30) NULL,
	[NgaySinh] [date] NULL,
	[SDT] [nchar](15) NULL,
	[DiaChi] [nvarchar](50) NULL,
	[Email] [nvarchar](20) NULL,
	[MatKhau] [nvarchar](100) NULL,
	[MaCV] [int] NULL,
	[MaDonVi] [int] NULL,
 CONSTRAINT [PK_TAIKHOAN] PRIMARY KEY CLUSTERED 
(
	[MaTaiKhoan] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TaiKhoan_ChucVu]    Script Date: 3/5/2025 3:51:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TaiKhoan_ChucVu](
	[MaTaiKhoan] [int] NOT NULL,
	[MaChucVu] [int] NOT NULL,
	[Ten] [nchar](10) NULL,
PRIMARY KEY CLUSTERED 
(
	[MaTaiKhoan] ASC,
	[MaChucVu] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TaiKhoan_PhanQuyen]    Script Date: 3/5/2025 3:51:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TaiKhoan_PhanQuyen](
	[MaTaiKhoan] [int] NOT NULL,
	[MaChucNang] [int] NOT NULL,
	[MaHanhDong] [int] NOT NULL,
	[MaDonVi] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[MaTaiKhoan] ASC,
	[MaChucNang] ASC,
	[MaHanhDong] ASC,
	[MaDonVi] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserRoles]    Script Date: 3/5/2025 3:51:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserRoles](
	[UserId] [int] NOT NULL,
	[RoleId] [int] NOT NULL,
	[Ten] [nchar](10) NULL,
PRIMARY KEY CLUSTERED 
(
	[UserId] ASC,
	[RoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[VANCHUYEN]    Script Date: 3/5/2025 3:51:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[VANCHUYEN](
	[MaDonHang] [int] NOT NULL,
	[NguoiNhan] [nvarchar](50) NULL,
	[DiaChi] [nvarchar](50) NULL,
	[SDT] [nvarchar](20) NULL,
	[HinhThucVanChuyen] [nvarchar](20) NULL,
 CONSTRAINT [PK_VANCHUYEN] PRIMARY KEY CLUSTERED 
(
	[MaDonHang] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
INSERT [dbo].[ActionT] ([MaA], [TenA]) VALUES (1, N'Không truy cập')
INSERT [dbo].[ActionT] ([MaA], [TenA]) VALUES (2, N'Chỉ xem')
INSERT [dbo].[ActionT] ([MaA], [TenA]) VALUES (3, N'Có thể sửa đổi')
GO
INSERT [dbo].[CHITIETDONHANG] ([MaDonHang], [MaSP], [SoLuongMua]) VALUES (160, 23, 1)
INSERT [dbo].[CHITIETDONHANG] ([MaDonHang], [MaSP], [SoLuongMua]) VALUES (162, 18, 1)
INSERT [dbo].[CHITIETDONHANG] ([MaDonHang], [MaSP], [SoLuongMua]) VALUES (164, 18, 1)
INSERT [dbo].[CHITIETDONHANG] ([MaDonHang], [MaSP], [SoLuongMua]) VALUES (164, 19, 1)
INSERT [dbo].[CHITIETDONHANG] ([MaDonHang], [MaSP], [SoLuongMua]) VALUES (165, 23, 2)
INSERT [dbo].[CHITIETDONHANG] ([MaDonHang], [MaSP], [SoLuongMua]) VALUES (165, 25, 1)
INSERT [dbo].[CHITIETDONHANG] ([MaDonHang], [MaSP], [SoLuongMua]) VALUES (165, 26, 1)
INSERT [dbo].[CHITIETDONHANG] ([MaDonHang], [MaSP], [SoLuongMua]) VALUES (166, 23, 1)
INSERT [dbo].[CHITIETDONHANG] ([MaDonHang], [MaSP], [SoLuongMua]) VALUES (166, 26, 1)
INSERT [dbo].[CHITIETDONHANG] ([MaDonHang], [MaSP], [SoLuongMua]) VALUES (167, 23, 1)
INSERT [dbo].[CHITIETDONHANG] ([MaDonHang], [MaSP], [SoLuongMua]) VALUES (168, 23, 1)
INSERT [dbo].[CHITIETDONHANG] ([MaDonHang], [MaSP], [SoLuongMua]) VALUES (169, 26, 1)
INSERT [dbo].[CHITIETDONHANG] ([MaDonHang], [MaSP], [SoLuongMua]) VALUES (170, 23, 6)
INSERT [dbo].[CHITIETDONHANG] ([MaDonHang], [MaSP], [SoLuongMua]) VALUES (171, 23, 1)
INSERT [dbo].[CHITIETDONHANG] ([MaDonHang], [MaSP], [SoLuongMua]) VALUES (172, 26, 1)
INSERT [dbo].[CHITIETDONHANG] ([MaDonHang], [MaSP], [SoLuongMua]) VALUES (183, 23, 1)
INSERT [dbo].[CHITIETDONHANG] ([MaDonHang], [MaSP], [SoLuongMua]) VALUES (183, 26, 10)
INSERT [dbo].[CHITIETDONHANG] ([MaDonHang], [MaSP], [SoLuongMua]) VALUES (183, 27, 2)
INSERT [dbo].[CHITIETDONHANG] ([MaDonHang], [MaSP], [SoLuongMua]) VALUES (184, 15, 1)
INSERT [dbo].[CHITIETDONHANG] ([MaDonHang], [MaSP], [SoLuongMua]) VALUES (185, 10, 1)
INSERT [dbo].[CHITIETDONHANG] ([MaDonHang], [MaSP], [SoLuongMua]) VALUES (185, 23, 1)
INSERT [dbo].[CHITIETDONHANG] ([MaDonHang], [MaSP], [SoLuongMua]) VALUES (185, 26, 1)
INSERT [dbo].[CHITIETDONHANG] ([MaDonHang], [MaSP], [SoLuongMua]) VALUES (186, 23, 1)
INSERT [dbo].[CHITIETDONHANG] ([MaDonHang], [MaSP], [SoLuongMua]) VALUES (186, 26, 1)
INSERT [dbo].[CHITIETDONHANG] ([MaDonHang], [MaSP], [SoLuongMua]) VALUES (187, 15, 1)
INSERT [dbo].[CHITIETDONHANG] ([MaDonHang], [MaSP], [SoLuongMua]) VALUES (187, 16, 1)
INSERT [dbo].[CHITIETDONHANG] ([MaDonHang], [MaSP], [SoLuongMua]) VALUES (187, 17, 1)
INSERT [dbo].[CHITIETDONHANG] ([MaDonHang], [MaSP], [SoLuongMua]) VALUES (191, 23, 1)
INSERT [dbo].[CHITIETDONHANG] ([MaDonHang], [MaSP], [SoLuongMua]) VALUES (192, 23, 1)
INSERT [dbo].[CHITIETDONHANG] ([MaDonHang], [MaSP], [SoLuongMua]) VALUES (193, 23, 1)
INSERT [dbo].[CHITIETDONHANG] ([MaDonHang], [MaSP], [SoLuongMua]) VALUES (193, 26, 1)
INSERT [dbo].[CHITIETDONHANG] ([MaDonHang], [MaSP], [SoLuongMua]) VALUES (194, 27, 1)
INSERT [dbo].[CHITIETDONHANG] ([MaDonHang], [MaSP], [SoLuongMua]) VALUES (195, 24, 1)
INSERT [dbo].[CHITIETDONHANG] ([MaDonHang], [MaSP], [SoLuongMua]) VALUES (196, 23, 1)
INSERT [dbo].[CHITIETDONHANG] ([MaDonHang], [MaSP], [SoLuongMua]) VALUES (196, 26, 1)
INSERT [dbo].[CHITIETDONHANG] ([MaDonHang], [MaSP], [SoLuongMua]) VALUES (199, 23, 1)
INSERT [dbo].[CHITIETDONHANG] ([MaDonHang], [MaSP], [SoLuongMua]) VALUES (199, 26, 1)
INSERT [dbo].[CHITIETDONHANG] ([MaDonHang], [MaSP], [SoLuongMua]) VALUES (199, 27, 1)
INSERT [dbo].[CHITIETDONHANG] ([MaDonHang], [MaSP], [SoLuongMua]) VALUES (200, 47, 1)
GO
SET IDENTITY_INSERT [dbo].[ChucNang] ON 

INSERT [dbo].[ChucNang] ([MaChucNang], [TenChucNang]) VALUES (1, N'QuanLyTaiKhoan')
INSERT [dbo].[ChucNang] ([MaChucNang], [TenChucNang]) VALUES (2, N'QuanLySanPham')
INSERT [dbo].[ChucNang] ([MaChucNang], [TenChucNang]) VALUES (3, N'QuanLyHang')
INSERT [dbo].[ChucNang] ([MaChucNang], [TenChucNang]) VALUES (4, N'QuanLyDanhMuc')
INSERT [dbo].[ChucNang] ([MaChucNang], [TenChucNang]) VALUES (5, N'QuanLyDonHang')
INSERT [dbo].[ChucNang] ([MaChucNang], [TenChucNang]) VALUES (6, N'ThongKe')
INSERT [dbo].[ChucNang] ([MaChucNang], [TenChucNang]) VALUES (7, N'Access')
INSERT [dbo].[ChucNang] ([MaChucNang], [TenChucNang]) VALUES (12, N'QuanLyChucVu')
SET IDENTITY_INSERT [dbo].[ChucNang] OFF
GO
INSERT [dbo].[ChucVu] ([MaCV], [Ten]) VALUES (1, N'Admin')
INSERT [dbo].[ChucVu] ([MaCV], [Ten]) VALUES (2, N'Nhân viên')
INSERT [dbo].[ChucVu] ([MaCV], [Ten]) VALUES (3, N'Khách hàng')
INSERT [dbo].[ChucVu] ([MaCV], [Ten]) VALUES (4, N'Trưởng phòng')
GO
SET IDENTITY_INSERT [dbo].[ChucVu2] ON 

INSERT [dbo].[ChucVu2] ([MaChucVu], [TenChucVu]) VALUES (1, N'Admin1')
INSERT [dbo].[ChucVu2] ([MaChucVu], [TenChucVu]) VALUES (2, N'Manager')
INSERT [dbo].[ChucVu2] ([MaChucVu], [TenChucVu]) VALUES (3, N'User')
INSERT [dbo].[ChucVu2] ([MaChucVu], [TenChucVu]) VALUES (5, N'Leader')
INSERT [dbo].[ChucVu2] ([MaChucVu], [TenChucVu]) VALUES (11, N'Phó phòng')
SET IDENTITY_INSERT [dbo].[ChucVu2] OFF
GO
INSERT [dbo].[CV_Q_A] ([MaA], [MaCV], [MaQ], [Ten]) VALUES (1, 2, 1, NULL)
INSERT [dbo].[CV_Q_A] ([MaA], [MaCV], [MaQ], [Ten]) VALUES (1, 3, 1, NULL)
INSERT [dbo].[CV_Q_A] ([MaA], [MaCV], [MaQ], [Ten]) VALUES (1, 3, 2, NULL)
INSERT [dbo].[CV_Q_A] ([MaA], [MaCV], [MaQ], [Ten]) VALUES (1, 3, 3, NULL)
INSERT [dbo].[CV_Q_A] ([MaA], [MaCV], [MaQ], [Ten]) VALUES (1, 3, 4, NULL)
INSERT [dbo].[CV_Q_A] ([MaA], [MaCV], [MaQ], [Ten]) VALUES (1, 3, 5, NULL)
INSERT [dbo].[CV_Q_A] ([MaA], [MaCV], [MaQ], [Ten]) VALUES (1, 3, 6, NULL)
INSERT [dbo].[CV_Q_A] ([MaA], [MaCV], [MaQ], [Ten]) VALUES (1, 4, 1, NULL)
INSERT [dbo].[CV_Q_A] ([MaA], [MaCV], [MaQ], [Ten]) VALUES (1, 4, 2, NULL)
INSERT [dbo].[CV_Q_A] ([MaA], [MaCV], [MaQ], [Ten]) VALUES (1, 4, 3, NULL)
INSERT [dbo].[CV_Q_A] ([MaA], [MaCV], [MaQ], [Ten]) VALUES (1, 4, 4, NULL)
INSERT [dbo].[CV_Q_A] ([MaA], [MaCV], [MaQ], [Ten]) VALUES (1, 4, 5, NULL)
INSERT [dbo].[CV_Q_A] ([MaA], [MaCV], [MaQ], [Ten]) VALUES (1, 4, 6, NULL)
INSERT [dbo].[CV_Q_A] ([MaA], [MaCV], [MaQ], [Ten]) VALUES (1, 4, 7, NULL)
INSERT [dbo].[CV_Q_A] ([MaA], [MaCV], [MaQ], [Ten]) VALUES (2, 2, 2, NULL)
INSERT [dbo].[CV_Q_A] ([MaA], [MaCV], [MaQ], [Ten]) VALUES (2, 2, 6, NULL)
INSERT [dbo].[CV_Q_A] ([MaA], [MaCV], [MaQ], [Ten]) VALUES (3, 1, 1, NULL)
INSERT [dbo].[CV_Q_A] ([MaA], [MaCV], [MaQ], [Ten]) VALUES (3, 1, 2, NULL)
INSERT [dbo].[CV_Q_A] ([MaA], [MaCV], [MaQ], [Ten]) VALUES (3, 1, 3, NULL)
INSERT [dbo].[CV_Q_A] ([MaA], [MaCV], [MaQ], [Ten]) VALUES (3, 1, 4, NULL)
INSERT [dbo].[CV_Q_A] ([MaA], [MaCV], [MaQ], [Ten]) VALUES (3, 1, 5, NULL)
INSERT [dbo].[CV_Q_A] ([MaA], [MaCV], [MaQ], [Ten]) VALUES (3, 1, 6, NULL)
INSERT [dbo].[CV_Q_A] ([MaA], [MaCV], [MaQ], [Ten]) VALUES (3, 1, 7, NULL)
INSERT [dbo].[CV_Q_A] ([MaA], [MaCV], [MaQ], [Ten]) VALUES (3, 2, 3, NULL)
INSERT [dbo].[CV_Q_A] ([MaA], [MaCV], [MaQ], [Ten]) VALUES (3, 2, 4, NULL)
INSERT [dbo].[CV_Q_A] ([MaA], [MaCV], [MaQ], [Ten]) VALUES (3, 2, 5, NULL)
INSERT [dbo].[CV_Q_A] ([MaA], [MaCV], [MaQ], [Ten]) VALUES (3, 2, 7, NULL)
INSERT [dbo].[CV_Q_A] ([MaA], [MaCV], [MaQ], [Ten]) VALUES (3, 3, 7, NULL)
GO
SET IDENTITY_INSERT [dbo].[DANHMUCSANPHAM] ON 

INSERT [dbo].[DANHMUCSANPHAM] ([MaDanhMuc], [TenDanhMuc]) VALUES (1, N'Máy giặt')
INSERT [dbo].[DANHMUCSANPHAM] ([MaDanhMuc], [TenDanhMuc]) VALUES (2, N'Điều hòa')
INSERT [dbo].[DANHMUCSANPHAM] ([MaDanhMuc], [TenDanhMuc]) VALUES (3, N'Tủ lạnh')
INSERT [dbo].[DANHMUCSANPHAM] ([MaDanhMuc], [TenDanhMuc]) VALUES (6, N'Nồi cơm điện')
INSERT [dbo].[DANHMUCSANPHAM] ([MaDanhMuc], [TenDanhMuc]) VALUES (7, N'Ti vi')
INSERT [dbo].[DANHMUCSANPHAM] ([MaDanhMuc], [TenDanhMuc]) VALUES (8, N'Quạt điện')
INSERT [dbo].[DANHMUCSANPHAM] ([MaDanhMuc], [TenDanhMuc]) VALUES (9, N'Máy lọc nước')
SET IDENTITY_INSERT [dbo].[DANHMUCSANPHAM] OFF
GO
SET IDENTITY_INSERT [dbo].[DONHANG] ON 

INSERT [dbo].[DONHANG] ([MaDonHang], [MaTaiKhoan], [TongTien], [TinhTrang], [NgayLap]) VALUES (160, 14, 860000, 3, CAST(N'2023-11-23' AS Date))
INSERT [dbo].[DONHANG] ([MaDonHang], [MaTaiKhoan], [TongTien], [TinhTrang], [NgayLap]) VALUES (162, 23, 11490000, 3, CAST(N'2023-12-18' AS Date))
INSERT [dbo].[DONHANG] ([MaDonHang], [MaTaiKhoan], [TongTien], [TinhTrang], [NgayLap]) VALUES (163, 14, 1000000, 2, CAST(N'2023-12-18' AS Date))
INSERT [dbo].[DONHANG] ([MaDonHang], [MaTaiKhoan], [TongTien], [TinhTrang], [NgayLap]) VALUES (164, 14, 32980000, 2, CAST(N'2023-12-18' AS Date))
INSERT [dbo].[DONHANG] ([MaDonHang], [MaTaiKhoan], [TongTien], [TinhTrang], [NgayLap]) VALUES (165, 23, 5338000, 4, CAST(N'2024-10-31' AS Date))
INSERT [dbo].[DONHANG] ([MaDonHang], [MaTaiKhoan], [TongTien], [TinhTrang], [NgayLap]) VALUES (166, 23, 1792000, 4, CAST(N'2024-10-31' AS Date))
INSERT [dbo].[DONHANG] ([MaDonHang], [MaTaiKhoan], [TongTien], [TinhTrang], [NgayLap]) VALUES (167, 23, 860000, 4, CAST(N'2024-10-31' AS Date))
INSERT [dbo].[DONHANG] ([MaDonHang], [MaTaiKhoan], [TongTien], [TinhTrang], [NgayLap]) VALUES (168, 23, 1860000, 1, CAST(N'2024-10-31' AS Date))
INSERT [dbo].[DONHANG] ([MaDonHang], [MaTaiKhoan], [TongTien], [TinhTrang], [NgayLap]) VALUES (169, 23, 1932000, 4, CAST(N'2024-10-31' AS Date))
INSERT [dbo].[DONHANG] ([MaDonHang], [MaTaiKhoan], [TongTien], [TinhTrang], [NgayLap]) VALUES (170, 23, 5160000, 3, CAST(N'2024-11-06' AS Date))
INSERT [dbo].[DONHANG] ([MaDonHang], [MaTaiKhoan], [TongTien], [TinhTrang], [NgayLap]) VALUES (171, 23, 860000, 2, CAST(N'2024-11-07' AS Date))
INSERT [dbo].[DONHANG] ([MaDonHang], [MaTaiKhoan], [TongTien], [TinhTrang], [NgayLap]) VALUES (172, 25, 932000, 3, CAST(N'2024-11-08' AS Date))
INSERT [dbo].[DONHANG] ([MaDonHang], [MaTaiKhoan], [TongTien], [TinhTrang], [NgayLap]) VALUES (183, 23, 12700000, 1, CAST(N'2024-11-21' AS Date))
INSERT [dbo].[DONHANG] ([MaDonHang], [MaTaiKhoan], [TongTien], [TinhTrang], [NgayLap]) VALUES (184, 23, 7990000, 1, CAST(N'2024-11-26' AS Date))
INSERT [dbo].[DONHANG] ([MaDonHang], [MaTaiKhoan], [TongTien], [TinhTrang], [NgayLap]) VALUES (185, 23, 4782000, 3, CAST(N'2024-11-27' AS Date))
INSERT [dbo].[DONHANG] ([MaDonHang], [MaTaiKhoan], [TongTien], [TinhTrang], [NgayLap]) VALUES (186, 25, 1792000, 4, CAST(N'2024-12-13' AS Date))
INSERT [dbo].[DONHANG] ([MaDonHang], [MaTaiKhoan], [TongTien], [TinhTrang], [NgayLap]) VALUES (187, 25, 27710000, 3, CAST(N'2024-12-13' AS Date))
INSERT [dbo].[DONHANG] ([MaDonHang], [MaTaiKhoan], [TongTien], [TinhTrang], [NgayLap]) VALUES (188, 25, 860000, 1, CAST(N'2024-12-13' AS Date))
INSERT [dbo].[DONHANG] ([MaDonHang], [MaTaiKhoan], [TongTien], [TinhTrang], [NgayLap]) VALUES (189, 25, 860000, 1, CAST(N'2024-12-13' AS Date))
INSERT [dbo].[DONHANG] ([MaDonHang], [MaTaiKhoan], [TongTien], [TinhTrang], [NgayLap]) VALUES (190, 25, 860000, 1, CAST(N'2024-12-13' AS Date))
INSERT [dbo].[DONHANG] ([MaDonHang], [MaTaiKhoan], [TongTien], [TinhTrang], [NgayLap]) VALUES (191, 25, 860000, 4, CAST(N'2024-12-13' AS Date))
INSERT [dbo].[DONHANG] ([MaDonHang], [MaTaiKhoan], [TongTien], [TinhTrang], [NgayLap]) VALUES (192, 25, 860000, 2, CAST(N'2024-12-13' AS Date))
INSERT [dbo].[DONHANG] ([MaDonHang], [MaTaiKhoan], [TongTien], [TinhTrang], [NgayLap]) VALUES (193, 26, 1792000, 3, CAST(N'2025-01-09' AS Date))
INSERT [dbo].[DONHANG] ([MaDonHang], [MaTaiKhoan], [TongTien], [TinhTrang], [NgayLap]) VALUES (194, 26, 1260000, 2, CAST(N'2025-01-09' AS Date))
INSERT [dbo].[DONHANG] ([MaDonHang], [MaTaiKhoan], [TongTien], [TinhTrang], [NgayLap]) VALUES (195, 26, 2626000, 1, CAST(N'2025-01-09' AS Date))
INSERT [dbo].[DONHANG] ([MaDonHang], [MaTaiKhoan], [TongTien], [TinhTrang], [NgayLap]) VALUES (196, 26, 1792000, 1, CAST(N'2025-01-09' AS Date))
INSERT [dbo].[DONHANG] ([MaDonHang], [MaTaiKhoan], [TongTien], [TinhTrang], [NgayLap]) VALUES (199, 25, 3052000, 1, CAST(N'2025-01-10' AS Date))
INSERT [dbo].[DONHANG] ([MaDonHang], [MaTaiKhoan], [TongTien], [TinhTrang], [NgayLap]) VALUES (200, 23, 5000000, 3, CAST(N'2025-03-05' AS Date))
SET IDENTITY_INSERT [dbo].[DONHANG] OFF
GO
SET IDENTITY_INSERT [dbo].[DonVi] ON 

INSERT [dbo].[DonVi] ([MaDonVi], [TenDonVi], [MaDonViCha]) VALUES (1, N'Shop', NULL)
SET IDENTITY_INSERT [dbo].[DonVi] OFF
GO
SET IDENTITY_INSERT [dbo].[HANGSANXUAT] ON 

INSERT [dbo].[HANGSANXUAT] ([MaHang], [TenHang]) VALUES (1, N'Samsung')
INSERT [dbo].[HANGSANXUAT] ([MaHang], [TenHang]) VALUES (2, N'Sony')
INSERT [dbo].[HANGSANXUAT] ([MaHang], [TenHang]) VALUES (3, N'Pananonic')
INSERT [dbo].[HANGSANXUAT] ([MaHang], [TenHang]) VALUES (4, N'LG')
INSERT [dbo].[HANGSANXUAT] ([MaHang], [TenHang]) VALUES (5, N'Aqua')
INSERT [dbo].[HANGSANXUAT] ([MaHang], [TenHang]) VALUES (6, N'Kangaroo')
INSERT [dbo].[HANGSANXUAT] ([MaHang], [TenHang]) VALUES (7, N'Philips')
INSERT [dbo].[HANGSANXUAT] ([MaHang], [TenHang]) VALUES (8, N'MSI')
INSERT [dbo].[HANGSANXUAT] ([MaHang], [TenHang]) VALUES (9, N'Tosiba')
INSERT [dbo].[HANGSANXUAT] ([MaHang], [TenHang]) VALUES (10, N'Sunhouse')
INSERT [dbo].[HANGSANXUAT] ([MaHang], [TenHang]) VALUES (11, N'Goldsun')
SET IDENTITY_INSERT [dbo].[HANGSANXUAT] OFF
GO
SET IDENTITY_INSERT [dbo].[HanhDong] ON 

INSERT [dbo].[HanhDong] ([MaHanhDong], [TenHanhDong]) VALUES (1, N'Xem')
INSERT [dbo].[HanhDong] ([MaHanhDong], [TenHanhDong]) VALUES (2, N'Them')
INSERT [dbo].[HanhDong] ([MaHanhDong], [TenHanhDong]) VALUES (3, N'Sua')
INSERT [dbo].[HanhDong] ([MaHanhDong], [TenHanhDong]) VALUES (4, N'Xoa')
SET IDENTITY_INSERT [dbo].[HanhDong] OFF
GO
SET IDENTITY_INSERT [dbo].[Message] ON 

INSERT [dbo].[Message] ([Id], [SenderId], [ReceiverId], [Content], [IsRead], [CreatedAt]) VALUES (73, 30, 23, N'Chào Admin', NULL, NULL)
INSERT [dbo].[Message] ([Id], [SenderId], [ReceiverId], [Content], [IsRead], [CreatedAt]) VALUES (74, 23, 30, N'Chào bạn', NULL, NULL)
INSERT [dbo].[Message] ([Id], [SenderId], [ReceiverId], [Content], [IsRead], [CreatedAt]) VALUES (75, 30, 23, N'Ad cho em hỏi sản phẩm quạt mình còn hàng không ạ?', NULL, NULL)
INSERT [dbo].[Message] ([Id], [SenderId], [ReceiverId], [Content], [IsRead], [CreatedAt]) VALUES (76, 23, 30, N'Còn bạn nhé', NULL, NULL)
INSERT [dbo].[Message] ([Id], [SenderId], [ReceiverId], [Content], [IsRead], [CreatedAt]) VALUES (77, 30, 23, N'Vậy cho mình đặt ạ', NULL, NULL)
INSERT [dbo].[Message] ([Id], [SenderId], [ReceiverId], [Content], [IsRead], [CreatedAt]) VALUES (78, 25, 23, N'alo', NULL, NULL)
INSERT [dbo].[Message] ([Id], [SenderId], [ReceiverId], [Content], [IsRead], [CreatedAt]) VALUES (79, 23, 25, N'Sao bạn', NULL, NULL)
INSERT [dbo].[Message] ([Id], [SenderId], [ReceiverId], [Content], [IsRead], [CreatedAt]) VALUES (80, 25, 23, N'Admin cho em hỏi', NULL, NULL)
INSERT [dbo].[Message] ([Id], [SenderId], [ReceiverId], [Content], [IsRead], [CreatedAt]) VALUES (81, 23, 25, N'Sao ạ', NULL, NULL)
INSERT [dbo].[Message] ([Id], [SenderId], [ReceiverId], [Content], [IsRead], [CreatedAt]) VALUES (82, 25, 23, N'Không', NULL, NULL)
INSERT [dbo].[Message] ([Id], [SenderId], [ReceiverId], [Content], [IsRead], [CreatedAt]) VALUES (83, 23, 23, N'hhh', NULL, NULL)
SET IDENTITY_INSERT [dbo].[Message] OFF
GO
SET IDENTITY_INSERT [dbo].[PhanQuyen] ON 

INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5912, 2, 3, 1, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5913, 2, 3, 4, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5914, 2, 3, 3, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5915, 11, 2, 1, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5916, 11, 2, 2, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5917, 11, 2, 3, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5918, 11, 3, 1, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5919, 11, 3, 4, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5920, 11, 5, 1, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5921, 11, 5, 2, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5922, 11, 5, 3, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5923, 11, 5, 4, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5924, 3, 1, 1, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5925, 3, 1, 4, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5926, 3, 2, 1, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5927, 3, 2, 2, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5928, 3, 2, 4, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5929, 3, 3, 1, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5930, 3, 3, 2, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5931, 3, 3, 4, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5932, 3, 4, 1, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5933, 3, 4, 3, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5934, 3, 6, 1, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5935, 3, 6, 3, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5936, 3, 7, 1, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5937, 3, 7, 2, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5938, 3, 7, 3, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5939, 3, 7, 4, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5940, 3, 12, 1, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5941, 3, 12, 4, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5942, 3, 5, 1, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5943, 3, 5, 3, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5944, 3, 5, 2, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5945, 3, 5, 4, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5946, 1, 1, 1, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5947, 1, 1, 2, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5948, 1, 1, 3, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5949, 1, 1, 4, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5950, 1, 2, 1, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5951, 1, 2, 2, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5952, 1, 2, 3, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5953, 1, 2, 4, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5954, 1, 3, 1, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5955, 1, 3, 2, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5956, 1, 3, 3, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5957, 1, 3, 4, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5958, 1, 4, 1, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5959, 1, 4, 2, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5960, 1, 4, 3, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5961, 1, 4, 4, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5962, 1, 5, 1, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5963, 1, 5, 2, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5964, 1, 5, 3, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5965, 1, 5, 4, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5966, 1, 6, 1, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5967, 1, 6, 2, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5968, 1, 6, 3, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5969, 1, 7, 1, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5970, 1, 7, 2, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5971, 1, 7, 3, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5972, 1, 12, 1, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5973, 1, 12, 2, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5974, 1, 12, 3, 1)
INSERT [dbo].[PhanQuyen] ([MaPhanQuyen], [MaChucVu], [MaChucNang], [MaHanhDong], [MaDonVi]) VALUES (5975, 1, 12, 4, 1)
SET IDENTITY_INSERT [dbo].[PhanQuyen] OFF
GO
INSERT [dbo].[Quyen] ([MaQ], [ActionName], [Ten], [ControllerName]) VALUES (1, N'QuanLyTK', N'Quản lý tài khoản ', N'Admin')
INSERT [dbo].[Quyen] ([MaQ], [ActionName], [Ten], [ControllerName]) VALUES (2, N'QuanLySP', N'Quản lý sản phẩm', N'Admin')
INSERT [dbo].[Quyen] ([MaQ], [ActionName], [Ten], [ControllerName]) VALUES (3, N'QuanLyHang', N'Quản lý hãng', N'Admin')
INSERT [dbo].[Quyen] ([MaQ], [ActionName], [Ten], [ControllerName]) VALUES (4, N'QuanLyDM', N'Quản lý danh mục', N'Admin')
INSERT [dbo].[Quyen] ([MaQ], [ActionName], [Ten], [ControllerName]) VALUES (5, N'QuanLyDH', N'Quản lý đơn hàng', N'Admin')
INSERT [dbo].[Quyen] ([MaQ], [ActionName], [Ten], [ControllerName]) VALUES (6, N'QuanLyQH', N'Quản lý quyền hạn', N'Admin')
INSERT [dbo].[Quyen] ([MaQ], [ActionName], [Ten], [ControllerName]) VALUES (7, N'Index', N'Người dùng', N'Home')
GO
SET IDENTITY_INSERT [dbo].[Roles] ON 

INSERT [dbo].[Roles] ([RoleId], [RoleName]) VALUES (1, N'admin')
INSERT [dbo].[Roles] ([RoleId], [RoleName]) VALUES (3, N'manager')
INSERT [dbo].[Roles] ([RoleId], [RoleName]) VALUES (2, N'user')
SET IDENTITY_INSERT [dbo].[Roles] OFF
GO
SET IDENTITY_INSERT [dbo].[SANPHAM] ON 

INSERT [dbo].[SANPHAM] ([MaSP], [TenSP], [MoTa], [Anh1], [Anh2], [Anh3], [Anh4], [Anh5], [Anh6], [SoLuongDaBan], [SoLuongTrongKho], [GiaTien], [MaHang], [MaDanhMuc]) VALUES (5, N'Smart Tivi NanoCell LG 4K 55 inch 55NANO75TPA ', N'Smart Tivi NanoCell LG 4K 55 inch 55NANO75TPA với thiết kế tinh tế, sang trọng phù hợp với mọi không gian. Bên cạnh đó, tivi trang bị các công nghệ xử lý hình ảnh, âm thanh như 4K AI Upscaling, Image Enhancing, AI Sound,... Đây là chiếc tivi đáng cân nhắc đối với những ai có nhu cầu tìm mua tivi.', N'Anh2.1.jpg', N'Anh2.2.jpg', N'Anh2.3.jpg', N'Anh2.4.jpg', N'Anh2.5.jpg', N'Anh2.6.jpg', 20, 32, 14010000, 4, 7)
INSERT [dbo].[SANPHAM] ([MaSP], [TenSP], [MoTa], [Anh1], [Anh2], [Anh3], [Anh4], [Anh5], [Anh6], [SoLuongDaBan], [SoLuongTrongKho], [GiaTien], [MaHang], [MaDanhMuc]) VALUES (6, N'Google Tivi Sony 4K 55 inch KD-55X75K', N'Google Tivi Sony 4K 55 inch KD-55X75K sở hữu diện mạo thanh lịch, xem tivi thỏa mãn với hình ảnh đẹp mắt nhờ bộ xử lý X1 4K HDR, hệ điều hành tiên tiến, điều khiển bằng giọng nói tiếng Việt thân thiện và nhiều tính năng tiện ích mà khi khám phá bạn sẽ rất hài lòng với những gì mẫu tivi này đem lại đấy.', N'Anh3.1.jpg', N'Anh3.2.jpg', N'Anh3.3.jpg', N'Anh3.4.jpg', N'Anh3.5.jpg', N'Anh3.6.jpg', 10, 2000, 13900000, 2, 7)
INSERT [dbo].[SANPHAM] ([MaSP], [TenSP], [MoTa], [Anh1], [Anh2], [Anh3], [Anh4], [Anh5], [Anh6], [SoLuongDaBan], [SoLuongTrongKho], [GiaTien], [MaHang], [MaDanhMuc]) VALUES (7, N'Smart Tivi QLED 4K 43 inch Samsung QA43Q65A', N'Smart Tivi QLED 4K 43 inch Samsung QA43Q65A sở hữu diện mạo thanh lịch, xem tivi thỏa mãn với hình ảnh đẹp mắt nhờ bộ xử lý X1 4K HDR, hệ điều hành tiên tiến, điều khiển bằng giọng nói tiếng Việt thân thiện và nhiều tính năng tiện ích mà khi khám phá bạn sẽ rất hài lòng với những gì mẫu tivi này đem lại đấy.', N'Anh4.1.jpg', N'Anh4.2.jpg', N'Anh4.3.jpg', N'Anh4.4.jpg', N'Anh4.5.jpg', N'Anh4.6.jpg', 11, 34, 12800000, 1, 7)
INSERT [dbo].[SANPHAM] ([MaSP], [TenSP], [MoTa], [Anh1], [Anh2], [Anh3], [Anh4], [Anh5], [Anh6], [SoLuongDaBan], [SoLuongTrongKho], [GiaTien], [MaHang], [MaDanhMuc]) VALUES (8, N'Google Tivi Sony 4K 55 inch KD-55X80K', N'Google Tivi Sony 4K 55 inch KD-55X80K đáp ứng đa dạng các nhu cầu giải trí cho người dùng nhờ sở hữu màn hình lớn 55 inch với chất lượng hình ảnh được nâng cấp lên chuẩn 4K nhờ công nghệ hình ảnh 4K X-Reality PRO mang lại trải nghiệm xem hoàn hảo với hình ảnh chi tiết, sắc nét, màu sắc chân thực, chuyển cảnh mượt mà,... Âm thanh vòm 3D sống động mang lại trải nghiệm như trong rạp chiếu.', N'Anh5.1.jpg', N'Anh5.2.jpg', N'Anh5.3.jpg', N'Anh5.4.jpg', N'Anh5.5.jpg', N'Anh5.6.jpg', 10, 18, 16000000, 2, 7)
INSERT [dbo].[SANPHAM] ([MaSP], [TenSP], [MoTa], [Anh1], [Anh2], [Anh3], [Anh4], [Anh5], [Anh6], [SoLuongDaBan], [SoLuongTrongKho], [GiaTien], [MaHang], [MaDanhMuc]) VALUES (9, N'Tủ lạnh Aqua Inverter 320 lít AQR-B399MA(WHB)', N'tủ lạnh Aqua AQR-B399MA(WHB) với một thiết kế sang trọng và cao cấp, còn trang bị các công nghệ hiện đại như ngăn Magic room, Twin Inverter, lấy nước ngoài,... chắc chắn sẽ là một thiết bị gia dụng hỗ trợ bạn tốt nhất chăm sóc cho gia đình.', N'Anh6.1.jpg', N'Anh6.2.jpg', N'Anh6.3.jpg', N'Anh6.4.jpg', N'Anh6.5.jpg', N'Anh6.6.jpg', 16, 14, 9969000, 5, 3)
INSERT [dbo].[SANPHAM] ([MaSP], [TenSP], [MoTa], [Anh1], [Anh2], [Anh3], [Anh4], [Anh5], [Anh6], [SoLuongDaBan], [SoLuongTrongKho], [GiaTien], [MaHang], [MaDanhMuc]) VALUES (10, N'Tủ lạnh Aqua 90 lít AQR-D99FA(BS)', N'Tủ lạnh Aqua 90 lít AQR-D99FA(BS) thuộc dòng tủ lạnh mini có thiết kế nhỏ gọn, phù hợp với những không gian vừa và nhỏ. Với kiểu dáng nhỏ gọn, chiếc tủ lạnh mini 90 lít này sẽ là sự lựa chọn lý tưởng cho những gia đình nhỏ 1- 2 người hay các bạn sinh viên', N'Anh7.1.jpg', N'Anh7.2.jpg', N'Anh7.3.jpg', N'Anh7.4.jpg', N'Anh7.5.jpg', N'Anh7.6.jpg', 9, 13, 2990000, 5, 3)
INSERT [dbo].[SANPHAM] ([MaSP], [TenSP], [MoTa], [Anh1], [Anh2], [Anh3], [Anh4], [Anh5], [Anh6], [SoLuongDaBan], [SoLuongTrongKho], [GiaTien], [MaHang], [MaDanhMuc]) VALUES (11, N'Tủ lạnh LG Inverter 394 lít GN-D392BLA', N'Dòng tủ lạnh LG 394 lít GN-D392BLA này với những công nghệ hiện đại nổi bật như Door Cooling+, Hygiene Fresh+... cùng với tiện ích lấy nước ngoài tiện lợi kết hợp với gam màu tối ấn tượng, độc đáo. Do đó, sản phẩm sẽ là một sự lựa chọn đáng quan tâm cho gia đình từ 3 - 4 người khi bạn có nhu cầu mua tủ lạnh mới.', N'Anh8.1.jpg', N'Anh8.2.jpg', N'Anh8.3.jpg', N'Anh8.4.jpg', N'Anh8.5.jpg', N'Anh8.6.jpg', 14, 28, 15990000, 4, 3)
INSERT [dbo].[SANPHAM] ([MaSP], [TenSP], [MoTa], [Anh1], [Anh2], [Anh3], [Anh4], [Anh5], [Anh6], [SoLuongDaBan], [SoLuongTrongKho], [GiaTien], [MaHang], [MaDanhMuc]) VALUES (12, N'Tủ lạnh Samsung Inverter 299 lít RT29K5532BY/SV', N'chiếc tủ lạnh này là một lựa chọn đáng để bạn cân nhắc với những ưu điểm vượt trội như 2 dàn lạnh riêng biệt, Digital Inverter tiết kiệm điện, tấm giữ nhiệt Coolpack duy trì độ lạnh khi mất điện,... Một chiếc tủ lạnh khá hoàn hảo cho không gian bếp của các gia đình.', N'Anh9.1.jpg', N'Anh9.2.jpg', N'Anh9.3.jpg', N'Anh9.4.jpg', N'Anh9.5.jpg', N'Anh9.6.jpg', 9, 20, 7990000, 1, 3)
INSERT [dbo].[SANPHAM] ([MaSP], [TenSP], [MoTa], [Anh1], [Anh2], [Anh3], [Anh4], [Anh5], [Anh6], [SoLuongDaBan], [SoLuongTrongKho], [GiaTien], [MaHang], [MaDanhMuc]) VALUES (13, N'Tủ lạnh Panasonic Inverter 188 lít NR-BA229PKVN', N'Panasonic Inverter 188 lít NR-BA229PKVN là chiếc tủ lạnh phù hợp cho những hộ gia đình nhỏ và yêu thích kiểu tủ ngăn đá trên truyền thống. Bên cạnh việc trang bị công nghệ kháng khuẩn, khử mùi tối ưu, chiếc tủ lạnh này còn mang lại khả năng siêu tiết kiệm điện cho người dùng.', N'Anh10.1.jpg', N'Anh10.2.jpg', N'Anh10.3.jpg', N'Anh10.4.jpg', N'Anh10.5.jpg', N'Anh10.6.jpg', 10, 30, 7990000, 3, 3)
INSERT [dbo].[SANPHAM] ([MaSP], [TenSP], [MoTa], [Anh1], [Anh2], [Anh3], [Anh4], [Anh5], [Anh6], [SoLuongDaBan], [SoLuongTrongKho], [GiaTien], [MaHang], [MaDanhMuc]) VALUES (14, N'Điều hòa Panasonic Inverter 1 HP CU/CS-PU9XKH-8M', N'Sản phẩm là một sự lựa chọn đáng cân nhắc cho những gia đình muốn sở hữu một chiếc máy lạnh Inverter có các chế độ làm lạnh hiện đại Powerful, Nanoe G… cũng như công nghệ tiết kiệm năng lượng hiệu quả Inverter, Eco…', N'Anh11.1.jpg', N'Anh11.2.jpg', N'Anh11.3.jpg', N'Anh11.4.jpg', N'Anh11.5.jpg', N'Anh11.6.jpg', 15, 40, 11300000, 3, 2)
INSERT [dbo].[SANPHAM] ([MaSP], [TenSP], [MoTa], [Anh1], [Anh2], [Anh3], [Anh4], [Anh5], [Anh6], [SoLuongDaBan], [SoLuongTrongKho], [GiaTien], [MaHang], [MaDanhMuc]) VALUES (15, N'Điều hòa Samsung Inverter 1 HP AR09TYHQASINSV', N'máy lạnh Samsung Inverter 1 HP AR09TYHQASINSV sẽ là sự lựa chọn phù hợp cho căn phòng dưới 15 m2 với những công nghệ hiện đại giúp việc làm lạnh được hiệu quả, tiết kiệm chi phí điện hằng tháng và giữ bầu không khí luôn trong lành với công nghệ Digital Inverter, bộ lọc HD, công nghệ DuraFin,... Đây chắc chắn là một sản phẩm đáng sở hữu cho gia đình trong thời gian tới.', N'Anh12.1.jpg', N'Anh12.2.jpg', N'Anh12.3.jpg', N'Anh12.4.jpg', N'Anh12.5.jpg', N'Anh12.6.jpg', 31, 18, 7990000, 1, 2)
INSERT [dbo].[SANPHAM] ([MaSP], [TenSP], [MoTa], [Anh1], [Anh2], [Anh3], [Anh4], [Anh5], [Anh6], [SoLuongDaBan], [SoLuongTrongKho], [GiaTien], [MaHang], [MaDanhMuc]) VALUES (16, N'Điều hòa LG Inverter 1.5 HP V13ENH1', N'Với nhiều tính năng tiện ích, nổi bật nhất là công nghệ Dual Inverter tiết kiệm năng lượng hiệu quả và làm lạnh nhanh hơn, máy lạnh LG V13ENH1 sẽ là một lựa chọn lý tưởng cho gia đình bạn.', N'Anh13.1.jpg', N'Anh13.2.jpg', N'Anh13.3.jpg', N'Anh13.4.jpg', N'Anh13.5.jpg', N'Anh13.6.jpg', 38, 16, 10730000, 4, 2)
INSERT [dbo].[SANPHAM] ([MaSP], [TenSP], [MoTa], [Anh1], [Anh2], [Anh3], [Anh4], [Anh5], [Anh6], [SoLuongDaBan], [SoLuongTrongKho], [GiaTien], [MaHang], [MaDanhMuc]) VALUES (17, N'Máy lạnh Aqua Inverter 1 HP AQA-KCRV10TR', N'Máy lạnh Aqua Inverter 1 HP AQA-KCRV10TR được hãng Aqua cho ra đời với công nghệ tiết kiệm điện PID Inverter, cùng cơ chế tự làm sạch Self-clean tăng hiệu quả làm sạch cũng như hỗ trợ gia tăng tuổi thọ cho máy.', N'Anh14.1.jpg', N'Anh14.2.jpg', N'Anh14.3.jpg', N'Anh14.4.jpg', N'Anh14.5.jpg', N'Anh14.6.jpg', 14, 38, 8990000, 5, 2)
INSERT [dbo].[SANPHAM] ([MaSP], [TenSP], [MoTa], [Anh1], [Anh2], [Anh3], [Anh4], [Anh5], [Anh6], [SoLuongDaBan], [SoLuongTrongKho], [GiaTien], [MaHang], [MaDanhMuc]) VALUES (18, N'Máy giặt Samsung Inverter 9 kg WW90T634DLN/SV', N'Máy giặt Samsung Inverter 9kg WW90T634DLN/SV thuộc kiểu máy giặt lồng ngang cửa trước với thiết kế gọn đẹp, tích hợp đa dạng chương trình giặt và nhiều công nghệ thông minh như AI Dispenser, bảng điều khiển thông minh AI Control, giặt hơi nước diệt khuẩn Hygiene Steam,… cùng động cơ Digital Inverter vận hành ổn định, tiết kiệm điện năng.', N'Anh15.1.jpg', N'Anh15.2.jpg', N'Anh15.3.jpg', N'Anh15.4.jpg', N'Anh15.5.jpg', N'Anh15.6.jpg', 31, 2, 11490000, 1, 1)
INSERT [dbo].[SANPHAM] ([MaSP], [TenSP], [MoTa], [Anh1], [Anh2], [Anh3], [Anh4], [Anh5], [Anh6], [SoLuongDaBan], [SoLuongTrongKho], [GiaTien], [MaHang], [MaDanhMuc]) VALUES (19, N'Máy giặt LG Inverter 10.5 kg FV1450S3W2', N'máy giặt LG Inverter 10.5 kg FV1450S3W2 phù hợp với gia đình trên 7 người, sở hữu nhiều công nghệ hiện đại như: giặt hơi nước diệt khuẩn, giặt nhanh,... tiết kiệm thời gian cho người sử dụng trong cuộc sống bận rộn hiện nay.', N'16.1.jpg', N'16.2.jpg', N'16.3.jpg', N'16.4.jpg', N'16.5.jpg', N'16.6.jpg', 21, 21, 12490000, 4, 1)
INSERT [dbo].[SANPHAM] ([MaSP], [TenSP], [MoTa], [Anh1], [Anh2], [Anh3], [Anh4], [Anh5], [Anh6], [SoLuongDaBan], [SoLuongTrongKho], [GiaTien], [MaHang], [MaDanhMuc]) VALUES (20, N'Máy giặt Panasonic Inverter 10.5 Kg NA-FD10AR1BV', N'Panasonic Inverter 10.5 Kg NA-FD10AR1BV là một trong những máy giặt lồng đứng phù hợp với những hộ gia đình có trên 7 thành viên. Ngoài việc sở hữu nhiều công nghệ giặt sạch tiên tiến, máy giặt Panasonic này còn mang lại hiệu quả tiết kiệm điện, nước bên cạnh yếu tố vận hành êm ái trong suốt thời gian sử dụng. ', N'17.1.jpg', N'17.2.jpg', N'17.3.jpg', N'17.4.jpg', N'17.5.jpg', N'17.6.jpg', 15, 26, 10590000, 3, 1)
INSERT [dbo].[SANPHAM] ([MaSP], [TenSP], [MoTa], [Anh1], [Anh2], [Anh3], [Anh4], [Anh5], [Anh6], [SoLuongDaBan], [SoLuongTrongKho], [GiaTien], [MaHang], [MaDanhMuc]) VALUES (21, N'Máy giặt Aqua Inverter 8 KG AQD-A800F W ', N'máy giặt Aqua Inverter 8 KG AQD-A800F W là lựa chọn phù hợp cho những gia đình từ 3 - 5 thành viên. Sản phẩm mang lại hiệu quả tiết kiệm điện kèm với khả năng loại bỏ các tác nhân gây dị ứng bám trên quần áo một cách tối ưu, rất phù hợp cho những gia đình có trẻ nhỏ hoặc người có làn da nhạy cảm. ', N'18.1.jpg', N'18.2.jpg', N'18.3.jpg', N'18.4.jpg', N'18.5.jpg', N'18.6.jpg', 10, 18, 6990000, 5, 1)
INSERT [dbo].[SANPHAM] ([MaSP], [TenSP], [MoTa], [Anh1], [Anh2], [Anh3], [Anh4], [Anh5], [Anh6], [SoLuongDaBan], [SoLuongTrongKho], [GiaTien], [MaHang], [MaDanhMuc]) VALUES (22, N'Máy giặt Aqua 8.8 KG AQW-FR88GT.BK', N'Máy giặt Aqua 8,8 KG AQW-FR88GT.BK trang bị nhiều công nghệ hiện đại: Kháng khuẩn ABT, nắp kính cường lực, giảm chấn, đóng mở nhẹ nhàng, lồng giặt, van mực nước thấp… Là một lựa chọn phù hợp cho cho nhu cầu giặt giũ của mọi gia đình.', N'19.1.jpg', N'19.2.jpg', N'19.3.jpg', N'19.4.jpg', N'19.5.jpg', N'19.6.jpg', 15, 22, 5990000, 5, 1)
INSERT [dbo].[SANPHAM] ([MaSP], [TenSP], [MoTa], [Anh1], [Anh2], [Anh3], [Anh4], [Anh5], [Anh6], [SoLuongDaBan], [SoLuongTrongKho], [GiaTien], [MaHang], [MaDanhMuc]) VALUES (23, N'Nồi cơm điện Kangaroo 1.2 lít KG822 đỏ', N'Nồi cơm nắp gài Kangaroo KG822 đỏ sản phẩm đẹp, nấu cơm ngon, dễ sử dụng, hỗ trợ tích cực cho công việc bà nội trợ.', N'20.1.jpg', N'20.2.jpg', N'20.3.jpg', N'20.4.jpg', N'20.5.jpg', N'20.6.jpg', 71, 2, 860000, 6, 6)
INSERT [dbo].[SANPHAM] ([MaSP], [TenSP], [MoTa], [Anh1], [Anh2], [Anh3], [Anh4], [Anh5], [Anh6], [SoLuongDaBan], [SoLuongTrongKho], [GiaTien], [MaHang], [MaDanhMuc]) VALUES (24, N'Nồi cơm điện cao tần Kangaroo 1.8 lít KG599N', N'Nồi cơm điện cao tần Kangaroo KG599N thiết kế đẹp, nhiều tính năng, nấu ăn ngon, hiệu quả, xứng đáng có mặt trong gia đình Việt', N'21.1.jpg', N'21.2.jpg', N'21.3.jpg', N'21.4.jpg', N'21.5.jpg', N'21.6.jpg', 14, 23, 2626000, 6, 6)
INSERT [dbo].[SANPHAM] ([MaSP], [TenSP], [MoTa], [Anh1], [Anh2], [Anh3], [Anh4], [Anh5], [Anh6], [SoLuongDaBan], [SoLuongTrongKho], [GiaTien], [MaHang], [MaDanhMuc]) VALUES (25, N'Nồi cơm điện tử Kangaroo 1.8 lít KG18DR8', N'Nồi cơm điện tử Kangaroo 1.8 lít KG18DR8, thiết kế hiện đại, nhiều chức năng, dùng tốt, chất lượng vượt trội mà giá mềm bất ngờ, là sản phẩm nên có trong mọi nhà', N'22.1.jpg', N'22.2.jpg', N'22.3.jpg', N'22.4.jpg', N'22.5.jpg', N'22.6.jpg', 15, 22, 1686000, 6, 6)
INSERT [dbo].[SANPHAM] ([MaSP], [TenSP], [MoTa], [Anh1], [Anh2], [Anh3], [Anh4], [Anh5], [Anh6], [SoLuongDaBan], [SoLuongTrongKho], [GiaTien], [MaHang], [MaDanhMuc]) VALUES (26, N'Nồi cơm nắp gài Kangaroo 2.2 lít KG22R1', N'Nồi cơm nắp gài Kangaroo KG22R1 2.2 lít đẹp, dễ dùng, thương hiệu tốt, nấu cơm nhanh, lựa chọn tốt cho gia đình đông người.', N'23.1.jpg', N'23.2.jpg', N'23.3.jpg', N'23.4.jpg', N'23.5.jpg', N'23.6.jpg', 29, 4, 932000, 6, 6)
INSERT [dbo].[SANPHAM] ([MaSP], [TenSP], [MoTa], [Anh1], [Anh2], [Anh3], [Anh4], [Anh5], [Anh6], [SoLuongDaBan], [SoLuongTrongKho], [GiaTien], [MaHang], [MaDanhMuc]) VALUES (27, N'Quạt đứng Kangaroo KG725', N'quạt đứng Kangaroo KG725 thương hiệu Kangaroo với 3 mức độ gió cho bạn tùy chỉnh theo nhu cầu, công suất hoạt động 55W với 5 cánh quạt làm mát nhanh chóng, động cơ bạc đạn bền bỉ, hoạt động êm ái, sẽ là một lựa chọn đáng cân nhắc cho gia đình bạn', N'24.1.jpg', N'24.2.jpg', N'24.3.jpg', N'24.4.jpg', N'24.5.jpg', N'24.6.jpg', 17, 16, 1260000, 6, 8)
INSERT [dbo].[SANPHAM] ([MaSP], [TenSP], [MoTa], [Anh1], [Anh2], [Anh3], [Anh4], [Anh5], [Anh6], [SoLuongDaBan], [SoLuongTrongKho], [GiaTien], [MaHang], [MaDanhMuc]) VALUES (47, N'Máy giặt Samsung Inverter 9 kg WW90T634DLN/SV', N'Máy giặt Samsung Inverter 9kg WW90T634DLN/SV thuộc kiểu máy giặt lồng ngang cửa trước với thiết kế gọn đẹp, tích hợp đa dạng chương trình giặt và nhiều công nghệ thông minh như AI Dispenser, bảng điều khiển thông minh AI Control, giặt hơi nước diệt khuẩn Hygiene Steam,… cùng động cơ Digital Inverter vận hành ổn định, tiết kiệm điện năng.', N'16.1.jpg', N'Anh15.2.jpg', N'17.3.jpg', N'19.1.jpg', N'17.4.jpg', N'17.6.jpg', 1, 4, 5000000, 5, 1)
SET IDENTITY_INSERT [dbo].[SANPHAM] OFF
GO
SET IDENTITY_INSERT [dbo].[TAIKHOAN] ON 

INSERT [dbo].[TAIKHOAN] ([MaTaiKhoan], [Ten], [NgaySinh], [SDT], [DiaChi], [Email], [MatKhau], [MaCV], [MaDonVi]) VALUES (11, N'Nguyễn Văn Đức', CAST(N'2000-11-08' AS Date), N'0896123456     ', N'Thái Hà, Thái Thụy, Thái Bình', N'q1@gmail.com', N'VGt7Z9XP8X4c4jRy4rIpKRYzSrXE+3AURkNBeAKLkeaxCCA4qci/6Z10oAq5B4MC
', 1, NULL)
INSERT [dbo].[TAIKHOAN] ([MaTaiKhoan], [Ten], [NgaySinh], [SDT], [DiaChi], [Email], [MatKhau], [MaCV], [MaDonVi]) VALUES (14, N'Nguyễn Hồng Quân', CAST(N'2002-12-16' AS Date), N'0981293743     ', N'Xuân Lộc, Thanh Thủy, Phú Thọ', N'q@gmail.com', N'c4ca4238a0b923820dcc509a6f75849b', 1, NULL)
INSERT [dbo].[TAIKHOAN] ([MaTaiKhoan], [Ten], [NgaySinh], [SDT], [DiaChi], [Email], [MatKhau], [MaCV], [MaDonVi]) VALUES (21, N'Nguyễn Hoàng Nam', CAST(N'2002-01-23' AS Date), N'0971259398     ', N'Hưng Nhân, Hưng Hà, Thái Bình', N'nam@gmail.com', N'c4ca4238a0b923820dcc509a6f75849b', 2, NULL)
INSERT [dbo].[TAIKHOAN] ([MaTaiKhoan], [Ten], [NgaySinh], [SDT], [DiaChi], [Email], [MatKhau], [MaCV], [MaDonVi]) VALUES (23, N'Nguyễn Hồng Quân', CAST(N'2002-12-16' AS Date), N'0981293743     ', N'Xuân Lộc, Thanh Thủy, Phú Thọ', N'hq@gmail.com', N'AQAAAAIAAYagAAAAEF93tKjSC9c/QydS15//+d5vnT5Lzsy/fB6NdHM9Sm3Y/XHCzUsSLjqpzxiNhl1heg==', 1, NULL)
INSERT [dbo].[TAIKHOAN] ([MaTaiKhoan], [Ten], [NgaySinh], [SDT], [DiaChi], [Email], [MatKhau], [MaCV], [MaDonVi]) VALUES (25, N'Nguyễn Hồng Quân', CAST(N'2002-12-16' AS Date), N'0987562315     ', N'Xuân Lộc, Thanh Thủy, Phú Thọ', N'hq1@gmail.com', N'AQAAAAIAAYagAAAAEJkbg/T8zbwQZnfVdk+m+MXnDhYwtMOBD5QOBcqsV0xAf9rzSW1tz1mvLTX7XiPC4w==', 1, NULL)
INSERT [dbo].[TAIKHOAN] ([MaTaiKhoan], [Ten], [NgaySinh], [SDT], [DiaChi], [Email], [MatKhau], [MaCV], [MaDonVi]) VALUES (26, N'Nguyễn Hồng Quân', CAST(N'2002-12-16' AS Date), N'0231456985     ', N'Phú Thọ', N'hq3@gmail.com', N'AQAAAAIAAYagAAAAEATeGvgsB8U7vrF2dRdpCPmOXrrbykLpkQtPHaYUICZdcQt5317l2QTqsWofKIf2tg==', NULL, NULL)
INSERT [dbo].[TAIKHOAN] ([MaTaiKhoan], [Ten], [NgaySinh], [SDT], [DiaChi], [Email], [MatKhau], [MaCV], [MaDonVi]) VALUES (30, N'Nguyễn Hồng Quân', CAST(N'2024-12-11' AS Date), N'02456875245    ', N'Phú Thọ', N'hq5@gmail.com', N'AQAAAAIAAYagAAAAEDReB7a2jN9wdOyFm62aA3xeXV95xYY0EHLb8BiRHPfyh5yhGfLKuaISNqk8KvG26g==', NULL, NULL)
SET IDENTITY_INSERT [dbo].[TAIKHOAN] OFF
GO
INSERT [dbo].[TaiKhoan_ChucVu] ([MaTaiKhoan], [MaChucVu], [Ten]) VALUES (11, 2, NULL)
INSERT [dbo].[TaiKhoan_ChucVu] ([MaTaiKhoan], [MaChucVu], [Ten]) VALUES (11, 11, NULL)
INSERT [dbo].[TaiKhoan_ChucVu] ([MaTaiKhoan], [MaChucVu], [Ten]) VALUES (14, 3, NULL)
INSERT [dbo].[TaiKhoan_ChucVu] ([MaTaiKhoan], [MaChucVu], [Ten]) VALUES (21, 1, NULL)
INSERT [dbo].[TaiKhoan_ChucVu] ([MaTaiKhoan], [MaChucVu], [Ten]) VALUES (21, 3, NULL)
INSERT [dbo].[TaiKhoan_ChucVu] ([MaTaiKhoan], [MaChucVu], [Ten]) VALUES (23, 1, NULL)
INSERT [dbo].[TaiKhoan_ChucVu] ([MaTaiKhoan], [MaChucVu], [Ten]) VALUES (23, 3, NULL)
INSERT [dbo].[TaiKhoan_ChucVu] ([MaTaiKhoan], [MaChucVu], [Ten]) VALUES (25, 1, NULL)
INSERT [dbo].[TaiKhoan_ChucVu] ([MaTaiKhoan], [MaChucVu], [Ten]) VALUES (25, 3, NULL)
INSERT [dbo].[TaiKhoan_ChucVu] ([MaTaiKhoan], [MaChucVu], [Ten]) VALUES (26, 3, NULL)
INSERT [dbo].[TaiKhoan_ChucVu] ([MaTaiKhoan], [MaChucVu], [Ten]) VALUES (30, 3, NULL)
GO
INSERT [dbo].[UserRoles] ([UserId], [RoleId], [Ten]) VALUES (14, 1, NULL)
INSERT [dbo].[UserRoles] ([UserId], [RoleId], [Ten]) VALUES (21, 3, NULL)
INSERT [dbo].[UserRoles] ([UserId], [RoleId], [Ten]) VALUES (23, 1, NULL)
INSERT [dbo].[UserRoles] ([UserId], [RoleId], [Ten]) VALUES (25, 2, NULL)
INSERT [dbo].[UserRoles] ([UserId], [RoleId], [Ten]) VALUES (26, 2, NULL)
INSERT [dbo].[UserRoles] ([UserId], [RoleId], [Ten]) VALUES (30, 2, NULL)
GO
INSERT [dbo].[VANCHUYEN] ([MaDonHang], [NguoiNhan], [DiaChi], [SDT], [HinhThucVanChuyen]) VALUES (160, N'Nguyễn Thúy Quỳnh', N'Xuân Lộc, Thanh Thủy, Phú Thọ', N'0981293743     ', N'Giao tận nhà')
INSERT [dbo].[VANCHUYEN] ([MaDonHang], [NguoiNhan], [DiaChi], [SDT], [HinhThucVanChuyen]) VALUES (162, N'Nguyễn Tấn Dũng', N'Cầu Giấy, Hà Nội', N'0231203245', N'Giao tận nhà')
INSERT [dbo].[VANCHUYEN] ([MaDonHang], [NguoiNhan], [DiaChi], [SDT], [HinhThucVanChuyen]) VALUES (163, N'Phạm Thanh Tùng', N'Xuân Lộc, Thanh Thủy, Phú Thọ', N'0981293743     ', N'Giao tận nhà')
INSERT [dbo].[VANCHUYEN] ([MaDonHang], [NguoiNhan], [DiaChi], [SDT], [HinhThucVanChuyen]) VALUES (164, N'Đặng Hoàng Việt', N'Xuân Lộc, Thanh Thủy, Phú Thọ', N'0981293743     ', N'Giao tận nhà')
INSERT [dbo].[VANCHUYEN] ([MaDonHang], [NguoiNhan], [DiaChi], [SDT], [HinhThucVanChuyen]) VALUES (165, N'Phạm Văn Hưng', N'Phú Thọ', N'025874136', N'Giao tận nhà')
INSERT [dbo].[VANCHUYEN] ([MaDonHang], [NguoiNhan], [DiaChi], [SDT], [HinhThucVanChuyen]) VALUES (166, N'Đặng Hoàng Việt', N'Đông Hưng, Thái Bình', N'025874136', N'Giao tận nhà')
INSERT [dbo].[VANCHUYEN] ([MaDonHang], [NguoiNhan], [DiaChi], [SDT], [HinhThucVanChuyen]) VALUES (167, N'Lê Hữu Hiển', N'Hưng Hà, Thái Bình', N'08456613       ', N'Giao tận nhà')
INSERT [dbo].[VANCHUYEN] ([MaDonHang], [NguoiNhan], [DiaChi], [SDT], [HinhThucVanChuyen]) VALUES (168, N'Nguyễn Hồng Quân', N'Xuân Lộc, Thanh Thủy, Phú Thọ', N'0981293743', N'Giao tận nhà')
INSERT [dbo].[VANCHUYEN] ([MaDonHang], [NguoiNhan], [DiaChi], [SDT], [HinhThucVanChuyen]) VALUES (169, N'Nguyễn Khôi Nguyên', N'Đông Hưng, Thái Bình', N'02120213654', N'Giao tận nhà')
INSERT [dbo].[VANCHUYEN] ([MaDonHang], [NguoiNhan], [DiaChi], [SDT], [HinhThucVanChuyen]) VALUES (170, N'Lê Hữu Hiển', N'Đô Thành, Yên Thành, Nghệ An', N'02102354684', N'Giao tận nhà')
INSERT [dbo].[VANCHUYEN] ([MaDonHang], [NguoiNhan], [DiaChi], [SDT], [HinhThucVanChuyen]) VALUES (171, N'Nguyễn Hồng Quân', N'Phú Thọ', N'025874136', N'Giao tận nhà')
INSERT [dbo].[VANCHUYEN] ([MaDonHang], [NguoiNhan], [DiaChi], [SDT], [HinhThucVanChuyen]) VALUES (172, N'Võ Quốc Xôi', N'Quảng Ngãi', N'0325468875', N'Giao tận nhà')
INSERT [dbo].[VANCHUYEN] ([MaDonHang], [NguoiNhan], [DiaChi], [SDT], [HinhThucVanChuyen]) VALUES (183, N'Bùi Ngọc An', N'Lào Cai, Lào Cai, Lào Cai', N'0958746123', N'Giao tận nhà')
INSERT [dbo].[VANCHUYEN] ([MaDonHang], [NguoiNhan], [DiaChi], [SDT], [HinhThucVanChuyen]) VALUES (184, N'Nguyễn Văn Hưng', N'Hương Thủy, Hương Khê, Hà Tĩnh', N'0231456875', N'Giao tận nhà')
INSERT [dbo].[VANCHUYEN] ([MaDonHang], [NguoiNhan], [DiaChi], [SDT], [HinhThucVanChuyen]) VALUES (185, N'Nguyễn Lê Trung Hiếu', N'Hùng Vương, Lạng Sơn, Lạng Sơn', N'0345687561', N'Giao tận nhà')
INSERT [dbo].[VANCHUYEN] ([MaDonHang], [NguoiNhan], [DiaChi], [SDT], [HinhThucVanChuyen]) VALUES (186, N'Nguyễn Thanh Hiếu', N'Công Thành, Yên Thành, Nghệ An', N'0325461235', N'Giao tận nhà')
INSERT [dbo].[VANCHUYEN] ([MaDonHang], [NguoiNhan], [DiaChi], [SDT], [HinhThucVanChuyen]) VALUES (187, N'Phan Đinh Minh Ngọc', N'Trung Liệt, Đống Đa, Hà Nội', N'0213564856', N'Giao tận nhà')
INSERT [dbo].[VANCHUYEN] ([MaDonHang], [NguoiNhan], [DiaChi], [SDT], [HinhThucVanChuyen]) VALUES (191, N'Võ Huy', N'Phúc Thọ, Phúc Thọ, Hà Nội', N'0215468754', N'Giao tận nhà')
INSERT [dbo].[VANCHUYEN] ([MaDonHang], [NguoiNhan], [DiaChi], [SDT], [HinhThucVanChuyen]) VALUES (192, N'Nguyễn Thúy Quỳnh', N'Ba Trại, Ba Vì, Hà Nội', N'012345678', N'Giao tận nhà')
INSERT [dbo].[VANCHUYEN] ([MaDonHang], [NguoiNhan], [DiaChi], [SDT], [HinhThucVanChuyen]) VALUES (193, N'Tạ Văn Nhật', N'An Lão, Hải Phòng', N'0356874561', N'Giao tận nhà')
INSERT [dbo].[VANCHUYEN] ([MaDonHang], [NguoiNhan], [DiaChi], [SDT], [HinhThucVanChuyen]) VALUES (194, N'Phạm Thanh Tùng', N'Hoàng Khánh, Liên Chiểu, Đà Nẵng', N'0356874568', N'Giao tận nhà')
INSERT [dbo].[VANCHUYEN] ([MaDonHang], [NguoiNhan], [DiaChi], [SDT], [HinhThucVanChuyen]) VALUES (195, N'Lê Hữu Hiển', N'Hòa Hiếu, Thái Hòa, Nghệ An', N'0356878956', N'Giao tận nhà')
INSERT [dbo].[VANCHUYEN] ([MaDonHang], [NguoiNhan], [DiaChi], [SDT], [HinhThucVanChuyen]) VALUES (196, N'Nguyễn Văn Hưng', N'Hương Thủy, Hương Khê, Hà Tĩnh', N'056874562', N'Giao tận nhà')
INSERT [dbo].[VANCHUYEN] ([MaDonHang], [NguoiNhan], [DiaChi], [SDT], [HinhThucVanChuyen]) VALUES (199, N'Đỗ Nguyên Phương', N'Lạc Long Quân, Việt Trì, Phú Thọ', N'02368854521', N'Giao tận nhà')
INSERT [dbo].[VANCHUYEN] ([MaDonHang], [NguoiNhan], [DiaChi], [SDT], [HinhThucVanChuyen]) VALUES (200, N'Bùi An', N'Lào Cai', N'0325642665', N'Giao tận nhà')
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Roles__8A2B6160B39AB150]    Script Date: 3/5/2025 3:51:21 PM ******/
ALTER TABLE [dbo].[Roles] ADD UNIQUE NONCLUSTERED 
(
	[RoleName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[CHITIETDONHANG]  WITH CHECK ADD  CONSTRAINT [FK_CHITIETDONHANG_DONHANG] FOREIGN KEY([MaDonHang])
REFERENCES [dbo].[DONHANG] ([MaDonHang])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[CHITIETDONHANG] CHECK CONSTRAINT [FK_CHITIETDONHANG_DONHANG]
GO
ALTER TABLE [dbo].[CHITIETDONHANG]  WITH CHECK ADD  CONSTRAINT [FK_CHITIETDONHANG_SANPHAM] FOREIGN KEY([MaSP])
REFERENCES [dbo].[SANPHAM] ([MaSP])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[CHITIETDONHANG] CHECK CONSTRAINT [FK_CHITIETDONHANG_SANPHAM]
GO
ALTER TABLE [dbo].[CV_Q_A]  WITH CHECK ADD  CONSTRAINT [FK_CV_Q_A_ActionT] FOREIGN KEY([MaA])
REFERENCES [dbo].[ActionT] ([MaA])
GO
ALTER TABLE [dbo].[CV_Q_A] CHECK CONSTRAINT [FK_CV_Q_A_ActionT]
GO
ALTER TABLE [dbo].[CV_Q_A]  WITH CHECK ADD  CONSTRAINT [FK_CV_Q_A_ChucVu] FOREIGN KEY([MaCV])
REFERENCES [dbo].[ChucVu] ([MaCV])
GO
ALTER TABLE [dbo].[CV_Q_A] CHECK CONSTRAINT [FK_CV_Q_A_ChucVu]
GO
ALTER TABLE [dbo].[CV_Q_A]  WITH CHECK ADD  CONSTRAINT [FK_CV_Q_A_Quyen] FOREIGN KEY([MaQ])
REFERENCES [dbo].[Quyen] ([MaQ])
GO
ALTER TABLE [dbo].[CV_Q_A] CHECK CONSTRAINT [FK_CV_Q_A_Quyen]
GO
ALTER TABLE [dbo].[DANHGIASANPHAM]  WITH CHECK ADD  CONSTRAINT [FK_DANHGIASANPHAM_SANPHAM] FOREIGN KEY([MaSP])
REFERENCES [dbo].[SANPHAM] ([MaSP])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[DANHGIASANPHAM] CHECK CONSTRAINT [FK_DANHGIASANPHAM_SANPHAM]
GO
ALTER TABLE [dbo].[DANHGIASANPHAM]  WITH CHECK ADD  CONSTRAINT [FK_DANHGIASANPHAM_TAIKHOAN] FOREIGN KEY([MaTaiKhoan])
REFERENCES [dbo].[TAIKHOAN] ([MaTaiKhoan])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[DANHGIASANPHAM] CHECK CONSTRAINT [FK_DANHGIASANPHAM_TAIKHOAN]
GO
ALTER TABLE [dbo].[DONHANG]  WITH CHECK ADD  CONSTRAINT [FK_DONHANG_TAIKHOAN] FOREIGN KEY([MaTaiKhoan])
REFERENCES [dbo].[TAIKHOAN] ([MaTaiKhoan])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[DONHANG] CHECK CONSTRAINT [FK_DONHANG_TAIKHOAN]
GO
ALTER TABLE [dbo].[DonVi]  WITH CHECK ADD FOREIGN KEY([MaDonViCha])
REFERENCES [dbo].[DonVi] ([MaDonVi])
GO
ALTER TABLE [dbo].[GioHang]  WITH CHECK ADD  CONSTRAINT [FK_GioHang_SANPHAM] FOREIGN KEY([MaSP])
REFERENCES [dbo].[SANPHAM] ([MaSP])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[GioHang] CHECK CONSTRAINT [FK_GioHang_SANPHAM]
GO
ALTER TABLE [dbo].[GioHang]  WITH CHECK ADD  CONSTRAINT [FK_GioHang_TAIKHOAN] FOREIGN KEY([MaTaiKhoan])
REFERENCES [dbo].[TAIKHOAN] ([MaTaiKhoan])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[GioHang] CHECK CONSTRAINT [FK_GioHang_TAIKHOAN]
GO
ALTER TABLE [dbo].[Message]  WITH CHECK ADD  CONSTRAINT [FK_Message_TAIKHOAN] FOREIGN KEY([SenderId])
REFERENCES [dbo].[TAIKHOAN] ([MaTaiKhoan])
GO
ALTER TABLE [dbo].[Message] CHECK CONSTRAINT [FK_Message_TAIKHOAN]
GO
ALTER TABLE [dbo].[Message]  WITH CHECK ADD  CONSTRAINT [FK_Message_TAIKHOAN1] FOREIGN KEY([ReceiverId])
REFERENCES [dbo].[TAIKHOAN] ([MaTaiKhoan])
GO
ALTER TABLE [dbo].[Message] CHECK CONSTRAINT [FK_Message_TAIKHOAN1]
GO
ALTER TABLE [dbo].[PhanQuyen]  WITH CHECK ADD FOREIGN KEY([MaChucVu])
REFERENCES [dbo].[ChucVu2] ([MaChucVu])
GO
ALTER TABLE [dbo].[PhanQuyen]  WITH CHECK ADD FOREIGN KEY([MaChucNang])
REFERENCES [dbo].[ChucNang] ([MaChucNang])
GO
ALTER TABLE [dbo].[PhanQuyen]  WITH CHECK ADD FOREIGN KEY([MaDonVi])
REFERENCES [dbo].[DonVi] ([MaDonVi])
GO
ALTER TABLE [dbo].[PhanQuyen]  WITH CHECK ADD FOREIGN KEY([MaHanhDong])
REFERENCES [dbo].[HanhDong] ([MaHanhDong])
GO
ALTER TABLE [dbo].[SANPHAM]  WITH CHECK ADD  CONSTRAINT [FK_SANPHAM_DANHMUCSANPHAM] FOREIGN KEY([MaDanhMuc])
REFERENCES [dbo].[DANHMUCSANPHAM] ([MaDanhMuc])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[SANPHAM] CHECK CONSTRAINT [FK_SANPHAM_DANHMUCSANPHAM]
GO
ALTER TABLE [dbo].[SANPHAM]  WITH CHECK ADD  CONSTRAINT [FK_SANPHAM_HANGSANXUAT] FOREIGN KEY([MaHang])
REFERENCES [dbo].[HANGSANXUAT] ([MaHang])
GO
ALTER TABLE [dbo].[SANPHAM] CHECK CONSTRAINT [FK_SANPHAM_HANGSANXUAT]
GO
ALTER TABLE [dbo].[TAIKHOAN]  WITH CHECK ADD  CONSTRAINT [FK_TAIKHOAN_ChucVu] FOREIGN KEY([MaCV])
REFERENCES [dbo].[ChucVu] ([MaCV])
GO
ALTER TABLE [dbo].[TAIKHOAN] CHECK CONSTRAINT [FK_TAIKHOAN_ChucVu]
GO
ALTER TABLE [dbo].[TAIKHOAN]  WITH CHECK ADD  CONSTRAINT [FK_TAIKHOAN_DonVi] FOREIGN KEY([MaDonVi])
REFERENCES [dbo].[DonVi] ([MaDonVi])
GO
ALTER TABLE [dbo].[TAIKHOAN] CHECK CONSTRAINT [FK_TAIKHOAN_DonVi]
GO
ALTER TABLE [dbo].[TaiKhoan_ChucVu]  WITH CHECK ADD FOREIGN KEY([MaChucVu])
REFERENCES [dbo].[ChucVu2] ([MaChucVu])
GO
ALTER TABLE [dbo].[TaiKhoan_ChucVu]  WITH CHECK ADD  CONSTRAINT [FK_TaiKhoan_ChucVu_TAIKHOAN1] FOREIGN KEY([MaTaiKhoan])
REFERENCES [dbo].[TAIKHOAN] ([MaTaiKhoan])
GO
ALTER TABLE [dbo].[TaiKhoan_ChucVu] CHECK CONSTRAINT [FK_TaiKhoan_ChucVu_TAIKHOAN1]
GO
ALTER TABLE [dbo].[TaiKhoan_PhanQuyen]  WITH CHECK ADD FOREIGN KEY([MaChucNang])
REFERENCES [dbo].[ChucNang] ([MaChucNang])
GO
ALTER TABLE [dbo].[TaiKhoan_PhanQuyen]  WITH CHECK ADD FOREIGN KEY([MaDonVi])
REFERENCES [dbo].[DonVi] ([MaDonVi])
GO
ALTER TABLE [dbo].[TaiKhoan_PhanQuyen]  WITH CHECK ADD FOREIGN KEY([MaHanhDong])
REFERENCES [dbo].[HanhDong] ([MaHanhDong])
GO
ALTER TABLE [dbo].[TaiKhoan_PhanQuyen]  WITH CHECK ADD  CONSTRAINT [FK_TaiKhoan_PhanQuyen_TAIKHOAN] FOREIGN KEY([MaTaiKhoan])
REFERENCES [dbo].[TAIKHOAN] ([MaTaiKhoan])
GO
ALTER TABLE [dbo].[TaiKhoan_PhanQuyen] CHECK CONSTRAINT [FK_TaiKhoan_PhanQuyen_TAIKHOAN]
GO
ALTER TABLE [dbo].[UserRoles]  WITH CHECK ADD FOREIGN KEY([RoleId])
REFERENCES [dbo].[Roles] ([RoleId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[UserRoles]  WITH CHECK ADD FOREIGN KEY([UserId])
REFERENCES [dbo].[TAIKHOAN] ([MaTaiKhoan])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[VANCHUYEN]  WITH CHECK ADD  CONSTRAINT [FK_VANCHUYEN_DONHANG] FOREIGN KEY([MaDonHang])
REFERENCES [dbo].[DONHANG] ([MaDonHang])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[VANCHUYEN] CHECK CONSTRAINT [FK_VANCHUYEN_DONHANG]
GO
/****** Object:  StoredProcedure [dbo].[TKBYNam]    Script Date: 3/5/2025 3:51:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[TKBYNam]
    @year [int]
AS
BEGIN
    select MONTH(DONHANG.NgayLap) as Thang, SUM(DONHANG.TongTien) as DoanhThu from DONHANG where ( YEAR(DONHANG.NgayLap)= @year and DONHANG.TinhTrang = '3')
    group by MONTH(DONHANG.NgayLap)
END
GO
USE [master]
GO
ALTER DATABASE [OnlineShop] SET  READ_WRITE 
GO
