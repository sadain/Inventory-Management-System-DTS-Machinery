import { useAuth } from "contexts/AuthProvider";

const usePermission = () => {
  const { decodedToken } = useAuth();
  const decodedTokenObj = decodedToken ? JSON.parse(decodedToken) : null;

  const permissionIds = decodedTokenObj?.Permissions?.map((permission) =>
    parseInt(permission)
  );

  const hasPermission = (permissionId) => {
    return permissionIds?.includes(permissionId);
  };

  return { hasPermission };
};

export default usePermission;
