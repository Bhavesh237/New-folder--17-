import React, { createContext, useState, useContext } from "react";

const OrganizationContext = createContext();

export const OrganizationProvider = ({ children }) => {
  const [selectedOrg, setSelectedOrg] = useState(null);

  const switchOrganization = (org) => {
    setSelectedOrg(org);
  };

  return (
    <OrganizationContext.Provider value={{ selectedOrg, switchOrganization }}>
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganizationContext = () => {
  return useContext(OrganizationContext);
};
