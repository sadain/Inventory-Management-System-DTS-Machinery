import { useQuery, useMutation } from "@tanstack/react-query";
import { getCookieValue } from "api/constants"
import axios from "axios";

const baseUrl = "https://dtsapi.azurewebsites.net";
// export const baseUrl = "https://localhost:7174";

export const makeRequest = async (method, url, reqBody, params) => {
  let config = {
    headers: {},
    params: params || {},
  };

  const getAccessToken = getCookieValue('dtstoken');
  if (getAccessToken) {
    config.headers.Authorization = `Bearer ${getAccessToken}`;
  }

  if (reqBody instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
  } else {
    config.headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await axios({
      method,
      url,
      data: reqBody,
      headers: config.headers,
      params: config.params,
    });

    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// ------- Start of Login API ----------------------------------

export const useLoginMutation = ({ newLogin, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (newLogin) => {
      return makeRequest(
        "POST",
        `${baseUrl}/api/User/Authenticate`,
        newLogin
      );
    },
    onSuccess, onError
  });
};

// ------- End of Login API ------------------------------------

//-------- Start of Country & States API --------------------------

export const useCountries = () =>
  useQuery({
    queryKey: ["allCountryData"],
    queryFn: () => makeRequest(
      "GET",
      `${baseUrl}/api/Country/GetAll`
    )
  });

export const useStates = ({ selectedCountryId }) =>
  useQuery({
    queryKey: ["allStatesData", selectedCountryId],
    queryFn: () => makeRequest(
      "GET",
      `${baseUrl}/api/States/GetByCountryId?countryId=${selectedCountryId}`
    ),
    enabled: !!selectedCountryId,
  });

//-------- End of Country & States API --------------------------

// ------- Start of Permission API --------------------------------

export const usePermission = () =>
  useQuery({
    queryKey: ["allPermissionData"],
    queryFn: () => makeRequest(
      "GET",
      `${baseUrl}/api/Permission/GetAll`
    )
  });

// ------- End of Permission API ----------------------------------

// ------- Start of Users API --------------------------------

export const useUsers = () =>
  useQuery({
    queryKey: ["allUsersData"],
    queryFn: () => makeRequest(
      "GET",
      `${baseUrl}/api/User/GetAll`
    )
  });

export const useUserMutation = ({ newUser, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (newUser) => {
      return makeRequest(
        "POST",
        `${baseUrl}/api/User/Create`,
        newUser
      );
    },
    onSuccess, onError
  });
};

export const useUserAssignRolesMutation = ({ newUserAssignRoles, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (newUserAssignRoles) => {
      return makeRequest(
        "POST",
        `${baseUrl}/api/User/AssignRoles`,
        newUserAssignRoles
      );
    },
    onSuccess, onError
  });
};

export const useUserAssignCompaniesMutation = ({ newUserAssignCompanies, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (newUserAssignCompanies) => {
      return makeRequest(
        "POST",
        `${baseUrl}/api/User/AssignCompanies`,
        newUserAssignCompanies
      );
    },
    onSuccess, onError
  });
};

// ------- Ends of Users API ---------------------------------

// ------- Start of Roles API --------------------------------

export const useRoles = () =>
  useQuery({
    queryKey: ["allRolesData"],
    queryFn: () => makeRequest(
      "GET",
      `${baseUrl}/api/Role/GetAll`
    )
  });

export const useRoleMutation = ({ newRole, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (newRole) => {
      return makeRequest(
        "POST",
        `${baseUrl}/api/Role/Create`,
        newRole
      );
    },
    onSuccess, onError
  });
};

// ------- End of Roles API ----------------------------------

// ------- Start of Companies API --------------------------------

export const useCompanies = () =>
  useQuery({
    queryKey: ["allCompaniesData"],
    queryFn: () => makeRequest(
      "GET",
      `${baseUrl}/api/Companies/GetAll`
    )
  });

export const useCompanyView = (companyId) =>
  useQuery({
    queryKey: ["allCompanyViewData", companyId],
    queryFn: () => makeRequest(
      "GET",
      `${baseUrl}/api/Companies/Get/${companyId}`
    )
  });

export const useCompaniesMutation = ({ newCompanies, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (newCompanies) => {
      return makeRequest(
        "POST",
        `${baseUrl}/api/Companies/Create`,
        newCompanies
      );
    },
    onSuccess, onError
  });
};

export const useCompaniesEditMutation = ({ editCompanies, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (editCompanies) => {
      return makeRequest(
        "PUT",
        `${baseUrl}/api/Companies/Update/${editCompanies.id}`,
        editCompanies
      );
    },
    onSuccess, onError
  });
};

export const useCompaniesDeleteMutation = ({ deleteCompanies, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (deleteCompanies) => {
      return makeRequest(
        "DELETE",
        `${baseUrl}/api/Companies/Delete/${deleteCompanies.id}`,
        deleteCompanies
      );
    },
    onSuccess, onError
  });
};


// ------- Start of Company Bank API --------------------------------

export const useCompanyBanks = (companybankId) =>
  useQuery({
    queryKey: ["allCompanyBanksData", companybankId],
    queryFn: () => makeRequest(
      "GET",
      `${baseUrl}/api/CompanyBankDetail/Get/Company/${companybankId}`
    )
  });

export const useCompanyBankDetailMutation = ({ newCompanyBank, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (newCompanyBank) => {
      return makeRequest(
        "POST",
        `${baseUrl}/api/CompanyBankDetail/Create`,
        newCompanyBank
      );
    },
    onSuccess, onError
  });
};

export const useCompanyBankDetailEditMutation = ({ editCompanyBank, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (editCompanyBank) => {
      return makeRequest(
        "PUT",
        `${baseUrl}/api/CompanyBankDetail/Update/${editCompanyBank.id}`,
        editCompanyBank
      );
    },
    onSuccess, onError
  });
};

export const useCompanyBankDetailDeleteMutation = ({ deleteCompanyBankDetail, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (deleteCompanyBankDetail) => {
      return makeRequest(
        "DELETE",
        `${baseUrl}/api/CompanyBankDetail/Delete/${deleteCompanyBankDetail.id}`,
        deleteCompanyBankDetail
      );
    },
    onSuccess, onError
  });
};

// ------- End of Company Bank API ----------------------------------
// ------- End of Companies API ----------------------------------

// ------- Start of Products API --------------------------------
export const useProducts = (name, model, purpose, companyId, noPage, pageNumber, pageSize) =>
  useQuery({
    queryKey: ["allProductsData", name, model, purpose, companyId, noPage, pageNumber, pageSize],
    queryFn: () => makeRequest(
      "GET",
      `${baseUrl}/api/Products/GetAll`,
      undefined,
      {
        name, model, purpose, companyId, noPage, pageNumber, pageSize
      }
    )
  });

export const useImagePreview = ({ productId }) =>
  useQuery({
    queryKey: ["productImageData", productId],
    queryFn: () => makeRequest(
      "GET",
      `${baseUrl}/api/Products/Get/${productId}`
    )
  });

export const useProductMutation = ({ newProduct, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (newProduct) => {
      return makeRequest(
        "POST",
        `${baseUrl}/api/Products/Create`,
        newProduct
      );
    },
    onSuccess, onError
  });
};

export const useProductEditMutation = ({ editProduct, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (editProduct) => {
      return makeRequest(
        "PUT",
        `${baseUrl}/api/Products/Update/${editProduct.id}`,
        editProduct.formData
      );
    },
    onSuccess, onError
  });
};

export const useProductDeleteMutation = ({ deleteProduct, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (deleteProduct) => {
      return makeRequest(
        "DELETE",
        `${baseUrl}/api/Products/Delete/${deleteProduct.id}`,
        deleteProduct
      );
    },
    onSuccess, onError
  });
};

// ------- Start Product Category --------------------------------

export const useProductCategory = () =>
  useQuery({
    queryKey: ["allProductCategoryData"],
    queryFn: () => makeRequest(
      "GET",
      `${baseUrl}/api/ProductCategory/GetAll`
    )
  });

export const useProductCategoryView = ({ productCategoryId }) =>
  useQuery({
    queryKey: ["allProductCategoryData", productCategoryId],
    queryFn: () => makeRequest(
      "GET",
      `${baseUrl}/api/ProductCategory/Get/${productCategoryId}`
    )
  });

export const useProductCategoryMutation = ({ newProductCategory, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (newProductCategory) => {
      return makeRequest(
        "PUT",
        `${baseUrl}/api/ProductCategory/Create`,
        newProductCategory
      );
    },
    onSuccess, onError
  });
};

export const useProductCategoryEditMutation = ({ editProductCategory, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (editProductCategory) => {
      return makeRequest(
        "PUT",
        `${baseUrl}/api/ProductCategory/Update/${editProductCategory.id}`,
        editProductCategory
      );
    },
    onSuccess, onError
  });
};

export const useProductCategoryDeleteMutation = ({ deleteProductCategory, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (deleteProductCategory) => {
      return makeRequest(
        "DELETE",
        `${baseUrl}/api/ProductCategory/Delete/${deleteProductCategory.id}`,
        deleteProductCategory
      );
    },
    onSuccess, onError
  });
};

// ------- End Product Category ----------------------------------

// ------- Start Hsn ConfigurpageSizeation --------------------------------

export const useHsnConfiguration = (hsn, companyId, noPage, pageNumber, pageSize) =>
  useQuery({
    queryKey: ["allHsnConfigurationData", hsn, companyId, noPage, pageNumber, pageSize],
    queryFn: () => makeRequest(
      "GET",
      `${baseUrl}/api/HsnConfiguration/GetAll`,
      undefined,
      {
        hsn, companyId, noPage, pageNumber, pageSize
      }
    )
  });

export const useHsnConfigurationView = ({ hsnConfigurationId }) =>
  useQuery({
    queryKey: ["allHsnConfigurationData", hsnConfigurationId],
    queryFn: () => makeRequest(
      "GET",
      `${baseUrl}/api/HsnConfiguration/Get/${hsnConfigurationId}`
    )
  });

export const useHsnConfigurationMutation = ({ newHsnConfiguration, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (newHsnConfiguration) => {
      return makeRequest(
        "POST",
        `${baseUrl}/api/HsnConfiguration/Create`,
        newHsnConfiguration
      );
    },
    onSuccess, onError
  });
};

export const useHsnConfigurationEditMutation = ({ editHsnConfiguration, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (editHsnConfiguration) => {
      return makeRequest(
        "PUT",
        `${baseUrl}/api/HsnConfiguration/Update/${editHsnConfiguration.id}`,
        editHsnConfiguration
      );
    },
    onSuccess, onError
  });
};

export const useHsnConfigurationDeleteMutation = ({ deleteHsnConfiguration, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (deleteHsnConfiguration) => {
      return makeRequest(
        "DELETE",
        `${baseUrl}/api/HsnConfiguration/Delete/${deleteHsnConfiguration.id}`,
        deleteHsnConfiguration
      );
    },
    onSuccess, onError
  });
};

// ------- End Hsn Configuration ----------------------------------

//-------- End Of Produts API -------------------------------

// ------- Start of Suppliers API --------------------------------

export const useSupplier = (name, city, countryId, stateId, companyId, noPage, pageNumber, pageSize) =>
  useQuery({
    queryKey: ["allSuppliersData", name, city, countryId, stateId, companyId, noPage, pageNumber, pageSize],
    queryFn: () => makeRequest(
      "GET",
      `${baseUrl}/api/Supplier/GetAll`,
      undefined,
      {
        name, city, countryId, stateId, companyId, noPage, pageNumber, pageSize
      }
    )
  });

export const useSupplierMutation = ({ newSupplier, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (newSupplier) => {
      return makeRequest(
        "POST",
        `${baseUrl}/api/Supplier/Create`,
        newSupplier
      );
    },
    onSuccess, onError
  });
};

export const useSupplierEditMutation = ({ editSupplier, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (editSupplier) => {
      return makeRequest(
        "PUT",
        `${baseUrl}/api/Supplier/Update/${editSupplier.id}`,
        editSupplier
      );
    },
    onSuccess, onError
  });
};

export const useSupplierDeleteMutation = ({ deleteSupplier, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (deleteSupplier) => {
      return makeRequest(
        "DELETE",
        `${baseUrl}/api/Supplier/Delete/${deleteSupplier.id}`,
        deleteSupplier
      );
    },
    onSuccess, onError
  });
};

// ------- Start of Supplier Bank API --------------------------------

export const useSupplierBanks = (supplierbankId) =>
  useQuery({
    queryKey: ["allSupplierBanksData", supplierbankId],
    queryFn: () => makeRequest(
      "GET",
      `${baseUrl}/api/SupplierBankDetail/Get/Supplier/${supplierbankId}`
    )
  });

export const useSupplierBankDetailMutation = ({ newSupplierBank, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (newSupplierBank) => {
      return makeRequest(
        "POST",
        `${baseUrl}/api/SupplierBankDetail/Create`,
        newSupplierBank
      );
    },
    onSuccess, onError
  });
};

export const useSupplierBankDetailEditMutation = ({ editSupplierBank, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (editSupplierBank) => {
      return makeRequest(
        "PUT",
        `${baseUrl}/api/SupplierBankDetail/Update/${editSupplierBank.id}`,
        editSupplierBank
      );
    },
    onSuccess, onError
  });
};

export const useSupplierBankDetailDeleteMutation = ({ deleteSupplierBankDetail, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (deleteSupplierBankDetail) => {
      return makeRequest(
        "DELETE",
        `${baseUrl}/api/SupplierBankDetail/Delete/${deleteSupplierBankDetail.id}`,
        deleteSupplierBankDetail
      );
    },
    onSuccess, onError
  });
};

// ------- End of Supplier Bank API ----------------------------------

// ------- End of Suppliers API ----------------------------------

// ------- Start of Customers API --------------------------------

export const useCustomer = (name, city, countryId, stateId, companyId, noPage, pageNumber, pageSize) =>
  useQuery({
    queryKey: ["allCustomerData", name, city, countryId, stateId, companyId, noPage, pageNumber, pageSize],
    queryFn: () => makeRequest(
      "GET",
      `${baseUrl}/api/Customer/GetAll`,
      undefined,
      {
        name, city, countryId, stateId, companyId, noPage, pageNumber, pageSize
      }
    )
  });

export const useCustomerView = ({ customerId }) =>
  useQuery({
    queryKey: ["allCustomerData", customerId],
    queryFn: () => makeRequest(
      "GET",
      `${baseUrl}/api/Customer/Get/${customerId}`
    )
  });

export const useCustomerMutation = ({ newCustomer, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (newCustomer) => {
      return makeRequest(
        "POST",
        `${baseUrl}/api/Customer/Create`,
        newCustomer
      );
    },
    onSuccess, onError
  });
};

export const useCustomerEditMutation = ({ editCustomer, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (editCustomer) => {
      return makeRequest(
        "PUT",
        `${baseUrl}/api/Customer/Update/${editCustomer.id}`,
        editCustomer
      );
    },
    onSuccess, onError
  });
};

export const useCustomerDeleteMutation = ({ deleteCustomer, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (deleteCustomer) => {
      return makeRequest(
        "DELETE",
        `${baseUrl}/api/Customer/Delete/${deleteCustomer.id}`,
        deleteCustomer
      );
    },
    onSuccess, onError
  });
};

// ------- End of Customers API --------------------------------
// ------- Start of Currency API --------------------------------

export const useCurrency = () =>
  useQuery({
    queryKey: ["allCurrencyData"],
    queryFn: () => makeRequest(
      "GET",
      `${baseUrl}/api/Currency/GetAll`
    )
  });

export const useCurrencyView = ({ CurrencyId }) =>
  useQuery({
    queryKey: ["allCurrencyData", CurrencyId],
    queryFn: () => makeRequest(
      "GET",
      `${baseUrl}/api/Currency/Get/${CurrencyId}`
    )
  });

export const useCurrencyMutation = ({ newCurrency, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (newCurrency) => {
      return makeRequest(
        "PUT",
        `${baseUrl}/api/Currency/Create`,
        newCurrency
      );
    },
    onSuccess, onError
  });
};

export const useCurrencyEditMutation = ({ editCurrency, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (editCurrency) => {
      return makeRequest(
        "PUT",
        `${baseUrl}/api/Currency/Update/${editCurrency.id}`,
        editCurrency
      );
    },
    onSuccess, onError
  });
};

// ------- End of Currency API ----------------------------------

// ------- Start of Exchange Rate API ----------------------------------

export const useExchangeRate = (currencyId) =>
  useQuery({
    queryKey: ["allExchangeRateData", currencyId],
    queryFn: () => makeRequest(
      "GET",
      `${baseUrl}/api/ExchangeRate/GetAll`,
      undefined,
      {
        currencyId
      }
    )
  });

export const useExchangeRateView = ({ ExchangeRateId }) =>
  useQuery({
    queryKey: ["allExchangeRateData", ExchangeRateId],
    queryFn: () => makeRequest(
      "GET",
      `${baseUrl}/api/ExchangeRate/Get/${ExchangeRateId}`
    )
  });

export const useExchangeRateLatest = (ExchangeRateLatestId) =>
  useQuery({
    queryKey: ["allExchangeRateData", ExchangeRateLatestId],
    queryFn: () => makeRequest(
      "GET",
      `${baseUrl}/api/ExchangeRate/GetLatestRate/${ExchangeRateLatestId}`
    )
  });

export const useExchangeRateMutation = ({ newExchangeRate, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (newExchangeRate) => {
      return makeRequest(
        "PUT",
        `${baseUrl}/api/ExchangeRate/Create`,
        newExchangeRate
      );
    },
    onSuccess, onError
  });
};

export const useExchangeRateEditMutation = ({ editExchangeRate, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (editExchangeRate) => {
      return makeRequest(
        "PUT",
        `${baseUrl}/api/ExchangeRate/Update/${editExchangeRate.id}`,
        editExchangeRate
      );
    },
    onSuccess, onError
  });
};

export const useExchangeRateDeleteMutation = ({ deleteExchangeRate, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (deleteExchangeRate) => {
      return makeRequest(
        "DELETE",
        `${baseUrl}/api/ExchangeRate/Delete/${deleteExchangeRate.id}`,
        deleteExchangeRate
      );
    },
    onSuccess, onError
  });
};

// ------- End of Exchange Rate API ------------------------------------

// ------- Start of Purchase Orders API --------------------------------

export const usePurchaseOrders = (supplier, invoiceNo, startDate, endDate, productName, productModel, companyId, noPage, pageNumber, pageSize) =>
  useQuery({
    queryKey: ["allPurchaseOrdersData", supplier, invoiceNo, startDate, endDate, productName, productModel, companyId, noPage, pageNumber, pageSize],
    queryFn: () => {
      const formatDate = (date) => date ? new Date(new Date(date).setHours(0, 0, 0, 0)).toISOString().split('T')[0] : "";

      const DateStart = formatDate(startDate ? new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 1)) : "");
      const DateEnd = formatDate(endDate ? new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)) : "");

      return makeRequest(
        "GET",
        `${baseUrl}/api/PurchaseOrder/GetAll`,
        undefined,
        {
          supplier, invoiceNo, DateStart, DateEnd, productName, productModel, companyId, noPage, pageNumber, pageSize
        }
      );
    },
  });

export const usePurchaseOrdersMutation = ({ newPurchaseOrder, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (newPurchaseOrder) => {
      return makeRequest(
        "POST",
        `${baseUrl}/api/PurchaseOrder/Create`,
        newPurchaseOrder
      );
    },
    onSuccess, onError
  });
};

export const usePurchaseOrdersEditMutation = ({ editPurchaseOrder, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (editPurchaseOrder) => {
      return makeRequest(
        "PUT",
        `${baseUrl}/api/PurchaseOrder/Update/${editPurchaseOrder.id}`,
        editPurchaseOrder
      );
    },
    onSuccess, onError
  });
};

export const usePurchaseOrdersDeleteMutation = ({ deletePurchaseOrder, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (deletePurchaseOrder) => {
      return makeRequest(
        "DELETE",
        `${baseUrl}/api/PurchaseOrder/Delete/${deletePurchaseOrder.id}`,
        deletePurchaseOrder
      );
    },
    onSuccess, onError
  });
};

// ------- Start of Purchase Orders Record API --------------------------------

export const usePurchaseOrdersView = (purchaseOrdersViewId) =>
  useQuery({
    queryKey: ["allPurchaseOrdersData", purchaseOrdersViewId],
    queryFn: () => makeRequest(
      "GET",
      `${baseUrl}/api/PurchaseOrder/Get/${purchaseOrdersViewId}`
    )
  });

export const usePurchaseOrdersViewMutation = ({ newPurchaseOrderView, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (newPurchaseOrderView) => {
      return makeRequest(
        "POST",
        `${baseUrl}/api/PurchaseOrder/Create/Record`,
        newPurchaseOrderView
      );
    },
    onSuccess, onError
  });
};

export const usePurchaseOrdersViewEditMutation = ({ editPurchaseOrderView, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (editPurchaseOrderView) => {
      return makeRequest(
        "PUT",
        `${baseUrl}/api/PurchaseOrder/Update/Record/${editPurchaseOrderView.id}`,
        editPurchaseOrderView
      );
    },
    onSuccess, onError
  });
};

export const usePurchaseOrdersViewDeleteMutation = ({ deletePurchaseOrderView, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (deletePurchaseOrderView) => {
      return makeRequest(
        "DELETE",
        `${baseUrl}/api/PurchaseOrder/Delete/Record/${deletePurchaseOrderView.id}`,
        deletePurchaseOrderView
      );
    },
    onSuccess, onError
  });
};

// ------- End of Purchase Orders Record API ----------------------------------
// ------- End of Purchase Orders API ----------------------------------

// ------- Start of Quotations API --------------------------------

export const useQuotations = (customer, quotationNo, startDate, endDate, productName, productModel, companyId, noPage, pageNumber, pageSize) =>
  useQuery({
    queryKey: ["allQuotationsData", customer, quotationNo, startDate, endDate, productName, productModel, companyId, noPage, pageNumber, pageSize],
    queryFn: () => {
      const formatDate = (date) => date ? new Date(new Date(date).setHours(0, 0, 0, 0)).toISOString().split('T')[0] : "";

      const DateStart = formatDate(startDate ? new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 1)) : "");
      const DateEnd = formatDate(endDate ? new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)) : "");

      return makeRequest(
        "GET",
        `${baseUrl}/api/Quotation/GetAll`,
        undefined,
        {
          customer, quotationNo, DateStart, DateEnd, productName, productModel, companyId, noPage, pageNumber, pageSize
        }
      );
    },
  });

export const useQuotationsMutation = ({ newQuotation, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (newQuotation) => {
      return makeRequest(
        "POST",
        `${baseUrl}/api/Quotation/Create`,
        newQuotation
      );
    },
    onSuccess, onError
  });
};

export const useQuotationsEditMutation = ({ editQuotation, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (editQuotation) => {
      return makeRequest(
        "PUT",
        `${baseUrl}/api/Quotation/Update/${editQuotation.id}`,
        editQuotation
      );
    },
    onSuccess, onError
  });
};

export const useQuotationsDeleteMutation = ({ deleteQuotation, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (deleteQuotation) => {
      return makeRequest(
        "DELETE",
        `${baseUrl}/api/Quotation/Delete/${deleteQuotation.id}`,
        deleteQuotation
      );
    },
    onSuccess, onError
  });
};

// ------- Start of Quatations - ProformaInvoice API --------------------------------

export const useProformaInvoice = (customer, proformaInvoiceNo, quotationNo, startDate, endDate, productName, productModel, companyId, noPage, pageNumber, pageSize) =>
  useQuery({
    queryKey: ["allProformaInvoiceData", customer, proformaInvoiceNo, quotationNo, startDate, endDate, productName, productModel, companyId, noPage, pageNumber, pageSize],
    queryFn: () => {
      const formatDate = (date) => date ? new Date(new Date(date).setHours(0, 0, 0, 0)).toISOString().split('T')[0] : "";

      const DateStart = formatDate(startDate ? new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 1)) : "");
      const DateEnd = formatDate(endDate ? new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)) : "");

      return makeRequest(
        "GET",
        `${baseUrl}/api/ProformaInvoice/GetAll`,
        undefined,
        {
          customer, proformaInvoiceNo, quotationNo, DateStart, DateEnd, productName, productModel, companyId, noPage, pageNumber, pageSize
        }
      );
    },
  });

export const useProformaInvoiceView = (proformaInvoiceViewId) =>
  useQuery({
    queryKey: ["allProformaInvoiceData", proformaInvoiceViewId],
    queryFn: () => makeRequest(
      "GET",
      `${baseUrl}/api/ProformaInvoice/Get/${proformaInvoiceViewId}`
    )
  });

export const useProformaInvoiceMutation = ({ newProformaInvoice, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (newProformaInvoice) => {
      return makeRequest(
        "POST",
        `${baseUrl}/api/ProformaInvoice/ConvertPIFromQuotation/${newProformaInvoice.id}`,
        newProformaInvoice
      );
    },
    onSuccess,
    onError,
  });
};

export const useProformaInvoiceEditMutation = ({ editProformaInvoice, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (editProformaInvoice) => {
      return makeRequest(
        "PUT",
        `${baseUrl}/api/ProformaInvoice/Update/${editProformaInvoice.id}`,
        editProformaInvoice
      );
    },
    onSuccess, onError
  });
};

export const useProformaInvoiceDeleteMutation = ({ deleteProformaInvoice, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (deleteProformaInvoice) => {
      return makeRequest(
        "DELETE",
        `${baseUrl}/api/ProformaInvoice/Delete/${deleteProformaInvoice.id}`,
        deleteProformaInvoice
      );
    },
    onSuccess, onError
  });
};

// ------- Start of Proforma Invoice Record API --------------------------------

export const useProformaInvoiceViewEditMutation = ({ editProformaInvoiceView, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (editProformaInvoiceView) => {
      return makeRequest(
        "PUT",
        `${baseUrl}/api/ProformaInvoice/Update/Record/${editProformaInvoiceView.id}`,
        editProformaInvoiceView
      );
    },
    onSuccess, onError
  });
};

export const useProformaInvoiceViewDeleteMutation = ({ deleteProformaInvoiceView, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (deleteProformaInvoiceView) => {
      return makeRequest(
        "DELETE",
        `${baseUrl}/api/ProformaInvoice/Delete/Record/${deleteProformaInvoiceView.id}`,
        deleteProformaInvoiceView
      );
    },
    onSuccess, onError
  });
};

// ------- End of Proforma Invoice Record API ----------------------------------

// ------- End of Quatations - ProformaInvoice API ----------------------------------
// ------- Start of Quatations Record API --------------------------------

export const useQuotationsView = (quotationViewId) =>
  useQuery({
    queryKey: ["allQuotationsData", quotationViewId],
    queryFn: () => makeRequest(
      "GET",
      `${baseUrl}/api/Quotation/Get/${quotationViewId}`
    )
  });

export const useQuotationsViewMutation = ({ newQuotationView, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (newQuotationView) => {
      return makeRequest(
        "POST",
        `${baseUrl}/api/Quotation/Create/Record`,
        newQuotationView
      );
    },
    onSuccess, onError
  });
};

export const useQuotationsViewEditMutation = ({ editQuotationView, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (editQuotationView) => {
      return makeRequest(
        "PUT",
        `${baseUrl}/api/Quotation/Update/Record/${editQuotationView.id}`,
        editQuotationView
      );
    },
    onSuccess, onError
  });
};

export const useQuotationsViewDeleteMutation = ({ deleteQuotationView, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (deleteQuotationView) => {
      return makeRequest(
        "DELETE",
        `${baseUrl}/api/Quotation/Delete/Record/${deleteQuotationView.id}`,
        deleteQuotationView
      );
    },
    onSuccess, onError
  });
};

// ------- End of Quatations Record API ----------------------------------
// ------- End of Quatations API ----------------------------------

// ------- Start of Sales Invoice API --------------------------------

export const useSalesInvoice = (customer, invoiceNo, startDate, endDate, productName, productModel, companyId, noPage, pageNumber, pageSize) =>
  useQuery({
    queryKey: ["allSalesInvoiceData", customer, invoiceNo, startDate, endDate, productName, productModel, companyId, noPage, pageNumber, pageSize],
    queryFn: () => {
      const formatDate = (date) => date ? new Date(new Date(date).setHours(0, 0, 0, 0)).toISOString().split('T')[0] : "";

      const DateStart = formatDate(startDate ? new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 1)) : "");
      const DateEnd = formatDate(endDate ? new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)) : "");

      return makeRequest(
        "GET",
        `${baseUrl}/api/SalesInvoice/GetAll`,
        undefined,
        {
          customer, invoiceNo, DateStart, DateEnd, productName, productModel, companyId, noPage, pageNumber, pageSize
        }
      )
    }
  });

export const useSalesInvoiceMutation = ({ newSalesInvoice, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (newSalesInvoice) => {
      return makeRequest(
        "POST",
        `${baseUrl}/api/SalesInvoice/Create`,
        newSalesInvoice
      );
    },
    onSuccess, onError
  });
};

export const useSalesInvoiceEditMutation = ({ editSalesInvoice, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (editSalesInvoice) => {
      return makeRequest(
        "PUT",
        `${baseUrl}/api/SalesInvoice/Update/${editSalesInvoice.id}`,
        editSalesInvoice
      );
    },
    onSuccess, onError
  });
};

export const useSalesInvoiceDeleteMutation = ({ deleteSalesInvoice, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (deleteSalesInvoice) => {
      return makeRequest(
        "DELETE",
        `${baseUrl}/api/SalesInvoice/Delete/${deleteSalesInvoice.id}`,
        deleteSalesInvoice
      );
    },
    onSuccess, onError
  });
};

// ------- Start of Sales Invoice Record API --------------------------------


export const useSalesInvoiceView = (salesInvoiceViewId) =>
  useQuery({
    queryKey: ["allSalesInvoiceData", salesInvoiceViewId],
    queryFn: () => makeRequest(
      "GET",
      `${baseUrl}/api/SalesInvoice/Get/${salesInvoiceViewId}`
    )
  });

export const useSalesInvoiceViewMutation = ({ newSalesInvoiceView, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (newSalesInvoiceView) => {
      return makeRequest(
        "POST",
        `${baseUrl}/api/SalesInvoice/Create/Record`,
        newSalesInvoiceView
      );
    },
    onSuccess, onError
  });
};

export const useSalesInvoiceViewEditMutation = ({ editSalesInvoiceView, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (editSalesInvoiceView) => {
      return makeRequest(
        "PUT",
        `${baseUrl}/api/SalesInvoice/Update/Record/${editSalesInvoiceView.id}`,
        editSalesInvoiceView
      );
    },
    onSuccess, onError
  });
};

export const useSalesInvoiceViewDeleteMutation = ({ deleteSalesInvoiceView, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (deleteSalesInvoiceView) => {
      return makeRequest(
        "DELETE",
        `${baseUrl}/api/SalesInvoice/Delete/Record/${deleteSalesInvoiceView.id}`,
        deleteSalesInvoiceView
      );
    },
    onSuccess, onError
  });
};

// ------- End of Sales Invoice Record API ----------------------------------
// ------- End of Sales Invoice API --------------------------------

// ------- Start of Dispatch Challans API --------------------------------

export const useDispatchChallans = (customer, dispatchNo, startDate, endDate, dispatchType, productName, productModel, companyId, noPage, pageNumber, pageSize) =>
  useQuery({
    queryKey: ["allDispatchChallansData", customer, dispatchNo, startDate, endDate, dispatchType, productName, productModel, companyId, noPage, pageNumber, pageSize],
    queryFn: () => {
      const formatDate = (date) => date ? new Date(new Date(date).setHours(0, 0, 0, 0)).toISOString().split('T')[0] : "";

      const DateStart = formatDate(startDate ? new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 1)) : "");
      const DateEnd = formatDate(endDate ? new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)) : "");

      return makeRequest(
        "GET",
        `${baseUrl}/api/Dispatch/GetAll`,
        undefined,
        {
          customer, dispatchNo, DateStart, DateEnd, dispatchType, productName, productModel, companyId, noPage, pageNumber, pageSize
        }
      );
    },
  });

export const useDispatchChallansMutation = ({ newDispatchChallan, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (newDispatchChallan) => {
      return makeRequest(
        "POST",
        `${baseUrl}/api/Dispatch/Create`,
        newDispatchChallan
      );
    },
    onSuccess, onError
  });
};

export const useDispatchChallansEditMutation = ({ editDispatchChallan, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (editDispatchChallan) => {
      return makeRequest(
        "PUT",
        `${baseUrl}/api/Dispatch/Update/${editDispatchChallan.id}`,
        editDispatchChallan
      );
    },
    onSuccess, onError
  });
};

export const useDispatchChallansDeleteMutation = ({ deleteDispatchChallan, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (deleteDispatchChallan) => {
      return makeRequest(
        "DELETE",
        `${baseUrl}/api/Dispatch/Delete/${deleteDispatchChallan.id}`,
        deleteDispatchChallan
      );
    },
    onSuccess, onError
  });
};

// ------- Start of Dispatch Challans Record API --------------------------------

export const useDispatchChallansView = (dispatchChallanViewId) =>
  useQuery({
    queryKey: ["allDispatchChallanViewData", dispatchChallanViewId],
    queryFn: () => makeRequest(
      "GET",
      `${baseUrl}/api/Dispatch/Get/${dispatchChallanViewId}`
    )
  });

export const useDispatchChallansViewMutation = ({ newDispatchChallanView, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (newDispatchChallanView) => {
      return makeRequest(
        "POST",
        `${baseUrl}/api/Dispatch/Create/Record`,
        newDispatchChallanView
      );
    },
    onSuccess, onError
  });
};

export const useDispatchChallansViewEditMutation = ({ editDispatchChallanView, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (editDispatchChallanView) => {
      return makeRequest(
        "PUT",
        `${baseUrl}/api/DispatchChallan/Update/Record/${editDispatchChallanView.id}`,
        editDispatchChallanView
      );
    },
    onSuccess, onError
  });
};

export const useDispatchChallansViewDeleteMutation = ({ deleteDispatchChallanView, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (deleteDispatchChallanView) => {
      return makeRequest(
        "DELETE",
        `${baseUrl}/api/Dispatch/Delete/Record/${deleteDispatchChallanView.id}`,
        deleteDispatchChallanView
      );
    },
    onSuccess, onError
  });
};

// ------- End of Dispatch Challans Record API ----------------------------------
// ------- End of Dispatch Challans API ----------------------------------

// ------- Start of Stock Transfer API ----------------------------------

export const useStockTransfer = (companyId) =>
  useQuery({
    queryKey: ["allStockTransferData", companyId],
    queryFn: () => makeRequest(
      "GET",
      `${baseUrl}/api/Dispatch/GetStockTransferData`,
      undefined,
      {
        companyId,
      }
    )
  });

export const useStockTransferMutation = ({ newStockTransfer, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (newStockTransfer) => {
      return makeRequest(
        "POST",
        `${baseUrl}/api/PurchaseOrder/CreateStockTransfer`,
        newStockTransfer
      );
    },
    onSuccess, onError
  });
};


// ------- End of Stock Transfer API ------------------------------------

// ------- Start of Payment - Purchase & Sales API ----------------------------------

export const usePaymentPurchace = (purchaseOrderId) =>
  useQuery({
    queryKey: ["allPaymentPurchaceData", purchaseOrderId],
    queryFn: () => makeRequest(
      "GET",
      `${baseUrl}/api/Payment/Get/Purchase`,
      undefined,
      {
        purchaseOrderId
      }
    ),
  });

export const usePaymentSales = (salesInvoiceId) =>
  useQuery({
    queryKey: ["allPaymentSalesData", salesInvoiceId],
    queryFn: () => makeRequest(
      "GET",
      `${baseUrl}/api/Payment/Get/Sales`,
      undefined,
      {
        salesInvoiceId
      }
    )
  });

export const usePaymentPurchaseMutation = ({ newPaymentPurchase, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (newPaymentPurchase) => {
      return makeRequest(
        "POST",
        `${baseUrl}/api/Payment/Create/Purchase`,
        newPaymentPurchase
      );
    },
    onSuccess, onError
  });
};

export const usePaymentSalesMutation = ({ newPaymentSales, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (newPaymentSales) => {
      return makeRequest(
        "POST",
        `${baseUrl}/api/Payment/Create/Sales`,
        newPaymentSales
      );
    },
    onSuccess, onError
  });
};

export const usePaymentPurchaseDeleteMutation = ({ deletePaymentPurchase, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (deletePaymentPurchase) => {
      return makeRequest(
        "DELETE",
        `${baseUrl}/api/Payment/Delete/Purchase/${deletePaymentPurchase.paymentId}`,
        deletePaymentPurchase
      );
    },
    onSuccess, onError
  });
};

export const usePaymentSalesDeleteMutation = ({ deletePaymentSales, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (deletePaymentSales) => {
      return makeRequest(
        "DELETE",
        `${baseUrl}/api/Payment/Delete/Sales/${deletePaymentSales.paymentId}`,
        deletePaymentSales
      );
    },
    onSuccess, onError
  });
};

// ------- End of Payment API ------------------------------------

// ------- Start of Expense API ----------------------------------

export const useExpense = (keyword, startDate, endDate, amountRangeFrom, amountRangeTo, companyId, noPage, pageNumber, pageSize) =>
  useQuery({
    queryKey: ["allExpensesData", keyword, startDate, endDate, amountRangeFrom, amountRangeTo, companyId, noPage, pageNumber, pageSize],
    queryFn: () => {
      const formatDate = (date) => date ? new Date(new Date(date).setHours(0, 0, 0, 0)).toISOString().split('T')[0] : "";

      const DateStart = formatDate(startDate ? new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 1)) : "");
      const DateEnd = formatDate(endDate ? new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)) : "");

      return makeRequest(
        "GET",
        `${baseUrl}/api/Expense/GetAll`,
        undefined,
        {
          keyword, DateStart, DateEnd, amountRangeFrom, amountRangeTo, companyId, noPage, pageNumber, pageSize
        }
      );
    },
  });

export const useExpenseMutation = ({ newExpense, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (newExpense) => {
      return makeRequest(
        "POST",
        `${baseUrl}/api/Expense/Create`,
        newExpense
      );
    },
    onSuccess, onError
  });
};

export const useExpenseEditMutation = ({ editExpense, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (editExpense) => {
      return makeRequest(
        "PUT",
        `${baseUrl}/api/Expense/Update/${editExpense.id}`,
        editExpense
      );
    },
    onSuccess, onError
  });
};

export const useExpenseDeleteMutation = ({ deleteExpense, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (deleteExpense) => {
      return makeRequest(
        "DELETE",
        `${baseUrl}/api/Expense/Delete/${deleteExpense.id}`,
        deleteExpense
      );
    },
    onSuccess, onError
  });
};

// ------- Start of Expense Type API ------------------------------------

export const useExpenseType = () =>
  useQuery({
    queryKey: ["allExpenseTypeData"],
    queryFn: () => makeRequest(
      "GET",
      `${baseUrl}/api/ExpenseType/GetAll`
    )
  });

export const useExpenseTypeView = ({ ExpenseTypeId }) =>
  useQuery({
    queryKey: ["allExpenseTypeData", ExpenseTypeId],
    queryFn: () => makeRequest(
      "GET",
      `${baseUrl}/api/ExpenseType/Get/${ExpenseTypeId}`
    )
  });

export const useExpenseTypeMutation = ({ newExpenseType, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (newExpenseType) => {
      return makeRequest(
        "POST",
        `${baseUrl}/api/ExpenseType/Create`,
        newExpenseType
      );
    },
    onSuccess, onError
  });
};

export const useExpenseTypeEditMutation = ({ editExpenseType, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (editExpenseType) => {
      return makeRequest(
        "PUT",
        `${baseUrl}/api/ExpenseType/Update/${editExpenseType.id}`,
        editExpenseType
      );
    },
    onSuccess, onError
  });
};

export const useExpenseTypeDeleteMutation = ({ deleteExpenseType, onSuccess, onError }) => {
  return useMutation({
    mutationFn: (deleteExpenseType) => {
      return makeRequest(
        "DELETE",
        `${baseUrl}/api/ExpenseType/Delete/${deleteExpenseType.id}`,
        deleteExpenseType
      );
    },
    onSuccess, onError
  });
};

// ------- End of Expense Type API --------------------------------------
// ------- End of Expense API ------------------------------------

// ------- Start of Stock Report API ------------------------------------

export const useStockReport = (product, companyId, noPage, pageNumber, pageSize) =>
  useQuery({
    queryKey: ["allStockReportsData", product, companyId, noPage, pageNumber, pageSize],
    queryFn: () => makeRequest(
      "GET",
      `${baseUrl}/api/Reports/GetStockReport`,
      undefined,
      {
        product, companyId, noPage, pageNumber, pageSize
      }
    )
  });

export const useStockReportExport = (product, companyId, noPage) =>
  useQuery({
    queryKey: ["allStockReportExportData", product, companyId, noPage],
    queryFn: () => makeRequest(
      "GET",
      `${baseUrl}/api/Reports/StockReport/ExportToCSV`,
      undefined,
      {
        product, companyId, noPage
      }
    )
  });


// ------- End of Stock Report API --------------------------------------

// ------- Start of Po Report API ------------------------------------

export const usePoReport = (DateStart, DateEnd, supplierId, productId, companyId, noPage, pageNumber, pageSize) =>
  useQuery({
    queryKey: [
      "allPoReportsData", DateStart, DateEnd, supplierId, productId, companyId, noPage, pageNumber, pageSize],
    queryFn: () => {
      const formatDate = (date) => date ? new Date(new Date(date).setHours(0, 0, 0, 0)).toISOString().split('T')[0] : "";

      const startDate = formatDate(DateStart ? new Date(new Date(DateStart).setDate(new Date(DateStart).getDate() + 1)) : "");
      const endDate = formatDate(DateEnd ? new Date(new Date(DateEnd).setDate(new Date(DateEnd).getDate() + 1)) : "");

      return makeRequest(
        "GET",
        `${baseUrl}/api/Reports/GetPoReport`,
        undefined,
        {
          startDate, endDate, supplierId, productId, companyId, noPage, pageNumber, pageSize
        }
      );
    },
  });

export const usePoReportExport = (DateStart, DateEnd, supplierId, productId, companyId, noPage) =>
  useQuery({
    queryKey: [
      "allPoReportExportData", DateStart, DateEnd, supplierId, productId, companyId, noPage],
    queryFn: () => {
      const formatDate = (date) => date ? new Date(new Date(date).setHours(0, 0, 0, 0)).toISOString().split('T')[0] : "";

      const startDate = formatDate(DateStart ? new Date(new Date(DateStart).setDate(new Date(DateStart).getDate() + 1)) : "");
      const endDate = formatDate(DateEnd ? new Date(new Date(DateEnd).setDate(new Date(DateEnd).getDate() + 1)) : "");

      return makeRequest(
        "GET",
        `${baseUrl}/api/Reports/PoReport/ExportToCSV`,
        undefined,
        {
          startDate, endDate, supplierId, productId, companyId, noPage
        }
      );
    },
  });

// ------- End of Po Report API --------------------------------------

// ------- Start of Sales Invoice Report API ------------------------------------

export const useSalesInvoiceReport = (DateStart, DateEnd, customerId, productId, companyId, noPage, pageNumber, pageSize) =>
  useQuery({
    queryKey: [
      "allSalesInvoiceReportsData", DateStart, DateEnd, customerId, productId, companyId, noPage, pageNumber, pageSize,
    ],
    queryFn: () => {
      const formatDate = (date) => date ? new Date(new Date(date).setHours(0, 0, 0, 0)).toISOString().split('T')[0] : "";

      const startDate = formatDate(DateStart ? new Date(new Date(DateStart).setDate(new Date(DateStart).getDate() + 1)) : "");
      const endDate = formatDate(DateEnd ? new Date(new Date(DateEnd).setDate(new Date(DateEnd).getDate() + 1)) : "");

      return makeRequest(
        "GET",
        `${baseUrl}/api/Reports/GetSalesInvoiceReport`,
        undefined,
        {
          startDate, endDate, customerId, productId, companyId, noPage, pageNumber, pageSize
        }
      );
    },
  });

export const useSalesInvoiceReportExport = (DateStart, DateEnd, customerId, productId, companyId, noPage) =>
  useQuery({
    queryKey: [
      "allSalesInvoiceReportExportData", DateStart, DateEnd, customerId, productId, companyId, noPage,
    ],
    queryFn: () => {
      const formatDate = (date) => date ? new Date(new Date(date).setHours(0, 0, 0, 0)).toISOString().split('T')[0] : "";

      const startDate = formatDate(DateStart ? new Date(new Date(DateStart).setDate(new Date(DateStart).getDate() + 1)) : "");
      const endDate = formatDate(DateEnd ? new Date(new Date(DateEnd).setDate(new Date(DateEnd).getDate() + 1)) : "");

      return makeRequest(
        "GET",
        `${baseUrl}/api/Reports/SalesInvoiceReport/ExportToCSV`,
        undefined,
        {
          startDate, endDate, customerId, productId, companyId, noPage
        }
      );
    },
  });

// ------- End of Sales Invoice Report API --------------------------------------

// ------- Start of Payment Outstanding Report API ------------------------------------

export const usePaymentOutstandingReport = (DateStart, DateEnd, customerId, invoiceNo, remarks, companyId, noPage, pageNumber, pageSize) =>
  useQuery({
    queryKey: [
      "allPaymentOutstandingReportsData", DateStart, DateEnd, customerId, invoiceNo, remarks, companyId, noPage, pageNumber, pageSize],
    queryFn: () => {
      const formatDate = (date) => date ? new Date(new Date(date).setHours(0, 0, 0, 0)).toISOString().split('T')[0] : "";

      const startDate = formatDate(DateStart ? new Date(new Date(DateStart).setDate(new Date(DateStart).getDate() + 1)) : "");
      const endDate = formatDate(DateEnd ? new Date(new Date(DateEnd).setDate(new Date(DateEnd).getDate() + 1)) : "");
      // const customerIdString = Array.isArray(customerId) ? customerId.join(',') : customerId;
      return makeRequest(
        "GET",
        `${baseUrl}/api/Reports/GetPaymentOutstandingReport`,
        undefined,
        {
          startDate, endDate, customerId, invoiceNo, remarks, companyId, noPage, pageNumber, pageSize
        }
      );
    },
  });

export const usePaymentOutstandingReportExport = (DateStart, DateEnd, customerId, invoiceNo, remarks, CompanyId, NoPage) =>
  useQuery({
    queryKey: [
      "allPaymentOutstandingReportExportData", DateStart, DateEnd, customerId, invoiceNo, remarks, CompanyId, NoPage],
    queryFn: () => {
      const formatDate = (date) => date ? new Date(new Date(date).setHours(0, 0, 0, 0)).toISOString().split('T')[0] : null;

      const startDate = formatDate(DateStart ? new Date(new Date(DateStart).setDate(new Date(DateStart).getDate() + 1)) : null);
      const endDate = formatDate(DateEnd ? new Date(new Date(DateEnd).setDate(new Date(DateEnd).getDate() + 1)) : null);
      // const customerIdString = Array.isArray(customerId) ? customerId.join(',') : customerId;
      return makeRequest(
        "GET",
        `${baseUrl}/api/Reports/PaymentOutstandingReport/ExportToCSV`,
        undefined,
        {
          startDate, endDate, customerId, invoiceNo, remarks, CompanyId, NoPage: true
        }
      );
    },
  });

// ------- End of Payment Outstanding Report API --------------------------------------

// ------- Start of Expense Summary Report API --------------------------------------
export const useExpenseSummaryReport = (CompanyId, Month, Year, LedgerTypes) =>
  useQuery({
    queryKey: [
      "allExpenseSummaryReportsData", CompanyId, Month, Year, LedgerTypes],
    queryFn: () => {
      // const formatDate = (date) => date ? new Date(new Date(date).setHours(0, 0, 0, 0)).toISOString().split('T')[0] : "";

      return makeRequest(
        "GET",
        `${baseUrl}/api/Reports/GetExpenseSummaryReport`,
        undefined,
        {
          CompanyId, Month, Year, LedgerTypes
        }
      );
    },
  });

export const useExpenseSummaryReportExport = (CompanyId, Month, Year, LedgerTypes) =>
  useQuery({
    queryKey: [
      "allExpenseSummaryReportExportData", CompanyId, Month, Year, LedgerTypes],
    queryFn: () => {
      // const formatDate = (date) => date ? new Date(new Date(date).setHours(0, 0, 0, 0)).toISOString().split('T')[0] : "";

      return makeRequest(
        "GET",
        `${baseUrl}/api/Reports/ExpenseSummaryReport/ExportToCSV`,
        undefined,
        {
          CompanyId, Month, Year, LedgerTypes
        }
      );
    },
  });

// ------- End of Expense Summary Report API ----------------------------------------

// ------- Start of Outward Remittance Report API --------------------------------------
export const useOutwardRemittanceReport = (CompanyId, startDate, endDate, InvoiceNo) =>
  useQuery({
    queryKey: [
      "allOutwardRemittanceReportsData", CompanyId, startDate, endDate, InvoiceNo],
    queryFn: () => {
      const formatDate = (date) => date ? new Date(new Date(date).setHours(0, 0, 0, 0)).toISOString().split('T')[0] : null;

      const FromDate = formatDate(startDate ? new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 1)) : null);
      const ToDate = formatDate(endDate ? new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)) : null);

      return makeRequest(
        "GET",
        `${baseUrl}/api/Reports/GetOutwardRemittanceReport`,
        undefined,
        {
          CompanyId, FromDate, ToDate, InvoiceNo
        }
      );
    },
  });

export const useOutwardRemittanceReportExport = (CompanyId, startDate, endDate, InvoiceNo) =>
  useQuery({
    queryKey: [
      "allOutwardRemittanceReportExportData", CompanyId, startDate, endDate, InvoiceNo],
    queryFn: () => {
      const formatDate = (date) => date ? new Date(new Date(date).setHours(0, 0, 0, 0)).toISOString().split('T')[0] : null;

      const FromDate = formatDate(startDate ? new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 1)) : null);
      const ToDate = formatDate(endDate ? new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)) : null);

      return makeRequest(
        "GET",
        `${baseUrl}/api/Reports/OutwardRemittanceReport/ExportToCSV`,
        undefined,
        {
          CompanyId, FromDate, ToDate, InvoiceNo
        }
      );
    },
  });

// ------- End of Outward Remittance Report API ----------------------------------------
