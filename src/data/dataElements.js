import { RxDashboard, RxAccessibility, RxAvatar, RxCodesandboxLogo } from "react-icons/rx";
import { MdOutlineAddShoppingCart, MdOutlineSupervisorAccount, MdPayment, MdCurrencyExchange } from 'react-icons/md';
import { RiHotelLine, RiPercentLine, RiFileList3Line, RiShareCircleLine } from "react-icons/ri";
import { TbTruckLoading, TbFileInvoice, TbReportMoney, TbTransferIn, TbReceiptTax, TbReportAnalytics } from "react-icons/tb";
import { BsPeople, BsBoxSeam, BsReceipt, BsCashCoin } from 'react-icons/bs';
import { BiBarChart, BiSitemap } from 'react-icons/bi';
import { AiOutlineFileText, AiOutlineProfile } from 'react-icons/ai';
import { FiBarChart } from 'react-icons/fi';
import { IoCashOutline } from 'react-icons/io5';
import { HiOutlineRefresh, HiOutlineCurrencyRupee } from 'react-icons/hi';

import { PERMISSIONS } from "utils/Permissions";

const { 
  CAN_USER_VIEW_COMPANY, 
  CAN_USER_VIEW_CUSTOMER,
  CAN_USER_VIEW_PRODUCT,
  CAN_USER_VIEW_SUPPLIER,
  CAN_USER_VIEW_USER,
  CAN_USER_VIEW_ROLE,
  CAN_USER_VIEW_QUOTATION,
  CAN_USER_VIEW_SALESINVOICE,
  CAN_USER_VIEW_PURCHASEORDER,
} = PERMISSIONS;

// ------------- Sidebar links --------------------

export const links = [
  {
    title: 'Dashboard',
    links: [
      {
        id: 1,
        name: 'dashboard',
        icon: <RxDashboard />,
      },
    ],
  },
];
export const links1 = [
  {
    title: 'Master',
    links1: [
      {
        id: 2,
        name: 'users',
        icon: <RxAvatar />,
        permission: CAN_USER_VIEW_USER,
      },
      {
        id: 3,
        name: 'roles',
        icon: <RxAccessibility />,
        permission: CAN_USER_VIEW_ROLE,
      },
      {
        id: 4,
        name: 'companies',
        icon: <RiHotelLine />,
        permission: CAN_USER_VIEW_COMPANY,
      },
      {
        id: 5,
        name: 'products',
        icon: <RxCodesandboxLogo />,
        permission: CAN_USER_VIEW_PRODUCT,
      },
      {
        id: 6,
        name: 'product-category',
        icon: <BiSitemap />,
      },
      {
        id: 7,
        name: 'hsn-configuration',
        icon: <TbReceiptTax />,
      },
      {
        id: 8,
        name: 'suppliers',
        icon: <TbTruckLoading />,
        permission: CAN_USER_VIEW_SUPPLIER,
      },
      {
        id: 9,
        name: 'customers',
        icon: <BsPeople />,
        permission: CAN_USER_VIEW_CUSTOMER,
      },
      {
        id: 10,
        name: 'currency',
        icon: <HiOutlineCurrencyRupee />,
      },
      {
        id: 11,
        name: 'exchange-rate',
        icon: <MdCurrencyExchange />,
      },
      {
        id: 12,
        name: 'expense-type',
        icon: <BsCashCoin />,
      },
    ],
  },
];

export const links2 = [
    {
      title: 'Transaction',
      links2: [
        {
          id: 13,
          name: 'import-orders',
          icon: <MdOutlineAddShoppingCart />,
          permission: CAN_USER_VIEW_PURCHASEORDER,
        },
        {
          id: 14,
          name: 'stock-transfer',
          icon: <TbTransferIn />,
        },
        {
          id: 15,
          name: 'quotations',
          icon: <RiPercentLine />,
          permission: CAN_USER_VIEW_QUOTATION,
        },
        {
          id: 16,
          name: 'proforma-invoice',
          icon: <TbFileInvoice />,
        },
        {
          id: 17,
          name: 'sales-invoices',
          icon: <TbReportMoney />,
          permission: CAN_USER_VIEW_SALESINVOICE,
        },
        {
          id: 18,
          name: 'dispatch-challan',
          icon: <BsReceipt />,
        },
        {
          id: 19,
          name: 'payment',
          icon: <MdPayment />,
        },
        {
          id: 20,
          name: 'expense',
          icon: <IoCashOutline />,
        },

      ],
    },
  ];

export const links3 = [
    {
      title: 'Report',
      links3: [
        {
          id: 21,
          name: 'stock-report',
          icon: <BiBarChart />,
        },
        {
          id: 22,
          name: 'io-report',
          icon: <RiFileList3Line />,
        },
        {
          id: 23,
          name: 'sales-invoice-report',
          icon: <AiOutlineFileText />,
        },
        {
          id: 24,
          name: 'payment-outstanding-report',
          icon: <TbReportAnalytics />,
        },
        {
          id: 25,
          name: 'expense-summary-report',
          icon: <AiOutlineProfile />,
        },
        {
          id: 26,
          name: 'outward-remittance-report',
          icon: <RiShareCircleLine />,
        },
      ],
    },
  ];


// -------- Dashboard -----------------

export const earningData = [
  {
    key: 'purchace-order',
    icon: <MdOutlineSupervisorAccount />,
    amount: '39,354',
    percentage: '-4%',
    title: 'Purchace Order',
    iconColor: '#03C9D7',
    iconBg: '#E5FAFB',
    pcColor: 'red-600',
  },
  {
    key: 'stock',
    icon: <BsBoxSeam />,
    amount: '4,396',
    percentage: '+23%',
    title: 'Stock',
    iconColor: 'rgb(255, 244, 229)',
    iconBg: 'rgb(254, 201, 15)',
    pcColor: 'green-600',
  },
  {
    key: 'sales-1',
    icon: <FiBarChart />,
    amount: '423,39',
    percentage: '+38%',
    title: 'Sales',
    iconColor: 'rgb(228, 106, 118)',
    iconBg: 'rgb(255, 244, 229)',
    pcColor: 'green-600',
  },
  {
    key: 'expences-1',
    icon: <HiOutlineRefresh />,
    amount: '39,354',
    percentage: '-12%',
    title: 'Expences',
    iconColor: 'rgb(0, 194, 146)',
    iconBg: 'rgb(235, 250, 242)',
    pcColor: 'red-600',
  },
  {
    key: 'sales-2',
    icon: <FiBarChart />,
    amount: '423,39',
    percentage: '+38%',
    title: 'Sales',
    iconColor: 'rgb(228, 106, 118)',
    iconBg: 'rgb(255, 244, 229)',
    pcColor: 'green-600',
  },
  {
    key: 'expences-2',
    icon: <HiOutlineRefresh />,
    amount: '39,354',
    percentage: '-12%',
    title: 'Expenses',
    iconColor: 'rgb(0, 194, 146)',
    iconBg: 'rgb(235, 250, 242)',
    pcColor: 'red-600',
  },
];
